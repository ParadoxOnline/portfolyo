"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

type Mode = "lab" | "recruiter";

interface ModeContextType {
  mode: Mode;
  setMode: (mode: Mode) => void;
}

const ModeContext = createContext<ModeContextType | undefined>(undefined);

export function ModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<Mode>("lab");
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check URL param via native window.location (zero SSR bailout, 100% clean HTML)
    const urlParams = new URLSearchParams(window.location.search);
    const modeParam = urlParams.get("mode");
    if (modeParam === "recruiter" || modeParam === "lab") {
      setModeState(modeParam);
      localStorage.setItem("portfolio_mode", modeParam);
    } else {
      const savedMode = localStorage.getItem("portfolio_mode") as Mode;
      if (savedMode === "recruiter" || savedMode === "lab") {
        setModeState(savedMode);
      }
    }
  }, []);

  useEffect(() => {
    document.body.setAttribute("data-mode", mode);
  }, [mode]);

  const setMode = (newMode: Mode) => {
    setModeState(newMode);
    localStorage.setItem("portfolio_mode", newMode);

    const current = new URLSearchParams(window.location.search);
    if (newMode === "recruiter") {
      current.set("mode", "recruiter");
    } else {
      current.delete("mode");
    }
    const search = current.toString();
    const query = search ? `?${search}` : "";
    router.replace(`${pathname}${query}`);
  };

  return (
    <ModeContext.Provider value={{ mode, setMode }}>
      {children}
    </ModeContext.Provider>
  );
}

export function useMode() {
  const context = useContext(ModeContext);
  if (context === undefined) {
    throw new Error("useMode must be used within a ModeProvider");
  }
  return context;
}
