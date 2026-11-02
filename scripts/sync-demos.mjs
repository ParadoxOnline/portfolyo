import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Portfolyonun public/demos klasörü
const DEMOS_DIR = path.join(__dirname, '../public/demos');

// XAMPP htdocs klasörünüz
const HTDOCS_DIR = path.join(__dirname, '../../');

// Hangi projelerin statik çıktıları portfolyoya kopyalanacak?
// Her proje için kaynak (source) klasörü ve hedef (target) klasörünü belirliyoruz.
const projectsToSync = [
  {
    slug: 'arama',
    // Next.js projelerinde 'next build' sonrası 'out' klasörü oluşur (next.config.js'de output: 'export' ayarlıysa)
    source: path.join(HTDOCS_DIR, 'arama', 'out'),
    target: path.join(DEMOS_DIR, 'arama')
  },
  {
    slug: 'drop',
    source: path.join(HTDOCS_DIR, 'drop', 'out'),
    target: path.join(DEMOS_DIR, 'drop')
  },
  {
    slug: 'osint-platform',
    source: path.join(HTDOCS_DIR, 'osint-platform', 'public'),
    target: path.join(DEMOS_DIR, 'osint-platform')
  },
  {
    slug: 'sitebuilder',
    // PHP projeleri için eğer saf HTML/CSS/JS ise direkt ana klasörü veya build klasörünü kopyalayabilirsiniz
    // Not: PHP dosyaları Vercel'de çalışmaz. Çalışması için statik HTML olarak dışa aktarılmaları gerekir.
    source: path.join(HTDOCS_DIR, 'sitebuilder', 'output'),
    target: path.join(DEMOS_DIR, 'sitebuilder')
  }
];

console.log("🚀 Portfolyo Demo Senkronizasyonu Başlıyor...\n");

if (!fs.existsSync(DEMOS_DIR)) {
  fs.mkdirSync(DEMOS_DIR, { recursive: true });
}

let successCount = 0;

