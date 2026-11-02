"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useLang } from "@/providers/LangProvider";
import { copy, describe, getShots, pick } from "@/data/showcase";
import type { Project } from "@/data/projects";
import Shot from "@/components/cine/Shot";

function Reveal({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const rotateX = useTransform(scrollYProgress, [0, 1], [38, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.82, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);
  return (
    <div ref={ref} style={{ perspective: 1600 }}>
      <motion.div style={{ rotateX, scale, opacity, transformOrigin: "50% 100%" }}>{children}</motion.div>
    </div>
  );
}

export default function ProjectContent({ project: p, nextProject }: { project: Project; nextProject: Project }) {
  const { lang } = useLang();
  const t = copy[lang];
  const shots = getShots(p.slug);
  const blocks = [
    {
      step: "01",
      title: t.problemBadge,
      sub: t.problemSubtitle,
      body: pick(p.problem, lang),
      tagClass: "text-rose-400 border-rose-500/30 bg-rose-500/10",
      dotClass: "bg-rose-500",
      borderClass: "border-rose-500/20 hover:border-rose-500/40",
    },
    {
      step: "02",
      title: t.solutionBadge,
      sub: t.solutionSubtitle,
      body: pick(p.solution, lang),
      tagClass: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
      dotClass: "bg-emerald-400",
      borderClass: "border-emerald-500/20 hover:border-emerald-500/40",
    },
    {
      step: "03",
      title: t.impactBadge,
      sub: t.impactSubtitle,
      body: pick(p.whyItMatters, lang),
      tagClass: "text-amber-400 border-amber-500/30 bg-amber-500/10",
      dotClass: "bg-amber-400",
      borderClass: "border-amber-500/20 hover:border-amber-500/40",
    },
  ].filter((b) => b.body);

  return (
    <article className="relative">
      <section className="relative flex min-h-[90vh] flex-col justify-end overflow-hidden px-6 pb-20 pt-40 md:px-12">
        <div className="aurora pointer-events-none absolute right-[-20vmin] top-[-10vmin] h-[90vmin] w-[90vmin]" aria-hidden />
        <div className="relative z-10 mx-auto w-full max-w-[1500px]">
          <Link href="/#work" className="mb-12 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-white/50 transition hover:text-white">
            <ArrowLeft size={14} /> {t.back}
          </Link>
          <p className="mb-5 font-mono text-[11px] uppercase tracking-[0.3em] text-sky-200/80">
            {p.category} · {p.year}
          </p>
          <h1 className="font-display text-[clamp(3rem,11vw,10rem)] font-bold leading-[0.95] tracking-tighter text-white">
            {p.name}
          </h1>
          <p className="mt-8 max-w-2xl text-xl leading-relaxed text-white/65 md:text-2xl">{describe(p, lang)}</p>
        </div>
      </section>

      {blocks.length > 0 && (
        <section className="mx-auto grid max-w-[1500px] gap-8 px-6 py-20 md:grid-cols-3 md:px-12">
          {blocks.map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              className={`rounded-2xl border ${b.borderClass} bg-white/[0.02] p-6 backdrop-blur-md transition-all duration-300`}
            >
              <div className="mb-4 flex items-center justify-between gap-2">
                <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-wider ${b.tagClass}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${b.dotClass}`} />
                  {b.title}
                </span>
                {b.sub && (
                  <span className="font-mono text-[11px] text-white/40">
                    {b.sub}
                  </span>
                )}
              </div>
              <p className="text-base leading-relaxed text-white/80">{b.body}</p>
            </motion.div>
          ))}
        </section>
      )}

      <section className="mx-auto flex max-w-[1300px] flex-col gap-24 px-6 py-24 md:px-12">
        <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-white/40">{t.gallery}</p>
        {(shots.length ? shots : [undefined]).map((src, i) => (
          <Reveal key={i}>
            {p.slug === "macagel" ? (
              <div className="relative mx-auto w-full max-w-[360px] overflow-hidden rounded-[44px] border-[8px] border-[#181c26] bg-black p-1 shadow-[0_50px_140px_-25px_rgba(34,197,94,0.35),0_0_0_1px_rgba(255,255,255,0.15)] ring-1 ring-white/10">
                {/* Dynamic Island */}
                <div className="pointer-events-none absolute left-1/2 top-2.5 z-30 flex h-4 w-24 -translate-x-1/2 items-center justify-end rounded-full bg-black/90 px-2 shadow-inner">
                  <span className="h-2 w-2 rounded-full border border-white/10 bg-[#070a0f]" />
                </div>
                <div className="relative aspect-[9/18] w-full overflow-hidden rounded-[34px] bg-black flex items-center justify-center">
                  {src ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={src}
                      alt={`${p.name} mobil ekranı ${i + 1}`}
                      loading="lazy"
                      draggable={false}
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <Shot slug={p.slug} name={p.name} label={t.placeholder} />
                  )}
                </div>
                {/* Home Indicator */}
                <div className="pointer-events-none absolute bottom-2 left-1/2 z-30 h-1 w-28 -translate-x-1/2 rounded-full bg-white/40" />
              </div>
            ) : (
              <div className="overflow-hidden rounded-2xl border border-white/15 bg-[#070a0f] shadow-[0_60px_160px_-30px_rgba(125,211,252,.5)]">
                <div className="flex items-center gap-2 border-b border-white/10 bg-white/[0.04] px-4 py-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                </div>
                {src ? (
                  <div className="relative w-full overflow-hidden bg-[#070a0f]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt={`${p.name} ekran görüntüsü ${i + 1}`}
                      loading="lazy"
                      draggable={false}
                      className="w-full h-auto block object-contain"
                    />
                  </div>
                ) : (
                  <div className="aspect-[16/10]">
                    <Shot slug={p.slug} name={p.name} label={t.placeholder} />
                  </div>
                )}
              </div>
            )}
          </Reveal>
        ))}
      </section>

      <Link
        href={`/project/${nextProject.slug}`}
        className="group relative block overflow-hidden border-t border-white/10 px-6 py-32 md:px-12"
      >
        <div className="mx-auto flex max-w-[1500px] items-end justify-between gap-6">
          <div>
            <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.3em] text-white/40">{t.next}</p>
            <p className="font-display text-[clamp(2.5rem,8vw,7rem)] font-bold leading-none tracking-tighter text-white transition group-hover:translate-x-4">
              {nextProject.name}
            </p>
          </div>
          <ArrowRight className="mb-2 h-10 w-10 text-white/60 transition group-hover:translate-x-3 group-hover:text-white md:h-16 md:w-16" />
        </div>
      </Link>
    </article>
  );
}
