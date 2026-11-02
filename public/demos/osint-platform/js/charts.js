/**
 * OSINT Platform - Charts Module
 * Chart.js visualizations for all dashboard sections.
 */

// Chart instances
let trendChart = null;
let sourceChart = null;
let riskChart = null;
let conflictTimelineChart = null;
let conflictTypeChart = null;
let cyberCountryChart = null;
let cyberAttackTypeChart = null;
let cyberTrendChart = null;

// Default chart options
Chart.defaults.color = '#9ca3af';
Chart.defaults.borderColor = 'rgba(255, 255, 255, 0.06)';
Chart.defaults.font.family = 'Inter, sans-serif';
Chart.defaults.font.size = 12;
Chart.defaults.responsive = true;
Chart.defaults.maintainAspectRatio = false;

// ── Overview Charts ────────────────────────────────────
async function loadOverviewCharts() {
    const [osintStats, cyberStats] = await Promise.all([
        fetch(getApiUrl('/api/osint/stats')).then(r => r.json()),
        fetch(getApiUrl('/api/cyber/stats')).then(r => r.json())
    ]);

    // Trend Chart
    if (osintStats.success && osintStats.stats.recentTrend) {
        const trend = osintStats.stats.recentTrend;
        const labels = trend.map(t => {
            const d = new Date(t.date);
            return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
        });
        const data = trend.map(t => t.count);

        if (trendChart) trendChart.destroy();
        trendChart = new Chart(document.getElementById('trendChart'), {
            type: 'line',
            data: {
                labels,
                datasets: [{
                    label: 'OSINT Verileri',
                    data,
                    borderColor: '#00d4ff',
                    backgroundColor: createGradient('trendChart', '#00d4ff'),
                    fill: true,
                    tension: 0.4,
                    pointRadius: 4,
                    pointBackgroundColor: '#00d4ff',
                    pointBorderColor: '#0a0e17',
                    pointBorderWidth: 2
                }]
            },
            options: {
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.04)' } },
                    x: { grid: { display: false } }
                }
            }
        });
    }

    // Source Chart (Doughnut)
    if (osintStats.success && osintStats.stats.bySource) {
        const sources = osintStats.stats.bySource;
        const colors = ['#00d4ff', '#3b82f6', '#8b5cf6', '#ec4899', '#f97316'];

        if (sourceChart) sourceChart.destroy();
        sourceChart = new Chart(document.getElementById('sourceChart'), {
            type: 'doughnut',
            data: {
                labels: sources.map(s => s.source_type),
                datasets: [{
                    data: sources.map(s => s.count),
                    backgroundColor: colors.slice(0, sources.length),
                    borderWidth: 0,
                    hoverOffset: 8
                }]
            },
            options: {
                cutout: '65%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { padding: 16, usePointStyle: true, pointStyle: 'circle' }
                    }
                }
            }
        });
    }

    // Risk Chart (Doughnut)
    if (osintStats.success && osintStats.stats.byRiskLevel) {
        const risks = osintStats.stats.byRiskLevel;
        const riskColors = { low: '#10b981', medium: '#f59e0b', high: '#f97316', critical: '#ef4444' };

        if (riskChart) riskChart.destroy();
        riskChart = new Chart(document.getElementById('riskChart'), {
            type: 'doughnut',
            data: {
                labels: risks.map(r => r.level === 'low' ? 'Düşük' : r.level === 'medium' ? 'Orta' : r.level === 'high' ? 'Yüksek' : 'Kritik'),
                datasets: [{
                    data: risks.map(r => r.count),
                    backgroundColor: risks.map(r => riskColors[r.level] || '#6b7280'),
                    borderWidth: 0,
                    hoverOffset: 8
                }]
            },
            options: {
                cutout: '65%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { padding: 16, usePointStyle: true, pointStyle: 'circle' }
                    }
                }
            }
        });
    }
}

