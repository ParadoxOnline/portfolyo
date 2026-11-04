"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  ToolPage,
  Panel,
  UrlForm,
  Metrics,
  Tabs,
  ErrorNote,
  Status,
  formatBytes,
} from "@/components/tools/ToolKit";
import { toolCursor } from "@/components/tools/ToolCursor";

interface AuditResult {
  domain: string;
  totalImagesOnPage: number;
  legacyCount: number;
  modernCount: number;
  sampleMeasuredCount: number;
  totalMeasuredBytes: number;
  totalEstimatedWebpBytes: number;
  totalEstimatedAvifBytes: number;
  potentialSavingsBytes: number;
  potentialSavingsPercent: number;
  measuredImages: Array<{
    url: string;
    format: string;
    sizeBytes: number;
    estimatedWebpBytes: number;
    estimatedAvifBytes: number;
  }>;
}

interface ConvertedFile {
  id: string;
  originalName: string;
  originalSize: number;
  convertedUrl: string;
  convertedSize: number;
}

const baseName = (n: string) => n.replace(/\.[^.]+$/, "") || n;

function convertToWebp(file: File, quality: number): Promise<ConvertedFile> {
  return new Promise((resolve, reject) => {
    const src = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        URL.revokeObjectURL(src);
        reject(new Error("Canvas kullanılamıyor"));
        return;
      }
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(src);
      canvas.toBlob(
        (blob) => {
          if (!blob) return reject(new Error("WebP üretilemedi"));
          resolve({
            id: crypto.randomUUID(),
            originalName: file.name,
            originalSize: file.size,
            convertedUrl: URL.createObjectURL(blob),
            convertedSize: blob.size,
          });
        },
        "image/webp",
        quality
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(src);
      reject(new Error(`${file.name} okunamadı`));
    };
    img.src = src;
  });
}

