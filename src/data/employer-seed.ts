export type CompanyCategory =
  | "Web Ajansı"
  | "Yazılım Şirketi"
  | "E-Ticaret Ajansı"
  | "SEO Ajansı";

export type WorkModel =
  | "İzmir (Yerinde / Hibrit)"
  | "İzmir + Uzaktan"
  | "Uzaktan (Remote)";

export type CompanySize =
  | "Butik (2-10)"
  | "Büyüyen (10-30)"
  | "Orta Ölçekli (30-100)"
  | "Kurumsal (100+)";

export type PriorityLevel = "Yüksek (P1)" | "Orta (P2)" | "Düşük (P3)";

export type ApplicationStatus =
  | "Keşfedildi"
  | "Onaylandı"
  | "Başvuruldu"
  | "Görüşme / Mülakat"
  | "Teklif / Partnerlik"
  | "Takip Edilecek"
  | "Arşiv";

export interface AIEvaluation {
  portfolioFitScore: number; // 0 - 100
  fitSummary: string;
  fitReasons: string[];
  matchedPortfolioAssets: string[];
  estimatedStaffingNeed: string;
  staffingSignals: string[];
  recommendedApproach: "Tam / Yarı Zamanlı Geliştirici" | "White-Label Çözüm Ortağı" | "Hibrit (Kadro + Dış Kaynak)";
  priority: PriorityLevel;
  technicalFindings: string[];
  customPitchJob: string;
  customPitchAgencyPartner: string;
}

export interface EmployerCompany {
  id: string;
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
  linkedinUrl: string;
  approved: boolean;
  applicationStatus: ApplicationStatus;
  followUpDate: string; // YYYY-MM-DD
  lastAnalyzedAt: string;
  ttfbMs?: number;
  hasSchemaOrg?: boolean;
  notes: string;
  aiEvaluation: AIEvaluation;
}

// Strictly no fake data. The initial database starts completely clean and empty.
export const INITIAL_EMPLOYER_COMPANIES: EmployerCompany[] = [];

