/**
 * OSINT Intelligence Platform - Main App JavaScript
 * Navigation, data fetching, real-time updates, and UI management.
 */

// ── State ──────────────────────────────────────────────
let currentSection = 'overview';
let ws = null;
let cachedOsintItems = [];

// ── Initialize ─────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initClock();
    initWebSocket();
    loadDashboard();

    // Collect button
    document.getElementById('btnCollectAll').addEventListener('click', collectAll);

    // Sidebar toggle
    document.getElementById('btnToggleSidebar').addEventListener('click', () => {
        document.getElementById('sidebar').classList.toggle('open');
    });

    // Filters
    document.getElementById('osintSourceFilter').addEventListener('change', loadOsintData);
    document.getElementById('osintKeywordFilter').addEventListener('input', debounce(loadOsintData, 500));
    document.getElementById('disinfoRiskFilter').addEventListener('change', loadDisinfoData);
    document.getElementById('conflictTypeFilter').addEventListener('change', loadConflictData);
    document.getElementById('cyberTypeFilter').addEventListener('change', applyCyberFilters);
    document.getElementById('cyberCountryFilter').addEventListener('change', applyCyberFilters);
});

// ── Navigation ─────────────────────────────────────────
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const section = item.dataset.section;
            switchSection(section);
        });
    });
}

function switchSection(sectionId) {
    // Update nav
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.querySelector(`[data-section="${sectionId}"]`).classList.add('active');

    // Update sections
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    const sectionMap = {
        overview: 'sectionOverview',
        osint: 'sectionOsint',
        disinfo: 'sectionDisinfo',
        conflicts: 'sectionConflicts',
        cyber: 'sectionCyber',
        alerts: 'sectionAlerts',
        search: 'sectionSearch',
        network: 'sectionNetwork'
    };
    document.getElementById(sectionMap[sectionId]).classList.add('active');

    // Update title
    const titles = {
        overview: 'Genel Bakış',
        osint: 'OSINT İstihbarat',
        disinfo: 'Dezenformasyon Tespiti',
        conflicts: 'Çatışma Haritası',
        cyber: 'Siber Tehdit Haritası',
        alerts: 'Uyarılar',
        search: 'Gelişmiş FTS Arama',
        network: 'Bağlantı Ağ Haritası'
    };
    document.getElementById('pageTitle').textContent = titles[sectionId];

    currentSection = sectionId;

    // Load section data
    loadSectionData(sectionId);

    // Close mobile sidebar
    document.getElementById('sidebar').classList.remove('open');
}

function loadSectionData(section) {
    switch (section) {
        case 'overview': loadDashboard(); break;
        case 'osint': loadOsintData(); break;
        case 'disinfo': loadDisinfoData(); break;
        case 'conflicts': loadConflictData(); break;
        case 'cyber': loadCyberData(); break;
        case 'alerts': loadAlertsData(); break;
        case 'search':
            document.getElementById('advancedSearchInput').focus();
            break;
        case 'network': loadNetworkAnalysis(); break;
    }
}

// ── API Helpers ────────────────────────────────────────
// ── API Helpers ────────────────────────────────────────
const API_BASE_URL = (function () {
    const isFileProtocol = location.protocol === 'file:';
    // If we're on port 3000, we're likely hitting the Node server directly
    if (location.port === '3000') return '';
    // If we're on XAMPP (usually 80 or 8080) or file protocol, point to localhost:3000
    if (isFileProtocol || location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
        return 'http://localhost:3000';
    }
    // Fallback/Production: assume same host but port 3000 if not standard
    return `${location.protocol}//${location.hostname}:3000`;
})();

function getApiUrl(path) {
    if (path.startsWith('http')) return path;
    return API_BASE_URL + (path.startsWith('/') ? path : '/' + path);
}

async function api(url, options = {}) {
    try {
        const fullUrl = getApiUrl(url);
        const response = await fetch(fullUrl, {
            headers: { 'Content-Type': 'application/json' },
            ...options
        });

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        return await response.json();
    } catch (err) {
        console.error(`API error: ${url}`, err);
        // Special handling for connection refused
        if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
            showToast('API Sunucusuna bağlanılamadı. Lütfen Node.js sunucusunun (port 3000) çalıştığından emin olun.', 'error');
        }
        return { success: false, error: err.message };
    }
}

