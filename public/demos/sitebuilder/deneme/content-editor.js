/**
 * Live Content Editor
 * Allows real-time editing of text, images, and backgrounds.
 */

document.addEventListener('DOMContentLoaded', () => {
    const isEdit = window.location.search.indexOf('edit=true') !== -1;
    if (isEdit) sessionStorage.setItem('site_edit_mode', 'true');
    if (!isEdit && sessionStorage.getItem('site_edit_mode') !== 'true') return;

    setTimeout(() => {
        initContentEditor();
    }, 100); // 100ms gecikme ile color-picker'ın hazır olması beklenir
});

let isEditMode = false;
let USER_ROLE = 'admin';

function initContentEditor() {
    initAuth();
    // Inject Hero Background Input
    const cpContent = document.querySelector('.cp-content');
    const cpActions = document.querySelector('.cp-actions');

    if (cpContent && cpActions) {
        // Create Hero BG Group
        const heroBgGroup = document.createElement('div');
        heroBgGroup.className = 'cp-group';
        heroBgGroup.id = 'hero-bg-group';
        heroBgGroup.innerHTML = `
            <label>Hero Görseli (Arka Plan)</label>
            <div class="input-wrapper">
                 <input type="file" id="hero-bg-upload" accept="image/*" style="display:none">
                 <button id="hero-bg-upload-btn" class="btn btn-sm btn-outline" style="width:100%">📁 Görsel Seç (Lokal)</button>
            </div>
            <div class="input-wrapper" style="margin-top:5px;">
                <input type="text" id="hero-bg-input" inputmode="url" placeholder="veya URL yapıştır..." style="width: 100%;">
            </div>
            <small style="display:block; margin-top:4px; font-size:11px; color:#999;">Görsel seçin veya URL yapıştırın.</small>
        `;

        // Insert into Design Tab
        const designTab = document.getElementById('tab-design');
        if (designTab) {
            designTab.appendChild(heroBgGroup);
        } else {
            cpContent.appendChild(heroBgGroup);
        }

        // Initialize Input Value
        const heroBgInput = document.getElementById('hero-bg-input');
        const heroBgUpload = document.getElementById('hero-bg-upload');
        const heroBgUploadBtn = document.getElementById('hero-bg-upload-btn');
        const heroSection = document.querySelector('.hero');
        let heroBgEl = null;

        if (heroSection) {
            // Try to find the element with background-image
            heroBgEl = heroSection.querySelector('[style*="background-image"]');

            if (!heroBgEl && heroSection.style.backgroundImage) {
                heroBgEl = heroSection;
            }

            if (heroBgEl) {
                const currentBg = heroBgEl.style.backgroundImage;
                if (currentBg) {
                    // Only show if it's a URL, not base64 (too long)
                    if (!currentBg.includes('data:image')) {
                        const url = currentBg.slice(4, -1).replace(/"/g, "");
                        heroBgInput.value = url;
                    }
                }

                // File Upload Listener
                heroBgUploadBtn.onclick = () => heroBgUpload.click();
                heroBgUpload.onchange = (e) => {
                    const file = e.target.files[0];
                    if (file) {
                        handleFileUpload(file, (base64) => {
                            heroBgEl.style.backgroundImage = `url('${base64}')`;
                            saveContent(heroBgEl, 'bg');
                        });
                    }
                };

                // URL Input Listener
                heroBgInput.addEventListener('input', (e) => {
                    const newUrl = e.target.value.trim();
                    if (newUrl) {
                        heroBgEl.style.backgroundImage = `url('${newUrl}')`;
                        saveContent(heroBgEl, 'bg');
                    }
                });
            } else {
                heroBgInput.disabled = true;
                heroBgUploadBtn.disabled = true;
                heroBgInput.placeholder = "Hero görseli bulunamadı";
            }
        }
    }

    // Add "Edit Mode" toggle to the existing Color Picker sidebar actions
    const actionsContainer = document.querySelector('.cp-actions');
    if (actionsContainer) {
        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'editor-toggle-btn';
        toggleBtn.className = 'btn btn-sm btn-outline';
        toggleBtn.style.width = '100%';
        toggleBtn.style.marginTop = '10px';
        toggleBtn.innerHTML = '📝 İçerik Düzenle: <b>KAPALI</b>';
        toggleBtn.onclick = toggleEditMode;
        actionsContainer.insertBefore(toggleBtn, actionsContainer.lastElementChild); // Insert before reset
    }

    // Global hidden file input for general image clicking
    const hiddenFileInput = document.createElement('input');
    hiddenFileInput.type = 'file';
    hiddenFileInput.accept = 'image/*';
    hiddenFileInput.style.display = 'none';
    hiddenFileInput.id = 'global-image-upload';
    document.body.appendChild(hiddenFileInput);

    // Load saved content from server and localStorage
    loadContentFromServer();

    // Auto-save observer (for text changes)
    const observer = new MutationObserver((mutations) => {
        if (!isEditMode) return;
        mutations.forEach((mutation) => {
            if (mutation.type === 'characterData' || mutation.type === 'childList') {
                saveContent(mutation.target.parentElement);
            }
        });
    });

    window.contentObserver = observer;

    // Pro Features
    initAnimationToggle();
    initFontSelector();
    initWhatsAppSettings();
    initSEOPanel();
    initPopupPanel();
    initLayoutSettings();
    initLanguagePanel();
    initBlockManager();
    initExportActions();

    // Check URL parameters for open editor mode automatically
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('edit') === 'true') {
        setTimeout(() => {
            const toggleBtn = document.getElementById('editor-toggle-btn');
            if (toggleBtn && !isEditMode) {
                toggleBtn.click();
            }
        }, 500); // 500ms for data loading buffer
    }
}

function loadAllContent() {
    return JSON.parse(localStorage.getItem('site-content-edits') || '{}');
}

function loadContent() {
    const data = loadAllContent();
    Object.entries(data).forEach(([path, item]) => {
        const el = document.querySelector(path);
        if (!el) return;

        if (item.type === 'text') {
            el.innerHTML = item.content;
        } else if (item.type === 'src') {
            el.src = item.content;
        } else if (item.type === 'bg') {
            el.style.backgroundImage = item.content;
        }
    });

    // Apply dimensions
    const dims = JSON.parse(localStorage.getItem('site-element-dimensions') || '{}');
    Object.entries(dims).forEach(([path, style]) => {
        const el = document.querySelector(path);
        if (el) el.style.cssText += style;
    });
}

function handleFileUpload(file, callback) {
    if (file.size > 2 * 1024 * 1024) { // 2MB limit warning
        alert("Uyarı: Dosya boyutu büyük (2MB+). Tarayıcı hafızasını doldurabilir.");
    }
    const reader = new FileReader();
    reader.onload = (e) => callback(e.target.result);
    render.onerror = (e) => console.error("File reading failed", e);
    reader.readAsDataURL(file);
}

function toggleEditMode() {
    isEditMode = !isEditMode;
    const btn = document.getElementById('editor-toggle-btn');
    const body = document.body;

    if (isEditMode) {
        btn.innerHTML = '📝 İçerik Düzenle: <b>AÇIK</b>';
        btn.classList.replace('btn-outline', 'btn-primary');
        body.classList.add('edit-mode-active');
        enableEditing();
    } else {
        btn.innerHTML = '📝 İçerik Düzenle: <b>KAPALI</b>';
        btn.classList.replace('btn-primary', 'btn-outline');
        body.classList.remove('edit-mode-active');
        disableEditing();
    }
}

