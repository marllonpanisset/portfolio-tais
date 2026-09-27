import type { Metadata } from "next";
import { PageWrapper } from "@/components/layout";
import { Container, Section, Grid, Heading, Text } from "@/components/ui";
import { Hero, CaseCard, CTASection } from "@/components/sections";
import { Button } from "@/components/ui/Button";
import { JsonLd } from "@/components/seo/JsonLd";
import { caseStudies } from "@/content/projetos";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = buildMetadata({
  title: "Projetos",
  description:
    "Conheça os projetos desenvolvidos pela Conjuga e veja como aplicamos engenharia de software para resolver desafios reais de empresas de serviços.",
  path: "/projetos",
});

export default function ProjetosPage() {
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
        ])}
      />

      <Hero
        eyebrow="Projetos"
        title="Projetos"
        description="Os projetos serão publicados conforme autorização dos clientes, com contexto, problema, solução, tecnologias utilizadas e resultados quando for possível verificá-los."
      />

      <Section>
        <Container>
          <Grid cols={3}>
            {caseStudies.map((c) => (
              <CaseCard key={c.slug} caseStudy={c} />
            ))}
          </Grid>
          {caseStudies.length === 0 && (
            <div className="rounded-[16px] border border-border bg-surface shadow-[var(--shadow-card)]">
              <div className="flex items-center gap-3 border-b border-border px-6 py-4 sm:px-8">
                <span className="h-1.5 w-1.5 bg-signal" aria-hidden="true" />
                <Text
                  as="span"
                  variant="caption"
                  className="text-text-secondary"
                >
                  Publicação responsável
                </Text>
              </div>

              <div className="px-6 py-10 sm:px-8 sm:py-12 md:px-10">
                <Heading as="h2" className="max-w-2xl">
                  Projetos serão publicados com autorização dos clientes
                </Heading>
                <Text
                  variant="lead"
                  className="mt-5 max-w-2xl text-text-secondary"
                >
                  Cada publicação apresentará informações reais e verificáveis
                  sobre o contexto, o problema, a solução e os resultados,
                  quando possível.
                </Text>
              </div>
            </div>
          )}
        </Container>
      </Section>

      <Section>
        <CTASection
          title="Vamos conversar sobre o seu projeto"
          description="Conheça nossos serviços, entenda como trabalhamos ou converse com a Conjuga sobre o desafio da sua empresa. Os projetos serão publicados conforme autorização dos clientes."
          actions={
            <>
              <Button href="/servicos" size="lg">
                Conhecer nossos serviços
              </Button>
              <Button href="/sobre" variant="secondary" size="lg">
                Sobre a Conjuga
              </Button>
              <Button href="/contato" variant="ghost" size="lg">
                Conte seu desafio
              </Button>
            </>
          }
        />
      </Section>
    </PageWrapper>
  );
}
