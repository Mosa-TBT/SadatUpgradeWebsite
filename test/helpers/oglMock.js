import { vi } from "vitest";

// Shared mock for the `ogl` package — jsdom has no WebGL context.
// `state.extension` controls what gl.getExtension returns, so cleanup paths
// with and without WEBGL_lose_context can both be exercised.
export const state = {
  extension: { loseContext: vi.fn() },
  lastProgram: null,
  lastRenderer: null,
};

export class Renderer {
  constructor() {
    const canvas = document.createElement("canvas");
    // jsdom rects are all-zero; mouse math divides by width/height
    canvas.getBoundingClientRect = () => ({
      left: 0,
      top: 0,
      right: 100,
      bottom: 100,
      width: 100,
      height: 100,
    });
    this.gl = {
      canvas,
      clearColor: vi.fn(),
      getExtension: vi.fn(() => state.extension),
    };
    state.lastRenderer = this;
  }
  setSize = vi.fn();
  render = vi.fn();
}

export class Program {
  constructor(gl, options) {
    this.uniforms = options.uniforms;
    state.lastProgram = this;
  }
}

export class Mesh {
  constructor(gl, options) {
    this.geometry = options.geometry;
    this.program = options.program;
  }
}

export class Triangle {}
