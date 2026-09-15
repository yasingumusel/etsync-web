const points = [
  {
    title: "Exactly two read scopes",
    desc: "ETSYNC requests listings_r (to read my shop's active listings) and shops_r (to read basic shop info). No other Etsy scope is requested — not receipts, not transactions, not shop management.",
  },
  {
    title: "Nothing is written to Etsy",
    desc: "ETSYNC never creates, edits, or uploads listings, never modifies shop settings, and never sends email or messages through Etsy.",
  },
  {
    title: "No sales or order data",
    desc: "ETSYNC does not read receipts, transactions, or any sales data from Etsy. It only reads listing and inventory-level information needed to mirror stock counts.",
  },
  {
    title: "Used only by its own developer",
    desc: "The connection goes through Etsy's official OAuth 2.0 flow, and I authorize access to my own shop directly. ETSYNC is not given a shared or third-party API key, and it is not used to act on any other seller's behalf.",
  },
];

export default function ApiTrust() {
  return (
    <section id="api-usage" className="py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-emerald-600">
              How ETSYNC Uses the Etsy API
            </span>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Read-only by design,{" "}
              <span className="text-gradient">built for my own shop</span>
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-muted">
              ETSYNC reads my own active Etsy listings (read-only, using
              the{" "}
              <code className="rounded bg-surface-2 px-1.5 py-0.5 text-[0.85em] text-foreground">
                listings_r
              </code>{" "}
              and{" "}
              <code className="rounded bg-surface-2 px-1.5 py-0.5 text-[0.85em] text-foreground">
                shops_r
              </code>{" "}
              scopes) and syncs them to my own connected Wix store, keeping
              inventory consistent across both. It does not edit or upload
              anything back to Etsy, read sales data, or send email through
              Etsy. I&rsquo;m the sole developer of ETSYNC, I built it to
              run my own Etsy shop, and I don&rsquo;t create or distribute
              API credentials for any other app, company, or seller.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-xs font-medium text-muted">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-emerald-600">
                  <path
                    d="M12 2 4 5v6c0 5 3.5 8.5 8 11 4.5-2.5 8-6 8-11V5l-8-3Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9 12l2 2 4-4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Used only by me, for my own shop
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-xs font-medium text-muted">
                Not affiliated with or endorsed by Etsy, Inc. or Wix.com Ltd.
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {points.map((p) => (
              <div key={p.title} className="card-glass rounded-2xl p-5">
                <h3 className="font-display text-sm font-semibold text-foreground">
                  {p.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
