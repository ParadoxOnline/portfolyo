import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/geo";

export const metadata: Metadata = buildToolMetadata(
  "/image-optimizer",
  "Görsel & WebP Dönüştürme Stüdyosu",
  "Tarayıcı içinde sunucuya dosya göndermeden görselleri WebP formatına dönüştürün ve Core Web Vitals LCP boyut tasarrufunu ölçün."
);

export default function ImageOptimizerLayout({ children }: { children: React.ReactNode }) {
  return children;
}

