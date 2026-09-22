/**
 * The "Etsy Shop <-> Wix Shop" browser mockup, originally built for the
 * Hero section. Extracted into its own component so it can also fill the
 * marketing-adjacent empty space on the connect-etsy page - onboarding is
 * a marketing moment too, not just the homepage.
 */
export default function SyncPreviewMockup({ syncedProducts }: { syncedProducts?: number }) {
  // Anonymous visitors (or a page like connect-etsy, reached before any
  // sync has happened yet) see an illustrative example (47/47). A
  // logged-in visitor who's already synced sees their own real, current
  // count on both sides instead - the two are always equal once a sync has
  // fully succeeded, so one number does double duty here.
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
            badge="Source"
          />

          <div className="flex flex-col items-center gap-2 py-2">
            <svg width="28" height="24" viewBox="0 0 28 24" fill="none" className="text-accent-violet">
              <path
                d="M4 8h16M16 3l4 5-4 5M20 16H4M8 21l-4-5 4-5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="whitespace-nowrap text-[11px] font-medium text-muted">
              Synced automatically
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
        <p className="text-[11px] text-muted">Edit in Wix instead</p>
        <p className="font-display text-lg font-bold text-foreground">Syncs back</p>
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
