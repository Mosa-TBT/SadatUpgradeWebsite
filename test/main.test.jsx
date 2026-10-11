import { describe, it, expect, vi } from "vitest";

const { createRoot, renderRoot } = vi.hoisted(() => ({
  createRoot: vi.fn(),
  renderRoot: vi.fn(),
}));

vi.mock("react-dom/client", () => ({
  default: { createRoot: (...args) => createRoot(...args) },
}));

describe("main entry", () => {
  it("mounts App into #root", async () => {
    createRoot.mockReturnValue({ render: renderRoot });
    document.body.innerHTML = '<div id="root"></div>';

    await import("../src/main.jsx");

    expect(createRoot).toHaveBeenCalledWith(document.getElementById("root"));
    expect(renderRoot).toHaveBeenCalledOnce();
  });
});
