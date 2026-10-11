import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Navbar from "../src/components/navbar/Navbar.jsx";

// Capture the ScrollTrigger config so its onUpdate can be driven by hand —
// jsdom never really scrolls.
const { stCreate, stKill } = vi.hoisted(() => ({
  stCreate: vi.fn(),
  stKill: vi.fn(),
}));

vi.mock("../src/lib/gsapSetup.js", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    ScrollTrigger: {
      ...actual.ScrollTrigger,
      create: (config) => {
        stCreate(config);
        return { kill: stKill };
      },
    },
  };
});

const openMenu = (container) =>
  fireEvent.click(container.querySelector(".navbar__toggle svg"));

describe("Navbar", () => {
  beforeEach(() => {
    stCreate.mockClear();
    stKill.mockClear();
  });

  it("renders links and sign actions", () => {
    render(<Navbar />);
    expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument();
    expect(screen.getByText("Sign in")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Sign up" }),
    ).toBeInTheDocument();
    expect(stCreate).toHaveBeenCalledOnce();
  });

  it("hides on scroll down and reveals otherwise", () => {
    render(<Navbar />);
    const { onUpdate } = stCreate.mock.calls[0][0];

    onUpdate({ direction: 1, scroll: () => 200 }); // down, past threshold
    onUpdate({ direction: 1, scroll: () => 50 }); // down, below threshold
    onUpdate({ direction: -1, scroll: () => 300 }); // up
  });

  it("toggles the mobile menu open and closed", () => {
    const { container } = render(<Navbar />);

    openMenu(container);
    const mobile = container.querySelector(".navbar__mobile");
    expect(mobile).toBeInTheDocument();

    // close icon closes
    fireEvent.click(container.querySelector(".navbar__toggle svg"));
    expect(container.querySelector(".navbar__mobile")).not.toBeInTheDocument();

    // clicking the menu panel also closes
    openMenu(container);
    fireEvent.click(container.querySelector(".navbar__mobile > div"));
    expect(container.querySelector(".navbar__mobile")).not.toBeInTheDocument();
  });

  it("skips scroll and menu effects under reduced motion", () => {
    globalThis.__reducedMotion = true;
    const { container } = render(<Navbar />);

    expect(stCreate).not.toHaveBeenCalled();
    openMenu(container);
    expect(container.querySelector(".navbar__mobile")).toBeInTheDocument();
  });

  it("kills the ScrollTrigger on unmount", () => {
    const { unmount } = render(<Navbar />);
    unmount();
    expect(stKill).toHaveBeenCalledOnce();
  });
});
