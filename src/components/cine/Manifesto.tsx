"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useLang } from "@/providers/LangProvider";
import { copy, flagships } from "@/data/showcase";

function Word({ word, range, progress }: { word: string; range: [number, number]; progress: MotionValue<number> }) {
  const opacity = useTransform(progress, range, [0.12, 1]);
  const y = useTransform(progress, range, [14, 0]);
  const blur = useTransform(progress, range, ["blur(6px)", "blur(0px)"]);
  return (
    <motion.span style={{ opacity, y, filter: blur }} className="mr-[0.25em] inline-block">
      {word}
    </motion.span>
  );
}

export default function Manifesto() {
  const { lang } = useLang();
  const t = copy[lang];
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const words = t.manifesto.split(" ");

  return (
    <section ref={ref} id="manifesto" className="relative h-[260vh]">
      <div className="sticky top-0 flex h-screen items-center px-6 md:px-16">
        <p className="mx-auto max-w-6xl font-display text-[clamp(1.8rem,4.6vw,4.4rem)] font-semibold leading-[1.15] tracking-tight text-white">
          {words.map((w, i) => {
            const s = (i / words.length) * 0.8;
            return <Word key={i} word={w} range={[s, s + 0.12]} progress={scrollYProgress} />;
          })}
        </p>
        <div className="absolute bottom-12 left-6 right-6 flex justify-between font-mono text-[10px] uppercase tracking-[0.3em] text-white/40 md:left-16 md:right-16">
          <span>
            {flagships.length} {t.stat2}
          </span>
          <span>01 / {String(flagships.length).padStart(2, "0")}</span>
        </div>
      </div>
    </section>
  );
}
