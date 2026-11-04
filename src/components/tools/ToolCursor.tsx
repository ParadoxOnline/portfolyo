"use client";

/**
 * Araç imleci.
 *
 * Üç katmanlı etkileşim:
 *  1) Senin imlecin: araca göre şekil değiştirir (nişangâh, döner radar, düğüm ağı, "Aa",
 *     kadraj köşeleri, süslü parantez). Düğme, sekme ve bağlantıların etrafına mıknatıs gibi
 *     sarılır; tıklamada dalga bırakır.
 *  2) Operatör imleç: işlem başladığında senin imlecinden doğar, sahneye iner ve araca özgü
 *     koreografiyle işi yürütür; kod kopyalanırken kodu baştan sona tarayıp mühürler; şema
 *     formunda yazarken sağdaki çıktı bloğunu canlı dokur.
 *  3) Yardımcı sonda (probe) imleci: tarama, radar, DNS, font ve görsel sıkıştırma sırasında
 *     operatör imlecin karşısında ikinci bir el gibi çalışır (kumpas ölçümü, radar hedef
 *     yakalama, yetkili ad sunucusunda paket karşılama, harf aralığı ölçümü, karşı köşeden
 *     kadraj sıkıştırma).
 */

import React, { useEffect, useRef } from "react";

export type ToolKind = "scan" | "radar" | "dns" | "font" | "image" | "schema";

interface BeginOpts {
  anchor?: HTMLElement | null;
  stage?: "below" | "inside";
}

interface Impl {
  begin(o: BeginOpts): void;
  progress(p: number): void;
  end(ok: boolean): void;
  emit(label: string): void;
  stamp(el: HTMLElement | null, label?: string, sel?: HTMLElement | null): void;
  attend(el: HTMLElement | null): void;
  hold(on: boolean): void;
}

let impl: Impl | null = null;

/** Sayfalardan çağrılan kumanda. Dokunmatik cihazda veya hareket azaltma açıkken sessiz kalır. */
export const toolCursor = {
  begin: (o: BeginOpts = {}) => impl?.begin(o),
  progress: (p: number) => impl?.progress(p),
  end: (ok = true) => impl?.end(ok),
  emit: (label: string) => impl?.emit(label),
  stamp: (el: HTMLElement | null, label?: string, sel?: HTMLElement | null) => impl?.stamp(el, label, sel),
  attend: (el: HTMLElement | null) => impl?.attend(el),
  hold: (on: boolean) => impl?.hold(on),
};

const NAMES: Record<ToolKind, string> = {
  scan: "Tarayıcı",
  radar: "Radar",
  dns: "Çözümleyici",
  font: "Dizgici",
  image: "Sıkıştırıcı",
  schema: "Yazıcı",
};

const PROBE_NAMES: Record<ToolKind, string> = {
  scan: "Ölçüm",
  radar: "İzleyici",
  dns: "Yetkili NS",
  font: "Kumpas",
  image: "Kadraj",
  schema: "Doğrulayıcı",
};

const SKY = "125,211,252";
const EMERALD = "52,211,153";
const ROSE = "251,113,133";

type Rect = { x: number; y: number; w: number; h: number };
type Phase = "idle" | "enter" | "work" | "finish" | "exit" | "stamp" | "attend";

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const damp = (a: number, b: number, rate: number, dt: number) => lerp(a, b, 1 - Math.exp(-rate * dt));
const ease = (t: number) => {
  const x = clamp(t, 0, 1);
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
};
const easeOut = (t: number) => 1 - Math.pow(1 - clamp(t, 0, 1), 3);
const hash = (n: number) => {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};

const INTERACTIVE =
  'button, a[href], [role="tab"], [role="radio"], summary, input[type="range"], input[type="checkbox"], input[type="radio"], [data-cursor]';
const TEXTUAL =
  'input:not([type="range"]):not([type="checkbox"]):not([type="radio"]):not([type="file"]), textarea, select, [contenteditable="true"]';

const DNS_TYPES = ["A", "AAAA", "MX", "SPF", "DMARC", "NS"];
const SCAN_LAYERS = ["HTTP/TLS", "HEAD & Meta", "H1–H3 & DOM", "Görsel & CLS", "JSON-LD", "Güvenlik"];
const RADAR_BLIPS: Array<{ label: string; angle: number; dist: number }> = [
  { label: "GPTBot", angle: 0.45, dist: 0.72 },
  { label: "ClaudeBot", angle: 1.65, dist: 0.54 },
  { label: "Perplexity", angle: 2.85, dist: 0.82 },
  { label: "Gemini", angle: 4.1, dist: 0.63 },
  { label: "Applebot", angle: 5.35, dist: 0.44 },
];
const FONT_CHARS = "AaĞğŞşİıÖöÇçGgRrQq";

/* ───────── Senin imlecinin şekilleri ───────── */

function Shapes({ tool }: { tool: ToolKind }) {
  switch (tool) {
    case "scan":
      return (
        <>
          <circle cx="14" cy="14" r="5.5" />
          <path d="M14 2.5V8M14 20v5.5M2.5 14H8M20 14h5.5" />
          <circle cx="14" cy="14" r="1.1" fill="currentColor" stroke="none" />
        </>
      );
    case "radar":
      return (
        <>
          <circle cx="14" cy="14" r="3.6" />
          <circle cx="14" cy="14" r="9" strokeDasharray="2 3.2" />
          <g className="tc-spin">
            <path d="M14 14V3.2" />
          </g>
        </>
      );
    case "dns":
      return (
        <>
          <path d="M6 20.5L14 7.5L22 20.5ZM6 20.5" />
          <circle cx="6" cy="20.5" r="2.4" fill="currentColor" stroke="none" />
          <circle cx="14" cy="7.5" r="2.4" fill="currentColor" stroke="none" />
          <circle cx="22" cy="20.5" r="2.4" fill="currentColor" stroke="none" />
        </>
      );
    case "font":
      return (
        <text x="14" y="19.5" textAnchor="middle" fontSize="15" fontWeight="700" fill="currentColor" stroke="none" fontFamily="ui-sans-serif, system-ui">
          Aa
        </text>
      );
    case "image":
      return (
        <>
          <path d="M4.5 10V4.5H10M18 4.5h5.5V10M23.5 18v5.5H18M10 23.5H4.5V18" />
          <rect x="10.5" y="11" width="7" height="6" rx="1" strokeDasharray="1.6 2" />
        </>
      );
    case "schema":
    default:
      return (
        <>
          <path d="M10.5 4.5c-3 0-3.2 2-3.2 4v3c0 2-1.8 2.5-3.3 2.5 1.5 0 3.3.5 3.3 2.5v3c0 2 .2 4 3.2 4" />
          <path d="M17.5 4.5c3 0 3.2 2 3.2 4v3c0 2 1.8 2.5 3.3 2.5-1.5 0-3.3.5-3.3 2.5v3c0 2-.2 4-3.2 4" />
        </>
      );
  }
}

