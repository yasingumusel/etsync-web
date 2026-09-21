"use client";

import { useState } from "react";

type Feature = { label: string; soon?: boolean };

type Plan = {
  name: string;
  limit: string;
  monthly: number;
  yearlyMonthly: number;
  highlight?: boolean;
  features: Feature[];
};

// Every plan spells out its full feature list rather than saying "everything
// in the plan before", so a visitor can read one column and stop. Anything
// still being built carries `soon` so the page never claims more than the
// product actually does today.
const plans: Plan[] = [
  {
    name: "Free",
    limit: "Up to 5 products",
    monthly: 0,
    yearlyMonthly: 0,
    features: [
      { label: "Products, variations and images" },
      { label: "Automatic currency conversion" },
      { label: "Sync on demand" },
      { label: "Automatic sync every 4 hours" },
      { label: "Sync history and notifications" },
      { label: "“View on Etsy” link on every product" },
    ],
  },
  {
    name: "Starter",
    limit: "Up to 50 products",
    monthly: 9.99,
    yearlyMonthly: 7.99,
    features: [
      { label: "Products, variations and images" },
      { label: "Automatic currency conversion" },
      { label: "Sync on demand" },
      { label: "Automatic sync every 4 hours" },
      { label: "Sync history and notifications" },
      { label: "“View on Etsy” link on every product" },
      { label: "Preview changes before syncing" },
      { label: "Email support" },
    ],
  },
  {
    name: "Growth",
    limit: "Up to 100 products",
    monthly: 19.99,
    yearlyMonthly: 15.99,
    highlight: true,
    features: [
      { label: "Products, variations and images" },
      { label: "Automatic currency conversion" },
      { label: "Sync on demand" },
      { label: "Automatic sync every 4 hours" },
      { label: "Sync history and notifications" },
      { label: "“View on Etsy” link on every product" },
      { label: "Preview changes before syncing" },
      { label: "Email support" },
    ],
  },
  {
    name: "Pro",
    limit: "Up to 200 products",
    monthly: 25,
    yearlyMonthly: 19.99,
    features: [
      { label: "Products, variations and images" },
      { label: "Automatic currency conversion" },
      { label: "Sync on demand" },
      { label: "Automatic sync every 4 hours" },
      { label: "Faster sync — every 2 hours" },
      { label: "Sync history and notifications" },
      { label: "“View on Etsy” link on every product" },
      { label: "Preview changes before syncing" },
      { label: "Etsy reviews on your product pages" },
      { label: "2 connected stores", soon: true },
      { label: "Priority support" },
    ],
  },
  {
    name: "Unlimited",
    limit: "Unlimited products",
    monthly: 35,
    yearlyMonthly: 27.99,
    features: [
      { label: "Products, variations and images" },
      { label: "Automatic currency conversion" },
      { label: "Sync on demand" },
      { label: "Automatic sync every 4 hours" },
      { label: "Faster sync — every hour" },
      { label: "Sync history and notifications" },
      { label: "“View on Etsy” link on every product" },
      { label: "Preview changes before syncing" },
      { label: "Etsy reviews on your product pages" },
      { label: "5 connected stores", soon: true },
      { label: "Priority support" },
    ],
  },
];

function price(n: number) {
  return n % 1 === 0 ? `$${n}` : `$${n.toFixed(2)}`;
}

export default function Pricing() {
  const [yearly, setYearly] = useState(false);

  return (
    <section id="pricing" className="relative border-t border-border/60 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-accent-orange">
            Pricing
          </span>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Pay for what you{" "}
            <span className="text-gradient">actually sync</span>
          </h2>
          <p className="mt-4 text-balance text-lg text-muted">
            Plans are based on how many products you sync. Move up or down at
            any time — your plan follows your catalogue.
          </p>
        </div>

        <div className="mt-10 flex flex-col items-center gap-3">
          <div className="inline-flex items-center rounded-full border border-border bg-surface p-1">
            <button
              type="button"
              onClick={() => setYearly(false)}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                !yearly ? "bg-foreground text-background" : "text-muted hover:text-foreground"
              }`}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setYearly(true)}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                yearly ? "bg-foreground text-background" : "text-muted hover:text-foreground"
              }`}
            >
              Yearly
              <span className="ml-1.5 text-xs font-medium opacity-80">−20%</span>
            </button>
          </div>
          <p className="inline-flex items-center gap-2 rounded-full bg-accent-pink/10 px-3.5 py-1.5 text-xs font-semibold text-accent-pink">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-pink" />
            Launch offer — 50% off every plan
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {plans.map((p) => {
            const now = yearly ? p.yearlyMonthly : p.monthly;
            const isFree = now === 0;

            return (
              <div
                key={p.name}
                className={`card-glass relative flex flex-col rounded-2xl p-6 ${
                  p.highlight ? "border-accent-violet/50 ring-1 ring-accent-violet/30" : ""
                }`}
              >
                {p.highlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-gradient-to-r from-accent-orange via-accent-pink to-accent-violet px-3 py-1 text-[11px] font-semibold text-white">
                    Most popular
                  </span>
                )}

                <h3 className="font-display text-base font-semibold text-foreground">
                  {p.name}
                </h3>
                <p className="mt-1 text-xs text-muted">{p.limit}</p>

                <div className="mt-5">
                  {isFree ? (
                    <p className="font-display text-3xl font-bold text-foreground">Free</p>
                  ) : (
                    <>
                      <p className="text-sm text-muted line-through">{price(now * 2)}</p>
                      <p className="font-display text-3xl font-bold text-foreground">
                        {price(now)}
                        <span className="text-sm font-medium text-muted">/mo</span>
                      </p>
                      {yearly && (
                        <p className="mt-1 text-xs text-muted">
                          {price(Number((now * 12).toFixed(2)))} billed yearly
                        </p>
                      )}
                    </>
                  )}
                </div>

                <ul className="mt-6 flex-1 space-y-2.5">
                  {p.features.map((f) => (
                    <li
                      key={f.label}
                      className="flex items-start gap-2 text-xs leading-relaxed text-muted"
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        className={`mt-0.5 shrink-0 ${f.soon ? "text-muted/50" : "text-emerald-600"}`}
                      >
                        <path
                          d="M5 13l4 4L19 7"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span>
                        {f.label}
                        {f.soon && (
                          <span className="ml-1.5 whitespace-nowrap rounded-full bg-surface-2 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted">
                            Soon
                          </span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>

                <a
                  href="/signup"
                  className={`mt-6 block rounded-full px-5 py-2.5 text-center text-sm font-semibold transition-transform hover:scale-[1.02] ${
                    p.highlight
                      ? "bg-gradient-to-r from-accent-orange via-accent-pink to-accent-violet text-white"
                      : "border border-border text-foreground hover:bg-surface-2"
                  }`}
                >
                  {isFree ? "Start free" : "Get started"}
                </a>
              </div>
            );
          })}
        </div>

        <p className="mx-auto mt-10 max-w-2xl text-center text-xs leading-relaxed text-muted">
          Paid plans are billed through the Wix App Market once our listing is
          published. Early access accounts start on the Free plan, and we will
          tell you before anything is ever charged.
        </p>
      </div>
    </section>
  );
}
