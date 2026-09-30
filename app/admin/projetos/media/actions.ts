"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  createMediaRecord,
  deleteMedia as deleteMediaRecord,
  getMediaById,
  updateMedia as updateMediaRecord,
} from "@/lib/cms/queries";
import { removeImage, uploadImage } from "@/lib/cms/storage";
import { validateImageFile, validateYouTubeUrl } from "@/lib/cms/media";
import type { MediaInsert, MediaUpdate } from "@/types/database";

export type MutationResult =
  | { success: true; data: unknown }
  | { success: false; error: string };

/**
 * Gets the next sort_order for a project (max + 1).
 * Returns an error if the query fails.
 */
async function getNextSortOrder(
  supabase: Awaited<ReturnType<typeof createClient>>,
  projectId: string,
): Promise<{ sort_order: number } | { error: string }> {
  const { data, error } = await supabase
    .from("media")
    .select("sort_order")
    .eq("project_id", projectId)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    return { error: error.message };
  }

  if (!data) {
    return { sort_order: 0 };
  }

  return { sort_order: data.sort_order + 1 };
}

// ============================================================================
// Upload image
// ============================================================================

export async function uploadProjectImage(
  projectId: string,
  formData: FormData,
): Promise<MutationResult> {
  const supabase = await createClient();

  // Verify authentication
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) {
    return { success: false, error: "Usuário não autenticado." };
  }

  const file = formData.get("file");
  if (!file || !(file instanceof File)) {
    return { success: false, error: "Nenhum arquivo foi enviado." };
  }

  // Validate file type and size
  const validationError = validateImageFile(file);
  if (validationError) {
    return { success: false, error: validationError };
  }

  // Upload to storage
  let storagePath: string;
  try {
    storagePath = await uploadImage(projectId, file);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro desconhecido";
    return { success: false, error: `Falha no upload da imagem: ${message}` };
  }

  // Create media record
  const nextSortResult = await getNextSortOrder(supabase, projectId);
  if ("error" in nextSortResult) {
    // Rollback: remove the uploaded file to avoid orphan
    try {
      await removeImage(storagePath);
    } catch {
      // Best effort cleanup
    }
    return { success: false, error: `Falha ao determinar ordem da mídia: ${nextSortResult.error}` };
  }

  const mediaData: MediaInsert = {
    project_id: projectId,
    kind: "image",
    source: "upload",
    storage_path: storagePath,
    external_url: null,
    sort_order: nextSortResult.sort_order,
  };

  const result = await createMediaRecord(mediaData);

  if (result.error) {
    // Rollback: remove the uploaded file to avoid orphan
    try {
      await removeImage(storagePath);
    } catch {
      // Best effort cleanup — don't mask the original error
    }
    return { success: false, error: `Falha ao criar registro de mídia: ${result.error}` };
  }

  revalidatePath(`/admin/projetos/${projectId}`, "page");
  revalidatePath("/trabalhos/[slug]", "page");

  return { success: true, data: result.data };
}

// ============================================================================
// Create YouTube media
// ============================================================================

export async function createYouTubeMedia(
  projectId: string,
  url: string,
): Promise<MutationResult> {
  const supabase = await createClient();

  // Verify authentication
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) {
    return { success: false, error: "Usuário não autenticado." };
  }

  // Validate YouTube URL
  const validationError = validateYouTubeUrl(url);
  if (validationError) {
    return { success: false, error: validationError };
  }

  const nextSortResult = await getNextSortOrder(supabase, projectId);
  if ("error" in nextSortResult) {
    return { success: false, error: `Falha ao determinar ordem da mídia: ${nextSortResult.error}` };
  }

  const mediaData: MediaInsert = {
    project_id: projectId,
    kind: "video",
    source: "youtube",
    external_url: url.trim(),
    storage_path: null,
    sort_order: nextSortResult.sort_order,
  };

  const result = await createMediaRecord(mediaData);

  if (result.error) {
    return { success: false, error: `Falha ao criar registro de mídia: ${result.error}` };
  }

  revalidatePath(`/admin/projetos/${projectId}`, "page");
  revalidatePath("/trabalhos/[slug]", "page");

  return { success: true, data: result.data };
}

