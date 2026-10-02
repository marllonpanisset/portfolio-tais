-- Extend the Home-only public read exception to authenticated sessions too.
-- Preserve all unrelated page and administrative policies.
DROP POLICY IF EXISTS "Public read Home page content" ON public.pages;

CREATE POLICY "Public read Home page content"
  ON public.pages
  FOR SELECT
  TO anon, authenticated
  USING (slug = 'home');
