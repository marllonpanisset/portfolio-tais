# Visão técnica da base existente

O princípio de separação entre infraestrutura reutilizável, projeto cliente, conteúdo e dados está em [`../ARCHITECTURE.md`](../ARCHITECTURE.md). Este documento registra detalhes técnicos verificados na base herdada; não afirma que a arquitetura final já foi implementada.

## Aplicação e rotas atuais

A aplicação usa Next.js App Router, React e TypeScript. `next.config.ts` habilita extensões `.ts`, `.tsx` e `.mdx`, rotas tipadas, formatos de imagem AVIF/WebP e redirects permanentes antigos de serviços. Não foi identificado backend separado. A API de contato é server-side dentro do Next.js.

As rotas existentes incluem início, contato, sobre, serviços e slugs, projetos e slugs, soluções e nichos, termos, política de privacidade, blog e slugs, sitemap e robots. A página `/contato` atual é informativa; o endpoint `POST /api/contato` foi removido junto com o formulário de leads herdado.

## Formulário e persistência de leads

O formulário, endpoint, validação, serviço, repositório e notificação por webhook do fluxo herdado foram removidos do código da aplicação. A migration `supabase/migrations/20260728213159_create_leads.sql` permanece no repositório sem ser aplicada ou consumida pelo portfolio atual.

## Banco e segurança observados

Há uma migration que cria `public.leads`, constraints e índices e habilita RLS, sem declarar policies. O estado remoto não foi verificado; não presumir que a migration foi aplicada ou que RLS/policies estejam configuradas no projeto hospedado.

`lib/supabase/server.ts` importa `server-only` e mantém a configuração do cliente para integrações futuras. O portfolio atual não usa o cliente para persistência. O código auditado não contém Auth de usuários da aplicação nem Storage do CMS.

## Integrações

O código mantém o cliente Supabase para uso futuro. A configuração efetiva de qualquer ambiente não é verificável neste checkout. Não foi identificado provedor dedicado de e-mail/CRM.

## Decisões

Não há ADRs históricos; não é possível inferir a motivação histórica das escolhas. Decisões arquiteturais futuras devem seguir [`../decisions/README.md`](../decisions/README.md).

## Fundação de portfólio

`types/portfolio.ts` define tipos iniciais para categorias, projetos, mídia, ordenação e status `draft`/`published`. São tipos de domínio sem persistência. Os tipos herdados de serviços, estudos de caso e blog permanecem porque as rotas atuais ainda os importam.

Componentes sem consumidores diretos foram removidos dos diretórios `components/sections/` e `components/motion/`, junto com suas exportações dos barrels. Os módulos de configuração foram renomeados para `config/client-site.ts` e `config/client-navigation.ts` para indicar a responsabilidade de cliente; os valores ainda são herdados e provisórios. Conteúdo e integrações herdadas permanecem enquanto houver consumidores; a adaptação pertence às etapas do site público/limpeza.