projectsToSync.forEach(project => {
  console.log(`\n📦 Proje işleniyor: ${project.slug}`);
  
  if (!fs.existsSync(project.source)) {
    console.error(`❌ Kaynak klasör bulunamadı: ${project.source}`);
    console.error(`   Lütfen önce '${project.slug}' projesi için derleme (build/export) işlemini yapın.`);
    return;
  }

  try {
    // Varsa eski demoyu sil
    if (fs.existsSync(project.target)) {
      fs.rmSync(project.target, { recursive: true, force: true });
    }
    
    // Yeni derlemeyi kopyala
    fs.cpSync(project.source, project.target, { recursive: true });
    
    // DEMO MODU MOCK (SAHTE VERİ) ENJEKSİYONU
    // Kopyalanan html dosyalarının içine otomatik olarak window.fetch'i ezen bir script ekle
    const targetHtmlPath = path.join(project.target, 'index.html');
    if (fs.existsSync(targetHtmlPath)) {
      let htmlContent = fs.readFileSync(targetHtmlPath, 'utf8');
      
      const mockScript = `
        <script>
          // DEMO MODE MOCK INJECTED BY PORTFOLIO SYNC
          console.log("[Demo Mode] Initializing Service Mocking...");
          const originalFetch = window.fetch;
          window.fetch = async function(...args) {
            const url = typeof args[0] === 'string' ? args[0] : args[0].url;
            
            // Eğer bir API isteği ise, sahte (mock) veri döndür.
            if (url.includes('/api/') || url.includes('localhost') || url.includes('.php')) {
              console.log("[Demo Mode] Intercepted API request to: ", url);
              
              // Projeye göre otomatik sahte yanıtlar:
              let mockData = { success: true, status: 'success', message: 'This is mocked data for the demo.' };
              
              if (url.includes('briefing/generate')) {
                 mockData = {
                   success: true,
                   markdown: "### 🤖 AI Executive Briefing (Demo)\\n\\n**Global Security Status:** Operational\\n\\n- **Cyber Threats:** Blocked 142 malicious payloads.\\n- **OSINT:** 3 critical mentions analyzed in dark web forums.\\n- **Conflicts:** Monitoring 2 high-risk zones.\\n\\n*Note: This is simulated offline data since the portfolio is in static demo mode.*"
                 };
              }
              else if (url.includes('collect') || url.includes('process') || url.includes('analyze')) {
                 mockData = {
                   success: true,
                   results: {
                     new: 42,
                     updated: 12,
                     analyzed: 142,
                     events_created: 3,
                     stored: 15,
                     osintResults: { new: 42 },
                     disinfoResults: { analyzed: 142 },
                     conflictResults: { events_created: 3 },
                     cyberResults: { stored: 15 }
                   },
                   message: "Veri toplama ve analiz tamamlandı (Demo)"
                 };
              }
              else if (url.includes('threat') || url.includes('osint') || url.includes('items')) {
                 mockData = { 
                   success: true,
                   items: [
                     { id: 1, title: "DarkWeb Forum Sızıntısı", title_tr: "Kritik Sızıntı Tespit Edildi", risk_score: 95, sentiment_score: -0.8, collected_at: new Date().toISOString(), source: "DarkWeb", detected_language: "EN" },
                     { id: 2, title: "DDoS Attack Planned", title_tr: "DDoS Planlaması", risk_score: 80, sentiment_score: -0.5, collected_at: new Date().toISOString(), source: "Telegram", detected_language: "RU" }
                   ],
                   threats: [
                     { id: 1, type: "DDoS", source: "192.168.1.1", status: "Blocked" },
                     { id: 2, type: "Malware", source: "DarkWeb Node", status: "Analyzed" }
                   ],
                   data: [],
                   systemHealth: "Optimal",
                   activeNodes: 142
                 };
              }
              else if (url.includes('dashboard') || url.includes('stats')) {
                 mockData = {
                    success: true,
                    stats: { total: 100, active: 50 },
                    osint_count: 342,
                    cyber_count: 120,
                    disinfo_count: 45
                 };
              }
              else if (url.includes('graph')) {
                 mockData = {
                    success: true,
                    nodes: [
                      { id: 1, label: "OSINT Hub", group: "core", title: "Central Command" },
                      { id: 2, label: "DDoS Activity", group: "type", title: "Cyber Threat" },
                      { id: 3, label: "DarkWeb Forum", group: "source", title: "Source Node" },
                      { id: 4, label: "Malware Payload", group: "keyword", title: "Suspicious Payload" },
                      { id: 5, label: "Botnet C&C", group: "source", title: "Command Server" },
                      { id: 6, label: "192.168.x.x", group: "default", title: "Attacker IP" }
                    ],
                    edges: [
                      { from: 1, to: 2 },
                      { from: 1, to: 3 },
                      { from: 2, to: 6 },
                      { from: 3, to: 4 },
                      { from: 3, to: 5 },
                      { from: 5, to: 6, dashes: true }
                    ]
                 };
              }
              
              return new Response(JSON.stringify(mockData), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
              });
            }
            // Normal (statik dosya) istekleri için orijinal fetch'i kullan
            return originalFetch.apply(this, args);
          };
        </script>
      `;
      
      // Scripti <head> etiketinin hemen içine yerleştir (yoksa body başına koy)
      if (htmlContent.includes('<head>')) {
        htmlContent = htmlContent.replace('<head>', '<head>\\n' + mockScript);
      } else {
        htmlContent = mockScript + htmlContent;
      }
      
      fs.writeFileSync(targetHtmlPath, htmlContent, 'utf8');
      console.log(`✅ Demo Mocking enjekte edildi: ${project.slug}`);
    }

    console.log(`✅ Başarıyla senkronize edildi: /demos/${project.slug}`);
    successCount++;
  } catch (error) {
    console.error(`❌ Kopyalama hatası (${project.slug}):`, error.message);
  }
});

console.log(`\n🎉 Senkronizasyon tamamlandı! Toplam ${successCount}/${projectsToSync.length} proje portfolyoya aktarıldı.`);
console.log("Artık Vercel'e push yaptığınızda bu statik demolar da yayında olacak.");