// ── Dashboard Overview ─────────────────────────────────
async function loadDashboard() {
    const result = await api('/api/dashboard');
    if (!result.success) return;

    const d = result.data;

    // Update stats
    animateValue('statOsintTotal', d.osint.total);
    document.getElementById('statOsintToday').textContent = `Bugün: ${d.osint.today}`;
    animateValue('statHighRisk', d.osint.highRisk);
    document.getElementById('statPropaganda').textContent = `Propaganda: ${d.disinfo.propaganda}`;
    animateValue('statConflicts', d.conflicts.active);
    document.getElementById('statConflictCountries').textContent = `Ülke: ${d.conflicts.countries}`;
    animateValue('statCyber', d.cyber.total);
    document.getElementById('statCyberToday').textContent = `Bugün: ${d.cyber.today}`;

    // Update alert badge
    const badge = document.getElementById('alertBadge');
    if (d.alerts.unread > 0) {
        badge.textContent = d.alerts.unread;
        badge.style.display = 'inline';
    } else {
        badge.style.display = 'none';
    }

    // Load charts
    loadOverviewCharts();

    // Load overview map
    if (typeof initOverviewMap === 'function') {
        setTimeout(() => initOverviewMap(), 100);
    }
}

// ── OSINT Data ─────────────────────────────────────────
async function loadOsintData() {
    const source = document.getElementById('osintSourceFilter').value;
    const keyword = document.getElementById('osintKeywordFilter').value;

    let url = '/api/osint/items?limit=50';
    if (source) url += `&source=${source}`;
    if (keyword) url += `&keyword=${encodeURIComponent(keyword)}`;

    const result = await api(url);
    const tbody = document.getElementById('osintTableBody');

    if (!result.success || !result.items || result.items.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="loading">Veri bulunamadı. "Veri Topla" butonuna tıklayın.</td></tr>';
        return;
    }

    // Cache items for detail modal
    cachedOsintItems = result.items;

    tbody.innerHTML = result.items.map((item, idx) => {
        const riskLevel = getRiskLevel(item.risk_score);
        const sentiment = getSentimentLabel(item.sentiment_score);
        const date = formatDate(item.collected_at);
        const lang = item.detected_language || '';
        const langBadge = lang && lang !== 'TR' ? `<span class="lang-badge">[${lang}]</span>` : '';
        const displayTitle = item.title_tr || item.title;

        return `
      <tr style="cursor:pointer" onclick="showItemDetail(${idx})">
        <td><span class="risk-badge ${riskLevel}">${item.risk_score}</span></td>
        <td><span style="opacity:0.7">${item.source_type}</span> ${item.source}</td>
        <td title="${escapeHtml(item.title)}">
          ${truncate(escapeHtml(displayTitle), 60)}
          ${langBadge}
        </td>
        <td><span class="sentiment-badge ${sentiment.class}">${sentiment.label}</span></td>
        <td style="white-space:nowrap; font-size:12px; color:var(--text-muted)">${date}</td>
        <td><span class="table-link">Detay ▶</span></td>
      </tr>
    `;
    }).join('');
}

async function triggerOsintCollection() {
    showLoading(true);
    const result = await api('/api/osint/collect', { method: 'POST' });
    showLoading(false);

    if (result.success) {
        showToast(`${result.results.new} yeni veri toplandı`, 'success');
        loadOsintData();
        loadDashboard();
    } else {
        showToast('Toplama hatası: ' + (result.error || 'Bilinmeyen'), 'error');
    }
}

