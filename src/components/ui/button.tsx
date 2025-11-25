import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default: "bg-black text-white",
        outline:
          "border border-white/30 bg-transparent text-white hover:border-zinc-200 hover:text-zinc-100",
        gradient: "bg-white text-black",
        none: "bg-transparent text-white hover:text-zinc-100",
      },
      size: {
        default: "px-6 py-2",
        lg: "px-8 py-3 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    children: ReactNode;
  };

export const Button = ({
  className,
  variant,
  size,
  asChild,
  children,
  ...props
}: ButtonProps) => {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {children}
    </Comp>
  );
};
