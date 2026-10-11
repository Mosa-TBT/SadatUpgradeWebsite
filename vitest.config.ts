import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./test/setup.js"],
    testTimeout: 15000,
    coverage: {
      provider: "v8",
      // json-summary is what the studio parses; lcov/text are for humans
      reporter: ["json-summary", "text", "lcov"],
      include: ["src/**/*.{js,jsx,ts,tsx}"],
    },
  },
});
