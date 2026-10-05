-- ============================================================================
-- MIGRATION: 20261005120000_create_identity_foundation.sql
-- Identity Foundation: profiles, sites, memberships
-- ============================================================================
--
-- OBJETIVO
-- Criar a fundação de identidade da plataforma Conjuga, capaz de suportar
-- múltiplos clientes/sites no mesmo produto.
--
-- MODELO
--   auth.users      -> identidade principal (Supabase Auth). Continua sendo a
--                      fonte de verdade de "quem é esta pessoa".
--   public.profiles -> a pessoa (dados de exibição). Não carrega autorização.
--   public.sites    -> um cliente/site da plataforma.
--   public.memberships -> liga uma pessoa a um site e define sua role.
--
-- ESCOPO DELIBERADAMENTE EXCLUÍDO
-- - As tabelas do CMS (projects, categories, project_categories, media, pages,
--   portfolio_projects, site_settings) NÃO recebem site_id nesta migration.
-- - Nenhuma policy de RBAC é criada aqui. As policies do CMS continuam
--   baseadas apenas em auth.role() = 'authenticated', como antes.
-- - Nenhum consumo em aplicação (UI, queries, helpers) é alterado.
--
-- SEGURANÇA
-- As três tabelas têm RLS habilitado e NENHUMA policy. Isso significa que
-- anon e authenticated recebem zero acesso via PostgREST, e service_role
-- continua operando por bypass de RLS. Criar a estrutura sem esse cuidado
-- exporia dados de identidade e de tenancy pela API pública.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. ENUM: membership_role
-- ----------------------------------------------------------------------------
CREATE TYPE public.membership_role AS ENUM ('owner', 'editor', 'viewer');

-- ----------------------------------------------------------------------------
-- 2. TABELA: profiles
-- ----------------------------------------------------------------------------
-- Representa a pessoa, não o acesso. Um profile existe por usuário do Auth e
-- não carrega site_id nem role: essa informação vive em memberships.
CREATE TABLE public.profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT profiles_display_name_not_empty
    CHECK (display_name IS NULL OR char_length(trim(display_name)) > 0)
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- 3. TABELA: sites
-- ----------------------------------------------------------------------------
-- Um cliente/site da plataforma. O slug é a chave estável usada para resolver
-- qual site uma requisição pertence.
CREATE TABLE public.sites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT sites_name_not_empty CHECK (char_length(trim(name)) > 0),
  CONSTRAINT sites_slug_not_empty CHECK (char_length(trim(slug)) > 0),
  CONSTRAINT sites_slug_format CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$')
);

CREATE INDEX idx_sites_slug ON public.sites (slug);

ALTER TABLE public.sites ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- 4. TABELA: memberships
-- ----------------------------------------------------------------------------
-- Tabela de autorização da plataforma: liga user_id a site_id com uma role.
-- UNIQUE(user_id, site_id) impede duplicidade e cria índice para as consultas
-- "sites deste usuário" (prefixo user_id).
CREATE TABLE public.memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  site_id UUID NOT NULL REFERENCES public.sites(id) ON DELETE CASCADE,
  role public.membership_role NOT NULL DEFAULT 'viewer',
  invited_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT memberships_user_site_unique UNIQUE (user_id, site_id),
  CONSTRAINT memberships_cannot_invite_self CHECK (invited_by IS DISTINCT FROM user_id)
);

-- Índice para "membros deste site" (prefixo site_id, não coberto pelo UNIQUE).
CREATE INDEX idx_memberships_site_id ON public.memberships (site_id);
CREATE INDEX idx_memberships_invited_by ON public.memberships (invited_by)
  WHERE invited_by IS NOT NULL;

ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- 5. TRIGGER: criação automática de profile
-- ----------------------------------------------------------------------------
-- Garante que toda pessoa autenticada tenha um profile sem depender de
-- código de aplicação. SECURITY DEFINER porque o INSERT roda no contexto do
-- trigger do auth.users, que não passa pelas policies de RLS.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (
    NEW.id,
    COALESCE(
      NULLIF(trim(NEW.raw_user_meta_data ->> 'full_name'), ''),
      NULLIF(trim(NEW.raw_user_meta_data ->> 'name'), ''),
      NULLIF(split_part(COALESCE(NEW.email, ''), '@', 1), '')
    )
  )
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public;

CREATE TRIGGER trg_auth_user_created_profile
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ----------------------------------------------------------------------------
-- 6. BACKFILL: profiles de contas já existentes
-- ----------------------------------------------------------------------------
-- O trigger acima só cobre usuários criados depois desta migration.
-- Este INSERT é idempotente (ON CONFLICT DO NOTHING) e garante que contas
-- preexistentes também tenham profile. Não cria memberships: essa decisão
-- pertence à fase de autorização.
INSERT INTO public.profiles (user_id, display_name)
SELECT
  u.id,
  COALESCE(
    NULLIF(trim(u.raw_user_meta_data ->> 'full_name'), ''),
    NULLIF(trim(u.raw_user_meta_data ->> 'name'), ''),
    NULLIF(split_part(COALESCE(u.email, ''), '@', 1), '')
  )
FROM auth.users u
ON CONFLICT (user_id) DO NOTHING;