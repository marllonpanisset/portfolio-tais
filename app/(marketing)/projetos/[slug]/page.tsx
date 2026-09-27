import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PageWrapper } from "@/components/layout";
import { Container, Section, Heading, Text, Tag } from "@/components/ui";
import { Button } from "@/components/ui/Button";
import { Hero, CTASection } from "@/components/sections";
import { JsonLd } from "@/components/seo/JsonLd";

import { caseStudies, getCaseBySlug } from "@/content/projetos";
import { getServiceBySlug } from "@/content/servicos";

import { buildMetadata } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/structured-data";

export function generateStaticParams() {
  return caseStudies.map((c) => ({
    slug: c.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const caseStudy = getCaseBySlug(slug);

  if (!caseStudy) {
    return {};
  }

  return buildMetadata({
    title: caseStudy.title,
    description: caseStudy.summary,
    path: `/projetos/${caseStudy.slug}`,
  });
}

export default async function CasePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const caseStudy = getCaseBySlug(slug);

  if (!caseStudy) {
    notFound();
  }

  const relatedService = getServiceBySlug(caseStudy.serviceSlug);

  return (
    <PageWrapper>
      <JsonLd
        data={breadcrumbJsonLd([
          {
            name: "Home",
            path: "/",
          },
          {
            name: "Projetos",
            path: "/projetos",
          },
          {
            name: caseStudy.title,
            path: `/projetos/${caseStudy.slug}`,
          },
        ])}
      />

      <Hero
        eyebrow={caseStudy.segment}
        title={caseStudy.title}
        description={caseStudy.summary}
        align="left"
      />

      <Section surface>
        <Container>
          <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
            <div>
              <Text variant="caption">Contexto do projeto</Text>

              <Text variant="body" className="mt-2 text-text-primary">
                {caseStudy.client}
              </Text>
            </div>

            <div>
              <Text variant="caption">Segmento</Text>

              <div className="mt-2">
                <Tag>{caseStudy.segment}</Tag>
              </div>
            </div>

            {relatedService && (
              <div>
                <Text variant="caption">Solução aplicada</Text>

                <Text variant="body" className="mt-2 text-text-primary">
                  {relatedService.name}
                </Text>
              </div>
            )}
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="max-w-2xl space-y-10">
            <div>
              <Heading as="h2">Contexto</Heading>
              <Text variant="lead" className="mt-4">
                {caseStudy.context}
              </Text>
            </div>

            <div>
              <Heading as="h2">Problema</Heading>
              <Text variant="lead" className="mt-4">
                {caseStudy.problem}
              </Text>
            </div>

            <div>
              <Heading as="h2">Solução</Heading>
              <Text variant="lead" className="mt-4">
                {caseStudy.solution}
              </Text>
            </div>

            <div>
              <Heading as="h2">Tecnologias utilizadas</Heading>
              <div className="mt-4 flex flex-wrap gap-3">
                {caseStudy.technologies.map((technology) => (
                  <Tag key={technology}>{technology}</Tag>
                ))}
              </div>
            </div>

            {caseStudy.results && (
              <div>
                <Heading as="h2">Resultados</Heading>
                <Text variant="lead" className="mt-4">
                  {caseStudy.results}
                </Text>
              </div>
            )}
          </div>
        </Container>
      </Section>

      <Section>
        <CTASection
          title="Tem um desafio parecido?"
          description="Conte o problema e o contexto da sua empresa para avaliarmos a solução mais adequada à sua necessidade."
          actions={
            <Button href="/contato" size="lg">
              Conte seu desafio
            </Button>
          }
        />
      </Section>
    </PageWrapper>
  );
}
