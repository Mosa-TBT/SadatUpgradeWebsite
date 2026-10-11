import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import Main from "../src/containers/main/Main.jsx";

vi.mock("ogl", async () => await import("./helpers/oglMock.js"));

describe("Main (hero)", () => {
  it("renders the hero without booting", () => {
    render(<Main booted={false} />);
    expect(
      screen.getByRole("heading", { name: /Say hi to GPT-Bot/ }),
    ).toBeInTheDocument();
    expect(document.querySelector(".hero__aurora")).toBeInTheDocument();
    expect(screen.getByLabelText("Email address")).toBeInTheDocument();
    expect(screen.getByText(/1,600 people/)).toBeInTheDocument();
  });

  it("plays the intro and cycles bubble phrases once booted", async () => {
    const { rerender } = render(<Main booted={false} />);
    rerender(<Main booted={true} />);

    const bubbleText = document.querySelector(".hero__bubble-text");
    await waitFor(
      () => expect(bubbleText.textContent).toBe("Yes, I float. It's faster."),
      { timeout: 12000 },
    );
  });

  it("stays static under reduced motion", () => {
    globalThis.__reducedMotion = true;
    render(<Main booted={true} />);

    // no aurora canvas, bubble keeps its initial phrase
    expect(document.querySelector(".hero__aurora")).not.toBeInTheDocument();
    expect(document.querySelector(".hero__bubble-text").textContent).toBe(
      "Hi, I'm GPT-Bot — your new assistant.",
    );
  });

  it("prevents the email form from submitting", () => {
    render(<Main booted={false} />);
    const form = document.querySelector(".hero__form");
    const event = new Event("submit", { bubbles: true, cancelable: true });
    form.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
  });
});
