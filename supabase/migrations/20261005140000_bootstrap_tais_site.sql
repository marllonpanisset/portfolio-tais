-- ============================================================================
-- MIGRATION: 20261005140000_bootstrap_taís_site.sql
-- Bootstrap: site "Portfolio Taís" + owner inicial
-- ============================================================================
--
-- OBJETIVO
-- Criar o registro do site atual da plataforma e vincular a conta
-- administradora existente com role = owner. É o seed que dá forma à
-- identidade criada em 20261005120000_create_identity_foundation.sql.
--
-- IDEMPOTÊNCIA
-- Esta migration pode ser reexecutada sem efeito colateral:
-- - sites:       ON CONFLICT (slug) DO UPDATE — converge para o name canônico.
-- - memberships: ON CONFLICT (user_id, site_id) DO UPDATE — garante role owner.
-- Nenhuma duplicata é criada em reexecuções.
--
-- ESCOPO DELIBERADAMENTE EXCLUÍDO
-- - Nenhuma tabela do CMS é alterada. projects, categories, project_categories,
--   media, pages, portfolio_projects e site_settings seguem intocadas e sem
--   site_id.
-- - Nenhuma policy de RBAC é criada. profiles, sites e memberships continuam
--   com RLS habilitado e sem policies.
-- - Nenhum consumo em aplicação (UI, login, rotas, queries) é alterado.
--   Criar este registro não muda o comportamento do painel: o acesso atual
--   segue sendo "qualquer authenticated", definido pelas policies do CMS.
--
-- PORTABILIDADE
-- v_owner_id é fixado no UUID da conta administradora deste ambiente. Para
-- aplicar em outro ambiente (staging, etc.), troque o valor abaixo pela
-- conta correspondente. A migration falha de forma explícita se o UUID não
-- existir em auth.users, em vez de criar um site sem dono.
-- ============================================================================

DO $$
DECLARE
  -- Conta administradora existente neste ambiente.
  -- NÃO é a conta de teste do CMS 07 (cms07-test@localhost).
  v_owner_id CONSTANT UUID := '78ad2e51-ec3f-4440-90c6-3f920bb31059';
  v_site_name CONSTANT TEXT := 'Portfolio Taís';
  v_site_slug CONSTANT TEXT := 'tais';
  v_site_id UUID;
BEGIN
  -- ----------------------------------------------------------------------------
  -- 1. Pré-condição: a conta owner precisa existir
  -- ----------------------------------------------------------------------------
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = v_owner_id) THEN
    RAISE EXCEPTION
      'Bootstrap abortado: o usuário % não existe em auth.users. '
      'Atualize v_owner_id nesta migration antes de aplicar.',
      v_owner_id;
  END IF;

  -- ----------------------------------------------------------------------------
  -- 2. Site: cria ou converge para o name canônico
  -- ----------------------------------------------------------------------------
  INSERT INTO public.sites (name, slug)
  VALUES (v_site_name, v_site_slug)
  ON CONFLICT (slug) DO UPDATE
    SET name = EXCLUDED.name
  RETURNING id INTO v_site_id;

  -- ----------------------------------------------------------------------------
  -- 3. Membership: owner do site
  -- ----------------------------------------------------------------------------
  -- invited_by fica NULL: bootstrap não tem convidador, e a constraint
  -- memberships_cannot_invite_self proíbe anyways convidar a si mesmo.
  INSERT INTO public.memberships (user_id, site_id, role, invited_by)
  VALUES (v_owner_id, v_site_id, 'owner', NULL)
  ON CONFLICT (user_id, site_id) DO UPDATE
    SET role = EXCLUDED.role;
END $$;