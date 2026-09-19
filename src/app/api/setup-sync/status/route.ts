import { NextRequest, NextResponse } from "next/server";
import { callSyncBackend } from "@/lib/backend";

// See listings/route.ts for why this reads userId from the request instead
// of the session cookie. Only used by the wizard's "connect" variant to
// show the account's plan (e.g. the Free plan's product limit) - the
// "manage" variant already gets this from the normal session-based
// /api/sync status route.
export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  try {
    const { status, body } = await callSyncBackend(userId, "status");
    return NextResponse.json(body, { status });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
