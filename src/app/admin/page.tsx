"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ApplicationStatus,
  CompanyCategory,
  CompanySize,
  EmployerCompany,
  INITIAL_EMPLOYER_COMPANIES,
  PriorityLevel,
  WorkModel,
} from "@/data/employer-seed";

const STORAGE_KEY = "sct_employer_discovery_v1";

const CATEGORIES: Array<CompanyCategory | "Tümü"> = [
  "Tümü",
  "Web Ajansı",
  "Yazılım Şirketi",
  "E-Ticaret Ajansı",
  "SEO Ajansı",
];

const WORK_MODELS: Array<WorkModel | "Tümü"> = [
  "Tümü",
  "İzmir (Yerinde / Hibrit)",
  "İzmir + Uzaktan",
  "Uzaktan (Remote)",
];

const COMPANY_SIZES: Array<CompanySize | "Tümü"> = [
  "Tümü",
  "Butik (2-10)",
  "Büyüyen (10-30)",
  "Orta Ölçekli (30-100)",
  "Kurumsal (100+)",
];

const PRIORITIES: Array<PriorityLevel | "Tümü"> = [
  "Tümü",
  "Yüksek (P1)",
  "Orta (P2)",
  "Düşük (P3)",
];

const STATUS_OPTIONS: ApplicationStatus[] = [
  "Keşfedildi",
  "Onaylandı",
  "Başvuruldu",
  "Görüşme / Mülakat",
  "Teklif / Partnerlik",
  "Takip Edilecek",
  "Arşiv",
];

type ActiveTab = "discovery" | "screening" | "evaluation" | "approved";

