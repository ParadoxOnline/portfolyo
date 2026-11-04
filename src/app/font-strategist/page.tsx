"use client";

import React, { useState } from "react";
import {
  ToolPage,
  Panel,
  UrlForm,
  Metrics,
  Status,
  Findings,
  CodeBlock,
  ErrorNote,
} from "@/components/tools/ToolKit";

interface FontData {
  domain: string;
  totalFonts: number;
  detectedFonts: Array<{
    type: "google_font" | "local_woff2" | "external_font" | "icon_font";
    source: string;
    hasSwap: boolean;
    hasPreload: boolean;
    hasPreconnect: boolean;
  }>;
  findings: { passed: string[]; warnings: string[]; critical: string[] };
  preloadSnippets: string;
}

const typeLabel: Record<FontData["detectedFonts"][number]["type"], string> = {
  google_font: "Google Fonts",
  local_woff2: "Yerel font dosyası",
  external_font: "Harici font",
  icon_font: "İkon fontu",
};

export default function FontStrategistPage() {
  const [urlInput, setUrlInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<FontData | null>(null);

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/tools/font-preload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: urlInput }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Font analizi yapılamadı.");
      setData(json);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Beklenmeyen bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const googleFonts = data?.detectedFonts.filter((f) => f.type === "google_font") ?? [];
  const findings = data
    ? [
        ...data.findings.critical.map((text) => ({ kind: "fail" as const, text })),
        ...data.findings.warnings.map((text) => ({ kind: "warn" as const, text })),
        ...data.findings.passed.map((text) => ({ kind: "ok" as const, text })),
      ]
    : [];

  return (
    <ToolPage href="/font-strategist" tool="font"
      title="Web font yükleme analizi"
      lead="Sayfanın HTML'inde geçen Google Fonts çağrılarını ve .woff2 / .woff / .ttf dosyalarını bulur; preconnect, display=swap ve preload eksiklerini gösterip yapıştırılabilir etiketleri üretir."
    >
      <UrlForm
        label="Sayfa adresi"
        placeholder="ornek.com"
        value={urlInput}
        onChange={setUrlInput}
        onSubmit={handleScan}
        loading={loading}
        submitLabel="Fontları tara"
        loadingLabel="Taranıyor"
      />

      {error && <ErrorNote>{error}</ErrorNote>}

      {data && (
        <div className="mt-8 space-y-6">
          <Metrics
            items={[
              { label: "Font kaynağı", value: data.totalFonts, tone: data.totalFonts > 4 ? "warn" : undefined, sub: data.totalFonts > 4 ? "4'ten fazla kaynak render'ı geciktirebilir" : undefined },
              {
                label: "Google Fonts preconnect",
                value: googleFonts.length === 0 ? "Gerekmiyor" : googleFonts.some((f) => f.hasPreconnect) ? "Var" : "Yok",
                tone: googleFonts.length === 0 ? undefined : googleFonts.some((f) => f.hasPreconnect) ? "ok" : "fail",
              },
              {
                label: "font-display: swap",
                value: googleFonts.length === 0 ? "—" : googleFonts.every((f) => f.hasSwap) ? "Var" : "Eksik",
                tone: googleFonts.length === 0 ? undefined : googleFonts.every((f) => f.hasSwap) ? "ok" : "fail",
                sub: googleFonts.length ? "Yalnızca Google Fonts bağlantıları için kontrol edilir" : undefined,
              },
            ]}
          />

          <Panel title="Bulgular">
            <Findings items={findings} />
          </Panel>

          {data.detectedFonts.length > 0 && (
            <div className="overflow-x-auto rounded-md border border-white/10 bg-[#070b12]">
              <table className="w-full min-w-[560px] text-left text-[13px]">
                <thead>
                  <tr className="border-b border-white/10 text-xs text-slate-500">
                    <th className="px-4 py-2.5 font-medium">Tür</th>
                    <th className="px-4 py-2.5 font-medium">Kaynak</th>
                    <th className="px-4 py-2.5 font-medium">swap</th>
                    <th className="px-4 py-2.5 font-medium">preconnect</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.07]">
                  {data.detectedFonts.map((f, i) => (
                    <tr key={i} className="align-top">
                      <td className="whitespace-nowrap px-4 py-2.5 text-slate-400">{typeLabel[f.type]}</td>
                      <td className="break-all px-4 py-2.5 font-mono text-xs text-slate-200">{f.source}</td>
                      <td className="px-4 py-2.5">
                        <Status kind={f.hasSwap ? "ok" : "fail"}>{f.hasSwap ? "Var" : "Yok"}</Status>
                      </td>
                      <td className="px-4 py-2.5">
                        {f.type === "google_font" ? (
                          <Status kind={f.hasPreconnect ? "ok" : "fail"}>{f.hasPreconnect ? "Var" : "Yok"}</Status>
                        ) : (
                          <span className="text-xs text-zinc-600">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {data.preloadSnippets && (
            <CodeBlock
              language="HTML"
              title="Bu sayfaya uygun etiketler"
              description="<head> içinde, CSS bağlantılarından önce yer almalı."
              code={data.preloadSnippets}
            />
          )}
        </div>
      )}
    </ToolPage>
  );
}
