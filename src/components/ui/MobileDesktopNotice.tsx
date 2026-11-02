"use client";

import React, { useEffect, useState } from "react";
import { Monitor, X } from "lucide-react";
import { useLang } from "@/providers/LangProvider";

const POPUP_TEXT = {
  tr: {
    badge: "MİMARİ DENEYİM UYARISI",
    title: "Masaüstünde Deneyimleyin",
    desc: "Bu portfolyo; çoklu imleç animasyonları, 3D etkileşimli sahneler ve el çizimi mimari eskizler barındırır. En kusursuz deneyim için masaüstü veya geniş bir ekrandan ziyaret etmenizi öneririm.",
    action: "Anladım, devam et",
  },
  az: {
    badge: "MEMARLIQ TƏCRÜBƏSİ XƏBƏRDARLIĞI",
    title: "Masaüstü Ekranda İzləyin",
    desc: "Bu portfel; çoxsaylı kursor animasiyaları, 3D interaktiv səhnələr və əl eskizləri ehtiva edir. Ən mükəmməl təcrübə üçün masaüstü və ya geniş ekrandan daxil olmağınız tövsiyə olunur.",
    action: "Anladım, davam et",
  },
  en: {
    badge: "OPTIMAL EXPERIENCE NOTICE",
    title: "Best Viewed on Desktop",
    desc: "This portfolio features multi-cursor collaborative animations, interactive 3D viewports, and hand-drawn architecture sketches. For the intended experience, viewing on a desktop display is highly recommended.",
    action: "Got it, continue",
  },
};

export default function MobileDesktopNotice() {
  const { lang } = useLang();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Sadece mobil ve dar ekranlarda (width < 768px) ve daha önce bu oturumda kapatılmamışsa göster
    const isMobileViewport = window.innerWidth < 768;
    const isDismissed = sessionStorage.getItem("mobile_desktop_notice_dismissed");

    if (isMobileViewport && !isDismissed) {
      // Sayfa açıldıktan kısa bir süre sonra yumuşakça belirsin
      const timer = setTimeout(() => {
        setVisible(true);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    setVisible(false);
    sessionStorage.setItem("mobile_desktop_notice_dismissed", "true");
  };

  if (!visible) return null;

  const t = POPUP_TEXT[lang] ?? POPUP_TEXT.tr;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t.title}
      className="fixed inset-x-4 bottom-5 z-[999] md:hidden animate-in fade-in slide-in-from-bottom-6 duration-300"
    >
      <div className="relative overflow-hidden rounded-2xl border border-sky-400/35 bg-[#060b14]/95 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.85),0_0_35px_rgba(56,189,248,0.22)] backdrop-blur-xl">
        {/* Üstte parlayan neon çizgi */}
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-sky-400 to-transparent" />

        {/* Sağ üst kapatma butonu */}
        <button
          type="button"
          onClick={handleDismiss}
          className="absolute right-3.5 top-3.5 flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/60 transition hover:bg-white/10 hover:text-white"
          aria-label="Kapat"
        >
          <X size={15} />
        </button>

        <div className="flex items-start gap-3.5 pr-6">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-sky-400/30 bg-sky-400/10 text-sky-300 shadow-[0_0_15px_rgba(56,189,248,0.35)]">
            <Monitor size={20} />
          </div>

          <div>
            <span className="font-mono text-[9.5px] font-semibold uppercase tracking-[0.2em] text-sky-300/90">
              {t.badge}
            </span>
            <h4 className="mt-0.5 font-display text-[17px] font-bold tracking-tight text-white">
              {t.title}
            </h4>
          </div>
        </div>

        <p className="mt-2.5 text-[13px] leading-relaxed text-slate-300/85">
          {t.desc}
        </p>

        <div className="mt-4 flex items-center justify-end">
          <button
            type="button"
            onClick={handleDismiss}
            className="w-full rounded-xl border border-sky-400/40 bg-sky-400/15 py-2.5 text-center font-mono text-[12px] font-semibold tracking-wide text-sky-200 transition hover:bg-sky-400/25 active:scale-[0.98]"
          >
            {t.action}
          </button>
        </div>
      </div>
    </div>
  );
}

