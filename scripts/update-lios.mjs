import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SEO_HTML = path.join(__dirname, '../../seo/index.html');
const SEO_CSS = path.join(__dirname, '../../seo/style.css');

const liosHtml = `<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LIOS — Local Business Intelligence & SEO Engine</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;500;600&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
    <script src="https://unpkg.com/feather-icons"></script>
</head>
<body>
    <div class="bg-grid"></div>

    <nav class="top-nav">
        <div class="nav-container">
            <div class="brand">
                <div class="brand-badge">L</div>
                <div class="brand-text">
                    <span class="brand-title">LIOS Engine</span>
                    <span class="brand-sub">SEO Automation & Local Graph</span>
                </div>
            </div>
            <div class="nav-meta">
                <div class="status-chip">
                    <span class="status-dot"></span>
                    <span>INDEXING API: ACTIVE (24h SYNC)</span>
                </div>
                <a href="#console" class="nav-btn">Terminal Konsolu</a>
            </div>
        </div>
    </nav>

    <div class="main-wrapper" id="console">
        <!-- Hero Header -->
        <header class="console-hero">
            <div class="kicker">
                <i data-feather="database" style="width: 12px; height: 12px;"></i>
                <span>AUTONOMOUS SEO PLATFORM // 25 INTEGRATED MICROSERVICES</span>
            </div>
            <h1>Yerel İşletme Zekası &<br><span>Programatik SEO Motoru</span></h1>
            <p>
                İşletme verilerini, konum grafiklerini ve arama sinyallerini toplayan; Google Indexing API üzerinden semantik içerikleri otonom yayımlayan 4 katmanlı Clean Architecture altyapısı.
            </p>
        </header>

        <!-- Precision Operations Dashboard -->
        <div class="ops-window">
            <div class="ops-header">
                <div class="ops-dots">
                    <div class="dot"></div>
                    <div class="dot"></div>
                    <div class="dot"></div>
                </div>
                <div class="ops-title">
                    <i data-feather="cpu" style="width: 13px; height: 13px;"></i>
                    <span>lios-core-engine // PRODUCTION_GRAPH_NODE</span>
                </div>
                <div class="ops-stat">
                    <span>GSC_INDEX_RATE: 98.4%</span>
                </div>
            </div>

            <div class="ops-grid">
                <!-- Left: Control Panel -->
                <div class="ops-sidebar">
                    <span class="panel-label">Seçili Sektör & Bölge</span>
                    <div class="preset-box active">
                        <div class="preset-name">Bursa / Nilüfer Diş Klinikleri</div>
                        <div class="preset-meta">48 Sayfa · Schema: MedicalBusiness</div>
                    </div>
                    <div class="preset-box">
                        <div class="preset-name">İzmir / Bornova Oto Ekspertiz</div>
                        <div class="preset-meta">32 Sayfa · Schema: AutoRepair</div>
                    </div>
                    <div class="preset-box">
                        <div class="preset-name">Kadıköy Özel Hukuk Büroları</div>
                        <div class="preset-meta">26 Sayfa · Schema: LegalService</div>
                    </div>

                    <div style="margin-top: 24px;">
                        <span class="panel-label">Motor Parametreleri</span>
                        <div class="param-row">
                            <span>Vektör Benzerlik:</span>
                            <span class="val">Qdrant Cosine (&gt;0.82)</span>
                        </div>
                        <div class="param-row">
                            <span>Kanibalizasyon:</span>
                            <span class="val text-emerald">Sıfır Çakışma</span>
                        </div>
                        <div class="param-row">
                            <span>Google Indexing:</span>
                            <span class="val text-cyan">Otonom Cron</span>
                        </div>
                    </div>
                </div>

                <!-- Center: Live Generated Content & Metrics -->
                <div class="ops-main">
                    <div class="main-bar">
                        <span class="main-bar-title">Programatik Sayfa Analiz Raporu</span>
                        <span class="badge-ready">CANLIYA ALINDI</span>
                    </div>

                    <div class="code-preview">
                        <div class="code-line"><span class="c-key">&lt;meta</span> <span class="c-attr">name=</span><span class="c-val">"title"</span> <span class="c-attr">content=</span><span class="c-val">"Bursa Nilüfer En İyi Diş Klinikleri & İmplant Fiyatları 2026"</span><span class="c-key">&gt;</span></div>
                        <div class="code-line"><span class="c-key">&lt;script</span> <span class="c-attr">type=</span><span class="c-val">"application/ld+json"</span><span class="c-key">&gt;</span></div>
                        <div class="code-line indent">{"@context": "https://schema.org", "@type": "MedicalBusiness", "aggregateRating": {"ratingValue": "4.9"}}</div>
                        <div class="code-line"><span class="c-key">&lt;/script&gt;</span></div>
                    </div>

                    <div class="metrics-row">
                        <div class="metric-card">
                            <span class="m-label">Lighthouse SEO Skoru</span>
                            <span class="m-val text-emerald">100 / 100</span>
                        </div>
                        <div class="metric-card">
                            <span class="m-label">Ort. Sıralama Süresi</span>
                            <span class="m-val">4.2 Gün</span>
                        </div>
                        <div class="metric-card">
                            <span class="m-label">İç Bağlantı Yoğunluğu</span>
                            <span class="m-val text-cyan">12 Bağ / Sayfa</span>
                        </div>
                    </div>
                </div>

                <!-- Right: Telemetry & Pipeline -->
                <div class="ops-telemetry">
                    <span class="panel-label">Pipeline Evreleri</span>
                    <div class="step-item active">
                        <div class="step-circle">1</div>
                        <div>
                            <div class="step-t">Data Ingestion</div>
                            <div class="step-d">İşletme API & Web Scraping</div>
                        </div>
                    </div>
                    <div class="step-item active">
                        <div class="step-circle">2</div>
                        <div>
                            <div class="step-t">Semantic Clustering</div>
                            <div class="step-d">Vektör Kümeleme (HDBSCAN)</div>
                        </div>
                    </div>
                    <div class="step-item active">
                        <div class="step-circle">3</div>
                        <div>
                            <div class="step-t">Page Graph Compile</div>
                            <div class="step-d">ISR + Clean HTML Üretimi</div>
                        </div>
                    </div>
                    <div class="step-item active">
                        <div class="step-circle">4</div>
                        <div>
                            <div class="step-t">Autonomous Ping</div>
                            <div class="step-d">Google Indexing API v3</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>feather.replace();</script>
</body>
</html>
`;

