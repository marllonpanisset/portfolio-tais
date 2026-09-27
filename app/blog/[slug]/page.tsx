import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PageWrapper } from "@/components/layout";
import {
  Container,
  Divider,
  Section,
  Heading,
  Text,
  Tag,
} from "@/components/ui";
import { JsonLd } from "@/components/seo/JsonLd";

import { getAllPostSlugs, getPostMetaBySlug } from "@/lib/mdx";

import { buildMetadata } from "@/lib/seo";
import {
  articleJsonLd,
  breadcrumbJsonLd,
} from "@/lib/structured-data";

export function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({
    slug,
  }));
}

/**
 * Generates SEO metadata for blog posts.
 *
 * Metadata remains centralized through buildMetadata()
 * to keep canonical URLs, OpenGraph and Twitter Cards consistent.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  try {
    const { slug } = await params;

    const meta = getPostMetaBySlug(slug);

    return buildMetadata({
      title: meta.title,
      description: meta.description,
      path: `/blog/${meta.slug}`,
      type: "article",
      publishedTime: meta.date,
    });
  } catch {
    return {};
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const slugs = getAllPostSlugs();

  if (!slugs.includes(slug)) {
    notFound();
  }

  const meta = getPostMetaBySlug(slug);

  let Post;

  try {
    Post = (await import(`@/content/blog/${slug}.mdx`)).default;
  } catch {
    notFound();
  }

  return (
    <PageWrapper>
      <JsonLd
        data={breadcrumbJsonLd([
          {
            name: "Home",
            path: "/",
          },
          {
            name: "Blog",
            path: "/blog",
          },
          {
            name: meta.title,
            path: `/blog/${meta.slug}`,
          },
        ])}
      />

      <JsonLd
        data={articleJsonLd({
          headline: meta.title,
          description: meta.description,
          path: `/blog/${meta.slug}`,
          datePublished: meta.date,
        })}
      />

      <Section className="pt-16 sm:pt-20 md:pt-28">
        <Container>
          <header className="mx-auto min-w-0 max-w-4xl">
            {meta.segment && <Tag>{meta.segment}</Tag>}

            <Heading
              as="h1"
              className="mt-5 text-balance text-[clamp(2rem,8vw,4.25rem)] leading-[1.08] [overflow-wrap:anywhere] sm:mt-6"
            >
              {meta.title}
            </Heading>

            <Text variant="muted" className="mt-5 sm:mt-6">
              {meta.readingTime}
            </Text>

            <Divider className="mt-6 sm:mt-8" />
          </header>

          <div className="mx-auto min-w-0 max-w-3xl">
            <article className="mt-8 min-w-0 max-w-full text-text-secondary [overflow-wrap:break-word] sm:mt-10 [&>*:first-child]:mt-0 [&_blockquote]:mt-6 [&_blockquote]:border-l-2 [&_blockquote]:border-signal [&_blockquote]:pl-4 [&_img]:my-8 [&_img]:h-auto [&_img]:max-w-full [&_li]:pl-1 [&_li]:leading-7 sm:[&_li]:leading-8 [&_ol]:my-5 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-5 [&_pre]:my-6 [&_pre]:max-w-full [&_pre]:overflow-x-auto [&_table]:block [&_table]:max-w-full [&_table]:overflow-x-auto">
              <Post />
            </article>
          </div>
        </Container>
      </Section>
    </PageWrapper>
  );
}
