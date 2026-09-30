import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { getPortfolioCategory, getPublishedPortfolioProjects } from "@/content/portfolio";
import { getPublishedProjectBySlug, getProjectMedia } from "@/lib/cms/queries";
import { parseYouTubeUrl } from "@/lib/cms/media";
import type { MediaRow } from "@/types/database";

interface WorkPageProps {
  params: Promise<{ slug: string }>;
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const BUCKET_NAME = "project-media";

function getPublicUrl(storagePath: string): string {
  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/${storagePath}`;
}

function findProject(slug: string) {
  return getPublishedPortfolioProjects().find((project) => project.slug === slug);
}

export async function generateMetadata({ params }: WorkPageProps): Promise<Metadata> {
  const { slug } = await params;

  // Try CMS first
  const cmsResult = await getPublishedProjectBySlug(slug);
  if (cmsResult.data) {
    return {
      title: cmsResult.data.title,
      description: cmsResult.data.description ?? undefined,
    };
  }

  // Fallback to static content
  const project = findProject(slug);
  return project
    ? { title: project.title, description: project.description }
    : { title: "Projeto não encontrado" };
}

export default async function WorkPage({ params }: WorkPageProps) {
  const { slug } = await params;

  // Try to load from CMS first
  const cmsResult = await getPublishedProjectBySlug(slug);

  if (cmsResult.data) {
    const cmsProject = cmsResult.data;
    // CMS project found — load media from CMS
    const mediaResult = await getProjectMedia(cmsProject.id);
    const cmsMedia: MediaRow[] = mediaResult.data ?? [];

    const media = cmsMedia.map((item) => ({
      id: item.id,
      kind: item.kind,
      src:
        item.kind === "image" && item.storage_path
          ? getPublicUrl(item.storage_path)
          : item.external_url ?? "",
      alt: item.alt ?? undefined,
      caption: item.caption ?? undefined,
      order: item.sort_order,
    }));

    return (
      <PageWrapper>
        <article className="pb-20 pt-12 sm:pb-28 sm:pt-20">
          <Container>
            <p className="mb-3 text-[0.6rem] tracking-[0.13em] text-black/45">PROJETO</p>
            <h1 className="font-display text-4xl tracking-[-0.055em] text-black sm:text-6xl">
              {cmsProject.title}
            </h1>
            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-sm text-black/60">
              {cmsProject.year && <span>{cmsProject.year}</span>}
            </div>
            {cmsProject.description && (
              <p className="mt-6 max-w-2xl text-sm leading-6 text-black/60">
                {cmsProject.description}
              </p>
            )}

            <div className="mt-12 grid gap-5 sm:mt-16 sm:gap-8">
              {media.map((item) => (
                <figure key={item.id}>
                  {item.kind === "image" ? (
                    <div className="relative aspect-[4/3] w-full bg-[#eeeeec] sm:aspect-[16/9]">
                      <Image
                        src={item.src}
                        alt={item.alt ?? cmsProject.title}
                        fill
                        unoptimized
                        sizes="100vw"
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video w-full bg-black">
                      <iframe
                        src={`https://www.youtube.com/embed/${parseYouTubeUrl(item.src) ?? ""}`}
                        title={item.alt ?? `Vídeo de ${cmsProject.title}`}
                        className="h-full w-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  )}
                  {item.caption && (
                    <figcaption className="mt-2 text-xs text-black/55">{item.caption}</figcaption>
                  )}
                </figure>
              ))}
            </div>

            <Link
              href="/portfolio"
              className="mt-12 inline-flex text-xs tracking-[0.1em] text-black hover:opacity-55"
            >
              ← VOLTAR AO PORTFÓLIO
            </Link>
          </Container>
        </article>
      </PageWrapper>
    );
  }

  // Fallback to static content
  const project = findProject(slug);
  if (!project) notFound();

  const category = getPortfolioCategory(project.categoryId);
  const media = [...project.media].sort((a, b) => a.order - b.order);

  return (
    <PageWrapper>
      <article className="pb-20 pt-12 sm:pb-28 sm:pt-20">
        <Container>
          <p className="mb-3 text-[0.6rem] tracking-[0.13em] text-black/45">PROJETO DEMONSTRATIVO</p>
          <h1 className="font-display text-4xl tracking-[-0.055em] text-black sm:text-6xl">{project.title}</h1>
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-sm text-black/60">
            {category && <span>{category.name}</span>}
            {project.year && <span>{project.year}</span>}
          </div>
          <p className="mt-6 max-w-2xl text-sm leading-6 text-black/60">{project.description}</p>

          <div className="mt-12 grid gap-5 sm:mt-16 sm:gap-8">
            {media.map((item) => (
              <figure key={item.id}>
                {item.kind === "image" ? (
                  <div className="relative aspect-[4/3] w-full bg-[#eeeeec] sm:aspect-[16/9]">
                    <Image src={item.src} alt={item.alt ?? project.title} fill unoptimized sizes="100vw" className="object-cover" />
                  </div>
                ) : (
                  <video className="block aspect-video w-full bg-black object-contain" controls preload="metadata" aria-label={item.alt ?? `Vídeo de ${project.title}`}>
                    <source src={item.src} />
                    Seu navegador não oferece suporte à reprodução de vídeo.
                  </video>
                )}
                {item.caption && <figcaption className="mt-2 text-xs text-black/55">{item.caption}</figcaption>}
              </figure>
            ))}
          </div>

          <Link href="/portfolio" className="mt-12 inline-flex text-xs tracking-[0.1em] text-black hover:opacity-55">← VOLTAR AO PORTFÓLIO</Link>
        </Container>
      </article>
    </PageWrapper>
  );
}
