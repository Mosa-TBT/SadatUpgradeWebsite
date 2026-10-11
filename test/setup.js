import "@testing-library/jest-dom/vitest";
import { afterEach, beforeEach } from "vitest";
import { cleanup } from "@testing-library/react";

// Default fetch stub (jsdom has no fetch). Components that fetch during
// tests (e.g. Team) resolve to an empty/error payload unless overridden.
if (typeof globalThis !== "undefined" && !globalThis.fetch) {
  globalThis.fetch = async () => ({ ok: false, json: async () => ({}) });
}

// jsdom has no matchMedia — single mock for both consumers:
// prefers-reduced-motion is driven by a per-test flag, layout queries
// (min-width: 900px) always match so desktop-only effects run.
// Guarded: the node-environment tests have no window at all.
beforeEach(() => {
  globalThis.__reducedMotion = false;
});

if (typeof window !== "undefined") {
  window.matchMedia = (query) => ({
    matches: query.includes("prefers-reduced-motion")
      ? !!globalThis.__reducedMotion
      : true,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  });

  // jsdom without pretendToBeVisual lacks rAF; gsap's ticker and
  // SoftAurora's render loop both need it.
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = (cb) =>
      setTimeout(() => cb(performance.now()), 16);
    window.cancelAnimationFrame = (id) => clearTimeout(id);
  }
}

afterEach(() => {
  cleanup();
});
