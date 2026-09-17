const features = [
  {
    title: "Read-Only Access",
    desc: "MirrorStock connects to Etsy using only the listings_r and shops_r scopes — enough to read your shop's active listings. Nothing more is requested.",
    icon: LockIcon,
  },
  {
    title: "Variations, Not Just Products",
    desc: "Size and colour variations become real Wix product options, each with its own price and SKU — not a single flattened product with one price.",
    icon: StoreIcon,
  },
  {
    title: "Nothing Written Back to Etsy",
    desc: "MirrorStock never edits, creates, or uploads anything to your Etsy shop, never reads your sales or order data, and never sends email through Etsy.",
    icon: BanIcon,
  },
  {
    title: "Automatic Currency Conversion",
    desc: "If your Etsy shop prices in one currency and your Wix site in another, prices are converted at the live rate instead of being copied across as raw numbers.",
    icon: CurrencyIcon,
  },
  {
    title: "Secure OAuth Connection",
    desc: "You connect your Etsy shop and your Wix store through each platform's own official login. MirrorStock never sees or stores your password.",
    icon: ShieldIcon,
  },
  {
    title: "Live Sync Progress",
    desc: "Start a sync from your dashboard and watch it work through your catalogue product by product, so you always know where it got to.",
    icon: ChartIcon,
  },
];

export default function Features() {
  return (
    <section id="features" className="relative py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-accent-pink">
            Features
          </span>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            One job,{" "}
            <span className="text-gradient">done properly</span>
          </h2>
          <p className="mt-4 text-balance text-lg text-muted">
            MirrorStock reads your listings and keeps your storefront
            accurate — variations, images, prices and all. The narrow scope
            is intentional.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="card-glass group rounded-2xl p-6 transition-colors hover:border-accent-violet/40"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-accent-orange/20 via-accent-pink/20 to-accent-violet/20 text-accent-pink">
                <f.icon />
              </div>
              <h3 className="mt-5 font-display text-base font-semibold text-foreground">
                {f.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function iconProps() {
  return {
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
}

function LockIcon() {
  return (
    <svg {...iconProps()}>
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  );
}

function BanIcon() {
  return (
    <svg {...iconProps()}>
      <circle cx="12" cy="12" r="9" />
      <path d="M5.5 5.5l13 13" />
    </svg>
  );
}

function CurrencyIcon() {
  return (
    <svg {...iconProps()}>
      <circle cx="12" cy="12" r="9" />
      <path d="M15 9.5a3 3 0 0 0-3-1.5c-1.7 0-3 .9-3 2s1.3 2 3 2 3 .9 3 2-1.3 2-3 2a3 3 0 0 1-3-1.5" />
      <path d="M12 6.5v11" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg {...iconProps()}>
      <path d="M12 2 4 5v6c0 5 3.5 8.5 8 11 4.5-2.5 8-6 8-11V5l-8-3Z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

function StoreIcon() {
  return (
    <svg {...iconProps()}>
      <path d="M3 9 4 4h16l1 5" />
      <path d="M4 9h16v11H4z" />
      <path d="M9 20v-6h6v6" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg {...iconProps()}>
      <path d="M3 3v18h18" />
      <rect x="7" y="12" width="3" height="6" />
      <rect x="13" y="8" width="3" height="10" />
      <rect x="19" y="5" width="2" height="13" />
    </svg>
  );
}
