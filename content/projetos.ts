import type { CaseStudy } from "@/types/case-study";

// Projetos só devem ser publicados com informações reais e verificáveis.
export const caseStudies: CaseStudy[] = [];

export function getCaseBySlug(slug: string): CaseStudy | undefined {
  return caseStudies.find((c) => c.slug === slug);
}
