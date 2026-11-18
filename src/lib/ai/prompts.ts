import { z } from "zod";

export const EMAIL_TONES = ["formal", "friendly", "persuasive"] as const;
export type EmailTone = (typeof EMAIL_TONES)[number];

export const emailInputSchema = z.object({
  purpose: z.string().trim().min(3, "Describe what the email is for.").max(2000),
  recipient: z.string().trim().min(1, "Add a recipient.").max(200),
  subject: z.string().trim().max(200).default(""),
  context: z.string().trim().max(4000).default(""),
  tone: z.enum(EMAIL_TONES),
  senderName: z.string().trim().max(100).default(""),
});
export type EmailInput = z.infer<typeof emailInputSchema>;

export const emailOutputSchema = z.object({
  subject: z.string(),
  body: z.string(),
});
export type EmailOutput = z.infer<typeof emailOutputSchema>;

export const researchInputSchema = z.object({
  content: z.string().trim().min(3, "Enter a topic or paste an article.").max(20000),
});
export type ResearchInput = z.infer<typeof researchInputSchema>;

export const researchOutputSchema = z.object({
  title: z.string(),
  summary: z.string(),
  keyFindings: z.array(z.string()),
  insights: z.array(z.string()),
  recommendations: z.array(z.string()),
});
export type ResearchOutput = z.infer<typeof researchOutputSchema>;

const TONE_GUIDE: Record<EmailTone, string> = {
  formal:
    "Formal: polished, respectful and concise. Use professional salutations (e.g. 'Dear ...'), avoid contractions and slang, and close with 'Kind regards' or similar.",
  friendly:
    "Friendly: warm, approachable and conversational while still professional. Contractions are fine; open with a warm greeting and close with a friendly sign-off.",
  persuasive:
    "Persuasive: confident and benefit-focused. Lead with value for the recipient, support the request with clear reasons drawn from the user's context, and end with a specific call to action.",
};

export const EMAIL_INSTRUCTIONS = `You are an expert workplace communication writer. You write complete, ready-to-send professional emails.
Rules:
- Base every sentence on the user's stated purpose, recipient and key points. Never invent facts, numbers, dates or names the user did not provide; where a specific detail is clearly needed but missing, insert a short bracketed placeholder like [date].
- Produce a specific subject line (max ~9 words). If the user supplied a subject, use it or lightly polish it.
- The body must include a greeting addressed to the recipient, well-structured paragraphs, and a sign-off. Do not include the subject line inside the body.
- Use plain text only (no markdown), with blank lines between paragraphs.
- Keep it as short as the purpose allows, usually 90-220 words.`;

export function buildEmailPrompt(input: EmailInput): string {
  return [
    `Tone: ${TONE_GUIDE[input.tone]}`,
    `Recipient: ${input.recipient}`,
    `Purpose of the email: ${input.purpose}`,
    input.subject ? `Requested subject: ${input.subject}` : "Subject: not provided — write one.",
    input.context ? `Additional context / key points to include:\n${input.context}` : "Additional context: none.",
    input.senderName ? `Sign the email as: ${input.senderName}` : "Sign off with a placeholder [Your name].",
  ].join("\n\n");
}

export const RESEARCH_INSTRUCTIONS = `You are a senior research analyst helping a busy professional.
The user provides either a research topic or the full text of an article/document.
- If it is an article or document, analyse ONLY that text: do not add outside facts, and attribute claims to the source.
- If it is a topic, draw on well-established general knowledge, avoid fabricating statistics or citations, and note where facts should be verified or may have changed recently.
Return:
- title: a short descriptive title for the analysis.
- summary: a concise 3-5 sentence summary in plain prose.
- keyFindings: 4-6 specific, important findings or key points.
- insights: 3-5 non-obvious insights explaining why the findings matter for a workplace/business audience.
- recommendations: 3-5 concrete, actionable next steps, each starting with a verb.
Write each list item as one or two clear sentences in plain text (no markdown, no numbering).`;

export function buildResearchPrompt(input: ResearchInput): string {
  const looksLikeArticle = input.content.length > 400 || input.content.split(/\n/).length > 4;
  return looksLikeArticle
    ? `Analyse the following article/document:\n\n"""\n${input.content}\n"""`
    : `Research topic: ${input.content}`;
}

export const CHAT_INSTRUCTIONS = `You are Aria, the AI Workplace Productivity Assistant. You help professionals with emails, meeting summaries, planning, prioritisation, team productivity, communication and general workplace questions.
- Answer the user's actual question directly and specifically; ask one brief clarifying question only when essential information is missing.
- Be practical: prefer concrete steps, templates, and examples. Use concise markdown (short headings, bullet lists, bold for key terms) when it improves readability.
- If the user asks you to summarise something they haven't pasted yet, ask them to paste it.
- Never claim to have sent emails, accessed calendars or browsed the web. Remind users not to share confidential information if they appear to paste sensitive data.`;
