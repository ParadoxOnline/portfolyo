import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/geo";

export const metadata: Metadata = buildToolMetadata(
  "/font-strategist",
  "Font & Preload Stratejisti (FCP / CLS)",
  "Web sitelerinde FOIT ve layout kaymasını önleyen Google Fonts preconnect, preload ve font-display: swap kodlarını üretin."
);

export default function FontStrategistLayout({ children }: { children: React.ReactNode }) {
  return children;
}

