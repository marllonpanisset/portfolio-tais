"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type FocusEvent,
  type KeyboardEvent,
} from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { Container } from "@/components/ui";
import { Button } from "@/components/ui/Button";
import { servicesNav, mainNav, type NavItem } from "@/config/navigation";
import { MobileNav } from "./MobileNav";
import { cn } from "@/lib/utils";

interface NavDropdownProps {
  label: string;
  items: NavItem[];
  pathname: string;
}

function isPathActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Provides a desktop navigation disclosure that preserves hover behavior while
 * exposing the same links to keyboard and assistive-technology users.
 *
 * The menu stays local because each dropdown owns its own trigger, focus, and
 * outside-click lifecycle. A shared state would add coupling without benefit.
 */
function NavDropdown({ label, items, pathname }: NavDropdownProps) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const triggerId = useId();
  const menuId = useId();
  const isActive = items.some((item) => isPathActive(pathname, item.href));

  /**
   * Moves focus after the menu has rendered so arrow-key navigation works when
   * opening a closed dropdown. requestAnimationFrame avoids querying stale DOM.
   */
  function focusMenuItem(index: number) {
    window.requestAnimationFrame(() => itemRefs.current[index]?.focus());
  }

  useEffect(() => {
    if (!open) return;

    /**
     * Closes the disclosure when a pointer activates content outside it. This
     * keeps mouse behavior aligned with native menus without intercepting links.
     */
    function handlePointerDown(event: PointerEvent) {
      if (
        event.target instanceof Node &&
        !dropdownRef.current?.contains(event.target)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [open]);

  function handleTriggerKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true);
      focusMenuItem(0);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setOpen(true);
      focusMenuItem(items.length - 1);
      return;
    }

    if (event.key === "Escape") {
      setOpen(false);
      triggerRef.current?.focus();
    }
  }

  function handleMenuKeyDown(event: KeyboardEvent<HTMLUListElement>) {
    const currentItem =
      event.target instanceof HTMLAnchorElement ? event.target : null;
    const currentIndex = currentItem
      ? itemRefs.current.indexOf(currentItem)
      : -1;

    if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
      triggerRef.current?.focus();
      return;
    }

    if (currentIndex === -1) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      focusMenuItem((currentIndex + 1) % items.length);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      focusMenuItem((currentIndex - 1 + items.length) % items.length);
      return;
    }

    if (event.key === "Home") {
      event.preventDefault();
      focusMenuItem(0);
      return;
    }

    if (event.key === "End") {
      event.preventDefault();
      focusMenuItem(items.length - 1);
    }
  }

  function handleFocusOut(event: FocusEvent<HTMLDivElement>) {
    const nextFocusedElement = event.relatedTarget;

    if (
      !(nextFocusedElement instanceof Node) ||
      !event.currentTarget.contains(nextFocusedElement)
    ) {
      setOpen(false);
    }
  }

  function handleMouseLeave() {
    if (!dropdownRef.current?.contains(document.activeElement)) {
      setOpen(false);
    }
  }

  return (
    <div
      ref={dropdownRef}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={handleMouseLeave}
      onBlur={handleFocusOut}
    >
      <button
        ref={triggerRef}
        id={triggerId}
        type="button"
        className={cn(
          "flex h-9 items-center gap-1.5 rounded-[10px] px-3 text-[0.9375rem] transition-[background-color,color] hover:bg-surface hover:text-text-primary",
          isActive ? "bg-surface text-text-primary" : "text-text-secondary",
        )}
        aria-expanded={open}
        aria-controls={menuId}
        aria-haspopup="menu"
        onClick={() => setOpen((current) => !current)}
        onKeyDown={handleTriggerKeyDown}
      >
        {label}
        <ChevronDown
          size={14}
          className={cn("transition-transform", open && "rotate-180")}
        />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 w-72 pt-2">
          <ul
            id={menuId}
            role="menu"
            aria-labelledby={triggerId}
            className="space-y-0.5 rounded-[16px] border border-border bg-background/95 p-2 shadow-card backdrop-blur-md"
            onKeyDown={handleMenuKeyDown}
          >
            {items.map((item, index) => {
              const itemIsActive = pathname === item.href;

              return (
                <li key={item.href} role="none">
                  <Link
                    ref={(element) => {
                      itemRefs.current[index] = element;
                    }}
                    href={item.href as never}
                    role="menuitem"
                    aria-current={itemIsActive ? "page" : undefined}
                    className={cn(
                      "block rounded-[10px] border border-transparent px-4 py-3 transition-[background-color,border-color,color] hover:bg-surface",
                      itemIsActive && "border-border/70 bg-surface",
                    )}
                    onClick={() => setOpen(false)}
                  >
                    <span className="block text-[0.9375rem] font-medium text-text-primary">
                      {item.label}
                    </span>
                    {item.description && (
                      <span className="mt-0.5 block text-[0.8125rem] text-text-muted">
                        {item.description}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur-md">
      <Container className="flex h-[72px] items-center justify-between">
        <Link
          href="/"
          aria-current={pathname === "/" ? "page" : undefined}
          className="rounded-sm font-display text-[1.125rem] font-medium tracking-[0.045em] text-text-primary"
        >
          CONJUGA
        </Link>

        <nav
          className="hidden items-center gap-1 lg:flex"
          aria-label="Navegação principal"
        >
          <Link
            href="/"
            aria-current={pathname === "/" ? "page" : undefined}
            className={cn(
              "flex h-9 items-center rounded-[10px] px-3 text-[0.9375rem] transition-[background-color,color] hover:bg-surface hover:text-text-primary",
              pathname === "/"
                ? "bg-surface text-text-primary"
                : "text-text-secondary",
            )}
          >
            Início
          </Link>
          <NavDropdown
            label="Serviços"
            items={servicesNav}
            pathname={pathname}
          />
          {mainNav.map((item) => {
            const isActive = isPathActive(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href as never}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex h-9 items-center rounded-[10px] px-3 text-[0.9375rem] transition-[background-color,color] hover:bg-surface hover:text-text-primary",
                  isActive
                    ? "bg-surface text-text-primary"
                    : "text-text-secondary",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden lg:block">
          <Button
            href="/contato"
            size="md"
            aria-current={pathname === "/contato" ? "page" : undefined}
          >
            Falar com especialista
          </Button>
        </div>

        <MobileNav />
      </Container>
    </header>
  );
}