// ── Conflict Charts ────────────────────────────────────
async function loadConflictCharts() {
    const [timelineRes, eventsRes] = await Promise.all([
        fetch(getApiUrl('/api/conflicts/timeline?days=30')).then(r => r.json()),
        fetch(getApiUrl('/api/conflicts/events?limit=200')).then(r => r.json())
    ]);

    const typeLabels = {
        armed_conflict: 'Silahlı Çatışma',
        terrorism: 'Terör',
        air_strike: 'Hava Saldırısı',
        military_movement: 'Askeri Hareket',
        protest: 'Protesto',
        political_unrest: 'Politik Kriz',
        humanitarian_crisis: 'İnsani Kriz',
        naval_incident: 'Deniz Olayı',
        border_incident: 'Sınır Olayı'
    };

    // Timeline Chart
    if (timelineRes.success && timelineRes.timeline) {
        const timeline = timelineRes.timeline;

        // Group by date
        const dateMap = {};
        timeline.forEach(t => {
            if (!dateMap[t.date]) dateMap[t.date] = {};
            dateMap[t.date][t.event_type] = t.count;
        });

        const dates = Object.keys(dateMap).sort();
        const labels = dates.map(d => {
            const date = new Date(d);
            return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
        });

        // Get unique event types
        const types = [...new Set(timeline.map(t => t.event_type))];
        const typeColors = {
            armed_conflict: '#ef4444',
            terrorism: '#dc2626',
            air_strike: '#f97316',
            military_movement: '#f59e0b',
            protest: '#8b5cf6',
            political_unrest: '#ec4899',
            humanitarian_crisis: '#06b6d4'
        };


        const datasets = types.map(type => ({
            label: typeLabels[type] || type.replace(/_/g, ' '),
            data: dates.map(d => dateMap[d][type] || 0),
            borderColor: typeColors[type] || '#6b7280',
            backgroundColor: typeColors[type] || '#6b7280',
            tension: 0.3,
            fill: false,
            pointRadius: 2
        }));

        if (conflictTimelineChart) conflictTimelineChart.destroy();
        conflictTimelineChart = new Chart(document.getElementById('conflictTimelineChart'), {
            type: 'line',
            data: { labels, datasets },
            options: {
                plugins: {
                    legend: {
                        position: 'top',
                        labels: { padding: 12, usePointStyle: true, pointStyle: 'circle', font: { size: 11 } }
                    }
                },
                scales: {
                    y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.04)' } },
                    x: { grid: { display: false } }
                }
            }
        });
    }

    // Event Type Distribution
    if (eventsRes.success && eventsRes.events) {
        const typeCounts = {};
        eventsRes.events.forEach(e => {
            typeCounts[e.event_type] = (typeCounts[e.event_type] || 0) + 1;
        });

        // typeLabels moved up

        const entries = Object.entries(typeCounts).sort(([, a], [, b]) => b - a);
        const colors = entries.map(([type]) => {
            const c = { armed_conflict: '#ef4444', terrorism: '#dc2626', air_strike: '#f97316', military_movement: '#f59e0b', protest: '#8b5cf6', political_unrest: '#ec4899', humanitarian_crisis: '#06b6d4', naval_incident: '#3b82f6', border_incident: '#10b981' };
            return c[type] || '#6b7280';
        });

        if (conflictTypeChart) conflictTypeChart.destroy();
        conflictTypeChart = new Chart(document.getElementById('conflictTypeChart'), {
            type: 'bar',
            data: {
                labels: entries.map(([type]) => typeLabels[type] || type),
                datasets: [{
                    data: entries.map(([, count]) => count),
                    backgroundColor: colors,
                    borderRadius: 6,
                    barThickness: 24
                }]
            },
            options: {
                indexAxis: 'y',
                plugins: { legend: { display: false } },
                scales: {
                    x: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.04)' } },
                    y: { grid: { display: false } }
                }
            }
        });
    }
}

