import { parseCmsPageContent } from "./content-validation";
import type { HomePageContent } from "./content-types";

/** Returns a valid Home payload with only galleryLabel replaced. */
export function withHomeGalleryLabel(
  currentContent: unknown,
  galleryLabel: unknown,
): HomePageContent | null {
  if (typeof galleryLabel !== "string") return null;

  const validContent = parseCmsPageContent("home", currentContent);
  if (!validContent) return null;

  return {
    ...validContent,
    galleryLabel,
  };
}
