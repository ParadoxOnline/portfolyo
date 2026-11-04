import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

interface BotRule {
  name: string;
  category: "search" | "ai_crawl" | "ai_user" | "data_mining";
  description: string;
  userAgent: string;
  status: "allowed" | "blocked" | "partial" | "not_specified";
  details: string;
}

const TRACKED_AI_BOTS = [
  {
    name: "GPTBot",
    userAgent: "gptbot",
    category: "ai_crawl" as const,
    description: "OpenAI ChatGPT ve GPT modellerinin web veri tabanını genişletmek için kullandığı ana tarayıcı.",
  },
  {
    name: "ChatGPT-User",
    userAgent: "chatgpt-user",
    category: "ai_user" as const,
    description: "Kullanıcı ChatGPT'ye canlı bir web araması yaptırdığında sitenizi anlık ziyaret eden bot.",
  },
  {
    name: "PerplexityBot",
    userAgent: "perplexitybot",
    category: "ai_user" as const,
    description: "Perplexity AI'ın yanıtlarında siteleri kaynak göstermek ve alıntı yapmak için kullandığı tarayıcı.",
  },
  {
    name: "ClaudeBot",
    userAgent: "claudebot",
    category: "ai_crawl" as const,
    description: "Anthropic Claude modellerinin veri seti ve analizleri için çalışan resmi web crawler'ı.",
  },
  {
    name: "Google-Extended",
    userAgent: "google-extended",
    category: "ai_crawl" as const,
    description: "Google Gemini ve Vertex AI yapay zeka modellerini eğitmek için kullanılan özel crawler.",
  },
  {
    name: "Applebot-Extended",
    userAgent: "applebot-extended",
    category: "ai_crawl" as const,
    description: "Apple Intelligence modellerinin Siri ve sistem AI yeteneklerini eğitmek için kullandığı bot.",
  },
  {
    name: "Bytespider",
    userAgent: "bytespider",
    category: "ai_crawl" as const,
    description: "ByteDance (TikTok) yapay zeka ve arama sistemlerinin web tarayıcısı.",
  },
  {
    name: "CCBot",
    userAgent: "ccbot",
    category: "data_mining" as const,
    description: "Common Crawl açık kaynak veri seti botu (Çoğu açık kaynak LLM bu verilerle eğitilir).",
  },
  {
    name: "Googlebot",
    userAgent: "googlebot",
    category: "search" as const,
    description: "Geleneksel Google arama dizini tarayıcısı (Arama motoru organik sıralamaları için temel bot).",
  },
  {
    name: "Bingbot",
    userAgent: "bingbot",
    category: "search" as const,
    description: "Microsoft Bing ve Copilot arama dizini için kullanılan geleneksel web tarayıcısı.",
  },
];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rawUrl = (body.url || "").trim();

    if (!rawUrl) {
      return NextResponse.json({ error: "Lütfen taranacak web sitesi adresini girin." }, { status: 400 });
    }

    let parsedUrl: URL;
    try {
      const formatted = rawUrl.startsWith("http://") || rawUrl.startsWith("https://") ? rawUrl : `https://${rawUrl}`;
      parsedUrl = new URL(formatted);
    } catch {
      return NextResponse.json({ error: "Geçerli bir web sitesi adresi (URL) girilmedi." }, { status: 400 });
    }

    const domain = parsedUrl.hostname;
    const robotsUrl = `${parsedUrl.protocol}//${domain}/robots.txt`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);

    let robotsText = "";
    let statusCode = 404;
    let hasRobots = false;

    try {
      const res = await fetch(robotsUrl, {
        signal: controller.signal,
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; GeoAiRadar/2.0; +https://sabrican.dev)",
          Accept: "text/plain, text/html, */*",
        },
      });
      statusCode = res.status;
      if (res.ok) {
        robotsText = await res.text();
        hasRobots = true;
      }
    } catch {
      hasRobots = false;
    } finally {
      clearTimeout(timeout);
    }

    // Robots.txt ayrıştırma (Parser)
    const lines = robotsText.split(/\r?\n/);
    const groups: Array<{ userAgents: string[]; rules: Array<{ type: "allow" | "disallow"; path: string }> }> = [];

    let currentUAs: string[] = [];
    let currentRules: Array<{ type: "allow" | "disallow"; path: string }> = [];

    for (const rawLine of lines) {
      const line = rawLine.split("#")[0].trim();
      if (!line) continue;

      const [directive, ...rest] = line.split(":");
      const value = rest.join(":").trim();
      const dirLower = directive.toLowerCase().trim();

      if (dirLower === "user-agent") {
        if (currentRules.length > 0) {
          groups.push({ userAgents: currentUAs, rules: currentRules });
          currentUAs = [];
          currentRules = [];
        }
        currentUAs.push(value.toLowerCase());
      } else if (dirLower === "disallow") {
        currentRules.push({ type: "disallow", path: value });
      } else if (dirLower === "allow") {
        currentRules.push({ type: "allow", path: value });
      }
    }

    if (currentUAs.length > 0 || currentRules.length > 0) {
      groups.push({ userAgents: currentUAs, rules: currentRules });
    }

    // Her bot için durumu saptayalım
    const botResults: BotRule[] = TRACKED_AI_BOTS.map((bot) => {
      if (!hasRobots) {
        return {
          ...bot,
          status: "allowed",
          details: "robots.txt dosyası bulunamadı. Standart web protokolü gereği tüm botlara varsayılan olarak izin verilir.",
        };
      }

      // 1. Botun kendi adına özel kural var mı?
      const specificGroup = groups.find((g) => g.userAgents.some((ua) => ua === bot.userAgent || ua.includes(bot.userAgent)));
      const wildcardGroup = groups.find((g) => g.userAgents.some((ua) => ua === "*"));

      const targetGroup = specificGroup || wildcardGroup;

      if (!targetGroup) {
        return {
          ...bot,
          status: "allowed",
          details: "Bu bot veya genel kurallar için özel bir kısıtlama belirtilmemiş (İzinli).",
        };
      }

      const disallowAll = targetGroup.rules.some((r) => r.type === "disallow" && (r.path === "/" || r.path === "/*"));
      const allowAll = targetGroup.rules.some((r) => r.type === "allow" && (r.path === "/" || r.path === "/*"));
      const hasSpecificDisallow = targetGroup.rules.some((r) => r.type === "disallow" && r.path !== "");

      if (disallowAll && !allowAll) {
        return {
          ...bot,
          status: "blocked",
          details: specificGroup
            ? `robots.txt içinde 'User-agent: ${bot.userAgent}' direktifiyle kökten engellenmiş (Disallow: /).`
            : "Genel kural 'User-agent: *' ile tüm sitenin taranması engellenmiş (Disallow: /).",
        };
      }

      if (hasSpecificDisallow) {
        return {
          ...bot,
          status: "partial",
          details: `Ana sayfaya izin verilmiş ancak bazı alt dizinler (${targetGroup.rules
            .filter((r) => r.type === "disallow")
            .slice(0, 3)
            .map((r) => r.path)
            .join(", ")}) engellenmiş.`,
        };
      }

      return {
        ...bot,
        status: "allowed",
        details: specificGroup ? "Bu bot için açıkça izin tanımlanmış." : "Varsayılan izin kuralları geçerli.",
      };
    });

    // GEO Skoru (Yapay zeka erişilebilirlik derecesi)
    const aiBots = botResults.filter((b) => b.category.startsWith("ai_"));
    const allowedAiBots = aiBots.filter((b) => b.status === "allowed" || b.status === "partial").length;
    const geoScore = Math.round((allowedAiBots / aiBots.length) * 100);

    // Önerilen GEO Uyumlu robots.txt Çıktısı
    const recommendedRobotsTxt = `# Modern Yapay Zeka (GEO) ve Arama Motoru Uyumlu robots.txt
# Alan Adı: ${domain}

User-agent: *
Allow: /
Disallow: /wp-admin/
Disallow: /admin/
Disallow: /api/private/

# Yapay Zeka Canlı Arama Botlarına Açık İzin (GEO Görünürlüğü İçin)
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: ClaudeBot
Allow: /

# Site Haritası
Sitemap: ${parsedUrl.protocol}//${domain}/sitemap.xml`;

    return NextResponse.json({
      domain,
      robotsUrl,
      hasRobots,
      statusCode,
      rawContent: robotsText.slice(0, 4000),
      geoScore,
      botResults,
      recommendedRobotsTxt,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "robots.txt incelenirken beklenmeyen bir hata oluştu.";
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}

