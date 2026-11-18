import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import {
  ClipboardCopy,
  Copy,
  FileSearch,
  Lightbulb,
  ListChecks,
  Loader2,
  ScrollText,
  Target,
  Trash2,
  Wand2,
  type LucideIcon,
} from "lucide-react";
import { useState, type FormEvent } from "react";

import { ErrorNotice } from "@/components/error-notice";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { generateResearch } from "@/lib/ai/generate.functions";
import { copyToClipboard } from "@/lib/clipboard";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant — AI Workplace Assistant" },
      { name: "description", content: "Summarise articles or topics into key findings, insights and actionable recommendations." },
      { property: "og:title", content: "AI Research Assistant" },
      { property: "og:description", content: "Turn articles and topics into structured, actionable briefings." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ResearchPage,
});

type Sections = { title: string; summary: string; keyFindings: string; insights: string; recommendations: string };
type SectionKey = Exclude<keyof Sections, "title">;

const SECTIONS: { key: SectionKey; label: string; icon: LucideIcon }[] = [
  { key: "summary", label: "Summary", icon: ScrollText },
  { key: "keyFindings", label: "Key findings", icon: ListChecks },
  { key: "insights", label: "Insights", icon: Lightbulb },
  { key: "recommendations", label: "Recommendations", icon: Target },
];

const EXAMPLES = ["Benefits and risks of a 4-day work week", "Best practices for running effective remote meetings", "How generative AI is changing customer support"];

const toList = (items: string[]) => items.map((i) => `• ${i.trim()}`).join("\n");

function ResearchPage() {
  const generate = useServerFn(generateResearch);
  const [input, setInput] = useState("");
  const [result, setResult] = useState<Sections | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function run(e?: FormEvent) {
    e?.preventDefault();
    if (input.trim().length < 3 || loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await generate({ data: { content: input } });
      if (res.ok) {
        const d = res.data;
        setResult({
          title: d.title,
          summary: d.summary,
          keyFindings: toList(d.keyFindings),
          insights: toList(d.insights),
          recommendations: toList(d.recommendations),
        });
      } else setError(res.error);
    } catch {
      setError("Couldn't reach the AI service. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  const fullText = result
    ? [result.title, ...SECTIONS.map((s) => `${s.label.toUpperCase()}\n${result[s.key]}`)].join("\n\n")
    : "";

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-8">
      <PageHeader
        icon={FileSearch}
        title="AI Research Assistant"
        description="Enter a research topic or paste an article. Get a clear summary, key findings, insights and next steps — all editable."
      />

      <form onSubmit={run} className="rounded-2xl border bg-card p-5 shadow-soft md:p-6">
        <label htmlFor="research-input" className="text-sm font-medium text-foreground">
          Topic or article
        </label>
        <Textarea
          id="research-input"
          rows={6}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a topic like “Impact of hybrid work on productivity”, or paste the full text of an article or report…"
          className="mt-2 resize-y"
        />
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground">Try:</span>
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              type="button"
              onClick={() => setInput(ex)}
              className="rounded-full border bg-background px-3 py-1 text-xs text-foreground transition-colors hover:border-primary/50 hover:bg-accent"
            >
              {ex}
            </button>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Button type="submit" variant="hero" size="lg" disabled={input.trim().length < 3 || loading}>
            {loading ? <Loader2 className="animate-spin" /> : <Wand2 />}
            {loading ? "Analysing…" : "Analyse"}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            disabled={loading}
            onClick={() => {
              setInput("");
              setResult(null);
              setError(null);
            }}
          >
            <Trash2 /> Clear
          </Button>
          <span className="ml-auto text-xs text-muted-foreground">{input.length.toLocaleString()} / 20,000</span>
        </div>
        {error && <div className="mt-4"><ErrorNotice message={error} /></div>}
      </form>

      {loading && !result && (
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {SECTIONS.map((s) => (
            <div key={s.key} className="space-y-3 rounded-2xl border bg-card p-5 shadow-soft">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ))}
        </div>
      )}

      {result && (
        <section className={cn("mt-6 transition-opacity", loading && "opacity-50")}>
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Input
              aria-label="Research title"
              value={result.title}
              onChange={(e) => setResult({ ...result, title: e.target.value })}
              className="h-auto border-transparent bg-transparent px-0 font-display text-xl font-semibold shadow-none focus-visible:border-input focus-visible:px-3"
            />
            <Button variant="hero" onClick={() => copyToClipboard(fullText, "Research copied")}>
              <ClipboardCopy /> Copy all
            </Button>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {SECTIONS.map((s) => (
              <article key={s.key} className="flex flex-col rounded-2xl border bg-card p-5 shadow-soft">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <span className="flex size-7 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                      <s.icon className="size-4" />
                    </span>
                    {s.label}
                  </h3>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Copy ${s.label}`}
                    onClick={() => copyToClipboard(result[s.key], `${s.label} copied`)}
                  >
                    <Copy />
                  </Button>
                </div>
                <Textarea
                  value={result[s.key]}
                  onChange={(e) => setResult({ ...result, [s.key]: e.target.value })}
                  className="min-h-[180px] flex-1 resize-y border-transparent bg-muted/50 leading-relaxed focus-visible:bg-card"
                />
              </article>
            ))}
          </div>
        </section>
      )}

      {!result && !loading && (
        <div className="mt-6 flex flex-col items-center justify-center rounded-2xl border border-dashed bg-gradient-soft p-10 text-center">
          <FileSearch className="size-8 text-primary" />
          <p className="mt-3 font-medium text-foreground">Your research briefing will appear here</p>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Results are organised into Summary, Key findings, Insights and Recommendations.
          </p>
        </div>
      )}
    </div>
  );
}
