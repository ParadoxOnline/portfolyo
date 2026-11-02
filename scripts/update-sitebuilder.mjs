import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CSS_PATH = path.join(__dirname, '../../sitebuilder/admin/styles.css');
const HTML_PATH = path.join(__dirname, '../../sitebuilder/admin/index.html');

// 1. Sleek Linear/Raycast Dark Precision CSS
const linearCss = `/* ========================================
   StaticForge Generator — Linear / Raycast Precision Theme
======================================== */

:root {
    --admin-primary: #38bdf8;
    --admin-primary-dark: #0284c7;
    --admin-secondary: #94a3b8;
    --admin-success: #34d399;
    --admin-danger: #f87171;
    --admin-warning: #fbbf24;
    --admin-bg: #07090d;
    --admin-bg-light: #0d1117;
    --admin-bg-card: #131822;
    --admin-text: #f8fafc;
    --admin-text-muted: #64748b;
    --admin-border: rgba(255, 255, 255, 0.08);
    --admin-border-hover: rgba(255, 255, 255, 0.16);
    --admin-radius: 8px;
    --font-mono: 'Geist Mono', monospace;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    background: var(--admin-bg);
    color: var(--admin-text);
    line-height: 1.5;
    min-height: 100vh;
    -webkit-font-smoothing: antialiased;
}

.app {
    display: flex;
    min-height: 100vh;
}

/* Sidebar */
.sidebar {
    width: 250px;
    background: var(--admin-bg-light);
    display: flex;
    flex-direction: column;
    border-right: 1px solid var(--admin-border);
    position: fixed;
    height: 100vh;
    z-index: 100;
}

.sidebar-header {
    padding: 20px;
    border-bottom: 1px solid var(--admin-border);
}

.logo {
    display: flex;
    align-items: center;
    gap: 10px;
}

.logo-icon {
    width: 28px;
    height: 28px;
    border-radius: 6px;
    background: rgba(56, 189, 248, 0.1);
    border: 1px solid rgba(56, 189, 248, 0.3);
    display: grid;
    place-items: center;
    color: var(--admin-primary);
    font-family: var(--font-mono);
    font-weight: 700;
    font-size: 13px;
}

.logo-text {
    font-size: 15px;
    font-weight: 600;
    letter-spacing: -0.02em;
    color: #ffffff;
}

.sidebar-nav {
    padding: 16px 12px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    flex: 1;
}

.nav-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 12px;
    border-radius: 6px;
    color: var(--admin-secondary);
    text-decoration: none;
    font-size: 13px;
    font-weight: 500;
    transition: all 0.15s ease;
}

.nav-item:hover {
    color: #ffffff;
    background: rgba(255, 255, 255, 0.04);
}

.nav-item.active {
    color: #ffffff;
    background: rgba(56, 189, 248, 0.08);
    border: 1px solid rgba(56, 189, 248, 0.2);
}

.sidebar-footer {
    padding: 16px;
    border-top: 1px solid var(--admin-border);
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--admin-text-muted);
}

/* Main Content */
.main-content {
    flex: 1;
    margin-left: 250px;
    padding: 36px 48px;
    max-width: 1200px;
}

.header {
    margin-bottom: 32px;
    border-bottom: 1px solid var(--admin-border);
    padding-bottom: 24px;
}

.header-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
}

.header h1 {
    font-size: 26px;
    font-weight: 700;
    letter-spacing: -0.03em;
    color: #ffffff;
}

.header p {
    font-size: 14px;
    color: var(--admin-secondary);
}

.telemetry-chip {
    font-family: var(--font-mono);
    font-size: 11px;
    padding: 4px 10px;
    border-radius: 999px;
    background: rgba(52, 211, 153, 0.08);
    border: 1px solid rgba(52, 211, 153, 0.25);
    color: var(--admin-success);
    display: inline-flex;
    align-items: center;
    gap: 6px;
}

.telemetry-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--admin-success);
    box-shadow: 0 0 6px var(--admin-success);
}

/* Form Sections */
.form-section {
    background: var(--admin-bg-light);
    border: 1px solid var(--admin-border);
    border-radius: 10px;
    padding: 24px;
    margin-bottom: 20px;
}

.section-title {
    font-size: 15px;
    font-weight: 600;
    color: #ffffff;
    margin-bottom: 18px;
    display: flex;
    align-items: center;
    gap: 8px;
    letter-spacing: -0.01em;
}

.section-icon {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--admin-primary);
    background: rgba(56, 189, 248, 0.1);
    padding: 2px 6px;
    border-radius: 4px;
}

/* Sector Grid */
.sector-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
    gap: 10px;
}

.sector-card {
    background: var(--admin-bg);
    border: 1px solid var(--admin-border);
    border-radius: 8px;
    padding: 14px 12px;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s ease;
}

.sector-card:hover {
    border-color: var(--admin-border-hover);
    background: var(--admin-bg-card);
}

.sector-card.selected {
    border-color: var(--admin-primary);
    background: rgba(56, 189, 248, 0.08);
}

.sector-icon {
    font-size: 22px;
    margin-bottom: 6px;
    display: block;
}

.sector-name {
    font-size: 12px;
    font-weight: 500;
    color: var(--admin-text);
}

/* Form Inputs */
.form-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
}

.full-width {
    grid-column: 1 / -1;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.form-group label {
    font-size: 12px;
    font-weight: 500;
    color: var(--admin-secondary);
}

.form-group input,
.form-group textarea,
.form-group select {
    background: var(--admin-bg);
    border: 1px solid var(--admin-border);
    border-radius: 6px;
    padding: 9px 12px;
    color: #ffffff;
    font-size: 13px;
    font-family: inherit;
    transition: border-color 0.15s ease;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
    outline: none;
    border-color: var(--admin-primary);
}

.form-actions {
    margin-top: 24px;
    display: flex;
    justify-content: flex-end;
}

.btn-generate {
    background: #ffffff;
    color: #000000;
    font-weight: 600;
    font-size: 13px;
    padding: 11px 24px;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    transition: all 0.2s ease;
}

.btn-generate:hover {
    box-shadow: 0 0 24px rgba(255, 255, 255, 0.25);
    transform: translateY(-1px);
}
`;

// Backup and update CSS
if (fs.existsSync(CSS_PATH)) {
    fs.copyFileSync(CSS_PATH, CSS_PATH + '.bak');
}
fs.writeFileSync(CSS_PATH, linearCss, 'utf8');
console.log('Successfully updated sitebuilder/admin/styles.css');
