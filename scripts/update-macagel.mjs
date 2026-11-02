import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MACAGEL_HTML = path.join(__dirname, '../../halisaha/web/index.html');

const macagelHtml = `<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MaçaGel — Halı Saha Maç & Oyuncu Eşleştirme Motoru</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;500;600&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <script src="https://unpkg.com/feather-icons"></script>
    <style>
        :root {
            --bg-base: #06080a;
            --bg-surface: #0a0d12;
            --bg-card: #0f131a;
            --border-subtle: rgba(255, 255, 255, 0.08);
            --border-strong: rgba(255, 255, 255, 0.16);
            --border-accent: rgba(52, 211, 153, 0.35);
            --text-primary: #f8fafc;
            --text-secondary: #94a3b8;
            --text-muted: #64748b;
            --accent-green: #10b981;
            --accent-emerald: #34d399;
            --accent-cyan: #38bdf8;
            --font-sans: 'Inter', -apple-system, sans-serif;
            --font-mono: 'Geist Mono', monospace;
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            background: var(--bg-base);
            color: var(--text-primary);
            font-family: var(--font-sans);
            line-height: 1.6;
            -webkit-font-smoothing: antialiased;
            overflow-x: hidden;
        }

        .bg-grid {
            position: absolute;
            inset: 0;
            background-image: 
                linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
            background-size: 36px 36px;
            mask-image: radial-gradient(circle at 50% 15%, black 40%, transparent 80%);
            pointer-events: none;
        }

        nav {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            height: 60px;
            background: rgba(6, 8, 10, 0.85);
            backdrop-filter: blur(16px);
            border-bottom: 1px solid var(--border-subtle);
            z-index: 100;
            display: flex;
            align-items: center;
        }

        .container {
            max-width: 1240px;
            margin: 0 auto;
            padding: 0 24px;
            width: 100%;
        }

        .nav-inner {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .brand {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .brand-badge {
            width: 28px;
            height: 28px;
            border-radius: 6px;
            background: rgba(16, 185, 129, 0.1);
            border: 1px solid var(--border-accent);
            color: var(--accent-emerald);
            font-family: var(--font-mono);
            font-weight: 700;
            display: grid;
            place-items: center;
            font-size: 13px;
        }

        .brand-title {
            font-size: 15px;
            font-weight: 600;
            letter-spacing: -0.02em;
        }

        .status-pill {
            display: inline-flex;
            align-items: center;
            gap: 7px;
            font-family: var(--font-mono);
            font-size: 11px;
            color: var(--accent-emerald);
            background: rgba(52, 211, 153, 0.08);
            border: 1px solid rgba(52, 211, 153, 0.2);
            padding: 4px 10px;
            border-radius: 999px;
        }

        .status-dot {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: var(--accent-emerald);
            box-shadow: 0 0 6px var(--accent-emerald);
            animation: pulse 2s infinite;
        }

        .hero {
            padding: 130px 0 50px;
            text-align: center;
        }

        .kicker {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            font-family: var(--font-mono);
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.25em;
            color: var(--accent-emerald);
            margin-bottom: 18px;
        }

        .hero h1 {
            font-size: clamp(2.4rem, 5.2vw, 4.4rem);
            font-weight: 700;
            letter-spacing: -0.04em;
            line-height: 1.1;
            max-width: 900px;
            margin: 0 auto 18px;
            color: #ffffff;
        }

        .hero h1 span {
            color: var(--text-secondary);
            font-weight: 400;
        }

        .hero p {
            font-size: 16px;
            color: var(--text-secondary);
            max-width: 640px;
            margin: 0 auto 36px;
            line-height: 1.6;
        }

        /* Match Telemetry Window */
        .window {
            background: var(--bg-surface);
            border: 1px solid var(--border-subtle);
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 30px 90px -20px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.05);
            text-align: left;
        }

        .window-header {
            background: rgba(255, 255, 255, 0.02);
            border-bottom: 1px solid var(--border-subtle);
            padding: 10px 16px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-family: var(--font-mono);
            font-size: 11px;
        }

        .dots { display: flex; gap: 6px; }
        .dot { width: 10px; height: 10px; border-radius: 50%; background: rgba(255, 255, 255, 0.15); }

        .window-body {
            display: grid;
            grid-template-columns: 240px 1fr 280px;
            min-height: 380px;
        }

        .col-left {
            border-right: 1px solid var(--border-subtle);
            padding: 16px;
            background: rgba(0, 0, 0, 0.15);
        }

        .label {
            font-family: var(--font-mono);
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 0.12em;
            color: var(--text-muted);
            margin-bottom: 10px;
            display: block;
        }

        .pitch-card {
            background: var(--bg-card);
            border: 1px solid var(--border-subtle);
            border-radius: 6px;
            padding: 10px;
            margin-bottom: 8px;
        }

        .pitch-card.active {
            border-color: var(--border-accent);
            background: rgba(52, 211, 153, 0.08);
        }

        .pitch-name { font-size: 12px; font-weight: 600; color: #ffffff; }
        .pitch-meta { font-size: 10px; color: var(--text-muted); font-family: var(--font-mono); margin-top: 2px; }

        .col-center {
            padding: 18px 20px;
        }

        .table-title {
            font-size: 13px;
            font-weight: 600;
            color: #ffffff;
            margin-bottom: 12px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .match-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 12px;
            font-family: var(--font-mono);
        }

        .match-table th {
            text-align: left;
            color: var(--text-muted);
            font-size: 10px;
            text-transform: uppercase;
            padding: 8px;
            border-bottom: 1px solid var(--border-subtle);
        }

        .match-table td {
            padding: 10px 8px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.04);
            color: var(--text-secondary);
        }

        .badge-slot {
            font-size: 10px;
            padding: 2px 7px;
            border-radius: 4px;
            background: rgba(52, 211, 153, 0.1);
            color: var(--accent-emerald);
            border: 1px solid rgba(52, 211, 153, 0.2);
        }

        .badge-urgent {
            font-size: 10px;
            padding: 2px 7px;
            border-radius: 4px;
            background: rgba(239, 68, 68, 0.1);
            color: #f87171;
            border: 1px solid rgba(239, 68, 68, 0.2);
        }

        .col-right {
            border-left: 1px solid var(--border-subtle);
            padding: 16px;
            background: rgba(0, 0, 0, 0.15);
        }

        .telemetry-card {
            background: var(--bg-card);
            border: 1px solid var(--border-subtle);
            border-radius: 6px;
            padding: 12px;
            margin-bottom: 10px;
        }

        .t-label {
            font-family: var(--font-mono);
            font-size: 10px;
            color: var(--text-muted);
            display: block;
            margin-bottom: 2px;
        }

        .t-val {
            font-family: var(--font-mono);
            font-size: 18px;
            font-weight: 700;
            color: #ffffff;
        }

        @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.4; transform: scale(0.9); }
        }
    </style>
</head>
<body>
    <div class="bg-grid"></div>

    <nav>
        <div class="container">
            <div class="nav-inner">
                <div class="brand">
                    <div class="brand-badge">M</div>
                    <span class="brand-title">MaçaGel Platform</span>
                </div>
                <div class="status-pill">
                    <span class="status-dot"></span>
                    <span>DISPATCH ENGINE: 84 MAÇ AKTİF</span>
                </div>
            </div>
        </div>
    </nav>

    <div class="container">
        <section class="hero">
            <div class="kicker">
                <i data-feather="activity" style="width: 12px; height: 12px;"></i>
                <span>COMMUNITY SPORTS INFRASTRUCTURE // REACT NATIVE + CLOUD SYNC</span>
            </div>
            <h1>Halı Saha Maç & Oyuncu<br><span>Otonom Eşleştirme Motoru</span></h1>
            <p>
                WhatsApp gruplarındaki son dakika oyuncu iptallerini, saha kaporalarını ve kadro dengesizliklerini çözen; lokasyon bazlı radar ve güven skoru algoritmalarıyla çalışan spor ekosistemi.
            </p>

            <div class="window">
                <div class="window-header">
                    <div class="dots">
                        <div class="dot"></div>
                        <div class="dot"></div>
                        <div class="dot"></div>
                    </div>
                    <div>macagel-matchmaker // LIVE_KADRO_RADAR</div>
                    <div style="color: var(--accent-emerald);">MATCH_RATE: 94.8%</div>
                </div>

                <div class="window-body">
                    <div class="col-left">
                        <span class="label">Bölgesel Sahalar</span>
                        <div class="pitch-card active">
                            <div class="pitch-name">Kadıköy Moda Halı Saha</div>
                            <div class="pitch-meta">21:00 - 22:00 · 7v7 Çim Saha</div>
                        </div>
                        <div class="pitch-card">
                            <div class="pitch-name">Levent Spor Kompleksi</div>
                            <div class="pitch-meta">22:00 - 23:00 · 8v8 Kapalı Saha</div>
                        </div>
                        <div class="pitch-card">
                            <div class="pitch-name">Beşiktaş Yıldız Arena</div>
                            <div class="pitch-meta">23:00 - 00:00 · 6v6 Açık Saha</div>
                        </div>
                    </div>

                    <div class="col-center">
                        <div class="table-title">
                            <span>Canlı Kadro İhtiyaçları & Oyuncu Radarı</span>
                            <span style="font-family: var(--font-mono); font-size: 11px; color: var(--accent-emerald);">14 Bekleyen Çağrı</span>
                        </div>
                        <table class="match-table">
                            <thead>
                                <tr>
                                    <th>Maç ID</th>
                                    <th>Eksik Pozisyon</th>
                                    <th>Saat</th>
                                    <th>Güven Şartı</th>
                                    <th>Durum</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td style="color: var(--accent-emerald);">#MC-412</td>
                                    <td>Kaleci (1 Kişi)</td>
                                    <td>Bugün 21:00</td>
                                    <td>%90+ Katılım Skoru</td>
                                    <td><span class="badge-urgent">Acil Aranıyor</span></td>
                                </tr>
                                <tr>
                                    <td style="color: var(--accent-emerald);">#MC-413</td>
                                    <td>Orta Saha (2 Kişi)</td>
                                    <td>Bugün 22:00</td>
                                    <td>Amatör / Orta Seviye</td>
                                    <td><span class="badge-slot">1/2 Bulundu</span></td>
                                </tr>
                                <tr>
                                    <td style="color: var(--accent-emerald);">#MC-414</td>
                                    <td>Defans (1 Kişi)</td>
                                    <td>Yarın 20:00</td>
                                    <td>%85+ Katılım Skoru</td>
                                    <td><span class="badge-slot">Açık Slot</span></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div class="col-right">
                        <span class="label">Platform Metrikleri</span>
                        <div class="telemetry-card">
                            <span class="t-label">Aylık Oynanan Maç</span>
                            <span class="t-val">1,240+</span>
                        </div>
                        <div class="telemetry-card">
                            <span class="t-label">Ort. Kadro Tamamlama</span>
                            <span class="t-val" style="color: var(--accent-emerald);">8.4 Dk</span>
                        </div>
                        <div class="telemetry-card">
                            <span class="t-label">İptal Oranı Azalımı</span>
                            <span class="t-val" style="color: var(--accent-cyan);">-84%</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>

    <script>feather.replace();</script>
</body>
</html>
`;

if (fs.existsSync(MACAGEL_HTML)) fs.copyFileSync(MACAGEL_HTML, MACAGEL_HTML + '.bak');
fs.writeFileSync(MACAGEL_HTML, macagelHtml, 'utf8');
console.log('Successfully updated MaçaGel web landing page');
