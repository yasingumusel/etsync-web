/**
 * Jason's entire knowledge, as keyword-matched Q&A entries - no external AI
 * API, no cost, runs entirely on our own server. Every answer here matches
 * the live marketing site copy (Features.tsx, Pricing.tsx, HowItWorks.tsx,
 * ApiTrust.tsx, FAQ.tsx, Status.tsx) and the backend's real, verified
 * behaviour - if the site changes, this should change with it. Jason must
 * never claim more than what a visitor could already read on the site, and
 * never anything about Etsy/Wix beyond what's accurate and permitted here.
 *
 * `jasonAnswer()` (jasonBot.ts) scores each entry against a visitor's
 * message and returns the best match, or a fallback pointing to
 * support@mirrorstock.com when nothing scores well enough - it never
 * invents an answer. `question`/`category` exist so the same data also
 * backs the dashboard's static Help page (dashboard/help/page.tsx) -
 * one source of facts for both surfaces.
 */
export type FaqCategory =
  | "Getting Started"
  | "Syncing"
  | "Etsy Access & Privacy"
  | "Pricing & Billing"
  | "Account & Integrations"
  | "Support";

export type FaqEntry = {
  id: string;
  category: FaqCategory;
  /** Display heading for the Help page - not used for matching. */
  question: string;
  /** Single words score on exact match; multi-word phrases score on substring match, weighted higher. */
  keywords: string[];
  answer: string;
  /** Overrides jasonBot.ts's default minimum score - for short entries like
   *  "hi" that would otherwise never reach the default threshold. */
  minScore?: number;
  /** Conversational entries (greetings, thanks, "are you a bot") that don't
   *  read as real FAQ items - Jason still matches them, but they're left
   *  off the static Help page. */
  hideFromHelp?: boolean;
};

export const SUPPORT_EMAIL = "support@mirrorstock.com";

export const FALLBACK_ANSWER =
  "I'm not sure about that one - I only know what's on this site, and I don't want to guess. " +
  `For anything specific to your account, or a question I couldn't answer, email ${SUPPORT_EMAIL} and a real person will help.`;

