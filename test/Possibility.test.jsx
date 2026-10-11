import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Possibility from "../src/containers/possibility/Possibility.jsx";

describe("Possibility", () => {
  it("renders the visual and copy", () => {
    render(<Possibility />);
    expect(
      screen.getByRole("img", { name: "Exploring the world with GPT-Bot" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /He floats/ }),
    ).toBeInTheDocument();
  });

  it("skips the parallax under reduced motion", () => {
    globalThis.__reducedMotion = true;
    render(<Possibility />);
    expect(
      screen.getByRole("img", { name: "Exploring the world with GPT-Bot" }),
    ).toBeInTheDocument();
  });
});
