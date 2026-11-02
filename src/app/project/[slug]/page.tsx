import React from "react";
import { notFound } from "next/navigation";
import { flagships } from "@/data/showcase";
import type { Metadata } from "next";
import ProjectContent from "./ProjectContent";

export async function generateStaticParams() {
  return flagships.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata(
  props: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const params = await props.params;
  const project = flagships.find((p) => p.slug === params.slug);
  if (!project) return { title: "Not Found" };
  
  return {
    title: `${project.name} — ${project.category} | Sabri Can Tutuncu`,
    description: project.heroStatement.en,
  };
}

export default async function MissionLogPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const project = flagships.find((p) => p.slug === params.slug);
  
  if (!project) {
    notFound();
  }

  // Find next flagship mission for the footer link
  const currentIndex = flagships.findIndex(p => p.slug === project.slug);
  const nextProject = flagships[currentIndex + 1] || flagships[0]; // loop back

  return <ProjectContent project={project} nextProject={nextProject} />;
}
