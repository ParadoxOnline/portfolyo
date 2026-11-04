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
        },
      });
      if (!res.ok) {
        return NextResponse.json({ error: `Web sitesine erişilemedi (HTTP ${res.status})` }, { status: 400 });
      }
      html = await res.text();
    } catch (fetchErr: unknown) {
      const msg = fetchErr instanceof Error ? fetchErr.message : "Zaman aşımı";
      return NextResponse.json({ error: `Siteye ulaşılamadı: ${msg}` }, { status: 504 });
    } finally {
      clearTimeout(timeout);
    }

    // Görselleri çıkaralım
    const imgMatches = Array.from(html.matchAll(/<img\s+([^>]*?)>/gi));
    const extractedImages: Array<{ src: string; format: string; isModern: boolean }> = [];

    imgMatches.forEach((m) => {
      const attrs = m[1];
      const srcMatch = attrs.match(/src=["'](.*?)["']/i);
      if (srcMatch) {
        let src = srcMatch[1].trim().replace(/&amp;/g, "&");
        if (src.startsWith("data:")) return;
        if (src.startsWith("//")) src = `${parsedUrl.protocol}${src}`;
        else if (src.startsWith("/")) src = `${parsedUrl.origin}${src}`;
        else if (!src.startsWith("http")) src = `${parsedUrl.origin}/${src}`;

        // Biçimi yalnızca gerçek bir dosya uzantısından çıkar; _next/image gibi
        // dinamik adreslerde asıl dosya adı "url=" parametresinin içindedir.
        let pathForExt = src.split("?")[0];
        try {
          const u = new URL(src);
          const inner = u.searchParams.get("url");
          pathForExt = inner ? decodeURIComponent(inner).split("?")[0] : u.pathname;
        } catch {
          /* geçersiz URL: olduğu gibi bırak */
        }
        const extMatch = pathForExt.match(/\.([a-z0-9]{3,4})$/i);
        const cleanExt = extMatch ? extMatch[1].toLowerCase() : "unknown";
        const isModern = cleanExt === "webp" || cleanExt === "avif" || cleanExt === "svg";

        extractedImages.push({
          src,
          format: cleanExt,
          isModern,
        });
      }
    });

    // İlk 8 görselin gerçek boyutunu HEAD/GET ile sorgulayalım
    const sampleImages = extractedImages.slice(0, 8);
    const measuredImages: Array<{
      url: string;
      format: string;
      sizeBytes: number;
      estimatedWebpBytes: number;
      estimatedAvifBytes: number;
    }> = [];

    let totalSampleBytes = 0;
    let totalEstimatedWebp = 0;
    let totalEstimatedAvif = 0;

    await Promise.all(
      sampleImages.map(async (img) => {
        try {
          const headRes = await fetch(img.src, { method: "HEAD", signal: AbortSignal.timeout(3500) });
          const type = headRes.headers.get("content-type") || "";
          const cl = headRes.headers.get("content-length");
          const size = cl ? parseInt(cl, 10) : 0;

          // Hata sayfalarını veya görsel olmayan yanıtları ölçüme katma.
          if (headRes.ok && type.startsWith("image/") && size > 0) {
            const realFormat = type.split("/")[1]?.split(";")[0].replace("svg+xml","svg") || img.format;
            const isAlreadyWebp = realFormat === "webp";
            const isAlreadyAvif = realFormat === "avif";
            const isSvg = realFormat === "svg";

            let webpEst = size;
            let avifEst = size;

            if (isSvg) {
              webpEst = size;
              avifEst = size;
            } else if (isAlreadyAvif) {
              webpEst = Math.round(size * 1.2);
              avifEst = size;
            } else if (isAlreadyWebp) {
              webpEst = size;
              avifEst = Math.round(size * 0.7);
            } else {
              // JPG veya PNG ise
              webpEst = Math.round(size * 0.55); // ~%45 tasarruf
              avifEst = Math.round(size * 0.35); // ~%65 tasarruf
            }

            measuredImages.push({
              url: img.src,
              format: realFormat,
              sizeBytes: size,
              estimatedWebpBytes: webpEst,
              estimatedAvifBytes: avifEst,
            });

            totalSampleBytes += size;
            totalEstimatedWebp += webpEst;
            totalEstimatedAvif += avifEst;
          }
        } catch {
          // Boyut alınamadıysa es geç
        }
      })
    );

    const legacyCount = extractedImages.filter((img) => !img.isModern).length;
    const modernCount = extractedImages.filter((img) => img.isModern).length;

    const potentialSavingsBytes = Math.max(0, totalSampleBytes - totalEstimatedAvif);
    const potentialSavingsPercent = totalSampleBytes > 0 ? Math.round((potentialSavingsBytes / totalSampleBytes) * 100) : 0;

    return NextResponse.json({
      domain: parsedUrl.hostname,
      totalImagesOnPage: extractedImages.length,
      legacyCount,
      modernCount,
      sampleMeasuredCount: measuredImages.length,
      totalMeasuredBytes: totalSampleBytes,
      totalEstimatedWebpBytes: totalEstimatedWebp,
      totalEstimatedAvifBytes: totalEstimatedAvif,
      potentialSavingsBytes,
      potentialSavingsPercent,
      measuredImages,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Görsel analizi sırasında beklenmeyen bir hata oluştu.";
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}