function PointerGlyph({ tool }: { tool: ToolKind }) {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" strokeLinecap="round" strokeLinejoin="round" overflow="visible">
      <g stroke="#04060a" strokeWidth="3.6" opacity="0.9" color="#04060a">
        <Shapes tool={tool} />
      </g>
      <g stroke="#7dd3fc" strokeWidth="1.5" color="#7dd3fc">
        <Shapes tool={tool} />
      </g>
    </svg>
  );
}

/* ───────── Katman ───────── */

export function ToolCursorLayer({ tool }: { tool: ToolKind }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const glyphRef = useRef<HTMLDivElement>(null);
  const opRef = useRef<HTMLDivElement>(null);
  const tagRef = useRef<HTMLSpanElement>(null);
  const probeRef = useRef<HTMLDivElement>(null);
  const probeTagRef = useRef<HTMLSpanElement>(null);
  const fxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = canvasRef.current;
    const ring = ringRef.current;
    const glyph = glyphRef.current;
    const op = opRef.current;
    const tag = tagRef.current;
    const probe = probeRef.current;
    const probeTag = probeTagRef.current;
    const fxLayer = fxRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ring || !glyph || !op || !tag || !probe || !probeTag || !fxLayer || !ctx) return;

    const baseTag = NAMES[tool];
    const baseProbeTag = PROBE_NAMES[tool];
    probeTag.textContent = baseProbeTag;

    const fontFamily =
      getComputedStyle(document.body).getPropertyValue("--font-display-grotesk").trim() || "ui-sans-serif, system-ui";
    const html = document.documentElement;

    /* durum */
    let W = 0;
    let H = 0;
    let dpr = 1;
    let mx = -100;
    let my = -100;
    let px = -100;
    let py = -100;
    let moved = false;
    let pressed = false;
    let held = false;
    let overText = false;
    let hoverEl: Element | null = null;
    let pulse = 0;
    const rc = { x: -100, y: -100, w: 30, h: 30, r: 15 };

    let ph: Phase = "idle";
    let pt = 0;
    let wt = 0;
    let anchor: HTMLElement | null = null;
    let stageMode: "below" | "inside" = "below";
    let prog: number | null = null;
    let okFlag = true;

    // Birincil operatör imleç
    let ox = -100;
    let oy = -100;
    let lastOx = -100;
    let oScale = 0;
    let oAlpha = 0;
    let rot = 0;
    let exitFromX = 0;
    let exitFromY = 0;

    // İkincil yardımcı sonda (probe) imleç
    let bx = -100;
    let by = -100;
    let lastBx = -100;
    let bRot = 0;

    let stampEl: HTMLElement | null = null;
    let stampSel: HTMLElement | null = null;
    let stampLabel = "";
    let stampStart = { x: 0, y: 0 };
    let stampChipped = false;
    let attendEl: HTMLElement | null = null;
    let lastTagText = "";

    const stamps: Array<{ x: number; y: number; ch: string; w: number; age: number }> = [];
    const parts: Array<{ x: number; y: number; vy: number; age: number }> = [];
    let stampTimer = 0;
    let partTimer = 0;
    let canvasDirty = false;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
    };
    resize();

    /* ───── yardımcılar ───── */

    const stageRect = (): Rect => {
      const a = anchor?.getBoundingClientRect();
      if (!a) return { x: W / 2 - 280, y: H / 2 - 120, w: 560, h: 240 };
      if (stageMode === "inside") return { x: a.left, y: a.top, w: a.width, h: a.height };
      const top = a.bottom + 16;
      const h = Math.min(380, H - top - 24);
      if (h < 140) return { x: a.left, y: a.top, w: a.width, h: a.height };
      return { x: a.left, y: top, w: a.width, h };
    };

    const radarR = (R: Rect) => clamp(Math.min(R.w, R.h) / 2 - 8, 40, 150);
    const dnsNodes = (R: Rect) => [0.14, 0.5, 0.86].map((f) => ({ x: R.x + R.w * f, y: R.y + R.h * 0.55 }));

    const choreo = (R: Rect, t: number): { x: number; y: number } => {
      switch (tool) {
        case "scan": {
          const u = (t / 2.6) % 1;
          const yN = u < 0.5 ? u * 2 : 2 - u * 2;
          return { x: R.x + R.w * (0.28 + 0.22 * Math.sin(t * 2.3)), y: R.y + 10 + yN * (R.h - 20) };
        }
        case "radar": {
          const r0 = radarR(R);
          const a = t * 2.4;
          return { x: R.x + R.w / 2 + Math.cos(a) * r0 * 0.9, y: R.y + R.h / 2 + Math.sin(a) * r0 * 0.9 };
        }
        case "dns": {
          const n = dnsNodes(R);
          const seq = [0, 1, 2, 1];
          const leg = Math.floor(t / 0.85) % 4;
          const u = ease((t % 0.85) / 0.85);
          const a = n[seq[leg]];
          const b = n[seq[(leg + 1) % 4]];
          return { x: lerp(a.x, b.x, u), y: lerp(a.y, b.y, u) - Math.sin(Math.PI * u) * 30 };
        }
        case "font":
          return {
            x: R.x + R.w * (0.12 + 0.76 * ((t / 3.2) % 1)),
            y: R.y + R.h * 0.5 + Math.sin(t * 3.1) * R.h * 0.16,
          };
        case "image": {
          const fw = Math.min(R.w * 0.45, 240);
          const fh = fw * 0.62;
          const s = prog === null ? 0.19 + 0.19 * Math.sin(t * 2.2) : prog * 0.38;
          const k = 1 - s;
          return { x: R.x + R.w / 2 + (fw * k) / 2, y: R.y + R.h / 2 + (fh * k) / 2 };
        }
        default:
          return { x: R.x + R.w / 2, y: R.y + R.h / 2 };
      }
    };

    /** Yardımcı sonda imlecinin konumu: hiç beklemeden birincil operatörle eşzamanlı karşı koreografi yürütür. */
    const probeChoreo = (R: Rect, t: number): { x: number; y: number } => {
      switch (tool) {
        case "scan": {
          const u = ((t + 1.3) / 2.6) % 1;
          const yN = u < 0.5 ? u * 2 : 2 - u * 2;
          return {
            x: R.x + R.w * (0.74 - 0.22 * Math.cos(t * 2.7)),
            y: R.y + 10 + yN * (R.h - 20),
          };
        }
        case "radar": {
          const r0 = radarR(R);
          const a = -t * 1.85 + 1.2;
          const rad = r0 * (0.58 + 0.22 * Math.sin(t * 3.1));
          return {
            x: R.x + R.w / 2 + Math.cos(a) * rad,
            y: R.y + R.h / 2 + Math.sin(a) * rad,
          };
        }
        case "dns": {
          const n = dnsNodes(R);
          const seq = [2, 1, 0, 1];
          const leg = Math.floor(t / 0.85) % 4;
          const u = ease((t % 0.85) / 0.85);
          const a = n[seq[leg]];
          const b = n[seq[(leg + 1) % 4]];
          return {
            x: lerp(a.x, b.x, u),
            y: lerp(a.y, b.y, u) + Math.sin(Math.PI * u) * 30,
          };
        }
        case "font": {
          const u = (1 - ((t / 3.2) % 1));
          return {
            x: R.x + R.w * (0.12 + 0.76 * u),
            y: R.y + R.h * 0.34 + Math.cos(t * 3.4) * R.h * 0.12,
          };
        }
        case "image": {
          const fw = Math.min(R.w * 0.45, 240);
          const fh = fw * 0.62;
          const s = prog === null ? 0.19 + 0.19 * Math.sin(t * 2.2) : prog * 0.38;
          const k = 1 - s;
          return {
            x: R.x + R.w / 2 - (fw * k) / 2 + Math.cos(t * 4) * 6,
            y: R.y + R.h / 2 - (fh * k) / 2 + Math.sin(t * 4) * 6,
          };
        }
        default:
          return {
            x: R.x + R.w / 2 + Math.cos(t * 2.5) * 48,
            y: R.y + R.h / 2 + Math.sin(t * 2.5) * 28,
          };
      }
    };

    const setTag = (text: string) => {
      if (text !== lastTagText) {
        tag.textContent = text;
        lastTagText = text;
      }
    };

    const chip = (text: string, x: number, y: number, rose = false) => {
      const el = document.createElement("div");
      el.textContent = text;
      el.style.cssText = `position:absolute;left:0;top:0;white-space:nowrap;font:600 11px ui-monospace,SFMono-Regular,monospace;color:#04060a;background:rgb(${
        rose ? ROSE : SKY
      });padding:3px 8px;border-radius:4px;opacity:0;will-change:transform,opacity;`;
      fxLayer.appendChild(el);
      const a = el.animate(
        [
          { transform: `translate3d(${x + 10}px,${y + 8}px,0)`, opacity: 0 },
          { transform: `translate3d(${x + 10}px,${y - 6}px,0)`, opacity: 1, offset: 0.16 },
          { transform: `translate3d(${x + 10}px,${y - 46}px,0)`, opacity: 0 },
        ],
        { duration: 1150, easing: "cubic-bezier(.2,.7,.2,1)" }
      );
      a.onfinish = () => el.remove();
    };

    const ripple = (x: number, y: number) => {
      const el = document.createElement("div");
      el.style.cssText = `position:absolute;left:${x - 15}px;top:${y - 15}px;width:30px;height:30px;border-radius:50%;border:1px solid rgb(${SKY});opacity:0;`;
      fxLayer.appendChild(el);
      const a = el.animate(
        [
          { transform: "scale(.4)", opacity: 0.7 },
          { transform: "scale(2.3)", opacity: 0 },
        ],
        { duration: 480, easing: "cubic-bezier(.2,.7,.2,1)" }
      );
      a.onfinish = () => el.remove();
    };

    /* ───── dış kumanda ───── */

    impl = {
      begin(o) {
        if (ph === "enter" || ph === "work") return;
        anchor = o.anchor ?? null;
        stageMode = o.stage ?? "below";
        prog = null;
        okFlag = true;
        wt = 0;
        stamps.length = 0;
        parts.length = 0;
        ox = px;
        oy = py;
        lastOx = ox;
        bx = px;
        by = py;
        lastBx = bx;
        ph = "enter";
        pt = 0;
        setTag(baseTag);
        canvasDirty = true;
      },
      progress(p) {
        prog = clamp(p, 0, 1);
        setTag(`${baseTag} ${Math.round(prog * 100)}%`);
      },
      end(ok) {
        if (ph !== "enter" && ph !== "work") return;
        okFlag = ok;
        exitFromX = ox;
        exitFromY = oy;
        ph = "finish";
        pt = 0;
      },
      emit(label) {
        if (ph === "idle") return;
        chip(label, ox, oy);
      },
      stamp(el, label = "", sel = null) {
        if (!el || ph === "enter" || ph === "work") return;
        stampEl = el;
        stampSel = sel ?? (el.closest("[data-code-block]") as HTMLElement | null);
        stampLabel = label;
        stampChipped = false;
        stampStart = { x: px, y: py };
        ox = px;
        oy = py;
        lastOx = ox;
        ph = "stamp";
        pt = 0;
        setTag(baseTag);
        canvasDirty = true;
      },
      attend(el) {
        if (!el) return;
        if (ph === "attend") {
          if (pt > 0.7) pt = 0.25;
          return;
        }
        if (ph !== "idle") return;
        attendEl = el;
        ox = px;
        oy = py;
        lastOx = ox;
        ph = "attend";
        pt = 0;
        setTag(baseTag);
        canvasDirty = true;
      },
      hold(on) {
        held = on;
      },
    };

    /* ───── girdi dinleyicileri ───── */

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      mx = e.clientX;
      my = e.clientY;
      if (!moved) {
        moved = true;
        px = mx;
        py = my;
        rc.x = mx - 15;
        rc.y = my - 15;
        html.classList.add("tool-cursor-on");
      }
      const t = e.target as Element | null;
      overText = !!t?.closest?.(TEXTUAL);
      hoverEl = overText ? null : (t?.closest?.(INTERACTIVE) as Element | null) ?? null;
      if (hoverEl && (hoverEl as HTMLButtonElement).disabled) hoverEl = null;
    };
    const onDragOver = (e: DragEvent) => {
      mx = e.clientX;
      my = e.clientY;
    };
    const onDown = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      pressed = true;
      if (!overText) ripple(e.clientX, e.clientY);
    };
    const onUp = () => {
      pressed = false;
    };
    const onLeave = (e: MouseEvent) => {
      if (!e.relatedTarget) {
        moved = false;
        hoverEl = null;
      }
    };
    const onInput = (e: Event) => {
      if (tool !== "schema") return;
      const t = e.target as Element | null;
      if (!t?.closest?.(TEXTUAL)) return;
      impl?.attend(document.querySelector<HTMLElement>("[data-cursor-output]"));
    };
    const onDragEnd = () => {
      held = false;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    window.addEventListener("pointercancel", onUp, { passive: true });
    window.addEventListener("dragover", onDragOver, { passive: true });
    window.addEventListener("dragend", onDragEnd);
    window.addEventListener("drop", onDragEnd);
    window.addEventListener("mouseout", onLeave);
    window.addEventListener("resize", resize);
    document.addEventListener("input", onInput, true);

    /* ───── çizim ───── */

    const corners = (R: Rect, a: number) => {
      const L = 14;
      ctx.strokeStyle = `rgba(${SKY},${a})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(R.x, R.y + L);
      ctx.lineTo(R.x, R.y);
      ctx.lineTo(R.x + L, R.y);
      ctx.moveTo(R.x + R.w - L, R.y);
      ctx.lineTo(R.x + R.w, R.y);
      ctx.lineTo(R.x + R.w, R.y + L);
      ctx.moveTo(R.x + R.w, R.y + R.h - L);
      ctx.lineTo(R.x + R.w, R.y + R.h);
      ctx.lineTo(R.x + R.w - L, R.y + R.h);
      ctx.moveTo(R.x + L, R.y + R.h);
      ctx.lineTo(R.x, R.y + R.h);
      ctx.lineTo(R.x, R.y + R.h - L);
      ctx.stroke();
    };

    const label = (text: string, x: number, y: number, a: number, align: CanvasTextAlign = "center") => {
      ctx.font = "500 10px ui-monospace, SFMono-Regular, monospace";
      ctx.textAlign = align;
      ctx.fillStyle = `rgba(${SKY},${a})`;
      ctx.fillText(text, x, y);
    };

    const drawScan = (R: Rect, t: number) => {
      corners(R, 0.55);
      const u = (t / 2.6) % 1;
      const down = u < 0.5;
      const yN = down ? u * 2 : 2 - u * 2;
      const beamY = R.y + 10 + yN * (R.h - 20);
      const n = SCAN_LAYERS.length;
      for (let r = 0; r < n; r++) {
        const yr = R.y + 18 + r * ((R.h - 36) / (n - 1));
        const a = clamp(1 - Math.abs(beamY - yr) / (R.h * 0.55), 0, 1) * 0.3;
        if (a < 0.01) continue;
        ctx.fillStyle = `rgba(${SKY},${a})`;
        ctx.fillRect(R.x + 14, yr - 3, R.w * (0.28 + 0.45 * hash(r)), 6);
        label(SCAN_LAYERS[r], R.x + R.w - 36, yr + 3, a * 2.2, "right");
      }
      // İki imleç arasında kumpas ölçüm çizgisi
      ctx.setLineDash([2, 4]);
      ctx.strokeStyle = `rgba(${SKY},0.35)`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(ox, oy);
      ctx.lineTo(bx, by);
      ctx.stroke();
      ctx.setLineDash([]);

      const g = ctx.createLinearGradient(0, down ? beamY - 48 : beamY + 48, 0, beamY);
      g.addColorStop(0, `rgba(${SKY},0)`);
      g.addColorStop(1, `rgba(${SKY},0.15)`);
      ctx.fillStyle = g;
      ctx.fillRect(R.x, down ? beamY - 48 : beamY, R.w, 48);
      ctx.strokeStyle = `rgba(${SKY},0.95)`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(R.x, beamY);
      ctx.lineTo(R.x + R.w, beamY);
      ctx.stroke();
    };

    const drawRadar = (R: Rect, t: number) => {
      const cx = R.x + R.w / 2;
      const cy = R.y + R.h / 2;
      const r0 = radarR(R);
      const a = (t * 2.4) % (Math.PI * 2);
      ctx.lineWidth = 1;
      for (let i = 1; i <= 3; i++) {
        ctx.strokeStyle = `rgba(${SKY},0.16)`;
        ctx.beginPath();
        ctx.arc(cx, cy, (r0 * i) / 3, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.strokeStyle = `rgba(${SKY},0.09)`;
      ctx.beginPath();
      ctx.moveTo(cx - r0, cy);
      ctx.lineTo(cx + r0, cy);
      ctx.moveTo(cx, cy - r0);
      ctx.lineTo(cx, cy + r0);
      ctx.stroke();
      for (let i = 0; i < 26; i++) {
        const a1 = t * 2.4 - i * 0.05;
        ctx.fillStyle = `rgba(${SKY},${0.24 * Math.pow(1 - i / 26, 1.6)})`;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, r0, a1 - 0.055, a1);
        ctx.closePath();
        ctx.fill();
      }
      // Radar üzerindeki gerçek AI bot hedefleri
      RADAR_BLIPS.forEach((b) => {
        const tx = cx + Math.cos(b.angle) * r0 * b.dist;
        const ty = cy + Math.sin(b.angle) * r0 * b.dist;
        const diff = ((a - b.angle) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
        const glow = clamp(1 - diff / 2.2, 0.25, 1);
        ctx.fillStyle = `rgba(${EMERALD},${glow})`;
        ctx.beginPath();
        ctx.arc(tx, ty, 3, 0, Math.PI * 2);
        ctx.fill();
        label(b.label, tx + 7, ty + 3, glow * 0.85, "left");
      });

      ctx.strokeStyle = `rgba(${SKY},0.9)`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(t * 2.4) * r0, cy + Math.sin(t * 2.4) * r0);
      ctx.stroke();
      ctx.fillStyle = `rgba(${SKY},0.9)`;
      ctx.beginPath();
      ctx.arc(cx, cy, 2.5, 0, Math.PI * 2);
      ctx.fill();
    };

    const drawDns = (R: Rect, t: number) => {
      const n = dnsNodes(R);
      const names = ["İstemci", "Çözümleyici", "Yetkili NS"];
      ctx.setLineDash([4, 6]);
      ctx.lineDashOffset = -t * 30;
      ctx.strokeStyle = `rgba(${SKY},0.32)`;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(n[0].x, n[0].y);
      ctx.lineTo(n[1].x, n[1].y);
      ctx.lineTo(n[2].x, n[2].y);
      ctx.stroke();
      ctx.setLineDash([]);
      n.forEach((p, i) => {
        ctx.strokeStyle = `rgba(${SKY},0.8)`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 7, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = `rgba(${SKY},0.9)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.4, 0, Math.PI * 2);
        ctx.fill();
        label(names[i], p.x, p.y + 24, 0.7);
      });
      const back = choreo(R, Math.max(0, t - 0.09));
      ctx.fillStyle = `rgba(${SKY},0.85)`;
      ctx.fillRect(back.x - 3, back.y - 3, 6, 6);
      const type = DNS_TYPES[Math.floor(t / 0.7) % DNS_TYPES.length];
      const txt = `${type}?`;
      ctx.font = "600 11px ui-monospace, SFMono-Regular, monospace";
      const tw = ctx.measureText(txt).width + 14;
      const cx = back.x - tw / 2;
      const cy = back.y - 30;
      ctx.fillStyle = "rgba(7,11,18,0.92)";
      ctx.strokeStyle = `rgba(${SKY},0.7)`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(cx, cy, tw, 20, 4);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = `rgb(${SKY})`;
      ctx.textAlign = "center";
      ctx.fillText(txt, back.x, cy + 14);
    };

    const drawFont = (R: Rect, t: number, dt: number) => {
      const lines: Array<[number, string]> = [
        [-0.3, "ascender"],
        [-0.12, "x-height"],
        [0, "baseline"],
        [0.2, "descender"],
      ];
      const mid = R.y + R.h * 0.5;
      lines.forEach(([f, name]) => {
        const y = mid + f * R.h * 0.8;
        ctx.strokeStyle = `rgba(${SKY},${name === "baseline" ? 0.28 : 0.12})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(R.x, y);
        ctx.lineTo(R.x + R.w, y);
        ctx.stroke();
        label(name, R.x + 4, y - 4, 0.45, "left");
      });
      // İki imleç arasında harf aralığı (kerning) kumpası
      ctx.strokeStyle = `rgba(${EMERALD},0.55)`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(bx, mid - 12);
      ctx.lineTo(bx, mid + 12);
      ctx.moveTo(ox, mid - 12);
      ctx.lineTo(ox, mid + 12);
      ctx.moveTo(bx, mid);
      ctx.lineTo(ox, mid);
      ctx.stroke();

      stampTimer += dt;
      const pos = choreo(R, t);
      while (stampTimer > 0.11) {
        stampTimer -= 0.11;
        stamps.push({
          x: pos.x,
          y: pos.y,
          ch: FONT_CHARS[Math.floor(Math.random() * FONT_CHARS.length)],
          w: [500, 600, 700][Math.floor(Math.random() * 3)],
          age: 0,
        });
      }
      for (let i = stamps.length - 1; i >= 0; i--) {
        const s = stamps[i];
        s.age += dt;
        if (s.age > 1.4) {
          stamps.splice(i, 1);
          continue;
        }
        ctx.font = `${s.w} ${26 + s.age * 10}px ${fontFamily}, sans-serif`;
        ctx.textAlign = "center";
        ctx.fillStyle = `rgba(${SKY},${(1 - s.age / 1.4) * 0.6})`;
        ctx.fillText(s.ch, s.x, s.y);
      }
    };

    const drawImage = (R: Rect, t: number, dt: number) => {
      const cx = R.x + R.w / 2;
      const cy = R.y + R.h / 2;
      const fw = Math.min(R.w * 0.45, 240);
      const fh = fw * 0.62;
      const s = prog === null ? 0.19 + 0.19 * Math.sin(t * 2.2) : prog * 0.38;
      const k = 1 - s;
      const w = fw * k;
      const h = fh * k;
      const x = cx - w / 2;
      const y = cy - h / 2;
      ctx.setLineDash([3, 5]);
      ctx.strokeStyle = `rgba(${SKY},0.2)`;
      ctx.lineWidth = 1;
      ctx.strokeRect(cx - fw / 2, cy - fh / 2, fw, fh);
      ctx.setLineDash([]);
      const cols = 8;
      const rows = 5;
      const cw = w / cols;
      const ch = h / rows;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const hv = hash(r * cols + c);
          const gone = hv > 1 - s * 2.2;
          ctx.fillStyle = `rgba(${SKY},${gone ? 0.03 : 0.1 + 0.14 * hv})`;
          ctx.fillRect(x + c * cw + 1, y + r * ch + 1, cw - 2, ch - 2);
        }
      }
      ctx.strokeStyle = `rgba(${SKY},0.95)`;
      ctx.lineWidth = 2;
      const L = 12;
      ctx.beginPath();
      ctx.moveTo(x, y + L);
      ctx.lineTo(x, y);
      ctx.lineTo(x + L, y);
      ctx.moveTo(x + w - L, y);
      ctx.lineTo(x + w, y);
      ctx.lineTo(x + w, y + L);
      ctx.moveTo(x + w, y + h - L);
      ctx.lineTo(x + w, y + h);
      ctx.lineTo(x + w - L, y + h);
      ctx.moveTo(x + L, y + h);
      ctx.lineTo(x, y + h);
      ctx.lineTo(x, y + h - L);
      ctx.stroke();

      partTimer += dt;
      while (partTimer > 0.055) {
        partTimer -= 0.055;
        parts.push({ x: x + Math.random() * w, y: y + h, vy: 40 + Math.random() * 70, age: 0 });
      }
      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i];
        p.age += dt;
        p.y += p.vy * dt;
        if (p.age > 1.1) {
          parts.splice(i, 1);
          continue;
        }
        ctx.fillStyle = `rgba(${SKY},${(1 - p.age / 1.1) * 0.55})`;
        ctx.fillRect(p.x, p.y, 3, 3);
      }
    };

    const drawResult = (R: Rect, t: number, ok: boolean) => {
      const cx = R.x + R.w / 2;
      const cy = R.y + R.h / 2;
      const col = ok ? SKY : ROSE;
      const rr = 10 + 70 * easeOut(t / 0.65);
      ctx.strokeStyle = `rgba(${col},${clamp(1 - t / 0.65, 0, 1) * 0.8})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(cx, cy, rr, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = `rgba(${col},${clamp(1 - Math.max(0, t - 0.55) / 0.35, 0, 1)})`;
      ctx.lineWidth = 2.5;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      if (ok) {
        const pts = [
          [-13, 1],
          [-4, 10],
          [14, -10],
        ];
        const total = clamp(t / 0.32, 0, 1) * 2;
        ctx.beginPath();
        ctx.moveTo(cx + pts[0][0], cy + pts[0][1]);
        for (let i = 1; i < 3; i++) {
          const f = clamp(total - (i - 1), 0, 1);
          if (f <= 0) break;
          ctx.lineTo(cx + lerp(pts[i - 1][0], pts[i][0], f), cy + lerp(pts[i - 1][1], pts[i][1], f));
        }
        ctx.stroke();
      } else {
        const shake = Math.sin(t * 60) * 3 * clamp(1 - t / 0.5, 0, 1);
        const f = clamp(t / 0.25, 0, 1);
        ctx.beginPath();
        ctx.moveTo(cx - 10 + shake, cy - 10);
        ctx.lineTo(cx - 10 + shake + 20 * f, cy - 10 + 20 * f);
        ctx.moveTo(cx + 10 + shake, cy - 10);
        ctx.lineTo(cx + 10 + shake - 20 * f, cy - 10 + 20 * f);
        ctx.stroke();
      }
    };

    /* ───── ana döngü ───── */

    let raf = 0;
    let last = performance.now();

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const dt = clamp((now - last) / 1000, 0.001, 0.05);
      last = now;
      pt += dt;
      if (ph === "work" || ph === "enter") wt += dt;

      /* senin imlecin */
      px = damp(px, mx, 30, dt);
      py = damp(py, my, 30, dt);
      let hr: Rect | null = null;
      if (hoverEl) {
        if (!hoverEl.isConnected) hoverEl = null;
        else {
          const b = hoverEl.getBoundingClientRect();
          if (b.width * b.height < 42000 && b.height < 130) hr = { x: b.left - 5, y: b.top - 5, w: b.width + 10, h: b.height + 10 };
        }
      }
      const tgt = hr ?? { x: px - 15, y: py - 15, w: 30, h: 30 };
      const kk = 1 - Math.exp(-dt * (hr ? 20 : 34));
      rc.x = lerp(rc.x, tgt.x, kk);
      rc.y = lerp(rc.y, tgt.y, kk);
      rc.w = lerp(rc.w, tgt.w, kk);
      rc.h = lerp(rc.h, tgt.h, kk);
      rc.r = lerp(rc.r, hr ? 10 : 15, kk);
      const working = ph === "enter" || ph === "work" || ph === "finish";
      ring.style.transform = `translate3d(${rc.x}px,${rc.y}px,0)`;
      ring.style.width = `${rc.w}px`;
      ring.style.height = `${rc.h}px`;
      ring.style.borderRadius = `${rc.r}px`;
      ring.style.opacity = !moved || overText ? "0" : hr ? "0.9" : working ? "0.25" : "0.4";
      ring.style.borderStyle = working && !hr ? "dashed" : "solid";
      pulse = Math.max(0, pulse - dt * 3);
      const sc = (pressed ? 0.8 : held ? 1.3 : 1) * (1 + pulse * 0.5);
      glyph.style.transform = `translate3d(${px}px,${py}px,0) scale(${sc})`;
      glyph.style.opacity = !moved || overText || hr ? "0" : working ? "0.45" : "1";

      /* operatör ve yardımcı sonda */
      const R = stageRect();
      let drawFx = 0;
      let showOp = false;
      let showProbe = false;

      if (ph === "enter") {
        const k = ease(pt / 0.38);
        const c = choreo(R, wt);
        const pc = probeChoreo(R, wt);
        ox = lerp(px, c.x, k);
        oy = lerp(py, c.y, k);
        bx = lerp(px, pc.x, k);
        by = lerp(py, pc.y, k);
        oScale = lerp(0.3, 1, k);
        oAlpha = k;
        drawFx = k;
        showOp = true;
        showProbe = true;
        if (pt >= 0.38) {
          ph = "work";
          pt = 0;
        }
      } else if (ph === "work") {
        const c = choreo(R, wt);
        const pc = probeChoreo(R, wt);
        ox = damp(ox, c.x, 22, dt);
        oy = damp(oy, c.y, 22, dt);
        bx = damp(bx, pc.x, 16, dt);
        by = damp(by, pc.y, 16, dt);
        oScale = 1;
        oAlpha = 1;
        drawFx = 1;
        showOp = true;
        showProbe = true;
      } else if (ph === "finish") {
        const cx = R.x + R.w / 2;
        const cy = R.y + R.h / 2 - 30;
        const k = ease(pt / 0.4);
        ox = lerp(exitFromX, cx, k);
        oy = lerp(exitFromY, cy, k);
        bx = damp(bx, cx - 24, 14, dt);
        by = damp(by, cy + 12, 14, dt);
        oScale = 1;
        oAlpha = 1;
        drawFx = clamp(1 - pt / 0.3, 0, 1);
        showOp = true;
        showProbe = pt < 0.35;
        if (pt >= 0.95) {
          exitFromX = ox;
          exitFromY = oy;
          ph = "exit";
          pt = 0;
        }
      } else if (ph === "exit") {
        const k = ease(pt / 0.45);
        ox = lerp(exitFromX, px, k);
        oy = lerp(exitFromY, py, k);
        oScale = 1 - k;
        oAlpha = 1 - k;
        showOp = true;
        if (pt >= 0.45) {
          ph = "idle";
          pulse = 1;
          showOp = false;
        }
      } else if (ph === "stamp") {
        const selR = stampSel?.getBoundingClientRect();
        const elR = stampEl?.getBoundingClientRect();
        const B = selR
          ? { x: selR.left + 14, y: selR.top + 14 }
          : { x: (elR?.left ?? px) + (elR?.width ?? 0) / 2, y: (elR?.top ?? py) + (elR?.height ?? 0) / 2 };
        const C = selR ? { x: selR.right - 14, y: selR.bottom - 14 } : B;
        const total = selR ? 1.25 : 0.7;
        const tFly = 0.32;
        const tSweep = selR ? 0.5 : 0.08;
        const tHold = tFly + tSweep;
        if (pt < tFly) {
          const k = ease(pt / tFly);
          ox = lerp(stampStart.x, B.x, k);
          oy = lerp(stampStart.y, B.y, k);
          bx = lerp(stampStart.x, C.x, k);
          by = lerp(stampStart.y, B.y, k);
          oScale = lerp(0.4, 1, k);
          oAlpha = k;
        } else if (pt < tHold) {
          const k = ease((pt - tFly) / tSweep);
          ox = lerp(B.x, C.x, k);
          oy = lerp(B.y, C.y, k);
          bx = lerp(C.x, B.x, k);
          by = lerp(B.y, C.y, k);
          oScale = 1;
          oAlpha = 1;
          if (selR) {
            const sp = (pt - tFly) / tSweep;
            canvasDirty = true;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.clearRect(0, 0, W, H);
            ctx.fillStyle = `rgba(${SKY},0.13)`;
            ctx.fillRect(selR.left, selR.top, selR.width, selR.height * ease(sp));
            ctx.fillStyle = `rgba(${SKY},0.9)`;
            ctx.fillRect(selR.left, selR.top, 2, selR.height * ease(sp));
          }
        } else {
          if (!stampChipped) {
            stampChipped = true;
            ripple(C.x, C.y);
            if (stampLabel) chip(stampLabel, C.x, C.y);
          }
          const k = ease((pt - tHold) / (total - tHold));
          ox = lerp(C.x, px, k);
          oy = lerp(C.y, py, k);
          bx = lerp(B.x, px, k);
          by = lerp(C.y, py, k);
          oScale = 1 - k;
          oAlpha = 1 - k;
          if (selR) {
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.clearRect(0, 0, W, H);
            ctx.fillStyle = `rgba(${SKY},${0.13 * (1 - k)})`;
            ctx.fillRect(selR.left, selR.top, selR.width, selR.height);
            canvasDirty = true;
          }
        }
        showOp = true;
        showProbe = Boolean(selR);
        if (pt >= total) {
          ph = "idle";
          pulse = 1;
          showOp = false;
          showProbe = false;
          if (canvasDirty) {
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.clearRect(0, 0, W, H);
            canvasDirty = false;
          }
        }
      } else if (ph === "attend") {
        const el = attendEl?.getBoundingClientRect();
        if (el) {
          const flyT = 0.25;
          const sweepT = 0.6;
          const endT = flyT + sweepT + 0.35;
          const edgeR = el.right - 10;
          const edgeL = el.left + 10;
          if (pt < flyT) {
            const k = ease(pt / flyT);
            ox = lerp(px, edgeR, k);
            oy = lerp(py, el.top + 6, k);
            bx = lerp(px, edgeL, k);
            by = lerp(py, el.bottom - 8, k);
            oScale = lerp(0.4, 1, k);
            oAlpha = k;
          } else if (pt < flyT + sweepT) {
            const k = (pt - flyT) / sweepT;
            ox = edgeR;
            oy = lerp(el.top + 6, el.bottom - 8, ease(k));
            bx = edgeL;
            by = lerp(el.bottom - 8, el.top + 6, ease(k));
            oScale = 1;
            oAlpha = 1;
            canvasDirty = true;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.clearRect(0, 0, W, H);
            const beamY = oy;
            const g = ctx.createLinearGradient(0, beamY - 40, 0, beamY);
            g.addColorStop(0, `rgba(${SKY},0)`);
            g.addColorStop(1, `rgba(${SKY},0.16)`);
            ctx.fillStyle = g;
            ctx.fillRect(el.left, Math.max(el.top, beamY - 40), el.width, beamY - Math.max(el.top, beamY - 40));
            ctx.strokeStyle = `rgba(${SKY},0.95)`;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(el.left, beamY);
            ctx.lineTo(el.right, beamY);
            ctx.stroke();
          } else {
            const k = ease((pt - flyT - sweepT) / 0.35);
            ox = lerp(edgeR, px, k);
            oy = lerp(el.bottom - 8, py, k);
            bx = lerp(edgeL, px, k);
            by = lerp(el.top + 6, py, k);
            oScale = 1 - k;
            oAlpha = 1 - k;
            if (canvasDirty) {
              ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
              ctx.clearRect(0, 0, W, H);
              canvasDirty = false;
            }
          }
          showOp = true;
          showProbe = true;
          if (pt >= endT) {
            ph = "idle";
            showOp = false;
            showProbe = false;
          }
        } else {
          ph = "idle";
        }
      }

      if (showOp) {
        const vx = (ox - lastOx) / dt;
        rot = damp(rot, clamp(vx * 0.012, -22, 22), 12, dt);
        lastOx = ox;
        op.style.opacity = String(clamp(oAlpha, 0, 1));
        op.style.transform = `translate3d(${ox}px,${oy}px,0) rotate(${rot}deg) scale(${Math.max(0.01, oScale)})`;
      } else {
        op.style.opacity = "0";
      }

      if (showProbe) {
        const vx = (bx - lastBx) / dt;
        bRot = damp(bRot, clamp(vx * 0.012, -20, 20), 12, dt);
        lastBx = bx;
        probe.style.opacity = String(clamp(oAlpha * 0.9, 0, 1));
        probe.style.transform = `translate3d(${bx}px,${by}px,0) rotate(${bRot}deg) scale(${Math.max(0.01, oScale * 0.92)})`;
      } else {
        probe.style.opacity = "0";
      }

      /* tuval (yalnızca iş fazlarında) */
      if (ph === "enter" || ph === "work" || ph === "finish") {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, W, H);
        canvasDirty = true;
        ctx.save();
        ctx.globalAlpha = clamp(drawFx, 0, 1);
        if (drawFx > 0.01) {
          switch (tool) {
            case "scan":
              drawScan(R, wt);
              break;
            case "radar":
              drawRadar(R, wt);
              break;
            case "dns":
              drawDns(R, wt);
              break;
            case "font":
              drawFont(R, wt, dt);
              break;
            case "image":
              drawImage(R, wt, dt);
              break;
            default:
              corners(R, 0.5);
          }
        }
        ctx.restore();
        if (ph === "finish") drawResult(R, pt, okFlag);
      } else if (canvasDirty && ph === "idle") {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, W, H);
        canvasDirty = false;
      }
    };

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      window.removeEventListener("dragover", onDragOver);
      window.removeEventListener("dragend", onDragEnd);
      window.removeEventListener("drop", onDragEnd);
      window.removeEventListener("mouseout", onLeave);
      window.removeEventListener("resize", resize);
      document.removeEventListener("input", onInput, true);
      html.classList.remove("tool-cursor-on");
      impl = null;
    };
  }, [tool]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[70]">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      <div ref={fxRef} className="absolute inset-0" />
      <div
        ref={ringRef}
        className="absolute left-0 top-0 border border-sky-300"
        style={{ opacity: 0, willChange: "transform,width,height", transition: "opacity .15s" }}
      />
      <div
        ref={glyphRef}
        className="absolute left-0 top-0 -ml-3.5 -mt-3.5 h-7 w-7"
        style={{ opacity: 0, willChange: "transform", transition: "opacity .15s" }}
      >
        <PointerGlyph tool={tool} />
      </div>
      {/* Yardımcı Sonda (Probe) İmleci */}
      <div ref={probeRef} className="absolute left-0 top-0" style={{ opacity: 0, transformOrigin: "0 0", willChange: "transform,opacity" }}>
        <svg width="26" height="26" viewBox="0 0 32 32" fill="none" style={{ marginLeft: -13, marginTop: -2 }}>
          <path d="M16 2.5L26.5 26.5L16 21.2L5.5 26.5L16 2.5Z" fill="#34d399" stroke="#04060a" strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M16 4.8L16 20.2L7.8 24.4L16 4.8Z" fill="rgba(255,255,255,0.32)" />
        </svg>
        <span
          ref={probeTagRef}
          className="absolute whitespace-nowrap rounded bg-emerald-400 px-1.5 py-[2px] font-mono text-[9px] font-semibold leading-none text-[#04060a]"
          style={{ left: 10, top: 19 }}
        />
      </div>
      {/* Birincil Operatör İmleci */}
      <div ref={opRef} className="absolute left-0 top-0" style={{ opacity: 0, transformOrigin: "0 0", willChange: "transform,opacity" }}>
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" style={{ marginLeft: -16, marginTop: -3 }}>
          <path d="M16 2.5L26.5 26.5L16 21.2L5.5 26.5L16 2.5Z" fill="#7dd3fc" stroke="#04060a" strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M16 4.8L16 20.2L7.8 24.4L16 4.8Z" fill="rgba(255,255,255,0.35)" />
        </svg>
        <span
          ref={tagRef}
          className="absolute whitespace-nowrap rounded bg-sky-300 px-1.5 py-[3px] font-mono text-[10px] font-semibold leading-none text-[#04060a]"
          style={{ left: 12, top: 22 }}
        />
      </div>
    </div>
  );
}
