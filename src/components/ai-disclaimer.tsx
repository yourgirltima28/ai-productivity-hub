import { ShieldAlert } from "lucide-react";

import { cn } from "@/lib/utils";

export const DISCLAIMER_TEXT =
  "AI-generated content may contain inaccuracies. Always review, verify, and edit AI-generated emails, research, and recommendations before using them professionally. Do not enter confidential company or personal information.";

export function AiDisclaimer({ className }: { className?: string }) {
  return (
    <p className={cn("flex items-start gap-2 text-xs leading-relaxed text-muted-foreground", className)}>
      <ShieldAlert className="mt-0.5 size-3.5 shrink-0 text-primary" />
      <span>{DISCLAIMER_TEXT}</span>
    </p>
  );
}
