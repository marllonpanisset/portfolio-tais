import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getProjectById, getProjectCategories, listProjectMedia } from "@/lib/cms/queries";
import { ProjectForm } from "../ProjectForm";
import { MediaManager } from "./MediaManager";

export const metadata: Metadata = {
  title: "Editar Projeto — Admin",
  robots: { index: false, follow: false },
};

interface EditProjectPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ mediaError?: string }>;
}

export default async function EditProjectPage({ params, searchParams }: EditProjectPageProps) {
  const { id } = await params;
  const { mediaError } = await searchParams;

  const supabase = await createClient();

  const { data } = await supabase.auth.getClaims();

  if (!data?.claims) {
    redirect("/admin/login");
  }

  const [projectResult, categoriesResult, mediaResult] = await Promise.all([
    getProjectById(id),
    getProjectCategories(id),
    listProjectMedia(id),
  ]);

  if (!projectResult.data) {
    notFound();
  }

  const project = projectResult.data;
  const projectCategories = categoriesResult.data ?? [];
  const media = mediaResult.data ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Editar Projeto</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Edite as informações do projeto
        </p>
      </div>

      {mediaError && (
        <div className="rounded-md border border-yellow-500/30 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-400">
          {mediaError}
        </div>
      )}

      <ProjectForm
        mode="edit"
        project={project}
        projectCategories={projectCategories}
      />

      <MediaManager projectId={project.id} media={media} />
    </div>
  );
}
