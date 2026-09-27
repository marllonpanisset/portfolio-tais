import type { Metadata } from "next";
import Image from "next/image";

import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { siteConfig } from "@/config/client-site";

export const metadata: Metadata = {
  title: "Biografia",
  description: "Conteúdo demonstrativo da página de biografia.",
};

export default function BiographyPage() {
  return (
    <PageWrapper>
      <section className="py-14 sm:py-20 md:py-32">
        <Container>
          <p className="mb-5 text-[0.65rem] tracking-[0.14em] text-black/45">
            BIOGRAFIA
          </p>
          <div className="grid gap-8 sm:gap-10 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:items-start md:gap-14">
            <div className="relative aspect-square w-full max-w-[520px] bg-[#eeeeec]">
              <Image
                src="/perfil.jpg"
                alt={`Foto de perfil de ${siteConfig.author.name}`}
                fill
                sizes="(max-width: 767px) 100vw, 42vw"
                className="object-cover"
                priority
              />
            </div>
            <div>
              <Heading as="h1" className="font-display text-[clamp(3.5rem,10vw,8rem)] font-normal leading-[0.9] tracking-[-0.07em] text-black">
                {siteConfig.author.name}
              </Heading>
              <p className="mt-7 max-w-2xl text-base leading-relaxed text-black/65 sm:mt-9 sm:text-lg">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
              <div className="mt-6 space-y-5 text-sm leading-7 text-black/65 sm:text-base">
                <p>
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                </p>
                <p>
                  Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Curabitur pretium tincidunt lacus, nulla gravida orci a odio.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 grid gap-5 border-t border-black/15 pt-5 sm:mt-16 sm:gap-8 md:grid-cols-[1fr_2fr] md:pt-7">
            <p className="text-[0.65rem] tracking-[0.14em] text-black/45">
              MAIS SOBRE
            </p>
            <div className="max-w-2xl space-y-5 text-sm leading-7 text-black/65 sm:text-base">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.
              </p>
              <p>
                Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper.
              </p>
            </div>
          </div>
        </Container>
      </section>
    </PageWrapper>
  );
}
