import { NextResponse } from "next/server";
import { getSessionUserId, callSyncBackend } from "@/lib/backend";

function platformQuery(request: Request): Record<string, string> | undefined {
  const p = new URL(request.url).searchParams.get("platform");
  return p === "wix" || p === "shopify" ? { platform: p } : undefined;
}

export async function GET(request: Request) {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 });
  }

  try {
    const { status, body } = await callSyncBackend(userId, "store-products", { query: platformQuery(request) });
    return NextResponse.json(body, { status });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
