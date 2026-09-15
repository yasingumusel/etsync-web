"use client";

import { useState } from "react";

const faqs = [
  {
    q: "Exactly what does ETSYNC read from Etsy?",
    a: "Only my shop's active listings and basic shop info, using Etsy's listings_r and shops_r scopes. That's it — no receipts, no transactions, no buyer or order data.",
  },
  {
    q: "Does ETSYNC ever write anything to Etsy?",
    a: "No. Access is strictly read-only. ETSYNC never edits, creates, or uploads listings, never changes shop settings, and never sends email or messages through Etsy.",
  },
  {
    q: "Does the sync work the other way, from Wix back to Etsy?",
    a: "No. Sync runs one direction only: Etsy listing data flows to Wix. Nothing flows from Wix back to Etsy.",
  },
  {
    q: "Who can connect their Etsy shop to ETSYNC?",
    a: "Only me. ETSYNC was built for my own Etsy shop and my own Wix store. There's no sign-up, no invite system, and no other seller's account connected to it.",
  },
  {
    q: "Do you share Etsy shop data with any third party?",
    a: "No. Data read through the Etsy API is used only to update inventory on my own connected Wix store. It's never sold, licensed, or shared with any other company or app.",
  },
  {
    q: "Is it safe for a reviewer to see how this works?",
    a: "Yes — that's the point of this page. Connections go through Etsy's and Wix's official OAuth 2.0 login, credentials are never stored in plain text, and access can be revoked at any time from Etsy's own account settings.",
  },
  {
    q: "Will ETSYNC ever be offered to other sellers?",
    a: "Not currently, and there's no timeline for that. If it changes, this page and the underlying Etsy API access request will be updated to match before anyone else is connected.",
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