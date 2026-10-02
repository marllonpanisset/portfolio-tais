import "server-only";

import {
  getProjectCategories,
  getProjectMedia,
  getPublicHomePage,
  listFeaturedProjects,
} from "@/lib/cms/queries";
import { getMediaUrl } from "@/lib/cms/storage";
import { parseCmsPageContent } from "@/lib/cms/content-validation";
import { mapProjectMediaToHomeGallery } from "@/lib/home-media";
import type { HomeContent, HomeGalleryItem } from "@/lib/home-content";

export interface HomeContentResult {
  content: HomeContent;
  error: boolean;
}

/** Loads published, featured projects and adapts their existing CMS relations for Home. */
export async function getHomeContent(): Promise<HomeContentResult> {
  const pageResult = await getPublicHomePage();
  const pageContent = pageResult.data
    ? parseCmsPageContent("home", pageResult.data.content)
    : null;

  if (!pageContent) {
    return {
      content: { gallery: { label: "", items: [] } },
      error: true,
    };
  }

  return getFeaturedHomeContent(pageContent.galleryLabel);
}

/** Loads the existing featured-project data for a supplied, already validated gallery label. */
export async function getFeaturedHomeContent(
  galleryLabel: string,
): Promise<HomeContentResult> {
  const projectsResult = await listFeaturedProjects();
  if (projectsResult.data === null) {
    return {
      content: { gallery: { label: galleryLabel, items: [] } },
      error: true,
    };
  }

  const results = await Promise.all(
    projectsResult.data.map(async (project) => {
      const [categoriesResult, mediaResult] = await Promise.all([
        getProjectCategories(project.id),
        getProjectMedia(project.id),
      ]);

      if (categoriesResult.data === null || mediaResult.data === null) {
        return { item: null, error: true };
      }

      // The existing Home card displays one category; choose the first active category by display order.
      const category = [...categoriesResult.data].sort(
        (a, b) => a.sort_order - b.sort_order,
      )[0];
      const resolvedMedia = await Promise.all(
        mediaResult.data.map(async (item) => ({
          id: item.id,
          kind: item.kind,
          source: item.source,
          src:
            item.kind === "image"
              ? item.storage_path
                ? await getMediaUrl(item.storage_path)
                : item.external_url
              : item.source === "youtube"
                ? item.external_url
                : null,
          alt: item.alt,
          caption: item.caption,
          order: item.sort_order,
        })),
      );

      const item: HomeGalleryItem = {
        id: project.id,
        title: project.title,
        slug: project.slug,
        description: project.description ?? "",
        order: project.sort_order,
        media: mapProjectMediaToHomeGallery(resolvedMedia),
        ...(category ? { category: category.name } : {}),
        ...(project.year === null ? {} : { year: project.year }),
      };

      return { item, error: false };
    }),
  );

  const error = results.some((result) => result.error);
  return {
    content: {
      gallery: {
        label: galleryLabel,
        items: error
          ? []
          : results.flatMap((result) => result.item ? [result.item] : []),
      },
    },
    error,
  };
}
