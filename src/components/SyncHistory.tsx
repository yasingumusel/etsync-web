"use client";

import { useCallback, useEffect, useState } from "react";

type Run = {
  at: string;
  trigger: "manual" | "scheduled";
  status: "success" | "partial" | "failed";
  created: number;
  updated: number;
  failed: number;
  hidden: number;
  pushedToEtsy: number;
  createdOnEtsy: number;
  durationMs?: number;
  errors: { sku?: string; message?: string }[];
};

type HistoryResponse = {
  targetStores: {
    platform: string;
    storeId: string;
    lastSyncAt: string | null;
    runs: Run[];
  }[];
};

const statusStyle: Record<Run["status"], string> = {
  success: "bg-emerald-400/10 text-emerald-600",
  partial: "bg-amber-400/10 text-amber-600",
  failed: "bg-red-400/10 text-red-500",
};

function duration(ms?: number) {
  if (!ms) return null;
  if (ms < 1000) return `${ms}ms`;
  const s = Math.round(ms / 1000);
  if (s < 60) return `${s}s`;
  return `${Math.floor(s / 60)}m ${s % 60}s`;
}

export default function SyncHistory({ refreshKey }: { refreshKey: number }) {
  const [data, setData] = useState<HistoryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [openRun, setOpenRun] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/sync/history");
    if (res.ok) setData(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load, refreshKey]);

  if (loading) return null;

  const stores = data?.targetStores ?? [];
  const hasRuns = stores.some((s) => s.runs.length > 0);

  return (
    <div className="mt-4 card-glass rounded-2xl p-6">
      <h2 className="font-display text-base font-semibold text-foreground">
        Sync history
      </h2>
      <p className="mt-1 text-xs text-muted">
        Every sync that changed something, newest first. Checks that found
        nothing to update are not listed.
      </p>

      {!hasRuns ? (
        <p className="mt-5 text-sm text-muted">
          Nothing yet. Your next sync will show up here.
        </p>
      ) : (
        <div className="mt-5 space-y-5">
          {stores
            .filter((s) => s.runs.length > 0)
            .map((store) => (
              <div key={`${store.platform}-${store.storeId}`}>
                <p className="text-xs font-semibold capitalize text-muted">
                  {store.platform}
                </p>

                <ul className="mt-2 divide-y divide-border rounded-xl border border-border bg-surface">
                  {store.runs.map((run, i) => {
                    const id = `${store.storeId}-${i}`;
                    const isOpen = openRun === id;
                    const hasErrors = run.errors.length > 0;

                    return (
                      <li key={id} className="px-4 py-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-sm text-foreground">
                              {[
                                run.created > 0 && `${run.created} created`,
                                run.updated > 0 && `${run.updated} updated`,
                                run.hidden > 0 && `${run.hidden} hidden`,
                                run.pushedToEtsy > 0 && `${run.pushedToEtsy} pushed to Etsy`,
                                run.createdOnEtsy > 0 && `${run.createdOnEtsy} published as Etsy drafts`,
                                run.failed > 0 && `${run.failed} failed`,
                              ]
                                .filter(Boolean)
                                .join(" · ") || "no changes"}
                            </p>
                            {run.hidden > 0 && (
                              <p className="mt-0.5 text-[11px] text-amber-700">
                                Hidden because the Etsy listing is no longer
                                active. Nothing was deleted.
                              </p>
                            )}
                            <p className="mt-0.5 text-xs text-muted">
                              {new Date(run.at).toLocaleString("en-US")}
                              {duration(run.durationMs) && ` · took ${duration(run.durationMs)}`}
                            </p>
                          </div>

                          <div className="flex shrink-0 items-center gap-2">
                            <span className="rounded-full bg-surface-2 px-2 py-0.5 text-[11px] font-medium text-muted">
                              {run.trigger === "scheduled" ? "automatic" : "manual"}
                            </span>
                            <span
                              className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${statusStyle[run.status]}`}
                            >
                              {run.status}
                            </span>
                          </div>
                        </div>

                        {hasErrors && (
                          <>
                            <button
                              type="button"
                              onClick={() => setOpenRun(isOpen ? null : id)}
                              className="mt-2 text-xs font-medium text-accent-violet hover:underline"
                            >
                              {isOpen ? "Hide" : "Show"} {run.errors.length} error
                              {run.errors.length > 1 ? "s" : ""}
                            </button>

                            {isOpen && (
                              <ul className="mt-2 space-y-1.5 rounded-lg bg-surface-2 p-3">
                                {run.errors.map((e, j) => (
                                  <li key={j} className="text-[11px] leading-relaxed text-muted">
                                    <span className="font-medium text-foreground">
                                      {e.sku || "unknown product"}
                                    </span>
                                    {e.message ? ` — ${e.message}` : ""}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
