import type { Metadata } from "next";

import { PageWrapper } from "@/components/layout/PageWrapper";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";

export const metadata: Metadata = {
  title: "Página não encontrada",
  description:
    "A página acessada não foi encontrada no site institucional da Conjuga.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <PageWrapper>
      <Container className="flex min-h-[70svh] items-center py-16 sm:py-20">
        <section
          className="w-full overflow-hidden rounded-[16px] border border-border bg-surface/70 shadow-card"
          aria-labelledby="not-found-title"
        >
          <div className="grid md:grid-cols-[minmax(0,1fr)_minmax(15rem,0.42fr)]">
            <div className="px-6 py-12 sm:px-10 sm:py-16 lg:px-16 lg:py-20">
              <Text variant="caption">Erro 404</Text>

              <Heading as="h1" className="mt-4 max-w-2xl">
                Essa página não existe
              </Heading>

              <Text className="mt-5 max-w-xl">
                O endereço acessado não corresponde a nenhuma página do site.
                Verifique o link ou escolha um dos caminhos abaixo.
              </Text>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button href="/" size="lg">
                  Voltar para a Home
                </Button>
                <Button href="/contato" variant="secondary" size="lg">
                  Entrar em contato
                </Button>
              </div>
            </div>

            <div
              className="relative hidden border-l border-border bg-background/45 md:block"
              aria-hidden="true"
            >
              <div className="absolute inset-x-8 top-8 h-px bg-border" />
              <div className="absolute bottom-8 left-8 h-px w-20 bg-signal" />
              <span className="absolute bottom-12 right-8 font-mono text-[clamp(4.5rem,9vw,7.5rem)] font-medium leading-none tracking-[-0.08em] text-border-strong">
                404
              </span>
            </div>
          </div>
        </section>
      </Container>
    </PageWrapper>
  );
}
