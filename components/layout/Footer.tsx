import Link from "next/link";
import { Container } from "@/components/ui";
import { mainNav } from "@/config/client-navigation";
import { getSiteSettings } from "@/lib/cms/queries";
import { SocialLinks } from "@/components/social/SocialLinks";

export async function Footer() {
  const settingsResult = await getSiteSettings();
  const settings = settingsResult.data;

  return (
    <footer className="border-t border-black/10 bg-white text-black">
      <Container className="py-10 md:py-14">
        <div className="flex flex-col gap-7 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link href="/" className="font-display text-lg font-bold tracking-[-0.04em]">
              TAIS
            </Link>
          </div>

          <nav aria-label="Navegação do rodapé" className="flex flex-wrap gap-x-5 gap-y-3">
            {mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href as never}
                className="text-[0.7rem] font-medium tracking-[0.12em] text-black/65 transition-opacity duration-150 hover:opacity-55"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-6">
          <SocialLinks settings={settings} iconClassName="h-5 w-5" />
        </div>

        <div className="mt-9 flex flex-col gap-4 border-t border-black/15 pt-4 text-[0.65rem] text-black/50 sm:flex-row sm:items-center sm:justify-between">
          © 2026 TAIS · Todos os direitos reservados.
          <span>
            Desenvolvido por:{" "}
            <a
              href="https://www.conjuga.com.br"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-black transition-opacity hover:opacity-65 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
            >
              CONJUGA
            </a>
          </span>
        </div>
      </Container>
    </footer>
  );
}
