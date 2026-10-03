"use server";

import { revalidatePath } from "next/cache";
import { getPageById } from "@/lib/cms/queries";
import { parseCmsPageContent } from "@/lib/cms/content-validation";
import { withHomeGalleryLabel } from "@/lib/cms/home-content-update";
import { validateImageFile } from "@/lib/cms/media";
import { getMediaUrl, removeImage, uploadImage } from "@/lib/cms/storage";
import { isStoragePath } from "@/lib/media-url";
import { createClient } from "@/lib/supabase/server";

export type SaveHomeGalleryLabelResult =
  | { success: true }
  | { success: false; error: string };

export type SaveBiographyContentResult =
  | { success: true }
  | { success: false; error: string };

export type FeaturedProjectResult =
  | { success: true }
  | { success: false; error: string };

export type SetPagePublishedResult =
  | { success: true }
  | { success: false; error: string };

export async function setPagePublished(
  pageId: string,
  isPublished: boolean,
): Promise<SetPagePublishedResult> {
  if (typeof pageId !== "string" || !UUID_PATTERN.test(pageId)) {
    return { success: false, error: "Identificador da página inválido." };
  }
  if (typeof isPublished !== "boolean") {
    return { success: false, error: "Estado de publicação inválido." };
  }

  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.getClaims();
  if (authError || !authData?.claims) {
    return { success: false, error: "Sua sessão expirou. Entre novamente para continuar." };
  }

  const pageResult = await getPageById(pageId);
  const page = pageResult.data;
  if (!page) {
    return { success: false, error: "A página não foi encontrada." };
  }

  const { data: updatedPage, error: updateError } = await supabase
    .from("pages")
    .update({ is_published: isPublished })
    .eq("id", page.id)
    .eq("updated_at", page.updated_at)
    .select("id, slug")
    .maybeSingle();

  if (updateError) {
    return { success: false, error: "Não foi possível atualizar a publicação da página." };
  }
  if (!updatedPage) {
    return {
      success: false,
      error: "A página mudou desde que foi carregada. Recarregue e tente novamente.",
    };
  }

  const publicPath = page.slug === "home" ? "/" : `/${page.slug}`;
  revalidatePath(publicPath, "page");
  revalidatePath("/admin/paginas", "page");
  revalidatePath(`/admin/paginas/${page.id}`, "page");

  return { success: true };
}

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function setProjectFeatured(
  projectId: string,
  isFeatured: boolean,
): Promise<FeaturedProjectResult> {
  if (typeof projectId !== "string" || !UUID_PATTERN.test(projectId)) {
    return { success: false, error: "Identificador do projeto inválido." };
  }
  if (typeof isFeatured !== "boolean") {
    return { success: false, error: "Estado de destaque inválido." };
  }

  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.getClaims();
  if (authError || !authData?.claims) {
    return { success: false, error: "Sua sessão expirou. Entre novamente para continuar." };
  }

  const update = supabase
    .from("projects")
    .update({ is_featured: isFeatured })
    .eq("id", projectId);
  const { data: updatedProject, error: updateError } = isFeatured
    ? await update.eq("is_published", true).select("id").maybeSingle()
    : await update.select("id").maybeSingle();

  if (updateError) {
    return { success: false, error: "Não foi possível atualizar os projetos em destaque." };
  }
  if (!updatedProject) {
    return {
      success: false,
      error: isFeatured
        ? "O projeto não foi encontrado ou não está publicado."
        : "O projeto não foi encontrado.",
    };
  }

  revalidatePath("/", "page");
  revalidatePath("/admin/paginas/[id]", "page");

  return { success: true };
}

