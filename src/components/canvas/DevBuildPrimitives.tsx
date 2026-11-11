"use client";

import React from "react";

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

export interface CloneItemState {
  opacity: number;
  offsetX: number;
  offsetY: number;
  scale: number;
  displayText: string;
  isCloning: boolean;
  isRenaming: boolean;
  isDone: boolean;
  badgeText: string | null;
}

/**
 * Bir yazılımcının 1 butonu/kartı oluşturup yan yana çoğaltması (Alt+Drag / Ctrl+D)
 * ve ardından çoğaltılan kopyaların isimlerini tek tek seçip değiştirmesi (Rename) mekaniği.
 */
export function getCloneAndRenameState(
  localP: number,
  index: number,
  total: number,
  realText: string,
  templateText: string,
  spreadPx = 88
): CloneItemState {
  if (localP <= 0.01) {
    return {
      opacity: 0,
      offsetX: 0,
      offsetY: 10,
      scale: 0.9,
      displayText: templateText,
      isCloning: false,
      isRenaming: false,
      isDone: false,
      badgeText: null,
    };
  }

  if (localP >= 0.96) {
    return {
      opacity: 1,
      offsetX: 0,
      offsetY: 0,
      scale: 1,
      displayText: realText,
      isCloning: false,
      isRenaming: false,
      isDone: true,
      badgeText: null,
    };
  }

  // 1. AŞAMA (0.01 .. 0.16): İlk (ana) buton/kart oluşturulur
  if (index === 0) {
    const spawnP = clamp01((localP - 0.01) / 0.15);
    const renameZeroP = clamp01((localP - 0.36) / 0.14);
    const isRenaming0 = localP >= 0.36 && localP < 0.50 && templateText !== realText;
    const text0 =
      templateText === realText || localP >= 0.50
        ? realText
        : isRenaming0
        ? realText.slice(0, Math.max(1, Math.ceil(realText.length * renameZeroP)))
        : templateText;

    return {
      opacity: spawnP,
      offsetX: 0,
      offsetY: (1 - spawnP) * 10,
      scale: 0.92 + 0.08 * spawnP,
      displayText: text0,
      isCloning: localP > 0.14 && localP < 0.42,
      isRenaming: isRenaming0,
      isDone: localP >= 0.50,
      badgeText:
        localP > 0.14 && localP < 0.38
          ? `Alt+Çoğalt (×${total})`
          : isRenaming0
          ? "İsim düzenleniyor"
          : null,
    };
  }

  // 2. AŞAMA (0.14 .. 0.44): Diğer butonlar/kartlar 1. elemandan sağa doğru kopyalanarak (çoğaltılarak) çıkar!
  const cloneStart = 0.12 + ((index - 1) / Math.max(1, total - 1)) * 0.14;
  const cloneP = clamp01((localP - cloneStart) / 0.18);

  if (cloneP <= 0) {
    return {
      opacity: 0,
      offsetX: -index * spreadPx,
      offsetY: 0,
      scale: 0.9,
      displayText: templateText,
      isCloning: false,
      isRenaming: false,
      isDone: false,
      badgeText: null,
    };
  }

  // Ease-out cubic ile 1. elemandan kendi konumuna kayma
  const easeClone = 1 - Math.pow(1 - cloneP, 3);
  const offsetX = (1 - easeClone) * -index * spreadPx;
  const isCloning = cloneP < 0.98 && localP < 0.48;

  // 3. AŞAMA (0.46 .. 0.94): Çoğaltılan her kopyanın ismi sırayla seçilip gerçek ismine değiştirilir!
  const slotSpan = 0.48 / Math.max(1, total - 1);
  const renameStart = 0.45 + (index - 1) * slotSpan;
  const renameEnd = renameStart + slotSpan;
  const renameP = clamp01((localP - renameStart) / Math.max(0.04, slotSpan));
  const isRenaming = localP >= renameStart && localP < renameEnd;
  const isDone = localP >= renameEnd;

  let displayText = templateText;
  if (isDone) {
    displayText = realText;
  } else if (isRenaming) {
    if (renameP < 0.32) {
      // Önce eski kopya metni seçili görünür
      displayText = templateText;
    } else {
      const typeRatio = (renameP - 0.32) / 0.68;
      const chars = Math.max(1, Math.ceil(realText.length * typeRatio));
      displayText = realText.slice(0, chars);
    }
  }

  return {
    opacity: Math.min(1, cloneP * 1.35),
    offsetX,
    offsetY: isCloning ? -3 : 0,
    scale: isRenaming ? 1.03 : 1,
    displayText,
    isCloning,
    isRenaming,
    isDone,
    badgeText: isCloning
      ? `Kopya #${index + 1}`
      : isRenaming
      ? "Yeniden adlandır"
      : null,
  };
}

