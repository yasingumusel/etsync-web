"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/Logo";
import SyncHistory from "@/components/SyncHistory";
import SyncSettings from "@/components/SyncSettings";
import NotificationsBell from "@/components/NotificationsBell";
import AccountMenu from "@/components/AccountMenu";

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

const statusColor: Record<TargetStore["lastSyncStatus"], string> = {
  never: "bg-muted/20 text-muted",
  success: "bg-emerald-400/10 text-emerald-600",
  partial: "bg-amber-400/10 text-amber-600",
  failed: "bg-red-400/10 text-red-500",
};

export default function DashboardPage() {
  const router = useRouter();
  const [status, setStatus] = useState<StatusResponse | null>(null);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [justFinished, setJustFinished] = useState(false);
  const [runResult, setRunResult] = useState<RunResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [historyKey, setHistoryKey] = useState(0);

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const loadStatus = useCallback(async (): Promise<StatusResponse | null> => {
    const res = await fetch("/api/sync");
    if (!res.ok) return null;
    const data: StatusResponse = await res.json();
    setStatus(data);
    return data;
  }, []);

  useEffect(() => {
    loadStatus().finally(() => setLoadingStatus(false));
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [loadStatus]);

  function handleSync() {
    setSyncing(true);
    setJustFinished(false);
    setError(null);
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

  async function handleLogout() {
    await fetch("/api/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-grid">
      <header className="border-b border-border/60 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <Link href="/" aria-label="MirrorStock home">
            <Logo />
          </Link>
          <div className="flex items-center gap-3">
            <NotificationsBell refreshKey={historyKey} />
            <AccountMenu email={status?.email} plan={status?.plan} onLogout={handleLogout} />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-12">
        <h1 className="font-display text-2xl font-bold text-foreground">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-muted">
          Etsy &rarr; Wix product sync.
        </p>

        <div className="mt-8 card-glass rounded-2xl p-6">
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
                              ? `Syncing: ${progress.current} / ${progress.total}`
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
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-accent-orange via-accent-pink to-accent-violet transition-[width] duration-500 ease-out"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <p className="mt-1 text-right text-[11px] text-muted">{pct}%</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <button
                onClick={handleSync}
                disabled={syncing || !status.etsyConnected}
                className="mt-6 w-full rounded-full bg-gradient-to-r from-accent-orange via-accent-pink to-accent-violet px-7 py-3.5 text-sm font-semibold text-white shadow-[0_0_40px_-10px_rgba(139,92,246,0.6)] transition-transform hover:scale-[1.01] disabled:opacity-50 sm:w-auto"
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

        <SyncSettings />
        <SyncHistory refreshKey={historyKey} />
      </main>
    </div>
  );
}
