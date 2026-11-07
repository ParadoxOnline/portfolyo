"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { usePathname } from "next/navigation";
import { useLang, type Lang } from "@/providers/LangProvider";
import { StageSketchArt } from "./StageSketchArt";
import { getStageMetaI18n, PAPER_UI_TEXT } from "./StageMetaI18n";

interface AgentDef {
  id: number;
  role: string;
  color: string;
  glow: string;
  angleOffset: number;
  lag: number;
}

const TAU = Math.PI * 2;

const SWARM_AGENTS: AgentDef[] = [
  { id: 0, role: "title", color: "#e0f2fe", glow: "#38bdf8", angleOffset: (TAU / 10) * 0, lag: 0.16 },
  { id: 1, role: "desc", color: "#bae6fd", glow: "#0ea5e9", angleOffset: (TAU / 10) * 1, lag: 0.135 },
  { id: 2, role: "color", color: "#ddd6fe", glow: "#a855f7", angleOffset: (TAU / 10) * 2, lag: 0.115 },
  { id: 3, role: "frame-nw", color: "#a7f3d0", glow: "#10b981", angleOffset: (TAU / 10) * 3, lag: 0.098 },
  { id: 4, role: "frame-se", color: "#fde68a", glow: "#f59e0b", angleOffset: (TAU / 10) * 4, lag: 0.084 },
  { id: 5, role: "media", color: "#c7d2fe", glow: "#6366f1", angleOffset: (TAU / 10) * 5, lag: 0.072 },
  { id: 6, role: "badges", color: "#fbcfe8", glow: "#ec4899", angleOffset: (TAU / 10) * 6, lag: 0.062 },
  { id: 7, role: "cta", color: "#d9f99d", glow: "#84cc16", angleOffset: (TAU / 10) * 7, lag: 0.054 },
  { id: 8, role: "grid", color: "#99f6e4", glow: "#14b8a6", angleOffset: (TAU / 10) * 8, lag: 0.047 },
  { id: 9, role: "qa", color: "#fed7aa", glow: "#f97316", angleOffset: (TAU / 10) * 9, lag: 0.041 },
];

const TRIAL_COLORS = ["#f43f5e", "#f59e0b", "#a855f7"];

interface StageState {
  progress: number;
  status: "idle" | "building" | "built";
  targetColor: string;
}

interface LiveBuilderContextValue {
  stages: Record<string, StageState>;
  activeStageId: string | null;
  focusedStageId: string;
  registerStage: (stageId: string, defaultColor?: string) => void;
  triggerStageBuild: (stageId: string, defaultColor?: string, force?: boolean) => void;
  resetStage: (stageId: string) => void;
}

const LiveBuilderContext = createContext<LiveBuilderContextValue | null>(null);

/**
 * 10.4 saniyelik Sindire Sindire, 10 İmlecin Yardımlaşarak Yürüttüğü İnşa Süreci:
 * - 0.00 .. 0.13 (~1.35sn): Ekran tamamen boş, 10 imleç 5'er çift halinde kağıttaki krokinin 5 bölgesini çizer
 * - 0.13 .. 0.28 (~1.55sn): Görev 1 -> İmleç 0 sol ucu tutar, İmleç 1 sağ ucu çeker; İmleç 2-3-4 butonları çoğaltıp adlandırır; İmleç 5-6 renk taşır
 * - 0.26 .. 0.50 (~2.50sn): Görev 2 -> İmleç 0 sol köşeyi sabitler, İmleç 1 harfleri yazar, İmleç 2 hatayı seçip siler, İmleç 3-4 satır/sağ hiza tutar, İmleç 5-6 gradyan boyar
 * - 0.48 .. 0.66 (~1.85sn): Görev 3 -> İmleç 0 sol üstü tutar, İmleç 1-2 sağ kenarı yatay çeker, İmleç 3-4 alt kenarı dikey çeker, İmleç 5-6-7 3 satırı paralel yazar
 * - 0.64 .. 0.84 (~2.10sn): Görev 4 -> İmleç 0-1 sol köşeleri tutar, İmleç 2-3 sağ kenarı yatay çeker, İmleç 4-5 alt kenarı dikey çeker, İmleç 6 üst barı kurar, İmleç 7 krokiden görseli sürükleyip sahneye bırakır
 * - 0.82 .. 0.97 (~1.55sn): Görev 5 -> 3 ayrı ekip aynı anda CTA butonlarını (0-1-2), rozetleri (3-4-5) ve metrikleri (6-7) çoğaltıp isimlendirir
 */
const DESKTOP_BUILD_DURATION_MS = 10400;
const MOBILE_BUILD_DURATION_MS = 3800;

function getBuildDurationMs(): number {
  if (typeof window === "undefined") return DESKTOP_BUILD_DURATION_MS;
  return window.innerWidth < 768 ? MOBILE_BUILD_DURATION_MS : DESKTOP_BUILD_DURATION_MS;
}

export const CHECKLIST_THRESHOLDS = [0.28, 0.50, 0.66, 0.84, 0.97] as const;

const STAGE_META: Record<
  string,
  {
    title: string;
    tasks: [string, string, string, string, string];
  }
> = {
  "hero-stage": {
    title: "ANA SAHNE (HERO)",
    tasks: [
      "Üst menü butonlarını çoğalt & adlandır",
      "Ana başlık tipografisini yaz & düzelt",
      "Manifesto bloğunu yatay/dikey aç",
      "3D vitrini önce yatay ↔ sonra dikey ↕ çek",
      "CTA butonlarını & 7'li barı çoğaltıp adlandır",
    ],
  },
  "project-lios": {
    title: "01 // LİOS — İZMİR GÜZELLİK",
    tasks: [
      "Üst meta barı & 4 renk noktasını çoğalt",
      "Lios başlığını yaz & tipografiyi hizala",
      "Mimari kartı önce yatay ↔ sonra dikey ↕ aç",
      "İzmir Güzellik ekranını ↔ yatay / ↕ dikey kur",
      "Teknoloji rozetlerini çoğalt & isimlendir",
    ],
  },
  "project-gen": {
    title: "02 // GEN — PAZAR İSTİHBARAT",
    tasks: [
      "Üst meta barı & renk paletini çoğalt",
      "Gen başlığını yaz & tipografiyi hizala",
      "İstihbarat özet kartını yatay/dikey aç",
      "9 Kademeli Boru Hattı ekranını ↔/↕ boyutlandır",
      "Teknoloji rozetlerini çoğalt & isimlendir",
    ],
  },
  "project-macagel": {
    title: "03 // MAÇAGEL — MOBİL SPOR",
    tasks: [
      "Üst meta barı & saha yeşili paletini kur",
      "MaçaGel başlığını sıfırdan yaz",
      "Mobil mimari kartı yatay/dikey genişlet",
      "iPhone kasasını & saha kadrosunu ↔/↕ çek",
      "Mobil rozetleri çoğalt & isimlerini değiştir",
    ],
  },
  "project-tekstil": {
    title: "04 // TEKSTİL 3D — WEBGL",
    tasks: [
      "Üst meta barı & tema rengini ayarla",
      "Tekstil 3D başlığını sıfırdan yaz",
      "WebGL mimari kartını yatay/dikey aç",
      "3D Mesh & Shader sahnesini ↔/↕ boyutlandır",
      "WebGL rozetlerini çoğalt & isimlendir",
    ],
  },
  "project-arama": {
    title: "05 // ARAMA AI — SESLİ BOT",
    tasks: [
      "Üst meta barı & tema rengini ayarla",
      "Arama AI başlığını sıfırdan yaz",
      "Ses motoru kartını yatay/dikey aç",
      "Ses dalgası & çağrı konsolunu ↔/↕ kur",
      "AI rozetlerini çoğalt & isimlerini değiştir",
    ],
  },
  "project-devrim": {
    title: "06 // DEVRİM — AJANS CRM",
    tasks: [
      "Üst meta barı & tema rengini ayarla",
      "Devrim Stüdyo başlığını sıfırdan yaz",
      "CRM mimari kartını yatay/dikey genişlet",
      "Ajans takvim & kanban ekranını ↔/↕ çek",
      "CRM rozetlerini çoğalt & isimlerini değiştir",
    ],
  },
  "project-sitebuilder": {
    title: "07 // STATICFORGE — STUDIO PRO",
    tasks: [
      "Üst meta barı & tema rengini ayarla",
      "StaticForge başlığını sıfırdan yaz",
      "Üretici motor kartını yatay/dikey aç",
      "WYSIWYG editör tuvalini ↔/↕ boyutlandır",
      "Motor rozetlerini çoğalt & isimlendir",
    ],
  },
  "career-stage": {
    title: "DENEYİM & KARİYER MİMARİSİ",
    tasks: [
      "Üst deneyim başlığını & rengini kur",
      "Kariyer ana başlığını yaz & düzelt",
      "Deneyim özet metnini satır satır akıt",
      "1. metrik kartını 3'e çoğalt & değerleri yaz",
      "Bölüm kartlarını & araç etiketlerini çoğalt",
    ],
  },
  "contact-stage": {
    title: "İLETİŞİM & VİZYON SAHNESİ",
    tasks: [
      "Ortalanmış üst vizyon başlığını kur",
      "İletişim ana başlığını 2 satır yaz",
      "Ekip & üretim vizyon metnini oluştur",
      "1. hedef kartını 3'e çoğalt & başlıkları değiştir",
      "Vizyon kutusunu & iletişim butonunu yerleştir",
    ],
  },
};

