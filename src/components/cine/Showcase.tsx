"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { useLang } from "@/providers/LangProvider";
import { copy, describe, flagships, getShots, pick } from "@/data/showcase";
import type { Project } from "@/data/projects";
import Shot from "./Shot";
import LightboxModal from "@/components/ui/LightboxModal";
import { LiveTypoText, useStageBuild } from "@/components/canvas/LiveBuilderSystem";
import {
  clamp01,
  getCloneAndRenameState,
  getTwoAxisBoxState,
  TwoAxisResizeFrame,
} from "@/components/canvas/DevBuildPrimitives";

const ACCENTS: Record<string, string> = {
  lios: "#a855f7",
  gen: "#38bdf8",
  macagel: "#22c55e",
  tekstil: "#ec4899",
  arama: "#f43f5e",
  devrim: "#6366f1",
  sitebuilder: "#10b981",
};

const TYPOS: Record<string, string> = {
  lios: "Liso Core",
  gen: "SentioPluse",
  macagel: "MaçaGle",
  tekstil: "VeloDarpe 3D",
  arama: "SerachGrid",
  devrim: "ChronoPsot",
  sitebuilder: "StaticFroge",
};

function techOf(p: Project): string[] {
  const t = p.technologies;
  const all = [
    ...(t.frontend ?? []),
    ...(t.backend ?? []),
    ...(t.ai ?? []),
    ...(t.database ?? []),
    ...(t.mobile ?? []),
    ...(t.seo ?? []),
  ];
  return Array.from(new Set(all)).slice(0, 6);
}

