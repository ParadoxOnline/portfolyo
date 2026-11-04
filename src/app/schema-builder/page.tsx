"use client";

import React, { useMemo, useState } from "react";
import { ToolPage, Panel, Field, inputClass, CodeBlock, Status } from "@/components/tools/ToolKit";
import { toolCursor } from "@/components/tools/ToolCursor";

type SchemaType =
  | "Organization"
  | "LocalBusiness"
  | "MedicalClinic"
  | "LegalService"
  | "SoftwareApplication"
  | "FAQPage";

const types: Array<{ id: SchemaType; label: string; hint: string }> = [
  { id: "Organization", label: "Şirket / kurum", hint: "Marka ve ajans siteleri" },
  { id: "LocalBusiness", label: "Yerel işletme", hint: "Fiziksel adresi olan işletmeler" },
  { id: "MedicalClinic", label: "Klinik", hint: "Muayenehane, diş kliniği" },
  { id: "LegalService", label: "Hukuk bürosu", hint: "Avukat ve danışmanlık" },
  { id: "SoftwareApplication", label: "Yazılım / SaaS", hint: "Uygulama ve web araçları" },
  { id: "FAQPage", label: "Sık sorulan sorular", hint: "Sayfadaki soru-cevap bloğu" },
];

/** Boş değerleri JSON'a hiç yazmaz; sahte örnek veri üretmez. */
function prune<T extends Record<string, unknown>>(obj: T): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v === "" || v === undefined || v === null) continue;
    if (typeof v === "object" && !Array.isArray(v)) {
      const nested = prune(v as Record<string, unknown>);
      const meaningful = Object.keys(nested).filter((n) => n !== "@type");
      if (meaningful.length === 0) continue;
      out[k] = nested;
    } else {
      out[k] = v;
    }
  }
  return out;
}

