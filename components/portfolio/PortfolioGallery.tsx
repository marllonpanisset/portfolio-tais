"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { parseYouTubeUrl } from "@/lib/cms/media";
import type { HomeGalleryItem } from "@/lib/home-content";

export function PortfolioGallery({ items }: { items: HomeGalleryItem[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<HTMLButtonElement>(null);
  const activeProject = activeIndex === null ? null : items[activeIndex];

  useEffect(() => {
    if (activeIndex === null) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActiveIndex(null);
        requestAnimationFrame(() => openerRef.current?.focus());
      }
      if (event.key === "Tab") {
        const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled])',
        );
        if (!focusable?.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (!first || !last) return;
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeIndex]);

  function closeDialog() {
    setActiveIndex(null);
    requestAnimationFrame(() => openerRef.current?.focus());
  }

  function handleDialogKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") closeDialog();
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-x-3 gap-y-7 sm:grid-cols-3 md:grid-cols-4 md:gap-x-5 md:gap-y-10">
        {items.map((project, index) => {
          const image = project.media.find((item) => item.kind === "image");
          const youtube = project.media.find((item) => item.kind === "youtube");
          const youtubeVideoId = youtube ? parseYouTubeUrl(youtube.src) : null;
          const youtubeThumbnail = youtubeVideoId
            ? `https://img.youtube.com/vi/${youtubeVideoId}/hqdefault.jpg`
            : null;
          return (
            <div key={project.id}>
              <button
                type="button"
                onClick={(event) => {
                  openerRef.current = event.currentTarget;
                  setActiveIndex(index);
                }}
                aria-label={`Abrir ${project.title}`}
                className="group block w-full text-left"
              >
                <span className="relative block aspect-[4/3] overflow-hidden bg-[#eeeeec]">
                  {youtubeThumbnail ? (
                    <Image
                      src={youtubeThumbnail}
                      alt={youtube?.alt ?? project.title}
                      fill
                      unoptimized
                      sizes="(max-width: 639px) 50vw, (max-width: 1023px) 33vw, 25vw"
                      className="object-cover transition duration-300 ease-out group-hover:scale-[1.015] group-hover:opacity-90"
                    />
                  ) : (
                    image && (
                      <Image
                        src={image.src}
                        alt={image.alt ?? project.title}
                        fill
                        unoptimized
                        sizes="(max-width: 639px) 50vw, (max-width: 1023px) 33vw, 25vw"
                        className="object-cover transition duration-300 ease-out group-hover:scale-[1.015] group-hover:opacity-90"
                      />
                    )
                  )}
                  {!image && !youtubeThumbnail && youtube && (
                    <span className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-black/50">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full border border-current">
                        <svg viewBox="0 0 16 16" aria-hidden="true" className="ml-0.5 h-4 w-4 fill-current">
                          <path d="M4 2.5v11L13 8z" />
                        </svg>
                      </span>
                      <span className="text-[0.55rem] tracking-[0.12em]">VÍDEO</span>
                    </span>
                  )}
                </span>
                <span className="mt-3 flex items-baseline justify-between gap-3 text-[0.65rem] text-black">
                  <span>{project.title}</span>
                  <span className="text-right text-black/55">{project.category}</span>
                </span>
              </button>
            </div>
          );
        })}
      </div>

      {activeProject && activeIndex !== null && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-white/95 p-4 text-black sm:p-8"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeDialog();
          }}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="portfolio-dialog-title"
            onKeyDown={handleDialogKeyDown}
            className="relative my-auto w-full max-w-6xl"
          >
            <button
              ref={closeRef}
              type="button"
              onClick={closeDialog}
              aria-label="Fechar projeto"
              className="absolute -top-1 right-0 z-10 px-2 py-1 text-2xl leading-none hover:opacity-55 sm:-top-10"
            >
              ×
            </button>
            <div className="grid gap-6 pt-10 sm:pt-0 md:grid-cols-[minmax(0,1.5fr)_minmax(220px,0.8fr)] md:items-center md:gap-12">
              <div className="grid gap-5">
                {(activeProject.media.some((media) => media.kind === "youtube")
                  ? activeProject.media.filter((media) => media.kind === "youtube")
                  : activeProject.media
                ).map((media) => (
                  <figure key={media.id}>
                    {media.kind === "image" ? (
                      <div className="relative aspect-[4/3] bg-[#eeeeec]">
                        <Image
                          src={media.src}
                          alt={media.alt ?? activeProject.title}
                          fill
                          unoptimized
                          sizes="(max-width: 767px) 100vw, 65vw"
                          className="object-contain"
                        />
                      </div>
                    ) : (
                      <div className="aspect-video w-full bg-black">
                        {parseYouTubeUrl(media.src) ? (
                          <iframe
                            src={`https://www.youtube.com/embed/${parseYouTubeUrl(media.src)}`}
                            title={media.alt ?? `Vídeo de ${activeProject.title}`}
                            className="h-full w-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-sm text-white/70">
                            Vídeo indisponível
                          </div>
                        )}
                      </div>
                    )}
                    {media.caption && (
                      <figcaption className="mt-2 text-xs text-black/55">
                        {media.caption}
                      </figcaption>
                    )}
                  </figure>
                ))}
              </div>
              <div className="max-w-md">
                <p className="mb-3 text-[0.65rem] tracking-[0.14em] text-black/45">PROJETO</p>
                <h2 id="portfolio-dialog-title" className="font-display text-3xl font-medium tracking-[-0.04em] sm:text-4xl">{activeProject.title}</h2>
                <p className="mt-3 text-sm text-black/65">{activeProject.category}</p>
                {activeProject.year && <p className="mt-1 text-sm text-black/65">{activeProject.year}</p>}
                <p className="mt-6 text-sm leading-6 text-black/65">{activeProject.description}</p>
                {activeProject.slug && (
                  <Link href={`/trabalhos/${activeProject.slug}`} className="mt-8 inline-flex items-center gap-2 text-xs font-medium tracking-[0.1em] hover:opacity-55">
                    VER PROJETO <span aria-hidden="true">→</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