export const JASON_FAQ: FaqEntry[] = [
  {
    id: "greeting",
    category: "Support",
    question: "Hello",
    hideFromHelp: true,
    keywords: ["hi", "hello", "hey", "yo", "greetings", "good morning", "good afternoon"],
    minScore: 1,
    answer:
      "Hi! I'm Jason, MirrorStock's support bot. I can answer questions about pricing, how the sync works, and what data it reads from Etsy. What would you like to know?",
  },
  {
    id: "thanks",
    category: "Support",
    question: "Thanks",
    hideFromHelp: true,
    keywords: ["thanks", "thank you", "thx", "appreciate it", "cheers"],
    minScore: 1,
    answer: `You're welcome! If anything else comes up, I'm here - or email ${SUPPORT_EMAIL} for anything account-specific.`,
  },
  {
    id: "what-is-it",
    category: "Getting Started",
    question: "What is MirrorStock?",
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
      "MirrorStock reads the active listings in your Etsy shop - products, variations, images, descriptions and prices - and keeps the matching products in your connected Wix store up to date automatically. By default sync runs Etsy to Wix; if you'd rather edit a title or description in Wix, that can sync back to Etsy too.",
  },
  {
    id: "how-it-works",
    category: "Getting Started",
    question: "How does the sync work?",
    keywords: [
      "how does it work",
      "how does the sync work",
      "how it works",
      "how does syncing work",
    ],
    answer:
      "Three steps: (1) You connect your Etsy shop and your Wix store through each platform's own official login. (2) MirrorStock reads your active Etsy listings, including variations, images and prices. (3) It creates or updates the matching products in your Wix store - existing products are updated in place, nothing is duplicated. If you switch off syncing a title or description for a product, MirrorStock instead pushes your Wix edit back to that Etsy listing.",
  },
  {
    id: "who-can-connect",
    category: "Getting Started",
    question: "Who can connect a shop right now?",
    keywords: [
      "can i connect",
      "sign up",
      "get started",
      "join",
      "is it available",
      "who can use",
      "can i use this",
    ],
    answer:
      "Any Etsy seller. MirrorStock completed Etsy's commercial API review, so any shop can connect through Etsy's standard authorization screen.",
  },
  {
    id: "login",
    category: "Getting Started",
    question: "How do I log in, or reset my password?",
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
    id: "coding-knowledge",
    category: "Getting Started",
    question: "Do I need coding knowledge to set it up?",
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
    id: "one-way",
    category: "Syncing",
    question: "Does sync go both ways, or just Etsy to Wix?",
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
      "edit in wix",
      "edit my product in wix",
      "update on etsy",
      "update my etsy listing",
      "sync back to etsy",
      "changes sync back",
      "push to etsy",
    ],
    answer:
      "Yes, in two ways. If you switch off syncing a product's title or description (in the dashboard's 'What to sync' settings), MirrorStock treats your Wix or Shopify edit as correct and pushes it back to the matching Etsy listing. And products you create in your store can be published to Etsy as drafts once you fill in 'Defaults for new Etsy listings'. For products that came from Etsy, price, images and variants still flow Etsy to your store only.",
  },
  {
    id: "duplicates",
    category: "Syncing",
    question: "Will running a sync twice create duplicates?",
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
    id: "variants",
    category: "Syncing",
    question: "Do size/colour variations carry over?",
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
    category: "Syncing",
    question: "What if my Etsy shop and Wix site use different currencies?",
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
    category: "Syncing",
    question: "Can I choose which products sync?",
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
    id: "etsy-reviews-widget",
    category: "Syncing",
    question: "Can I show my Etsy reviews on my Wix product pages?",
    keywords: [
      "etsy reviews",
      "reviews widget",
      "show reviews",
      "reviews on wix",
      "reviews on product page",
      "star rating",
      "customer reviews",
      "display reviews",
      "reviews plugin",
      "reviews pro plan",
      "reviews feature",
      "pro plan feature",
    ],
    answer:
      "Yes - this is a Pro and Unlimited plan feature. It shows your real Etsy reviews (star rating and review text - Etsy never gives us the buyer's name or photo) on the matching Wix product's own page, not just a generic store-wide list. To turn it on: in the Wix Editor, add the 'Etsy Reviews' element to your product page (either drag it on manually and set the product's SKU, or use the version that adds itself to every product page automatically) - the first time you add it, open its settings panel once so it can identify your site, then publish. After that it updates on its own. You can also choose which specific products show reviews from the Etsy Reviews section of your dashboard.",
  },
  {
    id: "sync-frequency",
    category: "Syncing",
    question: "How often does it sync?",
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
    category: "Syncing",
    question: "Is there a sync history or notifications?",
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
    category: "Syncing",
    question: "What happens if I remove a listing on Etsy?",
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
    category: "Syncing",
    question: "Do you support Shopify?",
    keywords: ["shopify"],
    minScore: 1, // a single, highly distinctive brand keyword - safe at a lower bar
    answer:
      "Yes. MirrorStock syncs your Etsy listings to a Wix or a Shopify store - connect Shopify from your dashboard. We're not listed on the Shopify App Store yet, and Etsy reviews on Shopify product pages are still coming. The Unlimited plan can connect Wix and Shopify at the same time.",
  },
  {
    id: "etsy-scopes",
    category: "Etsy Access & Privacy",
    question: "What Etsy data does MirrorStock read?",
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
      "MirrorStock requests three Etsy scopes: listings_r and shops_r (both read-only, for your shop's active listings and basic shop info), and listings_w - used narrowly to write a title or description back to a listing, only when you've told MirrorStock you're editing that field in Wix instead. Nothing else - no receipts, no transactions, no shop management, no order or payment data.",
  },
  {
    id: "writes-to-etsy",
    category: "Etsy Access & Privacy",
    question: "Does it ever write to my Etsy shop?",
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
      "Only if you turn it on, in two ways: switching off syncing a listing's title or description pushes your store's edit back to that Etsy listing, and filling in 'Defaults for new Etsy listings' publishes products you created in Wix or Shopify to Etsy as drafts for you to review. MirrorStock never deletes or activates listings, never changes an existing listing's price, stock or photos, never changes your shop settings, and never sends email or messages through Etsy.",
  },
  {
    id: "sales-data",
    category: "Etsy Access & Privacy",
    question: "Does it read my sales or order data?",
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
    id: "password-security",
    category: "Etsy Access & Privacy",
    question: "Do you see or store my Etsy/Wix password?",
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
    id: "data-security",
    category: "Etsy Access & Privacy",
    question: "Where is my data stored, and how secure is it?",
    keywords: ["where is my data stored", "how secure", "data security", "is my data safe", "encrypted"],
    answer:
      "Your Etsy and Wix connections go through each platform's own secure OAuth login - MirrorStock never sees or stores your passwords. Shop data is stored securely and used only to run your sync, never sold or shared with third parties. Full details in the Privacy Policy at /privacy.",
  },
  {
    id: "compliance",
    category: "Etsy Access & Privacy",
    question: "Are you GDPR/KVKK compliant?",
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
    id: "legal",
    category: "Etsy Access & Privacy",
    question: "Do you sell or share my data?",
    keywords: [
      "terms",
      "terms of service",
      "privacy",
      "privacy policy",
      "data sharing",
      "share my data",
      "sell my data",
    ],
    answer: `MirrorStock doesn't sell or share your shop data with third parties - it's only used to keep your connected store in sync. Full details are in the Terms of Service (/terms) and Privacy Policy (/privacy) pages.`,
  },
  {
    id: "affiliated",
    category: "Etsy Access & Privacy",
    question: "Are you affiliated with Etsy or Wix?",
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
    id: "pricing",
    category: "Pricing & Billing",
    question: "What are your pricing plans?",
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
    category: "Pricing & Billing",
    question: "How does billing, cancellation, and refunds work?",
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
      "Billing is handled entirely through the Wix App Market. Once you subscribe to a paid plan there, Wix manages your invoices, payment methods, upgrades, cancellations, and refunds under Wix's own billing rules - MirrorStock never charges you directly. For anything else, email support@mirrorstock.com.",
  },
  {
    id: "annual-discount",
    category: "Pricing & Billing",
    question: "Do you offer a discount for paying yearly?",
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
    category: "Pricing & Billing",
    question: "Is there a free trial, and do I need a credit card?",
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
    id: "team-members",
    category: "Account & Integrations",
    question: "Can I add team members to my account?",
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
    category: "Account & Integrations",
    question: "Can I export my data (CSV/Excel)?",
    keywords: ["export my data", "export as csv", "export as excel", "download my data", "csv export"],
    answer:
      "There's no data export feature today. If you need something specific, email support@mirrorstock.com and describe what you're after.",
  },
  {
    id: "custom-integration",
    category: "Account & Integrations",
    question: "Can I integrate this into my own website?",
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
    category: "Account & Integrations",
    question: "Do you integrate with WordPress, Salesforce, or Slack?",
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
      "Today MirrorStock connects Etsy to Wix and Shopify stores. There's no WordPress, Salesforce, or Slack integration.",
  },
  {
    id: "api-docs",
    category: "Account & Integrations",
    question: "Where's your API documentation?",
    keywords: ["api documentation", "your api", "public api", "developer api", "api docs"],
    answer:
      "MirrorStock doesn't publish a public API for customers to build against - it's a ready-made sync tool, not a developer platform. It does use Etsy's and Wix's own official APIs behind the scenes to do the syncing.",
  },
  {
    id: "two-factor-auth",
    category: "Account & Integrations",
    question: "Can I turn on two-factor authentication (2FA)?",
    keywords: ["two factor", "2fa", "two-factor authentication", "turn on 2fa", "enable 2fa"],
    answer: "Not yet - login is currently email and password only, no two-factor authentication option.",
  },
  {
    id: "contact-support",
    category: "Support",
    question: "How do I contact support?",
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
    id: "feature-request",
    category: "Support",
    question: "Do you have [a specific feature]?",
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
    category: "Support",
    question: "Is MirrorStock down right now?",
    keywords: ["is it down", "system down", "outage", "latency", "not working right now", "service status"],
    answer:
      "There's no public status page today. If something seems broken or slow, email support@mirrorstock.com with what you're seeing and it'll get looked into directly.",
  },
  {
    id: "error-code",
    category: "Support",
    question: "I'm getting an error - what do I do?",
    keywords: ["error code", "getting an error", "this error", "what should i do about this error"],
    answer:
      "I don't have access to your account or logs, so I can't diagnose a specific error. Email support@mirrorstock.com with the exact error message and what you were doing when it happened.",
  },
  {
    id: "usage-limit",
    category: "Support",
    question: "What happens if I go over my plan's limit?",
    keywords: [
      "usage limit",
      "exceed my limit",
      "monthly limit",
      "api calls limit",
      "data limit",
      "go over my limit",
    ],
    answer:
      "Nothing breaks or gets deleted. If your shop has more active listings than your plan allows, MirrorStock syncs up to your plan's limit (your oldest listings first) and leaves the rest unsynced until you upgrade or choose specific products to sync instead. Upgrading picks up the remaining products on the next sync.",
  },
  {
    id: "who-are-you",
    category: "Support",
    question: "Are you a bot?",
    hideFromHelp: true,
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
