import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { PageWrapper } from "@/components/layout/PageWrapper";

export const metadata: Metadata = {
  title: "Contato",
  description: "Informações de contato de Taís. Conteúdo em preparação.",
};

export default function ContactPage() {
  return (
    <PageWrapper>
      <section className="min-h-[68svh] py-14 sm:py-20 md:py-32">
        <Container>
          <p className="mb-5 text-[0.65rem] tracking-[0.14em] text-black/45">
            Contato
          </p>
          <Heading as="h1" className="max-w-4xl font-display text-[clamp(3.5rem,10vw,8rem)] font-normal leading-[0.9] tracking-[-0.07em] text-black">
            Vamos conversar?
          </Heading>

          <div className="mt-10 grid gap-5 border-t border-black/15 pt-5 sm:mt-14 sm:gap-8 md:grid-cols-[1fr_2fr] md:pt-7">
            <p className="text-[0.65rem] tracking-[0.14em] text-black/45">
              Informações
            </p>
            <div className="max-w-xl">
              <p className="text-base leading-relaxed text-black/65 sm:text-lg">
                Os canais de contato estão em preparação e serão publicados após confirmação.
              </p>
              <Link
                href="/biografia"
                className="mt-7 inline-flex items-center gap-2 text-xs tracking-[0.08em] text-black hover:opacity-55"
              >
                Conhecer a biografia <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </PageWrapper>
  );
}
