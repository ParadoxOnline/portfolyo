import fs from 'fs';

let p = fs.readFileSync('src/data/projects.ts', 'utf8');

// LIOS
p = p.replace(
  `problem: {
      en: "Local businesses have no scalable path to organic search visibility. Traditional SEO is manual, one client at a time — there is no system that discovers, enriches, and ranks local business data automatically.",
      tr: "Yerel işletmelerin organik arama görünürlüğüne erişmek için ölçeklenebilir bir yolu yoktu. Geleneksel SEO tamamen manüeldi — veriyi otomatik olarak keşfeden, zenginleştiren ve sıralayan bir sistem bulunmuyordu.",
    },`,
  `problem: {
      en: "Local businesses have no scalable path to organic search visibility. Traditional SEO is manual, one client at a time — there is no system that discovers, enriches, and ranks local business data automatically.",
      tr: "Yerel işletmelerin organik arama görünürlüğüne erişmek için ölçeklenebilir bir yolu yoktu. Geleneksel SEO tamamen manüeldi — veriyi otomatik olarak keşfeden, zenginleştiren ve sıralayan bir sistem bulunmuyordu.",
      az: "Yerli bizneslərin üzvi axtarış görünürlüyü əldə etməsi üçün miqyaslana bilən yolu yox idi. Ənənəvi SEO tamamilə əl ilə aparılırdı — məlumatları avtomatik kəşf edən, zənginləşdirən və sıralayan vahid sistem mövcud deyildi.",
    },`
);

p = p.replace(
  `solution: {
      en: "LIOS builds a data-driven business graph — businesses, locations, categories, services, reviews — then runs a multi-signal SEO engine against it (keyword analysis, cannibalization detection, internal link optimization, authority scoring) and generates programmatic content pages with autonomous publish and Google indexing pipelines.",
      tr: "LIOS, işletmeleri, konumları, kategorileri, hizmetleri ve incelemeleri kapsayan veri odaklı bir iş grafiği oluşturur; ardından çok sinyalli bir SEO motoru çalıştırır ve programatik içerik sayfalarını özerk biçimde yayımlayarak Google'a gönderir.",
    },`,
  `solution: {
      en: "LIOS builds a data-driven business graph — businesses, locations, categories, services, reviews — then runs a multi-signal SEO engine against it (keyword analysis, cannibalization detection, internal link optimization, authority scoring) and generates programmatic content pages with autonomous publish and Google indexing pipelines.",
      tr: "LIOS, işletmeleri, konumları, kategorileri, hizmetleri ve incelemeleri kapsayan veri odaklı bir iş grafiği oluşturur; ardından çok sinyalli bir SEO motoru çalıştırır ve programatik içerik sayfalarını özerk biçimde yayımlayarak Google'a gönderir.",
      az: "LIOS müəssisələri, məkanları, kateqoriyaları və rəyləri əhatə edən məlumat qrafiki qurur; sonra çoxsiqnallı SEO mühərrikini işə salır və proqramatik səhifələri avtonom dərc edərək Google İndekslənməsinə göndərir.",
    },`
);

// SENTIOPULSE (gen)
p = p.replace(
  `problem: {
      en: "Pain signals exist everywhere but remain unstructured, unprocessed, and invisible to product builders.",
      tr: "Ağrı sinyalleri her yerde mevcuttur ancak yapılandırılmamış ve görünmez kalır.",
    },`,
  `problem: {
      en: "Pain signals exist everywhere but remain unstructured, unprocessed, and invisible to product builders.",
      tr: "Ağrı sinyalleri her yerde mevcuttur ancak yapılandırılmamış ve görünmez kalır.",
      az: "Müştəri şikayət və problem siqnalları internetin hər yerində mövcuddur, lakin strukturlaşdırılmamış və məhsul yaradıcıları üçün görünməz olaraq qalır.",
    },`
);

p = p.replace(
  `solution: {
      en: "An automated pipeline that ingests raw community signals, scores them across 6 dimensions, clusters them semantically with vector embeddings, and tracks velocity.",
      tr: "Ham sinyalleri alan, 6 boyutta puanlayan, vektör yerleştirmeleriyle kümelendiren otomatik boru hattı.",
    },`,
  `solution: {
      en: "An automated pipeline that ingests raw community signals, scores them across 6 dimensions, clusters them semantically with vector embeddings, and tracks velocity.",
      tr: "Ham sinyalleri alan, 6 boyutta puanlayan, vektör yerleştirmeleriyle kümelendiren otomatik boru hattı.",
      az: "Xam şikayət siqnallarını toplayan, 6 ölçü üzrə xallandıran, vektor yerləşdirmələri (embeddings) ilə semantik qruplaşdıran və inkişaf dinamikasını izləyən avtomatlaşdırılmış boru xətti.",
    },`
);

