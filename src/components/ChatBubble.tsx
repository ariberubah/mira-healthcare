import { Message } from "@/types/chat";
import DiagnosisCard from "./DiagnosisCard";
import MiraAvatar from "./MiraAvatar";

export default function ChatBubble({ message }: { message: Message }) {
  if (message.variant === "greeting") {
    return (
      <div className="flex flex-col items-center text-center px-6 py-8 gap-3">
        <MiraAvatar size={72} />
        <div>
          <p className="font-semibold text-[var(--color-text)]">
            {message.text}
          </p>
          {message.advice && (
            <p className="text-sm text-[var(--color-muted)] mt-1">
              {message.advice}
            </p>
          )}
        </div>
        <span className="text-xs text-[var(--color-muted)] flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-500 inline-block" />
          Semua bahasa didukung
        </span>
      </div>
    );
  }

  if (message.from === "user") {
    return (
      <div className="flex justify-end px-4">
        <p className="max-w-[75%] text-sm bg-brand-600 text-white px-4 py-2.5 rounded-2xl rounded-br-sm leading-relaxed">
          {message.text}
        </p>
      </div>
    );
  }
  if (message.from === "bot") {
    return (
      <div className="flex items-start gap-2.5 px-4">
        <MiraAvatar size={28} className="mt-1 flex-shrink-0" />
        <div className="max-w-[85%] space-y-2">
          {/* Text */}
          {/* Text */}
          {message.text && (
            <p className="text-sm text-[var(--color-text)] bg-[var(--color-surface)] border border-[var(--color-border)] px-4 py-2.5 rounded-2xl rounded-tl-sm leading-relaxed">
              {message.text}
            </p>
          )}

          {/* Single question */}
          {message.variant === "question" && message.question && (
            <p className="text-sm px-4 py-2.5 rounded-2xl border border-brand-200 bg-brand-50 text-[var(--color-text)] dark:border-brand-700 dark:bg-brand-950">
              {message.question}
            </p>
          )}

          {/* Analysis / Urgent */}
          {(message.variant === "analysis" || message.variant === "urgent") &&
            message.conditions &&
            message.severity &&
            message.advice &&
            message.disclaimer && (
              <DiagnosisCard
                conditions={message.conditions}
                severity={message.severity}
                advice={message.advice}
                disclaimer={message.disclaimer}
              />
            )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-2.5 px-4">
      <MiraAvatar size={28} className="mt-1 flex-shrink-0" />
      <div className="max-w-[85%] space-y-2">
        {message.text && (
          <p className="text-sm text-[var(--color-text)] bg-[var(--color-surface)] border border-[var(--color-border)] px-4 py-2.5 rounded-2xl rounded-tl-sm leading-relaxed">
            {message.text}
          </p>
        )}
        {message.conditions &&
          message.severity &&
          message.advice &&
          message.disclaimer && (
            <DiagnosisCard
              conditions={message.conditions}
              severity={message.severity}
              advice={message.advice}
              disclaimer={message.disclaimer}
            />
          )}
      </div>
    </div>
  );
}
