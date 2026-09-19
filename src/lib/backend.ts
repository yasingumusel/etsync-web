import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { COOKIE_NAME, verifySessionCookieValue } from "@/lib/session";

/** Returns the logged-in user's backend userId, or null if not logged in. */
export async function getSessionUserId(): Promise<string | null> {
  const store = await cookies();
  const payload = verifySessionCookieValue(store.get(COOKIE_NAME)?.value);
  return payload?.userId ?? null;
}

type SyncPath = "status" | "run" | "history" | "settings" | "etsy-listings" | "product-selection";

export type Plan = "free" | "starter" | "growth" | "pro" | "unlimited";

export type SessionSummary = {
  email?: string;
  plan?: Plan;
  syncedProducts: number;
};

/**
 * Looks up the logged-in visitor's account, if any, so a page's navbar can
 * show the same bell/avatar as the dashboard instead of "Log In" to someone
 * who already is. Shared by every page that renders <Navbar> - the
 * marketing homepage and the standalone Etsy connect/setup pages alike -
 * so a visitor mid-onboarding still sees the rest of the site is really
 * theirs, not a bare, disconnected form. A visitor without a session
 * cookie never triggers the backend call below - this stays free for
 * anonymous traffic.
 */
export async function getSessionSummary(): Promise<SessionSummary | null> {
  const userId = await getSessionUserId();
  if (!userId) return null;

  const { ok, body } = await callSyncBackend(userId, "status");
  if (!ok) return null;

  const syncedProducts = (
    body.targetStores as { syncedProductCount: number }[]
  ).reduce((sum, s) => sum + (s.syncedProductCount || 0), 0);

  return {
    email: body.email as string | undefined,
    plan: body.plan as Plan | undefined,
    syncedProducts,
  };
}

/** Calls the Etsy integrator backend's /sync/:userId/* routes with the shared secret. */
export async function callSyncBackend(
  userId: string,
  path: SyncPath,
  options: { method?: "GET" | "POST" | "PUT"; body?: unknown } = {}
) {
  const baseUrl = process.env.SYNC_BACKEND_URL;
  const secret = process.env.SYNC_API_SECRET;
  if (!baseUrl || !secret) {
    throw new Error("SYNC_BACKEND_URL / SYNC_API_SECRET not configured");
  }

  // The shared secret alone only proved "this caller is our own server", not
  // *which* account it is acting for - anyone holding it could have driven a
  // sync for any userId. Signing the session's own userId into a short-lived
  // token means the backend can check the two agree, so a token minted for one
  // account is useless against another. It expires in 60s because it is
  // created immediately before the request it authenticates.
  const token = jwt.sign({ userId, purpose: "sync-api" }, secret, {
    algorithm: "HS256",
    expiresIn: "60s",
  });

  const method = options.method ?? (path === "run" ? "POST" : "GET");
  const res = await fetch(`${baseUrl}/sync/${userId}/${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(options.body ? { "Content-Type": "application/json" } : {}),
    },
    ...(options.body ? { body: JSON.stringify(options.body) } : {}),
    cache: "no-store",
  });

  const body = await res.json();
  return { ok: res.ok, status: res.status, body };
}
