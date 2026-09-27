"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavItem } from "@/config/client-navigation";

export function MobileNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    firstLinkRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        requestAnimationFrame(() => triggerRef.current?.focus());
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls="mobile-navigation"
        onClick={() => setOpen(true)}
        className="text-[0.7rem] font-medium tracking-[0.12em] text-black"
      >
        MENU
      </button>
      {open && (
        <div
          className="fixed inset-0 z-50 bg-white text-black"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setOpen(false);
              triggerRef.current?.focus();
            }
          }}
        >
          <div className="mx-auto flex min-h-[72px] max-w-[1200px] items-center justify-between px-6 md:px-8">
            <span className="font-display text-lg font-bold tracking-[-0.04em]">TAIS</span>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                triggerRef.current?.focus();
              }}
              className="text-[0.7rem] font-medium tracking-[0.12em]"
              aria-label="Fechar menu"
            >
              FECHAR
            </button>
          </div>
          <nav id="mobile-navigation" aria-label="Navegação principal" className="mx-auto max-w-[1200px] px-6 pt-12 md:px-8">
            <ul className="flex flex-col">
              {items.map(({ label, href }, index) => (
                <li key={href} className="border-b border-black/15">
                  <Link
                    ref={index === 0 ? firstLinkRef : undefined}
                    href={href as never}
                    aria-current={pathname === href ? "page" : undefined}
                    onClick={() => setOpen(false)}
                    className="block py-5 font-display text-2xl tracking-[-0.035em]"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
}