function enableEditing() {
    // Text Elements
    const textElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, a, li, .section-label, .hero-tagline');
    textElements.forEach(el => {
        if (el.closest('.cp-sidebar')) return; // Ignore sidebar
        el.contentEditable = true;
        el.classList.add('editable-text');

        // Save on blur/input
        el.onblur = () => saveContent(el);

        // Observe changes
        window.contentObserver.observe(el, { characterData: true, subtree: true, childList: true });
    });

    // Images
    const images = document.querySelectorAll('img');
    const globalInput = document.getElementById('global-image-upload');

    images.forEach(img => {
        if (img.closest('.cp-sidebar')) return;
        img.classList.add('editable-image');
        img.onclick = (e) => {
            if (!isEditMode) return;
            e.preventDefault();

            // Trigger file upload
            globalInput.onchange = (ev) => {
                const file = ev.target.files[0];
                if (file) {
                    handleFileUpload(file, (base64) => {
                        img.src = base64;
                        saveContent(img, 'src');
                    });
                }
                globalInput.value = ''; // Reset
            };
            globalInput.click();
        };
    });

    // Background Images (Hero sections)
    const bgElements = document.querySelectorAll('[style*="background-image"]');
    const globalBgInput = document.getElementById('global-image-upload'); // Reuse or create another

    bgElements.forEach(el => {
        if (el.closest('.cp-sidebar')) return;

        // Don't add button if already added
        if (el.querySelector('.bg-edit-btn')) return;

        const style = window.getComputedStyle(el);
        if (style.position === 'static') {
            el.dataset.originalPosition = 'static';
            el.style.position = 'relative';
        }

        const btn = document.createElement('button');
        btn.className = 'bg-edit-btn';
        btn.innerHTML = '🖼️ Arka Planı Değiştir';
        btn.onclick = (e) => {
            e.stopPropagation();
            // Trigger file upload
            globalBgInput.onchange = (ev) => {
                const file = ev.target.files[0];
                if (file) {
                    handleFileUpload(file, (base64) => {
                        el.style.backgroundImage = `url('${base64}')`;
                        saveContent(el, 'bg');
                    });
                }
                globalBgInput.value = '';
            };
            globalBgInput.click();
        };
        el.appendChild(btn);
    });
}

function disableEditing() {
    // Text
    const textElements = document.querySelectorAll('.editable-text');
    textElements.forEach(el => {
        el.contentEditable = false;
        el.classList.remove('editable-text');
        el.onblur = null;
    });

    // Images
    const images = document.querySelectorAll('.editable-image');
    images.forEach(img => {
        img.classList.remove('editable-image');
        img.onclick = null;
    });

    // Background Buttons
    const bgButtons = document.querySelectorAll('.bg-edit-btn');
    bgButtons.forEach(btn => {
        const parent = btn.parentElement;
        btn.remove();
        // Revert position
        if (parent && parent.dataset.originalPosition === 'static') {
            parent.style.position = '';
        }
        delete parent.dataset.originalPosition;
    });
}

// Generate a unique selector path for an element
function getPath(element) {
    if (element.id !== '') return "#" + element.id;
    if (element === document.body) return element.tagName.toLowerCase();

    let ix = 0;
    let siblings = element.parentNode.childNodes;
    for (let i = 0; i < siblings.length; i++) {
        let sibling = siblings[i];
        if (sibling === element) return getPath(element.parentNode) + '>' + element.tagName.toLowerCase() + ':nth-child(' + (ix + 1) + ')';
        if (sibling.nodeType === 1 && sibling.tagName === element.tagName) ix++;
    }
}

function saveContent(element, type = 'text') {
    const path = getPath(element);
    let data = loadAllContent();

    if (type === 'text') {
        // Clone element to clean it before saving
        const clone = element.cloneNode(true);
        // Remove editor elements from clone
        clone.querySelectorAll('.resize-handle, .bg-edit-btn, .gallery-edit-btn').forEach(node => node.remove());
        clone.classList.remove('resizable-element', 'editable-text', 'editable-image', 'editor-active');

        data[path] = { type: 'text', content: clone.innerHTML };
    } else if (type === 'src') {
        data[path] = { type: 'src', content: element.src };
    } else if (type === 'bg') {
        // For background, we need the parent element path usually
        // But here we appended the button inside, so 'element' is the container
        data[path] = { type: 'bg', content: element.style.backgroundImage };
    }

    localStorage.setItem('site-content-edits', JSON.stringify(data));

    // Pro: Sync with server
    syncChangesToServer();
}

function syncChangesToServer() {
    const edits = {
        texts: {},
        images: {},
        dimensions: JSON.parse(localStorage.getItem('site-element-dimensions') || '{}')
    };

    const savedEdits = loadAllContent();
    Object.entries(savedEdits).forEach(([path, item]) => {
        if (item.type === 'text') edits.texts[path] = item.content;
        if (item.type === 'src') edits.images[path] = item.content;
        if (item.type === 'bg') edits.images[path] = item.content; // Use same images bucket for BG
    });

    if (window.syncTimeout) clearTimeout(window.syncTimeout);

    window.syncTimeout = setTimeout(() => {
        fetch('../../api/save-content.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                slug: window.SITE_SLUG,
                edits: edits
            })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    console.log('✅ Changes synced to server');
                    showNotification('Değişiklikler sunucuya kaydedildi');
                }
            })
            .catch(err => console.error('Sync failed', err));
    }, 2000); // 2 second debounce
}

async function forceSyncAllToServer() {
    // 1. Aktif halde açık unutulmuş odaklı editör metinlerini zorla localStorage'a kaydet (blur olmamış olabilir)
    document.querySelectorAll('.editable-text').forEach(el => {
        // saveContent fonksiyonu içerisinde syncChangesToServer da tetikleniyor
        // O yüzden setTimeout ile çakışmaması adına debounce temizliyoruz.
        const path = getPath(el);
        let data = loadAllContent();
        const clone = el.cloneNode(true);
        clone.querySelectorAll('.resize-handle, .bg-edit-btn, .gallery-edit-btn').forEach(node => node.remove());
        clone.classList.remove('resizable-element', 'editable-text', 'editable-image', 'editor-active');
        data[path] = { type: 'text', content: clone.innerHTML };
        localStorage.setItem('site-content-edits', JSON.stringify(data));
    });

    if (window.syncTimeout) clearTimeout(window.syncTimeout);
    if (window.colorSyncTimeout) clearTimeout(window.colorSyncTimeout);

    const edits = {
        texts: {},
        images: {},
        dimensions: JSON.parse(localStorage.getItem('site-element-dimensions') || '{}'),
        colors: JSON.parse(localStorage.getItem('site-color-settings') || '{}')
    };

    // Remove --color- prefix from colors for server format
    const formattedColors = {};
    for (const [key, val] of Object.entries(edits.colors)) {
        formattedColors[key.replace('--color-', '')] = val;
    }
    edits.colors = formattedColors;

    const savedEdits = loadAllContent();
    Object.entries(savedEdits).forEach(([path, item]) => {
        if (item.type === 'text') edits.texts[path] = item.content;
        if (item.type === 'src') edits.images[path] = item.content;
        if (item.type === 'bg') edits.images[path] = item.content;
    });

    try {
        const res = await fetch('../../api/save-content.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ slug: window.SITE_SLUG, edits: edits })
        });
        const data = await res.json();
        console.log('✅ Force sync complete:', data);
        return data.success;
    } catch (err) {
        console.error('Force sync failed', err);
        return false;
    }
}