// ── Disinfo Data ───────────────────────────────────────
async function loadDisinfoData() {
    const riskLevel = document.getElementById('disinfoRiskFilter').value;

    // Load stats
    const statsResult = await api('/api/disinfo/stats');
    if (statsResult.success) {
        const s = statsResult.stats;
        document.getElementById('disinfoTotal').textContent = s.total;
        document.getElementById('disinfoPropaganda').textContent = s.propaganda;
        document.getElementById('disinfoBots').textContent = s.bots;
        document.getElementById('disinfoCoord').textContent = s.coordinated;
    }

    // Load reports
    let url = '/api/disinfo/reports?limit=50';
    if (riskLevel) url += `&risk_level=${riskLevel}`;

    const result = await api(url);
    const tbody = document.getElementById('disinfoTableBody');

    if (!result.success || !result.reports || result.reports.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="loading">Analiz verisi bulunamadı. Önce veri toplayıp ardından "Analiz Et" butonuna tıklayın.</td></tr>';
        return;
    }

    tbody.innerHTML = result.reports.map(report => {
        const reasons = JSON.parse(report.reasons || '[]');
        const lang = report.detected_language || '';
        const langBadge = lang && lang !== 'TR' ? `<span class="lang-badge">[${lang}]</span>` : '';
        const displayTitle = report.title_tr || report.title;

        const riskLevelTr = { critical: 'Kritik', high: 'Yüksek', medium: 'Orta', low: 'Düşük' }[report.risk_level] || report.risk_level;
        const reasonsTr = reasons.map(r => translateReason(r));

        return `
      <tr>
        <td><span class="risk-badge ${report.risk_level}">${report.risk_score}</span></td>
        <td>${riskLevelTr}</td>
        <td title="${escapeHtml(report.title)}">
          ${truncate(escapeHtml(displayTitle), 50)}
          ${langBadge}
        </td>
        <td>${report.is_propaganda ? '⚠️ Evet' : '✅ Hayır'}</td>
        <td>${report.is_bot ? '🤖 Evet' : '✅ Hayır'}</td>
        <td style="font-size:11px; max-width:250px">${truncate(reasonsTr.join('; '), 80)}</td>
      </tr>
    `;
    }).join('');
}

async function triggerDisinfoAnalysis() {
    const result = await api('/api/disinfo/analyze', { method: 'POST' });
    if (result.success) {
        showToast(`${result.results.analyzed} içerik analiz edildi, ${result.results.flagged} işaretlendi`, 'success');
        loadDisinfoData();
        loadDashboard();
    } else {
        showToast('Analiz hatası', 'error');
    }
}

async function analyzeCustomText() {
    const text = document.getElementById('analyzeText').value;
    if (!text.trim()) return showToast('Lütfen metin girin', 'warning');

    const result = await api('/api/disinfo/analyze-text', {
        method: 'POST',
        body: JSON.stringify({ text })
    });

    const resultDiv = document.getElementById('analysisResult');
    resultDiv.style.display = 'block';

    if (result.success) {
        const a = result.analysis;
        resultDiv.innerHTML = `
      <div style="display:flex; align-items:center; gap:12px; margin-bottom:10px">
        <span class="risk-label" style="color:var(--risk-${a.risk_level})">${a.risk_score}/100</span>
        <span class="risk-badge ${a.risk_level}" style="font-size:14px">${a.risk_level.toUpperCase()}</span>
      </div>
      <div>
        <strong>Duygu:</strong> ${a.sentiment_label} (${a.sentiment_polarity.toFixed(2)})<br>
        <strong>Propaganda:</strong> ${a.is_propaganda ? '⚠️ Tespit Edildi' : '✅ Temiz'} (Skor: ${a.propaganda_score})<br>
        <strong>Bot Davranışı:</strong> ${a.is_bot ? '🤖 Şüpheli' : '✅ Normal'}<br>
        <strong>Koordineli:</strong> ${a.is_coordinated ? '⚠️ Tespit' : '✅ Hayır'}<br>
        ${a.reasons.length > 0 ? `<strong>Sebepler:</strong> ${a.reasons.join('; ')}` : ''}
      </div>
    `;
    } else {
        resultDiv.innerHTML = `<span style="color:var(--accent-red)">Hata: ${result.error}</span>`;
    }
}

// ── Conflict Data ──────────────────────────────────────
async function loadConflictData() {
    const type = document.getElementById('conflictTypeFilter').value;

    let url = '/api/conflicts/events?limit=200';
    if (type) url += `&type=${type}`;

    const [eventsResult, hotspotsResult] = await Promise.all([
        api(url),
        api('/api/conflicts/hotspots')
    ]);

    // Update map
    if (eventsResult.success && typeof updateConflictMap === 'function') {
        setTimeout(() => updateConflictMap(eventsResult.events || []), 100);
    }

    // Update hotspots grid
    if (hotspotsResult.success) {
        renderHotspots(hotspotsResult.hotspots || []);
    }

    // Load charts
    loadConflictCharts();
}

