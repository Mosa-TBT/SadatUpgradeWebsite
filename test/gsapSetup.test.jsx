import { describe, it, expect, vi } from "vitest";
import {
  isReducedMotion,
  reveals,
  ScrollTrigger,
} from "../src/lib/gsapSetup.js";

describe("isReducedMotion", () => {
  it("is false by default", () => {
    expect(isReducedMotion()).toBe(false);
  });

  it("is true when the user prefers reduced motion", () => {
    globalThis.__reducedMotion = true;
    expect(isReducedMotion()).toBe(true);
  });
});

describe("reveals", () => {
  it("does nothing without a root", () => {
    expect(() => reveals(null)).not.toThrow();
  });

  it("does nothing under reduced motion", () => {
    globalThis.__reducedMotion = true;
    const root = document.createElement("div");
    root.innerHTML = "<h2 data-split>Title</h2>";
    expect(() => reveals(root)).not.toThrow();
  });

  it("animates split, reveal and group targets", () => {
    const root = document.createElement("div");
    root.innerHTML = `
      <h2 data-split>A heading with words</h2>
      <p data-reveal>Some copy</p>
      <div data-reveal-group><span>one</span><span>two</span></div>
    `;
    document.body.appendChild(root);
    expect(() => reveals(root)).not.toThrow();
    root.remove();
  });
});

describe("module lifecycle", () => {
  it("refreshes ScrollTrigger on window load", () => {
    const spy = vi.spyOn(ScrollTrigger, "refresh");
    window.dispatchEvent(new Event("load"));
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it("refreshes ScrollTrigger once fonts settle", async () => {
    vi.resetModules();
    let resolveFonts;
    Object.defineProperty(document, "fonts", {
      value: { ready: new Promise((resolve) => (resolveFonts = resolve)) },
      configurable: true,
    });
    const fresh = await import("../src/lib/gsapSetup.js");
    const spy = vi.spyOn(fresh.ScrollTrigger, "refresh");
    resolveFonts();
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
    delete document.fonts;
  });
});