export function evaluateCompanyForPortfolio(params: {
  name: string;
  domain: string;
  category: CompanyCategory;
  city: string;
  district: string;
  workModel: WorkModel;
  companySize: CompanySize;
  technologies: string[];
  services: string[];
  hasCareerPage: boolean;
  hasOpenPositionSignal?: boolean;
  ttfbMs?: number;
  hasSchemaOrg?: boolean;
  missingPerfSignals?: string[];
}): AIEvaluation {
  let score = 50;
  const fitReasons: string[] = [];
  const matchedPortfolioAssets: string[] = [];
  const staffingSignals: string[] = [];
  const technicalFindings: string[] = params.missingPerfSignals ? [...params.missingPerfSignals] : [];

  const techLower = params.technologies.map((t) => t.toLowerCase());
  const servLower = params.services.map((s) => s.toLowerCase());

  // 1. Konum & Çalışma Modeli Uyumu (İzmir & Remote odak)
  if (params.city.toLowerCase().includes("izmir")) {
    score += 15;
    fitReasons.push(
      `İzmir (${params.district || "Merkez"}) lokasyonu sayesinde doğrudan yüz yüze tanışma, hibrit çalışma veya yerel ajans partnerliği avantajı.`
    );
  } else if (params.workModel.includes("Uzaktan")) {
    score += 10;
    fitReasons.push("Uzaktan çalışma kültürüne uygun mühendislik ve asenkron teslimat uyumu.");
  }

  // 2. Teknoloji Yığını Eşleşmesi
  const hasNextOrReact = techLower.some((t) => t.includes("next") || t.includes("react") || t.includes("typescript"));
  const hasWP = techLower.some((t) => t.includes("wordpress") || t.includes("elementor") || t.includes("woocommerce"));
  const hasEcom = techLower.some(
    (t) => t.includes("shopify") || t.includes("ikas") || t.includes("ticimax") || t.includes("woo")
  );
  const hasPhpNode = techLower.some((t) => t.includes("php") || t.includes("laravel") || t.includes("node"));

  if (hasNextOrReact) {
    score += 16;
    fitReasons.push("Modern React / Next.js / TypeScript yığını portfolyodaki amiral gemisi projelerle birebir örtüşüyor.");
    matchedPortfolioAssets.push("LIOS (Next.js / Full-Stack Mimari)", "GEN Platformu", "Canlı Mühendislik Laboratuvarı");
  }

  if (hasWP) {
    score += 15;
    fitReasons.push(
      "WordPress / Elementor & WooCommerce altyapısı kullanıyorlar; özel eklenti, hız (CWV/INP) ve yüksek dönüşümlü tema teslimatında doğrudan ihtiyaç var."
    );
    matchedPortfolioAssets.push("Elementor & WordPress INP/LCP Hız Optimizasyonu", "Özel WP Eklenti Mimarisi");
  }

  if (hasEcom || params.category === "E-Ticaret Ajansı") {
    score += 10;
    fitReasons.push("E-ticaret dönüşüm hızı, ödeme/sepet akışı ve teknik SEO/Schema kurgusu doğrudan değer üretecek alanlar.");
    if (!matchedPortfolioAssets.includes("Canlı JSON-LD & Schema.org Yapılandırıcı")) {
      matchedPortfolioAssets.push("Canlı JSON-LD & Schema.org Yapılandırıcı", "Görsel Sıkıştırma & AVIF/WebP Motoru");
    }
  }

  if (hasPhpNode) {
    score += 6;
    matchedPortfolioAssets.push("Maça Gel (Full-Stack & Gerçek Zamanlı Veri Akışı)");
  }

  // 3. Kategori & Hizmet Sinerjisi
  if (params.category === "SEO Ajansı" || servLower.some((s) => s.includes("seo"))) {
    score += 12;
    fitReasons.push(
      "SEO ajansları teknik uygulama (Core Web Vitals, Schema.org, AI Bot/GEO optimizasyonu ve kod müdahalesi) için güçlü geliştiricilere sürekli ihtiyaç duyar."
    );
    matchedPortfolioAssets.push(
      "AI Bot (GEO) & Robots.txt Radarı",
      "Canlı Core Web Vitals & Teknik SEO Denetim Motoru"
    );
  }

  if (params.category === "Web Ajansı") {
    score += 10;
    fitReasons.push(
      "Web ajanslarında yoğun proje dönemlerinde hem kadrolu Kıdemli Frontend/Full-Stack hem de White-Label proje teslimat ihtiyacı yüksektir."
    );
  }

  // 4. Personel & Kapasite İhtiyacı Sinyalleri
  if (params.hasCareerPage) {
    score += 6;
    staffingSignals.push("Web sitesinde aktif İK / Kariyer sayfası mevcut.");
  }
  if (params.hasOpenPositionSignal) {
    score += 8;
    staffingSignals.push("Kariyer sayfasında aktif pozisyon / ekip genişleme sinyali tespit edildi.");
  }

  if (params.companySize === "Büyüyen (10-30)" || params.companySize === "Butik (2-10)") {
    staffingSignals.push(
      "Çevik ajans/şirket ölçeği: Karar vericiye (Kurucu / Ajans Başkanı / CTO) doğrudan ulaşma ve hızlı işe alım/işbirliği olasılığı yüksek."
    );
  } else {
    staffingSignals.push(
      "Yapılandırılmış mühendislik/ürün ekibi: Düzenli sprint ve uzman Frontend/Full-Stack geliştirici kadro ihtiyacı."
    );
  }

  // 5. Canlı Teknik Bulgular
  if (typeof params.ttfbMs === "number") {
    if (params.ttfbMs > 600) {
      technicalFindings.push(`Canlı TTFB yanıt süresi yüksek (${params.ttfbMs}ms > 600ms hedef). Sunucu/önbellek optimizasyonu fırsatı.`);
      staffingSignals.push("Kendi sitelerinde/müşteri projelerinde performans & hız optimizasyonu uzmanlığına ihtiyaç sinyali.");
    } else {
      technicalFindings.push(`Canlı TTFB yanıt süresi sağlıklı (${params.ttfbMs}ms).`);
    }
  }

  if (params.hasSchemaOrg === false) {
    technicalFindings.push("Ana sayfada zengin JSON-LD / Schema.org yapılandırılmış veri grafiği eksik (GEO & AI arama kaybı).");
  } else if (params.hasSchemaOrg === true) {
    technicalFindings.push("JSON-LD / Schema.org yapılandırılmış verisi aktif.");
  }

  score = Math.min(98, Math.max(45, score));

  const priority: PriorityLevel =
    score >= 80 ? "Yüksek (P1)" : score >= 65 ? "Orta (P2)" : "Düşük (P3)";

  let recommendedApproach: AIEvaluation["recommendedApproach"] = "Hibrit (Kadro + Dış Kaynak)";
  if (params.category === "Yazılım Şirketi") {
    recommendedApproach = "Tam / Yarı Zamanlı Geliştirici";
  } else if (params.companySize === "Butik (2-10)") {
    recommendedApproach = "White-Label Çözüm Ortağı";
  }

  let estimatedStaffingNeed = "Orta Düzey — Proje Bazlı veya Kadrolu Geliştirici İhtiyacı";
  if (score >= 80) {
    estimatedStaffingNeed =
      params.category === "Yazılım Şirketi"
        ? "Yüksek — React / Next.js & Full-Stack Ürün Geliştirici İhtiyacı"
        : "Yüksek — Müşteri Projelerini Teslim Edecek Kıdemli Web / Performans & SEO Geliştirici İhtiyacı";
  }

  if (matchedPortfolioAssets.length === 0) {
    matchedPortfolioAssets.push("LIOS", "GEN", "Teknik SEO & CWV Denetim Araçları");
  }

  const techListText = params.technologies.slice(0, 4).join(", ") || "modern web teknolojileri";
  const fitSummary = `${params.name}, ${params.city} (${params.district || "Merkez"}) odaklı bir ${params.category.toLowerCase()} olarak ${techListText} yığınında faaliyet gösteriyor. Portföyünüzdeki ${matchedPortfolioAssets.slice(0, 2).join(" ve ")} çalışmalarıyla %${score} oranında teknik uyum sağlıyor.`;

  const customPitchJob = `Merhaba ${params.name} Ekibi,

${params.city} merkezli ${params.category.toLowerCase()} çalışmalarınızı ve ${techListText} odaklı projelerinizi inceledim. Next.js/React, WordPress/Elementor mimarisi, Core Web Vitals hız optimizasyonu ve Teknik SEO/GEO alanlarında uçtan uca üretim yapan bir Full-Stack geliştiriciyim.

Portfolyomda geliştirdiğim canlı mühendislik araçlarını (AI Bot Radarı, Canlı CWV Denetimi, Schema.org Yapılandırıcı ve Font Preload Stratejisti) ve ürün vaka analizlerimi sabritutuncu.com üzerinden inceleyebilirsiniz. Ekibinizdeki mevcut veya gelecek geliştirici pozisyonları için tanışmak ve teknik katkı sağlayabileceğim alanları görüşmek isterim.

İyi çalışmalar dilerim,
Sabri Can Tütüncü
https://sabritutuncu.com`;

  const customPitchAgencyPartner = `Merhaba ${params.name} Ekibi,

Yoğun müşteri teslimat dönemlerinizde veya yüksek teknik uzmanlık gerektiren (${techListText}, Core Web Vitals 90+ hız garantisi, özel WordPress/Next.js geliştirme ve GEO/Schema mimarisi) projelerinizde ajansınıza White-Label / dış kaynak yazılım partneri olarak destek olabilirim.

Süreçlerimi şeffaf, zamanında teslimat ve sıfır teknik borç prensibiyle yürütüyorum. Geliştirdiğim canlı teknik analiz araçlarını ve referans projelerimi https://sabritutuncu.com adresinde görebilirsiniz. Uygun olduğunuzda 10 dakikalık kısa bir tanışma görüşmesi yapmayı çok isterim.

Selamlar,
Sabri Can Tütüncü`;

  return {
    portfolioFitScore: score,
    fitSummary,
    fitReasons,
    matchedPortfolioAssets: Array.from(new Set(matchedPortfolioAssets)),
    estimatedStaffingNeed,
    staffingSignals,
    recommendedApproach,
    priority,
    technicalFindings,
    customPitchJob,
    customPitchAgencyPartner,
  };
}
