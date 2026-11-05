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
    score += 14;
    fitReasons.push(
      `İzmir (${params.district || "Merkez"}) lokasyonu sayesinde yüz yüze tanışma, hibrit çalışma veya yerel ajans partnerliği avantajı.`
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
      "Yapılandırılmış mühendislik/ürün ekibi: Düzenli спринт (sprint) ve uzman Frontend/Full-Stack geliştirici kadro ihtiyacı."
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
    score >= 82 ? "Yüksek (P1)" : score >= 68 ? "Orta (P2)" : "Düşük (P3)";

  let recommendedApproach: AIEvaluation["recommendedApproach"] = "Hibrit (Kadro + Dış Kaynak)";
  if (params.category === "Yazılım Şirketi") {
    recommendedApproach = "Tam / Yarı Zamanlı Geliştirici";
  } else if (params.companySize === "Butik (2-10)") {
    recommendedApproach = "White-Label Çözüm Ortağı";
  }

  let estimatedStaffingNeed = "Orta Düzey — Proje Bazlı veya Kadrolu Geliştirici İhtiyacı";
  if (score >= 82) {
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

const rawSeedCompanies: Array<{
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
  followUpDate: string;
  ttfbMs: number;
  hasSchemaOrg: boolean;
  notes: string;
}> = [
  {
    id: "emp-izmir-01",
    name: "Ege Dijital & Web Ajansı",
    domain: "egedijital.com",
    website: "https://www.egedijital.com",
    careerUrl: "https://www.egedijital.com/iletisim",
    category: "Web Ajansı",
    city: "İzmir",
    district: "Bayraklı",
    workModel: "İzmir (Yerinde / Hibrit)",
    companySize: "Büyüyen (10-30)",
    technologies: ["WordPress", "Elementor", "PHP", "WooCommerce", "Google Tag Manager"],
    services: ["Kurumsal Web Tasarım", "E-Ticaret", "SEO", "Kurumsal Kimlik"],
    contactEmail: "info@egedijital.com",
    contactPhone: "+90 232 400 00 00",
    linkedinUrl: "https://www.linkedin.com/search/results/companies/?keywords=Ege%20Dijital%20Izmir",
    approved: true,
    applicationStatus: "Onaylandı",
    followUpDate: "2026-11-10",
    ttfbMs: 680,
    hasSchemaOrg: false,
    notes: "İzmir Bayraklı merkezli kurumsal web ve WordPress/WooCommerce projeleri üreten ajans. Hem geliştirici hem white-label partnerlik için yüksek uyum.",
  },
  {
    id: "emp-izmir-02",
    name: "İzmir Web Tasarım & Yazılım (MODD / Kreatif Ekip)",
    domain: "moddgroup.com",
    website: "https://www.moddgroup.com",
    careerUrl: "https://www.moddgroup.com/iletisim",
    category: "Web Ajansı",
    city: "İzmir",
    district: "Alsancak / Konak",
    workModel: "İzmir (Yerinde / Hibrit)",
    companySize: "Büyüyen (10-30)",
    technologies: ["WordPress", "React", "Next.js", "Tailwind CSS", "GSAP"],
    services: ["Kreatif Web Tasarım", "Dijital Pazarlama", "UI/UX", "Özel Web Yazılım"],
    contactEmail: "info@moddgroup.com",
    contactPhone: "+90 232 422 00 00",
    linkedinUrl: "https://www.linkedin.com/company/modd-group/",
    approved: true,
    applicationStatus: "Onaylandı",
    followUpDate: "2026-11-12",
    ttfbMs: 520,
    hasSchemaOrg: true,
    notes: "İzmir merkezli tam hizmet reklam ve dijital web ajansı. Yüksek profilli kurumsal sitelerde modern frontend ve hız optimizasyonu ihtiyacı yüksek.",
  },
  {
    id: "emp-izmir-03",
    name: "Teknopark İzmir Yazılım & SaaS Ekibi (Atolye15)",
    domain: "atolye15.com",
    website: "https://www.atolye15.com",
    careerUrl: "https://www.atolye15.com/careers",
    category: "Yazılım Şirketi",
    city: "İzmir",
    district: "Konak / Alsancak",
    workModel: "İzmir + Uzaktan",
    companySize: "Orta Ölçekli (30-100)",
    technologies: ["React", "Next.js", "TypeScript", "Node.js", "Tailwind CSS"],
    services: ["Özel Yazılım Geliştirme", "SaaS Ürün Mühendisliği", "UI/UX Tasarım", "Web Uygulamaları"],
    contactEmail: "hello@atolye15.com",
    contactPhone: "+90 232 464 00 00",
    linkedinUrl: "https://www.linkedin.com/company/atolye15/",
    approved: true,
    applicationStatus: "Onaylandı",
    followUpDate: "2026-11-08",
    ttfbMs: 240,
    hasSchemaOrg: true,
    notes: "İzmir'in en güçlü modern yazılım ve ürün stüdyolarından biri. React, TypeScript ve Next.js odaklı mühendislik kültürü.",
  },
  {
    id: "emp-izmir-04",
    name: "İzmir SEO & Performans Ajansı (Seorative)",
    domain: "seorative.com",
    website: "https://www.seorative.com",
    careerUrl: "https://www.seorative.com/kariyer/",
    category: "SEO Ajansı",
    city: "İzmir",
    district: "Bayraklı / Folkart",
    workModel: "İzmir (Yerinde / Hibrit)",
    companySize: "Büyüyen (10-30)",
    technologies: ["WordPress", "Schema.org / JSON-LD", "WooCommerce", "Shopify", "Next.js"],
    services: ["Teknik SEO", "E-Ticaret SEO", "İçerik Stratejisi", "Dönüşüm Optimizasyonu (CRO)"],
    contactEmail: "info@seorative.com",
    contactPhone: "+90 232 332 00 00",
    linkedinUrl: "https://www.linkedin.com/company/seorative/",
    approved: true,
    applicationStatus: "Keşfedildi",
    followUpDate: "2026-11-11",
    ttfbMs: 610,
    hasSchemaOrg: true,
    notes: "İzmir merkezli SEO ve dijital büyüme ajansı. Müşteri sitelerinde Core Web Vitals, JSON-LD Schema ve GEO iyileştirmeleri için doğrudan teknik partner/geliştirici adayı.",
  },
  {
    id: "emp-izmir-05",
    name: "T-Soft / İkas Partner E-Ticaret Ajansı (무 / İzmir E-Ticaret)",
    domain: "izmireticaretajansi.com",
    website: "https://www.ideasoft.com.tr",
    careerUrl: "https://www.ideasoft.com.tr/insan-kaynaklari/",
    category: "E-Ticaret Ajansı",
    city: "İzmir",
    district: "Gaziemir / Bayraklı",
    workModel: "İzmir + Uzaktan",
    companySize: "Orta Ölçekli (30-100)",
    technologies: ["WooCommerce", "Shopify", "İkas", "PHP", "JavaScript", "CSS / Font Preload"],
    services: ["E-Ticaret Altyapı Kurulumu", "Özel Tema & Modül", "Teknik SEO", "Hız Optimizasyonu"],
    contactEmail: "ik@ideasoft.com.tr",
    contactPhone: "+90 232 250 00 00",
    linkedinUrl: "https://www.linkedin.com/company/ideasoft/",
    approved: false,
    applicationStatus: "Keşfedildi",
    followUpDate: "2026-11-14",
    ttfbMs: 490,
    hasSchemaOrg: true,
    notes: "İzmir bölge ofisi ve e-ticaret partner ekosistemi. E-ticaret hız, görsel optimizasyon (AVIF/WebP) ve özel entegrasyon ihtiyacı.",
  },
  {
    id: "emp-izmir-06",
    name: "Yucca Dijital / İzmir Web & E-Ticaret Stüdyosu",
    domain: "yuccadijital.com",
    website: "https://www.yuccadijital.com",
    careerUrl: "https://www.yuccadijital.com/iletisim",
    category: "Web Ajansı",
    city: "İzmir",
    district: "Bornova",
    workModel: "İzmir (Yerinde / Hibrit)",
    companySize: "Butik (2-10)",
    technologies: ["WordPress", "Elementor", "WooCommerce", "PHP"],
    services: ["Web Tasarım", "E-Ticaret", "Kurumsal Web", "Lokal SEO"],
    contactEmail: "info@yuccadijital.com",
    contactPhone: "+90 232 388 00 00",
    linkedinUrl: "https://www.linkedin.com/search/results/companies/?keywords=Yucca%20Dijital",
    approved: false,
    applicationStatus: "Keşfedildi",
    followUpDate: "2026-11-15",
    ttfbMs: 790,
    hasSchemaOrg: false,
    notes: "Butik ajans yapısı; dış kaynak (white-label) WordPress/Elementor hızlandırma ve özel müşteri projeleri için hızlı karar alabilen yapı.",
  },
  {
    id: "emp-remote-07",
    name: "Zeoo / Uzaktan Teknik SEO & Performans Ajansı",
    domain: "zeo.org",
    website: "https://zeo.org/tr",
    careerUrl: "https://zeo.org/tr/kariyer",
    category: "SEO Ajansı",
    city: "Uzaktan (Türkiye / Global)",
    district: "Remote",
    workModel: "Uzaktan (Remote)",
    companySize: "Orta Ölçekli (30-100)",
    technologies: ["Next.js", "React", "Schema.org / JSON-LD", "Core Web Vitals", "WordPress"],
    services: ["Teknik SEO", "GEO & Yapay Zeka Arama", "Performans Denetimi", "İçerik & Veri Analitiği"],
    contactEmail: "career@zeo.org",
    contactPhone: "+90 216 000 00 00",
    linkedinUrl: "https://www.linkedin.com/company/zeo-agency/",
    approved: true,
    applicationStatus: "Onaylandı",
    followUpDate: "2026-11-09",
    ttfbMs: 310,
    hasSchemaOrg: true,
    notes: "Türkiye'nin önde gelen teknik SEO ajanslarından. Portfolyodaki GEO / AI Bot Radarı ve Canlı CWV Denetim araçları doğrudan üst düzey kanıt niteliğinde.",
  },
  {
    id: "emp-izmir-08",
    name: "Kartaca (Teknopark İzmir / Kurumsal Yazılım)",
    domain: "kartaca.com",
    website: "https://kartaca.com",
    careerUrl: "https://kartaca.com/tr/kariyer/",
    category: "Yazılım Şirketi",
    city: "İzmir",
    district: "Urla (Teknopark İzmir)",
    workModel: "İzmir + Uzaktan",
    companySize: "Orta Ölçekli (30-100)",
    technologies: ["React", "TypeScript", "Node.js", "Cloud / DevOps", "Web Uygulamaları"],
    services: ["Özel Yazılım", "Bulut Mimarisi", "E-Ticaret & Kurumsal Platformlar"],
    contactEmail: "ik@kartaca.com",
    contactPhone: "+90 232 000 00 00",
    linkedinUrl: "https://www.linkedin.com/company/kartaca/",
    approved: false,
    applicationStatus: "Keşfedildi",
    followUpDate: "2026-11-16",
    ttfbMs: 290,
    hasSchemaOrg: true,
    notes: "İzmir Ar-Ge ve yazılım merkezi bulunan köklü teknoloji şirketi. Düzenli yazılım mühendisi ve frontend geliştirici alımı yapıyor.",
  },
];

export const INITIAL_EMPLOYER_COMPANIES: EmployerCompany[] = rawSeedCompanies.map((item) => {
  const aiEvaluation = evaluateCompanyForPortfolio({
    name: item.name,
    domain: item.domain,
    category: item.category,
    city: item.city,
    district: item.district,
    workModel: item.workModel,
    companySize: item.companySize,
    technologies: item.technologies,
    services: item.services,
    hasCareerPage: Boolean(item.careerUrl),
    hasOpenPositionSignal: item.careerUrl.includes("kariyer") || item.careerUrl.includes("careers"),
    ttfbMs: item.ttfbMs,
    hasSchemaOrg: item.hasSchemaOrg,
  });

  return {
    ...item,
    lastAnalyzedAt: "2026-11-05T18:00:00.000Z",
    aiEvaluation,
  };
});
