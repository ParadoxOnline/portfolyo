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
            Yazılar ve Teknik Notlar
          </h1>
          <p className="mt-4 max-w-[62ch] text-base leading-relaxed text-slate-400">
            Bu bölüm şimdilik boş bırakılmıştır. İlerleyen dönemde bizzat geliştirdiğim ve ölçümlediğim
            projelerden derlenen teknik notlar burada yayınlanacaktır.
          </p>
        </header>

        {INSIGHTS_DATA.length > 0 ? (
          <>
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
          </>
        ) : (
          <div className="mt-10 rounded-xl border border-white/10 bg-white/[0.02] p-6">
            <p className="text-sm leading-relaxed text-slate-300">
              Şu anda yayınlanmış yazı bulunmuyor. Canlı projelerimi ve geliştirici araçlarımı incelemek için ana sayfaya dönebilirsiniz.
            </p>
            <div className="mt-5 flex flex-wrap gap-4">
              <Link
                href="/"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
              >
                Ana sayfaya dön
              </Link>
              <Link
                href="/#work"
                className="rounded-lg border border-white/15 px-4 py-2 text-sm text-slate-200 hover:bg-white/5"
              >
                Projeleri incele
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
