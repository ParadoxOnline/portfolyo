"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/providers/LangProvider";
import { Cpu, Database, Network, ShieldCheck, ArrowRight, Zap, Terminal } from "lucide-react";

interface LayerData {
  id: string;
  number: string;
  tag: string;
  title: string;
  subtitle: string;
  desc: string;
  icon: typeof Cpu;
  metrics: { label: string; value: string }[];
  stack: string[];
  flow: string[];
}

const LAYERS: Record<"tr" | "az" | "en", LayerData[]> = {
  tr: [
    {
      id: "architecture",
      number: "01",
      tag: "TEMEL MİMARİ",
      title: "Clean Architecture & Core Engine",
      subtitle: "Yazılım mimarisi bir tercih değil, sürdürülebilirlik garantisidir.",
      desc: "İş mantığını dış dünyadan (veritabanı, UI, 3. parti API'lar) izole eden 4 katmanlı Domain mimarisi. Değişen gereksinimlerde sıfır kırılma, yüksek test edilebilirlik ve modüler mikroservis yapısı.",
      icon: Cpu,
      metrics: [
        { label: "MİMARİ YAPISI", value: "4-Layer Clean Arch" },
        { label: "BAĞIMLILIK YÖNÜ", value: "İçe Doğru (Domain Core)" },
        { label: "KOD MODÜLERLİĞİ", value: "%100 Bağımsız Katmanlar" },
      ],
      stack: [".NET Core", "TypeScript", "Clean Architecture", "PostgreSQL", "Prisma"],
      flow: ["Domain Entities", "Use Cases / MediatR", "Infrastructure Adapters", "REST / gRPC Endpoints"],
    },
    {
      id: "ingestion",
      number: "02",
      tag: "VERİ & OTOMASYON",
      title: "Asenkron Kuyruklar & RPA Motoru",
      subtitle: "Gözetimsiz çalışan, yüksek hacimli veri toplama ve işleme hatları.",
      desc: "Tarayıcı otomasyonu (Playwright anti-detection), Redis/BullMQ tabanlı dağıtık iş kuyrukları ve hız limiti aşımını engelleyen akıllı retry algoritmalarıyla kesintisiz çalışan arka plan motorları.",
      icon: Network,
      metrics: [
        { label: "KUYRUK YÖNETİMİ", value: "BullMQ + Redis" },
        { label: "HATA TOLERANSI", value: "Exponential Backoff" },
        { label: "BOT ATLATMA", value: "Stealth Headless" },
      ],
      stack: ["Python", "FastAPI", "Playwright", "Redis", "BullMQ", "Celery"],
      flow: ["Trigger / Webhook", "Distributed Job Queue", "Anti-Detect Scraping", "Structured Data Sink"],
    },
    {
      id: "ai-seo",
      number: "03",
      tag: "YAPAY ZEKA & SEO",
      title: "Özerk SEO & Semantik İndeksleme",
      subtitle: "Arama motoru görünürlüğünü bir yazılım altyapısı olarak ölçeklendirmek.",
      desc: "Vektör veritabanları (Qdrant) ile semantik benzerlik tespiti, otomatik kanibalizasyon önleme, dinamik iç link optimizasyonu ve Google Search Console & Indexing API üzerinden otonom yayın akışı.",
      icon: Zap,
      metrics: [
        { label: "İNDEKS AKIŞI", value: "Otonom Google API" },
        { label: "VEKTÖR ARAMA", value: "Qdrant Embeddings" },
        { label: "İÇERİK VERİSİ", value: "Programatik Graph" },
      ],
      stack: ["Google Indexing API", "OpenAI / Claude", "Qdrant", "Turborepo", "Next.js ISR"],
      flow: ["Data Graph Extraction", "Semantic Clustering", "Programmatic Page Gen", "Instant Indexing Ping"],
    },
    {
      id: "client-edge",
      number: "04",
      tag: "İSTEMCİ & DAĞITIM",
      title: "Performans & Multi-Platform İstemciler",
      subtitle: "Kullanıcının dokunduğu her pikselde mikrosaniye seviyesinde tepki.",
      desc: "Next.js App Router ile Server Components ve Streaming SSR, mobilde React Native & Expo mimarisi, masaüstünde SQLite ile offline-first çalışan Electron çözümleri.",
      icon: Database,
      metrics: [
        { label: "CORE WEB VITALS", value: "95+ Skor Odaklı" },
        { label: "OFFLINE DESTEĞİ", value: "Lokal SQLite Senkronu" },
        { label: "PLATFORMLAR", value: "Web · iOS · Android · Desktop" },
      ],
      stack: ["Next.js (App Router)", "React Native", "Expo", "Electron", "Tailwind CSS"],
      flow: ["Edge SSR Streaming", "Optimistic State Updates", "Local SQLite Cache", "Smooth 60FPS UI"],
    },
  ],
  en: [
    {
      id: "architecture",
      number: "01",
      tag: "CORE ARCHITECTURE",
      title: "Clean Architecture & Core Engine",
      subtitle: "Software architecture is not an option; it's a sustainability guarantee.",
      desc: "A 4-layer Domain architecture isolating core business logic from external drivers (databases, UIs, 3rd party APIs). Zero breakage under changing requirements, high testability, and modular design.",
      icon: Cpu,
      metrics: [
        { label: "ARCHITECTURE", value: "4-Layer Clean Arch" },
        { label: "DEPENDENCY FLOW", value: "Inward (Domain Core)" },
        { label: "MODULARITY", value: "100% Decoupled Layers" },
      ],
      stack: [".NET Core", "TypeScript", "Clean Architecture", "PostgreSQL", "Prisma"],
      flow: ["Domain Entities", "Use Cases / MediatR", "Infrastructure Adapters", "REST / gRPC Endpoints"],
    },
    {
      id: "ingestion",
      number: "02",
      tag: "DATA & RPA",
      title: "Async Queues & Resilient RPA",
      subtitle: "Unsupervised, high-volume data harvesting and ingestion pipelines.",
      desc: "Headless browser automation with stealth anti-detection, Redis/BullMQ distributed worker queues, and exponential backoff retry algorithms for reliable continuous operation.",
      icon: Network,
      metrics: [
        { label: "QUEUE ENGINE", value: "BullMQ + Redis" },
        { label: "FAULT TOLERANCE", value: "Exponential Backoff" },
        { label: "ANTI-DETECTION", value: "Stealth Headless" },
      ],
      stack: ["Python", "FastAPI", "Playwright", "Redis", "BullMQ", "Celery"],
      flow: ["Trigger / Webhook", "Distributed Job Queue", "Anti-Detect Scraping", "Structured Data Sink"],
    },
    {
      id: "ai-seo",
      number: "03",
      tag: "AI & SEO",
      title: "Autonomous SEO & Semantic Indexing",
      subtitle: "Treating search visibility as a software engineering and data problem.",
      desc: "Semantic clustering via vector search (Qdrant), automated keyword cannibalization detection, dynamic internal link optimization, and hands-free publishing via Google Indexing APIs.",
      icon: Zap,
      metrics: [
        { label: "INDEXING SPEED", value: "Autonomous Google API" },
        { label: "VECTOR ENGINE", value: "Qdrant Embeddings" },
        { label: "PAGE TOPOLOGY", value: "Programmatic Graph" },
      ],
      stack: ["Google Indexing API", "OpenAI / Claude", "Qdrant", "Turborepo", "Next.js ISR"],
      flow: ["Data Graph Extraction", "Semantic Clustering", "Programmatic Page Gen", "Instant Indexing Ping"],
    },
    {
      id: "client-edge",
      number: "04",
      tag: "CLIENT & RUNTIME",
      title: "Edge Performance & Multi-Platform",
      subtitle: "Microsecond responsiveness across web, mobile, and desktop runtimes.",
      desc: "Next.js App Router with React Server Components, mobile apps built with React Native & Expo, and offline-first desktop tools running SQLite and Electron.",
      icon: Database,
      metrics: [
        { label: "CORE WEB VITALS", value: "95+ Focused" },
        { label: "OFFLINE CAPABILITY", value: "Local SQLite Sync" },
        { label: "TARGET RUNTIMES", value: "Web · iOS · Android · Desktop" },
      ],
      stack: ["Next.js (App Router)", "React Native", "Expo", "Electron", "Tailwind CSS"],
      flow: ["Edge SSR Streaming", "Optimistic State Updates", "Local SQLite Cache", "Smooth 60FPS UI"],
    },
  ],
  az: [
    {
      id: "architecture",
      number: "01",
      tag: "ƏSAS MEMARLIQ",
      title: "Clean Architecture & Core Engine",
      subtitle: "Proqram təminatı memarlığı seçim deyil, dayanıqlılıq zəmanətidir.",
      desc: "Biznes məntiqini xarici dünyadan (verilənlər bazası, UI, 3-cü tərəf API-lar) təcrid edən 4 qatlı Domain memarlığı.",
      icon: Cpu,
      metrics: [
        { label: "MEMARLIQ STRUKTURU", value: "4-Layer Clean Arch" },
        { label: "ASILILIQ İSTİQAMƏTİ", value: "Daxilə Doğru (Domain Core)" },
        { label: "MODULLUQ", value: "100% Müstəqil Qatlar" },
      ],
      stack: [".NET Core", "TypeScript", "Clean Architecture", "PostgreSQL", "Prisma"],
      flow: ["Domain Entities", "Use Cases / MediatR", "Infrastructure Adapters", "REST / gRPC Endpoints"],
    },
    {
      id: "ingestion",
      number: "02",
      tag: "MƏLUMAT VƏ AVTOMATLAŞDIRMA",
      title: "Asinxron Növbələr & RPA Mühərriki",
      subtitle: "Nəzarətsiz işləyən yüksək həcmli məlumat toplama və emal xətləri.",
      desc: "Brauzer avtomatlaşdırması (Playwright anti-detection), Redis/BullMQ əsaslı paylanmış növbələr və dayanıqlı arxa plan işçiləri.",
      icon: Network,
      metrics: [
        { label: "NÖVBƏ İDARƏETMƏSİ", value: "BullMQ + Redis" },
        { label: "XƏTA DÖZÜMLÜLÜYÜ", value: "Exponential Backoff" },
        { label: "BOT AŞMA", value: "Stealth Headless" },
      ],
      stack: ["Python", "FastAPI", "Playwright", "BullMQ", "Redis", "Celery"],
      flow: ["Multi-Source Ingestion", "Stealth Scraping", "BullMQ Job Queues", "Persistent DB Storage"],
    },
    {
      id: "intelligence",
      number: "03",
      tag: "SEMANTİK ZƏKA & VEKTOR",
      title: "Qdrant Vector Engine & Event Hub",
      subtitle: "Sadəcə məlumat saxlamaq deyil; mənanı dərk edib qruplaşdırmaq.",
      desc: "Strukturlaşdırılmamış müştəri şikayətlərini və məlumat axınlarını Qdrant ilə vektorlaşdıran, Kafka ilə asinxron paylayan intellektual boru xətti.",
      icon: ShieldCheck,
      metrics: [
        { label: "VEKTOR BAZASI", value: "Qdrant Cosine Sim" },
        { label: "HADİSƏ AXINI", value: "Kafka / Redpanda" },
        { label: "AI İNTEQRASİYASI", value: "Gemini & OpenRouter" },
      ],
      stack: ["Qdrant", "Redpanda (Kafka)", "OpenRouter API", "Embeddings", "Docker"],
      flow: ["Raw Signal Intake", "AI 6D Scoring", "Vector Embedding Generation", "Opportunity Clustered"],
    },
    {
      id: "runtime",
      number: "04",
      tag: "MÜŞTƏRİ & İCRA MÜHİTİ",
      title: "Edge Performance & Multi-Platform",
      subtitle: "Veb, mobil və masaüstü mühitlərində mikrosaniyəlik cavab müddəti.",
      desc: "Next.js App Router, React Native & Expo ilə mobil tətbiqlər və Electron + SQLite ilə oflayn masaüstü proqram təminatları.",
      icon: Database,
      metrics: [
        { label: "CORE WEB VITALS", value: "95+ Focused" },
        { label: "OFLAYN İMKAN", value: "Local SQLite Sync" },
        { label: "HƏDƏF MÜHİTLƏR", value: "Web · iOS · Android · Desktop" },
      ],
      stack: ["Next.js (App Router)", "React Native", "Expo", "Electron", "Tailwind CSS"],
      flow: ["Edge SSR Streaming", "Optimistic State Updates", "Local SQLite Cache", "Smooth 60FPS UI"],
    },
  ],
};

