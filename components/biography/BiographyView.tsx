import Image from "next/image";

import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { PageWrapper } from "@/components/layout/PageWrapper";
import type { BiographyPageContent } from "@/lib/cms/content-types";
import { resolveMediaUrl } from "@/lib/media-url";

export function BiographyView({
  content,
  asPreview = false,
}: {
  content: BiographyPageContent;
  asPreview?: boolean;
}) {
  const biographyParagraphs = content.biography
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter((paragraph) => paragraph.length > 0);

  const rendered = (
    <Container className="pb-16 pt-12 sm:pb-24 sm:pt-16">
      <p className="mb-4 text-[0.65rem] tracking-[0.14em] text-black/45">
        BIOGRAFIA
      </p>
      <div className="grid gap-8 sm:gap-10 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:items-start md:gap-14">
        <div className="relative aspect-square w-full max-w-[520px] bg-[#eeeeec]">
          {content.profileImage.trim().length > 0 && (
            <Image
              src={resolveMediaUrl(content.profileImage)}
              alt={`Foto de perfil de ${content.publicName}`}
              fill
              unoptimized
              sizes="(max-width: 767px) 100vw, 42vw"
              className="object-cover"
              priority
            />
          )}
        </div>
        <div>
          <Heading as="h1" className="font-display text-[clamp(3.5rem,10vw,8rem)] font-normal leading-[0.9] tracking-[-0.07em] text-black">
            {content.publicName}
          </Heading>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-black/65 sm:text-lg">
            {content.introduction}
          </p>
          <div className="mt-6 space-y-5 text-sm leading-7 text-black/65 sm:text-base">
            {biographyParagraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-12 grid gap-5 border-t border-black/15 pt-5 sm:mt-16 sm:gap-8 md:grid-cols-[1fr_2fr] md:pt-7">
        <p className="text-[0.65rem] tracking-[0.14em] text-black/45">
          MAIS SOBRE
        </p>
        <div className="max-w-2xl space-y-5 text-sm leading-7 text-black/65 sm:text-base">
          {content.about.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </div>
    </Container>
  );

  return asPreview ? <div className="relative">{rendered}</div> : <PageWrapper>{rendered}</PageWrapper>;
}
