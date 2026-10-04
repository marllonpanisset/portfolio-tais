"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { SITE_SETTING_KEYS, type SiteSettings } from "@/lib/cms/site-settings";
import { saveSiteSettings } from "./actions";

const FIELD_LABELS: Record<(typeof SITE_SETTING_KEYS)[number], string> = {
  instagram: "Instagram",
  youtube: "YouTube",
  linkedin: "LinkedIn",
  whatsapp: "WhatsApp",
  linktree: "Linktree",
  behance: "Behance",
};

export function SiteSettingsForm({ initialSettings }: { initialSettings: SiteSettings }) {
  const router = useRouter();
  const [values, setValues] = useState<SiteSettings>(initialSettings);
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<
    { type: "success" | "error"; message: string } | null
  >(null);

  function handleSave() {
    setFeedback(null);
    startTransition(async () => {
      const result = await saveSiteSettings(values);
      setFeedback(
        result.success
          ? { type: "success", message: "Configurações salvas." }
          : { type: "error", message: result.error },
      );
      if (result.success) {
        router.refresh();
      }
    });
  }

  return (
    <div className="space-y-6 rounded-lg border border-border/70 bg-surface-elevated/50 p-6">
      <div>
        <h2 className="text-lg font-semibold text-text-primary">Canais e links</h2>
        <p className="mt-1 text-sm text-text-secondary">
          Links globais do site. Todos os campos são opcionais e devem ser URLs válidas (http/https) quando preenchidos.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {SITE_SETTING_KEYS.map((key) => (
          <div key={key} className="space-y-2">
            <label htmlFor={`setting-${key}`} className="block text-sm font-medium text-text-primary">
              {FIELD_LABELS[key]}
            </label>
            <input
              id={`setting-${key}`}
              type="url"
              value={values[key] ?? ""}
              onChange={(event) => {
                const value = event.currentTarget.value;
                setValues((prev) => ({ ...prev, [key]: value }));
              }}
              placeholder={`https://...`}
              className="w-full rounded-md border border-border/70 bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary/50 focus:border-signal focus:outline-none focus:ring-1 focus:ring-signal"
            />
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={handleSave}
          disabled={isPending}
          className="inline-flex h-10 items-center justify-center rounded-[var(--radius-md)] bg-gradient-to-b from-signal-strong to-signal px-5 text-[0.9375rem] font-medium text-white transition-all hover:brightness-105 disabled:opacity-50"
        >
          {isPending ? "Salvando..." : "Salvar configurações"}
        </button>
        {feedback && (
          <p
            role={feedback.type === "error" ? "alert" : "status"}
            aria-live="polite"
            className={`text-sm ${feedback.type === "error" ? "text-red-400" : "text-green-400"}`}
          >
            {feedback.message}
          </p>
        )}
      </div>
    </div>
  );
}
