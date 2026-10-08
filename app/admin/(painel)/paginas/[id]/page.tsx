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
import { getMediaUrl } from "@/lib/cms/storage";
import { isStoragePath } from "@/lib/media-url";
import { getFeaturedHomeContent } from "@/lib/home-content-source";
import type {
  BiographyPageContent,
  ContactPageContent,
  PortfolioPageContent,
} from "@/lib/cms/content-types";
import { HomePageEditor } from "./HomePageEditor";
import { BiographyPageEditor } from "./BiographyPageEditor";
import { PortfolioPageEditor } from "./PortfolioPageEditor";
import { ContactPageEditor } from "./ContactPageEditor";
import { PageEditor } from "./PageEditor";
import { getPortfolioProjects } from "@/lib/portfolio-content-source";

export const metadata: Metadata = {
  title: "Editar Página — Admin",
  robots: { index: false, follow: false },
};

interface EditPagePageProps {
  params: Promise<{ id: string }>;
}

/**
 * Seed for the Biography editor when the page has no valid CMS payload.
 *
 * The field set matches `isBiographyContent` in lib/cms/content-validation.ts,
 * so an empty draft is a structurally valid BiographyPageContent and can be
 * saved and published without the editor rejecting it. Values are intentionally
 * empty: the editor must not pre-fill demo copy.
 */
const EMPTY_BIOGRAPHY_CONTENT: BiographyPageContent = {
  publicName: "",
  profileImage: "",
  introduction: "",
  biography: "",
  about: [],
};

/**
 * Seed for the Portfolio editor when the page has no valid CMS payload.
 *
 * The field set matches `isPortfolioContent` in lib/cms/content-validation.ts,
 * so an empty draft is a structurally valid PortfolioPageContent. Values are
 * intentionally empty: the editor must not pre-fill demo copy.
 */
const EMPTY_PORTFOLIO_CONTENT: PortfolioPageContent = {
  eyebrow: "",
  title: "",
  description: "",
};

/**
 * Seed for the Contact editor when the page has no valid CMS payload.
 *
 * The field set matches `isContactContent` in lib/cms/content-validation.ts,
 * so an empty draft is a structurally valid ContactPageContent. Values are
 * intentionally empty: the editor must not pre-fill demo copy.
 */
const EMPTY_CONTACT_CONTENT: ContactPageContent = {
  title: "",
  subtitle: "",
  informationText: "",
};

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
    const initialProfileImageUrl = pageContent
      ? isStoragePath(pageContent.profileImage)
        ? await getMediaUrl(pageContent.profileImage)
        : pageContent.profileImage
      : "";

    return (
      <BiographyPageEditor
        pageId={page.id}
        isPublished={page.is_published}
        initialContent={pageContent ?? EMPTY_BIOGRAPHY_CONTENT}
        initialProfileImageUrl={initialProfileImageUrl}
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
        initialContent={pageContent ?? EMPTY_PORTFOLIO_CONTENT}
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
        initialContent={pageContent ?? EMPTY_CONTACT_CONTENT}
        previewHeader={<Header />}
        previewFooter={<Footer />}
      />
    );
  }

  return <PageEditor page={page} />;
}
