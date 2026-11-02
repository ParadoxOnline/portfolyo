export type ProjectStatus = "flagship" | "supporting" | "optional" | "client";

export interface Evidence {
  type: "product" | "analytics" | "architecture" | "workflow" | "seo" | "mobile";
  title: string;
  description?: string;
  image?: string;
  alt?: string;
  verified: boolean;
}

export interface LocalizedText {
  en: string;
  tr?: string;
  az?: string;
}

export interface LocalizedListItem {
  en: string;
  tr?: string;
  az?: string;
}

export interface ArchNode {
  id: string;
  label: string;
  type: "frontend" | "backend" | "database" | "infra" | "ai" | "external";
}

export interface ArchEdge {
  from: string;
  to: string;
  label?: string;
}

export interface ProblemFlowStep {
  label: string;
  description?: string;
  type: "problem" | "system" | "engine" | "output";
}

export interface EvolutionEntry {
  label: string;
  type: "feat" | "fix" | "chore" | "deploy";
}

export interface Project {
  slug: string;
  name: string;
  missionNumber: string;
  category: string;
  status: ProjectStatus;
  year: string;
  role: string;
  primarySignal: string;
  secondarySignals: string[];
  badges: string[];
  recruiterPriority?: number;

  shortDescription: LocalizedText;
  heroStatement: LocalizedText;

  problem: LocalizedText;
  solution: LocalizedText;
  whyItMatters: LocalizedText;

  responsibilities: LocalizedListItem[];
  engineeringDecisions: LocalizedListItem[];
  challenges?: LocalizedListItem[];
  solutionsToChall?: LocalizedListItem[];

  technologies: {
    frontend?: string[];
    backend?: string[];
    database?: string[];
    infrastructure?: string[];
    seo?: string[];
    testing?: string[];
    mobile?: string[];
    ai?: string[];
  };

  engineeringSignals: string[];
  seoSignals?: string[];

  problemFlow?: ProblemFlowStep[];
  architectureNodes?: ArchNode[];
  architectureEdges?: ArchEdge[];

  evolution?: EvolutionEntry[];
  evidence?: Evidence[];

  metrics: string[];
  verificationRequired?: boolean;
  portfolioScore: number; // INTERNAL ONLY
  featured: boolean;
  agencyAttribution?: string;
  links?: { label: string; url: string }[];
  demoMedia?: string;
  demoUrl?: string;
}

