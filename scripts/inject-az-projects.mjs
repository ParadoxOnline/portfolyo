import fs from 'fs';

let p = fs.readFileSync('src/data/projects.ts', 'utf8');

// LIOS
p = p.replace(
  `shortDescription: {
      en: "A local business intelligence and SEO automation engine — 25 distinct services, one Clean Architecture.",
      tr: "25 farklı servis, tek bir Clean Architecture yapısı içinde; yerel işletme zekası ve SEO otomasyon motoru.",
    },`,
  `shortDescription: {
      en: "A local business intelligence and SEO automation engine — 25 distinct services, one Clean Architecture.",
      tr: "25 farklı servis, tek bir Clean Architecture yapısı içinde; yerel işletme zekası ve SEO otomasyon motoru.",
      az: "25 fərqli servis, vahid Clean Architecture strukturu daxilində; yerli biznes intellekti və SEO avtomatlaşdırma mühərriki.",
    },`
);

p = p.replace(
  `whyItMatters: {
      en: "This project demonstrates the ability to reason about SEO as a software architecture problem rather than only a content operation. It requires deep integration with Google APIs, Clean Architecture, and background automation.",
      tr: "Bu proje, SEO'yu sadece bir içerik operasyonu olarak değil, bir yazılım mimarisi problemi olarak ele alma yeteneğini gösterir. Google API'leri ile derin entegrasyon, Clean Architecture ve arka plan otomasyonu gerektirir.",
    },`,
  `whyItMatters: {
      en: "This project demonstrates the ability to reason about SEO as a software architecture problem rather than only a content operation. It requires deep integration with Google APIs, Clean Architecture, and background automation.",
      tr: "Bu proje, SEO'yu sadece bir içerik operasyonu olarak değil, bir yazılım mimarisi problemi olarak ele alma yeteneğini gösterir. Google API'leri ile derin entegrasyon, Clean Architecture ve arka plan otomasyonu gerektirir.",
      az: "Bu layihə, SEO-nu sadəcə məzmun əməliyyatı kimi deyil, proqram təminatı memarlığı problemi kimi həll etmə bacarığını nümayiş etdirir. Google API-ləri, Clean Architecture və arxa plan avtomatlaşdırması ilə dərin inteqrasiya tələb edir.",
    },`
);

// SENTIOPULSE (gen)
p = p.replace(
  `shortDescription: {
      en: "A multi-source pain signal ingestion platform that clusters community complaints using vector search and AI.",
      tr: "Topluluk şikayetlerini vektör arama ve yapay zeka kullanarak kümeleyen ağrı sinyali platformu.",
    },`,
  `shortDescription: {
      en: "A multi-source pain signal ingestion platform that clusters community complaints using vector search and AI.",
      tr: "Topluluk şikayetlerini vektör arama ve yapay zeka kullanarak kümeleyen ağrı sinyali platformu.",
      az: "İcma şikayətlərini vektor axtarışı və süni intellekt vasitəsilə qruplaşdıran çoxmənbəli problem siqnalı platforması.",
    },`
);

p = p.replace(
  `whyItMatters: {
      en: "Demonstrates the ability to design and reason about a multi-layer data pipeline with vector search, event streaming, and AI-scoring — not just CRUD applications.",
      tr: "Vektör arama ve olay akışına sahip çok katmanlı bir veri hattı tasarlama yeteneğini gösterir.",
    },`,
  `whyItMatters: {
      en: "Demonstrates the ability to design and reason about a multi-layer data pipeline with vector search, event streaming, and AI-scoring — not just CRUD applications.",
      tr: "Vektör arama ve olay akışına sahip çok katmanlı bir veri hattı tasarlama yeteneğini gösterir.",
      az: "Sadəcə CRUD deyil, vektor axtarışı, hadisə axını (event streaming) və AI qiymətləndirməsinə malik çoxqatlı məlumat xətti qurma bacarığını göstərir.",
    },`
);

