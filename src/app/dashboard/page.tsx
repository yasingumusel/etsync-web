"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import SyncHistory from "@/components/SyncHistory";
import SyncSettings from "@/components/SyncSettings";
import ReviewsSettings from "@/components/ReviewsSettings";
import EtsyListingDefaults from "@/components/EtsyListingDefaults";
import DashboardHeader from "@/components/DashboardHeader";

type TargetStore = {
  platform: string;
  storeId: string;
  isActive: boolean;
  lastSyncAt: string | null;
  lastSyncStatus: "never" | "success" | "partial" | "failed";
  syncedProductCount: number;
  isSyncing: boolean;
  syncProgress: { current: number; total: number };
};

type StatusResponse = {
  email?: string;
  isPremium: boolean;
  plan?: "free" | "starter" | "growth" | "pro" | "unlimited";
  etsyConnected: boolean;
  targetStores: TargetStore[];
};

type RunResult = {
  message: string;
  results: Record<
    string,
    { total: number; created: number; updated: number; failed: number; errors: unknown[] }
  >;
};

type PreviewChange = { field: string; from: unknown; to: unknown };
type PreviewItem = {
  sku: string;
  name?: string;
  price?: number;
  action: "create" | "update" | "unchanged" | "unknown";
  changes?: PreviewChange[];
  reason?: string;
};
type PreviewStoreResult = {
  toCreate: number;
  toUpdate: number;
  unchanged: number;
  toHide: number;
  items: PreviewItem[];
  error?: string;
};
type PreviewResponse = { results: Record<string, PreviewStoreResult> };

const statusColor: Record<TargetStore["lastSyncStatus"], string> = {
  never: "bg-muted/20 text-muted",
  success: "bg-emerald-400/10 text-emerald-600",
  partial: "bg-amber-400/10 text-amber-600",
  failed: "bg-red-400/10 text-red-500",
};

