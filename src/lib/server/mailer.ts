import nodemailer from "nodemailer";

/**
 * SMTP mailer used for the public contact form and live-chat notifications.
 *
 * All credentials come from the deployment environment (systemd
 * EnvironmentFile -> /var/www/sadat-upgrade/shared/.env).
 * They are never committed, never logged, and never exposed to the browser.
 *
 * Expected env vars:
 *   SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASSWORD,
 *   CONTACT_FROM (defaults to SMTP_USER), CONTACT_RECIPIENT
 */

export interface SendInquiryEmailInput {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  company?: unknown;
  service?: unknown;
  budget?: unknown;
  message?: unknown;
  source?: string;
}

export interface SendInquiryEmailResult {
  configured: boolean;
  sent: boolean;
}

export interface MailerStatus {
  configured: boolean;
  recipient: string;
}

function isConfigured(): boolean {
  return Boolean(
    process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD,
  );
}

function transporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 465),
    secure: (process.env.SMTP_SECURE || "true") === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
}

function sanitize(value: unknown): string {
  return String(value ?? "")
    .replace(/[\r\n]+/g, " ")
    .trim()
    .slice(0, 500);
}

export async function sendInquiryEmail({
  name,
  email,
  phone,
  company,
  service,
  budget,
  message,
  source = "Contact Form",
}: SendInquiryEmailInput): Promise<SendInquiryEmailResult> {
  if (!isConfigured()) {
    return { configured: false, sent: false };
  }

  const to = process.env.CONTACT_RECIPIENT || "baregzay123@gmail.com";
  const subject = `${source} — ${sanitize(name)} (${sanitize(email)})`;

  const text = [
    `Name: ${sanitize(name)}`,
    `Email: ${sanitize(email)}`,
    `Phone: ${sanitize(phone) || "—"}`,
    `Company: ${sanitize(company) || "—"}`,
    `Service: ${sanitize(service) || "—"}`,
    `Budget: ${sanitize(budget) || "—"}`,
    "",
    "Message:",
    String(message ?? "").slice(0, 5000),
  ].join("\n");

  await transporter().sendMail({
    from: process.env.CONTACT_FROM || process.env.SMTP_USER,
    to,
    subject,
    text,
  });

  return { configured: true, sent: true };
}

export function mailerStatus(): MailerStatus {
  return {
    configured: isConfigured(),
    recipient: process.env.CONTACT_RECIPIENT || "baregzay123@gmail.com",
  };
}