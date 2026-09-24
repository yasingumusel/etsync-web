import SyncPreviewMockup from "@/components/SyncPreviewMockup";

export default function Hero({ syncedProducts }: { syncedProducts?: number }) {
  return (
    <section id="top" className="relative overflow-hidden pt-20 pb-24 lg:pt-28 lg:pb-32">
      <div className="pointer-events-none absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black_40%,transparent_100%)]" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[720px] -translate-x-1/2 rounded-full bg-gradient-to-r from-accent-orange/15 via-accent-pink/15 to-accent-violet/15 glow-orb" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-1.5 text-xs font-medium text-muted">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            Early access
          </div>

          <h1 className="font-display text-4xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Your listings,{" "}
            <span className="text-gradient">always in sync</span>.
          </h1>

          <p className="mt-6 max-w-2xl text-balance text-lg leading-relaxed text-muted">
            MirrorStock reads the active listings in your Etsy shop —
            products, variations, images, descriptions and prices — and
            keeps the matching products in your Wix or Shopify store up to
            date. Edit a product&rsquo;s name or description in your store
            instead, and it can sync back to Etsy too.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
            <a
              href="/signup"
              className="w-full rounded-full bg-gradient-to-r from-accent-orange via-accent-pink to-accent-violet px-7 py-3.5 text-center text-sm font-semibold text-white shadow-[0_0_40px_-10px_rgba(139,92,246,0.6)] transition-transform hover:scale-[1.03] sm:w-auto"
            >
              Get Started
            </a>
            <a
              href="#how-it-works"
              className="flex w-full items-center justify-center gap-2 rounded-full border border-border px-7 py-3.5 text-sm font-semibold text-foreground transition-colors hover:bg-surface sm:w-auto"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path
                  d="M8 5v14l11-7-11-7z"
                  fill="currentColor"
                />
              </svg>
              See how it works
            </a>
          </div>

          <p className="mt-4 text-sm">
            <a
              href="#api-usage"
              className="font-medium text-muted underline decoration-border underline-offset-4 transition-colors hover:text-foreground"
            >
              See Etsy API Usage &rarr;
            </a>
          </p>

          <p className="mt-5 text-xs text-muted">
            No order or payment data · Nothing is written to Etsy unless you
            turn it on
          </p>
        </div>

        <SyncPreviewMockup syncedProducts={syncedProducts} />
      </div>
    </section>
  );
}
