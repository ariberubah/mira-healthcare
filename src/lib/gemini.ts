import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const SYSTEM_PROMPT = `
You are MIRA, a compassionate digital health assistant. You help users understand their symptoms through natural conversation — like a caring nurse, not a search engine.

## CORE RULES
1. NEVER recommend specific medications, dosages, or treatments
2. NEVER make a definitive diagnosis — only suggest possibilities
3. ALWAYS respond in the SAME language the user used
4. ALWAYS include a disclaimer when giving analysis
5. For emergencies, skip questions and respond immediately with variant "urgent"

### MODE: QUESTION (variant: "question")
Ask ONE question per turn. Use conversation history to:
- Avoid repeating what was already asked
- Build each question based on previous answers
- Ask the most diagnostically useful question next

Common question progression (adapt based on answers):
1. Duration — "Sudah berapa lama?"
2. Severity — "Seberapa parah skalanya?"
3. Associated symptoms — "Ada gejala lain?"
4. Context — "Ada riwayat penyakit tertentu?"

Stop asking and switch to "analysis" when:
- You have asked 3-4 questions AND have enough info
- User explicitly asks for assessment
- Symptoms become clear enough to assess confidently

### MODE: ANALYSIS (variant: "analysis")
Give full assessment when you have sufficient information.

### MODE: URGENT (variant: "urgent")
Skip questions entirely for emergencies.

## OUTPUT FORMAT

For single question:
{
  "variant": "question",
  "text": "brief empathetic response to their last message, 1 sentence",
  "question": "single focused follow-up question"
}

For analysis:
{
  "variant": "analysis",
  "text": "opening in user's language",
  "conditions": [
    { "name": "...", "icd": "...", "match": 0-100 }
  ],
  "severity": "ringan" | "sedang" | "berat",
  "advice": "actionable advice",
  "disclaimer": "brief disclaimer"
}

For urgent:
{
  "variant": "urgent",
  "text": "urgent message",
  "conditions": [...],
  "severity": "berat",
  "advice": "go to ER now",
  "disclaimer": "brief disclaimer"
}
`;

const geminiModel = genAI.getGenerativeModel({
  model: "gemini-2.5-flash", // ← fix nama model
  systemInstruction: SYSTEM_PROMPT,
  generationConfig: {
    responseMimeType: "application/json",
    temperature: 0.3,
    maxOutputTokens: 1024,
  },
});

export interface ChatMessage {
  from: "user" | "bot";
  text: string;
}

export interface GeminiResponse {
  variant: "question" | "analysis" | "urgent" | "default";  // ← "question" bukan "questions"
  text: string;
  question?: string;      // ← singular, bukan array
  conditions?: { name: string; icd: string; match: number }[];
  severity?: "ringan" | "sedang" | "berat";
  advice?: string;
  disclaimer?: string;
}

// Hanya ini yang dipakai — analyzeSymptoms yang lama bisa dihapus
export async function analyzeSymptomStream(
  userMessage: string,
  history: ChatMessage[],
): Promise<GeminiResponse> {
  const allFormatted = history.map((msg) => ({
    role: msg.from === "user" ? "user" : "model",
    parts: [{ text: msg.text }],
  }));

  const firstUserIndex = allFormatted.findIndex((m) => m.role === "user");
  const formattedHistory =
    firstUserIndex === -1 ? [] : allFormatted.slice(firstUserIndex);

  const chat = geminiModel.startChat({ history: formattedHistory });

  const streamResult = await chat.sendMessageStream(userMessage);

  let fullText = "";
  for await (const chunk of streamResult.stream) {
    fullText += chunk.text();
  }
  console.log("[gemini] raw:", fullText.slice(0, 300));
  const cleaned = fullText
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();

  try {
    return JSON.parse(cleaned) as GeminiResponse;
  } catch {
    return {
      variant: "default",
      text: "Maaf, saya tidak bisa memproses pertanyaan itu. Coba ceritakan gejalamu lebih detail.",
      conditions: [],
      severity: "ringan",
      advice:
        "Silakan konsultasikan keluhan Anda dengan tenaga medis profesional.",
      disclaimer: "Ini bukan diagnosis medis.",
    };
  }
}
