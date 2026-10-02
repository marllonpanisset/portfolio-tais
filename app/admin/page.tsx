import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { AdminHeader } from "./AdminHeader";

export default async function AdminPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  return (
    <div className="space-y-8">
      <AdminHeader userEmail={user.email ?? ""} />

      <div className="rounded-lg border border-border/70 bg-surface-elevated/50 p-6">
        <h2 className="text-lg font-semibold text-text-primary">
          Bem-vindo ao painel administrativo
        </h2>
        <p className="mt-2 text-sm text-text-secondary">
          Use este espaço para gerenciar o conteúdo do portfólio.
        </p>
      </div>

      <nav aria-label="Conteúdo do CMS" className="grid gap-3 sm:grid-cols-2">
        <Link
          href="/admin/projetos"
          className="rounded-lg border border-border/70 bg-surface-elevated p-5 transition-colors hover:border-border-strong"
        >
          <p className="text-sm font-medium text-text-primary">Projetos</p>
          <p className="mt-1 text-sm text-text-secondary">Gerencie os trabalhos do portfólio.</p>
        </Link>
        <Link
          href="/admin/paginas"
          className="rounded-lg border border-border/70 bg-surface-elevated p-5 transition-colors hover:border-border-strong"
        >
          <p className="text-sm font-medium text-text-primary">Páginas</p>
          <p className="mt-1 text-sm text-text-secondary">Edite a estrutura visual das páginas.</p>
        </Link>
      </nav>
    </div>
  );
}
