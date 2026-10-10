import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { rateLimit } from "@/lib/server/rate-limit";
import { addMessage, validToken } from "@/lib/server/chat-store";
import { sendInquiryEmail } from "@/lib/server/mailer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface ChatRequestBody {
  website?: unknown;
  token?: unknown;
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
  let body: ChatRequestBody;
  try {
    body = (await request.json()) as ChatRequestBody;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  if (body.website) {
    return NextResponse.json({ ok: true });
  }

  const ip = clientIp(request);
  if (!rateLimit(`chat:${ip}`, 15, 60_000)) {
    return NextResponse.json(
      { ok: false, error: "You're sending messages too quickly. Please wait a moment." },
      { status: 429 },
    );
  }

  const token = String(body.token || "");
  const text = String(body.message || "").trim().slice(0, 1000);

  if (!validToken(token)) {
    return NextResponse.json({ ok: false, error: "Invalid conversation." }, { status: 400 });
  }
  if (!text) {
    return NextResponse.json({ ok: false, error: "Message cannot be empty." }, { status: 422 });
  }

  await addMessage(token, text, "visitor");

  // Notify the team about the new chat message (best-effort; never blocks the visitor).
  sendInquiryEmail({
    name: "Live Chat visitor",
    email: process.env.CONTACT_FROM || "noreply@sadatupgrade.com",
    message: `${text}\n\n(Conversation token: ${token})`,
    source: "Live Chat",
  }).catch(() => {});

  return NextResponse.json({ ok: true });
}