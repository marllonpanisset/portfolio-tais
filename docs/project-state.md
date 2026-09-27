# Estado atual do projeto

Última verificação documental: 2026-09-26. Baseado na auditoria da migração e no checkout disponível nesta etapa. Informações externas são identificadas como não verificáveis localmente.

## Projeto e migração

O repositório contém a base técnica clonada do site institucional Conjuga e está sendo adaptado para `portfolio-tais`. A estratégia propõe um CORE reutilizável, mas a separação de código em pacotes ou diretórios CORE/cliente ainda não foi implementada. O site público continua em sua forma herdada; CMS e administração estão em planejamento.

Na fundação, os módulos `config/client-site.ts` e `config/client-navigation.ts` passaram a identificar configuração de cliente; seus valores ainda são herdados e provisórios. O nome do pacote foi alinhado para `portfolio-tais`. Foi adicionado o modelo TypeScript inicial de portfólio (`types/portfolio.ts`) e removidos componentes sem consumidores diretos (`FeatureGrid`, `TestimonialBlock`, `FAQAccordion`, `StatsBlock`, `SlideIn`, `StaggerGroup` e `RevealOnScroll`). Conteúdo Conjuga permanece nas rotas existentes e aguarda a adaptação pública.

## Stack observada

- Node.js `24.x` declarado em `package.json`.
- Next.js 16 App Router, React 19 e TypeScript 5.
- Tailwind CSS 4, Framer Motion 11 e Lucide.
- MDX configurado e usado pelo conteúdo editorial atual.
- Supabase JS usado server-side para persistência de leads.

## Implementação atual

- Rotas herdadas de marketing, contato, serviços, projetos, soluções, políticas legais e blog; handlers de sitemap, robots e API `POST /api/contato`.
- Componentes em `components/`, configuração em `config/`, conteúdo em `content/`, lógica em `lib/`, tipos em `types/` e migração em `supabase/migrations/`.
- O formulário valida e sanitiza dados, mantém limites/deduplicação em memória, insere lead no Supabase e tenta notificação via webhook opcional.
- Analytics e consentimento de cookies têm implementação frontend.
- Uma migração cria `public.leads`, constraints, índices e habilita RLS. Ela não declara policies.
- Não foi identificada implementação de CMS, Dashboard, autenticação de usuários da aplicação ou Storage do CMS.

As rotas e conteúdos atuais ainda refletem a Conjuga. O mapa público pretendido e os modelos editoriais futuros estão em [`prompts/00-MIGRATION-STRATEGY.md`](prompts/00-MIGRATION-STRATEGY.md), como direção, não comportamento implementado.

## Configuração e limites conhecidos

As referências de ambiente encontradas são `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SECRET_KEY`, `CONTACT_WEBHOOK_URL`, `CONTACT_WEBHOOK_TOKEN` e `NEXT_PUBLIC_GA_MEASUREMENT_ID`. Os valores e ambientes em que possam estar configurados não foram verificados. Não foi encontrado `.env.example`.

A validação da aplicação aceita uma opção de serviço que não está na constraint SQL correspondente; o fluxo de leads herdado precisa de decisão antes de reutilização. Os controles em memória não coordenam instâncias. A presença de RLS na migration não confirma configuração remota nem policies hospedadas.

## Verificações registradas

Na auditoria inicial, lint e `npx tsc --noEmit` terminaram sem erros. Nesta fundação, lint e `npx tsc --noEmit` passaram após a renomeação dos módulos de configuração. `git diff --check` também passou. Não há script `test`. O build não foi executado nesta fase; a última tentativa anterior ficou inconclusiva, sem saída após iniciar a compilação, e foi interrompida.

## Git e operação

Na auditoria inicial, a branch verificada era `main`, com remote `origin` apontando para o repositório `portfolio-tais`; o checkout estava limpo. Não foram identificadas tags de release, CI/CD nem configuração de provedor de deploy. Estado de produção, secrets, migrations remotas e domínio ativo são desconhecidos.
