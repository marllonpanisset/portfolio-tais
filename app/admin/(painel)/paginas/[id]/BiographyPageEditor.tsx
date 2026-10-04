"use client";

import { useRef, useState, useTransition, type ReactNode } from "react";
import Link from "next/link";
import type { Route } from "next";
import { BiographyView } from "@/components/biography/BiographyView";
import type { BiographyPageContent } from "@/lib/cms/content-types";
import { resolveMediaUrl } from "@/lib/media-url";
import { saveBiographyContent, uploadBiographyImage } from "./actions";
import { PublishToggle } from "./PublishToggle";

interface BiographyPageEditorProps {
  pageId: string;
  isPublished: boolean;
  initialContent: BiographyPageContent;
  previewHeader: ReactNode;
  previewFooter: ReactNode;
}

export function BiographyPageEditor({
  pageId,
  isPublished,
  initialContent,
  previewHeader,
  previewFooter,
}: BiographyPageEditorProps) {
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<
    { type: "success" | "error"; message: string } | null
  >(null);
  const [localContent, setLocalContent] = useState<BiographyPageContent>(initialContent);
  const [isUploading, startUploadTransition] = useTransition();
  const [uploadFeedback, setUploadFeedback] = useState<
    { type: "success" | "error"; message: string } | null
  >(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleUploadClick() {
    fileInputRef.current?.click();
  }

  function handleFileChange(file: File | undefined) {
    if (!file) return;

    setUploadFeedback(null);
    startUploadTransition(async () => {
      const formData = new FormData();
      formData.append("file", file);

      const result = await uploadBiographyImage(pageId, formData);
      if (!result.success) {
        setUploadFeedback({ type: "error", message: result.error });
        return;
      }

      setLocalContent((prev) => ({ ...prev, profileImage: result.data.storagePath }));
      setUploadFeedback({
        type: "success",
        message: "Imagem enviada. Clique em Salvar para persistir.",
      });
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function updateField<Key extends keyof BiographyPageContent>(
    key: Key,
    value: BiographyPageContent[Key],
  ) {
    setLocalContent((prev) => ({ ...prev, [key]: value }));
    setFeedback(null);
  }

  function updateAboutItem(index: number, value: string) {
    setLocalContent((prev) => ({
      ...prev,
      about: prev.about.map((item, itemIndex) => (itemIndex === index ? value : item)),
    }));
    setFeedback(null);
  }

  function addAboutItem() {
    setLocalContent((prev) => ({ ...prev, about: [...prev.about, ""] }));
    setFeedback(null);
  }

  function removeAboutItem(index: number) {
    setLocalContent((prev) => ({
      ...prev,
      about: prev.about.filter((_, itemIndex) => itemIndex !== index),
    }));
    setFeedback(null);
  }

  function handleSave() {
    setFeedback(null);
    startTransition(async () => {
      const result = await saveBiographyContent(pageId, localContent);
      setFeedback(
        result.success
          ? { type: "success", message: "Biografia salva." }
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
          <h1 className="text-sm font-medium text-text-primary">Biografia</h1>
        </div>
        <div className="flex items-center gap-3">
          <PublishToggle pageId={pageId} initialIsPublished={isPublished} showStatus />
          <span className="hidden text-xs text-text-secondary sm:inline">Biografia</span>
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
            Biografia
          </h2>

          <div className="mt-6 space-y-5">
            <div>
              <label htmlFor="bio-public-name" className="mb-2 block text-sm font-medium text-text-primary">
                Nome público
              </label>
              <input
                id="bio-public-name"
                type="text"
                value={localContent.publicName}
                onChange={(event) => updateField("publicName", event.currentTarget.value)}
                className="h-10 w-full rounded-md border border-border/70 bg-surface px-3 text-sm text-text-primary outline-none transition focus:border-border-strong focus:ring-2 focus:ring-signal/30"
              />
            </div>

            <div>
              <span className="mb-2 block text-sm font-medium text-text-primary">
                Foto de perfil
              </span>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                className="sr-only"
                aria-label="Selecionar foto de perfil"
                onChange={(event) => handleFileChange(event.currentTarget.files?.[0])}
              />
              {localContent.profileImage.trim().length > 0 ? (
                <div className="space-y-3">
                  <div className="relative aspect-square w-full max-w-[180px] overflow-hidden rounded-md bg-surface">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={resolveMediaUrl(localContent.profileImage)}
                      alt={`Foto de perfil de ${localContent.publicName}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleUploadClick}
                      disabled={isUploading}
                      className="inline-flex h-9 items-center justify-center rounded-md border border-border/70 px-3 text-xs font-medium text-text-secondary transition-colors hover:border-border-strong hover:text-text-primary disabled:opacity-60"
                    >
                      {isUploading ? "Enviando…" : "Alterar imagem"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        updateField("profileImage", "");
                        setUploadFeedback(null);
                      }}
                      disabled={isUploading}
                      className="inline-flex h-9 items-center justify-center rounded-md border border-border/70 px-3 text-xs font-medium text-text-secondary transition-colors hover:border-border-strong hover:text-text-primary disabled:opacity-60"
                    >
                      Remover
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleUploadClick}
                  disabled={isUploading}
                  className="inline-flex h-9 items-center justify-center rounded-md border border-dashed border-border px-3 text-xs font-medium text-text-secondary transition-colors hover:border-border-strong hover:text-text-primary disabled:opacity-60"
                >
                  {isUploading ? "Enviando…" : "Fazer upload da imagem"}
                </button>
              )}
              {uploadFeedback && (
                <p
                  role={uploadFeedback.type === "error" ? "alert" : "status"}
                  aria-live="polite"
                  className={`mt-2 text-xs ${uploadFeedback.type === "error" ? "text-red-600" : "text-green-700"}`}
                >
                  {uploadFeedback.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="bio-introduction" className="mb-2 block text-sm font-medium text-text-primary">
                Introdução
              </label>
              <textarea
                id="bio-introduction"
                rows={3}
                value={localContent.introduction}
                onChange={(event) => updateField("introduction", event.currentTarget.value)}
                className="w-full rounded-md border border-border/70 bg-surface px-3 py-2 text-sm text-text-primary outline-none transition focus:border-border-strong focus:ring-2 focus:ring-signal/30"
              />
            </div>

            <div>
              <label htmlFor="bio-body" className="mb-2 block text-sm font-medium text-text-primary">
                Biografia
              </label>
              <textarea
                id="bio-body"
                rows={6}
                value={localContent.biography}
                onChange={(event) => updateField("biography", event.currentTarget.value)}
                aria-describedby="bio-body-help"
                className="w-full rounded-md border border-border/70 bg-surface px-3 py-2 text-sm text-text-primary outline-none transition focus:border-border-strong focus:ring-2 focus:ring-signal/30"
              />
              <p id="bio-body-help" className="mt-2 text-xs leading-5 text-text-secondary">
                Separe parágrafos com uma linha em branco.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-text-primary">Mais sobre</h3>
              <div className="mt-3 space-y-3">
                {localContent.about.map((item, index) => (
                  <div key={index} className="space-y-1">
                    <textarea
                      rows={3}
                      aria-label={`Item ${index + 1} de Mais sobre`}
                      value={item}
                      onChange={(event) => updateAboutItem(index, event.currentTarget.value)}
                      className="w-full rounded-md border border-border/70 bg-surface px-3 py-2 text-sm text-text-primary outline-none transition focus:border-border-strong focus:ring-2 focus:ring-signal/30"
                    />
                    <button
                      type="button"
                      onClick={() => removeAboutItem(index)}
                      className="text-xs text-text-secondary underline-offset-2 hover:text-text-primary hover:underline"
                    >
                      Remover
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addAboutItem}
                  className="inline-flex h-9 w-full items-center justify-center rounded-md border border-dashed border-border px-3 text-xs font-medium text-text-secondary transition-colors hover:border-border-strong hover:text-text-primary"
                >
                  + Adicionar item
                </button>
              </div>
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
          aria-label="Prévia da Biografia"
          className="min-h-0 flex-1 overflow-y-auto bg-[#e9e9e7] p-4 sm:p-6"
        >
          <div className="mx-auto min-h-full max-w-6xl overflow-hidden bg-white shadow-sm">
            {previewHeader}
            <BiographyView content={localContent} asPreview />
            {previewFooter}
          </div>
        </section>
      </div>
    </div>
  );
}
