import { NextRequest, NextResponse } from "next/server";
import { isAuthenticatedAdmin } from "@/lib/admin-auth";
import {
  CompanyCategory,
  CompanySize,
  EmployerCompany,
  WorkModel,
  evaluateCompanyForPortfolio,
} from "@/data/employer-seed";

export const runtime = "nodejs";

const DIRECTORY_BLACKLIST = [
  "duckduckgo.com",
  "google.com",
  "bing.com",
  "yandex.com",
  "youtube.com",
  "instagram.com",
  "facebook.com",
  "twitter.com",
  "x.com",
  "linkedin.com",
  "kariyer.net",
  "yenibiris.com",
  "eleman.net",
  "isinolsun.com",
  "indeed.com",
  "glassdoor.com",
  "armut.com",
  "bionluk.com",
  "edvido.com",
  "sortlist.com",
  "clutch.co",
  "goodfirms.co",
  "sikayetvar.com",
  "eksisozluk.com",
  "wikipedia.org",
  "medium.com",
  "github.com",
  "behance.net",
  "dribbble.com",
  "pinterest.com",
  "wordpress.org",
  "wordpress.com",
  "wix.com",
  "godaddy.com",
  "r10.net",
  "wmaraci.com",
  "webmaster.kitchen",
  "eniyiajanslar.com",
  "ajansara.com",
];

interface PoolCandidate {
  name: string;
  domain: string;
  website: string;
  careerUrl: string;
  category: CompanyCategory;
  city: string;
  district: string;
  workModel: WorkModel;
  companySize: CompanySize;
  technologies: string[];
  services: string[];
  contactEmail: string;
  contactPhone: string;
  notes: string;
}

