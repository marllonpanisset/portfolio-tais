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
 * A leitura do usuário aqui é apenas para exibir o email no header.
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

  return <AdminShell userEmail={user?.email ?? ""}>{children}</AdminShell>;
}