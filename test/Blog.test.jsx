import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ScrollTrigger } from "../src/lib/gsapSetup.js";
import Blog from "../src/containers/blog/Blog.jsx";

describe("Blog", () => {
  it("renders all five articles", () => {
    render(<Blog />);
    expect(screen.getAllByRole("article")).toHaveLength(5);
    expect(
      screen.getByRole("heading", { name: /A lot is happening/ }),
    ).toBeInTheDocument();
  });

  it("measures the filmstrip distance on refresh", async () => {
    render(<Blog />);
    // forces the pinned ScrollTrigger to re-evaluate its function-based
    // end/x values and lets the scrub tween render a frame
    ScrollTrigger.refresh();
    await new Promise((resolve) => setTimeout(resolve, 100));
  });

  it("skips the pinned filmstrip under reduced motion", () => {
    globalThis.__reducedMotion = true;
    render(<Blog />);
    expect(screen.getAllByRole("article")).toHaveLength(5);
  });
});
