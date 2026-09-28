-- ============================================================================
-- MIGRATION: 20260928000001_add_admin_select_policies.sql
-- CMS 05: Admin SELECT policies for authenticated users
-- ============================================================================
--
-- SECURITY NOTE:
-- "authenticated" means any user authenticated via Supabase Auth.
-- No role-based access control is implemented at this stage.
-- A future stage may restrict admin access by role when the authorization
-- system is implemented.
--
-- These policies allow authenticated users to read all data (including drafts
-- and inactive records) for the admin panel.
-- Public users (anon) remain limited to the public policies from CMS 01.
--
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. PROJECTS: Authenticated users can read all projects (including drafts)
-- ----------------------------------------------------------------------------
CREATE POLICY "Authenticated read all projects"
  ON public.projects
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- ----------------------------------------------------------------------------
-- 2. CATEGORIES: Authenticated users can read all categories (including inactive)
-- ----------------------------------------------------------------------------
CREATE POLICY "Authenticated read all categories"
  ON public.categories
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- ----------------------------------------------------------------------------
-- 3. PROJECT_CATEGORIES: Authenticated users can read all project-category links
-- ----------------------------------------------------------------------------
CREATE POLICY "Authenticated read all project_categories"
  ON public.project_categories
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- ----------------------------------------------------------------------------
-- 4. MEDIA: Authenticated users can read all media (including unpublished)
-- ----------------------------------------------------------------------------
CREATE POLICY "Authenticated read all media"
  ON public.media
  FOR SELECT
  USING (auth.role() = 'authenticated');
