import type { Metadata } from "next";

import { ContactView, fallbackContactContent } from "@/components/contact/ContactView";
import { getPublishedPageBySlug, getSiteSettings } from "@/lib/cms/queries";
import { parseCmsPageContent } from "@/lib/cms/content-validation";

export const metadata: Metadata = {
  title: "Contato",
  description: "Informações de contato de Taís. Conteúdo em preparação.",
};

export default async function ContactPage() {
  const [pageResult, settingsResult] = await Promise.all([
    getPublishedPageBySlug("contato"),
    getSiteSettings(),
  ]);
  const content = pageResult.data
    ? parseCmsPageContent("contact", pageResult.data.content)
    : null;

  return (
    <ContactView
      content={content ?? fallbackContactContent}
      settings={settingsResult.data}
    />
  );
}
