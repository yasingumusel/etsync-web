"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Logo from "@/components/Logo";

type Mode = "login" | "signup";

const copy: Record<Mode, { title: string; subtitle: string; cta: string; loadingCta: string; endpoint: string }> = {
  login: {
    title: "Log in",
    subtitle: "Manage your Etsy → Wix sync.",
    cta: "Log in",
    loadingCta: "Logging in…",
    endpoint: "/api/login",
  },
  signup: {
    title: "Sign up",
    subtitle: "Create a new account.",
    cta: "Sign up",
    loadingCta: "Creating account…",
    endpoint: "/api/signup",
  },
};

export default function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const c = copy[mode];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch(c.endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    setLoading(false);

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error || `${c.title} failed`);
      return;
    }

    router.push(searchParams.get("from") || "/dashboard");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-grid px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>

        <form onSubmit={handleSubmit} className="card-glass rounded-2xl p-8">
          <h1 className="font-display text-xl font-bold text-foreground">
            {c.title}
          </h1>
          <p className="mt-1 text-sm text-muted">{c.subtitle}</p>

          <div className="mt-6 flex flex-col gap-4">
            <div>
              <label className="text-sm font-medium text-foreground">
                Email
              </label>
              <input
                type="email"
                required
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-accent-violet"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">
                Password
              </label>
              <input
                type="password"
                required
                minLength={mode === "signup" ? 8 : undefined}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-accent-violet"
              />
              {mode === "signup" && (
                <p className="mt-1 text-xs text-muted">At least 8 characters.</p>
              )}
            </div>
          </div>

          {error && (
            <p className="mt-4 text-sm font-medium text-red-500">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-full bg-gradient-to-r from-accent-orange via-accent-pink to-accent-violet px-7 py-3 text-sm font-semibold text-white shadow-[0_0_40px_-10px_rgba(139,92,246,0.6)] transition-transform hover:scale-[1.02] disabled:opacity-60"
          >
            {loading ? c.loadingCta : c.cta}
          </button>

          <p className="mt-5 text-center text-sm text-muted">
            {mode === "login" ? (
              <>
                Don&apos;t have an account?{" "}
                <a href="/signup" className="font-medium text-foreground hover:underline">
                  Sign up
                </a>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <a href="/login" className="font-medium text-foreground hover:underline">
                  Log in
                </a>
              </>
            )}
          </p>
        </form>
      </div>
    </div>
  );
}
