"use client";

import { useState, useRef, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  createYouTubeMedia,
  deleteMedia,
  reorderMedia,
  updateMedia,
  uploadProjectImage,
  type MediaUpdateData,
} from "../media/actions";
import type { MediaRow } from "@/types/database";

interface MediaManagerProps {
  projectId: string;
  media: (MediaRow & { signedUrl: string | null })[];
}

function getYouTubeThumbnailUrl(externalUrl: string): string | null {
  const match = externalUrl.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  const shortMatch = externalUrl.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  const videoId = match?.[1] ?? shortMatch?.[1];
  if (!videoId) return null;
  return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
}

export function MediaManager({ projectId, media }: MediaManagerProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editAlt, setEditAlt] = useState("");
  const [editCaption, setEditCaption] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleImageUpload(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      setError("Selecione uma imagem para enviar.");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    const result = await uploadProjectImage(projectId, formData);

    setLoading(false);

    if (!result.success) {
      setError(result.error);
      return;
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    router.refresh();
  }

  async function handleYouTubeSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!youtubeUrl.trim()) {
      setError("Informe a URL do vídeo do YouTube.");
      return;
    }

    setLoading(true);
    setError(null);

    const result = await createYouTubeMedia(projectId, youtubeUrl);

    setLoading(false);

    if (!result.success) {
      setError(result.error);
      return;
    }

    setYoutubeUrl("");
    router.refresh();
  }

  async function handleEditSubmit(e: FormEvent<HTMLFormElement>, mediaId: string) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const data: MediaUpdateData = {
      alt: editAlt,
      caption: editCaption,
      sort_order: media.find((m) => m.id === mediaId)?.sort_order ?? 0,
    };

    const result = await updateMedia(mediaId, data);

    setLoading(false);

    if (!result.success) {
      setError(result.error);
      return;
    }

    setEditingId(null);
    router.refresh();
  }

  async function handleDelete(mediaId: string) {
    if (!confirm("Tem certeza que deseja excluir esta mídia?")) {
      return;
    }

    setLoading(true);
    setError(null);

    const result = await deleteMedia(mediaId);

    setLoading(false);

    if (!result.success) {
      setError(result.error);
      return;
    }

    router.refresh();
  }

  async function handleReorder(mediaId: string, direction: "up" | "down") {
    setLoading(true);
    setError(null);

    const result = await reorderMedia(mediaId, direction);

    setLoading(false);

    if (!result.success) {
      setError(result.error);
      return;
    }

    router.refresh();
  }

  function startEditing(item: MediaRow) {
    setEditingId(item.id);
    setEditAlt(item.alt ?? "");
    setEditCaption(item.caption ?? "");
  }

  function cancelEditing() {
    setEditingId(null);
    setEditAlt("");
    setEditCaption("");
  }

  return (
    <div className="space-y-6 rounded-lg border border-border/70 bg-surface-elevated/50 p-6">
      <div>
        <h2 className="text-lg font-semibold text-text-primary">Mídia</h2>
        <p className="mt-1 text-sm text-text-secondary">
          Gerencie as imagens e vídeos do projeto
        </p>
      </div>

      {error && (
        <div className="rounded-md border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Upload forms */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Image upload */}
        <form onSubmit={handleImageUpload} className="space-y-3">
          <label className="block text-sm font-medium text-text-primary">
            Adicionar imagem
          </label>
          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
              className="w-full text-sm text-text-secondary file:mr-3 file:rounded-md file:border file:border-border/70 file:bg-surface-elevated file:px-3 file:py-1.5 file:text-xs file:text-text-primary hover:file:bg-surface-elevated/75"
            />
            <button
              type="submit"
              disabled={loading}
              className="inline-flex h-9 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-gradient-to-b from-signal-strong to-signal px-4 text-sm font-medium text-white transition-all hover:brightness-105 disabled:opacity-50"
            >
              Enviar
            </button>
          </div>
          <p className="text-xs text-text-secondary/70">
            JPEG, PNG, WebP, GIF ou AVIF. Máximo 10 MB.
          </p>
        </form>

        {/* YouTube URL */}
        <form onSubmit={handleYouTubeSubmit} className="space-y-3">
          <label htmlFor="youtube-url" className="block text-sm font-medium text-text-primary">
            Adicionar vídeo do YouTube
          </label>
          <div className="flex items-center gap-2">
            <input
              id="youtube-url"
              type="url"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full rounded-md border border-border/70 bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary/50 focus:border-signal focus:outline-none focus:ring-1 focus:ring-signal"
            />
            <button
              type="submit"
              disabled={loading}
              className="inline-flex h-9 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-gradient-to-b from-signal-strong to-signal px-4 text-sm font-medium text-white transition-all hover:brightness-105 disabled:opacity-50"
            >
              Adicionar
            </button>
          </div>
          <p className="text-xs text-text-secondary/70">
            Cole a URL do vídeo do YouTube.
          </p>
        </form>
      </div>

      {/* Media list */}
      {media.length === 0 ? (
        <p className="text-sm text-text-secondary">Nenhuma mídia cadastrada.</p>
      ) : (
        <div className="space-y-3">
          {media.map((item, index) => (
            <div
              key={item.id}
              className="flex items-start gap-4 rounded-md border border-border/50 bg-surface p-4"
            >
              {/* Thumbnail / Preview */}
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-surface-elevated">
                {item.kind === "image" && item.signedUrl ? (
                  <Image
                    src={item.signedUrl}
                    alt={item.alt ?? "Imagem do projeto"}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                ) : item.source === "youtube" && item.external_url ? (
                  <Image
                    src={getYouTubeThumbnailUrl(item.external_url) ?? ""}
                    alt={item.alt ?? "Vídeo do YouTube"}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-text-secondary">
                    Sem preview
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="min-w-0 flex-1">
                {editingId === item.id ? (
                  <form onSubmit={(e) => handleEditSubmit(e, item.id)} className="space-y-2">
                    <input
                      type="text"
                      value={editAlt}
                      onChange={(e) => setEditAlt(e.target.value)}
                      placeholder="Texto alternativo (alt)"
                      className="w-full rounded-md border border-border/70 bg-surface px-3 py-1.5 text-sm text-text-primary placeholder:text-text-secondary/50 focus:border-signal focus:outline-none focus:ring-1 focus:ring-signal"
                    />
                    <input
                      type="text"
                      value={editCaption}
                      onChange={(e) => setEditCaption(e.target.value)}
                      placeholder="Legenda"
                      className="w-full rounded-md border border-border/70 bg-surface px-3 py-1.5 text-sm text-text-primary placeholder:text-text-secondary/50 focus:border-signal focus:outline-none focus:ring-1 focus:ring-signal"
                    />
                    <div className="flex items-center gap-2">
                      <button
                        type="submit"
                        disabled={loading}
                        className="rounded-md bg-signal px-3 py-1 text-xs font-medium text-white transition-all hover:brightness-105 disabled:opacity-50"
                      >
                        Salvar
                      </button>
                      <button
                        type="button"
                        onClick={cancelEditing}
                        className="rounded-md border border-border/70 px-3 py-1 text-xs text-text-secondary transition-all hover:bg-surface-elevated"
                      >
                        Cancelar
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center rounded-full bg-surface-elevated px-2 py-0.5 text-xs text-text-secondary">
                        {item.kind === "image" ? "Imagem" : "Vídeo"}
                      </span>
                      <span className="inline-flex items-center rounded-full bg-surface-elevated px-2 py-0.5 text-xs text-text-secondary">
                        {item.source === "upload" ? "Upload" : "YouTube"}
                      </span>
                      <span className="text-xs text-text-secondary/70">
                        Ordem: {item.sort_order}
                      </span>
                      {index === 0 && (
                        <span className="inline-flex items-center rounded-full bg-signal/10 px-2 py-0.5 text-xs font-medium text-signal">
                          Capa
                        </span>
                      )}
                    </div>
                    {item.alt && (
                      <p className="mt-1 truncate text-sm text-text-primary">
                        <span className="text-text-secondary">Alt:</span> {item.alt}
                      </p>
                    )}
                    {item.caption && (
                      <p className="mt-0.5 truncate text-sm text-text-secondary">
                        <span className="text-text-secondary/70">Legenda:</span> {item.caption}
                      </p>
                    )}
                    {item.source === "youtube" && item.external_url && (
                      <p className="mt-0.5 truncate text-xs text-text-secondary/50">
                        {item.external_url}
                      </p>
                    )}
                  </>
                )}
              </div>

              {/* Actions */}
              {editingId !== item.id && (
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleReorder(item.id, "up")}
                      disabled={loading || index === 0}
                      className="rounded border border-border/70 px-2 py-1 text-xs text-text-secondary transition-all hover:bg-surface-elevated disabled:opacity-30"
                      title="Mover para cima"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => handleReorder(item.id, "down")}
                      disabled={loading || index === media.length - 1}
                      className="rounded border border-border/70 px-2 py-1 text-xs text-text-secondary transition-all hover:bg-surface-elevated disabled:opacity-30"
                      title="Mover para baixo"
                    >
                      ↓
                    </button>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => startEditing(item)}
                      disabled={loading}
                      className="rounded border border-border/70 px-2 py-1 text-xs text-text-secondary transition-all hover:bg-surface-elevated disabled:opacity-30"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      disabled={loading}
                      className="rounded border border-red-500/30 bg-red-500/10 px-2 py-1 text-xs text-red-400 transition-all hover:bg-red-500/20 disabled:opacity-30"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
