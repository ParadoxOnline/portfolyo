import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { ToolPage, Panel, Status } from "@/components/tools/ToolKit";
import { buildToolMetadata } from "@/lib/geo";

export const metadata: Metadata = buildToolMetadata(
  "/plugins",
  "Açık Kaynak WordPress Eklentileri & Geliştirici Araçları",
  "WordPress ve Elementor performansı için DOM Optimizer, GEO uyumlu Schema Injector ve LiteSpeed Cache Pre-Warmer modülleri."
);

const planned = [
  {
    name: "DOM Optimizer",
    text: "Elementor şişkinliğini regex seviyesinde budayan hafif filtre eklentisi.",
  },
  {
    name: "Schema Injector",
    text: "Yapay zeka (GEO) uyumlu dinamik JSON-LD mikro veri üreticisi.",
  },
  {
    name: "Cache Pre-Warmer",
    text: "LiteSpeed ve Redis önbelleğini otomatik sıcak tutan CLI crawler.",
  },
];

export default function PluginsPage() {
  return (
    <ToolPage href="/plugins"
      section="Eklentiler"
      title="Eklentiler ve geliştirici araçları"
      lead="Geliştirdiğim açık kaynak WordPress eklentileri, performans kiti modülleri ve CLI betikleri kodlama ve test aşamaları tamamlandıkça bu sayfada ve GitHub üzerinde yayınlanacak."
    >
      <Panel title="Yayınlanmış paket" action={<Status kind="info">Geliştirme ve test aşamasında</Status>}>
        <p className="max-w-[62ch] text-[13px] leading-relaxed text-slate-300">
          Henüz testlerini tamamlamadığım ve üretim kararlılığına ulaştırmadığım hiçbir eklentiyi burada listelemiyorum.
          Hazır olan modüller GPL lisansıyla açık kaynak olarak paylaşılacak.
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
          <a
            href="https://github.com/ParadoxOnline"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded bg-sky-300 px-4 py-2 text-sm font-semibold text-[#04060a] hover:bg-sky-200"
          >
            GitHub profilini takip edin
          </a>
          <Link href="/#contact" className="text-sm text-sky-300 underline-offset-4 hover:underline">
            Özel eklenti veya entegrasyon talebi
          </Link>
        </div>
      </Panel>

      <section className="mt-10" aria-labelledby="planned">
        <h2 id="planned" className="text-sm font-medium text-white">
          Planlanan modül başlıkları
        </h2>
        <p className="mt-1 text-xs text-slate-500">Henüz yayınlanmadı; kapsam değişebilir.</p>
        <ul className="mt-4 divide-y divide-white/10 border-y border-white/10">
          {planned.map((m) => (
            <li key={m.name} className="grid gap-1 py-3.5 sm:grid-cols-[200px_1fr] sm:gap-6">
              <span className="font-mono text-[13px] text-white">{m.name}</span>
              <span className="text-[13px] leading-relaxed text-slate-400">{m.text}</span>
            </li>
          ))}
        </ul>
      </section>
    </ToolPage>
  );
}
