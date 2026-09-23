import { NextRequest, NextResponse } from "next/server";
import { callSyncBackend } from "@/lib/backend";

// See store-products/route.ts and setup-sync/selection/route.ts - same
// pre-login "connect" wizard, same userId-from-query trust model, this
// time for the store -> Etsy product selection.

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  try {
    const { status, body } = await callSyncBackend(userId, "store-product-selection", { purpose: "onboarding" });
    return NextResponse.json(body, { status });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const { userId, mode, selectedProductIds } = await req.json();
  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  try {
    const { status, body } = await callSyncBackend(userId, "store-product-selection", {
      method: "PUT",
      body: { mode, selectedProductIds },
      purpose: "onboarding",
    });
    return NextResponse.json(body, { status });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