function renderHotspots(hotspots) {
    const grid = document.getElementById('hotspotsGrid');
    if (!hotspots.length) {
        grid.innerHTML = '<p style="color:var(--text-muted)">Veri toplayarak sıcak noktaları görün.</p>';
        return;
    }

    grid.innerHTML = hotspots.map(hs => {
        const severityPct = (hs.avg_severity / 5) * 100;
        const severityColor = severityPct > 70 ? 'var(--accent-red)' :
            severityPct > 40 ? 'var(--accent-orange)' : 'var(--accent-yellow)';

        return `
      <div class="hotspot-card">
        <h4>📍 ${hs.country} - ${hs.location_name || 'Bilinmiyor'}</h4>
        <div class="hotspot-detail">
          Olay Sayısı: <strong>${hs.event_count}</strong><br>
          Türler: ${(hs.event_types || '').replace(/,/g, ', ')}<br>
          Ort. Şiddet: ${(hs.avg_severity || 0).toFixed(1)} / 5
        </div>
        <div class="severity-bar">
          <div class="severity-bar-fill" style="width:${severityPct}%; background:${severityColor}"></div>
        </div>
      </div>
    `;
    }).join('');
}

async function triggerConflictProcess() {
    const result = await api('/api/conflicts/process', { method: 'POST' });
    if (result.success) {
        showToast(`${result.results.events_created} çatışma olayı oluşturuldu`, 'success');
        loadConflictData();
    }
}

// ── Cyber Data ─────────────────────────────────────────
let globalCyberData = [];

async function loadCyberData() {
    const [mapResult, statsResult] = await Promise.all([
        api('/api/cyber/map-data'),
        api('/api/cyber/stats')
    ]);

    if (mapResult.success) {
        globalCyberData = mapResult.data || [];

        // Populate country filter dynamically
        const countrySelect = document.getElementById('cyberCountryFilter');
        if (countrySelect && countrySelect.options.length <= 1) {
            const countries = [...new Set(globalCyberData.map(d => d.source_country).filter(Boolean))].sort();
            countrySelect.innerHTML = '<option value="">Tüm Ülkeler</option>' +
                countries.map(c => `<option value="${c}">${c}</option>`).join('');
        }

        applyCyberFilters();
    }

    if (statsResult.success) {
        loadCyberCharts(statsResult.stats);
    }
}

function applyCyberFilters() {
    const type = document.getElementById('cyberTypeFilter').value;
    const country = document.getElementById('cyberCountryFilter')?.value;

    let filtered = globalCyberData;

    if (type) {
        filtered = filtered.filter(d => (d.attack_types || '').includes(type));
    }
    if (country) {
        filtered = filtered.filter(d => d.source_country === country);
    }

    if (typeof updateCyberMap === 'function') {
        setTimeout(() => updateCyberMap(filtered), 100);
    }
}

async function triggerCyberCollection() {
    showLoading(true);
    const result = await api('/api/cyber/collect', { method: 'POST' });
    showLoading(false);

    if (result.success) {
        showToast(`${result.results.stored} siber tehdit toplandı`, 'success');
        loadCyberData();
        loadDashboard();
    } else {
        showToast('Siber tehdit toplama hatası', 'error');
    }
}

// ── Alerts ─────────────────────────────────────────────
async function loadAlertsData() {
    const result = await api('/api/alerts?limit=50');
    const list = document.getElementById('alertsList');

    if (!result.success || !result.alerts || result.alerts.length === 0) {
        list.innerHTML = '<div class="loading">Uyarı bulunmuyor.</div>';
        return;
    }

    list.innerHTML = result.alerts.map(alert => `
    <div class="alert-item ${alert.is_read ? '' : 'unread'}" onclick="markRead(${alert.id})">
      <span class="alert-dot ${alert.severity}"></span>
      <div class="alert-content">
        <div class="alert-title">${escapeHtml(alert.title)}</div>
        <div class="alert-message">${escapeHtml(alert.message || '')}</div>
        <div class="alert-meta">${alert.module} · ${formatDate(alert.created_at)}</div>
      </div>
    </div>
  `).join('');
}

