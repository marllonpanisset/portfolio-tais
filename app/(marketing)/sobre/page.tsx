import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, Target } from "lucide-react";
import { PageWrapper } from "@/components/layout";
import { Container, Section, Heading, Text } from "@/components/ui";
import { Button } from "@/components/ui/Button";
import { Hero, CTASection } from "@/components/sections";
import { JsonLd } from "@/components/seo/JsonLd";
import { FadeIn } from "@/components/motion";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = buildMetadata({
  title: "Sobre",
  description:
    "Conheça a Conjuga, empresa brasileira de engenharia de software que ajuda empresas de serviços a organizar processos, fortalecer sua presença digital e evoluir sua operação.",
  path: "/sobre",
});

const principles = [
  {
    title: "Entender antes de construir",
    description:
      "Primeiro entendemos a operação, os processos e o problema que precisa ser resolvido.",
  },
  {
    title: "Simplicidade intencional",
    description:
      "Evitamos complexidade, dependências e funcionalidades que não tenham uma justificativa clara.",
  },
  {
    title: "Tecnologia com propósito",
    description:
      "Utilizamos tecnologia para resolver problemas reais da operação, nunca apenas por tendência ou complexidade.",
  },
  {
    title: "Manutenção no longo prazo",
    description:
      "Priorizamos soluções fáceis de entender, manter e expandir conforme novas necessidades aparecem.",
  },
  {
    title: "Decisões com contexto",
    description:
      "Arquitetura, integrações e escolhas técnicas são definidas a partir da realidade de cada negócio.",
  },
];

