"use client";

import { useEffect, useRef, useState } from "react";

function initials(email: string | undefined): string {
  if (!email) return "?";
  const name = email.split("@")[0];
  return name.slice(0, 2).toUpperCase();
}

export default function AccountMenu({
  email,
  isPremium,
  onLogout,
}: {
  email?: string;
  isPremium?: boolean;
  onLogout: () => void;
}) {
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
                  isPremium
                    ? "bg-accent-violet/10 text-accent-violet"
                    : "bg-surface-2 text-muted"
                }`}
              >
                {isPremium ? "Premium plan" : "Free plan"}
              </span>
            </div>
          </div>

          <div className="p-1.5">
            {!isPremium && (
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
