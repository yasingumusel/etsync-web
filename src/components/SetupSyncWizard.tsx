"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import StoreProductPicker from "@/components/StoreProductPicker";
import EtsyListingDefaultsFields from "@/components/EtsyListingDefaultsFields";

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
  // null means no cap (Unlimited plan) - set by the same backend route this
  // is loaded from, so it can never name a different number than the one
  // that actually gets enforced when saving or syncing.
  planLimit: number | null;
};

type Plan = "free" | "starter" | "growth" | "pro" | "unlimited";

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

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
 * DashboardHeader) supplies the surrounding chrome and centering. Passing
 * `embedded` drops that outer card so a caller that already provides its
 * own container (the dashboard's inline "Choose which products sync"
 * panel) doesn't get a card nested inside another card; `onDone` is how
 * that same embedded caller finds out saving/cancelling finished, since
 * there's no "/dashboard" route to navigate back to when already on it.
 */
export default function SetupSyncWizard({
  userId,
  variant = "connect",
  embedded = false,
  onDone,
}: {
  userId?: string;
  variant?: "connect" | "manage";
  embedded?: boolean;
  onDone?: () => void;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [listings, setListings] = useState<EtsyListing[]>([]);
  const [plan, setPlan] = useState<Plan | undefined>();
  const [planLimit, setPlanLimit] = useState<number | null>(null);
  const [existingEmail, setExistingEmail] = useState<string | undefined>();
  const [connectedPlatform, setConnectedPlatform] = useState<"Wix" | "Shopify" | null>(null);
  // Only meaningful for variant "connect" - "manage" always shows the Etsy
  // side (its own separate reverse-direction picker lives in
  // EtsyListingDefaults on the dashboard instead).
  const [directionTab, setDirectionTab] = useState<"etsy" | "store">("etsy");
  const [step, setStep] = useState<Step>("picker");
  const [mode, setMode] = useState<Selection["mode"]>("all");
  const [includeDrafts, setIncludeDrafts] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  function finishManage() {
    if (onDone) onDone();
    else router.push("/dashboard");
  }

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
      setPlanLimit(selectionData.planLimit ?? null);
      setSelected(
        selectionData.mode === "custom"
          ? new Set(selectionData.selectedListingIds)
          : new Set(listingsData.listings.map((l) => l.listingId))
      );

      // Non-critical - the wizard still works fine without knowing the
      // plan/email, it just skips the "Free plan" note and can't tell in
      // advance whether the claim step is needed.
      if (statusRes.ok) {
        const statusData: { plan?: Plan; email?: string; targetStores?: { platform: string }[] } =
          await statusRes.json();
        setPlan(statusData.plan);
        setExistingEmail(statusData.email);
        const stores = statusData.targetStores ?? [];
        if (stores.some((s) => s.platform === "shopify")) setConnectedPlatform("Shopify");
        else if (stores.some((s) => s.platform === "wix")) setConnectedPlatform("Wix");
      }

      setLoading(false);
    })();
  }, [userId, variant]);

  const visibleListings = useMemo(
    () => listings.filter((l) => includeDrafts || l.state === "active"),
    [listings, includeDrafts]
  );

  // `selected` can hold ids that aren't in `visibleListings` right now - a
  // saved custom selection can include drafts while "also sync drafts" is
  // unchecked, or a listing that's since been removed from Etsy entirely.
  // Those stay in `selected` (unchecking the draft filter shouldn't silently
  // forget a merchant's draft picks), but counting them in the headline
  // "X of Y selected" produced a nonsensical "192 of 176" - X could exceed Y
  // outright. The headline now counts only what's actually checked among
  // the currently visible listings; the leftover is surfaced separately so
  // it's explained rather than hidden.
  const visibleListingIds = useMemo(() => new Set(visibleListings.map((l) => l.listingId)), [visibleListings]);
  const visibleSelectedCount = useMemo(
    () => Array.from(selected).filter((id) => visibleListingIds.has(id)).length,
    [selected, visibleListingIds]
  );
  const hiddenSelectedCount = selected.size - visibleSelectedCount;

  const planNote =
    planLimit !== null
      ? `Your ${plan ? capitalize(plan) : "current"} plan allows up to ${planLimit} product${planLimit === 1 ? "" : "s"}. Upgrade anytime to sync more.`
      : null;
  const atCustomLimit = planLimit !== null && selected.size >= planLimit;
  const allModeOverLimit = planLimit !== null && visibleListings.length > planLimit;

  function chooseMode(next: Selection["mode"]) {
    setMode(next);
    // Switching into "pick myself" for the first time starts everything
    // checked (up to the plan limit), not empty - an empty picker reads as
    // "I made a mistake", not "I deliberately chose to sync nothing".
    if (next === "custom" && selected.size === 0) {
      const initial = planLimit !== null ? visibleListings.slice(0, planLimit) : visibleListings;
      setSelected(new Set(initial.map((l) => l.listingId)));
    }
  }

  function toggleOne(listingId: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(listingId)) {
        next.delete(listingId);
      } else {
        // Once a plan's cap is reached, further checkboxes are disabled
        // (see the `disabled` prop below) - this is just a safety net
        // against a stale click slipping through.
        if (planLimit !== null && next.size >= planLimit) return prev;
        next.add(listingId);
      }
      return next;
    });
  }

  function selectAll() {
    const capped = planLimit !== null ? visibleListings.slice(0, planLimit) : visibleListings;
    setSelected(new Set(capped.map((l) => l.listingId)));
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
      if (mode === "custom" && planLimit !== null && selected.size > planLimit) {
        setSaveError(
          `You've selected ${selected.size} products, but your plan allows up to ${planLimit}. Remove some, or upgrade your plan.`
        );
        return;
      }

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
      finishManage();
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
      <Wrap embedded={embedded}>
        <p className="text-sm text-muted">Loading your Etsy listings&hellip;</p>
      </Wrap>
    );
  }

  if (loadError) {
    return (
      <Wrap embedded={embedded}>
        <p className="text-sm font-medium text-red-500">
          Could not load your Etsy listings.{" "}
          {variant === "manage"
            ? "Please try again in a moment."
            : "You can still open your dashboard - everything defaults to syncing all active listings."}
        </p>
        {variant === "connect" && (
          <button
            onClick={() => router.push("/dashboard")}
            className="mt-5 w-full rounded-full bg-gradient-to-r from-accent-orange via-accent-pink to-accent-violet px-7 py-3 text-sm font-semibold text-white"
          >
            Go to dashboard
          </button>
        )}
      </Wrap>
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
    <Wrap embedded={embedded} wide>
      {!embedded && (
        <>
          <h1 className="text-center font-display text-xl font-bold text-foreground">
            {variant === "manage" ? "Which products should sync?" : "Set up your sync"}
          </h1>
          <p className="mt-1 text-center text-sm text-muted">
            {variant === "manage"
              ? "Change which Etsy listings sync to your store."
              : "Your Etsy shop is connected. A few choices to start."}
          </p>
        </>
      )}

      {variant === "connect" && connectedPlatform && (
        <div className="mt-6 flex justify-center">
          <div className="inline-flex rounded-full border border-border bg-surface p-1">
            <button
              type="button"
              onClick={() => setDirectionTab("etsy")}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                directionTab === "etsy"
                  ? "bg-accent-orange text-white"
                  : "text-muted hover:text-foreground"
              }`}
            >
              Etsy &rarr; {connectedPlatform}
            </button>
            <button
              type="button"
              onClick={() => setDirectionTab("store")}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                directionTab === "store"
                  ? "bg-accent-blue text-white"
                  : "text-muted hover:text-foreground"
              }`}
            >
              {connectedPlatform} &rarr; Etsy
            </button>
          </div>
        </div>
      )}

      {(variant === "manage" || !connectedPlatform || directionTab === "etsy") && (
        <>
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
            {mode === "all" && allModeOverLimit && (
              <p className="mt-2.5 rounded-xl border border-amber-400/30 bg-amber-400/5 px-3.5 py-2.5 text-xs font-medium text-amber-700">
                You have {visibleListings.length} listings but your plan allows{" "}
                {planLimit}. We&apos;ll sync your {planLimit} oldest listings
                until you upgrade or choose specific products.
              </p>
            )}
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
                <p className={`text-xs font-medium ${atCustomLimit ? "text-amber-600" : "text-muted"}`}>
                  {visibleSelectedCount} of {visibleListings.length} selected
                  {planLimit !== null ? ` (max ${planLimit} on your plan)` : ""}
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

              {hiddenSelectedCount > 0 && (
                <p className="mt-1.5 text-[11px] text-muted">
                  +{hiddenSelectedCount} more selected but not shown here
                  {includeDrafts ? "" : " - check “Also sync draft listings” to see them"}.
                  They&apos;ll stay selected unless you use &quot;Select none&quot;.
                </p>
              )}

              {visibleListings.length === 0 ? (
                <p className="mt-3 rounded-xl border border-border bg-surface px-3.5 py-3 text-sm text-muted">
                  No listings to show yet.
                </p>
              ) : (
                <ul className="mt-3 max-h-80 space-y-1.5 overflow-y-auto rounded-xl border border-border bg-surface p-2">
                  {visibleListings.map((l) => {
                    const isSelected = selected.has(l.listingId);
                    const disabled = !isSelected && atCustomLimit;
                    return (
                    <li key={l.listingId}>
                      <label
                        className={`flex items-center gap-3 rounded-lg px-2 py-2 ${
                          disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:bg-surface-2"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          disabled={disabled}
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
                    );
                  })}
                </ul>
              )}
            </div>
          )}
        </>
      )}

      {variant === "connect" && connectedPlatform && directionTab === "store" && (
        <div className="mt-7">
          <p className="text-sm font-semibold text-foreground">
            {connectedPlatform} &rarr; Etsy
          </p>
          <p className="mt-1 text-xs text-muted">
            Publish products you created directly in {connectedPlatform} as
            new Etsy listings. Pick which ones below, then fill in the
            fields Etsy requires (category, shipping profile, etc.) -
            nothing publishes until both are done.
          </p>
          <StoreProductPicker
            userId={userId}
            platform={connectedPlatform}
            planLabel={plan ? capitalize(plan) : undefined}
          />
          <div className="mt-5 rounded-2xl border border-border bg-surface p-5">
            <p className="text-sm font-medium text-foreground">
              Defaults for new Etsy listings
            </p>
            <p className="mt-1 text-xs text-muted">
              Etsy requires these for every listing; {connectedPlatform} has
              no equivalent field for them.
            </p>
            <div className="mt-4">
              <EtsyListingDefaultsFields platform={connectedPlatform} userId={userId} />
            </div>
          </div>
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
        onClick={() => (variant === "manage" ? finishManage() : proceedFromPicker(false))}
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
    </Wrap>
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

// An embedded caller (the dashboard's inline product picker) already
// provides its own surrounding card, so this skips adding another one
// inside it - everywhere else gets the normal standalone Card.
function Wrap({
  children,
  embedded,
  wide,
}: {
  children: React.ReactNode;
  embedded?: boolean;
  wide?: boolean;
}) {
  if (embedded) return <>{children}</>;
  return <Card wide={wide}>{children}</Card>;
}
