# Portfolio Taís

Portfólio profissional de Taís, implementado com Next.js App Router e CMS próprio sobre Supabase. O repositório partiu de uma base técnica reutilizável da Conjuga; a identidade do site vive em `config/` e o conteúdo editorial vive no banco via CMS — este README descreve somente o que está implementado no HEAD atual.

Não há biografia, contatos, trabalhos ou métricas inventados aqui. Conteúdo exibido sem registro publicado no CMS resulta em estados vazios honestos, não em dados demonstrativos.

## Stack real

Verificada em `package.json`, `next.config.ts` e no código:

- Next.js `16` (App Router, `typedRoutes: true`), React `19`, TypeScript `5`
- Tailwind CSS `4` (`@tailwindcss/postcss`, `postcss`), `clsx` + `tailwind-merge`
- Framer Motion `11`, `lucide-react`, `simple-icons`
- Supabase: `@supabase/ssr`, `@supabase/supabase-js` + CLI `supabase` (devDependency)
- Node.js `24.x` declarado em `engines`

Não há MDX: `pageExtensions` é `["ts", "tsx"]`, não existe diretório `content/`, nenhum arquivo `*.mdx` foi encontrado e não há dependência de MDX em `package.json`. Não há scripts `typecheck` ou `test` declarados.

Configuração Next verificável em `next.config.ts`: `pageExtensions: ["ts", "tsx"]`, `images.formats: ["image/avif", "image/webp"]`, `typedRoutes: true`.

## Funcionalidades

### Site público (`app/(marketing)/`)

Rotas implementadas:

- `/` — Home; lê a página CMS `home` + projetos publicados e marcados `is_featured`
- `/biografia` — lê a página CMS `biografia`
- `/portfolio` — lê a página CMS `portfolio` + seleção ordenada em `portfolio_projects`
- `/trabalhos/[slug]` — detalhe de projeto publicado (`is_published = true`); inexistente retorna `notFound`
- `/contato` — lê a página CMS `contato` + `site_settings` (links sociais)
- `/sitemap.xml` (`app/sitemap.ts`) — gerado apenas de páginas publicadas e projetos publicados selecionados para o portfólio
- `/robots.txt` (`app/robots.ts`) — libera `/`, bloqueia `/admin` e `/api`, aponta para o sitemap

Todas as rotas públicas leem somente conteúdo publicado via `lib/cms/queries.ts` e validam o JSON com `lib/cms/content-validation.ts`. Sem registro publicado ou com payload inválido, cada rota rende estado vazio (`"em breve"` / galeria vazia), sem fallback demonstrativo. Mídia de Storage é resolvida com URLs assinadas (`lib/cms/storage.ts` + `lib/media-url.ts`).

SEO implementado no código: metadata por rota, canônicos via `NEXT_PUBLIC_SITE_URL`, Open Graph, `components/seo/JsonLd.tsx`, `lib/seo.ts` e `lib/structured-data.ts`.

### CMS e administração (`app/admin/`, `lib/cms/`)

Área restrita em `/admin`, com `robots: { index: false, follow: false }`:

- `/admin/login` — formulário email + senha que chama `supabase.auth.signInWithPassword` (`app/admin/login/LoginForm.tsx`)
- `/admin` — dashboard autenticado (`app/admin/(painel)/page.tsx`)
- `/admin/projetos` — lista todos os projetos (inclui rascunhos), cria, edita e exclui via Server Actions (`ProjectForm.tsx`, `ProjectActions.tsx`, `actions.ts`); campos: título, slug, descrição, ano, `is_published`, `is_featured`, `sort_order`, categoria (cria categoria se inexistente)
- `/admin/projetos/[id]` — gerenciador de mídia do projeto (`MediaManager.tsx`, `media/actions.ts`): upload de imagem para o bucket `project-media` ou URL YouTube externa, com `alt`, `caption` e `sort_order`
- `/admin/paginas` — lista páginas (inclui rascunhos) com alternador de publicação (`PublishToggle.tsx`)
- `/admin/paginas/[id]` — editores por template: Home (`galleryLabel`), Biografia, Portfólio, Contato (`BiographyPageEditor.tsx`, `HomePageEditor.tsx`, `PortfolioPageEditor.tsx`, `ContactPageEditor.tsx`, `PageEditor.tsx`); inclui marcar/desmarcar destaque, adicionar/remover/reordenar seleção do portfólio (`addPortfolioProject`, `removePortfolioProject`, `reorderPortfolioProjects`) e upload da foto da biografia
- `/admin/configuracoes` — edita links globais (`SiteSettingsForm.tsx`, `actions.ts` com validação de URL http/https e `revalidatePath`)
- `/admin/logout` — saída (`LogoutButton.tsx`)

