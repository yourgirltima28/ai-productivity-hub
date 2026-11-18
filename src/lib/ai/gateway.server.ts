import { createOpenAI } from "@ai-sdk/openai";
import { APICallError, Output, streamText, type ModelMessage } from "ai";
import type { z } from "zod";

import {
  createLovableAiGatewayRunIdFetch,
  getLovableAiGatewayRunId,
  withLovableAiGatewayRunIdHeader,
} from "./run-id.server";

const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1";
export const AI_MODEL = "openai/gpt-6-astra";

function getApiKey() {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new AiConfigError();
  return key;
}

class AiConfigError extends Error {
  constructor() {
    super("The AI service is not configured yet. Please contact the app owner.");
  }
}

function createProvider(runIdFetch: ReturnType<typeof createLovableAiGatewayRunIdFetch>) {
  const apiKey = getApiKey();
  return createOpenAI({
    baseURL: GATEWAY_URL,
    apiKey,
    headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    fetch: runIdFetch.fetch,
  });
}

/** Turns gateway / SDK failures into a short message a user can act on. */
export function friendlyAiError(error: unknown): { message: string; status: number } {
  if (error instanceof AiConfigError) return { message: error.message, status: 500 };
  const status =
    APICallError.isInstance(error) && typeof error.statusCode === "number"
      ? error.statusCode
      : typeof (error as { statusCode?: unknown })?.statusCode === "number"
        ? ((error as { statusCode: number }).statusCode)
        : 500;
  switch (status) {
    case 429:
      return { status, message: "The AI is receiving too many requests right now. Please wait a moment and try again." };
    case 402:
      return { status, message: "AI credits have run out for this workspace. Add credits in your Lovable workspace settings to continue." };
    case 403:
      return { status, message: "The AI service declined this request. Please adjust your input or contact the app owner." };
    case 400:
      return { status, message: "The AI couldn't process that input. Try shortening or rephrasing it." };
    default:
      return { status, message: "Something went wrong while generating a response. Please try again." };
  }
}

/** Streaming chat that returns an AI SDK UI-message stream response. */
export function streamChatResponse(request: Request, messages: ModelMessage[], instructions: string) {
  const runIdFetch = createLovableAiGatewayRunIdFetch(getLovableAiGatewayRunId(request));
  const provider = createProvider(runIdFetch);
  const result = streamText({
    model: provider.responses(AI_MODEL),
    instructions,
    messages,
    abortSignal: request.signal,
    providerOptions: {
      openai: {
        forceReasoning: true,
        reasoningEffort: "low",
        reasoningSummary: "auto",
        store: false,
        include: ["reasoning.encrypted_content"],
      },
    },
  });
  return withLovableAiGatewayRunIdHeader(
    result.toUIMessageStreamResponse({
      sendReasoning: false,
      onError: (error) => {
        console.error("chat stream error", error);
        return friendlyAiError(error).message;
      },
    }),
    runIdFetch,
  );
}

/** One-shot structured generation: streams from the gateway and returns the final typed object. */
export async function generateStructured<T>(opts: {
  instructions: string;
  prompt: string;
  schema: z.ZodType<T>;
}): Promise<T> {
  const runIdFetch = createLovableAiGatewayRunIdFetch();
  const provider = createProvider(runIdFetch);
  let streamError: unknown;
  const result = streamText({
    model: provider.responses(AI_MODEL),
    instructions: opts.instructions,
    messages: [{ role: "user", content: opts.prompt }],
    output: Output.object({ schema: opts.schema }),
    maxRetries: 1,
    onError: ({ error }) => {
      streamError = error;
    },
    providerOptions: {
      openai: {
        forceReasoning: true,
        reasoningEffort: "low",
        reasoningSummary: "auto",
        store: false,
        include: ["reasoning.encrypted_content"],
      },
    },
  });
  try {
    const output = await result.output;
    return output as T;
  } catch (error) {
    throw streamError ?? error;
  }
}
