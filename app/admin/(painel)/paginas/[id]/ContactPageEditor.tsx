"use client";

import { useState, useTransition, type ReactNode } from "react";
import Link from "next/link";
import type { Route } from "next";
import { ContactView } from "@/components/contact/ContactView";
import type { ContactPageContent } from "@/lib/cms/content-types";
import { saveContactContent } from "./actions";
import { PublishToggle } from "./PublishToggle";

interface ContactPageEditorProps {
  pageId: string;
  isPublished: boolean;
  initialContent: ContactPageContent;
  previewHeader: ReactNode;
  previewFooter: ReactNode;
}

export function ContactPageEditor({
  pageId,
  isPublished,
  initialContent,
  previewHeader,
  previewFooter,
}: ContactPageEditorProps) {
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<
    { type: "success" | "error"; message: string } | null
  >(null);
  const [localContent, setLocalContent] = useState<ContactPageContent>(initialContent);

  function updateField<Key extends keyof ContactPageContent>(
    key: Key,
    value: ContactPageContent[Key],
  ) {
    setLocalContent((prev) => ({ ...prev, [key]: value }));
    setFeedback(null);
  }

  function handleSave() {
    setFeedback(null);
    startTransition(async () => {
      const result = await saveContactContent(pageId, localContent);
      setFeedback(
        result.success
          ? { type: "success", message: "Contato salvo." }
          : { type: "error", message: result.error },
      );
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex h-screen flex-col bg-surface">
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-border/70 bg-surface-elevated px-4">
        <div className="flex items-center gap-3">
          <Link
            href={"/admin/paginas" as Route}
            className="inline-flex h-8 items-center justify-center rounded-[var(--radius-sm)] border border-border/70 bg-surface px-3 text-xs font-medium text-text-secondary transition-colors hover:border-border hover:text-text-primary"
          >
            Fechar
          </Link>
          <div className="h-4 w-px bg-border" />
          <h1 className="text-sm font-medium text-text-primary">Contato</h1>
        </div>
        <div className="flex items-center gap-3">
          <PublishToggle pageId={pageId} initialIsPublished={isPublished} showStatus />
          <span className="hidden text-xs text-text-secondary sm:inline">Contato</span>
          <button
            type="button"
            onClick={handleSave}
            disabled={isPending}
            className="inline-flex h-8 items-center justify-center rounded-[var(--radius-sm)] bg-signal px-3 text-xs font-medium text-white transition-opacity hover:opacity-85 disabled:cursor-wait disabled:opacity-60"
          >
            {isPending ? "Salvando…" : "Salvar"}
          </button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col md:flex-row">
        <aside className="shrink-0 overflow-y-auto border-b border-border/70 bg-surface-elevated p-5 md:w-80 md:border-b-0 md:border-r">
          <h2 className="text-xs font-medium uppercase tracking-wider text-text-muted">
            Contato
          </h2>

          <div className="mt-6 space-y-5">
            <div>
              <label htmlFor="contact-subtitle" className="mb-2 block text-sm font-medium text-text-primary">
                Rótulo (eyebrow)
              </label>
              <input
                id="contact-subtitle"
                type="text"
                value={localContent.subtitle}
                onChange={(event) => updateField("subtitle", event.currentTarget.value)}
                className="h-10 w-full rounded-md border border-border/70 bg-surface px-3 text-sm text-text-primary outline-none transition focus:border-border-strong focus:ring-2 focus:ring-signal/30"
              />
            </div>

            <div>
              <label htmlFor="contact-title" className="mb-2 block text-sm font-medium text-text-primary">
                Título
              </label>
              <input
                id="contact-title"
                type="text"
                value={localContent.title}
                onChange={(event) => updateField("title", event.currentTarget.value)}
                className="h-10 w-full rounded-md border border-border/70 bg-surface px-3 text-sm text-text-primary outline-none transition focus:border-border-strong focus:ring-2 focus:ring-signal/30"
              />
            </div>

            <div>
              <label htmlFor="contact-information" className="mb-2 block text-sm font-medium text-text-primary">
                Informações
              </label>
              <textarea
                id="contact-information"
                rows={4}
                value={localContent.informationText}
                onChange={(event) => updateField("informationText", event.currentTarget.value)}
                className="w-full rounded-md border border-border/70 bg-surface px-3 py-2 text-sm text-text-primary outline-none transition focus:border-border-strong focus:ring-2 focus:ring-signal/30"
              />
            </div>

            {feedback && (
              <p
                role={feedback.type === "error" ? "alert" : "status"}
                aria-live="polite"
                className={`text-xs ${feedback.type === "error" ? "text-red-600" : "text-green-700"}`}
              >
                {feedback.message}
              </p>
            )}
          </div>
        </aside>

        <section
          aria-label="Prévia do Contato"
          className="min-h-0 flex-1 overflow-y-auto bg-[#e9e9e7] p-4 sm:p-6"
        >
          <div className="mx-auto min-h-full max-w-6xl overflow-hidden bg-white shadow-sm">
            {previewHeader}
            <ContactView content={localContent} asPreview />
            {previewFooter}
          </div>
        </section>
      </div>
    </div>
  );
}
