import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

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
 * across services, projects, blog posts and landing pages.
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
  const images = [
    {
      url: new URL(
        image ?? siteConfig.openGraphImage.path,
        siteConfig.url,
      ).toString(),
      width: siteConfig.openGraphImage.width,
      height: siteConfig.openGraphImage.height,
      alt: image ? title : siteConfig.openGraphImage.alt,
    },
  ];

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
      images,
    },

    twitter: {
      card: "summary_large_image",
      title: resolvedTitle,
      description,
      images: images.map(({ url: imageUrl }) => imageUrl),
    },
  };
}