window.syncColorToServer = function (colorsObj) {
    if (window.colorSyncTimeout) clearTimeout(window.colorSyncTimeout);
    window.colorSyncTimeout = setTimeout(() => {
        fetch('../../api/save-content.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ slug: window.SITE_SLUG, edits: { colors: colorsObj } })
        }).catch(err => console.error('Color sync failed', err));
    }, 1000);
};

window.syncVariationToServer = function (type, id) {
    const edits = { variations: {} };
    edits.variations[type] = id;

    fetch('../../api/save-content.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: window.SITE_SLUG, edits: edits })
    }).catch(err => console.error('Variation sync failed', err));
};

function showNotification(msg) {
    const existing = document.querySelector('.editor-notif');
    if (existing) existing.remove();

    const notif = document.createElement('div');
    notif.className = 'editor-notif';
    notif.style = 'position:fixed; bottom:20px; right:20px; background:var(--color-primary); color:white; padding:10px 20px; border-radius:30px; z-index:9999; font-size:13px; box-shadow:0 4px 12px rgba(0,0,0,0.1); transition: opacity 0.5s;';
    notif.textContent = msg;
    document.body.appendChild(notif);

    setTimeout(() => {
        notif.style.opacity = '0';
        setTimeout(() => notif.remove(), 500);
    }, 3000);
}

function loadContentFromServer() {
    // Try to load data.json which contains server-side edits
    fetch('data.json')
        .then(res => res.json())
        .then(data => {
            if (data.edits) {
                // Merge server edits into localStorage for continuity
                const localEdits = loadAllContent();

                if (data.edits.texts) {
                    Object.entries(data.edits.texts).forEach(([path, content]) => {
                        if (!localEdits[path]) localEdits[path] = { type: 'text', content: content };
                    });
                }

                if (data.edits.images) {
                    Object.entries(data.edits.images).forEach(([path, src]) => {
                        if (!localEdits[path]) {
                            // Determine if it was a bg or src
                            const el = document.querySelector(path);
                            const type = el && el.tagName === 'IMG' ? 'src' : 'bg';
                            localEdits[path] = { type: type, content: src };
                        }
                    });
                }

                localStorage.setItem('site-content-edits', JSON.stringify(localEdits));

                // Dimensions
                if (data.edits.dimensions) {
                    const localDims = JSON.parse(localStorage.getItem('site-element-dimensions') || '{}');
                    const mergedDims = { ...data.edits.dimensions, ...localDims };
                    localStorage.setItem('site-element-dimensions', JSON.stringify(mergedDims));
                }

                // NEW: Load Typography
                const config = data.layoutConfig || {};
                if (config.typography && config.typography.body) {
                    applyFont(config.typography.body);
                }

                // NEW: Load Animations
                const animationsEnabled = config.animations !== undefined ? config.animations : (data.edits && data.edits.animations);
                if (animationsEnabled !== undefined) {
                    applyAnimations(animationsEnabled);
                    const animToggle = document.getElementById('anim-toggle');
                    if (animToggle) animToggle.checked = animationsEnabled;
                }

                // NEW: Load WhatsApp Settings
                if (config.whatsapp) {
                    const welcomeInput = document.getElementById('wa-welcome-input');
                    const prefillInput = document.getElementById('wa-prefill-input');
                    if (welcomeInput) welcomeInput.value = config.whatsapp.welcomeMessage || '';
                    if (prefillInput) prefillInput.value = config.whatsapp.prefillText || '';
                }

                // NEW: Load SEO Settings
                if (config.seo) {
                    const titleInput = document.getElementById('seo-title-input');
                    const descInput = document.getElementById('seo-desc-input');
                    const ogInput = document.getElementById('seo-og-input');
                    if (titleInput) titleInput.value = config.seo.title || '';
                    if (descInput) descInput.value = config.seo.description || '';
                    if (ogInput) ogInput.value = config.seo.ogImage || '';
                }

                // NEW: Load Pop-up Settings
                if (config.popup) {
                    const enabledInput = document.getElementById('popup-enabled-input');
                    const titleInput = document.getElementById('popup-title-input');
                    const descInput = document.getElementById('popup-message-input');
                    const btnInput = document.getElementById('popup-btn-input');
                    const linkInput = document.getElementById('popup-link-input');
                    const triggerInput = document.getElementById('popup-trigger-input');

                    if (enabledInput) enabledInput.checked = config.popup.enabled || false;
                    if (titleInput) titleInput.value = config.popup.title || '';
                    if (descInput) descInput.value = config.popup.message || '';
                    if (btnInput) btnInput.value = config.popup.btnText || '';
                    if (linkInput) linkInput.value = config.popup.link || '';
                    if (triggerInput) triggerInput.value = config.popup.trigger || 'timer';
                }

                // NEW: Load Layout Settings
                const headerInput = document.getElementById('header-variation-input');
                const footerInput = document.getElementById('footer-variation-input');
                if (headerInput && config.header) headerInput.value = config.header.header || 'header-1';
                if (footerInput && config.footer) footerInput.value = config.footer.footer || 'footer-1';

                // NEW: Load Translations
                if (config.translations && config.translations.en) {
                    const en = config.translations.en;
                    if (document.getElementById('lang-en-title')) document.getElementById('lang-en-title').value = en.title || '';
                    if (document.getElementById('lang-en-tagline')) document.getElementById('lang-en-tagline').value = en.tagline || '';
                    if (document.getElementById('lang-en-description')) document.getElementById('lang-en-description').value = en.description || '';
                    if (document.getElementById('lang-en-services')) document.getElementById('lang-en-services').value = en.services || '';
                }
            }
            // Now apply everything
            loadContent();
        })
        .catch(err => {
            console.warn('Could not load data.json, using local storage only', err);
            loadContent();
        });
}

