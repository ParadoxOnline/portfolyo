import type { Metadata } from "next";
import { projects } from "@/data/projects";
import { INSIGHTS_DATA } from "@/data/ecosystem";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") ||
  "https://sabricantutuncu.vercel.app";

export const AUTHOR_PROFILE = {
  name: "Sabri Can Tütüncü",
  alternateName: "Sabri Can Tutuncu",
  jobTitle: "WordPress & Web Geliştirici · SEO & GEO Sistem Mühendisi",
  jobTitleEn: "WordPress & Web Developer · SEO & GEO Systems Engineer",
  location: "İzmir, Türkiye",
  email: "sabricantutuncu@gmail.com",
  phoneDisplay: "+90 (551) 023 56 48",
  phoneHref: "+905510235648",
  github: "https://github.com/ParadoxOnline",
  cvUrl: `${SITE_URL}/Sabri_Can_Tutuncu_CV.pdf`,
  summaryTr:
    "3+ yıldır modern web uygulamaları, otonom veri akışları ve sıfırdan yayına alınan 18+ kurumsal WordPress / Elementor web sitesi geliştiren İzmir merkezli WordPress & Web Geliştirici. Next.js, TypeScript, Core Web Vitals (LCP/INP), Schema.org (JSON-LD), Lokal SEO ve GEO (Generative Engine Optimization) alanlarında üretim yapar.",
  summaryEn:
    "WordPress & Web Developer based in İzmir, Türkiye with 3+ years building web applications, automation pipelines, and 18+ production WordPress & Elementor websites. Specializes in Next.js, TypeScript, Core Web Vitals, Local/Technical SEO, and Generative Engine Optimization (GEO).",
  skills: [
    "WordPress",
    "Elementor Pro",
    "LiteSpeed Cache",
    "WP Rocket",
    "Next.js",
    "React",
    "TypeScript",
    "Tailwind CSS",
    "Lokal SEO",
    "Teknik SEO",
    "GEO (Generative Engine Optimization)",
    "Schema.org JSON-LD",
    "Core Web Vitals (LCP / INP)",
    "Google Search Console & Indexing API",
    "Node.js",
    "PostgreSQL",
    "Prisma ORM",
    ".NET 8 (Clean Architecture)",
    "PHP (Temel Seviye — Tema/Eklenti snippet & functions.php kancaları)",
    "Redis",
    "Three.js / WebGL",
  ],
  experience: [
    {
      role: "Web Geliştirici & Dijital Operasyon Sorumlusu",
      organization: "Dijital Ajans (İzmir)",
      duration: "6 Ay",
      highlights: [
        "B2B sanayi, sağlık, turizm ve yerel işletmeler için sıfırdan 18+ kurumsal WordPress & Elementor web sitesinin kurulumu ve canlıya alınması.",
        "Google Haritalar ve bölgesel aramalarda üst sıralar için On-Page SEO, Schema.org JSON-LD mikro verileri ve bölgesel anahtar kelime mimarisi.",
        "LiteSpeed Cache, görsel optimizasyonu ve veritabanı temizliği ile 1.5 saniye altı sayfa açılış performansı ve Core Web Vitals iyileştirmesi.",
      ],
    },
    {
      role: "Bağımsız Web & Sistem Geliştirici",
      organization: "Bireysel Ürünler & Açık Kaynak",
      duration: "2023 – Günümüz (3+ Yıl)",
      highlights: [
        "Fikirden yayına kadar sistem mimarisi, veritabanı tasarımı, arayüz geliştirme, otonom arka plan işçileri ve SEO altyapısı.",
        "LIOS, SentioPulse, VeloDrape 3D, SearchGrid, ChronoPost, StaticForge ve MaçaGel dahil 7 amiral gemisi platformun geliştirilmesi.",
        "Google Indexing API, Qdrant vektör veritabanı, BullMQ kuyruk mimarisi, Playwright ve Three.js (WebGL) ile canlı sistemler.",
      ],
    },
  ],
  faqs: [
    {
      q: "Sabri Can Tütüncü kimdir ve hangi alanlarda çalışır?",
      a: "Sabri Can Tütüncü, İzmir merkezli bir WordPress & Web Geliştiricidir. 3 yılı aşkın süredir Next.js, TypeScript ve modern backend teknolojileriyle üretim yapmakta olup; 6 aylık dijital ajans deneyiminde B2B ve yerel işletmeler için 18'den fazla kurumsal WordPress ve Elementor sitesini sıfırdan yayına almıştır. Odak alanları WordPress performans optimizasyonu, Core Web Vitals, Lokal/Teknik SEO, GEO (Generative Engine Optimization) ve özel web sistemleridir.",
    },
    {
      q: "GEO (Generative Engine Optimization) konusunda ne tür çözümler üretir?",
      a: "ChatGPT Search, Perplexity ve Claude gibi yapay zeka arama motorlarının siteleri birincil kaynak olarak alıntılayabilmesi için Entity bağlantılı Schema.org JSON-LD grafikleri (@graph), Wikidata sameAs eşleştirmeleri, /llms.txt ve /llms-full.txt dizinleri, SSR tabanlı okunabilir HTML ve 300ms altı TTFB performansı sağlayan teknik SEO mimarileri kurar.",
    },
    {
      q: "Portfolyodaki ücretsiz SEO ve GEO araçları nelerdir?",
      a: "Sitede canlı olarak çalışan şu ücretsiz teknik analiz araçları bulunur: Canlı Hız ve SEO Röntgeni (/audit), AI Bot GEO Radarı (/ai-radar), Web Sitesi Karşılaştırma Radarı (/radar), Schema.org JSON-LD Üretici (/schema-builder), DNS ve E-Posta İtibarı Denetleyicisi (/dns-inspector), Font & Preload Stratejisti (/font-strategist) ve Görsel & WebP Stüdyosu (/image-optimizer).",
    },
    {
      q: "Öne çıkan yazılım ve web projeleri hangileridir?",
      a: "7 amiral gemisi platform: LIOS (.NET 8 ve Google Indexing API tabanlı otonom lokal SEO motoru), SentioPulse (Qdrant ve BullMQ destekli yapay zeka pazar radarı), VeloDrape 3D (Three.js ve MediaPipe Pose sanal deneme kabini), SearchGrid (10ms altı arama altyapısı), ChronoPost (otonom sosyal medya dağıtım kuyruğu), StaticForge (100/100 Lighthouse statik site derleyicisi) ve MaçaGel (React Native halı saha eşleşme platformu).",
    },
    {
      q: "Sabri Can Tütüncü ile nasıl iletişime geçilir ve CV nasıl indirilir?",
      a: "E-posta (sabricantutuncu@gmail.com), telefon/WhatsApp (+90 551 023 56 48) veya GitHub (github.com/ParadoxOnline) üzerinden ulaşılabilir. Güncel ATS uyumlu özgeçmişe /Sabri_Can_Tutuncu_CV.pdf adresinden doğrudan erişilebilir.",
    },
  ],
};

