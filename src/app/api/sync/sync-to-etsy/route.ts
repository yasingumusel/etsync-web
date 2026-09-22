import { NextResponse } from "next/server";
import { getSessionUserId, callSyncBackend } from "@/lib/backend";

export async function POST() {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 });
  }

  try {
    const { status, body } = await callSyncBackend(userId, "sync-to-etsy", { method: "POST" });
    return NextResponse.json(body, { status });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
