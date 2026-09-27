import type { LucideIcon } from "lucide-react";

export interface Service {
  slug: string;
  icon: LucideIcon;
  name: string;
  shortDescription: string;
  problem: string;
  benefits: string[];
  includes: string[];
  process: string[];
  heroTitle: string;
  heroDescription: string;
}
