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
  title: "Sabri Can Tütüncü — Web & SEO Systems Developer",
  description:
    "I build systems that solve structured problems. Web development, SEO infrastructure, AI automation, and digital products.",
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
        className="antialiased selection:bg-sky-400/30 selection:text-white"
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
