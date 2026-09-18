const shipped = [
  "One-way sync from Etsy to Wix: products, variants, images, descriptions and prices.",
  "Size and colour variations are rebuilt as real Wix product options, each with its own price and SKU.",
  "Automatic currency conversion when your Etsy shop and your Wix site are priced in different currencies.",
  "Run a sync from your dashboard whenever you want, with live progress as it works.",
  "Scheduled syncs every 4 hours, so your store stays current without you starting one by hand.",
  "A sync history and notification bell that only surface runs where something actually changed.",
];

const planned = [
  "Shopify as a second destination alongside Wix.",
  "Two-way sync, so products created in your store can be published to Etsy.",
];

export default function Status() {
  return (
    <section id="status" className="relative border-t border-border/60 bg-surface/30 py-24 lg:py-32">
      <div className="mx-auto max-w-3xl px-6 lg:px-8 text-center">
        <span className="text-xs font-semibold uppercase tracking-widest text-accent-violet">
          Product Status
        </span>
        <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          What works today, and what is next
        </h2>
        <p className="mt-4 text-lg text-muted">
          MirrorStock is early, and we would rather be precise about that
          than oversell it. Here is exactly where the product stands.
        </p>

        <div className="mx-auto mt-10 grid max-w-3xl gap-6 text-left sm:grid-cols-2">
          <div className="card-glass rounded-2xl p-8">
            <h3 className="text-sm font-semibold text-foreground">
              Available now
            </h3>
            <ul className="mt-5 space-y-4">
              {shipped.map((note) => (
                <li key={note} className="flex items-start gap-2.5 text-sm text-foreground/90">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="mt-0.5 shrink-0 text-emerald-600"
                  >
                    <path
                      d="M5 13l4 4L19 7"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {note}
                </li>
              ))}
            </ul>
          </div>

          <div className="card-glass rounded-2xl p-8">
            <h3 className="text-sm font-semibold text-foreground">
              On the roadmap
            </h3>
            <ul className="mt-5 space-y-4">
              {planned.map((note) => (
                <li key={note} className="flex items-start gap-2.5 text-sm text-muted">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="mt-0.5 shrink-0 text-muted"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="8"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeDasharray="3 3"
                    />
                  </svg>
                  {note}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <a
          href="mailto:support@mirrorstock.com"
          className="mx-auto mt-10 block max-w-xs rounded-full border border-border px-5 py-3 text-center text-sm font-semibold text-foreground transition-colors hover:bg-surface-2"
        >
          Questions? Get in touch
        </a>
      </div>
    </section>
  );
}
