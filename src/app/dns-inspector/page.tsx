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
  type StatusKind,
} from "@/components/tools/ToolKit";

interface DnsData {
  domain: string;
  aRecords: string[];
  aaaaRecords: string[];
  mxRecords: Array<{ exchange: string; priority: number }>;
  txtRecords: string[];
  nsRecords: string[];
  spf: { raw: string | null; valid: boolean; mechanism: string; explanation: string };
  dmarc: { raw: string | null; valid: boolean; policy: string; explanation: string };
  securityScore: number;
  findings: { passed: string[]; warnings: string[]; critical: string[] };
  recommendedSpf: string;
  recommendedDmarc: string;
}

export default function DnsInspectorPage() {
  const [domainInput, setDomainInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<DnsData | null>(null);

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domainInput.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/tools/dns-security", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: domainInput }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "DNS sorgulanamadı.");
      setData(json);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Beklenmeyen bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const dmarcStrong = data?.dmarc.policy === "reject" || data?.dmarc.policy === "quarantine";
  const scoreTone: StatusKind = !data ? "info" : data.securityScore >= 80 ? "ok" : data.securityScore >= 50 ? "warn" : "fail";

  const findings = data
    ? [
        ...data.findings.critical.map((text) => ({ kind: "fail" as const, text })),
        ...data.findings.warnings.map((text) => ({ kind: "warn" as const, text })),
        ...data.findings.passed.map((text) => ({ kind: "ok" as const, text })),
      ]
    : [];

  return (
    <ToolPage href="/dns-inspector" tool="dns"
      title="DNS ve e-posta kimlik doğrulama"
      lead="Alan adının A, AAAA, MX, NS ve TXT kayıtlarını ad sunucularından sorgular; SPF ile DMARC ayarlarını yorumlar. Eksik kayıt varsa DNS paneline eklenecek değeri verir."
    >
      <UrlForm
        label="Alan adı"
        placeholder="sirketim.com"
        value={domainInput}
        onChange={setDomainInput}
        onSubmit={handleScan}
        loading={loading}
        submitLabel="Kayıtları sorgula"
        loadingLabel="Sorgulanıyor"
      />

      {error && <ErrorNote>{error}</ErrorNote>}

      {data && (
        <div className="mt-8 space-y-6">
          <Metrics
            items={[
              { label: "Kimlik doğrulama puanı", value: `${data.securityScore}/100`, tone: scoreTone },
              {
                label: "SPF",
                value: data.spf.valid ? data.spf.mechanism : "Yok",
                tone: data.spf.valid ? (data.spf.mechanism.startsWith("Neutral") ? "warn" : "ok") : "fail",
                sub: data.spf.explanation,
              },
              {
                label: "DMARC",
                value: data.dmarc.valid ? `p=${data.dmarc.policy}` : "Yok",
                tone: !data.dmarc.valid ? "fail" : dmarcStrong ? "ok" : "warn",
                sub: data.dmarc.explanation,
              },
            ]}
          />

          <Panel title="Bulgular" note="Önem sırasına göre">
            <Findings items={findings} />
          </Panel>

          <Panel title={`Kayıtlar — ${data.domain}`} flush>
            <dl className="divide-y divide-white/[0.07] text-[13px]">
              <Row label="A (IPv4)">
                {data.aRecords.length ? data.aRecords.map((v) => <Mono key={v}>{v}</Mono>) : <Status kind="fail">Kayıt yok</Status>}
              </Row>
              <Row label="AAAA (IPv6)">
                {data.aaaaRecords.length ? data.aaaaRecords.map((v) => <Mono key={v}>{v}</Mono>) : <Status kind="warn">Kayıt yok</Status>}
              </Row>
              <Row label="MX">
                {data.mxRecords.length ? (
                  data.mxRecords.map((m) => (
                    <Mono key={m.exchange}>
                      {m.priority} {m.exchange}
                    </Mono>
                  ))
                ) : (
                  <Status kind="warn">Kayıt yok — bu alan adı e-posta alamaz</Status>
                )}
              </Row>
              <Row label="NS">
                {data.nsRecords.length ? data.nsRecords.map((v) => <Mono key={v}>{v}</Mono>) : <Status kind="info">Alınamadı</Status>}
              </Row>
              <Row label="SPF">{data.spf.raw ? <Mono>{data.spf.raw}</Mono> : <Status kind="fail">Kayıt yok</Status>}</Row>
              <Row label="DMARC">{data.dmarc.raw ? <Mono>{data.dmarc.raw}</Mono> : <Status kind="fail">Kayıt yok</Status>}</Row>
            </dl>
          </Panel>

          {(!data.spf.valid || !data.dmarc.valid || data.dmarc.policy === "none") && (
            <section>
              <h2 className="text-sm font-medium text-white">Eklenmesi gereken TXT kayıtları</h2>
              <p className="mt-1 max-w-[62ch] text-xs leading-relaxed text-slate-500">
                SPF değerindeki <span className="font-mono">include</span> kısmı Google Workspace içindir. Başka bir e-posta
                sağlayıcısı kullanıyorsanız onun belgesindeki değerle değiştirin; yanlış include meşru postanızı da düşürür.
              </p>
              <div className="mt-4 space-y-4">
                {!data.spf.valid && (
                  <CodeBlock
                    language="TXT"
                    title="SPF — Host: @"
                    description="Mail gönderebilecek sunucuları tanımlar."
                    code={data.recommendedSpf}
                  />
                )}
                {(!data.dmarc.valid || data.dmarc.policy === "none") && (
                  <CodeBlock
                    language="TXT"
                    title="DMARC — Host: _dmarc"
                    description="Önce rapor toplamak için quarantine ile başlayın, raporlar temizse reject'e geçin."
                    code={data.recommendedDmarc}
                  />
                )}
              </div>
            </section>
          )}
        </div>
      )}
    </ToolPage>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1 px-5 py-3 sm:grid-cols-[120px_1fr] sm:gap-4">
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd className="space-y-1 break-all">{children}</dd>
    </div>
  );
}

function Mono({ children }: { children: React.ReactNode }) {
  return <div className="font-mono text-xs text-slate-200">{children}</div>;
}
