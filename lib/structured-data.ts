import { siteConfig } from "@/config/client-site";

interface BreadcrumbItem {
  name: string;
  path: string;
}

const absoluteUrl = (path: string) =>
  new URL(path, siteConfig.url).toString();

const personId = absoluteUrl("/#person");
const websiteId = absoluteUrl("/#website");

export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": personId,
    name: siteConfig.author.name,
    url: absoluteUrl("/"),
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": websiteId,
    name: siteConfig.name,
    url: absoluteUrl("/"),
    description: siteConfig.description,
    inLanguage: siteConfig.locale,
    publisher: {
      "@id": personId,
    },
  };
}

export function breadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
