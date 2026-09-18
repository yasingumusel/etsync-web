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
            keeps the matching products in your Wix store up to date. Access
            is read-only: nothing is ever written back to your Etsy shop.
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
            Read-only access to your shop · No order or payment data · Your
            listings are never modified
          </p>
        </div>

        <HeroVisual syncedProducts={syncedProducts} />
      </div>
    </section>
  );
}

function HeroVisual({ syncedProducts }: { syncedProducts?: number }) {
  // Anonymous visitors see an illustrative example (47/47). A logged-in
  // visitor sees their own real, current synced count on both sides
  // instead - the two are always equal once a sync has fully succeeded, so
  // one number does double duty here.
  const listings = syncedProducts ?? 47;

  return (
    <div className="relative mx-auto mt-20 max-w-4xl">
      <div className="relative rounded-2xl border border-border bg-surface/80 p-4 shadow-2xl shadow-black/10 backdrop-blur">
        <div className="flex items-center gap-1.5 border-b border-border px-2 pb-3">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
          <span className="ml-3 text-xs text-muted">
            mirrorstock.com/dashboard
          </span>
          {syncedProducts !== undefined && (
            <span className="ml-auto rounded-full bg-emerald-400/10 px-2 py-0.5 text-[10px] font-medium text-emerald-600">
              Your store
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 items-center gap-6 p-6 sm:grid-cols-[1fr_auto_1fr] sm:gap-4">
          <StoreCard
            platform="Etsy"
            color="from-accent-orange to-accent-pink"
            listings={listings}
            badge="Read-only"
          />

          <div className="flex flex-col items-center gap-2 py-2">
            <svg width="28" height="24" viewBox="0 0 28 24" fill="none" className="text-accent-violet">
              <path
                d="M2 12h20M16 5l7 7-7 7"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="whitespace-nowrap text-[11px] font-medium text-muted">
              One-way sync
            </span>
          </div>

          <StoreCard
            platform="Wix"
            color="from-accent-blue to-accent-violet"
            listings={listings}
            badge="Updated"
          />
        </div>
      </div>

      <div className="animate-float absolute -left-10 -top-10 hidden rounded-xl border border-border bg-surface-2 px-4 py-3 shadow-xl sm:block">
        <p className="text-[11px] text-muted">Variants &amp; images</p>
        <p className="font-display text-lg font-bold text-emerald-600">Included</p>
      </div>

      <div
        className="animate-float absolute -right-6 -bottom-6 hidden rounded-xl border border-border bg-surface-2 px-4 py-3 shadow-xl sm:block"
        style={{ animationDelay: "1.5s" }}
      >
        <p className="text-[11px] text-muted">Writes back to Etsy</p>
        <p className="font-display text-lg font-bold text-foreground">0</p>
      </div>
    </div>
  );
}

function StoreCard({
  platform,
  color,
  listings,
  badge,
}: {
  platform: string;
  color: string;
  listings: number;
  badge: string;
}) {
  return (
    <div className="card-glass rounded-xl p-4">
      <div className="flex items-center gap-2">
        <span className={`h-7 w-7 rounded-lg bg-gradient-to-br ${color}`} />
        <span className="text-sm font-semibold text-foreground">
          {platform} Shop
        </span>
      </div>
      <div className="mt-4">
        <p className="text-[11px] text-muted">Active Listings</p>
        <p className="font-display text-xl font-bold text-foreground">
          {listings}
        </p>
      </div>
      <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-400/10 px-2.5 py-1 text-[11px] font-medium text-emerald-600">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
        {badge}
      </div>
    </div>
  );
}