const EXTENDED_DISCOVERY_POOL: PoolCandidate[] = [
  {
    name: "Ajans 360 İzmir / Kreatif Web & Dijital",
    domain: "ajans360.com",
    website: "https://www.ajans360.com",
    careerUrl: "https://www.ajans360.com/iletisim",
    category: "Web Ajansı",
    city: "İzmir",
    district: "Bayraklı",
    workModel: "İzmir (Yerinde / Hibrit)",
    companySize: "Büyüyen (10-30)",
    technologies: ["WordPress", "Elementor", "WooCommerce", "PHP", "JavaScript"],
    services: ["Kurumsal Web Tasarım", "E-Ticaret", "Dijital Pazarlama", "SEO"],
    contactEmail: "info@ajans360.com",
    contactPhone: "+90 232 461 00 00",
    notes: "İzmir Bayraklı'da kurumsal web ve dijital çözümler sunan ajans. WordPress/Elementor hız ve özel tasarım projelerine uygun.",
  },
  {
    name: "İzmir Web Ajans (Kurumsal Web & SEO)",
    domain: "izmirwebajans.com",
    website: "https://www.izmirwebajans.com",
    careerUrl: "https://www.izmirwebajans.com/iletisim",
    category: "Web Ajansı",
    city: "İzmir",
    district: "Konak / Alsancak",
    workModel: "İzmir (Yerinde / Hibrit)",
    companySize: "Butik (2-10)",
    technologies: ["WordPress", "Elementor", "PHP", "Schema.org / JSON-LD"],
    services: ["Web Tasarım", "Lokal SEO", "Kurumsal Web", "Hız Optimizasyonu"],
    contactEmail: "info@izmirwebajans.com",
    contactPhone: "+90 232 489 00 00",
    notes: "Lokal İzmir işletmelerine yoğun web sitesi teslimatı yapan butik ajans. White-label geliştirme ve teknik SEO ortaklığı için ideal.",
  },
  {
    name: "Ege Teknopark Yazılım & Bulut ( Cloud / Web Ekibi )",
    domain: "egeteknopark.com.tr",
    website: "https://egeteknopark.com.tr",
    careerUrl: "https://egeteknopark.com.tr/firmalarimiz/",
    category: "Yazılım Şirketi",
    city: "İzmir",
    district: "Bornova (Ege Teknopark)",
    workModel: "İzmir + Uzaktan",
    companySize: "Orta Ölçekli (30-100)",
    technologies: ["React", "Next.js", "TypeScript", "Node.js", "REST / GraphQL"],
    services: ["Özel Yazılım Geliştirme", "SaaS Ürünleri", "Kurumsal Web Uygulamaları"],
    contactEmail: "info@egeteknopark.com.tr",
    contactPhone: "+90 232 311 00 00",
    notes: "Bornova Ege Üniversitesi Teknopark bünyesindeki Ar-Ge ve yazılım firmaları kümesi. Full-Stack ve React/Next.js pozisyonları için ana merkez.",
  },
  {
    name: "Teknopark İzmir Ar-Ge & Yazılım Ekosistemi",
    domain: "teknoparkizmir.com.tr",
    website: "https://www.teknoparkizmir.com.tr",
    careerUrl: "https://www.teknoparkizmir.com.tr/tr/kulucka-ve-firmalar/",
    category: "Yazılım Şirketi",
    city: "İzmir",
    district: "Urla (Teknopark İzmir)",
    workModel: "İzmir + Uzaktan",
    companySize: "Kurumsal (100+)",
    technologies: ["React", "Next.js", "TypeScript", "Python", "Node.js"],
    services: ["SaaS & Ürün Geliştirme", "Yapay Zeka & Veri", "Web Uygulamaları"],
    contactEmail: "info@teknoparkizmir.com.tr",
    contactPhone: "+90 232 765 90 00",
    notes: "İYTE yerleşkesindeki 200+ yazılım firmasının merkezi. Hibrit ve uzaktan çalışan modern teknoloji şirketleri.",
  },
  {
    name: "DEPARK (Dokuz Eylül Teknopark Yazılım Şirketleri)",
    domain: "depark.com",
    website: "https://www.depark.com",
    careerUrl: "https://www.depark.com/firmalar/",
    category: "Yazılım Şirketi",
    city: "İzmir",
    district: "Buca / İnciraltı (DEPARK)",
    workModel: "İzmir (Yerinde / Hibrit)",
    companySize: "Orta Ölçekli (30-100)",
    technologies: ["React", "TypeScript", "PHP / Laravel", "Next.js"],
    services: ["Sağlık Teknolojileri", "Özel Yazılım", "Kurumsal Web Sistemleri"],
    contactEmail: "info@depark.com",
    contactPhone: "+90 232 412 89 50",
    notes: "Sağlık ve kurumsal yazılım alanında faaliyet gösteren İzmir Ar-Ge şirketleri. Medikal/Klinik GEO ve web uzmanlığı ile tam uyum.",
  },
  {
    name: "İzmir E-Ticaret & Shopify / İkas Stüdyosu (Roocket / E-Com)",
    domain: "ikas.com",
    website: "https://ikas.com/tr/partnerler",
    careerUrl: "https://ikas.com/tr/kariyer",
    category: "E-Ticaret Ajansı",
    city: "İzmir",
    district: "Alsancak / Uzaktan",
    workModel: "İzmir + Uzaktan",
    companySize: "Orta Ölçekli (30-100)",
    technologies: ["Next.js", "React", "TypeScript", "İkas", "Shopify", "Tailwind CSS"],
    services: ["E-Ticaret Altyapısı", "Headless E-Ticaret", "Dönüşüm & Hız Optimizasyonu", "Teknik SEO"],
    contactEmail: "info@ikas.com",
    contactPhone: "+90 850 255 18 39",
    notes: "Yeni nesil e-ticaret ekosistemi ve ajans partner ağı. Next.js, hız optimizasyonu ve e-ticaret tema/entegrasyon geliştiricileri için yüksek talep.",
  },
  {
    name: "Kreatif SEO & İçerik Mühendisliği (Stratejik SEO)",
    domain: "stratejikseo.com",
    website: "https://www.stratejikseo.com",
    careerUrl: "https://www.stratejikseo.com/iletisim/",
    category: "SEO Ajansı",
    city: "Uzaktan (Türkiye / Global)",
    district: "Remote",
    workModel: "Uzaktan (Remote)",
    companySize: "Büyüyen (10-30)",
    technologies: ["WordPress", "Schema.org / JSON-LD", "Core Web Vitals", "Next.js"],
    services: ["Teknik SEO", "E-Ticaret SEO", "Uluslararası SEO", "GEO / Yapay Zeka Arama"],
    contactEmail: "info@stratejikseo.com",
    contactPhone: "+90 212 000 00 00",
    notes: "Teknik SEO ve içerik odaklı ajans. Müşteri sitelerindeki Core Web Vitals, font preload ve JSON-LD müdahaleleri için teknik geliştirici ihtiyacı.",
  },
  {
    name: "Medya Ege / İzmir Kurumsal Web & E-Ticaret",
    domain: "medyaege.com.tr",
    website: "https://www.medyaege.com.tr",
    careerUrl: "https://www.medyaege.com.tr/iletisim",
    category: "E-Ticaret Ajansı",
    city: "İzmir",
    district: "Karşıyaka / Bayraklı",
    workModel: "İzmir (Yerinde / Hibrit)",
    companySize: "Butik (2-10)",
    technologies: ["WooCommerce", "WordPress", "Elementor", "PHP"],
    services: ["E-Ticaret Kurulumu", "Kurumsal Web Tasarım", "Görsel Optimizasyon", "SEO"],
    contactEmail: "info@medyaege.com.tr",
    contactPhone: "+90 232 369 00 00",
    notes: "Karşıyaka/Bayraklı bölgesinde KOBİ ve e-ticaret müşterilerine hizmet veren ajans.",
  },
  {
    name: "Penta Teknoloji / İzmir Dijital Ürün & Web Stüdyosu",
    domain: "izzetoz.com",
    website: "https://www.izmiryazilim.com",
    careerUrl: "https://www.izmiryazilim.com/iletisim",
    category: "Yazılım Şirketi",
    city: "İzmir",
    district: "Bayraklı",
    workModel: "İzmir (Yerinde / Hibrit)",
    companySize: "Büyüyen (10-30)",
    technologies: ["React", "Next.js", "PHP / Laravel", "Tailwind CSS"],
    services: ["Özel Web Yazılım", "B2B Portal", "E-Ticaret Entegrasyonu"],
    contactEmail: "info@izmiryazilim.com",
    contactPhone: "+90 232 400 10 20",
    notes: "İzmir'de B2B web uygulamaları ve kurumsal portallar geliştiren yazılım ekibi.",
  },
];

