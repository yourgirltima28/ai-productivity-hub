import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, type UIMessage } from "ai";

import { friendlyAiError, streamChatResponse } from "@/lib/ai/gateway.server";
import { CHAT_INSTRUCTIONS } from "@/lib/ai/prompts";

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let messages: UIMessage[];
        try {
          const body = (await request.json()) as { messages?: unknown };
          if (!Array.isArray(body.messages) || body.messages.length === 0 || body.messages.length > 100) {
            return Response.json({ error: "Invalid conversation." }, { status: 400 });
          }
          messages = body.messages as UIMessage[];
        } catch {
          return Response.json({ error: "Invalid request body." }, { status: 400 });
        }
        try {
          const modelMessages = await convertToModelMessages(messages);
          return await streamChatResponse(request, modelMessages, CHAT_INSTRUCTIONS);
        } catch (error) {
          console.error("chat route failed", error);
          const { message, status } = friendlyAiError(error);
          return Response.json({ error: message }, { status });
        }
      },
    },
  },
});
