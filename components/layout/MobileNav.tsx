"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type KeyboardEvent,
} from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown } from "lucide-react";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { servicesNav, mainNav } from "@/config/navigation";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type NavItem = { href: string; label: string; description?: string };

const focusableSelector = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

function isPathActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Provides a hydration-safe client snapshot for portal rendering. The server
 * snapshot stays false to match SSR markup, then React reads the stable client
 * snapshot without scheduling state from an effect.
 */
function subscribeToClientEnvironment() {
  return () => undefined;
}

function getClientEnvironmentSnapshot() {
  return true;
}

function getServerEnvironmentSnapshot() {
  return false;
}

/**
 * Returns only keyboard-reachable controls inside the active dialog. Keeping
 * this query in one utility ensures focus-trap behavior stays consistent as
 * navigation links or controls are added to the drawer.
 */
function getFocusableElements(container: HTMLElement | null): HTMLElement[] {
  if (!container) return [];

  return Array.from(container.querySelectorAll<HTMLElement>(focusableSelector));
}

function AccordionSection({
  id,
  title,
  items,
  isOpen,
  onToggle,
  onNavigate,
  pathname,
  reduceMotion,
}: {
  id: string;
  title: string;
  items: NavItem[];
  isOpen: boolean;
  onToggle: () => void;
  onNavigate: () => void;
  pathname: string;
  reduceMotion: boolean;
}) {
  return (
    <div className="border-b border-border/60">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={id}
        className="flex w-full items-center justify-between py-4 text-left transition-colors hover:text-text-primary"
      >
        <span className="font-mono text-[0.6875rem] font-medium uppercase tracking-[0.1em] text-text-muted">
          {title}
        </span>
        <ChevronDown
          size={16}
          className={cn(
            "text-text-muted transition-transform duration-200 ease-out motion-reduce:transition-none",
            isOpen && "rotate-180 text-text-primary",
          )}
        />
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <m.div
            id={id}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              duration: reduceMotion ? 0 : 0.2,
              ease: [0.4, 0, 0.2, 1],
            }}
            className="overflow-hidden"
          >
            <ul className="flex flex-col gap-0.5 pb-3">
              {items.map((item) => {
                const isActive = pathname === item.href;

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href as never}
                      onClick={onNavigate}
                      aria-current={isActive ? "page" : undefined}
                      className={cn(
                        "block rounded-[10px] border border-transparent px-3 py-2.5 text-[0.9375rem] leading-snug transition-[background-color,border-color,color] hover:bg-surface hover:text-text-primary",
                        isActive
                          ? "border-border/70 bg-surface text-text-primary"
                          : "text-text-secondary",
                      )}
                    >
                      {item.label}
                      {item.description && (
                        <span className="mt-0.5 block text-[0.75rem] font-normal text-text-muted">
                          {item.description}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Renders the mobile navigation as a modal dialog so keyboard users cannot
 * reach background content while it is open. Focus returns to the trigger on
 * close, matching the expected disclosure interaction pattern.
 */
export function MobileNav() {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();
  const reduceMotion = shouldReduceMotion === true;
  const [open, setOpen] = useState(false);
  const mounted = useSyncExternalStore(
    subscribeToClientEnvironment,
    getClientEnvironmentSnapshot,
    getServerEnvironmentSnapshot,
  );
  const [openSection, setOpenSection] = useState<string | null>("servicos");
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  /** Opens the dialog while preserving the trigger as the focus-return target. */
  const openMenu = useCallback(() => {
    if (isPathActive(pathname, "/servicos")) {
      setOpenSection("servicos");
    }

    setOpen(true);
  }, [pathname]);

  /**
   * Closes the dialog and restores focus after React has committed the state.
   * This keeps keyboard context stable for Escape, overlay, and link actions.
   */
  const closeMenu = useCallback(() => {
    setOpen(false);
    window.requestAnimationFrame(() => menuButtonRef.current?.focus());
  }, []);

  const toggleSection = useCallback((key: string) => {
    setOpenSection((current) => (current === key ? null : key));
  }, []);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Move focus into the dialog only after the portal has rendered its controls.
    const focusFrame = window.requestAnimationFrame(() => {
      getFocusableElements(drawerRef.current)[0]?.focus();
    });

    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  /**
   * Implements a local focus trap instead of a dependency so the existing
   * portal remains lightweight. Tab and Shift+Tab cycle through dialog controls.
   */
  const handleDrawerKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeMenu();
        return;
      }

      if (event.key !== "Tab") return;

      const focusableElements = getFocusableElements(drawerRef.current);
      const firstElement = focusableElements[0];
      const lastElement = focusableElements.at(-1);

      if (!firstElement || !lastElement) {
        event.preventDefault();
        return;
      }

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
        return;
      }

      if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    },
    [closeMenu],
  );

  const overlay = (
    <AnimatePresence initial={false}>
      {open && (
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.18, ease: "easeOut" }}
          onClick={closeMenu}
          className="fixed inset-0 z-40 bg-black/55"
        >
          <m.div
            initial={{ x: reduceMotion ? 0 : 24 }}
            animate={{ x: 0 }}
            exit={{ x: reduceMotion ? 0 : 24 }}
            transition={{
              duration: reduceMotion ? 0 : 0.22,
              ease: [0.4, 0, 0.2, 1],
            }}
            ref={drawerRef}
            id="mobile-nav-drawer"
            role="dialog"
            aria-modal="true"
            aria-labelledby="mobile-nav-title"
            onClick={(event) => event.stopPropagation()}
            onKeyDown={handleDrawerKeyDown}
            className="absolute inset-y-0 right-0 z-10 flex h-dvh w-full max-w-sm flex-col border-l border-border bg-background shadow-card"
          >
            <div className="flex shrink-0 items-center justify-between border-b border-border px-6 py-4">
              <span
                id="mobile-nav-title"
                className="font-display text-[1.125rem] font-medium tracking-[0.04em] text-text-primary"
              >
                CONJUGA
              </span>
              <button
                type="button"
                onClick={closeMenu}
                aria-label="Fechar menu"
                className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-border text-text-primary transition-[background-color,border-color,color] hover:border-border-strong hover:bg-surface"
              >
                <X size={20} />
              </button>
            </div>

            <nav
              className="flex-1 overflow-y-auto px-6"
              aria-label="Navegação principal"
            >
              <div className="flex flex-col">
                <Link
                  href="/"
                  onClick={closeMenu}
                  aria-current={pathname === "/" ? "page" : undefined}
                  className={cn(
                    "border-b border-border/60 py-4 font-mono text-[0.6875rem] font-medium uppercase tracking-[0.1em] transition-colors hover:text-text-primary",
                    pathname === "/" ? "text-text-primary" : "text-text-muted",
                  )}
                >
                  Início
                </Link>
                <AccordionSection
                  id="mobile-nav-servicos"
                  title="Serviços"
                  items={servicesNav}
                  isOpen={openSection === "servicos"}
                  onToggle={() => toggleSection("servicos")}
                  onNavigate={closeMenu}
                  pathname={pathname}
                  reduceMotion={reduceMotion}
                />
                <ul className="flex flex-col gap-1 py-4">
                  {mainNav.map((item) => {
                    const isActive = isPathActive(pathname, item.href);

                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href as never}
                          onClick={closeMenu}
                          aria-current={isActive ? "page" : undefined}
                          className={cn(
                            "block rounded-[10px] border border-transparent px-3 py-3 text-[1.0625rem] font-medium transition-[background-color,border-color,color] hover:bg-surface",
                            isActive
                              ? "border-border/70 bg-surface text-text-primary"
                              : "text-text-secondary hover:text-text-primary",
                          )}
                        >
                          {item.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </nav>

            <div className="shrink-0 border-t border-border bg-background px-6 py-4">
              <Button
                href="/contato"
                size="lg"
                className="w-full"
                onClick={closeMenu}
                aria-current={pathname === "/contato" ? "page" : undefined}
              >
                Falar com especialista
              </Button>
            </div>
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="lg:hidden">
      <button
        ref={menuButtonRef}
        type="button"
        onClick={openMenu}
        aria-label="Abrir menu"
        aria-expanded={open}
        aria-controls="mobile-nav-drawer"
        aria-haspopup="dialog"
        className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-border text-text-primary transition-[background-color,border-color,color] hover:border-border-strong hover:bg-surface"
      >
        <Menu size={20} />
      </button>

      {mounted && createPortal(overlay, document.body)}
    </div>
  );
}