function initExportActions() {
    const publishContent = document.getElementById('publish-dynamic-content');
    if (!publishContent) return;

    const exportActions = document.createElement('div');
    exportActions.className = 'cp-publish-actions';
    exportActions.innerHTML = `
        <div class="cp-publish-item">
            <button id="btn-export-zip" class="btn btn-primary btn-block">
                <span class="icon">📦</span> Sitemi İndir (ZIP)
            </button>
            <p class="cp-tips">Sitenizi tüm dosyalarıyla birlikte bilgisayarınıza indirin.</p>
        </div>
        <div class="cp-publish-item">
            <button id="btn-deploy-vercel" class="btn btn-dark btn-block">
                <span class="icon">▲</span> Vercel ile Yayınla
            </button>
            <p class="cp-tips">Tek tıkla ücretsiz bir adreste canlıya alın.</p>
        </div>
        <div class="cp-publish-item">
            <button id="btn-logout" class="btn btn-outline-danger btn-block">
                <span class="icon">🚪</span> Siteden Çıkış Yap
            </button>
            <p class="cp-tips">Editör oturumunuzu kapatın.</p>
        </div>
    `;

    publishContent.appendChild(exportActions);

    const deployBtn = document.getElementById('btn-deploy-vercel');
    if (deployBtn) {
        deployBtn.onclick = () => startVercelDeployment();
    }

    const zipBtn = document.getElementById('btn-export-zip');
    if (zipBtn) {
        zipBtn.onclick = async () => {
            zipBtn.disabled = true;
            zipBtn.innerHTML = '<span class="icon">⌛</span> Güncelleniyor...';
            showNotification('Son değişiklikler kaydediliyor...', 'info');

            await forceSyncAllToServer();

            showNotification('ZIP dosyası hazırlanıyor...', 'info');
            fetch(`../../api/export.php?slug=${window.SITE_SLUG}`)
                .then(res => res.json())
                .then(data => {
                    zipBtn.disabled = false;
                    zipBtn.innerHTML = '<span class="icon">📦</span> Sitemi İndir (ZIP)';
                    if (data.success) {
                        window.location.href = `../../${data.downloadUrl}`;
                        showNotification('İndirme başlatıldı!');
                    } else {
                        alert('Hata: ' + data.message);
                    }
                })
                .catch(err => {
                    zipBtn.disabled = false;
                    zipBtn.innerHTML = '<span class="icon">📦</span> Sitemi İndir (ZIP)';
                    console.error('Export failed', err);
                });
        };
    }

    const logoutBtn = document.getElementById('btn-logout');
    if (logoutBtn) {
        logoutBtn.onclick = () => {
            if (confirm('Oturumu kapatmak istediğinize emin misiniz?')) {
                fetch('../../api/logout.php')
                    .then(res => res.json())
                    .then(data => {
                        if (data.success) {
                            location.reload();
                        } else {
                            alert('Çıkış yapılamadı.');
                        }
                    })
                    .catch(err => console.error('Logout failed', err));
            }
        };
    }

    // Add Styles
    if (!document.getElementById('publish-actions-styles')) {
        const style = document.createElement('style');
        style.id = 'publish-actions-styles';
        style.textContent = `
            .cp-publish-actions {
                display: flex;
                flex-direction: column;
                gap: 20px;
                margin-top: 20px;
            }
            .cp-publish-item { text-align: center; }
            .cp-publish-item .btn {
                width: 100%;
                padding: 10px 15px;
                border-radius: 8px;
                font-size: 14px;
                font-weight: 600;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                cursor: pointer;
                transition: all 0.2s;
            }
            .btn-primary { background: var(--color-primary); color: white; border: 1px solid var(--color-primary); }
            .btn-dark { background: #1a1a1a; color: white; border: none; }
            .btn-outline-danger { background: transparent; color: #dc3545; border: 1px solid #dc3545; }
            .cp-tips { font-size: 11px; color: #999; margin-top: 8px; }
        `;
        document.head.appendChild(style);
    }
}

async function startVercelDeployment() {
    const overlay = document.createElement('div');
    overlay.className = 'deploy-overlay';
    overlay.style = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.85); z-index:20000; display:flex; flex-direction:column; align-items:center; justify-content:center; color:white; font-family:Inter, sans-serif; backdrop-filter:blur(10px);';

    overlay.innerHTML = `
        <div style="width:350px; text-align:center;">
            <div class="deploy-spinner" style="width:60px; height:60px; border:4px solid rgba(255,255,255,0.1); border-top:4px solid #fff; border-radius:50%; margin:0 auto 20px; animation: spin 1s linear infinite;"></div>
            <h3 id="deploy-status" style="margin-bottom:10px; font-weight:600;">Site Hazırlanıyor...</h3>
            <div style="width:100%; height:8px; background:rgba(255,255,255,0.1); border-radius:4px; overflow:hidden; margin-bottom:20px;">
                <div id="deploy-progress" style="width:0%; height:100%; background:linear-gradient(90deg, #00c6ff 0%, #0072ff 100%); transition: width 0.3s;"></div>
            </div>
            <p id="deploy-step" style="font-size:14px; color:#aaa;">Veriler paketleniyor...</p>
        </div>
        <style>
            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        </style>
    `;

    document.body.appendChild(overlay);

    const progress = document.getElementById('deploy-progress');
    const status = document.getElementById('deploy-status');
    const step = document.getElementById('deploy-step');

    // 1. Force Sync to Server first!
    status.innerText = 'Değişiklikler Kaydediliyor...';
    step.innerText = 'En son ayarlarınız (Renk, Metin, Seçenekler) bütünleştiriliyor...';
    progress.style.width = '10%';

    await forceSyncAllToServer();

    // 2. Deployment Steps
    const steps = [
        { p: 30, s: 'Dosyalar Okunuyor...', m: 'Klasörler taranıyor...' },
        { p: 55, s: 'Görseller Optimize Ediliyor...', m: 'Vercel Edge ağına hazırlanıyor...' },
        { p: 85, s: 'API İletişimi...', m: 'Vercel sunucusundan yanıt bekleniyor (zaman alabilir)...' }
    ];

    let currentIdx = 0;
    const interval = setInterval(() => {
        if (currentIdx < steps.length) {
            const item = steps[currentIdx];
            progress.style.width = item.p + '%';
            status.innerText = item.s;
            step.innerText = item.m;
            currentIdx++;
        }
    }, 1500);

    try {
        const response = await fetch(`../../api/deploy-vercel.php?slug=${window.SITE_SLUG}`);
        const result = await response.json();

        clearInterval(interval);

        if (result.success) {
            progress.style.width = '100%';
            status.innerText = 'Canlıya Alındı!';
            step.innerText = 'İşlem tamamlanıyor...';

            setTimeout(() => {
                const generatedDomain = result.url;

                overlay.innerHTML = `
                    <div style="width:400px; text-align:center; background:white; color:#333; padding:40px; border-radius:20px; box-shadow:0 20px 40px rgba(0,0,0,0.2);">
                        <div style="width:80px; height:80px; background:#4BB543; color:white; border-radius:50%; display:flex; align-items:center; justify-content:center; margin:0 auto 20px; font-size:40px;">✓</div>
                        <h2 style="margin-bottom:10px;">Harika! Siteniz Yayında</h2>
                        <p style="color:#666; margin-bottom:15px; font-size:15px;">Vercel üzerinden gerçek yayınlama işlemi tamamlandı.</p>
                        <p style="color:#2563eb; margin-bottom:25px; font-weight:600;"><a href="${generatedDomain}" target="_blank" style="color:inherit; text-decoration:none;">${generatedDomain}</a></p>
                        <button id="close-deploy-success" style="width:100%; padding:15px; background:#333; color:white; border:none; border-radius:10px; cursor:pointer; font-weight:600; font-size:16px;">Tamamla ve Dekont İndir</button>
                    </div>
                `;
                document.getElementById('close-deploy-success').onclick = () => {
                    overlay.remove();
                    window.open(generatedDomain, '_blank');
                    generatePDFReceipt(generatedDomain);
                };
            }, 800);
        } else {
            if (result.error === 'API_KEY_MISSING') {
                overlay.innerHTML = `
                    <div style="width:400px; text-align:center; background:white; color:#333; padding:40px; border-radius:20px;">
                        <div style="width:80px; height:80px; background:#f59e0b; color:white; border-radius:50%; display:flex; align-items:center; justify-content:center; margin:0 auto 20px; font-size:40px;">!</div>
                        <h2 style="margin-bottom:10px;">Vercel Hesabı Gerekli</h2>
                        <p style="color:#666; margin-bottom:20px; font-size:14px; text-align:left;">
                            Gerçek ve ücretsiz yayınlama yapabilmek için kendi Vercel hesabınızın <b>Access Token</b> değerini sisteme tanımlamalısınız.<br><br>
                            1. <a href="https://vercel.com/account/tokens" target="_blank" style="color:#2563eb;">vercel.com/account/tokens</a> adresine gidin.<br>
                            2. Yeni bir "Token" oluşturun.<br>
                            3. Bu token'ı <code>sitebuilder/api/deploy-vercel.php</code> dosyasındaki <code>$VERCEL_TOKEN</code> alanına yapıştırın.
                        </p>
                        <button id="close-deploy-error" style="width:100%; padding:15px; background:#333; color:white; border:none; border-radius:10px; cursor:pointer; font-weight:600;">Kapat</button>
                    </div>
                `;
                document.getElementById('close-deploy-error').onclick = () => overlay.remove();
            } else {
                overlay.innerHTML = `
                    <div style="width:400px; text-align:center; background:white; color:#333; padding:40px; border-radius:20px;">
                        <div style="width:80px; height:80px; background:#ef4444; color:white; border-radius:50%; display:flex; align-items:center; justify-content:center; margin:0 auto 20px; font-size:40px;">✕</div>
                        <h2 style="margin-bottom:10px;">Yayınlama Başarısız</h2>
                        <p style="color:#666; margin-bottom:30px; font-size:15px;">Hata: ${result.error || 'Bilinmeyen Hata'}</p>
                        <button id="close-deploy-error" style="width:100%; padding:15px; background:#333; color:white; border:none; border-radius:10px; cursor:pointer; font-weight:600;">Kapat</button>
                    </div>
                `;
                document.getElementById('close-deploy-error').onclick = () => overlay.remove();
            }
        }
    } catch (err) {
        clearInterval(interval);
        overlay.innerHTML = `
            <div style="width:400px; text-align:center; background:white; color:#333; padding:40px; border-radius:20px;">
                <div style="width:80px; height:80px; background:#ef4444; color:white; border-radius:50%; display:flex; align-items:center; justify-content:center; margin:0 auto 20px; font-size:40px;">✕</div>
                <h2 style="margin-bottom:10px;">Bağlantı Hatası</h2>
                <p style="color:#666; margin-bottom:30px; font-size:15px;">Sunucuya (deploy API) ulaşılamadı. Lütfen internet bağlantınızı kontrol edin.</p>
                <button id="close-deploy-error" style="width:100%; padding:15px; background:#333; color:white; border:none; border-radius:10px; cursor:pointer;">Kapat</button>
            </div>
        `;
        document.getElementById('close-deploy-error').onclick = () => overlay.remove();
    }
}

