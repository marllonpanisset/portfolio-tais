import Link from "next/link";

import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { SocialLinks } from "@/components/social/SocialLinks";
import type { ContactPageContent } from "@/lib/cms/content-types";
import type { SiteSettings } from "@/lib/cms/site-settings";

export function ContactView({
  content,
  settings,
  asPreview = false,
}: {
  content: ContactPageContent;
  settings?: SiteSettings | null;
  asPreview?: boolean;
}) {
  const rendered = (
    <Container className="pb-16 pt-12 sm:pb-24 sm:pt-16">
      <div className="flex items-center gap-4">
        <span aria-hidden="true" className="h-px w-10 bg-black/30" />
        <p className="text-[0.65rem] tracking-[0.14em] text-black/45">
          {content.subtitle}
        </p>
      </div>
      <Heading as="h1" className="mt-6 max-w-5xl font-display text-[clamp(3.5rem,11vw,9rem)] font-normal leading-[0.92] tracking-[-0.07em] text-black">
        {content.title}
      </Heading>

      {content.informationText.trim().length > 0 && (
        <div className="mt-12 border-t border-black/15 pt-6 sm:mt-16 sm:pt-8">
          <div className="grid gap-6 sm:gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:gap-14">
            <p className="text-[0.65rem] tracking-[0.14em] text-black/45">
              Informações
            </p>
            <div className="max-w-2xl">
              <p className="text-lg leading-relaxed text-black/70 sm:text-xl">
                {content.informationText}
              </p>
              <Link
                href="/biografia"
                className="mt-8 inline-flex items-center gap-2 text-xs tracking-[0.08em] text-black hover:opacity-55"
              >
                Conhecer a biografia <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="mt-12 border-t border-black/15 pt-6 sm:mt-16 sm:pt-8">
        <div className="grid gap-6 sm:gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:gap-14">
          <p className="text-[0.65rem] tracking-[0.14em] text-black/45">
            Canais
          </p>
          <div className="max-w-2xl">
            {settings &&
            Object.values(settings).some(
              (value) => typeof value === "string" && value.trim().length > 0,
            ) ? (
              <SocialLinks settings={settings} iconClassName="h-8 w-8" />
            ) : (
              <p className="text-sm italic leading-relaxed text-black/40">
                Os canais de contato serão apresentados aqui assim que forem confirmados.
              </p>
            )}
          </div>
        </div>
      </div>
    </Container>
  );

  return asPreview ? (
    <div className="relative">{rendered}</div>
  ) : (
    <PageWrapper>{rendered}</PageWrapper>
  );
}
