import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { getSessionUserId } from "@/lib/backend";

/**
 * Lets an already-logged-in merchant (re)connect Etsy, opened in a new tab
 * from the dashboard the same way /connect-etsy is (Etsy refuses to log in
 * inside an iframe). This exists because the backend's
 * /auth/etsy/connect?userId=... no longer accepts a bare userId once an
 * account has a password - that bare id isn't a secret (it travels in
 * redirect URLs, Referer headers, browser history), so once an account is
 * claimed it must prove the caller is actually logged in as it, not just
 * that they've seen its id. This route is that proof: it only ever uses the
 * verified session cookie's own userId, never one supplied by the caller,
 * and mints a token valid for 60 seconds - just long enough for the
 * redirect that follows.
 */
export async function GET(request: NextRequest) {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const secret = process.env.SYNC_API_SECRET;
  const baseUrl = process.env.SYNC_BACKEND_URL;
  if (!secret || !baseUrl) {
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  }

  const token = jwt.sign({ userId, purpose: "etsy-reconnect" }, secret, {
    algorithm: "HS256",
    expiresIn: "60s",
  });

  return NextResponse.redirect(
    `${baseUrl}/auth/etsy/connect?userId=${encodeURIComponent(userId)}&token=${encodeURIComponent(token)}`
  );
}
