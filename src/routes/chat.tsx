import { useChat } from "@ai-sdk/react";
import { createFileRoute } from "@tanstack/react-router";
import { DefaultChatTransport } from "ai";
import { CalendarClock, Copy, Lightbulb, Mail, MessageSquarePlus, NotebookPen } from "lucide-react";
import { useMemo } from "react";
import { toast } from "sonner";

import logo from "@/assets/logo-mark.png";
import { Conversation, ConversationContent, ConversationScrollButton } from "@/components/ai-elements/conversation";
import { Message, MessageAction, MessageActions, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  type PromptInputMessage,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { ErrorNotice } from "@/components/error-notice";
import { Button } from "@/components/ui/button";
import { copyToClipboard } from "@/lib/clipboard";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Workplace Chatbot — AI Workplace Assistant" },
      { name: "description", content: "Chat with an AI assistant about emails, meetings, planning and team productivity." },
      { property: "og:title", content: "AI Workplace Chatbot" },
      { property: "og:description", content: "Get practical answers to everyday workplace questions." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ChatPage,
});

const SUGGESTIONS = [
  { icon: Mail, text: "Help me write a professional email." },
  { icon: NotebookPen, text: "Summarize this meeting." },
  { icon: Lightbulb, text: "Give me ideas to improve team productivity." },
  { icon: CalendarClock, text: "Help me organize my workday." },
];

async function readError(error: Error) {
  try {
    const parsed = JSON.parse(error.message) as { error?: string };
    if (parsed.error) return parsed.error;
  } catch {
    /* not JSON */
  }
  return error.message || "Something went wrong. Please try again.";
}

function ChatPage() {
  const transport = useMemo(() => new DefaultChatTransport({ api: "/api/chat" }), []);
  const { messages, sendMessage, status, stop, setMessages, error, clearError } = useChat({
    transport,
    onError: async (err) => toast.error(await readError(err)),
  });
  const busy = status === "submitted" || status === "streaming";
  const last = messages.at(-1);
  const waiting =
    busy && (last?.role !== "assistant" || !last.parts.some((p) => p.type === "text" && p.text.length > 0));

  function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || busy) return;
    clearError();
    void sendMessage({ text: trimmed });
  }

  function handleSubmit(msg: PromptInputMessage) {
    send(msg.text);
  }

  function newConversation() {
    void stop();
    setMessages([]);
    clearError();
  }

  return (
    <div className="mx-auto flex h-full max-w-4xl flex-col px-4 pt-4 md:px-8">
      <div className="flex items-center justify-between gap-3 pb-3">
        <div className="flex items-center gap-3">
          <img src={logo} alt="" width={40} height={40} className="size-10 rounded-xl bg-card p-1 shadow-soft" />
          <div>
            <h1 className="text-lg font-semibold leading-tight text-foreground">AI Workplace Chatbot</h1>
            <p className="text-xs text-muted-foreground">Ask Aria anything about your workday</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={newConversation} disabled={messages.length === 0}>
          <MessageSquarePlus /> New conversation
        </Button>
      </div>

      <div className="relative min-h-0 flex-1 overflow-hidden rounded-2xl border bg-card shadow-soft">
        <Conversation className="h-full">
          <ConversationContent className="gap-6 p-4 md:p-6">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center py-8 text-center">
                <img src={logo} alt="" width={72} height={72} className="size-18" />
                <h2 className="mt-3 text-xl font-semibold text-foreground">How can I help you today?</h2>
                <p className="mt-1 max-w-md text-sm text-muted-foreground">
                  Pick a suggestion or ask your own workplace question.
                </p>
                <div className="mt-6 grid w-full max-w-2xl gap-3 sm:grid-cols-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s.text}
                      type="button"
                      onClick={() => send(s.text)}
                      className="lift flex items-center gap-3 rounded-xl border bg-background p-3.5 text-left text-sm text-foreground hover:border-primary/40"
                    >
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                        <s.icon className="size-4" />
                      </span>
                      {s.text}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((m, idx) => {
                const text = m.parts
                  .filter((p) => p.type === "text")
                  .map((p) => p.text)
                  .join("");
                if (m.role === "assistant" && !text) return null;
                const streaming = status === "streaming" && idx === messages.length - 1;
                return (
                  <Message key={m.id} from={m.role}>
                    <MessageContent className="group-[.is-user]:bg-gradient-primary group-[.is-user]:text-primary-foreground group-[.is-user]:rounded-2xl group-[.is-user]:rounded-br-md text-[0.94rem] leading-relaxed">
                      {m.role === "user" ? (
                        <p className="whitespace-pre-wrap">{text}</p>
                      ) : (
                        <MessageResponse isAnimating={streaming}>{text}</MessageResponse>
                      )}
                    </MessageContent>
                    {m.role === "assistant" && !streaming && (
                      <MessageActions>
                        <MessageAction label="Copy" tooltip="Copy" onClick={() => copyToClipboard(text, "Response copied")}>
                          <Copy className="size-3.5" />
                        </MessageAction>
                      </MessageActions>
                    )}
                  </Message>
                );
              })
            )}
            {waiting && (
              <Message from="assistant">
                <MessageContent>
                  <Shimmer className="text-sm">Aria is typing…</Shimmer>
                </MessageContent>
              </Message>
            )}
            {error && !busy && <ErrorNotice message="The last message couldn't be answered. Please try sending it again." />}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>
      </div>

      <div className="py-3">
        <PromptInput onSubmit={handleSubmit} className="rounded-2xl bg-card shadow-card">
          <PromptInputTextarea placeholder="Ask a workplace question…" aria-label="Message" />
          <PromptInputFooter className="justify-end">
            <PromptInputSubmit
              status={status}
              onStop={() => void stop()}
              className="bg-gradient-primary text-primary-foreground hover:brightness-110"
            />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </div>
  );
}
