import { NextRequest, NextResponse } from "next/server";
import { isAuthenticatedAdmin } from "@/lib/admin-auth";
import {
  CompanyCategory,
  EmployerCompany,
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

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36";

async function liveWebSearchForCompanyUrls(query: string): Promise<string[]> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 6000);

  try {
    const res = await fetch("https://html.duckduckgo.com/html/", {
      method: "POST",
      signal: controller.signal,
      headers: {
        "User-Agent": USER_AGENT,
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
      body: "q=" + encodeURIComponent(query) + "&b=",
    });

    if (!res.ok) return [];
    const html = await res.text();

    const linkRegex = /<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
    let match: RegExpExecArray | null;
    const candidates: string[] = [];

    while ((match = linkRegex.exec(html)) !== null) {
      let href = match[1].trim();
      if (!href || href.startsWith("/") || href.includes("duckduckgo.com")) {
        continue;
      }

      if (href.includes("uddg=")) {
        try {
          const u = new URL(href, "https://html.duckduckgo.com");
          const uddg = u.searchParams.get("uddg");
          if (uddg) href = decodeURIComponent(uddg);
        } catch {
          // ignore
        }
      }

      try {
        const u = new URL(href);
        const host = u.hostname.replace(/^www\./i, "").toLowerCase();
        if (
          !DIRECTORY_BLACKLIST.some((b) => host === b || host.endsWith(`.${b}`)) &&
          !candidates.some((c) => new URL(c).hostname.replace(/^www\./i, "").toLowerCase() === host)
        ) {
          candidates.push(u.origin);
        }
      } catch {
        continue;
      }
    }

    return candidates;
  } catch {
    return [];
  } finally {
    clearTimeout(timer);
  }
}

