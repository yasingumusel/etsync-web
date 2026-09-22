const items = [
  "Etsy Open API v3",
  "listings_r scope",
  "shops_r scope",
  "listings_w scope",
  "OAuth 2.0",
  "Wix Stores API",
  "Two-way sync",
];

export default function LogosStrip() {
  const looped = [...items, ...items];

  return (
    <section className="border-y border-border/60 bg-surface/40 py-8">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <p className="mb-6 text-center text-xs font-medium uppercase tracking-widest text-muted">
          Built directly on the official Etsy Open API and Wix API
        </p>
        <div className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-background to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-background to-transparent" />
          <div className="animate-marquee flex w-max items-center gap-16">
            {looped.map((name, i) => (
              <span
                key={`${name}-${i}`}
                className="font-display text-xl font-bold text-muted/70"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
