import type { Metadata } from "next";
import { HomeRenderer } from "@/components/portfolio/HomeRenderer";
import { getHomeContent } from "@/lib/home-content-source";

export const metadata: Metadata = {
  title: "Portfólio",
  description: "Trabalhos apresentados no portfólio de Taís.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Portfólio | Taís",
    description: "Trabalhos apresentados no portfólio de Taís.",
    url: "/",
  },
};

export default async function HomePage() {
  const { content, error } = await getHomeContent();
  return <HomeRenderer content={content} error={error} />;
}