export default function DashboardPage() {
  const [status, setStatus] = useState<StatusResponse | null>(null);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [justFinished, setJustFinished] = useState(false);
  const [runResult, setRunResult] = useState<RunResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [historyKey, setHistoryKey] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [previewing, setPreviewing] = useState(false);
  const [previewResult, setPreviewResult] = useState<PreviewResponse | null>(null);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [expandedPreviewStore, setExpandedPreviewStore] = useState<string | null>(null);
  const [direction, setDirection] = useState<"etsy-to-wix" | "wix-to-etsy">("etsy-to-wix");

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // Tracks wall-clock time since a sync started being observed, purely for
  // the "Preparing your sync… (Ns)" message below - not sent anywhere, just
  // local reassurance while `total` is still 0 (Etsy's catalogue can take a
  // few minutes to read for a large shop, before the first product is even
  // known, let alone pushed).
  const syncStartRef = useRef<number | null>(null);
  const elapsedIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const loadStatus = useCallback(async (): Promise<StatusResponse | null> => {
    const res = await fetch("/api/sync");
    if (!res.ok) return null;
    const data: StatusResponse = await res.json();
    setStatus(data);

    const anySyncing = data.targetStores.some((s) => s.isSyncing);
    if (anySyncing) {
      if (syncStartRef.current === null) {
        syncStartRef.current = Date.now();
        setElapsedSeconds(0);
        elapsedIntervalRef.current = setInterval(() => {
          if (syncStartRef.current !== null) {
            setElapsedSeconds(Math.floor((Date.now() - syncStartRef.current) / 1000));
          }
        }, 1000);
      }
    } else if (syncStartRef.current !== null) {
      syncStartRef.current = null;
      if (elapsedIntervalRef.current) {
        clearInterval(elapsedIntervalRef.current);
        elapsedIntervalRef.current = null;
      }
    }

    return data;
  }, []);

  useEffect(() => {
    loadStatus().finally(() => setLoadingStatus(false));
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
      if (elapsedIntervalRef.current) clearInterval(elapsedIntervalRef.current);
    };
  }, [loadStatus]);

  async function handlePreview() {
    setPreviewing(true);
    setPreviewError(null);
    setPreviewResult(null);

    try {
      const res = await fetch("/api/sync/preview", { method: "POST" });
      const body = await res.json();
      if (!res.ok) {
        setPreviewError(body.error || "Could not load preview");
      } else {
        setPreviewResult(body);
      }
    } catch {
      setPreviewError("Could not load preview");
    } finally {
      setPreviewing(false);
    }
  }

  function handleSync() {
    setSyncing(true);
    setJustFinished(false);
    setError(null);
    setPreviewResult(null);
    setRunResult(null);

    // A full sync can run 10-15+ minutes. The backend itself (a persistent
    // Railway server) keeps running to completion regardless, but an
    // intermediary (e.g. Vercel's own function timeout) may cut this
    // specific request short before then - so completion is NOT solely
    // detected by awaiting it. If it does come back in time, its detailed
    // created/updated/failed breakdown is used; either way, the polling
    // loop below independently detects completion via isSyncing flipping
    // back to false and stops the spinner.
    const finished = { current: false };
    const sawSyncing = { current: false };

    fetch("/api/sync", { method: "POST" })
      .then(async (res) => {
        const body = await res.json();
        if (finished.current) return;
        finished.current = true;
        if (pollRef.current) clearInterval(pollRef.current);
        if (!res.ok) setError(body.error || "Sync failed");
        else setRunResult(body);
        setSyncing(false);
        setJustFinished(true);
        setHistoryKey((k) => k + 1);
        loadStatus();
      })
      .catch(() => {
        // Swallowed - the polling loop below is the fallback completion signal.
      });

    pollRef.current = setInterval(async () => {
      const data = await loadStatus();
      if (!data || finished.current) return;

      const store = data.targetStores[0];
      if (store?.isSyncing) sawSyncing.current = true;

      if (sawSyncing.current && store && !store.isSyncing) {
        finished.current = true;
        if (pollRef.current) clearInterval(pollRef.current);
        setSyncing(false);
        setJustFinished(true);
        setHistoryKey((k) => k + 1);
      }
    }, 1500);
  }

  return (
    <div className="min-h-screen bg-grid">
      <DashboardHeader refreshKey={historyKey} />

      <main className="mx-auto max-w-5xl px-6 py-12">
        <h1 className="font-display text-2xl font-bold text-foreground">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-muted">
          <span className="font-medium text-accent-orange">Etsy</span>{" "}
          &rarr; <span className="font-medium text-accent-blue">Wix</span> product sync.
        </p>

        <div className="mt-6 inline-flex rounded-full border border-border bg-surface p-1">
          <button
            type="button"
            onClick={() => setDirection("etsy-to-wix")}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              direction === "etsy-to-wix"
                ? "bg-accent-orange text-white"
                : "text-muted hover:text-foreground"
            }`}
          >
            Etsy &rarr; Wix
          </button>
          <button
            type="button"
            onClick={() => setDirection("wix-to-etsy")}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              direction === "wix-to-etsy"
                ? "bg-accent-blue text-white"
                : "text-muted hover:text-foreground"
            }`}
          >
            Wix &rarr; Etsy
          </button>
        </div>

        {direction === "etsy-to-wix" && (
        <>
        <div className="mt-6 card-glass rounded-2xl p-6">
          <SyncSettings embedded />

          <div className="mt-6 border-t border-border pt-5">
          {loadingStatus ? (
            <p className="text-sm text-muted">Loading status&hellip;</p>
          ) : !status ? (
            <p className="text-sm text-red-500">Could not load status.</p>
          ) : (
            <>
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                    status.etsyConnected
                      ? "bg-emerald-400/10 text-emerald-600"
                      : "bg-red-400/10 text-red-500"
                  }`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  Etsy {status.etsyConnected ? "connected" : "not connected"}
                </span>
                <a
                  href="/api/etsy/reconnect"
                  target="_blank"
                  rel="noopener"
                  className="text-xs font-medium text-accent-violet underline-offset-2 hover:underline"
                >
                  {status.etsyConnected ? "Reconnect Etsy" : "Connect Etsy"}
                </a>
                {!status.isPremium && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/10 px-3 py-1 text-xs font-medium text-amber-600">
                    Not premium
                  </span>
                )}
              </div>

              <div className="mt-6 grid gap-3">
                {status.targetStores.map((store) => {
                  const progress = store.syncProgress;
                  const pct =
                    store.isSyncing && progress?.total
                      ? Math.min(100, Math.round((progress.current / progress.total) * 100))
                      : 0;

                  return (
                    <div
                      key={`${store.platform}-${store.storeId}`}
                      className="rounded-xl border border-border bg-surface px-4 py-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-foreground capitalize">
                            {store.platform}
                          </p>
                          <p className="text-xs text-muted">
                            {store.isSyncing
                              ? progress?.total
                                ? `Syncing: ${progress.current} / ${progress.total}`
                                : `Preparing your sync… (${elapsedSeconds}s)`
                              : store.lastSyncAt
                                ? `Last synced: ${new Date(store.lastSyncAt).toLocaleString("en-US")}`
                                : "Not synced yet"}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-muted">
                            {store.syncedProductCount} products
                          </span>
                          <span
                            className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
                              store.isSyncing
                                ? "bg-accent-violet/10 text-accent-violet"
                                : statusColor[store.lastSyncStatus]
                            }`}
                          >
                            {store.isSyncing ? "syncing" : store.lastSyncStatus}
                          </span>
                        </div>
                      </div>

                      {store.isSyncing && (
                        <div className="mt-3">
                          <div className="h-2 w-full overflow-hidden rounded-full bg-surface-2">
                            {progress?.total ? (
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-accent-orange via-accent-pink to-accent-violet transition-[width] duration-500 ease-out"
                                style={{ width: `${pct}%` }}
                              />
                            ) : (
                              <div className="h-full w-1/4 rounded-full bg-gradient-to-r from-accent-orange via-accent-pink to-accent-violet animate-sync-indeterminate" />
                            )}
                          </div>
                          <p className="mt-1 text-right text-[11px] text-muted">
                            {progress?.total ? `${pct}%` : "Reading your Etsy shop…"}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={handleSync}
                  disabled={syncing || !status.etsyConnected}
                  className="rounded-full bg-gradient-to-r from-accent-orange via-accent-pink to-accent-violet px-7 py-3.5 text-sm font-semibold text-white shadow-[0_0_40px_-10px_rgba(139,92,246,0.6)] transition-transform hover:scale-[1.01] disabled:opacity-50"
                >
                  {syncing ? (
                    <span className="inline-flex items-center gap-2">
                      <svg className="animate-sync-spin" width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path d="M2 12h20M16 5l7 7-7 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      Syncing&hellip;
                    </span>
                  ) : (
                    "Sync Now"
                  )}
                </button>

                <button
                  onClick={handlePreview}
                  disabled={previewing || syncing || !status.etsyConnected}
                  className="rounded-full border border-border px-7 py-3.5 text-sm font-semibold text-foreground transition-colors hover:bg-surface-2 disabled:opacity-50"
                >
                  {previewing ? "Checking…" : "Preview changes"}
                </button>
              </div>

              {syncing && (
                <div className="mt-4 rounded-xl border border-amber-400/30 bg-amber-400/5 p-4 text-sm text-foreground">
                  <p className="font-medium">
                    Your Etsy listings are being synced to your Wix store.
                    This can take a few minutes depending on how many
                    products you have.
                  </p>
                  <p className="mt-1 text-amber-700">
                    Please don&apos;t close this tab until the sync finishes.
                  </p>
                </div>
              )}

              {justFinished && !error && (
                <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-400/30 bg-emerald-400/5 p-4 text-sm font-medium text-emerald-700">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M20 6L9 17l-5-5"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Sync finished.
                </div>
              )}
            </>
          )}
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-red-400/30 bg-red-400/5 p-4 text-sm text-red-500">
            {error}
          </div>
        )}

        {runResult && (
          <div className="mt-4 card-glass rounded-2xl p-6">
            <p className="text-sm font-semibold text-foreground">
              {runResult.message}
            </p>
            <div className="mt-4 grid gap-3">
              {Object.entries(runResult.results).map(([key, r]) => (
                <div key={key} className="rounded-xl border border-border bg-surface px-4 py-3 text-sm">
                  <p className="font-medium text-foreground">{key}</p>
                  <p className="mt-1 text-xs text-muted">
                    {r.total} products: {r.created} created, {r.updated} updated, {r.failed} failed
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {previewError && (
          <div className="mt-4 rounded-xl border border-red-400/30 bg-red-400/5 p-4 text-sm text-red-500">
            {previewError}
          </div>
        )}

        {previewResult && (
          <div className="mt-4 card-glass rounded-2xl p-6">
            <p className="text-sm font-semibold text-foreground">
              What would happen if you synced right now
            </p>
            <div className="mt-4 grid gap-3">
              {Object.entries(previewResult.results).map(([key, r]) => {
                if (r.error) {
                  return (
                    <div key={key} className="rounded-xl border border-border bg-surface px-4 py-3 text-sm">
                      <p className="font-medium text-foreground">{key}</p>
                      <p className="mt-1 text-xs text-red-500">{r.error}</p>
                    </div>
                  );
                }

                const notable = r.items.filter((i) => i.action === "create" || i.action === "update");
                const expanded = expandedPreviewStore === key;

                return (
                  <div key={key} className="rounded-xl border border-border bg-surface px-4 py-3 text-sm">
                    <p className="font-medium text-foreground">{key}</p>
                    <p className="mt-1 text-xs text-muted">
                      {r.toCreate} to create &middot; {r.toUpdate} to update &middot; {r.unchanged} unchanged
                      {r.toHide > 0 ? ` · ${r.toHide} to hide (removed from Etsy)` : ""}
                    </p>

                    {notable.length > 0 && (
                      <>
                        <button
                          type="button"
                          onClick={() => setExpandedPreviewStore(expanded ? null : key)}
                          className="mt-2 text-xs font-medium text-accent-violet hover:underline"
                        >
                          {expanded ? "Hide details" : `Show ${notable.length} change${notable.length === 1 ? "" : "s"}`}
                        </button>

                        {expanded && (
                          <ul className="mt-3 max-h-72 space-y-2 overflow-y-auto rounded-lg border border-border bg-background p-3">
                            {notable.map((item) => (
                              <li key={item.sku} className="text-xs">
                                <span className="font-medium text-foreground">{item.name || item.sku}</span>
                                {item.action === "create" ? (
                                  <span className="ml-1.5 rounded-full bg-emerald-400/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-600">
                                    New
                                  </span>
                                ) : (
                                  <ul className="mt-1 space-y-0.5 text-muted">
                                    {(item.changes || []).map((c) => (
                                      <li key={c.field}>
                                        {c.field}
                                        {c.from !== null && c.to !== null
                                          ? `: ${String(c.from)} → ${String(c.to)}`
                                          : " changed"}
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </li>
                            ))}
                          </ul>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
        </>
        )}

        {direction === "wix-to-etsy" && <EtsyListingDefaults />}

        <ReviewsSettings />
        <SyncHistory refreshKey={historyKey} />
      </main>
    </div>
  );
}
