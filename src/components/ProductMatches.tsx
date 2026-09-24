"use client";

import { useCallback, useEffect, useState } from "react";

type Match = {
  sku: string;
  productId: string;
  etsyTitle: string;
  etsyImage: string | null;
  storeTitle: string;
  storeImage: string | null;
  reason: "sku" | "title" | "similar" | "confirmed";
  direction: "etsy-to-store" | "store-to-etsy";
};

type HeldBack = {
  productId: string;
  name: string;
  reason: "exists-on-etsy";
  detail: string;
};

type MatchesResponse = {
  platform: string;
  suggestions: Match[];
  linked: Match[];
  heldBack: HeldBack[];
};

const reasonLabel: Record<Match["reason"], string> = {
  sku: "same SKU",
  title: "same name",
  similar: "similar name",
  confirmed: "you confirmed",
};

const heldBackLabel: Record<HeldBack["reason"], (detail: string) => string> = {
  "exists-on-etsy": (d) =>
    `Matches an Etsy listing that isn't active: “${d}”. Etsy deactivates listings it takes down, so we never upload these again.`,
};

function Thumb({ src }: { src: string | null }) {
  return src ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt="" className="h-12 w-12 shrink-0 rounded-lg border border-border object-cover" />
  ) : (
    <div className="h-12 w-12 shrink-0 rounded-lg border border-border bg-surface-2" aria-hidden />
  );
}

/**
 * "Is this the same product?" - products that seem to exist both on Etsy and
 * in the merchant's store. MirrorStock links exact matches itself; anything
 * less certain waits here, and is neither created in the store nor published
 * to Etsy until the merchant answers - so connecting a store that already
 * has products never produces duplicates.
 */
export default function ProductMatches({
  platformQs,
  storeLabel,
  refreshKey,
}: {
  platformQs: string;
  storeLabel: string;
  refreshKey: number;
}) {
  const [data, setData] = useState<MatchesResponse | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [showLinked, setShowLinked] = useState(false);
  const [showHeld, setShowHeld] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await fetch(`/api/sync/matches${platformQs}`);
    if (res.ok) setData(await res.json());
  }, [platformQs]);

  useEffect(() => {
    load();
  }, [load, refreshKey]);

  async function decide(body: { decision: string; sku?: string; productId?: string }, key: string) {
    setBusy(key);
    setError(null);
    try {
      const res = await fetch(`/api/sync/matches${platformQs}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const b = await res.json().catch(() => ({}));
        setError(b.error || "Could not save your answer");
      }
      await load();
    } finally {
      setBusy(null);
    }
  }

  if (!data) return null;
  const { suggestions, linked, heldBack } = data;
  if (!suggestions.length && !linked.length && !heldBack.length) return null;

  return (
    <section id="product-matches" className="mt-4 card-glass rounded-2xl p-6" aria-labelledby="product-matches-title">
      <h2 id="product-matches-title" className="font-display text-base font-semibold text-foreground">
        Products on both sides
      </h2>
      <p className="mt-1 text-xs leading-relaxed text-muted">
        Some products seem to exist both on Etsy and in your {storeLabel} store. Linking them keeps one
        product instead of a duplicate. A linked product is then updated from Etsy like any other, so
        turn off a field under &ldquo;What to sync&rdquo; if you want to keep your {storeLabel} version of it.
      </p>

      {error && <p className="mt-3 text-xs text-red-500">{error}</p>}

      {suggestions.length > 0 && (
        <>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-semibold text-foreground">{suggestions.length} waiting for your answer</p>
            {suggestions.length > 1 && (
              <button
                type="button"
                disabled={busy !== null}
                onClick={() => decide({ decision: "link-all" }, "all")}
                className="text-xs font-semibold text-accent-violet hover:underline disabled:opacity-50"
              >
                {busy === "all" ? "Linking…" : "They're all the same - link all"}
              </button>
            )}
          </div>
          <ul className="mt-3 space-y-3">
            {suggestions.map((m) => {
              const key = `${m.sku}|${m.productId}`;
              return (
                <li key={key} className="rounded-xl border border-border bg-surface p-3">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="flex min-w-0 items-center gap-3">
                      <Thumb src={m.etsyImage} />
                      <div className="min-w-0">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-accent-orange">Etsy</p>
                        <p className="truncate text-sm text-foreground" title={m.etsyTitle}>
                          {m.etsyTitle}
                        </p>
                      </div>
                    </div>
                    <div className="flex min-w-0 items-center gap-3">
                      <Thumb src={m.storeImage} />
                      <div className="min-w-0">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-accent-blue">{storeLabel}</p>
                        <p className="truncate text-sm text-foreground" title={m.storeTitle}>
                          {m.storeTitle}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="text-[11px] text-muted">Matched by {reasonLabel[m.reason]}</span>
                    <span className="flex-1" />
                    <button
                      type="button"
                      disabled={busy !== null}
                      onClick={() => decide({ decision: "link", sku: m.sku, productId: m.productId }, key)}
                      className="rounded-full bg-accent-violet px-3.5 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
                    >
                      Same product
                    </button>
                    <button
                      type="button"
                      disabled={busy !== null}
                      onClick={() => decide({ decision: "separate", sku: m.sku, productId: m.productId }, key)}
                      className="rounded-full border border-border px-3.5 py-1.5 text-xs font-semibold text-foreground disabled:opacity-50"
                    >
                      Different products
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </>
      )}

      {linked.length > 0 && (
        <div className="mt-5">
          <button
            type="button"
            onClick={() => setShowLinked((v) => !v)}
            className="text-xs font-medium text-accent-violet hover:underline"
          >
            {showLinked ? "Hide" : "Show"} {linked.length} linked product{linked.length === 1 ? "" : "s"}
          </button>
          {showLinked && (
            <ul className="mt-2 divide-y divide-border rounded-xl border border-border bg-surface">
              {linked.map((m) => (
                <li key={m.sku} className="flex flex-wrap items-center gap-3 px-4 py-2.5">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-foreground">{m.storeTitle}</p>
                    <p className="text-[11px] text-muted">
                      Linked to &ldquo;{m.etsyTitle}&rdquo; · {reasonLabel[m.reason]}
                    </p>
                  </div>
                  <button
                    type="button"
                    disabled={busy !== null}
                    onClick={() => decide({ decision: "unlink", sku: m.sku }, m.sku)}
                    className="text-xs font-medium text-muted underline underline-offset-2 hover:text-foreground disabled:opacity-50"
                  >
                    Not the same - unlink
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {heldBack.length > 0 && (
        <div className="mt-5">
          <button
            type="button"
            onClick={() => setShowHeld((v) => !v)}
            className="text-xs font-medium text-accent-violet hover:underline"
          >
            {showHeld ? "Hide" : "Show"} {heldBack.length} product{heldBack.length === 1 ? "" : "s"} we won&apos;t
            publish to Etsy
          </button>
          {showHeld && (
            <ul className="mt-2 divide-y divide-border rounded-xl border border-border bg-surface">
              {heldBack.map((h) => (
                <li key={h.productId} className="px-4 py-2.5">
                  <p className="truncate text-sm text-foreground">{h.name}</p>
                  <p className="text-[11px] text-muted">{heldBackLabel[h.reason](h.detail)}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </section>
  );
}
