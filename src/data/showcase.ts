import { projects, type Project } from "./projects";
import screens from "./screens.json";
import type { Lang } from "@/providers/LangProvider";

const manifest = screens as Record<string, string[]>;

/** Gerçek ekran görüntüleri: /public/screens/<slug>/*.jpg → screens.json */
export function getShots(slug: string): string[] {
  return manifest[slug] ?? [];
}

export function pick(text: { en: string; tr?: string; az?: string } | undefined, lang: Lang): string {
  if (!text) return "";
  if (lang === "az") return text.az || text.tr || text.en || "";
  if (lang === "tr") return text.tr || text.en || "";
  return text.en || "";
}

export function describe(p: Project, lang: Lang): string {
  return pick(p.shortDescription, lang) || pick(p.solution, lang);
}

export const flagships: Project[] = projects.filter((p) => p.status === "flagship");
export const others: Project[] = projects.filter((p) => p.status !== "flagship");

export const copy = {
  en: {
    nav: { architecture: "Architecture", work: "Work", reel: "More", contact: "Contact" },
    kicker: "Full-Stack Developer · SEO Platforms · AI Automation",
    h1a: "I build systems,",
    h1b: "not websites.",
    scroll: "Scroll",
    manifesto:
      "Every project here began as a problem nobody had solved cleanly. I turn them into architecture, automation and products that run in production.",
    stat1: "Systems shipped",
    stat2: "Flagship platforms",
    stat3: "Years building",
    flagshipLabel: "Flagship",
    selected: "Selected Work",
    selectedDesc: "{n} flagship platforms — each one a complete system, from architecture to production.",
    reel: "Everything else I built",
    reelHint: "Keep scrolling →",
    view: "View project",
    gallery: "Screens",
    back: "Back",
    next: "Next project",
    contactEyebrow: "Vision",
    contactA: "My vision: turning complex problems",
    contactB: "into simple, scalable systems.",
    contactLead: "Let's build it together.",
    contactCta: "Send a message",
    placeholder: "Screenshot coming soon",
    problem: "The problem",
    solution: "The system",
    why: "Why it matters",
    flowLabel: "Problem ➔ Solution",
    problemBadge: "01 · The Problem",
    problemSubtitle: "Real-world bottleneck",
    solutionBadge: "02 · Architecture Solution",
    solutionSubtitle: "Engineered system",
    impactBadge: "03 · Real-world Value",
    impactSubtitle: "Production impact",
  },
  tr: {
    nav: { architecture: "Mimari", work: "Çalışmalar", reel: "Diğerleri", contact: "İletişim" },
    kicker: "Full-Stack Geliştirici · SEO Platformları · Yapay Zeka Otomasyonu",
    h1a: "Web sitesi değil,",
    h1b: "sistem kuruyorum.",
    scroll: "Kaydır",
    manifesto:
      "Buradaki her proje, kimsenin temiz çözemediği bir problemle başladı. Ben onları mimariye, otomasyona ve canlıda çalışan ürünlere dönüştürüyorum.",
    stat1: "Canlıya alınan sistem",
    stat2: "Amiral gemisi platform",
    stat3: "Yıllık üretim",
    flagshipLabel: "Öne çıkan",
    selected: "Seçili Çalışmalar",
    selectedDesc: "{n} amiral gemisi platform — her biri mimariden canlıya eksiksiz bir sistem.",
    reel: "İnşa ettiğim diğer her şey",
    reelHint: "Kaydırmaya devam →",
    view: "Projeyi incele",
    gallery: "Ekranlar",
    back: "Geri",
    next: "Sonraki proje",
    contactEyebrow: "Vizyon",
    contactA: "Vizyonum: karmaşık problemleri",
    contactB: "sade ve ölçeklenebilir sistemlere dönüştürmek.",
    contactLead: "Birlikte inşa edelim.",
    contactCta: "Mesaj gönder",
    placeholder: "Ekran görüntüsü yakında",
    problem: "Problem",
    solution: "Sistem",
    why: "Neden önemli",
    flowLabel: "Problem ➔ Çözüm",
    problemBadge: "01 · Çözülen Problem",
    problemSubtitle: "Gerçek dünya tıkanıklığı",
    solutionBadge: "02 · Mimari Çözüm",
    solutionSubtitle: "Geliştirilen sistem",
    impactBadge: "03 · Somut Katma Değer",
    impactSubtitle: "Üretim ve iş etkisi",
  },
  az: {
    nav: { architecture: "Memarlıq", work: "İşlər", reel: "Digərləri", contact: "Əlaqə" },
    kicker: "Full-Stack Tərtibatçı · SEO Platformaları · AI Avtomatlaşdırma",
    h1a: "Veb-sayt deyil,",
    h1b: "sistem qururam.",
    scroll: "Aşağı sürüşdür",
    manifesto:
      "Buradakı hər bir layihə heç kəsin səliqəli həll etmədiyi bir problemlə başladı. Mən onları memarlığa, avtomatlaşdırmaya və canlı məhsullara çevirirəm.",
    stat1: "İstifadəyə verilmiş sistem",
    stat2: "Flaqman platforma",
    stat3: "İllik təcrübə",
    flagshipLabel: "Seçilmiş",
    selected: "Seçilmiş Layihələr",
    selectedDesc: "{n} flaqman platforma — hər biri memarlıqdan canlıya qədər bütöv bir sistem.",
    reel: "Qurduğum digər hər şey",
    reelHint: "Sürüşdürməyə davam et →",
    view: "Layihəyə bax",
    gallery: "Ekranlar",
    back: "Geri",
    next: "Növbəti layihə",
    contactEyebrow: "Vizyon",
    contactA: "Mənim vizyonum: mürəkkəb problemləri",
    contactB: "sadə və miqyaslana bilən sistemlərə çevirmək.",
    contactLead: "Birlikdə inşa edək.",
    contactCta: "Mesaj göndər",
    placeholder: "Ekran görüntüsü tezliklə",
    problem: "Problem",
    solution: "Sistem",
    why: "Niyə vacibdir",
    flowLabel: "Problem ➔ Həll",
    problemBadge: "01 · Həll Olunan Problem",
    problemSubtitle: "Real dünya çətinliyi",
    solutionBadge: "02 · Memarlıq Həlli",
    solutionSubtitle: "Qurulan sistem",
    impactBadge: "03 · Konkret Dəyər",
    impactSubtitle: "İstehsalat və biznes təsiri",
  },
} as const;
