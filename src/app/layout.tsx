import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const geistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://mira-health.vercel.app"), // ganti dengan domain kamu

  title: {
    default: "MIRA — Asisten Kesehatan Digital",
    template: "%s | MIRA",
  },
  description:
    "MIRA membantu kamu memahami gejala dan menentukan langkah medis selanjutnya. Didukung AI, mendukung semua bahasa termasuk istilah lokal seperti masuk angin dan panas dalam.",

  keywords: [
    "asisten kesehatan",
    "health assistant",
    "cek gejala",
    "symptom checker",
    "masuk angin",
    "diagnosa awal",
    "kesehatan digital",
    "AI kesehatan",
  ],

  authors: [{ name: "nama kamu", url: "https://portofolio-kamu.com" }],
  creator: "nama kamu",

  // Open Graph — untuk preview saat dibagikan di WhatsApp, LinkedIn, dll
  openGraph: {
    type: "website",
    locale: "id_ID",
    alternateLocale: "en_US",
    url: "https://mira-health.vercel.app",
    siteName: "MIRA Health",
    title: "MIRA — Asisten Kesehatan Digital",
    description:
      "Ceritakan keluhanmu, MIRA bantu identifikasi kemungkinan kondisinya. Gratis, tanpa daftar, mendukung semua bahasa.",
    images: [
      {
        url: "/og-image.png", // buat gambar 1200x630px
        width: 1200,
        height: 630,
        alt: "MIRA Health Assistant",
      },
    ],
  },

  // Twitter / X Card
  twitter: {
    card: "summary_large_image",
    title: "MIRA — Asisten Kesehatan Digital",
    description:
      "Ceritakan keluhanmu, MIRA bantu identifikasi kemungkinan kondisinya.",
    images: ["/og-image.png"],
    creator: "@username_kamu",
  },

  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },

  // Canonical
  alternates: {
    canonical: "https://mira-health.vercel.app",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
