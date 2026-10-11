import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import Preloader from "../src/components/preloader/Preloader.jsx";

describe("Preloader", () => {
  it("reveals immediately under reduced motion", () => {
    globalThis.__reducedMotion = true;
    const onReveal = vi.fn();
    const { container } = render(<Preloader onReveal={onReveal} />);

    expect(onReveal).toHaveBeenCalledOnce();
    expect(container).toBeEmptyDOMElement();
  });

  it("runs the count-up timeline, reveals, then unmounts", async () => {
    const onReveal = vi.fn();
    const { container } = render(<Preloader onReveal={onReveal} />);

    expect(screen.getByText("Initializing GPT-Bot")).toBeInTheDocument();

    // counter ticks up from 000
    await waitFor(() =>
      expect(
        container.querySelector(".preloader__count").textContent,
      ).not.toBe("000"),
    );

    // curtain lifts at t=2s, timeline completes shortly after
    await waitFor(() => expect(onReveal).toHaveBeenCalledOnce(), {
      timeout: 8000,
    });
    await waitFor(() => expect(container).toBeEmptyDOMElement(), {
      timeout: 8000,
    });
  });
});
