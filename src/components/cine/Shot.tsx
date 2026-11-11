"use client";

import React from "react";

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

interface ShotProps {
  slug: string;
  name: string;
  src?: string;
  label?: string;
  className?: string;
}

/** Gerçek ekran görüntüsü varsa onu, yoksa şık bir önizleme posteri gösterir. */
export default function Shot({ slug, name, src, label, className = "" }: ShotProps) {
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={src}
        alt={`${name} ekran görüntüsü`}
        loading="lazy"
        draggable={false}
        className={`h-full w-full object-cover object-top ${className}`}
      />
    );
  }

  const h = hash(slug);
  const hue = 215 + (h % 12);
  const hue2 = 220 + ((h >> 3) % 10);
  return (
    <div
      className={`relative h-full w-full overflow-hidden ${className}`}
      style={{
        background: `radial-gradient(120% 90% at 20% 0%, hsl(${hue} 55% 20% / .85), transparent 60%), radial-gradient(90% 80% at 100% 100%, hsl(${hue2} 45% 16% / .8), transparent 55%), #090b0f`,
      }}
    >
      <div className="absolute inset-0 grid grid-cols-[18%_1fr] gap-3 p-4 opacity-60">
        <div className="flex flex-col gap-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="h-2 rounded-full bg-white/15" style={{ width: `${55 + ((h >> i) % 40)}%` }} />
          ))}
        </div>
        <div className="flex flex-col gap-3">
          <div className="h-3 w-1/3 rounded-full bg-white/25" />
          <div className="grid grid-cols-3 gap-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-16 rounded-lg border border-white/10 bg-white/[0.06]" />
            ))}
          </div>
          <div className="flex-1 rounded-lg border border-white/10 bg-white/[0.04]" />
        </div>
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/25 text-center">
        <span className="font-display text-3xl font-bold tracking-tight text-white md:text-5xl">{name}</span>
        {label && <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/50">{label}</span>}
      </div>
    </div>
  );
}

