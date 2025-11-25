import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from "react";
import airJordanLogo from "./assets/air-jordan.svg";
import { Button } from "./components/ui/button";

type SpinOutcome = "win" | "lose";

type WheelSegment = {
  outcome: SpinOutcome;
  color: string;
};

const wheelSegments: WheelSegment[] = [
  { outcome: "win", color: "#CE1126" },
  { outcome: "lose", color: "black" },
  { outcome: "win", color: "#5B6146" },
  { outcome: "lose", color: "#CE1126" },
  { outcome: "win", color: "black" },
  { outcome: "lose", color: "#5B6146" },
  { outcome: "win", color: "black" },
  { outcome: "lose", color: "#5B6146" },
];

const spinDurationMs = 3200;
const extraRotations = 5;
const segmentAngle = 360 / wheelSegments.length;

const resultCopy: Record<SpinOutcome, { title: string; accent: string }> = {
  win: {
    title: "당첨",
    accent: "text-zinc-100",
  },
  lose: {
    title: "미당첨",
    accent: "text-zinc-400",
  },
};

const jumpmanMaskStyle: CSSProperties = {
  WebkitMaskImage: `url(${airJordanLogo})`,
  maskImage: `url(${airJordanLogo})`,
  maskRepeat: "no-repeat",
  maskPosition: "center",
  maskSize: "contain",
};

const JumpmanBadge = () => (
  <div className="relative flex h-16 w-16 items-center justify-center rounded-full ">
    <span
      aria-hidden
      className="block h-10 w-10"
      style={{ ...jumpmanMaskStyle, backgroundColor: "black" }}
    />
  </div>
);

