"use client";

import { useState, useRef, useEffect } from "react";
import { Message } from "@/types/chat";
import ChatBubble from "@/components/ChatBubble";
import ChatInput from "@/components/ChatInput";
import MiraAvatar from "@/components/MiraAvatar";
import Header from "@/components/Header";

const INITIAL_MESSAGES: Message[] = [
  {
    id: "1",
    from: "bot",
    variant: "greeting",
    text: "Halo! Aku Mira.",
    advice:
      "Ceritakan keluhanmu — dalam bahasa apapun. Saya di sini untuk membantu. 🤍",
    timestamp: new Date(),
  },
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [scanning, setScanning] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (text: string) => {
    const userMsg: Message = {
      id: Date.now().toString(),
      from: "user",
      text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setScanning(true);

    // Siapkan bot message kosong dulu
    const botId = (Date.now() + 1).toString();
    const emptyBotMsg: Message = {
      id: botId,
      from: "bot",
      variant: "default",
      text: "",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, emptyBotMsg]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: messages.map((m) => ({ from: m.from, text: m.text })),
        }),
      });

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let accText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // Satu chunk bisa berisi beberapa baris JSON
        const lines = decoder
          .decode(value, { stream: true })
          .split("\n")
          .filter(Boolean);

        for (const line of lines) {
          try {
            const data = JSON.parse(line);

            if (data.type === "text") {
              // Scanning selesai saat teks pertama datang
              setScanning(false);
              accText += data.chunk;

              setMessages((prev) =>
                prev.map((m) => (m.id === botId ? { ...m, text: accText } : m)),
              );
            } else if (data.type === "done") {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === botId
                    ? {
                        ...m,
                        variant: data.variant,
                        questions: data.question, // ← tambah ini
                        conditions: data.conditions,
                        severity: data.severity,
                        advice: data.advice,
                        disclaimer: data.disclaimer,
                      }
                    : m,
                ),
              );
            } else if (data.type === "error") {
              setScanning(false);
            }
          } catch {
            // Skip baris yang tidak valid JSON
          }
        }
      }
    } catch (error) {
      console.error(error);
      setScanning(false);
    } finally {
      setScanning(false);
    }
  };
  return (
    <div className="flex flex-col h-screen bg-[var(--color-bg)]">
      {/* Header */}
      <Header scanning={scanning} />

      {/* Messages */}
      <main className="flex-1 overflow-y-auto py-4 space-y-3 bg-[var(--color-bg)]">
        {messages.map((msg) => (
          <ChatBubble key={msg.id} message={msg} />
        ))}

        {scanning && (
          <div className="flex items-center gap-2 px-4">
            <MiraAvatar size={32} scanning={true} className="flex-shrink-0" />
            <div className="bg-[var(--color-surface)] rounded-3xl rounded-tl-md px-4 py-3 border border-[var(--color-border)]">
              <div className="flex gap-1">
                {[0, 0.2, 0.4].map((delay, i) => (
                  <div
                    key={i}
                    className="w-1.5 h-1.5 bg-brand-600 rounded-full animate-bounce"
                    style={{ animationDelay: `${delay}s` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </main>

      {/* Input */}
      <ChatInput onSend={handleSend} disabled={scanning} />
    </div>
  );
}
