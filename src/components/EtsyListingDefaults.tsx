"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Option = { id: number; title?: string; label?: string };
type TaxonomyResult = { id: number; fullPath: string };

const WHO_MADE_OPTIONS = [
  { value: "i_did", label: "I did" },
  { value: "someone_else", label: "A member of my shop" },
  { value: "collective", label: "Another company or person" },
];

// Deliberately stops at fixed historical buckets rather than including
// Etsy's rolling "recent years" enum value (its exact token has drifted
// across API versions in ways that weren't possible to verify with
// confidence) - "Made to order" already covers the realistic case for
// products coming from a Wix store, so there's no real loss here.
const WHEN_MADE_OPTIONS = [
  { value: "made_to_order", label: "Made to order" },
  { value: "1990s", label: "1990s" },
  { value: "1980s", label: "1980s" },
  { value: "1970s", label: "1970s" },
  { value: "1960s", label: "1960s" },
  { value: "1950s", label: "1950s" },
  { value: "1940s", label: "1940s" },
  { value: "1930s", label: "1930s" },
  { value: "1920s", label: "1920s" },
  { value: "1910s", label: "1910s" },
  { value: "1900s", label: "1900s" },
  { value: "1800s", label: "1800s" },
  { value: "1700s", label: "1700s" },
  { value: "before_1700", label: "Before 1700" },
];