function generatePDFReceipt(domainUrl = '') {
    const receiptContainer = document.createElement('div');
    receiptContainer.style = 'position:fixed; left:-9999px; top:0; width:600px; padding:40px; background:white; font-family: "Helvetica", sans-serif; color: #1a1a1a;';

    const refNo = 'VC-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    const date = new Date().toLocaleString('tr-TR');

    receiptContainer.innerHTML = `
        <div style="border-bottom: 3px solid #000; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: center;">
            <h1 style="margin:0; font-size: 24px;">YAYINLAMA DEKONTU</h1>
            <div style="text-align: right;">
                <p style="margin:0; font-weight: bold;">REF: ${refNo}</p>
            </div>
        </div>
        <div style="margin-bottom: 30px;">
            <p><strong>Site Adı:</strong> ${window.SITE_SLUG || 'Proje'}</p>
            <p><strong>Domain:</strong> <a href="${domainUrl}" style="color:#2563eb; text-decoration:none;">${domainUrl}</a></p>
            <p><strong>Platform:</strong> Vercel Cloud</p>
            <p><strong>Tarih:</strong> ${date}</p>
            <p><strong>Durum:</strong> Başarıyla Tamamlandı</p>
        </div>
        <div style="background:#f5f5f5; padding:20px; border-radius:5px;">
            <p style="margin:0; font-size:12px;">Siteniz küresel sunucularda aktif edilmiştir. Bu döküman resmi işlem dekontudur.</p>
        </div>
    `;

    document.body.appendChild(receiptContainer);

    setTimeout(() => {
        html2canvas(receiptContainer, { scale: 2 }).then(canvas => {
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgData = canvas.toDataURL('image/png');
            pdf.addImage(imgData, 'PNG', 0, 0, 210, (canvas.height * 210) / canvas.width);
            pdf.save(`dekont_${window.SITE_SLUG}.pdf`);
            document.body.removeChild(receiptContainer);
            showNotification('Dekont indirildi.');
        });
    }, 500);
}

function initBlockManager() {
    const cpContent = document.querySelector('.cp-content');
    if (!cpContent) return;

    // Create Block Manager Group
    const blockGroup = document.createElement('div');
    blockGroup.className = 'cp-group';
    blockGroup.id = 'block-manager-group';
    blockGroup.innerHTML = `
        <label>Blok Yönetimi (Sürükle - Bırak)</label>
        <div id="block-list" class="block-list">
            <!-- Blocks will be injected here -->
        </div>
        <small class="cp-tips">Anasayfa bloklarını sürükleyerek sıralayın.</small>
    `;

    // Insert after hero bg group if it exists
    const heroBg = document.getElementById('hero-bg-group');
    if (heroBg) {
        heroBg.after(blockGroup);
    } else {
        cpContent.prepend(blockGroup);
    }

    // Add Styles
    if (!document.getElementById('block-manager-styles')) {
        const style = document.createElement('style');
        style.id = 'block-manager-styles';
        style.textContent = `
            .block-list {
                display: flex;
                flex-direction: column;
                gap: 8px;
                margin-top: 10px;
            }
            .block-item {
                display: flex;
                align-items: center;
                background: #f1f5f9;
                padding: 10px 12px;
                border-radius: 8px;
                cursor: grab;
                font-size: 13px;
                font-weight: 500;
                color: #334155;
                border: 1px solid #e2e8f0;
                transition: all 0.2s;
                user-select: none;
            }
            .block-item:hover { background: #e2e8f0; }
            .block-item.dragging { opacity: 0.5; background: var(--color-primary); color: white; }
            .block-item::before { content: "⋮⋮"; margin-right: 10px; color: #94a3b8; font-size: 16px; }
            .block-item[data-type="hero"] { border-left: 4px solid #3b82f6; }
            .block-item[data-type="about"] { border-left: 4px solid #10b981; }
            .block-item[data-type="services"] { border-left: 4px solid #f59e0b; }
            .block-item[data-type="gallery"] { border-left: 4px solid #ec4899; }
            .block-item[data-type="contact"] { border-left: 4px solid #ef4444; }
        `;
        document.head.appendChild(style);
    }

    refreshBlockList();
}

function refreshBlockList() {
    const blockList = document.getElementById('block-list');
    if (!blockList) return;

    // Detect sections on page
    const sections = Array.from(document.querySelectorAll('[data-section-type]:not([data-section-type="header"]):not([data-section-type="footer"])'));

    blockList.innerHTML = '';

    const blockNames = {
        'hero': 'Giriş (Hero)',
        'about': 'Hakkımızda',
        'services': 'Hizmetler',
        'gallery': 'Galeri',
        'contact': 'İletişim'
    };

    sections.forEach(sec => {
        const type = sec.dataset.sectionType;
        const item = document.createElement('div');
        item.className = 'block-item';
        item.draggable = true;
        item.dataset.type = type;
        item.dataset.id = sec.dataset.variationId;
        item.textContent = blockNames[type] || type.charAt(0).toUpperCase() + type.slice(1);

        // Drag events
        item.addEventListener('dragstart', () => item.classList.add('dragging'));
        item.addEventListener('dragend', () => {
            item.classList.remove('dragging');
            updateBlockOrderOnPage();
        });

        blockList.appendChild(item);
    });

    blockList.addEventListener('dragover', e => {
        e.preventDefault();
        const afterElement = getDragAfterElement(blockList, e.clientY);
        const dragging = document.querySelector('.dragging');
        if (afterElement == null) {
            blockList.appendChild(dragging);
        } else {
            blockList.insertBefore(dragging, afterElement);
        }
    });
}

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.block-item:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function updateBlockOrderOnPage() {
    const blockItems = Array.from(document.querySelectorAll('.block-item'));
    const newOrder = blockItems.map(item => item.dataset.type);

    // Sort sections in DOM
    const container = document.body;
    const footer = document.querySelector('.footer');
    const whatsapp = document.querySelector('.whatsapp-float');
    const scripts = document.querySelectorAll('script');

    newOrder.forEach(type => {
        const section = document.querySelector(`[data-section-type="${type}"]`);
        if (section) {
            if (type === 'header') {
                container.prepend(section);
            } else if (footer) {
                container.insertBefore(section, footer);
            } else {
                container.appendChild(section);
            }
        }
    });

    // Save to server
    syncBlocksToServer(newOrder);
}

