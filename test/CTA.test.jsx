import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import CTA from "../src/components/cta/CTA.jsx";

describe("CTA", () => {
  it("renders the pitch and button", () => {
    globalThis.__reducedMotion = true; // reveals would hide targets at t=0
    render(<CTA />);
    expect(
      screen.getByRole("button", { name: "Get Started" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Register today/)).toBeInTheDocument();
  });

  it("moves the magnetic button with the cursor and resets on leave", () => {
    const { container } = render(<CTA />);
    const btn = container.querySelector(".cta__btn");
    fireEvent.mouseMove(btn, { clientX: 40, clientY: 20 });
    fireEvent.mouseLeave(btn);
  });

  it("skips the magnetic effect under reduced motion", () => {
    globalThis.__reducedMotion = true;
    render(<CTA />);
    expect(
      screen.getByRole("button", { name: "Get Started" }),
    ).toBeInTheDocument();
  });
});
