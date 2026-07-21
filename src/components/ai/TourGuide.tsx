import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Send, Sparkles, X } from "lucide-react";
import type { DestinationDTO } from "@/lib/destinations.functions";

type Msg = { id: string; role: "user" | "assistant"; content: string };

// Minimal AI SDK UI-message shape we send to /api/chat.
type UiMessagePart = { type: "text"; text: string };
type UiMessage = { id: string; role: "user" | "assistant"; parts: UiMessagePart[] };

export function TourGuide({
  destinations,
  onFocusSlug,
}: {
  destinations: DestinationDTO[];
  onFocusSlug: (slug: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Selamat datang. I am your AI guide to Sidoarjo. Tell me how much time you have, what you love, who's with you — and I'll design a journey. Try: *I have 5 hours, I love history, bringing children.*",
    },
  ]);
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

  // After each assistant message, scan for destination names and focus the map on the first mentioned.
  useEffect(() => {
    const last = messages[messages.length - 1];
    if (!last || last.role !== "assistant") return;
    for (const d of destinations) {
      if (last.content.includes(d.name)) {
        onFocusSlug(d.slug);
        return;
      }
    }
  }, [messages, destinations, onFocusSlug]);

  const send = async () => {
    const text = input.trim();
    if (!text || busy) return;
    const userMsg: Msg = { id: crypto.randomUUID(), role: "user", content: text };
    const nextHistory = [...messages, userMsg];
    setMessages(nextHistory);
    setInput("");
    setBusy(true);

    const uiMessages: UiMessage[] = nextHistory.map((m) => ({
      id: m.id,
      role: m.role,
      parts: [{ type: "text", text: m.content }],
    }));

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: uiMessages }),
      });
      if (!res.ok || !res.body) throw new Error(await res.text().catch(() => "Chat failed"));

      const assistantId = crypto.randomUUID();
      setMessages((m) => [...m, { id: assistantId, role: "assistant", content: "" }]);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let assembled = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith("data:")) continue;
          const payload = trimmed.slice(5).trim();
          if (!payload || payload === "[DONE]") continue;
          try {
            const evt = JSON.parse(payload);
            if (evt.type === "text-delta" && typeof evt.delta === "string") {
              assembled += evt.delta;
              setMessages((m) => m.map((x) => (x.id === assistantId ? { ...x, content: assembled } : x)));
            }
          } catch {
            /* ignore non-JSON keep-alives */
          }
        }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong.";
      setMessages((m) => [...m, { id: crypto.randomUUID(), role: "assistant", content: `⚠️ ${message}` }]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        className="glass-strong fixed bottom-6 right-6 z-[600] flex items-center gap-2 rounded-full border border-primary/40 px-4 py-3 text-xs uppercase tracking-widest text-primary shadow-[0_10px_40px_-10px_hsl(var(--primary)/0.6)] transition hover:scale-[1.03]"
        aria-label="Open AI Tour Guide"
        data-magnetic
      >
        {open ? <X className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
        <span className="hidden sm:inline">{open ? "Close" : "AI Tour Guide"}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            className="fixed bottom-24 right-6 z-[600] flex h-[70vh] w-[min(420px,calc(100%-3rem))] flex-col overflow-hidden rounded-3xl border border-foreground/10 glass-strong"
          >
            <div className="flex items-center gap-3 border-b border-foreground/10 px-5 py-4">
              <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-primary to-accent">
                <MessageCircle className="h-4 w-4 text-background" />
              </div>
              <div>
                <div className="text-sm font-medium">Sidoarjo AI Guide</div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  Powered by Lovable AI
                </div>
              </div>
            </div>

            <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
              {messages.map((m) =>
                m.role === "assistant" ? (
                  <div key={m.id} className="max-w-[85%] whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                    {m.content || <span className="text-muted-foreground">Thinking…</span>}
                  </div>
                ) : (
                  <div key={m.id} className="ml-auto max-w-[85%] rounded-2xl bg-primary px-4 py-2 text-sm text-background">
                    {m.content}
                  </div>
                ),
              )}
              {busy && <div className="text-xs uppercase tracking-widest text-muted-foreground">Thinking…</div>}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                void send();
              }}
              className="flex items-center gap-2 border-t border-foreground/10 px-4 py-3"
            >
              <input
                autoFocus
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="I have 6 hours, love culinary…"
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                disabled={busy}
              />
              <button
                type="submit"
                disabled={busy || !input.trim()}
                aria-label="Send"
                className="grid h-9 w-9 place-items-center rounded-full bg-primary text-background disabled:opacity-40"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
