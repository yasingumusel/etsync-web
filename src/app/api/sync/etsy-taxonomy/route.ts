import { NextRequest, NextResponse } from "next/server";
import { getSessionUserId, callSyncBackend } from "@/lib/backend";

export async function GET(request: NextRequest) {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 });
  }

  const q = request.nextUrl.searchParams.get("q") || "";

  try {
    const { status, body } = await callSyncBackend(userId, "etsy-taxonomy", { query: { q } });
    return NextResponse.json(body, { status });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
