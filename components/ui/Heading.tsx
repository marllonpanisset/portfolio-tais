import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

type HeadingLevel = "h1" | "h2" | "h3" | "h4";

interface HeadingProps {
  as?: HeadingLevel;
  children: ReactNode;
  className?: string;
}

const levelStyles: Record<HeadingLevel, string> = {
  h1: "text-[clamp(2.5rem,5vw,4.25rem)] leading-[1.05] tracking-[-0.02em] font-medium",
  h2: "text-[clamp(1.875rem,3.5vw,2.75rem)] leading-[1.1] tracking-[-0.015em] font-medium",
  h3: "text-[clamp(1.375rem,2.2vw,1.75rem)] leading-[1.2] tracking-[-0.01em] font-medium",
  h4: "text-[clamp(1.125rem,1.4vw,1.25rem)] leading-[1.3] font-medium",
};

export function Heading({ as = "h2", children, className }: HeadingProps) {
  const Tag = as as ElementType;
  return (
    <Tag className={cn("font-display text-text-primary", levelStyles[as], className)}>
      {children}
    </Tag>
  );
}