async function markRead(id) {
    await api(`/api/alerts/read/${id}`, { method: 'POST' });
    loadAlertsData();
    loadDashboard();
}

async function markAllRead() {
    await api('/api/alerts/read-all', { method: 'POST' });
    showToast('Tüm uyarılar okundu', 'info');
    loadAlertsData();
    loadDashboard();
}

// ── Collect All ────────────────────────────────────────
async function collectAll() {
    const btn = document.getElementById('btnCollectAll');
    btn.classList.add('loading');
    showLoading(true);

    try {
        const result = await api('/api/collect-all', { method: 'POST' });
        showLoading(false);
        btn.classList.remove('loading');

        if (result.success) {
            const r = result.results;
            showToast(
                `Toplama tamamlandı: ${r.osintResults?.new || 0} OSINT, ${r.disinfoResults?.analyzed || 0} analiz, ${r.conflictResults?.events_created || 0} çatışma, ${r.cyberResults?.stored || 0} siber tehdit`,
                'success'
            );
            loadSectionData(currentSection);
        } else {
            showToast('Toplama hatası: ' + (result.error || 'Bilinmeyen'), 'error');
        }
    } catch (err) {
        showLoading(false);
        btn.classList.remove('loading');
        showToast('Bağlantı hatası', 'error');
    }
}

// ── WebSocket ──────────────────────────────────────────
function initWebSocket() {
    try {
        const protocol = location.protocol === 'https:' ? 'wss:' : 'ws:';
        const isFileP = location.protocol === 'file:';
        const host = location.port === '3000' ? location.host
            : (isFileP ? 'localhost:3000' : `${location.hostname}:3000`);
        ws = new WebSocket(`${protocol}//${host}/ws`);

        ws.onmessage = (event) => {
            const msg = JSON.parse(event.data);
            handleWSMessage(msg);
        };

        ws.onopen = () => {
            console.log('[WS] Connected to ' + host);
        };

        ws.onclose = (e) => {
            console.warn('[WS] Closed:', e.reason || 'No reason');
            setTimeout(initWebSocket, 5000);
        };

        ws.onerror = (err) => {
            console.error('[WS] Error:', err);
        };
    } catch (e) {
        console.log('[WS] WebSocket not available');
    }
}

function handleWSMessage(msg) {
    switch (msg.type) {
        case 'overview':
            break;
        case 'translations_updated':
            showToast('Çeviriler tamamlandı', 'success');
            loadSectionData(currentSection);
            break;
        case 'collection_complete':
        case 'osint_updated':
        case 'disinfo_updated':
        case 'conflict_updated':
        case 'cyber_updated':
            showToast('Veriler güncellendi', 'info');
            loadDashboard();
            break;
    }
}

// ── Utilities ──────────────────────────────────────────
function getRiskLevel(score) {
    if (score >= 80) return 'critical';
    if (score >= 60) return 'high';
    if (score >= 30) return 'medium';
    return 'low';
}

function getSentimentLabel(score) {
    if (score > 0.1) return { label: 'Pozitif', class: 'positive' };
    if (score < -0.1) return { label: 'Negatif', class: 'negative' };
    return { label: 'Nötr', class: 'neutral' };
}

function translateReason(reason) {
    if (!reason) return '';
    return reason
        .replace(/Extreme negative sentiment/i, 'Aşırı olumsuz duygu')
        .replace(/Extreme positive sentiment/i, 'Aşırı olumlu duygu')
        .replace(/High negative sentiment/i, 'Yüksek olumsuz duygu')
        .replace(/High positive sentiment/i, 'Yüksek olumlu duygu')
        .replace(/\(intensity: (.*?)\)/i, '(yoğunluk: $1)')
        .replace(/Emotional manipulation detected/i, 'Duygusal manipülasyon tespit edildi')
        .replace(/Conspiracy language detected/i, 'Komplo dili tespit edildi')
        .replace(/Clickbait patterns detected/i, 'Tıklama tuzağı kalıpları tespit edildi')
        .replace(/Bot-like patterns/i, 'Bot benzeri kalıplar')
        .replace(/\((\d+) instances\)/i, '($1 adet)')
        .replace(/Highly repetitive content detected/i, 'Yüksek tekrarlı içerik tespit edildi')
        .replace(/Short content with high propaganda density/i, 'Yüksek propaganda yoğunluklu kısa içerik')
        .replace(/Low source credibility/i, 'Düşük kaynak güvenilirliği')
        .replace(/Suspiciously high upvote ratio with high score/i, 'Şüpheli yüksek oy oranı')
        .replace(/high/gi, 'yüksek').replace(/low/gi, 'düşük').replace(/medium/gi, 'orta');
}

