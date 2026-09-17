import Logo from "./Logo";

const columns = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "How It Works", href: "#how-it-works" },
      { label: "API Usage", href: "#api-usage" },
      { label: "Product Status", href: "#status" },
    ],
  },
  {
    title: "Contact",
    links: [{ label: "Email", href: "mailto:support@mirrorstock.com" }],
  },
  {
    title: "Resources",
    links: [{ label: "FAQ", href: "#faq" }],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-border/60 bg-surface/30">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:grid-cols-5">
          <div className="col-span-2 sm:col-span-3 lg:col-span-1">
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
              MirrorStock reads your active Etsy listings (read-only) and
              keeps the matching products in your Wix store in sync, so you
              only have to keep one catalogue up to date.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold text-foreground">
                {col.title}
              </h4>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-muted transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-border/60 pt-8 sm:flex-row">
          <p className="text-xs text-muted">
            © {new Date().getFullYear()} MirrorStock. All rights reserved.
          </p>
          <p className="max-w-xl text-center text-xs text-muted sm:text-right">
            The term &ldquo;Etsy&rdquo; is a trademark of Etsy, Inc. This
            application uses the Etsy API but is not endorsed or certified
            by Etsy, Inc. Wix is a trademark of Wix.com Ltd. MirrorStock is
            an independent software product not affiliated with either
            company.
          </p>
        </div>
      </div>
    </footer>
  );
}
