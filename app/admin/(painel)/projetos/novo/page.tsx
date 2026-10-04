import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProjectForm } from "../ProjectForm";

export const metadata: Metadata = {
  title: "Novo Projeto — Admin",
  robots: { index: false, follow: false },
};

export default async function NewProjectPage() {
  const supabase = await createClient();

  const { data } = await supabase.auth.getClaims();

  if (!data?.claims) {
    redirect("/admin/login");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Novo Projeto</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Crie um novo projeto para o portfólio
        </p>
      </div>

      <ProjectForm mode="create" />
    </div>
  );
}