function syncBlocksToServer(order) {
    // Save to local storage first
    localStorage.setItem('site-block-order', JSON.stringify(order));

    // Sync with server
    if (window.syncTimeout) clearTimeout(window.syncTimeout);

    window.syncTimeout = setTimeout(() => {
        fetch('../../api/save-content.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                slug: window.SITE_SLUG,
                edits: {
                    blockOrder: order
                }
            })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    showNotification('Blok sıralaması güncellendi');
                }
            })
            .catch(err => console.error('Block sync failed', err));
    }, 2000);
}

function initAnimationToggle() {
    const cpContent = document.querySelector('.cp-content');
    if (!cpContent) return;

    // Create Animation Group
    const animGroup = document.createElement('div');
    animGroup.className = 'cp-group';
    animGroup.id = 'animation-group';
    animGroup.innerHTML = `
        <label>Sayfa Animasyonları</label>
        <div class="toggle-wrapper">
            <input type="checkbox" id="anim-toggle">
            <span>Kaydırma Efektlerini Aktif Et</span>
        </div>
        <small class="cp-tips">Ziyaretçiler sayfayı aşağı kaydırdıkça bölümler yumuşak bir şekilde belirir.</small>
    `;

    // Insert before block manager
    const blockManager = document.getElementById('block-manager-group');
    if (blockManager) {
        blockManager.before(animGroup);
    } else {
        cpContent.prepend(animGroup);
    }

    // Add Styles
    if (!document.getElementById('animation-toggle-styles')) {
        const style = document.createElement('style');
        style.id = 'animation-toggle-styles';
        style.textContent = `
            .toggle-wrapper { display: flex; align-items: center; gap: 10px; margin-top: 10px; }
            .toggle-wrapper input[type="checkbox"] { width: auto; cursor: pointer; }
            .toggle-wrapper span { font-size: 13px; font-weight: 500; }
        `;
        document.head.appendChild(style);
    }

    const toggle = document.getElementById('anim-toggle');

    // Check initial state
    const sections = document.querySelectorAll('[data-section-type]');
    const hasAnims = Array.from(sections).some(s => s.classList.contains('reveal-on-scroll'));
    toggle.checked = hasAnims;

    toggle.onchange = (e) => {
        applyAnimations(e.target.checked);
        syncAnimationsToServer(e.target.checked);
    };
}

function applyAnimations(enabled) {
    const sections = document.querySelectorAll('[data-section-type]');
    sections.forEach(sec => {
        if (enabled) {
            sec.classList.add('reveal-on-scroll', 'reveal-fade-up');
            // Remove active to allow re-triggering of animation
            sec.classList.remove('active');
        } else {
            sec.classList.remove('reveal-on-scroll', 'reveal-fade-up', 'active');
        }
    });

    // Refresh the animation observer in script.js
    if (typeof window.refreshAnimations === 'function') {
        window.refreshAnimations();
    }
}

function syncAnimationsToServer(enabled) {
    if (window.syncTimeout) clearTimeout(window.syncTimeout);

    window.syncTimeout = setTimeout(() => {
        fetch('../../api/save-content.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                slug: window.SITE_SLUG,
                edits: {
                    animations: enabled
                }
            })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    showNotification(enabled ? 'Animasyonlar aktif edildi' : 'Animasyonlar devre dışı bırakıldı');
                }
            })
            .catch(err => console.error('Animation sync failed', err));
    }, 2000);
}

function initFontSelector() {
    const cpContent = document.querySelector('.cp-content');
    if (!cpContent) return;

    // Create Font Group
    const fontGroup = document.createElement('div');
    fontGroup.className = 'cp-group';
    fontGroup.id = 'font-group';
    fontGroup.innerHTML = `
        <label>Yazı Tipi (Typography)</label>
        <div class="input-wrapper">
            <select id="font-select">
                <option value="Inter, sans-serif">Inter (Modern & Temiz)</option>
                <option value="'Outfit', sans-serif">Outfit (Premium & Yuvarlak)</option>
                <option value="'Roboto', sans-serif">Roboto (Klasik & Güvenilir)</option>
                <option value="'Playfair Display', serif">Playfair (Zarif & Klasik)</option>
                <option value="'Montserrat', sans-serif">Montserrat (Güçlü & Geometrik)</option>
            </select>
        </div>
        <small class="cp-tips">Sitenizin karakterini belirleyen yazı tipini seçin.</small>
    `;

    // Insert before animation group
    const animGroup = document.getElementById('animation-group');
    if (animGroup) {
        animGroup.before(fontGroup);
    } else {
        cpContent.prepend(fontGroup);
    }

    // Add Styles
    if (!document.getElementById('font-selector-styles')) {
        const style = document.createElement('style');
        style.id = 'font-selector-styles';
        style.textContent = `
            .input-wrapper { margin-top: 10px; }
            .input-wrapper select { width: 100%; padding: 8px; border-radius: 6px; border: 1px solid #e2e8f0; font-size: 13px; }
        `;
        document.head.appendChild(style);
    }

    const select = document.getElementById('font-select');

    // Set initial value
    const currentFont = getComputedStyle(document.body).fontFamily;
    // Simple matching (first part)
    const options = Array.from(select.options);
    const matched = options.find(opt => currentFont.includes(opt.value.split(',')[0].replace(/'/g, "")));
    if (matched) select.value = matched.value;

    select.onchange = (e) => {
        applyFont(e.target.value);
        syncTypographyToServer(e.target.value);
    };
}

function applyFont(font) {
    document.body.style.setProperty('--font-body', font);
    document.body.style.setProperty('--font-heading', font);
}

function syncTypographyToServer(font) {
    if (window.syncTimeout) clearTimeout(window.syncTimeout);

    window.syncTimeout = setTimeout(() => {
        fetch('../../api/save-content.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                slug: window.SITE_SLUG,
                edits: {
                    typography: {
                        body: font,
                        heading: font
                    }
                }
            })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    showNotification('Yazı tipi güncellendi');
                }
            })
            .catch(err => console.error('Typography sync failed', err));
    }, 2000);
}
function initWhatsAppSettings() {
    const featuresContent = document.getElementById('features-dynamic-content');
    if (!featuresContent) return;

    const waCard = document.createElement('div');
    waCard.className = 'cp-card';
    waCard.id = 'wa-card';
    waCard.innerHTML = `
        <h4><span class="icon">💬</span> WhatsApp Pro</h4>
        <div class="cp-group">
            <label>Karşılama Mesajı</label>
            <input type="text" id="wa-welcome-input" placeholder="Size nasıl yardımcı olabiliriz?">
        </div>
        <div class="cp-group">
            <label>Hazır Mesaj (Ziyaretçinin Yazacağı)</label>
            <input type="text" id="wa-prefill-input" placeholder="Merhaba, bilgi almak istiyorum.">
        </div>
        <small class="cp-tips">WhatsApp balonundaki metinleri özelleştirin.</small>
    `;

    featuresContent.appendChild(waCard);

    const welcomeInput = document.getElementById('wa-welcome-input');
    const prefillInput = document.getElementById('wa-prefill-input');

    const handleSync = () => {
        syncWhatsAppToServer({
            welcomeMessage: welcomeInput.value,
            prefillText: prefillInput.value
        });
    }

    welcomeInput.oninput = () => {
        const msgEl = document.querySelector('#wa-popup .wa-msg p');
        if (msgEl) msgEl.textContent = welcomeInput.value;
        handleSync();
    };
    prefillInput.oninput = () => {
        const linkEl = document.querySelector('#wa-popup .wa-footer a');
        if (linkEl) {
            const baseUrl = linkEl.href.split('?text=')[0];
            linkEl.href = `${baseUrl}?text=${encodeURIComponent(prefillInput.value)}`;
        }
        handleSync();
    };
}

