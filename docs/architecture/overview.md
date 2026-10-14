# Visão técnica da base existente

O princípio de separação entre infraestrutura reutilizável, projeto cliente, conteúdo e dados está em [`../ARCHITECTURE.md`](../ARCHITECTURE.md). Este documento registra detalhes técnicos verificados no HEAD atual; trechos históricos da base pré-CMS foram substituídos ou marcados como tal.

## Aplicação e rotas atuais

A aplicação usa Next.js 16 App Router (`typedRoutes: true`, `pageExtensions: ["ts", "tsx"]`), React 19 e TypeScript 5. `next.config.ts` declara formatos de imagem AVIF/WebP e não contém redirects, rewrites ou headers. Não há backend separado nem rotas de API (`route.ts` inexistente). Não há MDX em dependências, arquivos ou configuração.

As rotas existentes são as públicas `/`, `/biografia`, `/portfolio`, `/contato` e `/trabalhos/[slug]`, as administrativas `/admin/*` e os handlers de sitemap e robots gerados do CMS. Não há rotas legais herdadas, blog, serviços, soluções ou sobre. A página `/contato` é informativa e não tem formulário.

## Formulário e persistência de leads

Histórico: o formulário, endpoint, validação e fluxo de leads herdados foram removidos do código. Estado atual: nenhuma migration de `leads` existe em `supabase/migrations/` (somente as 19 do CMS/identidade) e nenhum código de contato, serviço ou repositório de leads permanece. Não há analytics nem consentimento no layout.

## Banco e segurança observados

As 19 migrations versionadas criam `projects`, `categories`, `project_categories`, `media`, `pages`, `portfolio_projects`, `site_settings`, `profiles`, `sites` e `memberships`, além da função `is_site_owner()` e do bucket `project-media` (limite de 10 MB, tipos jpeg/png/webp/gif/avif). RLS restringe a leitura pública a conteúdo publicado e a escrita ao site owner (`memberships.role = 'owner'`, policies `Site owner manages *`). O acesso a objetos do Storage segue o modelo de URLs assinadas (`Public can sign published project media`, objetos gerenciados pelo owner).

`lib/supabase/server.ts` e `lib/supabase/client.ts` (`@supabase/ssr`) exigem `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. Auth de usuários é por email + senha (`signInWithPassword` em `/admin/login`); autorização do painel por `proxy.ts` (matcher `/admin/:path*`) + RPC `is_site_owner()`. O estado remoto não foi verificado; não presumir que migrations foram aplicadas ou que Auth/RLS/Storage estejam configurados no projeto hospedado.

## Integrações

O Supabase é a integração efetiva (Auth, Postgres/RLS, Storage). A configuração de qualquer ambiente remoto não é verificável neste checkout. Não foi identificado provedor dedicado de e-mail/CRM. Não há `contact_messages`: mensagens de contato não existem como entidade, rota ou UI.

## Layout e apresentação

`app/layout.tsx` monta Header, Footer, fontes locais (Space Grotesk, Inter, JetBrains Mono via `next/font/local`), `MotionProvider`, `JsonLd` e metadata global (título default/template, Open Graph, Twitter, robots indexável no público). As views públicas (`HomeRenderer`, `BiographyView`, `PortfolioView`, `ContactView`) aceitam `asPreview` e são reutilizadas pelos editores do admin para pré-visualização ao vivo. A parede da Home (`PortfolioGallery`) é client-side, com modal acessível (foco, Escape, Tab contido, bloqueio de scroll) e filtros interativos no Portfólio (`PortfolioFilters`: categoria + ordenação curadoria/recentes/antigos).

## Decisões

Não há ADRs históricos (`docs/decisions/` contém apenas o README de convenções); não é possível inferir a motivação histórica das escolhas. Decisões arquiteturais futuras devem seguir [`../decisions/README.md`](../decisions/README.md).

## Fundação de portfólio

`types/database.ts` espelha o schema Supabase (`Row`/`Insert`/`Update` por tabela, função `is_site_owner`) e `types/portfolio.ts` define os tipos de domínio (categorias, projetos, mídia, ordenação e status `draft`/`published`). Não há tipos herdados de serviços, estudos de caso ou blog. Os módulos de configuração são `config/client-site.ts` (identidade Taís, `locale: "pt-BR"`, URL com fallback localhost) e `config/client-navigation.ts` (HOME/BIOGRAFIA/PORTFÓLIO/CONTATO). Crédito à Conjuga permanece no rodapé público e marca na tela de login do admin, aguardando decisão com material aprovado. Conteúdo editorial não vive em código: sem `content/`, sem demonstrativos, sem Lorem ipsum.
