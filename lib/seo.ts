import type { Metadata } from "next";
import { siteConfig } from "@/config/client-site";

interface BuildMetadataInput {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article";
  publishedTime?: string;
}

/**
 * Generates reusable metadata for dynamic pages.
 *
 * Centralizing metadata generation avoids duplicated SEO logic
 * across pages, works and portfolio sections.
 */
export function buildMetadata({
  title,
  description,
  path,
  image,
  type = "website",
  publishedTime,
}: BuildMetadataInput): Metadata {
  const url = new URL(path, siteConfig.url).toString();
  const resolvedTitle =
    path === "/"
      ? `${siteConfig.name} — ${title}`
      : `${title} — ${siteConfig.name}`;
  const images = image
    ? [new URL(image, siteConfig.url).toString()]
    : undefined;

  return {
    title: path === "/" ? { absolute: resolvedTitle } : title,

    description,

    alternates: {
      canonical: url,
    },

    openGraph: {
      title: resolvedTitle,
      description,
      url,
      siteName: siteConfig.name,
      locale: siteConfig.locale.replace("-", "_"),
      type,
      ...(type === "article" && publishedTime ? { publishedTime } : {}),
      ...(images ? { images } : {}),
    },

    twitter: {
      card: "summary_large_image",
      title: resolvedTitle,
      description,
      ...(images ? { images } : {}),
    },
  };
}
