=======
# MIRA — Medical Intelligence and Responsive Assistant

> A conversational AI health assistant that helps users understand their symptoms and determine the right next step — before seeing a doctor.

**Live Demo → [mira-health.vercel.app](https://mira-health.vercel.app)**

---

## What is MIRA?

MIRA is a health-focused chatbot built around a simple insight: people don't describe symptoms in medical terms. They say *"masuk angin"* or *"panas dalam"* — culturally-specific folk illness concepts that most health tools fail to understand.

MIRA bridges that gap. It conducts a natural, conversational triage — asking one question at a time, adapting based on previous answers — before surfacing possible conditions with ICD-11 codes, severity assessment, and actionable guidance.

It is not a replacement for professional medical care. It is a first step.

---

## Key Features

**Conversational Diagnosis Flow**
Rather than asking for a list of symptoms upfront, MIRA asks one targeted follow-up question per turn, building context progressively — the way a triage nurse would.

**Culturally-Aware NLU**
Understands Indonesian folk health concepts and maps them to clinical terminology. *"Angin duduk"* is correctly flagged as a potential cardiac emergency. *"Masuk angin"* maps to dyspepsia or upper respiratory infection.

**Multilingual by Default**
No language setting required. MIRA detects the user's language from their message and responds accordingly — Indonesian, English, or otherwise.

**Two-Layer Safety System**
1. Keyword-based emergency detection runs *before* the LLM — so serious symptoms like chest pain or difficulty breathing trigger an urgent response regardless of model output
2. A sanitizer strips any medication mentions from the LLM response, enforcing the no-medication-advice rule

**Streaming Response**
Responses stream token by token using the Web Streams API — no waiting for a full response before text appears.

**Nearby Clinic Finder**
When severity is assessed as *berat* (high), a button appears that uses the browser Geolocation API to open Google Maps with nearby clinics and hospitals.

**ICD-11 Enrichment**
Conditions suggested by the LLM are cross-referenced against the WHO ICD-11 API to surface official disease codes and standardized names.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Runtime | Bun |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Animation | Framer Motion |
| LLM | Google Gemini 2.5 Flash |
| Health Data | WHO ICD-11 API |
| Deployment | Vercel |

---

## Architecture

```
User Input
    ↓
Emergency Keyword Check          ← keyword-based, no LLM dependency
    ↓
Gemini (streaming)               ← conversational triage or analysis
    ↓
Response Sanitizer               ← strip medication mentions
    ↓
Emergency Override               ← force severity=berat if needed
    ↓
ICD-11 Enrichment (best-effort)  ← official codes from WHO API
    ↓
Stream to Client (word-by-word)
```

**Key design decisions:**

- Emergency detection is intentionally LLM-independent. The model can hallucinate; a hardcoded keyword check cannot.
- ICD-11 enrichment uses `Promise.allSettled` — if WHO API is down, conditions fall back to Gemini's output without breaking the response.
- `responseMimeType: "application/json"` forces structured output from Gemini, with a markdown-strip fallback for edge cases.
- The conversational flow (one question per turn) is enforced entirely via system prompt + conversation history. No state machine required — Gemini decides when it has enough information to switch from `question` to `analysis` variant.

---

## Running Locally

```bash
# Clone and install
git clone https://github.com/username/mira-health
cd mira-health
bun install

# Set up environment variables
cp .env.example .env.local
# Fill in your keys (see below)

# Start dev server
bun dev
```

### Environment Variables

```env
GEMINI_API_KEY=        # Google AI Studio — aistudio.google.com
ICD_CLIENT_ID=         # WHO ICD API — icd.who.int/icdapi
ICD_CLIENT_SECRET=     # WHO ICD API — icd.who.int/icdapi
```

Both APIs are free with registration. No credit card required.

---

## Limitations

- Diagnostic accuracy depends entirely on Gemini's output quality — there is no clinical validation layer
- ICD-11 API can be slow (1–2s per request), which adds latency on the first analysis response
- Not suitable for actual medical decision-making — this is a portfolio project with a strong disclaimer by design

---

## Author

Built by **ARY AKBAR LANANG SURYA KINASIH**
[GitHub](https://github.com/ariberubah/)

---

*MIRA is not a licensed medical device and does not provide medical advice. Always consult a qualified healthcare professional for medical decisions.*
>>>>>>> d13c67b84a1fcd0f0189d8b57fc225a78c049bd6
