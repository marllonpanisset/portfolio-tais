import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
  /** Usa fundo de superfície levemente elevado em vez do background base */
  surface?: boolean;
}

export function Section({ children, className, id, surface = false }: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "py-20 md:py-28",
        surface && "bg-surface/50",
        className
      )}
    >
      {children}
    </section>
  );
}
