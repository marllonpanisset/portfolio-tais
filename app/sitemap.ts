import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/client-site";
import { listPublishedPages, listPublishedPortfolioProjects } from "@/lib/cms/queries";

const createUrl = (path: string) => new URL(path, siteConfig.url).toString();

type SitemapEntry = MetadataRoute.Sitemap[number];

/**
 * Public routes backed by a CMS page, keyed by page slug.
 *
 * The sitemap is generated exclusively from published CMS records: a route only
 * appears once its page is published. Slugs outside this map are intentionally
 * excluded so the sitemap can never advertise a URL the app does not serve.
 */
const CMS_PAGE_ROUTES: Record<
  string,
  { path: string; changeFrequency: SitemapEntry["changeFrequency"]; priority: number }
> = {
  biografia: { path: "/biografia", changeFrequency: "yearly", priority: 0.6 },
  portfolio: { path: "/portfolio", changeFrequency: "monthly", priority: 0.9 },
  contato: { path: "/contato", changeFrequency: "yearly", priority: 0.5 },
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [pagesResult, projectsResult] = await Promise.all([
    listPublishedPages(),
    listPublishedPortfolioProjects(),
  ]);

  // On a failed CMS read this yields the root route only. There is no static
  // demo fallback: an empty sitemap is preferable to advertising fake content.
  const publishedPages = pagesResult.data ?? [];
  const publishedProjects = projectsResult.data ?? [];

  const homePage = publishedPages.find((page) => page.slug === "home");

  const pageRoutes: MetadataRoute.Sitemap = [
    {
      url: createUrl("/"),
      changeFrequency: "monthly",
      priority: 1,
      ...(homePage ? { lastModified: homePage.updated_at } : {}),
    },
  ];

  for (const [slug, route] of Object.entries(CMS_PAGE_ROUTES)) {
    const page = publishedPages.find((item) => item.slug === slug);

    if (!page) continue;

    pageRoutes.push({
      url: createUrl(route.path),
      changeFrequency: route.changeFrequency,
      priority: route.priority,
      lastModified: page.updated_at,
    });
  }

  const projectRoutes: MetadataRoute.Sitemap = publishedProjects.map((project) => ({
    url: createUrl(`/trabalhos/${project.slug}`),
    changeFrequency: "monthly",
    priority: 0.7,
    lastModified: project.updated_at,
  }));

  return [...pageRoutes, ...projectRoutes];
}
