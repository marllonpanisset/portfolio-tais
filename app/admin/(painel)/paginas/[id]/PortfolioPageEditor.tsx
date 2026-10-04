"use client";

import { useState, useTransition, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Route } from "next";
import { PortfolioView } from "@/components/portfolio/PortfolioView";
import { PortfolioProjectList } from "@/components/portfolio/PortfolioProjectList";
import type { PortfolioPageContent } from "@/lib/cms/content-types";
import type { HomeGalleryItem } from "@/lib/home-content";
import {
  addPortfolioProject,
  removePortfolioProject,
  reorderPortfolioProjects,
  savePortfolioContent,
} from "./actions";
import { PublishToggle } from "./PublishToggle";

interface PortfolioPageEditorProps {
  pageId: string;
  isPublished: boolean;
  initialContent: PortfolioPageContent;
  portfolioProjects: PortfolioProjectOption[];
  availableProjects: PortfolioProjectOption[];
  projectListError: boolean;
  previewProjects: HomeGalleryItem[];
  previewHeader: ReactNode;
  previewFooter: ReactNode;
}

interface PortfolioProjectOption {
  id: string;
  title: string;
  isPublished?: boolean;
}

export function PortfolioPageEditor({
  pageId,
  isPublished,
  initialContent,
  portfolioProjects,
  availableProjects,
  projectListError,
  previewProjects,
  previewHeader,
  previewFooter,
}: PortfolioPageEditorProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isProjectPending, startProjectTransition] = useTransition();
  const [feedback, setFeedback] = useState<
    { type: "success" | "error"; message: string } | null
  >(null);
  const [projectFeedback, setProjectFeedback] = useState<
    { type: "success" | "error"; message: string } | null
  >(null);
  const [localContent, setLocalContent] = useState<PortfolioPageContent>(initialContent);
  const [selectedProjectId, setSelectedProjectId] = useState("");

  function updateField<Key extends keyof PortfolioPageContent>(
    key: Key,
    value: PortfolioPageContent[Key],
  ) {
    setLocalContent((prev) => ({ ...prev, [key]: value }));
    setFeedback(null);
  }

  function handleAddProject() {
    if (!selectedProjectId) return;
    setProjectFeedback(null);
    startProjectTransition(async () => {
      const result = await addPortfolioProject(selectedProjectId);
      if (!result.success) {
        setProjectFeedback({ type: "error", message: result.error });
        return;
      }
      setSelectedProjectId("");
      setProjectFeedback({ type: "success", message: "Projeto adicionado ao Portfólio." });
      router.refresh();
    });
  }

  function handleRemoveProject(projectId: string) {
    setProjectFeedback(null);
    startProjectTransition(async () => {
      const result = await removePortfolioProject(projectId);
      if (!result.success) {
        setProjectFeedback({ type: "error", message: result.error });
        return;
      }
      setProjectFeedback({ type: "success", message: "Projeto removido do Portfólio." });
      router.refresh();
    });
  }

  function handleMoveProject(projectId: string, direction: "up" | "down") {
    const index = portfolioProjects.findIndex((project) => project.id === projectId);
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (index < 0 || targetIndex < 0 || targetIndex >= portfolioProjects.length) return;

    const reordered = [...portfolioProjects];
    const [moved] = reordered.splice(index, 1);
    if (!moved) return;
    reordered.splice(targetIndex, 0, moved);

    setProjectFeedback(null);
    startProjectTransition(async () => {
      const result = await reorderPortfolioProjects(reordered.map((project) => project.id));
      if (!result.success) {
        setProjectFeedback({ type: "error", message: result.error });
        return;
      }
      router.refresh();
    });
  }

  function handleSave() {
    setFeedback(null);
    startTransition(async () => {
      const result = await savePortfolioContent(pageId, localContent);
      setFeedback(
        result.success
          ? { type: "success", message: "Portfólio salvo." }
          : { type: "error", message: result.error },
      );
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
          <h1 className="text-sm font-medium text-text-primary">Portfólio</h1>
        </div>
        <div className="flex items-center gap-3">
          <PublishToggle pageId={pageId} initialIsPublished={isPublished} showStatus />
          <span className="hidden text-xs text-text-secondary sm:inline">Portfólio</span>
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
        <aside className="shrink-0 overflow-y-auto border-b border-border/70 bg-surface-elevated p-5 md:w-80 md:border-b-0 md:border-r">
          <h2 className="text-xs font-medium uppercase tracking-wider text-text-muted">
            Portfólio
          </h2>

          <div className="mt-6 space-y-5">
            <div>
              <label htmlFor="portfolio-eyebrow" className="mb-2 block text-sm font-medium text-text-primary">
                Eyebrow
              </label>
              <input
                id="portfolio-eyebrow"
                type="text"
                value={localContent.eyebrow}
                onChange={(event) => updateField("eyebrow", event.currentTarget.value)}
                className="h-10 w-full rounded-md border border-border/70 bg-surface px-3 text-sm text-text-primary outline-none transition focus:border-border-strong focus:ring-2 focus:ring-signal/30"
              />
            </div>

            <div>
              <label htmlFor="portfolio-title" className="mb-2 block text-sm font-medium text-text-primary">
                Título
              </label>
              <input
                id="portfolio-title"
                type="text"
                value={localContent.title}
                onChange={(event) => updateField("title", event.currentTarget.value)}
                className="h-10 w-full rounded-md border border-border/70 bg-surface px-3 text-sm text-text-primary outline-none transition focus:border-border-strong focus:ring-2 focus:ring-signal/30"
              />
            </div>

            <div>
              <label htmlFor="portfolio-description" className="mb-2 block text-sm font-medium text-text-primary">
                Descrição
              </label>
              <textarea
                id="portfolio-description"
                rows={4}
                value={localContent.description}
                onChange={(event) => updateField("description", event.currentTarget.value)}
                className="w-full rounded-md border border-border/70 bg-surface px-3 py-2 text-sm text-text-primary outline-none transition focus:border-border-strong focus:ring-2 focus:ring-signal/30"
              />
            </div>

            <div className="border-t border-border/70 pt-6">
              <h3 className="text-sm font-medium text-text-primary">Projetos do Portfólio</h3>

              {projectListError ? (
                <p role="alert" className="mt-3 text-xs leading-5 text-red-600">
                  Não foi possível carregar os projetos.
                </p>
              ) : portfolioProjects.length === 0 ? (
                <p className="mt-3 text-xs leading-5 text-text-secondary">
                  Nenhum projeto selecionado para o Portfólio.
                </p>
              ) : (
                <ul className="mt-3 space-y-2">
                  {portfolioProjects.map((project, index) => (
                    <li
                      key={project.id}
                      className="rounded-md border border-border/70 bg-surface p-3"
                    >
                      <p className="break-words text-sm font-medium text-text-primary">
                        {project.title}
                      </p>
                      {project.isPublished === false && (
                        <p className="mt-1 text-xs text-yellow-500">
                          Projeto não publicado — não aparecerá no site.
                        </p>
                      )}
                      <div className="mt-2 flex items-center justify-between gap-2">
                        <Link
                          href={`/admin/projetos/${project.id}` as Route}
                          className="text-xs text-text-secondary underline-offset-2 hover:text-text-primary hover:underline"
                        >
                          Editar projeto
                        </Link>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleMoveProject(project.id, "up")}
                            disabled={isProjectPending || index === 0}
                            className="rounded border border-border/70 px-2 py-1 text-xs text-text-secondary transition-colors hover:text-text-primary disabled:opacity-50"
                            title="Mover para cima"
                          >
                            ↑
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveProject(project.id, "down")}
                            disabled={isProjectPending || index === portfolioProjects.length - 1}
                            className="rounded border border-border/70 px-2 py-1 text-xs text-text-secondary transition-colors hover:text-text-primary disabled:opacity-50"
                            title="Mover para baixo"
                          >
                            ↓
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveProject(project.id)}
                            disabled={isProjectPending}
                            className="rounded border border-border/70 px-2 py-1 text-xs text-text-secondary transition-colors hover:text-text-primary disabled:opacity-50"
                          >
                            Remover
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              {!projectListError && (
                <div className="mt-4 space-y-2">
                  <label
                    htmlFor="portfolio-project"
                    className="block text-xs font-medium text-text-secondary"
                  >
                    Adicionar projeto publicado
                  </label>
                  <select
                    id="portfolio-project"
                    value={selectedProjectId}
                    onChange={(event) => setSelectedProjectId(event.currentTarget.value)}
                    disabled={isProjectPending || availableProjects.length === 0}
                    className="h-10 w-full rounded-md border border-border/70 bg-surface px-3 text-sm text-text-primary focus:border-border-strong focus:outline-none focus:ring-2 focus:ring-signal/30 disabled:opacity-60"
                  >
                    <option value="">
                      {availableProjects.length > 0
                        ? "Selecione um projeto"
                        : "Todos os projetos publicados já estão no Portfólio"}
                    </option>
                    {availableProjects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.title}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={handleAddProject}
                    disabled={isProjectPending || selectedProjectId.length === 0 || projectListError}
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

            {feedback && (
              <p
                role={feedback.type === "error" ? "alert" : "status"}
                aria-live="polite"
                className={`text-xs ${feedback.type === "error" ? "text-red-600" : "text-green-700"}`}
              >
                {feedback.message}
              </p>
            )}
          </div>
        </aside>

        <section
          aria-label="Prévia do Portfólio"
          className="min-h-0 flex-1 overflow-y-auto bg-[#e9e9e7] p-4 sm:p-6"
        >
          <div className="mx-auto min-h-full max-w-6xl overflow-hidden bg-white shadow-sm">
            {previewHeader}
            <PortfolioView content={localContent} asPreview>
              {previewProjects.length > 0 && (
                <PortfolioProjectList projects={previewProjects} />
              )}
            </PortfolioView>
            {previewFooter}
          </div>
        </section>
      </div>
    </div>
  );
}
