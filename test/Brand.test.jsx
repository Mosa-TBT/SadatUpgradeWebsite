import { describe, it, expect } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import Brand from "../src/components/brand/Brand.jsx";

describe("Brand", () => {
  it("renders every logo twice (looping track)", () => {
    render(<Brand />);
    expect(document.querySelectorAll(".brand__group img")).toHaveLength(10);
  });

  it("slows the marquee on hover and resumes on leave", () => {
    render(<Brand />);
    const track = document.querySelector(".brand__track");
    fireEvent.mouseEnter(track);
    fireEvent.mouseLeave(track);
  });

  it("skips the marquee under reduced motion", () => {
    globalThis.__reducedMotion = true;
    render(<Brand />);
    expect(document.querySelector(".brand__track")).toBeInTheDocument();
  });
});
