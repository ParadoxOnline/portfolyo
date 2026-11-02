/**
 * Element Resizer Manager
 * Handles resizing of elements in edit mode.
 */

class ElementResizer {
    constructor() {
        this.activeElement = null;
        this.resizingElement = null;
        this.currentHandle = null;
        this.startWidth = 0;
        this.startHeight = 0;
        this.startX = 0;
        this.startY = 0;
        this.isEditMode = false;

        this.init();
    }

    init() {
        // Observe body for class changes to detect edit mode
        const observer = new MutationObserver(() => {
            const wasEditMode = this.isEditMode;
            this.isEditMode = document.body.classList.contains('edit-mode-active');

            if (this.isEditMode && !wasEditMode) {
                this.enableResizing();
            } else if (!this.isEditMode && wasEditMode) {
                this.disableResizing();
            }
        });

        observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

        // Check initial state
        this.isEditMode = document.body.classList.contains('edit-mode-active');
        if (this.isEditMode) this.enableResizing();

        // Load saved dimensions
        this.loadDimensions();

        // Mouse events for resizing
        document.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        document.addEventListener('mouseup', () => this.handleMouseUp());
    }

    enableResizing() {
        // Target specific elements that usually need resizing
        const targets = document.querySelectorAll('img, .service-card, .gallery-item, .feature-item, .visual-card');
        targets.forEach(el => {
            if (el.closest('.cp-sidebar')) return;
            this.addHandles(el);
        });
    }

    disableResizing() {
        const handles = document.querySelectorAll('.resize-handle');
        handles.forEach(h => h.remove());

        const targets = document.querySelectorAll('.resizable-element');
        targets.forEach(el => {
            el.classList.remove('resizable-element');
            // Revert position if we added it
            if (el.dataset.originalPosition === 'static') {
                el.style.position = '';
            }
            delete el.dataset.originalPosition;
        });
    }

    addHandles(el) {
        if (el.classList.contains('resizable-element')) return;

        el.classList.add('resizable-element');

        // Ensure positioning
        const style = window.getComputedStyle(el);
        if (style.position === 'static') {
            el.dataset.originalPosition = 'static';
            el.style.position = 'relative';
        }

        const positions = ['nw', 'ne', 'sw', 'se'];
        positions.forEach(pos => {
            const handle = document.createElement('div');
            handle.className = `resize-handle handle-${pos}`;
            handle.dataset.handle = pos;

            handle.addEventListener('mousedown', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.startResizing(el, pos, e);
            });

            el.appendChild(handle);
        });
    }

    startResizing(el, handle, e) {
        this.resizingElement = el;
        this.currentHandle = handle;

        const rect = el.getBoundingClientRect();
        this.startWidth = rect.width;
        this.startHeight = rect.height;
        this.startX = e.clientX;
        this.startY = e.clientY;

        el.classList.add('is-resizing');
        document.body.style.cursor = window.getComputedStyle(e.target).cursor;
    }

    handleMouseMove(e) {
        if (!this.resizingElement) return;

        const dx = e.clientX - this.startX;
        const dy = e.clientY - this.startY;

        let newWidth = this.startWidth;
        let newHeight = this.startHeight;

        if (this.currentHandle.includes('e')) {
            newWidth = this.startWidth + dx;
        } else if (this.currentHandle.includes('w')) {
            newWidth = this.startWidth - dx;
        }

        if (this.currentHandle.includes('s')) {
            newHeight = this.startHeight + dy;
        } else if (this.currentHandle.includes('n')) {
            newHeight = this.startHeight - dy;
        }

        // Min constraints
        newWidth = Math.max(50, newWidth);
        newHeight = Math.max(50, newHeight);

        this.resizingElement.style.width = `${newWidth}px`;

        // Only update height if handle is vertical or element is an image
        if (this.currentHandle.includes('n') || this.currentHandle.includes('s')) {
            this.resizingElement.style.height = `${newHeight}px`;
        } else if (this.resizingElement.tagName === 'IMG') {
            // Keep height auto for images if only width changed to preserve aspect ratio
            this.resizingElement.style.height = 'auto';
        }
    }

    handleMouseUp() {
        if (this.resizingElement) {
            this.saveDimensions(this.resizingElement);
            this.resizingElement.classList.remove('is-resizing');
            this.resizingElement = null;
            document.body.style.cursor = '';
        }
    }

    // Reuse getPath logic from content-editor.js or define locally
    getPath(element) {
        if (element.id !== '') return "#" + element.id;
        if (element === document.body) return element.tagName.toLowerCase();

        let ix = 0;
        let siblings = element.parentNode.childNodes;
        for (let i = 0; i < siblings.length; i++) {
            let sibling = siblings[i];
            if (sibling === element) return this.getPath(element.parentNode) + '>' + element.tagName.toLowerCase() + ':nth-child(' + (ix + 1) + ')';
            if (sibling.nodeType === 1 && sibling.tagName === element.tagName) ix++;
        }
    }

    saveDimensions(el) {
        const path = this.getPath(el);
        const data = this.getAllDimensions();

        data[path] = {
            width: el.style.width,
            height: el.style.height
        };

        localStorage.setItem('site-element-dimensions', JSON.stringify(data));
    }

    getAllDimensions() {
        const saved = localStorage.getItem('site-element-dimensions');
        return saved ? JSON.parse(saved) : {};
    }

    loadDimensions() {
        const data = this.getAllDimensions();
        Object.keys(data).forEach(selector => {
            try {
                const el = document.querySelector(selector);
                if (el) {
                    el.style.width = data[selector].width;
                    if (data[selector].height !== 'auto') {
                        el.style.height = data[selector].height;
                    }
                }
            } catch (e) {
                console.error('Error loading dimensions for', selector, e);
            }
        });
    }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    window.resizeManager = new ElementResizer();
});
