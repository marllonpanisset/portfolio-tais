import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin",
  robots: {
    index: false,
    follow: false,
  },
};

/**
 * Layout raiz de /admin.
 *
 * Aplica-se a todas as rotas sob /admin, inclusive /admin/login, e por isso
 * não deve conter chrome visual. O shell do painel (Sidebar + AdminHeader)
 * fica em ./(painel)/layout.tsx, que cobre somente as rotas protegidas.
 */
export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}