// MAÇAGEL
p = p.replace(
  `shortDescription: {
      en: "A mobile platform for discovering and organizing amateur football matches — replacing WhatsApp chaos.",
      tr: "Amatör futbol maçlarını keşfetmek ve organize etmek için mobil platform.",
    },`,
  `shortDescription: {
      en: "A mobile platform for discovering and organizing amateur football matches — replacing WhatsApp chaos.",
      tr: "Amatör futbol maçlarını keşfetmek ve organize etmek için mobil platform.",
      az: "Həvəskar futbol oyunlarını kəşf etmək və təşkil etmək üçün mobil platforma — WhatsApp xaosuna son qoyur.",
    },`
);

p = p.replace(
  `whyItMatters: {
      en: "Shows the developer can ship a full mobile product with real backend, push notifications, and App Store deployment.",
      tr: "Gerçek backend ve anlık bildirimlerle App Store'a ürün teslim etme yeteneğini gösterir.",
    },`,
  `whyItMatters: {
      en: "Shows the developer can ship a full mobile product with real backend, push notifications, and App Store deployment.",
      tr: "Gerçek backend ve anlık bildirimlerle App Store'a ürün teslim etme yeteneğini gösterir.",
      az: "Real backend, push bildirişlər və App Store yayımı ilə tam mobil məhsulu sıfırdan təhvil vermə bacarığını sübut edir.",
    },`
);

// VELODRAPE 3D (tekstil)
p = p.replace(
  `shortDescription: {
      en: "Web-based 3D virtual clothing try-on using webcam and TensorFlow.js.",
      tr: "Web kamerası ve TensorFlow.js ile tarayıcı içi 3D sanal kıyafet deneme motoru.",
    },`,
  `shortDescription: {
      en: "Web-based 3D virtual clothing try-on using webcam and TensorFlow.js.",
      tr: "Web kamerası ve TensorFlow.js ile tarayıcı içi 3D sanal kıyafet deneme motoru.",
      az: "Veb kamera və TensorFlow.js ilə brauzer daxilində işləyən real vaxtlı 3D virtual geyim yoxlama mühərriki.",
    },`
);

p = p.replace(
  `whyItMatters: { 
      en: "", 
      tr: "E-ticarette iade oranlarını düşürmek ve kullanıcı deneyimini zirveye taşımak için tarayıcı üzerinde GPU hızlandırmalı 3D giydirme teknolojisi." 
    },`,
  `whyItMatters: { 
      en: "GPU-accelerated browser-based 3D try-on reducing e-commerce returns.", 
      tr: "E-ticarette iade oranlarını düşürmek ve kullanıcı deneyimini zirveye taşımak için tarayıcı üzerinde GPU hızlandırmalı 3D giydirme teknolojisi.",
      az: "Elektron ticarətdə geri qaytarılma faizini azaltmaq üçün brauzer üzərində GPU sürətləndirilməli 3D geyim təcrübəsi." 
    },`
);

// SEARCHGRID (arama)
p = p.replace(
  `shortDescription: { en: "A scalable search infrastructure built as a Turborepo monorepo with dedicated database packages.", tr: "Özel veritabanı paketlerine sahip bir Turborepo monorepo olarak oluşturulmuş arama altyapısı." },`,
  `shortDescription: { 
      en: "A scalable search infrastructure built as a Turborepo monorepo with dedicated database packages.", 
      tr: "Özel veritabanı paketlerine sahip bir Turborepo monorepo olarak oluşturulmuş arama altyapısı.",
      az: "Xüsusi verilənlər bazası paketlərinə malik Turborepo monorepo kimi qurulmuş miqyaslana bilən axtarış infrastrukturu."
    },`
);

