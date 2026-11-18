import { createServerFn } from "@tanstack/react-start";

import { friendlyAiError, generateStructured } from "./gateway.server";
import {
  EMAIL_INSTRUCTIONS,
  RESEARCH_INSTRUCTIONS,
  buildEmailPrompt,
  buildResearchPrompt,
  emailInputSchema,
  emailOutputSchema,
  researchInputSchema,
  researchOutputSchema,
  type EmailOutput,
  type ResearchOutput,
} from "./prompts";

export type AiResult<T> = { ok: true; data: T } | { ok: false; error: string };

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => emailInputSchema.parse(data))
  .handler(async ({ data }): Promise<AiResult<EmailOutput>> => {
    try {
      const output = await generateStructured({
        instructions: EMAIL_INSTRUCTIONS,
        prompt: buildEmailPrompt(data),
        schema: emailOutputSchema,
      });
      if (!output?.body?.trim()) return { ok: false, error: "The AI returned an empty email. Please try again." };
      return { ok: true, data: output };
    } catch (error) {
      console.error("generateEmail failed", error);
      return { ok: false, error: friendlyAiError(error).message };
    }
  });

export const generateResearch = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => researchInputSchema.parse(data))
  .handler(async ({ data }): Promise<AiResult<ResearchOutput>> => {
    try {
      const output = await generateStructured({
        instructions: RESEARCH_INSTRUCTIONS,
        prompt: buildResearchPrompt(data),
        schema: researchOutputSchema,
      });
      if (!output?.summary?.trim()) return { ok: false, error: "The AI returned an empty result. Please try again." };
      return { ok: true, data: output };
    } catch (error) {
      console.error("generateResearch failed", error);
      return { ok: false, error: friendlyAiError(error).message };
    }
  });
