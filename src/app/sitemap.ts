import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";
import { INSIGHTS_DATA } from "@/data/ecosystem";
import { SITE_URL, TOOLS_CATALOG } from "@/lib/geo";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const flagshipUrls: MetadataRoute.Sitemap = projects
    .filter((p) => p.status === "flagship")
    .map((project) => ({
      url: `${SITE_URL}/project/${project.slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.85,
    }));

  const insightUrls: MetadataRoute.Sitemap = INSIGHTS_DATA.map((article) => ({
    url: `${SITE_URL}/insights/${article.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const toolUrls: MetadataRoute.Sitemap = TOOLS_CATALOG.map((tool) => ({
    url: `${SITE_URL}${tool.href}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.75,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...flagshipUrls,
    ...insightUrls,
    ...toolUrls,
    {
      url: `${SITE_URL}/llms.txt`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/llms-full.txt`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];
}
