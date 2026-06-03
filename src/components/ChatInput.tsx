"use client";
import { useState, KeyboardEvent } from "react";
import { ArrowUp } from "lucide-react";

interface Props {
  onSend: (text: string) => void;
  disabled?: boolean;
}

export default function ChatInput({ onSend, disabled = false }: Props) {
  const [value, setValue] = useState("");

  const handleSend = () => {
    if (!value.trim() || disabled) return;
    onSend(value.trim());
    setValue("");
  };

  const handleKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="px-4 py-3 border-t border-[var(--color-border)] bg-[var(--color-bg)]">
      <div className="flex items-end gap-2 px-4 py-2.5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] focus-within:border-brand-500 transition-colors">
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKey}
          disabled={disabled}
          placeholder="Ceritakan keluhanmu..."
          rows={1}
          className="flex-1 bg-transparent text-sm text-[var(--color-text)] placeholder:text-[var(--color-muted)] resize-none outline-none leading-relaxed max-h-32"
        />
        <button
          onClick={handleSend}
          disabled={!value.trim() || disabled}
          className="w-7 h-7 rounded-full bg-brand-600 flex items-center justify-center disabled:opacity-25 transition-opacity flex-shrink-0"
        >
          <ArrowUp size={14} className="text-white" />
        </button>
      </div>
      <p className="text-center text-xs text-[var(--color-muted)] mt-2">
        Bukan pengganti dokter profesional
      </p>
    </div>
  );
}