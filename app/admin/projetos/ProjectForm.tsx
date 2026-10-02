"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  createProject,
  updateProject,
  listCategories,
  type ProjectFormData,
} from "./actions";
import type { CategoryRow, ProjectRow } from "@/types/database";

interface ProjectFormProps {
  mode: "create" | "edit";
  project?: ProjectRow;
  projectCategories?: CategoryRow[];
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function ProjectForm({ mode, project, projectCategories = [] }: ProjectFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(project?.title ?? "");
  const [slug, setSlug] = useState(project?.slug ?? "");
  const [description, setDescription] = useState(project?.description ?? "");
  const [year, setYear] = useState(project?.year?.toString() ?? "");
  const [isPublished, setIsPublished] = useState(project?.is_published ?? false);
  const [isFeatured, setIsFeatured] = useState(project?.is_featured ?? false);
  const [sortOrder, setSortOrder] = useState(project?.sort_order?.toString() ?? "0");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    projectCategories.map((c) => c.id),
  );
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    let isMounted = true;

    async function loadCategories() {
      try {
        const result = await listCategories();
        if (isMounted && result.data) {
          setCategories(result.data);
        }
      } catch {
        // Keep the form usable if category loading fails.
      }
    }

    void loadCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  function handleTitleChange(value: string) {
    setTitle(value);
    if (mode === "create") {
      setSlug(slugify(value));
    }
  }

  function toggleCategory(categoryId: string) {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId],
    );
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData: ProjectFormData = {
      title,
      slug: slugify(slug),
      description: description || null,
      year: year ? parseInt(year, 10) : null,
      is_published: isPublished,
      is_featured: isFeatured,
      sort_order: parseInt(sortOrder, 10) || 0,
      category_ids: selectedCategories,
    };

    const result =
      mode === "create"
        ? await createProject(formData)
        : await updateProject(project!.id, formData);

    setLoading(false);

    if (!result.success) {
      setError(result.error);
      return;
    }

    router.push("/admin/projetos");
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-lg border border-border/70 bg-surface-elevated/50 p-6"
    >
      {error && (
        <div className="rounded-md border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="title" className="block text-sm font-medium text-text-primary">
            Título *
          </label>
          <input
            id="title"
            type="text"
            required
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="w-full rounded-md border border-border/70 bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary/50 focus:border-signal focus:outline-none focus:ring-1 focus:ring-signal"
            placeholder="Nome do projeto"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="slug" className="block text-sm font-medium text-text-primary">
            Slug *
          </label>
          <input
            id="slug"
            type="text"
            required
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full rounded-md border border-border/70 bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary/50 focus:border-signal focus:outline-none focus:ring-1 focus:ring-signal"
            placeholder="nome-do-projeto"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="block text-sm font-medium text-text-primary">
          Descrição
        </label>
        <textarea
          id="description"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-md border border-border/70 bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary/50 focus:border-signal focus:outline-none focus:ring-1 focus:ring-signal"
          placeholder="Descrição do projeto"
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="year" className="block text-sm font-medium text-text-primary">
            Ano
          </label>
          <input
            id="year"
            type="number"
            min="1900"
            max="2100"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="w-full rounded-md border border-border/70 bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary/50 focus:border-signal focus:outline-none focus:ring-1 focus:ring-signal"
            placeholder="2024"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="sortOrder" className="block text-sm font-medium text-text-primary">
            Ordem
          </label>
          <input
            id="sortOrder"
            type="number"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="w-full rounded-md border border-border/70 bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary/50 focus:border-signal focus:outline-none focus:ring-1 focus:ring-signal"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex items-start gap-3 rounded-md border border-border/70 bg-surface-elevated/40 p-4">
          <input
            type="checkbox"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-border/70 bg-surface"
          />
          <span>
            <span className="block text-sm font-medium text-text-primary">Publicado no site</span>
            <span className="mt-1 block text-xs leading-5 text-text-secondary">
              Permite que este projeto apareça nas páginas públicas do site.
            </span>
          </span>
        </label>

        <label className="flex items-start gap-3 rounded-md border border-border/70 bg-surface-elevated/40 p-4">
          <input
            type="checkbox"
            checked={isFeatured}
            onChange={(e) => setIsFeatured(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-border/70 bg-surface"
          />
          <span>
            <span className="block text-sm font-medium text-text-primary">Destaque na Home</span>
            <span className="mt-1 block text-xs leading-5 text-text-secondary">
              Inclui este projeto na galeria de projetos em destaque da Home, se estiver publicado.
            </span>
          </span>
        </label>
      </div>

      {categories.length > 0 && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-text-primary">
            Categorias
          </label>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => toggleCategory(category.id)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                  selectedCategories.includes(category.id)
                    ? "bg-signal text-white"
                    : "bg-surface-elevated text-text-secondary hover:text-text-primary"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center gap-4 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex h-10 items-center justify-center rounded-[var(--radius-md)] bg-gradient-to-b from-signal-strong to-signal px-5 text-[0.9375rem] font-medium text-white transition-all hover:brightness-105 disabled:opacity-50"
        >
          {loading ? "Salvando..." : mode === "create" ? "Criar projeto" : "Salvar alterações"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex h-10 items-center justify-center rounded-[var(--radius-md)] border border-border/70 bg-surface-elevated/75 px-5 text-[0.9375rem] font-medium text-text-primary transition-all hover:bg-surface-elevated"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
