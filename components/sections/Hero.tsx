import type { ReactNode } from "react";

import { Container, Heading, Text, Badge } from "@/components/ui";
import { cn } from "@/lib/utils";

interface HeroProps {
  eyebrow?: string;
  title: string;
  description: string;
  actions?: ReactNode;
  align?: "center" | "left";
}

export function Hero({
  eyebrow,
  title,
  description,
  actions,
  align = "center",
}: HeroProps) {
  const isCenter = align === "center";

  return (
    <section
      className="
        relative 
        overflow-hidden
        py-20
        sm:py-24
        md:py-28
      "
    >
      {/* Background premium glow */}
      <div
        className="
    pointer-events-none
    absolute
    inset-0
    -z-10
    overflow-hidden
  "
        aria-hidden="true"
      >
        {/* Main glow */}
        <div
          className="
            absolute
            inset-x-0
            top-0
            mx-auto
            h-[420px]
            blur-[120px]
            w-full
            max-w-[700px]
            rounded-full
            bg-primary/15
          "
        />

        {/* Secondary glow */}
        <div
          className="
            absolute
            left-[10%]
            top-32
            h-[280px]
            w-4/5
            max-w-[480px]
            rounded-full
            bg-accent/12
            blur-[120px]
          "
        />

        {/* Subtle radial overlay */}
        <div
          className="
            absolute
            inset-0
            bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_55%)]
          "
        />
      </div>

      <Container>
        <div
          className={cn(
            "relative",
            isCenter ? "mx-auto max-w-5xl text-center" : "max-w-3xl",
          )}
        >
          {eyebrow && (
            <Badge
              className={cn(
                `
                  mb-8
                  border-border/80
                  bg-surface/80
                  backdrop-blur-md
                  text-text-secondary
                  shadow-sm
                  `,
                isCenter && "mx-auto",
              )}
            >
              {eyebrow}
            </Badge>
          )}

          <Heading
            as="h1"
            className="
                text-balance
                text-[clamp(2.25rem,10vw,4.25rem)]
                tracking-[-0.04em]
                leading-[1.05]
                md:max-w-4xl
                text-primary-foreground
                font-extrabold
                drop-shadow-md
                [overflow-wrap:anywhere]
              "
          >
            {title}
          </Heading>

          <Text
            variant="lead"
            className={cn(
              `
                mt-6
                max-w-prose
                text-lg
                leading-relaxed
                text-text-secondary
                md:text-xl
                `,
              isCenter && "mx-auto max-w-3xl text-pretty",
            )}
          >
            {description}
          </Text>

          {actions && (
            <div
              className={cn(
                `
                  mt-14
                  flex
                  flex-col
                  items-stretch
                  gap-4
                  sm:flex-row
                  sm:items-stretch
                  `,
                isCenter && "justify-center",
              )}
            >
              {actions}
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