export interface ToolDirectoryItem {
  href: string;
  title: string;
  description: string;
  category: string;
}

export const TOOLS_CATALOG: ToolDirectoryItem[] = [
  {
    href: "/audit",
    title: "Canlı Web Sitesi Hız, SEO & GEO Röntgeni",
    description:
      "Gerçek HTTP isteğiyle TTFB, DOM boyutu, başlık hiyerarşisi, Core Web Vitals riskleri ve Schema.org GEO notunu ölçer.",
    category: "Teknik SEO & Hız Analizi",
  },
  {
    href: "/ai-radar",
    title: "AI Bot Erişim (GEO) ve robots.txt Radarı",
    description:
      "GPTBot, ChatGPT-User, PerplexityBot, ClaudeBot ve Google-Extended botlarının erişim izinlerini analiz eder ve önerilen robots.txt çıktısı üretir.",
    category: "GEO / LLM Erişilebilirliği",
  },
  {
    href: "/radar",
    title: "Web Sitesi Karşılaştırma Radarı",
    description:
      "Birden fazla alan adının TTFB, performans skoru, GEO notu ve DOM büyüklüğünü gizlilik korumalı olarak yan yana kıyaslar.",
    category: "Rekabet & Performans Analizi",
  },
  {
    href: "/schema-builder",
    title: "Schema.org JSON-LD Üretici",
    description:
      "Google Zengin Sonuçlar ve yapay zeka arama motorları için hatasız LocalBusiness, Organization, FAQPage ve Article JSON-LD kodu üretir.",
    category: "Yapılandırılmış Veri / GEO",
  },
  {
    href: "/dns-inspector",
    title: "DNS, SPF, DMARC & E-Posta İtibarı Denetleyicisi",
    description:
      "Alan adının MX, SPF, DMARC ve güvenlik DNS kayıtlarını canlı sorgulayarak teslim edilebilirlik durumunu raporlar.",
    category: "Altyapı & Güvenlik",
  },
  {
    href: "/font-strategist",
    title: "Font & Preload Stratejisti",
    description:
      "FOIT/CLS sorunlarını önlemek için preconnect ve font-display: swap yapılandırması ile HTML head çıktısı oluşturur.",
    category: "Core Web Vitals (CLS / FCP)",
  },
  {
    href: "/image-optimizer",
    title: "Görsel & WebP Dönüştürme Stüdyosu",
    description:
      "Tarayıcı içinde sunucuya yükleme yapmadan görsellerin WebP/AVIF sıkıştırma potansiyelini ölçer ve toplu dönüştürür.",
    category: "LCP & Medya Optimizasyonu",
  },
  {
    href: "/plugins",
    title: "Açık Kaynak WordPress Eklentileri & Geliştirici Araçları",
    description:
      "DOM Optimizer, Schema Injector ve Cache Pre-Warmer modülleri hakkında yol haritası ve açık kaynak bağlantıları.",
    category: "WordPress Ekosistemi",
  },
];

