export type HomeGalleryMedia = {
  id: string;
  kind: "image" | "youtube";
  src: string;
  alt?: string;
  caption?: string;
  order: number;
};

export interface HomeGalleryItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  category?: string;
  categories?: string[];
  year?: number;
  order: number;
  media: HomeGalleryMedia[];
}

export interface HomeContent {
  gallery: {
    label: string;
    items: HomeGalleryItem[];
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function normalizeMedia(value: unknown): HomeGalleryMedia | null {
  if (!isRecord(value) || typeof value.id !== "string" || typeof value.src !== "string") {
    return null;
  }
  if (value.kind !== "image" && value.kind !== "youtube") return null;
  if (!isFiniteNumber(value.order)) return null;

  return {
    id: value.id,
    kind: value.kind,
    src: value.src,
    ...(typeof value.alt === "string" ? { alt: value.alt } : {}),
    ...(typeof value.caption === "string" ? { caption: value.caption } : {}),
    order: value.order,
  };
}

function normalizeItem(value: unknown): HomeGalleryItem | null {
  if (
    !isRecord(value) ||
    typeof value.id !== "string" ||
    typeof value.title !== "string" ||
    typeof value.slug !== "string" ||
    typeof value.description !== "string" ||
    !isFiniteNumber(value.order) ||
    !Array.isArray(value.media)
  ) {
    return null;
  }

  const media = value.media.map(normalizeMedia).filter((item) => item !== null);
  return {
    id: value.id,
    title: value.title,
    slug: value.slug,
    description: value.description,
    order: value.order,
    media: media.sort((a, b) => a.order - b.order),
    ...(typeof value.category === "string" ? { category: value.category } : {}),
    ...(Array.isArray(value.categories)
      ? {
          categories: value.categories.filter(
            (c) => typeof c === "string",
          ) as string[],
        }
      : {}),
    ...(isFiniteNumber(value.year) ? { year: value.year } : {}),
  };
}

/** Converts the existing project/category models to the presentation contract used by Home. */
export function mapProjectsToHomeContent(
  projects: ReadonlyArray<{
    id: string;
    title: string;
    slug: string;
    description: string;
    categoryId: string;
    year?: number;
    order: number;
    media: HomeGalleryMedia[];
  }>,
  categories: ReadonlyArray<{ id: string; name: string }>,
  label = "GALERIA",
): HomeContent {
  const items = projects.map((project) => {
    const category = categories.find((item) => item.id === project.categoryId);
    return {
      id: project.id,
      title: project.title,
      slug: project.slug,
      description: project.description,
      order: project.order,
      media: project.media.map((item) => ({ ...item })).sort((a, b) => a.order - b.order),
      ...(category ? { category: category.name } : {}),
      ...(project.year === undefined ? {} : { year: project.year }),
    };
  }).sort((a, b) => a.order - b.order);

  return {
    gallery: {
      label,
      items,
    },
  };
}

/** Validates and orders a future CMS payload without coupling the renderer to Supabase. */
export function normalizeHomeContent(value: unknown): HomeContent | null {
  if (!isRecord(value) || !isRecord(value.gallery)) return null;
  const { label, items } = value.gallery;
  if (typeof label !== "string" || !Array.isArray(items)) return null;

  const normalizedItems = items.map(normalizeItem).filter((item) => item !== null);
  return {
    gallery: {
      label,
      items: normalizedItems.sort((a, b) => a.order - b.order),
    },
  };
}

export function resolveHomeContent(value: unknown, fallback: HomeContent): HomeContent {
  return normalizeHomeContent(value) ?? fallback;
}