// ── Cyber Charts ───────────────────────────────────────
function loadCyberCharts(stats) {
    if (!stats) return;

    // Top Countries Bar Chart
    if (stats.topCountries && stats.topCountries.length > 0) {
        if (cyberCountryChart) cyberCountryChart.destroy();
        cyberCountryChart = new Chart(document.getElementById('cyberCountryChart'), {
            type: 'bar',
            data: {
                labels: stats.topCountries.map(c => c.source_country || 'Bilinmeyen'),
                datasets: [{
                    label: 'Saldırı Sayısı',
                    data: stats.topCountries.map(c => c.count),
                    backgroundColor: generateGradientColors(stats.topCountries.length, '#00d4ff', '#ef4444'),
                    borderRadius: 6,
                    barThickness: 20
                }]
            },
            options: {
                indexAxis: 'y',
                plugins: { legend: { display: false } },
                scales: {
                    x: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.04)' } },
                    y: { grid: { display: false } }
                }
            }
        });
    }

    // Attack Type Doughnut
    if (stats.byAttackType && stats.byAttackType.length > 0) {
        const attackColors = ['#ef4444', '#f97316', '#f59e0b', '#10b981', '#00d4ff', '#3b82f6', '#8b5cf6', '#ec4899'];

        const attackTypeLabels = {
            malware: 'Zararlı Yazılım',
            phishing: 'Oltalama',
            botnet: 'Botnet',
            ransomware: 'Fidye Yazılımı',
            ddos: 'DDoS',
            brute_force: 'Kaba Kuvvet',
            exploit: 'Exploit'
        };

        if (cyberAttackTypeChart) cyberAttackTypeChart.destroy();
        cyberAttackTypeChart = new Chart(document.getElementById('cyberAttackTypeChart'), {
            type: 'doughnut',
            data: {
                labels: stats.byAttackType.map(a => attackTypeLabels[a.attack_type] || a.attack_type),
                datasets: [{
                    data: stats.byAttackType.map(a => a.count),
                    backgroundColor: attackColors.slice(0, stats.byAttackType.length),
                    borderWidth: 0,
                    hoverOffset: 8
                }]
            },
            options: {
                cutout: '60%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { padding: 12, usePointStyle: true, pointStyle: 'circle', font: { size: 11 } }
                    }
                }
            }
        });
    }

    // Trend Chart
    if (stats.recentTrend && stats.recentTrend.length > 0) {
        const labels = stats.recentTrend.map(t => {
            const d = new Date(t.date);
            return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
        });

        if (cyberTrendChart) cyberTrendChart.destroy();
        cyberTrendChart = new Chart(document.getElementById('cyberTrendChart'), {
            type: 'line',
            data: {
                labels,
                datasets: [{
                    label: 'Siber Tehditler',
                    data: stats.recentTrend.map(t => t.count),
                    borderColor: '#00ff88',
                    backgroundColor: createGradient('cyberTrendChart', '#00ff88'),
                    fill: true,
                    tension: 0.4,
                    pointRadius: 4,
                    pointBackgroundColor: '#00ff88',
                    pointBorderColor: '#0a0e17',
                    pointBorderWidth: 2
                }]
            },
            options: {
                plugins: { legend: { display: false } },
                scales: {
                    y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.04)' } },
                    x: { grid: { display: false } }
                }
            }
        });
    }
}

// ── Utility Functions ──────────────────────────────────
function createGradient(canvasId, color) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return color;
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 0, 280);
    gradient.addColorStop(0, hexToRGBA(color, 0.3));
    gradient.addColorStop(1, hexToRGBA(color, 0.01));
    return gradient;
}

function hexToRGBA(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function generateGradientColors(count, startColor, endColor) {
    const colors = [];
    for (let i = 0; i < count; i++) {
        const ratio = i / Math.max(count - 1, 1);
        colors.push(interpolateColor(startColor, endColor, ratio));
    }
    return colors;
}

function interpolateColor(color1, color2, ratio) {
    const hex = (c) => parseInt(c, 16);
    const r1 = hex(color1.slice(1, 3)), g1 = hex(color1.slice(3, 5)), b1 = hex(color1.slice(5, 7));
    const r2 = hex(color2.slice(1, 3)), g2 = hex(color2.slice(3, 5)), b2 = hex(color2.slice(5, 7));
    const r = Math.round(r1 + (r2 - r1) * ratio);
    const g = Math.round(g1 + (g2 - g1) * ratio);
    const b = Math.round(b1 + (b2 - b1) * ratio);
    return `rgb(${r}, ${g}, ${b})`;
}
