import type { Metadata } from "next";

import { BiographyView, fallbackBiographyContent } from "@/components/biography/BiographyView";
import { getPublishedPageBySlug } from "@/lib/cms/queries";
import { parseCmsPageContent } from "@/lib/cms/content-validation";

export const metadata: Metadata = {
  title: "Biografia",
  description: "Conteúdo demonstrativo da página de biografia.",
};

export default async function BiographyPage() {
  const pageResult = await getPublishedPageBySlug("biografia");
  const content = pageResult.data
    ? parseCmsPageContent("biography", pageResult.data.content)
    : null;

  return <BiographyView content={content ?? fallbackBiographyContent} />;
}
