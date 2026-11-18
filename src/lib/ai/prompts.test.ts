import { describe, expect, it } from "vitest";

import { buildEmailPrompt, emailInputSchema } from "./prompts";

describe("email generator input", () => {
  it("only accepts the three tones: formal, friendly, persuasive", () => {
    const base = { purpose: "Request a meeting", recipient: "Sam" };
    expect(emailInputSchema.safeParse({ ...base, tone: "formal" }).success).toBe(true);
    expect(emailInputSchema.safeParse({ ...base, tone: "friendly" }).success).toBe(true);
    expect(emailInputSchema.safeParse({ ...base, tone: "persuasive" }).success).toBe(true);
    expect(emailInputSchema.safeParse({ ...base, tone: "casual" }).success).toBe(false);
  });

  it("requires a recipient", () => {
    expect(emailInputSchema.safeParse({ purpose: "Request a meeting", recipient: " ", tone: "formal" }).success).toBe(false);
  });

  it("puts the user's actual purpose and recipient into the prompt", () => {
    const input = emailInputSchema.parse({ purpose: "Ask for Friday off", recipient: "Priya", tone: "friendly" });
    const prompt = buildEmailPrompt(input);
    expect(prompt).toContain("Ask for Friday off");
    expect(prompt).toContain("Priya");
  });
});
