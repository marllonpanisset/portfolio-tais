-- ============================================================================
-- MIGRATION: 20260928000000_create_project_media_bucket.sql
-- CMS 03: Storage bucket for project media
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. BUCKET: project-media
-- ----------------------------------------------------------------------------
INSERT INTO storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
VALUES (
  'project-media',
  'project-media',
  true,
  10485760,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']
);

-- ----------------------------------------------------------------------------
-- 2. POLICIES: Storage Objects
-- ----------------------------------------------------------------------------

-- Leitura pública (bucket público já permite, mas explícito para documentação)
CREATE POLICY "Public read project media"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'project-media');

-- Upload apenas para usuários autenticados
CREATE POLICY "Authenticated users can upload"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'project-media'
    AND auth.role() = 'authenticated'
  );

-- Update apenas para usuários autenticados
CREATE POLICY "Authenticated users can update"
  ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'project-media'
    AND auth.role() = 'authenticated'
  );

-- Delete apenas para usuários autenticados
CREATE POLICY "Authenticated users can delete"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'project-media'
    AND auth.role() = 'authenticated'
  );