export function useStageBuild(stageId: string, finalColor = "#38bdf8") {
  const ctx = useContext(LiveBuilderContext);
  const registerStage = ctx?.registerStage;
  const triggerStageBuild = ctx?.triggerStageBuild;
  const resetStage = ctx?.resetStage;

  useEffect(() => {
    registerStage?.(stageId, finalColor);
  }, [registerStage, stageId, finalColor]);

  const st = ctx?.stages[stageId] ?? {
    progress: 0,
    status: "idle" as const,
    targetColor: finalColor,
  };

  const activeColor = useMemo(() => {
    if (st.status === "built" || st.progress >= 0.72) return finalColor;
    if (st.progress < 0.22) return TRIAL_COLORS[0];
    if (st.progress < 0.45) return TRIAL_COLORS[1];
    return TRIAL_COLORS[2];
  }, [st.status, st.progress, finalColor]);

  const triggerBuild = useCallback(() => {
    triggerStageBuild?.(stageId, finalColor, false);
  }, [triggerStageBuild, stageId, finalColor]);

  const triggerRebuild = useCallback(() => {
    triggerStageBuild?.(stageId, finalColor, true);
  }, [triggerStageBuild, stageId, finalColor]);

  const reset = useCallback(() => {
    resetStage?.(stageId);
  }, [resetStage, stageId]);

  return {
    progress: st.progress,
    status: st.status,
    isBuilding: st.status === "building",
    isBuilt: st.status === "built",
    activeColor,
    triggerBuild,
    triggerRebuild,
    reset,
  };
}

export function LiveTypoText({
  text,
  typoText,
  progress,
  className = "",
  gradientAfter,
  accentClass = "text-gradient",
  startAt = 0.26,
  endAt = 0.50,
}: {
  text: string;
  typoText?: string;
  progress: number;
  className?: string;
  gradientAfter?: number;
  accentClass?: string;
  startAt?: number;
  endAt?: number;
}) {
  const computedTypo = useMemo(() => {
    if (typoText) return typoText;
    const splitAt = Math.max(2, Math.floor(text.length * 0.5));
    return text.slice(0, splitAt) + "xzk";
  }, [text, typoText]);

  const commonPrefixLen = useMemo(() => {
    let i = 0;
    while (i < text.length && i < computedTypo.length && text[i] === computedTypo[i]) i++;
    return i;
  }, [text, computedTypo]);

  const localP = Math.min(1, Math.max(0, (progress - startAt) / Math.max(0.01, endAt - startAt)));

  let visibleCorrect = text;
  let visibleWrong = "";
  let isDeleting = false;
  let showCaret = localP > 0.01 && localP < 0.98;

  if (localP <= 0.01) {
    visibleCorrect = "";
  } else if (localP < 0.34) {
    const total = Math.max(1, Math.floor(computedTypo.length * (localP / 0.34)));
    if (total <= commonPrefixLen) {
      visibleCorrect = computedTypo.slice(0, total);
    } else {
      visibleCorrect = computedTypo.slice(0, commonPrefixLen);
      visibleWrong = computedTypo.slice(commonPrefixLen, total);
    }
  } else if (localP < 0.44) {
    visibleCorrect = computedTypo.slice(0, commonPrefixLen);
    visibleWrong = computedTypo.slice(commonPrefixLen);
    isDeleting = true;
  } else if (localP < 0.58) {
    const delRatio = 1 - (localP - 0.44) / 0.14;
    const wrongLen = Math.max(0, Math.ceil((computedTypo.length - commonPrefixLen) * delRatio));
    visibleCorrect = computedTypo.slice(0, commonPrefixLen);
    visibleWrong = computedTypo.slice(commonPrefixLen, commonPrefixLen + wrongLen);
    isDeleting = true;
  } else if (localP < 0.96) {
    const fix = (localP - 0.58) / 0.38;
    const extra = Math.floor((text.length - commonPrefixLen) * fix);
    visibleCorrect = text.slice(0, commonPrefixLen + extra);
  } else {
    showCaret = false;
  }

  return (
    <span className={`relative inline ${className}`}>
      {gradientAfter !== undefined && visibleCorrect.length > gradientAfter ? (
        <>
          <span>{visibleCorrect.slice(0, gradientAfter)}</span>
          <span className={accentClass}>{visibleCorrect.slice(gradientAfter)}</span>
        </>
      ) : (
        <span>{visibleCorrect}</span>
      )}
      {visibleWrong && (
        <span
          data-typo-wrong="true"
          className={`rounded-md px-1 transition-colors ${
            isDeleting
              ? "bg-rose-500/25 text-rose-200 line-through decoration-rose-400 decoration-2 ring-1 ring-rose-400/50"
              : "text-rose-300/90"
          }`}
        >
          {visibleWrong}
        </span>
      )}
      {showCaret && (
        <span
          data-typo-caret="true"
          className={`ml-1 inline-block h-[0.84em] w-[3px] translate-y-[0.06em] animate-pulse rounded-full ${
            isDeleting
              ? "bg-rose-400 shadow-[0_0_14px_#f43f5e]"
              : "bg-sky-300 shadow-[0_0_14px_#38bdf8]"
          }`}
        />
      )}
    </span>
  );
}

