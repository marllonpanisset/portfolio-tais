import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { getMediaUrl } from "@/lib/cms/storage";
import {
  getProjectCategories,
  getProjectMedia,
  listPublishedProjects,
} from "@/lib/cms/queries";

export const metadata: Metadata = {
  title: "Portfólio",
  description: "Projetos do portfólio de Taís.",
};

interface PortfolioCardProject {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  year: number | null;
  category: string | null;
  image: {
    src: string;
    alt: string | null;
  } | null;
}

async function getPortfolioCardProjects(): Promise<
  { projects: PortfolioCardProject[]; error: boolean }
> {
  const projectsResult = await listPublishedProjects();
  if (projectsResult.data === null) return { projects: [], error: true };

  const results = await Promise.all(
    projectsResult.data.map(async (project) => {
      const [categoriesResult, mediaResult] = await Promise.all([
        getProjectCategories(project.id),
        getProjectMedia(project.id),
      ]);

      // The existing card shows one category: use the first active one by display order.
      const category = categoriesResult.data
        ? [...categoriesResult.data].sort((a, b) => a.sort_order - b.sort_order)[0]
        : undefined;
      const image = mediaResult.data?.find((item) => item.kind === "image");
      const imageSrc = image
        ? image.kind === "image" && image.storage_path
          ? await getMediaUrl(image.storage_path)
          : image.external_url ?? ""
        : "";

      return {
        project: {
          id: project.id,
          title: project.title,
          slug: project.slug,
          description: project.description,
          year: project.year,
          category: category?.name ?? null,
          image: image && imageSrc ? { src: imageSrc, alt: image.alt } : null,
        },
        error: categoriesResult.error !== null || mediaResult.error !== null,
      };
    }),
  );

  return {
    projects: results.map((result) => result.project),
    error: results.some((result) => result.error),
  };
}

export default async function PortfolioPage() {
  const result = await getPortfolioCardProjects();
  const projects = result.projects;

  return (
    <PageWrapper>
      <Container className="pb-20 pt-12 sm:pb-28 sm:pt-20">
        <p className="mb-4 text-[0.65rem] tracking-[0.14em] text-black/45">SELEÇÃO DE TRABALHOS</p>
        <Heading as="h1" className="mb-12 font-display text-5xl font-normal tracking-[-0.06em] text-black sm:mb-20 sm:text-7xl">
          Portfólio
        </Heading>

        {result.error ? (
          <p className="text-sm text-black/60">Não foi possível carregar os projetos agora.</p>
        ) : projects.length === 0 ? (
          <p className="text-sm text-black/60">Nenhum projeto publicado no momento.</p>
        ) : (
          <div className="space-y-16 sm:space-y-24">
            {projects.map((project, index) => (
              <article key={project.id} className="grid items-center gap-5 sm:gap-8 md:grid-cols-12 md:gap-10">
                {project.image && (
                  <Link
                    href={`/trabalhos/${project.slug}`}
                    className={`relative block aspect-[4/3] overflow-hidden bg-[#eeeeec] md:col-span-8 ${index % 2 ? "md:col-start-5" : ""}`}
                    aria-label={`Ver ${project.title}`}
                  >
                    <Image src={project.image.src} alt={project.image.alt ?? project.title} fill unoptimized sizes="(max-width: 767px) 100vw, 67vw" className="object-cover transition duration-300 hover:scale-[1.01]" />
                  </Link>
                )}
                <div className={`md:col-span-4 ${index % 2 ? "md:col-start-1 md:row-start-1" : ""}`}>
                  <p className="mb-3 text-[0.6rem] tracking-[0.12em] text-black/40">PROJETO DEMONSTRATIVO</p>
                  <h2 className="font-display text-2xl tracking-[-0.04em] text-black sm:text-3xl">
                    <Link href={`/trabalhos/${project.slug}`} className="hover:opacity-55">{project.title}</Link>
                  </h2>
                  {project.category && <p className="mt-3 text-sm text-black/60">{project.category}</p>}
                  {project.year && <p className="mt-1 text-sm text-black/60">{project.year}</p>}
                  {project.description && <p className="mt-5 max-w-sm text-sm leading-6 text-black/60">{project.description}</p>}
                </div>
              </article>
            ))}
          </div>
        )}
      </Container>
    </PageWrapper>
  );
}
