"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

interface ContactFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  service: string;
  budget: string;
  message: string;
  website: string;
}

const EMPTY: ContactFormValues = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  company: "",
  service: "",
  budget: "",
  message: "",
  website: "",
};

interface StatusState {
  type: "" | "success" | "error";
  message: string;
}

export function ContactForm() {
  const [values, setValues] = useState<ContactFormValues>(EMPTY);
  const [status, setStatus] = useState<StatusState>({ type: "", message: "" });
  const [sending, setSending] = useState(false);

  const set = (key: keyof ContactFormValues, value: string): void =>
    setValues((prev) => ({ ...prev, [key]: value }));

  const submit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (sending) return;

    setSending(true);
    setStatus({ type: "", message: "" });

    try {
      const res = await fetch("/contact-submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(values),
      });
      const data = (await res.json().catch(() => null)) as {
        ok?: boolean;
        error?: string;
        errors?: Record<string, string[]>;
        emailSent?: boolean;
        persisted?: boolean;
      } | null;

      if (res.ok && data?.ok) {
        setValues(EMPTY);
        setStatus({
          type: "success",
          message:
            data.emailSent === true
              ? "Thank you! Your message has been sent. We'll get back to you within 24 hours."
              : data.persisted === true
                ? "Thank you! We received your message and will reply to you within 24 hours."
                : "Thank you! Your message has been recorded.",
        });
      } else {
        const firstError = data?.errors
          ? Object.values(data.errors)[0]?.[0]
          : data?.error || "Something went wrong. Please try again.";
        setStatus({ type: "error", message: firstError ?? "Something went wrong." });
      }
    } catch {
      setStatus({
        type: "error",
        message: "Unable to reach the server. Please check your connection and try again.",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="firstName" className="text-sm font-medium">
            First Name
          </label>
          <Input
            id="firstName"
            placeholder="John"
            value={values.firstName}
            onChange={(e) => set("firstName", e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="lastName" className="text-sm font-medium">
            Last Name
          </label>
          <Input
            id="lastName"
            placeholder="Doe"
            value={values.lastName}
            onChange={(e) => set("lastName", e.target.value)}
            required
          />
        </div>
      </div>
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <Input
          id="email"
          type="email"
          placeholder="john@example.com"
          value={values.email}
          onChange={(e) => set("email", e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="phone" className="text-sm font-medium">
          Phone (Optional)
        </label>
        <Input
          id="phone"
          type="tel"
          placeholder="+93 ..."
          value={values.phone}
          onChange={(e) => set("phone", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="company" className="text-sm font-medium">
          Company
        </label>
        <Input
          id="company"
          placeholder="Your Company Name"
          value={values.company}
          onChange={(e) => set("company", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="service" className="text-sm font-medium">
          Service Interested In
        </label>
        <select
          id="service"
          value={values.service}
          onChange={(e) => set("service", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select a service</option>
          <option>Web Development</option>
          <option>Mobile App Development</option>
          <option>UI/UX Design</option>
          <option>Digital Marketing</option>
          <option>E-commerce Solutions</option>
          <option>Analytics & Insights</option>
        </select>
      </div>
      <div className="space-y-2">
        <label htmlFor="budget" className="text-sm font-medium">
          Project Budget
        </label>
        <select
          id="budget"
          value={values.budget}
          onChange={(e) => set("budget", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select budget range</option>
          <option>$5,000 - $10,000</option>
          <option>$10,000 - $25,000</option>
          <option>$25,000 - $50,000</option>
          <option>$50,000+</option>
        </select>
      </div>
      <div className="space-y-2">
        <label htmlFor="message" className="text-sm font-medium">
          Project Details
        </label>
        <Textarea
          id="message"
          placeholder="Tell us about your project, goals, and any specific requirements..."
          rows={4}
          value={values.message}
          onChange={(e) => set("message", e.target.value)}
          required
        />
      </div>

      {/* Honeypot — invisible to humans, catches bots. */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
        onChange={(e) => set("website", e.target.value)}
        value={values.website}
      />

      {status.message && (
        <p
          role="status"
          className={`flex items-start gap-2 rounded-lg px-3 py-2 text-sm ${
            status.type === "success"
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {status.type === "success" ? (
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          ) : (
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          )}
          {status.message}
        </p>
      )}

      <Button type="submit" disabled={sending} className="w-full bg-blue-600 hover:bg-blue-700 py-5 disabled:opacity-60">
        {sending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Sending...
          </>
        ) : (
          <>
            Send Message
            <Send className="h-4 w-4" />
          </>
        )}
      </Button>
    </form>
  );
}

export default ContactForm;