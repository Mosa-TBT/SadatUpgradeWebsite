import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { rateLimit } from "@/lib/server/rate-limit";
import { getMessages } from "@/lib/server/chat-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function clientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

export async function GET(request: NextRequest) {
  const ip = clientIp(request);
  if (!rateLimit(`chat-read:${ip}`, 60, 60_000)) {
    return NextResponse.json({ ok: false, error: "Too many requests." }, { status: 429 });
  }

  const token = String(request.nextUrl.searchParams.get("token") || "");
  const messages = await getMessages(token);

  if (messages === null) {
    return NextResponse.json({ ok: false, error: "Invalid conversation." }, { status: 400 });
  }

  return NextResponse.json({ ok: true, messages });
}