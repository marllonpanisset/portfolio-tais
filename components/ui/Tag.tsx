import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Tag({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex min-h-7 items-center rounded-[var(--radius-sm)] border border-signal/20 bg-signal-soft px-2.5 py-1 text-[0.8125rem] font-medium leading-none text-signal-strong",
        className
      )}
    >
      {children}
    </span>
  );
}
