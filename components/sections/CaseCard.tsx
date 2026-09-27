import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Card, Heading, Text, Tag } from "@/components/ui";
import type { CaseStudy } from "@/types/case-study";

export function CaseCard({ caseStudy }: { caseStudy: CaseStudy }) {
  return (
    <Link
      href={`/projetos/${caseStudy.slug}` as never}
      className="group block h-full"
    >
      <Card
        className="
          flex h-full flex-col
          group-hover:border-signal/35
          group-hover:bg-surface-elevated/70
          group-hover:shadow-[0_1px_2px_rgba(0,0,0,0.28),0_18px_36px_-28px_rgba(76,111,255,0.38)]
        "
      >
        <div className="flex flex-wrap gap-2">
          <Tag className="w-fit">{caseStudy.segment}</Tag>

          <Tag className="w-fit">Estudo de projeto</Tag>
        </div>

        <Heading as="h3" className="mt-5">
          {caseStudy.title}
        </Heading>

        <Text variant="muted" className="mt-3 leading-relaxed">
          {caseStudy.summary}
        </Text>

        <div
          className="
            mt-auto flex items-center gap-2 pt-8
            border-t border-transparent
            text-sm font-medium text-text-secondary
            transition-[border-color,color] duration-200
            group-hover:border-border
            group-hover:text-text-primary
          "
        >
          Ver projeto
          <ArrowUpRight
            size={16}
            className="text-text-muted transition-colors duration-200 group-hover:text-signal"
          />
        </div>
      </Card>
    </Link>
  );
}
