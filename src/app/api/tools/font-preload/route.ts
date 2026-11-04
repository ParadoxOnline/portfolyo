import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

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
      return NextResponse.json({ error: "Geçerli bir web adresi girilmedi." }, { status: 400 });
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);

    let html = "";
    try {
      const res = await fetch(parsedUrl.href, {
        signal: controller.signal,
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        },
      });
      if (!res.ok) {
        return NextResponse.json({ error: `Web sitesine erişilemedi (HTTP ${res.status} ${res.statusText})` }, { status: 400 });
      }
      html = await res.text();
    } catch (fetchErr: unknown) {
      const msg = fetchErr instanceof Error ? fetchErr.message : "Zaman aşımı";
      return NextResponse.json({ error: `Siteye ulaşılamadı: ${msg}` }, { status: 504 });
    } finally {
      clearTimeout(timeout);
    }

    // Font Taraması
    const detectedFonts: Array<{
      type: "google_font" | "local_woff2" | "external_font" | "icon_font";
      source: string;
      hasSwap: boolean;
      hasPreload: boolean;
      hasPreconnect: boolean;
    }> = [];

    // 1. Google Fonts
    const gFontsMatches = Array.from(html.matchAll(/https:\/\/fonts\.googleapis\.com\/css2?\?[^"'\s>]+/gi));
    const uniqueGFonts = Array.from(new Set(gFontsMatches.map((m) => m[0].replace(/&amp;/g, "&"))));

    const hasGFontsPreconnect =
      html.includes('rel="preconnect" href="https://fonts.gstatic.com"') ||
      html.includes("rel='preconnect' href='https://fonts.gstatic.com'");

    uniqueGFonts.forEach((url) => {
      const hasSwap = url.includes("display=swap");
      detectedFonts.push({
        type: "google_font",
        source: url,
        hasSwap,
        hasPreload: false,
        hasPreconnect: hasGFontsPreconnect,
      });
    });

    // 2. Direct WOFF2 / WOFF / TTF dosyaları
    const fontFileMatches = Array.from(html.matchAll(/["']([^"']+\.(woff2|woff|ttf)(\?[^"']*)?)["']/gi));
    const uniqueFontFiles = Array.from(new Set(fontFileMatches.map((m) => m[1])));

    uniqueFontFiles.forEach((file) => {
      const isIcon = file.includes("awesome") || file.includes("icon") || file.includes("glyph");
      const hasPreload = html.includes(`href="${file}"`) && html.includes('rel="preload"');
      detectedFonts.push({
        type: isIcon ? "icon_font" : "local_woff2",
        source: file,
        hasSwap: true,
        hasPreload,
        hasPreconnect: false,
      });
    });

    // Teşhisler
    const findings: { passed: string[]; warnings: string[]; critical: string[] } = {
      passed: [],
      warnings: [],
      critical: [],
    };

    if (detectedFonts.length === 0) {
      findings.passed.push("Sayfada harici ağır web fontu bulunamadı; sistem varsayılan fontları (System UI) kullanılıyor (En yüksek performans!).");
    } else {
      findings.passed.push(`Sayfada ${detectedFonts.length} adet web font kaynağı tespit edildi.`);
    }

    if (uniqueGFonts.length > 0) {
      if (hasGFontsPreconnect) {
        findings.passed.push("Google Fonts CDN için 'preconnect' optimizasyonu yapılmış.");
      } else {
        findings.critical.push("Google Fonts için 'fonts.gstatic.com' preconnect direktifi EKSİK! Fontlar 200-400ms geç yükleniyor.");
      }

      const missingSwap = detectedFonts.filter((f) => f.type === "google_font" && !f.hasSwap);
      if (missingSwap.length > 0) {
        findings.critical.push("Google Fonts çağrısında 'display=swap' eksik. Font inene kadar metinler ekranda boş görünür (FOIT hatası).");
      } else {
        findings.passed.push("Tüm Google Fonts çağrılarında 'display=swap' parametresi aktif.");
      }
    }

    // Hazır Preload Reçetesi
    const preloadSnippets: string[] = [];
    if (uniqueGFonts.length > 0 && !hasGFontsPreconnect) {
      preloadSnippets.push(`<!-- Google Fonts Preconnect (İlk byte süresini ve render blokajını düşürür) -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>`);
    }

    const priorityFont = uniqueFontFiles.find((f) => f.endsWith(".woff2"));
    if (priorityFont) {
      const absoluteFont = priorityFont.startsWith("http") ? priorityFont : `${parsedUrl.protocol}//${parsedUrl.hostname}${priorityFont.startsWith("/") ? "" : "/"}${priorityFont}`;
      preloadSnippets.push(`<!-- Birincil Metin Fontu İçin Kritik Preload Direktifi -->
<link rel="preload" href="${absoluteFont}" as="font" type="font/woff2" crossorigin>`);
    }

    return NextResponse.json({
      domain: parsedUrl.hostname,
      totalFonts: detectedFonts.length,
      detectedFonts,
      findings,
      preloadSnippets: preloadSnippets.join("\n\n"),
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Font analizi sırasında bir hata oluştu.";
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}