// ============================================================================
// Update media (alt, caption, sort_order)
// ============================================================================

export interface MediaUpdateData {
  alt: string | null;
  caption: string | null;
  sort_order: number;
}

export async function updateMedia(
  mediaId: string,
  data: MediaUpdateData,
): Promise<MutationResult> {
  const supabase = await createClient();

  // Verify authentication
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) {
    return { success: false, error: "Usuário não autenticado." };
  }

  // Verify media exists
  const existing = await getMediaById(mediaId);
  if (existing.error || !existing.data) {
    return { success: false, error: "Mídia não encontrada." };
  }

  const updateData: MediaUpdate = {
    alt: data.alt !== undefined ? (data.alt?.trim() || null) : undefined,
    caption: data.caption !== undefined ? (data.caption?.trim() || null) : undefined,
    sort_order: data.sort_order,
  };

  const result = await updateMediaRecord(mediaId, updateData);

  if (!result.data) {
    return { success: false, error: `Falha ao atualizar mídia: ${result.error}` };
  }

  revalidatePath(`/admin/projetos/${existing.data.project_id}`, "page");
  revalidatePath("/trabalhos/[slug]", "page");

  return { success: true, data: result.data };
}

// ============================================================================
// Delete media
// ============================================================================

export async function deleteMedia(mediaId: string): Promise<MutationResult> {
  const supabase = await createClient();

  // Verify authentication
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) {
    return { success: false, error: "Usuário não autenticado." };
  }

  // Get media to determine type and storage path
  const existing = await getMediaById(mediaId);
  if (existing.error || !existing.data) {
    return { success: false, error: "Mídia não encontrada." };
  }

  const media = existing.data;

  // For uploaded images, remove the file from storage first
  if (media.source === "upload" && media.storage_path) {
    try {
      await removeImage(media.storage_path);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro desconhecido";
      return { success: false, error: `Falha ao remover arquivo do Storage: ${message}` };
    }
  }

  // Delete the database record
  const result = await deleteMediaRecord(mediaId);

  if (!result.data) {
    return { success: false, error: `Falha ao excluir registro de mídia: ${result.error}` };
  }

  revalidatePath(`/admin/projetos/${media.project_id}`, "page");
  revalidatePath("/trabalhos/[slug]", "page");

  return { success: true, data: { id: mediaId } };
}

// ============================================================================
// Reorder media (swap sort_order with adjacent item)
// ============================================================================

export async function reorderMedia(
  mediaId: string,
  direction: "up" | "down",
): Promise<MutationResult> {
  const supabase = await createClient();

  // Verify authentication
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) {
    return { success: false, error: "Usuário não autenticado." };
  }

  // Get current media
  const currentResult = await getMediaById(mediaId);
  if (currentResult.error || !currentResult.data) {
    return { success: false, error: "Mídia não encontrada." };
  }

  const current = currentResult.data;

  // Get all media for this project to find adjacent item
  const { data: allMedia, error: listError } = await supabase
    .from("media")
    .select("id, sort_order")
    .eq("project_id", current.project_id)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (listError) {
    return { success: false, error: `Falha ao listar mídias: ${listError.message}` };
  }

  const currentIndex = allMedia.findIndex((m) => m.id === mediaId);
  if (currentIndex === -1) {
    return { success: false, error: "Mídia não encontrada na lista do projeto." };
  }

  const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
  if (targetIndex < 0 || targetIndex >= allMedia.length) {
    return { success: true, data: { id: mediaId } }; // Already at boundary
  }

  const target = allMedia[targetIndex]!;

  // Swap sort_order values
  const { error: swapError } = await supabase
    .from("media")
    .update({ sort_order: target.sort_order })
    .eq("id", mediaId);

  if (swapError) {
    return { success: false, error: `Falha ao reordenar: ${swapError.message}` };
  }

  const { error: swapError2 } = await supabase
    .from("media")
    .update({ sort_order: current.sort_order })
    .eq("id", target.id);

  if (swapError2) {
    return { success: false, error: `Falha ao reordenar: ${swapError2.message}` };
  }

  revalidatePath(`/admin/projetos/${current.project_id}`, "page");

  return { success: true, data: { id: mediaId } };
}
