import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEKSTIL_PAGE = path.join(__dirname, '../../tekstil/src/app/page.tsx');

const tekstilCode = `"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Box, Camera, Cpu, Eye, Layers, ShieldCheck, Sparkles, Terminal } from "lucide-react";

export default function Home() {
  const [activeGarment, setActiveGarment] = useState("Oversized Cyber-Hoodie");

  return (
    <div className="relative min-h-screen bg-[#060709] text-white selection:bg-white selection:text-black font-sans overflow-x-hidden">
      {/* Precision Grid Background */}
      <div 
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
          backgroundSize: "36px 36px"
        }}
      />

      {/* Top Precision Bar */}
      <header className="fixed top-0 inset-x-0 z-50 h-14 border-b border-white/10 bg-[#060709]/80 backdrop-blur-md px-6 flex items-center justify-between font-mono text-xs">
        <div className="flex items-center gap-3">
          <div className="h-6 w-6 rounded bg-white text-black flex items-center justify-center font-bold text-xs">
            T
          </div>
          <span className="tracking-widest uppercase font-semibold text-white/90">TEKSTIL // COMPUTER VISION ENGINE</span>
          <span className="hidden md:inline text-white/30">|</span>
          <span className="hidden md:inline text-emerald-400 font-mono text-[11px] flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            CLIENT_INFERENCE: READY (60 FPS)
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/showroom" className="px-3 py-1.5 rounded border border-white/15 text-white/70 hover:text-white hover:border-white/40 transition">
            Showroom
          </Link>
          <Link href="/ar" className="px-3 py-1.5 rounded bg-white text-black font-medium hover:bg-white/90 transition flex items-center gap-1.5">
            <Camera size={13} />
            <span>Kamera Prova</span>
          </Link>
        </div>
      </header>

      {/* Main Hero Viewport */}
      <main className="relative pt-28 pb-20 px-6 max-w-[1340px] mx-auto">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-sky-400/30 bg-sky-400/10 text-sky-300 font-mono text-[11px] uppercase tracking-widest mb-6">
          <Cpu size={12} />
          <span>GPU ACCELERATED BROWSER INFERENCE // 3D WEBGL</span>
        </div>

        {/* Title */}
        <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.08] max-w-4xl">
          Tarayıcı İçi Gerçek Zamanlı<br />
          <span className="text-white/60">3D Sanal Deneme & Prova Motoru</span>
        </h1>

        <p className="mt-5 text-lg text-white/60 max-w-2xl leading-relaxed">
          Kullanıcıdan harici mobil uygulama yüklemesini istemeden; sıradan bir web kamerası üzerinden 17 iskelet eklem noktasını anlık takip eden ve 3D kıyafet modellerini WebGL GPU hattında giydiren yeni nesil e-ticaret altyapısı.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center gap-4 font-mono text-xs">
          <Link 
            href="/ar"
            className="px-6 py-3.5 rounded-lg bg-white text-black font-semibold uppercase tracking-wider flex items-center gap-2 hover:bg-white/90 transition shadow-[0_0_40px_rgba(255,255,255,0.2)]"
          >
            <Camera size={15} />
            <span>Kamera ile Hemen Dene</span>
          </Link>
          <Link 
            href="/showroom"
            className="px-6 py-3.5 rounded-lg border border-white/15 bg-white/[0.03] text-white font-medium uppercase tracking-wider flex items-center gap-2 hover:border-white/40 hover:bg-white/[0.08] transition"
          >
            <Box size={15} />
            <span>3D Showroom Modelleri</span>
          </Link>
        </div>

        {/* High-Tech HUD Viewport Simulator */}
        <div className="mt-12 rounded-2xl border border-white/15 bg-[#0a0d13] overflow-hidden shadow-2xl">
          {/* Viewport Top Bar */}
          <div className="px-5 py-3 border-b border-white/10 bg-white/[0.02] flex items-center justify-between font-mono text-[11px] text-white/50">
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span className="text-white/80">LIVE_VIEWPORT // WEBCAM_TRACKER_01</span>
            </div>
            <div className="flex items-center gap-6">
              <span>LATENCY: 14.2ms</span>
              <span>INFERENCE: MEDIAPIPE_POSE</span>
              <span className="text-sky-300">GPU: HARDWARE_ACCELERATED</span>
            </div>
          </div>

          {/* Viewport Canvas Area */}
          <div className="relative min-h-[460px] p-8 grid lg:grid-cols-[280px_1fr_300px] gap-6 items-center">
            {/* Left HUD: Garment Selector */}
            <div className="rounded-xl border border-white/10 bg-black/40 p-5 space-y-4 font-mono">
              <span className="text-[10px] text-white/40 uppercase tracking-widest block">3D Dijital Kalıp Seçimi</span>
              {[
                { name: "Oversized Cyber-Hoodie", poly: "48K Polys", fit: "Loose Fit" },
                { name: "Techwear Cargo Shell", poly: "62K Polys", fit: "Modular" },
                { name: "Minimalist Utility Vest", poly: "34K Polys", fit: "Tactical" }
              ].map((g) => (
                <button
                  key={g.name}
                  onClick={() => setActiveGarment(g.name)}
                  className={\`w-full text-left p-3 rounded-lg border transition \${
                    activeGarment === g.name 
                      ? "border-sky-400 bg-sky-400/10 text-white" 
                      : "border-white/10 bg-white/[0.02] text-white/60 hover:text-white"
                  }\`}
                >
                  <div className="text-xs font-semibold">{g.name}</div>
                  <div className="text-[10px] text-white/40 mt-1 flex justify-between">
                    <span>{g.poly}</span>
                    <span>{g.fit}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Center: 3D Tracking Visualizer */}
            <div className="relative h-full flex flex-col items-center justify-center rounded-xl border border-white/10 bg-gradient-to-b from-white/[0.02] to-transparent p-8 text-center">
              {/* Wireframe Grid Mannequin Visual */}
              <div className="relative w-44 h-72 border border-dashed border-sky-400/40 rounded-3xl flex flex-col items-center justify-between p-4">
                {/* Head Point */}
                <div className="h-10 w-10 rounded-full border border-sky-300 bg-sky-400/20 flex items-center justify-center font-mono text-[9px] text-sky-200">
                  HEAD
                </div>
                {/* Shoulder Line */}
                <div className="w-full h-px bg-sky-400/60 relative">
                  <div className="absolute left-0 -top-1 h-2 w-2 rounded-full bg-emerald-400" />
                  <div className="absolute right-0 -top-1 h-2 w-2 rounded-full bg-emerald-400" />
                </div>
                {/* Torso Box */}
                <div className="w-28 h-24 rounded border border-white/20 bg-white/[0.03] flex items-center justify-center font-mono text-[10px] text-white/80">
                  {activeGarment}
                </div>
                {/* Base Anchor */}
                <div className="font-mono text-[9px] text-white/40 uppercase tracking-widest">
                  POSE_LOCKED (17 KEYPOINTS)
                </div>
              </div>
            </div>

            {/* Right HUD: Telemetry Specs */}
            <div className="rounded-xl border border-white/10 bg-black/40 p-5 space-y-4 font-mono text-xs">
              <span className="text-[10px] text-white/40 uppercase tracking-widest block">Mühendislik Metrikleri</span>
              <div className="border-b border-white/5 pb-3">
                <span className="text-[10px] text-white/40 block">İSKELET KESTİRİM HIZI</span>
                <span className="text-emerald-400 font-semibold text-sm">60 FPS // ~16ms</span>
              </div>
              <div className="border-b border-white/5 pb-3">
                <span className="text-[10px] text-white/40 block">SUNUCU GPU MALİYETİ</span>
                <span className="text-white font-semibold text-sm">$0.00 (İstemci Taraflı)</span>
              </div>
              <div className="border-b border-white/5 pb-3">
                <span className="text-[10px] text-white/40 block">MODEL FORMATI</span>
                <span className="text-white font-semibold text-sm">glTF / GLB Dracolu Sıkıştırma</span>
              </div>
              <div>
                <span className="text-[10px] text-white/40 block">UYUMLULUK</span>
                <span className="text-sky-300 font-semibold text-sm">iOS Safari, Chrome, Edge</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Pillars */}
        <div className="mt-16 grid md:grid-cols-3 gap-6 font-mono">
          <div className="p-6 rounded-xl border border-white/10 bg-white/[0.02]">
            <span className="text-sky-400 text-xs">// 01 INFERENCE</span>
            <h3 className="font-sans text-base font-semibold text-white mt-2 mb-1">İstemci Taraflı Çıkarım</h3>
            <p className="text-white/50 text-xs font-sans leading-relaxed">
              Video akışı sunucuya iletilmez; TensorFlow.js ile kullanıcının kendi donanımında işlenir. Gizlilik %100 korunur.
            </p>
          </div>
          <div className="p-6 rounded-xl border border-white/10 bg-white/[0.02]">
            <span className="text-sky-400 text-xs">// 02 WEBGL RENDER</span>
            <h3 className="font-sans text-base font-semibold text-white mt-2 mb-1">Gerçekçi Kumaş Simülasyonu</h3>
            <p className="text-white/50 text-xs font-sans leading-relaxed">
              Three.js ve PBR materyaller ile ışıklandırma, kumaş dokusu ve dikiş detayları fotogerçekçi olarak hesaplanır.
            </p>
          </div>
          <div className="p-6 rounded-xl border border-white/10 bg-white/[0.02]">
            <span className="text-sky-400 text-xs">// 03 COMMERCE</span>
            <h3 className="font-sans text-base font-semibold text-white mt-2 mb-1">%40 İade Azaltımı</h3>
            <p className="text-white/50 text-xs font-sans leading-relaxed">
              Kullanıcı kendi vücut oranlarında kıyafetin duruşunu görerek satın alma kararını güvenle verir.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
`;

// Backup and update
if (fs.existsSync(TEKSTIL_PAGE)) {
    fs.copyFileSync(TEKSTIL_PAGE, TEKSTIL_PAGE + '.bak');
}
fs.writeFileSync(TEKSTIL_PAGE, tekstilCode, 'utf8');
console.log('Successfully updated tekstil/src/app/page.tsx');
