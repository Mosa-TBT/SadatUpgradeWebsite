import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Services from "../src/containers/services/Services";

describe("Services", () => {
  it("renders the Our Services section with the key service cards", () => {
    globalThis.__reducedMotion = true;
    render(<Services />);

    expect(document.getElementById("services")).toBeTruthy();
    expect(screen.getByText("Our Services")).toBeInTheDocument();
    expect(screen.getByText("Web Development")).toBeInTheDocument();
    expect(screen.getByText("Mobile App Development")).toBeInTheDocument();
    expect(screen.getByText("UI/UX Design")).toBeInTheDocument();
    expect(screen.getByText("Digital Marketing")).toBeInTheDocument();
  });
});