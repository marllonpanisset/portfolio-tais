# Estado atual do projeto

Última verificação documental: 2026-10-14 (HEAD `50870dd`). Baseado no código do checkout. Informações externas são identificadas como não verificáveis localmente.

## Projeto e migração

O repositório contém o portfólio de Taís, originado de base técnica reutilizável da Conjuga e agora com CMS próprio implementado sobre Supabase. A estratégia propõe um CORE reutilizável, mas a separação de código em pacotes ou diretórios CORE/cliente ainda não foi implementada.

`config/client-site.ts` e `config/client-navigation.ts` identificam a configuração de cliente, ajustada ao portfólio (nome "Taís", navegação HOME/BIOGRAFIA/PORTFÓLIO/CONTATO). `types/database.ts` espelha o schema Supabase e `types/portfolio.ts` mantém os tipos de domínio. Home, biografia, portfólio, contato, detalhe de trabalho, navegação, metadata, SEO estrutural, sitemap e robots leem exclusivamente conteúdo publicado no CMS; sem registro publicado ou com payload inválido, rendem estados vazios honestos, sem fallback demonstrativo. Biografia e contatos não contêm dados inventados. Crédito à Conjuga permanece no rodapé público (`components/layout/Footer.tsx`) e marca Conjuga na tela de login do admin (`app/admin/login/LoginForm.tsx`), aguardando decisão com material aprovado.

## Stack observada

- Node.js `24.x` declarado em `package.json`.
- Next.js 16 App Router (`typedRoutes: true`, `pageExtensions: ["ts", "tsx"]`), React 19 e TypeScript 5.
- Tailwind CSS 4, Framer Motion 11, Lucide e Simple Icons.
- Supabase (`@supabase/ssr`, `@supabase/supabase-js`) em uso pelo CMS: clientes server/browser, Auth, RLS e Storage.
- Sem MDX: nenhuma dependência, nenhum arquivo `*.mdx`, nenhum diretório `content/`.

## Implementação atual

- Rotas públicas: `/`, `/biografia`, `/portfolio`, `/contato` e `/trabalhos/[slug]`, além de sitemap e robots gerados do CMS. A página `/contato` é informativa e não tem formulário. Não há rotas de API, rotas legais herdadas, blog ou redirects legados.
- Rotas administrativas em `app/admin/`: `/admin/login` (email + senha via `signInWithPassword`), `/admin` (dashboard), `/admin/projetos` (CRUD + mídia por projeto), `/admin/paginas` (edição por template + publicação + seleção do portfólio), `/admin/configuracoes` (links globais) e `/admin/logout`. `proxy.ts` protege `/admin/:path*` com sessão Supabase e RPC `is_site_owner()`.
- CMS: templates `home`, `biography`, `contact`, `global` e `portfolio` (`lib/cms/content-types.ts`); validação em `lib/cms/content-validation.ts` e `lib/cms/media.ts`; tabelas `projects`, `categories`, `project_categories`, `media`, `pages`, `portfolio_projects`, `site_settings`, `profiles`, `sites` e `memberships`; função `is_site_owner()`; bucket `project-media` (upload de até 10 MB nos tipos jpeg/png/webp/gif/avif, vídeo via YouTube, URLs assinadas de 1 h).
- Componentes em `components/`, configuração em `config/`, lógica em `lib/`, tipos em `types/` e 19 migrations SQL em `supabase/migrations/`.
- Fluxo de leads herdado removido por completo: sem formulário, endpoint, serviço ou migration de `leads` no checkout. Sem analytics ou consentimento no layout.
- `contact_messages` e seção `/mensagens` não existem; mídia é gerenciada por projeto, sem seção `/midia` própria.

## Configuração e limites conhecidos

As variáveis lidas pelo código são `NEXT_PUBLIC_SITE_URL` (opcional, com fallback `http://localhost:3000`), `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (exigidas; a ausência lança erro em `lib/supabase/*` e `proxy.ts`). `SUPABASE_SECRET_KEY` consta em `.env.example` mas não é lida pelo código da aplicação; `TEST_EMAIL`/`TEST_PASSWORD` constam em `.env.local` sem leitura no código. Valores e ambientes não foram verificados; domínio de produção não foi informado.

`supabase/.temp/` contém metadados locais do CLI (não inspecionados; podem conter dados sensíveis). A presença de migrations e de metadados locais não confirma projeto remoto, aplicação de migrations, bucket, policies ou usuário owner. Estado remoto desconhecido.

## Verificações registradas

Histórico: na auditoria inicial, lint e `npx tsc --noEmit` terminaram sem erros. Na fundação, lint e typecheck passaram após regenerar os tipos de rota com `npx next typegen`. Em 2026-09-27, os ajustes da galeria pública passaram em lint, `npx tsc --noEmit` e `git diff --check`, após regenerar os tipos de rota. Não há script `test`. O build da etapa pública anterior permaneceu sem saída após iniciar compilação, sem processo Node ativo visível, e foi interrompido; resultado inconclusivo. Não há navegador instalado no ambiente para capturas visuais de viewports.

Em 2026-10-14, a auditoria documental alinhou `README.md`, `docs/ARCHITECTURE.md`, `docs/project-state.md`, `docs/CMS.md`, `docs/development/setup.md` e `.env.example` ao HEAD `50870dd`. Resultados de lint, typecheck e build desta etapa estão registrados na entrega da auditoria; `docs/architecture/overview.md` e `docs/CMS-FRONTEND-MAP.md` seguem descrevendo a base pré-CMS e aguardam etapa própria.

## Git e operação

Branch `main` (HEAD `50870dd`); remotes observados `origin` (portfolio-tais) e `upstream` (conjuga-core), sem alteração nesta etapa. Sem tags e sem CI (sem `.github/workflows`). O diretório `.vercel/` local não comprova deploy. Estado de produção, secrets, migrations remotas e domínio ativo desconhecidos. Sem commit, push ou deploy.
