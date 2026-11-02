"use client";

import React, { useEffect } from "react";
import Lenis from "lenis";
import { useMode } from "@/providers/ModeProvider";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const { mode } = useMode();

  useEffect(() => {
    // Disable smooth scroll for recruiter mode
    if (mode === "recruiter") return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Expo ease out
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, [mode]);

  return <>{children}</>;
}
