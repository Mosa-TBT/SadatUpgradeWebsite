import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "../src/App.jsx";

describe("App", () => {
  it("renders every section once the preloader reveals", () => {
    globalThis.__reducedMotion = true; // preloader finishes instantly
    render(<App />);

    // preloader unmounted itself
    expect(screen.queryByText("Initializing GPT-Bot")).not.toBeInTheDocument();

    // navbar, hero and footer landmarks
    expect(screen.getByRole("link", { name: "GPT-Bot" })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /Say hi to GPT-Bot/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Request Early Access" }),
    ).toBeInTheDocument();
  });
});
