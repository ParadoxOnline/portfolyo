"use client";

import React, { useRef } from "react";
import { useLang } from "@/providers/LangProvider";
import {
  Briefcase,
  Rocket,
  Globe,
  Palette,
  Search,
  Code2,
  CheckCircle2,
  Layers,
} from "lucide-react";
import { LiveTypoText, useStageBuild } from "@/components/canvas/LiveBuilderSystem";
import {
  clamp01,
  getCloneAndRenameState,
  getTwoAxisBoxState,
} from "@/components/canvas/DevBuildPrimitives";

interface Chapter {
  scene: string;
  duration: string;
  durationUnit: string;
  role: string;
  context: string;
  summary: string;
  doLabel: string;
  does: { icon: typeof Rocket; title: string; text: string }[];
  valueLabel: string;
  value: string;
  toolsLabel: string;
  tools: string[];
  icon: typeof Rocket;
}

interface Content {
  kicker: string;
  title: string;
  typoTitle: string;
  lead: string;
  summary: { value: string; unit: string; text: string }[];
  chapters: Chapter[];
}

const CONTENT: Record<"tr" | "az" | "en", Content> = {
  tr: {
    kicker: "KISACA DENEYİMİM",
    title: "Kimim, ne yapabilirim?",
    typoTitle: "Kimim, sadece kod mu?",
    lead: "3 yıldır kendi web projelerimi geliştiriyorum, 6 aydır bir dijital ajansta çalışıyorum.",
    summary: [
      { value: "3+", unit: "YIL", text: "Kendi web projelerimi baştan sona geliştirdim" },
      { value: "6", unit: "AY", text: "Dijital ajansta müşteri projelerinde çalıştım" },
      { value: "4", unit: "ALAN", text: "Web geliştirme · WordPress · SEO · Görsel tasarım" },
    ],
    chapters: [
      {
        scene: "BÖLÜM 1",
        duration: "3+",
        durationUnit: "YIL",
        role: "Bağımsız Web Geliştirici",
        context: "Projelerim",
        summary:
          "Fikirden yayına kadar tüm süreci tek başıma yürüttüm: tasarım, kodlama, SEO ve yayına alma. Bu sitedeki projeler bu dönemin ürünleridir.",
        doLabel: "NELER YAPTIM",
        does: [
          { icon: Code2, title: "Web siteleri ve uygulamalar", text: "Next.js, React ve TypeScript ile hızlı, modern siteler yaptım." },
          { icon: Layers, title: "Otomasyon", text: "Tekrarlayan işleri otomatikleştiren araçlar ve veri toplama sistemleri kurdum." },
          { icon: Search, title: "SEO ve performans", text: "Sitelerin Google'da bulunmasını ve hızlı açılmasını sağladım." },
        ],
        valueLabel: "SİZE KATKISI",
        value: "Bir işi tek başıma sahiplenip bitirebilirim; ekibe geldiğimde sıfırdan öğretmeniz gerekmez.",
        toolsLabel: "KULLANDIĞIM ARAÇLAR",
        tools: ["Next.js", "React", "TypeScript", "Node.js", "Python", "PostgreSQL"],
        icon: Rocket,
      },
      {
        scene: "BÖLÜM 2",
        duration: "6",
        durationUnit: "AY",
        role: "Ajans Deneyimi",
        context: "Ajans · Takım çalışması",
        summary:
          "Gerçek müşteriler ve gerçek teslim tarihleriyle çalıştım. Ajansın web, sosyal medya ve SEO işlerinde görev aldım.",
        doLabel: "NELER YAPTIM",
        does: [
          {
            icon: Globe,
            title: "18+ Kurumsal WordPress & Elementor Sitesi",
            text: "B2B sanayi, sağlık ve yerel işletmeler için 18+ web sitesinin sıfırdan kurulumu, özel Elementor şablonları ve teslimatı (Ajans gizlilik protokolü gereği canlı site bağlantıları mülakat aşamasında sunulabilir).",
          },
          {
            icon: Search,
            title: "Lokal SEO & Core Web Vitals Hız Optimizasyonu",
            text: "Yerel Google aramalarında 1. sıraya çıkaran On-Page SEO, Schema yapıları ve LiteSpeed Cache ile 1.5 sn altı sayfa açılış performansı.",
          },
          {
            icon: Palette,
            title: "Revizyon & Müşteri Teslim Süreçleri",
            text: "Sıkı teslim takvimleri altında müşteri revizyonlarının ve içerik entegrasyonlarının eksiksiz yönetimi.",
          },
        ],
        valueLabel: "SİZE KATKISI",
        value: "İlk günden bağımsız olarak WordPress sitelerini teslim edebilir, hız ve SEO optimizasyonlarını eksiksiz yönetebilirim.",
        toolsLabel: "KULLANDIĞIM ARAÇLAR",
        tools: ["WordPress", "Elementor Pro", "WooCommerce", "Lokal SEO", "LiteSpeed Cache", "Search Console"],
        icon: Briefcase,
      },
    ],
  },
  az: {
    kicker: "QISACA TƏCRÜBƏM",
    title: "Kiməm, nələr edə bilərəm?",
    typoTitle: "Kiməm, yalnız kodmu?",
    lead: "3 ildir öz veb layihələrimi hazırlayıram, 6 aydır rəqəmsal agentlikdə çalışıram.",
    summary: [
      { value: "3+", unit: "İL", text: "Öz veb layihələrimi başdan-başa hazırlamışam" },
      { value: "6", unit: "AY", text: "Rəqəmsal agentlikdə müştəri layihələrində işləmişəm" },
      { value: "4", unit: "SAHƏ", text: "Veb tərtibatı · WordPress · SEO · Qrafik dizayn" },
    ],
    chapters: [
      {
        scene: "BÖLMƏ 1",
        duration: "3+",
        durationUnit: "İL",
        role: "Müstəqil Veb Tərtibatçı",
        context: "Layihələrim",
        summary:
          "Fikirdən yayıma qədər bütün prosesi təkbaşına idarə etdim: dizayn, kodlaşdırma, SEO və yerləşdirmə. Bu saytdakı layihələr bu dövrün məhsullarıdır.",
        doLabel: "NƏLƏR ETMİŞƏM",
        does: [
          { icon: Code2, title: "Veb saytlar və tətbiqlər", text: "Next.js, React və TypeScript ilə sürətli, müasir saytlar qurdum." },
          { icon: Layers, title: "Avtomatlaşdırma", text: "Təkrarlanan işləri avtomatlaşdıran alətlər və məlumat toplama sistemləri yaratdım." },
          { icon: Search, title: "SEO və performans", text: "Saytların Google-da tapılmasını və sürətli yüklənməsini təmin etdim." },
        ],
        valueLabel: "SİZƏ XEYRİ",
        value: "İşi təkbaşına öhdəmə götürüb tamamlaya bilirəm; komandaya qoşulduqda sıfırdan öyrətməyə ehtiyac qalmır.",
        toolsLabel: "İSTİFADƏ ETDİYİM ALƏTLƏR",
        tools: ["Next.js", "React", "TypeScript", "Node.js", "Python", "PostgreSQL"],
        icon: Rocket,
      },
      {
        scene: "BÖLMƏ 2",
        duration: "6",
        durationUnit: "AY",
        role: "Agentlik Təcrübəsi",
        context: "Agentlik · Komanda işi",
        summary:
          "Həqiqi müştərilər və real təhvil tarixləri ilə işlədim. Agentliyin veb, sosial media və SEO layihələrində vəzifə aldım.",
        doLabel: "NƏLƏR ETMİŞƏM",
        does: [
          {
            icon: Globe,
            title: "18+ Korporativ WordPress & Elementor Saytı",
            text: "B2B sənaye, səhiyyə və xidmət şirkətləri üçün 18+ saytın sıfırdan qurulması, xüsusi Elementor şablonları və təhvili (Agentlik məxfilik protokolu səbəbilə canlı keçidlər müsahibə zamanı təqdim edilə bilər).",
          },
          {
            icon: Search,
            title: "Lokal SEO & Core Web Vitals Sürət Optimizasiyası",
            text: "Yerli axtarışlarda 1-ci sıraya çıxaran On-Page SEO, Schema strukturu və LiteSpeed Cache ilə sürətli açılış performansı.",
          },
          {
            icon: Palette,
            title: "Reviziya & Müştəri Təhvil Prosesləri",
            text: "Dəqiq təhvil tarixləri altında müştəri tələblərinin tam və vaxtında yerinə yetirilməsi.",
          },
        ],
        valueLabel: "SİZƏ XEYRİ",
        value: "İlk gündən sərbəst şəkildə WordPress layihələrini təhvil verə, sürət və SEO optimizasiyalarını idarə edə bilərəm.",
        toolsLabel: "İSTİFADƏ ETDİYİM ALƏTLƏR",
        tools: ["WordPress", "Elementor Pro", "WooCommerce", "Lokal SEO", "LiteSpeed Cache", "Search Console"],
        icon: Briefcase,
      },
    ],
  },
  en: {
    kicker: "MY EXPERIENCE AT A GLANCE",
    title: "Who am I, what can I do?",
    typoTitle: "Who am I, just coding?",
    lead: "I've been building my own web projects for 3 years, and spent 6 months doing client work at a digital agency.",
    summary: [
      { value: "3+", unit: "YEARS", text: "Built my own web projects end to end" },
      { value: "6", unit: "MONTHS", text: "Worked on client projects at a digital agency" },
      { value: "4", unit: "SKILLS", text: "Web development · WordPress · SEO · Visual design" },
    ],
    chapters: [
      {
        scene: "CHAPTER 1",
        duration: "3+",
        durationUnit: "YEARS",
        role: "Independent Web Developer",
        context: "My projects",
        summary:
          "I ran the whole process alone, from idea to launch: design, coding, SEO and deployment. The projects on this site come from this period.",
        doLabel: "WHAT I DID",
        does: [
          { icon: Code2, title: "Websites and apps", text: "Built fast, modern sites with Next.js, React and TypeScript." },
          { icon: Layers, title: "Automation", text: "Built tools and data collection systems that automate repetitive work." },
          { icon: Search, title: "SEO and performance", text: "Made sites easy to find on Google and quick to load." },
        ],
        valueLabel: "WHAT IT MEANS FOR YOU",
        value: "I can own a task and finish it alone, so you won't need to teach me from scratch.",
        toolsLabel: "TOOLS I USE",
        tools: ["Next.js", "React", "TypeScript", "Node.js", "Python", "PostgreSQL"],
        icon: Rocket,
      },
      {
        scene: "CHAPTER 2",
        duration: "6",
        durationUnit: "MONTHS",
        role: "Agency Experience",
        context: "Agency · Team work",
        summary:
          "I worked with real clients and real deadlines, covering the agency's web, social media and SEO work.",
        doLabel: "WHAT I DID",
        does: [
          {
            icon: Globe,
            title: "18+ Corporate WordPress & Elementor Sites",
            text: "End-to-end setup, custom Elementor templates, and client delivery for 18+ B2B, healthcare, and local businesses (Direct URLs kept confidential per agency NDA, live demos available upon request in interviews).",
          },
          {
            icon: Search,
            title: "Local SEO & Core Web Vitals Speed Tuning",
            text: "On-Page SEO, Schema.org microdata, and LiteSpeed Cache tuning achieving sub-1.5s load times and top local ranking.",
          },
          {
            icon: Palette,
            title: "Client Delivery & Revision Cycles",
            text: "Autonomous management of content integration, revision requests, and strict deadline deliverables.",
          },
        ],
        valueLabel: "WHAT IT MEANS FOR YOU",
        value: "Immediate, standalone delivery on agency WordPress sites with zero training required.",
        toolsLabel: "TOOLS I USE",
        tools: ["WordPress", "Elementor Pro", "WooCommerce", "Local SEO", "LiteSpeed Cache", "Search Console"],
        icon: Briefcase,
      },
    ],
  },
};

