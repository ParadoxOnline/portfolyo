"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useLang } from "@/providers/LangProvider";
import { copy, describe, getShots, others } from "@/data/showcase";
import Shot from "./Shot";

export default function Reel() {
  const { lang } = useLang();
  const t = copy[lang];
  const ref = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [dist, setDist] = useState(0);
  const [vh, setVh] = useState(800);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -dist]);
  const barW = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  useEffect(() => {
    const measure = () => {
      if (!track.current) return;
      setDist(Math.max(0, track.current.scrollWidth - window.innerWidth));
      setVh(window.innerHeight);
    };
    measure();
    window.addEventListener("resize", measure);
    const ro = new ResizeObserver(measure);
    if (track.current) ro.observe(track.current);
    return () => {
      window.removeEventListener("resize", measure);
      ro.disconnect();
    };
  }, [lang]);

  return (
    <section ref={ref} id="reel" className="relative" style={{ height: dist + vh }}>
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <div className="mb-10 flex items-end justify-between px-6 md:px-12">
          <h2 className="max-w-3xl font-display text-[clamp(2rem,5vw,4.5rem)] font-bold leading-[1] tracking-tighter text-white">
            {t.reel}
          </h2>
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.3em] text-white/40 md:block">
            {t.reelHint}
          </span>
        </div>

        <motion.div ref={track} style={{ x }} className="flex w-max gap-6 px-6 md:gap-10 md:px-12">
          {others.map((p, i) => (
            <Link
              key={p.slug}
              href={`/project/${p.slug}`}
              id={`reel-${p.slug}`}
              className="group relative block w-[78vw] shrink-0 md:w-[34vw]"
            >
              <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-white/10 bg-[#070a0f] transition duration-500 group-hover:-translate-y-2 group-hover:border-sky-200/50 group-hover:shadow-[0_40px_100px_-30px_rgba(125,211,252,.6)]">
                <div className="h-full w-full transition duration-700 group-hover:scale-105">
                  <Shot slug={p.slug} name={p.name} src={getShots(p.slug)[0]} label={t.placeholder} />
                </div>
                <span className="absolute left-4 top-4 rounded-full bg-black/60 px-3 py-1 font-mono text-[10px] tracking-widest text-white/70 backdrop-blur">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <div className="mt-5 flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-display text-xl font-bold tracking-tight text-white md:text-2xl">{p.name}</h3>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.25em] text-sky-200/70">
                    {p.category}
                  </p>
                </div>
              </div>
              <p className="mt-3 line-clamp-3 max-w-md text-sm leading-relaxed text-white/55">{describe(p, lang)}</p>
            </Link>
          ))}
        </motion.div>

        <div className="mx-6 mt-12 h-px bg-white/10 md:mx-12">
          <motion.div style={{ width: barW }} className="h-px bg-gradient-to-r from-sky-300 to-sky-200" />
        </div>
      </div>
    </section>
  );
}
