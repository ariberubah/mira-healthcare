"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import MiraAvatar from "./MiraAvatar";
import ThemeToggle from "./ThemeToggle";

interface HeaderProps {
  scanning?: boolean;
}

export default function Header({ scanning = false }: HeaderProps) {
  const pathname = usePathname();
  const isChat = pathname === "/chat";

  return (
    <header className="flex items-center gap-3 px-5 py-3.5 border-b border-[var(--color-border)] bg-[var(--color-bg)]">
      <Link href="/">
        <MiraAvatar size={36} scanning={scanning} />
      </Link>

      <div className="flex-1">
        <h1 className="text-sm font-semibold text-[var(--color-text)]">Mira</h1>
        <p className="text-xs text-[var(--color-muted)]">
          {isChat && scanning ? "Menganalisis gejala..." : "Health Assistant"}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />
        {isChat && (
          <div className={`w-2 h-2 rounded-full ${scanning ? "bg-red-500 animate-pulse" : "bg-brand-500"}`} />
        )}
      </div>
    </header>
  );
}