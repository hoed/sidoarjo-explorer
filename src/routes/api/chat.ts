import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json()) as { messages?: UIMessage[] };
        const messages = body.messages;
        if (!Array.isArray(messages)) return new Response("messages required", { status: 400 });

        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("LOVABLE_API_KEY missing", { status: 500 });

        // Load destinations to ground the guide in real data
        const supabase = createClient<Database>(
          process.env.SUPABASE_URL!,
          process.env.SUPABASE_PUBLISHABLE_KEY!,
          { auth: { storage: undefined, persistSession: false, autoRefreshToken: false } },
        );
        const { data } = await supabase
          .from("destinations")
          .select("slug,name,short_desc,ticket_price,duration_minutes,is_free,is_family_friendly,categories(name)")
          .limit(50);

        const catalog = (data ?? [])
          .map(
            (d: any) =>
              `- ${d.name} (slug: ${d.slug}) — ${d.categories?.name ?? "General"} — ${d.short_desc ?? ""} — ${d.ticket_price ?? "-"} — ~${d.duration_minutes ?? "?"} min — ${d.is_free ? "free" : "paid"}${d.is_family_friendly ? ", family-friendly" : ""}`,
          )
          .join("\n");

        const system = `You are the BPPD Sidoarjo AI Tour Guide — warm, cinematic, concise.
Your job is to help travelers plan a real journey through Sidoarjo Regency, East Java, Indonesia.
Always recommend destinations FROM THIS LIST, referring to them by their exact display Name.
When you propose an itinerary, format it as a numbered list with:
1. **Name** — one poetic sentence + duration.
Ask a friendly follow-up when the user is vague (available time, interests, companions, budget, transport).
Respond in the same language the user writes in (default English). Keep replies under 180 words.

REAL DESTINATIONS:
${catalog}`;

        const gateway = createLovableAiGatewayProvider(key);
        const model = gateway("google/gemini-3-flash-preview");

        const modelMessages = await convertToModelMessages(messages);
        const result = streamText({
          model,
          system,
          messages: modelMessages,
        });

        return result.toUIMessageStreamResponse({ originalMessages: messages });
      },
    },
  },
});