function formatDate(dateStr) {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return d.toLocaleDateString('tr-TR') + ' ' + d.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
}

function truncate(str, len) {
    if (!str) return '';
    return str.length > len ? str.substring(0, len) + '...' : str;
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function showLoading(show) {
    document.getElementById('loadingOverlay').style.display = show ? 'flex' : 'none';
}

function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
}

function animateValue(elementId, end) {
    const el = document.getElementById(elementId);
    const start = parseInt(el.textContent) || 0;
    if (start === end) return;

    const duration = 600;
    const step = (end - start) / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += step;
        if ((step > 0 && current >= end) || (step < 0 && current <= end)) {
            current = end;
            clearInterval(timer);
        }
        el.textContent = Math.round(current).toLocaleString();
    }, 16);
}

function debounce(fn, delay) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), delay);
    };
}

// ── Clock ──────────────────────────────────────────────
function initClock() {
    const updateClock = () => {
        const now = new Date();
        document.getElementById('clock').textContent = now.toLocaleTimeString('tr-TR');
    };
    updateClock();
    setInterval(updateClock, 1000);
}

// ── Report Downloads ───────────────────────────────────
function downloadReport(format) {
    if (format === 'pdf') {
        window.open(getApiUrl('/api/reports/pdf'), '_blank');
    } else {
        window.open(getApiUrl('/api/reports/csv?module=osint'), '_blank');
    }
}

// ── Detail Modal ───────────────────────────────────────
function showItemDetail(index) {
    const item = cachedOsintItems[index];
    if (!item) return;

    const modal = document.getElementById('detailModal');
    const title = document.getElementById('detailModalTitle');
    const body = document.getElementById('detailModalBody');

    const lang = item.detected_language || '';
    const langBadge = lang ? `<span class="lang-badge" style="font-size:12px">[${lang}]</span>` : '';
    const riskLevel = getRiskLevel(item.risk_score);
    const sentiment = getSentimentLabel(item.sentiment_score);
    const displayTitle = item.title_tr || item.title;
    const displayContent = item.content_tr || item.content || '';

    title.innerHTML = `İstihbarat Detayı ${langBadge}`;

    body.innerHTML = `
      <div class="detail-row">
        <span class="detail-label">Başlık</span>
        <span class="detail-value" style="font-weight:600; font-size:15px">${escapeHtml(displayTitle)}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Kaynak</span>
        <span class="detail-value">${item.source_type} · ${item.source}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Risk</span>
        <span class="detail-value"><span class="risk-badge ${riskLevel}">${item.risk_score}</span></span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Duygu</span>
        <span class="detail-value"><span class="sentiment-badge ${sentiment.class}">${sentiment.label}</span> (${(item.sentiment_score || 0).toFixed(2)})</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Tarih</span>
        <span class="detail-value">${formatDate(item.collected_at)}</span>
      </div>
      ${displayContent ? `
      <div class="detail-row">
        <span class="detail-label">İçerik</span>
        <span class="detail-value">${escapeHtml(displayContent)}</span>
      </div>` : ''}
      ${(item.title_tr && item.title && item.title !== item.title_tr) ? `
      <div class="detail-original">
        <div class="detail-orig-label">Orijinal Metin ${langBadge}</div>
        <div><strong>${escapeHtml(item.title)}</strong></div>
        ${item.content ? `<div style="margin-top:8px">${escapeHtml(truncate(item.content, 400))}</div>` : ''}
      </div>` : ''}
      ${item.url ? `<a href="${item.url}" target="_blank" class="detail-link">Kaynağa Git ↗</a>` : ''}
    `;

    modal.style.display = 'flex';
}

