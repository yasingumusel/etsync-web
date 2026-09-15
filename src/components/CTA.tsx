export default function CTA() {
  return (
    <section className="py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-surface px-8 py-16 text-center sm:px-16">
          <div className="pointer-events-none absolute -top-24 left-1/2 h-[300px] w-[500px] -translate-x-1/2 rounded-full bg-gradient-to-r from-accent-orange/15 via-accent-pink/15 to-accent-violet/15 glow-orb" />
          <div className="relative">
            <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              One developer, one shop, one Wix store
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-muted">
              ETSYNC exists to keep my own Etsy listings and my own Wix
              inventory in sync. It isn&rsquo;t a service other sellers can
              sign up for today.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href="#api-usage"
                className="w-full rounded-full bg-gradient-to-r from-accent-orange via-accent-pink to-accent-violet px-7 py-3.5 text-center text-sm font-semibold text-white shadow-[0_0_40px_-10px_rgba(139,92,246,0.6)] transition-transform hover:scale-[1.03] sm:w-auto"
              >
                Read the Etsy API Usage Details
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
