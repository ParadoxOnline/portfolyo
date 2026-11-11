import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/geo";

export const metadata: Metadata = buildToolMetadata(
  "/audit",
  "Canlı Web Sitesi Hız, SEO & GEO Röntgeni",
  "Herhangi bir web sitesinin gerçek TTFB süresini, DOM yükünü, başlık yapısını ve yapay zeka (GEO) Schema skorunu canlı analiz eden ücretsiz araç."
);

export default function AuditLayout({ children }: { children: React.ReactNode }) {
  return children;
}