function closeDetailModal(event) {
    if (event.target === event.currentTarget) {
        document.getElementById('detailModal').style.display = 'none';
    }
}

// ── Advanced Search FTS ────────────────────────────────
async function executeAdvancedSearch() {
    const input = document.getElementById('advancedSearchInput');
    const query = input.value.trim();
    if (!query) return;

    const tbody = document.getElementById('searchResultsTable');
    const stats = document.getElementById('searchStats');
    const countSpan = document.getElementById('searchResultCount');

    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding: 40px;"><div class="spinner" style="width:24px;height:24px;border-width:2px;margin:auto"></div> Arama yapılıyor...</td></tr>';
    stats.style.display = 'none';

    try {
        const result = await api(`/api/search?q=${encodeURIComponent(query)}&limit=100`);
        if (result.success) {
            countSpan.textContent = result.count;
            stats.style.display = 'block';

            if (result.count === 0) {
                tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding: 40px; color: var(--text-muted);">Sonuç bulunamadı.</td></tr>';
                return;
            }

            // Temporarily cache items for the detail modal
            cachedOsintItems = result.results;

            tbody.innerHTML = result.results.map((item, idx) => {
                const riskLevel = getRiskLevel(item.risk_score);
                const sentiment = getSentimentLabel(item.sentiment_score);
                const date = formatDate(item.collected_at);
                const displayTitle = item.title_tr || item.title;
                const snippet = item.snippet || '';

                return `
                    <tr style="cursor:pointer" onclick="showItemDetail(${idx})">
                        <td><span style="opacity:0.7">${item.source_type}</span> ${item.source}</td>
                        <td style="font-size: 13px;">
                            <strong>${escapeHtml(displayTitle)}</strong><br>
                            <span style="color:var(--text-muted); font-family:var(--font-mono); font-size:12px">${snippet}</span>
                        </td>
                        <td>
                            <span class="risk-badge ${riskLevel}">${item.risk_score}</span>
                            <span class="sentiment-badge ${sentiment.class}" style="margin-left:4px">${sentiment.label}</span>
                        </td>
                        <td style="white-space:nowrap; font-size:12px; color:var(--text-muted)">${date}</td>
                        <td><span class="table-link">Detay ▶</span></td>
                    </tr>
                `;
            }).join('');
        }
    } catch (e) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding: 40px; color: var(--accent-red);">Hata: ${e.message}</td></tr>`;
    }
}

// ── Link Analysis Graph (Vis.js) ───────────────────────
let networkInstance = null;

async function loadNetworkAnalysis() {
    const container = document.getElementById('visNetworkContainer');
    const loading = document.getElementById('loadingGraph');

    if (networkInstance) {
        // If already loaded, just return
        return;
    }

    try {
        const result = await api('/api/graph');
        loading.style.display = 'none';

        if (result.success && result.nodes.length > 0) {

            // Format nodes for vis.js
            const nodes = new vis.DataSet(result.nodes.map(n => {
                let color, shape, size;

                if (n.group === 'core') {
                    color = '#00f2fe'; shape = 'hexagon'; size = 30;
                } else if (n.group === 'type') {
                    color = '#ff9900'; shape = 'triangle'; size = 20;
                } else if (n.group === 'source') {
                    color = '#4caf50'; shape = 'box'; size = 15;
                } else if (n.group === 'keyword') {
                    color = '#e91e63'; shape = 'ellipse'; size = 18;
                } else {
                    color = '#2196f3'; shape = 'dot'; size = 10;
                }

                return {
                    id: n.id,
                    label: n.label,
                    title: n.title, // HTML tooltip
                    shape: shape,
                    size: size,
                    color: {
                        background: color,
                        border: '#ffffff',
                        highlight: { background: '#ffffff', border: color }
                    },
                    font: { color: '#ffffff', size: 12 }
                };
            }));

            // Format edges
            const edges = new vis.DataSet(result.edges.map(e => {
                return {
                    from: e.from,
                    to: e.to,
                    dashes: e.dashes || false,
                    color: e.color || { color: 'rgba(255,255,255,0.2)', highlight: '#00f2fe' }
                };
            }));

            const data = { nodes: nodes, edges: edges };
            const options = {
                nodes: {
                    borderWidth: 2,
                    borderWidthSelected: 4
                },
                edges: {
                    width: 1,
                    smooth: {
                        type: 'continuous'
                    }
                },
                physics: {
                    barnesHut: {
                        gravitationalConstant: -4000,
                        centralGravity: 0.1,
                        springLength: 200,
                        springConstant: 0.03,
                        damping: 0.09,
                        avoidOverlap: 0.1
                    },
                    stabilization: {
                        iterations: 200
                    }
                },
                interaction: {
                    hover: true,
                    tooltipDelay: 100
                }
            };

            networkInstance = new vis.Network(container, data, options);

            networkInstance.on("click", function (params) {
                if (params.nodes.length > 0) {
                    const nodeId = params.nodes[0];
                    if (nodeId.startsWith('item_')) {
                        console.log("Clicked item ID:", nodeId.replace('item_', ''));
                        // Optionally fetch details and show modal
                    }
                }
            });

        } else {
            container.innerHTML = '<div style="padding:20px; text-align:center; color: var(--text-muted)">Yeterli bağlantı verisi bulunamadı.</div>';
        }
    } catch (e) {
        loading.style.display = 'none';
        container.innerHTML = `<div style="padding:20px; text-align:center; color: var(--accent-red)">Ağ oluşturulamadı: ${e.message}</div>`;
    }
}

