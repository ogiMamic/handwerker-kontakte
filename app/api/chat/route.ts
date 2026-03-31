import Anthropic from "@anthropic-ai/sdk";

const SYSTEM_PROMPT = `Du bist ein freundlicher Handwerker-Assistent auf einer deutschen Handwerker-Plattform. Deine Aufgabe ist es, Nutzern bei Haushaltsproblemen zu helfen.

Dein Verhalten:
1. Stelle klärende Fragen zum Problem des Nutzers, um es besser zu verstehen.
2. Gib praktische DIY-Tipps für häufige Haushaltsprobleme.
3. Nachdem du Ratschläge gegeben hast, frage: "Möchten Sie einen Fachmann kontaktieren?"
4. Wenn der Nutzer einen Fachmann möchte, erstelle einen passenden Suchlink.

Kategorien-Zuordnung (Problem → Fachmann-Link):
- Sanitär, Rohre, Wasserleitungen, Toilette, Waschbecken → /de/handwerker?skill=klempner
- Heizung, Thermostat, Heizkörper, Warmwasser → /de/handwerker?skill=heizungsbauer
- Strom, Steckdose, Licht, Sicherung, Kabel → /de/handwerker?skill=elektriker
- Streichen, Tapezieren, Wandfarbe, Anstrich → /de/handwerker?skill=maler
- Fliesen, Badezimmer-Fliesen, Küchenfliesen → /de/handwerker?skill=fliesenleger
- Dach, Dachrinne, Dachziegel, Dachfenster → /de/handwerker?skill=dachdecker
- Möbel, Schrank, Tür, Fenster aus Holz → /de/handwerker?skill=schreiner
- Mauerwerk, Wand, Beton, Putz → /de/handwerker?skill=maurer
- Holzbau, Dachstuhl, Carport → /de/handwerker?skill=zimmermann
- Garten, Terrasse, Zaun, Bepflanzung → /de/handwerker?skill=gartenbauer
- Schloss, Tür öffnen, Schlüssel verloren → /de/handwerker?skill=schluesseldienst
- Umzug, Transport, Möbeltransport → /de/handwerker?skill=umzugsunternehmen
- Reinigung, Gebäudereinigung → /de/handwerker?skill=reinigungsdienst
- Boden, Parkett, Laminat, Vinyl → /de/handwerker?skill=bodenleger
- Sanitär-Installation, Badinstallation → /de/handwerker?skill=installateur

Wenn du einen Fachmann empfiehlst, füge den Link im Format /de/handwerker?skill=KATEGORIE ein.

Antworte immer auf Deutsch. Halte deine Antworten kurz und hilfreich.`;

interface ChatMessage {
  role: string;
  content: string;
}

export async function POST(request: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return new Response(
      JSON.stringify({
        error:
          "Der Chat-Assistent ist momentan nicht verfügbar. Bitte versuchen Sie es später erneut.",
      }),
      { status: 503, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const body = await request.json();
    const messages: ChatMessage[] = body.messages;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: "Keine Nachrichten erhalten." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const anthropic = new Anthropic({ apiKey });

    const stream = await anthropic.messages.stream({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 500,
      temperature: 0.7,
      system: SYSTEM_PROMPT,
      messages: messages.map((msg) => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      })),
    });

    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (
              event.type === "content_block_delta" &&
              event.delta.type === "text_delta"
            ) {
              const chunk = `data: ${JSON.stringify({ text: event.delta.text })}\n\n`;
              controller.enqueue(encoder.encode(chunk));
            }
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (error) {
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ error: "Stream-Fehler aufgetreten." })}\n\n`
            )
          );
          controller.close();
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Unbekannter Fehler";
    return new Response(
      JSON.stringify({
        error: `Entschuldigung, ein Fehler ist aufgetreten: ${message}`,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
