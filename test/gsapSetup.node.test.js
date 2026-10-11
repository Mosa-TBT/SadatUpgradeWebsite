// @vitest-environment node
import { describe, it, expect } from "vitest";
import { isReducedMotion } from "../src/lib/gsapSetup.js";

describe("gsapSetup without a window", () => {
  it("isReducedMotion is false when window is undefined", () => {
    expect(isReducedMotion()).toBe(false);
  });
});