/**
 * Gerçekçi 2 Eksenli (Önce Yatay Width, Sonra Dikey Height) Çerçeve Boyutlandırma Durumu:
 * - localP = 0.00 .. 0.45: Önce yatayda (width: %22 -> %100) sağ kenardan çekilerek genişletilir, yükseklik ince şerit (%14) kalır.
 * - localP = 0.45 .. 0.86: Sonra dikeyde (height: %14 -> %100) alt kenardan aşağı çekilerek yükseltilir.
 * - localP = 0.86 .. 1.00: İçerik ve 3D derinlik/parlaklık oturtulur.
 */
export function getTwoAxisBoxState(
  localP: number,
  targetWidthPx: number,
  targetHeightPx: number
) {
  const p = clamp01(localP);
  const horizP = clamp01(p / 0.44);
  const vertP = clamp01((p - 0.42) / 0.42);
  const contentP = clamp01((p - 0.72) / 0.28);

  const easeHoriz = 1 - Math.pow(1 - horizP, 3);
  const easeVert = 1 - Math.pow(1 - vertP, 3);

  const widthPct = 22 + 78 * easeHoriz;
  const heightPct = 14 + 86 * easeVert;

  const currentW = Math.round(targetWidthPx * (widthPct / 100));
  const currentH = Math.round(targetHeightPx * (heightPct / 100));

  const stage: "idle" | "horizontal" | "vertical" | "polish" | "done" =
    p <= 0.01
      ? "idle"
      : p < 0.44
      ? "horizontal"
      : p < 0.84
      ? "vertical"
      : p < 0.98
      ? "polish"
      : "done";

  return {
    visible: p > 0.01,
    stage,
    widthPct,
    heightPct,
    currentW,
    currentH,
    contentP,
    isResizingHoriz: stage === "horizontal",
    isResizingVert: stage === "vertical",
    isWireframe: p > 0.01 && p < 0.92,
  };
}

/**
 * Önce Yatay (Width) Sonra Dikey (Height) İmleçlerle Çekilerek Genişletilen Profesyonel Sahne Kutusu
 */
