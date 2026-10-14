import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Team from "../src/containers/team/Team";

describe("Team", () => {
  it("renders exactly three members as cards in the team section", () => {
    globalThis.__reducedMotion = true;
    render(<Team />);

    expect(document.getElementById("team")).toBeTruthy();
    const cards = screen.getAllByRole("button", { name: /profile/i });
    expect(cards).toHaveLength(3);
    expect(screen.getByText("Sayeed Najmuldin Sadat")).toBeInTheDocument();
    expect(screen.getByText("Mosa Barekzai")).toBeInTheDocument();
    expect(screen.getByText("Sediqullah Sediqi")).toBeInTheDocument();
    expect(screen.getByText("Manager")).toBeInTheDocument();
  });

  it("opens a modal for a member and closes via Escape", () => {
    globalThis.__reducedMotion = true;
    render(<Team />);

    fireEvent.click(screen.getByRole("button", { name: /Open Sayeed Najmuldin Sadat profile/i }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText(/As the manager of Sadat Upgrade/)).toBeInTheDocument();

    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("shows Sediqullah's portfolio link only in his profile", () => {
    globalThis.__reducedMotion = true;
    render(<Team />);

    fireEvent.click(screen.getByRole("button", { name: /Open Sediqullah Sediqi profile/i }));
    const link = screen.getByRole("link", { name: /View Portfolio/i });
    expect(link).toHaveAttribute("href", "https://sediqullah-portfolio.vercel.app");
    expect(link).toHaveAttribute("target", "_blank");
  });
});