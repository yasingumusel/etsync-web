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
    id: "login",
    keywords: [
      "login",
      "log in",
      "sign in",
      "signin",
      "logging in",
      "can't log in",
      "cant log in",
      "forgot password",
      "reset password",
      "password reset",
      "my account",
      "dashboard access",
    ],
    minScore: 1, // "login"/"log in"/"sign in" are unambiguous enough on their own
    answer:
      "Use the \"Log In\" link at the top of the site with the email and password you set - you create that password at the end of the Etsy connect/setup process, so if you haven't connected your Etsy shop yet, that's the first step. There's no self-serve password reset yet - if you're locked out, email support@mirrorstock.com and a real person will help.",
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
      "invoice",
      "update billing",
      "billing information",
      "cancel my subscription",
      "cancel subscription",
      "refund policy",
      "get a refund",
      "how do i cancel",
      "upgrade my plan",
      "upgrade to a higher plan",
      "change my plan",
    ],
    answer:
      "Nothing is billed without telling you first - MirrorStock is in early access and every account is currently on the Free plan, with no paid subscription to invoice, cancel, refund, or upgrade yet. Once paid plans launch, billing (invoices, payment methods, upgrades, cancellations, refunds) will be handled through the Wix App Market, following Wix's own billing rules. For anything before then, email support@mirrorstock.com.",
  },
  {
    id: "annual-discount",
    keywords: [
      "annual discount",
      "yearly discount",
      "discount for annual",
      "annual payment",
      "yearly payment",
      "pay yearly",
      "pay annually",
      "save money yearly",
    ],
    answer:
      "Yes - paying yearly instead of monthly is about 20% cheaper on every plan (e.g. Starter is $9.99/mo billed monthly vs $7.99/mo billed yearly). Full breakdown is on the pricing section of the homepage.",
  },
  {
    id: "free-trial",
    keywords: [
      "free trial",
      "trial period",
      "credit card required",
      "need a credit card",
      "trial without credit card",
    ],
    answer:
      "There's no time-limited trial and no credit card needed to start - the Free plan is free for as long as you use it, for up to 5 products. You'd only need a paid plan if you outgrow that.",
  },
  {
    id: "custom-integration",
    keywords: [
      "integrate into my website",
      "integrate into my system",
      "embed this",
      "integrate this app",
      "add to my website",
      "my own system",
    ],
    answer:
      "MirrorStock isn't something you embed into your own website or codebase - it's a ready-made app you connect to your existing Etsy shop and Wix store through each platform's own login screen. There's nothing to build or install on your end.",
  },
  {
    id: "other-integrations",
    keywords: [
      "wordpress",
      "salesforce",
      "slack",
      "integration with",
      "do you integrate",
      "connect to wordpress",
      "connect to salesforce",
      "connect to slack",
    ],
    answer:
      "Today MirrorStock only connects Etsy (as the source) to Wix (as the destination). There's no WordPress, Salesforce, or Slack integration, and Shopify support (as a second destination) is on the roadmap but not available yet.",
  },
  {
    id: "coding-knowledge",
    keywords: [
      "coding knowledge",
      "need to code",
      "technical skills",
      "programming knowledge",
      "developer skills required",
    ],
    answer:
      "No coding needed. Setting it up is just logging into Etsy and Wix through their own official screens, then picking which products to sync in a short setup wizard.",
  },
  {
    id: "api-docs",
    keywords: ["api documentation", "your api", "public api", "developer api", "api docs"],
    answer:
      "MirrorStock doesn't publish a public API for customers to build against - it's a ready-made sync tool, not a developer platform. It does use Etsy's and Wix's own official APIs behind the scenes to do the syncing.",
  },
  {
    id: "team-members",
    keywords: [
      "team member",
      "add a user",
      "invite a user",
      "multiple users",
      "add teammate",
      "shared account",
    ],
    answer:
      "Not yet - each account is a single login today. Adding team members or multiple users to one account isn't available yet.",
  },
  {
    id: "export-data",
    keywords: ["export my data", "export as csv", "export as excel", "download my data", "csv export"],
    answer:
      "There's no data export feature today. If you need something specific, email support@mirrorstock.com and describe what you're after.",
  },
  {
    id: "feature-request",
    keywords: [
      "do you have this feature",
      "does it have feature",
      "is there a feature",
      "feature request",
      "specific feature",
    ],
    answer:
      "Check the Features and Product Status sections on the homepage for what's shipped versus on the roadmap. If you don't see what you're after, ask me about that specific feature, or email support@mirrorstock.com - it might be worth passing along as a request.",
  },
  {
    id: "status-outage",
    keywords: ["is it down", "system down", "outage", "latency", "not working right now", "service status"],
    answer:
      "There's no public status page today. If something seems broken or slow, email support@mirrorstock.com with what you're seeing and it'll get looked into directly.",
  },
  {
    id: "error-code",
    keywords: ["error code", "getting an error", "this error", "what should i do about this error"],
    answer:
      "I don't have access to your account or logs, so I can't diagnose a specific error. Email support@mirrorstock.com with the exact error message and what you were doing when it happened.",
  },
  {
    id: "usage-limit",
    keywords: [
      "usage limit",
      "exceed my limit",
      "monthly limit",
      "api calls limit",
      "data limit",
      "go over my limit",
    ],
    answer:
      "Plan product limits aren't actually enforced yet - MirrorStock is in early access, so nothing will suddenly stop working if you pass a plan's product count today. That will change once paid plans and limits go live; email support@mirrorstock.com for specifics.",
  },
  {
    id: "data-security",
    keywords: ["where is my data stored", "how secure", "data security", "is my data safe", "encrypted"],
    answer:
      "Your Etsy and Wix connections go through each platform's own secure OAuth login - MirrorStock never sees or stores your passwords. Shop data is stored securely and used only to run your sync, never sold or shared with third parties. Full details in the Privacy Policy at /privacy.",
  },
  {
    id: "compliance",
    keywords: [
      "kvkk",
      "gdpr",
      "gdpr compliant",
      "kvkk compliant",
      "data protection regulation",
      "compliance",
    ],
    answer:
      "MirrorStock only reads the minimum data needed for syncing and never sells or shares it with third parties - see the Privacy Policy at /privacy for exactly how data is handled. For a formal compliance question, email support@mirrorstock.com.",
  },
  {
    id: "two-factor-auth",
    keywords: ["two factor", "2fa", "two-factor authentication", "turn on 2fa", "enable 2fa"],
    answer: "Not yet - login is currently email and password only, no two-factor authentication option.",
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
