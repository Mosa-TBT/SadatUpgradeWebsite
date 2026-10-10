"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MessageCircle, X, Send, Minimize2 } from "lucide-react";

interface ChatMessage {
  id: number | string;
  text: string;
  sender: "agent" | "visitor" | "user";
  ts: string;
}

function getConversationToken(): string {
  if (typeof window === "undefined") return "";
  const key = "sadat_chat_token";
  let token = window.localStorage.getItem(key);
  if (!token) {
    token =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `c-${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
    window.localStorage.setItem(key, token);
  }
  return token;
}

export function LiveChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState("");
  const tokenRef = useRef("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const loadMessages = useCallback(async (): Promise<void> => {
    try {
      const res = await fetch(`/chat-messages?token=${encodeURIComponent(tokenRef.current)}`, {
        headers: { Accept: "application/json" },
      });
      if (res.ok) {
        const data = (await res.json()) as { ok?: boolean; messages?: ChatMessage[] };
        if (data.ok && Array.isArray(data.messages)) {
          setMessages(data.messages);
          setFeedback("");
        }
      }
    } catch {
      /* transient network error - keep last state */
    }
  }, []);

  useEffect(() => {
    tokenRef.current = getConversationToken();
  }, []);

  useEffect(() => {
    if (!isOpen || isMinimized) return;
    loadMessages();
    const timer = setInterval(() => loadMessages(), 6000);
    return () => clearInterval(timer);
  }, [isOpen, isMinimized, loadMessages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (): Promise<void> => {
    const text = message.trim();
    if (!text || sending) return;

    setSending(true);
    setFeedback("");
    const optimistic: ChatMessage = {
      id: `local-${Date.now()}`,
      text,
      sender: "visitor",
      ts: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimistic]);
    setMessage("");

    try {
      const res = await fetch("/chat-submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ token: tokenRef.current, message: text, website: "" }),
      });
      if (res.ok) {
        await loadMessages();
      } else {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        setFeedback(data?.error ?? "Message could not be sent. Please try again.");
        void loadMessages();
      }
    } catch {
      setFeedback("You appear to be offline. Please try again.");
      void loadMessages();
    } finally {
      setSending(false);
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          aria-label="Open live chat"
          className="rounded-full w-14 h-14 bg-blue-600 hover:bg-blue-700 shadow-lg"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 sm:bottom-6 sm:right-6">
      <Card
        className={`w-[calc(100vw-2rem)] max-w-sm sm:w-80 shadow-2xl border-0 bg-white ${
          isMinimized ? "h-14" : "h-[28rem]"
        } transition-all duration-300`}
      >
        <CardHeader className="flex flex-row items-center justify-between p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
          <div className="flex items-center space-x-2">
            <MessageCircle className="h-5 w-5" />
            <span className="font-semibold">Live Chat</span>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsMinimized((v) => !v)}
              aria-label={isMinimized ? "Expand chat" : "Minimize chat"}
              className="text-white hover:bg-white/20 h-6 w-6 p-0"
            >
              <Minimize2 className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
              className="text-white hover:bg-white/20 h-6 w-6 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="p-0 flex flex-col h-[26rem]">
            <div ref={scrollRef} role="log" aria-live="polite" className="flex-1 p-4 overflow-y-auto space-y-3">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === "visitor" || msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] px-3 py-2 rounded-lg text-sm break-words whitespace-pre-wrap ${
                      msg.sender === "visitor" || msg.sender === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {messages.length === 0 && !sending && (
                <p className="text-sm text-gray-400">Start the conversation below.</p>
              )}
            </div>

            <div className="p-4 border-t">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  void sendMessage();
                }}
                className="flex space-x-2"
              >
                <Input
                  placeholder="Type your message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  aria-label="Chat message"
                  className="flex-1"
                />
                <Button type="submit" size="sm" disabled={sending || !message.trim()} className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50" aria-label="Send message">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
              {feedback && (
                <p role="status" className="mt-2 text-xs text-amber-600">
                  {feedback}
                </p>
              )}
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}