async function fetchLiveCompanyDiagnostics(originUrl: string): Promise<{
  ok: boolean;
  html: string;
  ttfbMs: number;
  contactUrl: string;
  careerUrl: string;
}> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 5500);
  const start = performance.now();

  try {
    const res = await fetch(originUrl, {
      signal: controller.signal,
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "tr-TR,tr;q=0.9",
      },
      redirect: "follow",
    });

    const ttfbMs = Math.round(performance.now() - start);
    const html = await res.text();

    let contactUrl = "";
    let careerUrl = "";

    const hrefRegex = /href=["']([^"'#]+)["']/gi;
    let m: RegExpExecArray | null;
    while ((m = hrefRegex.exec(html)) !== null) {
      const lower = m[1].toLowerCase();
      try {
        const abs = new URL(m[1], originUrl).href;
        if (
          !careerUrl &&
          (lower.includes("kariyer") || lower.includes("career") || lower.includes("insan-kaynaklari"))
        ) {
          careerUrl = abs;
        }
        if (
          !contactUrl &&
          (lower.includes("iletisim") || lower.includes("contact") || lower.includes("bize-ulasin"))
        ) {
          contactUrl = abs;
        }
      } catch {
        continue;
      }
    }

    return {
      ok: res.ok,
      html,
      ttfbMs,
      contactUrl: contactUrl || `${originUrl}/iletisim`,
      careerUrl: careerUrl || contactUrl || `${originUrl}/kariyer`,
    };
  } catch {
    return {
      ok: false,
      html: "",
      ttfbMs: Math.round(performance.now() - start),
      contactUrl: `${originUrl}/iletisim`,
      careerUrl: `${originUrl}/kariyer`,
    };
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

    // Build real live search query
    const queryParts: string[] = [];
    if (location.includes("İzmir")) queryParts.push("İzmir");
    if (category !== "Tümü") queryParts.push(category);
    else queryParts.push("web ajansı yazılım şirketi");
    if (techFilter !== "Tümü") queryParts.push(techFilter.split("/")[0].trim());
    if (customKeyword) queryParts.push(customKeyword);

    const searchQuery = queryParts.join(" ");

    // 1. Live web search
    const discoveredOrigins = await liveWebSearchForCompanyUrls(searchQuery);

    const freshOrigins = discoveredOrigins.filter((origin) => {
      try {
        const domain = new URL(origin).hostname.replace(/^www\./i, "").toLowerCase();
        return !existingDomains.has(domain);
      } catch {
        return false;
      }
    });

    if (freshOrigins.length === 0) {
      return NextResponse.json({
        query: searchQuery,
        discoveredCount: 0,
        companies: [],
        message: "Canlı arama tamamlandı ancak bu sorguda yeni firma bulunamadı veya hepsi listenizde kayıtlı.",
      });
    }

    // 2. Fetch live real sites in parallel (top 6 fresh companies)
    const targets = freshOrigins.slice(0, 6);
    const liveResults = await Promise.all(
      targets.map((origin) => fetchLiveCompanyDiagnostics(origin))
    );

    const discoveredCompanies: EmployerCompany[] = [];
    const followUp = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

    for (let i = 0; i < targets.length; i++) {
      const origin = targets[i];
      const diag = liveResults[i];
      const parsed = new URL(origin);
      const domain = parsed.hostname.replace(/^www\./i, "").toLowerCase();
      const html = diag.html;
      const lowerHtml = html.toLowerCase();

      // Real Company Name extraction from <title>
      const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
      let companyName = domain.split(".")[0];
      if (titleMatch?.[1]) {
        const cleanTitle = titleMatch[1]
          .replace(/&amp;/g, "&")
          .replace(/<[^>]+>/g, "")
          .trim();
        const firstSegment = cleanTitle.split(/\s*[\|•·—–-]\s*/)[0]?.trim();
        if (firstSegment && firstSegment.length >= 3 && firstSegment.length <= 50) {
          companyName = firstSegment;
        }
      }

      // Real Email & Phone extraction
      const emailMatches = html.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,10}/g) || [];
      const cleanEmails = [...new Set(emailMatches.map((e) => e.toLowerCase()))].filter(
        (e) => !e.includes("wix") && !e.includes("sentry") && !e.includes(".png") && !e.includes(".jpg")
      );
      const contactEmail = cleanEmails.find((e) => e.includes(domain)) || cleanEmails[0] || `info@${domain}`;

      const phoneMatches =
        html.match(/(?:\+90|0)\s*\(?[23458][0-9]{2}\)?[\s.-]*[0-9]{3}[\s.-]*[0-9]{2}[\s.-]*[0-9]{2}/g) || [];
      const contactPhone = phoneMatches[0]?.trim() || "Web sitesinde form mevcut";

      // Real Technology Detection
      const technologies: string[] = [];
      if (lowerHtml.includes("wp-content") || lowerHtml.includes("wp-includes")) technologies.push("WordPress");
      if (lowerHtml.includes("elementor")) technologies.push("Elementor");
      if (lowerHtml.includes("woocommerce")) technologies.push("WooCommerce");
      if (lowerHtml.includes("_next/static") || lowerHtml.includes("__next_data__")) technologies.push("Next.js", "React");
      else if (lowerHtml.includes("react")) technologies.push("React");
      if (lowerHtml.includes("shopify")) technologies.push("Shopify");
      if (lowerHtml.includes("ikas")) technologies.push("İkas");
      if (lowerHtml.includes("tailwind")) technologies.push("Tailwind CSS");
      const hasSchemaOrg = lowerHtml.includes("application/ld+json");
      if (hasSchemaOrg) technologies.push("Schema.org / JSON-LD");

      if (technologies.length === 0) technologies.push("Özel Web Mimarisi");

      // Real Location & District Signals
      const izmirDistricts = ["Bayraklı", "Alsancak", "Konak", "Bornova", "Urla", "Karşıyaka", "Buca", "Gaziemir"];
      let detectedDistrict = "";
      for (const d of izmirDistricts) {
        if (lowerHtml.includes(d.toLowerCase())) {
          detectedDistrict = d;
          break;
        }
      }

      const hasIzmir = lowerHtml.includes("izmir") || lowerHtml.includes("i̇zmir") || Boolean(detectedDistrict);
      const city = hasIzmir ? "İzmir" : location.includes("İzmir") ? "İzmir" : "Türkiye / Uzaktan";
      const district = detectedDistrict || (hasIzmir ? "Merkez" : "Remote");

      const derivedCategory: CompanyCategory =
        category !== "Tümü"
          ? category
          : lowerHtml.includes("seo ajansı")
          ? "SEO Ajansı"
          : lowerHtml.includes("e-ticaret")
          ? "E-Ticaret Ajansı"
          : lowerHtml.includes("yazılım")
          ? "Yazılım Şirketi"
          : "Web Ajansı";

      const aiEvaluation = evaluateCompanyForPortfolio({
        name: companyName,
        domain,
        category: derivedCategory,
        city,
        district,
        workModel: hasIzmir ? "İzmir (Yerinde / Hibrit)" : "Uzaktan (Remote)",
        companySize: "Büyüyen (10-30)",
        technologies,
        services: [derivedCategory, "Web & Dijital Sistemler"],
        hasCareerPage: Boolean(diag.careerUrl),
        ttfbMs: diag.ttfbMs,
        hasSchemaOrg,
      });

      discoveredCompanies.push({
        id: `live-${domain.replace(/[^a-z0-9]/g, "-")}-${Date.now().toString(36)}`,
        name: companyName,
        domain,
        website: origin,
        careerUrl: diag.careerUrl,
        category: derivedCategory,
        city,
        district,
        workModel: hasIzmir ? "İzmir (Yerinde / Hibrit)" : "Uzaktan (Remote)",
        companySize: "Büyüyen (10-30)",
        technologies,
        services: [derivedCategory],
        contactEmail,
        contactPhone,
        linkedinUrl: `https://www.linkedin.com/search/results/companies/?keywords=${encodeURIComponent(companyName)}`,
        approved: false,
        applicationStatus: "Keşfedildi",
        followUpDate: followUp,
        lastAnalyzedAt: new Date().toISOString(),
        ttfbMs: diag.ttfbMs,
        hasSchemaOrg,
        notes: `Canlı web taramasıyla (${diag.ttfbMs}ms TTFB) bulundu. İletişim e-postası: ${contactEmail}`,
        aiEvaluation,
      });

      existingDomains.add(domain);
    }

    return NextResponse.json({
      query: searchQuery,
      discoveredCount: discoveredCompanies.length,
      companies: discoveredCompanies,
    });
  } catch (err) {
    console.error("Discovery API error:", err);
    return NextResponse.json(
      { error: "Canlı keşif sırasında bir hata oluştu." },
      { status: 500 }
    );
  }
}
