import { mkdir, readFile, readdir, rename, writeFile } from "fs/promises";
import path from "path";

/**
 * Server-side live-chat conversation store.
 *
 * Conversations persist as JSON files under CHAT_STORE_DIR (on the VPS:
 * /var/www/sadat-upgrade/shared/chat-store, which is deploy-owned and outside
 * release dirs). If the directory is not writable (e.g. local dev), messages
 * fall back to an in-memory map so the widget still works.
 */

export type ChatSender = "agent" | "visitor";

export interface StoredChatMessage {
  id: number;
  text: string;
  sender: ChatSender;
  ts: string;
}

export interface ConversationSummary {
  token: string;
  messages: StoredChatMessage[];
  lastTs: string;
}

const memoryStore = new Map<string, StoredChatMessage[]>();

function storeDir(): string {
  return (
    process.env.CHAT_STORE_DIR || path.resolve(process.cwd(), ".chat-store")
  );
}

function fileFor(token: string): string {
  const dir = storeDir();
  return path.join(dir, token.slice(0, 2), `${token}.json`);
}

function greeting(): StoredChatMessage {
  return {
    id: 1,
    text: "Thanks for reaching out! A member of the Sadaat Upgrade team will reply to you here shortly.",
    sender: "agent",
    ts: new Date().toISOString(),
  };
}

export function validToken(token: unknown): boolean {
  return typeof token === "string" && /^[A-Za-z0-9-]{8,64}$/.test(token);
}

async function readConversation(token: string): Promise<StoredChatMessage[]> {
  try {
    const raw = await readFile(fileFor(token), "utf8");
    const data = JSON.parse(raw) as { messages?: StoredChatMessage[] };
    if (Array.isArray(data.messages)) return data.messages;
  } catch {
    /* fall through */
  }
  const mem = memoryStore.get(token);
  if (mem) return mem;
  return [greeting()];
}

async function writeConversation(
  token: string,
  messages: StoredChatMessage[],
): Promise<void> {
  memoryStore.set(token, messages);
  try {
    const dir = storeDir();
    const file = fileFor(token);
    await mkdir(path.dirname(file), { recursive: true });
    const tmp = `${file}.${Date.now()}.tmp`;
    await writeFile(tmp, JSON.stringify({ token, messages }), "utf8");
    await rename(tmp, file);
  } catch {
    // Non-writable store (e.g. local dev) -> in-memory is sufficient.
  }
}

export async function getMessages(
  token: string,
): Promise<StoredChatMessage[] | null> {
  if (!validToken(token)) return null;
  return readConversation(token);
}

export async function addMessage(
  token: string,
  text: unknown,
  sender = "visitor",
): Promise<StoredChatMessage | null> {
  if (!validToken(token)) return null;
  const messages = await readConversation(token);
  const message: StoredChatMessage = {
    id: Date.now(),
    text: String(text).trim().slice(0, 1000),
    sender: sender === "agent" ? "agent" : "visitor",
    ts: new Date().toISOString(),
  };
  if (!message.text) return null;
  await writeConversation(token, [...messages, message]);
  return message;
}

/**
 * Lists all known conversations (both in-memory and file-backed). Used by the
 * admin chat interface. Conversations are identified by their visitor tokens.
 */
export async function listConversations(): Promise<ConversationSummary[]> {
  const tokens = new Set<string>(memoryStore.keys());

  try {
    const dir = storeDir();
    const entries = await readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      const files = await readdir(path.join(dir, entry.name));
      for (const file of files) {
        if (file.endsWith(".json")) {
          tokens.add(file.slice(0, -".json".length));
        }
      }
    }
  } catch {
    /* file-backed list is best-effort; in-memory list is authoritative */
  }

  const summaries: ConversationSummary[] = [];
  for (const token of tokens) {
    const messages = await readConversation(token);
    summaries.push({
      token,
      messages,
      lastTs: messages[messages.length - 1]?.ts ?? "",
    });
  }

  summaries.sort((a, b) => b.lastTs.localeCompare(a.lastTs));
  return summaries;
}