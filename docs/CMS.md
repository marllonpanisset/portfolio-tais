# CMS do portfólio

Este documento registra a direção conceitual do CMS e o estado implementado no HEAD atual. O comportamento implementado é a autoridade sobre o que já existe; a última seção lista o que permanece futuro.

## Área administrativa implementada

```text
/admin
    /login
    / (dashboard)
    /projetos
    /projetos/novo
    /projetos/[id]   (inclui gerenciador de mídia)
    /paginas
    /paginas/[id]    (editores por template)
    /configuracoes
    /logout
```

Acesso protegido por `proxy.ts`: sessão Supabase renovada por cookies + exigência de `supabase.rpc("is_site_owner") === true`. Login por email + senha via `supabase.auth.signInWithPassword` (`app/admin/login/LoginForm.tsx`). Rotas do painel com `robots: { index: false, follow: false }`.

Não existem seções `/midia` ou `/mensagens` próprias: mídia é gerenciada dentro de cada projeto (`app/admin/(painel)/projetos/[id]/MediaManager.tsx`, `media/actions.ts`).

## Responsabilidades

O CMS controla conteúdo, projetos, páginas, mídia, seleção do portfólio e configurações editoriais.

O código controla estrutura, layout, comportamento, componentes, validação, segurança e permissões.

> O código controla o design. O painel controla o conteúdo.

## Entidades e tabelas

Implementadas (migrations em `supabase/migrations/` + tipos em `types/database.ts`): `projects`, `categories`, `project_categories`, `media`, `pages`, `portfolio_projects` e `site_settings`, além de `profiles`, `sites` e `memberships` (identidade e autorização) com a função `is_site_owner()`.

`contact_messages` permanece candidata futura: não há tabela, migration ou UI de mensagens no checkout.

## Conteúdo e publicação

- Templates de `pages` (`lib/cms/content-types.ts`): `home`, `biography`, `contact`, `global` e `portfolio`, com validação em `lib/cms/content-validation.ts`.
- Rascunho/publicado via `is_published` (projetos e páginas); destaque da Home via `is_featured`; ordenação via `sort_order`; seleção ordenada do Portfólio via `portfolio_projects` (adicionar/remover/reordenar em `app/admin/(painel)/paginas/[id]/actions.ts`).
- Configurações globais: 6 chaves em `lib/cms/site-settings.ts` (`instagram`, `youtube`, `linkedin`, `whatsapp`, `linktree`, `behance`), editadas em `/admin/configuracoes` com validação de URL.
- Upload validado no servidor (`lib/cms/media.ts`: tipos jpeg/png/webp/gif/avif, máximo 10 MB), bucket `project-media`, URLs assinadas de 1 h (`lib/cms/storage.ts`); vídeo via YouTube (`parseYouTubeUrl`).
- Mutações via Server Actions que conferem `auth.getClaims()` e aplicam `revalidatePath` nas rotas públicas afetadas.

## Requisitos futuros

Mensagens de contato (`contact_messages` + seção de mensagens), preview de rascunho e quaisquer entidades além das implementadas exigem decisões próprias antes da implementação. Nenhuma rota, tabela, policy ou funcionalidade será criada com base apenas na lista de candidatas.