// ── AI Executive Briefing ────────────────────────────────
async function generateExecutiveBriefing() {
    const card = document.getElementById('aiBriefingCard');
    const content = document.getElementById('aiBriefingContent');

    card.style.display = 'block';
    content.innerHTML = '<div class="loading" style="display:flex; align-items:center; gap:10px;"><div class="spinner" style="width:20px;height:20px;border:3px solid rgba(139,92,246,0.3);border-top-color:#8b5cf6;border-radius:50%;animation:spin 1s linear infinite;"></div>Yapay Zeka tüm dünya verilerini (OSINT, Siber, Çatışma) analiz ediyor. Lütfen bekleyin (10-15 sn)...</div>';

    // Inject keyframes for spinner if missing
    if (!document.getElementById('aiSpinnerStyle')) {
        const style = document.createElement('style');
        style.id = 'aiSpinnerStyle';
        style.innerHTML = '@keyframes spin { 100% { transform: rotate(360deg); } }';
        document.head.appendChild(style);
    }

    try {
        const result = await api('/api/briefing/generate');
        if (result.success) {
            // Save raw markdown for PDF export
            window.currentBriefingMarkdown = result.markdown;

            // Show actions
            document.getElementById('aiBriefingActions').style.display = 'flex';

            // Basic Markdown to HTML parsing logic for UI rendering
            let html = result.markdown
                .replace(/^### (.*$)/gim, '<h4 style="color:#fff; margin-top:20px; margin-bottom:10px; font-size:16px;">$1</h4>')
                .replace(/^## (.*$)/gim, '<h3 style="color:#8b5cf6; margin-top:25px; margin-bottom:15px; border-bottom:1px solid #334155; padding-bottom:8px;">$1</h3>')
                .replace(/^# (.*$)/gim, '<h2 style="color:#8b5cf6; margin-bottom:15px;">$1</h2>')
                .replace(/\*\*(.*?)\*\*/gim, '<strong style="color:#fff; font-weight:600;">$1</strong>')
                .replace(/\*(.*?)\*/gim, '<em style="color:#94a3b8;">$1</em>')
                .replace(/^\- (.*$)/gim, '<li style="margin-left: 20px; margin-bottom: 8px;">$1</li>')
                .replace(/\n\n/g, '<br><br>');

            content.innerHTML = html;
        } else {
            content.innerHTML = `<div style="color:#ef4444; padding:15px; background:rgba(239, 68, 68, 0.1); border-radius:6px;">❌ <strong>Hata Oluştu:</strong> ${result.error}</div>`;
        }
    } catch (e) {
        content.innerHTML = `<div style="color:#ef4444; padding:15px;">❌ Sunucuyla iletişim kurulamadı.</div>`;
    }
}