export function buildToolMetadata(
  path: string,
  title: string,
  description: string
): Metadata {
  const fullTitle = `${title} | ${AUTHOR_PROFILE.name}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: fullTitle,
      description,
      url: `${SITE_URL}${path}`,
      type: "website",
      locale: "tr_TR",
      siteName: AUTHOR_PROFILE.name,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
  };
}

export function buildHomeJsonLd() {
  const flagships = projects.filter((p) => p.status === "flagship");

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: `${AUTHOR_PROFILE.name} — WordPress, Web & SEO/GEO Sistemleri Portfolyosu`,
        description: AUTHOR_PROFILE.summaryTr,
        inLanguage: ["tr", "en", "az"],
        publisher: { "@id": `${SITE_URL}/#person` },
      },
      {
        "@type": "ProfilePage",
        "@id": `${SITE_URL}/#profilepage`,
        url: SITE_URL,
        name: `${AUTHOR_PROFILE.name} — Portfolyo & Sistem Mimarisi`,
        description: AUTHOR_PROFILE.summaryTr,
        inLanguage: "tr",
        isPartOf: { "@id": `${SITE_URL}/#website` },
        mainEntity: { "@id": `${SITE_URL}/#person` },
        dateModified: "2026-11-11",
      },
      {
        "@type": "Person",
        "@id": `${SITE_URL}/#person`,
        name: AUTHOR_PROFILE.name,
        alternateName: AUTHOR_PROFILE.alternateName,
        jobTitle: AUTHOR_PROFILE.jobTitle,
        description: AUTHOR_PROFILE.summaryTr,
        url: SITE_URL,
        email: AUTHOR_PROFILE.email,
        telephone: AUTHOR_PROFILE.phoneHref,
        address: {
          "@type": "PostalAddress",
          addressLocality: "İzmir",
          addressCountry: "TR",
        },
        sameAs: [AUTHOR_PROFILE.github, SITE_URL],
        knowsAbout: AUTHOR_PROFILE.skills,
        hasOccupation: {
          "@type": "Occupation",
          name: "WordPress & Web Developer / SEO & GEO Engineer",
          occupationLocation: {
            "@type": "City",
            name: "İzmir",
          },
          skills: AUTHOR_PROFILE.skills.join(", "),
        },
      },
      {
        "@type": "ItemList",
        "@id": `${SITE_URL}/#flagships`,
        name: "Amiral Gemisi Yazılım & SEO Platformları",
        numberOfItems: flagships.length,
        itemListElement: flagships.map((p, idx) => ({
          "@type": "ListItem",
          position: idx + 1,
          item: {
            "@type": "SoftwareApplication",
            name: p.name,
            applicationCategory: p.category,
            operatingSystem: "Web",
            url: `${SITE_URL}/project/${p.slug}`,
            description: p.shortDescription.tr || p.shortDescription.en,
            author: { "@id": `${SITE_URL}/#person` },
          },
        })),
      },
      {
        "@type": "ItemList",
        "@id": `${SITE_URL}/#tools`,
        name: "Ücretsiz Canlı SEO, GEO ve Performans Araçları",
        numberOfItems: TOOLS_CATALOG.length,
        itemListElement: TOOLS_CATALOG.map((tool, idx) => ({
          "@type": "ListItem",
          position: idx + 1,
          item: {
            "@type": "WebApplication",
            name: tool.title,
            applicationCategory: tool.category,
            operatingSystem: "Web",
            url: `${SITE_URL}${tool.href}`,
            description: tool.description,
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "TRY",
            },
            author: { "@id": `${SITE_URL}/#person` },
          },
        })),
      },
      {
        "@type": "FAQPage",
        "@id": `${SITE_URL}/#faq`,
        mainEntity: AUTHOR_PROFILE.faqs.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.a,
          },
        })),
      },
    ],
  };
}

