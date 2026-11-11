import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/geo";

export const metadata: Metadata = buildToolMetadata(
  "/dns-inspector",
  "Canlı DNS, SPF, DMARC & E-Posta İtibarı Denetleyicisi",
  "Alan adlarının MX, SPF ve DMARC kayıtlarını canlı DNS üzerinden sorgulayıp e-posta güvenliği ve spam korumasını denetleyin."
);

export default function DnsInspectorLayout({ children }: { children: React.ReactNode }) {
  return children;
}

