import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Article from "../src/components/article/Article.jsx";
import Feature from "../src/components/feature/Feature.jsx";

describe("Article", () => {
  it("renders image, date and title", () => {
    render(<Article imgUrl="/img.webp" date="2026-07-08" title="Hello bot" />);
    expect(screen.getByRole("img", { name: "Hello bot" })).toHaveAttribute(
      "src",
      "/img.webp",
    );
    expect(screen.getByText("2026-07-08")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Hello bot" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Read Full Article/)).toBeInTheDocument();
  });
});

describe("Feature", () => {
  it("renders title and text", () => {
    render(<Feature title="Floats" text="He really does." />);
    expect(screen.getByRole("heading", { name: "Floats" })).toBeInTheDocument();
    expect(screen.getByText("He really does.")).toBeInTheDocument();
  });
});
