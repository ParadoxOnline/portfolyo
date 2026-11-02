"use client";

import React, { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { useLang } from "@/providers/LangProvider";
import { copy, flagships, getShots } from "@/data/showcase";
import { LiveTypoText, useStageBuild } from "@/components/canvas/LiveBuilderSystem";
import {
  clamp01,
  getCloneAndRenameState,
  getTwoAxisBoxState,
  TwoAxisResizeFrame,
} from "@/components/canvas/DevBuildPrimitives";

const HERO_TYPOS = {
  tr: "Web sitesi değil, sıradan sayfa",
  az: "Veb-sayt deyil, adi səhifə",
  en: "I build systems, static pages",
};

const DECK_PROJECTS = flagships.filter((f) => f.slug !== "macagel");

export default function Hero() {
  const { lang } = useLang();
  const t = copy[lang];
  const sectionRef = useRef<HTMLElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  const { progress, activeColor } = useStageBuild("hero-stage", "#38bdf8");

  useEffect(() => {
    const id = setInterval(() => {
      setActiveIdx((i) => (i + 1) % DECK_PROJECTS.length);
    }, 4000);
    return () => clearInterval(id);
  }, []);

  // 0'dan Profesyonel Yazılımcı İnşa Fazları:
  // Faz 1 (0.13 -> 0.28): Üst bar, menü çoğaltma & tema rengi
  const phase1 = clamp01((progress - 0.13) / 0.15);
  // Faz 2 (0.26 -> 0.50): Ana başlık yazımı & yazım hatası düzeltme
  const phase2 = clamp01((progress - 0.25) / 0.08);
  // Faz 3 (0.48 -> 0.66): Manifesto bloğunu önce yatay ↔ sonra dikey ↕ açma
  const phase3 = clamp01((progress - 0.48) / 0.18);
  const descBox = getTwoAxisBoxState(phase3, 560, 110);
  // Faz 4 (0.64 -> 0.84): 3D Vitrin Penceresini önce yatay ↔ sonra dikey ↕ çekerek büyütme
  const phase4 = clamp01((progress - 0.64) / 0.20);
  // Faz 5 (0.82 -> 0.97): Butonları, metrikleri ve 7'li proje şeridini çoğaltıp isimlendirme
  const phase5 = clamp01((progress - 0.82) / 0.15);

  const manifestoChars = Math.floor(
    t.manifesto.length * clamp01((phase3 - 0.25) / 0.75)
  );
  const fullHeadline = `${t.h1a} ${t.h1b}`;
  const currentProject = DECK_PROJECTS[activeIdx] ?? DECK_PROJECTS[0];
  const nextProject = DECK_PROJECTS[(activeIdx + 1) % DECK_PROJECTS.length];

  // 2 CTA Butonu Çoğaltma & İsimlendirme Durumları
  const ctaPrimaryLabel =
    lang === "tr" ? "Amiral Gemisi Sistemleri İncele" : "Explore Flagship Systems";
  const ctaSecondaryLabel = t.nav.contact;
  const cta1State = getCloneAndRenameState(
    phase5,
    0,
    2,
    ctaPrimaryLabel,
    ctaPrimaryLabel,
    180
  );
  const cta2State = getCloneAndRenameState(
    phase5,
    1,
    2,
    ctaSecondaryLabel,
    lang === "tr" ? "Buton_Kopya" : "Button_Copy",
    180
  );

  // 3 Metrik Kartı Çoğaltma & İsimlendirmeVerisi
  const heroMetrics = [
    { val: `0${flagships.length}`, label: t.stat2, suffix: "" },
    { val: "3", label: t.stat3, suffix: "+" },
    { val: "100", label: lang === "tr" ? "Canlı Mimari" : "Production", suffix: "%" },
  ];

  return (
    <section
      ref={sectionRef}
      id="top"
      data-build-stage="hero-stage"
      className="relative flex min-h-screen flex-col justify-between overflow-hidden px-6 pb-12 pt-28 md:px-12 lg:pt-32"
    >
      {/* Sinematik Volümetrik Sahne Işıkları */}
      <div
        className="pointer-events-none absolute -top-[20vmin] left-1/4 h-[85vmin] w-[85vmin] -translate-x-1/2 rounded-full blur-[150px] transition-opacity duration-500"
        style={{
          backgroundColor: `${activeColor}1c`,
          opacity: phase1,
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute right-[-10vmin] top-1/3 h-[75vmin] w-[75vmin] rounded-full blur-[140px] transition-opacity duration-500"
        style={{
          backgroundColor: `${activeColor}24`,
          opacity: phase1,
        }}
        aria-hidden
      />
      <div
        className="grid-floor pointer-events-none absolute inset-x-0 bottom-0 h-[42%] transition-opacity duration-500"
        style={{ opacity: phase1 * 0.45 }}
        aria-hidden
      />

      <div className="relative z-10 mx-auto grid w-full max-w-[1540px] flex-1 items-center gap-12 lg:grid-cols-12 lg:gap-10">
        {/* Sol Sütun */}
        <div className="lg:col-span-6">
          {/* GÖREV 1: Üst Kicker & Renk Paleti Noktası */}
          <div
            className="mb-7 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 backdrop-blur-md"
            style={{
              opacity: phase1,
              transform: `translate3d(0, ${(1 - phase1) * 14}px, 0)`,
            }}
          >
            <span
              data-build-role="color"
              className="h-2.5 w-2.5 rounded-full transition-all duration-500"
              style={{
                backgroundColor: activeColor,
                boxShadow: `0 0 14px ${activeColor}`,
              }}
            />
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/70">
              {t.kicker}
            </span>
          </div>

          {/* GÖREV 2: Ana Başlık Yazımı */}
          <div
            data-build-role="title"
            className="min-h-[2.1em]"
            style={{ opacity: phase2 }}
          >
            <h1 className="font-display text-[clamp(2.8rem,6.2vw,6.2rem)] font-bold leading-[0.98] tracking-[-0.035em] text-white">
              <LiveTypoText
                text={fullHeadline}
                typoText={HERO_TYPOS[lang]}
                progress={progress}
                gradientAfter={t.h1a.length + 1}
              />
            </h1>
          </div>

          {/* GÖREV 3: Manifesto Bloğu (Önce Yatay ↔ Sonra Dikey ↕ Genişletilir) */}
          <div
            data-build-role="desc"
            className="relative mt-8 min-h-[3.6em] max-w-xl"
            style={{
              opacity: descBox.visible ? 1 : 0,
            }}
          >
            {descBox.isWireframe && (
              <div
                className="pointer-events-none absolute left-0 top-0 z-20 rounded-lg border border-dashed border-sky-400/70 bg-sky-400/[0.05]"
                style={{
                  width: `${descBox.widthPct}%`,
                  height: `${descBox.heightPct}%`,
                }}
              >
                <span className="absolute -top-5 left-0 font-mono text-[9px] text-sky-300">
                  {descBox.isResizingHoriz
                    ? `↔ width: ${descBox.currentW}px`
                    : `↕ height: ${descBox.currentH}px`}
                </span>
              </div>
            )}
            <p className="text-lg leading-[1.7] text-slate-300/75 md:text-xl">
              {t.manifesto.slice(0, Math.max(0, manifestoChars))}
            </p>
          </div>

          {/* GÖREV 5A: 2 Aksiyon Butonu (1. Buton Oluşturulur -> 2. Buton Ondan Çoğaltılır ve İsmi Değiştirilir!) */}
          <div
            data-build-role="cta"
            className="mt-10 flex flex-wrap items-center gap-4"
            style={{
              opacity: phase5 > 0.01 ? 1 : 0,
              pointerEvents: phase5 < 0.7 ? "none" : "auto",
            }}
          >
            <a
              href="#work"
              className="group relative inline-flex items-center gap-3 rounded-full bg-white px-7 py-3.5 font-display text-sm font-semibold tracking-tight text-slate-950 shadow-[0_0_40px_rgba(255,255,255,0.25)] transition hover:scale-[1.03] hover:shadow-[0_0_60px_rgba(125,211,252,0.5)]"
              style={{
                opacity: cta1State.opacity,
                transform: `translate3d(${cta1State.offsetX.toFixed(1)}px, ${cta1State.offsetY.toFixed(1)}px, 0) scale(${cta1State.scale})`,
              }}
            >
              <span>{cta1State.displayText}</span>
              <span className="grid h-6 w-6 place-items-center rounded-full bg-slate-950 text-white transition group-hover:rotate-45">
                <ArrowUpRight size={14} />
              </span>
            </a>

            <a
              href="#contact"
              className={`relative inline-flex items-center gap-2 rounded-full border px-6 py-3.5 text-sm font-medium backdrop-blur-md transition ${
                cta2State.isCloning
                  ? "border-dashed border-sky-300 bg-white text-slate-950 font-semibold shadow-[0_0_25px_rgba(56,189,248,0.5)]"
                  : cta2State.isRenaming
                  ? "border-sky-400 bg-sky-500/25 text-sky-100 ring-2 ring-sky-400/60"
                  : "border-white/15 bg-white/[0.04] text-white/80 hover:border-white/35 hover:bg-white/[0.08] hover:text-white"
              }`}
              style={{
                opacity: cta2State.opacity,
                transform: `translate3d(${cta2State.offsetX.toFixed(1)}px, ${cta2State.offsetY.toFixed(1)}px, 0) scale(${cta2State.scale})`,
              }}
            >
              <span>{cta2State.displayText}</span>
              {cta2State.badgeText && (
                <span className="pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-sky-400 px-1.5 py-0.5 font-mono text-[9px] font-bold text-slate-950 shadow">
                  {cta2State.badgeText}
                </span>
              )}
            </a>
          </div>

          {/* GÖREV 5B: 3 Metrik Kartı (1. Karttan 3'e Çoğaltılır ve Değerleri Tek Tek Değiştirilir) */}
          <div
            data-build-role="qa"
            className="mt-12 grid max-w-xl grid-cols-3 gap-4 border-t border-white/10 pt-8"
            style={{
              opacity: phase5 > 0.02 ? 1 : 0,
            }}
          >
            {heroMetrics.map((m, idx) => {
              const st = getCloneAndRenameState(
                phase5,
                idx,
                heroMetrics.length,
                m.label,
                heroMetrics[0].label,
                135
              );
              const valDisplay = st.isCloning ? heroMetrics[0].val : m.val;

              return (
                <div
                  key={m.label}
                  className={`relative rounded-xl p-2 transition-colors ${
                    st.isRenaming
                      ? "bg-sky-500/15 ring-1 ring-sky-400/60"
                      : st.isCloning
                      ? "border border-dashed border-sky-400/45 bg-sky-400/[0.05]"
                      : ""
                  }`}
                  style={{
                    opacity: st.opacity,
                    transform: `translate3d(${st.offsetX.toFixed(1)}px, ${st.offsetY.toFixed(1)}px, 0) scale(${st.scale})`,
                  }}
                >
                  <div className="font-display text-3xl font-bold tracking-tight text-white md:text-4xl">
                    {valDisplay}
                    {!st.isCloning && m.suffix && (
                      <span className={idx === 1 ? "text-sky-400" : "text-emerald-400"}>
                        {m.suffix}
                      </span>
                    )}
                  </div>
                  <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">
                    {st.displayText}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sağ Sütun: GÖREV 4 — Önce Yatay (↔ Width), Sonra Dikey (↕ Height) Çekilerek Genişletilen 3D Vitrin */}
        <div className="lg:col-span-6" style={{ perspective: 1600 }}>
          <TwoAxisResizeFrame
            localP={phase4}
            targetWidthPx={820}
            targetHeightPx={460}
            accentColor={activeColor}
            className="mx-auto w-full max-w-[820px]"
          >
            {/* Arka Planda Derinlik Katmanı (İkincil Kart) */}
            {nextProject && (
              <div
                className="pointer-events-none absolute -right-4 -top-5 hidden w-[92%] overflow-hidden rounded-2xl border border-white/10 bg-[#080d18]/60 blur-[1px] transition-transform duration-700 sm:block"
                style={{
                  opacity: phase4 * 0.35,
                  transform: "translateZ(-60px) scale(0.95) rotate(-2deg)",
                }}
                aria-hidden
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={getShots(nextProject.slug)[0]}
                  alt=""
                  className="block h-auto w-full"
                />
              </div>
            )}

            {/* Ön Plan Ana 3D Cam Sahne Penceresi */}
            <div
              className="relative overflow-hidden rounded-2xl border border-white/15 bg-[#070b12] shadow-[0_50px_140px_-25px_rgba(0,0,0,0.95)]"
              style={{
                boxShadow: `0 50px 130px -30px ${activeColor}40, 0 0 0 1px rgba(255,255,255,0.08)`,
              }}
            >
              {/* Üst Titanyum Pencere Çubuğu */}
              <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.03] px-4 py-3 backdrop-blur-md">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                </div>
                <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-4 py-1 font-mono text-[11px] text-white/70">
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: activeColor }}
                  />
                  <span>{currentProject?.name}</span>
                  <span className="text-white/35">· {currentProject?.category}</span>
                </div>
                <span className="font-mono text-[11px] tabular-nums text-white/40">
                  0{activeIdx + 1} / 0{DECK_PROJECTS.length}
                </span>
              </div>

              {/* Ekran Görüntüsü Alanı */}
              <div className="relative w-full overflow-hidden bg-[#05080f]">
                {DECK_PROJECTS.map((proj, i) => {
                  const src = getShots(proj.slug)[0];
                  return src ? (
                    <div
                      key={proj.slug}
                      className={
                        i === activeIdx
                          ? "relative block w-full opacity-100 transition-opacity duration-700"
                          : "pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700"
                      }
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={src}
                        alt={proj.name}
                        draggable={false}
                        className="block h-auto w-full"
                      />
                    </div>
                  ) : null;
                })}
              </div>
            </div>

            {/* Sahne Altı Canlı Proje Seçici Dock */}
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
              {DECK_PROJECTS.map((proj, i) => (
                <button
                  key={proj.slug}
                  type="button"
                  onClick={() => setActiveIdx(i)}
                  className={`rounded-full px-3.5 py-1.5 font-mono text-[11px] transition-all ${
                    i === activeIdx
                      ? "border border-white/30 bg-white/12 text-white shadow-sm"
                      : "border border-transparent bg-white/[0.03] text-white/45 hover:text-white/80"
                  }`}
                >
                  {proj.name}
                </button>
              ))}
            </div>
          </TwoAxisResizeFrame>
        </div>
      </div>

      {/* GÖREV 5C: Alt 7 Amiral Gemisi Hızlı Geçiş Şeridi (1. Butondan 7'ye Çoğaltılır ve İsimleri Değiştirilir!) */}
      <div
        data-build-role="badges"
        className="relative z-10 mx-auto mt-14 w-full max-w-[1540px]"
        style={{
          opacity: phase5 > 0.01 ? 1 : 0,
          pointerEvents: phase5 < 0.7 ? "none" : "auto",
        }}
      >
        <div
          data-build-role="grid"
          className="grid grid-cols-2 gap-3 border-t border-white/10 pt-6 sm:grid-cols-4 lg:grid-cols-7"
        >
          {flagships.map((f, i) => {
            const st = getCloneAndRenameState(
              phase5,
              i,
              flagships.length,
              f.name,
              flagships[0].name,
              110
            );

            return (
              <a
                key={f.slug}
                href={`#project-${f.slug}`}
                className={`group relative flex items-center justify-between rounded-xl border px-3.5 py-2.5 transition ${
                  st.isRenaming
                    ? "border-sky-400 bg-sky-500/20 ring-1 ring-sky-400/60"
                    : st.isCloning
                    ? "border-dashed border-sky-400/50 bg-sky-400/[0.06]"
                    : "border-white/[0.06] bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.05]"
                }`}
                style={{
                  opacity: st.opacity,
                  transform: `translate3d(${st.offsetX.toFixed(1)}px, ${st.offsetY.toFixed(1)}px, 0) scale(${st.scale})`,
                }}
              >
                <div className="truncate">
                  <span className="mr-2 font-mono text-[10px] text-sky-400/80">
                    0{st.isCloning ? 1 : i + 1}
                  </span>
                  <span className="font-display text-xs font-semibold text-white/85 group-hover:text-white">
                    {st.displayText}
                  </span>
                </div>
                <ArrowUpRight
                  size={13}
                  className="shrink-0 text-white/30 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white"
                />
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
