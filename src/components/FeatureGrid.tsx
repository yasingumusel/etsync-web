import type { ReactElement } from "react";

export type GridFeature = {
  title: string;
  desc: string;
  icon: () => ReactElement;
};

type Accent = "orange" | "blue" | "green";

const iconWrapClasses: Record<Accent, string> = {
  orange: "bg-gradient-to-br from-accent-orange/20 via-accent-pink/20 to-accent-violet/20 text-accent-pink",
  blue: "bg-gradient-to-br from-accent-blue/20 via-accent-violet/20 to-accent-pink/20 text-accent-blue",
  green: "bg-gradient-to-br from-accent-green/20 via-accent-blue/15 to-accent-violet/15 text-accent-green",
};

const eyebrowClasses: Record<Accent, string> = {
  orange: "text-accent-orange",
  blue: "text-accent-blue",
  green: "text-accent-green",
};

/**
 * Generic feature grid for a platform-specific landing page - the reusable
 * shape behind the homepage's own <Features /> section, parameterised so
 * /wix-etsy-sync and /shopify-etsy-sync can each supply their own
 * platform-specific benefits and accent color instead of duplicating the
 * card/grid markup.
 */
export default function FeatureGrid({
  eyebrow,
  title,
  subtitle,
  features,
  accent = "orange",
}: {
  eyebrow: string;
  title: React.ReactNode;
  subtitle: string;
  features: GridFeature[];
  accent?: Accent;
}) {
  return (
    <section className="relative py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className={`text-xs font-semibold uppercase tracking-widest ${eyebrowClasses[accent]}`}>
            {eyebrow}
          </span>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {title}
          </h2>
          <p className="mt-4 text-balance text-lg text-muted">{subtitle}</p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="card-glass group rounded-2xl p-6 transition-colors hover:border-accent-violet/40"
            >
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconWrapClasses[accent]}`}>
                <f.icon />
              </div>
              <h3 className="mt-5 font-display text-base font-semibold text-foreground">
                {f.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
