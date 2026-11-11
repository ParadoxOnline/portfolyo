import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { INSIGHTS_DATA } from "@/data/ecosystem";
import { AUTHOR_PROFILE, SITE_URL } from "@/lib/geo";

export function generateStaticParams() {
  return INSIGHTS_DATA.map((article) => ({
    slug: article.slug,
  }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = INSIGHTS_DATA.find((a) => a.slug === slug);
  if (!article) return { title: "Yazı Bulunamadı" };

  return {
    title: article.title,
    description: article.summary,
    keywords: article.tags,
    authors: [{ name: article.author, url: SITE_URL }],
    alternates: { canonical: `/insights/${article.slug}` },
    openGraph: {
      title: `${article.title} | ${AUTHOR_PROFILE.name}`,
      description: article.summary,
      url: `${SITE_URL}/insights/${article.slug}`,
      type: "article",
      locale: "tr_TR",
      siteName: AUTHOR_PROFILE.name,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.summary,
    },
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = INSIGHTS_DATA.find((a) => a.slug === slug);

  if (!article) {
    notFound();
  }

  const cs = article.marketCaseStudy;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TechArticle",
        headline: article.title,
        description: article.summary,
        articleSection: article.category,
        keywords: article.tags.join(", "),
        inLanguage: "tr",
        url: `${SITE_URL}/insights/${article.slug}`,
        author: {
          "@type": "Person",
          "@id": `${SITE_URL}/#person`,
          name: article.author,
          url: SITE_URL,
        },
        publisher: {
          "@type": "Person",
          "@id": `${SITE_URL}/#person`,
          name: AUTHOR_PROFILE.name,
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Yazılar", item: `${SITE_URL}/insights` },
          {
            "@type": "ListItem",
            position: 3,
            name: article.title,
            item: `${SITE_URL}/insights/${article.slug}`,
          },
        ],
      },
    ],
  };

  return (
    <article className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-[760px] px-4 pb-24 pt-28 sm:px-6">
        <nav aria-label="Konum" className="font-mono text-[11px] text-zinc-500">
          <Link href="/" className="hover:text-zinc-300">Ana sayfa</Link>
          <span className="mx-2 text-zinc-700">/</span>
          <Link href="/insights" className="hover:text-zinc-300">Yazılar</Link>
        </nav>

        <header className="mt-6 border-b border-white/10 pb-8">
          <p className="font-mono text-[11px] tabular-nums text-zinc-500">
            {article.category} · {article.readTime} · {article.date}
          </p>
          <h1 className="mt-3 font-display text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">
            {article.title}
          </h1>
          <p className="mt-5 max-w-[62ch] text-lg leading-relaxed text-slate-300">{article.summary}</p>
          <p className="mt-5 text-[13px] text-slate-500">Yazar: {article.author}</p>
        </header>

        {cs && (
          <section aria-labelledby="vaka" className="mt-10">
            <h2 id="vaka" className="font-display text-xl font-semibold text-white">
              Vaka çalışması: {cs.clientType}
            </h2>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full border-y border-white/10 text-left text-[15px]">
                <tbody className="divide-y divide-white/10">
                  <tr className="align-top">
                    <th scope="row" className="w-[34%] py-3 pr-4 text-[13px] font-medium text-slate-500">Problem</th>
                    <td className="py-3 leading-relaxed text-slate-300">{cs.challenge}</td>
                  </tr>
                  <tr className="align-top">
                    <th scope="row" className="py-3 pr-4 text-[13px] font-medium text-slate-500">Uygulanan çözüm</th>
                    <td className="py-3 leading-relaxed text-slate-300">{cs.appliedSolution}</td>
                  </tr>
                  <tr className="align-top">
                    <th scope="row" className="py-3 pr-4 text-[13px] font-medium text-slate-500">Ölçülen sonuç</th>
                    <td className="py-3 font-medium leading-relaxed tabular-nums text-white">{cs.concreteResult}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        )}

        <div className="mt-10 space-y-5 text-[17px] leading-[1.75] text-slate-300">
          {article.content.map((paragraph, idx) => (
            <p key={idx} className="max-w-[65ch]">{paragraph}</p>
          ))}
        </div>

        {article.codeSnippet && (
          <figure className="mt-10">
            <figcaption className="mb-2 flex items-baseline justify-between gap-4 text-[13px] text-slate-400">
              <span>{article.codeSnippet.caption}</span>
              <span className="font-mono text-[11px] text-zinc-600">{article.codeSnippet.language}</span>
            </figcaption>
            <pre className="overflow-x-auto rounded-md border border-white/10 bg-[#070b12] p-4 font-mono text-xs leading-relaxed text-slate-300">
              <code>{article.codeSnippet.code}</code>
            </pre>
          </figure>
        )}

        {article.keyTakeaways.length > 0 && (
          <section aria-labelledby="cikarimlar" className="mt-12">
            <h2 id="cikarimlar" className="font-display text-xl font-semibold text-white">
              Anahtar çıkarımlar
            </h2>
            <ol className="mt-4 divide-y divide-white/10 border-y border-white/10">
              {article.keyTakeaways.map((item, i) => (
                <li key={i} className="grid grid-cols-[2rem_1fr] py-3 text-[15px] leading-relaxed text-slate-300">
                  <span className="font-mono text-xs tabular-nums text-zinc-500 pt-0.5">{i + 1}</span>
                  <span>{item}</span>
                </li>
              ))}
            </ol>
          </section>
        )}

        <p className="mt-10 font-mono text-xs text-zinc-500">
          {article.tags.map((t) => `#${t}`).join("  ")}
        </p>

        <aside className="mt-12 border-t border-white/10 pt-8">
          <h2 className="font-display text-lg font-semibold text-white">
            Web sitenizi bu standartlara taşımak ister misiniz?
          </h2>
          <p className="mt-2 max-w-[62ch] text-[15px] leading-relaxed text-slate-400">
            Sitenizi 0.5 saniye altında açılan, Core Web Vitals eşiklerini geçen ve yapay zeka arama motorlarında
            referans gösterilen bir altyapıya taşıyalım.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link
              href="/#contact"
              className="rounded bg-sky-300 px-4 py-2 text-sm font-semibold text-[#04060a] hover:bg-sky-200"
            >
              {article.ctaText}
            </Link>
            <Link href="/audit" className="text-sm text-sky-300 underline-offset-4 hover:underline">
              Sitenizi canlı Röntgen ile test edin
            </Link>
          </div>
        </aside>

        <p className="mt-10 text-[13px]">
          <Link href="/insights" className="text-slate-500 hover:text-slate-300">
            Tüm yazılara dön
          </Link>
        </p>
      </div>
    </article>
  );
}
