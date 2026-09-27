# Estado atual do projeto

Última verificação: 2026-09-23.

Este registro descreve o que foi verificado no repositório. Informações que dependem de ambientes externos são marcadas como não verificáveis localmente.

## Versão e Git

- Versão declarada em `package.json`: `0.1.0`.
- Branch local verificada: `main`.
- A branch local `develop` não existe no checkout auditado. Branch principal de desenvolvimento/remota não configurada ou confirmada.
- Nenhuma tag Git de versão foi encontrada.
- A convenção futura de branches está em [`../AGENTS.md`](../AGENTS.md); sua adoção operacional ainda não está refletida em branches locais.

## Stack

- Node.js `24.x` (requisito declarado em `package.json`).
- Next.js `16` com App Router e React `19`.
- TypeScript `5`.
- Tailwind CSS `4` e Framer Motion `11`.
- MDX para artigos; conteúdo de projetos e serviços também está em módulos TypeScript.
- Supabase JS para persistência server-side de leads.

## Arquitetura e funcionalidades implementadas

- Site institucional em Next.js, com rotas de marketing para início, contato, sobre, serviços, projetos, soluções e políticas legais; há também listagem e páginas de artigos MDX.
- Componentes compartilhados em `components/`, conteúdo em `content/`, configurações em `config/` e utilitários de aplicação em `lib/`.
- Metadados e SEO são implementados nas rotas e utilitários; existem handlers de sitemap e robots.
- Formulário de contato envia dados para `POST /api/contato`. A rota valida/sanitiza os dados, aplica limites em memória, persiste leads via Supabase e tenta notificar um webhook opcional.
- A única migração presente cria `public.leads`, constraints, índices e habilita Row Level Security.
- Analytics e consentimento de cookies têm implementação no frontend. A presença de credenciais/configuração nos ambientes de execução não foi verificada.

Detalhes e limites: [`architecture/overview.md`](architecture/overview.md).

## Funcionalidades em desenvolvimento

Não há estado de tarefas ou indicação confiável de funcionalidades em desenvolvimento nos arquivos auditados. O roadmap estratégico não equivale a um backlog de implementação.

## Próximos passos e dívidas conhecidas

- Próximos passos técnicos não estão registrados como backlog neste repositório.
- Os controles de limite de requisições e duplicidade da rota de contato são armazenados em memória no processo; não constituem estado compartilhado entre múltiplas instâncias.
- Não há script de testes automatizados declarado em `package.json`.
- Não foram encontrados arquivos de CI/CD nem configuração de provedor de deploy na inspeção do repositório. O processo e estado do deploy são desconhecidos.
- Não há ADRs históricos no repositório. Não foi possível determinar com segurança o racional histórico das escolhas arquiteturais existentes.

## Integrações e autenticação

- Supabase é usado para inserir leads. A configuração depende de `NEXT_PUBLIC_SUPABASE_URL` e `SUPABASE_SECRET_KEY` no ambiente server-side.
- A notificação externa usa `CONTACT_WEBHOOK_URL` e opcionalmente `CONTACT_WEBHOOK_TOKEN`. Sem URL configurada, a notificação não é entregue; a rota ainda trata esse caso sem falhar a persistência do lead.
- O identificador `NEXT_PUBLIC_GA_MEASUREMENT_ID` é consultado pelo código de analytics; a configuração real do ambiente não foi confirmada.
- Não foi identificada autenticação de usuários da aplicação no código e nas rotas auditadas. O cliente Supabase server-side desativa persistência e renovação de sessão; isso não prova o estado de autenticação ou políticas no projeto Supabase hospedado.

## Deploy

Não verificável a partir do checkout local: provedor, ambientes publicados, pipeline, domínio ativo, execução das migrações remotas e versão atualmente implantada. Não inferir estado de produção a partir do código local.
