/**
 * OSINT Platform - Reports Module
 * PDF/CSV download and report management.
 */

// Download PDF report
function downloadPDFReport(module = 'all') {
    const url = getApiUrl(`/api/reports/pdf?module=${module}`);
    window.open(url, '_blank');
    showToast('PDF rapor oluşturuluyor...', 'info');
}

// Download CSV report
function downloadCSVReport(module = 'osint') {
    const url = getApiUrl(`/api/reports/csv?module=${module}`);
    window.open(url, '_blank');
    showToast('CSV dosyası indiriliyor...', 'info');
}

// Generic download function (called from sidebar)
function downloadReport(format) {
    if (format === 'pdf') {
        downloadPDFReport('all');
    } else {
        // Show a module selector for CSV
        const module = prompt('CSV modülü seçin (osint, disinfo, conflicts, cyber):', 'osint');
        if (module) {
            downloadCSVReport(module.trim().toLowerCase());
        }
    }
}

/**
 * Export AI Briefing as PDF
 * Calls the backend to generate a styled PDF from markdown
 */
async function exportBriefingPDF() {
    const markdown = window.currentBriefingMarkdown;
    if (!markdown) {
        if (typeof showToast === 'function') showToast('İndirilecek briefing bulunamadı.', 'warning');
        return;
    }

    if (typeof showToast === 'function') showToast('PDF raporu oluşturuluyor...', 'info');

    try {
        const response = await fetch(getApiUrl('/api/reports/briefing/pdf'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ markdown })
        });

        if (!response.ok) throw new Error('PDF oluşturma hatası');

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `intelligence-briefing-${Date.now()}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        if (typeof showToast === 'function') showToast('PDF başarıyla indirildi.', 'success');
    } catch (err) {
        console.error('PDF export error:', err);
        if (typeof showToast === 'function') showToast('PDF indirilirken hata oluştu.', 'error');
    }
}
