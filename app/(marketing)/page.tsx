import type { Metadata } from "next";
import { HomeRenderer } from "@/components/portfolio/HomeRenderer";
import { getHomeContent } from "@/lib/home-content-source";

export const metadata: Metadata = {
  title: "Home",
  description: "Portfólio de Taís — projetos demonstrativos para validação visual.",
};

export default async function HomePage() {
  const { content, error } = await getHomeContent();
  return <HomeRenderer content={content} error={error} />;
}
