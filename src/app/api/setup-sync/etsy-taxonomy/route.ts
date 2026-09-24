import { NextRequest, NextResponse } from "next/server";
import { callSyncBackend } from "@/lib/backend";

// See store-products/route.ts - same pre-login "connect" wizard trust
// model, this time for the Etsy category search box behind the
// "{platform} -> Etsy" tab.
export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }
  const q = req.nextUrl.searchParams.get("q") || "";

  try {
    const { status, body } = await callSyncBackend(userId, "etsy-taxonomy", {
      query: { q },
      purpose: "onboarding",
    });
    return NextResponse.json(body, { status });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
