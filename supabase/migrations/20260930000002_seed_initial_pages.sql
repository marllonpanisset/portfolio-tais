-- ============================================================================
-- MIGRATION: 20260930000002_seed_initial_pages.sql
-- CMS 08.1: Seed initial pages for Page Builder
-- ============================================================================
--
-- Registra as páginas existentes do site como rascunhos não publicados.
-- O conteúdo atual do site NÃO é migrado para JSON nesta etapa.
-- ============================================================================

INSERT INTO public.pages (title, slug, content, is_published)
VALUES
  ('Home', 'home', '{"sections":[]}'::jsonb, false),
  ('Biografia', 'biografia', '{"sections":[]}'::jsonb, false),
  ('Portfólio', 'portfolio', '{"sections":[]}'::jsonb, false),
  ('Contato', 'contato', '{"sections":[]}'::jsonb, false);
