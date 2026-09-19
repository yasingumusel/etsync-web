/**
 * Jason's entire knowledge, as keyword-matched Q&A entries - no external AI
 * API, no cost, runs entirely on our own server. Every answer here matches
 * the live marketing site copy (Features.tsx, Pricing.tsx, HowItWorks.tsx,
 * ApiTrust.tsx, FAQ.tsx, Status.tsx) and the backend's real, verified
 * behaviour - if the site changes, this should change with it. Jason must
 * never claim more than what a visitor could already read on the site, and
 * never anything about Etsy/Wix beyond what's accurate and permitted here.
 *
 * `jasonAnswer()` below scores each entry against the visitor's message and
 * returns the best match, or a fallback pointing to support@mirrorstock.com
 * when nothing scores well enough - it never invents an answer.
 */
export type FaqEntry = {
  id: string;
  /** Single words score on exact match; multi-word phrases score on substring match, weighted higher. */
  keywords: string[];
  answer: string;
  /** Overrides jasonBot.ts's default minimum score - for short entries like
   *  "hi" that would otherwise never reach the default threshold. */
  minScore?: number;
};

export const SUPPORT_EMAIL = "support@mirrorstock.com";

export const FALLBACK_ANSWER =
  "I'm not sure about that one - I only know what's on this site, and I don't want to guess. " +
  `For anything specific to your account, or a question I couldn't answer, email ${SUPPORT_EMAIL} and a real person will help.`;

