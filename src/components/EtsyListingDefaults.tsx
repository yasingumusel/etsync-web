"use client";

import { useCallback, useEffect, useState } from "react";
import StoreProductPicker from "@/components/StoreProductPicker";
import EtsyListingDefaultsFields from "@/components/EtsyListingDefaultsFields";
import ConnectionBadges, { type ConnectionStatus } from "@/components/ConnectionBadges";

export default function EtsyListingDefaults({ platform }: { platform?: "Wix" | "Shopify" } = {}) {
  const [loading, setLoading] = useState(true);
  const [configured, setConfigured] = useState(false);

  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<string | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);

  const [pickerOpen, setPickerOpen] = useState(false);
  const [connection, setConnection] = useState<ConnectionStatus | null>(null);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/sync");
      if (res.ok) setConnection(await res.json());
      setLoading(false);
    })();
  }, []);

  const syncNow = useCallback(async () => {
    setSyncing(true);
    setSyncError(null);
    setSyncResult(null);

    const res = await fetch(`/api/sync/sync-to-etsy${platform ? `?platform=${platform.toLowerCase()}` : ""}`, {
      method: "POST",
    });
    const body = await res.json().catch(() => ({}));

    setSyncing(false);
    if (!res.ok) {
      setSyncError(body.error || "Could not sync. Try again.");
      return;
    }

    const totals = Object.values(
      (body.results ?? {}) as Record<string, { pushedToEtsy?: number; createdOnEtsy?: number }>
    ).reduce(
      (acc, r) => ({
        pushed: acc.pushed + (r.pushedToEtsy || 0),
        created: acc.created + (r.createdOnEtsy || 0),
      }),
      { pushed: 0, created: 0 }
    );

    setSyncResult(
      totals.pushed || totals.created
        ? [
            totals.pushed > 0 && `${totals.pushed} edit${totals.pushed > 1 ? "s" : ""} pushed to Etsy`,
            totals.created > 0 && `${totals.created} new draft${totals.created > 1 ? "s" : ""} published`,
          ]
            .filter(Boolean)
            .join(" · ")
        : "Nothing new to sync."
    );
  }, [platform]);

  if (loading) return null;

  // Whichever store this merchant actually sells on - the panel never says
  // "Wix" to a Shopify merchant, or the other way round.
  const storeLabel =
    platform ??
    (connection && connection.targetStores.some((s) => s.platform === "shopify") ? "Shopify" : "Wix");

  return (
    <div className="mt-4 card-glass rounded-2xl p-6">
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest">
        <span className="text-accent-blue">{storeLabel}</span>
        <svg width="14" height="10" viewBox="0 0 14 10" fill="none" className="text-muted">
          <path
            d="M1 5h11M8 1l4 4-4 4"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="text-accent-orange">Etsy</span>
      </span>

      <div className="mt-1.5 flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-display text-base font-semibold text-foreground">
          Defaults for new Etsy listings
        </h2>
        <span
          className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
            configured ? "bg-emerald-600/10 text-emerald-600" : "bg-surface-2 text-muted"
          }`}
        >
          {configured ? "On" : "Off"}
        </span>
      </div>
      <p className="mt-1 text-xs leading-relaxed text-muted">
        A product created in {storeLabel} has no Etsy listing yet. Fill in
        these three fields (Etsy requires them, {storeLabel} has no
        equivalent) and MirrorStock will publish new {storeLabel}-only
        products to Etsy as drafts for you to review - it never activates
        them automatically.
      </p>

      <button
        type="button"
        onClick={() => setPickerOpen((v) => !v)}
        className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-accent-blue/40 bg-accent-blue/5 px-4 py-2 text-sm font-semibold text-accent-blue transition-colors hover:bg-accent-blue/10"
      >
        {pickerOpen ? "Hide product picker" : "Choose which products sync"}
        <span aria-hidden>{pickerOpen ? "↑" : "→"}</span>
      </button>

      {pickerOpen && <StoreProductPicker platform={storeLabel} onDone={() => setPickerOpen(false)} />}

      <div className="mt-5">
        <EtsyListingDefaultsFields platform={storeLabel} onConfiguredChange={setConfigured} />
      </div>

      <div className="mt-6 border-t border-border pt-5">
        {connection && (
          <div className="mb-4">
            <ConnectionBadges status={connection} />
          </div>
        )}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-foreground">Sync {storeLabel} → Etsy</p>
            <p className="mt-0.5 text-xs text-muted">
              Pushes any {storeLabel} edits and new {storeLabel}-only
              products to Etsy right now, separately from the regular
              Etsy → {storeLabel} sync.
            </p>
          </div>
          <button
            type="button"
            onClick={syncNow}
            disabled={syncing || !configured}
            className="shrink-0 rounded-full bg-gradient-to-r from-accent-orange via-accent-pink to-accent-violet px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-[1.02] disabled:opacity-60"
          >
            {syncing ? "Syncing…" : `Sync ${storeLabel} → Etsy now`}
          </button>
        </div>
        {!configured && (
          <p className="mt-2 text-[11px] text-muted">
            Fill in the fields above and save first.
          </p>
        )}
        {syncResult && !syncing && (
          <p className="mt-2 text-xs font-medium text-emerald-600">{syncResult}</p>
        )}
        {syncError && !syncing && (
          <p className="mt-2 text-xs font-medium text-red-500">{syncError}</p>
        )}
      </div>
    </div>
  );
}
