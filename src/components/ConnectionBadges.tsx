"use client";

import { useState } from "react";

export type ConnectionStatus = {
  etsyConnected: boolean;
  targetStores: { platform: string }[];
};

const badgeClass = (connected: boolean) =>
  `inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
    connected ? "bg-emerald-400/10 text-emerald-600" : "bg-red-400/10 text-red-500"
  }`;

const linkClass = "text-xs font-medium text-accent-violet underline-offset-2 hover:underline";

/**
 * The Etsy / Wix / Shopify connection strip shown on both dashboard tabs.
 * Shopify needs one extra step the others don't: its OAuth has to know
 * which shop it's talking to before it can start, so clicking through opens
 * a small field for the merchant's myshopify.com address.
 */
export default function ConnectionBadges({ status }: { status: ConnectionStatus }) {
  const [shopFormOpen, setShopFormOpen] = useState(false);
  const [shop, setShop] = useState("");

  const wixConnected = status.targetStores.some((s) => s.platform === "wix");
  const shopifyConnected = status.targetStores.some((s) => s.platform === "shopify");

  function connectShopify(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = shop.trim().replace(/^https?:\/\//, "").replace(/\/.*$/, "");
    if (!trimmed) return;
    const domain = trimmed.endsWith(".myshopify.com") ? trimmed : `${trimmed}.myshopify.com`;
    window.location.href = `/api/shopify/connect?shop=${encodeURIComponent(domain)}`;
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <span className={badgeClass(status.etsyConnected)}>
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
          Etsy {status.etsyConnected ? "connected" : "not connected"}
        </span>
        <a href="/api/etsy/reconnect" target="_blank" rel="noopener" className={linkClass}>
          {status.etsyConnected ? "Reconnect Etsy" : "Connect Etsy"}
        </a>

        <span className={badgeClass(wixConnected)}>
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
          Wix {wixConnected ? "connected" : "not connected"}
        </span>
        <a href="/api/wix/connect" className={linkClass}>
          {wixConnected ? "Reconnect Wix store" : "Connect Wix store"}
        </a>

        <span className={badgeClass(shopifyConnected)}>
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
          Shopify {shopifyConnected ? "connected" : "not connected"}
        </span>
        <button type="button" onClick={() => setShopFormOpen((v) => !v)} className={linkClass}>
          {shopifyConnected ? "Reconnect Shopify store" : "Connect Shopify store"}
        </button>
      </div>

      {shopFormOpen && (
        <form onSubmit={connectShopify} className="mt-3 flex flex-wrap items-center gap-2">
          <input
            type="text"
            autoFocus
            value={shop}
            onChange={(e) => setShop(e.target.value)}
            placeholder="your-store.myshopify.com"
            className="w-64 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent-violet"
          />
          <button
            type="submit"
            className="rounded-full bg-gradient-to-r from-accent-orange via-accent-pink to-accent-violet px-4 py-2 text-xs font-semibold text-white transition-transform hover:scale-[1.02]"
          >
            Continue to Shopify
          </button>
          <span className="text-[11px] text-muted">
            You&apos;ll approve the install on Shopify, then come back here.
          </span>
        </form>
      )}
    </div>
  );
}
