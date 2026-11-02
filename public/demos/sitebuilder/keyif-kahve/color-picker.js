/**
 * Live Color Palette Editor
 * Allows real-time modification of site colors and persists settings.
 */

document.addEventListener('DOMContentLoaded', () => {
    const isEdit = window.location.search.indexOf('edit=true') !== -1;
    if (isEdit) sessionStorage.setItem('site_edit_mode', 'true');
    if (!isEdit && sessionStorage.getItem('site_edit_mode') !== 'true') return;
    initColorPicker();
});

function initColorPicker() {
    // Inject UI
    const container = document.createElement('div');
    container.id = 'color-picker-container';
    container.innerHTML = `
        <button id="cp-toggle" class="cp-toggle" aria-label="Editör Paneli">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.09a2 2 0 0 1-1-1.74v-.47a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
        </button>
        <div id="cp-sidebar" class="cp-sidebar">
            <div class="cp-header">
                <div class="cp-title-row">
                    <h3>SiteBuilder <span class="badge">PRO</span></h3>
                    <button id="cp-close" class="cp-close">&times;</button>
                </div>
                <div class="cp-tabs">
                    <button class="cp-tab-btn active" data-tab="design">🎨 Tasarım</button>
                    <button class="cp-tab-btn" data-tab="features">⚡ Özellikler</button>
                    <button class="cp-tab-btn" data-tab="publish">🚀 Yayınla</button>
                </div>
            </div>
            
            <div class="cp-content">
                <!-- Design Tab -->
                <div class="cp-tab-content active" id="tab-design">
                    <div class="cp-card">
                        <h4>Renk Paleti</h4>
                        <div class="cp-group">
                            <label>Ana Renk (Primary)</label>
                            <div class="input-wrapper">
                                <input type="color" id="color-primary" data-var="--color-primary">
                                <input type="text" id="text-primary" value="">
                            </div>
                        </div>
                        <div class="cp-group">
                            <label>İkincil Renk (Secondary)</label>
                            <div class="input-wrapper">
                                <input type="color" id="color-secondary" data-var="--color-secondary">
                                <input type="text" id="text-secondary" value="">
                            </div>
                        </div>
                        <div class="cp-group">
                            <label>Vurgu Rengi (Accent)</label>
                            <div class="input-wrapper">
                                <input type="color" id="color-accent" data-var="--color-accent">
                                <input type="text" id="text-accent" value="">
                            </div>
                        </div>
                        <div class="cp-group">
                            <label>Arka Plan (Background)</label>
                            <div class="input-wrapper">
                                <input type="color" id="color-background" data-var="--color-background">
                                <input type="text" id="text-background" value="">
                            </div>
                        </div>
                        <div class="cp-group">
                            <label>Metin Rengi (Text)</label>
                            <div class="input-wrapper">
                                <input type="color" id="color-text" data-var="--color-text">
                                <input type="text" id="text-text" value="">
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Features Tab -->
                <div class="cp-tab-content" id="tab-features">
                    <!-- Loaded dynamically from editor.js -->
                     <div id="features-dynamic-content"></div>
                </div>

                <!-- Publish Tab -->
                <div class="cp-tab-content" id="tab-publish">
                    <div class="cp-card">
                        <h4>Dışa Aktarma ve Yayınlama</h4>
                        <div id="publish-dynamic-content"></div>
                    </div>
                </div>
            </div>

            <div class="cp-footer">
                <div class="cp-actions">
                    <button id="cp-copy" class="btn btn-sm btn-primary">Ayarları Kopyala (JSON)</button>
                    <button id="cp-reset" class="btn btn-sm btn-glass">Sıfırla</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(container);

    // Event Listeners
    const toggleBtn = document.getElementById('cp-toggle');
    const sidebar = document.getElementById('cp-sidebar');
    const closeBtn = document.getElementById('cp-close');
    const resetBtn = document.getElementById('cp-reset');
    const copyBtn = document.getElementById('cp-copy');

    toggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });

    closeBtn.addEventListener('click', () => {
        sidebar.classList.remove('active');
    });

    // Tab Logic
    const tabBtns = container.querySelectorAll('.cp-tab-btn');
    const tabContents = container.querySelectorAll('.cp-tab-content');

    tabBtns.forEach(btn => {
        btn.onclick = () => {
            const tabId = btn.dataset.tab;
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            container.querySelector(`#tab-${tabId}`).classList.add('active');
        };
    });

    // Initialize inputs
    const inputs = container.querySelectorAll('input[type="color"]');
    const rootStyle = getComputedStyle(document.documentElement);

    // Load saved settings if any
    const savedSettings = loadSettings();

    inputs.forEach(input => {
        const cssVar = input.dataset.var;

        let initialColor;
        // Check if we have a saved value for this var
        if (savedSettings && savedSettings[cssVar]) {
            initialColor = savedSettings[cssVar];
            // Apply saved color immediately
            document.documentElement.style.setProperty(cssVar, initialColor);
            updateRGBVar(cssVar, initialColor);
        } else {
            // Fallback to computed style
            initialColor = rootStyle.getPropertyValue(cssVar).trim();
        }

        // Convert to hex if needed (browsers usually return rgb)
        const hexColor = rgbToHex(initialColor);

        input.value = hexColor;
        input.nextElementSibling.value = hexColor; // Set text input

        // Listen for changes
        input.addEventListener('input', (e) => {
            const val = e.target.value;
            document.documentElement.style.setProperty(cssVar, val);
            input.nextElementSibling.value = val;
            updateRGBVar(cssVar, val);
            saveSettings(inputs);
        });

        // Listen for text input changes
        input.nextElementSibling.addEventListener('input', (e) => {
            const val = e.target.value;
            if (isValidColor(val)) {
                input.value = val;
                document.documentElement.style.setProperty(cssVar, val);
                updateRGBVar(cssVar, val);
                saveSettings(inputs);
            }
        });
    });

    resetBtn.addEventListener('click', () => {
        localStorage.removeItem('site-color-settings');
        inputs.forEach(input => {
            const cssVar = input.dataset.var;
            document.documentElement.style.removeProperty(cssVar);
            // Also remove RGB vars
            document.documentElement.style.removeProperty(cssVar + '-rgb');

            // Reset input values to original computed styles (re-fetch because we removed inline styles)
            // Note: This gets the stylesheet value now since inline is gone
            const originalColor = getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim();
            const hex = rgbToHex(originalColor);
            input.value = hex;
            input.nextElementSibling.value = hex;
        });
    });

    copyBtn.addEventListener('click', () => {
        const config = {};
        inputs.forEach(input => {
            config[input.dataset.var.replace('--color-', '')] = input.value;
        });

        navigator.clipboard.writeText(JSON.stringify(config, null, 2))
            .then(() => {
                const originalText = copyBtn.textContent;
                copyBtn.textContent = 'Kopyalandı!';
                setTimeout(() => copyBtn.textContent = originalText, 2000);
            });
    });
}

