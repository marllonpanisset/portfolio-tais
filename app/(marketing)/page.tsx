import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";

import { PageWrapper } from "@/components/layout/PageWrapper";
import { Container, Section, Heading, Text, Grid } from "@/components/ui";
import { Button } from "@/components/ui/Button";

import { CTASection } from "@/components/sections/CTASection";
import { DifferentialsSection } from "@/components/sections/DifferentialsSection";
import { HomeHero } from "@/components/sections/HomeHero";
import { ProcessStep } from "@/components/sections/ProcessStep";
import { ServiceCard } from "@/components/sections/ServiceCard";

import { services } from "@/content/servicos";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Engenharia de software para empresas de serviços",
  description:
    "Desenvolvemos soluções para organizar processos, fortalecer a presença digital e evoluir operações de empresas de serviços conforme o crescimento do negócio.",
  path: "/",
});

const processSteps = [
  {
    title: "Entendimento do contexto",
    description:
      "Entendemos como o negócio funciona, onde estão os gargalos e quais tarefas geram atrito.",
  },
  {
    title: "Planejamento",
    description:
      "Buscamos definir uma solução simples e adequada ao problema antes de escolher a tecnologia.",
  },
  {
    title: "Implantação",
    description:
      "Implantamos, configuramos e validamos a solução com foco em qualidade, segurança e facilidade de evolução.",
  },
  {
    title: "Evolução conforme a necessidade",
    description:
      "Novas necessidades podem orientar a evolução do ativo digital junto com a operação.",
  },
];

export default function HomePage() {
  return (
    <PageWrapper>
      <HomeHero
        eyebrow="Engenharia de software para empresas de serviços"
        title="Soluções para empresas que querem operar com mais eficiência"
        description="Começamos entendendo o problema da empresa e definimos a solução adequada: sistemas web, automações, integrações ou presença digital, conforme a necessidade."
        actions={
          <>
            <Button href="/contato" size="lg">
              Conte seu desafio <ArrowRight size={18} />
            </Button>

            <Button href="/servicos" variant="secondary" size="lg">
              Conhecer nossos serviços
            </Button>
          </>
        }
      />

      <Section className="py-24 md:py-32">
        <Container>
          <div className="grid gap-6 md:grid-cols-12 md:gap-8">
            <Text variant="caption" className="md:col-span-2 md:pt-2">
              Serviços
            </Text>

            <div className="md:col-span-8 md:col-start-4 lg:col-span-7">
              <Heading as="h2" className="max-w-2xl">
                Soluções que evoluem junto com o seu negócio
              </Heading>

              <Text variant="lead" className="mt-5 max-w-2xl">
                Cada solução atende necessidades diferentes. Sistemas Web,
                Automações de Processos e Presença Digital podem ser combinados
                conforme o problema e o contexto da empresa.
              </Text>
            </div>
          </div>

          <Grid
            cols={4}
            className="mt-12 gap-5 border-t border-border pt-8 md:mt-16 md:pt-10"
          >
            {services.map((service) => (
              <ServiceCard key={service.slug} service={service} />
            ))}
          </Grid>
        </Container>
      </Section>

      <Section surface className="py-24 md:py-32">
        <Container>
          <div className="grid gap-6 md:grid-cols-12 md:gap-8">
            <Text variant="caption" className="md:col-span-2 md:pt-2">
              Método
            </Text>

            <div className="md:col-span-8 md:col-start-4 lg:col-span-7">
              <Heading as="h2" className="max-w-2xl">
                Antes do código, entendemos o negócio
              </Heading>

              <Text variant="lead" className="mt-5 max-w-2xl">
                Antes de escolher qualquer tecnologia, entendemos como a empresa
                funciona, identificamos os principais gargalos e definimos a
                solução mais adequada para a realidade do negócio.
              </Text>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-[16px] border border-border bg-border md:mt-16 md:grid-cols-2">
            {processSteps.map((step, i) => (
              <ProcessStep
                key={step.title}
                index={i + 1}
                title={step.title}
                description={step.description}
              />
            ))}
          </div>
        </Container>
      </Section>

      <DifferentialsSection />

      <Section className="py-24 md:py-32">
        <CTASection
          title="Vamos avaliar o caminho adequado para o seu negócio?"
          description="Conte como sua empresa funciona hoje e quais desafios deseja resolver. Com esse contexto, podemos avaliar o caminho mais adequado para a sua realidade."
          actions={
            <Button href="/contato" size="lg">
              Falar com a Conjuga
            </Button>
          }
        />
      </Section>
    </PageWrapper>
  );
}
