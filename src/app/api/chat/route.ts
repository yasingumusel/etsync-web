import { NextRequest, NextResponse } from "next/server";
import { jasonAnswer } from "@/lib/jasonBot";

const MAX_MESSAGE_LENGTH = 2000;

/**
 * Backs the "Jason" support chatbot (JasonChat.tsx). Entirely local -
 * keyword-matches the visitor's message against src/lib/jasonFaq.ts and
 * returns the best answer. No external AI API, no per-message cost.
 */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const message = typeof body?.message === "string" ? body.message.slice(0, MAX_MESSAGE_LENGTH) : "";

  if (!message.trim()) {
    return NextResponse.json({ error: "Missing message" }, { status: 400 });
  }

  return NextResponse.json({ answer: jasonAnswer(message) });
}
