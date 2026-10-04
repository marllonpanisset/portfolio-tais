import Link from "next/link";
import { listAllProjects } from "@/lib/cms/queries";
import type { CategoryRow } from "@/types/database";
import { ProjectActions } from "./ProjectActions";

export const metadata = {
  title: "Projetos — Admin",
  robots: { index: false, follow: false },
};

export default async function AdminProjectsPage() {
  const [projectsResult] = await Promise.all([
    listAllProjects(),
  ]);

  if (projectsResult.error) {
    return (
      <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-6">
        <p className="text-sm text-red-400">Error loading projects: {projectsResult.error}</p>
      </div>
    );
  }

  const projects = projectsResult.data ?? [];

  // Build a map of project_id -> categories
  const projectCategoriesMap = new Map<string, CategoryRow[]>();
  for (const project of projects) {
    projectCategoriesMap.set(project.id, []);
  }

  // Fetch categories for each project
  await Promise.all(
    projects.map(async (project) => {
      const { getProjectCategories } = await import("@/lib/cms/queries");
      const result = await getProjectCategories(project.id);
      if (result.data) {
        projectCategoriesMap.set(project.id, result.data);
      }
    }),
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Projetos</h1>
          <p className="mt-1 text-sm text-text-secondary">
            Gerencie os projetos do portfólio
          </p>
        </div>
        <Link
          href="/admin/projetos/novo"
          className="inline-flex h-10 items-center justify-center rounded-[var(--radius-md)] bg-gradient-to-b from-signal-strong to-signal px-5 text-[0.9375rem] font-medium text-white transition-all hover:brightness-105"
        >
          Novo projeto
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="rounded-lg border border-border/70 bg-surface-elevated/50 p-12 text-center">
          <p className="text-sm text-text-secondary">Nenhum projeto encontrado.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border/70">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b border-border/70 bg-surface-elevated/50">
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-secondary">
                  Título
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-secondary">
                  Ano
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-secondary">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-secondary">
                  Destaque
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-secondary">
                  Categorias
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-text-secondary">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {projects.map((project) => {
                const projectCats = projectCategoriesMap.get(project.id) ?? [];
                return (
                  <tr key={project.id} className="bg-surface">
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/projetos/${project.id}`}
                        className="text-sm font-medium text-text-primary hover:text-signal"
                      >
                        {project.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-sm text-text-secondary">
                      {project.year ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          project.is_published
                            ? "bg-green-500/10 text-green-400"
                            : "bg-yellow-500/10 text-yellow-400"
                        }`}
                      >
                        {project.is_published ? "Publicado" : "Rascunho"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {project.is_featured && (
                        <span className="inline-flex items-center rounded-full bg-signal/10 px-2.5 py-0.5 text-xs font-medium text-signal">
                          Destaque
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {projectCats.length > 0 ? (
                          projectCats.map((cat) => (
                            <span
                              key={cat.id}
                              className="inline-flex items-center rounded-full bg-surface-elevated px-2 py-0.5 text-xs text-text-secondary"
                            >
                              {cat.name}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-text-secondary/50">—</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <ProjectActions
                        projectId={project.id}
                        isPublished={project.is_published}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
