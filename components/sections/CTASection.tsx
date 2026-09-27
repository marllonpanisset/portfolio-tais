import type { ReactNode } from "react";
import { Container, Heading, Text } from "@/components/ui";

interface CTASectionProps {
  title: string;
  description: string;
  actions: ReactNode;
}

export function CTASection({ title, description, actions }: CTASectionProps) {
  return (
    <Container>
      <div
        className="
          overflow-hidden
          rounded-[16px]
          border border-signal/25
          bg-surface-elevated
          shadow-[0_1px_2px_rgba(0,0,0,0.24),0_24px_52px_-40px_rgba(76,111,255,0.42)]
        "
      >
        <div className="border-b border-border px-6 py-4 sm:px-8 md:px-10">
          <div className="flex items-center gap-3">
            <span className="h-1.5 w-1.5 bg-signal" aria-hidden="true" />
            <Text as="span" variant="caption" className="text-text-secondary">
              Próximo passo
            </Text>
          </div>
        </div>

        <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(16rem,0.38fr)]">
          <div className="px-6 py-10 sm:px-8 sm:py-12 md:px-10 md:py-14 lg:pr-14">
            <Heading as="h2" className="max-w-3xl">
              {title}
            </Heading>

            <Text
              variant="lead"
              className="mt-5 max-w-2xl text-text-secondary"
            >
              {description}
            </Text>
          </div>

          <div
            className="
              flex flex-col justify-center
              border-t border-border
              px-6 py-8
              sm:px-8
              md:px-10
              lg:border-l lg:border-t-0 lg:px-10 lg:py-14
            "
          >
            <div className="flex w-full flex-col items-stretch gap-4 [&>*]:w-full">
              {actions}
            </div>
          </div>
        </div>

        <div
          className="grid h-3 grid-cols-[2.5rem_1fr_5rem] border-t border-border"
          aria-hidden="true"
        >
          <span className="bg-signal/70" />
          <span className="border-l border-border" />
          <span className="border-l border-border bg-background/40" />
        </div>
      </div>
    </Container>
  );
}
