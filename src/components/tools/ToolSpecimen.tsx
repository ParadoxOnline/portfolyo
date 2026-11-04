import React from "react";

/**
 * Araç levhaları: her aracın yöntemini çizgiyle anlatan küçük teknik şemalar.
 * Sayı, puan ya da sonuç içermezler; yalnızca aracın nasıl çalıştığını gösterirler.
 * Animasyonlar globals.css içindeki `sp-*` sınıflarından gelir.
 */

export type SpecimenKind =
  | "scan"
  | "radar"
  | "dns"
  | "font"
  | "image"
  | "compare"
  | "schema"
  | "editorial"
  | "package";

export const SPECIMENS: Record<string, { kind: SpecimenKind; plate: string; caption: string }> = {
  "/audit": { kind: "scan", plate: "01", caption: "başlık + HTML ayrıştırma" },
  "/ai-radar": { kind: "radar", plate: "02", caption: "robots.txt kural okuma" },
  "/dns-inspector": { kind: "dns", plate: "03", caption: "ad sunucusu sorguları" },
  "/font-strategist": { kind: "font", plate: "04", caption: "HTML'de font kaynağı arama" },
  "/image-optimizer": { kind: "image", plate: "05", caption: "gerçek dosya boyutu ölçümü" },
  "/radar": { kind: "compare", plate: "06", caption: "siteleri yan yana ölçme" },
  "/schema-builder": { kind: "schema", plate: "07", caption: "JSON-LD üretimi" },
  "/insights": { kind: "editorial", plate: "08", caption: "sektör vaka yazıları" },
  "/plugins": { kind: "package", plate: "09", caption: "yayına hazırlanan paketler" },
};

const f = (v: number) => ({ "--f": v } as React.CSSProperties);
const i = (v: number) => ({ "--i": v } as React.CSSProperties);

function Scan() {
  // Işın üst kenardan alta iner; satırlar ışın geçtiği anda parlar.
  const rows = [
    { y: 48, w: 96 },
    { y: 64, w: 128 },
    { y: 80, w: 74 },
    { y: 96, w: 112 },
    { y: 112, w: 60 },
  ];
  return (
    <>
      <rect x="24" y="18" width="192" height="124" rx="2" opacity=".55" />
      <path d="M24 34H216" opacity=".55" />
      <circle cx="33" cy="26" r="1.8" fill="currentColor" stroke="none" opacity=".6" />
      <circle cx="41" cy="26" r="1.8" fill="currentColor" stroke="none" opacity=".4" />
      <circle cx="49" cy="26" r="1.8" fill="currentColor" stroke="none" opacity=".25" />
      {rows.map((r) => (
        <g key={r.y}>
          <rect
            className="sp-hit"
            style={f((r.y - 40) / 92)}
            x="36"
            y={r.y - 2.5}
            width={r.w}
            height="5"
            fill="currentColor"
            stroke="none"
          />
          <rect x="196" y={r.y - 2.5} width="10" height="5" opacity=".28" />
        </g>
      ))}
      <g className="sp-beam">
        <path d="M24 0H216" strokeWidth="1.6" />
        <path d="M24 -14H216" opacity="0" />
        <rect x="24" y="-18" width="192" height="18" fill="currentColor" stroke="none" opacity=".1" />
      </g>
    </>
  );
}

function Radar() {
  const blips: Array<[number, number, number]> = [
    [146.9, 53.1, 45],
    [138.4, 95.4, 130],
    [102.9, 127, 200],
    [86, 80, 270],
    [86.6, 40.2, 320],
  ];
  return (
    <>
      <circle cx="120" cy="80" r="20" opacity=".35" />
      <circle cx="120" cy="80" r="40" opacity=".3" />
      <circle cx="120" cy="80" r="60" opacity=".45" />
      <path d="M60 80H180M120 20V140" opacity=".2" />
      <g className="sp-spin">
        <path d="M120 80L120 20A60 60 0 0 0 74.04 41.43Z" fill="currentColor" stroke="none" opacity=".07" />
        <path d="M120 80L120 20A60 60 0 0 0 87.32 29.68Z" fill="currentColor" stroke="none" opacity=".1" />
        <path d="M120 80L120 20A60 60 0 0 0 103.46 22.32Z" fill="currentColor" stroke="none" opacity=".16" />
        <path d="M120 80V20" strokeWidth="1.6" />
      </g>
      <circle cx="120" cy="80" r="2.2" fill="currentColor" stroke="none" />
      {blips.map(([x, y, a]) => (
        <circle
          key={a}
          className="sp-ping"
          style={f(a / 360)}
          cx={x}
          cy={y}
          r="2.6"
          fill="#34d399"
          stroke="none"
        />
      ))}
    </>
  );
}