export default function SchemaBuilderPage() {
  const [type, setType] = useState<SchemaType>("Organization");

  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [logo, setLogo] = useState("");
  const [telephone, setTelephone] = useState("");
  const [email, setEmail] = useState("");
  const [sameAs, setSameAs] = useState("");

  const [street, setStreet] = useState("");
  const [locality, setLocality] = useState("");
  const [region, setRegion] = useState("");
  const [postal, setPostal] = useState("");
  const [country, setCountry] = useState("TR");

  const [specialty, setSpecialty] = useState("");
  const [knowsAbout, setKnowsAbout] = useState("");
  const [os, setOs] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [currency, setCurrency] = useState("TRY");

  const [faq, setFaq] = useState([{ question: "", answer: "" }]);

  const hasAddress = type === "LocalBusiness" || type === "MedicalClinic" || type === "LegalService";
  const hasContact = type !== "SoftwareApplication" && type !== "FAQPage";

  const { json, missing } = useMemo(() => {
    const miss: string[] = [];
    let obj: Record<string, unknown>;

    if (type === "FAQPage") {
      const items = faq.filter((f) => f.question.trim() && f.answer.trim());
      if (items.length === 0) miss.push("En az bir soru ve cevabı doldurun");
      obj = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: items.map((f) => ({
          "@type": "Question",
          name: f.question.trim(),
          acceptedAnswer: { "@type": "Answer", text: f.answer.trim() },
        })),
      };
      return { json: obj, missing: miss };
    }

    if (!name.trim()) miss.push("Ad");
    if (!url.trim()) miss.push("Web sitesi adresi");

    if (type === "SoftwareApplication") {
      if (!category.trim()) miss.push("Uygulama kategorisi (Google bunu bekler)");
      obj = prune({
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: name.trim(),
        url: url.trim(),
        description: description.trim(),
        applicationCategory: category.trim(),
        operatingSystem: os.trim(),
        offers: price.trim() ? { "@type": "Offer", price: price.trim(), priceCurrency: currency.trim() } : undefined,
      });
      return { json: obj, missing: miss };
    }

    if (hasAddress && !street.trim() && !locality.trim()) miss.push("Adres (yerel sonuçlar için gerekli)");
    if (hasContact && !telephone.trim() && !email.trim()) miss.push("Telefon veya e-posta");

    obj = prune({
      "@context": "https://schema.org",
      "@type": type,
      name: name.trim(),
      url: url.trim(),
      description: description.trim(),
      logo: logo.trim(),
      telephone: telephone.trim(),
      email: email.trim(),
      address: hasAddress
        ? {
            "@type": "PostalAddress",
            streetAddress: street.trim(),
            addressLocality: locality.trim(),
            addressRegion: region.trim(),
            postalCode: postal.trim(),
            addressCountry: country.trim(),
          }
        : undefined,
      medicalSpecialty: type === "MedicalClinic" ? specialty.trim() : undefined,
      knowsAbout: type === "LegalService" ? knowsAbout.trim() : undefined,
      sameAs: sameAs
        .split(/\r?\n/)
        .map((s) => s.trim())
        .filter(Boolean),
    });
    if (Array.isArray(obj.sameAs) && obj.sameAs.length === 0) delete obj.sameAs;
    return { json: obj, missing: miss };
  }, [type, name, url, description, logo, telephone, email, sameAs, street, locality, region, postal, country, specialty, knowsAbout, os, category, price, currency, faq, hasAddress, hasContact]);

  const code = `<script type="application/ld+json">\n${JSON.stringify(json, null, 2)}\n</script>`;

  const download = () => {
    const blob = new Blob([JSON.stringify(json, null, 2)], { type: "application/ld+json" });
    const href = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = href;
    a.download = `schema-${type.toLowerCase()}.jsonld`;
    a.click();
    URL.revokeObjectURL(href);
  };

  const setFaqField = (i: number, key: "question" | "answer", v: string) =>
    setFaq((prev) => prev.map((f, idx) => (idx === i ? { ...f, [key]: v } : f)));

  return (
    <ToolPage href="/schema-builder" tool="schema"
      wide
      title="Schema.org JSON-LD üretici"
      lead="Şablonu seçin, alanları doldurun; sağda sayfanıza yapıştırılacak JSON-LD oluşur. Boş bıraktığınız alanlar çıktıya hiç yazılmaz, örnek veri eklenmez."
    >
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
        <div className="space-y-6">
          <Panel title="Şablon">
            <div role="radiogroup" aria-label="Şema türü" className="grid gap-px overflow-hidden rounded border border-white/10 bg-white/10 sm:grid-cols-2">
              {types.map((t) => {
                const on = type === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={(e) => {
                      setType(t.id);
                      toolCursor.stamp(
                        e.currentTarget,
                        t.id,
                        document.querySelector<HTMLElement>("[data-cursor-output]")
                      );
                    }}
                    className={`px-4 py-3 text-left transition ${on ? "bg-sky-300/10" : "bg-[#070b12] hover:bg-white/[0.04]"}`}
                  >
                    <span className={`block text-[13px] font-medium ${on ? "text-sky-200" : "text-white"}`}>{t.label}</span>
                    <span className="mt-0.5 block text-xs text-slate-500">{t.hint}</span>
                  </button>
                );
              })}
            </div>
          </Panel>

          {type === "FAQPage" ? (
            <Panel
              title="Sorular"
              note="Yalnızca sayfada görünen soru-cevapları ekleyin; Google görünmeyen içeriği zengin sonuçta göstermez."
              action={
                <button
                  type="button"
                  onClick={() => setFaq((p) => [...p, { question: "", answer: "" }])}
                  className="font-mono text-xs text-sky-300 hover:text-sky-200"
                >
                  Soru ekle
                </button>
              }
            >
              <div className="space-y-5">
                {faq.map((f, i) => (
                  <div key={i} className="space-y-2 border-l border-white/10 pl-4">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[11px] text-zinc-500">#{i + 1}</span>
                      {faq.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setFaq((p) => p.filter((_, idx) => idx !== i))}
                          className="text-xs text-zinc-500 hover:text-rose-300"
                        >
                          Sil
                        </button>
                      )}
                    </div>
                    <input
                      aria-label={`Soru ${i + 1}`}
                      className={inputClass}
                      placeholder="Soru"
                      value={f.question}
                      onChange={(e) => setFaqField(i, "question", e.target.value)}
                    />
                    <textarea
                      aria-label={`Cevap ${i + 1}`}
                      rows={3}
                      className={inputClass}
                      placeholder="Cevap"
                      value={f.answer}
                      onChange={(e) => setFaqField(i, "answer", e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </Panel>
          ) : (
            <>
              <Panel title="Temel bilgiler">
                <div className="space-y-4">
                  <Field label="Ad">
                    <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} placeholder="Resmi ticari ad" />
                  </Field>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Web sitesi">
                      <input className={inputClass} value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://ornek.com" />
                    </Field>
                    {type !== "SoftwareApplication" && (
                      <Field label="Logo adresi">
                        <input className={inputClass} value={logo} onChange={(e) => setLogo(e.target.value)} placeholder="https://ornek.com/logo.png" />
                      </Field>
                    )}
                  </div>
                  <Field label="Açıklama">
                    <textarea rows={3} className={inputClass} value={description} onChange={(e) => setDescription(e.target.value)} />
                  </Field>
                  {type !== "SoftwareApplication" && (
                    <Field label="Diğer profiller" hint="Her satıra bir adres: LinkedIn, Google Business, Wikipedia, X…">
                      <textarea rows={3} className={inputClass} value={sameAs} onChange={(e) => setSameAs(e.target.value)} />
                    </Field>
                  )}
                </div>
              </Panel>

              {hasContact && (
                <Panel title="İletişim">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Telefon" hint="Uluslararası biçim: +90 212 …">
                      <input className={inputClass} value={telephone} onChange={(e) => setTelephone(e.target.value)} />
                    </Field>
                    <Field label="E-posta">
                      <input className={inputClass} value={email} onChange={(e) => setEmail(e.target.value)} />
                    </Field>
                  </div>
                </Panel>
              )}

              {hasAddress && (
                <Panel title="Adres">
                  <div className="space-y-4">
                    <Field label="Sokak / cadde / no">
                      <input className={inputClass} value={street} onChange={(e) => setStreet(e.target.value)} />
                    </Field>
                    <div className="grid gap-4 sm:grid-cols-4">
                      <Field label="İlçe">
                        <input className={inputClass} value={locality} onChange={(e) => setLocality(e.target.value)} />
                      </Field>
                      <Field label="İl">
                        <input className={inputClass} value={region} onChange={(e) => setRegion(e.target.value)} />
                      </Field>
                      <Field label="Posta kodu">
                        <input className={inputClass} value={postal} onChange={(e) => setPostal(e.target.value)} />
                      </Field>
                      <Field label="Ülke kodu">
                        <input className={inputClass} value={country} onChange={(e) => setCountry(e.target.value)} />
                      </Field>
                    </div>
                  </div>
                </Panel>
              )}

              {type === "MedicalClinic" && (
                <Panel title="Klinik">
                  <Field label="Tıbbi uzmanlık" hint="schema.org'daki İngilizce değerlerden biri: Dermatology, Dentistry, Cardiovascular…">
                    <input className={inputClass} value={specialty} onChange={(e) => setSpecialty(e.target.value)} />
                  </Field>
                </Panel>
              )}

              {type === "LegalService" && (
                <Panel title="Uzmanlık">
                  <Field label="Çalışma alanları">
                    <input className={inputClass} value={knowsAbout} onChange={(e) => setKnowsAbout(e.target.value)} placeholder="Ticaret hukuku, iş hukuku" />
                  </Field>
                </Panel>
              )}

              {type === "SoftwareApplication" && (
                <Panel title="Uygulama">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Kategori" hint="Örn. BusinessApplication, DeveloperApplication">
                      <input className={inputClass} value={category} onChange={(e) => setCategory(e.target.value)} />
                    </Field>
                    <Field label="İşletim sistemi">
                      <input className={inputClass} value={os} onChange={(e) => setOs(e.target.value)} placeholder="Web, iOS, Android" />
                    </Field>
                    <Field label="Fiyat" hint="Ücretsizse 0 yazın; boşsa teklif eklenmez">
                      <input className={inputClass} value={price} onChange={(e) => setPrice(e.target.value)} />
                    </Field>
                    <Field label="Para birimi">
                      <input className={inputClass} value={currency} onChange={(e) => setCurrency(e.target.value)} />
                    </Field>
                  </div>
                </Panel>
              )}
            </>
          )}
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <CodeBlock
            language="HTML"
            title="Çıktı"
            description="Sayfanın <head> bölümüne yapıştırın."
            code={code}
            cursorOutput
            extraAction={
              <button
                type="button"
                onClick={(e) => {
                  download();
                  toolCursor.stamp(e.currentTarget, `.jsonld indirildi`);
                }}
                className="font-mono text-xs text-slate-400 hover:text-white"
              >
                İndir
              </button>
            }
          />
          <div className="mt-4 rounded-md border border-white/10 bg-[#070b12] px-4 py-3">
            {missing.length === 0 ? (
              <Status kind="ok">Zorunlu alanlar dolu</Status>
            ) : (
              <>
                <Status kind="warn">Eksik alanlar</Status>
                <ul className="mt-2 list-disc space-y-0.5 pl-5 text-xs text-slate-400">
                  {missing.map((m) => (
                    <li key={m}>{m}</li>
                  ))}
                </ul>
              </>
            )}
            <a
              href="https://search.google.com/test/rich-results"
              target="_blank"
              rel="noreferrer"
              className="mt-3 block font-mono text-xs text-sky-300 hover:text-sky-200"
            >
              Yayına almadan önce Rich Results Test ile doğrulayın
            </a>
          </div>
        </div>
      </div>
    </ToolPage>
  );
}