function syncWhatsAppToServer(config) {
    if (window.syncTimeout) clearTimeout(window.syncTimeout);

    window.syncTimeout = setTimeout(() => {
        fetch('../../api/save-content.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                slug: window.SITE_SLUG,
                edits: {
                    whatsapp: config
                }
            })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    showNotification('WhatsApp ayarları güncellendi');
                }
            })
            .catch(err => console.error('WhatsApp sync failed', err));
    }, 2000);
}

function initSEOPanel() {
    const featuresContent = document.getElementById('features-dynamic-content');
    if (!featuresContent) return;

    const seoCard = document.createElement('div');
    seoCard.className = 'cp-card';
    seoCard.id = 'seo-card';
    seoCard.innerHTML = `
        <h4><span class="icon">🔍</span> SEO & Sosyal Medya</h4>
        <div class="cp-group">
            <label>Sayfa Başlığı (SEO Title)</label>
            <input type="text" id="seo-title-input" placeholder="Site Başlığı">
        </div>
        <div class="cp-group">
            <label>Meta Açıklama</label>
            <textarea id="seo-desc-input" placeholder="Sitenizi kısaca tanımlayın..." rows="3"></textarea>
        </div>
        <div class="cp-group">
            <label>Paylaşım Görseli (URL)</label>
            <input type="text" id="seo-og-input" placeholder="https://...">
        </div>
        <small class="cp-tips">Arama motorları ve sosyal paylaşımlar için ayarlar.</small>
    `;

    featuresContent.appendChild(seoCard);

    const titleInput = document.getElementById('seo-title-input');
    const descInput = document.getElementById('seo-desc-input');
    const ogInput = document.getElementById('seo-og-input');

    const handleSync = () => {
        syncSEOToServer({
            title: titleInput.value,
            description: descInput.value,
            ogImage: ogInput.value
        });
    }

    titleInput.oninput = () => {
        document.title = titleInput.value;
        handleSync();
    };
    descInput.oninput = handleSync;
    ogInput.oninput = handleSync;
}

function syncSEOToServer(config) {
    if (window.syncTimeout) clearTimeout(window.syncTimeout);

    window.syncTimeout = setTimeout(() => {
        fetch('../../api/save-content.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                slug: window.SITE_SLUG,
                edits: {
                    seo: config
                }
            })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    showNotification('SEO ayarları güncellendi');
                }
            })
            .catch(err => console.error('SEO sync failed', err));
    }, 2000);
}

function initPopupPanel() {
    const featuresContent = document.getElementById('features-dynamic-content');
    if (!featuresContent) return;

    const popupCard = document.createElement('div');
    popupCard.className = 'cp-card';
    popupCard.id = 'popup-card';
    popupCard.innerHTML = `
        <h4><span class="icon">🎁</span> Kampanya Pop-up</h4>
        <div class="cp-group">
            <label class="switch-label">
                <span>Pop-up Aktif</span>
                <input type="checkbox" id="popup-enabled-input">
            </label>
        </div>
        <div class="cp-group">
            <label>Başlık</label>
            <input type="text" id="popup-title-input" placeholder="Örn: Özel İndirim!">
        </div>
        <div class="cp-group">
            <label>Açıklama</label>
            <textarea id="popup-message-input" placeholder="Kampanya detaylarını yazın..." rows="2"></textarea>
        </div>
        <div class="cp-group">
            <label>Buton Yazısı</label>
            <input type="text" id="popup-btn-input" placeholder="Hemen İncele">
        </div>
        <div class="cp-group">
            <label>Link (Buton Tıklaması)</label>
            <input type="text" id="popup-link-input" placeholder="https://urun-linki.com">
        </div>
        <div class="cp-group">
            <label>Tetikleyici</label>
            <select id="popup-trigger-input">
                <option value="timer">Süreli (Zaman Ayarlı)</option>
                <option value="exit-intent">Çıkış Niyeti (Exit Intent)</option>
            </select>
        </div>
        <small class="cp-tips">Ziyaretçilere otomatik kampanya penceresi gösterin.</small>
    `;

    featuresContent.appendChild(popupCard);

    const elements = {
        enabled: document.getElementById('popup-enabled-input'),
        title: document.getElementById('popup-title-input'),
        message: document.getElementById('popup-message-input'),
        btn: document.getElementById('popup-btn-input'),
        link: document.getElementById('popup-link-input'),
        trigger: document.getElementById('popup-trigger-input')
    };

    const handleSync = () => {
        syncPopupToServer({
            enabled: elements.enabled.checked,
            title: elements.title.value,
            message: elements.message.value,
            btnText: elements.btn.value,
            link: elements.link.value,
            trigger: elements.trigger.value
        });
    }

    const updatePopupDOM = () => {
        const popup = document.getElementById('site-popup');
        if (!popup) return;

        if (elements.enabled.checked) popup.classList.add('active');
        else popup.classList.remove('active');

        const title = popup.querySelector('h2');
        if (title) title.textContent = elements.title.value;

        const msg = popup.querySelector('p');
        if (msg) msg.textContent = elements.message.value;

        const btn = popup.querySelector('.popup-btn');
        if (btn) {
            btn.textContent = elements.btn.value;
            btn.href = elements.link.value;
        }
    };

    Object.values(elements).forEach(el => {
        const originalHandler = (el.type === 'checkbox' || el.tagName === 'SELECT') ? 'onchange' : 'oninput';
        el[originalHandler] = () => {
            updatePopupDOM();
            handleSync();
        };
    });
}

function syncPopupToServer(config) {
    if (window.syncTimeout) clearTimeout(window.syncTimeout);

    window.syncTimeout = setTimeout(() => {
        fetch('../../api/save-content.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                slug: window.SITE_SLUG,
                edits: {
                    popup: config
                }
            })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    showNotification('Pop-up ayarları güncellendi');
                }
            })
            .catch(err => console.error('Pop-up sync failed', err));
    }, 2000);
}

