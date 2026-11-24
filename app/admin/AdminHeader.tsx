"use client";

import { useEffect, useRef, useState } from "react";
import { UserRound } from "lucide-react";
import { LogoutButton } from "./logout/LogoutButton";

interface AdminHeaderProps {
  userName: string;
  onMenuClick?: () => void;
}

export function AdminHeader({ userName, onMenuClick }: AdminHeaderProps) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isUserMenuOpen) return;

    function handlePointerDown(event: PointerEvent) {
      if (event.target instanceof Node && !menuRef.current?.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsUserMenuOpen(false);
        triggerRef.current?.focus();
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isUserMenuOpen]);

  return (
    <header className="sticky top-0 z-30 border-b border-border/70 bg-surface">
      <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Menu button (mobile) */}
        {onMenuClick && (
          <button
            type="button"
            onClick={onMenuClick}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md text-text-primary transition-colors hover:bg-surface-elevated lg:hidden"
            aria-label="Abrir menu"
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 5a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 9.75zm0 5a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}

        {/* Spacer for mobile menu button */}
        {!onMenuClick && <div className="lg:hidden" />}

        <div className="flex min-w-0 flex-1 items-center justify-end">
          <div ref={menuRef} className="relative">
            <button
              ref={triggerRef}
              type="button"
              aria-expanded={isUserMenuOpen}
              aria-controls="admin-user-menu"
              aria-haspopup="true"
              aria-label="Abrir menu do usuário"
              onClick={() => setIsUserMenuOpen((open) => !open)}
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border/70 bg-surface-elevated text-text-secondary transition-colors hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
            >
              <UserRound className="h-5 w-5" aria-hidden="true" />
            </button>

            {isUserMenuOpen && (
              <div
                id="admin-user-menu"
                role="group"
                aria-label="Menu do usuário"
                onClick={() => setIsUserMenuOpen(false)}
                className="absolute right-0 top-full z-50 mt-2 w-64 max-w-[calc(100vw-2rem)] rounded-md border border-border/70 bg-surface p-3 shadow-lg"
              >
                <p className="break-words px-2 py-2 text-sm font-medium text-text-primary">
                  {userName}
                </p>
                <div className="my-2 h-px bg-border/70" />
                <LogoutButton />
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
