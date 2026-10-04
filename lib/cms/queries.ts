import "server-only";

import { createClient } from "@/lib/supabase/server";
import {
  SITE_SETTING_KEYS,
  type SiteSettingKey,
  type SiteSettings,
} from "@/lib/cms/site-settings";
import type { CategoryRow, MediaInsert, MediaRow, MediaUpdate, PageRow, ProjectRow } from "@/types/database";

// ============================================================================
// Types
// ============================================================================

export type QueryResult<T> =
  | { data: T; error: null }
  | { data: null; error: string };

// ============================================================================
// SITE SETTINGS
// ============================================================================

/**
 * Read all site settings as a complete map for the known keys
 * (missing rows come back as null).
 */
export async function getSiteSettings(): Promise<
  QueryResult<SiteSettings>
> {
  const supabase = await createClient();

  const { data, error } = await supabase.from("site_settings").select("key, value");

  if (error) {
    return { data: null, error: error.message };
  }

  const settings = Object.fromEntries(
    SITE_SETTING_KEYS.map((key) => [key, null]),
  ) as SiteSettings;

  for (const row of data ?? []) {
    if ((SITE_SETTING_KEYS as readonly string[]).includes(row.key)) {
      settings[row.key as SiteSettingKey] = row.value;
    }
  }

  return { data: settings, error: null };
}

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

export async function listPublishedPortfolioProjects(): Promise<
  QueryResult<ProjectRow[]>
> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("portfolio_projects")
    .select("sort_order, projects!inner(*)")
    .eq("projects.is_published", true)
    .order("sort_order", { ascending: true });

  if (error) {
    return { data: null, error: error.message };
  }

  const projects: ProjectRow[] = [];
  for (const row of data) {
    const project = (row as { projects: ProjectRow | ProjectRow[] | null }).projects;
    if (project && !Array.isArray(project)) {
      projects.push(project);
    }
  }

  return { data: projects, error: null };
}

/**
 * List all portfolio project selections, including selections pointing to
 * unpublished projects. Admin only (requires "Authenticated read all
 * portfolio projects").
 */
export async function listAllPortfolioProjects(): Promise<
  QueryResult<ProjectRow[]>
> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("portfolio_projects")
    .select("sort_order, projects(*)")
    .order("sort_order", { ascending: true });

  if (error) {
    return { data: null, error: error.message };
  }

  const projects: ProjectRow[] = [];
  for (const row of data) {
    const project = (row as { projects: ProjectRow | ProjectRow[] | null }).projects;
    if (project && !Array.isArray(project)) {
      projects.push(project);
    }
  }

  return { data: projects, error: null };
}

// ============================================================================
// PAGE BUILDER QUERIES (CMS 08.1)
// ============================================================================

/**
 * List all published pages.
 *
 * Public access: only published pages are returned.
 */
export async function listPublishedPages(): Promise<QueryResult<PageRow[]>> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("pages")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: true });

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

/**
 * Get a single published page by slug.
 *
 * Public access: only published pages are returned.
 */
export async function getPublishedPageBySlug(
  slug: string,
): Promise<QueryResult<PageRow | null>> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("pages")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

/** Read the Home editorial record; its public visibility is restricted by RLS to slug = 'home'. */
export async function getPublicHomePage(): Promise<
  QueryResult<PageRow | null>
> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("pages")
    .select("*")
    .eq("slug", "home")
    .maybeSingle();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

/**
 * List all pages, including drafts.
 *
 * REQUIRES: User must be authenticated (CMS 08.1 policy:
 * "Authenticated read all pages").
 */
export async function listAllPages(): Promise<QueryResult<PageRow[]>> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("pages")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

/**
 * Get any page by ID, including drafts.
 *
 * REQUIRES: User must be authenticated (CMS 08.1 policy:
 * "Authenticated read all pages").
 */
export async function getPageById(
  id: string,
): Promise<QueryResult<PageRow | null>> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("pages")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}