export const projects: Project[] = [
  // ─── FLAGSHIP ────────────────────────────────────────────────────────────────
  {
    slug: "lios",
    name: "LIOS",
    missionNumber: "001",
    category: "SEO Engineering Platform",
    status: "flagship",
    year: "2026",
    role: "Creator · Full-Stack Development",
    primarySignal: "SEO Engineering",
    secondarySignals: ["Platform Architecture", "AI Automation"],
    badges: ["PRODUCTION SYSTEM", "LIVE"],
    recruiterPriority: 1,
    featured: true,
    portfolioScore: 93,

    shortDescription: {
      en: "A local business intelligence and SEO automation engine — 25 distinct services, one Clean Architecture.",
      tr: "25 farklı servis, tek bir Clean Architecture yapısı içinde; yerel işletme zekası ve SEO otomasyon motoru.",
      az: "25 fərqli servis, vahid Clean Architecture strukturu daxilində; yerli biznes intellekti və SEO avtomatlaşdırma mühərriki.",
    },
    heroStatement: {
      en: "Building a search infrastructure for an entire local industry — from data discovery to autonomous publishing.",
      tr: "Veri keşfinden özerk yayına kadar — tüm bir yerel sektör için arama altyapısı inşa etmek.",
    },
    problem: {
      en: "Local businesses have no scalable path to organic search visibility. Traditional SEO is manual, one client at a time — there is no system that discovers, enriches, and ranks local business data automatically.",
      tr: "Yerel işletmelerin organik arama görünürlüğüne erişmek için ölçeklenebilir bir yolu yoktu. Geleneksel SEO tamamen manüeldi — veriyi otomatik olarak keşfeden, zenginleştiren ve sıralayan bir sistem bulunmuyordu.",
      az: "Yerli bizneslərin üzvi axtarış görünürlüyü əldə etməsi üçün miqyaslana bilən yolu yox idi. Ənənəvi SEO tamamilə əl ilə aparılırdı — məlumatları avtomatik kəşf edən, zənginləşdirən və sıralayan vahid sistem mövcud deyildi.",
    },
    solution: {
      en: "LIOS builds a data-driven business graph — businesses, locations, categories, services, reviews — then runs a multi-signal SEO engine against it (keyword analysis, cannibalization detection, internal link optimization, authority scoring) and generates programmatic content pages with autonomous publish and Google indexing pipelines.",
      tr: "LIOS, işletmeleri, konumları, kategorileri, hizmetleri ve incelemeleri kapsayan veri odaklı bir iş grafiği oluşturur; ardından çok sinyalli bir SEO motoru çalıştırır ve programatik içerik sayfalarını özerk biçimde yayımlayarak Google'a gönderir.",
      az: "LIOS müəssisələri, məkanları, kateqoriyaları və rəyləri əhatə edən məlumat qrafiki qurur; sonra çoxsiqnallı SEO mühərrikini işə salır və proqramatik səhifələri avtonom dərc edərək Google İndekslənməsinə göndərir.",
    },
    whyItMatters: {
      en: "This project demonstrates the ability to reason about SEO as a software architecture problem rather than only a content operation. It requires deep integration with Google APIs, Clean Architecture, and background automation.",
      tr: "Bu proje, SEO'yu sadece bir içerik operasyonu olarak değil, bir yazılım mimarisi problemi olarak ele alma yeteneğini gösterir. Google API'leri ile derin entegrasyon, Clean Architecture ve arka plan otomasyonu gerektirir.",
      az: "Bu layihə, SEO-nu sadəcə məzmun əməliyyatı kimi deyil, proqram təminatı memarlığı problemi kimi həll etmə bacarığını nümayiş etdirir. Google API-ləri, Clean Architecture və arxa plan avtomatlaşdırması ilə dərin inteqrasiya tələb edir.",
    },

    responsibilities: [
      { en: "Designed and implemented 4-layer Clean Architecture: LIOS.Domain, LIOS.Application, LIOS.Infrastructure, LIOS.API" },
      { en: "Defined 50+ domain entities including Business, BlogPost, SeoKeyword, CannibalizationLog, PageNode" },
      { en: "Implemented 25+ application services including SEO Decision Engine, Priority Scoring, Cannibalization Detector" },
      { en: "Integrated Google Search Console API and Google Indexing API for autonomous publishing" },
      { en: "Built deployment scripts for VDS, PM2, and database management" },
    ],
    engineeringDecisions: [
      { en: "Clean Architecture with explicit layer separation — Domain has zero external dependencies" },
      { en: "CQRS + MediatR with ValidationBehavior pipeline on all commands and queries" },
      { en: "AI budget management system controlling AI spend per day" },
      { en: "Multi-tenant architecture from day one" },
    ],

    technologies: {
      backend: [".NET 8", "ASP.NET Core", "MediatR (CQRS)", "FluentValidation"],
      database: ["PostgreSQL", "Entity Framework Core"],
      frontend: ["Next.js", "TypeScript"],
      infrastructure: ["GitHub Actions", "VDS", "PM2"],
      seo: ["Google Search Console API", "Google Indexing API"],
      ai: ["OpenRouter API"],
    },

    engineeringSignals: [
      "Clean Architecture",
      "CQRS",
      "Domain Modeling",
      "Unit Tests",
      "CI/CD",
      "Multi-tenant",
    ],
    seoSignals: [
      "Programmatic content generation",
      "Cannibalization detection",
      "Internal link optimization",
      "Authority calculation",
    ],
    
    problemFlow: [
      { label: "Fragmented Data", type: "problem" },
      { label: "Business Graph", type: "system" },
      { label: "SEO Engine", type: "engine" },
      { label: "Indexable Pages", type: "output" },
    ],

    architectureNodes: [
      { id: "web", label: "Next.js", type: "frontend" },
      { id: "api", label: ".NET 8 API", type: "backend" },
      { id: "db", label: "PostgreSQL", type: "database" },
      { id: "gsc", label: "Google API", type: "external" },
    ],
    architectureEdges: [
      { from: "web", to: "api" },
      { from: "api", to: "db" },
      { from: "api", to: "gsc" },
    ],

    metrics: [
      "Live on production VDS",
      "Google Search Console integrated",
    ],
    verificationRequired: true,
  },

  {
    slug: "otorite",
    name: "AuthGraph",
    missionNumber: "002",
    category: "Platform Architecture",
    status: "supporting",
    year: "2026",
    role: "Architect · Full-Stack Development",
    primarySignal: "Platform Architecture",
    secondarySignals: ["Monorepo", "Background Workers"],
    badges: ["TURBOREPO", "BULLMQ"],
    recruiterPriority: 2,
    featured: false,
    portfolioScore: 89,

    shortDescription: {
      en: "A knowledge engine for local business data validation and authority building, built as a Turborepo monorepo.",
      tr: "Yerel işletme verilerini doğrulayan ve otorite inşa eden bilgi motoru, Turborepo monorepo olarak inşa edildi.",
    },
    heroStatement: {
      en: "A knowledge engine for local business data — structured, validated, and published at scale.",
      tr: "Yerel işletme verileri için bir bilgi motoru — yapılandırılmış, doğrulanmış ve ölçekte yayımlanmış.",
    },
    problem: {
      en: "Local business data on the internet is fragmented, inconsistent, and often wrong. No system exists to validate business claims with evidence and detect citations across the web.",
      tr: "İnternetteki yerel işletme verileri parçalı, tutarsız ve çoğu zaman yanlış. İşletme iddialarını kanıtlarla doğrulayan sistem yok.",
    },
    solution: {
      en: "A Turborepo monorepo with a Next.js 15 admin platform, a BullMQ background worker for processing, and a PostgreSQL database with a rich schema covering businesses, evidence, and claims.",
      tr: "Next.js 15 admin platformu, BullMQ arka plan işçisi ve işletmeleri kapsayan zengin şema içeren Turborepo monorepo.",
    },
    whyItMatters: {
      en: "Shows the developer can structure a production monorepo with clear package boundaries, implement test coverage on domain logic, and build background worker systems.",
      tr: "Geliştiricinin üretim seviyesinde bir monorepo yapılandırabildiğini ve arka plan işçi sistemleri inşa edebildiğini gösterir.",
    },

    responsibilities: [
      { en: "Designed the Turbo monorepo workspace structure with shared packages" },
      { en: "Defined phase-based Prisma schema with 30+ models" },
      { en: "Implemented domain logic for CitationDetector, ConfidenceCalculator, and ContentBriefGenerator" },
      { en: "Built 50+ admin pages with Server Actions and Middleware auth" },
    ],
    engineeringDecisions: [
      { en: "Monorepo with shared @lios/database and @lios/domain packages" },
      { en: "BullMQ worker as a separate app — fully decoupled from the web frontend" },
      { en: "Next.js Server Actions for mutation operations to avoid separate API layer overhead" },
    ],

    technologies: {
      frontend: ["Next.js 15", "React 19", "TailwindCSS"],
      backend: ["BullMQ", "ioredis"],
      database: ["PostgreSQL", "Prisma ORM"],
      infrastructure: ["pnpm + Turborepo", "Docker Compose", "Redis"],
    },

    engineeringSignals: [
      "Monorepo",
      "Background workers",
      "BullMQ queue",
      "Unit tests",
      "Domain modeling",
      "Docker",
    ],
    
    problemFlow: [
      { label: "Unverified Claims", type: "problem" },
      { label: "Evidence Engine", type: "system" },
      { label: "Validation Worker", type: "engine" },
      { label: "Authority Score", type: "output" },
    ],

    metrics: [],
  },

  {
    slug: "gen",
    name: "SentioPulse",
    missionNumber: "003",
    category: "Data Intelligence",
    status: "flagship",
    year: "2026",
    role: "Data Engineering",
    primarySignal: "Data Engineering",
    secondarySignals: ["Vector Search", "Event Streaming"],
    badges: ["DATA PIPELINE", "QDRANT"],
    recruiterPriority: 3,
    featured: true,
    portfolioScore: 85,

    shortDescription: {
      en: "A multi-source pain signal ingestion platform that clusters community complaints using vector search and AI.",
      tr: "Topluluk şikayetlerini vektör arama ve yapay zeka kullanarak kümeleyen ağrı sinyali platformu.",
      az: "İcma şikayətlərini vektor axtarışı və süni intellekt vasitəsilə qruplaşdıran çoxmənbəli problem siqnalı platforması.",
    },
    heroStatement: {
      en: "Systematically listening to the internet's complaints — and turning them into product opportunities.",
      tr: "İnternetin şikayetlerini sistematik olarak dinlemek ve ürün fırsatlarına dönüştürmek.",
    },
    problem: {
      en: "Pain signals exist everywhere but remain unstructured, unprocessed, and invisible to product builders.",
      tr: "Ağrı sinyalleri her yerde mevcuttur ancak yapılandırılmamış ve görünmez kalır.",
      az: "Müştəri şikayət və problem siqnalları internetin hər yerində mövcuddur, lakin strukturlaşdırılmamış və məhsul yaradıcıları üçün görünməz olaraq qalır.",
    },
    solution: {
      en: "An automated pipeline that ingests raw community signals, scores them across 6 dimensions, clusters them semantically with vector embeddings, and tracks velocity.",
      tr: "Ham sinyalleri alan, 6 boyutta puanlayan, vektör yerleştirmeleriyle kümelendiren otomatik boru hattı.",
      az: "Xam şikayət siqnallarını toplayan, 6 ölçü üzrə xallandıran, vektor yerləşdirmələri (embeddings) ilə semantik qruplaşdıran və inkişaf dinamikasını izləyən avtomatlaşdırılmış boru xətti.",
    },
    whyItMatters: {
      en: "Demonstrates the ability to design and reason about a multi-layer data pipeline with vector search, event streaming, and AI-scoring — not just CRUD applications.",
      tr: "Vektör arama ve olay akışına sahip çok katmanlı bir veri hattı tasarlama yeteneğini gösterir.",
      az: "Sadəcə CRUD deyil, vektor axtarışı, hadisə axını (event streaming) və AI qiymətləndirməsinə malik çoxqatlı məlumat xətti qurma bacarığını göstərir.",
    },

    responsibilities: [
      { en: "Designed Prisma schema with 4-layer pipeline architecture: Ingestion, Processing, Clustering, Opportunity layer" },
      { en: "Orchestrated 4-service Docker environment: PostgreSQL, Redis, Qdrant, Redpanda" },
      { en: "Built multi-source ingestion scripts using Playwright and Cheerio" },
    ],
    engineeringDecisions: [
      { en: "6-dimensional pain scoring model for structured quantification of qualitative signals" },
      { en: "Qdrant for semantic clustering — embeddings stored alongside structured data" },
      { en: "Kafka/Redpanda for event streaming to decouple signal ingestion from processing" },
    ],

    technologies: {
      frontend: ["Next.js 16"],
      backend: ["BullMQ", "Playwright", "Winston"],
      database: ["PostgreSQL", "Prisma", "Qdrant (Vector DB)"],
      infrastructure: ["Redpanda (Kafka)", "Docker Compose", "Redis"],
    },

    engineeringSignals: [
      "4-layer pipeline",
      "Vector DB (Qdrant)",
      "Event streaming (Kafka)",
      "Background jobs",
      "Multi-source scraping",
    ],

    metrics: [],
  },

  {
    slug: "macagel",
    name: "MaçaGel",
    missionNumber: "004",
    category: "Mobile Application",
    status: "flagship",
    year: "2026",
    role: "Mobile Product Development",
    primarySignal: "Mobile Product",
    secondarySignals: ["Firebase", "Push Notifications"],
    badges: ["APP STORE", "PRODUCTION"],
    recruiterPriority: 4,
    featured: true,
    portfolioScore: 82,

    shortDescription: {
      en: "A mobile platform for discovering and organizing amateur football matches — replacing WhatsApp chaos.",
      tr: "Amatör futbol maçlarını keşfetmek ve organize etmek için mobil platform.",
      az: "Həvəskar futbol oyunlarını kəşf etmək və təşkil etmək üçün mobil platforma — WhatsApp xaosuna son qoyur.",
    },
    heroStatement: {
      en: "Replacing 20-person WhatsApp chaos with a structured football match platform — built from scratch.",
      tr: "20 kişilik WhatsApp kaosunu yapılandırılmış bir platformla değiştirmek.",
    },
    problem: {
      en: "Amateur football players organize matches through WhatsApp groups — leading to no-shows and unbalanced teams.",
      tr: "Amatör oyuncular maçları WhatsApp üzerinden organize ediyor — bu durum dengesiz takımlara yol açıyor.",
    },
    solution: {
      en: "A mobile-first platform where users create matches, filter players, join with one tap, and receive push notifications — with Firebase backend.",
      tr: "Kullanıcıların maç oluşturduğu, tek dokunuşla katıldığı ve anlık bildirim aldığı mobil platform.",
      az: "İstifadəçilərin oyun yaratdığı, oyunçuları filtrlədiyi, tək toxunuşla qatıldığı və anlıq bildirişlər aldığı mobil platforma.",
    },
    whyItMatters: {
      en: "Shows the developer can ship a full mobile product with real backend, push notifications, and App Store deployment.",
      tr: "Gerçek backend ve anlık bildirimlerle App Store'a ürün teslim etme yeteneğini gösterir.",
      az: "Real backend, push bildirişlər və App Store yayımı ilə tam mobil məhsulu sıfırdan təhvil vermə bacarığını sübut edir.",
    },

    responsibilities: [
      { en: "Full Expo project with native build config (EAS) targeting App Store submission" },
      { en: "Developed Firebase Cloud Functions for server-side logic" },
      { en: "Configured Firebase Firestore Security Rules for production" },
      { en: "Built separate admin panel decoupled from the user app" },
    ],
    engineeringDecisions: [
      { en: "Firebase Cloud Functions for server-side logic to avoid client-only vulnerabilities" },
      { en: "Separate admin panel for operational management" },
    ],

    technologies: {
      mobile: ["React Native", "Expo SDK 53", "Expo Router"],
      backend: ["Firebase Cloud Functions", "Firebase Auth", "FCM"],
      database: ["Firebase Firestore"],
      infrastructure: ["EAS Build"],
    },

    engineeringSignals: [
      "App Store published",
      "Firebase Cloud Functions",
      "Push notifications",
      "Security rules",
    ],

    metrics: ["Published on App Store"],
    verificationRequired: true,
  },

  // ─── SUPPORTING ──────────────────────────────────────────────────────────────
  {
    slug: "pazarlama",
    name: "LeadCompass",
    missionNumber: "005",
    category: "Programmatic SEO",
    status: "supporting",
    year: "2026",
    role: "Full-Stack Development",
    primarySignal: "Programmatic SEO",
    secondarySignals: ["Next.js", "Automation"],
    badges: ["PROGRAMMATIC SEO"],
    featured: false,
    portfolioScore: 72,

    shortDescription: {
      en: "A B2B lead directory with programmatic [city]/[sector] SEO architecture and AI content generation.",
      tr: "[şehir]/[sektör] programatik SEO mimarisi içeren B2B rehber platformu.",
    },
    heroStatement: { en: "", tr: "" },
    problem: { en: "", tr: "" },
    solution: { en: "", tr: "" },
    whyItMatters: { en: "", tr: "" },

    responsibilities: [],
    engineeringDecisions: [],
    technologies: { frontend: ["Next.js", "TypeScript"], database: ["Prisma", "PostgreSQL"] },
    engineeringSignals: ["Programmatic routing", "robots.ts", "AI content API"],
    metrics: [],
  },

  {
    slug: "gorevfinal",
    name: "RankAutomator",
    missionNumber: "006",
    category: "SEO Automation",
    status: "supporting",
    year: "2026",
    role: "Backend Engineering",
    primarySignal: "Backend Engineering",
    secondarySignals: ["Python", "Playwright"],
    badges: ["PYTHON ASYNC"],
    featured: false,
    portfolioScore: 69,

    shortDescription: {
      en: "Enterprise backlink automation platform — async FastAPI backend with Playwright anti-detection.",
      tr: "Playwright anti-algılama içeren kurumsal backlink otomasyon platformu.",
    },
    heroStatement: { en: "", tr: "" },
    problem: { en: "", tr: "" },
    solution: { en: "", tr: "" },
    whyItMatters: { en: "", tr: "" },

    responsibilities: [],
    engineeringDecisions: [],
    technologies: { backend: ["FastAPI", "Python", "Playwright"], database: ["SQLAlchemy async", "Alembic"] },
    engineeringSignals: ["Async Python", "Repository pattern", "Anti-detection"],
    metrics: [],
  },

  {
    slug: "atahan",
    name: "DeskReserve",
    missionNumber: "007",
    category: "Desktop Application",
    status: "supporting",
    year: "2026",
    role: "Desktop Engineering",
    primarySignal: "Desktop Engineering",
    secondarySignals: ["Electron", "SQLite"],
    badges: ["CLIENT DELIVERY", "OFFLINE"],
    featured: false,
    portfolioScore: 68,

    shortDescription: {
      en: "Offline-first desktop reservation management system for a real client — Electron + SQLite.",
      tr: "Gerçek müşteri için çevrimdışı masaüstü rezervasyon sistemi.",
    },
    heroStatement: { en: "", tr: "" },
    problem: { en: "", tr: "" },
    solution: { en: "", tr: "" },
    whyItMatters: { en: "", tr: "" },

    responsibilities: [],
    engineeringDecisions: [],
    technologies: { frontend: ["Electron", "React", "TypeScript"], database: ["SQLite"] },
    engineeringSignals: ["Offline-first", "Native desktop app", "SQLite"],
    metrics: ["Delivered to real client"],
  },

  {
    slug: "vize",
    name: "VisaQueue RPA",
    missionNumber: "008",
    category: "RPA Engineering",
    status: "supporting",
    year: "2026",
    role: "RPA Automation",
    primarySignal: "RPA Engineering",
    secondarySignals: ["Python", "State Machine"],
    badges: ["HUMAN-IN-THE-LOOP"],
    featured: false,
    portfolioScore: 65,

    shortDescription: {
      en: "Human-in-the-Loop RPA for visa appointment booking with state machine and anti-detection.",
      tr: "Vize randevusu için durum makinesi ve insan döngülü RPA.",
    },
    heroStatement: { en: "", tr: "" },
    problem: { en: "", tr: "" },
    solution: { en: "", tr: "" },
    whyItMatters: { en: "", tr: "" },

    responsibilities: [],
    engineeringDecisions: [],
    technologies: { backend: ["Python", "Playwright", "Flask"] },
    engineeringSignals: ["State machine", "Anti-detection", "Rate limiting", "Human-in-the-Loop"],
    metrics: [],
  },
  
  {
    slug: "tekstil",
    name: "VeloDrape 3D",
    missionNumber: "009",
    category: "Computer Vision",
    status: "flagship",
    year: "2026",
    role: "Full-Stack & Computer Vision Mühendisi",
    primarySignal: "Computer Vision",
    secondarySignals: ["WebGL", "Three.js"],
    badges: ["COMPUTER VISION", "3D WEBGL"],
    featured: true,
    portfolioScore: 86,

    shortDescription: {
      en: "Web-based 3D virtual clothing try-on using webcam and TensorFlow.js.",
      tr: "Web kamerası ve TensorFlow.js ile tarayıcı içi 3D sanal kıyafet deneme motoru.",
      az: "Veb kamera və TensorFlow.js ilə brauzer daxilində işləyən real vaxtlı 3D virtual geyim yoxlama mühərriki.",
    },
    heroStatement: {
      en: "Real-time browser-based body tracking and 3D clothing simulation powered by computer vision.",
      tr: "Web tarayıcısında gerçek zamanlı vücut takibi ve 3D kıyafet simülasyonu sağlayan yapay zeka destekli sanal deneme kabini."
    },
    problem: {
      en: "Over 70% of e-commerce fashion returns stem from fit and sizing mismatches. Traditional virtual try-on systems either required heavy native installations or high-end GPU hardware, making browser adoption impractical.",
      tr: "E-ticarette kıyafet iadelerinin %70'inden fazlası beden ve kalıp uyumsuzluğundan kaynaklanır. Kullanıcıların ürünü üzerlerinde görmeden satın alması hem yüksek iade maliyetlerine hem de düşük dönüşüm oranlarına yol açıyordu. Geleneksel 3D çözümler ise ağır mobil uygulamalar veya yüksek donanım gerektiriyordu."
    },
    solution: {
      en: "Engineered a client-side virtual try-on engine combining Next.js, Three.js, and MediaPipe/TensorFlow.js. It extracts skeleton pose and body contours directly from standard webcams with real-time WebGL rendering.",
      tr: "Next.js, Three.js ve MediaPipe/TensorFlow.js mimarilerini birleştirerek; sıradan bir web kamerası akışı üzerinden kullanıcının eklem noktalarını ve vücut geometrisini mikrosaniyeler içinde çıkaran istemci taraflı (client-side) bir sanal prova motoru geliştirdim. 3D modeller GPU üzerinden WebGL ile anlık giydirilir."
    },
    whyItMatters: {
      en: "Runs at 60 FPS directly within the user's browser with zero server GPU overhead, drastically cutting return rates and driving e-commerce conversions.",
      tr: "Sunucu tarafında ağır GPU maliyetleri ödemeden, doğrudan kullanıcının tarayıcısında 60 FPS çalışan ve e-ticaret dönüşüm oranlarını doğrudan artıran yenilikçi bir web mühendisliği çözümüdür."
    },

    responsibilities: [],
    engineeringDecisions: [],
    technologies: { frontend: ["Next.js", "Three.js"], ai: ["TensorFlow.js", "MediaPipe Pose"] },
    engineeringSignals: ["Computer vision", "WebGL GPU processing", "3D rendering"],
    metrics: [],
  },

  {
    slug: "yt",
    name: "CineForge AI",
    missionNumber: "010",
    category: "AI Media Pipeline",
    status: "supporting",
    year: "2026",
    role: "Pipeline Engineering",
    primarySignal: "Pipeline Engineering",
    secondarySignals: ["BullMQ", "Node.js"],
    badges: ["AI PIPELINE"],
    featured: false,
    portfolioScore: 58,

    shortDescription: {
      en: "Semi-automated YouTube video production system — AI script generation and TTS orchestration.",
      tr: "Yarı otomatik YouTube video üretim sistemi — AI script ve TTS.",
    },
    heroStatement: { en: "", tr: "" },
    problem: { en: "", tr: "" },
    solution: { en: "", tr: "" },
    whyItMatters: { en: "", tr: "" },

    responsibilities: [],
    engineeringDecisions: [],
    technologies: { backend: ["Node.js", "BullMQ", "FFmpeg"], ai: ["XTTS", "OpenRouter"] },
    engineeringSignals: ["Background jobs", "Multi-step pipeline", "AI orchestration"],
    metrics: [],
  },
  {
    slug: "arama",
    name: "SearchGrid",
    missionNumber: "011",
    category: "Arama Altyapısı",
    status: "flagship",
    year: "2026",
    role: "Tam Yığın Mimarisi",
    primarySignal: "Turborepo",
    secondarySignals: ["Next.js", "Prisma"],
    badges: ["MONOREPO"],
    featured: true,
    portfolioScore: 85,
    shortDescription: { 
      en: "A scalable search infrastructure built as a Turborepo monorepo with dedicated database packages.", 
      tr: "Özel veritabanı paketlerine sahip bir Turborepo monorepo olarak oluşturulmuş arama altyapısı.",
      az: "Xüsusi verilənlər bazası paketlərinə malik Turborepo monorepo kimi qurulmuş miqyaslana bilən axtarış infrastrukturu."
    },
    heroStatement: { en: "A high-performance Turborepo architecture designed to unify fragmented search services into a single, infinitely scalable node.", tr: "Parçalanmış arama servislerini tek ve sınırsız ölçeklenebilir bir düğümde birleştirmek için tasarlanmış yüksek performanslı Turborepo mimarisi." },
    problem: { 
      en: "Managing fragmented search databases and microservices causes severe latency and developer overhead at scale.", 
      tr: "Farklı veritabanları, bağımsız servisler ve karmaşık bağımlılıklar... Sistemler büyüdükçe arama altyapıları hantallaşır. Geleneksel monolitik yapılar veya kopuk mikroservisler, milyonlarca satır veri içinde anlık (real-time) arama yapmayı kabusa dönüştürüyordu. Kod tabanını yönetmek, performansı artırmaktan daha fazla zaman alıyordu.",
      az: "Fərqli verilənlər bazaları, müstəqil servislər və mürəkkəb asılılıqlar... Sistemlər böyüdükcə axtarış infrastrukturu ləngiyir. Ənənəvi monolitik strukturlar milyonlarla sətir məlumat içində real vaxtda axtarış etməyi çətinləşdirirdi." 
    },
    solution: { 
      en: "Architected a unified Turborepo monorepo with Next.js, Prisma, and isolated domain search packages for instantaneous queries.", 
      tr: "Kodu tamamen parçalayıp yeniden inşa ettim. Tüm altyapıyı bir 'Turborepo (Monorepo)' mimarisi altında birleştirdim. Next.js ve Prisma'yı merkeze alarak; veritabanı şemalarından arama motoru mantıklarına kadar her şeyi bağımsız 'paketler (packages)' haline getirdim. Artık her modül kendi içinde izole ama sistemin tamamı devasa, tek bir beyin gibi çalışıyor.",
      az: "Bütün infrastrukturu vahid Turborepo monorepo memarlığı altında birləşdirdim. Next.js və Prisma-nı mərkəzə qoyaraq, verilənlər bazası sxemlərindən axtarış mühərriki məntiqinə qədər hər şeyi müstəqil paketlərə ayırdım; sistem tək bir nəhəng beyin kimi çalışır." 
    },
    whyItMatters: { 
      en: "A monorepo performance revolution eliminating query latencies and enabling seamless scaling.", 
      tr: "Bu sadece bir kod düzenleme operasyonu değildi; bir performans ve ölçeklenebilirlik devrimiydi. Yeni bir geliştiricinin sisteme adapte olması saatler değil, dakikalar alıyor. Arama hızlarındaki milisaniyelik gecikmeler ortadan kalktı ve sistem, gelecekte eklenecek binlerce yeni servisi tek satır kod çakışması olmadan kaldırabilecek altyapıya kavuştu.",
      az: "Milisaniyəlik axtarış gecikmələrini aradan qaldıran və gələcəkdə əlavə olunacaq minlərlə yeni servisi tək sətir kod toqquşması olmadan qəbul edə bilən yüksək performanslı memarlıq."
    },
    responsibilities: [],
    engineeringDecisions: [],
    technologies: { frontend: ["Next.js"], database: ["Prisma"] },
    engineeringSignals: ["Monorepo setup"],
    metrics: []
  },
  {
    slug: "devrim",
    name: "ChronoPost",
    missionNumber: "012",
    category: "Sosyal Medya Otomasyonu",
    status: "flagship",
    year: "2026",
    role: "Backend & Otomasyon Mimarı",
    primarySignal: "Görev Zamanlama",
    secondarySignals: ["PHP", "Workers", "REST API"],
    badges: ["OTOMASYON", "DAĞITIK KUYRUK"],
    featured: true,
    portfolioScore: 85,
    shortDescription: { 
      en: "A custom PHP-based backend system for scheduling and automating social media posts.", 
      tr: "Sosyal medya gönderilerini zamanlamak ve otomatikleştirmek için özel PHP tabanlı arka uç sistemi.",
      az: "Sosial media paylaşımlarını planlaşdırmaq və avtomatlaşdırmaq üçün xüsusi PHP arxa plan sistemi."
    },
    heroStatement: {
      en: "An autonomous publishing engine managing multi-channel social media distribution with zero downtime and smart queues.",
      tr: "Çoklu sosyal medya platformlarına içerik dağıtımını sıfır kesinti ve akıllı zamanlama ile yöneten otonom yayın motoru."
    },
    problem: {
      en: "Distributing media across multiple social platforms concurrently leads to severe rate-limit bottlenecks, token expirations, and format fragmentation when handled manually.",
      tr: "Birden fazla sosyal medya hesabına eş zamanlı içerik dağıtımı yapmak; API hız sınırları (rate limits), platform güncellemeleri ve görsel format uyumsuzlukları nedeniyle manuel olarak sürdürülemez bir süreçtir. Tek bir başarısız istek tüm yayın akışını kilitleyebiliyordu."
    },
    solution: {
      en: "Architected an asynchronous worker queue in PHP with automated cron runners. Posts are buffered, media is transformed on the fly, token refreshes are handled transparently, and failures are retried with exponential backoff.",
      tr: "PHP ve cron arka plan işçileri (workers) ile asenkron kuyruk mimarisi kurdum. Gönderiler kuyruğa alınır, medya boyutları hedef platforma göre optimize edilir, token yenilemeleri otomatik yapılır ve hata durumunda exponential backoff ile tekrar denenerek kesintisiz yayın sağlanır."
    },
    whyItMatters: {
      en: "Eliminates repetitive manual publishing and delivers a battle-tested distribution pipeline capable of reliably scheduling hundreds of multi-platform posts.",
      tr: "İçerik yönetiminde saatler süren manuel paylaşım yükünü sıfırlayarak, tek merkezden yüzlerce gönderinin güvenle ve tam zamanında yayınlanmasını sağlayan sağlam bir operasyonel güç sunar."
    },
    responsibilities: [],
    engineeringDecisions: [],
    technologies: { backend: ["PHP", "MySQL"] },
    engineeringSignals: ["Cron workers", "API integration"],
    metrics: []
  },
  {
    slug: "dosya",
    name: "CloudVault",
    missionNumber: "013",
    category: "Dosya Yönetimi",
    status: "supporting",
    year: "2026",
    role: "Tam Yığın Geliştirici",
    primarySignal: "Dosya Sistemi",
    secondarySignals: [],
    badges: ["DEPOLAMA"],
    featured: false,
    portfolioScore: 55,
    shortDescription: { en: "A custom web application for managing, sharing, and organizing files.", tr: "Dosyaları yönetmek, paylaşmak ve düzenlemek için özel web uygulaması." },
    heroStatement: { en: "", tr: "" },
    problem: { en: "", tr: "" },
    solution: { en: "", tr: "" },
    whyItMatters: { en: "", tr: "" },
    responsibilities: [],
    engineeringDecisions: [],
    technologies: {},
    engineeringSignals: [],
    metrics: []
  },
  {
    slug: "drop",
    name: "DataHarvester",
    missionNumber: "014",
    category: "Veri Çıkarma",
    status: "supporting",
    year: "2026",
    role: "Tam Yığın Geliştirici",
    primarySignal: "Web Scraping",
    secondarySignals: ["Playwright", "Drizzle ORM"],
    badges: ["VERİ MADENCİLİĞİ"],
    featured: false,
    portfolioScore: 72,
    shortDescription: { en: "A Next.js data extraction engine utilizing Playwright and Cheerio with Drizzle ORM.", tr: "Playwright ve Cheerio'yu Drizzle ORM ile kullanan bir Next.js veri çıkarma motoru." },
    heroStatement: { en: "", tr: "" },
    problem: { en: "", tr: "" },
    solution: { en: "", tr: "" },
    whyItMatters: { en: "", tr: "" },
    responsibilities: [],
    engineeringDecisions: [],
    technologies: { frontend: ["Next.js"], database: ["Drizzle ORM"] },
    engineeringSignals: ["Scraping", "Data processing"],
    metrics: []
  },
  {
    slug: "farm",
    name: "ContentForge",
    missionNumber: "015",
    category: "İçerik Otomasyonu",
    status: "supporting",
    year: "2026",
    role: "Yapay Zeka Mühendisi",
    primarySignal: "Üretken Yapay Zeka",
    secondarySignals: ["PHP", "TTS"],
    badges: ["YAPAY ZEKA"],
    featured: false,
    portfolioScore: 82,
    shortDescription: { en: "An automated pipeline for mass generating media and text content using AI APIs like Gemini and TTS services.", tr: "Gemini ve TTS servisleri gibi yapay zeka API'lerini kullanarak toplu medya ve metin içeriği oluşturmak için otomatikleştirilmiş bir sistem." },
    heroStatement: { en: "An autonomous AI pipeline that continuously ingests prompts and outputs production-ready media and text.", tr: "Kesintisiz olarak veri işleyen ve üretime hazır medya/metin üreten otonom bir yapay zeka hattı." },
    problem: { 
      en: "", 
      tr: "İçerik üretiminde insan hızı bir sınırdır. Binlerce farklı varyasyonda metin, seslendirme ve görsel oluşturmak aylar sürecek bir iş yüküdür. Farklı yapay zeka modelleri (Gemini, TTS) harika işler çıkarsa da, bunları manuel olarak kullanmak otomasyonun doğasına aykırıydı. Sorun, yapay zekanın yeteneği değil, onu devasa ölçekte otonom (kendi kendine çalışan) bir fabrikaya dönüştürebilmekti." 
    },
    solution: { 
      en: "", 
      tr: "Yapay zekayı bir asistan olmaktan çıkarıp, durmaksızın çalışan bir 'İçerik Fabrikasına (ContentForge)' dönüştürdüm. PHP tabanlı arka uç sistemim, Gemini API'si ile dinamik metinler oluşturuyor, bu metinleri gelişmiş TTS (Metin-Ses) servisleriyle anında insan doğallığında sese çeviriyor ve tüm süreci kuyruk (job queue) mimarisiyle sıfır kesintiyle yönetiyor." 
    },
    whyItMatters: { 
      en: "", 
      tr: "Aylarca sürecek içerik üretim sürecini saatlere indiren bir ekosistem. Bu sistem sayesinde insan müdahalesine gerek kalmadan, yapay zekanın kendi kendine düşünmesini, üretmesini ve sonuçları yayına hazır hale getirmesini sağlayan saf bir otomasyon gücü elde edildi." 
    },
    responsibilities: [],
    engineeringDecisions: [],
    technologies: { backend: ["PHP"], ai: ["Gemini API", "TTS"] },
    engineeringSignals: ["AI Orchestration", "Job Queues"],
    metrics: []
  },
  {
    slug: "halisaha",
    name: "MaçaGel Mobile V2",
    missionNumber: "016",
    category: "Mobil Uygulama",
    status: "supporting",
    year: "2026",
    role: "Mobil Geliştirici",
    primarySignal: "React Native",
    secondarySignals: ["Expo"],
    badges: ["MOBİL"],
    featured: false,
    portfolioScore: 80,
    shortDescription: { en: "An Expo/React Native mobile application for organizing and joining amateur football matches.", tr: "Amatör futbol maçlarını organize etmek ve katılmak için geliştirilmiş Expo/React Native mobil uygulaması." },
    heroStatement: { en: "", tr: "" },
    problem: { en: "", tr: "" },
    solution: { en: "", tr: "" },
    whyItMatters: { en: "", tr: "" },
    responsibilities: [],
    engineeringDecisions: [],
    technologies: { mobile: ["React Native", "Expo"] },
    engineeringSignals: ["Cross-platform mobile"],
    metrics: []
  },
  {
    slug: "osint-platform",
    name: "Argus Intelligence",
    missionNumber: "017",
    category: "Güvenlik İstihbaratı",
    status: "supporting",
    year: "2026",
    role: "Arka Uç Geliştiricisi",
    primarySignal: "Veri Toplama",
    secondarySignals: ["Node.js", "SQLite"],
    badges: ["SİBER GÜVENLİK"],
    featured: false,
    portfolioScore: 88,
    demoUrl: "/demos/osint-platform/index.html",
    shortDescription: { en: "OSINT & Defense Intelligence Platform for real-time intelligence gathering and threat monitoring.", tr: "Gerçek zamanlı istihbarat toplama ve tehdit izleme için OSINT ve Savunma İstihbarat Platformu." },
    heroStatement: { en: "A real-time intelligence gathering engine that turns global noise into actionable defense strategies.", tr: "Küresel veri gürültüsünü, aksiyon alınabilir savunma stratejilerine dönüştüren gerçek zamanlı istihbarat motoru." },
    problem: { 
      en: "", 
      tr: "Geleneksel güvenlik sistemleri yalnızca saldırı anında tepki verir. Saniyede binlerce siber tehdit, veri sızıntısı ve jeopolitik çatışma yaşanırken; küresel ağlardaki (ve dark web'deki) anomalileri manuel takip etmek, okyanusta iğne aramaktan farksızdır. Temel sorun veriye ulaşmak değil, bu devasa veri gürültüsü (noise) içindeki 'gerçek tehdidi' sistemlerimize ulaşmadan önce filtreleyebilmekti." 
    },
    solution: { 
      en: "", 
      tr: "Reaktif savunmayı, proaktif bir istihbarat kalkanına çeviren OSINT motorunu inşa ettim. Node.js ve SQLite üzerine kurulu bu sistem; açık kaynakları, veri sızıntılarını ve siber tehdit ağlarını 7/24 otonom olarak kazır (scraping). Sadece veriyi toplamakla kalmaz, toplanan kaotik veriyi anlık olarak işleyip 'Yönetici Özeti' formatında temiz, okunabilir ve anında aksiyon alınabilir istihbarat raporlarına dönüştürür." 
    },
    whyItMatters: { 
      en: "", 
      tr: "Bu platform sayesinde tehditler daha kapıya dayanmadan haftalar önce fark edilebilir hale gelir. Kurduğum bu sistem, sadece geçmişi loglayan sıradan bir yazılım değil; gelecekteki tehdit vektörlerini izole edip önünüze getiren stratejik bir savunma silahıdır." 
    },
    responsibilities: [],
    engineeringDecisions: [],
    technologies: { backend: ["Node.js", "Express"], database: ["better-sqlite3"] },
    engineeringSignals: ["Real-time data", "Scraping"],
    metrics: []
  },
  {
    slug: "sherlock",
    name: "TraceMap API",
    missionNumber: "018",
    category: "OSINT Aracı",
    status: "supporting",
    year: "2026",
    role: "Güvenlik Mühendisi",
    primarySignal: "Veri Keşfi",
    secondarySignals: ["PHP"],
    badges: ["OSINT"],
    featured: false,
    portfolioScore: 65,
    shortDescription: { en: "A focused OSINT API for discovering and mapping user payload data across web services.", tr: "Web servisleri genelinde kullanıcı verilerini keşfetmek ve eşlemek için odaklanmış OSINT API'si." },
    heroStatement: { en: "", tr: "" },
    problem: { en: "", tr: "" },
    solution: { en: "", tr: "" },
    whyItMatters: { en: "", tr: "" },
    responsibilities: [],
    engineeringDecisions: [],
    technologies: { backend: ["PHP"] },
    engineeringSignals: ["Data Discovery"],
    metrics: []
  },
  {
    slug: "sitebuilder",
    name: "StaticForge",
    missionNumber: "019",
    category: "Site Oluşturucu",
    status: "flagship",
    year: "2026",
    role: "Sistem & Programatik Mimari",
    primarySignal: "Programatik SEO",
    secondarySignals: ["PHP", "JSON Variations"],
    badges: ["PROGRAMATİK SEO", "STATIC GENERATOR"],
    featured: true,
    portfolioScore: 89,
    demoUrl: "/demos/sitebuilder/starbucks/index.html",
    shortDescription: { 
      en: "A custom programmatic site generation tool that outputs static sites based on JSON variations.", 
      tr: "JSON varyasyonlarına dayalı olarak statik siteler çıkartan özel bir programatik site oluşturma aracı.",
      az: "JSON konfiqurasiyaları əsasında minlərlə statik səhifə formalaşdıran proqramatik sayt mühərriki."
    },
    heroStatement: {
      en: "A programmatic engine generating thousands of blazing-fast, SEO-optimized static sites from unified JSON configurations.",
      tr: "Tek bir veri şablonundan binlerce ultra hızlı, SEO uyumlu ve üretime hazır statik site üreten programatik mimari motoru."
    },
    problem: {
      en: "Building bespoke websites or WordPress instances for hundreds of niche businesses creates unacceptable server bloat, maintenance overhead, and security liabilities. Static HTML is ideal for speed, but manual generation does not scale.",
      tr: "Yüzlerce farklı sektör ve yerel işletme için sıfırdan site kodlamak ya da WordPress kurmak sunucu maliyetlerini, veritabanı şişmesini ve bakım masraflarını kontrol edilemez hale getiriyordu. Statik HTML hızı ve güvenliği gerekiyordu ancak her siteyi manuel oluşturmak imkansızdı."
    },
    solution: {
      en: "Developed the StaticForge architecture utilizing JSON variation drivers and reusable template modules. It compiles color schemes, layouts, dynamic components, and full SEO metadata into pure zero-database static assets achieving 100/100 Lighthouse scores.",
      tr: "JSON varyasyon motoru ve bileşen şablonları üzerine kurulu StaticForge mimarisini inşa ettim. Sistem; renk paletlerinden içerik bloklarına, interaktif bileşenlerden meta etiketlerine kadar her detayı dinamik işleyerek saniyeler içinde sıfır veritabanı bağımlılığı olan, 100/100 Google Lighthouse puanlı statik siteler üretir."
    },
    whyItMatters: {
      en: "Radically compresses deployment times and infrastructure costs to near-zero while delivering unmatched security and instant sub-second page loads at scale.",
      tr: "Programatik SEO ve toplu site üretiminde sunucu maliyetlerini sıfıra yakın seviyeye indirirken, hacklenme riskini ortadan kaldıran ve sayfa açılış hızlarını mikrosaniyelere düşüren üst düzey bir ölçeklenebilirlik başarısıdır."
    },
    responsibilities: [],
    engineeringDecisions: [],
    technologies: { backend: ["PHP"] },
    engineeringSignals: ["Static generation", "Programmatic SEO"],
    metrics: []
  },
  {
    slug: "vfs-bot",
    name: "VisaQueue AutoPilot",
    missionNumber: "020",
    category: "Otomasyon Aracı",
    status: "supporting",
    year: "2026",
    role: "Arka Uç Geliştiricisi",
    primarySignal: "RPA Otomasyonu",
    secondarySignals: ["Python", "Playwright"],
    badges: ["RPA"],
    featured: false,
    portfolioScore: 75,
    shortDescription: { en: "A Python-based RPA tool utilizing Playwright for automating and securing VFS visa appointments.", tr: "VFS vize randevularını otomatikleştirmek için Playwright kullanan Python tabanlı RPA aracı." },
    heroStatement: { en: "", tr: "" },
    problem: { en: "", tr: "" },
    solution: { en: "", tr: "" },
    whyItMatters: { en: "", tr: "" },
    responsibilities: [],
    engineeringDecisions: [],
    technologies: { backend: ["Python", "Playwright"] },
    engineeringSignals: ["Browser automation", "Anti-detection"],
    metrics: []
  }
];

export const flagshipProjects = projects.filter((p) => p.status === "flagship");
export const supportingProjects = projects.filter((p) => p.status === "supporting");
export const clientProjects = projects.filter((p) => p.status === "client");