export default function AdminEmployerDiscoveryPage() {
  // Auth state
  const [authChecked, setAuthChecked] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  // Main Engine State
  const [activeTab, setActiveTab] = useState<ActiveTab>("discovery");
  const [companies, setCompanies] = useState<EmployerCompany[]>(INITIAL_EMPLOYER_COMPANIES);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>(
    INITIAL_EMPLOYER_COMPANIES[0]?.id || ""
  );
  const [saveIndicator, setSaveIndicator] = useState<string>("");

  // Discovery controls
  const [discCategory, setDiscCategory] = useState<CompanyCategory | "Tümü">("Tümü");
  const [discLocation, setDiscLocation] = useState<string>("İzmir");
  const [discTechFilter, setDiscTechFilter] = useState<string>("Tümü");
  const [discKeyword, setDiscKeyword] = useState<string>("");
  const [discRunning, setDiscRunning] = useState(false);
  const [discMessage, setDiscMessage] = useState<string>("");

  // Direct URL / Batch Deep Analyzer controls
  const [scanUrlInput, setScanUrlInput] = useState<string>("");
  const [scanCategoryHint, setScanCategoryHint] = useState<CompanyCategory>("Web Ajansı");
  const [scanRunning, setScanRunning] = useState(false);
  const [scanMessage, setScanMessage] = useState<string>("");
  const [scanningId, setScanningId] = useState<string | null>(null);

  // Screening / Classification filters
  const [filterCategory, setFilterCategory] = useState<CompanyCategory | "Tümü">("Tümü");
  const [filterWorkModel, setFilterWorkModel] = useState<WorkModel | "Tümü">("Tümü");
  const [filterSize, setFilterSize] = useState<CompanySize | "Tümü">("Tümü");
  const [filterPriority, setFilterPriority] = useState<PriorityLevel | "Tümü">("Tümü");
  const [filterTech, setFilterTech] = useState<string>("Tümü");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [approvedStatusFilter, setApprovedStatusFilter] = useState<ApplicationStatus | "Tümü">("Tümü");

  // Pitch copy state
  const [copiedType, setCopiedType] = useState<string | null>(null);

  // Check session on mount
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/admin/auth");
        const data = await res.json();
        if (data.authenticated) {
          setAuthenticated(true);
          await loadCompaniesData();
        }
      } catch {
        // ignore
      } finally {
        setAuthChecked(true);
      }
    }
    checkAuth();
  }, []);

  async function loadCompaniesData() {
    // 1. Check localStorage first for immediate state
    let localData: EmployerCompany[] | null = null;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          localData = parsed;
        }
      }
    } catch {
      // ignore
    }

    // 2. Fetch server disk state
    try {
      const res = await fetch("/api/admin/companies");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.companies) && data.companies.length > 0) {
          // Merge local and server companies by domain
          const mergedMap = new Map<string, EmployerCompany>();
          for (const c of data.companies) {
            mergedMap.set(c.domain.toLowerCase(), c);
          }
          if (localData) {
            for (const c of localData) {
              mergedMap.set(c.domain.toLowerCase(), c);
            }
          }
          const merged = Array.from(mergedMap.values());
          setCompanies(merged);
          if (merged[0] && !selectedCompanyId) {
            setSelectedCompanyId(merged[0].id);
          }
          return;
        }
      }
    } catch {
      // fallback to localData
    }

    if (localData) {
      setCompanies(localData);
    }
  }

  async function persistCompanies(updated: EmployerCompany[]) {
    setCompanies(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
    try {
      await fetch("/api/admin/companies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companies: updated }),
      });
      setSaveIndicator("Kaydedildi");
      setTimeout(() => setSaveIndicator(""), 2000);
    } catch {
      setSaveIndicator("Yerel belleğe kaydedildi");
      setTimeout(() => setSaveIndicator(""), 2000);
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setAuthError("");
    setAuthLoading(true);
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: passwordInput }),
      });
      const data = await res.json();
      if (!res.ok || !data.authenticated) {
        setAuthError(data.error || "Giriş başarısız.");
      } else {
        setAuthenticated(true);
        setPasswordInput("");
        await loadCompaniesData();
      }
    } catch {
      setAuthError("Sunucu bağlantı hatası.");
    } finally {
      setAuthLoading(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/auth", { method: "DELETE" });
    setAuthenticated(false);
  }

  // Run Automated Discovery Engine
  async function handleRunDiscovery() {
    setDiscRunning(true);
    setDiscMessage("İzmir & Uzaktan firma indeksleri ve canlı web sonuçları taranıyor...");
    try {
      const existingDomains = companies.map((c) => c.domain.toLowerCase());
      const res = await fetch("/api/admin/discover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: discCategory,
          location: discLocation,
          techFilter: discTechFilter,
          customKeyword: discKeyword,
          existingDomains,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setDiscMessage(data.error || "Keşif sırasında bir hata oluştu.");
      } else {
        const found: EmployerCompany[] = data.companies || [];
        if (found.length === 0) {
          setDiscMessage(
            "Bu filtredeki tüm hazır firmalar zaten listenizde mevcut. Farklı bir kategori/anahtar kelime deneyin veya aşağıdan doğrudan URL tarayın."
          );
        } else {
          const updated = [...found, ...companies];
          await persistCompanies(updated);
          setSelectedCompanyId(found[0].id);
          setDiscMessage(
            `✓ ${found.length} yeni firma keşfedildi, sınıflandırıldı ve AI uygunluk skorları hesaplandı.`
          );
        }
      }
    } catch {
      setDiscMessage("Keşif motoru bağlantı hatası.");
    } finally {
      setDiscRunning(false);
    }
  }

  // Run Live Deep Website Analyzer (Single or Multi-line URLs)
  async function handleDeepScanUrls(e: React.FormEvent) {
    e.preventDefault();
    const urls = scanUrlInput
      .split(/[\n,;]+/)
      .map((u) => u.trim())
      .filter(Boolean);

    if (urls.length === 0) return;

    setScanRunning(true);
    setScanMessage(`0 / ${urls.length} firma canlı taranıyor (Ana sayfa, /iletisim, /kariyer, teknoloji & CWV)...`);

    const newlyAnalyzed: EmployerCompany[] = [];
    for (let i = 0; i < urls.length; i++) {
      const u = urls[i];
      setScanMessage(`${i + 1} / ${urls.length} canlı taranıyor: ${u} ...`);
      try {
        const res = await fetch("/api/admin/analyze-company", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            url: u,
            categoryHint: scanCategoryHint,
            cityHint: discLocation.includes("İzmir") ? "İzmir" : "",
          }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.company) {
            newlyAnalyzed.push(data.company);
          }
        }
      } catch {
        // continue with next
      }
    }

    if (newlyAnalyzed.length > 0) {
      const existingMap = new Map(companies.map((c) => [c.domain.toLowerCase(), c]));
      for (const item of newlyAnalyzed) {
        const prev = existingMap.get(item.domain.toLowerCase());
        if (prev) {
          // Preserve approval & status if re-scanning existing
          existingMap.set(item.domain.toLowerCase(), {
            ...item,
            id: prev.id,
            approved: prev.approved,
            applicationStatus: prev.applicationStatus,
            followUpDate: prev.followUpDate,
          });
        } else {
          existingMap.set(item.domain.toLowerCase(), item);
        }
      }

      const merged = Array.from(existingMap.values());
      await persistCompanies(merged);
      setSelectedCompanyId(newlyAnalyzed[0].id);
      setScanUrlInput("");
      setScanMessage(
        `✓ ${newlyAnalyzed.length} firma canlı olarak tarandı; iletişim, kariyer sayfası, teknoloji yığını ve AI değerlendirmesi güncellendi.`
      );
    } else {
      setScanMessage("Girilen URL taranamadı. Lütfen geçerli bir alan adı girin (örn. atolye15.com).");
    }

    setScanRunning(false);
  }

  // Re-scan an existing company live
  async function handleRescanCompany(company: EmployerCompany) {
    setScanningId(company.id);
    try {
      const res = await fetch("/api/admin/analyze-company", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: company.website || company.domain,
          categoryHint: company.category,
          cityHint: company.city,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.company) {
          const updated = companies.map((c) =>
            c.id === company.id
              ? {
                  ...data.company,
                  id: company.id,
                  name: data.company.name || company.name,
                  approved: company.approved,
                  applicationStatus: company.applicationStatus,
                  followUpDate: company.followUpDate,
                }
              : c
          );
          await persistCompanies(updated);
        }
      }
    } finally {
      setScanningId(null);
    }
  }

  function toggleApproveCompany(id: string) {
    const updated = companies.map((c) => {
      if (c.id !== id) return c;
      const nextApproved = !c.approved;
      const nextStatus: ApplicationStatus =
        nextApproved && c.applicationStatus === "Keşfedildi"
          ? "Onaylandı"
          : c.applicationStatus;
      return { ...c, approved: nextApproved, applicationStatus: nextStatus };
    });
    persistCompanies(updated);
  }

  function updateCompanyField<K extends keyof EmployerCompany>(
    id: string,
    field: K,
    value: EmployerCompany[K]
  ) {
    const updated = companies.map((c) => (c.id === id ? { ...c, [field]: value } : c));
    persistCompanies(updated);
  }

  function deleteCompany(id: string) {
    const updated = companies.filter((c) => c.id !== id);
    persistCompanies(updated);
    if (selectedCompanyId === id && updated[0]) {
      setSelectedCompanyId(updated[0].id);
    }
  }

  function exportAsCsv() {
    const targetList = companies.filter((c) => c.approved);
    const rows = [
      [
        "Firma Adı",
        "Kategori",
        "Şehir",
        "İlçe",
        "Çalışma Modeli",
        "Büyüklük",
        "Web Sitesi",
        "Kariyer Sayfası",
        "E-Posta",
        "Telefon",
        "Teknolojiler",
        "Portföy Uyumu (%)",
        "Öncelik",
        "Başvuru Durumu",
        "Takip Tarihi",
        "Notlar",
      ],
      ...targetList.map((c) => [
        c.name,
        c.category,
        c.city,
        c.district,
        c.workModel,
        c.companySize,
        c.website,
        c.careerUrl,
        c.contactEmail,
        c.contactPhone,
        c.technologies.join(" | "),
        String(c.aiEvaluation.portfolioFitScore),
        c.aiEvaluation.priority,
        c.applicationStatus,
        c.followUpDate,
        c.notes.replace(/"/g, "'"),
      ]),
    ];

    const csvContent =
      "data:text/csv;charset=utf-8,\uFEFF" +
      rows.map((r) => r.map((cell) => `"${cell}"`).join(",")).join("\n");

    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `onaylanmis-firmalar-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function exportAsJson() {
    const blob = new Blob([JSON.stringify(companies, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `employer-discovery-backup-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  // Computed Filtered Lists
  const filteredCompanies = useMemo(() => {
    return companies
      .filter((c) => {
        if (filterCategory !== "Tümü" && c.category !== filterCategory) return false;
        if (filterWorkModel !== "Tümü" && c.workModel !== filterWorkModel) return false;
        if (filterSize !== "Tümü" && c.companySize !== filterSize) return false;
        if (filterPriority !== "Tümü" && c.aiEvaluation.priority !== filterPriority) return false;
        if (filterTech !== "Tümü") {
          const joined = c.technologies.join(" ").toLowerCase();
          if (filterTech === "Next.js / React" && !joined.includes("next") && !joined.includes("react"))
            return false;
          if (filterTech === "WordPress / Elementor" && !joined.includes("wordpress") && !joined.includes("elementor"))
            return false;
          if (filterTech === "E-Ticaret" && !joined.includes("woo") && !joined.includes("shopify") && !joined.includes("ikas"))
            return false;
          if (filterTech === "Schema / SEO" && !joined.includes("schema") && c.category !== "SEO Ajansı")
            return false;
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const hay = `${c.name} ${c.domain} ${c.city} ${c.district} ${c.technologies.join(" ")} ${c.services.join(" ")} ${c.notes}`.toLowerCase();
          if (!hay.includes(q)) return false;
        }
        return true;
      })
      .sort((a, b) => b.aiEvaluation.portfolioFitScore - a.aiEvaluation.portfolioFitScore);
  }, [companies, filterCategory, filterWorkModel, filterSize, filterPriority, filterTech, searchQuery]);

  const approvedCompanies = useMemo(() => {
    return companies
      .filter((c) => c.approved)
      .filter((c) => (approvedStatusFilter === "Tümü" ? true : c.applicationStatus === approvedStatusFilter))
      .sort((a, b) => b.aiEvaluation.portfolioFitScore - a.aiEvaluation.portfolioFitScore);
  }, [companies, approvedStatusFilter]);

  const selectedCompany = useMemo(() => {
    return companies.find((c) => c.id === selectedCompanyId) || filteredCompanies[0] || companies[0];
  }, [companies, selectedCompanyId, filteredCompanies]);

  // Metrics
  const stats = useMemo(() => {
    const total = companies.length;
    const izmirCount = companies.filter((c) => c.city.toLowerCase().includes("izmir")).length;
    const p1Count = companies.filter((c) => c.aiEvaluation.priority === "Yüksek (P1)").length;
    const approvedCount = companies.filter((c) => c.approved).length;
    const appliedCount = companies.filter(
      (c) =>
        c.applicationStatus === "Başvuruldu" ||
        c.applicationStatus === "Görüşme / Mülakat" ||
        c.applicationStatus === "Teklif / Partnerlik"
    ).length;
    const todayStr = new Date().toISOString().split("T")[0];
    const dueFollowUps = companies.filter(
      (c) => c.approved && c.followUpDate && c.followUpDate <= todayStr && c.applicationStatus !== "Arşiv"
    ).length;

    return { total, izmirCount, p1Count, approvedCount, appliedCount, dueFollowUps };
  }, [companies]);

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-[#07080a] text-zinc-200 flex items-center justify-center font-mono text-sm">
        [ EMPLOYER DISCOVERY ENGINE // OTURUM DOĞRULANIYOR... ]
      </div>
    );
  }

  // LOGIN GATE
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-[#07080a] text-zinc-100 flex flex-col justify-between p-6 md:p-12">
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
          <div className="flex items-center gap-3">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-400">
              SCT // EMPLOYER DISCOVERY ENGINE v2.4
            </span>
          </div>
          <Link
            href="/"
            className="font-mono text-xs text-zinc-400 hover:text-white transition-colors"
          >
            ← Portfolyoya Dön
          </Link>
        </div>

        <div className="max-w-md w-full mx-auto my-auto py-12">
          <div className="border border-zinc-800 bg-zinc-950/90 p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-cyan-500 to-amber-500" />
            <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-emerald-400 mb-2">
              PRIVATE COMMAND NODE // YÖNETİCİ KİLİDİ
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white mb-2">
              İşveren Keşif & Değerlendirme Sistemi
            </h1>
            <p className="text-xs text-zinc-400 leading-relaxed mb-6">
              İzmir & Uzaktan Web Ajansları, Yazılım Şirketleri, E-Ticaret ve SEO Ajansları için
              özel keşif, eleme, AI portföy uygunluk analizi ve başvuru takip motoru.
            </p>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block font-mono text-[11px] uppercase tracking-wider text-zinc-400 mb-2">
                  YÖNETİCİ ERİŞİM ANAHTARI (ADMIN_PASSWORD)
                </label>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••••••••••"
                  autoFocus
                  className="w-full bg-zinc-900/90 border border-zinc-700 focus:border-emerald-400 px-3.5 py-2.5 text-sm text-white font-mono outline-none transition-colors"
                />
              </div>

              {authError && (
                <div className="p-3 border border-red-500/40 bg-red-500/10 text-red-300 text-xs font-mono">
                  ! {authError}
                </div>
              )}

              <button
                type="submit"
                disabled={authLoading}
                className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-mono font-semibold text-xs uppercase tracking-widest py-3 transition-colors cursor-pointer"
              >
                {authLoading ? "DOĞRULANIYOR..." : "SİSTEME GİRİŞ YAP →"}
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-zinc-800/80 text-[11px] font-mono text-zinc-500 space-y-1">
              <div>• Varsayılan Anahtar: <code className="text-zinc-300">SabriCan2026!Admin</code></div>
              <div>• Vercel / .env üzerinden <code className="text-zinc-300">ADMIN_PASSWORD</code> ile özelleştirilebilir.</div>
            </div>
          </div>
        </div>

        <div className="border-t border-zinc-900 pt-4 flex justify-between items-center font-mono text-[11px] text-zinc-600">
          <span>NOINDEX / NOFOLLOW KORUMALI ÖZEL PANEL</span>
          <span>İZMİR & REMOTE EMPLOYER RADAR</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07080a] text-zinc-100 pb-24">
      {/* TOP COMMAND HEADER */}
      <header className="sticky top-0 z-30 border-b border-zinc-800 bg-[#07080a]/95 backdrop-blur-md">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold tracking-widest uppercase text-white">
                  EMPLOYER DISCOVERY ENGINE
                </span>
                <span className="font-mono text-[10px] px-2 py-0.5 bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  İZMİR & UZAKTAN
                </span>
                {saveIndicator && (
                  <span className="font-mono text-[10px] px-2 py-0.5 bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                    ✓ {saveIndicator}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-zinc-400 font-mono">
                Sabri Can Tütüncü // Özel İşveren Keşif, Eleme, AI Değerlendirme & Başvuru CRM Sistemi
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={exportAsCsv}
              className="px-3 py-1.5 border border-zinc-700 hover:border-emerald-400 bg-zinc-900 text-xs font-mono text-zinc-200 transition-colors cursor-pointer"
            >
              ↓ Onaylıları CSV İndir
            </button>
            <button
              onClick={exportAsJson}
              className="px-3 py-1.5 border border-zinc-700 hover:border-cyan-400 bg-zinc-900 text-xs font-mono text-zinc-200 transition-colors cursor-pointer"
            >
              ↓ JSON Yedek
            </button>
            <Link
              href="/"
              className="px-3 py-1.5 border border-zinc-800 hover:border-zinc-600 text-xs font-mono text-zinc-400 hover:text-white transition-colors"
            >
              Siteyi Gör ↗
            </Link>
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 border border-red-500/30 hover:bg-red-500/10 text-xs font-mono text-red-300 transition-colors cursor-pointer"
            >
              Çıkış
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1440px] mx-auto px-4 md:px-8 pt-6 space-y-6">
        {/* TELEMETRY METRICS STRIP */}
        <section className="grid grid-cols-2 md:grid-cols-6 gap-3">
          <div className="border border-zinc-800 bg-zinc-950/70 p-3.5">
            <div className="font-mono text-[10px] uppercase tracking-wider text-zinc-400">
              KEŞFEDİLEN FİRMA
            </div>
            <div className="text-2xl font-bold font-mono text-white mt-1">{stats.total}</div>
            <div className="text-[11px] text-zinc-500 mt-0.5">{stats.izmirCount} İzmir merkezli</div>
          </div>

          <div className="border border-zinc-800 bg-zinc-950/70 p-3.5">
            <div className="font-mono text-[10px] uppercase tracking-wider text-emerald-400">
              YÜKSEK ÖNCELİK (P1)
            </div>
            <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">{stats.p1Count}</div>
            <div className="text-[11px] text-zinc-500 mt-0.5">%82+ Portföy Uyumu</div>
          </div>

          <div className="border border-zinc-800 bg-zinc-950/70 p-3.5">
            <div className="font-mono text-[10px] uppercase tracking-wider text-cyan-400">
              ONAYLANMIŞ LİSTE
            </div>
            <div className="text-2xl font-bold font-mono text-cyan-300 mt-1">
              {stats.approvedCount}
            </div>
            <div className="text-[11px] text-zinc-500 mt-0.5">Başvuru havuzunda</div>
          </div>

          <div className="border border-zinc-800 bg-zinc-950/70 p-3.5">
            <div className="font-mono text-[10px] uppercase tracking-wider text-amber-400">
              AKTİF SÜREÇ / BAŞVURU
            </div>
            <div className="text-2xl font-bold font-mono text-amber-300 mt-1">
              {stats.appliedCount}
            </div>
            <div className="text-[11px] text-zinc-500 mt-0.5">Başvuruldu / Görüşme</div>
          </div>

          <div className="border border-zinc-800 bg-zinc-950/70 p-3.5">
            <div className="font-mono text-[10px] uppercase tracking-wider text-rose-400">
              TAKİP TARİHİ GELEN
            </div>
            <div className="text-2xl font-bold font-mono text-rose-400 mt-1">
              {stats.dueFollowUps}
            </div>
            <div className="text-[11px] text-zinc-500 mt-0.5">Bugün / Gecikmiş</div>
          </div>

          <div className="border border-zinc-800 bg-zinc-950/70 p-3.5 flex flex-col justify-between">
            <div className="font-mono text-[10px] uppercase tracking-wider text-zinc-400">
              HEDEF PROFİL ODAĞI
            </div>
            <div className="text-xs font-mono text-zinc-200 mt-1">
              Next.js • WP/Elementor • CWV • Teknik SEO/GEO
            </div>
            <div className="text-[10px] font-mono text-emerald-400">● Motor Aktif</div>
          </div>
        </section>

        {/* 4 PILLAR NAVIGATION TABS */}
        <nav className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 border-b border-zinc-800 pb-4">
          <button
            onClick={() => setActiveTab("discovery")}
            className={`text-left p-3.5 border transition-all cursor-pointer ${
              activeTab === "discovery"
                ? "border-emerald-400 bg-emerald-500/10 text-white"
                : "border-zinc-800 bg-zinc-950/60 text-zinc-400 hover:border-zinc-700"
            }`}
          >
            <div className="font-mono text-[10px] uppercase tracking-widest text-emerald-400">
              01 // FİRMA KEŞFİ
            </div>
            <div className="font-semibold text-sm mt-0.5">İşveren & Ajans Keşif Motoru</div>
            <div className="text-[11px] text-zinc-400 mt-0.5">
              Web, Yazılım, E-Ticaret ve SEO ajanslarını bul & canlı tara
            </div>
          </button>

          <button
            onClick={() => setActiveTab("screening")}
            className={`text-left p-3.5 border transition-all cursor-pointer ${
              activeTab === "screening"
                ? "border-emerald-400 bg-emerald-500/10 text-white"
                : "border-zinc-800 bg-zinc-950/60 text-zinc-400 hover:border-zinc-700"
            }`}
          >
            <div className="font-mono text-[10px] uppercase tracking-widest text-cyan-400">
              02 // ELEME & SINIFLANDIRMA ({filteredCompanies.length})
            </div>
            <div className="font-semibold text-sm mt-0.5">İzmir, Uzaktan & Teknoloji Matrisi</div>
            <div className="text-[11px] text-zinc-400 mt-0.5">
              Büyüklük, hizmet, ilçe ve teknoloji yığınına göre filtrele
            </div>
          </button>

          <button
            onClick={() => setActiveTab("evaluation")}
            className={`text-left p-3.5 border transition-all cursor-pointer ${
              activeTab === "evaluation"
                ? "border-emerald-400 bg-emerald-500/10 text-white"
                : "border-zinc-800 bg-zinc-950/60 text-zinc-400 hover:border-zinc-700"
            }`}
          >
            <div className="font-mono text-[10px] uppercase tracking-widest text-amber-400">
              03 // AI ŞİRKET DEĞERLENDİRMESİ
            </div>
            <div className="font-semibold text-sm mt-0.5">Portföy Uyumu & Başvuru Üretici</div>
            <div className="text-[11px] text-zinc-400 mt-0.5">
              Personel ihtiyacı, öncelik ve firmaya özel başvuru metni
            </div>
          </button>

          <button
            onClick={() => setActiveTab("approved")}
            className={`text-left p-3.5 border transition-all cursor-pointer ${
              activeTab === "approved"
                ? "border-emerald-400 bg-emerald-500/10 text-white"
                : "border-zinc-800 bg-zinc-950/60 text-zinc-400 hover:border-zinc-700"
            }`}
          >
            <div className="font-mono text-[10px] uppercase tracking-widest text-emerald-300">
              04 // ONAYLANMIŞ FİRMA LİSTESİ ({stats.approvedCount})
            </div>
            <div className="font-semibold text-sm mt-0.5">Başvuru Durumu & Takip CRM</div>
            <div className="text-[11px] text-zinc-400 mt-0.5">
              İletişim, kariyer sayfası, başvuru durumu ve takip tarihi
            </div>
          </button>
        </nav>

        {/* ===================================================================== */}
        {/* TAB 1: FİRMA KEŞFİ (COMPANY DISCOVERY & LIVE DEEP SCANNER)            */}
        {/* ===================================================================== */}
        {activeTab === "discovery" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left: Automated Category & Region Discovery */}
              <div className="lg:col-span-7 border border-zinc-800 bg-zinc-950/80 p-6 space-y-5">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-emerald-400">
                      MODÜL 01-A // OTOMATİK SEKTÖR & BÖLGE TARAYICI
                    </span>
                    <h2 className="text-lg font-bold text-white mt-0.5">
                      Hedef İşveren & Ajans Keşfi Başlat
                    </h2>
                  </div>
                  <span className="font-mono text-[11px] text-zinc-400">İzmir + Remote</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-[11px] text-zinc-400 uppercase mb-1.5">
                      1. Firma Kategorisi
                    </label>
                    <select
                      value={discCategory}
                      onChange={(e) => setDiscCategory(e.target.value as CompanyCategory | "Tümü")}
                      className="w-full bg-zinc-900 border border-zinc-700 px-3 py-2.5 text-sm text-white font-mono outline-none focus:border-emerald-400"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-mono text-[11px] text-zinc-400 uppercase mb-1.5">
                      2. Lokasyon & Çalışma Modeli
                    </label>
                    <select
                      value={discLocation}
                      onChange={(e) => setDiscLocation(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-700 px-3 py-2.5 text-sm text-white font-mono outline-none focus:border-emerald-400"
                    >
                      <option value="İzmir">İzmir (Tüm İlçeler & Teknoparklar)</option>
                      <option value="İzmir Bayraklı Alsancak Konak">
                        İzmir — Bayraklı / Alsancak / Konak (Ajans Merkezi)
                      </option>
                      <option value="İzmir Teknopark Urla Bornova">
                        İzmir — Urla Teknopark / Ege Teknopark / DEPARK
                      </option>
                      <option value="Uzaktan (Remote)">Uzaktan (Remote / Türkiye Geneli)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-mono text-[11px] text-zinc-400 uppercase mb-1.5">
                      3. Teknoloji & Hizmet Odağı
                    </label>
                    <select
                      value={discTechFilter}
                      onChange={(e) => setDiscTechFilter(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-700 px-3 py-2.5 text-sm text-white font-mono outline-none focus:border-emerald-400"
                    >
                      <option value="Tümü">Tüm Teknolojiler</option>
                      <option value="WordPress / Elementor">WordPress / Elementor / WooCommerce</option>
                      <option value="Next.js / React">Next.js / React / TypeScript</option>
                      <option value="E-Ticaret (Shopify / İkas / Woo)">
                        E-Ticaret (Shopify / İkas / WooCommerce)
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-mono text-[11px] text-zinc-400 uppercase mb-1.5">
                      4. Ek Anahtar Kelime (Opsiyonel)
                    </label>
                    <input
                      type="text"
                      value={discKeyword}
                      onChange={(e) => setDiscKeyword(e.target.value)}
                      placeholder="Örn: kreatif, saas, kurumsal, bornova..."
                      className="w-full bg-zinc-900 border border-zinc-700 px-3 py-2 text-sm text-white font-mono outline-none focus:border-emerald-400"
                    />
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                  <button
                    onClick={handleRunDiscovery}
                    disabled={discRunning}
                    className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-mono font-bold text-xs uppercase tracking-widest transition-colors cursor-pointer"
                  >
                    {discRunning ? "KEŞİF MOTORU ÇALIŞIYOR..." : "⚡ FİRMA KEŞFİNİ BAŞLAT"}
                  </button>

                  <span className="text-xs text-zinc-400 font-mono">
                    Web Ajansları • Yazılım Şirketleri • E-Ticaret • SEO Ajansları
                  </span>
                </div>

                {discMessage && (
                  <div className="p-3.5 border border-emerald-500/30 bg-emerald-500/10 text-emerald-200 text-xs font-mono">
                    {discMessage}
                  </div>
                )}
              </div>

              {/* Right: Live URL Deep Scanner */}
              <div className="lg:col-span-5 border border-zinc-800 bg-zinc-950/80 p-6 space-y-4">
                <div className="border-b border-zinc-800 pb-3">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-cyan-400">
                    MODÜL 01-B // CANLI SİTE & DOMAİN DERİN ANALİZÖRÜ
                  </span>
                  <h2 className="text-lg font-bold text-white mt-0.5">
                    Firma Web Sitesini Canlı Tara & Sınıflandır
                  </h2>
                  <p className="text-xs text-zinc-400 mt-1">
                    Bulduğunuz bir ajans veya yazılım şirketinin URL&apos;sini girin. Sistem sitenin{" "}
                    <code className="text-zinc-200">/iletisim</code> ve{" "}
                    <code className="text-zinc-200">/kariyer</code> sayfalarını canlı tarar;
                    e-posta, telefon, İzmir ilçesi, teknoloji yığını ve AI portföy uyumunu otomatik çıkarır.
                  </p>
                </div>

                <form onSubmit={handleDeepScanUrls} className="space-y-3">
                  <div>
                    <label className="block font-mono text-[11px] text-zinc-400 uppercase mb-1">
                      Firma URL / Domain (Alt alta birden fazla girebilirsiniz)
                    </label>
                    <textarea
                      rows={3}
                      value={scanUrlInput}
                      onChange={(e) => setScanUrlInput(e.target.value)}
                      placeholder={"Örn:\natolye15.com\nseorative.com\nmoddgroup.com"}
                      className="w-full bg-zinc-900 border border-zinc-700 p-3 text-xs text-white font-mono outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <label className="block font-mono text-[10px] text-zinc-400 uppercase mb-1">
                        Varsayılan Kategori
                      </label>
                      <select
                        value={scanCategoryHint}
                        onChange={(e) => setScanCategoryHint(e.target.value as CompanyCategory)}
                        className="w-full bg-zinc-900 border border-zinc-700 px-2.5 py-2 text-xs text-white font-mono outline-none"
                      >
                        <option value="Web Ajansı">Web Ajansı</option>
                        <option value="Yazılım Şirketi">Yazılım Şirketi</option>
                        <option value="E-Ticaret Ajansı">E-Ticaret Ajansı</option>
                        <option value="SEO Ajansı">SEO Ajansı</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      disabled={scanRunning}
                      className="mt-4 px-5 py-2.5 bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 text-black font-mono font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      {scanRunning ? "TARANIYOR..." : "CANLI TARA & EKLE →"}
                    </button>
                  </div>
                </form>

                {scanMessage && (
                  <div className="p-3 border border-cyan-500/30 bg-cyan-500/10 text-cyan-200 text-xs font-mono">
                    {scanMessage}
                  </div>
                )}
              </div>
            </div>

            {/* Recently Discovered Feed */}
            <div className="border border-zinc-800 bg-zinc-950/60 p-6">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-400">
                    KEŞİF HAVUZU // SON BULUNAN VE DEĞERLENDİRİLEN FİRMALAR
                  </span>
                  <h3 className="text-base font-bold text-white">
                    Keşfedilen İşveren Adayları ({companies.length})
                  </h3>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveTab("screening")}
                    className="px-3 py-1.5 border border-zinc-700 hover:border-white text-xs font-mono text-zinc-300 cursor-pointer"
                  >
                    Detaylı Eleme & Filtreleme →
                  </button>
                  <button
                    onClick={() => setActiveTab("approved")}
                    className="px-3 py-1.5 bg-emerald-500/20 border border-emerald-500/40 text-xs font-mono text-emerald-300 cursor-pointer"
                  >
                    Onaylanmış Firma Listesi ({stats.approvedCount}) →
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {companies.slice(0, 9).map((comp) => (
                  <div
                    key={comp.id}
                    className={`border p-4 transition-all flex flex-col justify-between ${
                      comp.approved
                        ? "border-emerald-500/40 bg-emerald-950/10"
                        : "border-zinc-800 bg-zinc-900/40 hover:border-zinc-700"
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-mono text-[10px] px-2 py-0.5 bg-zinc-800 text-zinc-300 border border-zinc-700">
                          {comp.category}
                        </span>
                        <span
                          className={`font-mono text-[10px] px-2 py-0.5 font-bold ${
                            comp.aiEvaluation.priority === "Yüksek (P1)"
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                              : comp.aiEvaluation.priority === "Orta (P2)"
                              ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                              : "bg-zinc-800 text-zinc-400"
                          }`}
                        >
                          %{comp.aiEvaluation.portfolioFitScore} Uyum • {comp.aiEvaluation.priority}
                        </span>
                      </div>

                      <h4 className="font-bold text-base text-white mt-2.5">{comp.name}</h4>
                      <div className="font-mono text-xs text-zinc-400 mt-0.5">
                        {comp.city} ({comp.district}) • {comp.workModel} • {comp.companySize}
                      </div>

                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {comp.technologies.slice(0, 5).map((t) => (
                          <span
                            key={t}
                            className="font-mono text-[10px] px-2 py-0.5 bg-zinc-900 border border-zinc-800 text-zinc-300"
                          >
                            {t}
                          </span>
                        ))}
                      </div>

                      <p className="text-xs text-zinc-400 mt-3 line-clamp-2">
                        {comp.aiEvaluation.estimatedStaffingNeed}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleApproveCompany(comp.id)}
                          className={`px-2.5 py-1 font-mono text-[11px] border transition-colors cursor-pointer ${
                            comp.approved
                              ? "bg-emerald-500 text-black font-bold border-emerald-400"
                              : "bg-zinc-900 text-zinc-300 border-zinc-700 hover:border-emerald-400"
                          }`}
                        >
                          {comp.approved ? "✓ Onaylandı" : "+ Listeye Onayla"}
                        </button>
                        <button
                          onClick={() => handleRescanCompany(comp)}
                          disabled={scanningId === comp.id}
                          className="px-2 py-1 font-mono text-[11px] border border-zinc-700 hover:border-cyan-400 text-zinc-300 cursor-pointer"
                          title="Siteyi Canlı Tara"
                        >
                          {scanningId === comp.id ? "Taranıyor..." : "↻ Canlı Tara"}
                        </button>
                      </div>

                      <button
                        onClick={() => {
                          setSelectedCompanyId(comp.id);
                          setActiveTab("evaluation");
                        }}
                        className="font-mono text-[11px] text-cyan-400 hover:text-cyan-300 cursor-pointer"
                      >
                        AI Raporu →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* TAB 2: ELEME VE SINIFLANDIRMA (SCREENING & CLASSIFICATION)            */}
        {/* ===================================================================== */}
        {activeTab === "screening" && (
          <div className="space-y-6">
            {/* Multi-dimensional filter bar */}
            <div className="border border-zinc-800 bg-zinc-950/90 p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-cyan-400">
                    MODÜL 02 // ELEME VE SINIFLANDIRMA MATRİSİ
                  </span>
                  <h2 className="text-lg font-bold text-white">
                    İzmir, Uzaktan Çalışma, Teknoloji, Büyüklük & Hizmet Filtresi
                  </h2>
                </div>
                <button
                  onClick={() => {
                    setFilterCategory("Tümü");
                    setFilterWorkModel("Tümü");
                    setFilterSize("Tümü");
                    setFilterPriority("Tümü");
                    setFilterTech("Tümü");
                    setSearchQuery("");
                  }}
                  className="font-mono text-xs text-zinc-400 hover:text-white underline cursor-pointer"
                >
                  Filtreleri Sıfırla
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                <div>
                  <label className="block font-mono text-[10px] text-zinc-400 uppercase mb-1">
                    Kategori
                  </label>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value as CompanyCategory | "Tümü")}
                    className="w-full bg-zinc-900 border border-zinc-700 px-2.5 py-2 text-xs text-white font-mono"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-[10px] text-zinc-400 uppercase mb-1">
                    Konum & Çalışma Modeli
                  </label>
                  <select
                    value={filterWorkModel}
                    onChange={(e) => setFilterWorkModel(e.target.value as WorkModel | "Tümü")}
                    className="w-full bg-zinc-900 border border-zinc-700 px-2.5 py-2 text-xs text-white font-mono"
                  >
                    {WORK_MODELS.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-[10px] text-zinc-400 uppercase mb-1">
                    Teknoloji Yığını
                  </label>
                  <select
                    value={filterTech}
                    onChange={(e) => setFilterTech(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 px-2.5 py-2 text-xs text-white font-mono"
                  >
                    <option value="Tümü">Tüm Teknolojiler</option>
                    <option value="Next.js / React">Next.js / React / TS</option>
                    <option value="WordPress / Elementor">WordPress / Elementor</option>
                    <option value="E-Ticaret">WooCommerce / Shopify / İkas</option>
                    <option value="Schema / SEO">Teknik SEO / Schema.org</option>
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-[10px] text-zinc-400 uppercase mb-1">
                    Şirket Büyüklüğü
                  </label>
                  <select
                    value={filterSize}
                    onChange={(e) => setFilterSize(e.target.value as CompanySize | "Tümü")}
                    className="w-full bg-zinc-900 border border-zinc-700 px-2.5 py-2 text-xs text-white font-mono"
                  >
                    {COMPANY_SIZES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-[10px] text-zinc-400 uppercase mb-1">
                    Başvuru Önceliği
                  </label>
                  <select
                    value={filterPriority}
                    onChange={(e) => setFilterPriority(e.target.value as PriorityLevel | "Tümü")}
                    className="w-full bg-zinc-900 border border-zinc-700 px-2.5 py-2 text-xs text-white font-mono"
                  >
                    {PRIORITIES.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-[10px] text-zinc-400 uppercase mb-1">
                    Firma / İlçe / Hizmet Ara
                  </label>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Bayraklı, Urla, SEO..."
                    className="w-full bg-zinc-900 border border-zinc-700 px-2.5 py-2 text-xs text-white font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Filtered Table / Classification List */}
            <div className="space-y-3">
              {filteredCompanies.map((comp) => (
                <div
                  key={comp.id}
                  className={`border p-5 transition-all ${
                    comp.approved
                      ? "border-emerald-500/40 bg-emerald-950/10"
                      : "border-zinc-800 bg-zinc-950/70"
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="space-y-1.5 max-w-3xl">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold px-2.5 py-0.5 bg-zinc-800 text-white border border-zinc-700">
                          {comp.category}
                        </span>
                        <span className="font-mono text-xs px-2.5 py-0.5 bg-zinc-900 text-zinc-300 border border-zinc-800">
                          📍 {comp.city} / {comp.district}
                        </span>
                        <span className="font-mono text-xs px-2.5 py-0.5 bg-zinc-900 text-zinc-300 border border-zinc-800">
                          🏠 {comp.workModel}
                        </span>
                        <span className="font-mono text-xs px-2.5 py-0.5 bg-zinc-900 text-zinc-300 border border-zinc-800">
                          👥 {comp.companySize}
                        </span>
                        {typeof comp.ttfbMs === "number" && (
                          <span
                            className={`font-mono text-[11px] px-2 py-0.5 border ${
                              comp.ttfbMs > 600
                                ? "border-amber-500/40 text-amber-300 bg-amber-500/10"
                                : "border-emerald-500/30 text-emerald-300 bg-emerald-500/10"
                            }`}
                          >
                            TTFB: {comp.ttfbMs}ms
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 pt-1">
                        <h3 className="text-lg font-bold text-white">{comp.name}</h3>
                        <a
                          href={comp.website}
                          target="_blank"
                          rel="noreferrer"
                          className="font-mono text-xs text-cyan-400 hover:underline"
                        >
                          {comp.domain} ↗
                        </a>
                      </div>

                      <p className="text-xs text-zinc-300 leading-relaxed">
                        {comp.aiEvaluation.fitSummary}
                      </p>

                      {/* Tech & Services */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-2">
                        <span className="font-mono text-[10px] text-zinc-500 uppercase mr-1">
                          Teknolojiler:
                        </span>
                        {comp.technologies.map((t) => (
                          <span
                            key={t}
                            className="font-mono text-[11px] px-2 py-0.5 bg-zinc-900 border border-zinc-700 text-emerald-300"
                          >
                            {t}
                          </span>
                        ))}
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <span className="font-mono text-[10px] text-zinc-500 uppercase mr-1">
                          Hizmetler:
                        </span>
                        {comp.services.map((s) => (
                          <span
                            key={s}
                            className="font-mono text-[11px] px-2 py-0.5 bg-zinc-900/60 border border-zinc-800 text-zinc-300"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Right Evaluation & Action Column */}
                    <div className="flex flex-col items-end justify-between gap-3 min-w-[230px]">
                      <div className="text-right">
                        <div className="font-mono text-[10px] text-zinc-400 uppercase">
                          PORTFÖY UYGUNLUK SKORU
                        </div>
                        <div className="flex items-center justify-end gap-2 mt-0.5">
                          <span className="text-2xl font-bold font-mono text-emerald-400">
                            %{comp.aiEvaluation.portfolioFitScore}
                          </span>
                          <span
                            className={`font-mono text-xs px-2 py-0.5 font-semibold ${
                              comp.aiEvaluation.priority === "Yüksek (P1)"
                                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                                : comp.aiEvaluation.priority === "Orta (P2)"
                                ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                                : "bg-zinc-800 text-zinc-400"
                            }`}
                          >
                            {comp.aiEvaluation.priority}
                          </span>
                        </div>
                        <div className="text-[11px] font-mono text-zinc-400 mt-1">
                          Öneri: {comp.aiEvaluation.recommendedApproach}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          onClick={() => toggleApproveCompany(comp.id)}
                          className={`px-3 py-1.5 font-mono text-xs border transition-colors cursor-pointer ${
                            comp.approved
                              ? "bg-emerald-500 text-black font-bold border-emerald-400"
                              : "bg-zinc-900 text-white border-zinc-700 hover:border-emerald-400"
                          }`}
                        >
                          {comp.approved ? "✓ Onaylı Listede" : "+ Listeye Onayla"}
                        </button>

                        <button
                          onClick={() => {
                            setSelectedCompanyId(comp.id);
                            setActiveTab("evaluation");
                          }}
                          className="px-3 py-1.5 font-mono text-xs bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/25 cursor-pointer"
                        >
                          AI Değerlendirme & Başvuru →
                        </button>

                        <button
                          onClick={() => deleteCompany(comp.id)}
                          className="px-2 py-1.5 font-mono text-xs border border-zinc-800 hover:border-red-500/50 text-zinc-500 hover:text-red-400 cursor-pointer"
                          title="Listeden Sil"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* TAB 3: AI ŞİRKET DEĞERLENDİRMESİ (AI EVALUATION & PITCH ENGINE)       */}
        {/* ===================================================================== */}
        {activeTab === "evaluation" && selectedCompany && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Company Selector List */}
            <div className="lg:col-span-4 border border-zinc-800 bg-zinc-950/80 p-4 space-y-2 max-h-[820px] overflow-y-auto">
              <div className="font-mono text-[10px] uppercase tracking-widest text-amber-400 px-1 pb-2 border-b border-zinc-800">
                DEĞERLENDİRİLECEK FİRMAYI SEÇİN ({companies.length})
              </div>
              {companies
                .slice()
                .sort((a, b) => b.aiEvaluation.portfolioFitScore - a.aiEvaluation.portfolioFitScore)
                .map((comp) => (
                  <button
                    key={comp.id}
                    onClick={() => setSelectedCompanyId(comp.id)}
                    className={`w-full text-left p-3 border transition-all cursor-pointer ${
                      selectedCompany.id === comp.id
                        ? "border-amber-400 bg-amber-500/10"
                        : "border-zinc-800/80 bg-zinc-900/40 hover:border-zinc-700"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-xs text-white truncate">{comp.name}</span>
                      <span className="font-mono text-xs font-bold text-emerald-400">
                        %{comp.aiEvaluation.portfolioFitScore}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 mt-1">
                      <span>
                        {comp.category} • {comp.district}
                      </span>
                      <span>{comp.aiEvaluation.priority}</span>
                    </div>
                  </button>
                ))}
            </div>

            {/* Right Deep AI Evaluation Report */}
            <div className="lg:col-span-8 space-y-6">
              <div className="border border-zinc-800 bg-zinc-950/90 p-6 space-y-6">
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-zinc-800 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] uppercase tracking-widest px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        MODÜL 03 // AI ŞİRKET DEĞERLENDİRME RAPORU
                      </span>
                      <span className="font-mono text-xs text-zinc-400">
                        {selectedCompany.category}
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold text-white mt-2">{selectedCompany.name}</h2>
                    <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-zinc-400 mt-1">
                      <a
                        href={selectedCompany.website}
                        target="_blank"
                        rel="noreferrer"
                        className="text-cyan-400 hover:underline"
                      >
                        {selectedCompany.website} ↗
                      </a>
                      <span>•</span>
                      <span>
                        {selectedCompany.city} ({selectedCompany.district})
                      </span>
                      <span>•</span>
                      <span>{selectedCompany.workModel}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleRescanCompany(selectedCompany)}
                      disabled={scanningId === selectedCompany.id}
                      className="px-3 py-2 border border-zinc-700 hover:border-cyan-400 font-mono text-xs text-zinc-200 cursor-pointer"
                    >
                      {scanningId === selectedCompany.id ? "Canlı Taranıyor..." : "↻ Siteyi Canlı Yeniden Analiz Et"}
                    </button>
                    <button
                      onClick={() => toggleApproveCompany(selectedCompany.id)}
                      className={`px-4 py-2 font-mono text-xs font-bold border cursor-pointer ${
                        selectedCompany.approved
                          ? "bg-emerald-500 text-black border-emerald-400"
                          : "bg-zinc-900 text-emerald-400 border-emerald-500/50 hover:bg-emerald-500/10"
                      }`}
                    >
                      {selectedCompany.approved ? "✓ Onaylanmış Listede" : "+ Onaylanmış Listeye Al"}
                    </button>
                  </div>
                </div>

                {/* 3 Key AI Evaluation Pillars */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border border-emerald-500/30 bg-emerald-950/10 p-4">
                    <div className="font-mono text-[10px] uppercase text-emerald-400">
                      1. PORTFÖYE UYGUNLUK
                    </div>
                    <div className="text-3xl font-bold font-mono text-white mt-1">
                      %{selectedCompany.aiEvaluation.portfolioFitScore}
                    </div>
                    <div className="text-xs text-zinc-300 mt-2">
                      Eşleşen Projeler:{" "}
                      <span className="text-emerald-300 font-mono">
                        {selectedCompany.aiEvaluation.matchedPortfolioAssets.join(", ")}
                      </span>
                    </div>
                  </div>

                  <div className="border border-cyan-500/30 bg-cyan-950/10 p-4">
                    <div className="font-mono text-[10px] uppercase text-cyan-400">
                      2. OLASI PERSONEL / PARTNER İHTİYACI
                    </div>
                    <div className="text-sm font-bold text-white mt-1.5 leading-snug">
                      {selectedCompany.aiEvaluation.estimatedStaffingNeed}
                    </div>
                    <div className="text-xs font-mono text-cyan-300 mt-2">
                      Model: {selectedCompany.aiEvaluation.recommendedApproach}
                    </div>
                  </div>

                  <div className="border border-amber-500/30 bg-amber-950/10 p-4">
                    <div className="font-mono text-[10px] uppercase text-amber-400">
                      3. BAŞVURU ÖNCELİĞİ
                    </div>
                    <div className="text-2xl font-bold font-mono text-amber-300 mt-1">
                      {selectedCompany.aiEvaluation.priority}
                    </div>
                    <div className="text-xs text-zinc-300 mt-2">
                      Kariyer / İletişim:{" "}
                      <a
                        href={selectedCompany.careerUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-amber-300 underline font-mono"
                      >
                        Sayfayı Aç ↗
                      </a>
                    </div>
                  </div>
                </div>

                {/* Detailed Fit & Staffing Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-zinc-800 bg-zinc-900/40 p-4 space-y-2">
                    <div className="font-mono text-xs font-bold uppercase text-emerald-400">
                      ✓ Neden Portföyünüze Uygun?
                    </div>
                    <ul className="space-y-1.5 text-xs text-zinc-300">
                      {selectedCompany.aiEvaluation.fitReasons.map((reason, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-emerald-400 font-mono">→</span>
                          <span>{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="border border-zinc-800 bg-zinc-900/40 p-4 space-y-2">
                    <div className="font-mono text-xs font-bold uppercase text-cyan-400">
                      ⚡ Personel İhtiyacı & Canlı Teknik Sinyaller
                    </div>
                    <ul className="space-y-1.5 text-xs text-zinc-300">
                      {selectedCompany.aiEvaluation.staffingSignals.map((sig, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-cyan-400 font-mono">•</span>
                          <span>{sig}</span>
                        </li>
                      ))}
                      {selectedCompany.aiEvaluation.technicalFindings.map((tf, idx) => (
                        <li key={`tf-${idx}`} className="flex items-start gap-2 text-amber-200/90">
                          <span className="text-amber-400 font-mono">⚙</span>
                          <span>{tf}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Tailored Outreach / Cover Letter Generators */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  {/* Pitch 1: Job Application */}
                  <div className="border border-zinc-800 bg-zinc-900/60 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-white">
                        A) Geliştirici Başvuru Metni (Kadro / Uzaktan)
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(selectedCompany.aiEvaluation.customPitchJob);
                            setCopiedType("job");
                            setTimeout(() => setCopiedType(null), 2000);
                          }}
                          className="px-2.5 py-1 bg-emerald-500 text-black font-mono text-[11px] font-bold cursor-pointer"
                        >
                          {copiedType === "job" ? "✓ Kopyalandı" : "Metni Kopyala"}
                        </button>
                        <a
                          href={`mailto:${selectedCompany.contactEmail}?subject=${encodeURIComponent(
                            `Full-Stack / Frontend Geliştirici Başvurusu - Sabri Can Tütüncü`
                          )}&body=${encodeURIComponent(selectedCompany.aiEvaluation.customPitchJob)}`}
                          className="px-2.5 py-1 border border-zinc-700 hover:border-white font-mono text-[11px] text-zinc-200"
                        >
                          E-Posta Aç ↗
                        </a>
                      </div>
                    </div>
                    <pre className="whitespace-pre-wrap font-mono text-[11px] text-zinc-300 bg-zinc-950 p-3 border border-zinc-800 max-h-56 overflow-y-auto">
                      {selectedCompany.aiEvaluation.customPitchJob}
                    </pre>
                  </div>

                  {/* Pitch 2: Agency White-Label Partner */}
                  <div className="border border-zinc-800 bg-zinc-900/60 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-white">
                        B) Ajans White-Label / Çözüm Ortağı Teklifi
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(
                              selectedCompany.aiEvaluation.customPitchAgencyPartner
                            );
                            setCopiedType("partner");
                            setTimeout(() => setCopiedType(null), 2000);
                          }}
                          className="px-2.5 py-1 bg-cyan-400 text-black font-mono text-[11px] font-bold cursor-pointer"
                        >
                          {copiedType === "partner" ? "✓ Kopyalandı" : "Metni Kopyala"}
                        </button>
                        <a
                          href={`mailto:${selectedCompany.contactEmail}?subject=${encodeURIComponent(
                            `${selectedCompany.name} & White-Label Web / Performans Çözüm Ortaklığı`
                          )}&body=${encodeURIComponent(
                            selectedCompany.aiEvaluation.customPitchAgencyPartner
                          )}`}
                          className="px-2.5 py-1 border border-zinc-700 hover:border-white font-mono text-[11px] text-zinc-200"
                        >
                          E-Posta Aç ↗
                        </a>
                      </div>
                    </div>
                    <pre className="whitespace-pre-wrap font-mono text-[11px] text-zinc-300 bg-zinc-950 p-3 border border-zinc-800 max-h-56 overflow-y-auto">
                      {selectedCompany.aiEvaluation.customPitchAgencyPartner}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* TAB 4: ONAYLANMIŞ FİRMA LİSTESİ (APPROVED COMPANIES CRM TRACKER)      */}
        {/* ===================================================================== */}
        {activeTab === "approved" && (
          <div className="space-y-6">
            <div className="border border-zinc-800 bg-zinc-950/90 p-5 flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-emerald-400">
                  MODÜL 04 // ONAYLANMIŞ FİRMA LİSTESİ & BAŞVURU TAKİP CRM
                </span>
                <h2 className="text-lg font-bold text-white">
                  Onaylanmış Hedef İşverenler ({approvedCompanies.length})
                </h2>
                <p className="text-xs text-zinc-400">
                  İletişim bilgisi, web sitesi, kariyer sayfası, başvuru durumu ve takip tarihi yönetimi.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={approvedStatusFilter}
                  onChange={(e) =>
                    setApprovedStatusFilter(e.target.value as ApplicationStatus | "Tümü")
                  }
                  className="bg-zinc-900 border border-zinc-700 px-3 py-2 text-xs text-white font-mono"
                >
                  <option value="Tümü">Tüm Başvuru Durumları</option>
                  {STATUS_OPTIONS.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>

                <button
                  onClick={exportAsCsv}
                  className="px-3.5 py-2 bg-emerald-500 text-black font-mono font-bold text-xs cursor-pointer"
                >
                  ↓ Excel / CSV İndir
                </button>
              </div>
            </div>

            {approvedCompanies.length === 0 ? (
              <div className="border border-zinc-800 bg-zinc-950/60 p-12 text-center space-y-3">
                <div className="font-mono text-sm text-zinc-400">
                  Bu filtrede henüz onaylanmış firma bulunmuyor.
                </div>
                <button
                  onClick={() => setActiveTab("screening")}
                  className="px-4 py-2 bg-emerald-500 text-black font-mono text-xs font-bold cursor-pointer"
                >
                  Eleme Listesinden Firma Onayla →
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {approvedCompanies.map((comp) => {
                  const todayStr = new Date().toISOString().split("T")[0];
                  const isDue =
                    comp.followUpDate &&
                    comp.followUpDate <= todayStr &&
                    comp.applicationStatus !== "Arşiv";

                  return (
                    <div
                      key={comp.id}
                      className={`border p-5 space-y-4 transition-all ${
                        isDue
                          ? "border-amber-500/60 bg-amber-950/10"
                          : "border-zinc-800 bg-zinc-950/85"
                      }`}
                    >
                      {/* Top row: Company identity + Priority + Status + Follow-up date */}
                      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800/80 pb-3.5">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono text-xs font-bold text-emerald-400">
                              %{comp.aiEvaluation.portfolioFitScore} Uyum
                            </span>
                            <span className="font-mono text-[11px] px-2 py-0.5 bg-zinc-800 text-zinc-200">
                              {comp.category}
                            </span>
                            <span className="font-mono text-[11px] text-zinc-400">
                              {comp.city} ({comp.district}) • {comp.workModel}
                            </span>
                            {isDue && (
                              <span className="font-mono text-[10px] px-2 py-0.5 bg-amber-500 text-black font-bold">
                                ⏰ TAKİP ZAMANI GELDİ
                              </span>
                            )}
                          </div>
                          <h3 className="text-lg font-bold text-white mt-1">{comp.name}</h3>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                          <div>
                            <label className="block font-mono text-[10px] text-zinc-400 uppercase mb-1">
                              Başvuru Durumu
                            </label>
                            <select
                              value={comp.applicationStatus}
                              onChange={(e) =>
                                updateCompanyField(
                                  comp.id,
                                  "applicationStatus",
                                  e.target.value as ApplicationStatus
                                )
                              }
                              className="bg-zinc-900 border border-zinc-700 px-3 py-1.5 text-xs text-white font-mono focus:border-emerald-400"
                            >
                              {STATUS_OPTIONS.map((st) => (
                                <option key={st} value={st}>
                                  {st}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block font-mono text-[10px] text-zinc-400 uppercase mb-1">
                              Takip Tarihi
                            </label>
                            <input
                              type="date"
                              value={comp.followUpDate}
                              onChange={(e) =>
                                updateCompanyField(comp.id, "followUpDate", e.target.value)
                              }
                              className="bg-zinc-900 border border-zinc-700 px-3 py-1.5 text-xs text-white font-mono focus:border-emerald-400"
                            />
                          </div>

                          <button
                            onClick={() => {
                              setSelectedCompanyId(comp.id);
                              setActiveTab("evaluation");
                            }}
                            className="mt-4 px-3 py-1.5 bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 font-mono text-xs cursor-pointer"
                          >
                            Başvuru Metni & AI →
                          </button>

                          <button
                            onClick={() => toggleApproveCompany(comp.id)}
                            className="mt-4 px-2.5 py-1.5 border border-zinc-700 hover:border-red-400 text-zinc-400 hover:text-red-300 font-mono text-xs cursor-pointer"
                            title="Onaylı Listeden Çıkar"
                          >
                            Listeden Çıkar
                          </button>
                        </div>
                      </div>

                      {/* Middle row: Editable Contact, Website, Career Page, LinkedIn */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        <div className="bg-zinc-900/60 border border-zinc-800 p-2.5">
                          <div className="font-mono text-[10px] text-zinc-400 uppercase">
                            WEB SİTESİ
                          </div>
                          <div className="flex items-center justify-between gap-2 mt-1">
                            <input
                              type="text"
                              value={comp.website}
                              onChange={(e) =>
                                updateCompanyField(comp.id, "website", e.target.value)
                              }
                              className="bg-transparent text-xs font-mono text-cyan-300 w-full outline-none"
                            />
                            <a
                              href={comp.website}
                              target="_blank"
                              rel="noreferrer"
                              className="font-mono text-xs text-zinc-400 hover:text-white shrink-0"
                            >
                              Aç ↗
                            </a>
                          </div>
                        </div>

                        <div className="bg-zinc-900/60 border border-zinc-800 p-2.5">
                          <div className="font-mono text-[10px] text-zinc-400 uppercase">
                            KARİYER / İK SAYFASI
                          </div>
                          <div className="flex items-center justify-between gap-2 mt-1">
                            <input
                              type="text"
                              value={comp.careerUrl}
                              onChange={(e) =>
                                updateCompanyField(comp.id, "careerUrl", e.target.value)
                              }
                              className="bg-transparent text-xs font-mono text-emerald-300 w-full outline-none"
                            />
                            <a
                              href={comp.careerUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="font-mono text-xs text-zinc-400 hover:text-white shrink-0"
                            >
                              Kariyer ↗
                            </a>
                          </div>
                        </div>

                        <div className="bg-zinc-900/60 border border-zinc-800 p-2.5">
                          <div className="font-mono text-[10px] text-zinc-400 uppercase">
                            E-POSTA ADRESİ
                          </div>
                          <div className="flex items-center justify-between gap-2 mt-1">
                            <input
                              type="text"
                              value={comp.contactEmail}
                              onChange={(e) =>
                                updateCompanyField(comp.id, "contactEmail", e.target.value)
                              }
                              className="bg-transparent text-xs font-mono text-white w-full outline-none"
                            />
                            <a
                              href={`mailto:${comp.contactEmail}`}
                              className="font-mono text-xs text-amber-300 hover:underline shrink-0"
                            >
                              Mail ↗
                            </a>
                          </div>
                        </div>

                        <div className="bg-zinc-900/60 border border-zinc-800 p-2.5">
                          <div className="font-mono text-[10px] text-zinc-400 uppercase">
                            TELEFON & LINKEDIN
                          </div>
                          <div className="flex items-center justify-between gap-2 mt-1">
                            <input
                              type="text"
                              value={comp.contactPhone}
                              onChange={(e) =>
                                updateCompanyField(comp.id, "contactPhone", e.target.value)
                              }
                              className="bg-transparent text-xs font-mono text-white w-full outline-none"
                            />
                            <a
                              href={comp.linkedinUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="font-mono text-xs text-cyan-400 hover:underline shrink-0"
                            >
                              LinkedIn ↗
                            </a>
                          </div>
                        </div>
                      </div>

                      {/* Bottom row: Notes */}
                      <div>
                        <label className="block font-mono text-[10px] text-zinc-400 uppercase mb-1">
                          Başvuru & Görüşme Notları (Otomatik Kaydedilir)
                        </label>
                        <input
                          type="text"
                          value={comp.notes}
                          onChange={(e) => updateCompanyField(comp.id, "notes", e.target.value)}
                          placeholder="Görüşülen kişi, gönderilen portfolyo vaka çalışması veya geri dönüş notu..."
                          className="w-full bg-zinc-900/90 border border-zinc-800 focus:border-emerald-400 px-3 py-2 text-xs text-zinc-200 font-mono outline-none"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
