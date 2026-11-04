"use client";

import React, { useState } from "react";
import {
  ToolPage,
  Panel,
  UrlForm,
  Metrics,
  Status,
  CodeBlock,
  Tabs,
  ErrorNote,
  type StatusKind,
} from "@/components/tools/ToolKit";

interface BotResult {
  name: string;
  userAgent: string;
  category: "search" | "ai_crawl" | "ai_user" | "data_mining";
  description: string;
  status: "allowed" | "blocked" | "partial" | "not_specified";
  details: string;
}

interface RadarData {
  domain: string;
  robotsUrl: string;
  hasRobots: boolean;
  statusCode: number;
  rawContent: string;
  geoScore: number;
  botResults: BotResult[];
  recommendedRobotsTxt: string;
}

const categoryLabel: Record<BotResult["category"], string> = {
  ai_crawl: "Model eğitimi",
  ai_user: "Canlı yanıt / alıntı",
  data_mining: "Açık veri seti",
  search: "Arama dizini",
};

const statusMap: Record<BotResult["status"], { kind: StatusKind; label: string }> = {
  allowed: { kind: "ok", label: "İzinli" },
  partial: { kind: "warn", label: "Kısmi" },
  blocked: { kind: "fail", label: "Engelli" },
  not_specified: { kind: "info", label: "Tanımsız" },
};

export default function AiRadarPage() {
  const [urlInput, setUrlInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<RadarData | null>(null);
  const [tab, setTab] = useState<"bots" | "recipe" | "raw">("bots");

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/tools/robots-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: urlInput }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Tarama başarısız oldu.");
      setData(json);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Beklenmeyen bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const count = (s: BotResult["status"]) => data?.botResults.filter((b) => b.status === s).length ?? 0;
  const scoreTone: StatusKind = !data ? "info" : data.geoScore >= 80 ? "ok" : data.geoScore >= 50 ? "warn" : "fail";

  return (
    <ToolPage href="/ai-radar" tool="radar"
      title="AI bot erişimi ve robots.txt"
      lead="Sitenin robots.txt dosyasını okur ve ChatGPT, Perplexity, Claude, Gemini gibi yapay zeka tarayıcılarının hangi yollara girebildiğini kural kural çıkarır."
    >
      <UrlForm
        label="Site adresi"
        placeholder="ornek.com"
        value={urlInput}
        onChange={setUrlInput}
        onSubmit={handleScan}
        loading={loading}
        submitLabel="robots.txt'i oku"
        loadingLabel="Okunuyor"
      />

      {error && <ErrorNote>{error}</ErrorNote>}

      {data && (
        <div className="mt-8 space-y-6">
          <Metrics
            items={[
              {
                label: "AI botlarına açıklık",
                value: `${data.geoScore}%`,
                tone: scoreTone,
                sub: "AI kategorisindeki botlardan erişebilenlerin oranı",
              },
              {
                label: "robots.txt",
                value: data.hasRobots ? `HTTP ${data.statusCode}` : "Yok",
                tone: data.hasRobots ? "ok" : "warn",
                sub: data.hasRobots ? data.robotsUrl : "Dosya yoksa tüm botlar varsayılan olarak serbesttir",
              },
              { label: "İzinli", value: count("allowed"), tone: "ok" },
              { label: "Kısmi", value: count("partial"), tone: count("partial") ? "warn" : undefined },
              { label: "Engelli", value: count("blocked"), tone: count("blocked") ? "fail" : undefined },
            ]}
          />

          <Tabs
            value={tab}
            onChange={setTab}
            tabs={[
              { id: "bots", label: `Botlar (${data.botResults.length})` },
              { id: "recipe", label: "Önerilen robots.txt" },
              { id: "raw", label: "Mevcut dosya" },
            ]}
          />

          {tab === "bots" && (
            <div className="overflow-x-auto rounded-md border border-white/10 bg-[#070b12]">
              <table className="w-full min-w-[640px] text-left text-[13px]">
                <thead>
                  <tr className="border-b border-white/10 text-xs text-slate-500">
                    <th className="px-4 py-2.5 font-medium">Bot</th>
                    <th className="px-4 py-2.5 font-medium">Amaç</th>
                    <th className="px-4 py-2.5 font-medium">Durum</th>
                    <th className="px-4 py-2.5 font-medium">Dosyadaki karşılığı</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.07]">
                  {data.botResults.map((b) => {
                    const s = statusMap[b.status];
                    return (
                      <tr key={b.userAgent} className="align-top">
                        <td className="px-4 py-3">
                          <div className="font-medium text-white">{b.name}</div>
                          <div className="mt-0.5 max-w-[34ch] text-xs leading-snug text-slate-500">{b.description}</div>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-slate-400">{categoryLabel[b.category]}</td>
                        <td className="whitespace-nowrap px-4 py-3">
                          <Status kind={s.kind}>{s.label}</Status>
                        </td>
                        <td className="px-4 py-3 text-xs leading-relaxed text-slate-400">{b.details}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {tab === "recipe" && (
            <CodeBlock
              language="robots.txt"
              title="Yapay zeka erişimine açık örnek dosya"
              description="Yönetim yollarını kapalı tutar, AI botlarına açıkça izin verir. Kendi gizli dizinlerinize göre düzenleyin."
              code={data.recommendedRobotsTxt}
            />
          )}

          {tab === "raw" && (
            <Panel title="Sitenin yayındaki robots.txt dosyası" note={data.robotsUrl}>
              <pre className="overflow-x-auto font-mono text-xs leading-relaxed text-slate-300">
                {data.rawContent || "Dosya boş veya alınamadı."}
              </pre>
            </Panel>
          )}
        </div>
      )}
    </ToolPage>
  );
}
