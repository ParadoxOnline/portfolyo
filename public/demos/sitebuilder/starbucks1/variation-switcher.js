/**
 * Variation Switcher
 * Adds inline navigation buttons to switch between template variations in real-time.
 */

document.addEventListener('DOMContentLoaded', () => {
    const isEdit = window.location.search.indexOf('edit=true') !== -1;
    if (isEdit) sessionStorage.setItem('site_edit_mode', 'true');
    if (!isEdit && sessionStorage.getItem('site_edit_mode') !== 'true') {
        if (window.initAllSiteFeatures) window.initAllSiteFeatures();
        return;
    }
    initVariationSwitcher();
    // Initial call to ensure sliders are up if they exist in base template
    if (window.initAllSiteFeatures) window.initAllSiteFeatures();
});

async function initVariationSwitcher() {
    const sections = document.querySelectorAll('[data-section-type]');

    if (sections.length === 0) return;

    // Load available variations map
    const variations = await loadVariationsMap();
    if (!variations) return;

    sections.forEach(section => {
        addSwitcherControls(section, variations);
    });
}

async function loadVariationsMap() {
    try {
        const response = await fetch('../../api/variations.php');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Failed to load variations:', error);
        return null;
    }
}

function addSwitcherControls(section, variationsMap) {
    const type = section.dataset.sectionType;
    const currentId = section.dataset.variationId;

    // Get list of variations for this type
    const typeVariations = variationsMap[type];
    if (!typeVariations || typeVariations.length <= 1) return;

    // Sort by number to ensure correct order
    typeVariations.sort((a, b) => a.number - b.number);

    // Find current index
    let currentIndex = typeVariations.findIndex(v => v.id === currentId);
    if (currentIndex === -1) currentIndex = 0;

    // Create container for controls
    const controls = document.createElement('div');
    controls.className = 'variation-controls';

    // Previous Button
    const prevBtn = document.createElement('button');
    prevBtn.className = 'variation-arrow variation-prev';
    prevBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>';
    prevBtn.onclick = () => switchVariation(section, type, typeVariations, currentIndex - 1);

    // Next Button
    const nextBtn = document.createElement('button');
    nextBtn.className = 'variation-arrow variation-next';
    nextBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>';
    nextBtn.onclick = () => switchVariation(section, type, typeVariations, currentIndex + 1);

    // Label
    const label = document.createElement('div');
    label.className = 'variation-label';
    label.textContent = `${typeVariations[currentIndex].description || currentId} (${currentIndex + 1}/${typeVariations.length})`;

    // Append to section (needs relative positioning)
    if (getComputedStyle(section).position === 'static') {
        section.style.position = 'relative';
    }

    controls.appendChild(prevBtn);
    controls.appendChild(label);
    controls.appendChild(nextBtn);
    section.appendChild(controls);
}

async function switchVariation(section, type, variations, newIndex) {
    // Handle wrap-around
    if (newIndex < 0) newIndex = variations.length - 1;
    if (newIndex >= variations.length) newIndex = 0;

    const nextVariation = variations[newIndex];

    // Show loading state
    const label = section.querySelector('.variation-label');
    const originalText = label.textContent;
    label.textContent = 'Yükleniyor...';
    section.classList.add('variation-loading');

    try {
        // Fetch new HTML
        const response = await fetch(`../../api/variation-html.php?type=${type}&id=${nextVariation.id}&slug=${SITE_SLUG}`);
        const data = await response.json();

        if (data.success) {
            // Create a temp div to parse HTML
            const temp = document.createElement('div');
            temp.innerHTML = data.html;

            const newSection = temp.firstElementChild;

            // Transfer attributes ensuring data attributes are set
            newSection.dataset.sectionType = type;
            newSection.dataset.variationId = nextVariation.id;

            // Replace in DOM
            section.replaceWith(newSection);

            // Important: Re-initialize slider/animations for new section
            if (window.initAllSiteFeatures) window.initAllSiteFeatures();

            // Re-initialize controls for the new section
            // We need to pass the full map, but we can reuse the type array we have
            const map = {};
            map[type] = variations;
            addSwitcherControls(newSection, map);

            if (window.syncVariationToServer) {
                window.syncVariationToServer(type, nextVariation.id);
            }

            // Trigger any initialization scripts if needed (e.g., sliders)
            // dispatchEvent(new CustomEvent('variationChange', { detail: { type, id: nextVariation.id } }));

            // Smooth scroll to top of section if it changed size significantly
            // newSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    } catch (error) {
        console.error('Switch failed:', error);
        label.textContent = 'Hata!';
        setTimeout(() => label.textContent = originalText, 2000);
        section.classList.remove('variation-loading');
    }
}
