import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/geo";

export const metadata: Metadata = buildToolMetadata(
  "/ai-radar",
  "AI Bot Erişimi (GEO) ve robots.txt Radarı",
  "GPTBot, ChatGPT-User, PerplexityBot, ClaudeBot ve Google-Extended botlarının robots.txt izin durumunu analiz eden GEO denetim aracı."
);

export default function AiRadarLayout({ children }: { children: React.ReactNode }) {
  return children;
}

