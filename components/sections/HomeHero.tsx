import type { ReactNode } from "react";

import { Badge, Container, Heading, Text } from "@/components/ui";

interface HomeHeroProps {
  eyebrow: string;
  title: string;
  description: string;
  actions: ReactNode;
}

export function HomeHero({
  eyebrow,
  title,
  description,
  actions,
}: HomeHeroProps) {
  return (
    <section className="relative isolate overflow-hidden border-b border-border/60">
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:56px_56px] opacity-[0.16] [mask-image:linear-gradient(to_bottom,black,transparent_90%)]" />
        <div className="absolute inset-x-0 top-0 h-96 bg-[radial-gradient(ellipse_at_top,var(--color-signal-soft),transparent_66%)]" />
      </div>

      <Container className="py-20 sm:py-24 md:py-28 lg:py-32">
        <div className="relative border-x border-border/70 px-5 sm:px-8 md:px-12 lg:px-16">
          <span
            className="absolute -left-1 -top-1 h-2 w-2 border border-border-strong bg-background"
            aria-hidden="true"
          />
          <span
            className="absolute -right-1 -top-1 h-2 w-2 border border-border-strong bg-background"
            aria-hidden="true"
          />

          <div className="flex items-center gap-4">
            <Badge className="border-border-strong bg-background/80 text-text-secondary">
              {eyebrow}
            </Badge>
            <div
              className="hidden h-px flex-1 bg-border/80 sm:block"
              aria-hidden="true"
            />
          </div>

          <Heading
            as="h1"
            className="mt-8 max-w-4xl text-balance text-[clamp(2.75rem,6.5vw,5rem)] font-medium leading-[1] tracking-[-0.04em]"
          >
            {title}
          </Heading>

          <div className="mt-10 grid gap-8 border-t border-border/70 pt-8 md:mt-12 md:grid-cols-12 md:gap-8 md:pt-10">
            <Text
              variant="lead"
              className="max-w-3xl text-pretty leading-[1.6] md:col-span-7"
            >
              {description}
            </Text>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap md:col-span-4 md:col-start-9 md:flex-col md:items-stretch [&>*]:w-full sm:[&>*]:w-auto md:[&>*]:w-full">
              {actions}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
