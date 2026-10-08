import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { getPublishedProjectBySlug, getProjectMedia } from "@/lib/cms/queries";
import { parseYouTubeUrl } from "@/lib/cms/media";
import { getMediaUrl } from "@/lib/cms/storage";
import type { MediaRow } from "@/types/database";

interface WorkPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: WorkPageProps): Promise<Metadata> {
  const { slug } = await params;

  const result = await getPublishedProjectBySlug(slug);

  if (result.data) {
    const description =
      result.data.description ??
      `Detalhes de ${result.data.title} no portfólio de Taís.`;

    return {
      title: result.data.title,
      description,
      alternates: { canonical: `/trabalhos/${result.data.slug}` },
      openGraph: {
        title: `${result.data.title} | Taís`,
        description,
        url: `/trabalhos/${result.data.slug}`,
      },
    };
  }

  return {
    title: "Trabalho não encontrado",
    robots: { index: false, follow: false },
  };
}

export default async function WorkPage({ params }: WorkPageProps) {
  const { slug } = await params;

  const projectResult = await getPublishedProjectBySlug(slug);
  const project = projectResult.data;

  // The public work route serves published CMS projects only. There is no
  // static demo fallback, so an unknown or unpublished slug is a 404.
  if (!project) notFound();

  const mediaResult = await getProjectMedia(project.id);
  const cmsMedia: MediaRow[] = mediaResult.data ?? [];

  const media = await Promise.all(
    cmsMedia.map(async (item) => ({
      id: item.id,
      kind: item.kind,
      src:
        item.kind === "image" && item.storage_path
          ? await getMediaUrl(item.storage_path)
          : item.external_url ?? "",
      alt: item.alt ?? undefined,
      caption: item.caption ?? undefined,
      order: item.sort_order,
    })),
  );

  return (
    <PageWrapper>
      <article className="pb-16 pt-12 sm:pb-24 sm:pt-16">
        <Container>
          <Link
            href="/portfolio"
            className="mb-4 inline-flex text-xs tracking-[0.1em] text-black hover:opacity-55"
          >
            ← VOLTAR AO PORTFÓLIO
          </Link>
          <p className="mb-4 text-[0.6rem] tracking-[0.13em] text-black/45">PROJETO</p>
          <h1 className="font-display text-4xl tracking-[-0.055em] text-black sm:text-6xl">
            {project.title}
          </h1>
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-sm text-black/60">
            {project.year && <span>{project.year}</span>}
          </div>
          {project.description && (
            <p className="mt-6 max-w-2xl text-sm leading-6 text-black/60">
              {project.description}
            </p>
          )}

          <div className="mt-12 grid gap-5 sm:mt-16 sm:gap-8">
            {media.map((item) => (
              <figure key={item.id}>
                {item.kind === "image" ? (
                  <div className="relative aspect-[4/3] w-full bg-[#eeeeec] sm:aspect-[16/9]">
                    <Image
                      src={item.src}
                      alt={item.alt ?? project.title}
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
                      title={item.alt ?? `Vídeo de ${project.title}`}
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
        </Container>
      </article>
    </PageWrapper>
  );
}
