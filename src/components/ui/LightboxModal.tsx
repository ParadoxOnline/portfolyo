"use client";

import React, { useEffect, useState } from "react";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import type { Lang } from "@/providers/LangProvider";

interface LightboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  shots: string[];
  initialIndex: number;
  projectName: string;
  lang: Lang;
  accentColor?: string;
}

export default function LightboxModal({
  isOpen,
  onClose,
  shots,
  initialIndex,
  projectName,
  lang,
  accentColor = "#38bdf8",
}: LightboxModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex, isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, shots.length]);

  if (!isOpen || shots.length === 0) return null;

  const count = shots.length;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + count) % count);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % count);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    if (diff > 45) {
      handleNext();
    } else if (diff < -45) {
      handlePrev();
    }
    setTouchStart(null);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[1000] flex flex-col items-center justify-between bg-black/92 p-4 backdrop-blur-2xl animate-in fade-in duration-300 md:p-8 select-none"
      onClick={onClose}
    >
      {/* Üst Bar: Proje Adı, Sayaç ve Kapatma Butonu */}
      <div
        className="relative z-10 flex w-full max-w-6xl items-center justify-between border-b border-white/10 pb-4 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3">
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: accentColor, boxShadow: `0 0 10px ${accentColor}` }}
          />
          <h3 className="font-display text-lg font-bold tracking-tight md:text-xl">
            {projectName}
          </h3>
          <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 font-mono text-xs text-white/60">
            {currentIndex + 1} / {count}
          </span>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/70 transition hover:bg-white/15 hover:text-white"
          aria-label={lang === "az" ? "Bağla" : lang === "en" ? "Close" : "Kapat"}
        >
          <X size={18} />
        </button>
      </div>

      {/* Ana Görsel ve Sağ-Sol Gezinme */}
      <div
        className="relative my-auto flex h-full max-h-[82vh] w-full max-w-6xl items-center justify-center"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {count > 1 && (
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-[#080d1a]/85 text-white/80 shadow-2xl backdrop-blur-md transition hover:scale-105 hover:bg-white hover:text-black md:-left-6 md:h-13 md:w-13"
            aria-label={lang === "az" ? "Əvvəlki" : lang === "en" ? "Previous" : "Önceki"}
          >
            <ChevronLeft size={24} />
          </button>
        )}

        <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-2xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={shots[currentIndex]}
            alt={`${projectName} görseli ${currentIndex + 1}`}
            className="max-h-[80vh] w-auto max-w-full rounded-xl object-contain shadow-[0_25px_80px_rgba(0,0,0,0.9)] ring-1 ring-white/10 transition-all duration-300"
            draggable={false}
          />
        </div>

        {count > 1 && (
          <button
            type="button"
            onClick={handleNext}
            className="absolute right-2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-[#080d1a]/85 text-white/80 shadow-2xl backdrop-blur-md transition hover:scale-105 hover:bg-white hover:text-black md:-right-6 md:h-13 md:w-13"
            aria-label={lang === "az" ? "Növbəti" : lang === "en" ? "Next" : "Sonraki"}
          >
            <ChevronRight size={24} />
          </button>
        )}
      </div>

      {/* Alt Küçük Önizleme Şeridi (Thumbnails) */}
      {count > 1 && (
        <div
          className="relative z-10 flex max-w-full items-center gap-2 overflow-x-auto rounded-full border border-white/10 bg-black/60 p-2 backdrop-blur-xl"
          onClick={(e) => e.stopPropagation()}
        >
          {shots.map((src, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              className={`relative h-12 w-20 shrink-0 overflow-hidden rounded-lg border transition-all ${
                idx === currentIndex
                  ? "ring-2 scale-105"
                  : "opacity-50 hover:opacity-100"
              }`}
              style={{
                borderColor: idx === currentIndex ? accentColor : "rgba(255,255,255,0.15)",
                // @ts-ignore
                "--tw-ring-color": accentColor,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt=""
                className="h-full w-full object-cover"
                draggable={false}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

