import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
// Test config lives in vitest.config.ts
export default defineConfig({
  plugins: [react()],
});
