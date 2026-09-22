type Accent = "orange" | "blue" | "green";

const accentClasses: Record<Accent, { text: string; glow: string; badge: string }> = {
  orange: {
    text: "text-accent-orange",
    glow: "from-accent-orange/15 via-accent-pink/15 to-accent-violet/15",
    badge: "border-accent-orange/30 bg-accent-orange/5 text-accent-orange",
  },
  blue: {
    text: "text-accent-blue",
    glow: "from-accent-blue/15 via-accent-violet/15 to-accent-pink/15",
    badge: "border-accent-blue/30 bg-accent-blue/5 text-accent-blue",
  },
  green: {
    text: "text-accent-green",
    glow: "from-accent-green/15 via-accent-blue/10 to-accent-violet/15",
    badge: "border-accent-green/30 bg-accent-green/5 text-accent-green",
  },
};

/**
 * Generic hero for a platform-specific landing page (e.g. /wix-etsy-sync,
 * /shopify-etsy-sync). Deliberately narrower than the homepage's own
 * <Hero /> (no live synced-product mockup, no session awareness) since
 * these pages exist to rank and convert cold organic traffic for a single
 * search intent, not to greet an already-signed-up merchant.
 */
export default function HeroSection({
  eyebrow,
  title,
  subtitle,
  ctaText,
  ctaLink,
  secondaryCtaText,
  secondaryCtaLink,
  accent = "orange",
}: {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  accent?: Accent;
}) {
  const a = accentClasses[accent];

  return (
    <section className="relative overflow-hidden pt-20 pb-20 lg:pt-28 lg:pb-24">
      <div className="pointer-events-none absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black_40%,transparent_100%)]" />
      <div
        className={`pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[720px] -translate-x-1/2 rounded-full bg-gradient-to-r ${a.glow} glow-orb`}
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          {eyebrow && (
            <div
              className={`mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-widest ${a.badge}`}
            >
              {eyebrow}
            </div>
          )}

          <h1 className="font-display text-4xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-5xl">
            {title}
          </h1>

          <p className="mt-6 max-w-2xl text-balance text-lg leading-relaxed text-muted">
            {subtitle}
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
            <a
              href={ctaLink}
              className="w-full rounded-full bg-gradient-to-r from-accent-orange via-accent-pink to-accent-violet px-7 py-3.5 text-center text-sm font-semibold text-white shadow-[0_0_40px_-10px_rgba(139,92,246,0.6)] transition-transform hover:scale-[1.03] sm:w-auto"
            >
              {ctaText}
            </a>
            {secondaryCtaText && secondaryCtaLink && (
              <a
                href={secondaryCtaLink}
                className="w-full rounded-full border border-border px-7 py-3.5 text-center text-sm font-semibold text-foreground transition-colors hover:bg-surface sm:w-auto"
              >
                {secondaryCtaText}
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
