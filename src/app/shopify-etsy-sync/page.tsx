import type { Metadata } from "next";
import type { ReactElement } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import FeatureGrid, { type GridFeature } from "@/components/FeatureGrid";
import CTA from "@/components/CTA";
import { getSessionSummary } from "@/lib/backend";

export const metadata: Metadata = {
  title: "MirrorStock for Shopify — Sync Your Etsy Listings to Shopify",
  description:
    "MirrorStock syncs your Etsy shop's listings, variations, images and prices to your Shopify store in the background, built on Shopify's GraphQL Admin API.",
};

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

function LayersIcon(): ReactElement {
  return (
    <svg {...iconProps()}>
      <path d="M12 2 2 7l10 5 10-5-10-5Z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  );
}
function GaugeIcon(): ReactElement {
  return (
    <svg {...iconProps()}>
      <path d="M12 14 15.5 9" />
      <circle cx="12" cy="14" r="8" />
      <path d="M6.5 8.5 5 7M17.5 8.5 19 7M12 4V2" />
    </svg>
  );
}
function ServerIcon(): ReactElement {
  return (
    <svg {...iconProps()}>
      <rect x="3" y="4" width="18" height="7" rx="1.5" />
      <rect x="3" y="13" width="18" height="7" rx="1.5" />
      <path d="M7 7.5h.01M7 16.5h.01" />
    </svg>
  );
}
function CurrencyIcon(): ReactElement {
  return (
    <svg {...iconProps()}>
      <circle cx="12" cy="12" r="9" />
      <path d="M15 9.5a3 3 0 0 0-3-1.5c-1.7 0-3 .9-3 2s1.3 2 3 2 3 .9 3 2-1.3 2-3 2a3 3 0 0 1-3-1.5" />
      <path d="M12 6.5v11" />
    </svg>
  );
}
function SyncIcon(): ReactElement {
  return (
    <svg {...iconProps()}>
      <path d="M4 8h13M13 3l4 5-4 5" />
      <path d="M20 16H7M11 21l-4-5 4-5" />
    </svg>
  );
}
function StarIcon(): ReactElement {
  return (
    <svg {...iconProps()}>
      <path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.3l-5.9 3.2 1.2-6.5-4.8-4.6 6.6-.9L12 2.5z" />
    </svg>
  );
}

const features: GridFeature[] = [
  {
    title: "Built On Shopify's Admin API",
    desc: "Built on Shopify's current GraphQL Admin API (not the legacy REST product API Shopify has been retiring) - products, options, variants and media publish through a single call per product.",
    icon: LayersIcon,
  },
  {
    title: "Automatic Background Sync",
    desc: "Connect your Etsy shop and your Shopify store once, then MirrorStock checks for changes automatically - no spreadsheets, no re-uploading product photos by hand.",
    icon: GaugeIcon,
  },
  {
    title: "Reliable Under Heavy Traffic",
    desc: "Shopify's own rate limits are handled automatically - a busy sync backs off and retries instead of failing partway through your catalogue.",
    icon: ServerIcon,
  },
  {
    title: "Automatic Currency Conversion",
    desc: "If your Etsy shop prices in one currency and your Shopify store bills in another, MirrorStock converts at the live rate instead of copying the raw number across.",
    icon: CurrencyIcon,
  },
  {
    title: "Edit In Shopify, Sync Back To Etsy",
    desc: "Prefer to fix a title or description in Shopify? Switch that field off and MirrorStock treats Shopify as correct, pushing your edit back to the matching Etsy listing.",
    icon: SyncIcon,
  },
  {
    title: "Etsy Reviews On Your Product Pages",
    desc: "Show your real Etsy star rating and review text on the matching product page, with a link back to the listing on Etsy. Star rating and text only, never the buyer's name or photo. Pro and Unlimited plans.",
    icon: StarIcon,
  },
];

export default async function ShopifyEtsySyncPage() {
  const session = await getSessionSummary();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar session={session} />
      <main className="flex-1">
        <HeroSection
          eyebrow="For Shopify stores"
          title={
            <>
              Keep your <span className="text-accent-green">Shopify store</span>{" "}
              in sync with your <span className="text-accent-orange">Etsy shop</span>
            </>
          }
          subtitle="MirrorStock reads your active Etsy listings - products, variations, images, descriptions and prices - and keeps the matching products in your Shopify store up to date automatically."
          ctaText="Connect Your Shopify Store"
          ctaLink="/signup"
          secondaryCtaText="See how it works"
          secondaryCtaLink="/#how-it-works"
          accent="green"
        />

        <FeatureGrid
          eyebrow="Shopify Integration"
          title={
            <>
              Built for <span className="text-accent-green">Shopify</span>{" "}
              sellers who also sell on Etsy
            </>
          }
          subtitle="A narrow, purpose-built sync - not a generic multi-channel tool retrofitted onto Shopify."
          features={features}
          accent="green"
        />

        <section className="py-4 lg:py-8">
          <div className="mx-auto max-w-3xl px-6 text-center lg:px-8">
            <p className="text-sm text-muted">
              Selling on Wix instead?{" "}
              <a href="/wix-etsy-sync" className="font-medium text-accent-blue underline decoration-border underline-offset-4 hover:text-foreground">
                See the Wix integration &rarr;
              </a>
            </p>
          </div>
        </section>

        <CTA />
      </main>
      <Footer />
    </div>
  );
}