export default function SobrePage() {
  return (
    <PageWrapper>
      <JsonLd
        data={breadcrumbJsonLd([
          {
            name: "Home",
            path: "/",
          },
          {
            name: "Sobre",
            path: "/sobre",
          },
        ])}
      />

      <Hero
        eyebrow="Sobre a Conjuga"
        title="Engenharia de software para empresas de serviços"
        description="A Conjuga ajuda empresas de serviços a organizar processos, fortalecer sua presença digital e evoluir sua operação por meio de soluções de engenharia de software."
      />

      <Section>
        <Container>
          <div className="grid gap-6 md:grid-cols-12 md:gap-8">
            <Text variant="caption" className="md:col-span-2 md:pt-2">
              A empresa
            </Text>

            <div className="md:col-span-8 md:col-start-4 lg:col-span-7">
              <Heading as="h2" className="max-w-2xl">
                Engenharia de software aplicada ao dia a dia das empresas
              </Heading>

              <Text variant="lead" className="mt-5 max-w-2xl">
                A Conjuga é uma empresa brasileira de engenharia de software
                focada em ajudar empresas de serviços a organizar processos,
                fortalecer sua presença digital e evoluir sua operação de forma
                estruturada.
              </Text>

              <Text className="mt-5 max-w-2xl">
                Em vez de começar pela tecnologia, buscamos compreender como o
                negócio funciona, quais desafios impedem seu crescimento e quais
                soluções realmente fazem sentido para aquele momento. A partir
                desse entendimento desenvolvemos sistemas, sites, automações e
                outras soluções digitais preparados para evoluir junto com a
                empresa.
              </Text>

              <Text className="mt-5 max-w-2xl">
                Nosso compromisso é construir soluções claras, confiáveis e
                fáceis de manter, priorizando decisões que gerem valor para o
                negócio hoje e continuem fazendo sentido conforme a operação
                cresce.
              </Text>
            </div>
          </div>
        </Container>
      </Section>

      <Section surface>
        <Container>
          <div className="max-w-3xl">
            <Text variant="caption">Posicionamento</Text>

            <Heading as="h2" className="mt-3">
              Nossa abordagem
            </Heading>

            <Text variant="lead" className="mt-4">
              A tecnologia é consequência desse entendimento do contexto.
            </Text>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-4 md:mt-16 md:grid-cols-2 md:gap-5">
            <article
              className="
                group h-full
                rounded-[16px] border border-border
                bg-surface p-6
                shadow-[var(--shadow-card)]
                transition-[border-color,background-color,box-shadow]
                duration-200 ease-[var(--ease-signature)]
                hover:border-border-strong
                hover:bg-surface-elevated/50
                hover:shadow-[var(--shadow-card-hover)]
                md:p-8
              "
            >
              <span className="font-mono text-[0.6875rem] font-semibold tracking-[0.08em] text-text-muted">
                01
              </span>

              <span
                className="
                  mt-5 flex h-11 w-11 items-center justify-center
                  rounded-[12px] border border-border-strong/80
                  bg-background/60 text-signal-strong
                  transition-[border-color,background-color]
                  duration-200 ease-[var(--ease-signature)]
                  group-hover:border-signal/35
                  group-hover:bg-signal-soft
                "
              >
                <Target size={20} strokeWidth={1.75} aria-hidden="true" />
              </span>

              <Heading as="h3" className="mt-6 max-w-md">
                Como atuamos
              </Heading>

              <Text
                variant="muted"
                className="mt-3 max-w-xl leading-relaxed text-text-secondary"
              >
                Entendemos primeiro o negócio para depois definir a solução.
                Cada projeto nasce do contexto da empresa e é desenvolvido para
                resolver problemas reais de forma simples, organizada e
                preparada para evoluir.
              </Text>
            </article>

            <article
              className="
                group h-full
                rounded-[16px] border border-border
                bg-surface p-6
                shadow-[var(--shadow-card)]
                transition-[border-color,background-color,box-shadow]
                duration-200 ease-[var(--ease-signature)]
                hover:border-border-strong
                hover:bg-surface-elevated/50
                hover:shadow-[var(--shadow-card-hover)]
                md:p-8
              "
            >
              <span className="font-mono text-[0.6875rem] font-semibold tracking-[0.08em] text-text-muted">
                02
              </span>

              <span
                className="
                  mt-5 flex h-11 w-11 items-center justify-center
                  rounded-[12px] border border-border-strong/80
                  bg-background/60 text-signal-strong
                  transition-[border-color,background-color]
                  duration-200 ease-[var(--ease-signature)]
                  group-hover:border-signal/35
                  group-hover:bg-signal-soft
                "
              >
                <ShieldCheck size={20} strokeWidth={1.75} aria-hidden="true" />
              </span>

              <Heading as="h3" className="mt-6 max-w-md">
                O que valorizamos
              </Heading>

              <Text
                variant="muted"
                className="mt-3 max-w-xl leading-relaxed text-text-secondary"
              >
                Priorizamos clareza, simplicidade e decisões bem fundamentadas.
                A tecnologia deve facilitar a operação da empresa, ser fácil de
                manter e acompanhar seu crescimento ao longo do tempo.
              </Text>
            </article>
          </div>

          <Text variant="muted" className="mt-8">
            Conheça as soluções que desenvolvemos para empresas de serviços em
            nossos{" "}
            <Link
              href="/servicos"
              className="link-underline text-signal-strong"
            >
              serviços
            </Link>
            .
          </Text>
        </Container>
      </Section>

      <Section>
        <Container>
          <FadeIn>
            <Text variant="caption">Princípios</Text>

            <Heading as="h2" className="mt-3 max-w-lg">
              Princípios que orientam nossas decisões
            </Heading>
          </FadeIn>

          <div className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-[16px] border border-border bg-border md:mt-16 lg:grid-cols-6">
            {principles.map((item, index) => (
              <article
                key={item.title}
                className={`
                  h-full min-h-[220px]
                  bg-surface p-6
                  md:p-8
                  lg:min-h-[240px] lg:p-10
                  ${index < 3 ? "lg:col-span-2" : "lg:col-span-3"}
                `}
              >
                <div className="flex h-full flex-col justify-between gap-10">
                  <div className="shrink-0">
                    <span
                      className="
                        flex h-9 w-9 items-center justify-center
                        border border-border-strong
                        bg-background
                        font-mono text-[0.6875rem] font-semibold
                        tracking-[0.04em]
                        text-signal-strong
                      "
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <div className="max-w-md">
                    <Heading as="h3">{item.title}</Heading>

                    <Text
                      variant="muted"
                      className="mt-3 leading-relaxed text-text-secondary"
                    >
                      {item.description}
                    </Text>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </Section>

      <Section surface>
        <Container>
          <div className="grid gap-6 md:grid-cols-12 md:gap-8">
            <Text variant="caption" className="md:col-span-2 md:pt-2">
              Evolução
            </Text>

            <div className="md:col-span-8 md:col-start-4 lg:col-span-7">
              <Heading as="h2" className="max-w-2xl">
                Soluções que evoluem junto com o seu negócio
              </Heading>

              <Text variant="lead" className="mt-5 max-w-2xl">
                Cada empresa está em um momento diferente. Algumas precisam
                fortalecer sua presença digital, enquanto outras já buscam
                organizar processos ou desenvolver sistemas internos para ganhar
                eficiência.
              </Text>

              <Text className="mt-5 max-w-2xl">
                Independentemente do ponto de partida, nosso objetivo é
                construir uma base sólida que permita evoluir sem recomeçar do
                zero. Conforme a operação cresce, novas soluções podem ser
                incorporadas de forma gradual, preservando o que já foi
                construído e acompanhando as novas necessidades do negócio.
              </Text>
            </div>
          </div>
        </Container>
      </Section>

      <Section>
        <CTASection
          title="Vamos entender o próximo desafio da sua empresa?"
          description="Conte como sua empresa funciona hoje e vamos avaliar a solução mais adequada para o seu momento."
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
