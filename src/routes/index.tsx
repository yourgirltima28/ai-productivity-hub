import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Bot, CheckCircle2, FileSearch, Lock, Mail, PenLine, Zap } from "lucide-react";

import logo from "@/assets/logo-mark.png";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — AI Workplace Productivity Assistant" },
      {
        name: "description",
        content: "Write emails, summarise research and get workplace answers with your AI-powered productivity assistant.",
      },
      { property: "og:title", content: "AI Workplace Productivity Assistant" },
      {
        property: "og:description",
        content: "Write emails, summarise research and get workplace answers with AI.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

const FEATURES = [
  {
    to: "/email",
    icon: Mail,
    title: "Smart Email Generator",
    description: "Turn a few notes into a polished, context-aware email in the tone you need.",
    points: ["Formal, friendly or persuasive", "Subject line + full body", "Edit, copy & regenerate"],
    cta: "Write an email",
  },
  {
    to: "/research",
    icon: FileSearch,
    title: "AI Research Assistant",
    description: "Paste an article or enter a topic and get a structured, editable briefing.",
    points: ["Concise summaries", "Key findings & insights", "Actionable recommendations"],
    cta: "Start research",
  },
  {
    to: "/chat",
    icon: Bot,
    title: "AI Workplace Chatbot",
    description: "Ask anything about your workday — planning, meetings, communication and more.",
    points: ["Natural conversation", "Suggested prompts", "Start fresh anytime"],
    cta: "Open chat",
  },
] as const;

const CAPABILITIES = [
  { icon: PenLine, title: "Tailored to your input", text: "Every result is generated from what you write — no templates or canned answers." },
  { icon: Zap, title: "Seconds, not hours", text: "Draft emails and briefings fast, then refine them right in the editor." },
  { icon: Lock, title: "No account needed", text: "Nothing is stored on a server. Preferences stay in this browser only." },
];

function Dashboard() {
  return (
    <div className="bg-gradient-hero">
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-8 md:py-12">
        <section className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs font-medium text-accent-foreground shadow-soft">
              <span className="size-1.5 rounded-full bg-primary" /> AI-powered productivity
            </span>
            <h1 className="mt-4 text-3xl font-semibold leading-tight text-foreground md:text-5xl">
              Your <span className="text-gradient">AI-Powered</span> Workplace Assistant
            </h1>
            <p className="mt-4 text-base text-muted-foreground md:text-lg">
              Write better emails, digest research faster and get clear answers to everyday work questions — so you can
              spend your time on the work that matters.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button variant="hero" size="lg" asChild>
                <Link to="/email">
                  <Mail /> Generate an email
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="bg-card">
                <Link to="/research">
                  <FileSearch /> Research
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="bg-card">
                <Link to="/chat">
                  <Bot /> Chat
                </Link>
              </Button>
            </div>
          </div>
          <img
            src={logo}
            alt=""
            width={220}
            height={220}
            className="hidden size-52 drop-shadow-2xl md:block lg:size-60"
          />
        </section>

        <section className="mt-12 grid gap-5 md:grid-cols-3">
          {FEATURES.map((f) => (
            <article key={f.to} className="lift flex flex-col rounded-2xl border bg-card p-6 shadow-soft">
              <span className="flex size-11 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
                <f.icon className="size-5" />
              </span>
              <h2 className="mt-4 text-lg font-semibold text-foreground">{f.title}</h2>
              <p className="mt-1.5 text-sm text-muted-foreground">{f.description}</p>
              <ul className="mt-4 space-y-2">
                {f.points.map((p) => (
                  <li key={p} className="flex items-center gap-2 text-sm text-foreground">
                    <CheckCircle2 className="size-4 text-primary" /> {p}
                  </li>
                ))}
              </ul>
              <Button variant="soft" className="group mt-6 w-full justify-between" asChild>
                <Link to={f.to}>
                  {f.cta}
                  <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
                </Link>
              </Button>
            </article>
          ))}
        </section>

        <section className="mt-10 rounded-2xl border bg-card p-6 shadow-soft md:p-8">
          <h2 className="text-lg font-semibold text-foreground">What your assistant can do</h2>
          <div className="mt-5 grid gap-6 md:grid-cols-3">
            {CAPABILITIES.map((c) => (
              <div key={c.title} className="flex gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                  <c.icon className="size-4" />
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">{c.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{c.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
