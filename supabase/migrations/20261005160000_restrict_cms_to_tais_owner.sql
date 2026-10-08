-- Restrict administrative CMS access to the owner membership for site "tais".
-- Public read policies are intentionally preserved; this migration replaces
-- only the previous broad authenticated-user policies.

CREATE OR REPLACE FUNCTION public.is_tais_site_owner()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.memberships AS membership
    JOIN public.sites AS site
      ON site.id = membership.site_id
    WHERE membership.user_id = (SELECT auth.uid())
      AND membership.role = 'owner'::public.membership_role
      AND site.slug = 'tais'
  );
$$;

-- The function only answers whether the caller is the owner of this site.
-- It accepts no user ID and does not expose membership rows.
REVOKE ALL ON FUNCTION public.is_tais_site_owner() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_tais_site_owner() TO authenticated;

-- Remove broad authenticated access from projects.
DROP POLICY IF EXISTS "Authenticated read all projects" ON public.projects;
DROP POLICY IF EXISTS "Authenticated insert projects" ON public.projects;
DROP POLICY IF EXISTS "Authenticated update projects" ON public.projects;
DROP POLICY IF EXISTS "Authenticated delete projects" ON public.projects;

CREATE POLICY "Tais owner manages projects"
  ON public.projects
  FOR ALL
  TO authenticated
  USING ((SELECT public.is_tais_site_owner()))
  WITH CHECK ((SELECT public.is_tais_site_owner()));

-- Remove broad authenticated access from categories.
DROP POLICY IF EXISTS "Authenticated read all categories" ON public.categories;
DROP POLICY IF EXISTS "Authenticated insert categories" ON public.categories;

CREATE POLICY "Tais owner manages categories"
  ON public.categories
  FOR ALL
  TO authenticated
  USING ((SELECT public.is_tais_site_owner()))
  WITH CHECK ((SELECT public.is_tais_site_owner()));

-- Remove broad authenticated access from project/category relations.
DROP POLICY IF EXISTS "Authenticated read all project_categories" ON public.project_categories;
DROP POLICY IF EXISTS "Authenticated insert project_categories" ON public.project_categories;
DROP POLICY IF EXISTS "Authenticated delete project_categories" ON public.project_categories;

CREATE POLICY "Tais owner manages project categories"
  ON public.project_categories
  FOR ALL
  TO authenticated
  USING ((SELECT public.is_tais_site_owner()))
  WITH CHECK ((SELECT public.is_tais_site_owner()));

-- Remove broad authenticated access from media records.
DROP POLICY IF EXISTS "Authenticated read all media" ON public.media;
DROP POLICY IF EXISTS "Authenticated insert media" ON public.media;
DROP POLICY IF EXISTS "Authenticated update media" ON public.media;
DROP POLICY IF EXISTS "Authenticated delete media" ON public.media;

CREATE POLICY "Tais owner manages media"
  ON public.media
  FOR ALL
  TO authenticated
  USING ((SELECT public.is_tais_site_owner()))
  WITH CHECK ((SELECT public.is_tais_site_owner()));

-- Restrict unpublished page content and page administration to the owner.
DROP POLICY IF EXISTS "Authenticated read all pages" ON public.pages;
DROP POLICY IF EXISTS "Authenticated insert pages" ON public.pages;
DROP POLICY IF EXISTS "Authenticated update pages" ON public.pages;
DROP POLICY IF EXISTS "Authenticated delete pages" ON public.pages;

CREATE POLICY "Tais owner manages pages"
  ON public.pages
  FOR ALL
  TO authenticated
  USING ((SELECT public.is_tais_site_owner()))
  WITH CHECK ((SELECT public.is_tais_site_owner()));

-- Restrict unpublished portfolio selections and their administration.
DROP POLICY IF EXISTS "Authenticated read all portfolio projects" ON public.portfolio_projects;
DROP POLICY IF EXISTS "Authenticated insert portfolio projects" ON public.portfolio_projects;
DROP POLICY IF EXISTS "Authenticated update portfolio projects" ON public.portfolio_projects;
DROP POLICY IF EXISTS "Authenticated delete portfolio projects" ON public.portfolio_projects;

CREATE POLICY "Tais owner manages portfolio projects"
  ON public.portfolio_projects
  FOR ALL
  TO authenticated
  USING ((SELECT public.is_tais_site_owner()))
  WITH CHECK ((SELECT public.is_tais_site_owner()));

-- Publicly expose only the site links consumed by the public website.
DROP POLICY IF EXISTS "Public read site settings" ON public.site_settings;

CREATE POLICY "Public read public site settings"
  ON public.site_settings
  FOR SELECT
  USING (key IN ('instagram', 'youtube', 'linkedin', 'whatsapp', 'linktree', 'behance'));

-- Restrict management to the site's owner. The owner policy also retains full
-- SELECT access to all settings through permissive-policy combination.
DROP POLICY IF EXISTS "Authenticated insert site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Authenticated update site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Authenticated delete site settings" ON public.site_settings;

CREATE POLICY "Tais owner manages site settings"
  ON public.site_settings
  FOR ALL
  TO authenticated
  USING ((SELECT public.is_tais_site_owner()))
  WITH CHECK ((SELECT public.is_tais_site_owner()));

-- Public SELECT is used to authorize signing published media. Making the
-- bucket private ensures raw object URLs cannot bypass this policy.
UPDATE storage.buckets
SET public = false
WHERE id = 'project-media';

DROP POLICY IF EXISTS "Public read project media" ON storage.objects;
CREATE POLICY "Public can sign published project media"
  ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'project-media'
    AND (
      EXISTS (
        SELECT 1
        FROM public.media AS cms_media
        JOIN public.projects AS project
          ON project.id = cms_media.project_id
        WHERE cms_media.storage_path = storage.objects.name
          AND cms_media.source = 'upload'
          AND project.is_published = true
      )
      OR EXISTS (
        SELECT 1
        FROM public.pages AS biography_page
        WHERE biography_page.slug = 'biografia'
          AND biography_page.is_published = true
          AND biography_page.content ->> 'profileImage' = storage.objects.name
      )
    )
  );

DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete" ON storage.objects;

CREATE POLICY "Tais owner manages project media objects"
  ON storage.objects
  FOR ALL
  TO authenticated
  USING (
    bucket_id = 'project-media'
    AND (SELECT public.is_tais_site_owner())
  )
  WITH CHECK (
    bucket_id = 'project-media'
    AND (SELECT public.is_tais_site_owner())
  );
