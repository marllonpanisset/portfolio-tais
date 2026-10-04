"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Route } from "next";
import { cn } from "@/lib/utils";

interface MenuItem {
  href: Route;
  label: string;
  /** Prefixos de rota que mantêm este item ativo */
  activePrefixes: string[];
}

interface MenuGroup {
  label: string;
  items: MenuItem[];
}

const menuItems: MenuGroup[] = [
  {
    label: "Visão Geral",
    items: [
      {
        href: "/admin" as Route,
        label: "Dashboard",
        activePrefixes: ["/admin"],
      },
    ],
  },
  {
    label: "Conteúdo",
    items: [
      {
        href: "/admin/projetos" as Route,
        label: "Projetos",
        activePrefixes: ["/admin/projetos"],
      },
      {
        href: "/admin/paginas" as Route,
        label: "Páginas",
        activePrefixes: ["/admin/paginas"],
      },
    ],
  },
  {
    label: "Configurações",
    items: [
      {
        href: "/admin/configuracoes" as Route,
        label: "Configurações",
        activePrefixes: ["/admin/configuracoes"],
      },
    ],
  },
];

function isActivePathname(pathname: string, item: MenuItem): boolean {
  // Caso especial: /admin deve ser exato, não prefixo
  if (item.href === "/admin") {
    return pathname === "/admin";
  }
  return item.activePrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Overlay para mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar: off-canvas no mobile, coluna persistente no desktop */}
      <aside
        className={cn(
          // Mobile: drawer fixo sobreposto
          "fixed inset-y-0 left-0 z-50 flex w-64 shrink-0 flex-col border-r border-border/70 bg-surface transition-transform duration-200 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full",
          // Desktop: coluna persistente no fluxo do layout
          "lg:static lg:z-auto lg:translate-x-0",
        )}
      >
        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-6" aria-label="Navegação administrativa">
          {menuItems.map((group) => (
            <div key={group.label} className="mb-6">
              <p className="mb-2 px-3 text-[0.6rem] font-medium uppercase tracking-[0.12em] text-text-secondary">
                {group.label}
              </p>
              <ul className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive = isActivePathname(pathname, item);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className={cn(
                          "block rounded-md px-3 py-2 text-sm transition-colors",
                          isActive
                            ? "bg-surface-elevated font-medium text-text-primary"
                            : "text-text-secondary hover:bg-surface-elevated/50 hover:text-text-primary",
                        )}
                        aria-current={isActive ? "page" : undefined}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}
