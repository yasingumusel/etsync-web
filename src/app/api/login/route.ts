import { NextRequest, NextResponse } from "next/server";
import { createSessionCookieValue, COOKIE_NAME, SESSION_TTL_MS } from "@/lib/session";
import { clientIp } from "@/lib/clientIp";

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  const baseUrl = process.env.SYNC_BACKEND_URL;
  const secret = process.env.SYNC_API_SECRET;
  if (!baseUrl || !secret) {
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  }

  const backendRes = await fetch(`${baseUrl}/auth/account/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Sync-Secret": secret,
      // This route runs server-side (Vercel), so the backend would
      // otherwise only ever see Vercel's own address, not the real
      // visitor's - which would break its login brute-force rate limit.
      // See routes/auth/account.js's clientIpKey() for why trusting this
      // header is safe.
      "X-Client-IP": clientIp(request),
    },
    body: JSON.stringify({ email, password }),
  });
  const backendBody = await backendRes.json();

  if (!backendRes.ok) {
    return NextResponse.json({ error: backendBody.error || "Login failed" }, { status: backendRes.status });
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
