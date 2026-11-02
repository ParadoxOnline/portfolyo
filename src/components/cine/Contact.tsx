"use client";

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLang } from "@/providers/LangProvider";
import {
  Rocket,
  Sprout,
  Search,
  Quote,
  Mail,
  MessageCircle,
  X,
  ArrowUpRight,
  Copy,
  Check,
} from "lucide-react";
import { LiveTypoText, useStageBuild } from "@/components/canvas/LiveBuilderSystem";
import {
  clamp01,
  getCloneAndRenameState,
  getTwoAxisBoxState,
} from "@/components/canvas/DevBuildPrimitives";

const EMAIL = "sabricantutuncu@gmail.com";
const PHONE_DISPLAY = "0551 023 56 48";
const PHONE_INTL = "905510235648";

const CONTENT = {
  tr: {
    eyebrow: "BİRLİKTE ÇALIŞALIM",
    titleA: "Birlikte çalışmak istediğim",
    titleB: "ekipler ve işler",
    typoTitle: "Birlikte çalışmak istediğim sıradan işler",
    lead: "Rol olarak bir ekibin içinde üretmek, öğrenmek ve katkı sağlamak istiyorum.",
    seekLabel: "ARADIĞIM",
    seek: [
      { icon: Rocket, title: "Gerçek ürün üreten ekipler", text: "Fikirden yayına, kullanıcıya ulaşan işlerde yer almak istiyorum." },
      { icon: Sprout, title: "Birlikte büyüten bir ortam", text: "Geri bildirime açığım, hızlı öğrenirim ve ekibimle birlikte gelişmek isterim." },
      { icon: Search, title: "Web, WordPress ve SEO işleri", text: "Site geliştirme, performans ve arama motoru görünürlüğü üzerine çalışmak istiyorum." },
    ],
    visionLabel: "VİZYONUM",
    vision: "Karmaşık problemleri sade ve ölçeklenebilir sistemlere dönüştürmek.",
    cta: "Benimle iletişime geç",
    hint: "Birlikte çalışmak için bir mesaj yeterli.",
    modalEyebrow: "İLETİŞİM KANALI SEÇ",
    modalTitle: "Nereden ulaşmak istersiniz?",
    wa: { title: "WhatsApp", desc: "Hızlı sohbet için en kısa yol.", action: "Sohbeti başlat", msg: "Merhaba Sabri, portfolyonu gördüm ve seninle çalışmak istiyorum." },
    mail: { title: "E-posta", desc: "Detaylı teklif ve yazışmalar için.", action: "E-posta gönder", subject: "Portfolyo üzerinden iletişim" },
    copy: "Kopyala",
    copied: "Kopyalandı",
    close: "Kapat",
  },
  az: {
    eyebrow: "BİRLİKDƏ İŞLƏYƏK",
    titleA: "Birlikdə işləmək istədiyim",
    titleB: "komandalar və layihələr",
    typoTitle: "Birlikdə işləmək istədiyim adi işlər",
    lead: "Rol olaraq bir komandanın daxilində istehsal etmək, öyrənmək və dəyər qatmaq istəyirəm.",
    seekLabel: "AXTARDIĞIM",
    seek: [
      { icon: Rocket, title: "Real məhsul yaradan komandalar", text: "Fikirdən yayıma, istifadəçiyə çatan işlərdə yer almaq istəyirəm." },
      { icon: Sprout, title: "Birlikdə inkişaf mühiti", text: "Rəylərə açığam, sürətlə öyrənirəm və komandamla birlikdə böyümək istəyirəm." },
      { icon: Search, title: "Veb, WordPress və SEO layihələri", text: "Sayt inkişafı, performans və axtarış motoru görünürlüyü üzrə işləmək istəyirəm." },
    ],
    visionLabel: "MƏNİM VİZYONUM",
    vision: "Mürəkkəb problemləri sadə və miqyaslana bilən sistemlərə çevirmək.",
    cta: "Mənimlə əlaqə saxlayın",
    hint: "Birlikdə işləmək üçün bircə mesaj kifayətdir.",
    modalEyebrow: "ƏLAQƏ KANALINI SEÇİN",
    modalTitle: "Haradan əlaqə saxlamaq istərdiniz?",
    wa: { title: "WhatsApp", desc: "Sürətli söhbət üçün ən qısa yol.", action: "Söhbəti başlat", msg: "Salam Sabri, portfelini gördüm və səninlə işləmək istəyirəm." },
    mail: { title: "E-poçt", desc: "Ətraflı təklif və yazışmalar üçün.", action: "E-poçt göndər", subject: "Portfel üzərindən əlaqə" },
    copy: "Kopyala",
    copied: "Kopyalandı",
    close: "Bağla",
  },
  en: {
    eyebrow: "LET'S WORK TOGETHER",
    titleA: "The teams and work",
    titleB: "I want to join",
    typoTitle: "The teams and routine tasks",
    lead: "I want to be inside a team: building, learning and adding value.",
    seekLabel: "WHAT I'M LOOKING FOR",
    seek: [
      { icon: Rocket, title: "Teams that ship real products", text: "I want to work on things that go from idea to real users." },
      { icon: Sprout, title: "An environment that grows together", text: "I take feedback well, learn fast and want to grow with my team." },
      { icon: Search, title: "Web, WordPress and SEO work", text: "I want to work on site development, performance and search visibility." },
    ],
    visionLabel: "MY VISION",
    vision: "Turning complex problems into simple, scalable systems.",
    cta: "Get in touch",
    hint: "One message is all it takes to start.",
    modalEyebrow: "CHOOSE A CHANNEL",
    modalTitle: "How would you like to reach me?",
    wa: { title: "WhatsApp", desc: "The fastest way for a quick chat.", action: "Start chat", msg: "Hi Sabri, I saw your portfolio and I'd like to work with you." },
    mail: { title: "Email", desc: "For detailed offers and conversations.", action: "Send email", subject: "Contact via portfolio" },
    copy: "Copy",
    copied: "Copied",
    close: "Close",
  },
} as const;

