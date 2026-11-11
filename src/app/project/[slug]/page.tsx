import React from "react";
import { notFound } from "next/navigation";
import { flagships } from "@/data/showcase";
import { AUTHOR_PROFILE, SITE_URL } from "@/lib/geo";
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

  const title = `${project.name} — ${project.category}`;
  const description =
    project.shortDescription.tr || project.heroStatement.tr || project.heroStatement.en;

  return {
    title,
    description,
    alternates: { canonical: `/project/${project.slug}` },
    openGraph: {
      title: `${title} | ${AUTHOR_PROFILE.name}`,
      description,
      url: `${SITE_URL}/project/${project.slug}`,
      type: "article",
      locale: "tr_TR",
      siteName: AUTHOR_PROFILE.name,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${AUTHOR_PROFILE.name}`,
      description,
    },
  };
}

export default async function MissionLogPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const project = flagships.find((p) => p.slug === params.slug);

  if (!project) {
    notFound();
  }

  // Find next flagship mission for the footer link
  const currentIndex = flagships.findIndex((p) => p.slug === project.slug);
  const nextProject = flagships[currentIndex + 1] || flagships[0]; // loop back

  const techs = Array.from(
    new Set([
      ...(project.technologies.frontend ?? []),
      ...(project.technologies.backend ?? []),
      ...(project.technologies.database ?? []),
      ...(project.technologies.ai ?? []),
      ...(project.technologies.seo ?? []),
      ...(project.technologies.mobile ?? []),
    ])
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: project.name,
        applicationCategory: project.category,
        operatingSystem: "Web",
        url: `${SITE_URL}/project/${project.slug}`,
        description: project.shortDescription.tr || project.shortDescription.en,
        keywords: techs.join(", "),
        author: {
          "@type": "Person",
          "@id": `${SITE_URL}/#person`,
          name: AUTHOR_PROFILE.name,
          url: SITE_URL,
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Projeler", item: `${SITE_URL}/#work` },
          {
            "@type": "ListItem",
            position: 3,
            name: project.name,
            item: `${SITE_URL}/project/${project.slug}`,
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProjectContent project={project} nextProject={nextProject} />
    </>
  );
}
