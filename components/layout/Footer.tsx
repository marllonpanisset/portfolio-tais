import Link from "next/link";
import { Container } from "@/components/ui";
import { footerNav } from "@/config/navigation";
import { siteConfig } from "@/config/site";

function FooterColumn({
  id,
  title,
  items,
}: {
  id: string;
  title: string;
  items: { label: string; href: string }[];
}) {
  return (
    <section aria-labelledby={id}>
      <h2
        id={id}
        className="mb-5 font-mono text-[0.75rem] font-medium uppercase tracking-[0.08em] text-text-muted"
      >
        {title}
      </h2>
      <ul className="flex flex-col gap-3.5">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href as never}
              className="rounded-sm text-[0.9375rem] leading-relaxed text-text-secondary transition-colors hover:text-text-primary"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border/80 bg-surface/30">
      <Container className="py-16 md:py-20">
        <div className="grid gap-12 border-b border-border/70 pb-14 md:gap-16 md:pb-16 lg:grid-cols-12">
          <div className="max-w-md lg:col-span-4">
            <span className="font-display text-[1.25rem] font-medium tracking-[0.10em] text-text-primary">
              CONJUGA
            </span>
            <p className="mt-5 text-[0.9375rem] leading-[1.7] text-text-secondary">
              Engenharia de software para organizar processos, automatizar
              tarefas e tornar operações mais eficientes.
            </p>
          </div>

          <nav
            aria-label="Navegação do rodapé"
            className="grid grid-cols-2 gap-x-8 gap-y-12 sm:gap-x-12 md:grid-cols-3 lg:col-span-8 lg:gap-x-8"
          >
            <FooterColumn
              id="footer-services"
              title="Serviços"
              items={footerNav.servicos}
            />
            <FooterColumn
              id="footer-company"
              title="Empresa"
              items={footerNav.empresa}
            />
            <FooterColumn
              id="footer-legal"
              title="Legal"
              items={footerNav.legal}
            />
          </nav>
        </div>

        <div className="flex flex-col items-start justify-between gap-5 pt-7 sm:flex-row sm:items-center md:pt-8">
          <p className="text-[0.8125rem] leading-relaxed text-text-muted">
            © {new Date().getFullYear()} {siteConfig.legalName}. Todos os
            direitos reservados.
          </p>
          <a
            href={`mailto:${siteConfig.links.email}`}
            className="rounded-sm text-[0.8125rem] text-text-secondary transition-colors hover:text-text-primary"
          >
            {siteConfig.links.email}
          </a>
        </div>
      </Container>
    </footer>
  );
}
