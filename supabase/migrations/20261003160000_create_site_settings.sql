-- ============================================================================
-- MIGRATION: 20261003160000_create_site_settings.sql
-- CMS: Configurações globais do site (Site Settings)
-- ============================================================================

CREATE TABLE public.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  value TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_site_settings_key ON public.site_settings (key);

CREATE TRIGGER trg_site_settings_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Leitura pública das configurações (links globais do site)
CREATE POLICY "Public read site settings"
  ON public.site_settings
  FOR SELECT
  USING (true);

-- Usuários autenticados podem gerenciar as configurações
CREATE POLICY "Authenticated insert site settings"
  ON public.site_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated update site settings"
  ON public.site_settings
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated delete site settings"
  ON public.site_settings
  FOR DELETE
  TO authenticated
  USING (true);

-- Canais iniciais (vazios até serem preenchidos no Admin)
INSERT INTO public.site_settings (key, value) VALUES
  ('instagram', NULL),
  ('youtube', NULL),
  ('linkedin', NULL),
  ('whatsapp', NULL),
  ('linktree', NULL);
