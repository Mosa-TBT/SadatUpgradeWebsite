import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import App from "../src/App.jsx";

describe("navbar anchor navigation", () => {
  it("provides unique services/about targets and matching navbar links", () => {
    globalThis.__reducedMotion = true;
    render(<App />);

    // The two new sections exist with stable, unique ids.
    expect(document.getElementById("services")).toBeTruthy();
    expect(document.getElementById("about")).toBeTruthy();
    expect(document.querySelectorAll('[id="services"]')).toHaveLength(1);
    expect(document.querySelectorAll('[id="about"]')).toHaveLength(1);

    // The navbar links point at those exact ids.
    expect(document.querySelector('.navbar a[href="#services"]')).toBeTruthy();
    expect(document.querySelector('.navbar a[href="#about"]')).toBeTruthy();
  });
});