export default function Career() {
  const { lang } = useLang();
  const data = CONTENT[lang] ?? CONTENT.tr;
  const sectionRef = useRef<HTMLElement>(null);

  const { progress, activeColor } = useStageBuild("career-stage", "#38bdf8");

  // 0'dan Profesyonel Yazılımcı İnşa Fazları
  const phase1 = clamp01((progress - 0.13) / 0.15);
  const phase2 = clamp01((progress - 0.25) / 0.08);
  const phase3 = clamp01((progress - 0.48) / 0.18);
  const descBox = getTwoAxisBoxState(phase3, 680, 72);
  const phase4 = clamp01((progress - 0.64) / 0.20);
  const phase5 = clamp01((progress - 0.82) / 0.15);

  const leadChars = Math.floor(
    data.lead.length * clamp01((phase3 - 0.25) / 0.75)
  );

  return (
    <section
      ref={sectionRef}
      id="career"
      data-build-stage="career-stage"
      className="relative mx-auto w-full max-w-[1580px] overflow-hidden px-6 py-28 md:px-12 md:py-36"
    >
      <div
        className="pointer-events-none absolute -left-[15vmin] top-1/3 h-[70vmin] w-[70vmin] rounded-full blur-[150px] transition-opacity duration-500"
        style={{ backgroundColor: `${activeColor}1a`, opacity: phase1 }}
        aria-hidden
      />

      {/* GÖREV 1: Üst Başlık & Çizgi */}
      <div
        data-build-role="grid"
        className="flex items-center gap-3 border-t border-white/10 pt-10 font-mono text-xs uppercase tracking-[0.28em] text-sky-300"
        style={{
          opacity: phase1,
          transform: `translate3d(0, ${(1 - phase1) * 14}px, 0)`,
        }}
      >
        <span
          data-build-role="color"
          className="h-2.5 w-2.5 rounded-full transition-colors duration-700"
          style={{ backgroundColor: activeColor, boxShadow: `0 0 12px ${activeColor}` }}
        />
        {data.kicker}
      </div>

      {/* GÖREV 2: Ana Başlık */}
      <div
        data-build-role="title"
        className="mt-5 min-h-[1.2em]"
        style={{ opacity: phase2 }}
      >
        <h2 className="font-display text-[clamp(2.6rem,6vw,5.4rem)] font-bold leading-[1] tracking-[-0.03em] text-white">
          <LiveTypoText text={data.title} typoText={data.typoTitle} progress={progress} />
        </h2>
      </div>

      {/* GÖREV 3: Açıklama Metni (Önce Yatay ↔ Sonra Dikey ↕ Açılır) */}
      <div
        data-build-role="desc"
        className="relative mt-6 min-h-[2.4em] max-w-2xl"
        style={{ opacity: descBox.visible ? 1 : 0 }}
      >
        {descBox.isWireframe && (
          <div
            className="pointer-events-none absolute left-0 top-0 z-20 rounded-lg border border-dashed border-sky-400/60 bg-sky-400/[0.05]"
            style={{
              width: `${descBox.widthPct}%`,
              height: `${descBox.heightPct}%`,
            }}
          />
        )}
        <p className="text-lg leading-[1.7] text-slate-300/75 md:text-xl">
          {data.lead.slice(0, Math.max(0, leadChars))}
        </p>
      </div>

      {/* GÖREV 4: 3'lü Metrik Kartları (1. Kart Oluşturulur -> Yan Yana 3'e Çoğaltılır -> Rakam ve Metinleri Tek Tek Değiştirilir!) */}
      <div
        data-build-role="media"
        data-stage-cards="true"
        className="relative mt-14 grid gap-6 md:grid-cols-3"
        style={{ opacity: phase4 > 0.01 ? 1 : 0 }}
      >
        {data.summary.map((s, i) => {
          const st = getCloneAndRenameState(
            phase4,
            i,
            data.summary.length,
            s.text,
            data.summary[0].text,
            320
          );
          const displayVal = st.isCloning ? data.summary[0].value : s.value;
          const displayUnit = st.isCloning ? data.summary[0].unit : s.unit;

          return (
            <div
              key={s.unit}
              className={`relative rounded-2xl border p-7 backdrop-blur-xl transition-colors duration-200 ${st.isRenaming
                  ? "border-sky-400 bg-sky-500/15 ring-2 ring-sky-400/50"
                  : st.isCloning
                    ? "border-dashed border-sky-300/70 bg-sky-400/10"
                    : "border-white/10 bg-white/[0.03]"
                }`}
              style={{
                opacity: st.opacity,
                transform: `translate3d(${st.offsetX.toFixed(1)}px, ${st.offsetY.toFixed(1)}px, 0) scale(${st.scale})`,
              }}
            >
              {st.badgeText && (
                <span className="pointer-events-none absolute -top-3 right-4 rounded bg-sky-400 px-2 py-0.5 font-mono text-[10px] font-bold text-slate-950 shadow">
                  {st.badgeText}
                </span>
              )}
              <div className="flex items-baseline gap-3">
                <span className="font-display text-6xl font-bold tracking-tight text-white">
                  {displayVal}
                </span>
                <span
                  className="font-mono text-xs font-semibold tracking-[0.25em]"
                  style={{ color: activeColor }}
                >
                  {displayUnit}
                </span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-slate-300/70">
                {st.displayText}
              </p>
            </div>
          );
        })}
      </div>

      {/* GÖREV 5: Deneyim Bölüm Kartları (İç 3'lü Yetenek Kutuları ve Araç Etiketleri Çoğaltılarak İsimlendirilir) */}
      <div
        className="mt-16 flex flex-col gap-10"
        style={{
          opacity: phase5 > 0.01 ? 1 : 0,
          transform: `translate3d(0, ${(1 - phase5) * 18}px, 0)`,
        }}
      >
        {data.chapters.map((c, idx) => {
          const Icon = c.icon;
          return (
            <article
              key={c.scene}
              data-build-role={idx === 0 ? "badges" : "cta"}
              className="rounded-3xl border border-white/12 bg-[#070b14]/85 p-7 shadow-[0_30px_90px_-20px_rgba(0,0,0,0.85)] backdrop-blur-xl md:p-10"
            >
              <div className="flex flex-col gap-5 border-b border-white/10 pb-6 md:flex-row md:items-end md:justify-between">
                <div className="flex items-start gap-4">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-sky-400/30 bg-sky-400/10 text-sky-300">
                    <Icon size={20} />
                  </span>
                  <div>
                    <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-sky-300/80">
                      {c.context}
                    </span>
                    <h3 className="mt-1.5 font-display text-2xl font-bold tracking-tight text-white md:text-4xl">
                      {c.role}
                    </h3>
                  </div>
                </div>
                <div className="inline-flex items-baseline gap-2 rounded-2xl border border-white/12 bg-white/[0.04] px-5 py-3">
                  <span className="font-display text-4xl font-bold text-white">{c.duration}</span>
                  <span className="font-mono text-xs tracking-[0.25em] text-sky-300">
                    {c.durationUnit}
                  </span>
                </div>
              </div>

              <p className="mt-6 max-w-3xl text-base leading-relaxed text-slate-200/85 md:text-lg">
                {c.summary}
              </p>

              <span className="mt-8 block font-mono text-[11px] uppercase tracking-[0.28em] text-white/40">
                {c.doLabel}
              </span>
              <div className="mt-4 grid gap-4 md:grid-cols-3">
                {c.does.map((d, di) => {
                  const DIcon = d.icon;
                  const subState = getCloneAndRenameState(
                    phase5,
                    di,
                    c.does.length,
                    d.title,
                    c.does[0].title,
                    220
                  );
                  return (
                    <div
                      key={d.title}
                      className={`rounded-2xl border p-5 transition ${subState.isRenaming
                          ? "border-sky-400 bg-sky-500/15"
                          : subState.isCloning
                            ? "border-dashed border-sky-400/50 bg-sky-400/[0.06]"
                            : "border-white/10 bg-white/[0.025] hover:border-sky-400/35 hover:bg-white/[0.04]"
                        }`}
                      style={{
                        opacity: subState.opacity,
                        transform: `translate3d(${subState.offsetX.toFixed(1)}px, 0, 0)`,
                      }}
                    >
                      <span className="grid h-10 w-10 place-items-center rounded-xl border border-sky-400/25 bg-sky-400/10 text-sky-300">
                        <DIcon size={18} />
                      </span>
                      <h4 className="mt-4 font-display text-lg font-semibold text-white">
                        {subState.displayText}
                      </h4>
                      <p className="mt-2 text-sm leading-relaxed text-slate-300/65">{d.text}</p>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 flex items-start gap-3 rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.05] p-5">
                <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-emerald-300" />
                <div>
                  <span className="block font-mono text-[10px] uppercase tracking-[0.28em] text-emerald-200/75">
                    {c.valueLabel}
                  </span>
                  <p className="mt-1 font-medium text-white/90">{c.value}</p>
                </div>
              </div>

              <div
                data-build-role={idx === 1 ? "qa" : undefined}
                className="mt-6 flex flex-wrap items-center gap-2"
              >
                <span className="mr-2 font-mono text-[10px] uppercase tracking-[0.28em] text-white/40">
                  {c.toolsLabel}
                </span>
                {c.tools.map((tool, ti) => {
                  const tState = getCloneAndRenameState(
                    phase5,
                    ti,
                    c.tools.length,
                    tool,
                    c.tools[0],
                    70
                  );
                  return (
                    <span
                      key={tool}
                      className={`rounded-full border px-3.5 py-1 font-mono text-xs ${tState.isRenaming
                          ? "border-sky-400 bg-sky-400/25 text-white"
                          : "border-white/10 bg-white/[0.04] text-white/80"
                        }`}
                      style={{
                        opacity: tState.opacity,
                        transform: `translateX(${tState.offsetX.toFixed(1)}px)`,
                      }}
                    >
                      {tState.displayText}
                    </span>
                  );
                })}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
