import type { LucideIcon } from "lucide-react";
import {
  BrainCircuit,
  Cog,
  DraftingCompass,
  Minimize2,
  ShieldCheck,
  Target,
  Workflow,
  Wrench,
} from "lucide-react";

import { Container, Heading, Section, Text } from "@/components/ui";

interface Differential {
  title: string;
  description: string;
  icon: LucideIcon;
}

const differentials: Differential[] = [
  {
    title: "Abordagem orientada ao negócio",
    description:
      "Entendemos o contexto, os objetivos e os desafios do negócio antes de propor qualquer solução tecnológica.",
    icon: Target,
  },
  {
    title: "Engenharia antes da implementação",
    description:
      "Planejamos arquitetura, fluxos e decisões técnicas antes de iniciar o desenvolvimento para reduzir riscos e retrabalho.",
    icon: DraftingCompass,
  },
  {
    title: "Foco em simplicidade",
    description:
      "Criamos soluções claras, objetivas e sustentáveis, priorizando facilidade de uso, manutenção e evolução.",
    icon: Minimize2,
  },
  {
    title: "Integração entre sistemas",
    description:
      "Conectamos ferramentas, plataformas e processos para reduzir silos e trabalho manual, além de centralizar informações.",
    icon: Workflow,
  },
  {
    title: "Automação de processos",
    description:
      "Automatizamos tarefas repetitivas para aumentar produtividade, reduzir erros operacionais e liberar tempo para atividades estratégicas.",
    icon: Cog,
  },
  {
    title: "Uso responsável de IA",
    description:
      "Aplicamos inteligência artificial apenas quando ela gera valor real, sempre com foco em qualidade, controle e confiabilidade.",
    icon: BrainCircuit,
  },
  {
    title: "Desenvolvimento sob medida",
    description:
      "Desenvolvemos soluções adaptadas às necessidades específicas de cada negócio, respeitando seu contexto, processos e objetivos.",
    icon: Wrench,
  },
  {
    title: "Preocupação com manutenção futura",
    description:
      "Construímos sistemas preparados para evoluir com segurança, documentação adequada e facilidade de manutenção.",
    icon: ShieldCheck,
  },
];

export function DifferentialsSection() {
  return (
    <Section className="py-24 md:py-32">
      <Container>
        <div className="grid gap-6 md:grid-cols-12 md:gap-8">
          <Text variant="caption" className="md:col-span-2 md:pt-2">
            Diferenciais
          </Text>

          <div className="md:col-span-8 md:col-start-4 lg:col-span-7">
            <Heading as="h2" className="max-w-2xl">
              A Conjuga diferencia-se por:
            </Heading>

            <Text variant="lead" className="mt-5 max-w-2xl">
              Sempre partindo do problema de negócio, nunca da tecnologia.
            </Text>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 md:mt-16 md:grid-cols-2 md:gap-5">
          {differentials.map(({ title, description, icon: Icon }, index) => {
            const number = String(index + 1).padStart(2, "0");

            return (
              <article
                key={title}
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
                  {number}
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
                  <Icon size={20} strokeWidth={1.75} aria-hidden="true" />
                </span>

                <Heading as="h3" className="mt-6 max-w-md">
                  {title}
                </Heading>

                <Text
                  variant="muted"
                  className="mt-3 max-w-xl leading-relaxed text-text-secondary"
                >
                  {description}
                </Text>
              </article>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
