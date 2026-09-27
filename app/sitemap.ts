import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/client-site";
import { portfolioProjects } from "@/content/portfolio";

const createUrl = (path: string) => new URL(path, siteConfig.url).toString();

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: createUrl("/"), changeFrequency: "monthly", priority: 1 },
    { url: createUrl("/biografia"), changeFrequency: "yearly", priority: 0.6 },
    { url: createUrl("/portfolio"), changeFrequency: "monthly", priority: 0.9 },
    { url: createUrl("/contato"), changeFrequency: "yearly", priority: 0.5 },
  ];

  const projectRoutes: MetadataRoute.Sitemap = portfolioProjects
    .filter((project) => project.status === "published")
    .map((project) => ({
      url: createUrl(`/trabalhos/${project.slug}`),
      changeFrequency: "monthly",
      priority: 0.7,
    }));

  return [...staticRoutes, ...projectRoutes];
}
