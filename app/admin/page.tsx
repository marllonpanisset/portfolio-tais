import { redirect } from "next/navigation";
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
    </div>
  );
}
