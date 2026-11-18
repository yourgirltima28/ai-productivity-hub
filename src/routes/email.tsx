import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Briefcase, Copy, Loader2, Mail, Megaphone, RefreshCw, Smile, Trash2, Wand2 } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";

import { ErrorNotice } from "@/components/error-notice";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useSettings } from "@/hooks/use-settings";
import { generateEmail } from "@/lib/ai/generate.functions";
import type { EmailTone } from "@/lib/ai/prompts";
import { copyToClipboard } from "@/lib/clipboard";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — AI Workplace Assistant" },
      { name: "description", content: "Generate professional, context-aware emails in a formal, friendly or persuasive tone." },
      { property: "og:title", content: "Smart Email Generator" },
      { property: "og:description", content: "Generate professional, context-aware emails with AI." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: EmailPage,
});

const TONES: { value: EmailTone; label: string; hint: string; icon: typeof Smile }[] = [
  { value: "formal", label: "Formal", hint: "Polished & respectful", icon: Briefcase },
  { value: "friendly", label: "Friendly", hint: "Warm & approachable", icon: Smile },
  { value: "persuasive", label: "Persuasive", hint: "Confident & compelling", icon: Megaphone },
];

const EMPTY_FORM = { purpose: "", recipient: "", subject: "", context: "" };

function EmailPage() {
  const generate = useServerFn(generateEmail);
  const { settings, loaded } = useSettings();
  const [form, setForm] = useState(EMPTY_FORM);
  const [tone, setTone] = useState<EmailTone>("formal");
  const [result, setResult] = useState<{ subject: string; body: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (loaded) setTone(settings.defaultTone);
  }, [loaded, settings.defaultTone]);

  const canSubmit = form.purpose.trim().length >= 3 && form.recipient.trim().length > 0 && !loading;

  async function run() {
    if (!canSubmit) return;
    setLoading(true);
    setError(null);
    try {
      const res = await generate({ data: { ...form, tone, senderName: settings.displayName } });
      if (res.ok) setResult(res.data);
      else setError(res.error);
    } catch {
      setError("Couldn't reach the AI service. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    void run();
  }

  function clearAll() {
    setForm(EMPTY_FORM);
    setResult(null);
    setError(null);
  }

  const set = (k: keyof typeof EMPTY_FORM) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-8">
      <PageHeader
        icon={Mail}
        title="Smart Email Generator"
        description="Describe what you need to say and who it's for. The AI drafts a complete email you can edit before sending."
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
        <form onSubmit={onSubmit} className="space-y-5 rounded-2xl border bg-card p-5 shadow-soft md:p-6">
          <div className="space-y-2">
            <Label htmlFor="purpose">Email purpose *</Label>
            <Textarea
              id="purpose"
              rows={3}
              value={form.purpose}
              onChange={set("purpose")}
              placeholder="e.g. Ask my manager for approval to attend a 2-day UX conference next month"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="recipient">Recipient *</Label>
              <Input id="recipient" value={form.recipient} onChange={set("recipient")} placeholder="e.g. Sarah, my team lead" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">
                Subject <span className="font-normal text-muted-foreground">(optional)</span>
              </Label>
              <Input id="subject" value={form.subject} onChange={set("subject")} placeholder="Let the AI suggest one" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="context">Additional context or key points</Label>
            <Textarea
              id="context"
              rows={4}
              value={form.context}
              onChange={set("context")}
              placeholder={"e.g. Cost is R6,500 incl. travel\nI'll share learnings with the team afterwards"}
            />
          </div>
          <fieldset className="space-y-2">
            <legend className="text-sm font-medium text-foreground">Tone</legend>
            <div role="radiogroup" className="grid grid-cols-3 gap-2">
              {TONES.map((t) => {
                const active = tone === t.value;
                return (
                  <button
                    key={t.value}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => setTone(t.value)}
                    className={cn(
                      "flex flex-col items-center gap-1 rounded-xl border p-3 text-center transition-all hover:border-primary/50",
                      active ? "border-primary bg-accent text-accent-foreground shadow-soft" : "bg-card text-foreground",
                    )}
                  >
                    <t.icon className="size-4" />
                    <span className="text-sm font-semibold">{t.label}</span>
                    <span className="hidden text-[11px] text-muted-foreground sm:block">{t.hint}</span>
                  </button>
                );
              })}
            </div>
          </fieldset>
          <div className="flex flex-wrap gap-2">
            <Button type="submit" variant="hero" size="lg" disabled={!canSubmit} className="flex-1">
              {loading ? <Loader2 className="animate-spin" /> : <Wand2 />}
              {loading ? "Writing…" : "Generate email"}
            </Button>
            <Button type="button" variant="outline" size="lg" onClick={clearAll} disabled={loading}>
              <Trash2 /> Clear
            </Button>
          </div>
          {error && <ErrorNotice message={error} />}
        </form>

        <section className="flex min-h-[420px] flex-col rounded-2xl border bg-card p-5 shadow-soft md:p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-base font-semibold text-foreground">Your email</h2>
            <div className="flex gap-1.5">
              <Button
                variant="outline"
                size="sm"
                disabled={!result || loading}
                onClick={() => result && copyToClipboard(`Subject: ${result.subject}\n\n${result.body}`, "Email copied")}
              >
                <Copy /> Copy
              </Button>
              <Button variant="outline" size="sm" disabled={!result || !canSubmit} onClick={() => void run()}>
                <RefreshCw className={cn(loading && "animate-spin")} /> Regenerate
              </Button>
            </div>
          </div>

          {loading && !result ? (
            <div className="space-y-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-11/12" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ) : result ? (
            <div className={cn("flex flex-1 flex-col gap-3 transition-opacity", loading && "opacity-50")}>
              <div className="space-y-1.5">
                <Label htmlFor="out-subject" className="text-xs uppercase tracking-wide text-muted-foreground">
                  Subject
                </Label>
                <Input
                  id="out-subject"
                  value={result.subject}
                  onChange={(e) => setResult({ ...result, subject: e.target.value })}
                  className="font-medium"
                />
              </div>
              <div className="flex flex-1 flex-col space-y-1.5">
                <Label htmlFor="out-body" className="text-xs uppercase tracking-wide text-muted-foreground">
                  Body
                </Label>
                <Textarea
                  id="out-body"
                  value={result.body}
                  onChange={(e) => setResult({ ...result, body: e.target.value })}
                  className="min-h-[320px] flex-1 resize-y leading-relaxed"
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed bg-gradient-soft p-8 text-center">
              <Mail className="size-8 text-primary" />
              <p className="mt-3 font-medium text-foreground">Your generated email will appear here</p>
              <p className="mt-1 max-w-xs text-sm text-muted-foreground">
                Fill in the purpose and recipient, choose a tone, then click Generate.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
