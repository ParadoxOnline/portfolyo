import fs from 'fs';

let content = fs.readFileSync('src/data/translations.ts', 'utf8');

// Update type Lang
content = content.replace('export type Lang = "en" | "tr";', 'export type Lang = "en" | "tr" | "az";');

const azBlock = `  az: {
    nav: {
      work: "Layihələr",
      about: "Haqqımda",
      contact: "Əlaqə",
    },
    hero: {
      available: "Yeni layihələr üçün açıqdır",
      title: "Full-Stack Mühəndis",
      subtitle: "SEO Platformaları · AI Avtomatlaşdırma",
      tagline: "Yalnız veb-sayt deyil, strukturlaşdırılmış problemləri həll edən sistemlər qururam.",
      cta: "Laboratoriyanı Kəşf Et",
      ctaSecondary: "İşəgötürən Modu",
    },
    work: {
      title: "Seçilmiş İşlər",
      subtitle: "Kod analizi ilə təsdiqlənmiş layihələr — təxmin və fərziyyəsiz.",
      flagship: "Flaqman",
      supporting: "Dəstəkləyən",
      showAll: "Bütün layihələri göstər",
      showLess: "Daha az göstər",
      client: "Müştəri İşləri",
      viewProject: "Keys araşdırmasını oxu",
      liveTag: "Canlı",
      appStoreTag: "App Store",
      deliveredTag: "Təhvil verildi",
      score: "Portfel balı",
    },
    about: {
      title: "Haqqımda",
      headline: "Sistem qururam. Təkcə funksiya yox.",
      bio1:
        "Veb tərtibatı, SEO mühəndisliyi və süni intellekt dəstəkli avtomatlaşdırmaya yönəlmiş proqram təminatı mühəndisiyəm. İşlərim texniki dərinlik ilə məhsul təfəkkürünün kəsişməsində yerləşir.",
      bio2:
        "Son iki ildə bir çox istehsal sistemləri qurdum və çatdırdım — Google API-ləri ilə birbaşa inteqrasiya olunmuş Clean Architecture .NET SEO platformasından, App Store-da yerləşən mobil tətbiqə, vektor verilənlər bazası və Kafka axınlarına qədər.",
      bio3:
        "Həm mühəndislik dəqiqliyi, həm də məhsul intuisiya tələb edən tapşırıqlarda ən yüksək məhsuldarlıqla işləyirəm.",
      positioning: "Üstünlüklərim",
      skills: [
        "SEO Platform Mühəndisliyi (.NET, Next.js, Google API-ləri)",
        "Full-Stack TypeScript (Next.js, Prisma, BullMQ, Turbo)",
        "Python Avtomatlaşdırma (FastAPI, Playwright, Celery)",
        "Mobil Tərtibat (React Native, Expo, Firebase)",
        "AI İnteqrasiyası (OpenRouter, OpenAI, Gemini)",
        "Məlumat Axınları (Qdrant, Kafka, PostgreSQL)",
      ],
      matrix: "Bacıraqlar Matrisi",
      matrixDesc: "Real layihələrdə sübut olunmuş bacarıqlar — iddia yox, fakt.",
    },
    contact: {
      title: "Birlikdə işləyək",
      subtitle: "Freelance layihələr, tam ştatlı vəzifələr və maraqlı əməkdaşlıqlar üçün hazıram.",
      email: "E-poçt",
      github: "GitHub",
      linkedin: "LinkedIn",
      cta: "Mesaj göndər",
    },
    project: {
      back: "← Laboratoriyaya Qayıt",
      problem: "Problem",
      solution: "Sistem Cavabı",
      myRole: "Mənim Rolum",
      architecture: "Memarlıq",
      complexity: "Mürəkkəblik",
      engineeringDecisions: "Əsas Mühəndislik Qərarları",
      technologies: "Texnologiya Yığını",
      signals: "Mühəndislik Siqnalları",
      seoSignals: "SEO Siqnalları",
      recruiterTakeaway: "Niyə Bu Layihə Vacibdir",
      metrics: "Metriklər",
      period: "Dövr",
    },
    footer: {
      built: "Next.js ilə qurulub.",
      rights: "Bütün hüquqlar qorunur.",
    },
    lab: {
      focus: "FOKUS",
      selectedProjects: "SEÇİLMİŞ LAYİHƏLƏR",
      currentMode: "CARİ REJİM",
      building: "QURULUR",
      location: "MƏKAN",
      languages: "DİLLƏR",
      strongestProjects: "ƏN GÜCLÜ LAYİHƏLƏR",
      systemCore: "Sistem Nüvəsi",
      exploreSystem: "Sistemi Kəşf Et",
      projectArchive: "LAYİHƏ ARXİVİ",
      view: "Bax",
      hoverToPreview: "ÜZƏRİNƏ GƏL",
      primaryVectors: "Əsas Vektorlar",
      capabilityGraph: "BACARIQ QRAFİKİ",
      demonstratedIn: "Tətbiq edilib",
      selectDomain: "Bacıraqları görmək üçün \\nsahə seçin",
      selectCapability: "Sübutları görmək üçün \\nbacıraq seçin",
      noMapping: "Birbaşa layihə uyğunluğu tapılmadı.",
      capabilities: "BACARIQLAR",
      careerLog: "KARYERA JURNALI",
      systemEvent: "SİSTEM HADİSƏSİ",
      project: "LAYİHƏ",
      capability: "BACARIQ",
      clientSystems: "MÜŞTƏRİ SİSTEMLƏRİ",
      myContribution: "MƏNİM TÖHFƏM",
      completedAt: "BİTDİ",
      aboutBuilder: "MÜHƏNDİS HAQQINDA",
      aiWorkflow: "AI İLƏ GÜCLƏNDİRİLMİŞ TƏRTİBAT",
      problem: "PROBLEM",
      architecture: "MEMARLIQ",
      implement: "TƏTBİQ ET",
      aiAssisted: "AI DƏSTƏKLİ",
      review: "YOXLANIŞ",
      testIterate: "TEST → TƏKRARLA → YAYIMLA",
      aiDescription: "Süni intellekt inkişafı sürətləndirici kimi istifadə olunur — memarlıq və məhsul istiqaməti insan nəzarətində qalır.",
      navLab: "LAB",
      navSystems: "SİSTEMLƏR",
      navCapability: "BACARIQ",
      navLog: "JURNAL",
      navAbout: "HAQQINDA",
      status: "STATUS",
      type: "NÖV",
      role: "ROL",
      year: "İL",
      primarySignal: "ƏSAS SİQNAL",
      secondary: "İKİNCİ DƏRƏCƏLİ",
      keyEngineeringDecisions: "Əsas Texniki Qərarlar",
      nextMission: "NÖVBƏTİ MİSSİYA",
      heroInitializing: "SİSTEM BAŞLADILIR_",
      heroTitle1: "Təkcə",
      heroTitle2: "veb-sayt",
      heroTitle3: "deyil, sistemlər qururam.",
      heroDesc: "Genişlənmə üçün hazırlanmış SEO infrastrukturları, AI dəstəkli məlumat axınları və analitik rəqəmsal məhsullar.",
      heroScroll: "Aşağı Sürüşdür"
    }
  },
};\n`;

// Normalize endings for match
const lastBraceIdx = content.lastIndexOf('};\r\n');
if (lastBraceIdx !== -1) {
  content = content.slice(0, lastBraceIdx) + azBlock;
  fs.writeFileSync('src/data/translations.ts', content, 'utf8');
  console.log('Successfully updated translations.ts');
} else {
  const unixIdx = content.lastIndexOf('};\n');
  if (unixIdx !== -1) {
    content = content.slice(0, unixIdx) + azBlock;
    fs.writeFileSync('src/data/translations.ts', content, 'utf8');
    console.log('Successfully updated translations.ts (unix)');
  } else {
    console.error('Could not find closing brace');
  }
}
