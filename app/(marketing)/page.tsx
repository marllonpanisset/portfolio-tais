import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { PortfolioGallery } from "@/components/portfolio/PortfolioGallery";

export const metadata: Metadata = {
  title: "Home",
  description: "Portfólio de Taís — projetos demonstrativos para validação visual.",
};

export default function HomePage() {
  return (
    <PageWrapper>
      <Container className="pb-16 pt-3 sm:pb-24 sm:pt-5">
        <p className="mb-4 text-[0.6rem] tracking-[0.12em] text-black/45 sm:mb-5">
          GALERIA DEMONSTRATIVA · IMAGENS TEMPORÁRIAS
        </p>
        <PortfolioGallery />
      </Container>
    </PageWrapper>
  );
}
