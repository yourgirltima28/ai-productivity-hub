import { createFileRoute } from "@tanstack/react-router";
import { RotateCcw, Save, Settings as SettingsIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { AiDisclaimer } from "@/components/ai-disclaimer";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSettings, type AppSettings } from "@/hooks/use-settings";
import { EMAIL_TONES, type EmailTone } from "@/lib/ai/prompts";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — AI Workplace Assistant" },
      { name: "description", content: "Set your name and default email tone for the AI Workplace Productivity Assistant." },
      { property: "og:title", content: "Settings — AI Workplace Assistant" },
      { property: "og:description", content: "Personalise your AI workplace assistant." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SettingsPage,
});

const TONE_LABELS: Record<EmailTone, string> = { formal: "Formal", friendly: "Friendly", persuasive: "Persuasive" };

function SettingsPage() {
  const { settings, save, reset, loaded } = useSettings();
  const [draft, setDraft] = useState<AppSettings>(settings);

  useEffect(() => {
    if (loaded) setDraft(settings);
  }, [loaded, settings]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 md:px-8">
      <PageHeader icon={SettingsIcon} title="Settings" description="Personalise how the assistant writes for you. Saved in this browser only." />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          save({ ...draft, displayName: draft.displayName.trim() });
          toast.success("Preferences saved");
        }}
        className="space-y-6 rounded-2xl border bg-card p-6 shadow-soft"
      >
        <div className="space-y-2">
          <Label htmlFor="name">Your name</Label>
          <Input
            id="name"
            maxLength={100}
            value={draft.displayName}
            onChange={(e) => setDraft({ ...draft, displayName: e.target.value })}
            placeholder="Used to sign generated emails"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="tone">Default email tone</Label>
          <Select value={draft.defaultTone} onValueChange={(v) => setDraft({ ...draft, defaultTone: v as EmailTone })}>
            <SelectTrigger id="tone" className="w-full sm:w-64">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {EMAIL_TONES.map((t) => (
                <SelectItem key={t} value={t}>
                  {TONE_LABELS[t]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-wrap gap-2 border-t pt-5">
          <Button type="submit" variant="hero">
            <Save /> Save preferences
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              reset();
              toast.success("Preferences reset");
            }}
          >
            <RotateCcw /> Reset
          </Button>
        </div>
      </form>

      <section className="mt-6 rounded-2xl border bg-gradient-soft p-6">
        <h2 className="text-base font-semibold text-foreground">Privacy & responsible use</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          There are no accounts and nothing you type is saved by this app. Your text is sent securely to the AI service
          only to generate a response.
        </p>
        <AiDisclaimer className="mt-4 text-sm" />
      </section>
    </div>
  );
}
