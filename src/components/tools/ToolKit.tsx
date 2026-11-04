"use client";

/**
 * Araç sayfaları için ortak, sade arayüz parçaları.
 * Kurallar: tek vurgu rengi (sky), düz yüzeyler, ince çizgiler, parıltı/blur/gradient yok,
 * rozet/emoji yok. Renk yalnızca durum bildirmek için kullanılır.
 */

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ToolCursorLayer, toolCursor, type ToolKind } from "@/components/tools/ToolCursor";
import { SpecimenFrame, SPECIMENS, type SpecimenKind } from "@/components/tools/ToolSpecimen";

/* ───────── Sayfa iskeleti ───────── */

const TOOL_FIGURE: Record<ToolKind, SpecimenKind> = {
  scan: "scan",
  radar: "radar",
  dns: "dns",
  font: "font",
  image: "image",
  schema: "schema",
};

export function ToolPage({
  section = "Araçlar",
  title,
  lead,
  children,
  wide = false,
  tool,
  href,
  figure,
}: {
  section?: string;
  title: string;
  lead: string;
  children: React.ReactNode;
  wide?: boolean;
  /** Verilirse sayfada araca özgü imleç katmanı açılır. */
  tool?: ToolKind;
  /** Sayfanın adresi: levha numarası ve şema buradan seçilir (örn. "/dns-inspector"). */
  href?: string;
  /** Şemayı elle seçmek için (imleç türünden farklıysa). */
  figure?: SpecimenKind;
}) {
  const meta = href ? SPECIMENS[href] : undefined;
  const kind = figure ?? meta?.kind ?? (tool ? TOOL_FIGURE[tool] : undefined);
  const plate = meta?.plate;

  return (
    <div className="min-h-screen">
      {tool && <ToolCursorLayer tool={tool} />}
      <div className={`mx-auto px-4 pb-24 pt-28 sm:px-6 md:px-10 ${wide ? "max-w-[1240px]" : "max-w-[1100px]"}`}>
        <nav aria-label="Konum" className="font-mono text-[11px] text-zinc-500">
          <Link href="/" className="hover:text-zinc-300">Ana sayfa</Link>
          <span className="mx-2 text-zinc-700">/</span>
          <span>{section}</span>
        </nav>

        <header className="relative mt-8 grid items-end gap-10 border-b border-white/10 pb-12 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-14">
          {plate && (
            <span
              aria-hidden
              className="outline-num pointer-events-none absolute -top-16 right-8 hidden select-none font-display text-[200px] font-bold leading-none lg:block"
            >
              {plate}
            </span>
          )}
          <div className="relative">
            {plate && (
              <p className="flex items-center gap-3 font-mono text-xs text-sky-300">
                <span className="inline-block h-px w-8 bg-sky-300" />
                Deney {plate}
              </p>
            )}
            <h1 className="mt-5 font-display text-[36px] font-semibold leading-[1.02] tracking-[-0.03em] text-white sm:text-5xl lg:text-[58px]">
              {title}
            </h1>
            <p className="mt-6 max-w-[56ch] text-base leading-[1.7] text-slate-400">{lead}</p>
          </div>
          {kind && (
            <SpecimenFrame
              kind={kind}
              plate={plate}
              caption={meta?.caption}
              className="w-full max-w-[340px] lg:max-w-none"
            />
          )}
        </header>

        <div className="mt-10">{children}</div>
      </div>
    </div>
  );
}

/* ───────── Yüzeyler ───────── */

export function Panel({
  title,
  note,
  action,
  children,
  className = "",
  flush = false,
}: {
  title?: string;
  note?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  flush?: boolean;
}) {
  return (
    <section className={`rounded-md border border-white/10 bg-[#070b12] ${className}`}>
      {(title || action) && (
        <div className="flex items-start justify-between gap-4 border-b border-white/10 px-5 py-3.5">
          <div>
            {title && <h2 className="text-sm font-medium text-white">{title}</h2>}
            {note && <p className="mt-0.5 text-xs text-slate-500">{note}</p>}
          </div>
          {action}
        </div>
      )}
      <div className={flush ? "" : "p-5"}>{children}</div>
    </section>
  );
}

