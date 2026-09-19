"use client";

import { useEffect, useRef, useState } from "react";

type Message = { role: "user" | "assistant"; content: string };

/**
 * "Jason" - the site's support chatbot. Floats on every page (mounted once
 * in the root layout) since it's meant to help both prospects on the
 * marketing site and logged-in customers in the dashboard. Everything it's
 * allowed to know and say lives in src/lib/jasonKnowledge.ts, enforced
 * server-side in /api/chat - this component only handles the conversation
 * UI and streaming the reply in as it arrives.
 */
export default function JasonChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  async function send() {
    const text = input.trim();
    if (!text || sending) return;

    const nextMessages: Message[] = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setInput("");
    setSending(true);
    setError(null);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });

      if (!res.ok || !res.body) {
        throw new Error("Jason couldn't respond just now");
      }

      // Stream the reply in as it arrives, appending to one growing
      // assistant message rather than waiting for the full response.
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "assistant",
            content: updated[updated.length - 1].content + chunk,
          };
          return updated;
        });
      }
    } catch {
      setError("Jason is having trouble responding. Try again, or email support@mirrorstock.com.");
    } finally {
      setSending(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-[60] flex flex-col items-end gap-3">
      {open && (
        <div className="flex h-[520px] w-[360px] max-w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-2xl">
          <div className="flex items-center justify-between border-b border-border bg-surface/60 px-4 py-3">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-accent-orange via-accent-pink to-accent-violet text-xs font-bold text-white">
                J
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">Jason</p>
                <p className="text-[11px] text-muted">MirrorStock support</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="flex h-7 w-7 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface-2 hover:text-foreground"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            <ChatBubble role="assistant">
              Hi, I&apos;m Jason 👋 I can answer questions about MirrorStock -
              pricing, how the sync works, what data it reads from Etsy,
              anything on the site. For anything about your own account,
              email support@mirrorstock.com.
            </ChatBubble>

            {messages.map((m, i) => (
              <ChatBubble key={i} role={m.role}>
                {m.content || (m.role === "assistant" && sending ? "…" : "")}
              </ChatBubble>
            ))}

            {error && <p className="text-xs font-medium text-red-500">{error}</p>}
          </div>

          <div className="border-t border-border p-3">
            <div className="flex items-end gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask Jason anything…"
                rows={1}
                disabled={sending}
                className="max-h-24 flex-1 resize-none rounded-xl border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none focus:border-accent-violet disabled:opacity-60"
              />
              <button
                type="button"
                onClick={send}
                disabled={sending || !input.trim()}
                aria-label="Send"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-accent-orange via-accent-pink to-accent-violet text-white disabled:opacity-50"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close Jason" : "Chat with Jason"}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-accent-orange via-accent-pink to-accent-violet text-white shadow-[0_10px_30px_-8px_rgba(139,92,246,0.6)] transition-transform hover:scale-105"
      >
        {open ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M4 12a8 8 0 1 1 3.2 6.4L4 20l1.2-3.6A7.96 7.96 0 0 1 4 12Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>
    </div>
  );
}

function ChatBubble({ role, children }: { role: "user" | "assistant"; children: React.ReactNode }) {
  const isUser = role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
          isUser
            ? "bg-gradient-to-r from-accent-orange via-accent-pink to-accent-violet text-white"
            : "bg-surface text-foreground"
        }`}
      >
        {children}
      </div>
    </div>
  );
}
