/**
 * OSINT Platform - Maps Module
 * Leaflet.js maps for conflict tracking and cyber threat visualization.
 */

// Map instances
let overviewMap = null;
let conflictMap = null;
let cyberMap = null;

// Layer groups
let conflictMarkers = null;
let cyberMarkers = null;
let heatLayer = null;
let overviewHeatLayer = null;
let cyberHeatLayer = null;

// Geo-Fencing Radar State
let geoFenceMode = { active: false, mapType: null, center: null, radiusKm: 1000 };
let currentGeoFenceCircle = null;

// Tile layer URL (dark theme)
const TILE_URL = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
const TILE_ATTR = '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>';

// Event type icons/colors
const EVENT_COLORS = {
    armed_conflict: '#ef4444',
    terrorism: '#dc2626',
    air_strike: '#f97316',
    military_movement: '#f59e0b',
    protest: '#8b5cf6',
    political_unrest: '#ec4899',
    humanitarian_crisis: '#06b6d4',
    naval_incident: '#3b82f6',
    border_incident: '#10b981'
};

const EVENT_LABELS = {
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

/**
 * Safely add a heatLayer - checks that the map container has real dimensions
 */
function safeAddHeatLayer(map, heatData, options) {
    if (!map || !heatData || heatData.length === 0) return null;
    if (typeof L.heatLayer !== 'function') return null;

    // Check container has actual dimensions and is visible in DOM
    const container = map.getContainer();
    const size = map.getSize();
    if (!container || !container.offsetParent || container.offsetWidth === 0 || container.offsetHeight === 0 || size.x === 0 || size.y === 0) {
        console.log('[MAP] Skipping heatLayer: container not visible yet or map size is 0');
        return null;
    }

    try {
        const layer = L.heatLayer(heatData, options);
        layer.addTo(map);
        return layer;
    } catch (e) {
        console.warn('[MAP] heatLayer error (non-fatal):', e.message);
        return null;
    }
}

// ── Overview Map ───────────────────────────────────────
function initOverviewMap() {
    const container = document.getElementById('overviewMap');
    if (!container) return;

    // Skip if container is not visible
    if (container.offsetWidth === 0 || container.offsetHeight === 0) return;

    if (overviewMap) {
        overviewMap.invalidateSize();
        return;
    }

    overviewMap = L.map('overviewMap', {
        center: [20, 30],
        zoom: 2,
        minZoom: 2,
        maxZoom: 8,
        zoomControl: false
    });

    L.tileLayer(TILE_URL, { attribution: TILE_ATTR }).addTo(overviewMap);
    L.control.zoom({ position: 'topright' }).addTo(overviewMap);

    // Load conflict events for overview
    loadOverviewMapData();
}

async function loadOverviewMapData() {
    if (!overviewMap) return;

    try {
        const [conflictsRes, cyberRes] = await Promise.all([
            fetch(getApiUrl('/api/conflicts/events?limit=100')).then(r => r.json()),
            fetch(getApiUrl('/api/cyber/map-data')).then(r => r.json())
        ]);

        // Add conflict markers
        if (conflictsRes.success && conflictsRes.events) {
            conflictsRes.events.forEach(event => {
                if (!event.latitude || !event.longitude) return;

                const color = EVENT_COLORS[event.event_type] || '#f59e0b';
                const marker = L.circleMarker([event.latitude, event.longitude], {
                    radius: 4 + (event.severity || 1) * 1.5,
                    fillColor: color,
                    color: color,
                    weight: 1,
                    opacity: 0.8,
                    fillOpacity: 0.5
                });

                const displayTitle = event.title_tr || event.title || 'Bilinmeyen Olay';
                const langBadge = (event.title_tr && event.title && event.title_tr !== event.title) ? '<span style="font-size:10px; color:#8b5cf6; margin-left:4px">[EN]</span>' : '';

                marker.bindPopup(`
          <div style="font-size:13px; min-width:200px">
            <strong>${escapeHtml(displayTitle)} ${langBadge}</strong><br>
            <span style="color:${color}">● ${EVENT_LABELS[event.event_type] || event.event_type}</span><br>
            📍 ${event.country || ''} - ${event.location_name || ''}<br>
            ⚡ Şiddet: ${event.severity}/5<br>
            📅 ${event.event_date ? new Date(event.event_date).toLocaleDateString('tr-TR') : '-'}
          </div>
        `);

                marker.addTo(overviewMap);
            });
        }

        // Add cyber heatmap (safely)
        if (cyberRes.success && cyberRes.data) {
            const heatData = cyberRes.data
                .filter(d => d.source_lat && d.source_lng)
                .map(d => [d.source_lat, d.source_lng, Math.min(d.attack_count / 10, 1)]);

            if (overviewHeatLayer) {
                overviewMap.removeLayer(overviewHeatLayer);
            }
            overviewHeatLayer = safeAddHeatLayer(overviewMap, heatData, {
                radius: 25,
                blur: 15,
                maxZoom: 8,
                gradient: { 0.2: '#00ff88', 0.5: '#f59e0b', 0.8: '#ef4444', 1: '#dc2626' }
            });
        }
    } catch (err) {
        console.error('[MAP] Overview data error:', err);
    }
}

// ── Conflict Map ───────────────────────────────────────
function updateConflictMap(events) {
    window.lastConflictData = events; // Store for geo-fence re-renders
    const container = document.getElementById('conflictMap');
    if (!container) return;

    // Apply Geo-Fence Radar if active
    events = applyGeoFenceFilter(events, 'conflict');

    // Check container is visible before creating map
    if (container.offsetWidth === 0 || container.offsetHeight === 0) {
        // Retry after a short delay when container becomes visible
        setTimeout(() => updateConflictMap(events), 300);
        return;
    }

    if (!conflictMap) {
        conflictMap = L.map('conflictMap', {
            center: [25, 40],
            zoom: 3,
            minZoom: 2,
            maxZoom: 12,
            zoomControl: false
        });

        L.tileLayer(TILE_URL, { attribution: TILE_ATTR }).addTo(conflictMap);
        L.control.zoom({ position: 'topright' }).addTo(conflictMap);

        conflictMarkers = L.layerGroup().addTo(conflictMap);

        // Add legend
        addConflictLegend();
    }

    // Ensure map knows its size
    conflictMap.invalidateSize();

    // Clear existing markers
    conflictMarkers.clearLayers();

    if (!events || events.length === 0) {
        return;
    }

    // Add markers
    const heatPoints = [];

    events.forEach(event => {
        if (!event.latitude || !event.longitude) return;

        const color = EVENT_COLORS[event.event_type] || '#f59e0b';
        const size = 5 + (event.severity || 1) * 2;

        const marker = L.circleMarker([event.latitude, event.longitude], {
            radius: size,
            fillColor: color,
            color: '#fff',
            weight: 1,
            opacity: 0.9,
            fillOpacity: 0.7
        });

        const displayTitle = event.title_tr || event.title || 'Olay';
        const displayDesc = event.description_tr || event.description || '';
        const langBadge = (event.title_tr && event.title && event.title_tr !== event.title) ? '<span style="font-size:10px; color:#8b5cf6; margin-left:4px">[EN]</span>' : '';

        marker.bindPopup(`
      <div style="font-size:13px; min-width:220px; color:#333">
        <h4 style="margin:0 0 8px 0; font-size:14px">${escapeHtml(displayTitle)} ${langBadge}</h4>
        <span style="display:inline-block; background:${color}; color:white; padding:2px 8px; border-radius:10px; font-size:11px; font-weight:600">
          ${EVENT_LABELS[event.event_type] || event.event_type}
        </span>
        <div style="margin-top:8px; line-height:1.6">
          📍 <strong>${event.country || ''}</strong> - ${event.location_name || ''}<br>
          ⚡ Şiddet: ${'🔥'.repeat(event.severity || 1)}<br>
          📅 ${event.event_date ? new Date(event.event_date).toLocaleDateString('tr-TR') : '-'}<br>
          ${displayDesc ? `<p style="margin-top:6px; font-size:12px; color:#555">${escapeHtml(displayDesc).substring(0, 150)}...</p>` : ''}
          ${event.source_url ? `<a href="${event.source_url}" target="_blank" style="font-size:12px">Kaynak ↗</a>` : ''}
        </div>
      </div>
    `);

        conflictMarkers.addLayer(marker);

        // Add to heat points
        heatPoints.push([event.latitude, event.longitude, (event.severity || 1) / 5]);
    });

    // Add heatmap layer (safely, after invalidateSize)
    if (heatLayer) {
        conflictMap.removeLayer(heatLayer);
        heatLayer = null;
    }
    // Small delay to ensure canvas has dimensions after invalidateSize
    setTimeout(() => {
        heatLayer = safeAddHeatLayer(conflictMap, heatPoints, {
            radius: 30,
            blur: 20,
            maxZoom: 8,
            gradient: { 0.2: '#f59e0b', 0.5: '#f97316', 0.8: '#ef4444', 1: '#dc2626' }
        });
    }, 200);

    // Fit bounds
    if (events.length > 0) {
        const validEvents = events.filter(e => e.latitude && e.longitude);
        if (validEvents.length > 0) {
            const bounds = L.latLngBounds(validEvents.map(e => [e.latitude, e.longitude]));
            conflictMap.fitBounds(bounds, { padding: [50, 50], maxZoom: 6 });
        }
    }
}

function addConflictLegend() {
    const legend = L.control({ position: 'bottomright' });
    legend.onAdd = function () {
        const div = L.DomUtil.create('div', 'legend');
        div.style.cssText = 'background:rgba(0,0,0,0.85); padding:10px 14px; border-radius:8px; font-size:11px; color:#e4e7ec; line-height:1.8';

        let html = '<strong style="font-size:12px">Olay Türleri</strong><br>';
        for (const [type, color] of Object.entries(EVENT_COLORS)) {
            html += `<span style="display:inline-block; width:10px; height:10px; border-radius:50%; background:${color}; margin-right:6px"></span>${EVENT_LABELS[type]}<br>`;
        }
        div.innerHTML = html;
        return div;
    };
    legend.addTo(conflictMap);
}

// ── Cyber Map ──────────────────────────────────────────
function updateCyberMap(data) {
    const container = document.getElementById('cyberMap');
    if (!container) return;

    // Apply Geo-Fence Radar if active
    data = applyGeoFenceFilter(data, 'cyber');

    // Check container is visible
    if (container.offsetWidth === 0 || container.offsetHeight === 0) {
        setTimeout(() => updateCyberMap(data), 300);
        return;
    }

    if (!cyberMap) {
        cyberMap = L.map('cyberMap', {
            center: [30, 20],
            zoom: 2,
            minZoom: 2,
            maxZoom: 10,
            zoomControl: false
        });

        L.tileLayer(TILE_URL, { attribution: TILE_ATTR }).addTo(cyberMap);
        L.control.zoom({ position: 'topright' }).addTo(cyberMap);

        cyberMarkers = L.layerGroup().addTo(cyberMap);
    }

    // Ensure map knows its size
    cyberMap.invalidateSize();

    // Clear existing
    cyberMarkers.clearLayers();

    if (!data || data.length === 0) return;

    // Remove old heat layer
    if (cyberHeatLayer) {
        cyberMap.removeLayer(cyberHeatLayer);
        cyberHeatLayer = null;
    }

    // Heatmap for attack density (safely, with delay)
    const heatData = data
        .filter(d => d.source_lat && d.source_lng)
        .map(d => [d.source_lat, d.source_lng, Math.min(d.attack_count / 50, 1)]);

    setTimeout(() => {
        cyberHeatLayer = safeAddHeatLayer(cyberMap, heatData, {
            radius: 30,
            blur: 25,
            maxZoom: 8,
            gradient: { 0.1: '#00ff88', 0.3: '#00d4ff', 0.5: '#f59e0b', 0.8: '#ef4444', 1: '#dc2626' }
        });
    }, 200);

    const mapElements = []; // Store elements for click isolation

    // Country markers
    data.forEach((d, idx) => {
        if (!d.source_lat || !d.source_lng) return;

        const severity = d.avg_severity || 1;
        const size = Math.min(20, 6 + Math.log2(d.attack_count + 1) * 3);
        const color = severity > 3 ? '#ef4444' : severity > 2 ? '#f97316' : '#00d4ff';

        const origin = [d.source_lat, d.source_lng];

        // Draw Origin Marker
        const marker = L.circleMarker(origin, {
            radius: size,
            fillColor: color,
            color: '#fff',
            weight: 1,
            opacity: 0.9,
            fillOpacity: 0.6
        });

        const attacks = (d.attack_types || '').split(',').join(', ');
        marker.bindPopup(`
      <div style="font-size:13px; min-width:200px; color:#333">
        <h4 style="margin:0 0 8px 0">🌐 ${d.source_country || 'Bilinmeyen'} (Kaynak IP)</h4>
        <div style="line-height:1.6">
          🚨 Tespit Edilen Olay: <strong>${d.attack_count}</strong><br>
          ⚡ Ort. Şiddet: ${(d.avg_severity || 0).toFixed(1)}<br>
          🔧 Türler: ${attacks || '-'}
        </div>
      </div>
    `);

        const elementId = `cyber_${idx}`;

        marker.on('click', (e) => {
            // Isolate functionality
            mapElements.forEach(el => {
                if (el.id !== elementId) {
                    el.marker.setStyle({ opacity: 0.1, fillOpacity: 0.1 });
                } else {
                    el.marker.setStyle({ opacity: 0.9, fillOpacity: 0.6 });
                }
            });
            L.DomEvent.stopPropagation(e);
        });

        mapElements.push({ id: elementId, marker: marker });
        cyberMarkers.addLayer(marker);
    });

    // Map click resets visibility
    cyberMap.off('click');
    cyberMap.on('click', () => {
        mapElements.forEach(el => {
            el.marker.setStyle({ opacity: 0.9, fillOpacity: 0.6 });
        });
    });
}

// ── Geo-Fencing Radar Logic ────────────────────────────
window.toggleGeoFence = function (mapType) {
    const btnId = mapType === 'cyber' ? 'btnCyberGeoFence' : 'btnConflictGeoFence';
    const btn = document.getElementById(btnId);
    const targetMap = mapType === 'cyber' ? cyberMap : conflictMap;

    // Turn Off
    if (geoFenceMode.active && geoFenceMode.mapType === mapType) {
        geoFenceMode.active = false;
        btn.innerHTML = '🎯 Radar (Aç)';
        btn.style.color = '';
        btn.style.borderColor = '#64748b';

        targetMap.getContainer().style.cursor = '';
        if (currentGeoFenceCircle) {
            targetMap.removeLayer(currentGeoFenceCircle);
            currentGeoFenceCircle = null;
        }
        geoFenceMode.center = null;

        // Render unfiltered map
        if (mapType === 'cyber') applyCyberFilters();
        if (mapType === 'conflict') updateConflictMap(window.lastConflictData);
        return;
    }

    // Turn On
    geoFenceMode.active = true;
    geoFenceMode.mapType = mapType;
    btn.innerHTML = '🔴 Hedef Seçin...';
    btn.style.color = '#ef4444';
    btn.style.borderColor = '#ef4444';

    targetMap.getContainer().style.cursor = 'crosshair';

    // Delay listener to avoid triggering on the current button-click event bubble
    setTimeout(() => {
        targetMap.once('click', (e) => {
            // Check if prompt is available/blocked or return a default
            let radiusStr = '1000';
            try {
                const p = prompt('Radarın kapsama alanını (Yarıçap - KM) girin:', '1000');
                if (p !== null && p !== "") radiusStr = p;
                // If null (cancelled) but it's a subagent/headless, just use default instead of turning off
            } catch (err) {
                console.warn('[RADAR] Prompt blocked, using default 1000km');
            }

            geoFenceMode.center = e.latlng;
            geoFenceMode.radiusKm = parseInt(radiusStr) || 1000;

            btn.innerHTML = `🔴 Radar Aktif (${geoFenceMode.radiusKm}km)`;
            targetMap.getContainer().style.cursor = '';

            if (currentGeoFenceCircle) targetMap.removeLayer(currentGeoFenceCircle);
            currentGeoFenceCircle = L.circle(e.latlng, {
                radius: geoFenceMode.radiusKm * 1000,
                color: '#ef4444',
                fillColor: '#ef4444',
                fillOpacity: 0.15,
                weight: 2,
                dashArray: '5, 10'
            }).addTo(targetMap);

            // Re-render map with active geo-fence filter
            if (mapType === 'cyber') applyCyberFilters();
            if (mapType === 'conflict') updateConflictMap(window.lastConflictData);
        });
    }, 100);
};

function applyGeoFenceFilter(data, mapType) {
    if (!geoFenceMode.active || geoFenceMode.mapType !== mapType || !geoFenceMode.center) return data;

    return data.filter(d => {
        const lat = d.source_lat || d.latitude;
        const lng = d.source_lng || d.longitude;
        if (!lat || !lng) return false;

        const pt = L.latLng(lat, lng);
        const distMeters = pt.distanceTo(geoFenceMode.center);
        return distMeters <= (geoFenceMode.radiusKm * 1000);
    });
}

// ── Utility ────────────────────────────────────────────
function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
