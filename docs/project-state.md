# Estado atual do projeto

Última verificação documental: 2026-09-27. Baseado na auditoria da migração e no checkout disponível nesta etapa. Informações externas são identificadas como não verificáveis localmente.

## Projeto e migração

O repositório contém a base técnica clonada do site institucional Conjuga e está sendo adaptado para `portfolio-tais`. A estratégia propõe um CORE reutilizável, mas a separação de código em pacotes ou diretórios CORE/cliente ainda não foi implementada. O site público continua em sua forma herdada; CMS e administração estão em planejamento.

Na fundação, os módulos `config/client-site.ts` e `config/client-navigation.ts` passaram a identificar configuração de cliente; o nome do pacote foi alinhado para `portfolio-tais`. Foi adicionado `types/portfolio.ts` e removidos componentes sem consumidores diretos. A Home, biografia, contato, navegação, metadata, SEO estrutural, sitemap e tokens visuais foram adaptados ao portfolio. A Home exibe doze projetos demonstrativos com imagens temporárias de `picsum.photos`; `content/portfolio.ts` inclui três imagens por projeto para validar o detalhe. Substituir esses dados e URLs por material aprovado antes da publicação. Biografia e contatos seguem placeholders sem dados inventados. A paleta é preto e branco; nenhum ativo herdado de marca é usado pelo layout público.

## Stack observada

- Node.js `24.x` declarado em `package.json`.
- Next.js 16 App Router, React 19 e TypeScript 5.
- Tailwind CSS 4, Framer Motion 11 e Lucide.
- MDX configurado e usado pelo conteúdo editorial atual.
- Supabase JS e cliente server-side mantidos para integrações futuras; sem uso de persistência pelo portfolio atual.

## Implementação atual

- Rotas públicas principais para início, biografia, portfolio, contato e detalhe de trabalho, além de rotas legais herdadas. Rotas antigas de sobre, projetos, serviços, soluções e blog são redirecionadas. Permanecem handlers de sitemap e robots. A página `/contato` é informativa e não tem formulário.
- Componentes em `components/`, configuração em `config/`, conteúdo em `content/`, lógica em `lib/`, tipos em `types/` e migração em `supabase/migrations/`.
- O formulário, a API de contato e o fluxo de leads herdados foram removidos. A migration local de `public.leads` permanece no repositório, mas não é consumida pelo portfolio atual.
- Analytics e consentimento continuam como código legado, mas não são montados no layout público nesta fase. Destino final ainda não decidido.
- Rotas legadas de serviços, soluções, blog, sobre e projetos têm redirects para a experiência pública atual. Termos e política de privacidade continuam acessíveis com conteúdo Conjuga e exigem revisão própria antes da publicação.
- A migration herdada `supabase/migrations/20260728213159_create_leads.sql` declara `public.leads`, constraints, índices e RLS, sem policies. Ela não foi alterada nesta etapa; estado remoto e aplicação da migration não foram verificados.
- Não foi identificada implementação de CMS, Dashboard, autenticação de usuários da aplicação ou Storage do CMS.

O conteúdo demonstrativo do portfolio não contém clientes ou créditos, mas ainda usa títulos e anos de exemplo e imagens externas; não deve ser tratado como portfólio real. As rotas legais herdadas ainda contêm conteúdo Conjuga e requerem decisão antes de publicação. O CMS e a persistência do portfolio ainda não existem.

## Configuração e limites conhecidos

As referências de ambiente encontradas no código incluem `NEXT_PUBLIC_SITE_URL`, credenciais Supabase e ID Google Analytics. Valores e ambientes não foram verificados. A URL do site recua para `http://localhost:3000` se `NEXT_PUBLIC_SITE_URL` não estiver configurada; domínio de produção não foi informado. Não foi encontrado `.env.example`.

A migration local de leads registra um modelo herdado que não é usado pelo portfolio atual. A presença de RLS nela não confirma configuração remota nem policies hospedadas.

## Verificações registradas

Na auditoria inicial, lint e `npx tsc --noEmit` terminaram sem erros. Na fundação, lint e typecheck passaram após regenerar os tipos de rota com `npx next typegen`. Em 2026-09-27, os ajustes da galeria pública passaram em lint, `npx tsc --noEmit` e `git diff --check`, após regenerar os tipos de rota. Não há script `test`. O build da etapa pública anterior permaneceu sem saída após iniciar compilação, sem processo Node ativo visível, e foi interrompido; resultado inconclusivo. Não há navegador instalado no ambiente para capturar visualmente os viewports solicitados.

## Git e operação

Na auditoria inicial, a branch verificada era `main`, com remote `origin` apontando para o repositório `portfolio-tais`; o checkout estava limpo. Não foram identificadas tags de release, CI/CD nem configuração de provedor de deploy. Estado de produção, secrets, migrations remotas e domínio ativo são desconhecidos.
