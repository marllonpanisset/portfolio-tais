import Link from "next/link";
import type { Metadata, Route } from "next";
import { listAllPages } from "@/lib/cms/queries";

export const metadata: Metadata = {
  title: "Páginas — Admin",
  robots: { index: false, follow: false },
};

export default async function AdminPagesPage() {
  const [pagesResult] = await Promise.all([
    listAllPages(),
  ]);

  if (pagesResult.error) {
    return (
      <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-6">
        <p className="text-sm text-red-400">Erro ao carregar páginas: {pagesResult.error}</p>
      </div>
    );
  }

  const pages = pagesResult.data ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Páginas</h1>
          <p className="mt-1 text-sm text-text-secondary">
            Gerencie as páginas do site
          </p>
        </div>
      </div>

      {pages.length === 0 ? (
        <div className="rounded-lg border border-border/70 bg-surface-elevated/50 p-12 text-center">
          <p className="text-sm text-text-secondary">Nenhuma página encontrada.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-border/70">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/70 bg-surface-elevated/50">
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-secondary">
                  Título
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-secondary">
                  Slug
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-secondary">
                  Status
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-text-secondary">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {pages.map((page) => (
                <tr key={page.id} className="bg-surface">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/paginas/${page.id}` as Route}
                      className="text-sm font-medium text-text-primary hover:text-signal"
                    >
                      {page.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-sm text-text-secondary">
                    /{page.slug}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        page.is_published
                          ? "bg-green-500/10 text-green-400"
                          : "bg-yellow-500/10 text-yellow-400"
                      }`}
                    >
                      {page.is_published ? "Publicada" : "Rascunho"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/paginas/${page.id}` as Route}
                      className="inline-flex h-8 items-center justify-center rounded-[var(--radius-sm)] border border-border/70 bg-surface-elevated/75 px-3 text-xs font-medium text-text-primary transition-colors hover:border-border hover:bg-surface-elevated"
                    >
                      Editar
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
