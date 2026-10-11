import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Footer from "../src/containers/footer/Footer.jsx";

describe("Footer", () => {
  it("renders heading, links and wordmark", () => {
    globalThis.__reducedMotion = true; // reveals would hide targets at t=0
    render(<Footer />);
    expect(
      screen.getByRole("heading", {
        name: /Do you want to step in to the future/,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Request Early Access" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Careers")).toBeInTheDocument();
  });
});