// MAÇAGEL
p = p.replace(
  `problem: {
      en: "Amateur football players organize matches through WhatsApp groups — leading to no-shows and unbalanced teams.",
      tr: "Amatör futbolcular maçları WhatsApp grupları üzerinden organize ediyor — bu da gelmeyenler ve dengesiz takımlarla sonuçlanıyor.",
    },`,
  `problem: {
      en: "Amateur football players organize matches through WhatsApp groups — leading to no-shows and unbalanced teams.",
      tr: "Amatör futbolcular maçları WhatsApp grupları üzerinden organize ediyor — bu da gelmeyenler ve dengesiz takımlarla sonuçlanıyor.",
      az: "Həvəskar futbolçular oyunları WhatsApp qrupları vasitəsilə təşkil edirlər — bu da oyuna gəlməyənlər, natamam heyətlər və balanssız komandalarla nəticələnir.",
    },`
);

p = p.replace(
  `solution: {
      en: "A mobile-first platform where users create matches, filter players, join with one tap, and receive push notifications — with Firebase backend.",
      tr: "Kullanıcıların maç oluşturduğu, tek dokunuşla katıldığı ve anlık bildirim aldığı mobil platform.",
    },`,
  `solution: {
      en: "A mobile-first platform where users create matches, filter players, join with one tap, and receive push notifications — with Firebase backend.",
      tr: "Kullanıcıların maç oluşturduğu, tek dokunuşla katıldığı ve anlık bildirim aldığı mobil platform.",
      az: "İstifadəçilərin oyun yaratdığı, oyunçuları filtrlədiyi, tək toxunuşla qatıldığı və anlıq bildirişlər aldığı mobil platforma.",
    },`
);

// VELODRAPE 3D (tekstil)
p = p.replace(
  `problem: {
      en: "Over 70% of e-commerce fashion returns stem from fit and sizing mismatches. Traditional virtual try-on requires expensive body scanners or heavy mobile apps with 3D sensors.",
      tr: "Moda e-ticaretinde iadelerin %70'inden fazlası beden ve kalıp uyuşmazlığından kaynaklanır. Geleneksel sanal deneme pahalı vücut tarayıcıları veya sensörlü ağır mobil uygulamalar gerektirir.",
    },`,
  `problem: {
      en: "Over 70% of e-commerce fashion returns stem from fit and sizing mismatches. Traditional virtual try-on requires expensive body scanners or heavy mobile apps with 3D sensors.",
      tr: "Moda e-ticaretinde iadelerin %70'inden fazlası beden ve kalıp uyuşmazlığından kaynaklanır. Geleneksel sanal deneme pahalı vücut tarayıcıları veya sensörlü ağır mobil uygulamalar gerektirir.",
      az: "Moda elektron ticarətində geri qaytarmaların 70%-dən çoxu bədən ölçüsü uyğunsuzluğundan yaranır. Ənənəvi virtual yoxlama isə bahalı bədən skanerləri və ya sensorlu ağır tətbiqlər tələb edir.",
    },`
);

p = p.replace(
  `solution: { 
      en: "Engineered a client-side virtual try-on engine combining Next.js, Three.js, and MediaPipe/TensorFlow.js. It extracts skeleton pose and body contours directly from standard webcams with real-time WebGL rendering.", 
      tr: "Next.js, Three.js ve MediaPipe/TensorFlow.js mimarilerini birleştirerek; sıradan bir web kamerası akışı üzerinden kullanıcının eklem noktalarını ve vücut geometrisini mikrosaniyeler içinde çıkaran istemci taraflı (client-side) bir sanal prova motoru geliştirdim. 3D modeller GPU üzerinden WebGL ile anlık giydirilir." 
    },`,
  `solution: { 
      en: "Engineered a client-side virtual try-on engine combining Next.js, Three.js, and MediaPipe/TensorFlow.js. It extracts skeleton pose and body contours directly from standard webcams with real-time WebGL rendering.", 
      tr: "Next.js, Three.js ve MediaPipe/TensorFlow.js mimarilerini birleştirerek; sıradan bir web kamerası akışı üzerinden kullanıcının eklem noktalarını ve vücut geometrisini mikrosaniyeler içinde çıkaran istemci taraflı (client-side) bir sanal prova motoru geliştirdim. 3D modeller GPU üzerinden WebGL ile anlık giydirilir.",
      az: "Next.js, Three.js və MediaPipe/TensorFlow.js texnologiyalarını birləşdirərək; adi veb kamera vasitəsilə istifadəçinin oynaq nöqtələrini və bədən həndəsəsini müəyyən edən müştəri tərəfli (client-side) virtual geyim mühərriki yaratdım. 3D modellər GPU üzərindən WebGL ilə real vaxtda geyindirilir." 
    },`
);

