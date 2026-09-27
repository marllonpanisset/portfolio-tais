"use client";

import { m } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Reserve este componente para blocos que realmente se beneficiam de destaque extra
 * (ex: estatísticas, transição entre seções-chave). Não aplicar em toda seção da página.
 */
export function RevealOnScroll({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <m.div
      initial={{ opacity: 0, scale: 0.98 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </m.div>
  );
}