export function TwoAxisResizeFrame({
  localP,
  targetWidthPx = 820,
  targetHeightPx = 460,
  accentColor = "#3b82f6",
  className = "",
  role = "media",
  children,
}: {
  localP: number;
  targetWidthPx?: number;
  targetHeightPx?: number;
  accentColor?: string;
  className?: string;
  role?: string;
  children: React.ReactNode;
}) {
  const box = getTwoAxisBoxState(localP, targetWidthPx, targetHeightPx);

  // Tutarlı clip-path ile önce yatay (sağa doğru), sonra dikey (aşağı doğru) açılım!
  const rightInset = Math.max(0, 100 - box.widthPct);
  const bottomInset = Math.max(0, 100 - box.heightPct);

  return (
    <div
      data-build-role={role}
      className={`relative ${className}`}
      style={{
        opacity: box.visible ? 1 : 0,
        pointerEvents: localP < 0.75 ? "none" : "auto",
      }}
    >
      {/* AKTİF İNŞA ESNASINDA GÖRÜNEN KESİKLİ TEL KAFES (CAD WIREFRAME) VE TUTAMAÇLAR */}
      {box.isWireframe && (
        <div
          className="pointer-events-none absolute left-0 top-0 z-40 transition-none"
          style={{
            width: `${box.widthPct.toFixed(1)}%`,
            height: `${box.heightPct.toFixed(1)}%`,
            border: `1.5px dashed ${accentColor}`,
            backgroundColor:
              box.contentP < 0.5 ? `${accentColor}10` : "transparent",
            boxShadow: `0 0 28px ${accentColor}22`,
          }}
        >
          {/* Sol Üst Sabit Köşe Çapası */}
          <span
            data-build-role="frame-nw"
            className="absolute -left-1.5 -top-1.5 h-3 w-3 border-2 bg-[#050811]"
            style={{ borderColor: accentColor }}
          />

          {/* SAĞ KENAR YATAY ÇEKME TUTAMACI (Önce Yatay Genişletme Aşamasında Parlar) */}
          <span
            data-resize-handle="right"
            className="absolute -right-2 top-1/2 flex h-7 w-3.5 -translate-y-1/2 items-center justify-center rounded-sm border bg-[#070b14] shadow-md"
            style={{
              borderColor: box.isResizingHoriz ? "#ffffff" : accentColor,
              boxShadow: box.isResizingHoriz ? `0 0 16px ${accentColor}` : "none",
              transform: `translateY(-50%) scale(${box.isResizingHoriz ? 1.25 : 0.9})`,
            }}
          >
            <span className="h-3 w-0.5 bg-white/80" />
          </span>

          {/* ALT KENAR DİKEY ÇEKME TUTAMACI (Sonra Dikey Genişletme Aşamasında Parlar) */}
          <span
            data-resize-handle="bottom"
            className="absolute -bottom-2 left-1/2 flex h-3.5 w-7 -translate-x-1/2 items-center justify-center rounded-sm border bg-[#070b14] shadow-md"
            style={{
              borderColor: box.isResizingVert ? "#ffffff" : accentColor,
              boxShadow: box.isResizingVert ? `0 0 16px ${accentColor}` : "none",
              transform: `translateX(-50%) scale(${box.isResizingVert ? 1.25 : 0.9})`,
            }}
          >
            <span className="h-0.5 w-3 bg-white/80" />
          </span>

          {/* Sağ Alt Köşe Çapası */}
          <span
            data-build-role="frame-se"
            className="absolute -bottom-1.5 -right-1.5 h-3 w-3 border-2 bg-[#050811]"
            style={{ borderColor: accentColor }}
          />

          {/* Üst Yatay Cetvel */}
          <div
            className="absolute -top-7 left-0 flex w-full items-center justify-between font-mono text-[10px] tabular-nums tracking-wider"
            style={{ color: accentColor }}
          >
            <span className="rounded bg-[#060a12]/90 px-1.5 py-0.5 border border-white/10">
              {box.currentW} × {box.currentH}px
            </span>
            <span className="hidden sm:inline">
              {Math.round(box.widthPct)}% × {Math.round(box.heightPct)}%
            </span>
          </div>
        </div>
      )}

      {/* Gerçek İçerik: Önce yatayda sağa, sonra dikeyde aşağı doğru kesilerek açılır */}
      <div
        style={{
          clipPath:
            localP >= 0.96
              ? "none"
              : `inset(-24px ${rightInset.toFixed(1)}% ${bottomInset.toFixed(1)}% -24px round 16px)`,
          filter:
            box.contentP < 0.85
              ? `grayscale(${(1 - box.contentP) * 0.7}) brightness(${0.55 + box.contentP * 0.45})`
              : "none",
          transition: "filter 200ms ease",
        }}
      >
        {children}
      </div>
    </div>
  );
}