const liosCss = `/* LIOS Engine — Linear Dark Precision Theme */
:root {
    --bg-base: #06080c;
    --bg-surface: #0b0f17;
    --bg-card: #101622;
    --border-subtle: rgba(255, 255, 255, 0.08);
    --border-strong: rgba(255, 255, 255, 0.16);
    --border-accent: rgba(56, 189, 248, 0.35);
    --text-primary: #f8fafc;
    --text-secondary: #94a3b8;
    --text-muted: #64748b;
    --accent-cyan: #38bdf8;
    --accent-emerald: #34d399;
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

.top-nav {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 60px;
    background: rgba(6, 8, 12, 0.85);
    backdrop-filter: blur(16px);
    border-bottom: 1px solid var(--border-subtle);
    z-index: 100;
    display: flex;
    align-items: center;
}

.nav-container {
    max-width: 1240px;
    margin: 0 auto;
    padding: 0 24px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.brand {
    display: flex;
    align-items: center;
    gap: 12px;
}

.brand-badge {
    width: 28px;
    height: 28px;
    border-radius: 6px;
    background: rgba(56, 189, 248, 0.1);
    border: 1px solid var(--border-accent);
    color: var(--accent-cyan);
    font-family: var(--font-mono);
    font-weight: 700;
    display: grid;
    place-items: center;
    font-size: 13px;
}

.brand-title {
    font-size: 14px;
    font-weight: 600;
    display: block;
    line-height: 1.2;
}

.brand-sub {
    font-size: 11px;
    color: var(--text-muted);
    font-family: var(--font-mono);
}

.nav-meta {
    display: flex;
    align-items: center;
    gap: 16px;
}

.status-chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
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
}

.nav-btn {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--text-primary);
    text-decoration: none;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid var(--border-subtle);
    padding: 6px 14px;
    border-radius: 6px;
}

.main-wrapper {
    max-width: 1240px;
    margin: 0 auto;
    padding: 120px 24px 60px;
    position: relative;
}

.console-hero {
    text-align: center;
    margin-bottom: 40px;
}

.kicker {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--accent-cyan);
    letter-spacing: 0.15em;
    margin-bottom: 14px;
}

.console-hero h1 {
    font-size: clamp(2.2rem, 5vw, 4rem);
    font-weight: 700;
    letter-spacing: -0.04em;
    line-height: 1.1;
    margin-bottom: 16px;
}

.console-hero h1 span {
    color: var(--text-secondary);
    font-weight: 400;
}

.console-hero p {
    font-size: 16px;
    color: var(--text-secondary);
    max-width: 640px;
    margin: 0 auto;
}

.ops-window {
    background: var(--bg-surface);
    border: 1px solid var(--border-subtle);
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 30px 90px -20px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.05);
}

.ops-header {
    background: rgba(255, 255, 255, 0.02);
    border-bottom: 1px solid var(--border-subtle);
    padding: 10px 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-family: var(--font-mono);
    font-size: 11px;
}

.ops-dots {
    display: flex;
    gap: 6px;
}

.dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.15);
}

.ops-title {
    color: var(--text-muted);
    display: flex;
    align-items: center;
    gap: 8px;
}

.ops-stat {
    color: var(--accent-emerald);
}

.ops-grid {
    display: grid;
    grid-template-columns: 240px 1fr 240px;
    min-height: 380px;
}

.ops-sidebar {
    border-right: 1px solid var(--border-subtle);
    padding: 18px;
    background: rgba(0, 0, 0, 0.15);
}

.panel-label {
    font-family: var(--font-mono);
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--text-muted);
    display: block;
    margin-bottom: 10px;
}

.preset-box {
    background: var(--bg-card);
    border: 1px solid var(--border-subtle);
    border-radius: 6px;
    padding: 10px;
    margin-bottom: 8px;
    cursor: pointer;
}

.preset-box.active {
    border-color: var(--border-accent);
    background: rgba(56, 189, 248, 0.08);
}

.preset-name {
    font-size: 12px;
    font-weight: 600;
    color: #ffffff;
}

.preset-meta {
    font-size: 10px;
    color: var(--text-muted);
    font-family: var(--font-mono);
    margin-top: 2px;
}

.param-row {
    display: flex;
    justify-content: space-between;
    font-family: var(--font-mono);
    font-size: 11px;
    padding: 6px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.04);
    color: var(--text-secondary);
}

.val { font-weight: 500; }
.text-emerald { color: var(--accent-emerald); }
.text-cyan { color: var(--accent-cyan); }

.ops-main {
    padding: 20px;
}

.main-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 14px;
}

.main-bar-title {
    font-size: 13px;
    font-weight: 600;
    color: #ffffff;
}

.badge-ready {
    font-family: var(--font-mono);
    font-size: 10px;
    padding: 2px 8px;
    border-radius: 4px;
    background: rgba(52, 211, 153, 0.1);
    color: var(--accent-emerald);
    border: 1px solid rgba(52, 211, 153, 0.2);
}

.code-preview {
    background: var(--bg-card);
    border: 1px solid var(--border-subtle);
    border-radius: 8px;
    padding: 14px;
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--text-secondary);
    line-height: 1.6;
    margin-bottom: 18px;
}

.c-key { color: #f43f5e; }
.c-attr { color: #38bdf8; }
.c-val { color: #34d399; }
.indent { padding-left: 16px; color: #cbd5e1; }

.metrics-row {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
}

.metric-card {
    background: var(--bg-card);
    border: 1px solid var(--border-subtle);
    border-radius: 6px;
    padding: 12px;
}

.m-label {
    font-family: var(--font-mono);
    font-size: 10px;
    color: var(--text-muted);
    display: block;
    margin-bottom: 4px;
}

.m-val {
    font-family: var(--font-mono);
    font-size: 16px;
    font-weight: 700;
    color: #ffffff;
}

.ops-telemetry {
    border-left: 1px solid var(--border-subtle);
    padding: 18px;
    background: rgba(0, 0, 0, 0.15);
}

.step-item {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    margin-bottom: 14px;
}

.step-circle {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: rgba(56, 189, 248, 0.1);
    border: 1px solid var(--accent-cyan);
    color: var(--accent-cyan);
    font-family: var(--font-mono);
    font-size: 10px;
    display: grid;
    place-items: center;
    flex-shrink: 0;
}

.step-t {
    font-size: 11px;
    font-weight: 600;
    color: #ffffff;
    font-family: var(--font-mono);
}

.step-d {
    font-size: 10px;
    color: var(--text-muted);
    line-height: 1.4;
}
`;

// Backup and update
if (fs.existsSync(SEO_HTML)) fs.copyFileSync(SEO_HTML, SEO_HTML + '.bak');
if (fs.existsSync(SEO_CSS)) fs.copyFileSync(SEO_CSS, SEO_CSS + '.bak');

fs.writeFileSync(SEO_HTML, liosHtml, 'utf8');
fs.writeFileSync(SEO_CSS, liosCss, 'utf8');
console.log('Successfully updated seo (LIOS) to Linear Dark Precision theme');
