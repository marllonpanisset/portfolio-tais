import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Card, Heading, Text, Icon } from "@/components/ui";
import type { Service } from "@/types/service";

export function ServiceCard({ service }: { service: Service }) {
  return (
    <Link
      href={`/servicos/${service.slug}` as never}
      className="group block h-full"
    >
      <Card
        className="
          flex h-full flex-col justify-between
          group-hover:border-signal/35
          group-hover:bg-surface-elevated/70
          group-hover:shadow-[0_1px_2px_rgba(0,0,0,0.28),0_18px_36px_-28px_rgba(76,111,255,0.38)]
        "
      >
        <div>
          <div
            className="
              flex h-12 w-12 items-center justify-center
              rounded-[12px]
              border border-border-strong/80
              bg-background/60
              transition-[border-color,background-color]
              duration-200 ease-[var(--ease-signature)]
              group-hover:border-signal/40
              group-hover:bg-signal-soft
            "
          >
            <Icon icon={service.icon} size={20} contained={false} />
          </div>

          <Heading
            as="h2"
            className="mt-6 text-[clamp(1.375rem,2.2vw,1.75rem)] leading-[1.2] tracking-[-0.01em]"
          >
            {service.name}
          </Heading>

          <Text variant="muted" className="mt-3 leading-relaxed">
            {service.shortDescription}
          </Text>
        </div>

        <div
          className="
            mt-8 flex items-center gap-2
            text-sm font-medium text-text-secondary
            transition-colors duration-300
            group-hover:text-text-primary
          "
        >
          Conhecer solução
          <ArrowUpRight
            size={16}
            className="text-text-muted transition-colors duration-200 group-hover:text-signal"
          />
        </div>
      </Card>
    </Link>
  );
}
