"use client";

import { useMemo, useState } from "react";
import { FaqCategory, JASON_FAQ, SUPPORT_EMAIL } from "@/lib/jasonFaq";

const CATEGORY_ORDER: FaqCategory[] = [
  "Getting Started",
  "Syncing",
  "Etsy Access & Privacy",
  "Pricing & Billing",
  "Account & Integrations",
  "Support",
];

const visibleEntries = JASON_FAQ.filter((e) => !e.hideFromHelp);

/**
 * The dashboard's static Help page - same facts Jason (the chat widget)
 * answers from, laid out as a browsable reference instead of a
 * conversation, for people who'd rather scan than type a question.
 */
export default function HelpContent() {
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return visibleEntries;
    return visibleEntries.filter(
      (e) => e.question.toLowerCase().includes(q) || e.answer.toLowerCase().includes(q)
    );
  }, [query]);

  const byCategory = CATEGORY_ORDER.map((cat) => ({
    category: cat,
    entries: filtered.filter((e) => e.category === cat),
  })).filter((g) => g.entries.length > 0);

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="font-display text-2xl font-bold text-foreground">Help</h1>
      <p className="mt-1 text-sm text-muted">
        Answers to common questions about MirrorStock. You can also ask
        Jason (bottom right) the same questions in plain language.
      </p>

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search help topics…"
        className="mt-6 w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-foreground outline-none focus:border-accent-violet"
      />

      {byCategory.length === 0 ? (
        <p className="mt-8 rounded-xl border border-border bg-surface px-4 py-6 text-center text-sm text-muted">
          No matching topics. Try Jason, or email{" "}
          <a href={`mailto:${SUPPORT_EMAIL}`} className="font-medium text-accent-violet hover:underline">
            {SUPPORT_EMAIL}
          </a>
          .
        </p>
      ) : (
        <div className="mt-8 space-y-8">
          {byCategory.map((group) => (
            <div key={group.category}>
              <h2 className="text-xs font-semibold uppercase tracking-widest text-muted">
                {group.category}
              </h2>
              <div className="mt-3 divide-y divide-border rounded-2xl border border-border bg-surface/40">
                {group.entries.map((entry) => {
                  const isOpen = openId === entry.id;
                  return (
                    <div key={entry.id} className="px-5">
                      <button
                        type="button"
                        onClick={() => setOpenId(isOpen ? null : entry.id)}
                        className="flex w-full items-center justify-between gap-4 py-4 text-left"
                        aria-expanded={isOpen}
                      >
                        <span className="text-sm font-medium text-foreground">{entry.question}</span>
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          className={`shrink-0 text-muted transition-transform ${isOpen ? "rotate-45" : ""}`}
                        >
                          <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                      </button>
                      {isOpen && <p className="pb-4 text-sm leading-relaxed text-muted">{entry.answer}</p>}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="mt-10 text-center text-xs text-muted">
        Can&apos;t find what you&apos;re looking for? Chat with Jason, or email{" "}
        <a href={`mailto:${SUPPORT_EMAIL}`} className="font-medium text-accent-violet hover:underline">
          {SUPPORT_EMAIL}
        </a>
        .
      </p>
    </div>
  );
}
