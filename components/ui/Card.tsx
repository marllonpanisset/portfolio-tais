import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={cn(
        `
        rounded-[var(--radius-lg)]
        border
        border-border
        bg-surface
        p-6
        shadow-[var(--shadow-card)]
        transition-[border-color,background-color,box-shadow]
        duration-200
        ease-[var(--ease-signature)]
        hover:border-border-strong
        hover:bg-surface-elevated/50
        hover:shadow-[var(--shadow-card-hover)]
        md:p-7
        `,
        className,
      )}
    >
      {children}
    </div>
  );
}