/* ───────── Form ───────── */

export function UrlForm({
  label,
  placeholder,
  value,
  onChange,
  onSubmit,
  loading,
  submitLabel,
  loadingLabel,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  submitLabel: string;
  loadingLabel: string;
}) {
  const id = React.useId();
  const formRef = useRef<HTMLFormElement>(null);
  const wasLoading = useRef(false);

  // İşlem başlayınca operatör imleç sahneye çıkar; bitince sonucu teslim edip döner.
  useEffect(() => {
    if (loading && !wasLoading.current) {
      toolCursor.begin({ anchor: formRef.current, stage: "below" });
    } else if (!loading && wasLoading.current) {
      requestAnimationFrame(() =>
        requestAnimationFrame(() => toolCursor.end(!document.querySelector("[data-tool-error]")))
      );
    }
    wasLoading.current = loading;
  }, [loading]);

  return (
    <form ref={formRef} onSubmit={onSubmit} className="rounded-md border border-white/10 bg-[#070b12] p-5">
      <label htmlFor={id} className="block text-xs font-medium text-slate-400">
        {label}
      </label>
      <div className="mt-2 flex flex-col gap-2 sm:flex-row">
        <input
          id={id}
          type="text"
          inputMode="url"
          autoComplete="off"
          spellCheck={false}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={loading}
          className="h-11 flex-1 rounded border border-white/15 bg-[#04060a] px-3.5 font-mono text-sm text-white placeholder:text-zinc-600 focus:border-sky-300 focus:outline-none disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={loading || !value.trim()}
          className="h-11 rounded bg-sky-300 px-5 text-sm font-semibold text-[#04060a] transition hover:bg-sky-200 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {loading ? loadingLabel : submitLabel}
        </button>
      </div>
    </form>
  );
}

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-xs font-medium text-slate-400">{label}</span>
      <span className="mt-1.5 block">{children}</span>
      {hint && <span className="mt-1 block text-[11px] text-zinc-500">{hint}</span>}
    </label>
  );
}

export const inputClass =
  "w-full rounded border border-white/15 bg-[#04060a] px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:border-sky-300 focus:outline-none";

export function ErrorNote({ children }: { children: React.ReactNode }) {
  return (
    <div role="alert" data-tool-error className="mt-5 border-l-2 border-rose-400 bg-rose-400/[0.06] px-4 py-3 text-sm text-rose-200">
      {children}
    </div>
  );
}

/* ───────── Durum ───────── */

export type StatusKind = "ok" | "warn" | "fail" | "info";

const statusColor: Record<StatusKind, string> = {
  ok: "bg-emerald-400",
  warn: "bg-amber-400",
  fail: "bg-rose-400",
  info: "bg-zinc-500",
};
const statusText: Record<StatusKind, string> = {
  ok: "text-emerald-300",
  warn: "text-amber-300",
  fail: "text-rose-300",
  info: "text-zinc-400",
};

