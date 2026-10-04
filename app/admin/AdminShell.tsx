"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";

import { AdminHeader } from "./AdminHeader";
import { Sidebar } from "./Sidebar";

export function AdminShell({
  userEmail,
  children,
}: {
  userEmail: string;
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const [lastPathname, setLastPathname] = useState(pathname);

  // Navegar para outra rota fecha o drawer. Ajustar o estado durante o
  // render evita um efeito colateral e não remonta `children`.
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setSidebarOpen(false);
  }

  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <AdminHeader
          userEmail={userEmail}
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}