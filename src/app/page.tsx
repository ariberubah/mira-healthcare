import Link from "next/link";
import MiraAvatar from "@/components/MiraAvatar";
import Header from "@/components/Header";
import { MessageCircle, Globe, ShieldCheck } from "lucide-react";

const features = [
  {
    icon: <MessageCircle size={18} />,
    title: "Analisis gejala",
    desc: "Ceritakan keluhanmu secara natural. Mira akan bantu identifikasi kemungkinan kondisinya.",
  },
  {
    icon: <Globe size={18} />,
    title: "Lintas bahasa",
    desc: "Bicara dalam bahasa apapun — termasuk istilah lokal seperti masuk angin atau panas dalam.",
  },
  {
    icon: <ShieldCheck size={18} />,
    title: "Aman & transparan",
    desc: "Tidak memberikan saran obat. Selalu mengarahkan ke dokter jika gejala serius.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex flex-col">
      {/* Nav */}
      <Header/>
      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-16 gap-6">
        <MiraAvatar size={96} />

        <div className="space-y-3 max-w-sm">
          <h1 className="text-3xl font-semibold tracking-tight text-[var(--color-text)]">
            Halo, saya Mira.
          </h1>
          <p className="text-[var(--color-muted)] leading-relaxed">
            Asisten kesehatan digital yang membantu kamu memahami gejala dan menentukan langkah selanjutnya.
          </p>
        </div>

        <Link
          href="/chat"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-600 text-white text-sm font-medium hover:bg-brand-700 transition-colors"
        >
          <MessageCircle size={15} />
          Mulai konsultasi
        </Link>

        <p className="text-xs text-[var(--color-muted)]">
          Gratis · Tidak perlu daftar
        </p>
      </main>

      {/* Features */}
      <section className="px-6 pb-16 max-w-2xl mx-auto w-full">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {features.map((f, i) => (
            <div
              key={i}
              className="p-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] space-y-2"
            >
              <div className="text-brand-600">{f.icon}</div>
              <p className="text-sm font-medium text-[var(--color-text)]">{f.title}</p>
              <p className="text-xs text-[var(--color-muted)] leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center pb-6 text-xs text-[var(--color-muted)]">
        Bukan pengganti dokter profesional · Selalu konsultasikan kondisi serius ke tenaga medis
      </footer>
    </div>
  );
}