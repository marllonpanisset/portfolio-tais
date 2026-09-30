import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { CategoryRow, MediaInsert, MediaRow, MediaUpdate, ProjectRow } from "@/types/database";

// ============================================================================
// Types
// ============================================================================

export type QueryResult<T> =
  | { data: T; error: null }
  | { data: null; error: string };

// ============================================================================
// PUBLIC QUERIES
// ============================================================================

/**
 * List all published projects, ordered by sort_order and created_at.
 */
export async function listPublishedProjects(): Promise<
  QueryResult<ProjectRow[]>
> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("is_published", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

/**
 * Get a single published project by slug.
 */
export async function getPublishedProjectBySlug(
  slug: string,
): Promise<QueryResult<ProjectRow | null>> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

/**
 * List all active categories, ordered by sort_order.
 */
export async function listActiveCategories(): Promise<
  QueryResult<CategoryRow[]>
> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

/**
 * Get categories for a published project.
 */
export async function getProjectCategories(
  projectId: string,
): Promise<QueryResult<CategoryRow[]>> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("project_categories")
    .select("category_id, categories(*)")
    .eq("project_id", projectId);

  if (error) {
    return { data: null, error: error.message };
  }

  const categories: CategoryRow[] = [];
  for (const row of data) {
    const cat = row.categories;
    if (cat && !Array.isArray(cat)) {
      categories.push(cat as CategoryRow);
    }
  }

  return { data: categories, error: null };
}

/**
 * Get media for a published project, ordered by sort_order.
 */
export async function getProjectMedia(
  projectId: string,
): Promise<QueryResult<MediaRow[]>> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("media")
    .select("*")
    .eq("project_id", projectId)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

/**
 * List published and featured projects for the Home page.
 */
export async function listFeaturedProjects(): Promise<
  QueryResult<ProjectRow[]>
> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("is_published", true)
    .eq("is_featured", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

// ============================================================================
// ADMIN QUERIES
// ============================================================================

/**
 * List all projects, including drafts.
 *
 * REQUIRES: User must be authenticated (CMS 05 policy:
 * "Authenticated read all projects").
 */
export async function listAllProjects(): Promise<QueryResult<ProjectRow[]>> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

/**
 * Get any project by ID, including drafts.
 *
 * REQUIRES: User must be authenticated (CMS 05 policy:
 * "Authenticated read all projects").
 */
export async function getProjectById(
  id: string,
): Promise<QueryResult<ProjectRow | null>> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

/**
 * List all categories, including inactive.
 *
 * REQUIRES: User must be authenticated (CMS 05 policy:
 * "Authenticated read all categories").
 */
export async function listAllCategories(): Promise<QueryResult<CategoryRow[]>> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

/**
 * List media for any project by ID, including unpublished projects.
 *
 * REQUIRES: User must be authenticated (CMS 05 policy:
 * "Authenticated read all media").
 */
export async function listProjectMedia(
  projectId: string,
): Promise<QueryResult<MediaRow[]>> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("media")
    .select("*")
    .eq("project_id", projectId)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

/**
 * Get a single media item by ID.
 *
 * REQUIRES: User must be authenticated (CMS 05 policy:
 * "Authenticated read all media").
 */
export async function getMediaById(
  id: string,
): Promise<QueryResult<MediaRow | null>> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("media")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

/**
 * Create a media record.
 *
 * REQUIRES: User must be authenticated (CMS 06 policy:
 * "Authenticated insert media").
 */
export async function createMediaRecord(
  data: MediaInsert,
): Promise<QueryResult<MediaRow>> {
  const supabase = await createClient();

  const { data: media, error } = await supabase
    .from("media")
    .insert(data)
    .select()
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: media, error: null };
}

/**
 * Update a media record.
 *
 * REQUIRES: User must be authenticated (CMS 06 policy:
 * "Authenticated update media").
 */
export async function updateMedia(
  id: string,
  data: MediaUpdate,
): Promise<QueryResult<MediaRow>> {
  const supabase = await createClient();

  const { data: media, error } = await supabase
    .from("media")
    .update(data)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: media, error: null };
}

/**
 * Delete a media record.
 *
 * REQUIRES: User must be authenticated (CMS 06 policy:
 * "Authenticated delete media").
 */
export async function deleteMedia(id: string): Promise<QueryResult<{ id: string }>> {
  const supabase = await createClient();

  const { error } = await supabase.from("media").delete().eq("id", id);

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: { id }, error: null };
}
