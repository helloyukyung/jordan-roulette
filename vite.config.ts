import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
  ],
  server: {
    host: "0.0.0.0", // 🔥 모든 IP에서 접근 가능하게
    port: 5173, // 안 써도 기본 5173이긴 한데 명시해 둬도 됨
  },
});
