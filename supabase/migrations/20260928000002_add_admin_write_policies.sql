-- ============================================================================
-- MIGRATION: 20260928000002_add_admin_write_policies.sql
-- CMS 06: Admin WRITE policies for authenticated users
-- ============================================================================
--
-- SECURITY NOTE:
-- "authenticated" means any user authenticated via Supabase Auth.
-- No role-based access control is implemented at this stage.
-- A future stage may restrict write access by role when the authorization
-- system is implemented.
--
-- These policies allow authenticated users to create, update, and delete
-- projects and project-category links.
-- Public users (anon) remain limited to the public read policies from CMS 01.
--
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. PROJECTS: Authenticated users can INSERT new projects
-- ----------------------------------------------------------------------------
CREATE POLICY "Authenticated insert projects"
  ON public.projects
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- ----------------------------------------------------------------------------
-- 2. PROJECTS: Authenticated users can UPDATE any project
-- ----------------------------------------------------------------------------
CREATE POLICY "Authenticated update projects"
  ON public.projects
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ----------------------------------------------------------------------------
-- 3. PROJECTS: Authenticated users can DELETE any project
-- ----------------------------------------------------------------------------
CREATE POLICY "Authenticated delete projects"
  ON public.projects
  FOR DELETE
  TO authenticated
  USING (true);

-- ----------------------------------------------------------------------------
-- 4. PROJECT_CATEGORIES: Authenticated users can INSERT links
-- ----------------------------------------------------------------------------
CREATE POLICY "Authenticated insert project_categories"
  ON public.project_categories
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- ----------------------------------------------------------------------------
-- 5. PROJECT_CATEGORIES: Authenticated users can DELETE links
-- ----------------------------------------------------------------------------
CREATE POLICY "Authenticated delete project_categories"
  ON public.project_categories
  FOR DELETE
  TO authenticated
  USING (true);
