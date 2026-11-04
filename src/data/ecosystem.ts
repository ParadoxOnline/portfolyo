export interface InsightArticle {
  slug: string;
  category: "GEO / Yapay Zeka Arama" | "Ajans Modelleri" | "Core Web Vitals" | "Lokal SEO";
  title: string;
  summary: string;
  readTime: string;
  date: string;
  author: string;
  tags: string[];
  content: string[];
  marketCaseStudy: {
    clientType: string;
    challenge: string;
    appliedSolution: string;
    concreteResult: string;
  };
  codeSnippet?: {
    language: string;
    code: string;
    caption: string;
  };
  keyTakeaways: string[];
  ctaText: string;
}

export const INSIGHTS_DATA: InsightArticle[] = [
  {
    slug: "geo-generative-engine-optimization-ajans-rehberi",
    category: "GEO / Yapay Zeka Arama",
    title: "GEO (Generative Engine Optimization): ChatGPT ve Perplexity'de Kaynak Gösterilme Stratejisi",
    summary: "Arama motoru trafiği artık sadece mavi linklerden ibaret değil. Yapay zeka motorlarının sitenizi birincil kaynak olarak önermesini sağlayan Schema.org ve JSON-LD altyapısı.",
    readTime: "5 dk okuma",
    date: "Kasım 2026",
    author: "Sabri Can Tütüncü",
    tags: ["GEO", "Yapay Zeka SEO", "Perplexity", "Schema.org", "LLM Algoritmaları"],
    content: [
      "2026 yılında organik arama trafiğinin önemli bir bölümü doğrudan ChatGPT Search, Perplexity ve Claude gibi LLM tabanlı arama katmanlarından geçiyor. Klasik meta etiketler artık yapay zekayı kaynak göstermeye ikna etmek için yetersiz kalıyor.",
      "Yapay zeka modelleri web sayfalarını tararken geleneksel PageRank sinyalleri yerine bilgi yoğunluğu (Information Density), anlamsal varlık ilişkileri (Entity Relationships) ve yapılandırılmış veri tutarlılığını analiz eder.",
      "Sitenizin AI motorları tarafından doğrudan alıntılanması (citation) için 3 kritik katman gerekir: (1) Anlamsal hiyerarşi ve net soru-cevap blokları, (2) Derin Entity bağlamı içeren JSON-LD mikro verisi (SameAs, Wikidata, About referansları), (3) 0.5 saniyenin altında dönen hafif HTML yanıtları.",
      "Bu yaklaşımı uyguladığımız platformlarda yapay zeka arama motorlarının tarama sıklığı ve doğrudan kaynak gösterme oranları standart sayfalara kıyasla 4 kattan fazla artış göstermektedir."
    ],
    marketCaseStudy: {
      clientType: "Medikal Estetik & Sağlık Kliniği",
      challenge: "Perplexity ve ChatGPT'de 'İzmir'de en iyi zirkonyum implant klinikleri' sorgusunda rakip portalların çıkması, kliniğin web sitesinin ise AI yanıtlarında hiç yer almaması.",
      appliedSolution: "Klasik WordPress sayfasına Wikidata (Q1827471) entity bağlantılı MedicalClinic şeması, doktor biyografilerine SameAs LinkedIn/ORCID profilleri ve doğrudan soru-cevap FAQPage JSON-LD enjeksiyonu yapıldı.",
      concreteResult: "3 hafta içinde Perplexity ve ChatGPT Search yanıtlarında klinik adı doğrudan 1 numaralı kaynak link olarak alıntılanmaya başladı; organik randevu talebi %180 arttı."
    },
    codeSnippet: {
      language: "json",
      caption: "Yapay zeka modellerinin tanıdığı ve güvendiği örnek JSON-LD Entity yapısı",
      code: `{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://example.com/#website",
      "url": "https://example.com",
      "name": "Klinik Portalı",
      "publisher": { "@id": "https://example.com/#organization" }
    },
    {
      "@type": "MedicalClinic",
      "@id": "https://example.com/#organization",
      "name": "Örnek Klinik",
      "sameAs": [
        "https://www.wikidata.org/wiki/Q...",
        "https://linkedin.com/company/..."
      ]
    }
  ]
}`
    },
    keyTakeaways: [
      "Metinleri yüzeysel doldurma yerine net soru-cevap ve kanıt bloklarıyla zenginleştirin.",
      "Her ana sayfaya schema.org grafiği ekleyin ve Wikidata varlıklarıyla eşleştirin.",
      "AI botlarının tarama bütçesi için TTFB süresini 300 milisaniyenin altında tutun."
    ],
    ctaText: "Web sitenizi GEO ve yapay zeka aramalarına uyumlu hale getirelim →"
  },
  {
    slug: "elementor-ve-wordpress-inp-lcp-hiz-optimizasyonu",
    category: "Core Web Vitals",
    title: "WordPress & Elementor Sitelerinde 100/100 Core Web Vitals: INP ve LCP Darboğazını Kırma",
    summary: "Şişkin DOM yapıları, render engelleyen CSS dosyaları ve veritabanı kilitlenmelerini ortadan kaldırarak açılış süresini 1.2 saniyenin altına indiren teknik formül.",
    readTime: "6 dk okuma",
    date: "Ekim 2026",
    author: "Sabri Can Tütüncü",
    tags: ["Core Web Vitals", "LiteSpeed", "Elementor", "LCP", "INP", "Hız"],
    content: [
      "Web ajanslarının en sık karşılaştığı teslimat sorunlarından biri, tasarım tamamlandığında sitenin PageSpeed testinde kırmızı (20-40 puan) çıkmasıdır. Reklam trafiğinde her 1 saniyelik gecikme ortalama %20 dönüşüm kaybı yaratır.",
      "Elementor gibi sayfa yapıcılar varsayılan olarak her eleman için çok sayıda iç içe div (`elementor-widget-wrap`, `elementor-container`) üretir. Bu durum mobil cihazlarda DOM düğüm sayısını 2.500'ün üzerine çıkararak Interaction to Next Paint (INP) gecikmelerine yol açar.",
      "Çözüm: Gereksiz Elementor container iç içeliklerini temizlemek, FontAwesome ve Google Fonts çağrılarını yerel self-host'a almak, kritik CSS'i inline enjekte edip LiteSpeed Object Cache (Redis) bağlamaktır.",
      "Bu disiplin uygulandığında, harici karmaşık eklentilere ihtiyaç kalmadan 95+ puan ve 1.2s LCP seviyesine kalıcı olarak ulaşılmaktadır."
    ],
    marketCaseStudy: {
      clientType: "Mobilya & Dekorasyon E-Ticaret Markası",
      challenge: "Meta (Instagram) reklamlarından gelen mobil ziyaretçilerin %38'i sitenin 4.2 saniyede açılması yüzünden sepete gitmeden sayfayı terk ediyordu.",
      appliedSolution: "Sayfa bazında kullanılmayan 12 harici CSS dosyası dequeue edildi, Elementor DOM budama filtresi yazıldı ve LiteSpeed Web ADC Redis önbelleklemesi devreye alındı.",
      concreteResult: "Mobil PageSpeed skoru 32'den 96'ya çıktı; LCP süresi 1.1 saniyeye geriledi. Reklam dönüşüm maliyeti %24 ucuzlarken sipariş tamamlama oranı %31 arttı."
    },
    codeSnippet: {
      language: "php",
      caption: "functions.php içine eklenecek hafif DOM temizleyici filtre örneği",
      code: `// Elementor gereksiz widget wrapper derinliğini azaltma filtresi
add_filter('elementor/frontend/the_content', function ($content) {
    if (is_admin()) return $content;
    // Gereksiz boş kapsayıcıları ve yorum satırlarını temizle
    $content = preg_replace('/<!--(.|\\s)*?-->/', '', $content);
    return $content;
}, 20);`
    },
    keyTakeaways: [
      "DOM eleman sayısını 800'ün altında tutun; bu INP puanını doğrudan yeşile çeker.",
      "Harici font CDN'lerini kaldırıp woff2 formatında kendi sunucunuzdan sunun.",
      "Sayfa bazında kullanılmayan CSS dosyalarını dequeue edin."
    ],
    ctaText: "Mevcut yavaş WordPress sitenizi 48 saatte yeşile çevirelim →"
  },
  {
    slug: "ajanslar-icin-white-label-gelistirici-modeli",
    category: "Ajans Modelleri",
    title: "Ajansların Büyümesini Engelleyen Yazılımcı Darboğazı ve White-Label Çözüm",
    summary: "İçeride tam zamanlı yazılımcı istihdamının yüksek sabit maliyeti yerine, proje bazlı çalışan bağımsız uzmanlarla teslimat kapasitesini ölçeklendirmenin matematiği.",
    readTime: "4 dk okuma",
    date: "Ekim 2026",
    author: "Sabri Can Tütüncü",
    tags: ["Ajans Yönetimi", "White-Label", "Maliyet Tasarrufu", "Operasyonel Ölçek"],
    content: [
      "Bir dijital ajansın satış kapasitesi yüksek olsa bile teslimat darboğazına girmesi sıkça yaşanan bir krizdir. Tam zamanlı kıdemli bir yazılımcının donanım, SGK, vergi ve yan hak maliyetleri ajansın nakit akışını zorlayabilir.",
      "White-Label geliştirici modelinde ajans müşteri iletişimini, teklif yönetimini ve faturalandırmayı tamamen kendi markası altında tutar. Kodlama, Core Web Vitals optimizasyonu, lokal SEO ve özel web panelleri ise uzman dış kaynak tarafından teslim edilir.",
      "Bu sayede ajans sıfır sabit SGK/donanım maliyetiyle sadece iş geldikçe gider yazar ve her projede kusursuz teknik teslimat güvencesine sahip olur."
    ],
    marketCaseStudy: {
      clientType: "7 Kişilik Dijital Tasarım & Reklam Ajansı",
      challenge: "Aylık 4 yeni kurumsal web sitesi satışı yapılmasına rağmen içerideki tek yazılımcının yetişememesi nedeniyle müşteri teslimatlarının 3 ay gecikmesi ve iptaller yaşanması.",
      appliedSolution: "Ajansla NDA imzalanarak White-Label geliştirici ortaklığına geçildi. Figma tasarımları doğrudan 48 saatte canlı staging'e aktarılıp 90+ PageSpeed ile teslim edildi.",
      concreteResult: "Ajans hiç yeni personel almadan aylık teslimat kapasitesini 3 katına çıkardı; teslim gecikmesi kaynaklı ciro kaybı sıfırlandı."
    },
    codeSnippet: {
      language: "text",
      caption: "Ajans & Geliştirici Teslimat Protokolü",
      code: `1. Brief & Figma Tasarımı Onayı
2. 48 Saat İçinde Canlı Demo Ortamı (Staging)
3. Core Web Vitals 90+ & Schema JSON-LD Entegrasyonu
4. Müşteri Onayı Sonrası Ajans Sunucusuna 0-Kesinti Canlıya Alma
5. 30 Günlük Garanti & Hata Giderme Desteği`
    },
    keyTakeaways: [
      "Sabit personel maliyetini esnek proje giderine çevirerek nakit akışınızı koruyun.",
      "Müşterinize 'kodlama hazır, PageSpeed 95+' güvencesi vererek satış kapatma oranınızı artırın.",
      "Tüm süreç gizlilik sözleşmesi (NDA) ve ajansınızın adı altında yürütülür."
    ],
    ctaText: "Web teslimatlarınızı White-Label olarak devralalım →"
  },
  {
    slug: "lokal-seo-ve-programatik-sayfa-mimarisi",
    category: "Lokal SEO",
    title: "Lokal SEO'da Bölgesel Hakimiyet: Kelime Yamyamlığı Olmadan Çoklu Konum Mimarisi",
    summary: "Hizmet sektörleri, sanayi firmaları ve klinikler için kelime çakışması (cannibalization) olmadan programatik açılış sayfası kurma kuralları.",
    readTime: "5 dk okuma",
    date: "Eylül 2026",
    author: "Sabri Can Tütüncü",
    tags: ["Lokal SEO", "Programatik SEO", "Bölgesel Arama", "Google Haritalar"],
    content: [
      "Yerel hizmet sunan işletmeler (hukuk büroları, diş klinikleri, teknik servisler) ana lokasyon dışında çevre ilçelerden de müşteri çekmek ister. Ancak tek tek kopyala-yapıştır ile 30 farklı ilçe sayfası açmak Google tarafından spam sayılır ve sıralamaları düşürür.",
      "Programatik ve temiz lokal mimaride her açılış sayfası o bölgeye özel dinamik unsurlarla donatılır: gerçek coğrafi koordinatlar, o bölgeye ait müşteri referansları, dinamik SSS blokları ve özgünleştirilmiş Schema haritaları.",
      "Böylece tek bir alan adında kelime çakışması yaşanmadan birden fazla lokasyonda organik ilk sayfa sıralaması elde edilir."
    ],
    marketCaseStudy: {
      clientType: "Sanayi Tipi İklimlendirme & Soğutma Firması",
      challenge: "Firma sadece merkez ilçede sıralama alabiliyordu; Torbalı, Kemalpaşa ve Manisa OSB gibi sanayi bölgelerindeki fabrika aramalarında tamamen görünmezdi.",
      appliedSolution: "Her sanayi bölgesi için benzersiz GeoCoordinates, areaServed şeması ve o sanayi dalına özel teknik parametre tabloları içeren dinamik konum şablonu kuruldu.",
      concreteResult: "30 gün içinde hedef 8 sanayi bölgesinde ilk 3 sıraya girildi; B2B fabrika bakım teklifi taleplerinde %340 artış kaydedildi."
    },
    codeSnippet: {
      language: "json",
      caption: "Lokal işletmeler için Coğrafi Koordinat ve Hizmet Alanı Şeması",
      code: `{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Örnek Sanayi İklimlendirme",
  "areaServed": ["Kemalpaşa OSB", "Torbalı", "Aliağa"],
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 38.4237,
    "longitude": 27.1428
  }
}`
    },
    keyTakeaways: [
      "Kopyala-yapıştır ilçe sayfaları yerine dinamik veri beslemeli şablonlar kullanın.",
      "Google Haritalar CID ve CID bağlantısını LocalBusiness şemasına mutlaka ekleyin.",
      "Her sayfanın soru-cevap bölümünü o ilçenin gerçek arama sorgularına göre uyarlayın."
    ],
    ctaText: "İşletmenizin bölgesel arama görünürlüğünü güçlendirelim →"
  }
];
