import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface TextProps {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  variant?: "body" | "lead" | "muted" | "caption";
}

const variantStyles: Record<NonNullable<TextProps["variant"]>, string> = {
  body: "text-[1rem] leading-[1.6] text-text-secondary",
  lead: "text-[1.125rem] md:text-[1.25rem] leading-[1.5] text-text-secondary",
  muted: "text-[0.9375rem] leading-[1.5] text-text-muted",
  caption: "text-[0.8125rem] leading-[1.4] text-text-muted font-mono uppercase tracking-[0.08em]",
};

export function Text({ as = "p", children, className, variant = "body" }: TextProps) {
  const Tag = as;
  return <Tag className={cn(variantStyles[variant], className)}>{children}</Tag>;
}
