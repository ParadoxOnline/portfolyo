"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ToolPage, Panel, UrlForm, ErrorNote, Status, type StatusKind } from "@/components/tools/ToolKit";

interface RadarEntry {
  id: string;
  domain: string;
  url: string;
  server: string;
  compression: string;
  ttfbMs: number;
  performanceScore: number;
  geoGrade: string;
  domElements: number;
  keyFinding: string;
  scannedAt: string;
}

const perfKind = (s: number): StatusKind => (s >= 85 ? "ok" : s >= 60 ? "warn" : "fail");

export default function RadarPage() {
  const [entries, setEntries] = useState<RadarEntry[]>([]);
  const [domainInput, setDomainInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleScanAndAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domainInput.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: domainInput.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Tarama gerçekleştirilemedi.");
      }

      const newEntry: RadarEntry = {
        id: `${data.domain}-${Date.now()}`,
        domain: data.domain,
        url: data.url,
        server: data.server,
        compression: data.compression,
        ttfbMs: data.ttfbMs,
        performanceScore: data.scores.performance,
        geoGrade: data.scores.geo,
        domElements: data.assets.domElements,
        keyFinding: data.findings.passed[0] || `${data.seo.h1Count} H1 başlığı, ${data.geo.schemaCount} Schema tipi`,
        scannedAt: new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }),
      };

      setEntries((prev) => [newEntry, ...prev]);
      setDomainInput("");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Analiz başarısız oldu.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveEntry = (id: string) => {
    setEntries((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearAll = () => {
    setEntries([]);
  };

  const th = "px-4 py-3 text-xs font-medium text-slate-500";

  return (
    <ToolPage href="/radar" tool="scan"
      section="Radar"
      wide
      title="Web Sitesi Karşılaştırma Radarı"
      lead="Kendi sitenizi veya rakip siteleri ekleyin; gerçek yanıt süresi (TTFB), performans ve yapay zeka (GEO) skorlarını yan yana kıyaslayın."
    >
      <p className="max-w-[72ch] border-l-2 border-white/15 pl-4 text-[13px] leading-relaxed text-slate-400">
        Gizlilik: Ölçtüğünüz sitelerin verileri herhangi bir harici veritabanına kaydedilmez. Yalnızca tarayıcınızın bu
        oturumunda tutulur. İstediğiniz zaman satırı silebilir veya tümünü temizleyebilirsiniz.
      </p>

      <div className="mt-6">
        <UrlForm
          label="Radara yeni site ekle"
          placeholder="ornekalanadi.com veya https://siteniz.com"
          value={domainInput}
          onChange={setDomainInput}
          onSubmit={handleScanAndAdd}
          loading={loading}
          submitLabel="Ölç ve ekle"
          loadingLabel="Ölçülüyor..."
        />
        {error && <ErrorNote>{error}</ErrorNote>}
      </div>

      <div className="mt-8">
        <Panel
          title="Karşılaştırma tablosu"
          note={entries.length > 0 ? `${entries.length} site` : undefined}
          flush
          action={
            entries.length > 0 ? (
              <button
                type="button"
                onClick={handleClearAll}
                className="text-xs font-medium text-rose-300 hover:text-rose-200 focus:outline-none focus-visible:underline"
              >
                Tümünü Sil
              </button>
            ) : undefined
          }
        >
          {entries.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[820px] text-left text-[13px]">
                <caption className="sr-only">Ölçülen sitelerin karşılaştırması</caption>
                <thead className="border-b border-white/10">
                  <tr>
                    <th scope="col" className={th}>Alan adı</th>
                    <th scope="col" className={th}>Sunucu</th>
                    <th scope="col" className={`${th} text-right`}>TTFB</th>
                    <th scope="col" className={`${th} text-right`}>Performans</th>
                    <th scope="col" className={th}>GEO</th>
                    <th scope="col" className={`${th} text-right`}>DOM düğümü</th>
                    <th scope="col" className={th}>Önemli bulgu</th>
                    <th scope="col" className={`${th} text-right`}>
                      <span className="sr-only">İşlem</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.07]">
                  {entries.map((item) => (
                    <tr key={item.id} className="align-top">
                      <td className="px-4 py-3">
                        <div className="font-mono text-white">{item.domain}</div>
                        <div className="font-mono text-[11px] tabular-nums text-zinc-500">{item.scannedAt}</div>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-slate-300">
                        <div>{item.server}</div>
                        <div className="text-zinc-500">{item.compression}</div>
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums">
                        <Status kind={item.ttfbMs < 400 ? "ok" : "warn"}>{item.ttfbMs} ms</Status>
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums">
                        <Status kind={perfKind(item.performanceScore)}>{item.performanceScore}</Status>
                      </td>
                      <td className="px-4 py-3 font-mono text-slate-200">{item.geoGrade}</td>
                      <td className="px-4 py-3 text-right tabular-nums text-slate-300">{item.domElements}</td>
                      <td className="max-w-[260px] px-4 py-3 text-slate-300">{item.keyFinding}</td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => handleRemoveEntry(item.id)}
                          aria-label={`${item.domain} satırını sil`}
                          className="text-xs font-medium text-rose-300 hover:text-rose-200 focus:outline-none focus-visible:underline"
                        >
                          Sil
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="px-5 py-10">
              <h3 className="text-sm font-medium text-white">Tabloda henüz bir web sitesi yok</h3>
              <p className="mt-2 max-w-[60ch] text-[13px] leading-relaxed text-slate-400">
                Yukarıdaki alana ölçmek istediğiniz sitenin adresini yazın. Canlı bir sunucu isteğiyle gerçek TTFB,
                sıkıştırma ve GEO puanı tabloya eklenir. İşiniz bittiğinde silebilirsiniz.
              </p>
            </div>
          )}
        </Panel>
      </div>

      <p className="mt-6 text-[13px] text-slate-500">
        Tek bir site için ayrıntılı rapor:{" "}
        <Link href="/audit" className="text-sky-300 underline-offset-4 hover:underline">
          Bireysel Röntgen sayfası
        </Link>
      </p>
    </ToolPage>
  );
}
