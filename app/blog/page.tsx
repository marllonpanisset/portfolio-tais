import type { Metadata } from "next";
import Link from "next/link";

import { PageWrapper } from "@/components/layout";
import { Container, Section, Card, Heading, Text, Tag } from "@/components/ui";

import { Hero } from "@/components/sections";
import { JsonLd } from "@/components/seo/JsonLd";

import { getAllPostsMeta } from "@/lib/mdx";

import { buildMetadata } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = buildMetadata({
  title: "Blog",

  description:
    "Conteúdo sobre sistemas web, automações, integrações e inteligência artificial aplicada para empresas de serviços, além de presença digital.",

  path: "/blog",
});

/**
 * Blog index page.
 *
 * The page lists published articles and provides
 * internal links to improve content discoverability.
 */
export default function BlogPage() {
  const posts = getAllPostsMeta();

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
        ])}
      />

      <Hero
        eyebrow="Blog"
        title="Conhecimento para operações mais organizadas"
        description="Artigos objetivos para ensinar, esclarecer dúvidas e compartilhar aprendizados sobre software, automação e processos."
      />

      <Section>
        <Container>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {posts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`}>
                <Card className="h-full">
                  {post.segment && <Tag className="w-fit">{post.segment}</Tag>}

                  <Heading
                    as="h2"
                    className="mt-4 text-[clamp(1.375rem,2.2vw,1.75rem)] leading-[1.2] tracking-[-0.01em]"
                  >
                    {post.title}
                  </Heading>

                  <Text variant="muted" className="mt-3">
                    {post.description}
                  </Text>

                  <Text variant="caption" className="mt-6">
                    {post.readingTime}
                  </Text>
                </Card>
              </Link>
            ))}
          </div>

          {posts.length === 0 && (
            <Text variant="muted">Nenhum post publicado ainda.</Text>
          )}
        </Container>
      </Section>
    </PageWrapper>
  );
}
