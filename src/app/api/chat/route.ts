import { NextRequest } from "next/server";
import { analyzeSymptomStream, ChatMessage } from "@/lib/gemini";
import { enrichConditions } from "@/lib/icd";
import {
  containsEmergencySymptom,
  sanitizeResponse,
  applyEmergencyOverride,
} from "@/lib/severity";

// Cegah Vercel memotong function sebelum selesai
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      let closed = false;

      const send = (data: object) => {
        if (closed) return;
        controller.enqueue(encoder.encode(JSON.stringify(data) + "\n"));
      };

      const close = () => {
        if (closed) return;
        closed = true;
        controller.close();
      };

      try {
        const body = await req.json();
        const {
          message,
          history,
        }: { message: string; history: ChatMessage[] } = body;

        if (!message?.trim()) {
          send({ type: "error", message: "Message is required" });
          close();
          return;
        }

        // Kirim sinyal awal agar koneksi tidak dianggap idle oleh Vercel
        // selama proses Gemini + ICD enrichment berjalan
        send({ type: "ack" });

        const isEmergency = containsEmergencySymptom(message);

        let response = await analyzeSymptomStream(message, history ?? []);
        response = sanitizeResponse(response);
        response = applyEmergencyOverride(response, isEmergency);

        if (response.conditions && response.conditions.length > 0) {
          response.conditions = await enrichConditions(response.conditions);
        }

        const textToStream =
          response.text?.trim() ||
          "Maaf, saya tidak bisa memproses permintaan itu.";
        const words = textToStream.split(" ");
        for (const word of words) {
          send({ type: "text", chunk: word + " " });
          await new Promise((r) => setTimeout(r, 30));
        }

        send({
          type: "done",
          variant: response.variant,
          question: response.question,
          conditions: response.conditions,
          severity: response.severity,
          advice: response.advice,
          disclaimer: response.disclaimer,
        });
      } catch (error) {
        console.error("[api/chat] Error:", error);
        send({
          type: "done",
          variant: "default",
          text: "Maaf, terjadi gangguan. Silakan coba lagi.",
          conditions: [],
          severity: "ringan",
          advice: "Jika keluhan serius, segera hubungi dokter.",
          disclaimer: "Ini bukan diagnosis medis.",
        });
      } finally {
        close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson",
      "Transfer-Encoding": "chunked",
      "Cache-Control": "no-cache",
      "X-Accel-Buffering": "no",  // Matikan buffering di reverse proxy Vercel
      "Connection": "keep-alive",
    },
  });
}