import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { getSessionUserId } from "@/lib/backend";

/**
 * Starts the Shopify install for an already-logged-in merchant - the
 * Shopify counterpart of /api/wix/connect. Unlike Wix (where the site is
 * chosen inside Wix's own installer), Shopify has to be told which shop up
 * front, so the merchant's myshopify.com domain comes in as ?shop=.
 *
 * The token is minted from the verified session cookie's own userId, never
 * one supplied by the caller, and also serves as the OAuth `state` nonce on
 * the backend (see routes/auth/shopify.js). 10 minutes, since the round trip
 * includes the merchant approving the install inside Shopify's own admin.
 */
export async function GET(request: NextRequest) {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const shop = request.nextUrl.searchParams.get("shop");
  if (!shop) {
    return NextResponse.json({ error: "Missing shop" }, { status: 400 });
  }

  const secret = process.env.SYNC_API_SECRET;
  const baseUrl = process.env.SYNC_BACKEND_URL;
  if (!secret || !baseUrl) {
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  }

  const token = jwt.sign({ userId, purpose: "shopify-connect" }, secret, {
    algorithm: "HS256",
    expiresIn: "10m",
  });

  return NextResponse.redirect(
    `${baseUrl}/auth/shopify/connect?shop=${encodeURIComponent(shop)}&token=${encodeURIComponent(token)}`
  );
}
