"use client";

import { useEffect, useMemo, useState } from "react";

type StoreProduct = {
  id: string;
  name: string;
  price: number;
  sku: string | null;
  thumbnailUrl: string | null;
};

/**
 * Store -> Etsy product picker: which Wix/Shopify-native products should be
 * published to Etsy. Used two ways:
 *
 * - No `userId` (default): the existing dashboard usage, session-based,
 *   backed by /api/sync/store-products + /api/sync/store-product-selection.
 * - `userId` set: the pre-login setup wizard shown right after connecting
 *   Etsy for the first time (no session yet) - same trust model as
 *   SetupSyncWizard's own "connect" variant, backed by the onboarding
 *   /api/setup-sync/store-products + /api/setup-sync/store-product-selection
 *   routes instead.
 *
 * Either way, the plan's product cap (utils/planLimits.js on the backend)
 * applies here exactly like it does to the Etsy -> store picker - a Free
 * account gets 5 products total regardless of which direction they came
 * from.
 */
export default function StoreProductPicker({
  onDone,
  platform = "your store",
  userId,
  planLabel,
}: {
  onDone?: () => void;
  platform?: string;
  userId?: string;
  planLabel?: string;
}) {
  const isConnect = Boolean(userId);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [mode, setMode] = useState<"all" | "custom">("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [planLimit, setPlanLimit] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const productsUrl = isConnect
    ? `/api/setup-sync/store-products?userId=${encodeURIComponent(userId!)}`
    : "/api/sync/store-products";
  const selectionUrl = isConnect
    ? `/api/setup-sync/store-product-selection?userId=${encodeURIComponent(userId!)}`
    : "/api/sync/store-product-selection";

  useEffect(() => {
    (async () => {
      const [productsRes, selectionRes] = await Promise.all([
        fetch(productsUrl),
        fetch(selectionUrl),
      ]);

      if (productsRes.ok) {
        const data = await productsRes.json();
        setProducts(data.products ?? []);
      } else {
        setError(`Could not load your ${platform} products.`);
      }

      if (selectionRes.ok) {
        const data = await selectionRes.json();
        setMode(data.mode === "custom" ? "custom" : "all");
        setSelected(new Set((data.selectedProductIds ?? []) as string[]));
        setPlanLimit(data.planLimit ?? null);
      }

      setLoading(false);
      // productsUrl/selectionUrl are derived from userId/platform, already covered below
      // eslint-disable-next-line react-hooks/exhaustive-deps
    })();
  }, [platform, userId]);

  const atCustomLimit = planLimit !== null && selected.size >= planLimit;
  const allModeOverLimit = planLimit !== null && products.length > planLimit;

  const planNote = useMemo(
    () =>
      planLimit !== null
        ? `Your ${planLabel ?? "current"} plan allows up to ${planLimit} product${planLimit === 1 ? "" : "s"} total, across both directions.`
        : null,
    [planLimit, planLabel]
  );

  function chooseMode(next: "all" | "custom") {
    setMode(next);
    if (next === "custom" && selected.size === 0) {
      const initial = planLimit !== null ? products.slice(0, planLimit) : products;
      setSelected(new Set(initial.map((p) => p.id)));
    }
  }

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        if (planLimit !== null && next.size >= planLimit) return prev;
        next.add(id);
      }
      return next;
    });
  }

  function selectAll() {
    const capped = planLimit !== null ? products.slice(0, planLimit) : products;
    setSelected(new Set(capped.map((p) => p.id)));
  }

  function selectNone() {
    setSelected(new Set());
  }

  async function save() {
    if (mode === "custom" && planLimit !== null && selected.size > planLimit) {
      setError(
        `You've selected ${selected.size} products, but your plan allows up to ${planLimit}. Remove some, or upgrade your plan.`
      );
      return;
    }

    setSaving(true);
    setError(null);

    const res = await fetch(selectionUrl, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...(isConnect ? { userId } : {}),
        mode,
        selectedProductIds: Array.from(selected),
      }),
    });

    setSaving(false);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error || "Could not save. Try again.");
      return;
    }
    onDone?.();
  }

  if (loading) return <p className="mt-4 text-sm text-muted">Loading your {platform} products…</p>;

  return (
    <div className="mt-4 rounded-2xl border border-border bg-surface p-5">
      <p className="text-sm font-medium text-foreground">Which {platform} products should we publish to Etsy?</p>
      <p className="mt-1 text-xs text-muted">
        Only products that don&apos;t already have a matching Etsy listing show up here.
      </p>

      {planNote && (
        <p className="mt-3 rounded-xl border border-amber-400/30 bg-amber-400/5 px-3.5 py-2.5 text-xs font-medium text-amber-700">
          {planNote}
        </p>
      )}

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => chooseMode("all")}
          className={`rounded-xl border px-3.5 py-3 text-left transition-colors ${
            mode === "all" ? "border-accent-blue/50 bg-accent-blue/5" : "border-border bg-background"
          }`}
        >
          <span className="block text-sm font-medium text-foreground">All eligible products</span>
          <span className="block text-[11px] text-muted">New {platform}-only products publish automatically too</span>
        </button>
        <button
          type="button"
          onClick={() => chooseMode("custom")}
          className={`rounded-xl border px-3.5 py-3 text-left transition-colors ${
            mode === "custom" ? "border-accent-blue/50 bg-accent-blue/5" : "border-border bg-background"
          }`}
        >
          <span className="block text-sm font-medium text-foreground">I&apos;ll pick them myself</span>
          <span className="block text-[11px] text-muted">Pick exactly which products publish ({products.length} available)</span>
        </button>
      </div>

      {mode === "all" && allModeOverLimit && (
        <p className="mt-2.5 rounded-xl border border-amber-400/30 bg-amber-400/5 px-3.5 py-2.5 text-xs font-medium text-amber-700">
          You have {products.length} eligible products but your plan allows{" "}
          {planLimit}. We&apos;ll publish your {planLimit} oldest ones until
          you upgrade or choose specific products.
        </p>
      )}

      {mode === "custom" && (
        <>
          <div className="mt-4 flex items-center justify-between">
            <p className={`text-xs font-medium ${atCustomLimit ? "text-amber-600" : "text-muted"}`}>
              {selected.size} of {products.length} selected
              {planLimit !== null ? ` (max ${planLimit} on your plan)` : ""}
            </p>
            <div className="flex gap-3 text-xs font-medium text-accent-blue">
              <button type="button" onClick={selectAll} className="hover:underline">
                Select all
              </button>
              <button type="button" onClick={selectNone} className="hover:underline">
                Select none
              </button>
            </div>
          </div>

          <div className="mt-2 max-h-72 overflow-y-auto rounded-xl border border-border">
            {products.length === 0 ? (
              <p className="p-4 text-xs text-muted">No eligible {platform} products found.</p>
            ) : (
              <ul className="divide-y divide-border">
                {products.map((p) => {
                  const isSelected = selected.has(p.id);
                  const disabled = !isSelected && atCustomLimit;
                  return (
                    <li key={p.id}>
                      <label
                        className={`flex items-center gap-3 px-3.5 py-2.5 ${
                          disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:bg-surface-2"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          disabled={disabled}
                          onChange={() => toggle(p.id)}
                          className="h-4 w-4 shrink-0 rounded border-border accent-accent-blue"
                        />
                        {p.thumbnailUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={p.thumbnailUrl} alt="" className="h-8 w-8 shrink-0 rounded object-cover" />
                        ) : (
                          <span className="h-8 w-8 shrink-0 rounded bg-surface-2" />
                        )}
                        <span className="min-w-0 flex-1 truncate text-xs text-foreground">{p.name}</span>
                        <span className="shrink-0 text-[11px] text-muted">${p.price.toFixed(2)}</span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </>
      )}

      {error && <p className="mt-3 text-xs font-medium text-red-500">{error}</p>}

      <button
        type="button"
        onClick={save}
        disabled={saving}
        className="mt-4 rounded-full bg-gradient-to-r from-accent-blue to-accent-orange px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-[1.02] disabled:opacity-60"
      >
        {saving ? "Saving…" : "Save changes"}
      </button>
    </div>
  );
}
