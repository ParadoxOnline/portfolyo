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

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

async function fetchHtmlWithTiming(url: string, timeoutMs = 6500): Promise<{
  ok: boolean;
  html: string;
  ttfbMs: number;
  finalUrl: string;
  headers: Record<string, string>;
}> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const start = performance.now();

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7",
      },
      redirect: "follow",
    });
    const ttfbMs = Math.round(performance.now() - start);
    const html = await res.text();
    const headers: Record<string, string> = {};
    res.headers.forEach((v, k) => {
      headers[k.toLowerCase()] = v;
    });
    return { ok: res.ok, html, ttfbMs, finalUrl: res.url || url, headers };
  } catch {
    return {
      ok: false,
      html: "",
      ttfbMs: Math.round(performance.now() - start),
      finalUrl: url,
      headers: {},
    };
  } finally {
    clearTimeout(timer);
  }
}

function cleanCompanyName(rawTitle: string, domain: string): string {
  if (!rawTitle) {
    const base = domain.split(".")[0] || domain;
    return base.charAt(0).toUpperCase() + base.slice(1);
  }
  const decoded = rawTitle
    .replace(/&amp;/g, "&")
    .replace(/&#8211;|&#8212;|&ndash;|&mdash;/g, "-")
    .replace(/&#039;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .trim();

  // Split by common title separators
  const parts = decoded.split(/\s*[\|•·—–-]\s*/).filter(Boolean);
  if (parts.length > 0) {
    const first = parts[0].trim();
    if (first.length >= 3 && first.length <= 55) {
      return first;
    }
  }
  return decoded.slice(0, 60);
}

function extractEmails(text: string, domain: string): string[] {
  const regex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,12}/g;
  const matches = text.match(regex) || [];
  const blacklist = [
    "sentry",
    "wixpress",
    "example.com",
    "domain.com",
    "email.com",
    "wordpress.org",
    "schema.org",
    "w3.org",
    ".png",
    ".jpg",
    ".jpeg",
    ".webp",
    ".svg",
    ".gif",
    "2x.",
  ];

  const valid = matches
    .map((m) => m.toLowerCase().trim())
    .filter((email) => !blacklist.some((b) => email.includes(b)) && email.length < 64);

  const unique = Array.from(new Set(valid));
  // Prioritize emails matching domain or hr/ik/kariyer/info
  unique.sort((a, b) => {
    const aScore =
      (a.includes(domain) ? 10 : 0) +
      (a.startsWith("ik@") || a.startsWith("hr@") || a.startsWith("kariyer@") ? 6 : 0) +
      (a.startsWith("info@") || a.startsWith("hello@") || a.startsWith("iletisim@") ? 4 : 0);
    const bScore =
      (b.includes(domain) ? 10 : 0) +
      (b.startsWith("ik@") || b.startsWith("hr@") || b.startsWith("kariyer@") ? 6 : 0) +
      (b.startsWith("info@") || b.startsWith("hello@") || b.startsWith("iletisim@") ? 4 : 0);
    return bScore - aScore;
  });

  return unique;
}

function extractPhones(text: string): string[] {
  // Match +90 232 ..., 0232 ..., 05xx ..., 0850 ...
  const regex = /(?:\+90|0)\s*\(?[23458][0-9]{2}\)?[\s.-]*[0-9]{3}[\s.-]*[0-9]{2}[\s.-]*[0-9]{2}/g;
  const matches = text.match(regex) || [];
  const cleaned = matches.map((m) => m.replace(/\s+/g, " ").trim());
  const unique = Array.from(new Set(cleaned));
  // Prioritize İzmir 232 area code
  unique.sort((a, b) => (b.includes("232") ? 1 : 0) - (a.includes("232") ? 1 : 0));
  return unique;
}

export async function POST(req: NextRequest) {
  if (!(await isAuthenticatedAdmin())) {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const rawInput = String(body.url || body.domain || "").trim();
    const categoryHint = body.categoryHint as CompanyCategory | undefined;
    const cityHint = String(body.cityHint || "").trim();

    if (!rawInput) {
      return NextResponse.json({ error: "Lütfen incelenecek firma web sitesini girin." }, { status: 400 });
    }

    let normalizedUrl = rawInput;
    if (!/^https?:\/\//i.test(normalizedUrl)) {
      normalizedUrl = `https://${normalizedUrl}`;
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(normalizedUrl);
    } catch {
      return NextResponse.json({ error: "Geçersiz URL veya alan adı formatı." }, { status: 400 });
    }

    const domain = parsedUrl.hostname.replace(/^www\./i, "").toLowerCase();
    const origin = parsedUrl.origin;

    // 1. Fetch Homepage
    const homeRes = await fetchHtmlWithTiming(origin);
    const html = homeRes.html;
    const lowerHtml = html.toLowerCase();

    // 2. Discover internal Contact & Career links
    const hrefRegex = /href=["']([^"'#]+)["']/gi;
    let match: RegExpExecArray | null;
    let discoveredContactUrl = "";
    let discoveredCareerUrl = "";

    while ((match = hrefRegex.exec(html)) !== null) {
      const href = match[1].trim();
      const lowerHref = href.toLowerCase();
      let fullHref = "";
      try {
        const u = new URL(href, origin);
        if (u.hostname.replace(/^www\./i, "").toLowerCase() === domain) {
          fullHref = u.href;
        }
      } catch {
        continue;
      }
      if (!fullHref) continue;

      if (
        !discoveredCareerUrl &&
        (lowerHref.includes("kariyer") ||
          lowerHref.includes("career") ||
          lowerHref.includes("insan-kaynaklari") ||
          lowerHref.includes("/ik") ||
          lowerHref.includes("/jobs") ||
          lowerHref.includes("ekibimiz"))
      ) {
        discoveredCareerUrl = fullHref;
      }

      if (
        !discoveredContactUrl &&
        (lowerHref.includes("iletisim") ||
          lowerHref.includes("contact") ||
          lowerHref.includes("bize-ulasin") ||
          lowerHref.includes("ulasim"))
      ) {
        discoveredContactUrl = fullHref;
      }
    }

    // Fetch Contact & Career subpages in parallel (fast timeout)
    const subPagesToFetch: string[] = [];
    if (discoveredContactUrl) subPagesToFetch.push(discoveredContactUrl);
    if (discoveredCareerUrl && discoveredCareerUrl !== discoveredContactUrl) {
      subPagesToFetch.push(discoveredCareerUrl);
    }

    const subResults = await Promise.all(
      subPagesToFetch.map((u) => fetchHtmlWithTiming(u, 4000))
    );

    const combinedHtml = [html, ...subResults.map((r) => r.html)].join("\n");
    const combinedLower = combinedHtml.toLowerCase();

    // 3. Extract Company Name
    const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    const ogSiteMatch = html.match(/property=["']og:site_name["']\s+content=["']([^"']+)["']/i);
    const companyName = cleanCompanyName(ogSiteMatch?.[1] || titleMatch?.[1] || "", domain);

    // 4. Extract Contact Details
    const emails = extractEmails(combinedHtml, domain);
    const phones = extractPhones(combinedHtml);
    const linkedinMatch = combinedHtml.match(
      /https?:\/\/(?:www\.)?linkedin\.com\/company\/[a-zA-Z0-9_-]+\/?/i
    );
    const linkedinUrl =
      linkedinMatch?.[0] ||
      `https://www.linkedin.com/search/results/companies/?keywords=${encodeURIComponent(companyName)}`;

    // 5. Detect İzmir & District / Work Model
    const izmirDistricts = [
      "Bayraklı",
      "Alsancak",
      "Konak",
      "Bornova",
      "Urla",
      "Karşıyaka",
      "Buca",
      "Gaziemir",
      "Çiğli",
      "Balçova",
      "Narlıdere",
      "Güzelbahçe",
    ];
    let detectedDistrict = "";
    for (const dist of izmirDistricts) {
      if (combinedLower.includes(dist.toLowerCase())) {
        detectedDistrict = dist;
        break;
      }
    }
    if (!detectedDistrict && combinedLower.includes("teknopark izmir")) {
      detectedDistrict = "Urla (Teknopark İzmir)";
    } else if (!detectedDistrict && combinedLower.includes("depark")) {
      detectedDistrict = "Buca / İnciraltı (DEPARK)";
    }

    const hasIzmirSignal =
      combinedLower.includes("izmir") ||
      combinedLower.includes("i̇zmir") ||
      Boolean(detectedDistrict) ||
      phones.some((p) => p.includes("232")) ||
      cityHint.toLowerCase().includes("izmir");

    const hasRemoteSignal =
      combinedLower.includes("remote") ||
      combinedLower.includes("uzaktan çalışma") ||
      combinedLower.includes("hibrit") ||
      combinedLower.includes("hybrid");

    const city = hasIzmirSignal ? "İzmir" : cityHint || "Türkiye / Uzaktan";
    const district = detectedDistrict || (hasIzmirSignal ? "Merkez" : "Remote");
    let workModel: WorkModel = "İzmir (Yerinde / Hibrit)";
    if (hasIzmirSignal && hasRemoteSignal) {
      workModel = "İzmir + Uzaktan";
    } else if (!hasIzmirSignal) {
      workModel = "Uzaktan (Remote)";
    }

    // 6. Detect Technologies
    const technologies: string[] = [];
    if (lowerHtml.includes("wp-content") || lowerHtml.includes("wp-includes")) {
      technologies.push("WordPress");
    }
    if (lowerHtml.includes("elementor")) {
      technologies.push("Elementor");
    }
    if (lowerHtml.includes("woocommerce")) {
      technologies.push("WooCommerce");
    }
    if (lowerHtml.includes("_next/static") || lowerHtml.includes("__next_data__")) {
      technologies.push("Next.js", "React");
    } else if (lowerHtml.includes("react") || lowerHtml.includes("data-reactroot")) {
      technologies.push("React");
    }
    if (lowerHtml.includes("__nuxt") || lowerHtml.includes("_nuxt/")) {
      technologies.push("Vue / Nuxt");
    }
    if (combinedLower.includes("shopify") || lowerHtml.includes("cdn.shopify.com")) {
      technologies.push("Shopify");
    }
    if (combinedLower.includes("ikas") || lowerHtml.includes("myikas")) {
      technologies.push("İkas");
    }
    if (combinedLower.includes("ticimax") || combinedLower.includes("t-soft") || combinedLower.includes("ideasoft")) {
      technologies.push("E-Ticaret Altyapısı");
    }
    if (lowerHtml.includes("tailwind")) {
      technologies.push("Tailwind CSS");
    }
    if (lowerHtml.includes("gsap") || lowerHtml.includes("scrolltrigger")) {
      technologies.push("GSAP");
    }
    if (
      homeRes.headers["x-powered-by"]?.toLowerCase().includes("php") ||
      combinedLower.includes("laravel")
    ) {
      technologies.push("PHP / Laravel");
    }
    if (combinedLower.includes("typescript")) {
      technologies.push("TypeScript");
    }
    if (lowerHtml.includes("googletagmanager.com") || lowerHtml.includes("gtag(")) {
      technologies.push("Google Tag Manager");
    }

    const hasSchemaOrg = lowerHtml.includes("application/ld+json");
    if (hasSchemaOrg) {
      technologies.push("Schema.org / JSON-LD");
    }

    if (technologies.length === 0) {
      technologies.push("Özel Web Mimarisi", "JavaScript / HTML5");
    }

    // 7. Detect Services & Category
    const services: string[] = [];
    if (combinedLower.includes("web tasarım") || combinedLower.includes("kurumsal web")) {
      services.push("Kurumsal Web Tasarım");
    }
    if (combinedLower.includes("e-ticaret") || combinedLower.includes("eticaret") || combinedLower.includes("e-commerce")) {
      services.push("E-Ticaret Çözümleri");
    }
    if (combinedLower.includes("seo") || combinedLower.includes("arama motoru")) {
      services.push("Teknik SEO & İçerik");
    }
    if (combinedLower.includes("özel yazılım") || combinedLower.includes("yazılım geliştirme") || combinedLower.includes("software")) {
      services.push("Özel Yazılım Geliştirme");
    }
    if (combinedLower.includes("ui/ux") || combinedLower.includes("kullanıcı deneyimi")) {
      services.push("UI/UX Tasarım");
    }
    if (combinedLower.includes("mobil uygulama") || combinedLower.includes("mobile app")) {
      services.push("Mobil Uygulama");
    }
    if (combinedLower.includes("dijital pazarlama") || combinedLower.includes("google ads")) {
      services.push("Dijital Pazarlama");
    }
    if (services.length === 0) {
      services.push("Web & Dijital Çözümler");
    }

    let category: CompanyCategory = categoryHint || "Web Ajansı";
    if (!categoryHint) {
      if (
        combinedLower.includes("seo ajansı") ||
        (combinedLower.includes("seo") && !combinedLower.includes("yazılım şirketi") && companyName.toLowerCase().includes("seo"))
      ) {
        category = "SEO Ajansı";
      } else if (
        combinedLower.includes("e-ticaret ajansı") ||
        technologies.includes("Shopify") ||
        technologies.includes("İkas")
      ) {
        category = "E-Ticaret Ajansı";
      } else if (
        combinedLower.includes("teknopark") ||
        combinedLower.includes("yazılım şirketi") ||
        combinedLower.includes("software") ||
        combinedLower.includes("saas")
      ) {
        category = "Yazılım Şirketi";
      }
    }

    // 8. Estimate Company Size
    let companySize: CompanySize = "Büyüyen (10-30)";
    if (combinedLower.includes("teknopark") || combinedLower.includes("ar-ge merkezi") || combinedLower.includes("100+")) {
      companySize = "Orta Ölçekli (30-100)";
    } else if (!discoveredCareerUrl && technologies.includes("WordPress") && services.length <= 3) {
      companySize = "Butik (2-10)";
    }

    // 9. Technical Diagnostics
    const missingPerfSignals: string[] = [];
    if (!homeRes.ok) {
      missingPerfSignals.push("Site canlı taramada doğrudan yanıt vermedi veya güvenlik duvarı (WAF) arkasında.");
    } else {
      if (! lowerHtml.includes('rel="preload"')) {
        missingPerfSignals.push("Kritik Web Font / LCP görsel preload etiketi tespit edilmedi (LCP gecikme riski).");
      }
      if (lowerHtml.includes("elementor") && homeRes.ttfbMs > 500) {
        missingPerfSignals.push("Elementor DOM yükü + TTFB gecikmesi: Core Web Vitals / INP optimizasyonu için güçlü fırsat.");
      }
    }

    const hasOpenPositionSignal =
      Boolean(discoveredCareerUrl) &&
      (combinedLower.includes("açık pozisyon") ||
        combinedLower.includes("başvuru") ||
        combinedLower.includes("developer") ||
        combinedLower.includes("uzmanı") ||
        combinedLower.includes("ekibimize katıl"));

    const aiEvaluation = evaluateCompanyForPortfolio({
      name: companyName,
      domain,
      category,
      city,
      district,
      workModel,
      companySize,
      technologies,
      services,
      hasCareerPage: Boolean(discoveredCareerUrl),
      hasOpenPositionSignal,
      ttfbMs: homeRes.ok ? homeRes.ttfbMs : undefined,
      hasSchemaOrg: homeRes.ok ? hasSchemaOrg : undefined,
      missingPerfSignals,
    });

    const followUp = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

    const analyzedCompany: EmployerCompany = {
      id: `emp-${domain.replace(/[^a-z0-9]/g, "-")}-${Date.now().toString(36)}`,
      name: companyName,
      domain,
      website: origin,
      careerUrl: discoveredCareerUrl || discoveredContactUrl || `${origin}/iletisim`,
      category,
      city,
      district,
      workModel,
      companySize,
      technologies,
      services,
      contactEmail: emails[0] || `info@${domain}`,
      contactPhone: phones[0] || "Belirtilmemiş",
      linkedinUrl,
      approved: false,
      applicationStatus: "Keşfedildi",
      followUpDate: followUp,
      lastAnalyzedAt: new Date().toISOString(),
      ttfbMs: homeRes.ok ? homeRes.ttfbMs : undefined,
      hasSchemaOrg: homeRes.ok ? hasSchemaOrg : undefined,
      notes: homeRes.ok
        ? `Canlı tarama tamamlandı (${homeRes.ttfbMs}ms TTFB). ${emails.length > 0 ? `Tespit edilen e-postalar: ${emails.slice(0, 3).join(", ")}` : ""}`
        : "Domain kaydedildi; detaylı iletişim bilgilerini kontrol edin.",
      aiEvaluation,
    };

    return NextResponse.json({ company: analyzedCompany });
  } catch (err) {
    console.error("Analyze company error:", err);
    return NextResponse.json(
      { error: "Firma analizi sırasında beklenmeyen bir hata oluştu." },
      { status: 500 }
    );
  }
}