async function searchDuckDuckGoDomains(query: string): Promise<Array<{ url: string; title: string; snippet: string }>> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 5000);
  try {
    const searchUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
    const res = await fetch(searchUrl, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
        "Accept-Language": "tr-TR,tr;q=0.9",
      },
    });
    if (!res.ok) return [];
    const html = await res.text();

    const results: Array<{ url: string; title: string; snippet: string }> = [];
    const linkRegex = /<a[^>]+class=["'][^"']*result__a[^"']*["'][^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
    let match: RegExpExecArray | null;

    while ((match = linkRegex.exec(html)) !== null && results.length < 8) {
      let rawHref = match[1];
      const rawTitle = match[2].replace(/<[^>]+>/g, "").trim();

      // Decode DuckDuckGo redirect URL if present (uddg=...)
      if (rawHref.includes("uddg=")) {
        try {
          const u = new URL(rawHref, "https://html.duckduckgo.com");
          const uddg = u.searchParams.get("uddg");
          if (uddg) rawHref = decodeURIComponent(uddg);
        } catch {
          // ignore
        }
      }

      try {
        const parsed = new URL(rawHref);
        const host = parsed.hostname.replace(/^www\./i, "").toLowerCase();
        if (
          !DIRECTORY_BLACKLIST.some((b) => host === b || host.endsWith(`.${b}`)) &&
          !results.some((r) => r.url.includes(host))
        ) {
          results.push({
            url: parsed.origin,
            title: rawTitle,
            snippet: "",
          });
        }
      } catch {
        continue;
      }
    }

    return results;
  } catch {
    return [];
  } finally {
    clearTimeout(timer);
  }
}

