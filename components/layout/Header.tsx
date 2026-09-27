"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { mainNav } from "@/config/client-navigation";
import { MobileNav } from "./MobileNav";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();

  return (
    <header className="relative z-40 bg-white text-black">
      <Container className="flex min-h-[72px] items-center justify-between gap-6 py-4">
        <Link
          href="/"
          aria-label="Taís — página inicial"
          aria-current={pathname === "/" ? "page" : undefined}
          className="shrink-0 font-display text-lg font-bold tracking-[-0.04em]"
        >
          TAIS
        </Link>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Navegação principal">
          {mainNav.map(({ label, href }) => {
            const active = href === "/" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href as never}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "text-[0.7rem] font-medium tracking-[0.12em] transition-opacity hover:opacity-55",
                  active ? "text-black" : "text-black/65",
                )}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        <MobileNav items={mainNav} />
      </Container>
    </header>
  );
}
