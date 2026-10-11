import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ContactUs from "../src/containers/contact/ContactUs";

function fillValid() {
  fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Jane Doe" } });
  fireEvent.change(screen.getByLabelText("Email Address"), { target: { value: "jane@example.com" } });
  fireEvent.change(screen.getByLabelText("Subject"), { target: { value: "Project inquiry" } });
  fireEvent.change(screen.getByLabelText("Message"), { target: { value: "Hello, we would like to talk about a new website." } });
}

describe("ContactUs", () => {
  beforeEach(() => {
    globalThis.fetch = vi.fn();
  });

  it("renders the contact form section and required fields", () => {
    globalThis.__reducedMotion = true;
    render(<ContactUs />);
    expect(document.getElementById("contact")).toBeTruthy();
    for (const label of ["Name", "Email Address", "Subject", "Message"]) {
      expect(screen.getByLabelText(label)).toBeInTheDocument();
    }
    expect(screen.getByRole("button", { name: "Send Message" })).toBeInTheDocument();
  });

  it("rejects invalid email locally before sending", () => {
    globalThis.__reducedMotion = true;
    render(<ContactUs />);
    fillValid();
    fireEvent.change(screen.getByLabelText("Email Address"), { target: { value: "nope" } });
    fireEvent.click(screen.getByRole("button", { name: "Send Message" }));
    expect(screen.getByText(/valid email address/i)).toBeInTheDocument();
    expect(globalThis.fetch).not.toHaveBeenCalled();
  });

  it("shows success only when the backend accepts the message", async () => {
    globalThis.__reducedMotion = true;
    globalThis.fetch = vi.fn(async () => ({
      ok: true,
      status: 201,
      json: async () => ({ success: true, message: "OK", data: null }),
    }));
    render(<ContactUs />);
    fillValid();
    fireEvent.click(screen.getByRole("button", { name: "Send Message" }));

    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
    const url = globalThis.fetch.mock.calls[0][0];
    expect(url).toContain("/public/contact");

    const success = await screen.findByText(/received by our team/i);
    expect(success).toBeInTheDocument();
  });

  it("surfaces server validation errors without faking success", async () => {
    globalThis.__reducedMotion = true;
    globalThis.fetch = vi.fn(async () => ({
      ok: false,
      status: 422,
      json: async () => ({ success: false, errors: { message: ["The message field is required."] } }),
    }));
    render(<ContactUs />);
    fillValid();
    fireEvent.click(screen.getByRole("button", { name: "Send Message" }));
    const error = await screen.findByText(/The message field is required/i);
    expect(error).toBeInTheDocument();
    expect(screen.queryByText(/received by our team/i)).not.toBeInTheDocument();
  });

  it("does not call the backend when the honeypot is filled", () => {
    globalThis.__reducedMotion = true;
    render(<ContactUs />);
    fillValid();
    fireEvent.change(screen.getByLabelText("Website"), { target: { value: "http://spam.example" } });
    fireEvent.click(screen.getByRole("button", { name: "Send Message" }));
    expect(globalThis.fetch).not.toHaveBeenCalled();
  });
});