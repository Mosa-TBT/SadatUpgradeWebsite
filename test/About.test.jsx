import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import About from "../src/containers/about/About";

describe("About", () => {
  it("renders the About Us section with accurate identity content", () => {
    globalThis.__reducedMotion = true;
    render(<About />);

    expect(document.getElementById("about")).toBeTruthy();
    expect(screen.getByText("About Us")).toBeInTheDocument();
    expect(
      screen.getByText(/Sadat Upgrade is an IT services company/i),
    ).toBeInTheDocument();
    expect(screen.getByText("What We Do")).toBeInTheDocument();
    expect(screen.getByText("How We Work")).toBeInTheDocument();
    expect(screen.getByText("What Drives Us")).toBeInTheDocument();
  });
});