import { Container } from "@/components/ui/Container";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { PortfolioGallery } from "@/components/portfolio/PortfolioGallery";
import type { HomeContent } from "@/lib/home-content";

export function HomeRenderer({
  content,
  error,
  asPreview = false,
  onGalleryLabelClick,
}: {
  content: HomeContent;
  error: boolean;
  asPreview?: boolean;
  onGalleryLabelClick?: () => void;
}) {
  const renderedContent = (
    <Container className="pb-16 pt-12 sm:pb-24 sm:pt-16">
      {onGalleryLabelClick ? (
        <button
          type="button"
          onClick={onGalleryLabelClick}
          aria-label="Selecionar rótulo da galeria"
          className="mb-4 block appearance-none border-0 bg-transparent p-0 text-left text-[0.6rem] tracking-[0.12em] text-black/45 sm:mb-5"
        >
          {content.gallery.label}
        </button>
      ) : (
        <p className="mb-4 text-[0.6rem] tracking-[0.12em] text-black/45 sm:mb-5">
          {content.gallery.label}
        </p>
      )}
        {error ? (
          <p className="text-sm text-black/60">Não foi possível carregar os projetos em destaque agora.</p>
        ) : content.gallery.items.length === 0 ? (
          <p className="text-sm text-black/60">Nenhum projeto em destaque no momento.</p>
        ) : (
          <PortfolioGallery items={content.gallery.items} />
        )}
    </Container>
  );

  return asPreview ? (
    <div className="relative">{renderedContent}</div>
  ) : (
    <PageWrapper>{renderedContent}</PageWrapper>
  );
}