export default function SystemBlueprint() {
  const { lang } = useLang();
  const layers = LAYERS[lang];
  const [activeTab, setActiveTab] = useState(0);
  const active = layers[activeTab];

  return (
    <section id="blueprint" className="relative border-b border-white/10 px-6 py-28 md:px-12 overflow-hidden">
      <div className="aurora pointer-events-none absolute -right-[20vmin] top-1/4 h-[70vmin] w-[70vmin] opacity-40" aria-hidden />
      <div className="relative mx-auto max-w-[1500px]">
      {/* Header Info */}
      <div className="mb-14 flex flex-col gap-4 border-b border-white/10 pb-8 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.35em] text-sky-200/80">
            <span className="h-2 w-2 rounded-full bg-sky-300 animate-pulse" />
            <span>{lang === "tr" ? "SİSTEM ALTYAPI KATMANLARI" : "PRODUCTION SYSTEM BLUEPRINT"}</span>
            <span className="text-white/30">//</span>
            <span className="text-white/50">{lang === "tr" ? "MİMARİ METODOLOJİ" : "ARCHITECTURAL MATRIX"}</span>
          </div>
          <h3 className="mt-4 font-display text-[clamp(2.2rem,5vw,4.5rem)] font-bold tracking-tighter text-white">
            {lang === "tr" ? "Nasıl Bir Mimari Kuruyorum?" : "The Engineering Anatomy"}
          </h3>
        </div>
        <p className="max-w-md font-mono text-xs uppercase leading-relaxed text-white/50">
          {lang === "tr"
            ? "Her proje rastgele kod parçalarıyla değil, net sınırları olan 4 ana mühendislik katmanıyla inşa edilir."
            : "Every solution is engineered across 4 decoupled, resilient layers engineered for high-availability production."}
        </p>
      </div>

      {/* Blueprint Container */}
      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        {/* Layer Selector Tabs */}
        <div className="flex flex-col gap-3">
          {layers.map((layer, index) => {
            const isSelected = activeTab === index;
            const Icon = layer.icon;
            return (
              <button
                key={layer.id}
                onClick={() => setActiveTab(index)}
                className={`group relative flex items-start gap-4 rounded-xl border p-5 text-left transition-all duration-300 ${
                  isSelected
                    ? "border-sky-300/50 bg-[#07131e]/90 shadow-[0_0_30px_-5px_rgba(56,189,248,0.25)]"
                    : "border-white/10 bg-[#04080e]/60 hover:border-white/25 hover:bg-[#070e17]/80"
                }`}
              >
                {/* Active side indicator */}
                {isSelected && (
                  <motion.div
                    layoutId="blueprint-active-indicator"
                    className="absolute inset-y-0 -left-[1px] w-[3px] rounded-l bg-sky-300 shadow-[0_0_10px_#38bdf8]"
                  />
                )}

                <div
                  className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg border transition-colors ${
                    isSelected
                      ? "border-sky-300/60 bg-sky-400/10 text-sky-200"
                      : "border-white/10 bg-white/[0.02] text-white/40 group-hover:text-white/70"
                  }`}
                >
                  <Icon size={18} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-sky-200/60">
                      {layer.number} // {layer.tag}
                    </span>
                    {isSelected && (
                      <span className="h-1.5 w-1.5 rounded-full bg-sky-300 shadow-[0_0_6px_#38bdf8]" />
                    )}
                  </div>
                  <h4 className="mt-1 font-display text-base font-semibold tracking-tight text-white/90">
                    {layer.title}
                  </h4>
                  <p className="mt-1 line-clamp-1 text-xs text-white/50">{layer.subtitle}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Blueprint Details View */}
        <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-[#050b12]/90 p-8 md:p-10 shadow-[0_20px_80px_-20px_rgba(2,6,23,0.8)] backdrop-blur-xl">
          {/* Subtle Grid Blueprint Watermark */}
          <div
            className="pointer-events-none absolute inset-0 opacity-15"
            style={{
              backgroundImage: `linear-gradient(rgba(125,211,252,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(125,211,252,0.2) 1px, transparent 1px)`,
              backgroundSize: "32px 32px",
            }}
          />

          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="relative z-10 flex flex-col gap-8"
            >
              {/* Header inside Panel */}
              <div>
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="rounded bg-sky-400/10 px-2 py-0.5 font-mono text-xs font-semibold text-sky-200 border border-sky-400/20">
                      LAYER {active.number}
                    </span>
                    <span className="font-mono text-xs uppercase tracking-widest text-white/40">
                      {active.tag}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-[11px] text-sky-200/70">
                    <Terminal size={13} />
                    <span>STATUS: OPERATIONAL</span>
                  </div>
                </div>

                <h3 className="mt-5 font-display text-2xl font-bold tracking-tight text-white md:text-3xl">
                  {active.title}
                </h3>
                <p className="mt-3 text-base leading-relaxed text-white/70 md:text-lg">
                  {active.desc}
                </p>
              </div>

              {/* Data Flow / Pipeline visualization */}
              <div className="rounded-xl border border-white/10 bg-[#03060a]/80 p-5">
                <span className="block font-mono text-[10px] uppercase tracking-[0.25em] text-white/40 mb-3">
                  {lang === "tr" ? "VERİ & İŞLEYİŞ AKIŞI" : "PIPELINE TOPOLOGY"}
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  {active.flow.map((node, i) => (
                    <React.Fragment key={node}>
                      <div className="flex items-center gap-2 rounded-lg border border-sky-200/20 bg-sky-400/[0.04] px-3 py-1.5 font-mono text-xs text-sky-100">
                        <span className="h-1.5 w-1.5 rounded-full bg-sky-300" />
                        {node}
                      </div>
                      {i < active.flow.length - 1 && (
                        <ArrowRight size={14} className="text-white/30" />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Metrics & Stack Grid */}
              <div className="grid gap-6 md:grid-cols-2">
                {/* Metrics */}
                <div className="flex flex-col gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-5">
                  <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">
                    {lang === "tr" ? "MİMARİ METRİKLERİ" : "ARCHITECTURE METRICS"}
                  </span>
                  <div className="flex flex-col gap-3 divide-y divide-white/5">
                    {active.metrics.map((m) => (
                      <div key={m.label} className="flex items-center justify-between pt-2 first:pt-0">
                        <span className="font-mono text-xs text-white/50">{m.label}</span>
                        <span className="font-mono text-xs font-semibold text-sky-200">{m.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tech Stack Chips */}
                <div className="flex flex-col gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-5">
                  <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">
                    {lang === "tr" ? "KULLANILAN TEKNOLOJİLER" : "TECHNOLOGY ARSENAL"}
                  </span>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {active.stack.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-mono text-[11px] text-white/80 transition hover:border-sky-300/40 hover:text-white"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  </section>
);
}
