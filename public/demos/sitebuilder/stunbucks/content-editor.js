/**
 * Live Content Editor
 * Allows real-time editing of text, images, and backgrounds.
 */

document.addEventListener('DOMContentLoaded', () => {
    initContentEditor();
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

        // Insert before actions
        cpContent.insertBefore(heroBgGroup, cpActions);

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

function initBlockManager() {
    const cpContent = document.querySelector('.cp-content');
    if (!cpContent) return;

    // Create Block Manager Group
    const blockGroup = document.createElement('div');
    blockGroup.className = 'cp-group';
    blockGroup.id = 'block-manager-group';
    blockGroup.innerHTML = `
        <label>Blok Yönetimi (Sürükle-Bırak)</label>
        <div id="block-list" class="block-list">
            <!-- Blocks will be injected here -->
        </div>
        <small style="display:block; margin-top:8px; font-size:11px; color:#999;">Anasayfa bloklarını sürükleyerek sıralayın.</small>
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
                background: var(--cp-bg-light, #f1f5f9);
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
            .block-item:hover {
                background: #e2e8f0;
            }
            .block-item.dragging {
                opacity: 0.5;
                cursor: grabbing;
                background: var(--color-primary);
                color: white;
            }
            .block-item::before {
                content: "⋮⋮";
                margin-right: 10px;
                color: #94a3b8;
                font-size: 16px;
            }
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
    const sections = Array.from(document.querySelectorAll('[data-section-type]'));

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
            // Re-insert before footer or at end
            if (footer) {
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
        <div class="toggle-wrapper" style="display:flex; align-items:center; gap:10px; margin-top:10px;">
            <input type="checkbox" id="anim-toggle" style="width:auto; cursor:pointer;">
            <span style="font-size:13px; font-weight:500;">Kaydırma Efektlerini Aktif Et</span>
        </div>
        <small style="display:block; margin-top:8px; font-size:11px; color:#999;">Ziyaretçiler sayfayı aşağı kaydırdıkça bölümler yumuşak bir şekilde belirir.</small>
    `;

    // Insert before block manager
    const blockManager = document.getElementById('block-manager-group');
    if (blockManager) {
        blockManager.before(animGroup);
    } else {
        cpContent.prepend(animGroup);
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
        <div class="input-wrapper" style="margin-top:10px;">
            <select id="font-select" style="width:100%; padding:8px; border-radius:6px; border:1px solid #e2e8f0; font-size:13px;">
                <option value="Inter, sans-serif">Inter (Modern & Temiz)</option>
                <option value="'Outfit', sans-serif">Outfit (Premium & Yuvarlak)</option>
                <option value="'Roboto', sans-serif">Roboto (Klasik & Güvenilir)</option>
                <option value="'Playfair Display', serif">Playfair (Zarif & Klasik)</option>
                <option value="'Montserrat', sans-serif">Montserrat (Güçlü & Geometrik)</option>
            </select>
        </div>
        <small style="display:block; margin-top:8px; font-size:11px; color:#999;">Sitenizin karakterini belirleyen yazı tipini seçin.</small>
    `;

    // Insert before animation group
    const animGroup = document.getElementById('animation-group');
    if (animGroup) {
        animGroup.before(fontGroup);
    } else {
        cpContent.prepend(fontGroup);
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
    const cpContent = document.querySelector('.cp-content');
    if (!cpContent) return;

    const waGroup = document.createElement('div');
    waGroup.className = 'cp-group';
    waGroup.id = 'wa-group';
    waGroup.innerHTML = `
        <label>WhatsApp Pro Ayarları</label>
        <div class="input-wrapper" style="margin-top:10px;">
            <span style="font-size:11px; color:#666;">Karşılama Mesajı</span>
            <input type="text" id="wa-welcome-input" placeholder="Size nasıl yardımcı olabiliriz?" style="width:100%; margin-top:4px;">
        </div>
        <div class="input-wrapper" style="margin-top:10px;">
            <span style="font-size:11px; color:#666;">Hazır Mesaj (Ziyaretçinin Yazacağı)</span>
            <input type="text" id="wa-prefill-input" placeholder="Merhaba, bilgi almak istiyorum." style="width:100%; margin-top:4px;">
        </div>
        <small style="display:block; margin-top:8px; font-size:11px; color:#999;">WhatsApp balonundaki metinleri özelleştirin.</small>
    `;

    // Insert before actions
    const cpActions = document.querySelector('.cp-actions');
    if (cpActions) {
        cpActions.before(waGroup);
    } else {
        cpContent.appendChild(waGroup);
    }

    const welcomeInput = document.getElementById('wa-welcome-input');
    const prefillInput = document.getElementById('wa-prefill-input');

    const handleSync = () => {
        syncWhatsAppToServer({
            welcomeMessage: welcomeInput.value,
            prefillText: prefillInput.value
        });
    }

    welcomeInput.oninput = handleSync;
    prefillInput.oninput = handleSync;
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
    const cpContent = document.querySelector('.cp-content');
    if (!cpContent) return;

    const seoGroup = document.createElement('div');
    seoGroup.className = 'cp-group';
    seoGroup.id = 'seo-group';
    seoGroup.innerHTML = `
        <label>SEO ve Sosyal Medya Ayarları</label>
        <div class="input-wrapper" style="margin-top:10px;">
            <span style="font-size:11px; color:#666;">Sayfa Başlığı (SEO Title)</span>
            <input type="text" id="seo-title-input" placeholder="Site Başlığı" style="width:100%; margin-top:4px;">
        </div>
        <div class="input-wrapper" style="margin-top:10px;">
            <span style="font-size:11px; color:#666;">Meta Açıklama (Meta Description)</span>
            <textarea id="seo-desc-input" placeholder="Sitenizi kısaca tanımlayın..." style="width:100%; margin-top:4px; height:60px; font-size:12px;"></textarea>
        </div>
        <div class="input-wrapper" style="margin-top:10px;">
            <span style="font-size:11px; color:#666;">Paylaşım Görseli (OG Image URL)</span>
            <input type="text" id="seo-og-input" placeholder="https://..." style="width:100%; margin-top:4px;">
        </div>
        <small style="display:block; margin-top:8px; font-size:11px; color:#999;">Arama motorları ve sosyal paylaşımlar için ayarlar.</small>
    `;

    // Insert before actions
    const cpActions = document.querySelector('.cp-actions');
    if (cpActions) {
        cpActions.before(seoGroup);
    } else {
        cpContent.appendChild(seoGroup);
    }

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

    titleInput.oninput = handleSync;
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
    const cpContent = document.querySelector('.cp-content');
    if (!cpContent) return;

    const popupGroup = document.createElement('div');
    popupGroup.className = 'cp-group';
    popupGroup.id = 'popup-group';
    popupGroup.innerHTML = `
        <label>Kampanya Pop-up Ayarları</label>
        <div class="input-wrapper" style="margin-top:10px;">
            <span style="font-size:11px; color:#666;">Pop-up Aktif</span>
            <input type="checkbox" id="popup-enabled-input" style="margin-left:8px;">
        </div>
        <div class="input-wrapper" style="margin-top:10px;">
            <span style="font-size:11px; color:#666;">Başlık</span>
            <input type="text" id="popup-title-input" placeholder="Örn: Özel İndirim!" style="width:100%; margin-top:4px;">
        </div>
        <div class="input-wrapper" style="margin-top:10px;">
            <span style="font-size:11px; color:#666;">Açıklama</span>
            <textarea id="popup-message-input" placeholder="Kampanya detaylarını yazın..." style="width:100%; margin-top:4px; height:60px; font-size:12px;"></textarea>
        </div>
        <div class="input-wrapper" style="margin-top:10px;">
            <span style="font-size:11px; color:#666;">Buton Yazısı</span>
            <input type="text" id="popup-btn-input" placeholder="Hemen İncele" style="width:100%; margin-top:4px;">
        </div>
        <div class="input-wrapper" style="margin-top:10px;">
            <span style="font-size:11px; color:#666;">Buton Linki</span>
            <input type="text" id="popup-link-input" placeholder="#services" style="width:100%; margin-top:4px;">
        </div>
        <div class="input-wrapper" style="margin-top:10px;">
            <span style="font-size:11px; color:#666;">Tetikleyici</span>
            <select id="popup-trigger-input" style="width:100%; margin-top:4px;">
                <option value="timer">Süreli (Zaman Ayarlı)</option>
                <option value="exit-intent">Çıkış Niyeti (Fare Yukarı Çıkınca)</option>
            </select>
        </div>
        <small style="display:block; margin-top:8px; font-size:11px; color:#999;">Sitenize giren ziyaretçilere otomatik pencere gösterin.</small>
    `;

    // Insert before actions
    const cpActions = document.querySelector('.cp-actions');
    if (cpActions) {
        cpActions.before(popupGroup);
    } else {
        cpContent.appendChild(popupGroup);
    }

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

    Object.values(elements).forEach(el => {
        if (el.type === 'checkbox') el.onchange = handleSync;
        else if (el.tagName === 'SELECT') el.onchange = handleSync;
        else el.oninput = handleSync;
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

function initLayoutSettings() {
    const cpContent = document.querySelector('.cp-content');
    if (!cpContent) return;

    const layoutGroup = document.createElement('div');
    layoutGroup.className = 'cp-group';
    layoutGroup.id = 'layout-settings-group';
    layoutGroup.innerHTML = `
        <label>Genel Yerleşim Ayarları</label>
        <div class="input-wrapper" style="margin-top:10px;">
            <span style="font-size:11px; color:#666;">Üst Menü (Header) Tasarımı</span>
            <select id="header-variation-input" style="width:100%; margin-top:4px;">
                <option value="header-1">Standart / Yapışkan</option>
                <option value="header-2">Ortalı Logo</option>
            </select>
        </div>
        <div class="input-wrapper" style="margin-top:10px;">
            <span style="font-size:11px; color:#666;">Alt Bilgi (Footer) Tasarımı</span>
            <select id="footer-variation-input" style="width:100%; margin-top:4px;">
                <option value="footer-1">Detaylı / Geniş</option>
                <option value="footer-2">Minimalist / Sade</option>
            </select>
        </div>
        <small style="display:block; margin-top:8px; font-size:11px; color:#999;">Sitenin iskelet yapısını tek tıkla değiştirin.</small>
    `;

    // Insert before actions
    const cpActions = document.querySelector('.cp-actions');
    if (cpActions) {
        cpActions.before(layoutGroup);
    } else {
        cpContent.appendChild(layoutGroup);
    }

    const headerInput = document.getElementById('header-variation-input');
    const footerInput = document.getElementById('footer-variation-input');

    const handleSync = () => {
        syncLayoutToServer({
            header: headerInput.value,
            footer: footerInput.value
        });
    }

    headerInput.onchange = handleSync;
    footerInput.onchange = handleSync;
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
                    header: config.header,
                    footer: config.footer
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
    const cpContent = document.querySelector('.cp-content');
    if (!cpContent) return;

    const langGroup = document.createElement('div');
    langGroup.className = 'cp-group';
    langGroup.id = 'language-group';
    langGroup.innerHTML = `
        <label>Çoklu Dil (İngilizce Çeviri)</label>
        <div class="input-wrapper" style="margin-top:10px;">
            <span style="font-size:11px; color:#666;">Site Başlığı (EN)</span>
            <input type="text" id="lang-en-title" placeholder="Business Name / Title" style="width:100%; margin-top:4px;">
        </div>
        <div class="input-wrapper" style="margin-top:10px;">
            <span style="font-size:11px; color:#666;">Slogan (EN)</span>
            <input type="text" id="lang-en-tagline" placeholder="Your Catchy Tagline" style="width:100%; margin-top:4px;">
        </div>
        <div class="input-wrapper" style="margin-top:10px;">
            <span style="font-size:11px; color:#666;">Hakkımızda Özeti (EN)</span>
            <textarea id="lang-en-description" placeholder="Short description about your business..." style="width:100%; margin-top:4px; height:60px; font-size:12px;"></textarea>
        </div>
        <div class="input-wrapper" style="margin-top:10px;">
            <span style="font-size:11px; color:#666;">Hizmetler (Virgülle ayırın)</span>
            <textarea id="lang-en-services" placeholder="Service 1, Service 2, Service 3..." style="width:100%; margin-top:4px; height:60px; font-size:12px;"></textarea>
        </div>
        <small style="display:block; margin-top:8px; font-size:11px; color:#999;">İngilizce çevirileri girdiğinizde sitenizin /en/ versiyonu otomatik oluşturulur.</small>
    `;

    // Insert before actions
    const cpActions = document.querySelector('.cp-actions');
    if (cpActions) {
        cpActions.before(langGroup);
    } else {
        cpContent.appendChild(langGroup);
    }

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
        #color-settings-group,
        #font-settings-group,
        #animations-group,
        #layout-settings-group,
        #block-manager-group,
        .block-actions { 
            display: none !important; 
        }
        
        .cp-title { position: relative; }
        .cp-title::after { 
            content: ' (Kısıtlı Mod)'; 
            font-size: 10px; 
            background: #eee; 
            padding: 2px 6px; 
            border-radius: 4px; 
            display: inline-block; 
            margin-left: 5px; 
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

function initExportActions() {
    const cpContent = document.querySelector('.cp-content');
    if (!cpContent) return;

    const exportGroup = document.createElement('div');
    exportGroup.className = 'cp-group';
    exportGroup.id = 'export-group';
    exportGroup.style.marginTop = '20px';
    exportGroup.style.borderTop = '1px solid #eee';
    exportGroup.style.paddingTop = '15px';

    exportGroup.innerHTML = `
        <label>Yayınlama ve İşlemler</label>
        <div style="display:flex; flex-direction:column; gap:10px; margin-top:10px;">
            <button id="btn-export-zip" class="btn btn-sm" style="width:100%; background:#28a745; color:white; border:none; padding:8px; border-radius:4px; cursor:pointer; font-weight:600;">📁 Dışa Aktar (ZIP)</button>
            <a href="https://app.netlify.com/drop" target="_blank" class="btn btn-sm btn-outline" style="width:100%; text-align:center; text-decoration:none; padding:8px; display:block; font-size:12px;">🚀 Netlify'da Yayınla (Sürükle-Bırak)</a>
            <button id="btn-logout" class="btn btn-sm btn-outline" style="width:100%; color:red; border-color:rgba(255,0,0,0.2); padding:8px;">🚪 Siteden Çıkış Yap</button>
        </div>
    `;

    cpContent.appendChild(exportGroup);

    // Export Logic
    document.getElementById('btn-export-zip').onclick = () => {
        showNotification('ZIP dosyası hazırlanıyor...', 'info');
        fetch(`../../api/export.php?slug=${window.SITE_SLUG}`)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    window.location.href = `../../${data.downloadUrl}`;
                    showNotification('İndirme başlatıldı!');
                } else {
                    alert('Hata: ' + data.message);
                }
            })
            .catch(err => console.error('Export failed', err));
    };

    // Logout Logic
    document.getElementById('btn-logout').onclick = () => {
        if (confirm('Oturumu kapatmak istediğinize emin misiniz?')) {
            fetch('../../api/logout.php')
                .then(() => location.reload());
        }
    };
}
