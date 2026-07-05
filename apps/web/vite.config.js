import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/setupTests.js",
    css: false,
    coverage: {
      provider: "v8",
      include: ["src/**/*.{js,jsx}"],
      exclude: [
        "src/main.jsx",
        "src/data/**",
        "src/setupTests.js",
        "src/**/*.test.{js,jsx}"
      ],
      thresholds: {
        statements: 80,
        branches: 80,
        functions: 80,
        lines: 80
      }
    }
  }
});
