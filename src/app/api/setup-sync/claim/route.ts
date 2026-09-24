import { NextRequest, NextResponse } from "next/server";
import { createSessionCookieValue, COOKIE_NAME, SESSION_TTL_MS } from "@/lib/session";
import { clientIp } from "@/lib/clientIp";

/**
 * Backs the "create your password" step at the end of the setup wizard
 * (SetupSyncWizard's "connect" variant) - the one moment the Etsy/Wix
 * connect flow needs to turn into a real, loggable-in dashboard account.
 * Unlike /api/signup (which matches an existing record by email), this
 * claims a *specific* userId - see routes/auth/account.js's /claim for why
 * that distinction matters here.
 */
export async function POST(request: NextRequest) {
  const { userId, email, password } = await request.json();

  const baseUrl = process.env.SYNC_BACKEND_URL;
  const secret = process.env.SYNC_API_SECRET;
  if (!baseUrl || !secret) {
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  }

  const backendRes = await fetch(`${baseUrl}/auth/account/claim`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Sync-Secret": secret,
      "X-Client-IP": clientIp(request),
    },
    body: JSON.stringify({ userId, email, password }),
  });
  const backendBody = await backendRes.json();

  if (!backendRes.ok) {
    return NextResponse.json(
      { error: backendBody.error || "Could not create account", code: backendBody.code },
      { status: backendRes.status }
    );
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(COOKIE_NAME, createSessionCookieValue(backendBody.userId), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_MS / 1000,
  });
  return response;
}
