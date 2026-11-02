import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ARAMA_DASH = path.join(__dirname, '../../arama/apps/web/src/app/(dashboard)/dashboard/page.tsx');

const aramaDashCode = `import type { Metadata } from 'next';
import {
  Phone,
  CheckCircle,
  TrendingUp,
  Flame,
  Clock,
  DollarSign,
  Target,
  PhoneCall,
  Activity,
  Layers,
  ArrowUpRight,
  ShieldAlert,
} from 'lucide-react';

export const metadata: Metadata = { title: 'Arama Telemetri Paneli' };
export const dynamic = 'force-dynamic';

export default function DashboardPage() {
  const stats = [
    { label: "Bugünkü Görüşmeler", val: "4,892", change: "+18.4%", icon: Phone, color: "text-sky-400" },
    { label: "Yanıt Oranı", val: "%78.6", change: "+4.2%", icon: CheckCircle, color: "text-emerald-400" },
    { label: "Nitelikli Satış Lead'i", val: "614", change: "+12.1%", icon: Target, color: "text-cyan-400" },
    { label: "Sıcak Randevu", val: "182", change: "+8.9%", icon: Flame, color: "text-amber-400" },
    { label: "Ort. Görüşme Süresi", val: "2 dk 45 sn", change: "-12 sn", icon: Clock, color: "text-indigo-400" },
    { label: "Maliyet / Görüşme", val: "₺0.84", change: "-%6.2", icon: DollarSign, color: "text-teal-400" },
    { label: "Model Yanıt Gecikmesi", val: "142 ms", change: "Optimal", icon: Activity, color: "text-sky-300" },
    { label: "Aktif Canlı Hatlar", val: "24 / 50", change: "Online", icon: PhoneCall, color: "text-emerald-400" },
  ];

  const recentCalls = [
    { id: "CALL-9421", target: "Kaya Otomotiv / Serdar K.", time: "18:42", duration: "3m 12s", status: "Randevu Alındı", sentiment: "Pozitif", score: "%94" },
    { id: "CALL-9420", target: "Ege Lojistik / Merve Y.", time: "18:38", duration: "1m 45s", status: "Teklif İstendi", sentiment: "Pozitif", score: "%88" },
    { id: "CALL-9419", target: "Zirve Mimarlık / Ahmet B.", time: "18:34", duration: "4m 20s", status: "Yeniden Arama", sentiment: "Nötr", score: "%72" },
    { id: "CALL-9418", target: "Atlas Hukuk / Canan T.", time: "18:29", duration: "0m 35s", status: "Meşgul / İptal", sentiment: "Negatif", score: "%34" },
  ];

  return (
    <div className="min-h-screen bg-[#07090d] text-white p-6 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5 mb-6">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-sky-400 mb-1">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>ARAMA VOICE ENGINE // REAL-TIME DISPATCH DISK</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">Performans & Çağrı Telemetrisi</h1>
          <p className="text-sm text-white/50">Yapay zeka sesli asistan hatlarının anlık çağrı, yanıt ve nitelikli randevu akışı.</p>
        </div>
        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="px-3 py-1.5 rounded-lg border border-emerald-400/20 bg-emerald-400/10 text-emerald-300 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            HAT: 0850 302 44 10 (AKTİF)
          </div>
        </div>
      </div>

      {/* 8 Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="p-4 rounded-xl border border-white/10 bg-[#0d1017] hover:border-white/20 transition">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-white/50 font-medium">{s.label}</span>
                <Icon size={16} className={s.color} />
              </div>
              <div className="text-xl md:text-2xl font-bold font-mono tracking-tight text-white">{s.val}</div>
              <div className="mt-1 font-mono text-[11px] text-emerald-400">{s.change}</div>
            </div>
          );
        })}
      </div>

      {/* Center Charts: Pure SVG wave chart + Funnel */}
      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        {/* SVG Call Volume Chart */}
        <div className="lg:col-span-2 p-5 rounded-xl border border-white/10 bg-[#0d1017]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-white">Saatlik Çağrı Hacmi & Yanıt Grafiği</h2>
              <span className="text-xs text-white/40 font-mono">Son 12 saatlik eşzamanlı hat yoğunluğu</span>
            </div>
            <span className="font-mono text-xs px-2.5 py-1 rounded bg-sky-400/10 text-sky-300 border border-sky-400/20">Peak: 14:00 (420 Call/h)</span>
          </div>

          <div className="h-44 w-full relative flex items-end pt-4">
            {/* Custom SVG Wave */}
            <svg className="w-full h-full overflow-visible" viewBox="0 0 500 120" preserveAspectRatio="none">
              <defs>
                <linearGradient id="callGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d="M0,100 Q40,60 80,75 T160,40 T240,20 T320,45 T400,15 T500,60 L500,120 L0,120 Z"
                fill="url(#callGrad)"
              />
              <path
                d="M0,100 Q40,60 80,75 T160,40 T240,20 T320,45 T400,15 T500,60"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="2.5"
              />
            </svg>
          </div>
          <div className="flex justify-between font-mono text-[10px] text-white/40 mt-3 border-t border-white/5 pt-2">
            <span>08:00</span>
            <span>10:00</span>
            <span>12:00</span>
            <span>14:00 (PEAK)</span>
            <span>16:00</span>
            <span>18:00</span>
          </div>
        </div>

        {/* Funnel */}
        <div className="p-5 rounded-xl border border-white/10 bg-[#0d1017]">
          <h2 className="text-sm font-semibold text-white mb-1">Dönüşüm Hunisi</h2>
          <span className="text-xs text-white/40 font-mono mb-4 block">Aranan &rarr; Randevu adımları</span>

          <div className="space-y-3 font-mono text-xs">
            <div>
              <div className="flex justify-between text-white/70 mb-1">
                <span>1. Aranılan Numara</span>
                <span>4,892 (%100)</span>
              </div>
              <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                <div className="h-full bg-sky-400 w-full" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-white/70 mb-1">
                <span>2. Çağrı Açıldı</span>
                <span>3,845 (%78.6)</span>
              </div>
              <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                <div className="h-full bg-cyan-400 w-[78%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-white/70 mb-1">
                <span>3. 30sn+ Dinleme</span>
                <span>2,108 (%43.1)</span>
              </div>
              <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                <div className="h-full bg-indigo-400 w-[43%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-white/70 mb-1">
                <span>4. Nitelikli Randevu</span>
                <span className="text-emerald-400 font-bold">182 (%8.9)</span>
              </div>
              <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                <div className="h-full bg-emerald-400 w-[18%]" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Calls Table */}
      <div className="rounded-xl border border-white/10 bg-[#0d1017] p-5">
        <h2 className="text-sm font-semibold text-white mb-3">Son Çağrı Raporları & NLP Değerlendirmesi</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-white/10 text-white/40">
                <th className="pb-2">Çağrı ID</th>
                <th className="pb-2">Hedef Firma & Yetkili</th>
                <th className="pb-2">Saat</th>
                <th className="pb-2">Süre</th>
                <th className="pb-2">Sonuç</th>
                <th className="pb-2">NLP Skoru</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {recentCalls.map((c) => (
                <tr key={c.id} className="text-white/80">
                  <td className="py-2.5 text-sky-400">{c.id}</td>
                  <td className="py-2.5 text-white font-sans">{c.target}</td>
                  <td className="py-2.5 text-white/50">{c.time}</td>
                  <td className="py-2.5">{c.duration}</td>
                  <td className="py-2.5">
                    <span className="px-2 py-0.5 rounded bg-emerald-400/10 text-emerald-300 border border-emerald-400/20 text-[10px]">
                      {c.status}
                    </span>
                  </td>
                  <td className="py-2.5 text-emerald-400">{c.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
`;

// Backup and update
if (fs.existsSync(ARAMA_DASH)) {
    fs.copyFileSync(ARAMA_DASH, ARAMA_DASH + '.bak');
}
fs.writeFileSync(ARAMA_DASH, aramaDashCode, 'utf8');
console.log('Successfully updated arama dashboard page');
