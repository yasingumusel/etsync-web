"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/Logo";
import NotificationsBell from "@/components/NotificationsBell";
import AccountMenu from "@/components/AccountMenu";

type Plan = "free" | "starter" | "growth" | "pro" | "unlimited";

/**
 * The header shared by every page under /dashboard (the dashboard itself,
 * /dashboard/products, ...). Deliberately not the marketing site's Navbar -
 * once someone is inside the app, Features/Pricing/FAQ links aren't useful
 * chrome, so this is its own small component fetching just enough (email,
 * plan) for the account menu, rather than each page prop-drilling it.
 */
export default function DashboardHeader({ refreshKey = 0 }: { refreshKey?: number }) {
  const router = useRouter();
  const [account, setAccount] = useState<{ email?: string; plan?: Plan }>({});

  useEffect(() => {
    fetch("/api/sync")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => data && setAccount({ email: data.email, plan: data.plan }));
  }, []);

  async function handleLogout() {
    await fetch("/api/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        <div className="flex items-center gap-6">
          <Link href="/" aria-label="MirrorStock home">
            <Logo />
          </Link>
          <Link
            href="/dashboard/help"
            className="hidden text-sm font-medium text-muted transition-colors hover:text-foreground sm:block"
          >
            Help
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <NotificationsBell refreshKey={refreshKey} />
          <AccountMenu email={account.email} plan={account.plan} onLogout={handleLogout} />
        </div>
      </div>
    </header>
  );
}
