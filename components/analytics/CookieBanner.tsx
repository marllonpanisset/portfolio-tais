"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";

import { getStoredConsent, storeConsent, subscribe } from "./cookie-consent";

export function CookieBanner() {
  const consent = useSyncExternalStore(subscribe, getStoredConsent, () => null);

  if (consent !== null) {
    return null;
  }

  return (
    <div className="fixed inset-x-4 bottom-4 z-50 sm:left-1/2 sm:max-w-3xl sm:-translate-x-1/2">
      <div className="rounded-[16px] border border-border bg-surface shadow-[var(--shadow-card-hover)]">
        <div className="flex flex-col gap-6 p-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="font-medium text-text-primary">Privacidade</p>

            <p className="mt-2 text-sm leading-relaxed text-text-secondary">
              Utilizamos cookies para analisar o uso do site e melhorar sua
              experiência. Você pode aceitar ou recusar cookies de análise.
              Consulte nossa{" "}
              <Link
                href="/politica-de-privacidade"
                className="link-underline text-signal-strong"
              >
                Política de Privacidade
              </Link>
              .
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => storeConsent("rejected")}
              className="rounded-lg border border-border px-4 py-2 text-sm transition-colors hover:border-border-strong"
            >
              Recusar
            </button>

            <button
              type="button"
              onClick={() => storeConsent("accepted")}
              className="rounded-lg bg-signal px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90"
            >
              Aceitar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
