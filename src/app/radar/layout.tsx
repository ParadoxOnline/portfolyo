import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/geo";

export const metadata: Metadata = buildToolMetadata(
  "/radar",
  "Web Sitesi Karşılaştırma ve Performans Radarı",
  "Kendi sitenizi ve rakip alan adlarını TTFB, DOM düğüm sayısı, performans skoru ve GEO notu açısından yan yana kıyaslayın."
);

export default function RadarLayout({ children }: { children: React.ReactNode }) {
  return children;
}

