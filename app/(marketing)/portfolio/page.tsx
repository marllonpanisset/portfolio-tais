import type { Metadata } from "next";
import { getPublishedPageBySlug } from "@/lib/cms/queries";
import { parseCmsPageContent } from "@/lib/cms/content-validation";
import { getPortfolioProjects } from "@/lib/portfolio-content-source";
import { PortfolioView, fallbackPortfolioContent } from "@/components/portfolio/PortfolioView";
import { PortfolioProjectList } from "@/components/portfolio/PortfolioProjectList";

export const metadata: Metadata = {
  title: "Portfólio",
  description: "Projetos do portfólio de Taís.",
};

export default async function PortfolioPage() {
  const [result, pageResult] = await Promise.all([
    getPortfolioProjects(),
    getPublishedPageBySlug("portfolio"),
  ]);
  const content =
    (pageResult.data
      ? parseCmsPageContent("portfolio", pageResult.data.content)
      : null) ?? fallbackPortfolioContent;

  return (
    <PortfolioView content={content}>
      {result.error ? (
        <p className="text-sm text-black/60">Não foi possível carregar os projetos agora.</p>
      ) : result.items.length === 0 ? (
        <p className="text-sm text-black/60">Nenhum projeto publicado no momento.</p>
      ) : (
        <PortfolioProjectList projects={result.items} />
      )}
    </PortfolioView>
  );
}
