"use client";

import { useState } from "react";

export type HealthIssue = {
  code: string;
  level: "error" | "warning" | "info";
  message: string;
  since: string | null;
  action: "reconnect-etsy" | "reconnect-store" | "sync-now" | "review-matches" | "restore-deleted" | null;
  details: { sku?: string; title?: string; message?: string; attempts?: number }[];
};

const levelStyle: Record<HealthIssue["level"], string> = {
  error: "border-red-400/30 bg-red-400/5 text-red-600",
  warning: "border-amber-400/30 bg-amber-400/5 text-amber-700",
  info: "border-border bg-surface text-foreground",
};

const levelLabel: Record<HealthIssue["level"], string> = {
  error: "Action needed",
  warning: "Heads up",
  info: "For you to review",
};

const actionClass =
  "text-xs font-semibold underline underline-offset-2 hover:no-underline disabled:opacity-50";

/**
 * Problems the sync ran into, straight from the backend's health tracking
 * (utils/syncHealth.js) - so a sync that stops working is said out loud
 * here instead of failing quietly. Renders nothing while all is well.
 */
export default function SyncHealth({
  issues,
  platform,
  platformQs,
  onSyncNow,
  onChanged,
}: {
  issues: HealthIssue[];
  platform: "wix" | "shopify" | null;
  platformQs: string;
  onSyncNow: () => void;
  onChanged: () => void;
}) {
  const [open, setOpen] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (!issues.length) return null;

  async function restoreDeleted() {
    setBusy(true);
    try {
      await fetch(`/api/sync/restore-deleted${platformQs}`, { method: "POST" });
      onChanged();
    } finally {
      setBusy(false);
    }
  }

  function renderAction(issue: HealthIssue) {
    switch (issue.action) {
      case "reconnect-etsy":
        return (
          <a href="/api/etsy/reconnect" target="_blank" rel="noopener" className={actionClass}>
            Reconnect Etsy
          </a>
        );
      case "reconnect-store":
        return platform === "wix" ? (
          <a href="/api/wix/connect" className={actionClass}>
            Reconnect Wix store
          </a>
        ) : (
          <span className="text-xs">Use &ldquo;Reconnect Shopify store&rdquo; below.</span>
        );
      case "sync-now":
        return (
          <button type="button" onClick={onSyncNow} className={actionClass}>
            Sync now
          </button>
        );
      case "review-matches":
        return (
          <a href="#product-matches" className={actionClass}>
            Review them
          </a>
        );
      case "restore-deleted":
        return (
          <button type="button" onClick={restoreDeleted} disabled={busy} className={actionClass}>
            {busy ? "Adding back…" : "Add them back on the next sync"}
          </button>
        );
      default:
        return null;
    }
  }

  return (
    <div className="mt-6 space-y-3" role="status">
      {issues.map((issue) => (
        <div key={issue.code} className={`rounded-xl border px-4 py-3 ${levelStyle[issue.level]}`}>
          <p className="text-[11px] font-semibold uppercase tracking-wide opacity-80">{levelLabel[issue.level]}</p>
          <p className="mt-1 text-sm leading-relaxed">{issue.message}</p>

          <div className="mt-2 flex flex-wrap items-center gap-4">
            {renderAction(issue)}
            {issue.details.length > 0 && (
              <button
                type="button"
                onClick={() => setOpen(open === issue.code ? null : issue.code)}
                className={actionClass}
              >
                {open === issue.code ? "Hide products" : `Show ${issue.details.length} product${issue.details.length === 1 ? "" : "s"}`}
              </button>
            )}
          </div>

          {open === issue.code && (
            <ul className="mt-3 space-y-1.5 rounded-lg bg-background/60 p-3">
              {issue.details.map((d, i) => (
                <li key={`${d.sku}-${i}`} className="text-[11px] leading-relaxed text-muted">
                  <span className="font-medium text-foreground">{d.title || d.sku}</span>
                  {d.attempts ? ` · tried ${d.attempts} time${d.attempts === 1 ? "" : "s"}` : ""}
                  {d.message ? ` — ${d.message}` : ""}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}
