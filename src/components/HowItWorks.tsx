const steps = [
  {
    number: "01",
    title: "Connect Your Shops",
    desc: "You sign in with your Etsy account and your Wix account through each platform's own official login. MirrorStock never sees your password on either side.",
  },
  {
    number: "02",
    title: "We Read Your Active Listings",
    desc: "MirrorStock pulls your active listings along with their variations, images and prices, and matches them to the products already in your store.",
  },
  {
    number: "03",
    title: "Your Store Is Brought Up To Date",
    desc: "Start a sync from your dashboard and watch it work through your catalogue. Products that are already there are updated in place, and if you'd rather edit a title or description in Wix, that flows back to Etsy too.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative border-t border-border/60 bg-surface/30 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-accent-blue">
            How It Works
          </span>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Three steps to a synced store
          </h2>
          <p className="mt-4 text-lg text-muted">
            No technical knowledge required. Etsy is the default source of
            truth — edit a title or description in Wix instead, and that
            change syncs back.
          </p>
        </div>

        <div className="relative mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="pointer-events-none absolute left-0 right-0 top-6 hidden h-px bg-gradient-to-r from-transparent via-border to-transparent md:block" />
          {steps.map((step) => (
            <div key={step.number} className="relative flex flex-col items-start">
              <div className="font-display flex h-12 w-12 items-center justify-center rounded-full border border-border bg-background text-sm font-bold text-accent-pink">
                {step.number}
              </div>
              <h3 className="mt-5 font-display text-lg font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
