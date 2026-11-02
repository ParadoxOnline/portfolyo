"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { translations } from "@/data/translations";

export type Lang = "en" | "tr" | "az";

interface LangContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  translations: typeof translations;
}

const LangContext = createContext<LangContextType | undefined>(undefined);

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("tr");
  
  useEffect(() => {
    // Basic client-side persistence
    const savedLang = localStorage.getItem("portfolio_lang") as Lang;
    if (savedLang === "en" || savedLang === "tr" || savedLang === "az") {
      setLangState(savedLang);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = (newLang: Lang) => {
    setLangState(newLang);
    localStorage.setItem("portfolio_lang", newLang);
  };

  return (
    <LangContext.Provider value={{ lang, setLang, translations }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  const context = useContext(LangContext);
  if (context === undefined) {
    throw new Error("useLang must be used within a LangProvider");
  }
  return context;
}
