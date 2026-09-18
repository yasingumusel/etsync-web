"use client";

import { useCallback, useEffect, useState } from "react";

type Fields = Record<string, boolean>;

type Store = {
  platform: string;
  storeId: string;
  syncFields: Fields;
};

const FIELDS: { key: string; label: string; hint: string }[] = [
  { key: "title", label: "Product name", hint: "Keep the Wix name matching your Etsy title" },
  { key: "description", label: "Description", hint: "Keep the Wix description matching Etsy" },
  { key: "price", label: "Prices", hint: "Including each variation's own price" },
  { key: "sku", label: "SKUs", hint: "Including each variation's own SKU" },
  { key: "images", label: "Images", hint: "Replace Wix photos with your Etsy photos" },
  { key: "etsyLink", label: "“View on Etsy” link", hint: "Adds a link to the original listing" },
  { key: "convertCurrency", label: "Convert currency", hint: "If your two stores use different currencies" },
];

export default function SyncSettings() {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/sync/settings");
    if (res.ok) {
      const data = await res.json();
      setStores(data.targetStores ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function toggle(storeId: string, key: string, value: boolean) {
    const store = stores.find((s) => s.storeId === storeId);
    if (!store) return;

    const next = { ...store.syncFields, [key]: value };
    setStores((prev) => prev.map((s) => (s.storeId === storeId ? { ...s, syncFields: next } : s)));
    setSaving(`${storeId}:${key}`);
    setError(null);

    const res = await fetch("/api/sync/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ storeId, fields: next }),
    });

    setSaving(null);

    if (!res.ok) {
      setError("Could not save that change.");
      load(); // put the checkbox back to whatever the server actually has
      return;
    }
    setSavedAt(Date.now());
  }

  if (loading) return null;
  if (!stores.length) return null;

  return (
    <div className="mt-4 card-glass rounded-2xl p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-display text-base font-semibold text-foreground">
          What to sync
        </h2>
        {savedAt && !saving && (
          <span className="text-xs font-medium text-emerald-600">Saved</span>
        )}
      </div>
      <p className="mt-1 text-xs leading-relaxed text-muted">
        Switch something off and a sync will stop overwriting it, so you can
        edit it in Wix and keep your changes. New products are always created
        with everything, since Wix needs a name and a price to make one.
      </p>

      <a
        href="/dashboard/products"
        className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-accent-violet hover:underline"
      >
        Choose which products sync &rarr;
      </a>

      {error && <p className="mt-3 text-xs font-medium text-red-500">{error}</p>}

      <div className="mt-5 space-y-6">
        {stores.map((store) => (
          <div key={store.storeId}>
            {stores.length > 1 && (
              <p className="mb-2 text-xs font-semibold capitalize text-muted">
                {store.platform}
              </p>
            )}

            <div className="grid gap-2 sm:grid-cols-2">
              {FIELDS.map((f) => {
                const checked = store.syncFields[f.key] !== false;
                const busy = saving === `${store.storeId}:${f.key}`;

                return (
                  <label
                    key={f.key}
                    className={`flex cursor-pointer items-start gap-2.5 rounded-xl border px-3.5 py-3 transition-colors ${
                      checked
                        ? "border-accent-violet/40 bg-accent-violet/5"
                        : "border-border bg-surface"
                    } ${busy ? "opacity-60" : ""}`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      disabled={busy}
                      onChange={(e) => toggle(store.storeId, f.key, e.target.checked)}
                      className="mt-0.5 h-4 w-4 shrink-0 rounded border-border accent-accent-violet"
                    />
                    <span className="min-w-0">
                      <span className="block text-sm font-medium text-foreground">
                        {f.label}
                      </span>
                      <span className="block text-[11px] leading-relaxed text-muted">
                        {f.hint}
                      </span>
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
