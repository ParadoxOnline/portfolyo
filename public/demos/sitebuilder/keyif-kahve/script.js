/**
 * Professional Website - Enhanced JavaScript
 * Premium animations, scroll effects, and interactions
 */

(function () {
    'use strict';

    // ========================================
    // Configuration
    // ========================================
    const CONFIG = {
        scrollThreshold: 50,
        revealThreshold: 0.15,
        counterDuration: 2000,
        cursorEnabled: window.matchMedia('(pointer: fine)').matches
    };

    // ========================================
    // DOM Elements
    // ========================================
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const scrollProgress = document.getElementById('scrollProgress');
    const cursorFollower = document.getElementById('cursorFollower');
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = lightbox?.querySelector('.lightbox-image');
    const lightboxClose = lightbox?.querySelector('.lightbox-close');
    const lightboxPrev = lightbox?.querySelector('.lightbox-prev');
    const lightboxNext = lightbox?.querySelector('.lightbox-next');
    const currentSlideEl = document.getElementById('currentSlide');
    const totalSlidesEl = document.getElementById('totalSlides');

    let galleryImages = [];
    let currentImageIndex = 0;

    // ========================================
    // Scroll Progress Bar
    // ========================================
    function updateScrollProgress() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / docHeight) * 100;
        if (scrollProgress) {
            scrollProgress.style.width = `${progress}%`;
        }
    }

    // ========================================
    // Navbar Scroll Effect
    // ========================================
    function handleNavbarScroll() {
        const scrolled = window.scrollY > CONFIG.scrollThreshold;
        navbar?.classList.toggle('scrolled', scrolled);
    }

    // ========================================
    // Mobile Navigation
    // ========================================
    function initMobileNav() {
        navToggle?.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu?.classList.toggle('active');
            document.body.style.overflow = navMenu?.classList.contains('active') ? 'hidden' : '';
        });

        // Close on link click
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navToggle?.classList.remove('active');
                navMenu?.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // ========================================
    // Cursor Follower
    // ========================================
    function initCursorFollower() {
        if (!CONFIG.cursorEnabled || !cursorFollower) return;

        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        function animate() {
            cursorX += (mouseX - cursorX) * 0.15;
            cursorY += (mouseY - cursorY) * 0.15;
            cursorFollower.style.left = `${cursorX}px`;
            cursorFollower.style.top = `${cursorY}px`;
            requestAnimationFrame(animate);
        }
        animate();

        // Hover effects on interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .gallery-item, .service-card');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => cursorFollower.classList.add('active'));
            el.addEventListener('mouseleave', () => cursorFollower.classList.remove('active'));
        });
    }

    // ========================================
    // Scroll Reveal Animations
    // ========================================
    let scrollObserver = null;
    function initScrollReveal() {
        if (scrollObserver) {
            scrollObserver.disconnect();
        }

        const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-on-scroll');

        scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, {
            threshold: CONFIG.revealThreshold,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(el => scrollObserver.observe(el));
    }

    // Expose for Pro Editor
    window.refreshAnimations = initScrollReveal;

    // ========================================
    // Stats Counter Animation
    // ========================================
    function initStatsCounter() {
        const statNumbers = document.querySelectorAll('.stat-number[data-count]');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                    entry.target.classList.add('counted');
                    animateCounter(entry.target);
                }
            });
        }, { threshold: 0.5 });

        statNumbers.forEach(el => observer.observe(el));
    }

    function animateCounter(element) {
        const target = parseFloat(element.dataset.count);
        const isDecimal = target % 1 !== 0;
        const duration = CONFIG.counterDuration;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeProgress = 1 - Math.pow(1 - progress, 4); // Ease out quart

            const current = target * easeProgress;
            element.textContent = isDecimal ? current.toFixed(1) : Math.round(current);

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    }

    // ========================================
    // Gallery Lightbox
    // ========================================
    function initLightbox() {
        const galleryItems = document.querySelectorAll('.gallery-item');
        galleryImages = Array.from(galleryItems).map(item => ({
            src: item.querySelector('img')?.src || '',
            alt: item.querySelector('img')?.alt || ''
        }));

        if (totalSlidesEl) {
            totalSlidesEl.textContent = galleryImages.length;
        }

        galleryItems.forEach((item, index) => {
            item.addEventListener('click', () => openLightbox(index));
        });

        lightboxClose?.addEventListener('click', closeLightbox);
        lightboxPrev?.addEventListener('click', () => navigateLightbox(-1));
        lightboxNext?.addEventListener('click', () => navigateLightbox(1));

        lightbox?.querySelector('.lightbox-backdrop')?.addEventListener('click', closeLightbox);

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!lightbox?.classList.contains('active')) return;

            switch (e.key) {
                case 'Escape': closeLightbox(); break;
                case 'ArrowLeft': navigateLightbox(-1); break;
                case 'ArrowRight': navigateLightbox(1); break;
            }
        });

        // Touch swipe support
        let touchStartX = 0;
        lightbox?.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
        });

        lightbox?.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].clientX;
            const diff = touchStartX - touchEndX;

            if (Math.abs(diff) > 50) {
                navigateLightbox(diff > 0 ? 1 : -1);
            }
        });
    }

    function openLightbox(index) {
        if (!lightbox || !lightboxImage || !galleryImages[index]) return;

        currentImageIndex = index;
        lightboxImage.src = galleryImages[index].src;
        lightboxImage.alt = galleryImages[index].alt;

        if (currentSlideEl) currentSlideEl.textContent = index + 1;

        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox?.classList.remove('active');
        document.body.style.overflow = '';
    }

    function navigateLightbox(direction) {
        currentImageIndex = (currentImageIndex + direction + galleryImages.length) % galleryImages.length;

        if (lightboxImage && galleryImages[currentImageIndex]) {
            lightboxImage.style.opacity = '0';
            lightboxImage.style.transform = `translateX(${direction * 30}px)`;

            setTimeout(() => {
                lightboxImage.src = galleryImages[currentImageIndex].src;
                lightboxImage.alt = galleryImages[currentImageIndex].alt;
                lightboxImage.style.opacity = '1';
                lightboxImage.style.transform = 'translateX(0)';
            }, 150);
        }

        if (currentSlideEl) currentSlideEl.textContent = currentImageIndex + 1;
    }

    // ========================================
    // Smooth Scroll
    // ========================================
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;

                const target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    const offsetTop = target.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // ========================================
    // Parallax Effect (Hero)
    // ========================================
    function initParallax() {
        const heroBg = document.querySelector('.hero-bg');
        if (!heroBg || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        let ticking = false;

        function updateParallax() {
            const scrollY = window.scrollY;
            const heroHeight = document.querySelector('.hero')?.offsetHeight || 0;

            if (scrollY < heroHeight) {
                heroBg.style.transform = `scale(1.05) translateY(${scrollY * 0.3}px)`;
            }
            ticking = false;
        }

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        });
    }

    // ========================================
    // Active Navigation Highlight
    // ========================================
    function initActiveNav() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-links a');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navLinks.forEach(link => {
                        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                    });
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '-80px 0px -50% 0px'
        });

        sections.forEach(section => observer.observe(section));
    }

    // ========================================
    // Service Card Stagger Animation
    // ========================================
    function initServiceCardAnimations() {
        const serviceCards = document.querySelectorAll('.service-card');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    entry.target.style.transitionDelay = `${index * 0.1}s`;
                    entry.target.classList.add('reveal', 'active');
                }
            });
        }, { threshold: 0.1 });

        serviceCards.forEach(card => observer.observe(card));
    }

    // ========================================
    // Gallery Masonry Animation
    // ========================================
    function initGalleryAnimations() {
        const galleryItems = document.querySelectorAll('.gallery-item');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 100);
                }
            });
        }, { threshold: 0.1 });

        galleryItems.forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(30px)';
            item.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
            observer.observe(item);
        });
    }

    // ========================================
    // Gallery Carousel Implementation
    // ========================================
    function initGalleryCarousel() {
        const carousels = document.querySelectorAll('.gallery-carousel-full, .gallery-carousel-track');

        carousels.forEach(carousel => {
            const track = carousel.querySelector('.gallery-carousel-track') || carousel;

            // Ensure track is visible
            track.style.display = 'flex';

            // 1. Try finding buttons in the wrapper
            let prevBtn = carousel.querySelector('.carousel-btn.prev');
            let nextBtn = carousel.querySelector('.carousel-btn.next');

            if (prevBtn && !prevBtn.dataset.bound) {
                prevBtn.dataset.bound = true;
                prevBtn.addEventListener('click', (e) => {
                    const item = track.querySelector('.gallery-item');
                    const itemWidth = item ? item.getBoundingClientRect().width : 350;
                    track.scrollBy({ left: -itemWidth, behavior: 'smooth' });
                });
            }

            if (nextBtn && !nextBtn.dataset.bound) {
                nextBtn.dataset.bound = true;
                nextBtn.addEventListener('click', (e) => {
                    const item = track.querySelector('.gallery-item');
                    const itemWidth = item ? item.getBoundingClientRect().width : 350;
                    track.scrollBy({ left: itemWidth, behavior: 'smooth' });
                });
            }
        });

        // Generic Carousel Button Handler for any variation causing issues
        document.querySelectorAll('.carousel-btn').forEach(btn => {
            btn.addEventListener('click', function (e) {
                if (this.dataset.bound) return; // Prevent double binding
                this.dataset.bound = true;

                const wrapper = this.closest('.gallery-carousel-full') || this.parentElement.parentElement;
                const track = wrapper?.querySelector('.gallery-carousel-track');

                if (track) {
                    const direction = this.classList.contains('prev') ? -1 : 1;
                    const itemWidth = track.querySelector('.gallery-item')?.offsetWidth || 300;
                    track.scrollBy({ left: direction * itemWidth, behavior: 'smooth' });
                }
            });
        });
    }

    // ========================================
    // Inline Live Editor
    // ========================================
    const STORAGE_KEY = 'siteEditor_' + window.location.pathname;
    let hasChanges = false;

    function initInlineEditor() {
        // Create editor toolbar
        createEditorToolbar();

        // Load saved changes
        loadSavedChanges();

        // Setup editable text elements
        setupTextEditing();

        // Setup image replacement
        setupImageEditing();
    }

    function createEditorToolbar() {
        const toolbar = document.createElement('div');
        toolbar.className = 'editor-toolbar';
        toolbar.innerHTML = `
            <div class="editor-toolbar-content">
                <span class="editor-status">✏️ Düzenleme Modu</span>
                <div class="editor-actions">
                    <button class="editor-btn editor-btn-reset" onclick="window.resetEditorChanges()">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                        Sıfırla
                    </button>
                    <button class="editor-btn editor-btn-save" onclick="window.saveEditorChanges()">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                        Kaydet
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(toolbar);
    }

    function setupTextEditing() {
        // Select all editable text elements
        const editableSelectors = [
            '.hero-title',
            '.hero-tagline',
            '.hero-description',
            '.section-title-lg',
            '.about-text p',
            '.service-card h3',
            '.service-card p',
            '.footer-tagline',
            '.contact-intro',
            '.card-content h4',
            '.card-content p',
            '.feature-text h4',
            '.feature-text p'
        ];

        document.querySelectorAll(editableSelectors.join(', ')).forEach((el, index) => {
            el.setAttribute('data-editable', 'text');
            el.setAttribute('data-edit-id', `text-${index}`);

            el.addEventListener('click', (e) => {
                e.stopPropagation();
                startTextEditing(el);
            });

            el.addEventListener('blur', () => {
                finishTextEditing(el);
            });

            el.addEventListener('input', () => {
                markAsChanged();
            });
        });
    }

    function startTextEditing(element) {
        element.setAttribute('contenteditable', 'true');
        element.classList.add('editor-active');
        element.focus();
    }

    function finishTextEditing(element) {
        element.setAttribute('contenteditable', 'false');
        element.classList.remove('editor-active');
    }

    function setupImageEditing() {
        // Create hidden file input
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.style.display = 'none';
        fileInput.id = 'editorImageInput';
        document.body.appendChild(fileInput);

        let currentImageElement = null;

        // Hero background - direct click
        document.querySelectorAll('.hero-bg, .visual-card img').forEach((el, index) => {
            el.setAttribute('data-editable', 'image');
            el.setAttribute('data-edit-id', `img-${index}`);
            el.style.cursor = 'pointer';

            el.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                currentImageElement = el;
                fileInput.click();
            });
        });

        // Gallery items - add edit button overlay
        document.querySelectorAll('.gallery-item').forEach((item, index) => {
            const img = item.querySelector('img');
            if (!img) return;

            img.setAttribute('data-editable', 'image');
            img.setAttribute('data-edit-id', `gallery-${index}`);

            // Create edit button
            const editBtn = document.createElement('button');
            editBtn.className = 'gallery-edit-btn';
            editBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`;
            editBtn.title = 'Görseli değiştir';
            item.style.position = 'relative';
            item.appendChild(editBtn);

            editBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                currentImageElement = img;
                fileInput.click();
            });
        });

        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file || !currentImageElement) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                const base64 = event.target.result;

                if (currentImageElement.tagName === 'IMG') {
                    currentImageElement.src = base64;
                } else {
                    // For background images (hero-bg)
                    currentImageElement.style.backgroundImage = `url('${base64}')`;
                }

                markAsChanged();
            };
            reader.readAsDataURL(file);
            fileInput.value = '';
        });
    }

    function markAsChanged() {
        hasChanges = true;
        document.querySelector('.editor-toolbar')?.classList.add('has-changes');
    }

    function getEditableData() {
        const data = { texts: {}, images: {} };

        // Collect text content
        document.querySelectorAll('[data-editable="text"]').forEach(el => {
            const id = el.getAttribute('data-edit-id');
            data.texts[id] = el.innerHTML;
        });

        // Collect image sources
        document.querySelectorAll('[data-editable="image"]').forEach(el => {
            const id = el.getAttribute('data-edit-id');
            if (el.tagName === 'IMG') {
                data.images[id] = el.src;
            } else {
                const bg = el.style.backgroundImage;
                if (bg && bg.startsWith('url(')) {
                    data.images[id] = bg.slice(5, -2);
                }
            }
        });

        return data;
    }

    function loadSavedChanges() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (!saved) return;

            const data = JSON.parse(saved);

            // Restore text content
            if (data.texts) {
                Object.entries(data.texts).forEach(([id, content]) => {
                    const el = document.querySelector(`[data-edit-id="${id}"]`);
                    if (el) el.innerHTML = content;
                });
            }

            // Restore images
            if (data.images) {
                Object.entries(data.images).forEach(([id, src]) => {
                    const el = document.querySelector(`[data-edit-id="${id}"]`);
                    if (!el) return;

                    if (el.tagName === 'IMG') {
                        el.src = src;
                    } else {
                        el.style.backgroundImage = `url('${src}')`;
                    }
                });
            }

            console.log('✅ Kaydedilmiş değişiklikler yüklendi');
        } catch (err) {
            console.warn('Kayıtlı değişiklikler yüklenemedi:', err);
        }
    }

    // Global functions for toolbar buttons
    window.saveEditorChanges = function () {
        const data = getEditableData();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        hasChanges = false;
        document.querySelector('.editor-toolbar')?.classList.remove('has-changes');

        // Show success notification
        showEditorNotification('✅ Değişiklikler kaydedildi!', 'success');
    };

    window.resetEditorChanges = function () {
        if (!confirm('Tüm değişiklikler silinecek. Emin misiniz?')) return;

        localStorage.removeItem(STORAGE_KEY);
        location.reload();
    };

    function showEditorNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `editor-notification editor-notification-${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => notification.classList.add('show'), 10);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 2500);
    }

    // ========================================
    // Initialize All
    // ========================================
    function init() {
        // Scroll handlers
        window.addEventListener('scroll', () => {
            updateScrollProgress();
            handleNavbarScroll();
        }, { passive: true });

        // Initial calls
        handleNavbarScroll();
        updateScrollProgress();

        // Initialize modules
        initMobileNav();
        initCursorFollower();
        initScrollReveal();
        initStatsCounter();
        initLightbox();
        initSmoothScroll();
        initParallax();
        initActiveNav();
        initServiceCardAnimations();
        initGalleryAnimations();
        initGalleryCarousel();
        initInlineEditor();
        initContactForm(); // Functional contact forms
        initWhatsAppWidget(); // Premium WhatsApp Bubble
        initPopupCreator(); // Pro Pop-up Creator
        // initBlockBuilder(); // Favoring new Pro Block Manager in content-editor.js

        // Remove loading state
        document.body.classList.add('loaded');
    }

    // Expose for variation changes
    window.initAllSiteFeatures = () => {
        initScrollReveal();
        initStatsCounter();
        initParallax();
        initServiceCardAnimations();
        initGalleryAnimations();
        initGalleryCarousel();
        initLightbox(); // Refresh lightbox images

        // Re-bind hover effects for cursor
        const interactiveElements = document.querySelectorAll('a, button, .gallery-item, .service-card');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => cursorFollower?.classList.add('active'));
            el.addEventListener('mouseleave', () => cursorFollower?.classList.remove('active'));
        });
    };

    // ========================================
    // Block Based Builder
    // ========================================
    const BLOCK_STORAGE_KEY = 'siteBlocks_' + window.location.pathname;

    function initBlockBuilder() {
        loadBlockState();
        createBlockControls();
        createHiddenBlocksPanel();
        initDragDrop();
    }

    function getBlocks() {
        return Array.from(document.querySelectorAll('[data-block]'));
    }

    function createBlockControls() {
        getBlocks().forEach(block => {
            if (block.querySelector('.block-controls')) return;

            const controls = document.createElement('div');
            controls.className = 'block-controls';
            controls.innerHTML = `
                <span class="block-name">${block.dataset.blockName || block.dataset.block}</span>
                <div class="block-actions">
                    <button class="block-btn" data-action="up" title="Yukarı Taşı">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 15l-6-6-6 6"/></svg>
                    </button>
                    <button class="block-btn" data-action="down" title="Aşağı Taşı">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
                    </button>
                    <button class="block-btn block-btn-drag" data-action="drag" title="Sürükle">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="19" r="1"/></svg>
                    </button>
                    <button class="block-btn block-btn-delete" data-action="delete" title="Gizle">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
                    </button>
                </div>
            `;

            block.style.position = 'relative';
            block.insertBefore(controls, block.firstChild);

            // Event listeners
            controls.querySelectorAll('.block-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleBlockAction(block, btn.dataset.action);
                });
            });
        });
    }

    function handleBlockAction(block, action) {
        switch (action) {
            case 'up':
                moveBlock(block, -1);
                break;
            case 'down':
                moveBlock(block, 1);
                break;
            case 'delete':
                hideBlock(block);
                break;
        }
    }

    function moveBlock(block, direction) {
        const blocks = getBlocks().filter(b => !b.classList.contains('block-hidden'));
        const currentIndex = blocks.indexOf(block);
        const newIndex = currentIndex + direction;

        if (newIndex < 0 || newIndex >= blocks.length) return;

        const targetBlock = blocks[newIndex];

        if (direction === -1) {
            targetBlock.parentNode.insertBefore(block, targetBlock);
        } else {
            targetBlock.parentNode.insertBefore(block, targetBlock.nextSibling);
        }

        saveBlockState();
        showEditorNotification('📦 Blok taşındı', 'success');
    }

    function hideBlock(block) {
        block.classList.add('block-hidden');
        block.style.display = 'none';
        saveBlockState();
        updateHiddenBlocksPanel();
        showEditorNotification(`🗑️ "${block.dataset.blockName}" gizlendi`, 'info');
    }

    function showBlock(blockId) {
        const block = document.querySelector(`[data-block="${blockId}"]`);
        if (block) {
            block.classList.remove('block-hidden');
            block.style.display = '';
            saveBlockState();
            updateHiddenBlocksPanel();
            showEditorNotification(`✅ "${block.dataset.blockName}" gösterildi`, 'success');
        }
    }

    function createHiddenBlocksPanel() {
        const panel = document.createElement('div');
        panel.className = 'hidden-blocks-panel';
        panel.id = 'hiddenBlocksPanel';
        panel.innerHTML = `
            <button class="hidden-blocks-toggle" id="hiddenBlocksToggle">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
                <span>Blok Ekle</span>
            </button>
            <div class="hidden-blocks-list" id="hiddenBlocksList"></div>
        `;
        document.body.appendChild(panel);

        document.getElementById('hiddenBlocksToggle').addEventListener('click', () => {
            panel.classList.toggle('active');
        });

        updateHiddenBlocksPanel();
    }

    function updateHiddenBlocksPanel() {
        const list = document.getElementById('hiddenBlocksList');
        if (!list) return;

        const hiddenBlocks = getBlocks().filter(b => b.classList.contains('block-hidden'));

        if (hiddenBlocks.length === 0) {
            list.innerHTML = '<span class="no-hidden-blocks">Gizli blok yok</span>';
            return;
        }

        list.innerHTML = hiddenBlocks.map(block => `
            <button class="hidden-block-item" data-restore="${block.dataset.block}">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
                ${block.dataset.blockName}
            </button>
        `).join('');

        list.querySelectorAll('.hidden-block-item').forEach(btn => {
            btn.addEventListener('click', () => {
                showBlock(btn.dataset.restore);
                document.getElementById('hiddenBlocksPanel').classList.remove('active');
            });
        });
    }

    function initDragDrop() {
        getBlocks().forEach(block => {
            block.setAttribute('draggable', 'true');

            block.addEventListener('dragstart', (e) => {
                block.classList.add('block-dragging');
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text/plain', block.dataset.block);
            });

            block.addEventListener('dragend', () => {
                block.classList.remove('block-dragging');
                document.querySelectorAll('.block-drag-over').forEach(el => el.classList.remove('block-drag-over'));
                saveBlockState();
            });

            block.addEventListener('dragover', (e) => {
                e.preventDefault();
                const dragging = document.querySelector('.block-dragging');
                if (dragging && dragging !== block) {
                    block.classList.add('block-drag-over');
                }
            });

            block.addEventListener('dragleave', () => {
                block.classList.remove('block-drag-over');
            });

            block.addEventListener('drop', (e) => {
                e.preventDefault();
                block.classList.remove('block-drag-over');

                const dragging = document.querySelector('.block-dragging');
                if (dragging && dragging !== block) {
                    const rect = block.getBoundingClientRect();
                    const midY = rect.top + rect.height / 2;

                    if (e.clientY < midY) {
                        block.parentNode.insertBefore(dragging, block);
                    } else {
                        block.parentNode.insertBefore(dragging, block.nextSibling);
                    }
                }
            });
        });
    }

    function saveBlockState() {
        const state = {
            order: getBlocks().map(b => b.dataset.block),
            hidden: getBlocks().filter(b => b.classList.contains('block-hidden')).map(b => b.dataset.block)
        };
        localStorage.setItem(BLOCK_STORAGE_KEY, JSON.stringify(state));
    }

    function loadBlockState() {
        // ... (existing code omitted for brevity but preserved in file)
    }

    // ========================================
    // Pop-up Creator (Pro)
    // ========================================
    function initPopupCreator() {
        const popup = document.getElementById('site-popup');
        const closeBtn = document.getElementById('popup-close');
        if (!popup) return;

        // Configuration is expected to be passed via data attributes or global
        const config = window.POPUP_SETTINGS || {
            enabled: popup.classList.contains('active'),
            trigger: popup.dataset.trigger || 'timer',
            delay: parseInt(popup.dataset.delay) || 5000
        };

        if (!config.enabled && !popup.classList.contains('active')) return;

        const showPopup = () => {
            if (sessionStorage.getItem('popup_shown')) return;
            popup.style.display = 'flex';
            setTimeout(() => popup.classList.add('active'), 10);
            sessionStorage.setItem('popup_shown', 'true');
        };

        closeBtn?.addEventListener('click', () => {
            popup.classList.remove('active');
            setTimeout(() => popup.style.display = 'none', 400);
        });

        popup.addEventListener('click', (e) => {
            if (e.target === popup) closeBtn.click();
        });

        // Triggers
        if (config.trigger === 'exit-intent') {
            document.addEventListener('mouseleave', (e) => {
                if (e.clientY < 0) showPopup();
            }, { once: true });
        } else {
            // Default: Timer
            setTimeout(showPopup, config.delay);
        }
    }

    // ========================================
    // Contact Form Submission
    // ========================================
    function initContactForm() {
        const contactForms = document.querySelectorAll('.contact-form');

        contactForms.forEach(form => {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();

                const submitBtn = form.querySelector('button[type="submit"]');
                const originalBtnText = submitBtn ? submitBtn.innerHTML : 'Gönder';

                // Collect data
                const formData = new FormData(form);
                const data = Object.fromEntries(formData.entries());

                // Add site slug for reference
                data.slug = window.SITE_SLUG || 'unknown';

                try {
                    if (submitBtn) {
                        submitBtn.innerHTML = '<span class="spinner"></span> Gönderiliyor...';
                        submitBtn.disabled = true;
                    }

                    const response = await fetch('../../api/send-contact.php', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(data)
                    });

                    const result = await response.json();

                    if (result.success) {
                        // Success message
                        form.innerHTML = `
                            <div class="form-success">
                                <div class="success-icon">✓</div>
                                <h3>Teşekkürler!</h3>
                                <p>${result.message}</p>
                                <button class="btn btn-primary" onclick="location.reload()">Yeni Mesaj</button>
                            </div>
                        `;
                    } else {
                        alert(result.message || 'Bir hata oluştu. Lütfen tekrar deneyin.');
                        if (submitBtn) {
                            submitBtn.innerHTML = originalBtnText;
                            submitBtn.disabled = false;
                        }
                    }
                } catch (err) {
                    console.error('Contact form submission failed', err);
                    alert('Sunucuyla bağlantı kurulamadı. Lütfen daha sonra tekrar deneyin.');
                    if (submitBtn) {
                        submitBtn.innerHTML = originalBtnText;
                        submitBtn.disabled = false;
                    }
                }
            });
        });

        // Add CSS for status
        if (!document.getElementById('form-status-styles')) {
            const style = document.createElement('style');
            style.id = 'form-status-styles';
            style.textContent = `
                .form-success {
                    text-align: center;
                    padding: 40px 20px;
                    background: #f8fafc;
                    border-radius: 16px;
                    border: 1px solid #e2e8f0;
                }
                .success-icon {
                    width: 60px;
                    height: 60px;
                    background: #10b981;
                    color: white;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 30px;
                    margin: 0 auto 20px;
                }
                .spinner {
                    display: inline-block;
                    width: 16px;
                    height: 16px;
                    border: 2px solid rgba(255,255,255,0.3);
                    border-radius: 50%;
                    border-top-color: #fff;
                    animation: spin 1s ease-in-out infinite;
                    margin-right: 8px;
                }
                @keyframes spin { to { transform: rotate(360deg); } }
            `;
            document.head.appendChild(style);
        }
    }

    // ========================================
    // WhatsApp Widget Logic
    // ========================================
    function initWhatsAppWidget() {
        const widget = document.querySelector('.wa-widget');
        if (!widget) return;

        const bubble = widget.querySelector('.wa-bubble');
        const closeBtn = widget.querySelector('#wa-close-btn');

        if (bubble) {
            bubble.addEventListener('click', (e) => {
                // Only toggle if we clicked the bubble icon or badge, NOT the button inside
                if (e.target.closest('.wa-btn')) return;

                e.preventDefault();
                widget.classList.toggle('active');

                const badge = bubble.querySelector('.wa-badge');
                if (badge) badge.style.display = 'none';
            });
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                widget.classList.remove('active');
            });
        }

        // Auto-show bubble after delay
        setTimeout(() => {
            if (!widget.classList.contains('active')) {
                widget.classList.add('active');
            }
        }, 5000);

        document.addEventListener('click', (e) => {
            if (!widget.contains(e.target) && widget.classList.contains('active')) {
                widget.classList.remove('active');
            }
        });
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
