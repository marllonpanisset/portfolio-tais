import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function PageWrapper({ children, withGrid = true }: { children: ReactNode; withGrid?: boolean }) {
  return <main className={cn("relative", withGrid && "signature-grid")}>{children}</main>;
}