function Dns() {
  return (
    <>
      <path className="sp-dash" d="M36 110L120 48L204 110" opacity=".6" />
      {[
        [36, 110, "istemci"],
        [120, 48, "çözümleyici"],
        [204, 110, "yetkili ns"],
      ].map(([x, y, t]) => (
        <g key={String(t)}>
          <circle cx={x as number} cy={y as number} r="8" />
          <circle cx={x as number} cy={y as number} r="2.4" fill="currentColor" stroke="none" />
          <text
            x={x as number}
            y={(y as number) + (y === 48 ? -15 : 24)}
            textAnchor="middle"
            fontSize="7"
            fill="currentColor"
            stroke="none"
            opacity=".6"
            fontFamily="ui-monospace, monospace"
          >
            {t}
          </text>
        </g>
      ))}
      <rect className="sp-hop" x="-3.5" y="-3.5" width="7" height="7" fill="currentColor" stroke="none" />
    </>
  );
}

function Font() {
  return (
    <>
      {[40, 62, 100, 120].map((y, n) => (
        <path key={y} d={`M24 ${y}H216`} opacity={n === 2 ? 0.5 : 0.18} strokeDasharray={n === 2 ? undefined : "2 4"} />
      ))}
      <text
        x="86"
        y="100"
        textAnchor="middle"
        fontSize="68"
        fontWeight="700"
        fill="none"
        strokeWidth="1.1"
        style={{ fontFamily: "var(--font-display-grotesk), sans-serif" }}
      >
        A
      </text>
      <text
        className="sp-kern"
        x="150"
        y="100"
        textAnchor="middle"
        fontSize="68"
        fontWeight="700"
        fill="none"
        strokeWidth="1.1"
        style={{ fontFamily: "var(--font-display-grotesk), sans-serif" }}
      >
        a
      </text>
      <path d="M108 70V130" opacity=".7" />
      <g className="sp-kern">
        <path d="M130 70V130" opacity=".7" />
      </g>
      <path className="sp-kernbar" d="M108 126H130" strokeWidth="1.6" />
    </>
  );
}

function ImageSpec() {
  const cells: Array<[number, number]> = [];
  for (let r = 0; r < 4; r++) for (let c = 0; c < 6; c++) cells.push([c, r]);
  return (
    <>
      <rect x="56" y="38" width="128" height="84" strokeDasharray="2 4" opacity=".4" />
      <g className="sp-squeeze">
        {cells.map(([c, r], n) => (
          <rect
            key={n}
            className="sp-cell"
            style={i(n)}
            x={62 + c * 19.5}
            y={44 + r * 19.5}
            width="16.5"
            height="16.5"
            fill="currentColor"
            stroke="none"
          />
        ))}
        <path d="M56 50V38H68M172 38H184V50M184 110V122H172M68 122H56V110" strokeWidth="1.8" />
      </g>
      {[0, 1, 2, 3, 4].map((n) => (
        <rect
          key={n}
          className="sp-fall"
          style={i(n)}
          x={72 + n * 24}
          y="124"
          width="3"
          height="3"
          fill="currentColor"
          stroke="none"
        />
      ))}
    </>
  );
}

function Compare() {
  const rows = [
    { y: 40, t: 3.1, d: "-0.2s" },
    { y: 76, t: 2.5, d: "-1.1s" },
    { y: 112, t: 3.7, d: "-0.7s" },
  ];
  return (
    <>
      <path d="M48 28V136" opacity=".5" />
      {rows.map((r) => (
        <g key={r.y}>
          <rect x="24" y={r.y + 2} width="16" height="4" opacity=".4" />
          <rect
            className="sp-bar"
            style={{ "--t": `${r.t}s`, "--d": r.d } as React.CSSProperties}
            x="48"
            y={r.y}
            width="160"
            height="8"
            fill="currentColor"
            stroke="none"
          />
          <rect
            className="sp-bar"
            style={{ "--t": `${r.t + 0.9}s`, "--d": r.d } as React.CSSProperties}
            x="48"
            y={r.y + 13}
            width="160"
            height="8"
            fill="#34d399"
            stroke="none"
            opacity=".85"
          />
        </g>
      ))}
    </>
  );
}

