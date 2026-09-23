import { NextRequest, NextResponse } from "next/server";
import { callSyncBackend } from "@/lib/backend";

/**
 * Store -> Etsy counterpart of setup-sync/listings, for the same
 * pre-login "connect" wizard - lists the merchant's Wix/Shopify products
 * that don't already have a matching Etsy listing, so they can be picked
 * for publishing to Etsy before the wizard's claim step even exists yet.
 */
export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  try {
    const { status, body } = await callSyncBackend(userId, "store-products", { purpose: "onboarding" });
    return NextResponse.json(body, { status });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