function Scene({ p, index, total }: { p: Project; index: number; total: number }) {
  const { lang } = useLang();
  const t = copy[lang];
  const ref = useRef<HTMLElement>(null);
  const shots = getShots(p.slug);
  const count = Math.max(shots.length, 1);
  const [active, setActive] = useState(0);
  const [userColor, setUserColor] = useState<string | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [descTab, setDescTab] = useState<"flow" | "problem" | "solution" | "impact">("flow");

  const defaultAccent = ACCENTS[p.slug] ?? "#38bdf8";
  const stageId = `project-${p.slug}`;
  const { progress, isBuilding, isBuilt, activeColor } = useStageBuild(
    stageId,
    userColor ?? defaultAccent
  );

  const color = userColor && isBuilt ? userColor : activeColor;

  // 0'dan Profesyonel Yazılımcı İnşa Fazları:
  const phase1 = clamp01((progress - 0.13) / 0.15);
  const phase2 = clamp01((progress - 0.25) / 0.08);
  const phase3 = clamp01((progress - 0.48) / 0.18);
  const descBox = getTwoAxisBoxState(phase3, 540, 260);
  const phase4 = clamp01((progress - 0.64) / 0.20);
  const phase5 = clamp01((progress - 0.82) / 0.15);

  const isMobile = p.slug === "macagel";
  const displayName = p.name.charAt(0).toUpperCase() + p.name.slice(1);
  const desc = describe(p, lang);
  const problemText = pick(p.problem, lang) || desc;
  const solutionText = pick(p.solution, lang) || desc;
  const whyItMattersText = pick(p.whyItMatters, lang);
  const descChars = Math.floor(desc.length * clamp01((phase3 - 0.28) / 0.72));

  const techs = techOf(p);
  const swatches = Array.from(
    new Set([defaultAccent, "#38bdf8", "#a855f7", "#10b981", "#f43f5e"])
  ).slice(0, 4);

  return (
    <article
      ref={ref}
      id={stageId}
      data-build-stage={stageId}
      className="relative mx-auto my-12 w-full max-w-[1580px] scroll-mt-20 px-6 py-16 md:my-20 md:px-12 md:py-24"
    >
      {/* Devasa Arka Plan Kontur Rakamı */}
      <span
        className="outline-num pointer-events-none absolute -top-6 right-6 select-none font-display text-[22vw] font-bold leading-none transition-opacity duration-500 md:right-12"
        style={{ opacity: phase1 * 0.65 }}
        aria-hidden
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      {/* Sinematik Volümetrik Sahne Spot Işığı */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[150px] transition-opacity duration-500"
        style={{ backgroundColor: `${color}22`, opacity: phase1 }}
        aria-hidden
      />

      {/* GÖREV 1: Üst Mimari Meta Barı & Çoğaltılan 4 Renk Noktası */}
      <div
        data-build-role="grid"
        className="relative z-10 mb-10 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5"
        style={{
          opacity: phase1,
          transform: `translate3d(0, ${(1 - phase1) * 14}px, 0)`,
        }}
      >
        <div className="flex items-center gap-4">
          <span
            className="inline-flex h-7 items-center rounded-full px-3 font-mono text-[11px] font-semibold tracking-wider text-slate-950"
            style={{
              backgroundColor: color,
              boxShadow: `0 0 20px ${color}66`,
            }}
          >
            0{index + 1} / 0{total}
          </span>
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-white/60">
            {p.category} · {p.year}
          </span>
        </div>

        {/* Canlı Renk Paleti Noktaları (1. Noktadan 4'e Çoğaltılır) */}
        <div
          data-build-role="color"
          className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 backdrop-blur-md"
        >
          {swatches.map((hex, si) => {
            const swState = getCloneAndRenameState(phase1, si, swatches.length, hex, swatches[0], 20);
            return (
              <button
                key={hex}
                type="button"
                onClick={() => setUserColor(hex)}
                aria-label={`Accent ${hex}`}
                className="h-3 w-3 rounded-full transition-transform duration-300 hover:scale-125"
                style={{
                  opacity: swState.opacity,
                  backgroundColor: swState.isCloning ? swatches[0] : hex,
                  transform: `translateX(${swState.offsetX.toFixed(1)}px) scale(${
                    color === hex ? 1.3 : 0.85
                  })`,
                  boxShadow: color === hex ? `0 0 10px ${hex}` : "none",
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Ana Asimetrik Sahne Gridi */}
      <div className="relative z-10 grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
        {/* Sol Sütun: Başlık, Mimari Kart, Teknolojiler & Aksiyon */}
        <div className="flex flex-col justify-between space-y-7 lg:col-span-5">
          <div>
            {/* GÖREV 2: Ana Başlık */}
            <div
              data-build-role="title"
              className="min-h-[1.2em]"
              style={{ opacity: phase2 }}
            >
              <h3 className="font-display text-[clamp(2.6rem,5vw,4.6rem)] font-bold leading-[1] tracking-[-0.03em] text-white">
                <LiveTypoText
                  text={displayName}
                  typoText={TYPOS[p.slug]}
                  progress={progress}
                />
              </h3>
            </div>

            {/* GÖREV 3: Problem -> Çözüm Mimari Açıklama Kartı (Önce Yatay ↔ Sonra Dikey ↕ Genişletilir!) */}
            <div
              data-build-role="desc"
              className="relative mt-6"
              style={{
                opacity: descBox.visible ? 1 : 0,
              }}
            >
              {descBox.isWireframe && (
                <div
                  className="pointer-events-none absolute left-0 top-0 z-20 rounded-2xl border border-dashed"
                  style={{
                    width: `${descBox.widthPct}%`,
                    height: `${descBox.heightPct}%`,
                    borderColor: color,
                    backgroundColor: `${color}0d`,
                  }}
                >
                  <span
                    className="absolute -top-5 left-0 font-mono text-[9px]"
                    style={{ color }}
                  >
                    {descBox.isResizingHoriz
                      ? `↔ Kart Yatay Genişletiliyor: ${descBox.currentW}px`
                      : `↕ Kart Dikey Uzatılıyor: ${descBox.currentH}px`}
                  </span>
                </div>
              )}

              <div
                className="rounded-2xl border border-white/10 bg-[#070b14]/90 p-5 md:p-6 backdrop-blur-xl shadow-2xl transition-all"
                style={{
                  clipPath:
                    phase3 >= 0.95
                      ? "none"
                      : `inset(0 ${(100 - descBox.widthPct).toFixed(1)}% ${(100 - descBox.heightPct).toFixed(1)}% 0 round 16px)`,
                  boxShadow: isBuilding ? `0 0 0 1px ${color}44` : "0 25px 60px -20px rgba(0,0,0,0.8)",
                }}
              >
                {/* Mod / Sekme Seçici: Akış, Problem, Çözüm, Değer */}
                <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                  <div className="flex flex-wrap items-center gap-1 rounded-lg border border-white/10 bg-white/[0.03] p-1 font-mono text-[11px]">
                    <button
                      type="button"
                      onClick={() => setDescTab("flow")}
                      className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 transition ${
                        descTab === "flow"
                          ? "bg-white/15 text-white font-semibold shadow"
                          : "text-white/50 hover:text-white"
                      }`}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
                      <span>{t.flowLabel}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDescTab("problem")}
                      className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 transition ${
                        descTab === "problem"
                          ? "bg-rose-500/20 text-rose-300 font-semibold"
                          : "text-white/50 hover:text-rose-300"
                      }`}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                      <span>{t.problem}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDescTab("solution")}
                      className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 transition ${
                        descTab === "solution"
                          ? "bg-emerald-500/20 text-emerald-300 font-semibold"
                          : "text-white/50 hover:text-emerald-300"
                      }`}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      <span>{t.solution}</span>
                    </button>
                    {whyItMattersText && (
                      <button
                        type="button"
                        onClick={() => setDescTab("impact")}
                        className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 transition ${
                          descTab === "impact"
                            ? "bg-amber-500/20 text-amber-300 font-semibold"
                            : "text-white/50 hover:text-amber-300"
                        }`}
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                        <span>{t.why}</span>
                      </button>
                    )}
                  </div>

                  <span className="font-mono text-[10px] tracking-wider text-white/40 uppercase hidden sm:inline">
                    ENGINEERING SIGNAL
                  </span>
                </div>

                {/* Sekme İçerikleri */}
                {descTab === "flow" && (
                  <div className="space-y-3.5">
                    {/* Problem Bloğu */}
                    <div className="relative rounded-xl border border-rose-500/20 bg-rose-950/20 p-3.5 sm:p-4">
                      <div className="mb-1.5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-rose-500 shadow-[0_0_8px_#f43f5e]" />
                          <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-rose-300">
                            {t.problemBadge}
                          </span>
                        </div>
                        <span className="font-mono text-[10px] text-rose-300/60 hidden sm:inline">
                          {t.problemSubtitle}
                        </span>
                      </div>
                      <p className="text-xs sm:text-[13.5px] leading-relaxed text-slate-300">
                        {problemText}
                      </p>
                    </div>

                    {/* Akış Köprüsü / Ok */}
                    <div className="flex items-center justify-center gap-2 py-0.5">
                      <span className="h-px w-10 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                      <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 font-mono text-[10px] text-white/70">
                        <span>{lang === "az" ? "Mühəndislik Müdaxiləsi" : lang === "en" ? "System Intervention" : "Mimari Müdahale"}</span>
                        <ArrowDown size={11} style={{ color }} />
                      </span>
                      <span className="h-px w-10 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                    </div>

                    {/* Çözüm Bloğu */}
                    <div
                      className="relative rounded-xl border p-3.5 sm:p-4 transition-all"
                      style={{
                        borderColor: `${color}35`,
                        backgroundColor: `${color}0d`,
                      }}
                    >
                      <div className="mb-1.5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className="h-2 w-2 rounded-full"
                            style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}` }}
                          />
                          <span
                            className="font-mono text-[11px] font-semibold uppercase tracking-wider"
                            style={{ color }}
                          >
                            {t.solutionBadge}
                          </span>
                        </div>
                        <span className="font-mono text-[10px] text-white/50 hidden sm:inline">
                          {t.solutionSubtitle}
                        </span>
                      </div>
                      <p className="text-xs sm:text-[13.5px] leading-relaxed text-slate-200">
                        {solutionText}
                      </p>
                    </div>

                    {/* Somut Katma Değer Vurgusu */}
                    {whyItMattersText && (
                      <div className="flex items-start gap-2 rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2 text-xs leading-relaxed text-slate-400">
                        <span className="mt-0.5 shrink-0 font-mono text-[10px] text-amber-400">⚡</span>
                        <span>
                          <strong className="text-slate-300 font-medium">{t.impactBadge}: </strong>
                          {whyItMattersText}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {descTab === "problem" && (
                  <div className="rounded-xl border border-rose-500/25 bg-rose-950/25 p-5 animate-in fade-in duration-200">
                    <div className="mb-2 flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-rose-500 shadow-[0_0_10px_#f43f5e]" />
                      <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-rose-300">
                        {t.problemBadge} — {t.problemSubtitle}
                      </h4>
                    </div>
                    <p className="text-sm leading-relaxed text-slate-200 md:text-[15px]">
                      {problemText}
                    </p>
                  </div>
                )}

                {descTab === "solution" && (
                  <div
                    className="rounded-xl border p-5 animate-in fade-in duration-200"
                    style={{
                      borderColor: `${color}40`,
                      backgroundColor: `${color}12`,
                    }}
                  >
                    <div className="mb-2 flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }}
                      />
                      <h4
                        className="font-mono text-xs font-bold uppercase tracking-wider"
                        style={{ color }}
                      >
                        {t.solutionBadge} — {t.solutionSubtitle}
                      </h4>
                    </div>
                    <p className="text-sm leading-relaxed text-slate-200 md:text-[15px]">
                      {solutionText}
                    </p>
                  </div>
                )}

                {descTab === "impact" && whyItMattersText && (
                  <div className="rounded-xl border border-amber-500/25 bg-amber-950/20 p-5 animate-in fade-in duration-200">
                    <div className="mb-2 flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-amber-400 shadow-[0_0_10px_#f59e0b]" />
                      <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-amber-300">
                        {t.impactBadge} — {t.impactSubtitle}
                      </h4>
                    </div>
                    <p className="text-sm leading-relaxed text-slate-200 md:text-[15px]">
                      {whyItMattersText}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* GÖREV 5A: Teknoloji Rozetleri (1. Rozet Oluşturulur -> Yan Yana Çoğaltılır -> İsimleri Tek Tek Değiştirilir!) */}
          <div
            data-build-role="badges"
            className="flex flex-wrap gap-2"
            style={{ opacity: phase5 > 0.01 ? 1 : 0 }}
          >
            {techs.map((tech, ti) => {
              const st = getCloneAndRenameState(
                phase5,
                ti,
                techs.length,
                tech,
                techs[0] ?? "Modül_01",
                74
              );

              return (
                <span
                  key={tech}
                  className="relative rounded-full border px-3.5 py-1.5 font-mono text-xs transition-colors duration-200"
                  style={{
                    opacity: st.opacity,
                    borderColor: st.isRenaming
                      ? "#ffffff"
                      : st.isCloning
                      ? color
                      : `${color}45`,
                    borderStyle: st.isCloning ? "dashed" : "solid",
                    backgroundColor: st.isRenaming
                      ? `${color}40`
                      : st.isCloning
                      ? `${color}22`
                      : `${color}12`,
                    color: "#f1f5f9",
                    transform: `translate3d(${st.offsetX.toFixed(1)}px, ${st.offsetY.toFixed(1)}px, 0) scale(${st.scale})`,
                  }}
                >
                  {st.displayText}
                </span>
              );
            })}
          </div>

          {/* GÖREV 5B: Projeyi İncele Butonu & Çoğaltılan Ekran Seçici Butonlar (01, 02, 03) */}
          <div
            data-build-role="cta"
            className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6"
            style={{
              opacity: phase5 > 0.01 ? 1 : 0,
              pointerEvents: phase5 < 0.7 ? "none" : "auto",
            }}
          >
            <Link
              href={`/project/${p.slug}`}
              id={`view-${p.slug}`}
              className="group inline-flex items-center gap-3 rounded-full px-6 py-3 font-display text-sm font-semibold text-slate-950 transition hover:scale-[1.03]"
              style={{
                backgroundColor: color,
                boxShadow: `0 12px 35px -8px ${color}88`,
              }}
            >
              <span>{t.view}</span>
              <span className="grid h-6 w-6 place-items-center rounded-full bg-black/20 text-slate-950 transition group-hover:rotate-45">
                <ArrowUpRight size={14} />
              </span>
            </Link>

            {count > 1 && (
              <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] p-1 backdrop-blur-md">
                <button
                  type="button"
                  onClick={() => setActive((c) => (c - 1 + count) % count)}
                  className="grid h-8 w-8 place-items-center rounded-full text-white/60 transition hover:bg-white/10 hover:text-white"
                  aria-label="Önceki ekran"
                >
                  <ChevronLeft size={15} />
                </button>
                {shots.map((_, i) => {
                  const btnState = getCloneAndRenameState(
                    phase5,
                    i,
                    shots.length,
                    `0${i + 1}`,
                    "01",
                    34
                  );
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setActive(i)}
                      className={`rounded-full px-3 py-1 font-mono text-xs transition ${
                        btnState.isRenaming
                          ? "bg-sky-400 text-slate-950 font-bold"
                          : i === active
                          ? "bg-white font-semibold text-slate-950"
                          : "text-white/50 hover:text-white"
                      }`}
                      style={{
                        opacity: btnState.opacity,
                        transform: `translateX(${btnState.offsetX.toFixed(1)}px)`,
                      }}
                    >
                      {btnState.displayText}
                    </button>
                  );
                })}
                <button
                  type="button"
                  onClick={() => setActive((c) => (c + 1) % count)}
                  className="grid h-8 w-8 place-items-center rounded-full text-white/60 transition hover:bg-white/10 hover:text-white"
                  aria-label="Sonraki ekran"
                >
                  <ChevronRight size={15} />
                </button>
              </div>
            )}
          </div>

          <div
            data-build-role="qa"
            className="h-0.5 w-full origin-left rounded-full transition-transform duration-500"
            style={{
              background: `linear-gradient(90deg, ${color}, transparent)`,
              transform: `scaleX(${phase5})`,
            }}
          />
        </div>

        {/* Sağ Sütun: GÖREV 4 — Önce Yatay (↔ Width) Sonra Dikey (↕ Height) Çekilerek Genişletilen Ekran Sahnesi */}
        <div className="flex justify-center lg:col-span-7" style={{ perspective: 1600 }}>
          <TwoAxisResizeFrame
            localP={phase4}
            targetWidthPx={isMobile ? 350 : 960}
            targetHeightPx={isMobile ? 640 : 480}
            accentColor={color}
            className={`w-full ${isMobile ? "max-w-[350px]" : ""}`}
          >
            {isMobile ? (
              /* MaçaGel Akıllı Telefon Çerçevesi */
              <div
                className="group/phone relative mx-auto w-full overflow-hidden rounded-[44px] border-[8px] border-[#181c26] bg-black p-1 transition-transform duration-300 hover:scale-[1.01]"
                style={{
                  boxShadow: `0 50px 130px -25px ${color}55, 0 0 0 1px rgba(255,255,255,0.12)`,
                }}
                onTouchStart={(e) => setTouchStartX(e.targetTouches[0].clientX)}
                onTouchEnd={(e) => {
                  if (touchStartX === null) return;
                  const diff = touchStartX - e.changedTouches[0].clientX;
                  if (diff > 40) setActive((c) => (c + 1) % count);
                  else if (diff < -40) setActive((c) => (c - 1 + count) % count);
                  setTouchStartX(null);
                }}
              >
                <div className="pointer-events-none absolute left-1/2 top-2.5 z-30 flex h-4 w-24 -translate-x-1/2 items-center justify-end rounded-full bg-black/90 px-2">
                  <span className="h-2 w-2 rounded-full border border-white/10 bg-[#070a0f]" />
                </div>

                {/* Sağ-Sol Gezinme Okları & Büyüt Butonu (Hover'da Görünür) */}
                {count > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActive((c) => (c - 1 + count) % count);
                      }}
                      className="absolute left-3 top-1/2 z-40 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/70 text-white opacity-0 shadow-lg backdrop-blur-md transition group-hover/phone:opacity-100 hover:scale-110 hover:bg-white hover:text-black"
                      aria-label="Önceki görsel"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActive((c) => (c + 1) % count);
                      }}
                      className="absolute right-3 top-1/2 z-40 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/70 text-white opacity-0 shadow-lg backdrop-blur-md transition group-hover/phone:opacity-100 hover:scale-110 hover:bg-white hover:text-black"
                      aria-label="Sonraki görsel"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </>
                )}

                {shots.length > 0 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsLightboxOpen(true);
                    }}
                    className="absolute right-4 bottom-7 z-40 flex items-center gap-1.5 rounded-full border border-white/25 bg-black/80 px-3 py-1 font-mono text-[11px] text-white opacity-0 shadow-xl backdrop-blur-md transition group-hover/phone:opacity-100 hover:bg-white hover:text-black hover:scale-105"
                  >
                    <ZoomIn size={13} />
                    <span>{lang === "az" ? "Böyüt" : lang === "en" ? "Zoom" : "Büyüt"}</span>
                  </button>
                )}

                <div
                  className="relative aspect-[9/16] w-full overflow-hidden rounded-[34px] bg-black cursor-pointer"
                  onClick={() => shots.length > 0 && setIsLightboxOpen(true)}
                >
                  {(shots.length ? shots : [undefined]).map((src, i) => (
                    <div
                      key={i}
                      className={
                        i === active
                          ? "relative h-full w-full opacity-100 transition-opacity duration-700"
                          : "pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700"
                      }
                    >
                      {src ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={src}
                          alt={`${p.name} ${i + 1}`}
                          className="h-full w-full object-cover object-top"
                          draggable={false}
                          loading="lazy"
                        />
                      ) : (
                        <Shot slug={p.slug} name={p.name} label={t.placeholder} />
                      )}
                    </div>
                  ))}
                </div>
                <div className="pointer-events-none absolute bottom-2 left-1/2 z-30 h-1 w-28 -translate-x-1/2 rounded-full bg-white/40" />
              </div>
            ) : (
              /* Masaüstü Sinematik Stüdyo Penceresi */
              <div
                className="group/window relative w-full overflow-hidden rounded-2xl border border-white/15 bg-[#070b12] transition-transform duration-300 hover:scale-[1.008]"
                style={{
                  boxShadow: `0 55px 140px -30px ${color}45, 0 0 0 1px rgba(255,255,255,0.08)`,
                }}
                onTouchStart={(e) => setTouchStartX(e.targetTouches[0].clientX)}
                onTouchEnd={(e) => {
                  if (touchStartX === null) return;
                  const diff = touchStartX - e.changedTouches[0].clientX;
                  if (diff > 40) setActive((c) => (c + 1) % count);
                  else if (diff < -40) setActive((c) => (c - 1 + count) % count);
                  setTouchStartX(null);
                }}
              >
                {/* Pencere Üst Barı */}
                <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.03] px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                  </div>
                  <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-4 py-1 font-mono text-[11px] text-white/60">
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                    <span>{p.slug}.app</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    {shots.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setIsLightboxOpen(true)}
                        className="flex items-center gap-1 rounded-md border border-white/15 bg-white/5 px-2 py-0.5 font-mono text-[10.5px] text-white/70 transition hover:bg-white/15 hover:text-white"
                        title={lang === "az" ? "Şəkli böyüt" : lang === "en" ? "Expand image" : "Görseli büyüt"}
                      >
                        <ZoomIn size={12} />
                        <span className="hidden sm:inline">
                          {lang === "az" ? "Böyüt" : lang === "en" ? "Zoom" : "Büyüt"}
                        </span>
                      </button>
                    )}
                    <span className="font-mono text-[11px] tabular-nums text-white/40">
                      0{active + 1} / 0{count}
                    </span>
                  </div>
                </div>

                {/* Sağ-Sol Gezinme Okları (Hover ile belirir) */}
                {count > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActive((c) => (c - 1 + count) % count);
                      }}
                      className="absolute left-4 top-1/2 z-30 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/75 text-white opacity-0 shadow-2xl backdrop-blur-md transition group-hover/window:opacity-100 hover:scale-110 hover:bg-white hover:text-black"
                      aria-label="Önceki ekran"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActive((c) => (c + 1) % count);
                      }}
                      className="absolute right-4 top-1/2 z-30 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/75 text-white opacity-0 shadow-2xl backdrop-blur-md transition group-hover/window:opacity-100 hover:scale-110 hover:bg-white hover:text-black"
                      aria-label="Sonraki ekran"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}

                {/* Tam Oturan Ekran Görüntüsü */}
                <div
                  className="relative w-full overflow-hidden bg-[#05080f] cursor-pointer"
                  onClick={() => shots.length > 0 && setIsLightboxOpen(true)}
                >
                  {shots.length > 0 ? (
                    shots.map((src, i) => (
                      <div
                        key={i}
                        className={
                          i === active
                            ? "relative block w-full opacity-100 transition-opacity duration-700"
                            : "pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700"
                        }
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={src}
                          alt={`${p.name} ${i + 1}`}
                          className="block h-auto w-full transition-transform duration-500 group-hover/window:scale-[1.015]"
                          draggable={false}
                          loading="lazy"
                        />
                      </div>
                    ))
                  ) : (
                    <div className="aspect-[16/10] w-full">
                      <Shot slug={p.slug} name={p.name} label={t.placeholder} />
                    </div>
                  )}
                </div>
              </div>
            )}
          </TwoAxisResizeFrame>
        </div>
      </div>

      {/* Tam Ekran Estetik Lightbox Görsel İnceleme Modalı */}
      {isLightboxOpen && (
        <LightboxModal
          key={`${p.slug}-${active}`}
          isOpen={isLightboxOpen}
          onClose={() => setIsLightboxOpen(false)}
          shots={shots}
          initialIndex={active}
          projectName={p.name}
          lang={lang}
          accentColor={color}
        />
      )}
    </article>
  );
}

export default function Showcase() {
  const { lang } = useLang();
  const t = copy[lang];
  const { progress: liosProgress } = useStageBuild("project-lios", "#a855f7");
  const { progress: heroProgress } = useStageBuild("hero-stage", "#38bdf8");

  const headerVisible = Math.max(
    clamp01((heroProgress - 0.85) / 0.14),
    clamp01((liosProgress - 0.13) / 0.16)
  );

  return (
    <section id="work" className="relative py-20">
      <div
        className="mx-auto max-w-[1580px] px-6 transition-opacity duration-500 md:px-12"
        style={{ opacity: headerVisible }}
      >
        <div className="grid items-end gap-8 border-b border-white/10 pb-14 md:grid-cols-12">
          <div className="md:col-span-7">
            <p className="mb-4 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.3em] text-sky-300">
              <span className="h-px w-10 bg-sky-400" />
              {t.flagshipLabel}
            </p>
            <h2 className="font-display text-[clamp(2.6rem,6vw,5.4rem)] font-bold leading-[0.98] tracking-[-0.03em] text-white">
              {t.selected}
            </h2>
          </div>
          <p className="max-w-md text-lg leading-relaxed text-slate-300/70 md:col-span-5">
            {t.selectedDesc.replace("{n}", String(flagships.length))}
          </p>
        </div>
      </div>

      {flagships.map((p, i) => (
        <Scene key={p.slug} p={p} index={i} total={flagships.length} />
      ))}
    </section>
  );
}
