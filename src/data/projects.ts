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
      en: "An autonomous SEO platform that ranks local businesses at #1 on Google without agency fees or manual copywriting.",
      tr: "Yerel işletmeleri (hizmet sektörleri, esnaf, klinikler) Google aramalarında otomatik olarak 1. sıraya çıkaran otonom SEO motoru.",
      az: "Yerli biznesləri Google axtarışlarında avtomatik 1-ci sıraya çıxaran otonom SEO və müştəri axını platforması.",
    },
    heroStatement: {
      en: "Eliminating agency retainers by automating programmatic search dominance for local industries.",
      tr: "Yerel sektörler için arama motoru hakimiyetini otomatikleştirerek yüksek ajans maliyetlerini ortadan kaldırmak.",
    },
    problem: {
      en: "Local businesses spend thousands monthly on agencies or Google Ads for visibility. Manual SEO takes months, requires expensive writers, and completely fails to scale across hundreds of services and sub-regions.",
      tr: "Yerel işletmeler müşteri kazanabilmek için her ay on binlerce lira SEO ajanslarına veya Google reklamlarına bağımlı kalıyordu. Manuel SEO aylarca sürüyor, tek tek içerik yazdırmak fahiş maliyet çıkarıyor ve yüzlerce hizmet/semt kombinasyonunda ölçeklenemiyordu.",
      az: "Yerli bizneslər müştəri tapmaq üçün hər ay on minlərlə vəsaiti agentliklərə və reklamlara xərcləməyə məcbur qalırdı. Əl ilə aparılan SEO aylar çəkir, yüksək büdcə tələb edir və davamlı olmurdu.",
    },
    solution: {
      en: "LIOS automatically maps businesses, local categories, and services. Across 25 integrated microservices, it programmatically generates thousands of optimized landing pages, prevents cannibalization, and publishes directly to Google via the Indexing API.",
      tr: "LIOS; işletmeleri, hizmetleri ve semtleri otomatik analiz eder. 25 entegre mikroservis ile binlerce SEO uyumlu açılış sayfasını insan eli değmeden üretir, kelime çakışmalarını önler ve Google Indexing API ile doğrudan canlıya yollar.",
      az: "LIOS biznesləri, xidmətləri və əraziləri avtomatik analiz edir. 25 inteqrasiya olunmuş servis vasitəsilə minlərlə SEO uyğun səhifə hazırlayaraq Google Indexing API ilə dərhal canlıya ötürür.",
    },
    whyItMatters: {
      en: "Business Value & ROI: Compresses 6 months of agency work into minutes, slashing ad/agency spend by 80%+ while driving a constant stream of organic paying customers.",
      tr: "İş Hayatındaki Kazanç & ROI: Bir SEO ajansının 6 ayda yapacağı içerik ve sıralama operasyonunu dakikalara indirir; reklam ve ajans masraflarını %80+ düşürerek işletmelere sürekli ve ücretsiz organik müşteri akışı sağlar.",
      az: "Biznes Qazancı & ROI: Agentliklərin 6 aya görəcəyi işi dəqiqələrə endirir; reklam xərclərini 80%+ azaldaraq müəssisələrə fasiləsiz ödənişsiz üzvi müştəri axını təmin edir.",
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
      en: "An AI market radar monitoring thousands of Reddit and Twitter complaints to uncover high-margin software product opportunities.",
      tr: "İnternetteki (Reddit, Twitter, forumlar) binlerce müşteri şikayetini 7/24 tarayıp doğrudan para kazandıracak ürün fikirlerine dönüştüren yapay zeka pazar araştırma radarı.",
      az: "İnternetdəki minlərlə müştəri şikayətini 7/24 izləyib şirkətlər üçün birbaşa gəlir gətirən məhsul imkanlarına çevirən AI bazar araşdırması radarı.",
    },
    heroStatement: {
      en: "Systematically listening to the internet's complaints — and turning them into profitable product opportunities.",
      tr: "İnternetin şikayetlerini sistematik olarak dinlemek ve karlı ürün fırsatlarına dönüştürmek.",
    },
    problem: {
      en: "Companies waste millions building software products nobody pays for because traditional market research takes months, costs $50k+, and relies on polite surveys instead of real customer frustration.",
      tr: "Girişimler ve şirketler insanların gerçekten neye para ödeyeceğini bilmedikleri için milyonlarca liralık başarısız ürünler çıkartıyor. Geleneksel anketler aylar sürüyor, çok pahalı ve gerçek kullanıcı öfkesini yansıtmıyor.",
      az: "Şirkətlər insanların nəyə pul ödəyəcəyini dəqiq bilmədikləri üçün uğursuz layihələrə milyonlar xərcləyir. Ənənəvi sorğular aylar çəkir və yüksək xərc tələb edir.",
    },
    solution: {
      en: "Continuously scrapes raw community signals via Playwright, scores commercial intent across 6 dimensions, semantically clusters problems with Qdrant vector embeddings, and pinpoints exactly what people are ready to buy.",
      tr: "Topluluklardan ve sosyal medyadan akan kullanıcı isyanlarını otomatik çeker, 6 farklı ticari boyutta (bütçe, aciliyet, sıklık) puanlar, Qdrant vektör yapay zekası ile benzer sorunları kümeleyip anında satacak ürün raporu çıkartır.",
      az: "Sosial şəbəkələrdən gələn istifadəçi şikayətlərini toplayır, 6 parametr üzrə qiymətləndirir və Qdrant vektor AI ilə qruplaşdıraraq dərhal gəlir gətirəcək məhsul təkliflərini çıxarır.",
    },
    whyItMatters: {
      en: "Business Value & ROI: Eliminates $50k+ in research consulting fees and prevents catastrophic product failures by validating commercial willingness-to-pay before writing a single line of code.",
      tr: "İş Hayatındaki Kazanç & ROI: Aylar süren ve on binlerce dolarlık pazar araştırması/danışmanlık maliyetini sıfırlar; şirketlerin tutmayacak ürünlere para gömmesini önleyip doğrudan satın almaya hazır kitleye ürün yapmasını sağlar.",
      az: "Biznes Qazancı & ROI: On minlərlə dollar dəyərində bazar araşdırması və məsləhət xərclərini sıfırlayır; şirkətlərin uğursuz layihələrə sərmayə qoymasının qarşısını alır.",
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
      en: "A sports marketplace mobile app eliminating match cancelations and filling idle pitch hours for venue owners.",
      tr: "Halı saha maçlarındaki adam eksikliği ve organizasyon kaosunu bitiren, oyuncularla tesisleri tek tıkla buluşturan pazar yeri mobil uygulaması.",
      az: "Həvəskar futbol oyunlarında oyunçu çatışmazlığı xaosunu bitirən, oyunçularla meydançaları tək toxunuşla birləşdirən mobil bazar yeri tətbiqi.",
    },
    heroStatement: {
      en: "Converting empty football pitch hours into steady revenue while solving amateur match coordination.",
      tr: "Boş halı saha saatlerini sürekli gelire dönüştürürken amatör maç organizasyonu kaosunu çözmek.",
    },
    problem: {
      en: "Over 50% of amateur games suffer last-minute dropouts via chaotic messaging groups, causing frustrating match cancelations and direct revenue loss for pitch owners who cannot fill the empty slot.",
      tr: "Her hafta yüz binlerce amatör futbolcu WhatsApp gruplarında '1 adam eksik, kaleci gelmedi' diyerek saatlerce vakit kaybediyor; son dakika iptalleri hem oyuncuların maçını yakıyor hem de halı saha işletmelerini ciddi ciro kaybına uğratıyordu.",
      az: "Oyunçular WhatsApp qruplarında oyunçu axtararkən saatlar itirir, son dəqiqə ləğvləri isə həm oyunların pozulmasına, həm də meydança sahiblərinin gəlir itkisinə səbəb olurdu.",
    },
    solution: {
      en: "A real-time mobile app where players discover open matches by position, join rosters with one click, trigger push alerts to nearby players for missing positions, and securely reserve pitches.",
      tr: "Oyuncuların mevki ve seviyelerine göre anında açık maçları gördüğü, tek dokunuşla kadroya girdiği, eksik oyuncu olduğunda çevredeki oyunculara anlık bildirim (push) atan ve rezervasyonu güvenceye alan uçtan uca mobil platform geliştirdim.",
      az: "İstifadəçilərin oyun yaratdığı, oyunçuları filtrlədiyi, tək toxunuşla qatıldığı və anlıq bildirişlər aldığı mobil platforma.",
    },
    whyItMatters: {
      en: "Business Value & ROI: Fills idle venue slots by 35%+, turning dead field hours into high-margin revenue and creating a recurring commission stream on every booking.",
      tr: "İş Hayatındaki Kazanç & ROI: Halı saha tesislerinin boş kalan saatlerini doldurarak atıl kapasiteyi %35+ ciroya dönüştürür; maç iptallerini önleyerek tesis ve platform için kesintisiz rezervasyon komisyonu yaratır.",
      az: "Biznes Qazancı & ROI: Meydançaların boş qalan saatlarını dolduraraq gəliri 35%+ artırır və hər rezervasiyadan stabil komissiya gəliri formalaşdırır.",
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
      en: "A real-time 3D AI virtual try-on engine for fashion e-commerce, letting shoppers preview garments on their own body via webcam.",
      tr: "E-ticaret giyim markaları için, müşterilerin mağazaya gitmeden web kamerasıyla kıyafeti kendi üzerlerinde 3D görmesini sağlayan yapay zeka sanal deneme kabini.",
      az: "E-ticarət geyim brendləri üçün alıcıların mağazaya getmədən veb kamera ilə paltarı öz üzərlərində 3D görməsini təmin edən AI virtual sınama otağı.",
    },
    heroStatement: {
      en: "Eliminating e-commerce returns by bringing zero-install 3D virtual dressing rooms to any web browser.",
      tr: "Sıfır kurulumlu 3D sanal deneme kabinini web tarayıcısına getirerek e-ticaret iade zararlarını ortadan kaldırmak.",
    },
    problem: {
      en: "Online fashion retailers lose up to 35% of all orders to returns caused by sizing doubts and fit mismatches. This forces brands into double shipping costs, damaged inventory, and massive profit margin collapse.",
      tr: "Online giyim alışverişinde satılan her 100 üründen 35'i 'beden uymadı veya üstümde beğenmedim' denilerek iade ediliyor. Bu durum markalara çift taraflı kargo masrafı, ürün yıpranması ve milyonlarca liralık net zarar yazıyor.",
      az: "Onlayn geyim sifarişlərinin 35%-i ölçü uyğunsuzluğuna görə geri qaytarılır. Bu isə brendlərə ikiqat çatdırılma xərci və külli miqdarda zərər vurur.",
    },
    solution: {
      en: "Engineered a zero-install client-side engine using MediaPipe and Three.js. It extracts body posture from standard webcams and drapes 3D clothing models onto the customer in real-time at 60 FPS with zero server GPU overhead.",
      tr: "Uygulama indirme zorunluluğunu kaldırıp doğrudan web tarayıcısında çalışan bir sistem kurdum. MediaPipe ile kameradan vücut eklemlerini milisaniyeler içinde çıkarıp, 3D kıyafet modellerini WebGL ile kullanıcının üzerine sıfır sunucu GPU maliyetiyle giydiren bir motor geliştirdim.",
      az: "Heç bir tətbiq yükləmədən brauzerdə işləyən sistem qurdum. MediaPipe ilə bədən qamətini mikrosaniyələrdə çıxarır və WebGL ilə 3D geyimi alıcının üzərinə canlı geyindirir.",
    },
    whyItMatters: {
      en: "Business Value & ROI: Slashes e-commerce product returns by 40%+, cuts reverse logistics losses, and doubles checkout conversion rates by giving shoppers complete purchasing confidence.",
      tr: "İş Hayatındaki Kazanç & ROI: E-ticaret sitelerinde ürün iade oranlarını %40'ın üzerinde düşürür; kararsız müşterilerin satın alma dönüşüm oranını (conversion rate) 2 katına çıkararak ciro patlaması yaratır.",
      az: "Biznes Qazancı & ROI: Geri qaytarma faizini 40%-dən çox azaldır və alıcıların sifarişi təsdiqləmə dönüşümünü 2 dəfə artıraraq birbaşa gəliri yüksəldir.",
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
      en: "Sub-10ms instant search and discovery infrastructure for multi-million item catalogs, eliminating search abandonment.", 
      tr: "Milyonlarca ürün ve veri barındıran platformlar için 10 milisaniye altı anlık arama ve filtreleme altyapısı.",
      az: "Milyonlarla məhsulu olan böyük platformalar üçün Google sürətində (10ms-dən tez) ani axtarış və filtrləmə infrastrukturu."
    },
    heroStatement: { en: "Eliminating search drop-off and query latency across multi-million item catalogs with unified monorepo architecture.", tr: "Milyonlarca satırlık veri tabanlarında arama gecikmesini ve müşteri kaybını ortadan kaldıran yüksek hızlı monorepo arama mimarisi." },
    problem: { 
      en: "A 2-second search delay causes 50%+ shopper bounce rates. Traditional relational databases bottleneck on multi-attribute queries, locking up servers and forcing shoppers to abandon searches.", 
      tr: "Büyük e-ticaret sitelerinde arama sonuçlarının 2 saniye gecikmesi müşterilerin %50'sinin siteyi terk etmesine yol açar. Geleneksel veritabanları milyonlarca satırda kilitlenir, aramayı dondurur ve doğrudan ciro kaybına sebep olur.",
      az: "Böyük saytlarda axtarışın 2 saniyə ləngiməsi alıcıların 50%-dən çoxunun saytı tərk etməsinə səbəb olur. Ənənəvi bazalar milyonlarla sətirdə donur və gəlir itkisi yaradır." 
    },
    solution: { 
      en: "Architected a modular Turborepo monorepo with isolated search query engines, Prisma optimizations, and edge caching that resolves complex faceted queries in under 10 milliseconds without overloading main databases.", 
      tr: "Turborepo monorepo mimarisi altında izole arama çekirdekleri, optimize edilmiş Prisma indekslemeleri ve hafif önbellekleme katmanı kurarak; arama sorgularını ana veritabanını yormadan 10 milisaniye altında döndüren bir altyapı inşa ettim.",
      az: "Turborepo monorepo memarlığı altında xüsusi axtarış modulları və keşləmə qatı quraraq, axtarış sorğularını bazanı yükləmədən 10 milisaniyədə cavablandıran sistem qurdum." 
    },
    whyItMatters: { 
      en: "Business Value & ROI: Lowers search bounce rate by 45%, lifts search-to-checkout conversion by 30%, and reduces expensive cloud database load by 70%.", 
      tr: "İş Hayatındaki Kazanç & ROI: Arama kaynaklı sepet terk etme oranını %45 azaltır, arama yapan kullanıcıların satın alma oranını %30 artırır ve sunucu sorgu maliyetlerini %70 düşürür.",
      az: "Biznes Qazancı & ROI: Axtarışdan sonra saytı tərk etməni 45% azaldır, satışa çevrilməni 30% artırır və server xərclərini 70% aşağı salır."
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
      en: "An autonomous social media distribution engine managing dozens of brand accounts with smart queuing and zero human manual posting.",
      tr: "Ajansların ve kurumsal markaların onlarca sosyal medya hesabını tek ekrandan 7/24 kesintisiz, otomatik paylaşan otonom içerik dağıtım robotu.",
      az: "Agentlik və brendlərin onlarla sosial media hesabını tək paneldən 7/24 avtomatik yayımlayan otonom paylaşımlar robotu.",
    },
    heroStatement: {
      en: "Eliminating manual agency publishing through asynchronous multi-platform scheduling pipelines.",
      tr: "Asenkron çoklu platform zamanlama mimarisiyle manuel ajans paylaşım yükünü sıfırlamak.",
    },
    problem: {
      en: "Marketing teams waste 20+ hours weekly manually posting across Instagram, Twitter, and LinkedIn, constantly fighting API rate limits, expired tokens, and painful missed post schedules.",
      tr: "Dijital ajanslar ve sosyal medya yöneticileri onlarca müşteri için her gün manuel olarak içerik girmek, saat kurmak ve platformların API limitleriyle boğuşmak zorunda kalıyordu. 1 personelin yönetebileceği hesap sayısı sınırlıydı ve personel maliyeti çok yüksekti.",
      az: "Marketinq komandaları hər gün onlarla müştəri üçün əl ilə paylaşım etmək və saat qurmaq məcburiyyətində idi. 1 işçinin idarə edə biləcəyi hesab sayı məhdud idi və yüksək maaş fondu tələb edirdi.",
    },
    solution: {
      en: "Architected an asynchronous worker queue in PHP with cron runners. Posts are scheduled in bulk, media formats are transcoded automatically, API tokens refresh silently, and failed deliveries retry with exponential backoff.",
      tr: "Arka planda çalışan asenkron işçiler (workers) ve akıllı kuyruk (queue) mimarisi kurdum. Gönderiler topluca planlanır, medya boyutları her platforma göre otomatik optimize edilir, API tokenleri arka planda yenilenir ve sıfır personelle tam vaktinde yayınlanır.",
      az: "Asinxron növbə və worker sistemi qurdum. Paylaşımlar planlaşdırılır, media faylları hər platformaya uyğunlaşdırılır və sıfır insan müdaxiləsi ilə vaxtında dərc olunur.",
    },
    whyItMatters: {
      en: "Business Value & ROI: Scales single-operator account capacity from 3 to 50+ clients, saving 20+ weekly operational hours and slashing agency staffing overhead by 75%.",
      tr: "İş Hayatındaki Kazanç & ROI: 1 personelin yönetebileceği müşteri hesabını 3'ten 50'ye çıkararak ajans iş gücü maliyetini 5 kat azaltır; haftalık 20+ saatlik manuel operasyon ameleliğini ortadan kaldırır.",
      az: "Biznes Qazancı & ROI: 1 əməkdaşın idarə edə biləcəyi müştəri sayını 3-dən 50-yə qaldıraraq işçi xərclərini 5 dəfə azaldır və həftəlik 20 saat əl əməyini sıfırlayır.",
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
      en: "An automated static site factory generating hundreds of sub-second, zero-server-cost business websites from simple JSON configs.",
      tr: "Yüzlerce farklı sektör ve semt için saniyeler içinde Google'da ışık hızında açılan, sıfır sunucu maliyetli profesyonel web siteleri üreten otomatik site fabrikası.",
      az: "Yüzlərlə fərqli sahə üçün saniyələr içində Google-da ildırım sürətində açılan və sıfır server xərcli saytlar hazırlayan avtomatik sayt fabriki.",
    },
    heroStatement: {
      en: "Compressing website rollout timelines from months to minutes with zero-database programmatic generation.",
      tr: "Veritabanı bağımsız programatik üretim ile web sitesi yayına alma sürelerini aylardan dakikalara indirmek.",
    },
    problem: { 
      en: "Building custom websites or managing WordPress instances for hundreds of client niches requires months of manual labor, risks database downtime, and racks up thousands in recurring cloud hosting bills.", 
      tr: "Yüzlerce farklı sektör ve yerel işletme için sıfırdan site kodlamak ya da WordPress kurmak aylar sürer; veritabanı çökmeleri, hacklenme riskleri ve yüksek aylık sunucu faturaları projeleri aşırı maliyetli ve karsız hale getiriyordu.",
      az: "Yüzlərlə kiçik biznes və ya kampaniya üçün tək-tək WordPress qurmaq aylar çəkir, bazanın çökməsi və yüksək server xərcləri layihəni gəlirsiz edir." 
    },
    solution: { 
      en: "Engineered a programmatic JSON variation engine that compiles templates, dynamic components, and complete SEO schemas into pure static HTML files with 100/100 Lighthouse performance and zero database reliance.", 
      tr: "Tek bir JSON veri dosyasından yüzlerce farklı tasarım varyasyonunu derleyen programatik motor geliştirdim. Veritabanı gerektirmeyen, 100/100 Google Lighthouse puanı alan saf statik HTML dosyaları çıkartarak sunucu bağımlılığını tamamen ortadan kaldırdım.",
      az: "Tək bir JSON faylından yüzlərlə fərqli dizayn variantı çıxaran proqramatik mühərrik hazırladım. Baza tələb etməyən, 100/100 Lighthouse balı toplayan statik səhifələr yaradır." 
    },
    whyItMatters: { 
      en: "Business Value & ROI: Compresses web launch timelines from weeks to 5 minutes, slashes cloud hosting costs by 95%, and delivers instant page loads that outrank bloated competitors on Google.", 
      tr: "İş Hayatındaki Kazanç & ROI: Site üretim süresini haftalardan 5 dakikaya indirir; sunucu ve bakım masraflarını %95 düşürürken, ışık hızındaki açılış süresiyle SEO'da rakipleri geride bırakıp organik dönüşüm kazandırır.",
      az: "Biznes Qazancı & ROI: Sayt hazırlama müddətini həftələrdən 5 dəqiqəyə endirir, server və texniki qulluq xərclərini 95% azaldır və axtarışda rəqibləri qabaqlayır."
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
