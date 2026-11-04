"use client";

import React, { useState } from "react";
import Link from "next/link";
import { INSIGHTS_DATA } from "@/data/ecosystem";

const categories = ["Tümü", "GEO / Yapay Zeka Arama", "Core Web Vitals", "Ajans Modelleri", "Lokal SEO"];

export default function InsightsPage() {
  const [selectedCat, setSelectedCat] = useState("Tümü");

  const filtered =
    selectedCat === "Tümü" ? INSIGHTS_DATA : INSIGHTS_DATA.filter((a) => a.category === selectedCat);

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-[760px] px-4 pb-24 pt-28 sm:px-6">
        <nav aria-label="Konum" className="font-mono text-[11px] text-zinc-500">
          <Link href="/" className="hover:text-zinc-300">Ana sayfa</Link>
          <span className="mx-2 text-zinc-700">/</span>
          <span>Yazılar</span>
        </nav>

        <header className="mt-6">
          <h1 className="font-display text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">
            Sektörel vaka analizleri
          </h1>
          <p className="mt-4 max-w-[62ch] text-base leading-relaxed text-slate-400">
            Yapay zeka arama motorları (Perplexity, ChatGPT Search), Core Web Vitals ve gerçek piyasa vaka
            çalışmalarından çıkarılmış teknik notlar.
          </p>
        </header>

        <div role="group" aria-label="Kategori filtresi" className="mt-8 flex flex-wrap gap-x-5 gap-y-2 border-b border-white/10 pb-3">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              aria-pressed={selectedCat === cat}
              onClick={() => setSelectedCat(cat)}
              className={`text-[13px] transition focus:outline-none focus-visible:underline ${
                selectedCat === cat ? "font-medium text-sky-300" : "text-slate-500 hover:text-slate-300"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <ol className="divide-y divide-white/10">
          {filtered.map((art) => (
            <li key={art.slug} className="py-7">
              <p className="font-mono text-[11px] tabular-nums text-zinc-500">
                {art.category} · {art.readTime} · {art.date}
              </p>
              <h2 className="mt-2 font-display text-xl font-semibold leading-snug text-white sm:text-2xl">
                <Link
                  href={`/insights/${art.slug}`}
                  className="hover:text-sky-300 focus:outline-none focus-visible:underline"
                >
                  {art.title}
                </Link>
              </h2>
              <p className="mt-2 max-w-[65ch] text-[15px] leading-relaxed text-slate-400">{art.summary}</p>
              {art.marketCaseStudy && (
                <p className="mt-3 max-w-[65ch] text-[13px] leading-relaxed text-slate-500">
                  <span className="text-slate-300">{art.marketCaseStudy.clientType}:</span>{" "}
                  <span className="tabular-nums">{art.marketCaseStudy.concreteResult}</span>
                </p>
              )}
            </li>
          ))}
        </ol>
        {filtered.length === 0 && <p className="py-8 text-sm text-slate-500">Bu kategoride yazı yok.</p>}
      </div>
    </div>
  );
}