type CopyType = (typeof CONTENT)["tr"] | (typeof CONTENT)["az"] | (typeof CONTENT)["en"];

function ContactModal({ t, onClose }: { t: CopyType; onClose: () => void }) {
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  const copy = (key: string, value: string) => {
    navigator.clipboard?.writeText(value);
    setCopied(key);
    setTimeout(() => setCopied(null), 1800);
  };

  const channels = [
    {
      key: "wa",
      icon: MessageCircle,
      title: t.wa.title,
      desc: t.wa.desc,
      value: PHONE_DISPLAY,
      raw: PHONE_DISPLAY,
      action: t.wa.action,
      href: `https://wa.me/${PHONE_INTL}?text=${encodeURIComponent(t.wa.msg)}`,
      external: true,
      accent: "emerald",
    },
    {
      key: "mail",
      icon: Mail,
      title: t.mail.title,
      desc: t.mail.desc,
      value: EMAIL,
      raw: EMAIL,
      action: t.mail.action,
      href: `mailto:${EMAIL}?subject=${encodeURIComponent(t.mail.subject)}`,
      external: false,
      accent: "sky",
    },
  ];

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="dialog"
      aria-modal="true"
      aria-label={t.modalTitle}
    >
      <div className="absolute inset-0 bg-[#01040a]/85 backdrop-blur-xl" onClick={onClose} />
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(rgba(125,211,252,0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(125,211,252,0.25) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage: "radial-gradient(circle at center, black 20%, transparent 70%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.96 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-4xl overflow-hidden rounded-3xl border border-white/15 bg-[#050b12]/95 p-6 shadow-[0_0_120px_-20px_rgba(56,189,248,0.45)] md:p-10"
      >
        <motion.div
          className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-300 to-transparent"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.9, delay: 0.2 }}
        />
        <button
          id="contact-close"
          onClick={onClose}
          aria-label={t.close}
          className="absolute right-5 top-5 grid h-10 w-10 place-items-center rounded-full border border-white/15 text-white/60 transition hover:rotate-90 hover:border-white/40 hover:text-white"
        >
          <X size={18} />
        </button>

        <p className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.35em] text-sky-200/80">
          <span className="h-2 w-2 animate-pulse rounded-full bg-sky-300" />
          {t.modalEyebrow}
        </p>
        <h3 className="mt-3 font-display text-3xl font-bold tracking-tight text-white md:text-4xl">
          {t.modalTitle}
        </h3>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {channels.map((c, i) => {
            const Icon = c.icon;
            const green = c.accent === "emerald";
            return (
              <motion.div
                key={c.key}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 + i * 0.15, duration: 0.6 }}
                className={`group relative overflow-hidden rounded-2xl border p-6 transition duration-500 ${
                  green
                    ? "border-emerald-300/20 bg-emerald-400/[0.04] hover:border-emerald-300/60 hover:shadow-[0_0_50px_-10px_rgba(52,211,153,0.5)]"
                    : "border-sky-300/20 bg-sky-400/[0.04] hover:border-sky-300/60 hover:shadow-[0_0_50px_-10px_rgba(56,189,248,0.5)]"
                }`}
              >
                <span
                  className={`grid h-14 w-14 place-items-center rounded-xl border ${
                    green
                      ? "border-emerald-300/40 bg-emerald-400/10 text-emerald-200"
                      : "border-sky-300/40 bg-sky-400/10 text-sky-200"
                  }`}
                >
                  <Icon size={26} />
                </span>
                <h4 className="mt-5 font-display text-2xl font-bold text-white">{c.title}</h4>
                <p className="mt-1 text-sm text-white/55">{c.desc}</p>

                <div className="mt-5 flex items-center justify-between gap-2 rounded-lg border border-white/10 bg-black/30 px-4 py-3 font-mono text-sm text-white/85">
                  <span className="truncate">{c.value}</span>
                  <button
                    onClick={() => copy(c.key, c.raw)}
                    className="flex shrink-0 items-center gap-1.5 text-[11px] uppercase tracking-widest text-white/50 transition hover:text-white"
                  >
                    {copied === c.key ? (
                      <Check size={14} className="text-emerald-300" />
                    ) : (
                      <Copy size={14} />
                    )}
                    {copied === c.key ? t.copied : t.copy}
                  </button>
                </div>

                <a
                  id={`contact-${c.key}`}
                  href={c.href}
                  target={c.external ? "_blank" : undefined}
                  rel={c.external ? "noopener noreferrer" : undefined}
                  className={`mt-5 flex items-center justify-center gap-2 rounded-full px-6 py-3 font-medium text-black transition hover:scale-[1.03] ${
                    green ? "bg-emerald-300" : "bg-sky-200"
                  }`}
                >
                  {c.action}
                  <ArrowUpRight size={18} />
                </a>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Contact() {
  const { lang } = useLang();
  const t = CONTENT[lang] ?? CONTENT.tr;
  const [open, setOpen] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const { progress, activeColor } = useStageBuild("contact-stage", "#38bdf8");

  // 0'dan Profesyonel Yazılımcı İnşa Fazları
  const phase1 = clamp01((progress - 0.13) / 0.15);
  const phase2 = clamp01((progress - 0.25) / 0.08);
  const phase3 = clamp01((progress - 0.48) / 0.18);
  const phase4 = clamp01((progress - 0.64) / 0.20);
  const phase5 = clamp01((progress - 0.82) / 0.15);
  const visionBox = getTwoAxisBoxState(phase5, 760, 110);

  const fullTitle = `${t.titleA} ${t.titleB}`;
  const leadChars = Math.floor(t.lead.length * clamp01((phase3 - 0.2) / 0.8));

  return (
    <section
      ref={sectionRef}
      id="contact"
      data-build-stage="contact-stage"
      className="relative mx-auto w-full max-w-[1580px] overflow-hidden px-6 pb-28 pt-24 md:px-12 md:pt-36"
    >
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[90vmin] w-[90vmin] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[150px] transition-opacity duration-500"
        style={{ backgroundColor: `${activeColor}1c`, opacity: phase1 }}
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* GÖREV 1: Üst Başlık & Vurgu */}
        <div
          data-build-role="grid"
          className="flex items-center justify-center gap-3 font-mono text-xs uppercase tracking-[0.35em] text-sky-300"
          style={{
            opacity: phase1,
            transform: `translate3d(0, ${(1 - phase1) * 14}px, 0)`,
          }}
        >
          <span
            data-build-role="color"
            className="h-2.5 w-2.5 rounded-full transition-colors duration-700"
            style={{ backgroundColor: activeColor, boxShadow: `0 0 12px ${activeColor}` }}
          />
          {t.eyebrow}
        </div>

        {/* GÖREV 2: Ana Başlık */}
        <div
          data-build-role="title"
          className="mt-6 min-h-[2.1em] text-center"
          style={{ opacity: phase2 }}
        >
          <h2 className="mx-auto max-w-[20ch] font-display text-[clamp(2.4rem,5.5vw,5.2rem)] font-bold leading-[1.02] tracking-[-0.03em] text-white">
            <LiveTypoText
              text={fullTitle}
              typoText={t.typoTitle}
              progress={progress}
              gradientAfter={t.titleA.length + 1}
            />
          </h2>
        </div>

        {/* GÖREV 3: Açıklama Metni */}
        <p
          data-build-role="desc"
          className="mx-auto mt-6 min-h-[2.2em] max-w-2xl text-center text-lg leading-[1.7] text-slate-300/75 md:text-xl"
          style={{
            opacity: phase3 > 0.02 ? 1 : 0,
            transform: `translate3d(0, ${(1 - phase3) * 12}px, 0)`,
          }}
        >
          {t.lead.slice(0, Math.max(0, leadChars))}
        </p>

        <span
          className="mt-14 block text-center font-mono text-[11px] uppercase tracking-[0.3em] text-white/40"
          style={{ opacity: phase4 }}
        >
          {t.seekLabel}
        </span>

        {/* GÖREV 4: 3'lü Çalışma Alanı Kartları (1. Karttan 3'e Çoğaltılır ve Başlıkları Tek Tek Değiştirilir!) */}
        <div
          data-build-role="media"
          data-stage-cards="true"
          className="relative mt-6 grid gap-5 md:grid-cols-3"
          style={{ opacity: phase4 > 0.01 ? 1 : 0 }}
        >
          {t.seek.map((s, i) => {
            const Icon = s.icon;
            const st = getCloneAndRenameState(
              phase4,
              i,
              t.seek.length,
              s.title,
              t.seek[0].title,
              310
            );
            const displayBody = st.isCloning ? t.seek[0].text : s.text;

            return (
              <div
                key={s.title}
                className={`relative rounded-2xl border p-7 backdrop-blur-xl transition-colors duration-200 ${
                  st.isRenaming
                    ? "border-sky-400 bg-sky-500/15 ring-2 ring-sky-400/50"
                    : st.isCloning
                    ? "border-dashed border-sky-300/70 bg-sky-400/10"
                    : "border-white/10 bg-white/[0.03] hover:border-sky-300/40 hover:bg-white/[0.05]"
                }`}
                style={{
                  opacity: st.opacity,
                  transform: `translate3d(${st.offsetX.toFixed(1)}px, ${st.offsetY.toFixed(1)}px, 0) scale(${st.scale})`,
                }}
              >
                {st.badgeText && (
                  <span className="pointer-events-none absolute -top-3 right-4 rounded bg-sky-400 px-2 py-0.5 font-mono text-[10px] font-bold text-slate-950 shadow">
                    {st.badgeText}
                  </span>
                )}
                <span className="grid h-11 w-11 place-items-center rounded-xl border border-sky-400/30 bg-sky-400/10 text-sky-300">
                  <Icon size={20} />
                </span>
                <h3 className="mt-5 font-display text-xl font-bold text-white">
                  {st.displayText}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-slate-300/65">
                  {displayBody}
                </p>
              </div>
            );
          })}
        </div>

        {/* GÖREV 5: Vizyon Kartı (Önce Yatay ↔ Sonra Dikey ↕ Açılır) & İletişim Butonu */}
        <div
          data-build-role="badges"
          className="relative mx-auto mt-8 max-w-3xl"
          style={{
            opacity: visionBox.visible ? 1 : 0,
          }}
        >
          {visionBox.isWireframe && (
            <div
              className="pointer-events-none absolute left-0 top-0 z-20 rounded-2xl border border-dashed border-sky-400"
              style={{
                width: `${visionBox.widthPct}%`,
                height: `${visionBox.heightPct}%`,
              }}
            />
          )}
          <div
            className="flex items-start gap-4 rounded-2xl border border-white/10 bg-[#070b14]/85 p-6 backdrop-blur-xl"
            style={{
              clipPath:
                phase5 >= 0.95
                  ? "none"
                  : `inset(0 ${(100 - visionBox.widthPct).toFixed(1)}% ${(100 - visionBox.heightPct).toFixed(1)}% 0 round 16px)`,
            }}
          >
            <Quote size={22} className="mt-1 shrink-0 text-sky-300" />
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-sky-300/80">
                {t.visionLabel}
              </span>
              <p className="mt-1 font-display text-lg font-medium text-white/90 md:text-xl">
                {t.vision}
              </p>
            </div>
          </div>
        </div>

        <div
          data-build-role="cta"
          className="mt-12 text-center"
          style={{
            opacity: phase5,
            transform: `translate3d(0, ${(1 - phase5) * 16}px, 0)`,
            pointerEvents: phase5 < 0.5 ? "none" : "auto",
          }}
        >
          <button
            id="contact-cta"
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-3 rounded-full bg-white px-10 py-4 font-display text-sm font-semibold text-slate-950 shadow-[0_0_50px_rgba(125,211,252,0.4)] transition hover:scale-105 hover:shadow-[0_0_70px_rgba(125,211,252,0.7)]"
          >
            <span>{t.cta}</span>
            <ArrowUpRight size={17} />
          </button>
          <p data-build-role="qa" className="mt-4 text-sm text-white/45">
            {t.hint}
          </p>
        </div>
      </div>

      <AnimatePresence>
        {open && <ContactModal t={t} onClose={() => setOpen(false)} />}
      </AnimatePresence>
    </section>
  );
}