export async function POST(req: NextRequest) {
  if (!(await isAuthenticatedAdmin())) {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const category = (body.category || "Tümü") as CompanyCategory | "Tümü";
    const location = String(body.location || "İzmir");
    const techFilter = String(body.techFilter || "Tümü");
    const customKeyword = String(body.customKeyword || "").trim();
    const existingDomains = new Set<string>(
      Array.isArray(body.existingDomains)
        ? body.existingDomains.map((d: string) => String(d).toLowerCase())
        : []
    );

    // 1. Filter Curated Pool
    const matchedPool = EXTENDED_DISCOVERY_POOL.filter((item) => {
      if (existingDomains.has(item.domain.toLowerCase())) return false;
      if (category !== "Tümü" && item.category !== category) return false;
      if (location.includes("İzmir") && !item.city.includes("İzmir") && !item.workModel.includes("İzmir")) {
        return false;
      }
      if (location === "Uzaktan (Remote)" && !item.workModel.includes("Uzaktan")) {
        return false;
      }
      if (techFilter !== "Tümü") {
        const tl = item.technologies.join(" ").toLowerCase();
        if (techFilter.includes("WordPress") && !tl.includes("wordpress")) return false;
        if (techFilter.includes("Next.js") && !tl.includes("next") && !tl.includes("react")) return false;
        if (techFilter.includes("E-Ticaret") && !tl.includes("woo") && !tl.includes("shopify") && !tl.includes("ikas")) return false;
      }
      if (customKeyword) {
        const kw = customKeyword.toLowerCase();
        const haystack = `${item.name} ${item.district} ${item.technologies.join(" ")} ${item.services.join(" ")} ${item.notes}`.toLowerCase();
        if (!haystack.includes(kw)) return false;
      }
      return true;
    });

    // 2. Also execute live web search query to discover new websites on the fly
    const queryParts: string[] = [];
    if (location.includes("İzmir")) queryParts.push("İzmir");
    if (category !== "Tümü") queryParts.push(category);
    else queryParts.push("web tasarım yazılım ajansı");
    if (techFilter !== "Tümü") queryParts.push(techFilter.split("/")[0].trim());
    if (customKeyword) queryParts.push(customKeyword);

    const searchQuery = queryParts.join(" ");
    const liveSearchHits = await searchDuckDuckGoDomains(searchQuery);

    const discoveredCompanies: EmployerCompany[] = [];
    const followUp = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

    // Convert matched pool candidates
    for (const candidate of matchedPool) {
      const aiEvaluation = evaluateCompanyForPortfolio({
        name: candidate.name,
        domain: candidate.domain,
        category: candidate.category,
        city: candidate.city,
        district: candidate.district,
        workModel: candidate.workModel,
        companySize: candidate.companySize,
        technologies: candidate.technologies,
        services: candidate.services,
        hasCareerPage: candidate.careerUrl.includes("kariyer") || candidate.careerUrl.includes("career"),
        hasOpenPositionSignal: true,
      });

      discoveredCompanies.push({
        id: `disc-pool-${candidate.domain.replace(/[^a-z0-9]/g, "-")}`,
        name: candidate.name,
        domain: candidate.domain,
        website: candidate.website,
        careerUrl: candidate.careerUrl,
        category: candidate.category,
        city: candidate.city,
        district: candidate.district,
        workModel: candidate.workModel,
        companySize: candidate.companySize,
        technologies: candidate.technologies,
        services: candidate.services,
        contactEmail: candidate.contactEmail,
        contactPhone: candidate.contactPhone,
        linkedinUrl: `https://www.linkedin.com/search/results/companies/?keywords=${encodeURIComponent(candidate.name)}`,
        approved: false,
        applicationStatus: "Keşfedildi",
        followUpDate: followUp,
        lastAnalyzedAt: new Date().toISOString(),
        notes: candidate.notes,
        aiEvaluation,
      });
      existingDomains.add(candidate.domain.toLowerCase());
    }

    // Convert live web search hits
    for (const hit of liveSearchHits.slice(0, 5)) {
      try {
        const parsed = new URL(hit.url);
        const domain = parsed.hostname.replace(/^www\./i, "").toLowerCase();
        if (existingDomains.has(domain)) continue;

        const targetCat: CompanyCategory =
          category !== "Tümü" ? category : "Web Ajansı";
        const defaultTechs =
          techFilter.includes("Next.js")
            ? ["React", "Next.js", "TypeScript"]
            : techFilter.includes("E-Ticaret")
            ? ["WooCommerce", "Shopify", "WordPress"]
            : ["WordPress", "Elementor", "JavaScript", "SEO"];

        const cleanName = hit.title.split(/\s*[\|•·—–-]\s*/)[0]?.trim() || domain;

        const aiEvaluation = evaluateCompanyForPortfolio({
          name: cleanName,
          domain,
          category: targetCat,
          city: location.includes("İzmir") ? "İzmir" : "Türkiye / Uzaktan",
          district: location.includes("İzmir") ? "Merkez" : "Remote",
          workModel: location.includes("İzmir") ? "İzmir (Yerinde / Hibrit)" : "Uzaktan (Remote)",
          companySize: "Büyüyen (10-30)",
          technologies: defaultTechs,
          services: [targetCat, "Web & Dijital Çözümler"],
          hasCareerPage: true,
        });

        discoveredCompanies.push({
          id: `disc-live-${domain.replace(/[^a-z0-9]/g, "-")}-${Date.now().toString(36)}`,
          name: cleanName,
          domain,
          website: hit.url,
          careerUrl: `${hit.url}/iletisim`,
          category: targetCat,
          city: location.includes("İzmir") ? "İzmir" : "Türkiye / Uzaktan",
          district: location.includes("İzmir") ? "Merkez" : "Remote",
          workModel: location.includes("İzmir") ? "İzmir (Yerinde / Hibrit)" : "Uzaktan (Remote)",
          companySize: "Büyüyen (10-30)",
          technologies: defaultTechs,
          services: [targetCat, "Web Geliştirme"],
          contactEmail: `info@${domain}`,
          contactPhone: "Canlı Taramayla Çekilebilir",
          linkedinUrl: `https://www.linkedin.com/search/results/companies/?keywords=${encodeURIComponent(cleanName)}`,
          approved: false,
          applicationStatus: "Keşfedildi",
          followUpDate: followUp,
          lastAnalyzedAt: new Date().toISOString(),
          notes: `"${searchQuery}" canlı web aramasından keşfedildi. "Canlı Derin Analiz" butonuna tıklayarak sitenin gerçek teknoloji, e-posta ve kariyer verilerini çekebilirsiniz.`,
          aiEvaluation,
        });

        existingDomains.add(domain);
      } catch {
        continue;
      }
    }

    return NextResponse.json({
      query: searchQuery,
      discoveredCount: discoveredCompanies.length,
      companies: discoveredCompanies,
    });
  } catch (err) {
    console.error("Discovery error:", err);
    return NextResponse.json(
      { error: "Firma keşfi sırasında bir hata oluştu." },
      { status: 500 }
    );
  }
}
