import { NextRequest, NextResponse } from "next/server";

async function fetchWebsite(
  targetUrl: string,
  timeoutMs = 15000
): Promise<{ response: Response; html: string; ttfbMs: number }> {
  const startTime = performance.now();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(targetUrl, {
      method: "GET",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36 (Antigravity-DeepAuditor/3.0)",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7",
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      },
      signal: controller.signal,
      redirect: "follow",
    });

    const ttfbMs = Math.round(performance.now() - startTime);
    const html = await res.text();
    clearTimeout(timeoutId);

    return { response: res, html, ttfbMs };
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

export async function POST(req: NextRequest) {
  try {
    let body: { url?: string };
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Geçersiz JSON gövdesi iletildi." }, { status: 400 });
    }

    const rawUrl = body?.url?.trim();
    if (!rawUrl) {
      return NextResponse.json({ error: "Lütfen analiz edilecek bir web sitesi adresi girin." }, { status: 400 });
    }

    let cleanUrl = rawUrl.toLowerCase();
    if (!cleanUrl.startsWith("http://") && !cleanUrl.startsWith("https://")) {
      cleanUrl = "https://" + cleanUrl;
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(cleanUrl);
    } catch {
      return NextResponse.json({ error: "Geçersiz web adresi formatı." }, { status: 400 });
    }

    // 1. Canlı HTTP isteği
    let fetchResult: { response: Response; html: string; ttfbMs: number };
    try {
      fetchResult = await fetchWebsite(parsedUrl.toString(), 15000);
    } catch (primaryErr: unknown) {
      const isTimeout =
        primaryErr instanceof Error &&
        (primaryErr.name === "AbortError" || primaryErr.message.includes("timeout") || primaryErr.message.includes("aborted"));

      if (!parsedUrl.hostname.startsWith("www.") && !isTimeout) {
        try {
          const fallbackUrl = `https://www.${parsedUrl.hostname}${parsedUrl.pathname}${parsedUrl.search}`;
          fetchResult = await fetchWebsite(fallbackUrl, 10000);
        } catch {
          const msg = isTimeout
            ? "Hedef web sitesi 15 saniye içinde yanıt vermedi (zaman aşımı)."
            : primaryErr instanceof Error
            ? primaryErr.message
            : "Bağlantı kurulamadı";
          return NextResponse.json(
            { error: `Hedef siteye bağlanılamadı (${parsedUrl.hostname}): ${msg}` },
            { status: 504 }
          );
        }
      } else {
        const msg = isTimeout
          ? "Hedef web sitesi 15 saniye içinde yanıt vermedi (zaman aşımı)."
          : primaryErr instanceof Error
          ? primaryErr.message
          : "Bağlantı kurulamadı";
        return NextResponse.json(
          { error: `Hedef siteye bağlanılamadı (${parsedUrl.hostname}): ${msg}` },
          { status: 504 }
        );
      }
    }

    const { response, html, ttfbMs } = fetchResult;
    const statusCode = response.status;
    const statusText = response.statusText || "OK";
    const finalUrl = response.url;
    const isHttps = finalUrl.startsWith("https://");

    // Header Analizleri
    const headers = response.headers;
    const contentType = headers.get("content-type") || "text/html";
    const contentEncoding = headers.get("content-encoding") || "Yok (Sıkıştırmasız)";
    const serverHeader = headers.get("server") || "Gizli / Belirtilmemiş";
    const hsts = headers.has("strict-transport-security");
    const hstsValue = headers.get("strict-transport-security");
    const xFrameOptions = headers.get("x-frame-options");
    const xContentTypeOptions = headers.get("x-content-type-options");
    const referrerPolicy = headers.get("referrer-policy");
    const csp = headers.get("content-security-policy");

    const pageSizeKb = Number((html.length / 1024).toFixed(1));

    // 2. SEO & Meta İncelemesi
    const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim().replace(/\s+/g, " ") : null;
    const titleLength = title ? title.length : 0;

    const descMatch =
      html.match(/<meta\s+name=["']description["']\s+content=["'](.*?)["']/i) ||
      html.match(/<meta\s+content=["'](.*?)["']\s+name=["']description["']/i);
    const description = descMatch ? descMatch[1].trim().replace(/\s+/g, " ") : null;
    const descLength = description ? description.length : 0;

    const canonicalMatch = html.match(/<link\s+rel=["']canonical["']\s+href=["'](.*?)["']/i);
    const canonical = canonicalMatch ? canonicalMatch[1].trim() : null;

    const robotsMatch =
      html.match(/<meta\s+name=["']robots["']\s+content=["'](.*?)["']/i) ||
      html.match(/<meta\s+content=["'](.*?)["']\s+name=["']robots["']/i);
    const robots = robotsMatch ? robotsMatch[1].trim() : "index, follow (varsayılan)";
    const isNoIndex = robots.toLowerCase().includes("noindex");
    const isNoFollow = robots.toLowerCase().includes("nofollow");

    const hasViewport = /<meta\s+name=["']viewport["']/i.test(html);
    const viewportMatch = html.match(/<meta\s+name=["']viewport["']\s+content=["'](.*?)["']/i);
    const viewportContent = viewportMatch ? viewportMatch[1] : null;

    // OpenGraph & Twitter
    const ogTitleMatch = html.match(/property=["']og:title["']\s+content=["'](.*?)["']/i);
    const ogDescMatch = html.match(/property=["']og:description["']\s+content=["'](.*?)["']/i);
    const ogImageMatch = html.match(/property=["']og:image["']\s+content=["'](.*?)["']/i);
    const twitterCardMatch = html.match(/name=["']twitter:card["']\s+content=["'](.*?)["']/i);

    // Favicon
    const hasFavicon = /<link\s+[^>]*rel=["'](icon|shortcut icon)["']/i.test(html);

    // 3. Başlık Hiyerarşisi (H1-H3)
    const h1Matches = Array.from(html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi));
    const h1List = h1Matches.map((m) => m[1].replace(/<[^>]*>/g, "").trim().replace(/\s+/g, " ")).filter(Boolean);
    const h2Matches = Array.from(html.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi));
    const h2List = h2Matches.map((m) => m[1].replace(/<[^>]*>/g, "").trim().replace(/\s+/g, " ")).filter(Boolean).slice(0, 8);
    const h3Count = (html.match(/<h3[^>]*>/gi) || []).length;

    // 4. Görseller, Alt Etiketleri & CLS (Width/Height) Taraması
    const imgMatches = Array.from(html.matchAll(/<img\s+([^>]*?)>/gi));
    let missingAltCount = 0;
    let missingDimensionsCount = 0;
    let modernFormatsCount = 0;
    let lazyLoadedFirstImage = false;
    const missingAltSamples: string[] = [];

    imgMatches.forEach((match, idx) => {
      const attrs = match[1];
      const hasAlt = /alt=["'][^"']*["']/i.test(attrs);
      if (!hasAlt) {
        missingAltCount++;
        const srcMatch = attrs.match(/src=["'](.*?)["']/i);
        if (srcMatch && missingAltSamples.length < 5) {
          missingAltSamples.push(srcMatch[1].split("?")[0]);
        }
      }

      // Width & Height kontrolü (CLS için kritik)
      const hasWidth = /width=["']\d+["']/i.test(attrs);
      const hasHeight = /height=["']\d+["']/i.test(attrs);
      if (!hasWidth || !hasHeight) {
        missingDimensionsCount++;
      }

      // Modern format kontrolü
      if (/\.(webp|avif)/i.test(attrs)) {
        modernFormatsCount++;
      }

      // İlk görselde lazy load var mı? (LCP'yi geciktirir)
      if (idx === 0 && /loading=["']lazy["']/i.test(attrs)) {
        lazyLoadedFirstImage = true;
      }
    });

    // 5. Bağlantılar (Links) & Güvenlik
    const linkMatches = Array.from(html.matchAll(/<a\s+([^>]*?)>/gi));
    let internalLinks = 0;
    let externalLinks = 0;
    let emptyLinks = 0;
    let unsafeTargetBlank = 0;

    linkMatches.forEach((match) => {
      const attrs = match[1];
      const hrefMatch = attrs.match(/href=["'](.*?)["']/i);
      if (hrefMatch) {
        const href = hrefMatch[1].trim();
        if (href === "" || href === "#" || href === "javascript:void(0)") {
          emptyLinks++;
        } else if (href.startsWith("http://") || href.startsWith("https://")) {
          if (href.includes(parsedUrl.hostname)) {
            internalLinks++;
          } else {
            externalLinks++;
            if (attrs.includes('target="_blank"') && !attrs.includes("noopener") && !attrs.includes("noreferrer")) {
              unsafeTargetBlank++;
            }
          }
        } else if (href.startsWith("/") || href.startsWith("#")) {
          internalLinks++;
        }
      }
    });

    // 6. Kod Yapısı, Render-Blocking Scriptler & DOM Düğümleri
    const scriptMatches = Array.from(html.matchAll(/<script\s+([^>]*?)>/gi));
    let asyncDeferScripts = 0;
    let renderBlockingScripts = 0;
    let totalExternalScripts = 0;

    scriptMatches.forEach((match) => {
      const attrs = match[1];
      if (attrs.includes("src=")) {
        totalExternalScripts++;
        if (attrs.includes("async") || attrs.includes("defer") || attrs.includes('type="module"')) {
          asyncDeferScripts++;
        } else {
          renderBlockingScripts++;
        }
      }
    });

    const stylesheetMatches = (html.match(/<link\s+[^>]*rel=["']stylesheet["'][^>]*>/gi) || []).length;
    const totalDomElements = (html.match(/<[a-zA-Z0-9]+(\s+[^>]*)?>/g) || []).length;

    // Google Fonts preconnect kontrolü
    const hasGoogleFonts = html.includes("fonts.googleapis.com") || html.includes("fonts.gstatic.com");
    const hasFontPreconnect = html.includes('rel="preconnect" href="https://fonts.gstatic.com"');

    // Metin kelime sayısı
    const textContent = html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    const wordCount = textContent.split(" ").filter((w) => w.length > 2).length;

    // 7. Schema.org / JSON-LD & Yapay Zeka (GEO) Ayrıştırması
    const jsonLdMatches = html.match(/<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi) || [];
    const schemaTypes: string[] = [];
    let sampleJsonLd: string | null = null;
    let hasWikidataSameAs = false;

    jsonLdMatches.forEach((script, idx) => {
      try {
        const jsonContent = script.replace(/<script[^>]*>/i, "").replace(/<\/script>/i, "");
        if (idx === 0) sampleJsonLd = jsonContent.slice(0, 350) + "...";
        if (jsonContent.includes("wikidata.org") || jsonContent.includes("wikipedia.org")) {
          hasWikidataSameAs = true;
        }
        const parsed = JSON.parse(jsonContent);

        const extractTypes = (obj: unknown) => {
          if (!obj || typeof obj !== "object") return;
          if (Array.isArray(obj)) {
            obj.forEach(extractTypes);
            return;
          }
          const record = obj as Record<string, unknown>;
          if (typeof record["@type"] === "string") schemaTypes.push(record["@type"]);
          if (record["@graph"] && Array.isArray(record["@graph"])) {
            record["@graph"].forEach(extractTypes);
          }
        };
        extractTypes(parsed);
      } catch {
        // Geçersiz json-ld yoksay
      }
    });

    const uniqueSchemaTypes = Array.from(new Set(schemaTypes));

    // 8. Skor Hesaplamaları
    // SEO Skoru (0-100)
    let seoScore = 0;
    if (title && titleLength >= 25 && titleLength <= 65) seoScore += 25;
    else if (title) seoScore += 14;

    if (description && descLength >= 90 && descLength <= 165) seoScore += 25;
    else if (description) seoScore += 12;

    if (canonical) seoScore += 15;
    if (h1List.length === 1) seoScore += 15;
    else if (h1List.length > 1) seoScore += 8;

    if (ogTitleMatch && ogDescMatch) seoScore += 10;

    if (imgMatches.length > 0) {
      const altRatio = (imgMatches.length - missingAltCount) / imgMatches.length;
      seoScore += Math.round(altRatio * 10);
    } else {
      seoScore += 10;
    }

    // Performans Skoru (0-100)
    let perfScore = 100;
    if (ttfbMs > 1000) perfScore -= 30;
    else if (ttfbMs > 500) perfScore -= 18;
    else if (ttfbMs > 300) perfScore -= 8;

    if (!contentEncoding.toLowerCase().includes("gzip") && !contentEncoding.toLowerCase().includes("br")) {
      perfScore -= 20;
    }
    if (totalDomElements > 2000) perfScore -= 20;
    else if (totalDomElements > 1300) perfScore -= 10;

    if (renderBlockingScripts > 4) perfScore -= 15;
    else if (renderBlockingScripts > 1) perfScore -= 8;

    if (stylesheetMatches > 8) perfScore -= 10;
    perfScore = Math.max(10, Math.min(100, perfScore));

    // GEO Skoru
    let geoPoints = 0;
    if (uniqueSchemaTypes.length > 0) geoPoints += 40;
    if (uniqueSchemaTypes.some((t) => ["Organization", "LocalBusiness", "MedicalClinic", "Corporation", "WebSite"].includes(t))) {
      geoPoints += 25;
    }
    if (uniqueSchemaTypes.includes("FAQPage") || uniqueSchemaTypes.includes("Question")) {
      geoPoints += 20;
    }
    if (hasWikidataSameAs) geoPoints += 15;

    let geoGrade: "A+" | "A" | "B" | "C" | "F" = "F";
    if (geoPoints >= 85) geoGrade = "A+";
    else if (geoPoints >= 70) geoGrade = "A";
    else if (geoPoints >= 50) geoGrade = "B";
    else if (geoPoints >= 30) geoGrade = "C";

    // 9. Bulgular & Eyleme Geçilebilir Tavsiyeler
    const passed: string[] = [];
    const warnings: string[] = [];
    const critical: string[] = [];
    const recommendations: string[] = [];

    // Geçti (Passed)
    if (isHttps) passed.push("SSL Sertifikası (HTTPS) aktif ve geçerli.");
    if (hsts) passed.push(`HSTS güvenlik başlığı devrede (${hstsValue || "max-age"}).`);
    if (contentEncoding.includes("br") || contentEncoding.includes("gzip")) {
      passed.push(`Sunucu sıkıştırması devrede: ${contentEncoding.toUpperCase()}.`);
    }
    if (title && titleLength >= 25 && titleLength <= 65) {
      passed.push(`Sayfa başlığı ideal uzunlukta (${titleLength} karakter): "${title}".`);
    }
    if (h1List.length === 1) {
      passed.push(`Hiyerarşi için tek ve net H1 başlığı mevcut: "${h1List[0]}".`);
    }
    if (uniqueSchemaTypes.length > 0) {
      passed.push(`Tespit edilen Schema.org JSON-LD varlıkları: ${uniqueSchemaTypes.join(", ")}.`);
    }
    if (hasViewport) passed.push("Mobil uyumluluk için meta viewport etiketi tanımlı.");
    if (hasFavicon) passed.push("Tarayıcı sekme simgesi (Favicon) mevcut.");

    // Uyarılar (Warnings)
    if (title && (titleLength < 25 || titleLength > 65)) {
      warnings.push(`Başlık uzunluğu (${titleLength} karakter) ideal 30-60 karakter aralığının dışında.`);
      recommendations.push("Sayfa başlığını arama sonuçlarında tam görünecek şekilde 30-60 karakter arasında optimize edin.");
    }
    if (description && (descLength < 80 || descLength > 165)) {
      warnings.push(`Meta açıklama uzunluğu (${descLength} karakter) ideal 120-160 aralığında değil.`);
      recommendations.push("Meta açıklamayı 120-160 karakter aralığında anahtar kelime odaklı olarak revize edin.");
    }
    if (missingDimensionsCount > 0) {
      warnings.push(`${missingDimensionsCount} görselde width/height özelliği eksik (CLS sayfa kayması riski).`);
      recommendations.push("Tüm görsellere width ve height nitelikleri ekleyerek Cumulative Layout Shift (CLS) puanını koruyun.");
    }
    if (renderBlockingScripts > 0) {
      warnings.push(`${renderBlockingScripts} adet render-blocking harici script ana iş parçacığını geciktiriyor.`);
      recommendations.push("Gereksiz kütüphanelere 'defer' veya 'async' ekleyerek açılış çizimini hızlandırın.");
    }
    if (unsafeTargetBlank > 0) {
      warnings.push(`${unsafeTargetBlank} adet dış bağlantıda rel="noopener noreferrer" güvenlik özelliği eksik.`);
      recommendations.push("Yeni sekmede açılan dış linklere rel='noopener noreferrer' ekleyin.");
    }
    if (totalDomElements > 1200) {
      warnings.push(`Sayfada ${totalDomElements} DOM elemanı var; mobil cihazlarda INP gecikmesine sebep olabilir.`);
      recommendations.push("Gereksiz kapsayıcı div katmanlarını budayarak DOM sayısını 800'ün altına çekin.");
    }

    // Kritikler (Critical)
    if (!title) {
      critical.push("Sayfada <title> başlık etiketi bulunamadı.");
      recommendations.push("Sayfanın ana amacını ve markayı içeren bir <title> etiketi tanımlayın.");
    }
    if (!description) {
      critical.push("Meta açıklama (meta description) etiketi tamamen eksik.");
      recommendations.push("Sayfaya tık oranını artıracak 140-160 karakterlik bir meta description ekleyin.");
    }
    if (isNoIndex) {
      critical.push("Sayfada 'noindex' direktifi var! Arama motorları bu sayfayı dizine eklemez.");
      recommendations.push("Meta robots veya X-Robots-Tag başlığındaki noindex direktifini kaldırın.");
    }
    if (!canonical) {
      critical.push("Canonical URL (orijinal sayfa adresi) etiketi eksik.");
      recommendations.push("Yinelenen içerik karmaşasını önlemek için self-referential canonical etiketi ekleyin.");
    }
    if (h1List.length === 0) {
      critical.push("Sayfada hiçbir <h1> başlığı tespit edilemedi.");
      recommendations.push("Sayfanın ana konusunu tanımlayan tek bir <h1> başlığı ekleyin.");
    } else if (h1List.length > 1) {
      critical.push(`Sayfada ${h1List.length} adet <h1> başlığı var. SEO standardı 1 adettir.`);
      recommendations.push("Yalnızca bir adet H1 bırakıp diğerlerini H2 veya H3 seviyesine dönüştürün.");
    }
    if (missingAltCount > 0) {
      critical.push(`${imgMatches.length} görselden ${missingAltCount} tanesinde alt (alternatif metin) etiketi eksik.`);
      recommendations.push("Erişilebilirlik ve görsel arama trafiği için tüm görsellere açıklayıcı alt metinleri ekleyin.");
    }
    if (lazyLoadedFirstImage) {
      critical.push("Sayfanın ilk ana görselinde loading='lazy' kullanılmış (LCP süresini 1-2 saniye geciktirir!).");
      recommendations.push("Sayfanın en üstündeki hero görselinden loading='lazy' kaldırıp fetchpriority='high' ekleyin.");
    }
    if (uniqueSchemaTypes.length === 0) {
      critical.push("Hiçbir Schema.org / JSON-LD yapılandırılmış verisi bulunamadı.");
      recommendations.push("ChatGPT ve Perplexity gibi yapay zeka arama motorları için Organization ve WebSite JSON-LD şeması ekleyin.");
    }
    if (ttfbMs > 500) {
      critical.push(`Sunucu ilk bayt süresi (TTFB) ${ttfbMs}ms. Google eşik değeri 200 milisaniyedir.`);
      recommendations.push("Sunucuda LiteSpeed Cache / Redis object cache yapılandırın veya Cloudflare Edge önbelleklemesi açın.");
    }

    // 10. DOĞRUDAN KOPYALANABİLİR ÇÖZÜM KODLARI (Sadece Gerçekten İhtiyaç Varsa Üretilir)
    const siteDomain = parsedUrl.hostname;
    const siteTitle = title || siteDomain;
    const copyableFixes: Array<{
      title: string;
      description: string;
      language: string;
      code: string;
    }> = [];

    // İhtiyaç 1: Schema.org JSON-LD Eksikliği
    if (uniqueSchemaTypes.length === 0) {
      copyableFixes.push({
        title: "Yapay Zeka (GEO) ve Arama Motoru İçin Schema.org JSON-LD Şeması",
        description: "Sitenizde hiçbir yapılandırılmış veri bulunamadı. ChatGPT, Perplexity ve Google'ın sitenizi entity olarak tanıması için bu kodu <head> içine yapıştırın.",
        language: "html",
        code: `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://${siteDomain}/#website",
      "url": "https://${siteDomain}/",
      "name": "${siteTitle.replace(/"/g, '\\"')}",
      "description": "${(description || siteTitle).replace(/"/g, '\\"')}",
      "publisher": { "@id": "https://${siteDomain}/#organization" }
    },
    {
      "@type": "Organization",
      "@id": "https://${siteDomain}/#organization",
      "name": "${siteDomain}",
      "url": "https://${siteDomain}/",
      "sameAs": [
        "https://www.linkedin.com/company/${siteDomain.split('.')[0]}",
        "https://twitter.com/${siteDomain.split('.')[0]}"
      ]
    }
  ]
}
</script>`,
      });
    }

    // İhtiyaç 2: Hero Görselinde Hatalı Lazy Loading (LCP Katili)
    if (lazyLoadedFirstImage) {
      copyableFixes.push({
        title: "LCP Hızlandırma: İlk Görseldeki (Hero) Lazy Loading Düzeltmesi",
        description: "Sayfanın en üstündeki ilk görselde loading='lazy' tespit edildi. Bu durum LCP skorunu 1-2 saniye geciktirir. Görseli aşağıdaki gibi güncelleyin:",
        language: "html",
        code: `<!-- ❌ HATALI: İlk görünüm (Hero) görseline asla loading="lazy" verilmemelidir! -->
<!-- ✅ DOĞRU: fetchpriority="high" ve decoding="async" ile tarayıcıya öncelik bildirin -->
<img
  src="/hero-banner.webp"
  alt="${siteTitle.replace(/"/g, '\\"')}"
  width="1200"
  height="630"
  fetchpriority="high"
  decoding="async"
/>`,
      });
    }

    // İhtiyaç 3: Google Fonts Preconnect Eksikliği
    if (hasGoogleFonts && !hasFontPreconnect) {
      copyableFixes.push({
        title: "Google Fonts Render Blokajını Önleyen Preconnect Direktifi",
        description: "Google Fonts kullanılıyor ancak font sunucularına preconnect yapılmamış. Fontların 200-400ms daha erken inmesi için <head> içine en üste ekleyin:",
        language: "html",
        code: `<!-- Google Fonts DNS & TCP El Sıkışmasını Hızlandırın -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>`,
      });
    }

    // İhtiyaç 4: OpenGraph / Sosyal Medya Önizleme Etiketleri Eksikliği
    if (!ogTitleMatch && !ogImageMatch) {
      copyableFixes.push({
        title: "OpenGraph & Sosyal Medya / AI Ajan Önizleme Meta Etiketleri",
        description: "Sitenizin sosyal medyada ve AI sohbet robotlarında doğru başlık ve görselle zengin önizleme oluşturması için <head> içine ekleyin:",
        language: "html",
        code: `<!-- OpenGraph & Twitter Kartı Meta Etiketleri -->
<meta property="og:type" content="website" />
<meta property="og:title" content="${siteTitle.replace(/"/g, '\\"')}" />
<meta property="og:description" content="${(description || siteTitle).replace(/"/g, '\\"')}" />
<meta property="og:url" content="https://${siteDomain}/" />
<meta property="og:image" content="https://${siteDomain}/og-image.jpg" />
<meta name="twitter:card" content="summary_large_image" />`,
      });
    }

    // İhtiyaç 5: Sunucu Sıkıştırma (Brotli/Gzip) veya Güvenlik Başlıkları Eksikliği
    const needsCompression = !contentEncoding.toLowerCase().includes("gzip") && !contentEncoding.toLowerCase().includes("br");
    const needsSecurity = !hsts || !xContentTypeOptions || !xFrameOptions;
    const lowerServer = serverHeader.toLowerCase();
    const isNginx = lowerServer.includes("nginx");
    const isApacheOrLiteSpeed = lowerServer.includes("apache") || lowerServer.includes("litespeed") || lowerServer.includes("openlitespeed");

    if (needsCompression || needsSecurity) {
      if (isNginx) {
        copyableFixes.push({
          title: "Nginx: Sıkıştırma, Statik Önbellek & Güvenlik Başlıkları",
          description: "Nginx sunucunuzda tespit edilen eksik güvenlik başlıkları ve sıkıştırma direktifleri için nginx.conf içine ekleyin:",
          language: "nginx",
          code: `# Gzip Sıkıştırma ve Güvenlik Direktifleri
gzip on;
gzip_comp_level 6;
gzip_min_length 256;
gzip_types text/plain text/css application/json application/javascript text/xml image/svg+xml;

# Güvenlik Başlıkları
add_header X-Content-Type-Options "nosniff" always;
add_header X-Frame-Options "SAMEORIGIN" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;

# Statik Dosya Önbellekleme
location ~* \\.(webp|avif|jpg|jpeg|png|css|js|woff2)$ {
  expires 365d;
  add_header Cache-Control "public, no-transform, immutable";
}`,
        });
      } else if (isApacheOrLiteSpeed || lowerServer === "bilinmiyor") {
        copyableFixes.push({
          title: ".htaccess: Güvenlik Başlıkları, Brotli/Gzip & Önbellek Kuralları",
          description: "Apache/LiteSpeed sunucularda eksik tespit edilen güvenlik başlıklarını ve statik önbellek sürelerini aktif etmek için .htaccess dosyanıza yapıştırın:",
          language: "apache",
          code: `# 1. Güvenlik Başlıkları (Security Headers)
<IfModule mod_headers.c>
  Header always set X-Content-Type-Options "nosniff"
  Header always set X-Frame-Options "SAMEORIGIN"
  Header always set Referrer-Policy "strict-origin-when-cross-origin"
  Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
</IfModule>

# 2. Statik Medya Önbellekleme (1 Yıl Cache-Control)
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType image/avif "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>`,
        });
      }
    }

    if (copyableFixes.length === 0) {
      passed.push("Temel şema ve sunucu başlıkları hazır durumda; acil kod müdahalesi gerektiren bir eksik tespit edilmedi.");
    }

    return NextResponse.json({
      url: finalUrl,
      domain: parsedUrl.hostname,
      statusCode,
      statusText,
      isHttps,
      ttfbMs,
      pageSizeKb,
      server: serverHeader,
      compression: contentEncoding,
      scores: {
        seo: seoScore,
        performance: perfScore,
        geo: geoGrade,
        overall: Math.round((seoScore + perfScore + geoPoints) / 3),
      },
      seo: {
        title,
        titleLength,
        description,
        descriptionLength: descLength,
        canonical,
        robots,
        isNoIndex,
        isNoFollow,
        hasViewport,
        viewportContent,
        h1Count: h1List.length,
        h1List,
        h2Count: h2Matches.length,
        h2List,
        h3Count,
        wordCount,
        hasFavicon,
        og: {
          title: ogTitleMatch ? ogTitleMatch[1] : null,
          description: ogDescMatch ? ogDescMatch[1] : null,
          image: ogImageMatch ? ogImageMatch[1] : null,
          twitterCard: twitterCardMatch ? twitterCardMatch[1] : null,
        },
      },
      media: {
        totalImages: imgMatches.length,
        missingAlt: missingAltCount,
        missingDimensions: missingDimensionsCount,
        modernFormatsCount,
        lazyLoadedFirstImage,
        missingAltSamples,
      },
      links: {
        total: linkMatches.length,
        internal: internalLinks,
        external: externalLinks,
        emptyLinks,
        unsafeTargetBlank,
      },
      assets: {
        totalExternalScripts,
        asyncDeferScripts,
        renderBlockingScripts,
        stylesheets: stylesheetMatches,
        domElements: totalDomElements,
        hasGoogleFonts,
        hasFontPreconnect,
      },
      geo: {
        grade: geoGrade,
        schemaCount: jsonLdMatches.length,
        schemaTypes: uniqueSchemaTypes,
        hasWikidataSameAs,
        sampleJsonLd,
      },
      security: {
        isHttps,
        hsts,
        hstsValue,
        xFrameOptions,
        xContentTypeOptions,
        referrerPolicy,
        csp: !!csp,
      },
      findings: {
        passed,
        warnings,
        critical,
      },
      recommendations,
      copyableFixes,
      scannedAt: new Date().toISOString(),
    });
  } catch (error: unknown) {
    console.error("Audit API Error:", error);
    const message = error instanceof Error ? error.message : "Bilinmeyen sunucu hatası";
    return NextResponse.json({ error: `Analiz sırasında hata oluştu: ${message}` }, { status: 500 });
  }
}
