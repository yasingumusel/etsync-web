"use client";

import { useEffect, useState } from "react";

type ReviewItem = {
  reviewId: string | null;
  rating: number;
  review: string;
  createdAt: string | null;
  hidden: boolean;
};

type ReviewProduct = {
  listingId: string;
  title: string;
  thumbnailUrl: string | null;
  reviewCount: number;
  averageRating: number | null;
  hidden: boolean;
  reviews: ReviewItem[];
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
  const [canCurate, setCanCurate] = useState(false);
  const [shopifyAddBlockUrl, setShopifyAddBlockUrl] = useState<string | null>(null);
  const [products, setProducts] = useState<ReviewProduct[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/sync/reviews-settings");
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products ?? []);
        setEligible(Boolean(data.eligible));
        setCanCurate(Boolean(data.canCurate));
        setShopifyAddBlockUrl(data.shopifyAddBlockUrl ?? null);
      }
      setLoading(false);
    })();
  }, []);

  async function save(next: ReviewProduct[], body: object, savingKey: string) {
    const previous = products;
    setProducts(next);
    setSavingId(savingKey);
    setError(null);

    const res = await fetch("/api/sync/reviews-settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    setSavingId(null);
    if (!res.ok) {
      setProducts(previous);
      setError("Could not save that change.");
    }
  }

  function toggle(listingId: string, nextHidden: boolean) {
    const next = products.map((p) => (p.listingId === listingId ? { ...p, hidden: nextHidden } : p));
    const hiddenListingIds = next.filter((p) => p.hidden).map((p) => p.listingId);
    save(next, { hiddenListingIds }, listingId);
  }

  function toggleReview(reviewId: string, nextHidden: boolean) {
    const next = products.map((p) => ({
      ...p,
      reviews: p.reviews.map((r) => (r.reviewId === reviewId ? { ...r, hidden: nextHidden } : r)),
    }));
    const hiddenReviewIds = next.flatMap((p) => p.reviews.filter((r) => r.hidden && r.reviewId).map((r) => r.reviewId as string));
    save(next, { hiddenReviewIds }, reviewId);
  }

  if (loading) return null;

  return (
    <div className="mt-4 card-glass rounded-2xl p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-display text-base font-semibold text-foreground">Etsy Reviews</h2>
        {eligible && !canCurate && products.length > 0 && (
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-accent-violet/30 bg-accent-violet/5 px-4 py-3.5">
          <p className="text-xs text-foreground">
            Want to choose which products or single reviews show? That&apos;s an Unlimited plan feature.
          </p>
          <a
            href="/#pricing"
            className="shrink-0 rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-surface-2"
          >
            See Unlimited
          </a>
        </div>
      )}

      {!eligible && (
          <span className="rounded-full bg-surface-2 px-2.5 py-1 text-[11px] font-semibold text-muted">
            Pro & Unlimited
          </span>
        )}
      </div>
      <p className="mt-1 text-xs leading-relaxed text-muted">
        {!eligible
          ? "This is what your Etsy Reviews panel will look like - upgrade to Pro or Unlimited to actually show reviews on your product pages."
          : canCurate
            ? "Reviews show automatically on every product that has them. Switch a whole product off, or open a product to hide single reviews."
            : "Reviews show automatically on every product that has them."}
      </p>

      {eligible && shopifyAddBlockUrl && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-surface px-4 py-3.5">
          <p className="max-w-md text-xs leading-relaxed text-muted">
            <span className="font-semibold text-foreground">Shopify:</span> add the Etsy Reviews block to your
            product page once. The button opens your theme editor with the block already placed - just click
            Save there.
          </p>
          <a
            href={shopifyAddBlockUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-surface-2"
          >
            Add to product page
          </a>
        </div>
      )}

      {error && <p className="mt-3 text-xs font-medium text-red-500">{error}</p>}

      {products.length === 0 ? (
        <p className="mt-4 rounded-xl border border-border bg-surface px-3.5 py-3 text-sm text-muted">
          No Etsy reviews found yet. Check back after your next sync.
        </p>
      ) : (
        <ul className="mt-4 space-y-1.5">
          {products.map((p) => (
            <li key={p.listingId} className="rounded-lg hover:bg-surface-2">
             <div className="flex items-center gap-3 px-2 py-2">
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
                {eligible && p.reviews.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setOpenId(openId === p.listingId ? null : p.listingId)}
                    className="mt-1 text-[11px] font-medium text-accent-violet hover:underline"
                  >
                    {openId === p.listingId ? "Hide reviews" : `See reviews (${p.reviews.length})`}
                  </button>
                )}
              </div>
              <label
                className={`flex shrink-0 items-center gap-2 text-xs text-muted ${
                  canCurate ? "cursor-pointer" : "cursor-not-allowed opacity-60"
                }`}
                title={canCurate ? undefined : "Choosing which reviews show is an Unlimited feature"}
              >
                {savingId === p.listingId ? "Saving…" : p.hidden ? "Hidden" : "Visible"}
                <input
                  type="checkbox"
                  checked={!p.hidden}
                  disabled={!canCurate}
                  onChange={(e) => toggle(p.listingId, !e.target.checked)}
                  className="h-4 w-4 shrink-0 rounded border-border accent-accent-violet"
                />
              </label>
             </div>
              {openId === p.listingId && (
                <ul className="mb-2 ml-15 mr-2 space-y-1.5 border-l border-border pl-3">
                  {p.reviews.map((r, i) => {
                    const locked = !canCurate || !r.reviewId || p.hidden;
                    return (
                      <li key={r.reviewId ?? i} className="flex items-start gap-3 py-1">
                        <div className={`min-w-0 flex-1 ${r.hidden || p.hidden ? "opacity-50" : ""}`}>
                          <p className="flex items-center gap-1.5 text-[11px] text-muted">
                            <Stars rating={r.rating} />
                            {r.createdAt && new Date(r.createdAt).toLocaleDateString()}
                          </p>
                          <p className="mt-0.5 text-xs leading-relaxed text-foreground">
                            {r.review || <span className="text-muted">(Star rating only, no text)</span>}
                          </p>
                        </div>
                        <label
                          className={`flex shrink-0 items-center gap-2 text-[11px] text-muted ${
                            locked ? "cursor-not-allowed opacity-60" : "cursor-pointer"
                          }`}
                          title={
                            !canCurate
                              ? "Choosing which reviews show is an Unlimited feature"
                              : p.hidden
                                ? "This whole product's reviews are hidden"
                                : !r.reviewId
                                  ? "Available after your next sync"
                                  : undefined
                          }
                        >
                          {savingId !== null && savingId === r.reviewId ? "Saving…" : r.hidden ? "Hidden" : "Visible"}
                          <input
                            type="checkbox"
                            checked={!r.hidden}
                            disabled={locked}
                            onChange={(e) => r.reviewId && toggleReview(r.reviewId, !e.target.checked)}
                            className="h-3.5 w-3.5 shrink-0 rounded border-border accent-accent-violet"
                          />
                        </label>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}

      {eligible && !canCurate && products.length > 0 && (
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-accent-violet/30 bg-accent-violet/5 px-4 py-3.5">
          <p className="text-xs text-foreground">
            Want to choose which products or single reviews show? That&apos;s an Unlimited plan feature.
          </p>
          <a
            href="/#pricing"
            className="shrink-0 rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-surface-2"
          >
            See Unlimited
          </a>
        </div>
      )}

      {!eligible && (
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-accent-violet/30 bg-accent-violet/5 px-4 py-3.5">
          <p className="text-xs text-foreground">
            Etsy Reviews is a Pro & Unlimited feature - upgrade to show these on your product pages.
          </p>
          <a
            href="/#pricing"
            className="shrink-0 rounded-full bg-gradient-to-r from-accent-orange via-accent-pink to-accent-violet px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-[1.02]"
          >
            Upgrade to Pro
          </a>
        </div>
      )}
    </div>
  );
}