export default function ImageOptimizerPage() {
  const [tab, setTab] = useState<"converter" | "measure">("converter");

  const [urlInput, setUrlInput] = useState("");
  const [loadingAudit, setLoadingAudit] = useState(false);
  const [auditError, setAuditError] = useState<string | null>(null);
  const [audit, setAudit] = useState<AuditResult | null>(null);

  const [files, setFiles] = useState<ConvertedFile[]>([]);
  const [convError, setConvError] = useState<string | null>(null);
  const [converting, setConverting] = useState(false);
  const [quality, setQuality] = useState(0.82);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);
  const filesRef = useRef<ConvertedFile[]>([]);
  filesRef.current = files;

  // Sayfadan çıkınca oluşturulan blob adreslerini serbest bırak.
  useEffect(() => () => filesRef.current.forEach((f) => URL.revokeObjectURL(f.convertedUrl)), []);

  const handleAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    setLoadingAudit(true);
    setAuditError(null);
    try {
      const res = await fetch("/api/tools/image-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: urlInput }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Görseller taranamadı.");
      setAudit(json);
    } catch (err: unknown) {
      setAuditError(err instanceof Error ? err.message : "Beklenmeyen bir hata oluştu.");
    } finally {
      setLoadingAudit(false);
    }
  };

  const handleFiles = async (list: FileList | null) => {
    if (!list || list.length === 0) return;
    setConverting(true);
    setConvError(null);
    const all = Array.from(list);
    const done: ConvertedFile[] = [];
    const failed: string[] = [];
    // Operatör imleç bırakma alanının içinde çalışır; ilerleme ve yüzdeler gerçek dönüştürme çıktısıdır.
    toolCursor.begin({ anchor: dropRef.current, stage: "inside" });
    toolCursor.progress(0);
    let handled = 0;
    for (const file of all) {
      if (!file.type.startsWith("image/")) {
        failed.push(`${file.name} bir görsel değil`);
      } else {
        try {
          const out = await convertToWebp(file, quality);
          done.push(out);
          const pct = Math.round(((out.originalSize - out.convertedSize) / out.originalSize) * 100);
          toolCursor.emit(pct >= 0 ? `−${pct}%` : `+${Math.abs(pct)}%`);
        } catch (err) {
          failed.push(err instanceof Error ? err.message : file.name);
        }
      }
      handled += 1;
      toolCursor.progress(handled / all.length);
    }
    toolCursor.end(done.length > 0);
    setFiles((p) => [...p, ...done]);
    if (failed.length) setConvError(failed.join(" · "));
    setConverting(false);
  };

  const remove = (id: string) => {
    setFiles((p) => {
      p.filter((f) => f.id === id).forEach((f) => URL.revokeObjectURL(f.convertedUrl));
      return p.filter((f) => f.id !== id);
    });
  };

  const downloadAll = () => {
    files.forEach((f, i) => {
      setTimeout(() => {
        const a = document.createElement("a");
        a.href = f.convertedUrl;
        a.download = `${baseName(f.originalName)}.webp`;
        a.click();
      }, i * 250);
    });
  };

  const totalSaved = files.reduce((n, f) => n + (f.originalSize - f.convertedSize), 0);
  const worse = files.filter((f) => f.convertedSize >= f.originalSize).length;

  return (
    <ToolPage href="/image-optimizer" tool="image"
      title="Görsel boyutu ve WebP dönüştürme"
      lead="Bir sayfadaki görsellerin gerçek dosya boyutunu ölçebilir ya da kendi görsellerinizi tarayıcınızda WebP'ye çevirebilirsiniz. Dönüştürme cihazınızda yapılır, dosyalar hiçbir yere yüklenmez."
    >
      <Tabs
        value={tab}
        onChange={setTab}
        tabs={[
          { id: "converter", label: "WebP dönüştürücü" },
          { id: "measure", label: "Sayfadaki görselleri ölç" },
        ]}
      />

      {tab === "converter" && (
        <div className="mt-6 space-y-6">
          <div
            ref={dropRef}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
              toolCursor.hold(true);
            }}
            onDragLeave={() => {
              setDragging(false);
              toolCursor.hold(false);
            }}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              toolCursor.hold(false);
              handleFiles(e.dataTransfer.files);
            }}
            className={`rounded-md border border-dashed px-6 py-10 text-center transition ${
              dragging ? "border-sky-300 bg-sky-300/[0.04]" : "border-white/20 bg-[#070b12]"
            }`}
          >
            <input
              ref={inputRef}
              type="file"
              multiple
              accept="image/png,image/jpeg,image/webp,image/gif,image/bmp"
              className="sr-only"
              onChange={(e) => {
                handleFiles(e.target.files);
                e.target.value = "";
              }}
            />
            <p className="text-sm text-slate-300">Görselleri buraya bırakın</p>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={converting}
              className="mt-3 rounded bg-sky-300 px-4 py-2 text-sm font-semibold text-[#04060a] transition hover:bg-sky-200 disabled:opacity-50"
            >
              {converting ? "Dönüştürülüyor" : "Dosya seç"}
            </button>
            <div className="mx-auto mt-6 flex max-w-xs items-center gap-3 text-xs text-slate-400">
              <label htmlFor="q" className="shrink-0">
                Kalite
              </label>
              <input
                id="q"
                type="range"
                min={0.5}
                max={0.95}
                step={0.01}
                value={quality}
                onChange={(e) => setQuality(parseFloat(e.target.value))}
                className="w-full accent-sky-300"
              />
              <span className="w-9 shrink-0 text-right font-mono tabular-nums text-white">{Math.round(quality * 100)}</span>
            </div>
            <p className="mt-2 text-[11px] text-zinc-500">Kalite ayarı yalnızca bundan sonra eklenen dosyaları etkiler.</p>
          </div>

          {convError && <ErrorNote>{convError}</ErrorNote>}

          {files.length > 0 && (
            <Panel
              title={`${files.length} dosya`}
              note={`Toplam fark: ${totalSaved >= 0 ? "−" : "+"}${formatBytes(Math.abs(totalSaved))}`}
              action={
                <div className="flex items-center gap-4 font-mono text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      files.forEach((f) => URL.revokeObjectURL(f.convertedUrl));
                      setFiles([]);
                    }}
                    className="text-slate-500 hover:text-slate-300"
                  >
                    Temizle
                  </button>
                  <button type="button" onClick={downloadAll} className="text-sky-300 hover:text-sky-200">
                    Hepsini indir
                  </button>
                </div>
              }
              flush
            >
              <ul className="divide-y divide-white/[0.07] text-[13px]">
                {files.map((f) => {
                  const pct = Math.round(((f.originalSize - f.convertedSize) / f.originalSize) * 100);
                  const bigger = f.convertedSize >= f.originalSize;
                  return (
                    <li key={f.id} className="flex flex-wrap items-center gap-x-5 gap-y-1 px-5 py-3">
                      <span className="min-w-0 flex-1 truncate text-white">{f.originalName}</span>
                      <span className="font-mono text-xs tabular-nums text-slate-400">
                        {formatBytes(f.originalSize)} → {formatBytes(f.convertedSize)}
                      </span>
                      <span className="w-24 text-right">
                        <Status kind={bigger ? "warn" : "ok"}>{bigger ? `+${Math.abs(pct)}%` : `−${pct}%`}</Status>
                      </span>
                      <a
                        href={f.convertedUrl}
                        download={`${baseName(f.originalName)}.webp`}
                        className="font-mono text-xs text-sky-300 hover:text-sky-200"
                      >
                        İndir
                      </a>
                      <button type="button" onClick={() => remove(f.id)} className="text-xs text-zinc-500 hover:text-rose-300">
                        Kaldır
                      </button>
                    </li>
                  );
                })}
              </ul>
              {worse > 0 && (
                <p className="border-t border-white/10 px-5 py-3 text-xs text-amber-300/90">
                  {worse} dosya WebP'de orijinalinden büyük çıktı (genelde zaten sıkıştırılmış JPEG'ler). Bunlarda orijinali
                  tutmak daha doğru.
                </p>
              )}
            </Panel>
          )}
        </div>
      )}

      {tab === "measure" && (
        <div className="mt-6 space-y-6">
          <UrlForm
            label="Sayfa adresi"
            placeholder="ornek.com"
            value={urlInput}
            onChange={setUrlInput}
            onSubmit={handleAudit}
            loading={loadingAudit}
            submitLabel="Görselleri ölç"
            loadingLabel="Ölçülüyor"
          />

          {auditError && <ErrorNote>{auditError}</ErrorNote>}

          {audit && (
            <div className="space-y-6">
              <Metrics
                items={[
                  {
                    label: "Sayfadaki görsel",
                    value: audit.totalImagesOnPage,
                    sub: `${audit.modernCount} modern biçim, ${audit.legacyCount} eski biçim`,
                  },
                  {
                    label: "Ölçülen toplam",
                    value: formatBytes(audit.totalMeasuredBytes),
                    sub: `İlk ${audit.sampleMeasuredCount} görselin gerçek boyutu`,
                  },
                  {
                    label: "AVIF ile tahmini",
                    value: formatBytes(audit.totalEstimatedAvifBytes),
                    tone: audit.potentialSavingsPercent >= 20 ? "warn" : "ok",
                    sub: `Yaklaşık %${audit.potentialSavingsPercent} fark`,
                  },
                ]}
              />

              {audit.measuredImages.length === 0 ? (
                <p className="text-sm text-slate-400">
                  Boyutu okunabilen görsel bulunamadı. Görseller CSS arka planı, JavaScript ile yükleme ya da boyutu
                  bildirmeyen bir CDN üzerinden geliyor olabilir.
                </p>
              ) : (
                <div className="overflow-x-auto rounded-md border border-white/10 bg-[#070b12]">
                  <table className="w-full min-w-[640px] text-left text-[13px]">
                    <thead>
                      <tr className="border-b border-white/10 text-xs text-slate-500">
                        <th className="px-4 py-2.5 font-medium">Görsel</th>
                        <th className="px-4 py-2.5 font-medium">Biçim</th>
                        <th className="px-4 py-2.5 text-right font-medium">Şimdi</th>
                        <th className="px-4 py-2.5 text-right font-medium">WebP (tahmin)</th>
                        <th className="px-4 py-2.5 text-right font-medium">AVIF (tahmin)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.07]">
                      {audit.measuredImages.map((img, i) => (
                        <tr key={i}>
                          <td className="max-w-[320px] truncate px-4 py-2.5 font-mono text-xs text-slate-300" title={img.url}>
                            {img.url.replace(/^https?:\/\//, "")}
                          </td>
                          <td className="px-4 py-2.5 font-mono text-xs uppercase text-slate-400">{img.format}</td>
                          <td className="px-4 py-2.5 text-right font-mono text-xs tabular-nums text-white">{formatBytes(img.sizeBytes)}</td>
                          <td className="px-4 py-2.5 text-right font-mono text-xs tabular-nums text-slate-400">{formatBytes(img.estimatedWebpBytes)}</td>
                          <td className="px-4 py-2.5 text-right font-mono text-xs tabular-nums text-slate-400">{formatBytes(img.estimatedAvifBytes)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <p className="max-w-[70ch] text-xs leading-relaxed text-slate-500">
                "Şimdi" sütunu sunucunun bildirdiği gerçek dosya boyutudur. WebP ve AVIF sütunları ölçüm değil tahmindir:
                JPEG/PNG için sırasıyla yaklaşık %45 ve %65 küçülme varsayılır; zaten WebP olan dosyada yalnızca AVIF farkı
                hesaplanır. Gerçek kazanç görselin içeriğine göre değişir, kesin rakam için dönüştürücü sekmesinde deneyin.
              </p>
            </div>
          )}
        </div>
      )}
    </ToolPage>
  );
}
