import type { HomeGalleryMedia } from "./home-content";

export interface ResolvedProjectMedia {
  id: string;
  kind: "image" | "video";
  source: "upload" | "youtube";
  src: string | null;
  alt: string | null;
  caption: string | null;
  order: number;
}

/** Maps resolved project media to the media formats rendered by the Home gallery. */
export function mapProjectMediaToHomeGallery(
  media: ReadonlyArray<ResolvedProjectMedia>,
): HomeGalleryMedia[] {
  return media
    .flatMap((item): HomeGalleryMedia[] => {
      if (!item.src) return [];

      if (item.kind === "image") {
        return [{
          id: item.id,
          kind: "image",
          src: item.src,
          ...(item.alt ? { alt: item.alt } : {}),
          ...(item.caption ? { caption: item.caption } : {}),
          order: item.order,
        }];
      }

      if (item.source === "youtube") {
        return [{
          id: item.id,
          kind: "youtube",
          src: item.src,
          ...(item.alt ? { alt: item.alt } : {}),
          ...(item.caption ? { caption: item.caption } : {}),
          order: item.order,
        }];
      }

      return [];
    })
    .sort((a, b) => a.order - b.order);
}
