export interface CaseStudy {
  slug: string;
  title: string;
  client: string;
  segment: string;
  summary: string;
  context: string;
  problem: string;
  solution: string;
  technologies: string[];
  results?: string;
  serviceSlug: string;
  coverImage: string;
}
