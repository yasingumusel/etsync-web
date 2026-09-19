import { NextRequest, NextResponse } from "next/server";
import { callSyncBackend } from "@/lib/backend";

/**
 * Backs the setup wizard shown right after connecting Etsy
 * (src/app/setup-sync). That page is reached via a userId in the URL, the
 * same trust model /connect-etsy already uses - there's no dashboard
 * session yet the first time a shop connects through the Wix install flow -
 * so this reads userId from the query string rather than the session
 * cookie, unlike every other /api/sync/* route.
 */
export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  try {
    const { status, body } = await callSyncBackend(userId, "etsy-listings", { purpose: "onboarding" });
    return NextResponse.json(body, { status });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
