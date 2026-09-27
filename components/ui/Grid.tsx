import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GridProps {
  children: ReactNode;
  className?: string;
  cols?: 2 | 3 | 4;
}

const colStyles: Record<NonNullable<GridProps["cols"]>, string> = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
};

export function Grid({ children, className, cols = 3 }: GridProps) {
  return <div className={cn("grid grid-cols-1 gap-6", colStyles[cols], className)}>{children}</div>;
}
