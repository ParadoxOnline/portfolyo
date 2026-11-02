import type { Lang } from "@/providers/LangProvider";

export interface StageMetaItem {
  title: Record<Lang, string>;
  tasks: Record<Lang, [string, string, string, string, string]>;
}

export const STAGE_META_I18N: Record<string, StageMetaItem> = {
  "hero-stage": {
    title: {
      tr: "ANA SAHNE (HERO)",
      az: "ƏSAS SƏHNƏ (HERO)",
      en: "MAIN HERO STAGE",
    },
    tasks: {
      tr: [
        "Üst menü butonlarını çoğalt & adlandır",
        "Ana başlık tipografisini yaz & düzelt",
        "Manifesto bloğunu yatay/dikey aç",
        "3D vitrini önce yatay ↔ sonra dikey ↕ çek",
        "CTA butonlarını & 7'li barı çoğaltıp adlandır",
      ],
      az: [
        "Yuxarı menyu düymələrini çoxalt və adlandır",
        "Əsas başlıq tipoqrafiyasını yaz və düzəlt",
        "Manifest blokunu üfüqi/şaquli aç",
        "3D vitrini əvvəlcə üfüqi ↔ sonra şaquli ↕ çək",
        "CTA düymələrini və 7-li zolağı çoxaldıb adlandır",
      ],
      en: [
        "Clone & label navbar buttons",
        "Type H1 typography & fix typo",
        "Expand manifesto box horizontally/vertically",
        "Pull 3D deck horizontally ↔ then vertically ↕",
        "Clone CTA actions & 7-stage project bar",
      ],
    },
  },
  "project-lios": {
    title: {
      tr: "01 // LİOS — İZMİR GÜZELLİK",
      az: "01 // LİOS — İZMİR GÖZƏLLİK",
      en: "01 // LIOS — LOCAL GRAPH SEO",
    },
    tasks: {
      tr: [
        "Üst meta barı & 4 renk noktasını çoğalt",
        "Lios başlığını yaz & tipografiyi hizala",
        "Mimari kartı önce yatay ↔ sonra dikey ↕ aç",
        "İzmir Güzellik ekranını ↔ yatay / ↕ dikey kur",
        "Teknoloji rozetlerini çoğalt & isimlendir",
      ],
      az: [
        "Yuxarı meta zolağı və 4 rəng nöqtəsini çoxalt",
        "Lios başlığını yaz və tipoqrafiyanı nizama sal",
        "Memarlıq kartını əvvəlcə üfüqi ↔ sonra şaquli ↕ aç",
        "İzmir Gözəllik ekranını ↔ üfüqi / ↕ şaquli qur",
        "Texnologiya nişanlarını çoxalt və adlandır",
      ],
      en: [
        "Clone top meta bar & 4 color swatches",
        "Type LIOS headline & align typography",
        "Expand architecture card ↔ width then ↕ height",
        "Build local business viewport ↔/↕",
        "Clone & rename technology badges",
      ],
    },
  },
  "project-gen": {
    title: {
      tr: "02 // SENTIOPULSE — PAZAR İSTİHBARAT",
      az: "02 // SENTIOPULSE — BAZAR KƏŞFİYYATI",
      en: "02 // SENTIOPULSE — MARKET SIGNALS",
    },
    tasks: {
      tr: [
        "Üst meta barı & renk paletini çoğalt",
        "SentioPulse başlığını yaz & tipografiyi hizala",
        "İstihbarat özet kartını yatay/dikey aç",
        "9 Kademeli Boru Hattı ekranını ↔/↕ boyutlandır",
        "Teknoloji rozetlerini çoğalt & isimlendir",
      ],
      az: [
        "Yuxarı meta zolağı və rəng palitrasını çoxalt",
        "SentioPulse başlığını yaz və tipoqrafiyanı nizama sal",
        "Kəşfiyyat xülasə kartını üfüqi/şaquli aç",
        "9 Pilləli Boru Xətti ekranını ↔/↕ ölçüləndir",
        "Texnologiya nişanlarını çoxalt və adlandır",
      ],
      en: [
        "Clone top meta bar & intelligence swatches",
        "Type SentioPulse headline & align typography",
        "Expand intelligence overview card ↔/↕",
        "Resize 9-Stage Pipeline viewport ↔/↕",
        "Clone & rename tech stack badges",
      ],
    },
  },
  "project-macagel": {
    title: {
      tr: "03 // MAÇAGEL — MOBİL SPOR",
      az: "03 // MAÇAGEL — MOBİL İDMAN",
      en: "03 // MACAGEL — MOBILE SPORTS",
    },
    tasks: {
      tr: [
        "Üst meta barı & saha yeşili paletini kur",
        "MaçaGel başlığını sıfırdan yaz",
        "Mobil mimari kartı yatay/dikey genişlet",
        "iPhone kasasını & saha kadrosunu ↔/↕ çek",
        "Mobil rozetleri çoğalt & isimlerini değiştir",
      ],
      az: [
        "Yuxarı meta zolağı və meydança yaşılı palitranı qur",
        "MaçaGel başlığını sıfırdan yaz",
        "Mobil memarlıq kartını üfüqi/şaquli genişləndir",
        "iPhone çərçivəsini və heyəti ↔/↕ çək",
        "Mobil nişanları çoxalt və adlarını dəyiş",
      ],
      en: [
        "Setup top meta bar & turf green swatches",
        "Type MaçaGel title from scratch",
        "Expand mobile architecture card ↔/↕",
        "Pull iPhone chassis & squad board ↔/↕",
        "Clone mobile badges & change labels",
      ],
    },
  },
  "project-tekstil": {
    title: {
      tr: "04 // VELODRAPE 3D — WEBGL",
      az: "04 // VELODRAPE 3D — WEBGL",
      en: "04 // VELODRAPE 3D — WEBGL TRY-ON",
    },
    tasks: {
      tr: [
        "Üst meta barı & tema rengini ayarla",
        "VeloDrape 3D başlığını sıfırdan yaz",
        "WebGL mimari kartını yatay/dikey aç",
        "3D Mesh & Shader sahnesini ↔/↕ boyutlandır",
        "WebGL rozetlerini çoğalt & isimlendir",
      ],
      az: [
        "Yuxarı meta zolağı və tema rəngini tənzimlə",
        "VeloDrape 3D başlığını sıfırdan yaz",
        "WebGL memarlıq kartını üfüqi/şaquli aç",
        "3D Mesh & Shader səhnəsini ↔/↕ ölçüləndir",
        "WebGL nişanlarını çoxalt və adlandır",
      ],
      en: [
        "Adjust top meta bar & magenta theme",
        "Type VeloDrape 3D title from scratch",
        "Expand WebGL architecture frame ↔/↕",
        "Resize 3D Mesh & Shader viewport ↔/↕",
        "Clone & label WebGL technology badges",
      ],
    },
  },
  "project-arama": {
    title: {
      tr: "05 // SEARCHGRID — ARAMA MOTORU",
      az: "05 // SEARCHGRID — AXTARIŞ MÜHƏRRİKİ",
      en: "05 // SEARCHGRID — SEARCH ENGINE",
    },
    tasks: {
      tr: [
        "Üst meta barı & tema rengini ayarla",
        "SearchGrid başlığını sıfırdan yaz",
        "Arama motoru kartını yatay/dikey aç",
        "İndeksleme & sorgu konsolunu ↔/↕ kur",
        "Altyapı rozetlerini çoğalt & isimlerini değiştir",
      ],
      az: [
        "Yuxarı meta zolağı və tema rəngini tənzimlə",
        "SearchGrid başlığını sıfırdan yaz",
        "Axtarış mühərriki kartını üfüqi/şaquli aç",
        "İndeksləmə və sorğu konsolunu ↔/↕ qur",
        "İnfrastruktur nişanlarını çoxalt və adlarını dəyiş",
      ],
      en: [
        "Set top meta bar & theme palette",
        "Type SearchGrid title from scratch",
        "Expand search engine frame ↔/↕",
        "Build indexing & query console ↔/↕",
        "Clone infrastructure badges & rename",
      ],
    },
  },
  "project-devrim": {
    title: {
      tr: "06 // CHRONOPOST — SOSYAL DAĞITIM",
      az: "06 // CHRONOPOST — SOSİAL PAYLAŞIM",
      en: "06 // CHRONOPOST — SOCIAL ENGINE",
    },
    tasks: {
      tr: [
        "Üst meta barı & tema rengini ayarla",
        "ChronoPost başlığını sıfırdan yaz",
        "Zamanlayıcı mimari kartını yatay/dikey genişlet",
        "Gönderi kuyruğu & takvim ekranını ↔/↕ çek",
        "Kuyruk rozetlerini çoğalt & isimlerini değiştir",
      ],
      az: [
        "Yuxarı meta zolağı və tema rəngini tənzimlə",
        "ChronoPost başlığını sıfırdan yaz",
        "Planlayıcı memarlıq kartını üfüqi/şaquli genişləndir",
        "Paylaşım növbəsi və təqvim ekranını ↔/↕ çək",
        "Növbə nişanlarını çoxalt və adlarını dəyiş",
      ],
      en: [
        "Tune top meta bar & theme accent",
        "Type ChronoPost title from scratch",
        "Expand scheduler architecture card ↔/↕",
        "Pull post queue & calendar view ↔/↕",
        "Clone queue badges & rename labels",
      ],
    },
  },
  "project-sitebuilder": {
    title: {
      tr: "07 // STATICFORGE — SİTE MOTORU",
      az: "07 // STATICFORGE — SAYT MÜHƏRRİKİ",
      en: "07 // STATICFORGE — SITE GENERATOR",
    },
    tasks: {
      tr: [
        "Üst meta barı & tema rengini ayarla",
        "StaticForge başlığını sıfırdan yaz",
        "Üretici motor kartını yatay/dikey aç",
        "JSON şablon editör tuvalini ↔/↕ boyutlandır",
        "Motor rozetlerini çoğalt & isimlendir",
      ],
      az: [
        "Yuxarı meta zolağı və tema rəngini tənzimlə",
        "StaticForge başlığını sıfırdan yaz",
        "Generator mühərrik kartını üfüqi/şaquli aç",
        "JSON şablon redaktoru kətanını ↔/↕ ölçüləndir",
        "Mühərrik nişanlarını çoxalt və adlandır",
      ],
      en: [
        "Adjust top meta bar & emerald theme",
        "Type StaticForge title from scratch",
        "Expand generator engine frame ↔/↕",
        "Resize JSON template editor canvas ↔/↕",
        "Clone generator engine badges & rename",
      ],
    },
  },
  "career-stage": {
    title: {
      tr: "DENEYİM & KARİYER MİMARİSİ",
      az: "TƏCRÜBƏ VƏ KARYERA MEMARLIĞI",
      en: "CAREER & EXPERIENCE ARCHITECTURE",
    },
    tasks: {
      tr: [
        "Üst deneyim başlığını & rengini kur",
        "Kariyer ana başlığını yaz & düzelt",
        "Deneyim özet metnini satır satır akıt",
        "1. metrik kartını 3'e çoğalt & değerleri yaz",
        "Bölüm kartlarını & araç etiketlerini çoğalt",
      ],
      az: [
        "Yuxarı təcrübə başlığını və rəngini qur",
        "Karyera əsas başlığını yaz və düzəlt",
        "Təcrübə xülasəsini sətir-sətir axıt",
        "1-ci metrik kartını 3-ə çoxalt və dəyərləri yaz",
        "Bölmə kartlarını və alət etiketlərini çoxalt",
      ],
      en: [
        "Setup career eyebrow & accent color",
        "Type career headline & fix typos",
        "Stream experience narrative lines",
        "Clone 1st metric card to 3 & write values",
        "Clone section cards & tech pill badges",
      ],
    },
  },
  "contact-stage": {
    title: {
      tr: "İLETİŞİM & VİZYON SAHNESİ",
      az: "ƏLAQƏ VƏ VİZYON SƏHNƏSİ",
      en: "CONTACT & VISION STAGE",
    },
    tasks: {
      tr: [
        "Ortalanmış üst vizyon başlığını kur",
        "İletişim ana başlığını 2 satır yaz",
        "Ekip & üretim vizyon metnini oluştur",
        "1. hedef kartını 3'e çoğalt & başlıkları değiştir",
        "Vizyon kutusunu & iletişim butonunu yerleştir",
      ],
      az: [
        "Mərkəzləşdirilmiş vizyon başlığını qur",
        "Əlaqə əsas başlığını 2 sətir yaz",
        "Komanda və istehsalat vizyon mətnini formalaşdır",
        "1-ci hədəf kartını 3-ə çoxalt və başlıqları dəyiş",
        "Vizyon qutusunu və əlaqə düyməsini yerləşdir",
      ],
      en: [
        "Place centered vision eyebrow & accent",
        "Type contact headline in 2 lines",
        "Form team & shipping vision narrative",
        "Clone 1st pillar card to 3 & rename",
        "Position vision frame & message button",
      ],
    },
  },
};

