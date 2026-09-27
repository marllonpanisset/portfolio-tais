import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface IconProps {
  icon: LucideIcon;
  className?: string;
  size?: number;
  /** Envolve o ícone em um container consistente do design system (chip com fundo tintado). Padrão: true. */
  contained?: boolean;
}

export function Icon({ icon: LucideIconComponent, className, size = 20, contained = true }: IconProps) {
  if (!contained) {
    return <LucideIconComponent size={size} strokeWidth={1.75} className={cn("text-signal", className)} />;
  }

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-[10px] border border-signal-soft bg-signal-soft",
        className
      )}
      style={{ width: size + 22, height: size + 22 }}
    >
      <LucideIconComponent size={size} strokeWidth={1.75} className="text-signal-strong" />
    </span>
  );
}
