-- ============================================================================
-- MIGRATION: 20260929000001_add_media_write_policies.sql
-- CMS 07: Admin WRITE policies for media table
-- ============================================================================
--
-- SECURITY NOTE:
-- "authenticated" means any user authenticated via Supabase Auth.
-- No role-based access control is implemented at this stage.
--
-- These policies allow authenticated users to create, update, and delete
-- media records. Public users (anon) remain limited to the public read
-- policies from CMS 01.
--
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. MEDIA: Authenticated users can INSERT new media records
-- ----------------------------------------------------------------------------
CREATE POLICY "Authenticated insert media"
  ON public.media
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- ----------------------------------------------------------------------------
-- 2. MEDIA: Authenticated users can UPDATE any media record
-- ----------------------------------------------------------------------------
CREATE POLICY "Authenticated update media"
  ON public.media
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ----------------------------------------------------------------------------
-- 3. MEDIA: Authenticated users can DELETE any media record
-- ----------------------------------------------------------------------------
CREATE POLICY "Authenticated delete media"
  ON public.media
  FOR DELETE
  TO authenticated
  USING (true);
