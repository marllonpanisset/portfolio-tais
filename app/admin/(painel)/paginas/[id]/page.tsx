import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  getPageById,
  listAllPortfolioProjects,
  listFeaturedProjects,
  listPublishedProjects,
} from "@/lib/cms/queries";
import { parseCmsPageContent } from "@/lib/cms/content-validation";
import { getFeaturedHomeContent } from "@/lib/home-content-source";
import { fallbackBiographyContent } from "@/components/biography/BiographyView";
import { HomePageEditor } from "./HomePageEditor";
import { BiographyPageEditor } from "./BiographyPageEditor";
import { PortfolioPageEditor } from "./PortfolioPageEditor";
import { ContactPageEditor } from "./ContactPageEditor";
import { PageEditor } from "./PageEditor";
import { fallbackPortfolioContent } from "@/components/portfolio/PortfolioView";
import { fallbackContactContent } from "@/components/contact/ContactView";
import { getPortfolioProjects } from "@/lib/portfolio-content-source";

export const metadata: Metadata = {
  title: "Editar Página — Admin",
  robots: { index: false, follow: false },
};

interface EditPagePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPagePage({ params }: EditPagePageProps) {
  const { id } = await params;

  const supabase = await createClient();

  const { data } = await supabase.auth.getClaims();

  if (!data?.claims) {
    redirect("/admin/login");
  }

  const pageResult = await getPageById(id);

  if (!pageResult.data) {
    notFound();
  }

  const page = pageResult.data;

  if (page.slug === "home") {
    const pageContent = parseCmsPageContent("home", page.content);
    const [previewResult, featuredProjectsResult, publishedProjectsResult] =
      await Promise.all([
        pageContent ? getFeaturedHomeContent(pageContent.galleryLabel) : null,
        listFeaturedProjects(),
        listPublishedProjects(),
      ]);
    const featuredProjects = (featuredProjectsResult.data ?? []).map(
      ({ id: projectId, title }) => ({ id: projectId, title }),
    );
    const featuredIds = new Set(featuredProjects.map((project) => project.id));
    const availableProjects = (publishedProjectsResult.data ?? [])
      .filter((project) => !featuredIds.has(project.id))
      .map(({ id: projectId, title }) => ({ id: projectId, title }));

    return (
      <HomePageEditor
        pageId={page.id}
        isPublished={page.is_published}
        galleryLabel={pageContent?.galleryLabel ?? null}
        previewContent={previewResult?.content ?? {
          gallery: { label: "", items: [] },
        }}
        previewError={previewResult?.error ?? true}
        featuredProjects={featuredProjects}
        availableProjects={availableProjects}
        projectListError={
          featuredProjectsResult.error !== null ||
          publishedProjectsResult.error !== null
        }
        previewHeader={<Header />}
        previewFooter={<Footer />}
      />
    );
  }

  if (page.slug === "biografia") {
    const pageContent = parseCmsPageContent("biography", page.content);

    return (
      <BiographyPageEditor
        pageId={page.id}
        isPublished={page.is_published}
        initialContent={pageContent ?? fallbackBiographyContent}
        previewHeader={<Header />}
        previewFooter={<Footer />}
      />
    );
  }

  if (page.slug === "portfolio") {
    const pageContent = parseCmsPageContent("portfolio", page.content);
    const [selectedProjectsResult, publishedProjectsResult, previewResult] = await Promise.all([
      listAllPortfolioProjects(),
      listPublishedProjects(),
      getPortfolioProjects(),
    ]);
    const portfolioProjects = (selectedProjectsResult.data ?? []).map(
      ({ id: projectId, title, is_published: isProjectPublished }) => ({
        id: projectId,
        title,
        isPublished: isProjectPublished,
      }),
    );
    const selectedIds = new Set(portfolioProjects.map((project) => project.id));
    const availableProjects = (publishedProjectsResult.data ?? [])
      .filter((project) => !selectedIds.has(project.id))
      .map(({ id: projectId, title }) => ({ id: projectId, title }));

    return (
      <PortfolioPageEditor
        pageId={page.id}
        isPublished={page.is_published}
        initialContent={pageContent ?? fallbackPortfolioContent}
        portfolioProjects={portfolioProjects}
        availableProjects={availableProjects}
        projectListError={
          selectedProjectsResult.error !== null ||
          publishedProjectsResult.error !== null
        }
        previewProjects={previewResult.items}
        previewHeader={<Header />}
        previewFooter={<Footer />}
      />
    );
  }

  if (page.slug === "contato") {
    const pageContent = parseCmsPageContent("contact", page.content);

    return (
      <ContactPageEditor
        pageId={page.id}
        isPublished={page.is_published}
        initialContent={pageContent ?? fallbackContactContent}
        previewHeader={<Header />}
        previewFooter={<Footer />}
      />
    );
  }

  return <PageEditor page={page} />;
}
