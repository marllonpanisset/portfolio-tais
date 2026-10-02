"use client";

import { useRef, useState, useTransition, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Route } from "next";
import { HomeRenderer } from "@/components/portfolio/HomeRenderer";
import type { HomeContent } from "@/lib/home-content";
import { saveHomeGalleryLabel, setProjectFeatured } from "./actions";

interface FeaturedProjectOption {
  id: string;
  title: string;
}

interface HomePageEditorProps {
  pageId: string;
  galleryLabel: string | null;
  previewContent: HomeContent;
  previewError: boolean;
  featuredProjects: FeaturedProjectOption[];
  availableProjects: FeaturedProjectOption[];
  projectListError: boolean;
  previewHeader: ReactNode;
  previewFooter: ReactNode;
}

export function HomePageEditor({
  pageId,
  galleryLabel,
  previewContent,
  previewError,
  featuredProjects,
  availableProjects,
  projectListError,
  previewHeader,
  previewFooter,
}: HomePageEditorProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isProjectPending, startProjectTransition] = useTransition();
  const [feedback, setFeedback] = useState<
    { type: "success" | "error"; message: string } | null
  >(null);
  const [projectFeedback, setProjectFeedback] = useState<
    { type: "success" | "error"; message: string } | null
  >(null);
  const [selectedField, setSelectedField] = useState<"galleryLabel" | null>(null);
  const galleryLabelInputRef = useRef<HTMLInputElement>(null);
  const [localGalleryLabel, setLocalGalleryLabel] = useState(galleryLabel ?? "");
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const previewWithLocalLabel: HomeContent = {
    ...previewContent,
    gallery: {
      ...previewContent.gallery,
      label: localGalleryLabel,
    },
  };

  function handleSave() {
    setFeedback(null);
    startTransition(async () => {
      const result = await saveHomeGalleryLabel(pageId, localGalleryLabel);
      setFeedback(
        result.success
          ? { type: "success", message: "Rótulo da galeria salvo." }
          : { type: "error", message: result.error },
      );
    });
  }

  function focusGalleryLabelField() {
    setSelectedField("galleryLabel");
    galleryLabelInputRef.current?.focus();
  }

  function updateFeaturedProject(projectId: string, isFeatured: boolean) {
    setProjectFeedback(null);
    startProjectTransition(async () => {
      const result = await setProjectFeatured(projectId, isFeatured);
      if (!result.success) {
        setProjectFeedback({ type: "error", message: result.error });
        return;
      }

      setSelectedProjectId("");
      setProjectFeedback({
        type: "success",
        message: isFeatured
          ? "Projeto adicionado aos destaques da Home."
          : "Projeto removido dos destaques da Home.",
      });
      router.refresh();
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex h-screen flex-col bg-surface">
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-border/70 bg-surface-elevated px-4">
        <div className="flex items-center gap-3">
          <Link
            href={"/admin/paginas" as Route}
            className="inline-flex h-8 items-center justify-center rounded-[var(--radius-sm)] border border-border/70 bg-surface px-3 text-xs font-medium text-text-secondary transition-colors hover:border-border hover:text-text-primary"
          >
            Fechar
          </Link>
          <div className="h-4 w-px bg-border" />
          <h1 className="text-sm font-medium text-text-primary">Home</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden text-xs text-text-secondary sm:inline">Home</span>
          <button
            type="button"
            onClick={handleSave}
            disabled={isPending}
            className="inline-flex h-8 items-center justify-center rounded-[var(--radius-sm)] bg-signal px-3 text-xs font-medium text-white transition-opacity hover:opacity-85 disabled:cursor-wait disabled:opacity-60"
          >
            {isPending ? "Salvando…" : "Salvar"}
          </button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col md:flex-row">
        <aside className="shrink-0 border-b border-border/70 bg-surface-elevated p-5 md:w-72 md:border-b-0 md:border-r">
          <h2 className="text-xs font-medium uppercase tracking-wider text-text-muted">
            Home
          </h2>
          <div className="mt-6">
            <label
              htmlFor="home-gallery-label"
              className="mb-2 block text-sm font-medium text-text-primary"
            >
              Rótulo da galeria
            </label>
            <input
              ref={galleryLabelInputRef}
              id="home-gallery-label"
              type="text"
              value={localGalleryLabel}
              onChange={(event) => {
                setLocalGalleryLabel(event.currentTarget.value);
                setFeedback(null);
              }}
              aria-describedby="home-gallery-label-help"
              placeholder="Conteúdo indisponível ou inválido"
              className={`h-10 w-full rounded-md border bg-surface px-3 text-sm text-text-primary outline-none transition focus:border-border-strong focus:ring-2 focus:ring-signal/30 ${selectedField === "galleryLabel" ? "border-signal ring-2 ring-signal/30" : "border-border/70"}`}
            />
            <p id="home-gallery-label-help" className="mt-2 text-xs leading-5 text-text-secondary">
              A alteração aparece imediatamente na prévia. Salve para persistir o rótulo no conteúdo da Home.
            </p>
            {feedback && (
              <p
                role={feedback.type === "error" ? "alert" : "status"}
                aria-live="polite"
                className={`mt-3 text-xs ${feedback.type === "error" ? "text-red-600" : "text-green-700"}`}
              >
                {feedback.message}
              </p>
            )}
          </div>

          <div className="mt-8 border-t border-border/70 pt-6">
            <h3 className="text-sm font-medium text-text-primary">Projetos em destaque</h3>

            {projectListError ? (
              <p role="alert" className="mt-3 text-xs leading-5 text-red-600">
                Não foi possível carregar os projetos publicados.
              </p>
            ) : featuredProjects.length === 0 ? (
              <p className="mt-3 text-xs leading-5 text-text-secondary">
                Nenhum projeto publicado está destacado na Home.
              </p>
            ) : (
              <ul className="mt-3 space-y-2">
                {featuredProjects.map((project) => (
                  <li
                    key={project.id}
                    className="rounded-md border border-border/70 bg-surface p-3"
                  >
                    <p className="break-words text-sm font-medium text-text-primary">
                      {project.title}
                    </p>
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <Link
                        href={`/admin/projetos/${project.id}` as Route}
                        className="text-xs text-text-secondary underline-offset-2 hover:text-text-primary hover:underline"
                      >
                        Editar projeto
                      </Link>
                      <button
                        type="button"
                        onClick={() => updateFeaturedProject(project.id, false)}
                        disabled={isProjectPending || projectListError}
                        className="rounded border border-border/70 px-2 py-1 text-xs text-text-secondary transition-colors hover:text-text-primary disabled:opacity-50"
                      >
                        Remover
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {!projectListError && (
              <div className="mt-4 space-y-2">
                <label
                  htmlFor="home-featured-project"
                  className="block text-xs font-medium text-text-secondary"
                >
                  Adicionar projeto publicado
                </label>
                <select
                  id="home-featured-project"
                  value={selectedProjectId}
                  onChange={(event) => setSelectedProjectId(event.currentTarget.value)}
                  disabled={isProjectPending || availableProjects.length === 0}
                  className="h-10 w-full rounded-md border border-border/70 bg-surface px-3 text-sm text-text-primary focus:border-border-strong focus:outline-none focus:ring-2 focus:ring-signal/30 disabled:opacity-60"
                >
                  <option value="">
                    {availableProjects.length > 0
                      ? "Selecione um projeto"
                      : "Todos os projetos publicados já estão em destaque"}
                  </option>
                  {availableProjects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.title}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => updateFeaturedProject(selectedProjectId, true)}
                  disabled={
                    isProjectPending ||
                    selectedProjectId.length === 0 ||
                    projectListError
                  }
                  className="inline-flex h-9 w-full items-center justify-center rounded-md bg-signal px-3 text-xs font-medium text-white transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isProjectPending ? "Atualizando…" : "Adicionar projeto"}
                </button>
              </div>
            )}

            {projectFeedback && (
              <p
                role={projectFeedback.type === "error" ? "alert" : "status"}
                aria-live="polite"
                className={`mt-3 text-xs ${projectFeedback.type === "error" ? "text-red-600" : "text-green-700"}`}
              >
                {projectFeedback.message}
              </p>
            )}
          </div>
        </aside>

        <section
          aria-label="Prévia da Home"
          className="min-h-0 flex-1 overflow-y-auto bg-[#e9e9e7] p-4 sm:p-6"
        >
          <div className="mx-auto min-h-full max-w-6xl overflow-hidden bg-white shadow-sm">
            {previewHeader}
            <HomeRenderer
              content={previewWithLocalLabel}
              error={previewError}
              asPreview
              onGalleryLabelClick={focusGalleryLabelField}
            />
            {previewFooter}
          </div>
        </section>
      </div>
    </div>
  );
}
