import "server-only";

import {
  getProjectCategories,
  getProjectMedia,
  listPublishedPortfolioProjects,
} from "@/lib/cms/queries";
import { getMediaUrl } from "@/lib/cms/storage";
import { mapProjectMediaToHomeGallery } from "@/lib/home-media";
import type { HomeGalleryItem } from "@/lib/home-content";

export interface PortfolioProjectsResult {
  items: HomeGalleryItem[];
  error: boolean;
}

/** Loads the projects selected for the Portfolio and adapts their existing CMS relations for rendering. */
export async function getPortfolioProjects(): Promise<PortfolioProjectsResult> {
  const projectsResult = await listPublishedPortfolioProjects();
  if (projectsResult.data === null) {
    return { items: [], error: true };
  }

  const results = await Promise.all(
    projectsResult.data.map(async (project, index) => {
      const [categoriesResult, mediaResult] = await Promise.all([
        getProjectCategories(project.id),
        getProjectMedia(project.id),
      ]);

      if (categoriesResult.data === null || mediaResult.data === null) {
        return { item: null, error: true };
      }

      // The existing card shows one category; choose the first active category by display order.
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
        order: index,
        media: mapProjectMediaToHomeGallery(resolvedMedia),
        ...(category ? { category: category.name } : {}),
        ...(project.year === null ? {} : { year: project.year }),
      };

      return { item, error: false };
    }),
  );

  const error = results.some((result) => result.error);
  return {
    items: error
      ? []
      : results.flatMap((result) => (result.item ? [result.item] : [])),
    error,
  };
}
