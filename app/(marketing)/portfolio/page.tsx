import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { getPortfolioCategory, getPublishedPortfolioProjects } from "@/content/portfolio";

export const metadata: Metadata = {
  title: "Portfólio",
  description: "Projetos demonstrativos do portfólio de Taís.",
};

export default function PortfolioPage() {
  const projects = getPublishedPortfolioProjects();

  return (
    <PageWrapper>
      <Container className="pb-20 pt-12 sm:pb-28 sm:pt-20">
        <p className="mb-4 text-[0.65rem] tracking-[0.14em] text-black/45">SELEÇÃO DE TRABALHOS</p>
        <Heading as="h1" className="mb-12 font-display text-5xl font-normal tracking-[-0.06em] text-black sm:mb-20 sm:text-7xl">
          Portfólio
        </Heading>

        <div className="space-y-16 sm:space-y-24">
          {projects.map((project, index) => {
            const category = getPortfolioCategory(project.categoryId);
            const media = project.media.find((item) => item.kind === "image");
            return (
              <article key={project.id} className="grid items-center gap-5 sm:gap-8 md:grid-cols-12 md:gap-10">
                {media && (
                  <Link
                    href={`/trabalhos/${project.slug}`}
                    className={`relative block aspect-[4/3] overflow-hidden bg-[#eeeeec] md:col-span-8 ${index % 2 ? "md:col-start-5" : ""}`}
                    aria-label={`Ver ${project.title}`}
                  >
                    <Image src={media.src} alt={media.alt ?? project.title} fill unoptimized sizes="(max-width: 767px) 100vw, 67vw" className="object-cover transition duration-300 hover:scale-[1.01]" />
                  </Link>
                )}
                <div className={`md:col-span-4 ${index % 2 ? "md:col-start-1 md:row-start-1" : ""}`}>
                  <p className="mb-3 text-[0.6rem] tracking-[0.12em] text-black/40">PROJETO DEMONSTRATIVO</p>
                  <h2 className="font-display text-2xl tracking-[-0.04em] text-black sm:text-3xl">
                    <Link href={`/trabalhos/${project.slug}`} className="hover:opacity-55">{project.title}</Link>
                  </h2>
                  <p className="mt-3 text-sm text-black/60">{category?.name}</p>
                  {project.year && <p className="mt-1 text-sm text-black/60">{project.year}</p>}
                  <p className="mt-5 max-w-sm text-sm leading-6 text-black/60">{project.description}</p>
                </div>
              </article>
            );
          })}
        </div>
      </Container>
    </PageWrapper>
  );
}
