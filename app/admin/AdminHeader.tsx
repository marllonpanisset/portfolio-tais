"use client";

import { LogoutButton } from "./logout/LogoutButton";

interface AdminHeaderProps {
  userEmail: string;
  onMenuClick?: () => void;
}

export function AdminHeader({ userEmail, onMenuClick }: AdminHeaderProps) {
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

        {/* User info */}
        <div className="flex min-w-0 flex-1 items-center justify-end gap-4">
          {userEmail && (
            <p className="truncate text-sm text-text-secondary">{userEmail}</p>
          )}
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
