const points = [
  {
    title: "Three narrow scopes, nothing more",
    desc: "MirrorStock requests listings_r and shops_r to read your shop, plus listings_w — used for exactly one thing: writing a title or description back to Etsy when you tell MirrorStock you're editing it in Wix instead. No other Etsy scope is requested — not receipts, not transactions, not shop management.",
  },
  {
    title: "Writes are opt-in and narrow",
    desc: "By default nothing is written to Etsy. Turn off syncing a listing's title or description and MirrorStock pushes your Wix edit back — that's the only write path. It never creates, deletes, or uploads listings, never touches price/inventory/images, never modifies shop settings, and never sends email or messages through Etsy.",
  },
  {
    title: "No sales or payment data",
    desc: "MirrorStock does not read receipts, transactions, or any sales data from Etsy. It only reads the listing and inventory information needed to rebuild your products elsewhere.",
  },
  {
    title: "You authorize your own shop",
    desc: "The connection goes through Etsy's official OAuth 2.0 flow with PKCE, and you grant access to your own shop directly. You can revoke that access from your Etsy account at any time.",
  },
];

export default function ApiTrust() {
  return (
    <section id="api-usage" className="py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-emerald-600">
              How MirrorStock Uses the API
            </span>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Minimal access{" "}
              <span className="text-gradient">by design</span>
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-muted">
              MirrorStock reads your active Etsy listings (using the{" "}
              <code className="rounded bg-surface-2 px-1.5 py-0.5 text-[0.85em] text-foreground">
                listings_r
              </code>{" "}
              and{" "}
              <code className="rounded bg-surface-2 px-1.5 py-0.5 text-[0.85em] text-foreground">
                shops_r
              </code>{" "}
              scopes) and syncs them to your connected Wix store, keeping
              both catalogues consistent. If you&rsquo;d rather edit a
              title or description in Wix, MirrorStock can write that one
              field back to Etsy (using the{" "}
              <code className="rounded bg-surface-2 px-1.5 py-0.5 text-[0.85em] text-foreground">
                listings_w
              </code>{" "}
              scope) — that&rsquo;s the only thing it&rsquo;s ever used
              for. It never reads sales or payment data, or sends email
              through Etsy. Every seller connects their own shop through
              Etsy&rsquo;s own authorization screen, and can revoke that
              access at any time.
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
                No sales or payment data, ever
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
