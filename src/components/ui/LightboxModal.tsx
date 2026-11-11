"use client";

import React, { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
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
  accentColor = "#3b82f6",
}: LightboxModalProps) {
  const [currentIndex, setCurrentIndex] = useState(
    Math.min(Math.max(0, initialIndex), Math.max(0, shots.length - 1))
  );
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const count = shots.length;

  const handlePrev = useCallback(() => {
    if (count === 0) return;
    setCurrentIndex((prev) => (prev - 1 + count) % count);
  }, [count]);

  const handleNext = useCallback(() => {
    if (count === 0) return;
    setCurrentIndex((prev) => (prev + 1) % count);
  }, [count]);

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
  }, [isOpen, onClose, handlePrev, handleNext]);

  if (!isOpen || !mounted || shots.length === 0) return null;

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

  const currentImage = shots[currentIndex] || shots[0];

  const modalNode = (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[99999] flex flex-col justify-between bg-black/95 p-3 sm:p-6 backdrop-blur-2xl animate-in fade-in duration-200 select-none touch-none"
      onClick={onClose}
    >
      {/* Üst Bar: Proje Adı, Sayaç ve Kapatma Butonu */}
      <div
        className="relative z-10 flex w-full items-center justify-between border-b border-white/10 pb-3 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2.5">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: accentColor, boxShadow: `0 0 10px ${accentColor}` }}
          />
          <h3 className="font-display text-base font-bold tracking-tight sm:text-xl truncate max-w-[200px] sm:max-w-none">
            {projectName}
          </h3>
          <span className="rounded-full border border-white/15 bg-white/10 px-2.5 py-0.5 font-mono text-[11px] text-white/80">
            {currentIndex + 1} / {count}
          </span>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition active:scale-95"
          aria-label={lang === "az" ? "Bağla" : lang === "en" ? "Close" : "Kapat"}
        >
          <X size={20} />
        </button>
      </div>

      {/* Ana Görsel Alanı */}
      <div
        className="relative my-auto flex h-[72vh] w-full items-center justify-center overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {count > 1 && (
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-1 z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/70 text-white shadow-xl backdrop-blur-md transition active:scale-90 sm:left-4 sm:h-13 sm:w-13"
            aria-label={lang === "az" ? "Əvvəlki" : lang === "en" ? "Previous" : "Önceki"}
          >
            <ChevronLeft size={24} />
          </button>
        )}

        <div className="relative flex h-full w-full items-center justify-center p-1">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={currentImage}
            alt={`${projectName} ${currentIndex + 1}`}
            className="max-h-[68vh] w-auto max-w-full rounded-lg object-contain shadow-[0_10px_40px_rgba(0,0,0,0.9)] ring-1 ring-white/15"
            draggable={false}
          />
        </div>

        {count > 1 && (
          <button
            type="button"
            onClick={handleNext}
            className="absolute right-1 z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/70 text-white shadow-xl backdrop-blur-md transition active:scale-90 sm:right-4 sm:h-13 sm:w-13"
            aria-label={lang === "az" ? "Növbəti" : lang === "en" ? "Next" : "Sonraki"}
          >
            <ChevronRight size={24} />
          </button>
        )}
      </div>

      {/* Alt Küçük Önizleme Şeridi */}
      {count > 1 && (
        <div
          className="relative z-10 flex w-full justify-center overflow-x-auto py-1"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/60 px-3 py-1.5 backdrop-blur-xl">
            {shots.map((src, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`relative h-10 w-14 shrink-0 overflow-hidden rounded-md border transition-all ${
                  idx === currentIndex
                    ? "ring-2 scale-105"
                    : "opacity-40 hover:opacity-100"
                }`}
                style={{
                  borderColor: idx === currentIndex ? accentColor : "rgba(255,255,255,0.2)",
                  outlineColor: accentColor,
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
        </div>
      )}
    </div>
  );

  return createPortal(modalNode, document.body);
}
