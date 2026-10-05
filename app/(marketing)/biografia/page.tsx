import type { Metadata } from "next";

import { BiographyView } from "@/components/biography/BiographyView";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/config/client-site";
import { getPublishedPageBySlug } from "@/lib/cms/queries";
import { parseCmsPageContent } from "@/lib/cms/content-validation";

export const metadata: Metadata = {
  title: "Biografia",
  description: `Biografia de ${siteConfig.author.name}.`,
};

export default async function BiographyPage() {
  const pageResult = await getPublishedPageBySlug("biografia");
  const content = pageResult.data
    ? parseCmsPageContent("biography", pageResult.data.content)
    : null;

  // This route serves published CMS content only. When the page is unpublished
  // or its payload does not validate, it shows an honest empty state instead of
  // demo copy.
  if (!content) {
    return (
      <PageWrapper>
        <Container className="pb-16 pt-12 sm:pb-24 sm:pt-16">
          <p className="mb-4 text-[0.65rem] tracking-[0.14em] text-black/45">
            BIOGRAFIA
          </p>
          <p className="text-sm text-black/60">Biografia em breve.</p>
        </Container>
      </PageWrapper>
    );
  }

  return <BiographyView content={content} />;
}