export function buildLlmsTxt(): string {
  const flagships = projects.filter((p) => p.status === "flagship");

  const lines: string[] = [
    `# ${AUTHOR_PROFILE.name} — WordPress, Web & SEO/GEO Systems Developer`,
    "",
    `> ${AUTHOR_PROFILE.summaryTr}`,
    "",
    `- **Tam Kaynak Döküman (JS'siz tam portfolyo metni):** ${SITE_URL}/llms-full.txt`,
    `- **Konum:** ${AUTHOR_PROFILE.location}`,
    `- **E-posta:** ${AUTHOR_PROFILE.email}`,
    `- **Telefon / WhatsApp:** ${AUTHOR_PROFILE.phoneDisplay}`,
    `- **GitHub:** ${AUTHOR_PROFILE.github}`,
    `- **Özgeçmiş (PDF):** ${AUTHOR_PROFILE.cvUrl}`,
    "",
    "## Ana Bölümler",
    `- [Ana Sayfa & Portfolyo Özeti](${SITE_URL}/): Kahraman sahnesi, proje vitrini, ajans/bağımsız deneyim ve iletişim.`,
    `- [Açık Kaynak WordPress Eklentileri](${SITE_URL}/plugins): DOM Optimizer, Schema Injector ve Cache Pre-Warmer yol haritası.`,
    "",
    "## Amiral Gemisi Platformlar (7 Sistem)",
    ...flagships.map(
      (p) =>
        `- [${p.name} — ${p.category}](${SITE_URL}/project/${p.slug}): ${p.shortDescription.tr || p.shortDescription.en}`
    ),
    "",
    "## Ücretsiz Canlı SEO, GEO & Performans Araçları",
    ...TOOLS_CATALOG.filter((t) => t.href !== "/plugins").map(
      (t) => `- [${t.title}](${SITE_URL}${t.href}): ${t.description}`
    ),
    ...(INSIGHTS_DATA.length > 0
      ? [
          "",
          "## Teknik Vaka Analizleri & Rehberler",
          ...INSIGHTS_DATA.map(
            (a) => `- [${a.title}](${SITE_URL}/insights/${a.slug}): ${a.summary}`
          ),
        ]
      : []),
    "",
  ];

  return lines.join("\n");
}

