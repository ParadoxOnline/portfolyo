import React from "react";
import Link from "next/link";
import Hero from "@/components/cine/Hero";
import Showcase from "@/components/cine/Showcase";
import Career from "@/components/cine/Career";
import Contact from "@/components/cine/Contact";
import { projects } from "@/data/projects";
import { INSIGHTS_DATA } from "@/data/ecosystem";
import { AUTHOR_PROFILE, SITE_URL, TOOLS_CATALOG, buildHomeJsonLd } from "@/lib/geo";

export default function HomePage() {
  const flagships = projects.filter((p) => p.status === "flagship");
  const others = projects.filter((p) => p.status !== "flagship");
  const jsonLd = buildHomeJsonLd();

  return (
    <>
      <Hero />
      <Showcase />
      <Career />
      <Contact />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* LLM modelleri ve JS çalıştırmayan botlar için sıfır görsel etkili sunucu-taraflı anlamsal özet katmanı */}
      <article className="sr-only" aria-label="Sabri Can Tütüncü Portfolyo ve Teknik Bilgi Özeti">
        <header>
          <h2>{AUTHOR_PROFILE.name} — {AUTHOR_PROFILE.jobTitle}</h2>
          <p>{AUTHOR_PROFILE.summaryTr}</p>
          <p>{AUTHOR_PROFILE.summaryEn}</p>
          <ul>
            <li>Konum: {AUTHOR_PROFILE.location}</li>
            <li>E-posta: {AUTHOR_PROFILE.email}</li>
            <li>Telefon / WhatsApp: {AUTHOR_PROFILE.phoneDisplay}</li>
            <li>
              GitHub: <a href={AUTHOR_PROFILE.github}>{AUTHOR_PROFILE.github}</a>
            </li>
            <li>
              Özgeçmiş (PDF): <a href="/Sabri_Can_Tutuncu_CV.pdf">Sabri Can Tütüncü CV İndir</a>
            </li>
            <li>
              LLM Dizini: <a href="/llms.txt">{SITE_URL}/llms.txt</a> ·{" "}
              <a href="/llms-full.txt">{SITE_URL}/llms-full.txt</a>
            </li>
          </ul>
        </header>

        <section>
          <h2>Amiral Gemisi Platformlar (7 Sistem)</h2>
          {flagships.map((p) => (
            <section key={p.slug}>
              <h3>
                <Link href={`/project/${p.slug}`}>
                  {p.name} — {p.category} ({p.year})
                </Link>
              </h3>
              <p>{p.shortDescription.tr || p.shortDescription.en}</p>
              <p>Problem: {p.problem.tr || p.problem.en}</p>
              <p>Sistem Çözümü: {p.solution.tr || p.solution.en}</p>
              <p>Ticari Değer: {p.whyItMatters.tr || p.whyItMatters.en}</p>
            </section>
          ))}
        </section>

        <section>
          <h2>Diğer Sistemler ve Araçlar</h2>
          <ul>
            {others.map((p) => (
              <li key={p.slug}>
                <strong>{p.name}</strong> ({p.category}, {p.year}):{" "}
                {p.shortDescription.tr || p.shortDescription.en}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2>Deneyim ve Teknik Yetkinlikler</h2>
          {AUTHOR_PROFILE.experience.map((exp) => (
            <section key={exp.role}>
              <h3>
                {exp.role} — {exp.organization} ({exp.duration})
              </h3>
              <ul>
                {exp.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            </section>
          ))}
          <p>Teknik Yetkinlikler: {AUTHOR_PROFILE.skills.join(", ")}</p>
        </section>

        <section>
          <h2>Ücretsiz Canlı SEO, GEO ve Performans Araçları</h2>
          <ul>
            {TOOLS_CATALOG.map((tool) => (
              <li key={tool.href}>
                <Link href={tool.href}>{tool.title}</Link> ({tool.category}): {tool.description}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2>GEO, Core Web Vitals ve Lokal SEO Vaka Analizleri</h2>
          <ul>
            {INSIGHTS_DATA.map((article) => (
              <li key={article.slug}>
                <Link href={`/insights/${article.slug}`}>{article.title}</Link> ({article.category}):{" "}
                {article.summary} — Sonuç: {article.marketCaseStudy.concreteResult}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2>Sık Sorulan Sorular</h2>
          {AUTHOR_PROFILE.faqs.map((item) => (
            <section key={item.q}>
              <h3>{item.q}</h3>
              <p>{item.a}</p>
            </section>
          ))}
        </section>
      </article>
    </>
  );
}
