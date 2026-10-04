import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function AdminPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Dashboard</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Bem-vindo ao painel administrativo
        </p>
      </div>

      <div className="rounded-lg border border-border/70 bg-surface-elevated/50 p-6">
        <p className="text-sm text-text-secondary">
          Use a navegação ao lado para gerenciar os projetos, as páginas e as
          configurações do site.
        </p>
      </div>
    </div>
  );
}
