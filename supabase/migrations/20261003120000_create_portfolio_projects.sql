-- ============================================================================
-- MIGRATION: 20261003120000_create_portfolio_projects.sql
-- CMS: Seleção manual de projetos da página Portfólio
-- ============================================================================
--
-- Relação independente entre a página Portfólio e os projetos publicados.
-- Não duplica dados de projects/project_categories/media em pages.content e
-- não interfere na seleção via is_featured usada pela Home.
-- ============================================================================

CREATE TABLE public.portfolio_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT portfolio_projects_project_id_unique UNIQUE (project_id)
);

CREATE INDEX idx_portfolio_projects_sort_order ON public.portfolio_projects (sort_order, created_at);

ALTER TABLE public.portfolio_projects ENABLE ROW LEVEL SECURITY;

-- Leitura pública dos vínculos cujo projeto está publicado
CREATE POLICY "Public read portfolio projects for published projects"
  ON public.portfolio_projects
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      WHERE p.id = portfolio_projects.project_id
        AND p.is_published = true
    )
  );

-- Usuários autenticados podem ler todos os vínculos (incluindo projetos rascunho)
CREATE POLICY "Authenticated read all portfolio projects"
  ON public.portfolio_projects
  FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated insert portfolio projects"
  ON public.portfolio_projects
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated update portfolio projects"
  ON public.portfolio_projects
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated delete portfolio projects"
  ON public.portfolio_projects
  FOR DELETE
  TO authenticated
  USING (true);
