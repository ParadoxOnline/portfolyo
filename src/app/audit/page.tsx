"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CodeBlock,
  ErrorNote,
  Findings,
  Metrics,
  Panel,
  Status,
  ToolPage,
  UrlForm,
  formatBytes,
  type StatusKind,
} from "@/components/tools/ToolKit";

interface CopyableFix {
  title: string;
  description: string;
  language: string;
  code: string;
}

interface AuditResult {
  url: string;
  domain: string;
  statusCode: number;
  statusText: string;
  isHttps: boolean;
  ttfbMs: number;
  pageSizeKb: number;
  server: string;
  compression: string;
  scores: {
    seo: number;
    performance: number;
    geo: "A+" | "A" | "B" | "C" | "F";
    overall: number;
  };
  seo: {
    title: string | null;
    titleLength: number;
    description: string | null;
    descriptionLength: number;
    canonical: string | null;
    robots: string;
    isNoIndex: boolean;
    isNoFollow: boolean;
    hasViewport: boolean;
    viewportContent: string | null;
    h1Count: number;
    h1List: string[];
    h2Count: number;
    h2List: string[];
    h3Count: number;
    wordCount: number;
    hasFavicon: boolean;
    og: {
      title: string | null;
      description: string | null;
      image: string | null;
      twitterCard: string | null;
    };
  };
  media: {
    totalImages: number;
    missingAlt: number;
    missingDimensions: number;
    modernFormatsCount: number;
    lazyLoadedFirstImage: boolean;
    missingAltSamples: string[];
  };
  links: {
    total: number;
    internal: number;
    external: number;
    emptyLinks: number;
    unsafeTargetBlank: number;
  };
  assets: {
    totalExternalScripts: number;
    asyncDeferScripts: number;
    renderBlockingScripts: number;
    stylesheets: number;
    domElements: number;
    hasGoogleFonts: boolean;
    hasFontPreconnect: boolean;
  };
  geo: {
    grade: "A+" | "A" | "B" | "C" | "F";
    schemaCount: number;
    schemaTypes: string[];
    hasWikidataSameAs: boolean;
    sampleJsonLd: string | null;
  };
  security: {
    isHttps: boolean;
    hsts: boolean;
    hstsValue: string | null;
    xFrameOptions: string | null;
    xContentTypeOptions: string | null;
    referrerPolicy: string | null;
    csp: boolean;
  };
  findings: {
    passed: string[];
    warnings: string[];
    critical: string[];
  };
  recommendations: string[];
  copyableFixes: CopyableFix[];
  scannedAt: string;
}

const sampleSites = ["nextjs.org", "react.dev", "github.com", "tailwindcss.com"];

function scoreTone(n: number): StatusKind {
  return n >= 90 ? "ok" : n >= 50 ? "warn" : "fail";
}

function geoTone(g: string): StatusKind {
  return g === "A+" || g === "A" ? "ok" : g === "B" || g === "C" ? "warn" : "fail";
}

function Row({
  label,
  children,
  status,
}: {
  label: string;
  children: React.ReactNode;
  status?: StatusKind;
}) {
  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-1 border-b border-white/[0.07] px-5 py-2.5 last:border-b-0 sm:grid-cols-[220px_1fr]">
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd className="min-w-0 break-words text-[13px] tabular-nums text-slate-200">
        {status ? <Status kind={status}>{children}</Status> : children}
      </dd>
    </div>
  );
}

function Mono({ children }: { children: React.ReactNode }) {
  return <span className="break-all font-mono text-xs">{children}</span>;
}

function yesNo(v: boolean, yes = "Var", no = "Yok") {
  return v ? yes : no;
}

