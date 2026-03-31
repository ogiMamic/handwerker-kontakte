"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import Link from "next/link";

interface Message {
  readonly role: "user" | "assistant";
  readonly content: string;
}

const INITIAL_MESSAGE: Message = {
  role: "assistant",
  content:
    "Hallo! Ich bin Ihr Handwerker-Assistent. Beschreiben Sie mir Ihr Problem und ich helfe Ihnen gerne \u2014 mit Tipps oder dem passenden Fachmann.",
};

const LINK_REGEX = /\/de\/handwerker\?skill=([a-z]+)/g;

function parseMessageContent(content: string) {
  const parts: Array<{ type: "text"; value: string } | { type: "link"; href: string; skill: string }> = [];
  let lastIndex = 0;

  const matches = [...content.matchAll(LINK_REGEX)];

  for (const match of matches) {
    const matchIndex = match.index ?? 0;

    if (matchIndex > lastIndex) {
      parts.push({ type: "text", value: content.slice(lastIndex, matchIndex) });
    }

    parts.push({
      type: "link",
      href: match[0],
      skill: match[1],
    });

    lastIndex = matchIndex + match[0].length;
  }

  if (lastIndex < content.length) {
    parts.push({ type: "text", value: content.slice(lastIndex) });
  }

  return parts;
}

function MessageBubble({ message }: { readonly message: Message }) {
  const isUser = message.role === "user";
  const parts = isUser ? [{ type: "text" as const, value: message.content }] : parseMessageContent(message.content);

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
          isUser
            ? "bg-[#2563EB] text-white rounded-br-md"
            : "bg-gray-100 text-gray-800 rounded-bl-md"
        }`}
      >
        {parts.map((part, i) =>
          part.type === "text" ? (
            <span key={i} className="whitespace-pre-wrap">
              {part.value}
            </span>
          ) : (
            <Link
              key={i}
              href={part.href}
              className={`inline-block mt-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                isUser
                  ? "bg-white/20 text-white hover:bg-white/30"
                  : "bg-[#2563EB] text-white hover:bg-[#1d4ed8]"
              }`}
            >
              Fachmann finden &rarr;
            </Link>
          )
        )}
      </div>
    </div>
  );
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<readonly Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const handleSend = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMessage: Message = { role: "user", content: trimmed };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages
            .filter((m) => m !== INITIAL_MESSAGE)
            .map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorText =
          errorData?.error ?? "Entschuldigung, ein Fehler ist aufgetreten.";
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: errorText },
        ]);
        setIsLoading(false);
        return;
      }

      const reader = response.body?.getReader();
      if (!reader) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Entschuldigung, ein Fehler ist aufgetreten.",
          },
        ]);
        setIsLoading(false);
        return;
      }

      const decoder = new TextDecoder();
      let assistantContent = "";

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;

          const data = line.slice(6);
          if (data === "[DONE]") break;

          try {
            const parsed = JSON.parse(data);
            if (parsed.text) {
              assistantContent += parsed.text;
              const currentContent = assistantContent;
              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = {
                  role: "assistant",
                  content: currentContent,
                };
                return updated;
              });
            }
          } catch {
            // Skip malformed JSON chunks
          }
        }
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Entschuldigung, ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  return (
    <>
      {/* Chat Panel */}
      <div
        className={`fixed bottom-20 right-4 z-50 w-[calc(100vw-2rem)] sm:w-[380px] h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 origin-bottom-right ${
          isOpen
            ? "scale-100 opacity-100"
            : "scale-95 opacity-0 pointer-events-none"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#2563EB] text-white">
          <div className="flex items-center gap-2">
            <MessageCircle size={18} />
            <span className="font-semibold text-sm">Handwerker-Assistent</span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-full hover:bg-white/20 transition-colors"
            aria-label="Chat schliessen"
          >
            <X size={18} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4">
          {messages.map((msg, i) => (
            <MessageBubble key={i} message={msg} />
          ))}
          {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
            <div className="flex justify-start mb-3">
              <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-2.5 text-sm text-gray-500">
                <span className="inline-flex gap-1">
                  <span className="animate-bounce">.</span>
                  <span className="animate-bounce" style={{ animationDelay: "0.1s" }}>.</span>
                  <span className="animate-bounce" style={{ animationDelay: "0.2s" }}>.</span>
                </span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t p-3">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Nachricht eingeben..."
              disabled={isLoading}
              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent disabled:opacity-50"
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#2563EB] text-white hover:bg-[#1d4ed8] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Nachricht senden"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed bottom-4 right-4 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-[#2563EB] text-white shadow-lg hover:scale-110 transition-transform duration-200"
        aria-label="Chat öffnen"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>
    </>
  );
}
