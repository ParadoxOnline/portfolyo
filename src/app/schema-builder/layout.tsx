import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/geo";

export const metadata: Metadata = buildToolMetadata(
  "/schema-builder",
  "GEO Uyumlu Schema.org JSON-LD Üretici",
  "LocalBusiness, Organization, FAQPage ve Article şemaları için canlı doğrulamalı ve yapay zeka aramalarına uyumlu JSON-LD kodu üretin."
);

export default function SchemaBuilderLayout({ children }: { children: React.ReactNode }) {
  return children;
}

