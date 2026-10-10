import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { API_URL } from "@/lib/admin/api";
import { addMessage, listConversations } from "@/lib/server/chat-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface AdminIdentity {
  ok: boolean;
  status?: number;
}

/**
 * Validates the caller against the Laravel admin session (/auth/me) and
 * requires the messages.view permission (or a super admin). The admin token
 * travels as `Authorization: Bearer <token>`, exactly like the Admin Panel.
 */
async function requireAdmin(request: NextRequest): Promise<AdminIdentity> {
  const authorization = request.headers.get("authorization") || "";
  if (!authorization) return { ok: false, status: 401 };

  try {
    const res = await fetch(`${API_URL}/auth/me`, {
      headers: { Accept: "application/json", Authorization: authorization },
    });
    if (!res.ok) return { ok: false, status: 401 };
    const body = (await res.json()) as {
      data?: { permissions?: string[]; is_super_admin?: boolean };
    };
    const data = body?.data ?? {};
    const permissions = Array.isArray(data.permissions)
      ? data.permissions.map((p) => String(p))
      : [];
    if (!data.is_super_admin && !permissions.includes("messages.view")) {
      return { ok: false, status: 403 };
    }
    return { ok: true };
  } catch {
    return { ok: false, status: 503 };
  }
}

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!auth.ok) {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: auth.status });
  }
  const conversations = await listConversations();
  return NextResponse.json({ ok: true, conversations });
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!auth.ok) {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: auth.status });
  }

  let body: { token?: unknown; message?: unknown };
  try {
    body = (await request.json()) as { token?: unknown; message?: unknown };
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const token = String(body.token || "");
  const text = String(body.message || "").trim().slice(0, 1000);
  if (!token || !text) {
    return NextResponse.json(
      { ok: false, error: "Conversation token and message are required." },
      { status: 422 },
    );
  }

  const message = await addMessage(token, text, "agent");
  if (!message) {
    return NextResponse.json({ ok: false, error: "Invalid conversation." }, { status: 400 });
  }

  return NextResponse.json({ ok: true, message });
}