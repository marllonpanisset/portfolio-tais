"use client";

import { m } from "framer-motion";
import type { ReactNode } from "react";

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

/**
 * Animação de entrada padrão da Conjuga: fade + leve deslocamento vertical.
 * Duração e easing fixos para manter consistência em todo o site.
 * Framer Motion já respeita `prefers-reduced-motion` via useReducedMotion internamente
 * quando combinado com a configuração global — aqui mantemos o deslocamento discreto (12px).
 */
export function FadeIn({ children, delay = 0, className }: FadeInProps) {
  return (
    <m.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </m.div>
  );
}
