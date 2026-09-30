-- ============================================================================
-- MIGRATION: 20260930000001_create_pages_table.sql
-- CMS 08.1: Page Builder Foundation — pages table
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. TABELA: pages
-- ----------------------------------------------------------------------------
CREATE TABLE public.pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content JSONB NOT NULL DEFAULT '{"sections":[]}'::jsonb,
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT pages_title_not_empty CHECK (char_length(trim(title)) > 0),
  CONSTRAINT pages_slug_not_empty CHECK (char_length(trim(slug)) > 0)
);

-- Trigger de updated_at para pages
CREATE TRIGGER trg_pages_updated_at
  BEFORE UPDATE ON public.pages
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ----------------------------------------------------------------------------
-- 2. ÍNDICES
-- ----------------------------------------------------------------------------

-- Pages: busca pública por slug (apenas publicadas)
CREATE INDEX idx_pages_public_slug ON public.pages(slug)
  WHERE is_published = true;

-- Pages: listagem administrativa (todas as páginas)
CREATE INDEX idx_pages_all ON public.pages(created_at DESC);

-- ----------------------------------------------------------------------------
-- 3. ROW LEVEL SECURITY (RLS)
-- ----------------------------------------------------------------------------

ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;

-- 1. Leitura pública de páginas publicadas
CREATE POLICY "Public read published pages"
  ON public.pages
  FOR SELECT
  USING (is_published = true);

-- 2. Usuários autenticados podem ler todas as páginas (incluindo rascunhos)
CREATE POLICY "Authenticated read all pages"
  ON public.pages
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- 3. Usuários autenticados podem criar páginas
CREATE POLICY "Authenticated insert pages"
  ON public.pages
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- 4. Usuários autenticados podem atualizar páginas
CREATE POLICY "Authenticated update pages"
  ON public.pages
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 5. Usuários autenticados podem excluir páginas
CREATE POLICY "Authenticated delete pages"
  ON public.pages
  FOR DELETE
  TO authenticated
  USING (true);
