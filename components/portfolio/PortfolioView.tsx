import type { ReactNode } from "react";

import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { PageWrapper } from "@/components/layout/PageWrapper";
import type { PortfolioPageContent } from "@/lib/cms/content-types";

/** Seed used when the CMS payload is missing or invalid; mirrors the page's current standalone content. */
export const fallbackPortfolioContent: PortfolioPageContent = {
  eyebrow: "SELEÇÃO DE TRABALHOS",
  title: "Portfólio",
  description: "Projetos do portfólio de Taís.",
};

export function PortfolioView({
  content,
  asPreview = false,
  children,
}: {
  content: PortfolioPageContent;
  asPreview?: boolean;
  children?: ReactNode;
}) {
  const rendered = (
    <Container className="pb-20 pt-12 sm:pb-28 sm:pt-20">
      <p className="mb-4 text-[0.65rem] tracking-[0.14em] text-black/45">
        {content.eyebrow}
      </p>
      <Heading
        as="h1"
        className={`font-display text-5xl font-normal tracking-[-0.06em] text-black sm:text-7xl ${
          content.description.trim().length > 0 ? "mb-4 sm:mb-6" : "mb-12 sm:mb-20"
        }`}
      >
        {content.title}
      </Heading>
      {content.description.trim().length > 0 && (
        <p className="mb-12 max-w-xl text-sm leading-6 text-black/60 sm:mb-20">
          {content.description}
        </p>
      )}
      {children}
    </Container>
  );

  return asPreview ? (
    <div className="relative">{rendered}</div>
  ) : (
    <PageWrapper>{rendered}</PageWrapper>
  );
}
