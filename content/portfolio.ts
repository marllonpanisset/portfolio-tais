import type { PortfolioCategory, PortfolioProject } from "@/types/portfolio";

export const portfolioCategories: PortfolioCategory[] = [
  { id: "arte-e-educacao", slug: "arte-e-educacao", name: "Arte e Educação", order: 1 },
  { id: "cinema-pos-producao", slug: "cinema-pos-producao", name: "Cinema / Pós-produção", order: 2 },
];

const demoDescriptions = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam.",
  "Vestibulum lacinia arcu eget nulla. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.",
  "Curabitur sodales ligula in libero. Sed dignissim lacinia nunc. Curabitur tortor. Pellentesque nibh, aenean quam.",
  "Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla, class aptent taciti sociosqu.",
  "Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper.",
  "Pellentesque nibh. Aenean quam. In scelerisque sem at dolor. Maecenas mattis. Sed convallis tristique sem.",
  "Proin ut ligula vel nunc egestas porttitor. Morbi lectus risus, iaculis vel, suscipit quis, luctus non, massa.",
  "Nam nec ante. Sed lacinia, urna non tincidunt mattis, tortor neque adipiscing diam, a cursus ipsum ante quis turpis.",
  "Ut fringilla. Suspendisse potenti. Nunc feugiat mi a tellus consequat imperdiet. Vestibulum sapien. Proin quam.",
  "Etiam ultrices. Suspendisse in justo eu magna luctus suscipit. Sed lectus. Integer euismod lacus luctus magna.",
  "Quisque cursus, metus vitae pharetra auctor, sem massa mattis sem, at interdum magna augue eget diam.",
  "Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Morbi lacinia molestie dui.",
];

const demoCaptions = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  "Vestibulum ante ipsum primis in faucibus orci luctus.",
  "Sed cursus ante dapibus diam. Nulla quis sem at nibh.",
];

/**
 * Temporary layout content only. Replace titles, dates and external image URLs
 * with approved portfolio material before publishing the site.
 */
export const portfolioProjects: PortfolioProject[] = Array.from({ length: 12 }, (_, index) => {
  const number = index + 1;
  const category = portfolioCategories[index % portfolioCategories.length]!;
  const sequence = String(number).padStart(2, "0");

  return {
    id: `demo-${sequence}`,
    title: `Projeto ${sequence}`,
    slug: `projeto-${sequence}`,
    categoryId: category.id,
    year: 2026,
    description: demoDescriptions[index]!,
    media: [1, 2, 3].map((imageIndex) => ({
      id: `demo-${sequence}-imagem-${imageIndex}`,
      kind: "image",
      src: `https://picsum.photos/seed/portfolio-tais-${sequence}-${imageIndex}/1200/900`,
      alt: `Imagem demonstrativa ${imageIndex} do Projeto ${sequence}`,
      caption: demoCaptions[imageIndex - 1],
      order: imageIndex,
    })),
    order: number,
    status: "published",
  };
});

export function getPublishedPortfolioProjects() {
  return portfolioProjects
    .filter((project) => project.status === "published")
    .sort((a, b) => a.order - b.order);
}

export function getPortfolioCategory(categoryId: string) {
  return portfolioCategories.find((category) => category.id === categoryId);
}