p = p.replace(
  `whyItMatters: { 
      en: "", 
      tr: "Bu sadece bir kod düzenleme operasyonu değildi; bir performans ve ölçeklenebilirlik devrimiydi. Yeni bir geliştiricinin sisteme adapte olması saatler değil, dakikalar alıyor. Arama hızlarındaki milisaniyelik gecikmeler ortadan kalktı ve sistem, gelecekte eklenecek binlerce yeni servisi tek satır kod çakışması olmadan kaldırabilecek altyapıya kavuştu." 
    },`,
  `whyItMatters: { 
      en: "A monorepo performance revolution eliminating query latencies and enabling seamless scaling.", 
      tr: "Bu sadece bir kod düzenleme operasyonu değildi; bir performans ve ölçeklenebilirlik devrimiydi. Yeni bir geliştiricinin sisteme adapte olması saatler değil, dakikalar alıyor. Arama hızlarındaki milisaniyelik gecikmeler ortadan kalktı ve sistem, gelecekte eklenecek binlerce yeni servisi tek satır kod çakışması olmadan kaldırabilecek altyapıya kavuştu.",
      az: "Milisaniyəlik axtarış gecikmələrini aradan qaldıran və gələcəkdə əlavə olunacaq minlərlə yeni servisi tək sətir kod toqquşması olmadan qəbul edə bilən yüksək performanslı memarlıq."
    },`
);

// CHRONOPOST (devrim)
p = p.replace(
  `shortDescription: { en: "A custom PHP-based backend system for scheduling and automating social media posts.", tr: "Sosyal medya gönderilerini zamanlamak ve otomatikleştirmek için özel PHP tabanlı arka uç sistemi." },`,
  `shortDescription: { 
      en: "A custom PHP-based backend system for scheduling and automating social media posts.", 
      tr: "Sosyal medya gönderilerini zamanlamak ve otomatikleştirmek için özel PHP tabanlı arka uç sistemi.",
      az: "Sosial media paylaşımlarını planlaşdırmaq və avtomatlaşdırmaq üçün xüsusi PHP arxa plan sistemi."
    },`
);

p = p.replace(
  `whyItMatters: { 
      en: "", 
      tr: "Sosyal medya yönetiminde insan hatasını ve gecikmeleri sıfıra indiren, arka planda saat gibi işleyen güvenilir bir dağıtım hattı." 
    },`,
  `whyItMatters: { 
      en: "A resilient background dispatcher removing human latency in social distribution.", 
      tr: "Sosyal medya yönetiminde insan hatasını ve gecikmeleri sıfıra indiren, arka planda saat gibi işleyen güvenilir bir dağıtım hattı.",
      az: "Sosial media idarəçiliyində insan xətalarını və gecikmələri sıfıra endirən, arxa planda fasiləsiz işləyən etibarlı paylama xətti."
    },`
);

// STATICFORGE (sitebuilder)
p = p.replace(
  `shortDescription: { en: "A custom programmatic site generation tool that outputs static sites based on JSON variations.", tr: "JSON varyasyonlarına dayalı olarak statik siteler çıkartan özel bir programatik site oluşturma aracı." },`,
  `shortDescription: { 
      en: "A custom programmatic site generation tool that outputs static sites based on JSON variations.", 
      tr: "JSON varyasyonlarına dayalı olarak statik siteler çıkartan özel bir programatik site oluşturma aracı.",
      az: "JSON konfiqurasiyaları əsasında minlərlə statik səhifə formalaşdıran proqramatik sayt mühərriki."
    },`
);

p = p.replace(
  `whyItMatters: { 
      en: "", 
      tr: "Tek bir şablondan binlerce benzersiz, SEO uyumlu ve ultra hızlı statik sayfa üreterek organik görünürlüğü katlayan mimari güç." 
    },`,
  `whyItMatters: { 
      en: "Scalable static generation multiplying organic search footprint from pure data.", 
      tr: "Tek bir şablondan binlerce benzersiz, SEO uyumlu ve ultra hızlı statik sayfa üreterek organik görünürlüğü katlayan mimari güç.",
      az: "Tək şablondan minlərlə unikal, SEO uyğun və yüksək sürətli statik səhifə istehsal edərək axtarış görünürlüyünü artıran güclü alət."
    },`
);

fs.writeFileSync('src/data/projects.ts', p, 'utf8');
console.log('Successfully injected Azerbaijani translations for flagship projects in projects.ts');

