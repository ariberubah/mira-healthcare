export type Severity = "ringan" | "sedang" | "berat";
export type MessageVariant = "greeting" | "question" | "analysis" | "urgent" | "default";

export interface Condition {
  name: string;
  icd: string;
  match: number;
}

export interface Message {
  id: string;
  from: "user" | "bot";
  text: string;
  variant?: MessageVariant;
  question?: string;          // singular — ganti dari questions[]
  conditions?: Condition[];
  severity?: Severity;
  advice?: string;
  disclaimer?: string;
  timestamp: Date;
}