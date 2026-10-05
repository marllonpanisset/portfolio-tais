import Image from "next/image";
import Link from "next/link";

import { parseYouTubeUrl } from "@/lib/cms/media";
import type { HomeGalleryItem } from "@/lib/home-content";

export function PortfolioProjectList({ projects }: { projects: HomeGalleryItem[] }) {
  return (
    <div className="space-y-16 sm:space-y-24">
      {projects.map((project, index) => {
        const image = project.media.find((item) => item.kind === "image");
        const youtube = project.media.find((item) => item.kind === "youtube");
        const youtubeVideoId = youtube ? parseYouTubeUrl(youtube.src) : null;
        const imageSrc = image?.src ?? (youtubeVideoId
          ? `https://img.youtube.com/vi/${youtubeVideoId}/hqdefault.jpg`
          : null);

        return (
          <article key={project.id} className="grid items-center gap-5 sm:gap-8 md:grid-cols-12 md:gap-10">
            {imageSrc && (
              <Link
                href={`/trabalhos/${project.slug}`}
                className={`relative block aspect-[4/3] overflow-hidden bg-[#eeeeec] md:col-span-8 ${index % 2 ? "md:col-start-5" : ""}`}
                aria-label={`Ver ${project.title}`}
              >
                <Image src={imageSrc} alt={image?.alt ?? project.title} fill unoptimized sizes="(max-width: 767px) 100vw, 67vw" className="object-cover transition duration-300 hover:scale-[1.01]" />
              </Link>
            )}
            <div className={`md:col-span-4 ${index % 2 ? "md:col-start-1 md:row-start-1" : ""}`}>
              <p className="mb-3 text-[0.6rem] tracking-[0.12em] text-black/40">PROJETO</p>
              <h2 className="font-display text-2xl tracking-[-0.04em] text-black sm:text-3xl">
                <Link href={`/trabalhos/${project.slug}`} className="hover:opacity-55">{project.title}</Link>
              </h2>
              {project.category && <p className="mt-3 text-sm text-black/60">{project.category}</p>}
              {project.year && <p className="mt-1 text-sm text-black/60">{project.year}</p>}
              {project.description && <p className="mt-5 max-w-sm text-sm leading-6 text-black/60">{project.description}</p>}
            </div>
          </article>
        );
      })}
    </div>
  );
}
