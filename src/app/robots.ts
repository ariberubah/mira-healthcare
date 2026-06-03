import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/chat", // jangan index halaman chat
    },
    sitemap: "https://mira-health.vercel.app/sitemap.xml",
  };
}