// SEARCHGRID (arama)
p = p.replace(
  `problem: { 
      en: "", 
      tr: "Farklı veritabanları, bağımsız servisler ve karmaşık bağımlılıklar... Sistemler büyüdükçe arama altyapıları hantallaşır. Geleneksel monolitik yapılar veya kopuk mikroservisler, milyonlarca satır veri içinde anlık (real-time) arama yapmayı kabusa dönüştürüyordu. Kod tabanını yönetmek, performansı artırmaktan daha fazla zaman alıyordu." 
    },`,
  `problem: { 
      en: "Managing fragmented search databases and microservices causes severe latency and developer overhead at scale.", 
      tr: "Farklı veritabanları, bağımsız servisler ve karmaşık bağımlılıklar... Sistemler büyüdükçe arama altyapıları hantallaşır. Geleneksel monolitik yapılar veya kopuk mikroservisler, milyonlarca satır veri içinde anlık (real-time) arama yapmayı kabusa dönüştürüyordu. Kod tabanını yönetmek, performansı artırmaktan daha fazla zaman alıyordu.",
      az: "Fərqli verilənlər bazaları, müstəqil servislər və mürəkkəb asılılıqlar... Sistemlər böyüdükcə axtarış infrastrukturu ləngiyir. Ənənəvi monolitik strukturlar milyonlarla sətir məlumat içində real vaxtda axtarış etməyi çətinləşdirirdi." 
    },`
);

p = p.replace(
  `solution: { 
      en: "", 
      tr: "Kodu tamamen parçalayıp yeniden inşa ettim. Tüm altyapıyı bir 'Turborepo (Monorepo)' mimarisi altında birleştirdim. Next.js ve Prisma'yı merkeze alarak; veritabanı şemalarından arama motoru mantıklarına kadar her şeyi bağımsız 'paketler (packages)' haline getirdim. Artık her modül kendi içinde izole ama sistemin tamamı devasa, tek bir beyin gibi çalışıyor." 
    },`,
  `solution: { 
      en: "Architected a unified Turborepo monorepo with Next.js, Prisma, and isolated domain search packages for instantaneous queries.", 
      tr: "Kodu tamamen parçalayıp yeniden inşa ettim. Tüm altyapıyı bir 'Turborepo (Monorepo)' mimarisi altında birleştirdim. Next.js ve Prisma'yı merkeze alarak; veritabanı şemalarından arama motoru mantıklarına kadar her şeyi bağımsız 'paketler (packages)' haline getirdim. Artık her modül kendi içinde izole ama sistemin tamamı devasa, tek bir beyin gibi çalışıyor.",
      az: "Bütün infrastrukturu vahid Turborepo monorepo memarlığı altında birləşdirdim. Next.js və Prisma-nı mərkəzə qoyaraq, verilənlər bazası sxemlərindən axtarış mühərriki məntiqinə qədər hər şeyi müstəqil paketlərə ayırdım; sistem tək bir nəhəng beyin kimi çalışır." 
    },`
);

// CHRONOPOST (devrim)
p = p.replace(
  `problem: {
      en: "Distributing media across multiple social platforms concurrently leads to severe rate-limit bottlenecks and token expiry failures.",
      tr: "Medyaları birden çok sosyal platforma eşzamanlı olarak dağıtmak; ciddi rate-limit darboğazlarına, token süresi dolma hatalarına ve içerik tutarsızlığına yol açar.",
    },`,
  `problem: {
      en: "Distributing media across multiple social platforms concurrently leads to severe rate-limit bottlenecks and token expiry failures.",
      tr: "Medyaları birden çok sosyal platforma eşzamanlı olarak dağıtmak; ciddi rate-limit darboğazlarına, token süresi dolma hatalarına ve içerik tutarsızlığına yol açar.",
      az: "Mediaları eyni anda bir neçə sosial şəbəkəyə paylamaq ciddi rate-limit maneələrinə, token müddətinin bitməsi xətalarına və məzmun uyğunsuzluğuna səbəb olur.",
    },`
);

