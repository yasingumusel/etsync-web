import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { getSessionUserId } from "@/lib/backend";

/**
 * Lets an already-logged-in merchant attach a Wix store to their EXISTING
 * account - the counterpart of /api/etsy/reconnect. Without this, the only
 * way to connect Wix was installing the app from the Wix App Market first,
 * which creates/finds a User purely by wixInstanceId and can never be the
 * same account as one that started from a direct website signup + Etsy
 * connect (see routes/auth/wix.js's /callback for the merge logic this
 * token enables). Mints a short-lived token from the verified session
 * cookie's own userId - never one supplied by the caller - then sends the
 * browser through Wix's real install/consent screen. 10 minutes because,
 * unlike the Etsy reconnect redirect, this round trip includes the merchant
 * actually picking a site and approving install inside Wix's own UI.
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

  const token = jwt.sign({ userId, purpose: "wix-connect" }, secret, {
    algorithm: "HS256",
    expiresIn: "10m",
  });

  return NextResponse.redirect(`${baseUrl}/auth/wix/install?token=${encodeURIComponent(token)}`);
}
