import Link from "next/link";
import { Container } from "@/components/ui";
import { mainNav } from "@/config/client-navigation";
import { siteConfig } from "@/config/client-site";

export function Footer() {
  return (
    <footer className="border-t border-border">
      <Container className="py-10 md:py-14">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link href="/" className="font-display text-lg font-bold tracking-[-0.04em] text-text-primary">
              TAIS
            </Link>
            <p className="mt-3 text-xs text-text-muted">Portfólio</p>
          </div>

          <nav aria-label="Navegação do rodapé" className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-text-secondary">
            {mainNav.map((item) => (
              <Link key={item.href} href={item.href as never} className="transition-colors hover:text-signal">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-9 border-t border-border pt-4 text-xs text-text-muted">
          © {new Date().getFullYear()} {siteConfig.name}
        </div>
      </Container>
    </footer>
  );
}
