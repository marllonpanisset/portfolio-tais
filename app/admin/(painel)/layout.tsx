import { createClient } from "@/lib/supabase/server";
import { AdminShell } from "../AdminShell";

/**
 * Layout do painel autenticado.
 *
 * Aplica AdminShell (Sidebar + AdminHeader) somente às rotas protegidas.
 * Rotas fora deste grupo — como /admin/login — não herdam este shell.
 * O grupo "(painel)" não altera as URLs: /admin, /admin/projetos,
 * /admin/paginas e /admin/configuracoes permanecem iguais.
 *
 * A leitura do usuário aqui alimenta o nome exibido no menu do header.
 * Não redireciona: cada página protegida mantém seus próprios guards.
 */
export default async function AdminPanelLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const metadata = user?.user_metadata;
  const metadataName = [metadata?.full_name, metadata?.name, metadata?.display_name]
    .find((value): value is string => typeof value === "string" && value.trim().length > 0)
    ?.trim();

  let profileName: string | null = null;
  if (user && !metadataName) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("display_name")
      .eq("user_id", user.id)
      .maybeSingle();
    profileName = profile?.display_name?.trim() || null;
  }

  return (
    <AdminShell userName={metadataName ?? profileName ?? "Administrador"}>
      {children}
    </AdminShell>
  );
}
