"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Run = {
  at: string;
  trigger: "manual" | "scheduled";
  status: "success" | "partial" | "failed";
  created: number;
  updated: number;
  failed: number;
  hidden: number;
};

type Notification = Run & { platform: string };

const SEEN_KEY = "mirrorstock_notifications_seen_at";

function readSeenAt(): string {
  try {
    return localStorage.getItem(SEEN_KEY) ?? "";
  } catch {
    return "";
  }
}

function writeSeenAt(iso: string) {
  try {
    localStorage.setItem(SEEN_KEY, iso);
  } catch {
    // Private window / blocked storage - unread count just won't persist.
  }
}

function summarize(n: Notification): string {
  const parts = [
    n.created > 0 && `${n.created} created`,
    n.updated > 0 && `${n.updated} updated`,
    n.hidden > 0 && `${n.hidden} hidden`,
    n.failed > 0 && `${n.failed} failed`,
  ].filter(Boolean);
  return parts.length > 0 ? parts.join(" · ") : "Checked for changes - nothing to update";
}

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const min = Math.round(diffMs / 60000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m ago`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const days = Math.round(hr / 24);
  return `${days}d ago`;
}

const statusDot: Record<Run["status"], string> = {
  success: "bg-emerald-500",
  partial: "bg-amber-500",
  failed: "bg-red-500",
};

/**
 * Sync completions, surfaced as notifications. Deliberately reuses
 * /api/sync/history (the same data SyncHistory renders inline on the page)
 * rather than a separate notifications store on the backend - a sync run
 * IS the notification, so there's nothing else to record.
 *
 * "Unread" is purely a per-viewer convenience: the timestamp of the newest
 * run the user has seen the bell open for is kept in localStorage, so it
 * naturally resets in a new browser/private window rather than needing its
 * own backend state.
 */
export default function NotificationsBell({ refreshKey }: { refreshKey: number }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/sync/history");
    if (!res.ok) return;
    const data: { targetStores: { platform: string; runs: Run[] }[] } = await res.json();

    const flat: Notification[] = data.targetStores
      .flatMap((store) => store.runs.map((run) => ({ ...run, platform: store.platform })))
      .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())
      .slice(0, 15);

    setNotifications(flat);
    const seenAt = readSeenAt();
    setUnread(flat.filter((n) => !seenAt || n.at > seenAt).length);
  }, []);

  useEffect(() => {
    load();
  }, [load, refreshKey]);

  // Close on outside click.
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  function toggleOpen() {
    setOpen((v) => {
      const next = !v;
      if (next && notifications[0]) {
        writeSeenAt(notifications[0].at);
        setUnread(0);
      }
      return next;
    });
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={toggleOpen}
        aria-label="Notifications"
        className="relative flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted transition-colors hover:text-foreground"
      >
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
          <path
            d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M13.73 21a2 2 0 0 1-3.46 0"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {unread > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent-pink px-1 text-[10px] font-semibold text-white">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-80 rounded-2xl border border-border bg-background shadow-xl">
          <div className="border-b border-border px-4 py-3">
            <p className="text-sm font-semibold text-foreground">Notifications</p>
            <p className="text-xs text-muted">Every sync run, newest first</p>
          </div>

          {notifications.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-muted">
              Nothing yet. You&apos;ll see it here as soon as a sync runs.
            </p>
          ) : (
            <ul className="max-h-96 divide-y divide-border overflow-y-auto">
              {notifications.map((n, i) => (
                <li key={`${n.platform}-${n.at}-${i}`} className="flex gap-3 px-4 py-3">
                  <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${statusDot[n.status]}`} />
                  <div className="min-w-0">
                    <p className="text-sm text-foreground">
                      <span className="font-medium capitalize">{n.platform}</span> sync{" "}
                      {n.status === "failed" ? "failed" : "finished"}
                    </p>
                    <p className="mt-0.5 text-xs text-muted">{summarize(n)}</p>
                    <p className="mt-0.5 text-[11px] text-muted">
                      {timeAgo(n.at)} · {n.trigger === "scheduled" ? "automatic" : "manual"}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
