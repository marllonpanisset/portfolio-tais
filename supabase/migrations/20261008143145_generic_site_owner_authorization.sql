-- Replace client-specific CMS authorization with the installation's owner
-- membership. Each customer installation has its own Supabase project/site.

CREATE OR REPLACE FUNCTION public.is_site_owner()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.memberships AS membership
    WHERE membership.user_id = (SELECT auth.uid())
      AND membership.role = 'owner'::public.membership_role
  );
$$;

REVOKE ALL ON FUNCTION public.is_site_owner() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_site_owner() TO authenticated;

-- Replace client-specific owner policies on projects.
DROP POLICY IF EXISTS "Authenticated read all projects" ON public.projects;
DROP POLICY IF EXISTS "Authenticated insert projects" ON public.projects;
DROP POLICY IF EXISTS "Authenticated update projects" ON public.projects;
DROP POLICY IF EXISTS "Authenticated delete projects" ON public.projects;
DROP POLICY IF EXISTS "Tais owner manages projects" ON public.projects;

CREATE POLICY "Site owner manages projects"
  ON public.projects
  FOR ALL
  TO authenticated
  USING ((SELECT public.is_site_owner()))
  WITH CHECK ((SELECT public.is_site_owner()));

-- Replace client-specific owner policies on categories.
DROP POLICY IF EXISTS "Authenticated read all categories" ON public.categories;
DROP POLICY IF EXISTS "Authenticated insert categories" ON public.categories;
DROP POLICY IF EXISTS "Tais owner manages categories" ON public.categories;

CREATE POLICY "Site owner manages categories"
  ON public.categories
  FOR ALL
  TO authenticated
  USING ((SELECT public.is_site_owner()))
  WITH CHECK ((SELECT public.is_site_owner()));

-- Replace client-specific owner policies on project/category relations.
DROP POLICY IF EXISTS "Authenticated read all project_categories" ON public.project_categories;
DROP POLICY IF EXISTS "Authenticated insert project_categories" ON public.project_categories;
DROP POLICY IF EXISTS "Authenticated delete project_categories" ON public.project_categories;
DROP POLICY IF EXISTS "Tais owner manages project categories" ON public.project_categories;

CREATE POLICY "Site owner manages project categories"
  ON public.project_categories
  FOR ALL
  TO authenticated
  USING ((SELECT public.is_site_owner()))
  WITH CHECK ((SELECT public.is_site_owner()));

-- Replace client-specific owner policies on media records.
DROP POLICY IF EXISTS "Authenticated read all media" ON public.media;
DROP POLICY IF EXISTS "Authenticated insert media" ON public.media;
DROP POLICY IF EXISTS "Authenticated update media" ON public.media;
DROP POLICY IF EXISTS "Authenticated delete media" ON public.media;
DROP POLICY IF EXISTS "Tais owner manages media" ON public.media;

CREATE POLICY "Site owner manages media"
  ON public.media
  FOR ALL
  TO authenticated
  USING ((SELECT public.is_site_owner()))
  WITH CHECK ((SELECT public.is_site_owner()));

-- Public page reads remain limited to published content. The Home exception
-- must also require publication so a draft cannot become public by slug alone.
DROP POLICY IF EXISTS "Authenticated read all pages" ON public.pages;
DROP POLICY IF EXISTS "Authenticated insert pages" ON public.pages;
DROP POLICY IF EXISTS "Authenticated update pages" ON public.pages;
DROP POLICY IF EXISTS "Authenticated delete pages" ON public.pages;
DROP POLICY IF EXISTS "Public read Home page content" ON public.pages;
DROP POLICY IF EXISTS "Tais owner manages pages" ON public.pages;

CREATE POLICY "Public read published Home page"
  ON public.pages
  FOR SELECT
  TO anon, authenticated
  USING (slug = 'home' AND is_published = true);

CREATE POLICY "Site owner manages pages"
  ON public.pages
  FOR ALL
  TO authenticated
  USING ((SELECT public.is_site_owner()))
  WITH CHECK ((SELECT public.is_site_owner()));

-- Replace client-specific owner policies on portfolio selections.
DROP POLICY IF EXISTS "Authenticated read all portfolio projects" ON public.portfolio_projects;
DROP POLICY IF EXISTS "Authenticated insert portfolio projects" ON public.portfolio_projects;
DROP POLICY IF EXISTS "Authenticated update portfolio projects" ON public.portfolio_projects;
DROP POLICY IF EXISTS "Authenticated delete portfolio projects" ON public.portfolio_projects;
DROP POLICY IF EXISTS "Tais owner manages portfolio projects" ON public.portfolio_projects;

CREATE POLICY "Site owner manages portfolio projects"
  ON public.portfolio_projects
  FOR ALL
  TO authenticated
  USING ((SELECT public.is_site_owner()))
  WITH CHECK ((SELECT public.is_site_owner()));

-- Keep the existing public settings allowlist intact; replace only the
-- administrative policies on site_settings.
DROP POLICY IF EXISTS "Authenticated insert site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Authenticated update site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Authenticated delete site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Tais owner manages site settings" ON public.site_settings;

CREATE POLICY "Site owner manages site settings"
  ON public.site_settings
  FOR ALL
  TO authenticated
  USING ((SELECT public.is_site_owner()))
  WITH CHECK ((SELECT public.is_site_owner()));

-- Keep the existing published-object SELECT policy and private bucket. Replace
-- only administrative Storage access, including legacy broad policies.
DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete" ON storage.objects;
DROP POLICY IF EXISTS "Tais owner manages project media objects" ON storage.objects;

CREATE POLICY "Site owner manages project media objects"
  ON storage.objects
  FOR ALL
  TO authenticated
  USING (
    bucket_id = 'project-media'
    AND (SELECT public.is_site_owner())
  )
  WITH CHECK (
    bucket_id = 'project-media'
    AND (SELECT public.is_site_owner())
  );

-- No active policy or application path depends on the historical helper now.
DROP FUNCTION IF EXISTS public.is_tais_site_owner();
