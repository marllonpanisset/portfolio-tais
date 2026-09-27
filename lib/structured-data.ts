import { siteConfig } from "@/config/client-site";
import { getPostMetaBySlug } from "@/lib/mdx";

interface BreadcrumbItem {
  name: string;
  path: string;
}

interface ServiceSchemaInput {
  name: string;
  description: string;
  path: string;
}

interface ArticleSchemaInput {
  headline: string;
  description: string;
  path: string;
  datePublished: string;
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

export function serviceJsonLd({
  name,
  description,
  path,
}: ServiceSchemaInput) {
  const url = absoluteUrl(path);

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${url}#service`,
    name,
    description,
    url,
    mainEntityOfPage: {
      "@id": url,
    },
    provider: {
      "@id": personId,
    },
  };
}

export function articleJsonLd({
  headline,
  description,
  path,
  datePublished,
}: ArticleSchemaInput) {
  const url = absoluteUrl(path);
  const slug = path.replace(/^\/blog\//, "");
  const articleSection = getPostMetaBySlug(slug).segment;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${url}#article`,
    headline,
    description,
    datePublished,
    url,
    inLanguage: siteConfig.locale,
    articleSection,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    author: {
      "@type": "Person",
      "@id": personId,
      name: siteConfig.author.name,
      url: siteConfig.author.url,
    },
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
