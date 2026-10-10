import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { API_URL } from "@/lib/admin/api";
import { rateLimit } from "@/lib/server/rate-limit";
import { sendInquiryEmail } from "@/lib/server/mailer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface ContactRequestBody {
  website?: unknown;
  firstName?: unknown;
  lastName?: unknown;
  email?: unknown;
  phone?: unknown;
  company?: unknown;
  service?: unknown;
  budget?: unknown;
  message?: unknown;
}

function clientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

export async function POST(request: NextRequest) {
  let body: ContactRequestBody;
  try {
    body = (await request.json()) as ContactRequestBody;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: bots fill hidden "website" field; silently accept without sending.
  if (body.website) {
    return NextResponse.json({ ok: true });
  }

  const ip = clientIp(request);
  if (!rateLimit(`contact:${ip}`, 5, 60_000)) {
    return NextResponse.json(
      { ok: false, error: "Too many submissions. Please try again shortly." },
      { status: 429 },
    );
  }

  const firstName = String(body.firstName || "").trim().slice(0, 120);
  const lastName = String(body.lastName || "").trim().slice(0, 120);
  const email = String(body.email || "").trim().toLowerCase().slice(0, 255);
  const phone = String(body.phone || "").trim().slice(0, 30);
  const company = String(body.company || "").trim().slice(0, 255);
  const service = String(body.service || "").trim().slice(0, 120);
  const budget = String(body.budget || "").trim().slice(0, 120);
  const message = String(body.message || "").trim().slice(0, 5000);

  const name = [firstName, lastName].filter(Boolean).join(" ").trim();
  const errors: Record<string, string> = {};
  if (!name) errors.name = "Please provide your name.";
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Please provide a valid email address.";
  }
  if (!message || message.length < 10) {
    errors.message = "Please provide a short message (at least 10 characters).";
  }
  if (Object.keys(errors).length) {
    return NextResponse.json({ ok: false, errors }, { status: 422 });
  }

  const payload = {
    first_name: firstName,
    last_name: lastName,
    email,
    phone,
    company,
    service,
    budget,
    message,
  };

  // 1) Persist the submission into the backend inbox (contact_messages) so
  //    admins can read it from the Admin Panel. Non-fatal if the API is down.
  let persisted = false;
  try {
    const res = await fetch(`${API_URL}/public/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
    });
    persisted = res.ok;
    if (!persisted) {
      console.error("contact-submit: backend persistence failed", res.status);
    }
  } catch (err: unknown) {
    console.error("contact-submit: backend persistence error", err);
  }

  // 2) Attempt email delivery (provider acceptance is not inbox delivery).
  let emailSent = false;
  try {
    const delivery = await sendInquiryEmail({
      name,
      email,
      phone,
      company,
      service,
      budget,
      message,
    });
    emailSent = delivery.sent;
    if (!delivery.configured) {
      console.error("contact-submit: SMTP not configured (email not sent)");
    }
  } catch (err: unknown) {
    console.error("contact-submit: SMTP delivery failed", err);
  }

  // A success is only honest when the backend accepted the contact OR the
  // email was accepted by the provider. Never report success on a silent fail.
  if (!persisted && !emailSent) {
    return NextResponse.json(
      { ok: false, error: "We couldn't send your message right now. Please try again later or email us directly." },
      { status: 503 },
    );
  }

  return NextResponse.json({ ok: true, persisted, emailSent });
}