import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getProjectById, getProjectCategories } from "@/lib/cms/queries";
import { ProjectForm } from "../ProjectForm";

export const metadata: Metadata = {
  title: "Editar Projeto — Admin",
  robots: { index: false, follow: false },
};

interface EditProjectPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const { id } = await params;

  const supabase = await createClient();

  const { data } = await supabase.auth.getClaims();

  if (!data?.claims) {
    redirect("/admin/login");
  }

  const [projectResult, categoriesResult] = await Promise.all([
    getProjectById(id),
    getProjectCategories(id),
  ]);

  if (!projectResult.data) {
    notFound();
  }

  const project = projectResult.data;
  const projectCategories = categoriesResult.data ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Editar Projeto</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Edite as informações do projeto
        </p>
      </div>

      <ProjectForm
        mode="edit"
        project={project}
        projectCategories={projectCategories}
      />
    </div>
  );
}
