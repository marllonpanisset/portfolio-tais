import type { Metadata } from "next";

import { ContactView } from "@/components/contact/ContactView";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/config/client-site";
import { getPublishedPageBySlug, getSiteSettings } from "@/lib/cms/queries";
import { parseCmsPageContent } from "@/lib/cms/content-validation";

export const metadata: Metadata = {
  title: "Contato",
  description: `Página de contato de ${siteConfig.author.name}.`,
  alternates: { canonical: "/contato" },
  openGraph: {
    title: `Contato | ${siteConfig.author.name}`,
    description: `Página de contato de ${siteConfig.author.name}.`,
    url: "/contato",
  },
};

export default async function ContactPage() {
  const [pageResult, settingsResult] = await Promise.all([
    getPublishedPageBySlug("contato"),
    getSiteSettings(),
  ]);
  const content = pageResult.data
    ? parseCmsPageContent("contact", pageResult.data.content)
    : null;

  // This route serves published CMS content only. When the page is unpublished
  // or its payload does not validate, it shows an honest empty state instead of
  // demo copy.
  if (!content) {
    return (
      <PageWrapper>
        <Container className="pb-16 pt-12 sm:pb-24 sm:pt-16">
          <p className="text-sm text-black/60">Contato em breve.</p>
        </Container>
      </PageWrapper>
    );
  }

  return (
    <ContactView
      content={content}
      settings={settingsResult.data}
    />
  );
}
