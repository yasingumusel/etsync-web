"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type EtsyListing = {
  listingId: string;
  title: string;
  price: number;
  currency: string;
  state: "active" | "draft";
  thumbnailUrl: string | null;
};

type Selection = {
  mode: "all" | "custom";
  includeDrafts: boolean;
  selectedListingIds: string[];
};

type Plan = "free" | "starter" | "growth" | "pro" | "unlimited";

const PLAN_LIMIT_LABEL: Record<Plan, string | null> = {
  free: "Your Free plan can connect up to 5 listings. Upgrade anytime to sync more.",
  starter: null,
  growth: null,
  pro: null,
  unlimited: null,
};

function formatPrice(price: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(price);
  } catch {
    return `${price.toFixed(2)} ${currency}`;
  }
}

type Step = "picker" | "claim" | "already-claimed";

/**
 * Two ways to reach this wizard, both ending up in the same UI:
 *
 * - "connect" (default): landed on right after the Etsy OAuth callback,
 *   carrying userId in the URL - the same trust model /connect-etsy already
 *   uses, since there's no dashboard session yet the first time a shop
 *   connects through the Wix install flow. Talks to the /api/setup-sync/*
 *   routes, which take userId from the query string/body. Ends with a
 *   "create your password" step (the "claim" Step below) - without one,
 *   /dashboard (which requires a session) would be an immediate dead end.
 * - "manage": opened later from the dashboard by an already logged-in
 *   user, so it goes through the normal session-authenticated
 *   /api/sync/etsy-listings and /api/sync/product-selection routes instead
 *   - no userId is ever passed around, closing the "guess someone else's
 *   id and rewrite their sync settings" gap the "connect" variant accepts
 *   as a pre-existing, low-severity tradeoff (see /connect-etsy). Already
 *   has a session, so it skips the claim step entirely.
 *
 * Renders just the card itself - the page around it (setup-sync/page.tsx
 * with the marketing Navbar+Footer, or dashboard/products/page.tsx with
 * DashboardHeader) supplies the surrounding chrome and centering.
 */