export function Status({ kind, children }: { kind: StatusKind; children: React.ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-2 text-xs font-medium ${statusText[kind]}`}>
      <span aria-hidden className={`h-1.5 w-1.5 shrink-0 ${statusColor[kind]}`} />
      {children}
    </span>
  );
}

/** Tek bir panelin içinde yan yana, çizgiyle ayrılmış ölçümler. */
export function Metrics({
  items,
}: {
  items: Array<{ label: string; value: React.ReactNode; sub?: string; tone?: StatusKind }>;
}) {
  return (
    <dl className="grid grid-cols-2 divide-white/10 rounded-md border border-white/10 bg-[#070b12] sm:grid-flow-col sm:auto-cols-fr sm:divide-x">
      {items.map((m, i) => (
        <div key={i} className="border-b border-white/10 px-5 py-4 last:border-b-0 sm:border-b-0">
          <dt className="text-xs text-slate-500">{m.label}</dt>
          <dd
            className={`mt-1 font-display text-2xl font-semibold tabular-nums ${
              m.tone ? statusText[m.tone] : "text-white"
            }`}
          >
            {m.value}
          </dd>
          {m.sub && <p className="mt-1 text-xs leading-snug text-slate-500">{m.sub}</p>}
        </div>
      ))}
    </dl>
  );
}

/** Bulgular: tek liste, her satırda solda önem işareti. */
export function Findings({
  items,
}: {
  items: Array<{ kind: StatusKind; text: string }>;
}) {
  if (items.length === 0) return null;
  return (
    <ul className="divide-y divide-white/[0.07]">
      {items.map((f, i) => (
        <li key={i} className="flex items-start gap-3 py-2.5 text-[13px] leading-relaxed text-slate-300">
          <span aria-hidden className={`mt-[7px] h-1.5 w-1.5 shrink-0 ${statusColor[f.kind]}`} />
          <span>{f.text}</span>
        </li>
      ))}
    </ul>
  );
}

/* ───────── Kod bloğu ───────── */

export function useCopy() {
  const [copied, setCopied] = useState<string | null>(null);
  const copy = async (text: string, key = "default") => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied((c) => (c === key ? null : c)), 1800);
    } catch {
      /* pano erişimi reddedildi */
    }
  };
  return { copied, copy };
}

export function CodeBlock({
  code,
  language,
  title,
  description,
  extraAction,
  cursorOutput = false,
}: {
  code: string;
  language: string;
  title?: string;
  description?: string;
  extraAction?: React.ReactNode;
  /** Canlı üretilen çıktı: yazarken operatör imleç bu bloğu tarar. */
  cursorOutput?: boolean;
}) {
  const { copied, copy } = useCopy();
  return (
    <div
      data-code-block
      {...(cursorOutput ? { "data-cursor-output": "" } : {})}
      className="overflow-hidden rounded-md border border-white/10 bg-[#04060a]"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-[#070b12] px-4 py-2.5">
        <div className="min-w-0">
          {title && <p className="truncate text-[13px] font-medium text-white">{title}</p>}
          {description && <p className="mt-0.5 text-xs text-slate-500">{description}</p>}
          {!title && <span className="font-mono text-[11px] text-zinc-500">{language}</span>}
        </div>
        <div className="flex items-center gap-3">
          {title && <span className="font-mono text-[11px] text-zinc-600">{language}</span>}
          {extraAction}
          <button
            type="button"
            onClick={(e) => {
              copy(code);
              toolCursor.stamp(e.currentTarget, "Kopyalandı");
            }}
            className="font-mono text-xs text-sky-300 hover:text-sky-200"
          >
            {copied === "default" ? "Kopyalandı" : "Kopyala"}
          </button>
        </div>
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-slate-300">
        <code>{code}</code>
      </pre>
    </div>
  );
}

/* ───────── Sekmeler ───────── */

export function Tabs<T extends string>({
  tabs,
  value,
  onChange,
}: {
  tabs: Array<{ id: T; label: string }>;
  value: T;
  onChange: (id: T) => void;
}) {
  return (
    <div role="tablist" className="flex gap-6 border-b border-white/10">
      {tabs.map((t) => (
        <button
          key={t.id}
          role="tab"
          aria-selected={value === t.id}
          type="button"
          onClick={(e) => {
            onChange(t.id);
            toolCursor.stamp(e.currentTarget, t.label, e.currentTarget);
          }}
          className={`-mb-px border-b-2 pb-2.5 text-sm transition ${
            value === t.id
              ? "border-sky-300 font-medium text-white"
              : "border-transparent text-slate-500 hover:text-slate-300"
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

export function formatBytes(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${bytes} B`;
}

