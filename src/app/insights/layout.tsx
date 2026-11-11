import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/geo";

export const metadata: Metadata = {
  ...buildToolMetadata(
    "/insights",
    "Yazılar ve Teknik Notlar",
    "Teknik notlar ve yazılar bölümü şu anda hazırlanmaktadır."
  ),
  robots: {
    index: false,
    follow: true,
  },
};

export default function InsightsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
