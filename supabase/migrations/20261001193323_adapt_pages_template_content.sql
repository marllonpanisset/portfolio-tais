-- Adapta somente páginas ainda no formato legado vazio do Page Builder.
-- O predicado sobre content torna a migração idempotente e protege edições existentes.
-- is_published é intencionalmente preservado.
UPDATE public.pages
SET content = CASE slug
  WHEN 'home' THEN '{"galleryLabel":"PROJETOS EM DESTAQUE"}'::jsonb
  WHEN 'biografia' THEN '{"publicName":"Taís","profileImage":"/perfil.jpg","introduction":"","biography":"","about":[]}'::jsonb
  WHEN 'contato' THEN '{"title":"Vamos conversar?","subtitle":"Contato","informationText":"Os canais de contato estão em preparação e serão publicados após confirmação."}'::jsonb
END
WHERE slug IN ('home', 'biografia', 'contato')
  AND content = '{"sections":[]}'::jsonb;
