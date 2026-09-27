# 01 — AUDIT + CLEANUP PREPARATION

## Resultado da auditoria

Auditoria do checkout executada em 2026-09-26. Este documento registra o relatório produzido na etapa 01; não é uma especificação de implementação.

## Estado atual

Base Next.js App Router em TypeScript e React, com Tailwind, componentes UI, conteúdo TypeScript e MDX, SEO, motion, formulário de contato, Supabase para leads e analytics/consentimento. A base de páginas e conteúdo está fortemente vinculada ao Conjuga. CMS, Dashboard, Auth da aplicação e Storage do CMS não foram encontrados.

## Classificação

### Reutilizar

- Estrutura App Router, primitivas de UI, utilitários, configurações técnicas, tratamento de SEO genérico e padrões de layout que se mostrarem adequados.
- Tipos e componentes existentes apenas como referências; revisar equivalência semântica antes de reaproveitar.

### Adaptar

- Header, MobileNav, Footer, configuração do site, navegação, SEO, sitemap/robots, layout e contato.
- Fluxo de contato, API e lógica de leads somente após definir campos, persistência, consentimento e integrações do cliente.

### Substituir

- Tokens visuais e metadados de marca; páginas, textos, serviços, soluções, dados editoriais e sociais da Conjuga.
- Seções comerciais Conjuga e ativos públicos da marca depois de verificar sua origem e adequação.

### Remover — candidatos após análise de dependências

- Rotas de serviços, soluções, sobre, blog e termos que não constam no mapa futuro.
- Conteúdo de serviços e artigo MDX herdados, redirects antigos e componentes sem uso direto encontrado.
- Não remover nesta etapa; barrels e consumidores precisam ser conferidos.

### Preservar temporariamente

- `siteConfig.links`, usado pelo Footer e pela política de privacidade.
- Fluxo Supabase/leads e migration até decidir o destino de contato e persistência.
- Políticas legais e analytics/cookies até decidir requisitos de dados e publicação.
- Sitemap enquanto importar conteúdo herdado.

## Documentação herdada

- `AGENTS.md` e `README.md`: substituir/adaptar para CORE e portfolio-tais.
- `docs/01-BUSINESS.md`, `03-BRAND.md`, `04-WEBSITE.md`, `05-COPY.md`, `06-ROADMAP.md`: arquivar como documentos específicos da Conjuga.
- `docs/02-PRINCIPLES.md`: adaptar seletivamente para princípios técnicos reutilizáveis.
- `docs/project-state.md`, `docs/architecture/overview.md`, `docs/development/setup.md`, `docs/README.md`: adaptar ao estado verificado.
- Decisões, changelog e releases: manter convenções úteis, sem atribuir histórico não comprovado.

## Variáveis de ambiente

| Variável | Arquivo | Uso | Decisão na auditoria |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | `lib/supabase/server.ts` | Inicialização cliente Supabase server-side | INVESTIGAR |
| `SUPABASE_SECRET_KEY` | `lib/supabase/server.ts` | Credencial privilegiada server-side | INVESTIGAR |
| `CONTACT_WEBHOOK_URL` | `app/api/contato/contact-delivery.ts` | Destino opcional de notificação | ADAPTAR |
| `CONTACT_WEBHOOK_TOKEN` | `app/api/contato/contact-delivery.ts` | Token opcional do webhook | INVESTIGAR |

Valores de ambiente não foram verificados nem registrados.

## Supabase

- **CORE reutilizável:** padrão server-only e separação de repository podem servir de referência.
- **Específico/legado:** `lib/leads/*`, `lib/contact.ts`, `/api/contato` e migration de `public.leads`.
- **Redesenhar se mantido:** persistência de mensagens, modelo de conteúdo, Auth, Storage, RLS e permissões.
- A migration habilita RLS e não declara policies. Estado remoto desconhecido.
- A validação da aplicação aceita `nao-sei`; a constraint SQL não inclui esse valor.

## Rotas e componentes

Rotas existentes incluem início, contato, sobre, serviços e slugs, projetos e slugs, soluções e nichos, política de privacidade, termos, blog e slugs, `POST /api/contato`, sitemap e robots. Referência futura: `/`, `/biografia`, `/contato`, `/trabalhos/[slug]`; rotas administrativas não existem.

Primitivas em `components/ui/*` são candidatas a CORE. Header, MobileNav, Footer e ContactForm dependem de configuração/negócio atual. `ServiceCard`, `ProcessStep`, `DifferentialsSection`, `HomeHero`, `CTASection` são orientados à oferta Conjuga. `TestimonialBlock`, `StatsBlock`, `FeatureGrid`, `FAQAccordion`, `SlideIn`, `StaggerGroup` e `RevealOnScroll` não tinham consumidores diretos encontrados; conferir barrels antes de remover.

## Dependências

- **Core/site:** Next.js, React, TypeScript, Tailwind/PostCSS, ESLint, `clsx`, `tailwind-merge`, Lucide.
- **Site atual:** Framer Motion e `@next/third-parties` (Google Analytics).
- **Legado/editorial:** Supabase JS para leads; MDX, `gray-matter` e `reading-time` para o blog atual.
- Não foi comprovada dependência sem uso que deva ser removida nesta auditoria. CMS não está implementado.

## Git e checks

- Branch observada: `main`; remote `origin` apontava para `git@github.com:marllonpanisset/portfolio-tais.git`; checkout limpo antes da etapa documental.
- Commits observados: `a93818c9 .gitignore`, `6c1bc024 chore: initialize portfolio tais from conjuga base`, `0f5312cc first commit`.
- Nenhum `.env*`, CI/CD ou configuração de deploy foi identificado na árvore auditada; ambientes externos desconhecidos.
- Lint passou; `npx tsc --noEmit` passou; script de teste não existe.
- Build iniciou sem saída após “Creating an optimized production build” e foi interrompido; resultado inconclusivo.

## Riscos e ordem recomendada

Riscos: conteúdo e metadados ainda identificam Conjuga; integrações e dados de leads têm regras específicas; discrepância entre validação e constraint pode rejeitar inserções; política legal/analytics exigem decisão; ativos não tiveram titularidade confirmada; build permanece inconclusivo.

Sequência segura: aprovar limites CORE/cliente e documentos; decidir modelo público, contato, conteúdo e integrações; atualizar configuração e identidade com dados aprovados; adaptar páginas em blocos incluindo dependências; remover legado após confirmar que não há consumidores.

## Decisões a levar à estratégia

Definir forma de distribuição do CORE; limites da documentação compartilhada; modelo `Project/Work` e categorias; necessidade de listagem `/trabalhos`; persistência e política de contato; analytics/cookies e documentos legais; origem aprovada de identidade e ativos; validações e ambiente para obter build conclusivo.