async function initLayoutSettings() {
    const designContent = document.getElementById('tab-design');
    if (!designContent) return;

    const layoutCard = document.createElement('div');
    layoutCard.className = 'cp-card';
    layoutCard.id = 'layout-card';
    layoutCard.innerHTML = `
        <h4><span class="icon">📐</span> Tasarım & Varyasyonlar</h4>
        <div id="variation-selectors">
            <div class="cp-loading-small" style="text-align:center; padding:10px;">Varyasyonlar yükleniyor...</div>
        </div>
        <small class="cp-tips">Her bölümün tasarımını buradan tek tek değiştirebilirsiniz.</small>
    `;

    designContent.appendChild(layoutCard);

    const selectorContainer = document.getElementById('variation-selectors');
    const sections = document.querySelectorAll('[data-section-type]');
    const response = await fetch('../../api/variations.php');
    const variationsMap = await response.json();

    selectorContainer.innerHTML = '';

    const sectionNames = {
        'header': 'Üst Menü (Header)',
        'footer': 'Alt Bilgi (Footer)',
        'hero': 'Giriş (Hero)',
        'about': 'Hakkımızda',
        'services': 'Hizmetler',
        'gallery': 'Galeri',
        'contact': 'İletişim'
    };

    const processedTypes = new Set();

    sections.forEach(section => {
        const type = section.dataset.sectionType;
        if (processedTypes.has(type)) return;
        processedTypes.add(type);

        const currentId = section.dataset.variationId;
        const typeVariations = variationsMap[type];

        if (!typeVariations || typeVariations.length <= 1) return;

        const group = document.createElement('div');
        group.className = 'cp-group';
        group.style.marginBottom = '15px';

        const label = document.createElement('label');
        label.textContent = sectionNames[type] || type.toUpperCase();

        const select = document.createElement('select');
        select.style.width = '100%';
        select.style.padding = '8px';
        select.style.borderRadius = '6px';
        select.style.border = '1px solid #e2e8f0';
        select.style.fontSize = '13px';

        typeVariations.forEach(v => {
            const opt = document.createElement('option');
            opt.value = v.id;
            opt.textContent = v.description || v.id;
            if (v.id === currentId) opt.selected = true;
            select.appendChild(opt);
        });

        select.onchange = (e) => {
            const currentSection = document.querySelector(`[data-section-type="${type}"]`);
            if (window.switchVariation && currentSection) {
                window.switchVariation(currentSection, type, typeVariations, typeVariations.findIndex(v => v.id === e.target.value));

                // Important: Re-initialize features AND the block manager list
                setTimeout(() => {
                    if (window.initAllSiteFeatures) window.initAllSiteFeatures();
                    initBlockManager();
                }, 100);
            } else {
                // Fallback to direct sync
                syncLayoutToServer({ [type]: e.target.value });
            }
        };

        group.appendChild(label);
        group.appendChild(select);
        selectorContainer.appendChild(group);
    });
}

function syncLayoutToServer(config) {
    if (window.syncTimeout) clearTimeout(window.syncTimeout);

    window.syncTimeout = setTimeout(() => {
        fetch('../../api/save-content.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                slug: window.SITE_SLUG,
                edits: {
                    header: { header: config.header },
                    footer: { footer: config.footer }
                }
            })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    showNotification('Yerleşim ayarları güncellendi');
                }
            })
            .catch(err => console.error('Layout sync failed', err));
    }, 2000);
}

function initLanguagePanel() {
    const featuresContent = document.getElementById('features-dynamic-content');
    if (!featuresContent) return;

    const langCard = document.createElement('div');
    langCard.className = 'cp-card';
    langCard.id = 'language-card';
    langCard.innerHTML = `
        <h4><span class="icon">🌐</span> Çoklu Dil (İngilizce)</h4>
        <div class="cp-group">
            <label>İngilizce Site Başlığı</label>
            <input type="text" id="lang-en-title" placeholder="Business Name EN">
        </div>
        <div class="cp-group">
            <label>İngilizce Slogan</label>
            <input type="text" id="lang-en-tagline" placeholder="Professional Services">
        </div>
        <div class="cp-group">
            <label>İngilizce Açıklama</label>
            <textarea id="lang-en-description" placeholder="Short description in English..." rows="2"></textarea>
        </div>
        <div class="cp-group">
            <label>Hizmetler (Virgülle Ayırın)</label>
            <textarea id="lang-en-services" placeholder="Service 1, Service 2, Service 3" rows="2"></textarea>
        </div>
        <small class="cp-tips">Sitenizin İngilizce versiyonu için çevirileri girin.</small>
    `;

    featuresContent.appendChild(langCard);

    const elements = {
        title: document.getElementById('lang-en-title'),
        tagline: document.getElementById('lang-en-tagline'),
        description: document.getElementById('lang-en-description'),
        services: document.getElementById('lang-en-services')
    };

    const handleSync = () => {
        syncLanguageToServer({
            en: {
                title: elements.title.value,
                tagline: elements.tagline.value,
                description: elements.description.value,
                services: elements.services.value
            }
        });
    }

    Object.values(elements).forEach(el => {
        el.oninput = handleSync;
    });
}

function syncLanguageToServer(translations) {
    if (window.syncTimeout) clearTimeout(window.syncTimeout);

    window.syncTimeout = setTimeout(() => {
        fetch('../../api/save-content.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                slug: window.SITE_SLUG,
                edits: {
                    translations: translations
                }
            })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    showNotification('Çeviriler kaydedildi');
                }
            })
            .catch(err => console.error('Language sync failed', err));
    }, 2000);
}

// Authentication & Client Mode (Pro)
function initAuth() {
    fetch(`../../api/check-auth.php?slug=${window.SITE_SLUG}`)
        .then(res => res.json())
        .then(data => {
            if (data.authenticated) {
                USER_ROLE = data.role;
                if (USER_ROLE === 'client') {
                    applyClientRestrictions();
                }
            } else {
                showLoginModal();
            }
        });
}

function showLoginModal() {
    const overlay = document.createElement('div');
    overlay.className = 'auth-overlay';
    overlay.style = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); z-index:10000; display:flex; align-items:center; justify-content:center;';

    overlay.innerHTML = `
        <div style="background:white; padding:30px; border-radius:12px; width:350px; text-align:center;">
            <h3 style="margin-bottom:15px;">Site Editörüne Giriş</h3>
            <p style="font-size:13px; color:#666; margin-bottom:20px;">Lütfen erişim şifrenizi girin.</p>
            <input type="password" id="auth-password" placeholder="Şifre" style="width:100%; padding:12px; border:1px solid #ddd; border-radius:6px; margin-bottom:15px; font-size:16px;">
            <button id="auth-login-btn" style="width:100%; padding:12px; background:var(--color-primary, #007bff); color:white; border:none; border-radius:6px; cursor:pointer; font-weight:600;">Giriş Yap</button>
            <p id="auth-error" style="color:red; font-size:12px; margin-top:10px; display:none;">Hatalı şifre.</p>
        </div>
    `;

    document.body.appendChild(overlay);

    const loginBtn = document.getElementById('auth-login-btn');
    const passInput = document.getElementById('auth-password');
    const errMsg = document.getElementById('auth-error');

    loginBtn.onclick = () => {
        fetch('../../api/login.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                slug: window.SITE_SLUG,
                password: passInput.value
            })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    location.reload();
                } else {
                    errMsg.style.display = 'block';
                    passInput.value = '';
                }
            });
    };

    passInput.onkeydown = (e) => {
        if (e.key === 'Enter') loginBtn.click();
    };
}

function applyClientRestrictions() {
    const style = document.createElement('style');
    style.innerHTML = `
    /* Hide design groups in Client Mode */
    #color - settings - group,
        #font - settings - group,
        #animations - group,
        #layout - settings - group,
        #block - manager - group,
        .block - actions {
        display: none!important;
    }
        
        .cp - title { position: relative; }
        .cp - title::after {
        content: ' (Kısıtlı Mod)';
        font - size: 10px;
        background: #eee;
        padding: 2px 6px;
        border - radius: 4px;
        display: inline - block;
        margin - left: 5px;
    }
    `;
    document.head.appendChild(style);

    // Disable variation switcher click
    document.addEventListener('click', (e) => {
        if (USER_ROLE === 'client' && e.target.closest('[data-section-type]')) {
            // Prevent design switch but allow text edit
            if (!e.target.isContentEditable && e.target.tagName !== 'IMG') {
                // Nothing
            }
        }
    }, true);
}