export default function EtsyListingDefaults() {
  const [loading, setLoading] = useState(true);
  const [shippingProfiles, setShippingProfiles] = useState<Option[]>([]);
  const [readinessStates, setReadinessStates] = useState<Option[]>([]);
  const [shippingProfileId, setShippingProfileId] = useState("");
  const [readinessStateId, setReadinessStateId] = useState("");
  const [whoMade, setWhoMade] = useState("i_did");
  const [whenMade, setWhenMade] = useState("made_to_order");

  const [taxonomyId, setTaxonomyId] = useState<number | null>(null);
  const [taxonomyName, setTaxonomyName] = useState<string | null>(null);
  const [taxonomyQuery, setTaxonomyQuery] = useState("");
  const [taxonomyResults, setTaxonomyResults] = useState<TaxonomyResult[]>([]);
  const [taxonomyOpen, setTaxonomyOpen] = useState(false);

  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [optionsError, setOptionsError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const [optionsRes, defaultsRes] = await Promise.all([
        fetch("/api/sync/etsy-listing-options"),
        fetch("/api/sync/etsy-listing-defaults"),
      ]);

      if (optionsRes.ok) {
        const data = await optionsRes.json();
        setShippingProfiles(data.shippingProfiles ?? []);
        setReadinessStates(data.readinessStates ?? []);
        if (!(data.shippingProfiles ?? []).length) {
          setOptionsError("No shipping profiles found on your Etsy shop yet - add one on Etsy first.");
        }
      } else {
        setOptionsError("Could not load options from Etsy. Try reloading this page.");
      }

      if (defaultsRes.ok) {
        const data = await defaultsRes.json();
        setShippingProfileId(data.shippingProfileId ? String(data.shippingProfileId) : "");
        setReadinessStateId(data.readinessStateId ? String(data.readinessStateId) : "");
        setWhoMade(data.whoMade ?? "i_did");
        setWhenMade(data.whenMade ?? "made_to_order");
        setTaxonomyId(data.taxonomyId ?? null);
        setTaxonomyName(data.taxonomyName ?? null);
      }

      setLoading(false);
    })();
  }, []);

  // Debounced taxonomy search - the full category tree is tens of
  // thousands of nodes, so this is a plain substring search rather than a
  // nested picker.
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    if (!taxonomyQuery.trim()) {
      setTaxonomyResults([]);
      return;
    }
    searchTimer.current = setTimeout(async () => {
      const res = await fetch(`/api/sync/etsy-taxonomy?q=${encodeURIComponent(taxonomyQuery)}`);
      if (res.ok) {
        const data = await res.json();
        setTaxonomyResults(data.results ?? []);
      }
    }, 300);
    return () => {
      if (searchTimer.current) clearTimeout(searchTimer.current);
    };
  }, [taxonomyQuery]);

  const save = useCallback(async () => {
    setSaving(true);
    setError(null);

    const res = await fetch("/api/sync/etsy-listing-defaults", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        taxonomyId,
        taxonomyName,
        shippingProfileId: shippingProfileId || null,
        readinessStateId: readinessStateId || null,
        whoMade,
        whenMade,
      }),
    });

    setSaving(false);
    if (!res.ok) {
      setError("Could not save. Try again.");
      return;
    }
    setSavedAt(Date.now());
  }, [taxonomyId, taxonomyName, shippingProfileId, readinessStateId, whoMade, whenMade]);

  if (loading) return null;

  const configured = Boolean(taxonomyId && shippingProfileId && readinessStateId);

  return (
    <div className="mt-4 card-glass rounded-2xl p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
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
        A product created in Wix has no Etsy listing yet. Fill in these three
        fields (Etsy requires them, Wix has no equivalent) and MirrorStock
        will publish new Wix-only products to Etsy as drafts for you to
        review - it never activates them automatically.
      </p>

      {optionsError && <p className="mt-3 text-xs font-medium text-red-500">{optionsError}</p>}

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-foreground">Etsy category</label>
          <div className="relative mt-1.5">
            <input
              type="text"
              value={taxonomyName ? taxonomyName : taxonomyQuery}
              onChange={(e) => {
                setTaxonomyName(null);
                setTaxonomyId(null);
                setTaxonomyQuery(e.target.value);
                setTaxonomyOpen(true);
              }}
              onFocus={() => setTaxonomyOpen(true)}
              placeholder="Search e.g. “T-shirts”"
              className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-accent-violet"
            />
            {taxonomyOpen && taxonomyResults.length > 0 && (
              <ul className="absolute z-10 mt-1 max-h-56 w-full overflow-y-auto rounded-lg border border-border bg-surface shadow-lg">
                {taxonomyResults.map((t) => (
                  <li key={t.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setTaxonomyId(t.id);
                        setTaxonomyName(t.fullPath);
                        setTaxonomyQuery("");
                        setTaxonomyResults([]);
                        setTaxonomyOpen(false);
                      }}
                      className="block w-full px-3.5 py-2 text-left text-xs text-foreground hover:bg-surface-2"
                    >
                      {t.fullPath}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <p className="mt-1 text-[11px] text-muted">
            Used for every new listing - you can pick a more specific one on
            Etsy afterward if needed.
          </p>
        </div>

        <div>
          <label className="text-sm font-medium text-foreground">Shipping profile</label>
          <select
            value={shippingProfileId}
            onChange={(e) => setShippingProfileId(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-accent-violet"
          >
            <option value="">Select option</option>
            {shippingProfiles.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-foreground">Processing profile</label>
          <select
            value={readinessStateId}
            onChange={(e) => setReadinessStateId(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-accent-violet"
          >
            <option value="">Select option</option>
            {readinessStates.map((r) => (
              <option key={r.id} value={r.id}>
                {r.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-foreground">Who made it</label>
          <select
            value={whoMade}
            onChange={(e) => setWhoMade(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-accent-violet"
          >
            {WHO_MADE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-foreground">When was it made</label>
          <select
            value={whenMade}
            onChange={(e) => setWhenMade(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-accent-violet"
          >
            {WHEN_MADE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && <p className="mt-4 text-xs font-medium text-red-500">{error}</p>}

      <div className="mt-5 flex items-center gap-3">
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="rounded-full bg-gradient-to-r from-accent-orange via-accent-pink to-accent-violet px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-[1.02] disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save"}
        </button>
        {savedAt && !saving && <span className="text-xs font-medium text-emerald-600">Saved</span>}
      </div>
    </div>
  );
}