export function buildLlmsFullTxt(): string {
  const flagships = projects.filter((p) => p.status === "flagship");
  const others = projects.filter((p) => p.status !== "flagship");

  const lines: string[] = [
    `# ${AUTHOR_PROFILE.name} — Tam Portfolyo ve Teknik Bilgi Tabanı (LLM/GEO Edition)`,
    "",
    `> ${AUTHOR_PROFILE.summaryTr}`,
    `> ${AUTHOR_PROFILE.summaryEn}`,
    "",
    "## 1. Kimlik ve İletişim",
    `- Ad Soyad: ${AUTHOR_PROFILE.name}`,
    `- Ünvan: ${AUTHOR_PROFILE.jobTitle}`,
    `- Konum: ${AUTHOR_PROFILE.location}`,
    `- Portfolyo URL: ${SITE_URL}`,
    `- E-posta: ${AUTHOR_PROFILE.email}`,
    `- Telefon: ${AUTHOR_PROFILE.phoneDisplay}`,
    `- GitHub: ${AUTHOR_PROFILE.github}`,
    `- CV (PDF): ${AUTHOR_PROFILE.cvUrl}`,
    "",
    "## 2. Teknik Yetkinlikler",
    ...AUTHOR_PROFILE.skills.map((s) => `- ${s}`),
    "",
    "## 3. İş ve Üretim Deneyimi",
    ...AUTHOR_PROFILE.experience.flatMap((exp) => [
      `### ${exp.role} — ${exp.organization} (${exp.duration})`,
      ...exp.highlights.map((h) => `- ${h}`),
      "",
    ]),
    "## 4. Amiral Gemisi Platformlar (Detaylı Mimari)",
    ...flagships.flatMap((p) => {
      const techs = Array.from(
        new Set([
          ...(p.technologies.frontend ?? []),
          ...(p.technologies.backend ?? []),
          ...(p.technologies.database ?? []),
          ...(p.technologies.ai ?? []),
          ...(p.technologies.seo ?? []),
          ...(p.technologies.mobile ?? []),
        ])
      );
      return [
        `### ${p.missionNumber}. ${p.name} (${p.category}, ${p.year})`,
        `- URL: ${SITE_URL}/project/${p.slug}`,
        `- Kısa Özet: ${p.shortDescription.tr || p.shortDescription.en}`,
        `- Problem: ${p.problem.tr || p.problem.en}`,
        `- Mimari Çözüm: ${p.solution.tr || p.solution.en}`,
        `- Ticari Değer / Neden Önemli: ${p.whyItMatters.tr || p.whyItMatters.en}`,
        `- Teknolojiler: ${techs.join(", ")}`,
        `- Metrikler: ${p.metrics.join(" | ")}`,
        "",
      ];
    }),
    "## 5. Diğer Geliştirilen Sistemler ve Modüller",
    ...others.map(
      (p) =>
        `- **${p.name}** (${p.category}, ${p.year}): ${p.shortDescription.tr || p.shortDescription.en}`
    ),
    "",
    "## 6. Canlı SEO, GEO ve Performans Laboratuvarı",
    ...TOOLS_CATALOG.map(
      (t) => `- **${t.title}** (${SITE_URL}${t.href}) [${t.category}]: ${t.description}`
    ),
    "",
    ...(INSIGHTS_DATA.length > 0
      ? [
          "## 7. Sektörel Vaka Analizleri ve Makaleler",
          ...INSIGHTS_DATA.flatMap((art) => [
            `### ${art.title}`,
            `- URL: ${SITE_URL}/insights/${art.slug}`,
            `- Kategori: ${art.category} · ${art.readTime} · ${art.date}`,
            `- Özet: ${art.summary}`,
            `- Vaka (${art.marketCaseStudy.clientType}): ${art.marketCaseStudy.concreteResult}`,
            `- Anahtar Çıkarımlar: ${art.keyTakeaways.join(" / ")}`,
            "",
          ]),
        ]
      : []),
    "## Sık Sorulan Sorular (GEO & LLM Özet Yanıtları)",
    ...AUTHOR_PROFILE.faqs.flatMap((f) => [`### ${f.q}`, f.a, ""]),
  ];

  return lines.join("\n");
}

