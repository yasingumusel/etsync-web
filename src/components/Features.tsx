const features = [
  {
    title: "Read-Only Etsy Access",
    desc: "ETSYNC connects to Etsy using only the listings_r and shops_r scopes — enough to read my shop's active listings. Nothing more is requested.",
    icon: LockIcon,
  },
  {
    title: "One-Way Inventory Updates",
    desc: "When a listing's quantity changes on Etsy, ETSYNC updates the matching product's stock on Wix automatically — so my Wix store never oversells.",
    icon: SyncIcon,
  },
  {
    title: "Nothing Written Back to Etsy",
    desc: "ETSYNC never edits, creates, or uploads anything to my Etsy shop, never reads my sales or order data, and never sends email through Etsy.",
    icon: BanIcon,
  },
  {
    title: "Low-Stock Alerts",
    desc: "I get notified the moment a listing's stock runs low or a sync fails, before it affects a customer on Wix.",
    icon: BellIcon,
  },
  {
    title: "Secure OAuth Connection",
    desc: "I connect my own Etsy shop and my own Wix store directly through each platform's official login. ETSYNC never sees or stores my password, and there's no other seller's credentials involved.",
    icon: StoreIcon,
  },
  {
    title: "Sync Activity Log",
    desc: "A timestamped log of exactly what was read from Etsy and what was updated on Wix, for every listing.",
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
            A small, focused tool —{" "}
            <span className="text-gradient">not a full platform</span>
          </h2>
          <p className="mt-4 text-balance text-lg text-muted">
            ETSYNC does one thing: it reads my Etsy listings and keeps my
            Wix inventory accurate. That narrow scope is intentional.
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

function SyncIcon() {
  return (
    <svg {...iconProps()}>
      <path d="M4 12h13M13 6l7 6-7 6" />
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

function BellIcon() {
  return (
    <svg {...iconProps()}>
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
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
