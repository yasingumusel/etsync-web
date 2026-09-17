import { NextResponse } from "next/server";
import { getSessionUserId, callSyncBackend } from "@/lib/backend";

export async function GET() {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 });
  }

  try {
    const { status, body } = await callSyncBackend(userId, "settings");
    return NextResponse.json(body, { status });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 });
  }

  try {
    const payload = await request.json();
    const { status, body } = await callSyncBackend(userId, "settings", {
      method: "PUT",
      body: payload,
    });
    return NextResponse.json(body, { status });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
