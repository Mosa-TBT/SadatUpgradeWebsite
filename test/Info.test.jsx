import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Info from "../src/containers/info/Info.jsx";

describe("Info", () => {
  it("renders the intro and three cards", () => {
    globalThis.__reducedMotion = true; // reveals would hide targets at t=0
    render(<Info />);
    expect(
      screen.getByRole("heading", {
        name: /The possibilities are beyond your imagination/,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("Natural Conversation")).toBeInTheDocument();
    expect(screen.getByText("Floating Knowledge Base")).toBeInTheDocument();
    expect(screen.getByText("Patient Tutor")).toBeInTheDocument();
  });
});
