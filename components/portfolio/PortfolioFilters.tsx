"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { HomeGalleryItem } from "@/lib/home-content";
import { PortfolioProjectList } from "@/components/portfolio/PortfolioProjectList";

export type PortfolioSort = "curadoria" | "recentes" | "antigos";

interface PortfolioFiltersProps {
  projects: HomeGalleryItem[];
}

function getProjectCategories(project: HomeGalleryItem): string[] {
  if (Array.isArray(project.categories) && project.categories.length > 0) {
    return project.categories;
  }
  if (project.category) {
    return [project.category];
  }
  return [];
}

export function PortfolioFilters({ projects }: PortfolioFiltersProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("todos");
  const [sort, setSort] = useState<PortfolioSort>("curadoria");
  const [hasOverflow, setHasOverflow] = useState(false);
  const filtersRef = useRef<HTMLDivElement>(null);

  const categories = useMemo(() => {
    const set = new Set<string>();
    for (const project of projects) {
      const cats = getProjectCategories(project);
      for (const c of cats) {
        set.add(c);
      }
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b, "pt-BR"));
  }, [projects]);

  const filterOptions = useMemo(() => {
    const base = [
      { value: "todos", label: "Todos" },
      ...categories.map((c) => ({ value: c, label: c })),
    ];
    return base;
  }, [categories]);

  useEffect(() => {
    const el = filtersRef.current;
    if (!el) return;

    const checkOverflow = () => {
      if (el.scrollWidth > el.clientWidth + 1) {
        setHasOverflow(true);
      } else {
        setHasOverflow(false);
      }
    };

    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [categories, filterOptions.length]);

  const filtered = useMemo(() => {
    let list = [...projects];

    if (selectedCategory !== "todos") {
      list = list.filter((project) => {
        const cats = getProjectCategories(project);
        return cats.includes(selectedCategory);
      });
    }

    list.sort((a, b) => {
      if (sort === "curadoria") {
        if (a.order !== b.order) {
          return a.order - b.order;
        }
        return 0;
      }

      const yearA = a.year ?? -Infinity;
      const yearB = b.year ?? -Infinity;

      if (sort === "recentes") {
        if (yearB !== yearA) {
          return yearB - yearA;
        }
        if (a.order !== b.order) {
          return a.order - b.order;
        }
        return 0;
      }

      if (sort === "antigos") {
        if (yearA !== yearB) {
          return yearA - yearB;
        }
        if (a.order !== b.order) {
          return a.order - b.order;
        }
        return 0;
      }

      return a.order - b.order;
    });

    return list;
  }, [projects, selectedCategory, sort]);

  return (
    <div className="mb-10 space-y-5 sm:mb-14">
      {/* Filter bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Category filters */}
        <div className="flex flex-col gap-2">
          <span className="text-[0.6rem] font-medium uppercase tracking-[0.12em] text-black/40">
            Filtrar
          </span>
          <div
            ref={filtersRef}
            className={`relative flex items-center gap-1.5 overflow-x-auto py-1 -mx-1 px-1 sm:mx-0 sm:px-0 sm:flex-wrap ${
              hasOverflow
                ? "after:pointer-events-none after:absolute after:right-0 after:top-0 after:h-full after:w-8 after:bg-gradient-to-l after:from-white after:to-transparent sm:after:hidden"
                : ""
            }`}
          >
            {filterOptions.map((option) => {
              const active = selectedCategory === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setSelectedCategory(option.value)}
                  className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs tracking-[0.06em] transition-all duration-200 sm:text-[0.65rem] ${
                    active
                      ? "bg-black text-white shadow-sm"
                      : "border border-black/15 bg-white/60 text-black/50 hover:border-black/30 hover:text-black/80"
                  }`}
                  aria-pressed={active}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Sort control */}
        <div className="flex flex-col gap-2 sm:items-end">
          <label
            htmlFor="portfolio-sort"
            className="text-[0.6rem] font-medium uppercase tracking-[0.12em] text-black/40"
          >
            Ordenar
          </label>
          <div className="relative flex items-center">
            <select
              id="portfolio-sort"
              value={sort}
              onChange={(e) => setSort(e.target.value as PortfolioSort)}
              className="appearance-none rounded-full border border-black/15 bg-white/60 pl-3.5 pr-8 py-1.5 text-xs tracking-[0.06em] text-black/60 transition-all duration-200 hover:border-black/30 hover:text-black/80 focus:outline-none focus:ring-1 focus:ring-black/20 sm:text-[0.65rem]"
            >
              <option value="curadoria">Curadoria</option>
              <option value="recentes">Mais recentes</option>
              <option value="antigos">Mais antigos</option>
            </select>
            <svg
              className="pointer-events-none absolute right-3 h-3 w-3 text-black/40"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <p className="mt-4 text-sm text-black/60">
          Nenhum projeto encontrado para esta combinação de filtros.
        </p>
      ) : (
        <PortfolioProjectList projects={filtered} />
      )}
    </div>
  );
}