function SketchChecklistPaper({
  stageId,
  progress,
  onReplay,
}: {
  stageId: string;
  progress: number;
  onReplay: () => void;
}) {
  const pathname = usePathname();
  const { lang } = useLang();

  if (pathname !== "/") return null;
  const meta = getStageMetaI18n(stageId, lang);
  const paperText = PAPER_UI_TEXT[lang] ?? PAPER_UI_TEXT.tr;

  const done1 = progress >= CHECKLIST_THRESHOLDS[0];
  const done2 = progress >= CHECKLIST_THRESHOLDS[1];
  const done3 = progress >= CHECKLIST_THRESHOLDS[2];
  const done4 = progress >= CHECKLIST_THRESHOLDS[3];
  const done5 = progress >= CHECKLIST_THRESHOLDS[4];
  const completedCount = [done1, done2, done3, done4, done5].filter(Boolean).length;

  return (
    <aside
      data-sketch-pad="true"
      aria-label="El çizimi sayfa krokisi ve görev listesi"
      className="hidden md:block fixed bottom-4 right-4 z-[92] w-[296px] select-none transition-transform duration-500 sm:bottom-6 sm:right-6 sm:w-[342px]"
      style={{
        transform: "rotate(-1.35deg)",
      }}
    >
      <div
        className="pointer-events-none absolute -top-3 left-1/2 z-20 h-6 w-28 -translate-x-1/2 rotate-[2.2deg] border border-[#d6c28f]/60 bg-[#ead8a7]/85 shadow-sm"
        style={{
          clipPath: "polygon(3% 0%, 97% 4%, 100% 96%, 0% 100%)",
        }}
      />

      <div
        className="relative overflow-hidden rounded-[4px] border border-[#cfc5b1] bg-[#f4efe3] p-4 text-[#2c2823] shadow-[0_24px_65px_rgba(0,0,0,0.88),0_4px_14px_rgba(0,0,0,0.45)]"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 45%, rgba(255,253,247,0.55), rgba(222,212,193,0.75) 100%),
            linear-gradient(rgba(110,98,82,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(110,98,82,0.08) 1px, transparent 1px)
          `,
          backgroundSize: "100% 100%, 16px 16px, 16px 16px",
        }}
      >
        <div
          className="pointer-events-none absolute inset-y-0 left-7 w-px bg-[#c97a63]/30"
          aria-hidden
        />

        <div className="relative z-10 flex items-center justify-between border-b border-[#5c5346]/25 pb-1.5 pl-4">
          <div>
            <span className="block font-mono text-[9px] uppercase tracking-[0.18em] text-[#6e6456]">
              {paperText.krokiLabel}
            </span>
            <h4
              className="text-[18px] font-bold leading-none tracking-tight text-[#25211d]"
              style={{ fontFamily: "var(--font-hand)" }}
            >
              {meta.title}
            </h4>
          </div>

          <button
            type="button"
            onClick={onReplay}
            className="pointer-events-auto rounded border border-[#4a4339]/35 bg-[#e9e0ce]/80 px-2 py-0.5 text-[14px] font-semibold text-[#332e28] transition hover:bg-[#ded2ba]"
            style={{ fontFamily: "var(--font-hand)" }}
            title={paperText.replayTitle}
          >
            {paperText.replayBtn}
          </button>
        </div>

        <div
          data-sketch-wireframe="true"
          className="relative z-10 mt-2.5 rounded-[3px] border border-dashed border-[#6b6152]/40 bg-[#efe8d8]/65 p-2"
        >
          <StageSketchArt
            stageId={stageId}
            progress={progress}
            done1={done1}
            done2={done2}
            done3={done3}
            done4={done4}
            done5={done5}
            lang={lang}
          />
        </div>

        <div className="relative z-10 mt-2.5 pl-4">
          <div className="mb-1 flex items-center justify-between">
            <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-[#5e5447]">
              {paperText.checklistTitle}
            </span>
            <span className="font-mono text-[10px] font-bold text-[#3b342b]">
              {paperText.doneCount(completedCount)}
            </span>
          </div>

          <ul className="space-y-1">
            {meta.tasks.map((taskLabel, i) => {
              const threshold = CHECKLIST_THRESHOLDS[i];
              const prevThreshold = i === 0 ? 0.12 : CHECKLIST_THRESHOLDS[i - 1];
              const isDone = progress >= threshold;
              const isCurrent = !isDone && progress >= prevThreshold;

              return (
                <li
                  key={taskLabel}
                  data-checklist-row={i}
                  className="relative flex items-center gap-2 py-0.5"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    className="shrink-0 overflow-visible"
                  >
                    <path
                      d="M2 2.5 C 6 2, 11 2.5, 14 2.2 L 13.8 13.8 C 10 14.2, 5 13.6, 2.2 14 Z"
                      fill={isDone ? "rgba(56,49,40,0.12)" : "transparent"}
                      stroke="#342e26"
                      strokeWidth="1.35"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M3.2 8.2 L 6.6 11.8 L 14.2 2.5"
                      fill="none"
                      stroke="#1f1b16"
                      strokeWidth="2.1"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{
                        strokeDasharray: 22,
                        strokeDashoffset: isDone ? 0 : 22,
                        transition: "stroke-dashoffset 260ms ease-out",
                      }}
                    />
                  </svg>

                  <div className="relative flex-1">
                    <span
                      className={`block text-[16.5px] leading-[1.15] transition-colors duration-300 ${
                        isDone
                          ? "text-[#6e6558]"
                          : isCurrent
                          ? "font-bold text-[#181512]"
                          : "text-[#332d26]"
                      }`}
                      style={{ fontFamily: "var(--font-hand)" }}
                    >
                      {i + 1}. {taskLabel}
                    </span>

                    <svg
                      viewBox="0 0 230 14"
                      preserveAspectRatio="none"
                      className="pointer-events-none absolute inset-x-0 top-1/2 h-3.5 w-full -translate-y-1/2 overflow-visible"
                    >
                      <path
                        d="M -2 8 Q 55 4.5, 115 8.5 T 226 6.5"
                        fill="none"
                        stroke="#231f1a"
                        strokeWidth="2.35"
                        strokeLinecap="round"
                        style={{
                          strokeDasharray: 240,
                          strokeDashoffset: isDone ? 0 : 240,
                          transition: "stroke-dashoffset 340ms cubic-bezier(0.22, 1, 0.36, 1)",
                        }}
                      />
                      <path
                        d="M 4 9.5 Q 80 7.5, 165 9.2 T 222 8"
                        fill="none"
                        stroke="#4a4238"
                        strokeWidth="0.9"
                        strokeLinecap="round"
                        strokeOpacity="0.65"
                        style={{
                          strokeDasharray: 240,
                          strokeDashoffset: isDone ? 0 : 240,
                          transition: "stroke-dashoffset 380ms cubic-bezier(0.22, 1, 0.36, 1)",
                        }}
                      />
                    </svg>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </aside>
  );
}

export function LiveBuilderProvider({ children }: { children: React.ReactNode }) {
  const [stages, setStages] = useState<Record<string, StageState>>({});
  const [activeStageId, setActiveStageId] = useState<string | null>(null);
  const [focusedStageId, setFocusedStageId] = useState<string>("hero-stage");
  const stagesRef = useRef<Record<string, StageState>>({});
  const stageColorsRef = useRef<Record<string, string>>({});

  const runningTimersRef = useRef<Record<string, { startTime: number; finalColor: string }>>({});
  const cursorFocusStageRef = useRef<string | null>(null);

  const mouseRef = useRef({ x: 640, y: 360, moved: false });

  const cursorElsRef = useRef<(HTMLDivElement | null)[]>([]);
  const swatchElRef = useRef<HTMLDivElement | null>(null);
  const actionHudElRef = useRef<HTMLDivElement | null>(null);
  const actionHudTextRef = useRef<HTMLSpanElement | null>(null);

  const agentPosRef = useRef(
    SWARM_AGENTS.map((a) => ({
      anchorX: 640,
      anchorY: 360,
      x: 640 + Math.cos(a.angleOffset) * 76,
      y: 360 + Math.sin(a.angleOffset) * 76,
      vx: 0,
      vy: 0,
      angle: (a.angleOffset * 180) / Math.PI + 180,
    }))
  );

  const registerStage = useCallback((stageId: string, defaultColor = "#38bdf8") => {
    stageColorsRef.current[stageId] = defaultColor;
    if (stagesRef.current[stageId]) return;
    stagesRef.current = {
      ...stagesRef.current,
      [stageId]: { progress: 0, status: "idle", targetColor: defaultColor },
    };
    setStages(stagesRef.current);
  }, []);

  const resetStage = useCallback((stageId: string) => {
    const cur = stagesRef.current[stageId];
    if (!cur || cur.status === "building") return;
    delete runningTimersRef.current[stageId];
    stagesRef.current = {
      ...stagesRef.current,
      [stageId]: { ...cur, progress: 0, status: "idle" },
    };
    setStages(stagesRef.current);
  }, []);

  const triggerStageBuild = useCallback(
    (stageId: string, defaultColor?: string, force = false) => {
      const cur = stagesRef.current[stageId];
      if (!force && cur && (cur.status === "building" || cur.status === "built")) return;

      const color =
        defaultColor || stageColorsRef.current[stageId] || cur?.targetColor || "#38bdf8";

      runningTimersRef.current[stageId] = {
        startTime: performance.now(),
        finalColor: color,
      };
      cursorFocusStageRef.current = stageId;

      const next: Record<string, StageState> = {
        ...stagesRef.current,
        [stageId]: { progress: 0.01, status: "building", targetColor: color },
      };
      stagesRef.current = next;
      setStages(next);
      setActiveStageId(stageId);
      setFocusedStageId(stageId);
    },
    []
  );

  const evaluateViewportStages = useCallback(() => {
    const vh = window.innerHeight;
    const focalY = vh * 0.44;

    const stageNodes = document.querySelectorAll<HTMLElement>("[data-build-stage]");
    let primaryId: string | null = null;
    let bestDist = Infinity;

    stageNodes.forEach((node) => {
      const id = node.getAttribute("data-build-stage");
      if (!id) return;
      const r = node.getBoundingClientRect();
      const st = stagesRef.current[id];

      // Not: Sahneler bir kez inşa edildikten sonra (status === "built") yukarı veya aşağı
      // kaydırıldığında sıfırlanmaz (resetStage çağrılmaz). Sadece ilk oluşturmada animasyon oynar.

      if (r.bottom > vh * 0.18 && r.top < vh * 0.78) {
        const anchorY = r.top + Math.min(r.height * 0.45, vh * 0.42);
        const dist = Math.abs(anchorY - focalY);
        if (dist < bestDist) {
          bestDist = dist;
          primaryId = id;
        }
      }
    });

    if (!primaryId) return;

    setFocusedStageId(primaryId);
    const primaryState = stagesRef.current[primaryId];
    if (!primaryState || primaryState.status === "idle") {
      triggerStageBuild(primaryId, stageColorsRef.current[primaryId], false);
    } else if (primaryState.status === "building") {
      cursorFocusStageRef.current = primaryId;
      setActiveStageId(primaryId);
    }
  }, [triggerStageBuild]);

  useEffect(() => {
    const initX = window.innerWidth - 190;
    const initY = window.innerHeight - 220;
    mouseRef.current = { x: window.innerWidth * 0.52, y: window.innerHeight * 0.44, moved: false };

    agentPosRef.current = SWARM_AGENTS.map((a) => {
      const sx = initX + Math.cos(a.angleOffset) * 55;
      const sy = initY + Math.sin(a.angleOffset) * 55;
      return {
        anchorX: initX,
        anchorY: initY,
        x: sx,
        y: sy,
        vx: 0,
        vy: 0,
        angle: (a.angleOffset * 180) / Math.PI + 180,
      };
    });

    const onMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.moved = true;
    };

    const onScroll = () => {
      evaluateViewportStages();
    };

    const onResize = () => {
      evaluateViewportStages();
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });

    const initTimer = setTimeout(() => {
      evaluateViewportStages();
    }, 16);

    return () => {
      clearTimeout(initTimer);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [evaluateViewportStages]);

  useEffect(() => {
    let raf = 0;
    let lastSync = 0;

    const tick = (now: number) => {
      const timers = runningTimersRef.current;
      const runningIds = Object.keys(timers);
      const activeDurationMs = getBuildDurationMs();

      if (runningIds.length > 0 && now - lastSync > 24) {
        lastSync = now;
        const next: Record<string, StageState> = { ...stagesRef.current };
        let focusJustFinished = false;

        for (const id of runningIds) {
          const entry = timers[id];
          const p = Math.min(1, Math.max(0.01, (now - entry.startTime) / activeDurationMs));
          const done = p >= 1;
          next[id] = {
            progress: done ? 1 : p,
            status: done ? "built" : "building",
            targetColor: entry.finalColor,
          };
          if (done) {
            delete timers[id];
            if (cursorFocusStageRef.current === id) {
              cursorFocusStageRef.current = null;
              focusJustFinished = true;
            }
          }
        }

        stagesRef.current = next;
        setStages(next);
        setActiveStageId(cursorFocusStageRef.current);

        if (focusJustFinished) {
          evaluateViewportStages();
        }
      }

      const focusId = cursorFocusStageRef.current;
      const focusTimer = focusId ? runningTimersRef.current[focusId] : undefined;
      const building = Boolean(focusId && focusTimer);
      const progress =
        building && focusTimer
          ? Math.min(1, Math.max(0.01, (now - focusTimer.startTime) / activeDurationMs))
          : 0;

      const stageEl =
        building && focusId
          ? (document.querySelector(`[data-build-stage="${focusId}"]`) as HTMLElement | null)
          : null;

      const sketchWireEl = document.querySelector(
        `[data-sketch-wireframe="true"]`
      ) as HTMLElement | null;

      const t = now * 0.001;
      let showColorPalette = false;
      let hudLabel = "";

      // Hangi checklist maddesine şu an çizik atılıyor? (0..4)
      let activeStrikeRow = -1;
      for (let r = 0; r < CHECKLIST_THRESHOLDS.length; r++) {
        const th = CHECKLIST_THRESHOLDS[r];
        if (progress >= th - 0.015 && progress <= th + 0.04) {
          activeStrikeRow = r;
          break;
        }
      }

      // Her imlecin (0..9) bu karedeki bağımsız hedef noktası
      const targets: { tx: number; ty: number; orbitTangentAngle: number | null }[] = [];

      SWARM_AGENTS.forEach((agent, idx) => {
        const p = agentPosRef.current[idx];

        // 1. KADEMELİ GECİKMELİ ANA İMLEÇ TAKİBİ (Sadece boştayken yörünge merkezi için)
        const prevAnchorX = idx === 0 ? mouseRef.current.x : agentPosRef.current[idx - 1].anchorX;
        const prevAnchorY = idx === 0 ? mouseRef.current.y : agentPosRef.current[idx - 1].anchorY;
        const followTargetX =
          idx === 0 ? mouseRef.current.x : prevAnchorX * 0.68 + mouseRef.current.x * 0.32;
        const followTargetY =
          idx === 0 ? mouseRef.current.y : prevAnchorY * 0.68 + mouseRef.current.y * 0.32;

        p.anchorX += (followTargetX - p.anchorX) * agent.lag;
        p.anchorY += (followTargetY - p.anchorY) * agent.lag;

        let tx = p.anchorX;
        let ty = p.anchorY;
        let orbitTangentAngle: number | null = null;

        if (building && stageEl) {
          const wave = Math.sin(t * 2.4 + idx * 1.35);
          const cosW = Math.cos(t * 2.4 + idx * 1.35);
          const sb = sketchWireEl ? sketchWireEl.getBoundingClientRect() : null;

          // ═══════════════════════════════════════════════════════════════════
          // FAZ 0 (0.00 .. 0.13): 10 İMLEÇ 5 ÇİFT HALİNDE KROKİNİN 5 BÖLGESİNİ ÇİZER
          // ═══════════════════════════════════════════════════════════════════
          if (progress < 0.13 && sb) {
            const drawSweep = Math.min(1, progress / 0.13);
            switch (idx) {
              case 0: // Üst bar sol->orta çizici
                tx = sb.left + sb.width * (0.06 + drawSweep * 0.42);
                ty = sb.top + sb.height * 0.10 + cosW * 3;
                break;
              case 1: // Üst bar orta->sağ çizici
                tx = sb.left + sb.width * (0.50 + drawSweep * 0.44);
                ty = sb.top + sb.height * 0.10 - cosW * 3;
                break;
              case 2: // H1 kutusu üst kenar çizici
                tx = sb.left + sb.width * (0.06 + drawSweep * 0.36);
                ty = sb.top + sb.height * 0.28 + wave * 4;
                break;
              case 3: // H1 kutusu alt satır çizici
                tx = sb.left + sb.width * (0.42 - drawSweep * 0.34);
                ty = sb.top + sb.height * 0.40 - wave * 4;
                break;
              case 4: // Açıklama kutusu sol->sağ çizici
                tx = sb.left + sb.width * (0.06 + drawSweep * 0.36);
                ty = sb.top + sb.height * 0.58 + cosW * 4;
                break;
              case 5: // Açıklama satırları tarayıcı
                tx = sb.left + sb.width * (0.12 + ((drawSweep * 2) % 1) * 0.28);
                ty = sb.top + sb.height * 0.68 + wave * 4;
                break;
              case 6: // Sağ 3D sahne üst çerçeve çizici
                tx = sb.left + sb.width * (0.48 + drawSweep * 0.46);
                ty = sb.top + sb.height * 0.28 + cosW * 5;
                break;
              case 7: // Sağ 3D sahne diyagonal/alt çizici
                tx = sb.left + sb.width * (0.48 + drawSweep * 0.46);
                ty = sb.top + sb.height * (0.32 + drawSweep * 0.42);
                break;
              case 8: // Alt butonlar ve etiketler çizici
                tx = sb.left + sb.width * (0.08 + drawSweep * 0.84);
                ty = sb.top + sb.height * 0.88 + wave * 3;
                break;
              default: // İmleç 9: Checklist onay kutularını yukarıdan aşağı çizen imleç
                tx = sb.left + 16 + wave * 4;
                ty = sb.bottom + 24 + drawSweep * 95;
                break;
            }
            hudLabel = "✏️ 10 imleç işbölümüyle sayfa krokisini çiziyor...";
          } else if (idx === 9 && activeStrikeRow >= 0) {
            // İMLEÇ 9 (QA): Görev bittiği anda sağ alttaki checklist maddesine kurşun kalem çiziği atar!
            const rowEl = document.querySelector(
              `[data-checklist-row="${activeStrikeRow}"]`
            ) as HTMLElement | null;
            if (rowEl) {
              const rb = rowEl.getBoundingClientRect();
              const th = CHECKLIST_THRESHOLDS[activeStrikeRow];
              const sweep = Math.min(1, Math.max(0, (progress - (th - 0.015)) / 0.055));
              tx = rb.left + 18 + (rb.width - 24) * sweep;
              ty = rb.top + rb.height * 0.5;
            }
          } else if (idx === 8 && sb) {
            // İMLEÇ 8 (KROKİ REHBERİ): Sürekli sağ alttaki kroki kağıdında o anki aktif kutuyu ölçer!
            if (progress < 0.28) {
              tx = sb.left + sb.width * (0.2 + 0.6 * ((t * 0.4) % 1));
              ty = sb.top + sb.height * 0.11;
            } else if (progress < 0.50) {
              tx = sb.left + sb.width * 0.24 + wave * 18;
              ty = sb.top + sb.height * 0.34 + cosW * 6;
            } else if (progress < 0.66) {
              tx = sb.left + sb.width * 0.24 + wave * 18;
              ty = sb.top + sb.height * 0.60 + cosW * 6;
            } else if (progress < 0.84) {
              tx = sb.left + sb.width * 0.72 + wave * 22;
              ty = sb.top + sb.height * 0.52 + cosW * 12;
            } else {
              tx = sb.left + sb.width * 0.48 + wave * 28;
              ty = sb.top + sb.height * 0.88;
            }
          } else if (progress < 0.28) {
            // ═════════════════════════════════════════════════════════════════
            // GÖREV 1 (0.13 .. 0.28): ÜST BAR, MENÜ ÇOĞALTMA & RENK PALETİ
            // 10 İmlecin Hepsi Farklı Bir Noktada Yardımlaşır!
            // ═════════════════════════════════════════════════════════════════
            const localP = Math.min(1, Math.max(0, (progress - 0.13) / 0.15));
            const navMenuEl = document.querySelector(
              `[data-nav-clone-group="true"]`
            ) as HTMLElement | null;
            const colorEl = stageEl.querySelector(
              `[data-build-role="color"]`
            ) as HTMLElement | null;
            const gridEl = stageEl.querySelector(
              `[data-build-role="grid"]`
            ) as HTMLElement | null;

            const topBarRect =
              focusId === "hero-stage" && navMenuEl
                ? navMenuEl.getBoundingClientRect()
                : (gridEl || stageEl).getBoundingClientRect();
            const colorRect = (colorEl || gridEl || stageEl).getBoundingClientRect();

            switch (idx) {
              case 0:
                // İmleç 0: Üst barın SOL UCUNU sabit tutar (Sol Çapa)
                tx = Math.max(40, topBarRect.left - 8);
                ty = topBarRect.top + topBarRect.height * 0.5;
                break;
              case 1:
                // İmleç 1: Üst barın SAĞ UCUNU tutup sağa doğru gerer (Karşılıklı Germe)
                tx = topBarRect.left + topBarRect.width * (0.2 + 0.8 * localP);
                ty = topBarRect.top + topBarRect.height * 0.5;
                break;
              case 2:
                // İmleç 2: 1. Butonu (Kaynak Şablon) tutar ve korur
                tx = topBarRect.left + topBarRect.width * 0.18 + wave * 6;
                ty = topBarRect.top + topBarRect.height * 0.5 - 12;
                break;
              case 3:
                // İmleç 3: 1. Butondan 2. Butonu çoğaltıp orta slota taşır ve adını yazar
                tx =
                  topBarRect.left +
                  topBarRect.width * (0.18 + 0.34 * Math.min(1, localP * 1.4)) +
                  wave * 5;
                ty = topBarRect.top + topBarRect.height * 0.5 + 14;
                break;
              case 4:
                // İmleç 4: 1. Butondan 3. Butonu çoğaltıp sağ slota taşır ve adını yazar
                tx =
                  topBarRect.left +
                  topBarRect.width * (0.18 + 0.68 * Math.min(1, localP * 1.25)) +
                  cosW * 5;
                ty = topBarRect.top + topBarRect.height * 0.5 - 10;
                break;
              case 5:
                // İmleç 5: Renk paletini tutar ve renkleri dener
                tx = colorRect.left + colorRect.width * 0.5 + wave * 10;
                ty = colorRect.top + colorRect.height * 0.5;
                showColorPalette = true;
                break;
              case 6:
                // İmleç 6: İmleç 5'ten aldığı rengi üst rozet/çerçeve kenarına taşır!
                tx =
                  colorRect.left +
                  (topBarRect.left - colorRect.left) * ((localP * 1.6) % 1) +
                  40;
                ty =
                  colorRect.top +
                  (topBarRect.top - colorRect.top) * ((localP * 1.6) % 1);
                break;
              case 7:
                // İmleç 7: Sağ üst dil/tema kontrolünü hizalar
                tx = Math.min(window.innerWidth - 70, topBarRect.right + 140) + wave * 8;
                ty = topBarRect.top + topBarRect.height * 0.5;
                break;
              default:
                // İmleç 9: Üst barın alt hiza çizgisini boydan boya kontrol eder
                tx = topBarRect.left + topBarRect.width * localP;
                ty = colorRect.bottom + 14;
                break;
            }
            hudLabel =
              localP < 0.45
                ? "🤝 İmleçler üst barı iki uçtan geriyor & 1. butonu çoğaltıyor"
                : "✏️ Çoğaltılan butonların isimleri ve renk paleti işleniyor";
          } else if (progress < 0.50) {
            // ═════════════════════════════════════════════════════════════════
            // GÖREV 2 (0.28 .. 0.50): ANA BAŞLIK TİPOGRAFİSİ & HATA DÜZELTME
            // İmleç 1 yazar, İmleç 2 hatayı seçip siler, İmleç 0-3-4-7 köşeleri tutar, 5-6 gradyan boyar!
            // ═════════════════════════════════════════════════════════════════
            const localP = Math.min(1, Math.max(0, (progress - 0.26) / 0.24));
            const titleEl = stageEl.querySelector(
              `[data-build-role="title"]`
            ) as HTMLElement | null;
            const caret = stageEl.querySelector(
              `[data-typo-caret="true"]`
            ) as HTMLElement | null;
            const wrongEl = stageEl.querySelector(
              `[data-typo-wrong="true"]`
            ) as HTMLElement | null;
            const b = (titleEl || stageEl).getBoundingClientRect();

            switch (idx) {
              case 0:
                // İmleç 0: Başlık kutusunun SOL ÜST köşesini sabit tutar
                tx = b.left - 10;
                ty = b.top + 8;
                break;
              case 1: {
                // İmleç 1 (Baş Yazıcı): Aktif yazım imlecini (caret) harf harf takip eder
                if (caret) {
                  const c = caret.getBoundingClientRect();
                  tx = c.left + 8;
                  ty = c.top + c.height * 0.55;
                } else {
                  tx = b.left + b.width * Math.min(0.95, 0.15 + localP * 0.8);
                  ty = b.top + b.height * 0.65;
                }
                break;
              }
              case 2: {
                // İmleç 2 (Editör / Düzeltmen): Hatalı kelime yazıldığında üstünü sağdan sola seçip siler!
                if (wrongEl) {
                  const wRect = wrongEl.getBoundingClientRect();
                  const selSweep = Math.min(1, Math.max(0, (localP - 0.30) / 0.26));
                  tx = wRect.right - wRect.width * selSweep;
                  ty = wRect.top + wRect.height * 0.35;
                } else {
                  tx = b.left + b.width * 0.55 + wave * 18;
                  ty = b.top - 14;
                }
                break;
              }
              case 3:
                // İmleç 3: Sol marjda satır yüksekliğini (line-height) yukarı-aşağı kalibre eder
                tx = b.left - 16;
                ty = b.top + b.height * (0.2 + 0.7 * ((localP * 2) % 1));
                break;
              case 4:
                // İmleç 4: Başlık kutusunun SAĞ KENAR sınırını tutar
                tx = b.right + 10;
                ty = b.top + b.height * 0.35 + cosW * 12;
                break;
              case 5:
                // İmleç 5: Alt satırdaki gradyan kelimeleri soldan sağa boyar
                tx = b.left + b.width * (0.1 + 0.65 * localP);
                ty = b.bottom - 16 + wave * 6;
                showColorPalette = localP > 0.55;
                break;
              case 6:
                // İmleç 6: İmleç 5 ile yardımlaşarak gradyanın sağ ucunu parlatır
                tx = b.left + b.width * (0.85 - 0.35 * localP);
                ty = b.bottom - 8 - wave * 6;
                break;
              case 7:
                // İmleç 7: Alt taban çizgisini (baseline) ortadan destekler
                tx = b.left + b.width * 0.35 + wave * 20;
                ty = b.bottom + 14;
                break;
              default:
                // İmleç 9: Başlık karakter aralığını (kerning) üstten denetler
                tx = b.left + b.width * (0.2 + 0.6 * localP);
                ty = b.top - 12;
                break;
            }
            hudLabel =
              localP < 0.34
                ? "⌨️ İmleç 1 başlığı yazıyor, diğer imleçler kenarları tutuyor"
                : localP < 0.58
                ? "🤝 İmleç 2 hatalı kelimeyi seçip siliyor, İmleç 1 bekliyor"
                : "🎨 İmleç 5 & 6 başlığa gradyan renk uyguluyor";
          } else if (progress < 0.66) {
            // ═════════════════════════════════════════════════════════════════
            // GÖREV 3 (0.50 .. 0.66): AÇIKLAMA KARTI (ÖNCE YATAY ↔ SONRA DİKEY ↕ + 3 SATIR PARALEL YAZIM)
            // ═════════════════════════════════════════════════════════════════
            const localP = Math.min(1, Math.max(0, (progress - 0.48) / 0.18));
            const descEl = stageEl.querySelector(
              `[data-build-role="desc"]`
            ) as HTMLElement | null;
            const b = (descEl || stageEl).getBoundingClientRect();

            const horizP = Math.min(1, localP / 0.44);
            const vertP = Math.min(1, Math.max(0, (localP - 0.42) / 0.44));
            const curRight = b.left + b.width * (0.22 + 0.78 * horizP);
            const curBottom = b.top + b.height * (0.18 + 0.82 * vertP);

            switch (idx) {
              case 0:
                // İmleç 0: Sol üst köşeyi sabitler (Anchor NW)
                tx = b.left - 6;
                ty = b.top - 6;
                break;
              case 1:
                // İmleç 1: Sağ üst köşeyi tutup YATAYDA sağa doğru çeker
                tx = curRight + 6;
                ty = b.top + 8;
                break;
              case 2:
                // İmleç 2: İmleç 1'e yardım ederek sağ orta kenarı YATAYDA çeker
                tx = curRight + 6;
                ty = Math.min(curBottom, b.top + b.height * 0.45);
                break;
              case 3:
                // İmleç 3: Sol alt köşeyi tutup DİKEYDE aşağı doğru çeker
                tx = b.left + b.width * 0.22;
                ty = curBottom + 8;
                break;
              case 4:
                // İmleç 4: İmleç 3'e yardım ederek sağ alt kenarı DİKEYDE aşağı çeker
                tx = Math.max(b.left + 80, curRight - 36);
                ty = curBottom + 8;
                break;
              case 5:
                // İmleç 5: 1. Satır metnini soldan sağa yazar
                tx = b.left + 20 + (curRight - b.left - 40) * Math.min(1, localP * 1.3);
                ty = b.top + 24;
                break;
              case 6:
                // İmleç 6: 2. Satır metnini paralel olarak yazar
                tx =
                  b.left +
                  20 +
                  (curRight - b.left - 40) * Math.min(1, Math.max(0, (localP - 0.2) * 1.35));
                ty = Math.min(curBottom - 6, b.top + 54);
                break;
              case 7:
                // İmleç 7: 3. Satır / Sistem Notunu paralel olarak yazar
                tx =
                  b.left +
                  20 +
                  (curRight - b.left - 50) * Math.min(1, Math.max(0, (localP - 0.38) * 1.5));
                ty = Math.min(curBottom - 4, b.top + Math.min(b.height - 18, 92));
                break;
              default:
                // İmleç 9: Açıklama kartının sol dikey kenarlığını kontrol eder
                tx = b.left - 10;
                ty = b.top + (curBottom - b.top) * 0.6;
                break;
            }
            hudLabel =
              localP < 0.44
                ? "↔ İmleç 0 sol ucu tutarken İmleç 1 & 2 kutuyu YATAY genişletiyor"
                : "↕ İmleç 3 & 4 kutuyu DİKEY açarken İmleç 5-6-7 satırları yazıyor";
          } else if (progress < 0.84) {
            // ═════════════════════════════════════════════════════════════════
            // GÖREV 4 (0.66 .. 0.84): 3D SAHNE (KARŞILIKLI TUTUP ÖNCE ↔ SONRA ↕ GENİŞLETME + KROKİDEN GÖRSEL TAŞIMA)
            // VEYA 3'LÜ KARTLARI 3 AYRI İMLEÇ ÇİFTİYLE ÇOĞALTIP İSİMLENDİRME
            // ═════════════════════════════════════════════════════════════════
            const localP = Math.min(1, Math.max(0, (progress - 0.64) / 0.20));
            const rightHandle = stageEl.querySelector(
              `[data-resize-handle="right"]`
            ) as HTMLElement | null;
            const bottomHandle = stageEl.querySelector(
              `[data-resize-handle="bottom"]`
            ) as HTMLElement | null;
            const mediaEl = stageEl.querySelector(
              `[data-build-role="media"]`
            ) as HTMLElement | null;
            const b = (mediaEl || stageEl).getBoundingClientRect();

            if (rightHandle && bottomHandle) {
              const rh = rightHandle.getBoundingClientRect();
              const bh = bottomHandle.getBoundingClientRect();

              switch (idx) {
                case 0:
                  // İmleç 0: Sol üst köşeyi sıkıca sabitler (Sol Üst Çapa)
                  tx = b.left - 4;
                  ty = b.top - 4;
                  break;
                case 1:
                  // İmleç 1: Sol alt köşeyi sabitler ve dikey açılımda sol rayı indirir
                  tx = b.left - 4;
                  ty = bh.top;
                  break;
                case 2:
                  // İmleç 2: Sağ kenarın ÜST kısmından tutup YATAYDA sağa çeker
                  tx = rh.left + 6;
                  ty = Math.max(b.top + 12, rh.top - 32);
                  break;
                case 3:
                  // İmleç 3: İmleç 2 ile yardımlaşarak sağ kenarın ALT kısmından tutup YATAYDA çeker
                  tx = rh.left + 6;
                  ty = rh.top + 28;
                  break;
                case 4:
                  // İmleç 4: Alt kenarın SOL-ORTA kısmından tutup DİKEYDE aşağı çeker
                  tx = Math.max(b.left + 40, bh.left - 55);
                  ty = bh.top + 6;
                  break;
                case 5:
                  // İmleç 5: İmleç 4 ile yardımlaşarak alt kenarın SAĞ-ORTA kısmından tutup DİKEYDE aşağı çeker
                  tx = Math.min(rh.left - 20, bh.left + 55);
                  ty = bh.top + 6;
                  break;
                case 6:
                  // İmleç 6: Pencere üst çubuğundaki trafik ışıklarını ve URL barını döşer
                  tx = b.left + (rh.left - b.left) * (0.15 + 0.7 * ((localP * 1.8) % 1));
                  ty = b.top + 18;
                  break;
                case 7: {
                  // İmleç 7: Sağ alttaki kroki kağıdından ekran görüntüsünü alıp 3D pencerenin ortasına taşır!
                  const carryP = Math.min(1, Math.max(0, (localP - 0.35) / 0.55));
                  const startX = sb ? sb.left + sb.width * 0.72 : window.innerWidth - 180;
                  const startY = sb ? sb.top + sb.height * 0.55 : window.innerHeight - 200;
                  const endX = b.left + (rh.left - b.left) * 0.5;
                  const endY = b.top + (bh.top - b.top) * 0.55;
                  tx = startX + (endX - startX) * carryP;
                  ty = startY + (endY - startY) * carryP;
                  break;
                }
                default:
                  // İmleç 9: Sağ alt köşe kilidini (SE) kontrol eder
                  tx = rh.left + 8;
                  ty = bh.top + 8;
                  break;
              }
              hudLabel =
                localP < 0.44
                  ? "↔ İmleç 0-1 sol kenarı tutarken İmleç 2-3 sağ kenarı YATAY çekiyor"
                  : localP < 0.84
                  ? "↕ İmleç 4-5 alt kenarı DİKEY çekerken İmleç 7 krokiden görseli taşıyor"
                  : "✓ 3D sahne ve görsel katman kilitlendi";
            } else {
              // Career & Contact 3'lü Kart Çoğaltma: 3 ayrı imleç çifti 3 ayrı kartı paylaşır!
              const cloneP = Math.min(1, localP / 0.45);
              const card1X = b.left + b.width * 0.16;
              const card2X = b.left + b.width * (0.16 + 0.34 * cloneP);
              const card3X = b.left + b.width * (0.16 + 0.68 * cloneP);
              const midY = b.top + b.height * 0.48;

              switch (idx) {
                case 0: // 1. Kart sol üst tutucu
                  tx = card1X - 55;
                  ty = midY - 38;
                  break;
                case 1: // 1. Kart metin/değer yazıcı
                  tx = card1X + 25 + wave * 14;
                  ty = midY + 12;
                  break;
                case 2: // 2. Kartı 1. karttan sürükleyen sol tutucu
                  tx = card2X - 55;
                  ty = midY - 38;
                  break;
                case 3: // 2. Kartın başlığını ve verisini değiştiren yazıcı
                  tx = card2X + 20 + wave * 16;
                  ty = midY + 14;
                  break;
                case 4: // 3. Kartı 1. karttan en sağa sürükleyen tutucu
                  tx = card3X - 55;
                  ty = midY - 38;
                  break;
                case 5: // 3. Kartın başlığını ve verisini değiştiren yazıcı
                  tx = card3X + 20 + cosW * 16;
                  ty = midY + 14;
                  break;
                case 6: // Kartlar arası boşlukları (gap) kalibre eden imleç
                  tx = b.left + b.width * 0.33;
                  ty = midY;
                  break;
                case 7: // 2. ve 3. kart arası boşluğu kalibre eden imleç
                  tx = b.left + b.width * 0.66;
                  ty = midY;
                  break;
                default:
                  tx = card3X + 60;
                  ty = midY + 42;
                  break;
              }
              hudLabel =
                localP < 0.45
                  ? "🤝 İmleç çiftleri 1. kartı 2. ve 3. slota çoğaltarak taşıyor"
                  : "✏️ Her imleç çifti kendi kartının başlığını ve verisini değiştiriyor";
            }
          } else {
            // ═════════════════════════════════════════════════════════════════
            // GÖREV 5 (0.84 .. 0.98): 3 AYRI EKİP AYNI ANDA FARKLI BÖLGELERİ İNŞA EDER
            // Ekip A (0,1,2): CTA Butonlarını çoğaltır ve isimlendirir
            // Ekip B (3,4,5): Rozetleri / 7'li alt barı sol-orta-sağ paylaşarak çoğaltır
            // Ekip C (6,7): Metrik kartlarını / alt barı tamamlar
            // ═════════════════════════════════════════════════════════════════
            const localP = Math.min(1, Math.max(0, (progress - 0.82) / 0.16));
            const ctaEl = stageEl.querySelector(
              `[data-build-role="cta"]`
            ) as HTMLElement | null;
            const badgesEl = stageEl.querySelector(
              `[data-build-role="badges"]`
            ) as HTMLElement | null;
            const qaEl = stageEl.querySelector(
              `[data-build-role="qa"]`
            ) as HTMLElement | null;

            const ctaRect = (ctaEl || stageEl).getBoundingClientRect();
            const badgesRect = (badgesEl || ctaEl || stageEl).getBoundingClientRect();
            const qaRect = (qaEl || badgesEl || stageEl).getBoundingClientRect();

            switch (idx) {
              case 0:
                // Ekip A - İmleç 0: 1. Ana CTA butonunu sabit tutar
                tx = ctaRect.left + 48;
                ty = ctaRect.top + ctaRect.height * 0.5;
                break;
              case 1:
                // Ekip A - İmleç 1: 2. CTA butonunu 1.'den sağa çoğaltır ve adını "İletişim" yapar
                tx =
                  ctaRect.left +
                  60 +
                  Math.min(220, ctaRect.width * 0.55) * Math.min(1, localP * 1.35) +
                  wave * 8;
                ty = ctaRect.top + ctaRect.height * 0.5;
                break;
              case 2:
                // Ekip A - İmleç 2: Sağ ekran seçici / ikincil aksiyon butonlarını çoğaltır
                tx = ctaRect.right - 65 + cosW * 12;
                ty = ctaRect.top + ctaRect.height * 0.5;
                break;
              case 3:
                // Ekip B - İmleç 3: Rozetlerin / alt barın SOL 1/3'lük dilimini çoğaltıp adlandırır
                tx = badgesRect.left + badgesRect.width * (0.08 + 0.22 * localP);
                ty = badgesRect.top + badgesRect.height * 0.5;
                break;
              case 4:
                // Ekip B - İmleç 4: Rozetlerin / alt barın ORTA 1/3'lük dilimini çoğaltıp adlandırır
                tx = badgesRect.left + badgesRect.width * (0.36 + 0.25 * localP);
                ty = badgesRect.top + badgesRect.height * 0.5;
                break;
              case 5:
                // Ekip B - İmleç 5: Rozetlerin / alt barın SAĞ 1/3'lük dilimini çoğaltıp adlandırır
                tx = badgesRect.left + badgesRect.width * (0.66 + 0.28 * localP);
                ty = badgesRect.top + badgesRect.height * 0.5;
                break;
              case 6:
                // Ekip C - İmleç 6: Metriklerin sol/orta kutusunu çoğaltır ve değerini yazar
                tx = qaRect.left + qaRect.width * (0.15 + 0.32 * localP);
                ty = qaRect.top + qaRect.height * 0.5;
                break;
              case 7:
                // Ekip C - İmleç 7: Metriklerin sağ kutusunu çoğaltır ve değerini yazar
                tx = qaRect.left + qaRect.width * (0.55 + 0.35 * localP);
                ty = qaRect.top + qaRect.height * 0.5;
                break;
              default:
                tx = badgesRect.right - 24;
                ty = badgesRect.bottom;
                break;
            }
            hudLabel =
              localP < 0.45
                ? "🤝 3 ekip aynı anda butonları, rozetleri ve metrikleri çoğaltıyor"
                : "✏️ Tüm imleçler kopyalanan buton ve etiketlerin isimlerini yazıyor";
          }

          tx = Math.max(24, Math.min(window.innerWidth - 36, tx));
          ty = Math.max(24, Math.min(window.innerHeight - 36, ty));
        } else {
          // 2. HEPSİ AYNI YÖNDE, DENGELİ VE AKICI SÜZÜLEN DAĞINIK BULUT DÖNÜŞÜ
          const constantSpeed = 0.28;
          const theta = agent.angleOffset + t * constantSpeed;
          const radius = 55 + ((idx * 29) % 45);

          const rawX = Math.cos(theta) * radius;
          const rawY = Math.sin(theta) * (radius * 0.82);

          tx = p.anchorX + rawX;
          ty = p.anchorY + rawY;

          const tangentVx = -Math.sin(theta) * radius * constantSpeed;
          const tangentVy = Math.cos(theta) * (radius * 0.82) * constantSpeed;

          const anchorVx = (followTargetX - p.anchorX) * agent.lag * 40;
          const anchorVy = (followTargetY - p.anchorY) * agent.lag * 40;

          orbitTangentAngle =
            (Math.atan2(tangentVy + anchorVy, tangentVx + anchorVx) * 180) / Math.PI + 90;
        }

        targets.push({ tx, ty, orbitTangentAngle });
      });

      // İNŞA ESNASINDA İMLEÇLERİN ÜST ÜSTE BİNMESİNİ ÖNLEYEN FİZİKSEL AYRIŞMA (ANTI-CLUMPING)
      if (building) {
        const minDist = 46;
        for (let iter = 0; iter < 2; iter++) {
          for (let i = 0; i < targets.length; i++) {
            for (let j = i + 1; j < targets.length; j++) {
              const dx = targets[j].tx - targets[i].tx;
              const dy = targets[j].ty - targets[i].ty;
              const d = Math.hypot(dx, dy);
              if (d < minDist && d > 0.01) {
                const push = (minDist - d) * 0.5;
                const nx = dx / d;
                const ny = dy / d;
                targets[i].tx -= nx * push;
                targets[i].ty -= ny * push;
                targets[j].tx += nx * push;
                targets[j].ty += ny * push;
              }
            }
          }
        }
      }

      // Yay Fiziğiyle Konum ve Yön Güncelleme
      SWARM_AGENTS.forEach((_, idx) => {
        const p = agentPosRef.current[idx];
        const { tx, ty, orbitTangentAngle } = targets[idx];

        // İnşa sırasında biraz daha sakin, yumuşak ve okunaklı süzülme
        const stiffness = building ? 0.11 : 0.12;
        const damping = building ? 0.77 : 0.78;

        p.vx = (p.vx + (tx - p.x) * stiffness) * damping;
        p.vy = (p.vy + (ty - p.y) * stiffness) * damping;
        p.x += p.vx;
        p.y += p.vy;

        const speed = Math.hypot(p.vx, p.vy);
        let desiredAngle = p.angle;

        if (!building && orbitTangentAngle !== null) {
          desiredAngle =
            speed > 1.2
              ? (Math.atan2(p.vy, p.vx) * 180) / Math.PI + 90
              : orbitTangentAngle;
        } else if (speed > 0.35) {
          desiredAngle = (Math.atan2(p.vy, p.vx) * 180) / Math.PI + 90;
        }

        const angleDiff = ((desiredAngle - p.angle + 540) % 360) - 180;
        p.angle += angleDiff * 0.22;

        const el = cursorElsRef.current[idx];
        if (el) {
          el.style.transform = `translate3d(${p.x.toFixed(1)}px, ${p.y.toFixed(1)}px, 0) rotate(${p.angle.toFixed(1)}deg)`;
        }
      });

      const sw = swatchElRef.current;
      if (sw) {
        const p = agentPosRef.current[5];
        sw.style.transform = `translate3d(${(p.x + 22).toFixed(1)}px, ${(p.y + 18).toFixed(1)}px, 0) scale(${
          showColorPalette ? 1 : 0.7
        })`;
        sw.style.opacity = showColorPalette ? "1" : "0";
      }

      const hudEl = actionHudElRef.current;
      const hudText = actionHudTextRef.current;
      if (hudEl && hudText) {
        const lead = agentPosRef.current[1];
        const showHud = building && hudLabel.length > 0;
        if (showHud && hudText.textContent !== hudLabel) {
          hudText.textContent = hudLabel;
        }
        const hudX = Math.min(window.innerWidth - 420, Math.max(16, lead.x + 22));
        const hudY = Math.min(window.innerHeight - 48, Math.max(16, lead.y - 22));
        hudEl.style.transform = `translate3d(${hudX.toFixed(1)}px, ${hudY.toFixed(1)}px, 0)`;
        hudEl.style.opacity = showHud ? "1" : "0";
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [evaluateViewportStages]);

  const currentFocusState = stages[focusedStageId] ?? {
    progress: 0,
    status: "idle" as const,
    targetColor: "#38bdf8",
  };

  const handleReplayCurrentStage = useCallback(() => {
    triggerStageBuild(focusedStageId, stageColorsRef.current[focusedStageId], true);
  }, [focusedStageId, triggerStageBuild]);

  const ctxValue = useMemo<LiveBuilderContextValue>(
    () => ({
      stages,
      activeStageId,
      focusedStageId,
      registerStage,
      triggerStageBuild,
      resetStage,
    }),
    [stages, activeStageId, focusedStageId, registerStage, triggerStageBuild, resetStage]
  );

  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <LiveBuilderContext.Provider value={ctxValue}>
      {children}

      {/* SAĞ ALTTA O ANKİ SAYFAYA UYGUN KURŞUN KALEM KROKİ VE CHECKLIST KAĞIDI (SADECE ANA SAYFADA) */}
      {isHome && (
        <SketchChecklistPaper
          stageId={focusedStageId}
          progress={currentFocusState.progress}
          onReplay={handleReplayCurrentStage}
        />
      )}

      {/* 10 SİNEMATİK, YÖN DUYARLI, AERODİNAMİK İMLEÇ (SADECE ANA SAYFADA) */}
      {isHome && (
      <div
        className="pointer-events-none fixed inset-0 z-[96] hidden overflow-hidden md:block"
        aria-hidden
      >
        {SWARM_AGENTS.map((agent, idx) => (
          <div
            key={agent.id}
            ref={(el) => {
              cursorElsRef.current[idx] = el;
            }}
            className="fixed left-0 top-0 -ml-4 -mt-4 h-8 w-8"
            style={{
              willChange: "transform",
              transformOrigin: "16px 16px",
              transform: "translate3d(-120px, -120px, 0)",
            }}
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              style={{
                filter: `drop-shadow(0 6px 14px rgba(0,0,0,0.85)) drop-shadow(0 0 12px ${agent.glow}88)`,
              }}
            >
              <defs>
                <linearGradient
                  id={`cursor-grad-${agent.id}`}
                  x1="16"
                  y1="2"
                  x2="16"
                  y2="28"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="38%" stopColor={agent.color} />
                  <stop offset="100%" stopColor={agent.glow} />
                </linearGradient>
              </defs>

              <path
                d="M16 2.5L26.5 26.5L16 21.2L5.5 26.5L16 2.5Z"
                fill={`url(#cursor-grad-${agent.id})`}
                stroke="#050811"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />

              <path
                d="M16 4.8L16 20.2L7.8 24.4L16 4.8Z"
                fill="rgba(255,255,255,0.32)"
              />

              <path
                d="M16 4.5L16 20.5"
                stroke="#ffffff"
                strokeWidth="1.1"
                strokeLinecap="round"
                strokeOpacity="0.85"
              />
            </svg>
          </div>
        ))}

        {/* Renk ayarlayan imlecin yanında beliren minimalist cam renk paleti */}
        <div
          ref={swatchElRef}
          className="fixed left-0 top-0 flex items-center gap-1.5 rounded-full border border-white/15 bg-[#070b14]/90 px-2.5 py-1.5 shadow-[0_12px_30px_rgba(0,0,0,0.8)] backdrop-blur-md transition-opacity duration-200"
          style={{ opacity: 0, transform: "translate3d(-200px, -200px, 0)" }}
        >
          {TRIAL_COLORS.map((c) => (
            <span
              key={c}
              className="h-3 w-3 rounded-full ring-1 ring-white/25"
              style={{ backgroundColor: c }}
            />
          ))}
          <span className="h-3 w-3 rounded-full bg-sky-400 ring-2 ring-white shadow-[0_0_10px_#38bdf8]" />
        </div>

      </div>
      )}
    </LiveBuilderContext.Provider>
  );
}
