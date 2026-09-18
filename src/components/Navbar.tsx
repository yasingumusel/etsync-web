"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "./Logo";
import NotificationsBell from "./NotificationsBell";
import AccountMenu from "./AccountMenu";

const links = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#pricing", label: "Pricing" },
  { href: "#api-usage", label: "API Usage" },
  { href: "#faq", label: "FAQ" },
];

type Plan = "free" | "starter" | "growth" | "pro" | "unlimited";
type Session = { email?: string; plan?: Plan } | null;

export default function Navbar({ session = null }: { session?: Session }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/logout", { method: "POST" });
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
        <a href="#top" className="shrink-0">
          <Logo />
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {session ? (
            <>
              <NotificationsBell refreshKey={0} />
              <AccountMenu
                email={session.email}
                plan={session.plan}
                onLogout={handleLogout}
                navLink={{ href: "/dashboard", label: "Go to dashboard" }}
              />
            </>
          ) : (
            <>
              <a
                href="/login"
                className="text-sm font-medium text-muted transition-colors hover:text-foreground"
              >
                Log In
              </a>
              <a
                href="/signup"
                className="rounded-full bg-gradient-to-r from-accent-orange via-accent-pink to-accent-violet px-4 py-2 text-sm font-semibold text-white shadow-[0_0_30px_-10px_rgba(139,92,246,0.6)] transition-transform hover:scale-[1.03]"
              >
                Get Started
              </a>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-foreground md:hidden"
          aria-label="Toggle menu"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            {open ? (
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            ) : (
              <path
                d="M4 7h16M4 12h16M4 17h16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background px-6 py-4 md:hidden">
          <nav className="flex flex-col gap-4">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-sm font-medium text-muted transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
            <div className="mt-2 flex flex-col gap-3 border-t border-border pt-4">
              {session ? (
                <>
                  <a href="/dashboard" onClick={() => setOpen(false)} className="text-sm font-medium text-foreground">
                    Go to dashboard
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      handleLogout();
                    }}
                    className="text-left text-sm font-medium text-muted"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <a href="/login" className="text-sm font-medium text-muted">
                    Log In
                  </a>
                  <a
                    href="/signup"
                    onClick={() => setOpen(false)}
                    className="rounded-full bg-gradient-to-r from-accent-orange via-accent-pink to-accent-violet px-4 py-2 text-center text-sm font-semibold text-white"
                  >
                    Get Started
                  </a>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
