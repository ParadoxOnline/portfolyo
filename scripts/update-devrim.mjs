import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEVRIM_INDEX = path.join(__dirname, '../../devrim/index.php');

console.log('Writing to:', DEVRIM_INDEX);

const devrimHtml = `<?php
/**
 * Devrim Social Engine - High Precision Operations & Automation Interface
 * Linear / Raycast Precision Engineering Style
 */
define('APP_ROOT', __DIR__);
if (file_exists(APP_ROOT . '/config/config.php')) {
    require_once APP_ROOT . '/config/config.php';
}
if (!defined('APP_NAME')) define('APP_NAME', 'Devrim Social Engine');
?>
<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= APP_NAME ?> — Çok Kanallı Sosyal Medya Dağıtım Motoru</title>
    <meta name="description" content="Instagram Graph API, WhatsApp Webhooks ve asenkron arka plan kuyruklarıyla çalışan kurumsal sosyal medya otomasyon sistemi.">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;500;600&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <script src="https://unpkg.com/feather-icons"></script>
    <style>
        :root {
            --bg-base: #06080b;
            --bg-surface: #0b0e14;
            --bg-card: #0f131a;
            --bg-card-hover: #141923;
            --border-subtle: rgba(255, 255, 255, 0.08);
            --border-strong: rgba(255, 255, 255, 0.16);
            --border-accent: rgba(56, 189, 248, 0.35);
            --text-primary: #f8fafc;
            --text-secondary: #94a3b8;
            --text-muted: #64748b;
            --accent-cyan: #38bdf8;
            --accent-emerald: #34d399;
            --accent-amber: #fbbf24;
            --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            --font-mono: 'Geist Mono', monospace;
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            background-color: var(--bg-base);
            color: var(--text-primary);
            font-family: var(--font-sans);
            line-height: 1.6;
            overflow-x: hidden;
            -webkit-font-smoothing: antialiased;
        }

        .bg-grid {
            position: absolute;
            inset: 0;
            background-image: 
                linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
            background-size: 40px 40px;
            mask-image: radial-gradient(circle at 50% 15%, black 40%, transparent 80%);
            pointer-events: none;
            z-index: 0;
        }

        .container {
            max-width: 1240px;
            margin: 0 auto;
            padding: 0 24px;
            position: relative;
            z-index: 1;
        }

        nav {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 100;
            background: rgba(6, 8, 11, 0.85);
            backdrop-filter: blur(16px);
            border-bottom: 1px solid var(--border-subtle);
            height: 60px;
            display: flex;
            align-items: center;
        }

        nav .container {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
        }

        .brand {
            display: flex;
            align-items: center;
            gap: 10px;
            text-decoration: none;
            color: var(--text-primary);
        }

        .brand-badge {
            width: 26px;
            height: 26px;
            border-radius: 6px;
            background: rgba(56, 189, 248, 0.1);
            border: 1px solid var(--border-accent);
            display: grid;
            place-items: center;
            color: var(--accent-cyan);
            font-family: var(--font-mono);
            font-size: 12px;
            font-weight: 600;
        }

        .brand-title {
            font-size: 14px;
            font-weight: 600;
            letter-spacing: -0.02em;
        }

        .nav-meta {
            display: flex;
            align-items: center;
            gap: 20px;
        }

        .status-pill {
            display: inline-flex;
            align-items: center;
            gap: 7px;
            font-family: var(--font-mono);
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.15em;
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
            box-shadow: 0 0 8px var(--accent-emerald);
            animation: pulse 2s infinite;
        }

        .nav-btn {
            font-family: var(--font-mono);
            font-size: 11px;
            font-weight: 500;
            color: var(--text-primary);
            text-decoration: none;
            background: rgba(255, 255, 255, 0.06);
            border: 1px solid var(--border-subtle);
            padding: 6px 14px;
            border-radius: 6px;
            transition: all 0.2s ease;
        }

        .nav-btn:hover {
            background: rgba(255, 255, 255, 0.12);
            border-color: var(--border-strong);
        }

        .hero {
            padding: 130px 0 60px;
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
            color: var(--accent-cyan);
            margin-bottom: 18px;
        }

        .hero h1 {
            font-size: clamp(2.3rem, 5vw, 4.2rem);
            font-weight: 700;
            letter-spacing: -0.04em;
            line-height: 1.1;
            max-width: 860px;
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
            margin: 0 auto 32px;
            line-height: 1.6;
        }

        .hero-actions {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
            margin-bottom: 44px;
        }

        .btn-primary {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: #ffffff;
            color: #000000;
            font-size: 13px;
            font-weight: 600;
            text-decoration: none;
            padding: 9px 20px;
            border-radius: 6px;
            transition: transform 0.15s ease, box-shadow 0.2s ease;
        }

        .btn-primary:hover {
            transform: translateY(-1px);
            box-shadow: 0 0 25px rgba(255, 255, 255, 0.25);
        }

        .btn-ghost {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: transparent;
            color: var(--text-secondary);
            font-size: 12px;
            font-family: var(--font-mono);
            text-decoration: none;
            padding: 9px 16px;
            border-radius: 6px;
            border: 1px solid var(--border-subtle);
            transition: all 0.2s ease;
        }

        .btn-ghost:hover {
            color: #ffffff;
            border-color: var(--border-strong);
            background: rgba(255, 255, 255, 0.03);
        }

        .console-window {
            background: var(--bg-surface);
            border: 1px solid var(--border-subtle);
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 30px 90px -20px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.05);
            margin: 0 auto;
            text-align: left;
        }

        .console-header {
            background: rgba(255, 255, 255, 0.02);
            border-bottom: 1px solid var(--border-subtle);
            padding: 10px 16px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .console-dots {
            display: flex;
            gap: 6px;
        }

        .console-dot {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.15);
        }

        .console-title {
            font-family: var(--font-mono);
            font-size: 11px;
            color: var(--text-muted);
            letter-spacing: 0.1em;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .console-body {
            display: grid;
            grid-template-columns: 220px 1fr 260px;
            min-height: 340px;
        }

        .console-sidebar {
            border-right: 1px solid var(--border-subtle);
            padding: 16px;
            background: rgba(0, 0, 0, 0.15);
        }

        .console-sidebar-label {
            font-family: var(--font-mono);
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 0.15em;
            color: var(--text-muted);
            margin-bottom: 10px;
            display: block;
        }

        .account-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 8px 10px;
            border-radius: 6px;
            font-size: 12px;
            color: var(--text-secondary);
            margin-bottom: 4px;
            border: 1px solid transparent;
        }

        .account-item.active {
            background: rgba(56, 189, 248, 0.08);
            border-color: var(--border-accent);
            color: #ffffff;
        }

        .console-main {
            padding: 18px 20px;
        }

        .queue-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 14px;
            border-bottom: 1px solid var(--border-subtle);
            padding-bottom: 10px;
        }

        .queue-title {
            font-family: var(--font-mono);
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            color: #ffffff;
        }

        .queue-counter {
            font-family: var(--font-mono);
            font-size: 10px;
            color: var(--accent-cyan);
            background: rgba(56, 189, 248, 0.1);
            padding: 2px 7px;
            border-radius: 4px;
        }

        .queue-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 12px;
            font-family: var(--font-mono);
        }

        .queue-table th {
            text-align: left;
            color: var(--text-muted);
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            padding: 7px 8px;
            border-bottom: 1px solid var(--border-subtle);
        }

        .queue-table td {
            padding: 10px 8px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.04);
            color: var(--text-secondary);
        }

        .queue-badge {
            display: inline-flex;
            align-items: center;
            gap: 5px;
            padding: 2px 7px;
            border-radius: 4px;
            font-size: 10px;
            font-weight: 500;
        }

        .badge-wa { background: rgba(52, 211, 153, 0.1); color: var(--accent-emerald); border: 1px solid rgba(52, 211, 153, 0.2); }
        .badge-sync { background: rgba(56, 189, 248, 0.1); color: var(--accent-cyan); border: 1px solid rgba(56, 189, 248, 0.2); }
        .badge-pending { background: rgba(251, 191, 36, 0.1); color: var(--accent-amber); border: 1px solid rgba(251, 191, 36, 0.2); }

        .console-telemetry {
            border-left: 1px solid var(--border-subtle);
            padding: 16px;
            background: rgba(0, 0, 0, 0.15);
        }

        .stat-card {
            background: var(--bg-card);
            border: 1px solid var(--border-subtle);
            border-radius: 8px;
            padding: 12px;
            margin-bottom: 10px;
        }

        .stat-label {
            font-family: var(--font-mono);
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            color: var(--text-muted);
            display: block;
            margin-bottom: 4px;
        }

        .stat-val {
            font-family: var(--font-mono);
            font-size: 18px;
            font-weight: 600;
            color: #ffffff;
        }

        .features {
            padding: 90px 0;
            border-top: 1px solid var(--border-subtle);
        }

        .section-header {
            margin-bottom: 44px;
        }

        .section-eyebrow {
            font-family: var(--font-mono);
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.2em;
            color: var(--accent-cyan);
            margin-bottom: 8px;
        }

        .section-title {
            font-size: 26px;
            font-weight: 700;
            letter-spacing: -0.03em;
            color: #ffffff;
        }

        .signals-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 18px;
        }

        .signal-card {
            background: var(--bg-card);
            border: 1px solid var(--border-subtle);
            border-radius: 10px;
            padding: 22px;
            transition: all 0.25s ease;
        }

        .signal-card:hover {
            border-color: var(--border-strong);
            background: var(--bg-card-hover);
        }

        .signal-num {
            font-family: var(--font-mono);
            font-size: 10px;
            color: var(--text-muted);
            margin-bottom: 10px;
        }

        .signal-title {
            font-size: 15px;
            font-weight: 600;
            color: #ffffff;
            margin-bottom: 8px;
            letter-spacing: -0.01em;
        }

        .signal-desc {
            font-size: 13px;
            color: var(--text-secondary);
            line-height: 1.6;
        }

        footer {
            padding: 36px 0;
            border-top: 1px solid var(--border-subtle);
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-family: var(--font-mono);
            font-size: 11px;
            color: var(--text-muted);
        }

        @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.4; transform: scale(0.9); }
        }

        @media (max-width: 960px) {
            .console-body {
                grid-template-columns: 1fr;
            }
            .console-sidebar, .console-telemetry {
                display: none;
            }
            .signals-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="bg-grid"></div>

    <nav>
        <div class="container">
            <a href="#" class="brand">
                <div class="brand-badge">D</div>
                <div class="brand-title">Devrim Social Engine</div>
            </a>
            <div class="nav-meta">
                <div class="status-pill">
                    <span class="status-dot"></span>
                    <span>QUEUE: 100% OPERATIONAL</span>
                </div>
                <a href="admin/login.php" class="nav-btn">Yönetim Konsolu &rarr;</a>
            </div>
        </div>
    </nav>

    <main>
        <section class="hero">
            <div class="container">
                <div class="kicker">
                    <i data-feather="cpu" style="width: 14px; height: 14px;"></i>
                    <span>DEVRIM ENGINE // V2.4 MULTI-TENANT SOCIAL PIPELINE</span>
                </div>
                <h1>Çok Kanallı Sosyal Medya<br><span>Otomasyon & Dağıtım Motoru</span></h1>
                <p>
                    Instagram Graph API, WhatsApp Webhooks ve asenkron cron kuyruklarıyla çalışan; içerik boyutlandırmasından müşteri onayına kadar her adımı otonom yürüten operasyonel arka uç mimarisi.
                </p>
                <div class="hero-actions">
                    <a href="admin/login.php" class="btn-primary">
                        <span>Operasyon Paneline Gir</span>
                        <i data-feather="arrow-up-right" style="width: 15px; height: 15px;"></i>
                    </a>
                    <a href="#architecture" class="btn-ghost">
                        <span>Mimari Detayları</span>
                    </a>
                </div>

                <!-- High Fidelity Linear Console Mockup -->
                <div class="console-window">
                    <div class="console-header">
                        <div class="console-dots">
                            <div class="console-dot"></div>
                            <div class="console-dot"></div>
                            <div class="console-dot"></div>
                        </div>
                        <div class="console-title">
                            <i data-feather="terminal" style="width: 12px; height: 12px;"></i>
                            <span>devrim-worker-node-01 [LIVE_DISPATCH_THREAD]</span>
                        </div>
                        <div style="font-family: var(--font-mono); font-size: 11px; color: var(--accent-emerald);">
                            SYNC_LATENCY: 18ms
                        </div>
                    </div>
                    <div class="console-body">
                        <!-- Sidebar: Connected Tenancies -->
                        <div class="console-sidebar">
                            <span class="console-sidebar-label">Bağlı İşletmeler</span>
                            <div class="account-item active">
                                <span>Koru Kahve Evi</span>
                                <span style="font-family: var(--font-mono); font-size: 10px; color: var(--accent-cyan);">AKTİF</span>
                            </div>
                            <div class="account-item">
                                <span>Atelier Mimarlık</span>
                                <span style="font-family: var(--font-mono); font-size: 10px; color: var(--text-muted);">BEKLEMEDE</span>
                            </div>
                            <div class="account-item">
                                <span>Nova Dental Klinik</span>
                                <span style="font-family: var(--font-mono); font-size: 10px; color: var(--text-muted);">SENKRON</span>
                            </div>
                            <div class="account-item">
                                <span>Veloce Motors</span>
                                <span style="font-family: var(--font-mono); font-size: 10px; color: var(--text-muted);">KUYRUKTA</span>
                            </div>
                        </div>

                        <!-- Main: Queue Table -->
                        <div class="console-main">
                            <div class="queue-header">
                                <span class="queue-title">Canlı Yayın Akışı ve Onay Kuyruğu</span>
                                <span class="queue-counter">8 Görev İşleniyor</span>
                            </div>
                            <table class="queue-table">
                                <thead>
                                    <tr>
                                        <th>İçerik ID</th>
                                        <th>Kanal</th>
                                        <th>Zamanlama</th>
                                        <th>Durum</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>#POST-8921</td>
                                        <td>Instagram Post (4:5)</td>
                                        <td>Bugün 18:30</td>
                                        <td><span class="queue-badge badge-wa">WhatsApp Onaylandı</span></td>
                                    </tr>
                                    <tr>
                                        <td>#POST-8922</td>
                                        <td>Instagram Story (9:16)</td>
                                        <td>Bugün 20:00</td>
                                        <td><span class="queue-badge badge-sync">Kuyruğa Alındı</span></td>
                                    </tr>
                                    <tr>
                                        <td>#POST-8923</td>
                                        <td>Reels Video (60s)</td>
                                        <td>Yarın 12:15</td>
                                        <td><span class="queue-badge badge-pending">Onay Bekliyor</span></td>
                                    </tr>
                                    <tr>
                                        <td>#POST-8924</td>
                                        <td>Carousel (5 Slide)</td>
                                        <td>Yarın 17:00</td>
                                        <td><span class="queue-badge badge-sync">Media Render OK</span></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <!-- Telemetry / Stats -->
                        <div class="console-telemetry">
                            <div class="stat-card">
                                <span class="stat-label">Worker Uptime</span>
                                <span class="stat-val">99.98%</span>
                            </div>
                            <div class="stat-card">
                                <span class="stat-label">Meta API Rate Limit</span>
                                <span class="stat-val" style="color: var(--accent-cyan);">14 / 200 (Güvenli)</span>
                            </div>
                            <div class="stat-card">
                                <span class="stat-label">WhatsApp Webhook</span>
                                <span class="stat-val" style="color: var(--accent-emerald);">Anlık 2 Yönlü</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Engineering Architecture Breakdown -->
        <section class="features" id="architecture">
            <div class="container">
                <div class="section-header">
                    <div class="section-eyebrow">// SİSTEM MİMARİSİ VE ÇÖZÜMLER</div>
                    <div class="section-title">Neden Hazır Araçlar Değil, Özel Mimari?</div>
                </div>

                <div class="signals-grid">
                    <div class="signal-card">
                        <div class="signal-num">ENGINE_LAYER // 01</div>
                        <div class="signal-title">Asenkron Kuyruk & Exponential Backoff</div>
                        <div class="signal-desc">
                            Sosyal medya API'leri ağ kesintileri ve anlık hız sınırları (rate limits) yaşatabilir. Devrim motoru, başarısız istekleri exponential backoff algoritmasıyla tekrar dener; ana iş parçacığı asla bloklanmaz.
                        </div>
                    </div>
                    <div class="signal-card">
                        <div class="signal-num">ENGINE_LAYER // 02</div>
                        <div class="signal-title">WhatsApp Üzerinden 1-Tık Müşteri Onayı</div>
                        <div class="signal-desc">
                            Müşterileri yeni bir yönetim paneline alıştırmak yerine, önizlemeler WhatsApp Business API üzerinden gönderilir. Tek bir "ONAYLA" cevabı webhook ile tetiklenir ve içerik otomatik planlanır.
                        </div>
                    </div>
                    <div class="signal-card">
                        <div class="signal-num">ENGINE_LAYER // 03</div>
                        <div class="signal-title">Otomatik Medya Boyutlandırma & Transcode</div>
                        <div class="signal-desc">
                            Yüklenen ham görseller ve videolar; Story (9:16), Post (4:5) ve Feed (1:1) standartlarına göre optimize edilir, WebP/MP4 formatına sıkıştırılarak API yükleme hataları sıfıra indirilir.
                        </div>
                    </div>
                </div>

                <div style="margin-top: 40px; text-align: center;">
                    <a href="admin/login.php" class="btn-primary" style="display: inline-flex;">
                        <span>Yönetim Konsolunu Başlat</span>
                        <i data-feather="chevron-right" style="width: 16px; height: 16px;"></i>
                    </a>
                </div>
            </div>
        </section>
    </main>

    <footer>
        <div class="container">
            <span>&copy; <?= date('Y') ?> DEVRIM SOCIAL ENGINE // PRODUCTION ARCHITECTURE</span>
            <span>BACKEND: PHP + MYSQL + CRON WORKERS</span>
        </div>
    </footer>

    <script>feather.replace();</script>
</body>
</html>
`;

// Backup old file
if (fs.existsSync(DEVRIM_INDEX)) {
    fs.copyFileSync(DEVRIM_INDEX, DEVRIM_INDEX + '.bak');
}
fs.writeFileSync(DEVRIM_INDEX, devrimHtml, 'utf8');
console.log('Successfully updated devrim/index.php');
