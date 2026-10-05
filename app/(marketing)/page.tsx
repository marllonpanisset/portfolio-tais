import type { Metadata } from "next";
import { HomeRenderer } from "@/components/portfolio/HomeRenderer";
import { siteConfig } from "@/config/client-site";
import { getHomeContent } from "@/lib/home-content-source";

export const metadata: Metadata = {
  title: "Portfólio",
  description: siteConfig.description,
};

export default async function HomePage() {
  const { content, error } = await getHomeContent();
  return <HomeRenderer content={content} error={error} />;
}
