# Visão técnica da base existente

O princípio de separação entre infraestrutura reutilizável, projeto cliente, conteúdo e dados está em [`../ARCHITECTURE.md`](../ARCHITECTURE.md). Este documento registra detalhes técnicos verificados na base herdada; não afirma que a arquitetura final já foi implementada.

## Aplicação e rotas atuais

A aplicação usa Next.js App Router, React e TypeScript. `next.config.ts` habilita extensões `.ts`, `.tsx` e `.mdx`, rotas tipadas, formatos de imagem AVIF/WebP e redirects permanentes antigos de serviços. Não foi identificado backend separado. A API de contato é server-side dentro do Next.js.

As rotas existentes incluem início, contato, sobre, serviços e slugs, projetos e slugs, soluções e nichos, termos, política de privacidade, blog e slugs. Há também `POST /api/contato`, sitemap e robots. Esse conjunto reflete a base herdada e não o mapa público final.

## Fluxo de contato herdado

O formulário envia JSON para `/api/contato`. O handler verifica tamanho e tipo de conteúdo, interpreta JSON, trata honeypot, aplica limite e deduplicação em memória e chama validação/sanitização em `lib/leads/schema.ts`. `LeadService` prepara o registro e `LeadRepository` insere na tabela `leads` via cliente Supabase server-side. Depois, o endpoint tenta notificar um webhook opcional.

Os limites e deduplicação usam estruturas em memória no processo; não são compartilhados entre instâncias. O schema de validação e a constraint da migration divergem em um dos valores permitidos de serviço. O fluxo exige decisão antes de reaproveitamento.

## Banco e segurança observados

Há uma migration que cria `public.leads`, constraints e índices e habilita RLS, sem declarar policies. O estado remoto não foi verificado; não presumir que a migration foi aplicada ou que RLS/policies estejam configuradas no projeto hospedado.

`lib/supabase/server.ts` importa `server-only` e utiliza `SUPABASE_SECRET_KEY`. O webhook recebe configuração por variáveis server-side, restringe o protocolo a HTTPS salvo localhost, não segue redirects e configura timeout. O código auditado não contém Auth de usuários da aplicação nem Storage do CMS.

## Integrações

O código contém Supabase para persistência de leads, webhook HTTP configurável e Google Analytics condicionado a `NEXT_PUBLIC_GA_MEASUREMENT_ID`. A configuração efetiva de qualquer ambiente não é verificável neste checkout. Não foi identificado provedor dedicado de e-mail/CRM.

## Decisões

Não há ADRs históricos; não é possível inferir a motivação histórica das escolhas. Decisões arquiteturais futuras devem seguir [`../decisions/README.md`](../decisions/README.md).
