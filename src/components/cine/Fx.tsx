"use client";

import React from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { useLang } from "@/providers/LangProvider";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });
  return (
    <motion.div
      style={{ scaleX }}
      className="fixed left-0 top-0 z-[60] h-[2px] w-full origin-left bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.35)]"
    />
  );
}

export function FrameFx() {
  return (
    <>
      <div className="grain pointer-events-none fixed inset-0 z-[55]" aria-hidden />
      <div className="vignette pointer-events-none fixed inset-0 z-[54]" aria-hidden />
    </>
  );
}

export function Marquee({ items }: { items: string[] }) {
  const row = [...items, ...items];
  return (
    <div className="relative overflow-hidden border-y border-white/10 py-6" aria-hidden>
      <div className="marquee flex w-max gap-12 whitespace-nowrap font-display text-4xl font-bold uppercase tracking-tight text-transparent md:text-6xl [-webkit-text-stroke:1px_rgba(255,255,255,0.22)]">
        {row.map((t, i) => (
          <span key={i} className="flex items-center gap-12">
            {t}
            <span className="text-blue-400/60">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export function LangToggle() {
  const { lang, setLang } = useLang();
  
  const langs: { id: "tr" | "az" | "en"; label: string }[] = [
    { id: "tr", label: "TR" },
    { id: "az", label: "AZ" },
    { id: "en", label: "EN" },
  ];

  return (
    <div className="flex items-center gap-1">
      {langs.map((l) => (
        <button
          key={l.id}
          type="button"
          onClick={() => setLang(l.id)}
          className={`rounded-full px-2.5 py-0.5 font-mono text-[11px] font-semibold transition ${
            lang === l.id
              ? "bg-blue-600 text-white shadow-sm"
              : "text-white/60 hover:text-white hover:bg-white/10"
          }`}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
