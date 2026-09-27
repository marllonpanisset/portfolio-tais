import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { services } from "@/content/servicos";
import { caseStudies } from "@/content/projetos";
import { getAllPostsMeta } from "@/lib/mdx";

const createUrl = (path: string) => new URL(path, siteConfig.url).toString();

/**
 * Generates the application sitemap.
 *
 * Keeping route generation centralized ensures all public pages are
 * discoverable by search engines while avoiding duplicated URL logic.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: createUrl("/"),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: createUrl("/servicos"),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: createUrl("/sobre"),
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: createUrl("/projetos"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: createUrl("/blog"),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: createUrl("/contato"),
      changeFrequency: "yearly",
      priority: 0.6,
    },
    {
      url: createUrl("/politica-de-privacidade"),
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: createUrl("/termos-de-uso"),
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ];

  const serviceRoutes: MetadataRoute.Sitemap = services.map((service) => ({
    url: createUrl(`/servicos/${service.slug}`),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const caseRoutes: MetadataRoute.Sitemap = caseStudies.map((project) => ({
    url: createUrl(`/projetos/${project.slug}`),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const blogRoutes: MetadataRoute.Sitemap = getAllPostsMeta().map((post) => ({
    url: createUrl(`/blog/${post.slug}`),
    lastModified: post.date,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [
    ...staticRoutes,
    ...serviceRoutes,
    ...caseRoutes,
    ...blogRoutes,
  ];
}