export async function saveHomeGalleryLabel(
  pageId: string,
  galleryLabel: unknown,
): Promise<SaveHomeGalleryLabelResult> {
  if (typeof pageId !== "string" || !UUID_PATTERN.test(pageId)) {
    return { success: false, error: "Identificador da página inválido." };
  }

  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.getClaims();
  if (authError || !authData?.claims) {
    return { success: false, error: "Sua sessão expirou. Entre novamente para salvar." };
  }

  const pageResult = await getPageById(pageId);
  const page = pageResult.data;
  if (!page || page.slug !== "home") {
    return { success: false, error: "A página Home não foi encontrada." };
  }

  const content = withHomeGalleryLabel(page.content, galleryLabel);
  if (!content) {
    return { success: false, error: "O conteúdo da Home é inválido e não pode ser salvo." };
  }

  const { data: updatedPage, error: updateError } = await supabase
    .from("pages")
    .update({ content })
    .eq("id", page.id)
    .eq("slug", "home")
    .eq("updated_at", page.updated_at)
    .select("id")
    .maybeSingle();

  if (updateError) {
    return { success: false, error: "Não foi possível salvar o rótulo da Home." };
  }
  if (!updatedPage) {
    return {
      success: false,
      error: "A página mudou desde que foi carregada. Recarregue e tente novamente.",
    };
  }

  revalidatePath("/", "page");
  revalidatePath(`/admin/paginas/${page.id}`, "page");

  return { success: true };
}

export async function saveBiographyContent(
  pageId: string,
  contentValue: unknown,
): Promise<SaveBiographyContentResult> {
  if (typeof pageId !== "string" || !UUID_PATTERN.test(pageId)) {
    return { success: false, error: "Identificador da página inválido." };
  }

  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.getClaims();
  if (authError || !authData?.claims) {
    return { success: false, error: "Sua sessão expirou. Entre novamente para salvar." };
  }

  const pageResult = await getPageById(pageId);
  const page = pageResult.data;
  if (!page || page.slug !== "biografia") {
    return { success: false, error: "A página Biografia não foi encontrada." };
  }

  const previousContent = parseCmsPageContent("biography", page.content);

  const content = parseCmsPageContent("biography", contentValue);
  if (!content) {
    return { success: false, error: "O conteúdo da Biografia é inválido e não pode ser salvo." };
  }

  const { data: updatedPage, error: updateError } = await supabase
    .from("pages")
    .update({ content })
    .eq("id", page.id)
    .eq("slug", "biografia")
    .eq("updated_at", page.updated_at)
    .select("id")
    .maybeSingle();

  if (updateError) {
    return { success: false, error: "Não foi possível salvar a Biografia." };
  }
  if (!updatedPage) {
    return {
      success: false,
      error: "A página mudou desde que foi carregada. Recarregue e tente novamente.",
    };
  }

  // Best-effort cleanup of the replaced profile image; a failure must not undo the save.
  const previousImage = previousContent?.profileImage;
  if (
    previousImage &&
    previousImage !== content.profileImage &&
    isStoragePath(previousImage)
  ) {
    try {
      await removeImage(previousImage);
    } catch {
      // Best effort — the page was saved successfully.
    }
  }

  revalidatePath("/biografia", "page");
  revalidatePath(`/admin/paginas/${page.id}`, "page");

  return { success: true };
}

export type UploadBiographyImageResult =
  | { success: true; data: { storagePath: string; url: string } }
  | { success: false; error: string };

export async function uploadBiographyImage(
  pageId: string,
  formData: FormData,
): Promise<UploadBiographyImageResult> {
  if (typeof pageId !== "string" || !UUID_PATTERN.test(pageId)) {
    return { success: false, error: "Identificador da página inválido." };
  }

  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.getClaims();
  if (authError || !authData?.claims) {
    return { success: false, error: "Sua sessão expirou. Entre novamente para enviar a imagem." };
  }

  const pageResult = await getPageById(pageId);
  const page = pageResult.data;
  if (!page || page.slug !== "biografia") {
    return { success: false, error: "A página Biografia não foi encontrada." };
  }

  const file = formData.get("file");
  if (!file || !(file instanceof File)) {
    return { success: false, error: "Nenhum arquivo foi enviado." };
  }

  const validationError = validateImageFile(file);
  if (validationError) {
    return { success: false, error: validationError };
  }

  let storagePath: string;
  try {
    storagePath = await uploadImage(page.id, file, "pages");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro desconhecido";
    return { success: false, error: `Falha no upload da imagem: ${message}` };
  }

  const url = await getMediaUrl(storagePath);

  return { success: true, data: { storagePath, url } };
}