export const JASON_FAQ: FaqEntry[] = [
  {
    id: "greeting",
    keywords: ["hi", "hello", "hey", "yo", "greetings", "good morning", "good afternoon"],
    minScore: 1,
    answer:
      "Hi! I'm Jason, MirrorStock's support bot. I can answer questions about pricing, how the sync works, and what data it reads from Etsy. What would you like to know?",
  },
  {
    id: "thanks",
    keywords: ["thanks", "thank you", "thx", "appreciate it", "cheers"],
    minScore: 1,
    answer: `You're welcome! If anything else comes up, I'm here - or email ${SUPPORT_EMAIL} for anything account-specific.`,
  },
  {
    id: "what-is-it",
    keywords: [
      "what is mirrorstock",
      "what does mirrorstock do",
      "what does this do",
      "what is this",
      "what is this app",
      "what is this site",
      "explain mirrorstock",
      "tell me about mirrorstock",
    ],
    answer:
      "MirrorStock reads the active listings in your Etsy shop - products, variations, images, descriptions and prices - and keeps the matching products in your connected Wix store up to date automatically. Sync is one-way, Etsy to Wix: nothing is ever written back to your Etsy shop.",
  },
  {
    id: "how-it-works",
    keywords: [
      "how does it work",
      "how does the sync work",
      "how it works",
      "how does syncing work",
    ],
    answer:
      "Three steps: (1) You connect your Etsy shop and your Wix store through each platform's own official login. (2) MirrorStock reads your active Etsy listings, including variations, images and prices. (3) It creates or updates the matching products in your Wix store - existing products are updated in place, nothing is duplicated, and your Etsy shop itself is never modified.",
  },
  {
    id: "one-way",
    keywords: [
      "one way",
      "one-way",
      "two way",
      "two-way",
      "both directions",
      "does it sync back",
      "write back",
      "wix to etsy",
      "from wix to etsy",
    ],
    answer:
      "Sync currently runs one direction only: from Etsy to Wix. Nothing created or edited in Wix is ever sent back to Etsy - your Etsy shop is read-only from MirrorStock's side. Two-way sync is on the roadmap but not available yet.",
  },
  {
    id: "duplicates",
    keywords: [
      "duplicate",
      "duplicates",
      "run twice",
      "sync twice",
      "run it again",
      "create copies",
    ],
    answer:
      "No. Each product is matched by a stable identifier tied to its Etsy listing, so running a sync again updates the product that's already there instead of creating a duplicate.",
  },
  {
    id: "etsy-scopes",
    keywords: [
      "what does it read",
      "what data",
      "etsy scope",
      "scopes",
      "listings_r",
      "shops_r",
      "permissions",
      "access",
      "what can it see",
      "what does it access",
    ],
    answer:
      "MirrorStock requests exactly two read-only Etsy scopes: listings_r (your shop's active listings) and shops_r (basic shop info). Nothing else - no receipts, no transactions, no shop management, no order or payment data.",
  },
  {
    id: "writes-to-etsy",
    keywords: [
      "write to etsy",
      "edit etsy",
      "change etsy",
      "modify etsy",
      "delete etsy listing",
      "upload to etsy",
      "does it edit my etsy",
    ],
    answer:
      "No - access is strictly read-only. MirrorStock never creates, edits, deletes, or uploads anything on Etsy, never changes your shop settings, and never sends email or messages through Etsy.",
  },
  {
    id: "sales-data",
    keywords: [
      "sales data",
      "order data",
      "payment data",
      "receipts",
      "transactions",
      "revenue",
      "buyer information",
      "buyer data",
      "customer data",
    ],
    answer:
      "MirrorStock never reads your sales, order, or payment data from Etsy - it only reads listing and inventory information (titles, prices, images, variations) needed to rebuild your products on your Wix store.",
  },
  {
    id: "affiliated",
    keywords: [
      "affiliated",
      "endorsed",
      "official",
      "partner",
      "owned by etsy",
      "owned by wix",
      "part of etsy",
      "part of wix",
      "certified",
    ],
    answer:
      "No - MirrorStock is an independent product, not affiliated with, endorsed by, or certified by Etsy, Inc. or Wix.com Ltd. 'Etsy' is a trademark of Etsy, Inc.; 'Wix' is a trademark of Wix.com Ltd.",
  },
  {
    id: "password-security",
    keywords: [
      "password",
      "see my password",
      "store my password",
      "login credentials",
      "secure",
      "security",
      "safe",
    ],
    answer:
      "You connect your Etsy shop and your Wix store through each platform's own official login (OAuth). MirrorStock never sees or stores your Etsy or Wix password, and you can revoke access from your Etsy account at any time.",
  },
  {
    id: "variants",
    keywords: [
      "variant",
      "variants",
      "variation",
      "variations",
      "size",
      "color",
      "colour",
      "options",
      "different prices",
    ],
    answer:
      "Yes. Real Etsy variations like size and colour become proper Wix product options, each with its own price and SKU - not one flattened product with a single price.",
  },
  {
    id: "currency",
    keywords: [
      "currency",
      "exchange rate",
      "different currency",
      "usd",
      "convert price",
      "price conversion",
    ],
    answer:
      "If your Etsy shop and your Wix site use different currencies, prices are converted at the live exchange rate before being written to your store, rather than copied over as raw numbers. This can be turned off per store in the dashboard's sync settings if you'd rather handle it yourself.",
  },
  {
    id: "which-products",
    keywords: [
      "which products sync",
      "choose products",
      "select products",
      "pick listings",
      "specific listings",
      "all products",
      "some products",
    ],
    answer:
      "You choose: sync all active listings (new ones sync automatically too), or pick exactly which listings you want, right from the dashboard. You can also choose whether to include draft/unpublished Etsy listings - those sync in as hidden, unpublished Wix products.",
  },
  {
    id: "sync-frequency",
    keywords: [
      "how often",
      "sync frequency",
      "automatic sync",
      "how many times",
      "update frequency",
      "real time",
      "instant",
      "every hour",
      "every day",
    ],
    answer:
      "MirrorStock automatically checks for changes every 4 hours in the background, plus you can trigger a manual sync anytime from the dashboard with the 'Sync Now' button. Most automatic checks find nothing new and aren't logged - your sync history and notifications only fill up with runs that actually changed something.",
  },
  {
    id: "notifications-history",
    keywords: [
      "notification",
      "notifications",
      "sync history",
      "log",
      "bell icon",
      "alerts",
    ],
    answer:
      "Yes - the dashboard has a notification bell and a sync history log. They only show runs where something actually changed, not every background check, so a quiet week looks quiet instead of being cluttered with 'nothing changed' entries.",
  },
  {
    id: "removed-listing",
    keywords: [
      "delete listing",
      "remove listing",
      "deactivate",
      "listing removed",
      "listing expired",
      "still shows",
    ],
    answer:
      "If a listing is removed or deactivated on Etsy, the matching Wix product is automatically hidden (not deleted) so it stops showing to shoppers. If you later make it visible again yourself, MirrorStock won't fight that decision.",
  },
  {
    id: "shopify",
    keywords: ["shopify"],
    minScore: 1, // a single, highly distinctive brand keyword - safe at a lower bar
    answer:
      "Not yet - Wix is the only destination store MirrorStock supports today. Shopify support is on the roadmap.",
  },
  {
    id: "who-can-connect",
    keywords: [
      "can i connect",
      "sign up",
      "get started",
      "join",
      "is it available",
      "early access",
      "who can use",
      "can i use this",
    ],
    answer:
      "MirrorStock is in early access while its Etsy commercial API review is in progress. Until that's approved, only the app's own developer shop can connect. Once approved, any Etsy seller will be able to connect their own shop through Etsy's standard authorization screen.",
  },
  {
    id: "pricing",
    keywords: [
      "price",
      "pricing",
      "cost",
      "how much",
      "plans",
      "subscription",
      "free plan",
      "expensive",
      "cheap",
    ],
    answer:
      "Five plans, all with product limits: Free (up to 5 products, $0), Starter (up to 50, $9.99/mo or $7.99/mo billed yearly), Growth (up to 100, $19.99/mo or $15.99/mo yearly - most popular), Pro (up to 200, $25/mo or $19.99/mo yearly), and Unlimited ($35/mo or $27.99/mo yearly). Every plan includes automatic currency conversion, automatic sync every 4 hours, and sync history/notifications. There's currently a launch offer of 50% off every plan.",
  },
  {
    id: "billing",
    keywords: [
      "billing",
      "charged",
      "credit card",
      "payment method",
      "get charged",
      "wix app market",
    ],
    answer:
      "Nothing is billed without telling you first. Early-access accounts are currently on the Free plan, and paid plans will be billed through the Wix App Market once MirrorStock is published there.",
  },
  {
    id: "contact-support",
    keywords: [
      "contact",
      "support",
      "help",
      "email",
      "human",
      "real person",
      "talk to someone",
      "customer service",
    ],
    answer: `For anything account-specific - a failed sync, a billing question, a bug, or anything I can't answer - email ${SUPPORT_EMAIL} and a real person will help.`,
  },
  {
    id: "legal",
    keywords: [
      "terms",
      "terms of service",
      "privacy",
      "privacy policy",
      "data sharing",
      "share my data",
      "sell my data",
      "gdpr",
    ],
    answer: `MirrorStock doesn't sell or share your shop data with third parties - it's only used to keep your connected store in sync. Full details are in the Terms of Service (/terms) and Privacy Policy (/privacy) pages.`,
  },
  {
    id: "who-are-you",
    keywords: [
      "are you ai",
      "are you a bot",
      "are you human",
      "are you real",
      "who are you",
      "what are you",
    ],
    answer:
      "I'm Jason, an automated support assistant for MirrorStock - not a human. I answer from a fixed set of facts about the product, so I won't guess or make things up. For anything I can't help with, email " +
      SUPPORT_EMAIL +
      ".",
  },
];
