"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { setPagePublished } from "./actions";
import { cn } from "@/lib/utils";

interface PublishToggleProps {
  pageId: string;
  initialIsPublished: boolean;
  showStatus?: boolean;
}

export function PublishToggle({
  pageId,
  initialIsPublished,
  showStatus = false,
}: PublishToggleProps) {
  const router = useRouter();
  const [isPublished, setIsPublished] = useState(initialIsPublished);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleToggle() {
    setError(null);
    startTransition(async () => {
      const result = await setPagePublished(pageId, !isPublished);
      if (!result.success) {
        setError(result.error);
        return;
      }
      setIsPublished(!isPublished);
      router.refresh();
    });
  }

  return (
    <div className="flex items-center gap-2">
      {showStatus && (
        <span
          className={cn(
            "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
            isPublished
              ? "bg-green-500/10 text-green-400"
              : "bg-yellow-500/10 text-yellow-400",
          )}
        >
          {isPublished ? "Publicado" : "Rascunho"}
        </span>
      )}
      <button
        type="button"
        onClick={handleToggle}
        disabled={isPending}
        className="inline-flex h-8 items-center justify-center rounded-[var(--radius-sm)] border border-border/70 bg-surface-elevated/75 px-3 text-xs font-medium text-text-primary transition-colors hover:bg-surface-elevated disabled:cursor-wait disabled:opacity-60"
      >
        {isPending ? "Aguarde…" : isPublished ? "Despublicar" : "Publicar"}
      </button>
      {error && (
        <span role="alert" className="text-xs text-red-400">
          {error}
        </span>
      )}
    </div>
  );
}