p = p.replace(
  `solution: { 
      en: "Architected an asynchronous worker queue in PHP with automated cron runners. Posts are buffered, media is transformed on the fly, token refreshes are handled transparently, and failures are retried with exponential backoff.", 
      tr: "PHP ve cron arka plan işçileri (workers) ile asenkron kuyruk mimarisi kurdum. Gönderiler kuyruğa alınır, medya boyutları hedef platforma göre optimize edilir, token yenilemeleri otomatik yapılır ve hata durumunda exponential backoff ile tekrar denenerek kesintisiz yayın sağlanır." 
    },`,
  `solution: { 
      en: "Architected an asynchronous worker queue in PHP with automated cron runners. Posts are buffered, media is transformed on the fly, token refreshes are handled transparently, and failures are retried with exponential backoff.", 
      tr: "PHP ve cron arka plan işçileri (workers) ile asenkron kuyruk mimarisi kurdum. Gönderiler kuyruğa alınır, medya boyutları hedef platforma göre optimize edilir, token yenilemeleri otomatik yapılır ve hata durumunda exponential backoff ile tekrar denenerek kesintisiz yayın sağlanır.",
      az: "PHP və cron arxa plan işçiləri ilə asinxron növbə memarlığı qurdum. Paylaşımlar növbəyə alınır, media ölçüləri hədəf platformaya uyğun optimallaşdırılır, tokenlər avtomatik yenilənir və xətalar fasiləsiz təkrar cəhdlə aradan qaldırılır." 
    },`
);

// STATICFORGE (sitebuilder)
p = p.replace(
  `problem: { 
      en: "Building bespoke websites or WordPress instances for hundreds of niche businesses creates unacceptable maintenance overhead and scaling bottlenecks.", 
      tr: "Yüzlerce niş işletme için tek tek özel web siteleri veya WordPress örnekleri kurmak; altından kalkılamaz bir bakım maliyeti, güvenlik açığı ve ölçekleme darboğazı yaratır." 
    },`,
  `problem: { 
      en: "Building bespoke websites or WordPress instances for hundreds of niche businesses creates unacceptable maintenance overhead and scaling bottlenecks.", 
      tr: "Yüzlerce niş işletme için tek tek özel web siteleri veya WordPress örnekleri kurmak; altından kalkılamaz bir bakım maliyeti, güvenlik açığı ve ölçekleme darboğazı yaratır.",
      az: "Yüzlərlə niş biznes üçün tək-tək xüsusi veb-saytlar və ya WordPress quraşdırmaq böyük texniki xidmət xərci və təhlükəsizlik boşluqları yaradır." 
    },`
);

p = p.replace(
  `solution: { 
      en: "Developed the StaticForge architecture utilizing JSON variation drivers and reusable template engines to generate thousands of static, SEO-optimized, zero-maintenance sites automatically.", 
      tr: "JSON varyasyon sürücülerini ve yeniden kullanılabilir şablon motorlarını kullanan StaticForge mimarisini geliştirdim. Sistem, tek bir veri kaynağından binlerce statik, SEO optimizasyonlu ve sıfır bakım gerektiren sayfayı otonom olarak üretir." 
    },`,
  `solution: { 
      en: "Developed the StaticForge architecture utilizing JSON variation drivers and reusable template engines to generate thousands of static, SEO-optimized, zero-maintenance sites automatically.", 
      tr: "JSON varyasyon sürücülerini ve yeniden kullanılabilir şablon motorlarını kullanan StaticForge mimarisini geliştirdim. Sistem, tek bir veri kaynağından binlerce statik, SEO optimizasyonlu ve sıfır bakım gerektiren sayfayı otonom olarak üretir.",
      az: "JSON konfiqurasiyaları və təkrar istifadə edilə bilən şablon mühərriklərini istifadə edən StaticForge memarlığını yaratdım; tək mənbədən minlərlə statik və SEO optimallaşdırılmış səhifə avtonom şəkildə formalaşdırılır." 
    },`
);

fs.writeFileSync('src/data/projects.ts', p, 'utf8');
console.log('Successfully added full problem & solution Azerbaijani translations to projects.ts');

