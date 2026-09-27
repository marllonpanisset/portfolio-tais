import type { Metadata } from "next";

import { PageWrapper } from "@/components/layout";
import { Container, Section, Grid, Heading, Text } from "@/components/ui";

import { Hero, ServiceCard, CTASection } from "@/components/sections";
import { Button } from "@/components/ui/Button";
import { JsonLd } from "@/components/seo/JsonLd";

import { services } from "@/content/servicos";

import { buildMetadata } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = buildMetadata({
  title: "Serviços",
  description:
    "Conheça os serviços da Conjuga para empresas de serviços, incluindo sistemas web, automação de processos, presença digital e soluções desenvolvidas para acompanhar o crescimento do negócio.",
  path: "/servicos",
});

export default function ServicosPage() {
  return (
    <PageWrapper>
      <JsonLd
        data={breadcrumbJsonLd([
          {
            name: "Home",
            path: "/",
          },
          {
            name: "Serviços",
            path: "/servicos",
          },
        ])}
      />

      <Hero
        eyebrow="Serviços"
        title="Soluções desenvolvidas para resolver desafios reais do negócio"
        description="Cada solução nasce do entendimento do problema. Sistemas Web, Automações de Processos e Presença Digital atendem necessidades diferentes e podem ser combinados conforme o contexto da empresa."
      />

      <Section surface>
        <Container>
          <div className="max-w-3xl">
            <Text variant="caption">Antes da tecnologia</Text>

            <Heading as="h2" className="mt-3">
              Comece pelo problema do negócio
            </Heading>

            <Text variant="lead" className="mt-4">
              Você não precisa saber qual tecnologia ou serviço contratar. A
              conversa começa pelo contexto, pelos processos e pelos desafios
              do negócio para compreender qual solução pode ser adequada.
            </Text>

            <Text className="mt-4 max-w-2xl">
              Uma mesma solução pode combinar diferentes serviços para atender
              às necessidades da empresa de forma integrada.
            </Text>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="mb-12 max-w-3xl">
            <Heading as="h2">
              Escolha a solução mais adequada para o momento da sua empresa
            </Heading>

            <Text variant="lead" className="mt-4">
              Não acreditamos em uma solução única para todos os negócios. Cada
              empresa possui desafios diferentes e pode evoluir gradualmente com
              novas soluções conforme sua operação cresce.
            </Text>
          </div>

          <Grid cols={2}>
            {services.map((service) => (
              <ServiceCard key={service.slug} service={service} />
            ))}
          </Grid>
        </Container>
      </Section>

      <Section surface className="py-14 md:py-16">
        <Container>
          <div className="max-w-3xl">
            <Heading as="h2">
              Uma solução pode envolver mais de um serviço
            </Heading>

            <Text className="mt-4">
              Dependendo do desafio da empresa, uma solução pode combinar
              Presença Digital, Sistemas Web e Automações de Processos. Novas
              soluções poderão ser incorporadas conforme a operação evolui e
              novas necessidades surgem.
            </Text>

            <Button href="/sobre" variant="secondary" className="mt-5">
              Entenda como a Conjuga trabalha
            </Button>
          </div>
        </Container>
      </Section>

      <Section>
        <CTASection
          title="Não sabe qual solução faz sentido?"
          description="Conte como sua empresa funciona hoje e quais desafios deseja resolver. Com esse contexto, podemos avaliar o caminho mais adequado para o seu momento."
          actions={
            <Button href="/contato" size="lg">
              Conversar com a Conjuga
            </Button>
          }
        />
      </Section>
    </PageWrapper>
  );
}
