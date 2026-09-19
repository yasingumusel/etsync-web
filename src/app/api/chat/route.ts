import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { JASON_SYSTEM_PROMPT } from "@/lib/jasonKnowledge";

type ChatMessage = { role: "user" | "assistant"; content: string };

// A support widget doesn't need unbounded history - this keeps requests
// cheap and bounded, independent of the AI Etsy usage the site's own
// backend does (this route never touches a customer's Etsy/Wix data).
const MAX_MESSAGES = 20;
const MAX_MESSAGE_LENGTH = 4000;

/**
 * Backs the "Jason" support chatbot (JasonChat.tsx). Streams plain text
 * back to the client - see src/lib/jasonKnowledge.ts for exactly what
 * Jason is allowed to know and say.
 */
export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response(
      "Jason isn't set up yet - please email support@mirrorstock.com instead.",
      { status: 500 }
    );
  }

  const body = await req.json().catch(() => null);
  const rawMessages: unknown[] = Array.isArray(body?.messages) ? body.messages : [];

  const messages: ChatMessage[] = rawMessages
    .slice(-MAX_MESSAGES)
    .filter(
      (m: unknown): m is ChatMessage =>
        !!m &&
        typeof m === "object" &&
        ((m as ChatMessage).role === "user" || (m as ChatMessage).role === "assistant") &&
        typeof (m as ChatMessage).content === "string"
    )
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_MESSAGE_LENGTH) }));

  if (!messages.length || messages[messages.length - 1].role !== "user") {
    return new Response("Missing a user message", { status: 400 });
  }

  const client = new Anthropic();

  const anthropicStream = client.messages.stream({
    model: "claude-opus-5",
    max_tokens: 1024,
    system: JASON_SYSTEM_PROMPT,
    output_config: { effort: "low" }, // a support chat doesn't need deep reasoning
    messages,
  });

  const encoder = new TextEncoder();
  let errored = false;

  const readable = new ReadableStream({
    async start(controller) {
      anthropicStream.on("text", (text) => {
        if (!errored) controller.enqueue(encoder.encode(text));
      });
      anthropicStream.on("error", (err) => {
        console.error("[jason chat]", err);
        errored = true;
        controller.error(err);
      });

      try {
        await anthropicStream.finalMessage();
      } catch {
        // Already reported via the "error" listener above.
      }

      if (!errored) controller.close();
    },
  });

  return new Response(readable, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
