"use client";

import React from "react";
import Hero from "@/components/cine/Hero";
import Showcase from "@/components/cine/Showcase";
import Career from "@/components/cine/Career";
import Contact from "@/components/cine/Contact";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Showcase />
      <Career />
      <Contact />
    </>
  );
}
