/**
 * A short "pick your storefront" section between the homepage's hero and
 * the rest of its content. Purely additive - it exists to route organic
 * search traffic toward the two dedicated, SEO-optimised landing pages
 * (/wix-etsy-sync, /shopify-etsy-sync) without touching the homepage's
 * existing conversion/trust/pricing sections below it.
 */
export default function PlatformChoice() {
  return (
    <section className="py-4 lg:py-8">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <a
            href="/wix-etsy-sync"
            className="card-glass group flex items-center justify-between gap-4 rounded-2xl p-6 transition-colors hover:border-accent-blue/40"
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-accent-blue">
                Sell on Wix
              </p>
              <p className="mt-1.5 font-display text-lg font-semibold text-foreground">
                Etsy &rarr; Wix inventory sync
              </p>
            </div>
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-blue/10 text-accent-blue transition-transform group-hover:translate-x-0.5">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </a>

          <a
            href="/shopify-etsy-sync"
            className="card-glass group flex items-center justify-between gap-4 rounded-2xl p-6 transition-colors hover:border-accent-green/40"
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-accent-green">
                Sell on Shopify
              </p>
              <p className="mt-1.5 font-display text-lg font-semibold text-foreground">
                Etsy &rarr; Shopify inventory sync
              </p>
            </div>
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-green/10 text-accent-green transition-transform group-hover:translate-x-0.5">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
