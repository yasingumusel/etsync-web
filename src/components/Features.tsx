import type { ReactElement } from "react";

type Feature = {
  title: string;
  desc: string;
  icon: () => ReactElement;
  /** Shown as a small pill next to the title for plan-gated features. */
  badge?: string;
};

const features: Feature[] = [
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
  {
    title: "A History That Skips The Noise",
    desc: "MirrorStock checks for changes every few hours in the background, but only logs the checks that actually updated something — no wall of identical \"nothing changed\" entries. Each one shows up as a notification, so you know your storefront stayed current without watching it.",
    icon: BellIcon,
  },
  {
    title: "Your Etsy Reviews, On The Right Product",
    desc: "Pull your real Etsy reviews — star rating and review text, never the buyer's name or photo — onto the matching product's own Wix page, not just a generic store-wide list. Pick which products show theirs from a simple on/off list in your dashboard.",
    icon: StarIcon,
    badge: "Pro & Unlimited",
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
              <h3 className="mt-5 flex flex-wrap items-center gap-2 font-display text-base font-semibold text-foreground">
                {f.title}
                {f.badge && (
                  <span className="rounded-full bg-gradient-to-r from-accent-orange/15 via-accent-pink/15 to-accent-violet/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent-pink">
                    {f.badge}
                  </span>
                )}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {f.desc}
              </p>
            </div>
          ))}
        </div>

        <ReviewsPreviewMockup />
      </div>
    </section>
  );
}

/**
 * A small, static illustration of the dashboard's "Etsy Reviews" management
 * list (see routes/sync.js's /reviews-settings) - product names and photos
 * below are made up, not a real customer's shop, since this is marketing
 * copy rather than a live data view.
 */
function ReviewsPreviewMockup() {
  const rows = [
    { name: "Vintage Sunset Band Tee", rating: 5, count: 12, visible: true },
    { name: "Retro Mug — Wildflower Set", rating: 5, count: 4, visible: true },
    { name: "Handmade Leather Journal", rating: 4, count: 1, visible: false },
  ];

  return (
    <div className="card-glass mx-auto mt-8 max-w-2xl rounded-2xl p-6">
      <p className="text-xs font-semibold uppercase tracking-widest text-accent-pink">
        Etsy Reviews · Dashboard preview
      </p>
      <p className="mt-2 text-sm text-muted">
        Reviews show automatically on every product that has them — switch
        one off here if you&apos;d rather not show it.
      </p>
      <ul className="mt-5 divide-y divide-border">
        {rows.map((r) => (
          <li key={r.name} className="flex items-center gap-3 py-3">
            <div className="h-9 w-9 shrink-0 rounded-lg bg-gradient-to-br from-accent-orange/20 via-accent-pink/20 to-accent-violet/20" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">{r.name}</p>
              <p className="mt-0.5 text-xs text-muted">
                {"★".repeat(r.rating)}
                {"☆".repeat(5 - r.rating)} · {r.count} review{r.count === 1 ? "" : "s"}
              </p>
            </div>
            <span
              className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                r.visible
                  ? "bg-emerald-600/10 text-emerald-600"
                  : "bg-surface-2 text-muted"
              }`}
            >
              {r.visible ? "Visible" : "Hidden"}
            </span>
          </li>
        ))}
      </ul>
    </div>
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

function BellIcon() {
  return (
    <svg {...iconProps()}>
      <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg {...iconProps()}>
      <path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.3l-5.9 3.2 1.2-6.5-4.8-4.6 6.6-.9L12 2.5z" />
    </svg>
  );
}