function Schema() {
  const lines = [
    { y: 52, x: 92, w: 56 },
    { y: 68, x: 100, w: 40 },
    { y: 84, x: 100, w: 48 },
    { y: 100, x: 92, w: 30 },
  ];
  return (
    <>
      <path d="M80 30c-12 0-14 5-14 14v20c0 8-6 12-12 16c6 4 12 8 12 16v20c0 9 2 14 14 14" strokeWidth="1.5" />
      <path d="M160 30c12 0 14 5 14 14v20c0 8 6 12 12 16c-6 4-12 8-12 16v20c0 9-2 14-14 14" strokeWidth="1.5" />
      {lines.map((l, n) => (
        <rect
          key={l.y}
          className="sp-type"
          style={i(n)}
          x={l.x}
          y={l.y - 2}
          width={l.w}
          height="4"
          fill="currentColor"
          stroke="none"
        />
      ))}
      <rect className="sp-caret" x="126" y="96" width="2" height="9" fill="currentColor" stroke="none" />
    </>
  );
}

function Editorial() {
  return (
    <>
      <path d="M28 30V132" opacity=".4" />
      <rect x="40" y="30" width="128" height="9" fill="currentColor" stroke="none" opacity=".85" />
      <rect x="40" y="45" width="88" height="9" fill="currentColor" stroke="none" opacity=".85" />
      {[68, 80, 92, 104, 116].map((y, n) => (
        <rect key={y} x="40" y={y} width={[156, 148, 156, 132, 90][n]} height="3" opacity=".32" />
      ))}
      <rect className="sp-hl" x="40" y="89" width="156" height="9" fill="currentColor" stroke="none" opacity=".28" />
      <path d="M40 134H196" opacity=".3" />
      <rect className="sp-hl" x="40" y="132.5" width="156" height="3" fill="currentColor" stroke="none" />
    </>
  );
}

function Pack() {
  const box = (x: number, y: number, dashed = false, cls = "") => (
    <g className={cls} strokeDasharray={dashed ? "3 4" : undefined}>
      <rect x={x} y={y} width="48" height="40" rx="2" />
      <path d={`M${x} ${y + 11}H${x + 48}`} />
      <path d={`M${x + 18} ${y + 22}H${x + 30}`} />
    </g>
  );
  return (
    <>
      {box(52, 78)}
      {box(106, 78)}
      {box(79, 34)}
      {box(160, 78, true, "sp-pulse")}
      <path d="M184 62v10M179 67h10" className="sp-pulse" />
    </>
  );
}

export function Specimen({ kind, className = "" }: { kind: SpecimenKind; className?: string }) {
  return (
    <svg
      viewBox="0 0 240 160"
      className={`sp text-sky-300 ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {kind === "scan" && <Scan />}
      {kind === "radar" && <Radar />}
      {kind === "dns" && <Dns />}
      {kind === "font" && <Font />}
      {kind === "image" && <ImageSpec />}
      {kind === "compare" && <Compare />}
      {kind === "schema" && <Schema />}
      {kind === "editorial" && <Editorial />}
      {kind === "package" && <Pack />}
    </svg>
  );
}

/** Mühendislik çizimi hissi veren kare ızgaralı, köşe işaretli çerçeve. */
export function SpecimenFrame({
  kind,
  caption,
  plate,
  className = "",
}: {
  kind: SpecimenKind;
  caption?: string;
  plate?: string;
  className?: string;
}) {
  return (
    <figure className={className}>
      <div
        className="relative aspect-[3/2] w-full overflow-hidden border border-white/[0.12] bg-[#050810]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(125,211,252,.055) 1px, transparent 1px), linear-gradient(90deg, rgba(125,211,252,.055) 1px, transparent 1px)",
          backgroundSize: "16px 16px",
        }}
      >
        <Specimen kind={kind} className="absolute inset-0 h-full w-full" />
        {["left-1.5 top-1.5 border-l border-t", "right-1.5 top-1.5 border-r border-t", "left-1.5 bottom-1.5 border-l border-b", "right-1.5 bottom-1.5 border-r border-b"].map(
          (c) => (
            <span key={c} aria-hidden className={`absolute h-2 w-2 border-sky-300/70 ${c}`} />
          )
        )}
      </div>
      {(plate || caption) && (
        <figcaption className="mt-2 flex items-center justify-between gap-3 font-mono text-[10px] text-zinc-500">
          <span>{plate ? `Şekil ${plate}` : ""}</span>
          <span className="truncate text-right">{caption}</span>
        </figcaption>
      )}
    </figure>
  );
}

