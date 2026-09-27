import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface BadgeProps {
  children: ReactNode;
  className?: string;
}

/** Eyebrow/rótulo estilo "código" — reforça o posicionamento técnico da marca */
export function Badge({ children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex min-h-7 items-center gap-2 rounded-full border border-border-strong bg-surface-elevated/60 px-3 py-1 font-mono text-[0.75rem] font-medium uppercase leading-none tracking-[0.08em] text-text-secondary shadow-sm",
        className
      )}
    >
      {children}
    </span>
  );
}