const App = () => {
  const [rotationDeg, setRotationDeg] = useState(0);
  const [idleRotation, setIdleRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [hasSpun, setHasSpun] = useState(false);
  const [shouldAnimateWheel, setShouldAnimateWheel] = useState(true);
  const [result, setResult] = useState<SpinOutcome | null>(null);
  const timeoutIdRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const wheelBackground = useMemo(() => {
    const stops = wheelSegments.map((segment, index) => {
      const start = index * segmentAngle;
      const end = start + segmentAngle;
      return `${segment.color} ${start}deg ${end}deg`;
    });

    return `conic-gradient(${stops.join(",")})`;
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutIdRef.current) {
        window.clearTimeout(timeoutIdRef.current);
      }
      if (animationFrameRef.current) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isSpinning || !hasSpun) {
      return;
    }

    let frameId: number;

    const animate = () => {
      setIdleRotation((prev) => (prev + 0.2) % 360);
      frameId = window.requestAnimationFrame(animate);
    };

    frameId = window.requestAnimationFrame(animate);

    return () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, [isSpinning, hasSpun]);

  const clearExistingTimer = () => {
    if (!timeoutIdRef.current) {
      return;
    }

    window.clearTimeout(timeoutIdRef.current);
    timeoutIdRef.current = null;
  };

  const handleSpin = () => {
    if (isSpinning) {
      return;
    }

    clearExistingTimer();
    const nextSegmentIndex = Math.floor(Math.random() * wheelSegments.length);
    const nextSegment = wheelSegments[nextSegmentIndex];
    const pointerOffset = segmentAngle / 2;
    const targetAngle = 360 - (nextSegmentIndex * segmentAngle + pointerOffset);
    const microJitter = (Math.random() - 0.5) * 6;
    const totalRotation = extraRotations * 360 + targetAngle + microJitter;

    setIsSpinning(true);
    setHasSpun(true);
    setShouldAnimateWheel(true);
    setResult(null);
    setIdleRotation(0);
    setRotationDeg((currentRotation) => currentRotation + totalRotation);

    timeoutIdRef.current = window.setTimeout(() => {
      setIsSpinning(false);
      setResult(nextSegment.outcome);
      timeoutIdRef.current = null;
    }, spinDurationMs);
  };

  const handleReset = () => {
    clearExistingTimer();
    setIsSpinning(false);
    setResult(null);
    setShouldAnimateWheel(false);
    setRotationDeg(0);
    setIdleRotation(0);
    setHasSpun(false);

    if (animationFrameRef.current) {
      window.cancelAnimationFrame(animationFrameRef.current);
    }
    animationFrameRef.current = window.requestAnimationFrame(() => {
      setShouldAnimateWheel(true);
    });
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }
    event.preventDefault();
    handleSpin();
  };

  const activeResultCopy = result ? resultCopy[result] : null;
  const animatedTransition = isSpinning
    ? `${spinDurationMs}ms cubic-bezier(0.19, 1, 0.22, 1)`
    : "500ms ease-out";
  const wheelTransition = shouldAnimateWheel ? animatedTransition : "none";
  const wheelRotation = rotationDeg + idleRotation;

  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-center bg-[white] from-black via-zinc-950 to-black px-4 py-16 text-white">
      <div className="w-full space-y-10 text-center">
        <header>
          <h1 className="text-2xl font-bold text-black">나이키 Jordan 룰렛</h1>
        </header>
        <section className="relative flex flex-col items-center gap-6">
          <div className="relative flex flex-col items-center">
            <div
              className="pointer-events-none absolute inset-0 h-[24rem] rounded-full bg-gradient-to-b from-white/10 via-transparent to-transparent blur-3xl "
              aria-hidden
            />
            <div className="relative flex h-72 w-72 items-center justify-center md:h-80 md:w-80">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 flex h-full w-full items-center justify-center rounded-full border border-white/10 shadow-glow"
                style={{
                  backgroundImage: wheelBackground,
                  transform: `rotate(${wheelRotation}deg)`,
                  transition: `transform ${wheelTransition}`,
                }}
              >
                {/* <div className="absolute inset-4 rounded-full border border-white/20 bg-black/40 backdrop-blur-sm"></div> */}
                {/* <div
                  aria-hidden
                  className="absolute inset-11 rounded-full bg-gradient-to-br from-white/15 to-zinc-500/15"
                ></div> */}
                {/* <div className="absolute inset-16 flex items-center justify-center">
                  <span
                    aria-hidden
                    className="h-28 w-20 bg-white/10"
                    style={jumpmanMaskStyle}
                  ></span>
                </div> */}
              </div>
              <Button
                type="button"
                variant="default"
                size="lg"
                className="relative z-10 flex h-28 w-28 flex-col items-center justify-center gap-1 rounded-full bg-[white] text-lg text-zinc-900 shadow-xl transition hover:scale-105 focus-visible:ring-white/70 "
                onClick={handleSpin}
                onKeyDown={handleKeyDown}
                aria-label="룰렛 돌리기"
                tabIndex={0}
                disabled={isSpinning}
                aria-busy={isSpinning}
              >
                <div
                  className="absolute -top-4 left-1/2 -translate-x-1/2"
                  style={{
                    width: 0,
                    height: 0,
                    borderLeft: "20px solid transparent",
                    borderRight: "20px solid transparent",
                    borderBottom: "32px solid white",
                  }}
                />
                <JumpmanBadge />
              </Button>
            </div>
          </div>
          <p className="text-base text-zinc-400 font-bold">
            {isSpinning ? "" : "클릭 결과를 확인해 보세요."}
          </p>
        </section>
      </div>
      {result && activeResultCopy && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-[white] px-4 py-6 ">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="result-heading"
            className="relative w-full max-w-md space-y-5 rounded-xl border border-zinc-100 bg-white p-6 text-left shadow-xl"
          >
            <p className="text-xl font-semibold text-black text-center">
              {result === "win" ? "당첨" : "미당첨"}
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button
                type="button"
                variant="default"
                size="lg"
                className="w-full"
                onClick={handleReset}
              >
                확인
              </Button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
};

export default App;
