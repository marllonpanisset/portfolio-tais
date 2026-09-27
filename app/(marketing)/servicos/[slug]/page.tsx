import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Network, ShieldCheck, Target } from "lucide-react";

import { PageWrapper } from "@/components/layout";
import { Container, Section, Heading, Text } from "@/components/ui";

import { Button } from "@/components/ui/Button";
import { Hero, CTASection } from "@/components/sections";
import { JsonLd } from "@/components/seo/JsonLd";

import { Icon } from "@/components/ui/Icon";

import { services, getServiceBySlug } from "@/content/servicos";

import { buildMetadata } from "@/lib/seo";
import { breadcrumbJsonLd, serviceJsonLd } from "@/lib/structured-data";

const benefitIcons = [Target, ShieldCheck, Network];

export function generateStaticParams() {
  return services.map((service) => ({
    slug: service.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const service = getServiceBySlug(slug);

  if (!service) return {};

  return buildMetadata({
    title: service.name,
    description: service.heroDescription,
    path: `/servicos/${service.slug}`,
  });
}

export default async function ServicoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const service = getServiceBySlug(slug);

  if (!service) notFound();

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
          {
            name: service.name,
            path: `/servicos/${service.slug}`,
          },
        ])}
      />

      <JsonLd
        data={serviceJsonLd({
          name: service.name,
          description: service.heroDescription,
          path: `/servicos/${service.slug}`,
        })}
      />

      <Hero
        eyebrow={service.name}
        title={service.heroTitle}
        description={service.heroDescription}
        actions={
          <Button href="/contato" size="lg">
            Conte seu desafio
          </Button>
        }
      />

      <Section surface>
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <Icon icon={service.icon} size={28} className="mx-auto" />

            <Heading as="h2" className="mt-5">
              Problemas que essa solução ajuda a resolver
            </Heading>

            <Text variant="lead" className="mt-4">
              {service.problem}
            </Text>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <Text variant="caption">Benefícios</Text>

          <Heading as="h2" className="mt-3 max-w-lg">
            O que muda na operação
          </Heading>

          <ul className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
            {service.benefits.map((benefit, index) => {
              const BenefitIcon = benefitIcons[index] ?? Target;

              return (
                <li
                  key={benefit}
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
                    {String(index + 1).padStart(2, "0")}
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
                    <BenefitIcon
                      size={20}
                      strokeWidth={1.75}
                      aria-hidden="true"
                    />
                  </span>

                  <Heading as="h3" className="mt-6 max-w-md">
                    {benefit}
                  </Heading>
                </li>
              );
            })}
          </ul>
        </Container>
      </Section>

      <Section>
        <Container>
          <Text variant="caption">O que entregamos</Text>
          <Heading as="h2" className="mt-3 max-w-lg">
            O que está incluído nesta solução
          </Heading>

          <ul className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-[16px] border border-border bg-border md:grid-cols-2 lg:grid-cols-3">
            {service.includes.map((item, index) => (
              <li
                key={item}
                className=" relative h-full min-h-[220px] bg-surface p-6 md:p-8 lg:min-h-[240px] lg:p-10"
              >
                <div className="flex h-full flex-col justify-between gap-10">
                  <span
                    className="
                      flex h-9 w-9 shrink-0 items-center justify-center
                      border border-border-strong
                      bg-background
                      font-mono text-[0.6875rem] font-semibold
                      tracking-[0.04em]
                      text-signal-strong
                    "
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <Heading as="h3" className="max-w-md">
                    {item}
                  </Heading>
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section surface>
        <Container>
          <Text variant="caption">Como trabalhamos</Text>

          <Heading as="h2" className="mt-3 max-w-lg">
            Como conduzimos o trabalho
          </Heading>

          <ol className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-[16px] border border-border bg-border md:grid-cols-2">
            {service.process.map((step, index) => (
              <li
                key={step}
                className="
                  relative
                  h-full
                  min-h-[220px]
                  bg-surface
                  p-6
                  md:p-8
                  lg:min-h-[240px] lg:p-10
                "
              >
                <div className="flex h-full flex-col justify-between gap-10">
                  <span
                    className="
                      flex h-9 w-9 shrink-0 items-center justify-center
                      border border-border-strong
                      bg-background
                      font-mono text-[0.6875rem] font-semibold
                      tracking-[0.04em]
                      text-signal-strong
                    "
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <Heading as="h3" className="max-w-md">
                    {step}
                  </Heading>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="grid gap-6 md:grid-cols-12 md:gap-8">
            <Text variant="caption" className="md:col-span-2 md:pt-2">
              Evolução
            </Text>

            <div className="md:col-span-8 md:col-start-4 lg:col-span-7">
              <Heading as="h2" className="max-w-2xl">
                Uma solução preparada para acompanhar o crescimento da empresa
              </Heading>

              <Text variant="lead" className="mt-5 max-w-2xl">
                Cada projeto resolve uma necessidade atual, mas também pode
                servir de base para futuras evoluções. Conforme a operação
                cresce, novos processos podem ser automatizados, integrados ou
                transformados em soluções mais completas.
              </Text>

              <Text className="mt-5 max-w-2xl">
                Nosso objetivo não é criar dependência tecnológica, mas
                desenvolver soluções organizadas, sustentáveis e preparadas para
                evoluir quando fizer sentido para o negócio.
              </Text>
            </div>
          </div>
        </Container>
      </Section>

      <Section>
        <CTASection
          title="Vamos avaliar o caminho adequado para sua empresa?"
          description="Conte como sua empresa funciona hoje e quais desafios deseja resolver. Com esse contexto, podemos avaliar o caminho mais adequado para a sua realidade."
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
