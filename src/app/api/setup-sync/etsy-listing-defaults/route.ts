import { NextRequest, NextResponse } from "next/server";
import { callSyncBackend } from "@/lib/backend";

// See store-products/route.ts - same pre-login "connect" wizard trust
// model, this time for the Etsy listing defaults (category, shipping
// profile, processing profile, who/when made) behind the
// "{platform} -> Etsy" tab.

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  try {
    const { status, body } = await callSyncBackend(userId, "etsy-listing-defaults", { purpose: "onboarding" });
    return NextResponse.json(body, { status });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const { userId, taxonomyId, taxonomyName, shippingProfileId, readinessStateId, whoMade, whenMade } =
    await req.json();
  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  try {
    const { status, body } = await callSyncBackend(userId, "etsy-listing-defaults", {
      method: "PUT",
      body: { taxonomyId, taxonomyName, shippingProfileId, readinessStateId, whoMade, whenMade },
      purpose: "onboarding",
    });
    return NextResponse.json(body, { status });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
