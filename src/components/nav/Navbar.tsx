"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FileDown,
  FolderKanban,
  Sparkles,
  Activity,
  Radar,
  Briefcase,
  Mail,
  ChevronDown,
  Menu,
  X,
  ArrowRight,
  Boxes,
  Bot,
  ShieldCheck,
  Code2,
  Type,
  ImageIcon,
} from "lucide-react";
import { useLang } from "@/providers/LangProvider";
import { LangToggle } from "@/components/cine/Fx";
import { useStageBuild } from "@/components/canvas/LiveBuilderSystem";
import { clamp01, getCloneAndRenameState } from "@/components/canvas/DevBuildPrimitives";
import { SpecimenFrame, SPECIMENS } from "@/components/tools/ToolSpecimen";

interface SubItem {
  href: string;
  title: string;
  desc: string;
  badge?: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
}

export default function Navbar() {
  const { lang } = useLang();
  const pathname = usePathname();
  const { progress } = useStageBuild("hero-stage", "#3b82f6");

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoverHref, setHoverHref] = useState<string | null>(null);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navContainerRef = useRef<HTMLDivElement>(null);

  const isHome = pathname === "/";
  const [navBuilt, setNavBuilt] = useState(!isHome);

  useEffect(() => {
    if (!isHome || progress >= 0.28) {
      setNavBuilt(true);
    }
  }, [isHome, progress]);

  // Scroll takibi (Sticky Header arka plan derinliği & navbar kaybolmasını önleme)
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
      if (window.scrollY > 30) {
        setNavBuilt(true);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const phase1 = navBuilt || !isHome ? 1 : clamp01((progress - 0.13) / 0.15);

  // Çeviriler & Kategorilendirme
  const navContent = {
    tr: {
      template: "Menü_01",
      cvTitle: "Özgeçmiş İndir (PDF)",
      menu: "Menü",
      categories: {
        projects: {
          id: "projects",
          title: "Projeler",
          href: "/#work",
        },
        tools: {
          id: "tools",
          title: "Araçlar & Analiz",
          badge: "Laboratuvar",
          items: [
            {
              href: "/audit",
              title: "Canlı Röntgen",
              desc: "Gerçek Zamanlı Web Sitesi Hız, SEO ve Güvenlik Denetimi",
              badge: "Canlı Araç",
              icon: Activity,
            },
            {
              href: "/ai-radar",
              title: "AI Bot (GEO) Radarı",
              desc: "ChatGPT, Perplexity ve Claude robots.txt İzin Analizi",
              badge: "GEO",
              icon: Bot,
            },
            {
              href: "/dns-inspector",
              title: "DNS & E-Posta İtibarı",
              desc: "Canlı SPF, DMARC, MX ve Spam Koruması Denetimi",
              badge: "Güvenlik",
              icon: ShieldCheck,
            },
            {
              href: "/schema-builder",
              title: "Schema.org Üretici",
              desc: "Canlı Form ile Hatasız JSON-LD Zengin Sonuç Kodu",
              badge: "İnteraktif",
              icon: Code2,
            },
            {
              href: "/font-strategist",
              title: "Font & Preload Stratejisi",
              desc: "FOIT Önleme, Google Fonts Preconnect & Preload",
              badge: "FCP / INP",
              icon: Type,
            },
            {
              href: "/image-optimizer",
              title: "Görsel & WebP Stüdyosu",
              desc: "AVIF/WebP Potansiyeli & Tarayıcıda Toplu Dönüştürücü",
              badge: "Yerel & Hızlı",
              icon: ImageIcon,
            },
            {
              href: "/radar",
              title: "SEO Radarı",
              desc: "Canlı Karşılaştırma & Performans Takip Radarı",
              badge: "Gizlilik Korumalı",
              icon: Radar,
            },
            {
              href: "/plugins",
              title: "Eklentiler",
              desc: "Açık Kaynak Geliştirici Kütüphaneleri",
              badge: "Açık Kaynak",
              icon: Boxes,
            },
          ] as SubItem[],
        },
        career: {
          id: "career",
          title: "Deneyim",
          href: "/#career",
          desc: "Kariyer Geçmişi & Yetkinlikler",
          icon: Briefcase,
        },
        contact: {
          id: "contact",
          title: "İletişim",
          href: "/#contact",
          badge: "Aktif",
          desc: "Doğrudan İletişim",
          icon: Mail,
        },
      },
    },
    en: {
      template: "Menu_01",
      cvTitle: "Download CV (PDF)",
      menu: "Menu",
      categories: {
        projects: {
          id: "projects",
          title: "Projects",
          href: "/#work",
        },
        tools: {
          id: "tools",
          title: "Tools & Lab",
          badge: "Lab",
          items: [
            {
              href: "/audit",
              title: "Live Audit",
              desc: "Real-time PageSpeed, SEO and Security Analysis",
              badge: "Live Tool",
              icon: Activity,
            },
            {
              href: "/ai-radar",
              title: "AI Bot (GEO) Radar",
              desc: "ChatGPT, Perplexity & Claude robots.txt Permissions",
              badge: "GEO",
              icon: Bot,
            },
            {
              href: "/dns-inspector",
              title: "DNS & Email Health",
              desc: "Live SPF, DMARC, MX and Phishing Protection",
              badge: "Security",
              icon: ShieldCheck,
            },
            {
              href: "/schema-builder",
              title: "Schema.org Builder",
              desc: "Generate Valid JSON-LD Rich Snippets Live",
              badge: "Interactive",
              icon: Code2,
            },
            {
              href: "/font-strategist",
              title: "Font & Preload Strategy",
              desc: "FOIT Prevention & Google Fonts Optimization",
              badge: "FCP / INP",
              icon: Type,
            },
            {
              href: "/image-optimizer",
              title: "Image & WebP Studio",
              desc: "AVIF/WebP Potential & In-Browser Batch Converter",
              badge: "Fast & Private",
              icon: ImageIcon,
            },
            {
              href: "/radar",
              title: "SEO Radar",
              desc: "Live Domain Benchmarking & Comparison Radar",
              badge: "Privacy First",
              icon: Radar,
            },
            {
              href: "/plugins",
              title: "Plugins",
              desc: "Open Source Developer Libraries",
              badge: "Open Source",
              icon: Boxes,
            },
          ] as SubItem[],
        },
        career: {
          id: "career",
          title: "Experience",
          href: "/#career",
          desc: "Career Timeline & Skill Matrix",
          icon: Briefcase,
        },
        contact: {
          id: "contact",
          title: "Contact",
          href: "/#contact",
          badge: "Active",
          desc: "Get in touch directly",
          icon: Mail,
        },
      },
    },
    az: {
      template: "Menyu_01",
      cvTitle: "CV Yüklə (PDF)",
      menu: "Menyu",
      categories: {
        projects: {
          id: "projects",
          title: "Layihələr",
          href: "/#work",
        },
        tools: {
          id: "tools",
          title: "Alətlər & Analiz",
          badge: "Laboratoriya",
          items: [
            {
              href: "/audit",
              title: "Canlı Rentgen",
              desc: "Real Zamanlı Sayt Sürəti, SEO və Təhlükəsizlik Auditi",
              badge: "Canlı Alət",
              icon: Activity,
            },
            {
              href: "/ai-radar",
              title: "AI Bot (GEO) Radarı",
              desc: "ChatGPT, Perplexity və Claude robots.txt İcazələri",
              badge: "GEO",
              icon: Bot,
            },
            {
              href: "/dns-inspector",
              title: "DNS & E-Poçt Nüfuzu",
              desc: "Canlı SPF, DMARC, MX və Təhlükəsizlik Auditi",
              badge: "Təhlükəsizlik",
              icon: ShieldCheck,
            },
            {
              href: "/schema-builder",
              title: "Schema.org Qurucu",
              desc: "Canlı Forma ilə Xətasız JSON-LD Zəngin Nəticə Kodu",
              badge: "İnteraktiv",
              icon: Code2,
            },
            {
              href: "/font-strategist",
              title: "Şrift & Preload Strategiyası",
              desc: "FOIT Qarşısının Alınması & Google Fonts Preconnect",
              badge: "FCP / INP",
              icon: Type,
            },
            {
              href: "/image-optimizer",
              title: "Şəkil & WebP Studiyası",
              desc: "AVIF/WebP Qənaət Təhlili & Brauzerdə Toplu Dönüşüm",
              badge: "Sürətli & Məxfi",
              icon: ImageIcon,
            },
            {
              href: "/radar",
              title: "SEO Radarı",
              desc: "Canlı Kıyaslama və Performans Radarı",
              badge: "Məxfilik Təminatlı",
              icon: Radar,
            },
            {
              href: "/plugins",
              title: "Əlavələr",
              desc: "Açıq Mənbə Proqramlaşdırma Kitabxanaları",
              badge: "Açıq Mənbə",
              icon: Boxes,
            },
          ] as SubItem[],
        },
        career: {
          id: "career",
          title: "Təcrübə",
          href: "/#career",
          desc: "Karyera Xronologiyası & Bacarıqlar",
          icon: Briefcase,
        },
        contact: {
          id: "contact",
          title: "Əlaqə",
          href: "/#contact",
          badge: "Aktiv",
          desc: "Birbaşa Əlaqə Saxlayın",
          icon: Mail,
        },
      },
    },
  };

  const currentNav = navContent[lang] ?? navContent.tr;
  const cats = currentNav.categories;

  // Üst menü kategorileri (4 adet net üst başlık)
  const topCategories = [
    { id: "projects", label: cats.projects.title, isDropdown: false, href: cats.projects.href },
    { id: "tools", label: cats.tools.title, isDropdown: true, items: cats.tools.items },
    { id: "career", label: cats.career.title, isDropdown: false, href: cats.career.href },
    { id: "contact", label: cats.contact.title, isDropdown: false, href: cats.contact.href },
  ];

  // ScrollSpy: Ana sayfadayken aktif bölümü algıla
  useEffect(() => {
    if (!isHome) return;

    const sectionIds = ["work", "career", "contact"];

    const handleScroll = () => {
      const scrollY = window.scrollY + 200;
      let current = "";

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollY >= top && scrollY < top + height) {
            current = id;
            break;
          }
        }
      }
      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);

  // Sayfa dışına tıklandığında dropdown'ı kapat
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (navContainerRef.current && !navContainerRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleMouseEnter = (catId: string) => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setActiveDropdown(catId);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 180);
  };

  const closeAll = () => {
    setActiveDropdown(null);
    setMobileMenuOpen(false);
  };

  const isCategoryActive = (catId: string) => {
    if (catId === "projects") {
      return isHome && activeSection === "work";
    }
    if (catId === "tools") {
      return (
        pathname.startsWith("/audit") ||
        pathname.startsWith("/radar") ||
        pathname.startsWith("/insights") ||
        pathname.startsWith("/plugins") ||
        pathname.startsWith("/ai-radar") ||
        pathname.startsWith("/dns-inspector") ||
        pathname.startsWith("/schema-builder") ||
        pathname.startsWith("/font-strategist") ||
        pathname.startsWith("/image-optimizer")
      );
    }
    if (catId === "career") return isHome && activeSection === "career";
    if (catId === "contact") return isHome && activeSection === "contact";
    return false;
  };

  return (
    <nav
      ref={navContainerRef}
      className={`fixed left-0 top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-[#090b0f]/90 backdrop-blur-2xl border-b border-white/10 shadow-[0_10px_35px_rgba(0,0,0,0.85)] py-2.5"
          : "bg-transparent py-4"
      }`}
    >
      <div className="mx-auto flex h-14 max-w-[1480px] items-center justify-between px-4 sm:px-6 md:px-10">
        {/* LOGO */}
        <Link
          href="/"
          onClick={closeAll}
          className="group flex items-center gap-2.5 rounded-full border border-white/10 bg-[#11141a]/90 px-4 py-2 backdrop-blur-xl transition hover:border-blue-500/40 hover:bg-[#181c24] shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
        >
          <span className="relative flex h-2.5 w-2.5 items-center justify-center">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-500 opacity-50" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500" />
          </span>
          <span className="font-display text-xs sm:text-sm font-bold tracking-tight text-white group-hover:text-blue-300 transition">
            SABRİ CAN TÜTÜNCÜ
          </span>
        </Link>

        {/* ORTA KATEGORİK MENÜ (DESKTOP) */}
        <div
          data-nav-clone-group="true"
          className="hidden items-center gap-1.5 rounded-full border border-white/10 bg-[#11141a]/90 p-1.5 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.6)] md:flex"
        >
          {topCategories.map((cat, idx) => {
            const st = getCloneAndRenameState(
              phase1,
              idx,
              topCategories.length,
              cat.label,
              currentNav.template,
              76
            );

            const active = isCategoryActive(cat.id);
            const isOpen = activeDropdown === cat.id;

            if (cat.isDropdown) {
              return (
                <div
                  key={cat.id}
                  className=""
                  onMouseEnter={() => handleMouseEnter(cat.id)}
                  onMouseLeave={handleMouseLeave}
                >
                  <button
                    type="button"
                    onClick={() => setActiveDropdown(isOpen ? null : cat.id)}
                    className={`relative flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-medium tracking-wide transition-all ${
                      isOpen || active
                        ? "bg-blue-500/15 text-blue-300"
                        : st.isRenaming
                        ? "bg-blue-500/20 text-blue-200 ring-1 ring-blue-400"
                        : st.isCloning
                        ? "border border-dashed border-blue-400/60 bg-blue-500/10 text-blue-200"
                        : "text-zinc-300 hover:bg-white/[0.07] hover:text-white"
                    }`}
                    style={{
                      opacity: st.opacity,
                      transform: `translate3d(${st.offsetX.toFixed(1)}px, ${st.offsetY.toFixed(1)}px, 0) scale(${st.scale})`,
                    }}
                  >
                    {active && (
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                    )}
                    <span>{st.displayText}</span>
                    <ChevronDown
                      size={13}
                      className={`transition-transform duration-200 text-zinc-400 ${
                        isOpen ? "rotate-180 text-blue-300" : ""
                      }`}
                    />
                  </button>

                  {/* LABORATUVAR DİZİNİ */}
                  {isOpen && cat.items && (() => {
                    const rows = [...cat.items].sort((a, b) =>
                      (SPECIMENS[a.href]?.plate ?? "99").localeCompare(SPECIMENS[b.href]?.plate ?? "99")
                    );
                    const activeHref = hoverHref && rows.some((r) => r.href === hoverHref) ? hoverHref : rows[0].href;
                    const activeItem = rows.find((r) => r.href === activeHref) ?? rows[0];
                    const spec = SPECIMENS[activeHref];
                    return (
                      <div
                        className="absolute left-1/2 top-full w-[min(940px,calc(100vw-32px))] -translate-x-1/2 pt-3"
                        onMouseEnter={() => handleMouseEnter(cat.id)}
                        onMouseLeave={handleMouseLeave}
                      >
                        <div className="sp-in grid grid-cols-[minmax(0,1fr)_320px] overflow-hidden border border-white/[0.12] bg-[#11141a] shadow-[0_30px_80px_rgba(0,0,0,0.9)]">
                          <div className="max-h-[calc(100vh-120px)] overflow-y-auto py-2">
                            <p className="px-6 pb-2 pt-3 font-mono text-[11px] text-zinc-500">
                              {cat.label} <span className="text-zinc-700">/</span> {rows.length}
                            </p>
                            <ul>
                              {rows.map((sub) => {
                                const isSubActive = pathname === sub.href || (sub.href !== "/" && pathname.startsWith(sub.href));
                                return (
                                  <li key={sub.href}>
                                    <Link
                                      href={sub.href}
                                      onClick={closeAll}
                                      onMouseEnter={() => setHoverHref(sub.href)}
                                      onFocus={() => setHoverHref(sub.href)}
                                      className="group relative grid grid-cols-[34px_minmax(0,1fr)_16px] items-baseline gap-3 border-t border-white/[0.06] px-6 py-2.5 outline-none transition-colors hover:bg-white/[0.035] focus-visible:bg-white/[0.035]"
                                    >
                                      <span
                                        aria-hidden
                                        className="absolute left-0 top-0 h-full w-[2px] origin-top scale-y-0 bg-blue-500 transition-transform duration-200 group-hover:scale-y-100 group-focus-visible:scale-y-100"
                                      />
                                      <span className={`font-mono text-[11px] tabular-nums transition-colors ${isSubActive ? "text-blue-400" : "text-zinc-600 group-hover:text-blue-400"}`}>
                                        {SPECIMENS[sub.href]?.plate}
                                      </span>
                                      <span className="min-w-0">
                                        <span className={`block font-display text-[17px] leading-tight tracking-tight ${isSubActive ? "text-blue-300" : "text-white"}`}>
                                          {sub.title}
                                        </span>
                                        <span className="mt-0.5 block truncate text-xs text-zinc-500 transition-colors group-hover:text-zinc-400">
                                          {sub.desc}
                                        </span>
                                      </span>
                                      <span aria-hidden className="text-zinc-700 transition-all group-hover:translate-x-0.5 group-hover:text-blue-400">
                                        →
                                      </span>
                                    </Link>
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                          <aside className="border-l border-white/10 bg-[#090b0f] p-5">
                            <div key={activeHref} className="sp-in">
                              {spec && <SpecimenFrame kind={spec.kind} plate={spec.plate} caption={spec.caption} />}
                              <p className="mt-5 font-display text-xl leading-tight tracking-tight text-white">{activeItem.title}</p>
                              <p className="mt-2 text-xs leading-relaxed text-zinc-400">{activeItem.desc}</p>
                            </div>
                          </aside>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              );
            }

            return (
              <Link
                key={cat.id}
                href={cat.href || "/"}
                onClick={closeAll}
                className={`relative flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-medium tracking-wide transition-all ${
                  active
                    ? "bg-blue-500/15 text-blue-300"
                    : st.isRenaming
                    ? "bg-blue-500/20 text-blue-200 ring-1 ring-blue-400"
                    : st.isCloning
                    ? "border border-dashed border-blue-400/60 bg-blue-500/10 text-blue-200"
                    : "text-zinc-300 hover:bg-white/[0.07] hover:text-white"
                }`}
                style={{
                  opacity: st.opacity,
                  transform: `translate3d(${st.offsetX.toFixed(1)}px, ${st.offsetY.toFixed(1)}px, 0) scale(${st.scale})`,
                }}
              >
                {active && (
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                )}
                <span>{st.displayText}</span>
                {cat.id === "contact" && (
                  <span className="relative flex h-2 w-2 items-center justify-center">
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-blue-400" />
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* SAĞ AKSİYONLAR: CV, DİL DEĞİŞTİRİCİ & MOBİL BUTON */}
        <div className="flex items-center gap-2">
          {/* CV BUTONU */}
          <a
            href="/Sabri_Can_Tutuncu_CV.pdf"
            download="Sabri_Can_Tutuncu_CV.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-full border border-blue-500/35 bg-blue-500/10 px-3 py-1.5 font-mono text-xs font-semibold text-blue-300 backdrop-blur-xl transition hover:border-blue-400 hover:bg-blue-600 hover:text-white"
            title={currentNav.cvTitle}
          >
            <FileDown size={14} />
            <span>CV</span>
          </a>

          {/* DİL DEĞİŞTİRİCİ */}
          <div className="rounded-full border border-white/10 bg-[#11141a]/90 p-1 backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
            <LangToggle />
          </div>

          {/* MOBİL HAMBURGER BUTONU */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Menüyü Kapat" : "Menüyü Aç"}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-[#11141a]/90 text-white/80 backdrop-blur-xl transition hover:border-blue-400/40 hover:text-white md:hidden"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* MOBİL MENÜ MODALI */}
      {mobileMenuOpen && (
        <div className="mx-4 mt-2 rounded-3xl border border-white/10 bg-[#11141a]/95 p-4 backdrop-blur-2xl shadow-[0_25px_60px_rgba(0,0,0,0.95)] ring-1 ring-white/10 animate-in fade-in slide-in-from-top-3 duration-200 md:hidden max-h-[80vh] overflow-y-auto">
          {/* Portfolyo Linki */}
          <div className="mb-3">
            <Link
              href="/#work"
              onClick={closeAll}
              className="flex items-center gap-3 rounded-xl border border-white/5 bg-[#181c24] p-3 text-xs font-semibold text-white"
            >
              <FolderKanban size={16} className="text-blue-400" />
              <span>{cats.projects.title}</span>
            </Link>
          </div>

          {/* Araçlar Listesi */}
          <div className="mb-4">
            <div className="mb-2 flex items-center justify-between px-2">
              <span className="font-mono text-[11px] text-blue-400">{cats.tools.title}</span>
              <span className="font-mono text-[11px] text-zinc-500">{cats.tools.items.length}</span>
            </div>
            <ul className="border-t border-white/10">
              {[...cats.tools.items]
                .sort((a, b) => (SPECIMENS[a.href]?.plate ?? "99").localeCompare(SPECIMENS[b.href]?.plate ?? "99"))
                .map((sub) => (
                  <li key={sub.href}>
                    <Link
                      href={sub.href}
                      onClick={closeAll}
                      className="grid grid-cols-[28px_minmax(0,1fr)] items-baseline gap-2 border-b border-white/[0.07] px-2 py-3 active:bg-white/[0.05]"
                    >
                      <span className="font-mono text-[11px] tabular-nums text-zinc-500">{SPECIMENS[sub.href]?.plate}</span>
                      <span>
                        <span className="block font-display text-[15px] leading-tight text-white">{sub.title}</span>
                        <span className="mt-0.5 line-clamp-1 block text-[11px] text-zinc-400">{sub.desc}</span>
                      </span>
                    </Link>
                  </li>
                ))}
            </ul>
          </div>

          {/* Deneyim & İletişim */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10">
            <Link
              href={cats.career.href}
              onClick={closeAll}
              className="flex items-center gap-2 rounded-xl border border-white/5 bg-[#181c24] p-2.5 transition active:bg-white/10"
            >
              <Briefcase size={16} className="text-blue-400" />
              <div className="truncate text-xs font-semibold text-white">{cats.career.title}</div>
            </Link>

            <Link
              href={cats.contact.href}
              onClick={closeAll}
              className="flex items-center gap-2 rounded-xl border border-white/5 bg-[#181c24] p-2.5 transition active:bg-white/10"
            >
              <Mail size={16} className="text-blue-400" />
              <div className="truncate text-xs font-semibold text-white">{cats.contact.title}</div>
            </Link>
          </div>

          {/* Mobilde Özgeçmiş / CV İndir Butonu */}
          <div className="mt-3 pt-2 border-t border-white/10">
            <a
              href="/Sabri_Can_Tutuncu_CV.pdf"
              download="Sabri_Can_Tutuncu_CV.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-blue-500/35 bg-blue-600 p-2.5 text-xs font-bold text-white transition hover:bg-blue-500"
            >
              <FileDown size={15} />
              <span>{currentNav.cvTitle}</span>
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
