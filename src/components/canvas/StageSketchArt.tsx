"use client";

import React from "react";
import type { Lang } from "@/providers/LangProvider";

interface StageSketchArtProps {
  stageId: string;
  progress: number;
  done1: boolean;
  done2: boolean;
  done3: boolean;
  done4: boolean;
  done5: boolean;
  lang?: Lang;
}

/**
 * Her bir sayfa ve arayüz için o sayfanın gerçek düzenini ve içindeki uygulama arayüzünü
 * kurşun kalemle insan eliyle çizilmiş gibi gösteren özgün kroki (wireframe) çizimleri.
 */
export function StageSketchArt({
  stageId,
  progress,
  done1,
  done2,
  done3,
  done4,
  done5,
  lang = "tr",
}: StageSketchArtProps) {
  const sketchDrawProgress = Math.min(1, Math.max(0.18, progress / 0.13));
  const dashOffset = Math.round((1 - sketchDrawProgress) * 520);

  // Ortak Sol Sütun (Proje vitrin sahneleri için: Başlık + Mimari Kart + Çoğaltılan Etiketler + İncele Butonu)
  const renderProjectLeftColumn = (numStr: string, shortTitle: string) => (
    <>
      {/* 1. ÜST META BARI + DEVASA ARKA PLAN RAKAMI + RENK PALETİ */}
      <g opacity={progress >= 0.12 ? 1 : 0.72}>
        {done1 && <rect x="6" y="4" width="268" height="15" fill="url(#pencil-hatch)" />}
        <path
          d="M5 5 C 95 4, 190 6, 274 5 L 273 19 C 185 20, 90 18, 6 19 Z"
          stroke="#363028"
          strokeWidth="1.3"
        />
        <rect x="9" y="8" width="24" height="8" rx="4" stroke="#2b2620" strokeWidth="1.2" />
        <text x="12" y="14.5" fill="#2b2620" fontSize="6.5" fontFamily="monospace" fontWeight="bold">
          {numStr}/07
        </text>
        <path d="M38 12 L 94 12" stroke="#453e34" strokeWidth="1.1" strokeLinecap="round" />
        {/* Sağ Üst Devasa Kontur Rakam Eskizi */}
        <text
          x="212"
          y="16"
          fill="none"
          stroke="#5c5245"
          strokeWidth="0.8"
          fontSize="13"
          fontFamily="monospace"
          opacity="0.65"
        >
          {numStr}
        </text>
        {/* Çoğaltılan 4 Renk Noktası */}
        <circle cx="242" cy="12" r="2.3" stroke="#363028" strokeWidth="1.1" />
        <circle cx="250" cy="12" r="2.3" stroke="#363028" strokeWidth="1.1" />
        <circle cx="258" cy="12" r="2.3" stroke="#363028" strokeWidth="1.1" />
        <circle cx="266" cy="12" r="2.3" stroke="#363028" strokeWidth="1.1" />
      </g>

      {/* 2. SOL ANA BAŞLIK (H1) + ALT AÇIKLAMA */}
      <g opacity={progress >= 0.24 ? 1 : 0.72}>
        {done2 && <rect x="7" y="21" width="108" height="23" fill="url(#pencil-hatch)" />}
        <path
          d="M7 21 L 115 21.5 L 114 44 L 6 43.5 Z"
          stroke="#363028"
          strokeWidth="1.35"
        />
        <text x="11" y="32" fill="#2b2620" fontSize="8" fontFamily="monospace" fontWeight="bold">
          {shortTitle}
        </text>
        <path d="M11 37 L 102 37.5" stroke="#453e34" strokeWidth="1" strokeLinecap="round" />
        <text x="11" y="42" fill="#5c5245" fontSize="4.6" fontFamily="monospace">
          &lt;Problem ➔ Çözüm ➔ ROI&gt;
        </text>
      </g>

      {/* 3. SOL PROBLEM ➔ ÇÖZÜM ➔ KAZANÇ (ROI) KARTI */}
      <g opacity={progress >= 0.46 ? 1 : 0.72}>
        {done3 && <rect x="7" y="46" width="108" height="46" fill="url(#pencil-hatch)" />}
        <rect x="7" y="46" width="108" height="46" rx="4" stroke="#363028" strokeWidth="1.3" />

        {/* Üst Sekmeler: [PROB] [SİSTEM] [ROI] */}
        <rect x="10" y="49" width="28" height="6.5" rx="2" stroke="#be123c" strokeWidth="0.8" />
        <text x="12" y="54" fill="#be123c" fontSize="4.2" fontFamily="monospace" fontWeight="bold">
          PROB
        </text>
        <rect x="41" y="49" width="32" height="6.5" rx="2" stroke="#0284c7" strokeWidth="0.8" />
        <text x="43" y="54" fill="#0284c7" fontSize="4.2" fontFamily="monospace" fontWeight="bold">
          SİSTEM
        </text>
        <rect x="76" y="49" width="26" height="6.5" rx="2" stroke="#059669" strokeWidth="0.8" />
        <text x="78" y="54" fill="#059669" fontSize="4.2" fontFamily="monospace" fontWeight="bold">
          ROI
        </text>

        {/* 01: Problem Bloğu */}
        <rect x="10" y="58" width="102" height="10" rx="2" stroke="#e11d48" strokeWidth="0.75" />
        <circle cx="14" cy="63" r="1.5" fill="#e11d48" />
        <text x="18" y="65" fill="#be123c" fontSize="4.2" fontFamily="monospace">
          01: Pazar Tıkanıklığı
        </text>

        {/* Akış Oku */}
        <path d="M60 69 L 60 71 M58.5 70 L 60 71.5 L 61.5 70" stroke="#363028" strokeWidth="0.8" />

        {/* 02: Mimari Çözüm Bloğu */}
        <rect x="10" y="73" width="102" height="10" rx="2" stroke="#0284c7" strokeWidth="0.75" />
        <circle cx="14" cy="78" r="1.5" fill="#0284c7" />
        <text x="18" y="80" fill="#0284c7" fontSize="4.2" fontFamily="monospace">
          02: Otonom Mimari
        </text>

        {/* 03: ROI Şeridi */}
        <rect x="10" y="85" width="102" height="5.5" rx="2" stroke="#059669" strokeWidth="0.75" fill="#f0fdf4" />
        <text x="13" y="89.5" fill="#065f46" fontSize="4" fontFamily="monospace" fontWeight="bold">
          💰 Hedeflenen ROI &amp; Katma Değer
        </text>
      </g>

      {/* 5. SOL ALT ÇOĞALTILAN TEKNOLOJİ ROZETLERİ + İNCELE BUTONU + EKRAN SEÇİCİ */}
      <g opacity={progress >= 0.80 ? 1 : 0.72}>
        {done5 && <rect x="7" y="94" width="108" height="33" fill="url(#pencil-hatch)" />}
        {/* 1. Rozetten Çoğaltılan (×4) Teknoloji Hapları */}
        <rect x="7" y="95" width="23" height="9" rx="4" stroke="#2b2620" strokeWidth="1.15" />
        <rect x="33" y="95" width="24" height="9" rx="4" stroke="#453e34" strokeWidth="1.05" strokeDasharray="2 1" />
        <rect x="60" y="95" width="25" height="9" rx="4" stroke="#453e34" strokeWidth="1.05" strokeDasharray="2 1" />
        <rect x="88" y="95" width="26" height="9" rx="4" stroke="#453e34" strokeWidth="1.05" strokeDasharray="2 1" />
        {/* Çoğaltma Oku */}
        <path d="M29 94 C 45 90, 68 90, 88 94" stroke="#2b2620" strokeWidth="0.8" />
        {/* Sol Alt İncele Hap Butonu + Sağ Ekran Seçici [01 02 03] */}
        <rect x="7" y="109" width="52" height="15" rx="7" stroke="#2b2620" strokeWidth="1.4" />
        <path d="M14 116.5 L 48 116.5" stroke="#2b2620" strokeWidth="1.4" strokeLinecap="round" />
        <rect x="64" y="110" width="50" height="13" rx="6" stroke="#453e34" strokeWidth="1.1" />
        <text x="69" y="118.5" fill="#3b342b" fontSize="6.5" fontFamily="monospace">
          &lt;01 02 03&gt;
        </text>
      </g>
    </>
  );

  return (
    <svg viewBox="0 0 280 134" className="h-auto w-full overflow-visible" fill="none">
      <defs>
        <filter id="pencil-wobble" x="-8%" y="-8%" width="116%" height="116%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.042"
            numOctaves="3"
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="1.45"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>

        <pattern
          id="pencil-hatch"
          width="6"
          height="6"
          patternTransform="rotate(35 0 0)"
          patternUnits="userSpaceOnUse"
        >
          <line
            x1="0"
            y1="0"
            x2="0"
            y2="6"
            stroke="#3d372e"
            strokeWidth="0.95"
            strokeOpacity="0.24"
          />
        </pattern>
      </defs>

      <g
        filter="url(#pencil-wobble)"
        style={{
          strokeDasharray: 520,
          strokeDashoffset: dashOffset,
          transition: "stroke-dashoffset 180ms linear",
        }}
      >
        {/* ═══════════════════════════════════════════════════════════════════
            1. ANA SAHNE (HERO) KROKİSİ:
            3'lü Üst Hap Navbar + Sol 3 Satır H1 + 2 Buton + 3 Metrik + Sağ 3D Çift Katmanlı Vitrin + Alt 7'li Proje Şeridi
           ═══════════════════════════════════════════════════════════════════ */}
        {stageId === "hero-stage" && (
          <>
            {/* 1. ÜST 3 PARÇALI YÜZEN NAVBAR + KICKER */}
            <g opacity={progress >= 0.12 ? 1 : 0.75}>
              {done1 && <rect x="5" y="3" width="270" height="16" fill="url(#pencil-hatch)" />}
              {/* Sol İsim Hapı */}
              <rect x="6" y="4" width="62" height="12" rx="6" stroke="#2b2620" strokeWidth="1.25" />
              <circle cx="13" cy="10" r="2" fill="#2b2620" />
              <path d="M19 10 L 58 10" stroke="#2b2620" strokeWidth="1.2" strokeLinecap="round" />
              {/* Orta Çoğaltılan 3 Menü Linki Hapı */}
              <rect x="92" y="4" width="96" height="12" rx="6" stroke="#2b2620" strokeWidth="1.25" />
              <rect x="96" y="6" width="27" height="8" rx="4" stroke="#453e34" strokeWidth="0.9" />
              <rect x="126" y="6" width="27" height="8" rx="4" stroke="#453e34" strokeWidth="0.9" strokeDasharray="2 1" />
              <rect x="156" y="6" width="27" height="8" rx="4" stroke="#453e34" strokeWidth="0.9" strokeDasharray="2 1" />
              {/* Sağ Dil Hapı */}
              <rect x="248" y="4" width="26" height="12" rx="6" stroke="#2b2620" strokeWidth="1.2" />
            </g>

            {/* 2. SOL DEV 3 SATIRLI H1 BAŞLIK */}
            <g opacity={progress >= 0.24 ? 1 : 0.72}>
              {done2 && <rect x="6" y="22" width="118" height="34" fill="url(#pencil-hatch)" />}
              <rect x="6" y="22" width="118" height="34" stroke="#363028" strokeWidth="1.35" />
              <path d="M11 29 Q 42 27, 86 30 T 114 29" stroke="#2b2620" strokeWidth="2.3" strokeLinecap="round" />
              <path d="M11 38 Q 36 36, 72 39" stroke="#2b2620" strokeWidth="2.3" strokeLinecap="round" />
              <path d="M11 47 Q 45 45, 94 48" stroke="#2b2620" strokeWidth="2.3" strokeLinecap="round" />
              <text x="98" y="52" fill="#4a4237" fontSize="6.5" fontFamily="monospace">
                [H1]
              </text>
            </g>

            {/* 3. SOL MANİFESTO METNİ */}
            <g opacity={progress >= 0.46 ? 1 : 0.72}>
              {done3 && <rect x="6" y="59" width="118" height="20" fill="url(#pencil-hatch)" />}
              <rect x="6" y="59" width="118" height="20" stroke="#453e34" strokeWidth="1.1" />
              <path d="M10 64 L 116 64.5" stroke="#453e34" strokeWidth="1.1" strokeLinecap="round" />
              <path d="M10 70 L 110 70.5" stroke="#453e34" strokeWidth="1.1" strokeLinecap="round" />
              <path d="M10 75 L 82 75.5" stroke="#453e34" strokeWidth="1.1" strokeLinecap="round" />
            </g>

            {/* 4. SAĞ 3D ÇİFT KATMANLI VİTRİN PENCERESİ (Önce ↔ Yatay, Sonra ↕ Dikey) */}
            <g opacity={progress >= 0.62 ? 1 : 0.75}>
              {done4 && <rect x="132" y="22" width="142" height="72" fill="url(#pencil-hatch)" />}
              {/* Arka Derinlik Kartı */}
              <path
                d="M142 20 L 274 18 L 275 82"
                stroke="#5c5245"
                strokeWidth="1"
                strokeDasharray="3 2"
              />
              {/* Ana 3D Pencere */}
              <rect x="132" y="23" width="140" height="66" rx="4" stroke="#2b2620" strokeWidth="1.55" />
              <line x1="132" y1="31" x2="272" y2="31" stroke="#363028" strokeWidth="1.1" />
              <circle cx="137" cy="27" r="1.4" fill="#2b2620" />
              <circle cx="142" cy="27" r="1.4" fill="#2b2620" />
              <circle cx="147" cy="27" r="1.4" fill="#2b2620" />
              {/* Yatay ↔ ve Dikey ↕ Boyutlandırma Okları */}
              <path d="M138 37 L 264 37" stroke="#363028" strokeWidth="0.9" strokeDasharray="2 2" />
              <text x="184" y="44" fill="#2b2620" fontSize="6.5" fontFamily="monospace" fontWeight="bold">
                1.↔W  2.↕H
              </text>
              <rect x="142" y="47" width="120" height="36" stroke="#363028" strokeWidth="1.05" />
              <path d="M146 78 L 168 58 L 192 70 L 222 52 L 256 78" stroke="#363028" strokeWidth="1.2" />
              {/* Alt 6'lı Dock Seçici Hapları */}
              {[0, 1, 2, 3, 4, 5].map((d) => (
                <rect
                  key={d}
                  x={136 + d * 22}
                  y="92"
                  width="19"
                  height="6"
                  rx="3"
                  stroke="#453e34"
                  strokeWidth="0.9"
                />
              ))}
            </g>

            {/* 5. SOL ÇOĞALTILAN 2 CTA BUTONU + 3 METRİK KUTUSU + ALT 7'Lİ PROJE ŞERİDİ */}
            <g opacity={progress >= 0.80 ? 1 : 0.72}>
              {done5 && (
                <>
                  <rect x="6" y="82" width="118" height="31" fill="url(#pencil-hatch)" />
                  <rect x="6" y="116" width="268" height="14" fill="url(#pencil-hatch)" />
                </>
              )}
              {/* 2 CTA Butonu (1. Butondan 2.'ye Çoğaltma) */}
              <rect x="6" y="82" width="66" height="12" rx="6" stroke="#2b2620" strokeWidth="1.35" />
              <rect x="76" y="82" width="44" height="12" rx="6" stroke="#363028" strokeWidth="1.15" strokeDasharray="2 1" />
              {/* 3 Metrik Kutusu: [07] -> [3+] -> [100%] */}
              <rect x="6" y="97" width="36" height="15" stroke="#363028" strokeWidth="1.1" />
              <rect x="46" y="97" width="36" height="15" stroke="#363028" strokeWidth="1.1" strokeDasharray="2 1" />
              <rect x="86" y="97" width="36" height="15" stroke="#363028" strokeWidth="1.1" strokeDasharray="2 1" />
              <text x="11" y="107" fill="#2b2620" fontSize="7" fontFamily="monospace" fontWeight="bold">
                07
              </text>
              <text x="51" y="107" fill="#2b2620" fontSize="7" fontFamily="monospace" fontWeight="bold">
                3+
              </text>
              <text x="89" y="107" fill="#2b2620" fontSize="7" fontFamily="monospace" fontWeight="bold">
                100%
              </text>
              {/* En Alt 7'li Amiral Gemisi Şeridi (1. Karttan 7 Karta Çoğaltma) */}
              {[0, 1, 2, 3, 4, 5, 6].map((k) => (
                <rect
                  key={k}
                  x={6 + k * 38.5}
                  y="117"
                  width="35.5"
                  height="12"
                  rx="2.5"
                  stroke="#363028"
                  strokeWidth={k === 0 ? "1.3" : "1"}
                />
              ))}
            </g>
          </>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            2. LIOS (OTONOM YEREL SEO VE İÇERİK MOTORU) KROKİSİ
           ═══════════════════════════════════════════════════════════════════ */}
        {stageId === "project-lios" && (
          <>
            {renderProjectLeftColumn("01", "LIOS")}
            <g opacity={progress >= 0.62 ? 1 : 0.75}>
              {done4 && <rect x="122" y="23" width="152" height="103" fill="url(#pencil-hatch)" />}
              <rect x="122" y="23" width="152" height="103" rx="5" stroke="#2b2620" strokeWidth="1.55" />
              <line x1="122" y1="32" x2="274" y2="32" stroke="#363028" strokeWidth="1.1" />
              <text x="162" y="29.5" fill="#3b342b" fontSize="6" fontFamily="monospace" fontWeight="bold">
                lios.app (SEO Engine)
              </text>
              {/* İç Arayüz: İzmir Güzellik Hero + Arama Çubuğu + 3 Salon Kartı */}
              <path d="M132 42 L 225 42" stroke="#2b2620" strokeWidth="2" strokeLinecap="round" />
              <path d="M132 48 L 195 48" stroke="#2b2620" strokeWidth="1.8" strokeLinecap="round" />
              {/* 3 Bölmeli Arama & İlçe Filtre Barı */}
              <rect x="132" y="55" width="132" height="14" rx="7" stroke="#2b2620" strokeWidth="1.25" />
              <line x1="182" y1="55" x2="182" y2="69" stroke="#363028" strokeWidth="1" />
              <rect x="228" y="57" width="33" height="10" rx="5" stroke="#2b2620" strokeWidth="1.2" />
              {/* Alt 3'lü İşletme / Salon Fotoğraf Kartları */}
              <rect x="132" y="76" width="40" height="44" rx="3" stroke="#363028" strokeWidth="1.15" />
              <rect x="178" y="76" width="40" height="44" rx="3" stroke="#363028" strokeWidth="1.15" />
              <rect x="224" y="76" width="40" height="44" rx="3" stroke="#363028" strokeWidth="1.15" />
              <line x1="132" y1="98" x2="172" y2="98" stroke="#363028" strokeWidth="0.9" />
              <line x1="178" y1="98" x2="218" y2="98" stroke="#363028" strokeWidth="0.9" />
              <line x1="224" y1="98" x2="264" y2="98" stroke="#363028" strokeWidth="0.9" />
            </g>
          </>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            3. SENTIOPULSE (PAZAR İSTİHBARAT RADARI) KROKİSİ
           ═══════════════════════════════════════════════════════════════════ */}
        {stageId === "project-gen" && (
          <>
            {renderProjectLeftColumn("02", "SentioPulse")}
            <g opacity={progress >= 0.62 ? 1 : 0.75}>
              {done4 && <rect x="122" y="23" width="152" height="103" fill="url(#pencil-hatch)" />}
              <rect x="122" y="23" width="152" height="103" rx="5" stroke="#2b2620" strokeWidth="1.55" />
              <line x1="122" y1="32" x2="274" y2="32" stroke="#363028" strokeWidth="1.1" />
              <text x="156" y="29.5" fill="#3b342b" fontSize="6" fontFamily="monospace" fontWeight="bold">
                sentiopulse.ai (Pain Radar)
              </text>
              {/* Merkez İstihbarat Başlığı */}
              <path d="M156 41 L 240 41" stroke="#2b2620" strokeWidth="2" strokeLinecap="round" />
              <path d="M164 47 L 232 47" stroke="#2b2620" strokeWidth="1.8" strokeLinecap="round" />
              {/* 4'lü Operasyonel KPI Metrik Şeridi */}
              {[0, 1, 2, 3].map((m) => (
                <rect
                  key={m}
                  x={130 + m * 35}
                  y="55"
                  width="32"
                  height="18"
                  rx="2"
                  stroke="#363028"
                  strokeWidth="1.15"
                />
              ))}
              {/* Alt 6'lı Otonom Boru Hattı (Pipeline) Kart Dizisi */}
              <text x="130" y="82" fill="#3b342b" fontSize="6" fontFamily="monospace">
                {lang === "en" ? "VECTOR CLUSTERS:" : lang === "az" ? "VEKTOR KLASTERLƏRİ:" : "VEKTÖR KÜMELERİ:"}
              </text>
              {[0, 1, 2, 3, 4, 5].map((step) => (
                <rect
                  key={step}
                  x={130 + step * 23}
                  y="86"
                  width="20"
                  height="32"
                  rx="2"
                  stroke="#2b2620"
                  strokeWidth="1.1"
                />
              ))}
            </g>
          </>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            4. MAÇAGEL (MOBİL SOSYAL SPOR PLATFORMU) KROKİSİ
           ═══════════════════════════════════════════════════════════════════ */}
        {stageId === "project-macagel" && (
          <>
            {renderProjectLeftColumn("03", "MaçaGel")}
            <g opacity={progress >= 0.62 ? 1 : 0.75}>
              {done4 && <rect x="164" y="21" width="70" height="107" rx="11" fill="url(#pencil-hatch)" />}
              {/* Dikey Akıllı Telefon Kasası */}
              <rect
                x="164"
                y="21"
                width="70"
                height="107"
                rx="11"
                stroke="#231f1a"
                strokeWidth="1.8"
              />
              {/* Dynamic Island Çentiği */}
              <rect x="188" y="25" width="22" height="4" rx="2" stroke="#231f1a" strokeWidth="1.2" />
              {/* Futbol Sahası Çizgileri ve Kadro Noktaları */}
              <rect x="170" y="33" width="58" height="86" rx="5" stroke="#363028" strokeWidth="1.15" />
              {/* Saha Orta Çizgisi ve Yuvarlağı */}
              <line x1="170" y1="76" x2="228" y2="76" stroke="#453e34" strokeWidth="0.9" />
              <circle cx="199" cy="76" r="10" stroke="#453e34" strokeWidth="0.95" />
              {/* Ceza Sahaları */}
              <rect x="183" y="33" width="32" height="12" stroke="#453e34" strokeWidth="0.9" />
              <rect x="183" y="107" width="32" height="12" stroke="#453e34" strokeWidth="0.9" />
              {/* Oyuncu Diziliş Noktaları (Kadro) */}
              <circle cx="199" cy="40" r="2.5" fill="#2b2620" />
              <circle cx="180" cy="56" r="2.5" fill="#2b2620" />
              <circle cx="199" cy="54" r="2.5" fill="#2b2620" />
              <circle cx="218" cy="56" r="2.5" fill="#2b2620" />
              <circle cx="184" cy="76" r="2.5" fill="#2b2620" />
              <circle cx="214" cy="76" r="2.5" fill="#2b2620" />
              <circle cx="180" cy="96" r="2.5" fill="#2b2620" />
              <circle cx="199" cy="98" r="2.5" fill="#2b2620" />
              <circle cx="218" cy="96" r="2.5" fill="#2b2620" />
              {/* Boyut Okları */}
              <text x="238" y="76" fill="#3b342b" fontSize="6.5" fontFamily="monospace">
                ↕9:16
              </text>
            </g>
          </>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            5. VELODRAPE 3D (3B SANAL DENEME KABİNİ) KROKİSİ
           ═══════════════════════════════════════════════════════════════════ */}
        {stageId === "project-tekstil" && (
          <>
            {renderProjectLeftColumn("04", "VeloDrape 3D")}
            <g opacity={progress >= 0.62 ? 1 : 0.75}>
              {done4 && <rect x="122" y="23" width="152" height="103" fill="url(#pencil-hatch)" />}
              <rect x="122" y="23" width="152" height="103" rx="5" stroke="#2b2620" strokeWidth="1.55" />
              <line x1="122" y1="32" x2="274" y2="32" stroke="#363028" strokeWidth="1.1" />
              <text x="156" y="29.5" fill="#3b342b" fontSize="6" fontFamily="monospace" fontWeight="bold">
                velodrape3d.com (3D Try-On)
              </text>
              {/* Sol 3D Araç Çubuğu */}
              <rect x="126" y="36" width="16" height="84" stroke="#363028" strokeWidth="1" />
              {/* Merkez 3D WebGL Sahnesi + Yörünge Halkası + 3B Mesh */}
              <ellipse cx="192" cy="98" rx="34" ry="11" stroke="#453e34" strokeWidth="1" strokeDasharray="3 2" />
              {/* 3D Tel Kafes Korse / Model Silüeti */}
              <path
                d="M178 48 L 206 48 L 200 72 L 210 98 L 174 98 L 184 72 Z"
                stroke="#2b2620"
                strokeWidth="1.4"
              />
              <line x1="192" y1="40" x2="192" y2="112" stroke="#453e34" strokeWidth="0.9" strokeDasharray="2 2" />
              <text x="174" y="44" fill="#2b2620" fontSize="6.5" fontFamily="monospace">
                [3D MESH]
              </text>
              {/* Sağ Kumaş & Shader Ayar Paneli */}
              <rect x="236" y="36" width="34" height="84" stroke="#363028" strokeWidth="1.1" />
              <line x1="240" y1="46" x2="266" y2="46" stroke="#2b2620" strokeWidth="1.2" />
              <line x1="240" y1="58" x2="266" y2="58" stroke="#2b2620" strokeWidth="1.2" />
              <line x1="240" y1="70" x2="266" y2="70" stroke="#2b2620" strokeWidth="1.2" />
            </g>
          </>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            6. SEARCHGRID (MİLİSANİYELİK KURUMSAL ARAMA) KROKİSİ
           ═══════════════════════════════════════════════════════════════════ */}
        {stageId === "project-arama" && (
          <>
            {renderProjectLeftColumn("05", "SearchGrid")}
            <g opacity={progress >= 0.62 ? 1 : 0.75}>
              {done4 && <rect x="122" y="23" width="152" height="103" fill="url(#pencil-hatch)" />}
              <rect x="122" y="23" width="152" height="103" rx="5" stroke="#2b2620" strokeWidth="1.55" />
              <line x1="122" y1="32" x2="274" y2="32" stroke="#363028" strokeWidth="1.1" />
              <text x="156" y="29.5" fill="#3b342b" fontSize="6" fontFamily="monospace" fontWeight="bold">
                searchgrid.io (10ms Search)
              </text>
              {/* Sol Turborepo Düğümleri */}
              <rect x="127" y="38" width="32" height="16" rx="3" stroke="#363028" strokeWidth="1.1" />
              <rect x="127" y="62" width="32" height="16" rx="3" stroke="#363028" strokeWidth="1.1" />
              <rect x="127" y="86" width="32" height="16" rx="3" stroke="#363028" strokeWidth="1.1" />
              <line x1="143" y1="54" x2="143" y2="62" stroke="#2b2620" strokeWidth="1.2" />
              <line x1="143" y1="78" x2="143" y2="86" stroke="#2b2620" strokeWidth="1.2" />
              {/* Merkez Hızlı İndeks Arama Tablosu */}
              <rect x="165" y="38" width="66" height="46" rx="4" stroke="#2b2620" strokeWidth="1.3" />
              {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((bar) => {
                const bh = 8 + ((bar * 7) % 22);
                return (
                  <line
                    key={bar}
                    x1={173 + bar * 6}
                    y1={61 - bh / 2}
                    x2={173 + bar * 6}
                    y2={61 + bh / 2}
                    stroke="#2b2620"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                );
              })}
              {/* Alt Metrikler */}
              <rect x="165" y="90" width="66" height="28" rx="4" stroke="#363028" strokeWidth="1.1" />
              <text x="170" y="106" fill="#2b2620" fontSize="7" fontFamily="monospace" fontWeight="bold">
                &lt;10ms Edge
              </text>
              {/* Sağ Telemetri Sütunu */}
              <rect x="236" y="38" width="33" height="80" rx="3" stroke="#363028" strokeWidth="1.1" />
            </g>
          </>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            7. CHRONOPOST (OTONOM SOSYAL MEDYA DAĞITIM ROBOTU) KROKİSİ
           ═══════════════════════════════════════════════════════════════════ */}
        {stageId === "project-devrim" && (
          <>
            {renderProjectLeftColumn("06", "ChronoPost")}
            <g opacity={progress >= 0.62 ? 1 : 0.75}>
              {done4 && <rect x="122" y="23" width="152" height="103" fill="url(#pencil-hatch)" />}
              <rect x="122" y="23" width="152" height="103" rx="5" stroke="#2b2620" strokeWidth="1.55" />
              <line x1="122" y1="32" x2="274" y2="32" stroke="#363028" strokeWidth="1.1" />
              <text x="156" y="29.5" fill="#3b342b" fontSize="6" fontFamily="monospace" fontWeight="bold">
                chronopost.io (Social Queue)
              </text>
              {/* Sol Sidebar */}
              <rect x="126" y="36" width="28" height="85" stroke="#363028" strokeWidth="1.1" />
              <line x1="130" y1="45" x2="150" y2="45" stroke="#2b2620" strokeWidth="1.2" />
              <line x1="130" y1="54" x2="148" y2="54" stroke="#2b2620" strokeWidth="1.2" />
              <line x1="130" y1="63" x2="150" y2="63" stroke="#2b2620" strokeWidth="1.2" />
              {/* Üst 3 KPI Kartı */}
              <rect x="158" y="36" width="34" height="20" rx="2" stroke="#363028" strokeWidth="1.1" />
              <rect x="196" y="36" width="34" height="20" rx="2" stroke="#363028" strokeWidth="1.1" />
              <rect x="234" y="36" width="35" height="20" rx="2" stroke="#363028" strokeWidth="1.1" />
              {/* Alt İçerik Takvimi / Kanban Izgarası */}
              <rect x="158" y="61" width="111" height="60" rx="3" stroke="#2b2620" strokeWidth="1.25" />
              <line x1="195" y1="61" x2="195" y2="121" stroke="#453e34" strokeWidth="0.9" />
              <line x1="232" y1="61" x2="232" y2="121" stroke="#453e34" strokeWidth="0.9" />
              <line x1="158" y1="81" x2="269" y2="81" stroke="#453e34" strokeWidth="0.9" />
              <line x1="158" y1="101" x2="269" y2="101" stroke="#453e34" strokeWidth="0.9" />
            </g>
          </>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            8. STATICFORGE (STATİK SİTE FABRİKASI) KROKİSİ
           ═══════════════════════════════════════════════════════════════════ */}
        {stageId === "project-sitebuilder" && (
          <>
            {renderProjectLeftColumn("07", "StaticForge")}
            <g opacity={progress >= 0.62 ? 1 : 0.75}>
              {done4 && <rect x="122" y="23" width="152" height="103" fill="url(#pencil-hatch)" />}
              <rect x="122" y="23" width="152" height="103" rx="5" stroke="#2b2620" strokeWidth="1.55" />
              <line x1="122" y1="32" x2="274" y2="32" stroke="#363028" strokeWidth="1.1" />
              <text x="154" y="29.5" fill="#3b342b" fontSize="6" fontFamily="monospace" fontWeight="bold">
                staticforge.dev (Static Site)
              </text>
              {/* Sol Bileşen Paleti (2x3 İkon Kutuları) */}
              <rect x="126" y="36" width="30" height="85" stroke="#363028" strokeWidth="1.1" />
              <rect x="129" y="40" width="10" height="10" stroke="#2b2620" strokeWidth="1" />
              <rect x="142" y="40" width="10" height="10" stroke="#2b2620" strokeWidth="1" />
              <rect x="129" y="54" width="10" height="10" stroke="#2b2620" strokeWidth="1" />
              <rect x="142" y="54" width="10" height="10" stroke="#2b2620" strokeWidth="1" />
              {/* Merkez WYSIWYG Canlı Tuvali */}
              <rect x="160" y="36" width="76" height="85" stroke="#2b2620" strokeWidth="1.3" />
              <rect
                x="166"
                y="46"
                width="64"
                height="34"
                stroke="#2b2620"
                strokeWidth="1.2"
                strokeDasharray="3 2"
              />
              <text x="172" y="65" fill="#2b2620" fontSize="6.5" fontFamily="monospace">
                &lt;100/100 HTML&gt;
              </text>
              {/* Sağ CSS / Props Denetçisi */}
              <rect x="240" y="36" width="30" height="85" stroke="#363028" strokeWidth="1.1" />
            </g>
          </>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            9. DENEYİM & KARİYER SAHNESİ (CAREER-STAGE) KROKİSİ:
            Tam Genişlikli Dikey Mimari: Üst Başlık -> Yan Yana Çoğaltılan 3 Özet Kartı ([3+ YIL] [6 AY] [4 ALAN]) -> 2 Geniş Bölüm Kartı
           ═══════════════════════════════════════════════════════════════════ */}
        {stageId === "career-stage" && (
          <>
            {/* 1. ÜST KICKER */}
            <g opacity={progress >= 0.12 ? 1 : 0.72}>
              {done1 && <rect x="6" y="4" width="268" height="12" fill="url(#pencil-hatch)" />}
              <line x1="6" y1="5" x2="274" y2="5" stroke="#363028" strokeWidth="1.1" />
              <circle cx="12" cy="11" r="2.2" fill="#2b2620" />
              <path d="M18 11 L 96 11" stroke="#2b2620" strokeWidth="1.3" strokeLinecap="round" />
            </g>

            {/* 2. KARİYER ANA BAŞLIĞI (Kimim, ne yapabilirim?) */}
            <g opacity={progress >= 0.24 ? 1 : 0.72}>
              {done2 && <rect x="6" y="18" width="165" height="18" fill="url(#pencil-hatch)" />}
              <rect x="6" y="18" width="165" height="18" stroke="#363028" strokeWidth="1.3" />
              <path d="M12 27 Q 65 24, 148 28" stroke="#2b2620" strokeWidth="2.2" strokeLinecap="round" />
            </g>

            {/* 3. ÖZET AÇIKLAMA SATIRI */}
            <g opacity={progress >= 0.46 ? 1 : 0.72}>
              {done3 && <rect x="6" y="39" width="195" height="13" fill="url(#pencil-hatch)" />}
              <path d="M8 44 L 192 44.5" stroke="#453e34" strokeWidth="1.1" strokeLinecap="round" />
              <path d="M8 49 L 154 49.5" stroke="#453e34" strokeWidth="1.1" strokeLinecap="round" />
            </g>

            {/* 4. YAN YANA ÇOĞALTILAN 3 BÜYÜK METRİK KARTI: [3+ YIL] -> [6 AY] -> [4 ALAN] */}
            <g opacity={progress >= 0.62 ? 1 : 0.75}>
              {done4 && <rect x="6" y="55" width="268" height="28" fill="url(#pencil-hatch)" />}
              <rect x="6" y="55" width="84" height="27" rx="3" stroke="#2b2620" strokeWidth="1.45" />
              <rect x="98" y="55" width="84" height="27" rx="3" stroke="#363028" strokeWidth="1.25" strokeDasharray="3 1.5" />
              <rect x="190" y="55" width="84" height="27" rx="3" stroke="#363028" strokeWidth="1.25" strokeDasharray="3 1.5" />
              <text x="14" y="68" fill="#2b2620" fontSize="8.5" fontFamily="monospace" fontWeight="bold">
                {lang === "en" ? "3+ YRS" : lang === "az" ? "3+ İL" : "3+ YIL"}
              </text>
              <text x="106" y="68" fill="#2b2620" fontSize="8.5" fontFamily="monospace" fontWeight="bold">
                {lang === "en" ? "6 MOS" : lang === "az" ? "6 AY" : "6 AY"}
              </text>
              <text x="198" y="68" fill="#2b2620" fontSize="8.5" fontFamily="monospace" fontWeight="bold">
                {lang === "en" ? "4 DOMAINS" : lang === "az" ? "4 SAHƏ" : "4 ALAN"}
              </text>
              {/* Kart Çoğaltma Okları */}
              <path d="M90 68 L 98 68" stroke="#2b2620" strokeWidth="1.3" />
              <path d="M182 68 L 190 68" stroke="#2b2620" strokeWidth="1.3" />
            </g>

            {/* 5. ALT 2 GENİŞ DENEYİM BÖLÜM KARTI (BÖLÜM 1 & BÖLÜM 2 + 3'lü İç Kutu) */}
            <g opacity={progress >= 0.80 ? 1 : 0.72}>
              {done5 && <rect x="6" y="86" width="268" height="44" fill="url(#pencil-hatch)" />}
              {/* Bölüm 1 Geniş Kartı */}
              <rect x="6" y="86" width="268" height="26" rx="4" stroke="#2b2620" strokeWidth="1.4" />
              <rect x="12" y="96" width="78" height="12" rx="2" stroke="#453e34" strokeWidth="0.95" />
              <rect x="95" y="96" width="78" height="12" rx="2" stroke="#453e34" strokeWidth="0.95" />
              <rect x="178" y="96" width="88" height="12" rx="2" stroke="#453e34" strokeWidth="0.95" />
              {/* Bölüm 2 Geniş Kartı */}
              <rect x="6" y="115" width="268" height="14" rx="3" stroke="#363028" strokeWidth="1.2" />
              <path d="M14 122 L 125 122" stroke="#2b2620" strokeWidth="1.3" strokeLinecap="round" />
            </g>
          </>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            10. İLETİŞİM & VİZYON SAHNESİ (CONTACT-STAGE) KROKİSİ:
            Tam Ortalanmış Simetrik Mimari: Ortalanmış Başlık -> 3 Eşit Kart -> Vizyon Alıntı Kutusu -> Dev Ortalanmış CTA Hap Butonu
           ═══════════════════════════════════════════════════════════════════ */}
        {stageId === "contact-stage" && (
          <>
            {/* 1. ORTALANMIŞ ÜST KICKER */}
            <g opacity={progress >= 0.12 ? 1 : 0.72}>
              {done1 && <rect x="85" y="4" width="110" height="11" fill="url(#pencil-hatch)" />}
              <circle cx="96" cy="9.5" r="2" fill="#2b2620" />
              <path d="M103 9.5 L 186 9.5" stroke="#2b2620" strokeWidth="1.3" strokeLinecap="round" />
            </g>

            {/* 2. ORTALANMIŞ 2 SATIRLI ANA BAŞLIK */}
            <g opacity={progress >= 0.24 ? 1 : 0.72}>
              {done2 && <rect x="42" y="17" width="196" height="24" fill="url(#pencil-hatch)" />}
              <rect x="42" y="17" width="196" height="24" stroke="#363028" strokeWidth="1.3" />
              <path d="M58 25 Q 140 22, 222 25" stroke="#2b2620" strokeWidth="2.2" strokeLinecap="round" />
              <path d="M82 34 Q 140 32, 198 34" stroke="#2b2620" strokeWidth="2.2" strokeLinecap="round" />
            </g>

            {/* 3. ORTALANMIŞ AÇIKLAMA METNİ */}
            <g opacity={progress >= 0.46 ? 1 : 0.72}>
              {done3 && <rect x="56" y="44" width="168" height="12" fill="url(#pencil-hatch)" />}
              <path d="M62 50 L 218 50" stroke="#453e34" strokeWidth="1.15" strokeLinecap="round" />
            </g>

            {/* 4. YAN YANA ÇOĞALTILAN 3 HEDEF KARTI ([Ürün] -> [Büyüme] -> [Web & SEO]) */}
            <g opacity={progress >= 0.62 ? 1 : 0.75}>
              {done4 && <rect x="8" y="59" width="264" height="32" fill="url(#pencil-hatch)" />}
              <rect x="8" y="59" width="82" height="31" rx="4" stroke="#2b2620" strokeWidth="1.4" />
              <rect x="99" y="59" width="82" height="31" rx="4" stroke="#363028" strokeWidth="1.2" strokeDasharray="3 1.5" />
              <rect x="190" y="59" width="82" height="31" rx="4" stroke="#363028" strokeWidth="1.2" strokeDasharray="3 1.5" />
              <rect x="14" y="64" width="9" height="9" rx="2" stroke="#2b2620" strokeWidth="1" />
              <rect x="105" y="64" width="9" height="9" rx="2" stroke="#2b2620" strokeWidth="1" />
              <rect x="196" y="64" width="9" height="9" rx="2" stroke="#2b2620" strokeWidth="1" />
              <path d="M14 80 L 76 80" stroke="#363028" strokeWidth="1.2" strokeLinecap="round" />
              <path d="M105 80 L 168 80" stroke="#363028" strokeWidth="1.2" strokeLinecap="round" />
              <path d="M196 80 L 258 80" stroke="#363028" strokeWidth="1.2" strokeLinecap="round" />
            </g>

            {/* 5. ORTALANMIŞ VİZYON ALINTI KUTUSU + DEV ORTALANMIŞ İLETİŞİM HAP BUTONU */}
            <g opacity={progress >= 0.80 ? 1 : 0.72}>
              {done5 && <rect x="34" y="94" width="212" height="36" fill="url(#pencil-hatch)" />}
              <rect x="34" y="94" width="212" height="16" rx="4" stroke="#363028" strokeWidth="1.15" />
              <path d="M46 102 L 232 102" stroke="#453e34" strokeWidth="1.1" strokeLinecap="round" />
              {/* Dev Ortalanmış CTA Hap Butonu */}
              <rect x="86" y="114" width="108" height="15" rx="7.5" stroke="#2b2620" strokeWidth="1.55" />
              <path d="M102 121.5 L 178 121.5" stroke="#2b2620" strokeWidth="1.6" strokeLinecap="round" />
            </g>
          </>
        )}
      </g>
    </svg>
  );
}

