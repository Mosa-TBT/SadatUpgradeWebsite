import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Features from "../src/containers/features/Features.jsx";

describe("Features", () => {
  it("renders the four feature cards", () => {
    render(<Features />);
    expect(document.querySelectorAll(".features__card")).toHaveLength(4);
    expect(
      screen.getByRole("heading", { name: /The Future is Now/ }),
    ).toBeInTheDocument();
  });

  it("tracks the cursor glow on cards", () => {
    render(<Features />);
    const card = document.querySelector(".features__card");
    fireEvent.mouseMove(card, { clientX: 12, clientY: 8 });
    expect(card.style.getPropertyValue("--mx")).toBe("12px");
    expect(card.style.getPropertyValue("--my")).toBe("8px");
  });
});
