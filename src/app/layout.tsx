import type { Metadata } from "next";
import { Inter, Space_Grotesk, Geist_Mono, Caveat } from "next/font/google";
import "./globals.css";
import { ModeProvider } from "@/providers/ModeProvider";
import { LangProvider } from "@/providers/LangProvider";
import Navbar from "@/components/nav/Navbar";
import SmoothScroll from "@/components/ui/SmoothScroll";
import MobileDesktopNotice from "@/components/ui/MobileDesktopNotice";
import { FrameFx, ScrollProgress } from "@/components/cine/Fx";
import { LiveBuilderProvider } from "@/components/canvas/LiveBuilderSystem";
import { AUTHOR_PROFILE, SITE_URL } from "@/lib/geo";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display-grotesk",
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${AUTHOR_PROFILE.name} — WordPress, Web & SEO/GEO Sistem Mühendisi`,
    template: `%s | ${AUTHOR_PROFILE.name}`,
  },
  description: AUTHOR_PROFILE.summaryTr,
  keywords: [
    "Sabri Can Tütüncü",
    "WordPress Geliştirici İzmir",
    "Elementor Pro Uzmanı",
    "Lokal SEO",
    "Teknik SEO",
    "GEO Generative Engine Optimization",
    "Core Web Vitals Optimizasyonu",
    "Schema.org JSON-LD",
    "Next.js TypeScript Geliştirici",
    "Web Sitesi Hız Optimizasyonu",
  ],
  authors: [{ name: AUTHOR_PROFILE.name, url: SITE_URL }],
  creator: AUTHOR_PROFILE.name,
  publisher: AUTHOR_PROFILE.name,
  alternates: {
    canonical: "/",
    types: {
      "text/markdown": [
        { url: `${SITE_URL}/llms.txt`, title: "LLMs.txt — Portfolyo Dizini" },
        { url: `${SITE_URL}/llms-full.txt`, title: "LLMs Full — Tam Portfolyo Bilgi Tabanı" },
      ],
    },
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    alternateLocale: ["en_US", "az_AZ"],
    url: SITE_URL,
    siteName: AUTHOR_PROFILE.name,
    title: `${AUTHOR_PROFILE.name} — WordPress, Web & SEO/GEO Sistem Mühendisi`,
    description: AUTHOR_PROFILE.summaryTr,
  },
  twitter: {
    card: "summary_large_image",
    title: `${AUTHOR_PROFILE.name} — WordPress, Web & SEO/GEO Sistem Mühendisi`,
    description: AUTHOR_PROFILE.summaryTr,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      className={`${inter.variable} ${spaceGrotesk.variable} ${geistMono.variable} ${caveat.variable}`}
    >
      <body
        className="antialiased selection:bg-blue-500/30 selection:text-white"
        data-mode="lab"
      >
        <ModeProvider>
          <LangProvider>
            <SmoothScroll>
              <LiveBuilderProvider>
                <ScrollProgress />
                <FrameFx />
                <Navbar />
                <main className="min-h-screen">{children}</main>
                <MobileDesktopNotice />
              </LiveBuilderProvider>
            </SmoothScroll>
          </LangProvider>
        </ModeProvider>
      </body>
    </html>
  );
}
