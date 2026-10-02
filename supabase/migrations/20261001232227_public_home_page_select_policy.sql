-- Permit anonymous visitors to read only the editorial content for the Home.
-- Existing published-page and administrative policies remain unchanged.
CREATE POLICY "Public read Home page content"
  ON public.pages
  FOR SELECT
  TO anon
  USING (slug = 'home');
