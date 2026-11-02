"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

type Mode = "lab" | "recruiter";

interface ModeContextType {
  mode: Mode;
  setMode: (mode: Mode) => void;
}

const ModeContext = createContext<ModeContextType | undefined>(undefined);

export function ModeProvider({ children }: { children: React.ReactNode }) {
  return (
    <React.Suspense fallback={null}>
      <ModeProviderInner>{children}</ModeProviderInner>
    </React.Suspense>
  );
}

function ModeProviderInner({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<Mode>("lab");
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check URL param first
    const modeParam = searchParams.get("mode");
    if (modeParam === "recruiter" || modeParam === "lab") {
      setModeState(modeParam as Mode);
      localStorage.setItem("portfolio_mode", modeParam);
    } else {
      // Fallback to localStorage
      const savedMode = localStorage.getItem("portfolio_mode") as Mode;
      if (savedMode === "recruiter" || savedMode === "lab") {
        setModeState(savedMode);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    // Apply data attribute for CSS scoping
    document.body.setAttribute("data-mode", mode);
  }, [mode]);

  const setMode = (newMode: Mode) => {
    setModeState(newMode);
    localStorage.setItem("portfolio_mode", newMode);
    
    // Update URL without reloading page
    const current = new URLSearchParams(Array.from(searchParams.entries()));
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
