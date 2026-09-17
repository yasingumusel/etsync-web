import { cookies } from "next/headers";
import { COOKIE_NAME, verifySessionCookieValue } from "@/lib/session";

/** Returns the logged-in user's backend userId, or null if not logged in. */
export async function getSessionUserId(): Promise<string | null> {
  const store = await cookies();
  const payload = verifySessionCookieValue(store.get(COOKIE_NAME)?.value);
  return payload?.userId ?? null;
}

/** Calls the Etsy integrator backend's /sync/:userId/* routes with the shared secret. */
export async function callSyncBackend(userId: string, path: "status" | "run" | "history") {
  const baseUrl = process.env.SYNC_BACKEND_URL;
  const secret = process.env.SYNC_API_SECRET;
  if (!baseUrl || !secret) {
    throw new Error("SYNC_BACKEND_URL / SYNC_API_SECRET not configured");
  }

  const method = path === "run" ? "POST" : "GET";
  const res = await fetch(`${baseUrl}/sync/${userId}/${path}`, {
    method,
    headers: { "X-Sync-Secret": secret },
    cache: "no-store",
  });

  const body = await res.json();
  return { ok: res.ok, status: res.status, body };
}
