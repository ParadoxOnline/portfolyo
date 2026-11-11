import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/geo";

export const metadata: Metadata = buildToolMetadata(
  "/insights",
  "GEO, Core Web Vitals & Lokal SEO Vaka Analizleri",
  "Yapay zeka arama motorları (ChatGPT Search, Perplexity), WordPress hız optimizasyonu ve sektörel lokal SEO mimarisi üzerine vaka rehberleri."
);

export default function InsightsLayout({ children }: { children: React.ReactNode }) {
  return children;
}