export default function SetupSyncWizard({
  userId,
  variant = "connect",
}: {
  userId?: string;
  variant?: "connect" | "manage";
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [listings, setListings] = useState<EtsyListing[]>([]);
  const [plan, setPlan] = useState<Plan | undefined>();
  const [existingEmail, setExistingEmail] = useState<string | undefined>();
  const [step, setStep] = useState<Step>("picker");
  const [mode, setMode] = useState<Selection["mode"]>("all");
  const [includeDrafts, setIncludeDrafts] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (variant === "connect" && !userId) {
      setLoading(false);
      return;
    }

    (async () => {
      const [listingsRes, selectionRes, statusRes] =
        variant === "manage"
          ? await Promise.all([
              fetch("/api/sync/etsy-listings"),
              fetch("/api/sync/product-selection"),
              fetch("/api/sync"),
            ])
          : await Promise.all([
              fetch(`/api/setup-sync/listings?userId=${encodeURIComponent(userId!)}`),
              fetch(`/api/setup-sync/selection?userId=${encodeURIComponent(userId!)}`),
              fetch(`/api/setup-sync/status?userId=${encodeURIComponent(userId!)}`),
            ]);

      if (!listingsRes.ok || !selectionRes.ok) {
        setLoadError(true);
        setLoading(false);
        return;
      }

      const listingsData: { listings: EtsyListing[] } = await listingsRes.json();
      const selectionData: Selection = await selectionRes.json();

      setListings(listingsData.listings);
      setMode(selectionData.mode);
      setIncludeDrafts(selectionData.includeDrafts);
      setSelected(
        selectionData.mode === "custom"
          ? new Set(selectionData.selectedListingIds)
          : new Set(listingsData.listings.map((l) => l.listingId))
      );

      // Non-critical - the wizard still works fine without knowing the
      // plan/email, it just skips the "Free plan" note and can't tell in
      // advance whether the claim step is needed.
      if (statusRes.ok) {
        const statusData: { plan?: Plan; email?: string } = await statusRes.json();
        setPlan(statusData.plan);
        setExistingEmail(statusData.email);
      }

      setLoading(false);
    })();
  }, [userId, variant]);

  const visibleListings = useMemo(
    () => listings.filter((l) => includeDrafts || l.state === "active"),
    [listings, includeDrafts]
  );

  const planNote = plan ? PLAN_LIMIT_LABEL[plan] : null;

  function chooseMode(next: Selection["mode"]) {
    setMode(next);
    // Switching into "pick myself" for the first time starts everything
    // checked, not empty - an empty picker reads as "I made a mistake",
    // not "I deliberately chose to sync nothing".
    if (next === "custom" && selected.size === 0) {
      setSelected(new Set(visibleListings.map((l) => l.listingId)));
    }
  }

  function toggleOne(listingId: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(listingId)) next.delete(listingId);
      else next.add(listingId);
      return next;
    });
  }

  function selectAll() {
    setSelected(new Set(visibleListings.map((l) => l.listingId)));
  }

  function selectNone() {
    setSelected(new Set());
  }

  /**
   * Runs when leaving the picker step, either via "Finish setup" (saves
   * the choices first) or "Skip for now" (leaves the existing/default
   * selection alone). Either way, a "connect" session still needs to turn
   * into a real logged-in dashboard account before it can go to /dashboard.
   */
  async function proceedFromPicker(shouldSave: boolean) {
    if (variant === "connect" && !userId) return;

    if (shouldSave) {
      setSaving(true);
      setSaveError(null);

      const body = {
        ...(variant === "connect" ? { userId } : {}),
        mode,
        includeDrafts,
        selectedListingIds: mode === "custom" ? Array.from(selected) : [],
      };

      const res = await fetch(
        variant === "manage" ? "/api/sync/product-selection" : "/api/setup-sync/selection",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      setSaving(false);
      if (!res.ok) {
        setSaveError("Could not save your choices. Please try again.");
        return;
      }
    }

    if (variant === "manage") {
      router.push("/dashboard");
      return;
    }

    setStep(existingEmail ? "already-claimed" : "claim");
  }

  if (variant === "connect" && !userId) {
    return (
      <Card>
        <p className="text-sm font-medium text-red-500">
          Missing setup information. Please reconnect your Etsy shop from
          the dashboard.
        </p>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <p className="text-sm text-muted">Loading your Etsy listings&hellip;</p>
      </Card>
    );
  }

  if (loadError) {
    return (
      <Card>
        <p className="text-sm font-medium text-red-500">
          Could not load your Etsy listings. You can still open your
          dashboard - everything defaults to syncing all active listings.
        </p>
        <button
          onClick={() => router.push("/dashboard")}
          className="mt-5 w-full rounded-full bg-gradient-to-r from-accent-orange via-accent-pink to-accent-violet px-7 py-3 text-sm font-semibold text-white"
        >
          Go to dashboard
        </button>
      </Card>
    );
  }

  if (step === "already-claimed") {
    return (
      <Card>
        <h1 className="text-lg font-display font-bold text-foreground">
          This shop is already linked to an account
        </h1>
        <p className="mt-2 text-sm text-muted">
          Log in to see your dashboard - your choices here have already been saved.
        </p>
        <a
          href="/login"
          className="mt-6 block w-full rounded-full bg-gradient-to-r from-accent-orange via-accent-pink to-accent-violet px-7 py-3 text-center text-sm font-semibold text-white"
        >
          Log in
        </a>
      </Card>
    );
  }

  if (step === "claim") {
    return <ClaimForm userId={userId!} />;
  }

  return (
    <Card wide>
      <h1 className="text-center font-display text-xl font-bold text-foreground">
        {variant === "manage" ? "Which products should sync?" : "Set up your sync"}
      </h1>
      <p className="mt-1 text-center text-sm text-muted">
        {variant === "manage"
          ? "Change which Etsy listings sync to your store."
          : "Your Etsy shop is connected. A few choices to start."}
      </p>

      {planNote && (
        <p className="mt-4 rounded-xl border border-amber-400/30 bg-amber-400/5 px-3.5 py-2.5 text-center text-xs font-medium text-amber-700">
          {planNote}
        </p>
      )}

      <div className="mt-7">
        <p className="text-sm font-semibold text-foreground">
          Which products should we sync?
        </p>
        <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
          <ModeButton
            label="All active listings"
            hint="Recommended - new listings sync automatically too"
            active={mode === "all"}
            onClick={() => chooseMode("all")}
          />
          <ModeButton
            label="I'll choose specific products"
            hint={`Pick exactly which listings sync${visibleListings.length ? ` (${visibleListings.length} available)` : ""}`}
            active={mode === "custom"}
            onClick={() => chooseMode("custom")}
          />
        </div>
      </div>

      <label className="mt-5 flex cursor-pointer items-start gap-2.5 rounded-xl border border-border bg-surface px-3.5 py-3">
        <input
          type="checkbox"
          checked={includeDrafts}
          onChange={(e) => setIncludeDrafts(e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 rounded border-border accent-accent-violet"
        />
        <span>
          <span className="block text-sm font-medium text-foreground">
            Also sync draft (unpublished) listings
          </span>
          <span className="block text-[11px] leading-relaxed text-muted">
            They&apos;ll be created as hidden, unpublished products in your
            store until you publish them there or on Etsy.
          </span>
        </span>
      </label>

      {mode === "custom" && (
        <div className="mt-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted">
              {selected.size} of {visibleListings.length} selected
            </p>
            <div className="flex gap-3 text-xs font-medium text-accent-violet">
              <button type="button" onClick={selectAll} className="hover:underline">
                Select all
              </button>
              <button type="button" onClick={selectNone} className="hover:underline">
                Select none
              </button>
            </div>
          </div>

          {visibleListings.length === 0 ? (
            <p className="mt-3 rounded-xl border border-border bg-surface px-3.5 py-3 text-sm text-muted">
              No listings to show yet.
            </p>
          ) : (
            <ul className="mt-3 max-h-80 space-y-1.5 overflow-y-auto rounded-xl border border-border bg-surface p-2">
              {visibleListings.map((l) => (
                <li key={l.listingId}>
                  <label className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 hover:bg-surface-2">
                    <input
                      type="checkbox"
                      checked={selected.has(l.listingId)}
                      onChange={() => toggleOne(l.listingId)}
                      className="h-4 w-4 shrink-0 rounded border-border accent-accent-violet"
                    />
                    {l.thumbnailUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={l.thumbnailUrl}
                        alt=""
                        className="h-10 w-10 shrink-0 rounded-md object-cover"
                      />
                    ) : (
                      <span className="h-10 w-10 shrink-0 rounded-md bg-surface-2" />
                    )}
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm text-foreground">{l.title}</span>
                      <span className="block text-[11px] text-muted">
                        {formatPrice(l.price, l.currency)}
                        {l.state === "draft" && (
                          <span className="ml-1.5 rounded-full bg-amber-400/10 px-1.5 py-0.5 text-[10px] font-medium text-amber-600">
                            Draft
                          </span>
                        )}
                      </span>
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {saveError && <p className="mt-4 text-xs font-medium text-red-500">{saveError}</p>}

      <button
        type="button"
        onClick={() => proceedFromPicker(true)}
        disabled={saving}
        className="mt-6 w-full rounded-full bg-gradient-to-r from-accent-orange via-accent-pink to-accent-violet px-7 py-3.5 text-sm font-semibold text-white shadow-[0_0_40px_-10px_rgba(139,92,246,0.6)] transition-transform hover:scale-[1.01] disabled:opacity-60"
      >
        {saving ? "Saving…" : variant === "manage" ? "Save changes" : "Finish setup"}
      </button>

      <button
        type="button"
        onClick={() =>
          variant === "manage" ? router.push("/dashboard") : proceedFromPicker(false)
        }
        disabled={saving}
        className="mt-3 w-full text-center text-xs font-medium text-muted hover:text-foreground disabled:opacity-60"
      >
        {variant === "manage" ? "Cancel" : "Skip for now"}
      </button>

      {variant === "connect" && (
        <p className="mt-5 text-center text-xs text-muted">
          You can change this anytime from your dashboard.
        </p>
      )}
    </Card>
  );
}

/**
 * The step that turns a URL-trusted "connect" session into a real,
 * loggable-in dashboard account - see routes/auth/account.js's /claim for
 * the backend side. Kept as its own component mainly so its form state
 * doesn't have to share a namespace with the picker step above it.
 */
function ClaimForm({ userId }: { userId: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const res = await fetch("/api/setup-sync/claim", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, email, password }),
    });

    setSubmitting(false);

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error || "Could not create your account");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <h1 className="font-display text-xl font-bold text-foreground">
          Create your password
        </h1>
        <p className="mt-1 text-sm text-muted">
          Your Etsy shop is connected and your choices are saved. Set a
          password so you can come back to your dashboard anytime.
        </p>

        <div className="mt-6 flex flex-col gap-4 text-left">
          <div>
            <label className="text-sm font-medium text-foreground">Email</label>
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
            <label className="text-sm font-medium text-foreground">Password</label>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-accent-violet"
            />
            <p className="mt-1 text-xs text-muted">At least 8 characters.</p>
          </div>

          {/* Etsy's API Terms require app users to accept the developer's
              terms through an explicit click-through, not just a link. */}
          <label className="flex items-start gap-2.5 text-xs leading-relaxed text-muted">
            <input
              type="checkbox"
              required
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-border accent-accent-violet"
            />
            <span>
              I agree to the{" "}
              <a href="/terms" target="_blank" className="font-medium text-foreground hover:underline">
                Terms of Service
              </a>{" "}
              and the{" "}
              <a href="/privacy" target="_blank" className="font-medium text-foreground hover:underline">
                Privacy Policy
              </a>
              .
            </span>
          </label>
        </div>

        {error && <p className="mt-4 text-sm font-medium text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="mt-6 w-full rounded-full bg-gradient-to-r from-accent-orange via-accent-pink to-accent-violet px-7 py-3 text-sm font-semibold text-white shadow-[0_0_40px_-10px_rgba(139,92,246,0.6)] transition-transform hover:scale-[1.02] disabled:opacity-60"
        >
          {submitting ? "Creating account…" : "Create account"}
        </button>
      </form>
    </Card>
  );
}

function ModeButton({
  label,
  hint,
  active,
  onClick,
}: {
  label: string;
  hint: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border px-4 py-3 text-left transition-colors ${
        active ? "border-accent-violet/50 bg-accent-violet/5" : "border-border bg-surface hover:bg-surface-2"
      }`}
    >
      <span className="block text-sm font-medium text-foreground">{label}</span>
      <span className="block text-[11px] leading-relaxed text-muted">{hint}</span>
    </button>
  );
}

function Card({ children, wide }: { children: React.ReactNode; wide?: boolean }) {
  return (
    <div className={`card-glass w-full rounded-2xl p-8 ${wide ? "max-w-xl" : "max-w-sm text-center"}`}>
      {children}
    </div>
  );
}
