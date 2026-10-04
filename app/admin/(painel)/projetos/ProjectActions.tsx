"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteProject, publishProject, unpublishProject } from "./actions";

interface ProjectActionsProps {
  projectId: string;
  isPublished: boolean;
}

export function ProjectActions({ projectId, isPublished }: ProjectActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handlePublishToggle() {
    setLoading(true);
    setError(null);

    const result = isPublished
      ? await unpublishProject(projectId)
      : await publishProject(projectId);

    setLoading(false);

    if (!result.success) {
      setError(result.error);
      return;
    }

    router.refresh();
  }

  async function handleDelete() {
    if (!confirm("Tem certeza que deseja excluir este projeto?")) {
      return;
    }

    setLoading(true);
    setError(null);

    const result = await deleteProject(projectId);

    setLoading(false);

    if (!result.success) {
      setError(result.error);
      return;
    }

    router.refresh();
  }

  return (
    <div className="flex items-center justify-end gap-2">
      {error && <span className="text-xs text-red-400">{error}</span>}
      <button
        onClick={handlePublishToggle}
        disabled={loading}
        className="rounded-md border border-border/70 bg-surface-elevated/75 px-3 py-1.5 text-xs font-medium text-text-primary transition-all hover:bg-surface-elevated disabled:opacity-50"
      >
        {isPublished ? "Despublicar" : "Publicar"}
      </button>
      <button
        onClick={handleDelete}
        disabled={loading}
        className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-400 transition-all hover:bg-red-500/20 disabled:opacity-50"
      >
        Excluir
      </button>
    </div>
  );
}
