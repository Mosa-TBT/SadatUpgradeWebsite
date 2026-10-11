import { useRef, useState } from "react";
import { useGSAP, reveals } from "../../lib/gsapSetup";
import "./ContactUs.css";

const API_BASE = import.meta.env?.VITE_API_URL || "/api";

const EMPTY = {
  name: "",
  email: "",
  subject: "",
  message: "",
  website: "",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function firstError(errors) {
  if (!errors || typeof errors !== "object") return null;
  const values = Object.values(errors);
  return values && values.length ? String(Array.isArray(values[0]) ? values[0][0] : values[0]) : null;
}

export default function ContactUs() {
  const scope = useRef(null);
  const [values, setValues] = useState(EMPTY);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [sending, setSending] = useState(false);

  useGSAP(() => reveals(scope.current), { scope });

  const set = (key, value) => setValues((prev) => ({ ...prev, [key]: value }));

  const submit = async (e) => {
    e.preventDefault();
    if (sending) return;

    const name = values.name.trim();
    const email = values.email.trim();
    const subject = values.subject.trim();
    const message = values.message.trim();

    if (!name || !email || !subject || !message) {
      setStatus({ type: "error", message: "Please complete all required fields." });
      return;
    }
    if (!EMAIL_RE.test(email)) {
      setStatus({ type: "error", message: "Please enter a valid email address." });
      return;
    }

    // Honeypot: bots fill the hidden field; quietly accept and do nothing.
    if (values.website) {
      setStatus({ type: "", message: "" });
      setValues(EMPTY);
      return;
    }

    setSending(true);
    setStatus({ type: "", message: "" });

    try {
      const res = await fetch(`${API_BASE}/public/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          first_name: name.slice(0, 120),
          last_name: "",
          email: email.slice(0, 255),
          company: "",
          service: subject.slice(0, 120),
          budget: "",
          message: message.slice(0, 5000),
          website: values.website,
        }),
      });
      const data = await res.json().catch(() => null);
      if (res.ok && data && data.success === true) {
        setValues(EMPTY);
        setStatus({
          type: "success",
          message: "Thank you! Your message has been received by our team.",
        });
        return;
      }
      const detail = firstError(data?.errors) || data?.message || data?.error;
      setStatus({
        type: "error",
        message:
          detail ||
          (res.status === 429
            ? "You are sending too many messages. Please try again shortly."
            : "Something went wrong. Please try again."),
      });
    } catch {
      setStatus({
        type: "error",
        message: "Unable to reach our message service. Please try again in a moment.",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="contact section__padding" id="contact" ref={scope}>
      <div className="contact__intro" data-reveal>
        <p className="eyebrow">Contact Us</p>
        <h2 data-split>Let&apos;s talk about your next project.</h2>
        <p className="contact__lede">
          Send us a note and the team will get back to you. Submissions are sent securely to the
          company inbox.
        </p>
      </div>

      <form className="contact__form" noValidate onSubmit={submit} data-reveal>
        <div className="contact__field">
          <label htmlFor="name">Name</label>
          <input id="name" name="name" placeholder="Your full name" value={values.name} onChange={(e) => set("name", e.target.value)} required autoComplete="name" />
        </div>

        <div className="contact__field">
          <label htmlFor="email">Email Address</label>
          <input id="email" name="email" type="email" placeholder="you@company.com" value={values.email} onChange={(e) => set("email", e.target.value)} required autoComplete="email" />
        </div>

        <div className="contact__field">
          <label htmlFor="subject">Subject</label>
          <input id="subject" name="subject" placeholder="What is this about?" value={values.subject} onChange={(e) => set("subject", e.target.value)} required />
        </div>

        <div className="contact__field">
          <label htmlFor="message">Message</label>
          <textarea id="message" name="message" rows={6} placeholder="Tell us about your project or question…" value={values.message} onChange={(e) => set("message", e.target.value)} required />
        </div>

        {/* Honeypot: hidden field bots fill automatically */}
        <div className="contact__honeypot" aria-hidden="true">
          <label htmlFor="website">Website</label>
          <input id="website" tabIndex={-1} autoComplete="off" value={values.website} onChange={(e) => set("website", e.target.value)} />
        </div>

        <button className="contact__submit" type="submit" disabled={sending}>
          {sending ? "Sending…" : "Send Message"}
        </button>

        {status.message && (
          <p role="status" className={`contact__status contact__status--${status.type}`}>
            {status.message}
          </p>
        )}
      </form>
    </section>
  );
}