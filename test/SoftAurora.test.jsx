import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render } from "@testing-library/react";
import { state } from "./helpers/oglMock.js";
import SoftAurora from "../src/components/ui/SoftAurora.tsx";

// ogl is mocked; requestAnimationFrame is captured so frames can be stepped
// deterministically instead of waiting on real time.
vi.mock("ogl", async () => await import("./helpers/oglMock.js"));

let rafQueue;
let rafId;

const stepFrames = (count, time = 1000) => {
  for (let i = 0; i < count; i += 1) {
    const cb = rafQueue.shift();
    if (!cb) return;
    cb(time + i * 16);
  }
};

beforeEach(() => {
  rafQueue = [];
  rafId = 0;
  state.extension = { loseContext: vi.fn() };
  vi.stubGlobal("requestAnimationFrame", (cb) => {
    rafQueue.push(cb);
    rafId += 1;
    return rafId;
  });
  vi.stubGlobal("cancelAnimationFrame", vi.fn());
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("SoftAurora", () => {
  it("mounts a canvas and renders frames with default props", () => {
    const { container, unmount } = render(<SoftAurora />);
    const canvas = container.querySelector("canvas");
    expect(canvas).toBeInTheDocument();

    const { uniforms } = state.lastProgram;
    expect(uniforms.uSpeed.value).toBe(0.6);
    expect(uniforms.uColor1.value).toEqual([247 / 255, 247 / 255, 247 / 255]);
    expect(uniforms.uEnableMouse.value).toBe(true);

    stepFrames(3);
    expect(uniforms.uTime.value).toBeGreaterThan(0);
    expect(state.lastRenderer.render).toHaveBeenCalled();

    unmount();
    expect(container.querySelector("canvas")).not.toBeInTheDocument();
    expect(state.extension.loseContext).toHaveBeenCalled();
    expect(cancelAnimationFrame).toHaveBeenCalled();
  });

  it("maps custom props into uniforms", () => {
    render(
      <SoftAurora
        speed={2}
        color1="#ff0000"
        color2="#00ff00"
        enableMouseInteraction={false}
      />,
    );
    const { uniforms } = state.lastProgram;
    expect(uniforms.uSpeed.value).toBe(2);
    expect(uniforms.uColor1.value).toEqual([1, 0, 0]);
    expect(uniforms.uColor2.value).toEqual([0, 1, 0]);
    expect(uniforms.uEnableMouse.value).toBe(false);
  });

  it("tracks the mouse and recenters on mouseleave", () => {
    render(<SoftAurora mouseInfluence={0.5} />);
    const { uniforms } = state.lastProgram;

    window.dispatchEvent(
      new MouseEvent("mousemove", { clientX: 10, clientY: 10 }),
    );
    stepFrames(2);
    expect(uniforms.uMouse.value[0]).toBeLessThan(0.5);

    document.documentElement.dispatchEvent(new Event("mouseleave"));
    stepFrames(200);
    expect(uniforms.uMouse.value[0]).toBeCloseTo(0.5, 3);
  });

  it("pins the mouse to center when interaction is disabled", () => {
    render(<SoftAurora enableMouseInteraction={false} />);
    const { uniforms } = state.lastProgram;
    stepFrames(2);
    expect([...uniforms.uMouse.value]).toEqual([0.5, 0.5]);
  });

  it("updates the resolution uniform on resize", () => {
    render(<SoftAurora />);
    const { uniforms } = state.lastProgram;
    window.dispatchEvent(new Event("resize"));
    expect(state.lastRenderer.setSize).toHaveBeenCalled();
    expect(uniforms.uResolution.value).toHaveLength(3);
  });

  it("cleans up safely without WEBGL_lose_context", () => {
    state.extension = null;
    const { unmount } = render(<SoftAurora />);
    expect(() => unmount()).not.toThrow();
  });
});