export function getStageMetaI18n(stageId: string, lang: Lang) {
  const item = STAGE_META_I18N[stageId] ?? STAGE_META_I18N["hero-stage"];
  return {
    title: item.title[lang] ?? item.title.tr,
    tasks: item.tasks[lang] ?? item.tasks.tr,
  };
}

export const PAPER_UI_TEXT: Record<
  Lang,
  {
    krokiLabel: string;
    replayBtn: string;
    replayTitle: string;
    checklistTitle: string;
    doneCount: (c: number) => string;
  }
> = {
  tr: {
    krokiLabel: "SAYFAYA ÖZEL KROKİ (2B KALEM)",
    replayBtn: "↻ Sıfırdan Çiz",
    replayTitle: "Bu sahneyi krokiden sıfırdan tekrar inşa et",
    checklistTitle: "YAZILIMCI İNŞA LİSTESİ",
    doneCount: (c) => `${c}/5 TAMAM`,
  },
  az: {
    krokiLabel: "SƏHİFƏYƏ ÖZƏL ESKİZ (2B QƏLƏM)",
    replayBtn: "↻ Sıfırdan Çək",
    replayTitle: "Bu səhnəni eskizdən sıfırdan yenidən inşa et",
    checklistTitle: "TƏRTİBATÇI İNŞA SİYAHISI",
    doneCount: (c) => `${c}/5 TAMAMLANDI`,
  },
  en: {
    krokiLabel: "BESPOKE SKETCH (2B GRAPHITE)",
    replayBtn: "↻ Rebuild",
    replayTitle: "Rebuild this stage from scratch with the cursors",
    checklistTitle: "DEVELOPER BUILD CHECKLIST",
    doneCount: (c) => `${c}/5 COMPLETED`,
  },
};

