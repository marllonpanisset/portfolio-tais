-- Adapta somente a página Portfólio ainda no formato legado vazio do Page Builder.
-- O predicado sobre content torna a migração idempotente e protege edições existentes.
-- is_published é intencionalmente preservado.
UPDATE public.pages
SET content = '{"eyebrow":"SELEÇÃO DE TRABALHOS","title":"Portfólio","description":"Projetos do portfólio de Taís."}'::jsonb
WHERE slug = 'portfolio'
  AND content = '{"sections":[]}'::jsonb;