export default function AuditPage() {
  const [urlInput, setUrlInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AuditResult | null>(null);

  const runAudit = async (targetUrl: string) => {
    if (!targetUrl.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: targetUrl.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Tarama gerçekleştirilemedi.");
      }
      setResult(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Beklenmedik bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runAudit(urlInput);
  };

  const r = result;
  const titleOk = r ? r.seo.titleLength >= 25 && r.seo.titleLength <= 65 : false;
  const descOk = r ? r.seo.descriptionLength >= 100 && r.seo.descriptionLength <= 165 : false;

  const findingItems: Array<{ kind: StatusKind; text: string }> = r
    ? [
        ...r.findings.critical.map((text) => ({ kind: "fail" as const, text })),
        ...r.findings.warnings.map((text) => ({ kind: "warn" as const, text })),
        ...r.findings.passed.map((text) => ({ kind: "ok" as const, text })),
      ]
    : [];

  return (
    <ToolPage href="/audit" tool="scan"
      title="Web Sitesi SEO ve Teknik Denetimi"
      lead="Bir sitenin URL adresini girin. Sunucu yanıt süresi, meta etiketleri, görseller, yapılandırılmış veri ve güvenlik başlıkları taranır; eksikler için kopyalanabilir kod önerilir."
      wide
    >
      <UrlForm
        label="Taranacak adres"
        placeholder="siteniz.com veya https://ornekalanadi.com"
        value={urlInput}
        onChange={setUrlInput}
        onSubmit={handleSubmit}
        loading={loading}
        submitLabel="Denetle"
        loadingLabel="Taranıyor"
      />

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
        <span>Örnek siteler:</span>
        {sampleSites.map((site) => (
          <button
            key={site}
            type="button"
            disabled={loading}
            onClick={() => {
              setUrlInput(site);
              runAudit(site);
            }}
            className="font-mono text-sky-300 hover:text-sky-200 disabled:opacity-50"
          >
            {site}
          </button>
        ))}
      </div>

      {error && <ErrorNote>{error}</ErrorNote>}

      <div aria-live="polite">
        {r && (
          <div className="mt-8 space-y-6">
            <div>
              <p className="break-all font-mono text-xs text-slate-400">
                <span className="text-white">{r.url}</span>
                <span className="mx-2 text-zinc-700">/</span>
                HTTP {r.statusCode} {r.statusText}
                <span className="mx-2 text-zinc-700">/</span>
                {r.scannedAt}
              </p>
            </div>

            <Metrics
              items={[
                { label: "Genel", value: r.scores.overall, tone: scoreTone(r.scores.overall) },
                { label: "SEO", value: r.scores.seo, tone: scoreTone(r.scores.seo) },
                {
                  label: "Performans",
                  value: r.scores.performance,
                  tone: scoreTone(r.scores.performance),
                },
                { label: "GEO", value: r.geo.grade, tone: geoTone(r.geo.grade) },
              ]}
            />

            {/* Reçete: yalnızca eksik tespit edildiyse */}
            {r.copyableFixes && r.copyableFixes.length > 0 && (
              <section aria-labelledby="recete-baslik">
                <h2 id="recete-baslik" className="text-sm font-medium text-white">
                  BU SİTEYE ÖZEL HAZIR KOD REÇETESİ ({r.copyableFixes.length})
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Tespit edilen eksiklikler için doğrudan kopyalayabileceğiniz kod blokları.
                </p>
                <div className="mt-3 space-y-4">
                  {r.copyableFixes.map((fix, idx) => (
                    <CodeBlock
                      key={idx}
                      code={fix.code}
                      language={fix.language}
                      title={fix.title}
                      description={fix.description}
                    />
                  ))}
                </div>
              </section>
            )}

            <Panel
              title="Bulgular"
              note={`${r.findings.critical.length} kritik, ${r.findings.warnings.length} uyarı, ${r.findings.passed.length} başarılı`}
            >
              {findingItems.length > 0 ? (
                <Findings items={findingItems} />
              ) : (
                <p className="text-sm text-slate-500">Bulgu yok.</p>
              )}
            </Panel>

            {r.recommendations.length > 0 && (
              <Panel title="Öncelikli aksiyonlar">
                <ol className="divide-y divide-white/[0.07]">
                  {r.recommendations.map((rec, i) => (
                    <li
                      key={i}
                      className="flex gap-3 py-2.5 text-[13px] leading-relaxed text-slate-300 first:pt-0 last:pb-0"
                    >
                      <span className="w-5 shrink-0 text-right font-mono text-xs tabular-nums text-slate-500">
                        {i + 1}
                      </span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ol>
              </Panel>
            )}

            <Panel title="Sunucu ve ağ" flush>
              <dl>
                <Row label="Durum kodu" status={r.statusCode < 400 ? "ok" : "fail"}>
                  {r.statusCode} {r.statusText}
                </Row>
                <Row
                  label="TTFB"
                  status={r.ttfbMs < 250 ? "ok" : r.ttfbMs < 600 ? "warn" : "fail"}
                >
                  {r.ttfbMs} ms
                </Row>
                <Row label="Sayfa boyutu">{formatBytes(Math.round(r.pageSizeKb * 1024))}</Row>
                <Row label="Sunucu">
                  <Mono>{r.server}</Mono>
                </Row>
                <Row label="Sıkıştırma">
                  <Mono>{r.compression}</Mono>
                </Row>
                <Row label="DOM eleman sayısı">{r.assets.domElements}</Row>
                <Row label="Harici betik">
                  {r.assets.totalExternalScripts} (async/defer: {r.assets.asyncDeferScripts}, render
                  engelleyen: {r.assets.renderBlockingScripts})
                </Row>
                <Row label="Stil dosyası">{r.assets.stylesheets}</Row>
                <Row label="Google Fonts">
                  {r.assets.hasGoogleFonts
                    ? `Kullanılıyor, preconnect ${r.assets.hasFontPreconnect ? "var" : "yok"}`
                    : "Kullanılmıyor"}
                </Row>
              </dl>
            </Panel>

            <Panel title="SEO ve meta etiketleri" flush>
              <dl>
                <Row label="Başlık (title)" status={r.seo.title && titleOk ? "ok" : "warn"}>
                  {r.seo.titleLength} karakter, ideal 30-60
                </Row>
                <Row label="">
                  <span className="text-slate-300">{r.seo.title || "Başlık etiketi bulunamadı."}</span>
                </Row>
                <Row
                  label="Meta açıklama"
                  status={r.seo.description && descOk ? "ok" : "warn"}
                >
                  {r.seo.descriptionLength} karakter, ideal 120-160
                </Row>
                <Row label="">
                  <span className="text-slate-300">
                    {r.seo.description || "Meta açıklama etiketi eksik."}
                  </span>
                </Row>
                <Row label="Canonical" status={r.seo.canonical ? "ok" : "warn"}>
                  {r.seo.canonical ? <Mono>{r.seo.canonical}</Mono> : "Belirtilmemiş"}
                </Row>
                <Row label="Meta robots" status={r.seo.isNoIndex ? "fail" : "ok"}>
                  <Mono>{r.seo.robots}</Mono>
                </Row>
                <Row label="Viewport" status={r.seo.hasViewport ? "ok" : "warn"}>
                  {r.seo.hasViewport ? <Mono>{r.seo.viewportContent}</Mono> : "Yok"}
                </Row>
                <Row label="Favicon" status={r.seo.hasFavicon ? "ok" : "warn"}>
                  {yesNo(r.seo.hasFavicon)}
                </Row>
                <Row label="og:title">{r.seo.og.title || "Yok"}</Row>
                <Row label="og:image" status={r.seo.og.image ? "ok" : "warn"}>
                  {yesNo(!!r.seo.og.image)}
                </Row>
                <Row label="twitter:card">{r.seo.og.twitterCard || "Yok"}</Row>
              </dl>
            </Panel>

            <Panel title="İçerik yapısı" flush>
              <dl>
                <Row label="H1 sayısı" status={r.seo.h1Count === 1 ? "ok" : "warn"}>
                  {r.seo.h1Count}
                </Row>
                {r.seo.h1List.length > 0 && (
                  <Row label="İlk H1">{r.seo.h1List[0]}</Row>
                )}
                <Row label="H2 / H3">
                  {r.seo.h2Count} / {r.seo.h3Count}
                </Row>
                <Row label="Kelime sayısı">~{r.seo.wordCount}</Row>
                <Row label="Bağlantılar">
                  {r.links.total} (iç: {r.links.internal}, dış: {r.links.external})
                </Row>
                <Row label="Boş bağlantı" status={r.links.emptyLinks === 0 ? "ok" : "warn"}>
                  {r.links.emptyLinks}
                </Row>
                <Row
                  label="Güvensiz target=_blank"
                  status={r.links.unsafeTargetBlank === 0 ? "ok" : "warn"}
                >
                  {r.links.unsafeTargetBlank}
                </Row>
              </dl>
            </Panel>

            <Panel title="Görseller" flush>
              <dl>
                <Row label="Toplam görsel">{r.media.totalImages}</Row>
                <Row label="Alt metni eksik" status={r.media.missingAlt === 0 ? "ok" : "warn"}>
                  {r.media.missingAlt}
                </Row>
                {r.media.missingAltSamples.length > 0 && (
                  <Row label="Örnek">
                    <Mono>{r.media.missingAltSamples[0]}</Mono>
                  </Row>
                )}
                <Row
                  label="Boyutu belirtilmemiş (CLS)"
                  status={r.media.missingDimensions === 0 ? "ok" : "warn"}
                >
                  {r.media.missingDimensions}
                </Row>
                <Row label="Modern format (WebP/AVIF)">{r.media.modernFormatsCount}</Row>
                <Row
                  label="İlk görsel lazy-load"
                  status={r.media.lazyLoadedFirstImage ? "warn" : "ok"}
                >
                  {r.media.lazyLoadedFirstImage ? "Evet" : "Hayır"}
                </Row>
              </dl>
            </Panel>

            <Panel title="Yapılandırılmış veri (GEO)" flush>
              <dl>
                <Row label="Not" status={geoTone(r.geo.grade)}>
                  {r.geo.grade}
                </Row>
                <Row label="JSON-LD blokları">{r.geo.schemaCount}</Row>
                <Row label="Şema türleri" status={r.geo.schemaTypes.length > 0 ? undefined : "warn"}>
                  {r.geo.schemaTypes.length > 0 ? (
                    <Mono>{r.geo.schemaTypes.join(", ")}</Mono>
                  ) : (
                    "Schema.org JSON-LD verisi bulunamadı"
                  )}
                </Row>
                <Row label="Wikidata sameAs">{yesNo(r.geo.hasWikidataSameAs)}</Row>
              </dl>
            </Panel>

            <Panel title="Güvenlik başlıkları" flush>
              <dl>
                <Row label="HTTPS" status={r.security.isHttps ? "ok" : "fail"}>
                  {yesNo(r.security.isHttps)}
                </Row>
                <Row label="HSTS" status={r.security.hsts ? "ok" : "warn"}>
                  {r.security.hsts ? <Mono>{r.security.hstsValue || "Var"}</Mono> : "Yok"}
                </Row>
                <Row label="X-Frame-Options" status={r.security.xFrameOptions ? "ok" : "warn"}>
                  {r.security.xFrameOptions ? <Mono>{r.security.xFrameOptions}</Mono> : "Yok"}
                </Row>
                <Row
                  label="X-Content-Type-Options"
                  status={r.security.xContentTypeOptions ? "ok" : "warn"}
                >
                  {r.security.xContentTypeOptions ? (
                    <Mono>{r.security.xContentTypeOptions}</Mono>
                  ) : (
                    "Yok"
                  )}
                </Row>
                <Row label="Referrer-Policy" status={r.security.referrerPolicy ? "ok" : "warn"}>
                  {r.security.referrerPolicy ? <Mono>{r.security.referrerPolicy}</Mono> : "Yok"}
                </Row>
                <Row label="Content-Security-Policy" status={r.security.csp ? "ok" : "warn"}>
                  {yesNo(r.security.csp)}
                </Row>
              </dl>
            </Panel>

            {r.recommendations.length > 0 && (
              <p className="text-sm text-slate-400">
                Bu bulguları birlikte çözmek isterseniz{" "}
                <Link href="/#contact" className="text-sky-300 hover:text-sky-200">
                  iletişime geçin
                </Link>
                .
              </p>
            )}
          </div>
        )}
      </div>
    </ToolPage>
  );
}
