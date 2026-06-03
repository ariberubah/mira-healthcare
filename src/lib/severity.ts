import { GeminiResponse } from "./gemini";

// ─── KEYWORD LISTS ────────────────────────────────────────────
const EMERGENCY_KEYWORDS = [
  // Bahasa Indonesia
  "sesak napas", "susah napas", "ga bisa napas", "gak bisa napas", "nggak bisa napas",
  "nyeri dada", "sakit dada", "dada nyeri", "dada sakit", "dada terasa berat",
  "pingsan", "tidak sadarkan diri", "ga sadar", "gak sadar",
  "kejang",
  "muntah darah", "batuk darah", "berak darah", "kencing darah", "buang air darah",
  "lumpuh", "tangan lumpuh", "kaki lumpuh",
  "pelo", "bicara pelo", "ngomong pelo",
  "wajah mencong", "mulut mencong",
  "kepala sakit parah", "sakit kepala mendadak", "sakit kepala tiba-tiba",
  "leher kaku",
  "angin duduk",
  // English
  "chest pain", "chest tightness", "can't breathe", "difficulty breathing",
  "shortness of breath", "unconscious", "passed out", "fainting",
  "seizure", "vomiting blood", "coughing blood", "blood in urine", "blood in stool",
  "paralysis", "can't move", "face drooping", "sudden severe headache",
  "stiff neck", "stroke",
];

const MEDICATION_KEYWORDS = [
  "paracetamol", "parasetamol", "ibuprofen", "aspirin",
  "amoxicillin", "amoksisilin", "antibiotik", "antibiotic",
  "antasida", "antacid", "omeprazole", "omeprazol",
  "obat", "minum obat", "konsumsi obat",
  "tablet", "kapsul", "sirup", "salep", "tetes",
  "resep", "dosis", "dosage", " mg", " ml",
];

// ─── HELPERS ──────────────────────────────────────────────────
export function containsEmergencySymptom(text: string): boolean {
  const lower = text.toLowerCase();
  return EMERGENCY_KEYWORDS.some((kw) => lower.includes(kw));
}

function containsMedicationAdvice(text: string): boolean {
  const lower = text.toLowerCase();
  return MEDICATION_KEYWORDS.some((kw) => lower.includes(kw));
}

// ─── SANITIZER ────────────────────────────────────────────────
export function sanitizeResponse(response: GeminiResponse): GeminiResponse {
  // Kalau variant questions, skip sanitize advice
  if (response.variant === "question") return response;

  const combinedText = `${response.text ?? ""} ${response.advice ?? ""}`;
  const hasMedicationMention = containsMedicationAdvice(combinedText);

  return {
    ...response,
    advice: hasMedicationMention
      ? "Istirahat yang cukup dan perbanyak minum air putih. Konsultasikan dengan dokter untuk penanganan lebih lanjut."
      : response.advice,
    disclaimer:
      response.disclaimer?.trim() ||
      "Ini bukan diagnosis medis. Selalu konsultasikan dengan tenaga kesehatan profesional.",
    conditions: response.conditions ?? [],
  };
}

// ─── OVERRIDE ─────────────────────────────────────────────────
// Dipanggil setelah sanitize — kalau emergency keyword terdeteksi
// di input user, kita paksa severity ke berat meskipun Gemini bilang ringan
export function applyEmergencyOverride(
  response: GeminiResponse,
  isEmergency: boolean
): GeminiResponse {
  if (!isEmergency) return response;

  return {
    ...response,
    variant: "urgent",
    severity: "berat",
    advice:
      response.severity === "berat"
        ? response.advice // sudah bener dari Gemini, pakai apa adanya
        : "Segera hubungi 119 atau minta seseorang mengantar ke IGD/UGD terdekat. Jangan mengemudi sendiri.",
  };
}