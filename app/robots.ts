import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

/**
 * Generates robots.txt configuration.
 *
 * This keeps crawler rules centralized with the site's SEO configuration
 * and ensures search engines can discover the generated sitemap.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: "/api",
      },
    ],

    sitemap: new URL("/sitemap.xml", siteConfig.url).toString(),
  };
}
