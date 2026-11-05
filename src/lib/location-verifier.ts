// Comprehensive İzmir verification engine
export const IZMIR_DISTRICTS = [
  "Bayraklı",
  "Alsancak",
  "Konak",
  "Bornova",
  "Urla",
  "Karşıyaka",
  "Buca",
  "Gaziemir",
  "Çiğli",
  "Balçova",
  "Narlıdere",
  "Güzelbahçe",
  "Torbalı",
  "Menemen",
  "Menderes",
  "Kemalpaşa",
  "Aliağa",
  "Seferihisar",
  "Foça",
  "Tire",
  "Ödemiş",
  "Bergama",
  "Çeşme",
  "Urla İYTE",
];

export const OTHER_MAJOR_CITIES = [
  "istanbul",
  "i̇stanbul",
  "ankara",
  "bursa",
  "antalya",
  "kocaeli",
  "adana",
  "eskişehir",
  "gaziantep",
  "trabzon",
  "samsun",
  "kayseri",
  "konya",
];

export interface LocationDetectionResult {
  city: string;
  district: string;
  isConfirmedIzmir: boolean;
  isOtherCity: boolean;
  detectedCityName?: string;
  evidence: string[];
}

export function detectPreciseLocation(text: string, phones: string[] = []): LocationDetectionResult {
  const lower = text.toLowerCase();
  const evidence: string[] = [];

  // 1. Phone Area Code Check (0232 / +90 232)
  const has0232 = phones.some((p) => p.includes("232")) || /(?:\+90|0)\s*\(?232\)?/.test(text);
  if (has0232) {
    evidence.push("İzmir sabit telefon alan kodu (0232) doğrulandı.");
  }

  // 2. Other city phone checks (Istanbul 0212/0216, Ankara 0312, Bursa 0224, Antalya 0242)
  const otherCityPhone = /(?:\+90|0)\s*\(?(212|216|312|224|242)\)?/.test(text);

  // 3. District Check
  let detectedDistrict = "";
  for (const dist of IZMIR_DISTRICTS) {
    // Avoid false positives by checking word boundaries
    const reg = new RegExp(`\\b${dist.toLowerCase()}\\b`, "i");
    if (reg.test(lower)) {
      detectedDistrict = dist;
      evidence.push(`İzmir ilçesi (${dist}) adreste veya içerikte tespit edildi.`);
      break;
    }
  }

  if (lower.includes("teknopark izmir") || lower.includes("teknoparkizmir")) {
    detectedDistrict = "Urla (Teknopark İzmir)";
    evidence.push("Teknopark İzmir kampüsü doğrulandı.");
  } else if (lower.includes("ege teknopark") || lower.includes("ege teknoloji")) {
    detectedDistrict = "Bornova (Ege Teknopark)";
    evidence.push("Ege Teknopark Bornova yerleşkesi doğrulandı.");
  } else if (lower.includes("depark")) {
    detectedDistrict = "Buca / İnciraltı (DEPARK)";
    evidence.push("Dokuz Eylül DEPARK yerleşkesi doğrulandı.");
  }

  // 4. City Name Presence
  const hasIzmirWord =
    /\bi̇zmir\b/i.test(lower) ||
    /\bizmir\b/i.test(lower) ||
    lower.includes("izmir'de") ||
    lower.includes("izmirde") ||
    lower.includes("izmir merkezli") ||
    lower.includes("ege bölgesi");

  if (hasIzmirWord) {
    evidence.push("Metin içerisinde İzmir lokasyonu belirtilmiş.");
  }

  // 5. Check if another city is explicitly dominant (e.g. Maslak/Levent/Kadıköy/Şişli/Çankaya)
  const istanbulDistricts = [
    "kadıköy",
    "kadikoy",
    "beşiktaş",
    "besiktas",
    "şişli",
    "sisli",
    "maslak",
    "levent",
    "ümraniye",
    "umraniye",
    "ataşehir",
    "atasehir",
    "bakırköy",
    "bakirkoy",
    "beyoğlu",
    "beyoglu",
  ];
  let detectedOtherCity = "";
  for (const d of istanbulDistricts) {
    if (new RegExp(`\\b${d}\\b`, "i").test(lower)) {
      detectedOtherCity = "İstanbul (" + d.charAt(0).toUpperCase() + d.slice(1) + ")";
      break;
    }
  }

  if (!detectedOtherCity) {
    for (const city of OTHER_MAJOR_CITIES) {
      if (new RegExp(`\\b${city}\\b`, "i").test(lower)) {
        detectedOtherCity = city.charAt(0).toUpperCase() + city.slice(1);
        break;
      }
    }
  }

  // Final Decision Matrix
  const isConfirmedIzmir = has0232 || Boolean(detectedDistrict) || (hasIzmirWord && !otherCityPhone);

  if (isConfirmedIzmir) {
    return {
      city: "İzmir",
      district: detectedDistrict || "Merkez",
      isConfirmedIzmir: true,
      isOtherCity: false,
      evidence,
    };
  }

  if (detectedOtherCity || otherCityPhone) {
    const finalCity = detectedOtherCity || (text.includes("212") || text.includes("216") ? "İstanbul" : "Şehir Dışı");
    return {
      city: finalCity,
      district: "Merkez / Uzaktan",
      isConfirmedIzmir: false,
      isOtherCity: true,
      detectedCityName: finalCity,
      evidence: [`Firma adresi İzmir dışında tespit edildi: ${finalCity}`],
    };
  }

  return {
    city: "Türkiye (Belirtilmemiş)",
    district: "Merkez",
    isConfirmedIzmir: false,
    isOtherCity: false,
    evidence: ["Lokasyon bilgisi sayfada açıkça belirtilmemiş."],
  };
}
