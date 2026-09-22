import type { Metadata } from "next";
import type { ReactElement } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import FeatureGrid, { type GridFeature } from "@/components/FeatureGrid";
import CTA from "@/components/CTA";
import { getSessionSummary } from "@/lib/backend";

export const metadata: Metadata = {
  title: "Wix Etsy Inventory Sync App — MirrorStock",
  description:
    "Sync your Etsy shop's listings, variations, images and prices to your Wix store automatically. MirrorStock is a Wix App Market approved Etsy integration - no spreadsheets, no manual re-listing.",
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

function BadgeIcon(): ReactElement {
  return (
    <svg {...iconProps()}>
      <path d="M12 2 4 5v6c0 5 3.5 8.5 8 11 4.5-2.5 8-6 8-11V5l-8-3Z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}
function BoltIcon(): ReactElement {
  return (
    <svg {...iconProps()}>
      <path d="M13 2 4.5 13.5H11L9 22l9.5-11.5H12L13 2Z" />
    </svg>
  );
}
function StoreIcon(): ReactElement {
  return (
    <svg {...iconProps()}>
      <path d="M3 9 4 4h16l1 5" />
      <path d="M4 9h16v11H4z" />
      <path d="M9 20v-6h6v6" />
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
    title: "Wix App Market Approved",
    desc: "MirrorStock is reviewed and published on the Wix App Market, installed the same way as any other Wix app - straight from your Wix Editor, no separate account or plugin file.",
    icon: BadgeIcon,
  },
  {
    title: "Connect Once, Sync Automatically",
    desc: "Connect your Etsy shop and your Wix store through each platform's own login, then MirrorStock checks for changes in the background - no spreadsheets, no manual re-listing.",
    icon: BoltIcon,
  },
  {
    title: "Real Wix Product Options",
    desc: "Etsy size and colour variations become real Wix product options, each with its own price and SKU - not a single flattened product listed at one price.",
    icon: StoreIcon,
  },
  {
    title: "Automatic Currency Conversion",
    desc: "If your Etsy shop prices in one currency and your Wix site bills in another, MirrorStock converts at the live rate instead of copying the raw number across.",
    icon: CurrencyIcon,
  },
  {
    title: "Edit In Wix, Sync Back To Etsy",
    desc: "Prefer to fix a title or description in the Wix editor? Switch that field off and MirrorStock treats Wix as correct, pushing your edit back to the matching Etsy listing.",
    icon: SyncIcon,
  },
  {
    title: "Etsy Reviews On Your Product Pages",
    desc: "Show your real Etsy star rating and review text on the matching Wix product page - not just a generic store-wide list. Star rating and text only, never the buyer's name or photo.",
    icon: StarIcon,
  },
];

export default async function WixEtsySyncPage() {
  const session = await getSessionSummary();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar session={session} />
      <main className="flex-1">
        <HeroSection
          eyebrow="Wix App Market · Approved App"
          title={
            <>
              Keep your <span className="text-accent-blue">Wix store</span>{" "}
              in sync with your <span className="text-accent-orange">Etsy shop</span>
            </>
          }
          subtitle="MirrorStock reads your active Etsy listings - products, variations, images, descriptions and prices - and keeps the matching products in your Wix store up to date automatically."
          ctaText="Install from Wix App Market"
          ctaLink="/signup"
          secondaryCtaText="See how it works"
          secondaryCtaLink="/#how-it-works"
          accent="blue"
        />

        <FeatureGrid
          eyebrow="Wix Integration"
          title={
            <>
              Built for <span className="text-accent-blue">Wix</span> sellers
              who also sell on Etsy
            </>
          }
          subtitle="A narrow, purpose-built sync - not a generic multi-channel tool retrofitted onto Wix."
          features={features}
          accent="blue"
        />

        <section className="py-4 lg:py-8">
          <div className="mx-auto max-w-3xl px-6 text-center lg:px-8">
            <p className="text-sm text-muted">
              Selling on Shopify instead?{" "}
              <a href="/shopify-etsy-sync" className="font-medium text-accent-green underline decoration-border underline-offset-4 hover:text-foreground">
                See the Shopify integration &rarr;
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
