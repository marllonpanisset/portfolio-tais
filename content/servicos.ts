import { Cpu, Globe2, Workflow } from "lucide-react";
import type { Service } from "@/types/service";

export const services: Service[] = [
  {
    slug: "sistemas-web",
    icon: Cpu,
    name: "Sistemas Web",
    shortDescription:
      "Soluções web desenvolvidas para resolver processos específicos da operação da empresa.",
    problem:
      "Planilhas, controles paralelos e ferramentas genéricas podem dificultar processos importantes e limitar o crescimento do negócio.",
    benefits: [
      "Processos mais organizados",
      "Informações centralizadas",
      "Base preparada para futuras evoluções",
    ],
    includes: [
      "Entendimento da operação",
      "Definição do escopo da solução",
      "Painéis e áreas administrativas",
      "Portais e ferramentas internas",
      "MVPs e aplicações web",
      "Implantação e publicação",
    ],
    process: [
      "Entendimento do contexto",
      "Planejamento da solução",
      "Implantação",
      "Evolução conforme a necessidade",
    ],
    heroTitle: "Soluções web criadas para apoiar a operação da empresa",
    heroDescription:
      "Projetamos e implantamos sistemas web para resolver problemas específicos do negócio, sempre com foco em organização, eficiência e evolução.",
  },

  {
    slug: "automacao",
    icon: Workflow,
    name: "Automações de Processos",
    shortDescription:
      "Automatizamos tarefas repetitivas e conectamos ferramentas para reduzir trabalho manual.",
    problem:
      "Processos manuais consomem tempo, aumentam a chance de erros e dificultam o crescimento da operação.",
    benefits: [
      "Menos tarefas repetitivas",
      "Maior produtividade",
      "Processos mais consistentes",
    ],
    includes: [
      "Mapeamento dos processos",
      "Identificação de oportunidades",
      "Automação de rotinas",
      "Integração entre ferramentas",
      "Testes e implantação",
    ],
    process: [
      "Entendimento do contexto",
      "Planejamento",
      "Implantação",
      "Acompanhamento",
    ],
    heroTitle: "Automações que reduzem retrabalho e aumentam a produtividade",
    heroDescription:
      "Mapeamos processos, automatizamos tarefas repetitivas e integramos ferramentas para tornar a operação mais eficiente.",
  },

  {
    slug: "presenca-digital",
    icon: Globe2,
    name: "Presença Digital",
    shortDescription:
      "Uma base para empresas que precisam estruturar sua presença na internet.",
    problem:
      "Uma presença digital desorganizada reduz a credibilidade da empresa e dificulta a geração de oportunidades.",
    benefits: [
      "Mais credibilidade",
      "Comunicação mais clara",
      "Base preparada para novas soluções",
    ],
    includes: [
      "Landing pages",
      "Sites institucionais",
      "Páginas de serviços",
      "SEO técnico inicial",
      "Publicação da aplicação",
    ],
    process: [
      "Entendimento do contexto",
      "Planejamento",
      "Implantação",
      "Evolução",
    ],
    heroTitle: "Uma presença digital estruturada para a empresa",
    heroDescription:
      "A Presença Digital organiza a comunicação da empresa, fortalece sua credibilidade e prepara uma base para novas soluções conforme o negócio cresce.",
  },
];

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find((service) => service.slug === slug);
}
