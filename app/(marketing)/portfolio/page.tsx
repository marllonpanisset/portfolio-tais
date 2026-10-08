import type { Metadata } from "next";
import { getPublishedPageBySlug } from "@/lib/cms/queries";
import { parseCmsPageContent } from "@/lib/cms/content-validation";
import { getPortfolioProjects } from "@/lib/portfolio-content-source";
import { PortfolioView } from "@/components/portfolio/PortfolioView";
import { PortfolioFilters } from "@/components/portfolio/PortfolioFilters";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Portfólio",
  description: "Projetos apresentados no portfólio de Taís.",
  alternates: { canonical: "/portfolio" },
  openGraph: {
    title: "Portfólio | Taís",
    description: "Projetos apresentados no portfólio de Taís.",
    url: "/portfolio",
  },
};

export default async function PortfolioPage() {
  const [result, pageResult] = await Promise.all([
    getPortfolioProjects(),
    getPublishedPageBySlug("portfolio"),
  ]);
  const content = pageResult.data
    ? parseCmsPageContent("portfolio", pageResult.data.content)
    : null;

  // This route serves published CMS content only. When the page is unpublished
  // or its payload does not validate, it shows an honest empty state instead of
  // demo copy.
  if (!content) {
    return (
      <PageWrapper>
        <Container className="pb-16 pt-12 sm:pb-24 sm:pt-16">
          <p className="text-sm text-black/60">Portfólio em breve.</p>
        </Container>
      </PageWrapper>
    );
  }

  return (
    <PortfolioView content={content}>
      {result.error ? (
        <p className="text-sm text-black/60">Não foi possível carregar os projetos agora.</p>
      ) : result.items.length === 0 ? (
        <p className="text-sm text-black/60">Nenhum projeto publicado no momento.</p>
      ) : (
        <PortfolioFilters projects={result.items} />
      )}
    </PortfolioView>
  );
}
