import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSiteSettings } from "@/lib/cms/queries";
import { SiteSettingsForm } from "./SiteSettingsForm";

export const metadata: Metadata = {
  title: "Configurações do Site — Admin",
  robots: { index: false, follow: false },
};

export default async function AdminSettingsPage() {
  const supabase = await createClient();

  const { data } = await supabase.auth.getClaims();

  if (!data?.claims) {
    redirect("/admin/login");
  }

  const settingsResult = await getSiteSettings();

  if (settingsResult.error || !settingsResult.data) {
    return (
      <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-6">
        <p className="text-sm text-red-400">
          Erro ao carregar configurações: {settingsResult.error ?? "sem dados"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Configurações do Site</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Gerencie os links globais do site
        </p>
      </div>

      <SiteSettingsForm initialSettings={settingsResult.data} />
    </div>
  );
}
