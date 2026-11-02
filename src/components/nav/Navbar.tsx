"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLang } from "@/providers/LangProvider";
import { copy } from "@/data/showcase";
import { LangToggle } from "@/components/cine/Fx";
import { useStageBuild } from "@/components/canvas/LiveBuilderSystem";
import { clamp01, getCloneAndRenameState } from "@/components/canvas/DevBuildPrimitives";

export default function Navbar() {
  const { lang } = useLang();
  const pathname = usePathname();
  const t = copy[lang].nav;
  const { progress } = useStageBuild("hero-stage", "#38bdf8");

  const isHome = pathname === "/";
  const phase1 = !isHome ? 1 : clamp01((progress - 0.13) / 0.15);
  const navOpacity = !isHome ? 1 : clamp01((progress - 0.13) / 0.05);
  const navTranslateY = !isHome ? 0 : (1 - navOpacity) * -18;

  const navItems = [
    { href: "/#work", label: t.work },
    { href: "/#career", label: lang === "az" ? "Təcrübə" : lang === "tr" ? "Deneyim" : "Experience" },
    { href: "/#contact", label: t.contact },
  ];

  const templateLabel = lang === "az" ? "Düymə_01" : lang === "tr" ? "Buton_01" : "Button_01";

  return (
    <nav
      className="fixed left-0 top-0 z-50 w-full transition-opacity duration-200"
      style={{
        opacity: navOpacity,
        transform: `translate3d(0, ${navTranslateY.toFixed(1)}px, 0)`,
        pointerEvents: phase1 < 0.8 ? "none" : "auto",
      }}
    >
      <div className="mx-auto mt-5 flex h-13 max-w-[1480px] items-center justify-between px-6 md:px-12">
        <Link
          href="/"
          className="group flex items-center gap-3 rounded-full border border-white/10 bg-[#070b14]/75 px-4 py-2 backdrop-blur-xl transition hover:border-white/25"
        >
          <span className="h-2 w-2 rounded-full bg-sky-400 shadow-[0_0_12px_#38bdf8]" />
          <span className="font-display text-sm font-bold tracking-tight text-white">
            SABRİ CAN TÜTÜNCÜ
          </span>
        </Link>

        {/* ORTA MENÜ: İlk buton oluşturulur, sağa doğru 3'e çoğaltılır ve sırayla isimleri değiştirilir! */}
        <div
          data-nav-clone-group="true"
          className="hidden items-center gap-1 rounded-full border border-white/10 bg-[#070b14]/75 p-1.5 backdrop-blur-xl md:flex"
        >
          {navItems.map((item, idx) => {
            const st = getCloneAndRenameState(
              phase1,
              idx,
              navItems.length,
              item.label,
              templateLabel,
              76
            );

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative rounded-full px-4 py-1.5 text-xs font-medium tracking-wide transition ${
                  st.isRenaming
                    ? "bg-sky-500/25 text-sky-200 ring-1 ring-sky-400"
                    : st.isCloning
                    ? "border border-dashed border-sky-400/60 bg-sky-400/10 text-sky-200"
                    : "text-white/75 hover:bg-white/[0.07] hover:text-white"
                }`}
                style={{
                  opacity: st.opacity,
                  transform: `translate3d(${st.offsetX.toFixed(1)}px, ${st.offsetY.toFixed(1)}px, 0) scale(${st.scale})`,
                }}
              >
                <span>{st.displayText}</span>
                {st.badgeText && (
                  <span className="pointer-events-none absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-sky-500/90 px-1.5 py-0.5 font-mono text-[9px] font-semibold text-slate-950 shadow">
                    {st.badgeText}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        <div className="rounded-full border border-white/10 bg-[#070b14]/75 p-1 backdrop-blur-xl">
          <LangToggle />
        </div>
      </div>
    </nav>
  );
}
