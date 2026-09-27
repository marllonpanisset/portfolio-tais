-- ============================================================================
-- MIGRATION: 20260927113500_create_cms_foundation.sql
-- CMS Foundation: projects, categories, project_categories, media
-- ============================================================================

-- Extensão para geração de UUID
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Função utilitária para atualização automática de updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ----------------------------------------------------------------------------
-- 1. TABELA: projects
-- ----------------------------------------------------------------------------
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  year INTEGER,
  is_published BOOLEAN NOT NULL DEFAULT false,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT projects_title_not_empty CHECK (char_length(trim(title)) > 0),
  CONSTRAINT projects_slug_not_empty CHECK (char_length(trim(slug)) > 0)
);

-- Trigger de updated_at para projects
CREATE TRIGGER trg_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ----------------------------------------------------------------------------
-- 2. TABELA: categories
-- ----------------------------------------------------------------------------
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT categories_name_not_empty CHECK (char_length(trim(name)) > 0),
  CONSTRAINT categories_slug_not_empty CHECK (char_length(trim(slug)) > 0)
);

-- Trigger de updated_at para categories
CREATE TRIGGER trg_categories_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ----------------------------------------------------------------------------
-- 3. TABELA: project_categories
-- ----------------------------------------------------------------------------
CREATE TABLE public.project_categories (
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  PRIMARY KEY (project_id, category_id)
);

-- ----------------------------------------------------------------------------
-- 4. TABELA: media
-- ----------------------------------------------------------------------------
CREATE TABLE public.media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  kind TEXT NOT NULL,
  source TEXT NOT NULL,
  external_url TEXT,
  storage_path TEXT,
  thumbnail_path TEXT,
  alt TEXT,
  caption TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Validação de valores permitidos para kind e source
  CONSTRAINT media_kind_check CHECK (kind IN ('image', 'video')),
  CONSTRAINT media_source_check CHECK (source IN ('upload', 'youtube')),

  -- Proibição de image + youtube
  CONSTRAINT media_no_image_youtube CHECK (
    NOT (kind = 'image' AND source = 'youtube')
  ),

  -- Regras e exclusividade para source = 'upload'
  -- (storage_path obrigatório, external_url deve ser NULL)
  CONSTRAINT media_source_upload_rules CHECK (
    source != 'upload' OR (
      storage_path IS NOT NULL 
      AND char_length(trim(storage_path)) > 0
      AND external_url IS NULL
    )
  ),

  -- Regras e exclusividade para source = 'youtube'
  -- (external_url obrigatório, storage_path deve ser NULL)
  CONSTRAINT media_source_youtube_rules CHECK (
    source != 'youtube' OR (
      external_url IS NOT NULL 
      AND char_length(trim(external_url)) > 0
      AND storage_path IS NULL
    )
  )
);

-- Trigger de updated_at para media
CREATE TRIGGER trg_media_updated_at
  BEFORE UPDATE ON public.media
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ----------------------------------------------------------------------------
-- ÍNDICES (Consultas Públicas e Operações de Admin)
-- ----------------------------------------------------------------------------

-- Projects: listagens públicas (ordenação de publicados)
CREATE INDEX idx_projects_public_sort ON public.projects(sort_order ASC, created_at DESC)
  WHERE is_published = true;

-- Projects: destaque na Home (ordenação de publicados e destacados)
CREATE INDEX idx_projects_featured_home ON public.projects(sort_order ASC, created_at DESC)
  WHERE is_published = true AND is_featured = true;

-- Categories: ordenação e busca pública de ativas
CREATE INDEX idx_categories_active_sort ON public.categories(sort_order ASC)
  WHERE is_active = true;

-- Project Categories: FK reversa (necessária para junções por categoria)
CREATE INDEX idx_project_categories_category_id ON public.project_categories(category_id);

-- Media: mídias de um projeto ordenadas
CREATE INDEX idx_media_project_sort ON public.media(project_id, sort_order ASC, created_at ASC);

-- ----------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS)
-- ----------------------------------------------------------------------------

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;

-- 1. Leitura pública de categorias ativas
CREATE POLICY "Public read active categories"
  ON public.categories
  FOR SELECT
  USING (is_active = true);

-- 2. Leitura pública de projetos publicados
CREATE POLICY "Public read published projects"
  ON public.projects
  FOR SELECT
  USING (is_published = true);

-- 3. Leitura pública dos vínculos pertencentes a projetos publicados
CREATE POLICY "Public read project_categories for published projects"
  ON public.project_categories
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      WHERE p.id = project_categories.project_id
        AND p.is_published = true
    )
  );

-- 4. Leitura pública de mídias pertencentes a projetos publicados
CREATE POLICY "Public read media for published projects"
  ON public.media
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      WHERE p.id = media.project_id
        AND p.is_published = true
    )
  );
