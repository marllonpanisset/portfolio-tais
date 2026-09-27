"use client";

import { useEffect, useRef } from "react";

import { PageWrapper } from "@/components/layout/PageWrapper";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  const titleRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    console.error(error);
    titleRef.current?.focus();
  }, [error]);

  return (
    <PageWrapper>
      <Container className="flex min-h-[70svh] items-center py-16 sm:py-20">
        <section
          className="w-full overflow-hidden rounded-[16px] border border-border bg-surface/70 shadow-card"
          aria-labelledby="error-title"
        >
          <div className="grid md:grid-cols-[minmax(0,1fr)_minmax(15rem,0.42fr)]">
            <div className="px-6 py-12 sm:px-10 sm:py-16 lg:px-16 lg:py-20">
              <Text variant="caption">Erro inesperado</Text>

              <Heading
                as="h1"
                className="mt-4 max-w-2xl outline-none"
              >
                <span ref={titleRef} id="error-title" tabIndex={-1}>
                  Não foi possível carregar esta página
                </span>
              </Heading>

              <Text className="mt-5 max-w-xl">
                Ocorreu uma falha temporária. Você pode tentar novamente ou
                voltar para a página inicial.
              </Text>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button type="button" size="lg" onClick={reset}>
                  Tentar novamente
                </Button>
                <Button href="/" variant="secondary" size="lg">
                  Voltar para a Home
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
                ERR
              </span>
            </div>
          </div>
        </section>
      </Container>
    </PageWrapper>
  );
}