Templates de página suportados (`lib/cms/content-types.ts`): `home`, `biography`, `contact`, `global`, `portfolio`. Todas as mutações são Server Actions que conferem `auth.getClaims()` e aplicam `revalidatePath` nas rotas públicas afetadas.

## Supabase, autenticação e Storage

### Verificável localmente (código + migrations)

- Clientes Supabase em `lib/supabase/server.ts` (server) e `lib/supabase/client.ts` (browser), ambos via `@supabase/ssr` e ambos exigindo `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `proxy.ts` (matcher `/admin/:path*`): renova sessão via cookies, exige `auth.getClaims()` em `/admin/*` (exceto `/admin/login`), exige `supabase.rpc("is_site_owner") === true` para o painel e redireciona `/admin/login` conforme o papel
- Login por email + senha do Supabase Auth; autorização por função SQL `public.is_site_owner()` (definição em `supabase/migrations/20261008143145_generic_site_owner_authorization.sql`), que verifica `memberships.role = 'owner'`
- Schema declarado em `types/database.ts` e em 19 migrations versionadas em `supabase/migrations/`: `projects`, `categories`, `project_categories`, `media`, `pages`, `portfolio_projects`, `site_settings`, `profiles`, `sites`, `memberships` (+ enum `membership_role` e função `is_site_owner`)
- RLS: leitura pública restrita a conteúdo publicado (ex.: Home publicada, páginas/projetos/mídia publicados); escrita restrita ao site owner via policies `Site owner manages *`
- Storage (`lib/cms/storage.ts`, bucket `project-media` criado em `20260928000000_create_project_media_bucket.sql`): `uploadImage` / `removeImage` / `getMediaUrl` (URL assinada de 1 hora); validação em `lib/cms/media.ts`: máximo 10 MB, tipos `jpeg`, `png`, `webp`, `gif`, `avif`; vídeo via YouTube (`parseYouTubeUrl` aceita `watch`, `youtu.be`, `embed`, `shorts`, `/v/`)

### Depende de configuração remota (não verificado)

A existência de migrations e de nomes de variáveis no código não prova ambiente remoto funcionando. Não verificado neste HEAD:

- Projeto Supabase remoto, aplicação das 19 migrations, bucket `project-media` criado e policies ativas
- Usuário do Supabase Auth criado, linha em `sites` e `memberships` com `role = 'owner'` (bootstrap em `20261005140000_bootstrap_tais_site.sql` não confirmado em produção)
- Valores de ambiente no provedor de deploy, domínio público e DNS
- Conteúdo final publicado (páginas `home`/`biografia`/`portfolio`/`contato`, projetos, mídia e `site_settings`)

## Estrutura real de diretórios

Verificada no checkout (não existem `content/` nem arquivos MDX):

```text
app/            Rotas App Router: (marketing)/, admin/, layout, sitemap, robots, estilos, fontes
components/     biography/, contact/, portfolio/, layout/, ui/, seo/, motion/, social/
config/         client-site.ts, client-navigation.ts (identidade e navegação do cliente)
lib/            cms/ (queries, storage, media, content-types, validation, page-builder, site-settings),
                supabase/ (server.ts, client.ts), home-*, portfolio-*, seo, structured-data, media-url, utils
types/          database.ts (espelho do schema), portfolio.ts (tipos de domínio)
supabase/       migrations/ (19 migrations SQL versionadas)
public/         Ativos estáticos (favicons, perfil.jpg; images.jpg é arquivo local não rastreado)
docs/           Documentação do projeto (auxiliares auditados em etapa própria)
proxy.ts        Middleware de sessão/autorização de /admin
next.config.ts  pageExtensions ts/tsx, images avif/webp, typedRoutes
```

Identidade e navegação: `config/client-site.ts` (`name`, `title`, `description`, `url` via `NEXT_PUBLIC_SITE_URL` com fallback `http://localhost:3000`, `locale: "pt-BR"`) e `config/client-navigation.ts` (HOME `/`, BIOGRAFIA `/biografia`, PORTFÓLIO `/portfolio`, CONTATO `/contato`).

## Variáveis de ambiente (nomes apenas, sem valores)

| Variável | Uso no código |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Base absoluta de metadata, sitemap e URLs estruturadas; fallback `http://localhost:3000` |
| `NEXT_PUBLIC_SUPABASE_URL` | Inicialização dos clientes Supabase server/browser e do `proxy.ts` |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Chave pública exigida pelo código em `lib/supabase/*` e `proxy.ts` |
| `SUPABASE_SECRET_KEY` | Nome presente em `.env.example`; não é lido pelo código atual |
| `TEST_EMAIL` / `TEST_PASSWORD` | Nomes presentes em `.env.local`; sem leitura no código da aplicação |

Observação verificada: `.env.example` documenta `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, exigidas pelo código. `SUPABASE_SECRET_KEY` consta no exemplo mas não é lida pelo código da aplicação — sua manutenção ou remoção depende de confirmação operacional. Nunca registre valores ou secrets na documentação ou em commits.

## Instalação e execução local

Requer Node.js `24.x` e npm. Scripts existentes em `package.json`:

```bash
npm install
npm run dev      # servidor de desenvolvimento em http://localhost:3000
npm run build    # build de produção
npm start        # serve o build (precedido por npm run build)
npm run lint     # eslint .
npm run analyze  # next experimental-analyze
```

Sem as variáveis Supabase, `lib/supabase/server.ts` e `proxy.ts` lançam erro de variável ausente (as rotas públicas caem na boundary `app/error.tsx`; `/admin/*` falha no middleware). Com Supabase configurado mas sem conteúdo publicado ou com payload inválido, o site rende estados vazios honestos. Não há `npm test`; validação de tipos é via `npx tsc --noEmit`.

## Estado de publicação

Não afirmado: nenhum deploy, domínio ativo, migração remota aplicada ou usuário owner foi verificado nesta etapa. Existe um diretório `.vercel/` local, o que por si só não comprova deploy ou URL pública. O sitemap usa `NEXT_PUBLIC_SITE_URL` e recua para localhost sem essa variável.

## O que ainda depende de configuração, conteúdo ou validação

- Decidir sobre `SUPABASE_SECRET_KEY` em `.env.example` (não lida pelo código da aplicação; manter somente se algum fluxo operacional exigir, removendo em etapa própria após confirmação)
- Provisionar projeto Supabase, aplicar as 19 migrations, confirmar bucket, RLS e função `is_site_owner`
- Criar usuário Auth owner + registros `sites`/`memberships`; confirmar login e acesso ao painel em ambiente real
- Publicar páginas, projetos, seleção do portfólio, mídia final e os 6 links de `site_settings` (`instagram`, `youtube`, `linkedin`, `whatsapp`, `linktree`, `behance`)
- Substituir `public/perfil.jpg` e demais ativos por material aprovado, se aplicável
- Revalidar com `npm run lint`, `npx tsc --noEmit` e `npm run build`; executar `git diff --check`
- Manter os documentos auxiliares sincronizados com o código a cada mudança de comportamento (`docs/ARCHITECTURE.md`, `docs/project-state.md`, `docs/CMS.md`, `docs/development/setup.md`, `docs/architecture/overview.md` e `docs/CMS-FRONTEND-MAP.md` foram alinhados ao HEAD `50870dd` em 2026-10-14)
