"use client";

import { useEffect, useState } from "react";

type ReviewProduct = {
  listingId: string;
  title: string;
  thumbnailUrl: string | null;
  reviewCount: number;
  averageRating: number | null;
  hidden: boolean;
};

function Stars({ rating }: { rating: number }) {
  const full = Math.round(rating);
  return (
    <span className="inline-flex items-center gap-0.5 text-accent-violet" aria-hidden>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="12" height="12" viewBox="0 0 16 16" style={{ opacity: i < full ? 1 : 0.25 }}>
          <path
            d="M8 1.2l2.02 4.1 4.53.66-3.28 3.2.77 4.5L8 11.5l-4.04 2.16.77-4.5-3.28-3.2 4.53-.66L8 1.2z"
            fill="currentColor"
          />
        </svg>
      ))}
    </span>
  );
}

export default function ReviewsSettings() {
  const [loading, setLoading] = useState(true);
  const [eligible, setEligible] = useState(true);
  const [products, setProducts] = useState<ReviewProduct[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/sync/reviews-settings");
      if (res.status === 403) {
        setEligible(false);
        setLoading(false);
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products ?? []);
      }
      setLoading(false);
    })();
  }, []);

  async function toggle(listingId: string, nextHidden: boolean) {
    const previous = products;
    setProducts((prev) => prev.map((p) => (p.listingId === listingId ? { ...p, hidden: nextHidden } : p)));
    setSavingId(listingId);
    setError(null);

    const hiddenListingIds = products
      .map((p) => (p.listingId === listingId ? { ...p, hidden: nextHidden } : p))
      .filter((p) => p.hidden)
      .map((p) => p.listingId);

    const res = await fetch("/api/sync/reviews-settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hiddenListingIds }),
    });

    setSavingId(null);
    if (!res.ok) {
      setProducts(previous);
      setError("Could not save that change.");
    }
  }

  if (loading) return null;

  if (!eligible) {
    return (
      <div className="mt-4 card-glass rounded-2xl p-6">
        <h2 className="font-display text-base font-semibold text-foreground">Etsy Reviews</h2>
        <p className="mt-2 text-sm text-muted">
          Show your Etsy customer reviews automatically on every product page.
          This is available on the Pro and Unlimited plans.
        </p>
        <a
          href="/#pricing"
          className="mt-4 inline-flex rounded-full bg-gradient-to-r from-accent-orange via-accent-pink to-accent-violet px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-[1.02]"
        >
          See plans
        </a>
      </div>
    );
  }

  return (
    <div className="mt-4 card-glass rounded-2xl p-6">
      <h2 className="font-display text-base font-semibold text-foreground">Etsy Reviews</h2>
      <p className="mt-1 text-xs leading-relaxed text-muted">
        Reviews show automatically on every product that has them. Switch a
        product off here if you&apos;d rather not show its reviews.
      </p>

      {error && <p className="mt-3 text-xs font-medium text-red-500">{error}</p>}

      {products.length === 0 ? (
        <p className="mt-4 rounded-xl border border-border bg-surface px-3.5 py-3 text-sm text-muted">
          No Etsy reviews found yet. Check back after your next sync.
        </p>
      ) : (
        <ul className="mt-4 space-y-1.5">
          {products.map((p) => (
            <li
              key={p.listingId}
              className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-surface-2"
            >
              {p.thumbnailUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.thumbnailUrl} alt="" className="h-10 w-10 shrink-0 rounded-md object-cover" />
              ) : (
                <span className="h-10 w-10 shrink-0 rounded-md bg-surface-2" />
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-foreground">{p.title}</p>
                <p className="mt-0.5 flex items-center gap-1.5 text-[11px] text-muted">
                  {p.averageRating !== null ? (
                    <>
                      <Stars rating={p.averageRating} />
                      {p.averageRating.toFixed(1)} &middot; {p.reviewCount} review{p.reviewCount === 1 ? "" : "s"}
                    </>
                  ) : (
                    "No reviews yet"
                  )}
                </p>
              </div>
              <label className="flex shrink-0 cursor-pointer items-center gap-2 text-xs text-muted">
                {savingId === p.listingId ? "Saving…" : p.hidden ? "Hidden" : "Visible"}
                <input
                  type="checkbox"
                  checked={!p.hidden}
                  onChange={(e) => toggle(p.listingId, !e.target.checked)}
                  className="h-4 w-4 shrink-0 rounded border-border accent-accent-violet"
                />
              </label>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
