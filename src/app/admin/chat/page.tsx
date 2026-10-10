"use client";

import { useCallback, useEffect, useState } from "react";
import { Send, RefreshCw } from "lucide-react";
import { getToken } from "@/lib/admin/api";
import { PageHeader, EmptyState } from "@/components/admin/ui";
import { useAdminAuth } from "@/components/admin/auth-provider";
import { useToast } from "@/components/admin/toast";
import { cn } from "@/lib/utils";

interface ChatMessage {
  id: number | string;
  text: string;
  sender: "agent" | "visitor";
  ts: string;
}

interface Conversation {
  token: string;
  messages: ChatMessage[];
  lastTs: string;
}

function formatTime(iso: string): string {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleString([], {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

export default function AdminChatPage() {
  const { can } = useAdminAuth();
  const toast = useToast();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selected, setSelected] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/chat-admin", {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) {
        setError("Unable to load conversations. Check that you have the messages.view permission.");
        return;
      }
      const body = (await res.json()) as { ok?: boolean; conversations?: Conversation[] };
      const list = body.conversations ?? [];
      setConversations(list);
      if (selected) {
        const found = list.find((c) => c.token === selected);
        if (found) setMessages(found.messages);
      } else if (list.length > 0) {
        setSelected(list[0].token);
        setMessages(list[0].messages);
      } else {
        setMessages([]);
      }
    } catch {
      setError("Could not reach the chat service.");
    } finally {
      setLoading(false);
    }
  }, [selected]);

  useEffect(() => {
    load();
  }, [load]);

  const selectConversation = (token: string) => {
    const found = conversations.find((c) => c.token === token);
    setSelected(token);
    setMessages(found?.messages ?? []);
  };

  const sendReply = async () => {
    const text = reply.trim();
    if (!text || !selected || sending) return;
    setSending(true);
    try {
      const res = await fetch("/chat-admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ token: selected, message: text }),
      });
      const body = (await res.json()) as { ok?: boolean; error?: string; message?: ChatMessage };
      if (!res.ok || !body.ok) {
        toast.error(body.error || "Reply could not be sent.");
        return;
      }
      if (body.message) setMessages((prev) => [...prev, body.message as ChatMessage]);
      setReply("");
    } catch {
      toast.error("Reply could not be sent.");
    } finally {
      setSending(false);
    }
  };

  const activeConversation = conversations.find((c) => c.token === selected);

  return (
    <div>
      <PageHeader
        title="Live Chat"
        description="Conversations started by website visitors. Replies are delivered to the visitor's chat widget in real time."
        actions={
          <button
            type="button"
            onClick={() => void load()}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <RefreshCw className="h-4 w-4" /> Refresh
          </button>
        }
      />

      {error && (
        <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
          {error}
        </div>
      )}

      {!can("messages.view") && !error ? (
        <EmptyState title="No access" description="You need the messages.view permission to use live chat." />
      ) : (
        <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
          {/* Conversation list */}
          <div className="rounded-xl border border-gray-200 bg-white">
            <div className="border-b border-gray-100 px-4 py-3">
              <p className="text-sm font-semibold text-gray-900">Conversations</p>
              <p className="text-xs text-gray-400">{conversations.length} total</p>
            </div>
            <div className="max-h-[560px] overflow-y-auto">
              {loading && conversations.length === 0 && (
                <p className="p-6 text-sm text-gray-400">Loading conversations…</p>
              )}
              {!loading && conversations.length === 0 && (
                <p className="p-6 text-sm text-gray-500">
                  No visitor conversations yet. Conversations begin when a visitor sends their first chat message.
                </p>
              )}
              {conversations.map((conversation) => {
                const last = conversation.messages[conversation.messages.length - 1];
                const isActive = conversation.token === selected;
                return (
                  <button
                    key={conversation.token}
                    type="button"
                    onClick={() => selectConversation(conversation.token)}
                    className={cn(
                      "block w-full border-b border-gray-50 px-4 py-3 text-left transition-colors",
                      isActive ? "bg-blue-50" : "hover:bg-gray-50",
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate font-mono text-xs text-gray-500">
                        {conversation.token.slice(0, 14)}…
                      </span>
                      <span className="shrink-0 text-[10px] text-gray-400">{formatTime(conversation.lastTs)}</span>
                    </div>
                    <p className="mt-1 truncate text-sm text-gray-700">
                      {last?.sender === "agent" ? "Agent" : "Visitor"}: {last?.text}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Thread */}
          <div className="flex flex-col rounded-xl border border-gray-200 bg-white">
            <div className="border-b border-gray-100 px-4 py-3">
              <p className="text-sm font-semibold text-gray-900">
                {activeConversation ? `Conversation ${activeConversation.token.slice(0, 14)}…` : "No conversation selected"}
              </p>
            </div>

            <div className="flex max-h-[460px] flex-1 flex-col gap-3 overflow-y-auto p-4">
              {messages.map((msg) => (
                <div key={msg.id} className={cn("flex", msg.sender === "visitor" ? "justify-end" : "justify-start")}>
                  <div
                    className={cn(
                      "max-w-[80%] rounded-lg px-3 py-2 text-sm whitespace-pre-wrap break-words",
                      msg.sender === "visitor"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-900",
                    )}
                  >
                    <p>{msg.text}</p>
                    <p className={cn("mt-1 text-[10px]", msg.sender === "visitor" ? "text-blue-100" : "text-gray-400")}>
                      {msg.sender === "visitor" ? "Visitor" : "Agent"} · {formatTime(msg.ts)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 p-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  void sendReply();
                }}
                className="flex gap-2"
              >
                <input
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder={selected ? "Type a reply…" : "Select a conversation first"}
                  disabled={!selected}
                  className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  disabled={!selected || !reply.trim() || sending}
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  <Send className="h-4 w-4" /> Send
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}