// Storage Helpers
function saveSettings(inputs) {
    const settings = {};
    const colorsForServer = {};
    inputs.forEach(input => {
        settings[input.dataset.var] = input.value;
        const colorKey = input.dataset.var.replace('--color-', ''); // primary, secondary vb.
        colorsForServer[colorKey] = input.value;
    });
    localStorage.setItem('site-color-settings', JSON.stringify(settings));

    if (window.syncColorToServer) {
        window.syncColorToServer(colorsForServer);
    }
}

function loadSettings() {
    const saved = localStorage.getItem('site-color-settings');
    return saved ? JSON.parse(saved) : null;
}

// Helper to update RGB variables for transparency effects (e.g. --color-primary-rgb)
function updateRGBVar(cssVar, hex) {
    const rgb = hexToRgb(hex);
    if (rgb) {
        document.documentElement.style.setProperty(`${cssVar}-rgb`, `${rgb.r}, ${rgb.g}, ${rgb.b}`);
    }
}

function rgbToHex(rgb) {
    if (!rgb) return '#000000';
    if (rgb.startsWith('#')) return rgb;
    const rgbValues = rgb.match(/\d+/g);
    if (!rgbValues) return '#000000';
    return "#" +
        ("0" + parseInt(rgbValues[0], 10).toString(16)).slice(-2) +
        ("0" + parseInt(rgbValues[1], 10).toString(16)).slice(-2) +
        ("0" + parseInt(rgbValues[2], 10).toString(16)).slice(-2);
}

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function isValidColor(str) {
    const s = new Option().style;
    s.color = str;
    return s.color !== '';
}
