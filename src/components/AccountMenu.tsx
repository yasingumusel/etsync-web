"use client";

import { useEffect, useRef, useState } from "react";

type Plan = "free" | "starter" | "growth" | "pro" | "unlimited";

// Mirrors the tiers on the marketing site's pricing table (Pricing.tsx),
// so the badge here always names the same plan a visitor would see there.
const planInfo: Record<Plan, { label: string; limit: string }> = {
  free: { label: "Free plan", limit: "Up to 5 products" },
  starter: { label: "Starter plan", limit: "Up to 50 products" },
  growth: { label: "Growth plan", limit: "Up to 100 products" },
  pro: { label: "Pro plan", limit: "Up to 200 products" },
  unlimited: { label: "Unlimited plan", limit: "Unlimited products" },
};

function initials(email: string | undefined): string {
  if (!email) return "?";
  const name = email.split("@")[0];
  return name.slice(0, 2).toUpperCase();
}

export default function AccountMenu({
  email,
  plan,
  onLogout,
}: {
  email?: string;
  plan?: Plan;
  onLogout: () => void;
}) {
  const info = planInfo[plan ?? "free"];
  const isFree = (plan ?? "free") === "free";
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Account menu"
        className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-r from-accent-orange via-accent-pink to-accent-violet text-xs font-semibold text-white"
      >
        {initials(email)}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-64 rounded-2xl border border-border bg-background shadow-xl">
          <div className="flex items-center gap-3 border-b border-border px-4 py-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-accent-orange via-accent-pink to-accent-violet text-sm font-semibold text-white">
              {initials(email)}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">
                {email ?? "Unknown account"}
              </p>
              <span
                className={`mt-1 inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${
                  isFree
                    ? "bg-surface-2 text-muted"
                    : "bg-accent-violet/10 text-accent-violet"
                }`}
              >
                {info.label}
              </span>
              <p className="mt-1 text-xs text-muted">{info.limit}</p>
            </div>
          </div>

          <div className="p-1.5">
            <a
              href="/"
              className="block rounded-lg px-3 py-2 text-sm font-medium text-muted transition-colors hover:bg-surface hover:text-foreground"
            >
              Back to homepage
            </a>
            {isFree && (
              <a
                href="/#pricing"
                className="block rounded-lg px-3 py-2 text-sm font-medium text-accent-violet transition-colors hover:bg-surface"
              >
                Upgrade plan
              </a>
            )}
            <button
              type="button"
              onClick={onLogout}
              className="block w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-muted transition-colors hover:bg-surface hover:text-foreground"
            >
              Log out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
