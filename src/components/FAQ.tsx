"use client";

import { useState } from "react";

const faqs = [
  {
    q: "Exactly what does MirrorStock read from my Etsy shop?",
    a: "Only your shop's active listings and basic shop info, using Etsy's listings_r and shops_r scopes. That's it — no receipts, no transactions, no buyer, order or payment data.",
  },
  {
    q: "Does MirrorStock ever write anything to my Etsy shop?",
    a: "Only if you turn it on, in two ways. If you switch off syncing a listing's title or description, MirrorStock writes your store's current value back to that Etsy listing. And if you fill in your defaults for new Etsy listings, products you created in Wix or Shopify are published to Etsy as drafts (title, description, price and variations, no photos) for you to review and activate yourself. It never deletes listings, never changes an existing listing's price, stock or photos, never changes shop settings, and never sends email or messages through Etsy.",
  },
  {
    q: "Does the sync work the other way, from Wix or Shopify back to Etsy?",
    a: "Yes, in two ways. Turn off syncing a product's title or description and MirrorStock treats your store's edit as correct, pushing it back to the matching Etsy listing on the next sync. And a product you create in Wix or Shopify can be published to Etsy as a new draft listing. For products that came from Etsy, price, images and variants still flow one direction only (Etsy to your store).",
  },
  {
    q: "Will running a sync twice create duplicate products?",
    a: "No. Each product is matched by a stable identifier derived from its Etsy listing, so a second sync updates the product that is already there instead of creating another copy.",
  },
  {
    q: "What happens if my two stores use different currencies?",
    a: "Prices are converted at the live exchange rate before they are written to your store, rather than copied across as raw numbers. Wix and Shopify stores each have a single store-wide currency, so this matters more than it sounds.",
  },
  {
    q: "Do you share my shop data with any third party?",
    a: "No. Data read through the Etsy API is used only to update the products in your own connected store. It is never sold, licensed, or shared with any other company or app.",
  },
  {
    q: "Who can connect a shop today?",
    a: "Any Etsy seller. MirrorStock completed Etsy's commercial API review, so any shop can connect through Etsy's standard authorization screen — it's no longer limited to a single developer account.",
  },
  {
    q: "How often does MirrorStock check for changes, and will I get spammed with alerts?",
    a: "Every 4 hours, automatically, on top of whatever you trigger yourself from the dashboard. Most of those checks find nothing new — and those are not logged or notified. Your sync history and notification bell only ever fill up with runs that actually changed something, so a quiet week looks quiet.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 lg:py-32">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        <div className="text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-accent-blue">
            FAQ
          </span>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Frequently asked questions
          </h2>
        </div>

        <div className="mt-12 divide-y divide-border rounded-2xl border border-border bg-surface/40">
          {faqs.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={item.q} className="px-6">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 py-5 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm font-medium text-foreground sm:text-base">
                    {item.q}
                  </span>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    className={`shrink-0 text-muted transition-transform ${
                      isOpen ? "rotate-45" : ""
                    }`}
                  >
                    <path
                      d="M12 5v14M5 12h14"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
                {isOpen && (
                  <p className="pb-5 text-sm leading-relaxed text-muted">
                    {item.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}