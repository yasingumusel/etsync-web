"use client";

import { useEffect, useState } from "react";

type StoreProduct = {
  id: string;
  name: string;
  price: number;
  sku: string | null;
  thumbnailUrl: string | null;
};

export default function StoreProductPicker({
  onDone,
  platform = "your store",
}: {
  onDone?: () => void;
  platform?: string;
}) {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [mode, setMode] = useState<"all" | "custom">("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const [productsRes, selectionRes] = await Promise.all([
        fetch("/api/sync/store-products"),
        fetch("/api/sync/store-product-selection"),
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
      }

      setLoading(false);
    })();
  }, [platform]);

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function save() {
    setSaving(true);
    setError(null);

    const res = await fetch("/api/sync/store-product-selection", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode, selectedProductIds: Array.from(selected) }),
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

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => setMode("all")}
          className={`rounded-xl border px-3.5 py-3 text-left transition-colors ${
            mode === "all" ? "border-accent-blue/50 bg-accent-blue/5" : "border-border bg-background"
          }`}
        >
          <span className="block text-sm font-medium text-foreground">All eligible products</span>
          <span className="block text-[11px] text-muted">New {platform}-only products publish automatically too</span>
        </button>
        <button
          type="button"
          onClick={() => setMode("custom")}
          className={`rounded-xl border px-3.5 py-3 text-left transition-colors ${
            mode === "custom" ? "border-accent-blue/50 bg-accent-blue/5" : "border-border bg-background"
          }`}
        >
          <span className="block text-sm font-medium text-foreground">I&apos;ll pick them myself</span>
          <span className="block text-[11px] text-muted">Pick exactly which products publish ({products.length} available)</span>
        </button>
      </div>

      {mode === "custom" && (
        <div className="mt-4 max-h-72 overflow-y-auto rounded-xl border border-border">
          {products.length === 0 ? (
            <p className="p-4 text-xs text-muted">No eligible {platform} products found.</p>
          ) : (
            <ul className="divide-y divide-border">
              {products.map((p) => (
                <li key={p.id}>
                  <label className="flex cursor-pointer items-center gap-3 px-3.5 py-2.5 hover:bg-surface-2">
                    <input
                      type="checkbox"
                      checked={selected.has(p.id)}
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
              ))}
            </ul>
          )}
        </div>
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
