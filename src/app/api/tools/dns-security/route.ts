import { NextRequest, NextResponse } from "next/server";
import dns from "node:dns/promises";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rawDomain = (body.domain || "").trim().toLowerCase();

    if (!rawDomain) {
      return NextResponse.json({ error: "Lütfen denetlenecek alan adını (örn. sirket.com) girin." }, { status: 400 });
    }

    // URL geldiyse domain kısmını ayıralım
    let cleanDomain = rawDomain.replace(/^https?:\/\//, "").split("/")[0].split(":")[0];
    cleanDomain = cleanDomain.replace(/^www\./, "");

    const results: {
      domain: string;
      aRecords: string[];
      aaaaRecords: string[];
      mxRecords: Array<{ exchange: string; priority: number }>;
      txtRecords: string[];
      nsRecords: string[];
      spf: { raw: string | null; valid: boolean; mechanism: string; explanation: string };
      dmarc: { raw: string | null; valid: boolean; policy: string; explanation: string };
      securityScore: number;
      findings: { passed: string[]; warnings: string[]; critical: string[] };
      recommendedSpf: string;
      recommendedDmarc: string;
    } = {
      domain: cleanDomain,
      aRecords: [],
      aaaaRecords: [],
      mxRecords: [],
      txtRecords: [],
      nsRecords: [],
      spf: { raw: null, valid: false, mechanism: "Yok", explanation: "SPF kaydı bulunamadı." },
      dmarc: { raw: null, valid: false, policy: "Yok", explanation: "DMARC kaydı bulunamadı." },
      securityScore: 0,
      findings: { passed: [], warnings: [], critical: [] },
      recommendedSpf: `v=spf1 mx a include:_spf.google.com ~all`,
      recommendedDmarc: `v=DMARC1; p=quarantine; rua=mailto:dmarc-reports@${cleanDomain}; pct=100; sp=quarantine; aspf=r`,
    };

    // 1. A Kayıtları
    try {
      results.aRecords = await dns.resolve4(cleanDomain);
    } catch {
      results.aRecords = [];
    }

    // 2. AAAA (IPv6)
    try {
      results.aaaaRecords = await dns.resolve6(cleanDomain);
    } catch {
      results.aaaaRecords = [];
    }

    // 3. MX (Mail Sunucuları)
    try {
      results.mxRecords = await dns.resolveMx(cleanDomain);
      results.mxRecords.sort((a, b) => a.priority - b.priority);
    } catch {
      results.mxRecords = [];
    }

    // 4. TXT (SPF ve diğer doğrulamalar)
    try {
      const rawTxt = await dns.resolveTxt(cleanDomain);
      results.txtRecords = rawTxt.map((parts) => parts.join(""));
    } catch {
      results.txtRecords = [];
    }

    // 5. NS (Nameservers)
    try {
      results.nsRecords = await dns.resolveNs(cleanDomain);
    } catch {
      results.nsRecords = [];
    }

    // 6. DMARC Kaydı (_dmarc.domain.com)
    try {
      const dmarcTxt = await dns.resolveTxt(`_dmarc.${cleanDomain}`);
      const joinedDmarc = dmarcTxt.map((parts) => parts.join("")).find((t) => t.toLowerCase().startsWith("v=dmarc1"));
      if (joinedDmarc) {
        results.dmarc.raw = joinedDmarc;
        results.dmarc.valid = true;

        const pMatch = joinedDmarc.match(/p=([a-zA-Z]+)/i);
        const policy = pMatch ? pMatch[1].toLowerCase() : "none";
        results.dmarc.policy = policy;

        if (policy === "reject") {
          results.dmarc.explanation = "Maksimum Koruma (p=reject): Yetkisiz gönderilen sahte e-postalar alıcı sunucu tarafından derhal reddedilir.";
        } else if (policy === "quarantine") {
          results.dmarc.explanation = "Karantina Koruması (p=quarantine): Şüpheli e-postalar doğrudan alıcının spam klasörüne yönlendirilir.";
        } else {
          results.dmarc.explanation = "İzleme Modu (p=none): E-postalar engellenmez, yalnızca sahtecilik raporlanır. Koruma zayıftır.";
        }
      }
    } catch {
      results.dmarc.raw = null;
    }

    // SPF Analizi
    const spfRecord = results.txtRecords.find((t) => t.toLowerCase().startsWith("v=spf1"));
    if (spfRecord) {
      results.spf.raw = spfRecord;
      results.spf.valid = true;

      if (spfRecord.includes("-all")) {
        results.spf.mechanism = "HardFail (-all)";
        results.spf.explanation = "Katı Koruma: Yalnızca tanımlı IP ve MX sunucularından gelen mailler kabul edilir, diğerleri doğrudan engellenir.";
      } else if (spfRecord.includes("~all")) {
        results.spf.mechanism = "SoftFail (~all)";
        results.spf.explanation = "Esnek Koruma: Yetkisiz sunuculardan gelen mailler şüpheli olarak işaretlenir (Spam kutusuna düşebilir).";
      } else if (spfRecord.includes("?all")) {
        results.spf.mechanism = "Neutral (?all)";
        results.spf.explanation = "Etkisiz: SPF kaydı herhangi bir koruma sağlamaz; tüm mailler geçerli sayılır.";
      } else {
        results.spf.mechanism = "Tanımsız";
        results.spf.explanation = "SPF kaydı geçerli bir bitiş kuralı (~all / -all) içermiyor.";
      }
    }

    // Puanlama ve Bulgular
    let score = 0;

    // A kaydı
    if (results.aRecords.length > 0) {
      score += 20;
      results.findings.passed.push(`Alan adı aktif ve IPv4 sunucusuna yönlendirilmiş (${results.aRecords.join(", ")}).`);
    } else {
      results.findings.critical.push("Alan adının aktif bir A kaydı (IPv4) bulunamadı!");
    }

    // IPv6
    if (results.aaaaRecords.length > 0) {
      score += 10;
      results.findings.passed.push(`Gelecek nesil IPv6 desteği aktif (${results.aaaaRecords.length} adet AAAA kaydı).`);
    } else {
      results.findings.warnings.push("IPv6 (AAAA) kaydı bulunamadı. Sadece eski nesil IPv4 ile çalışıyor.");
    }

    // MX (Mail)
    if (results.mxRecords.length > 0) {
      score += 20;
      const providers = results.mxRecords.map((m) => m.exchange).join(", ");
      results.findings.passed.push(`Kurumsal e-posta altyapısı aktif (${results.mxRecords.length} adet MX sunucusu: ${providers}).`);
    } else {
      results.findings.warnings.push("Herhangi bir MX (Mail Exchange) kaydı bulunamadı. Bu domain üzerinden e-posta alımı yapılamaz.");
    }

    // SPF
    if (results.spf.valid) {
      score += 25;
      results.findings.passed.push(`SPF kaydı mevcut: ${results.spf.mechanism}.`);
    } else {
      results.findings.critical.push("SPF kaydı tamamen EKSİK! Gönderdiğiniz e-postaların Gmail ve Outlook tarafından spam olarak işaretlenme riski çok yüksektir.");
    }

    // DMARC
    if (results.dmarc.valid) {
      score += 25;
      if (results.dmarc.policy === "reject" || results.dmarc.policy === "quarantine") {
        results.findings.passed.push(`Güçlü DMARC politikası aktif (p=${results.dmarc.policy}). Alan adı sahteciliğine karşı korumalı.`);
      } else {
        results.findings.warnings.push("DMARC kaydı mevcut ancak 'p=none' (yalnızca izleme) modunda. Alan adınız adına sahte mail atılmasını engellemez.");
      }
    } else {
      results.findings.critical.push("DMARC kaydı bulunamadı! Siber saldırganlar alan adınızı taklit ederek müşterilerinize sahte fatura veya phishing mailleri gönderebilir.");
    }

    results.securityScore = Math.min(100, score);

    return NextResponse.json(results);
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "DNS sorgulaması sırasında bir hata oluştu.";
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}

