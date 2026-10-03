"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { listAllCategories } from "@/lib/cms/queries";
import type { ProjectInsert, ProjectUpdate } from "@/types/database";

export type MutationResult =
  | { success: true; data: unknown }
  | { success: false; error: string };

export interface ProjectFormData {
  title: string;
  slug: string;
  description: string | null;
  year: number | null;
  is_published: boolean;
  is_featured: boolean;
  sort_order: number;
  category_ids: string[];
}

function validateProjectData(data: Partial<ProjectFormData>): string | null {
  if (!data.title || data.title.trim().length === 0) {
    return "Title is required";
  }
  if (!data.slug || data.slug.trim().length === 0) {
    return "Slug is required";
  }
  if (data.year !== null && data.year !== undefined) {
    const year = Number(data.year);
    if (isNaN(year) || year < 1900 || year > 2100) {
      return "Year must be a valid number between 1900 and 2100";
    }
  }
  return null;
}

export async function createProject(
  data: ProjectFormData,
): Promise<MutationResult> {
  const validationError = validateProjectData(data);
  if (validationError) {
    return { success: false, error: validationError };
  }

  const supabase = await createClient();

  const projectData: ProjectInsert = {
    title: data.title.trim(),
    slug: data.slug.trim(),
    description: data.description?.trim() || null,
    year: data.year ?? null,
    is_published: data.is_published,
    is_featured: data.is_featured,
    sort_order: data.sort_order,
  };

  const { data: project, error: projectError } = await supabase
    .from("projects")
    .insert(projectData)
    .select()
    .single();

  if (projectError) {
    if (projectError.code === "23505") {
      return { success: false, error: "A project with this slug already exists" };
    }
    return { success: false, error: projectError.message };
  }

  if (data.category_ids.length > 0) {
    const links = data.category_ids.map((categoryId) => ({
      project_id: project.id,
      category_id: categoryId,
    }));

    const { error: linkError } = await supabase
      .from("project_categories")
      .insert(links);

    if (linkError) {
      await supabase.from("projects").delete().eq("id", project.id);
      return { success: false, error: linkError.message };
    }
  }

  if (data.is_published && data.is_featured) {
    const { count } = await supabase
      .from("portfolio_projects")
      .select("id", { count: "exact", head: true });

    const { error: portfolioLinkError } = await supabase
      .from("portfolio_projects")
      .insert({ project_id: project.id, sort_order: count ?? 0 });

    if (portfolioLinkError) {
      await supabase
        .from("project_categories")
        .delete()
        .eq("project_id", project.id);
      await supabase.from("projects").delete().eq("id", project.id);
      return { success: false, error: portfolioLinkError.message };
    }
  }

  revalidatePath("/", "layout");
  revalidatePath("/portfolio", "layout");

  return { success: true, data: project };
}

export async function updateProject(
  id: string,
  data: ProjectFormData,
): Promise<MutationResult> {
  const validationError = validateProjectData(data);
  if (validationError) {
    return { success: false, error: validationError };
  }

  const supabase = await createClient();

  const projectData: ProjectUpdate = {
    title: data.title.trim(),
    slug: data.slug.trim(),
    description: data.description?.trim() || null,
    year: data.year ?? null,
    is_published: data.is_published,
    is_featured: data.is_featured,
    sort_order: data.sort_order,
  };

  const { error: projectError } = await supabase
    .from("projects")
    .update(projectData)
    .eq("id", id);

  if (projectError) {
    if (projectError.code === "23505") {
      return { success: false, error: "A project with this slug already exists" };
    }
    return { success: false, error: projectError.message };
  }

  const { error: deleteError } = await supabase
    .from("project_categories")
    .delete()
    .eq("project_id", id);

  if (deleteError) {
    return { success: false, error: deleteError.message };
  }

  if (data.category_ids.length > 0) {
    const links = data.category_ids.map((categoryId) => ({
      project_id: id,
      category_id: categoryId,
    }));

    const { error: linkError } = await supabase
      .from("project_categories")
      .insert(links);

    if (linkError) {
      return { success: false, error: linkError.message };
    }
  }

  revalidatePath("/", "layout");
  revalidatePath("/portfolio", "layout");
  revalidatePath(`/trabalhos/${data.slug}`, "page");

  return { success: true, data: { id } };
}

export async function deleteProject(id: string): Promise<MutationResult> {
  const supabase = await createClient();

  const { data: project } = await supabase
    .from("projects")
    .select("slug")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase.from("projects").delete().eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/", "layout");
  revalidatePath("/portfolio", "layout");
  if (project?.slug) {
    revalidatePath(`/trabalhos/${project.slug}`, "page");
  }

  return { success: true, data: { id } };
}

export async function publishProject(id: string): Promise<MutationResult> {
  const supabase = await createClient();

  const { data: project, error } = await supabase
    .from("projects")
    .update({ is_published: true })
    .eq("id", id)
    .select("slug")
    .maybeSingle();

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/", "layout");
  revalidatePath("/portfolio", "layout");
  if (project?.slug) {
    revalidatePath(`/trabalhos/${project.slug}`, "page");
  }

  return { success: true, data: { id } };
}

export async function unpublishProject(id: string): Promise<MutationResult> {
  const supabase = await createClient();

  const { data: project, error } = await supabase
    .from("projects")
    .update({ is_published: false })
    .eq("id", id)
    .select("slug")
    .maybeSingle();

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/", "layout");
  revalidatePath("/portfolio", "layout");
  if (project?.slug) {
    revalidatePath(`/trabalhos/${project.slug}`, "page");
  }

  return { success: true, data: { id } };
}

/**
 * List all categories for use in client components.
 */
export async function listCategories() {
  return listAllCategories();
}
