# Visão técnica da arquitetura

## Aplicação

O repositório contém um site institucional implementado com Next.js App Router, React e TypeScript. A configuração do Next habilita rotas `.ts`, `.tsx` e `.mdx`, rotas tipadas, formatos de imagem AVIF/WebP e redirecionamentos permanentes para URLs legadas de serviços.

Não foi identificado um backend separado. A API de contato é uma rota server-side dentro da aplicação Next.js.

## Organização

| Caminho | Responsabilidade observada |
| --- | --- |
| `app/` | Rotas, layouts, páginas, handlers de API, metadados e estilos globais. |
| `components/` | Componentes de layout, interface, seções, animação, analytics e SEO. |
| `config/` | Configuração compartilhada de navegação e dados do site. |
| `content/` | Artigos MDX e dados de projetos e serviços. |
| `lib/` | SEO, conteúdo MDX, validação e fluxo de leads, Supabase e utilitários. |
| `types/` | Tipos de domínio para artigos, projetos e serviços. |
| `public/` | Imagens e ícones estáticos. |
| `supabase/migrations/` | Migrações SQL versionadas. |

## Rotas observadas

- Grupo de marketing: início, contato, sobre, serviços e serviços por slug, projetos e projetos por slug, soluções e soluções por nicho, política de privacidade e termos de uso.
- Blog: índice e páginas por slug, com conteúdo MDX.
- API: `POST /api/contato`.
- Metadados de descoberta: handlers de sitemap e robots.

## Fluxo de contato

1. O formulário envia JSON para `/api/contato`.
2. A rota aplica limite de tamanho, valida `Content-Type`, aceita e interpreta JSON, responde ao honeypot e limita tentativas/duplicatas em memória.
3. `lib/leads/schema.ts` valida e sanitiza campos e consentimento.
4. `LeadService` constrói o registro e `LeadRepository` insere na tabela `leads` via Supabase.
5. A rota tenta enviar a submissão para o webhook configurado. A configuração é opcional e uma falha de notificação não desfaz a persistência.

As janelas de rate limit e deduplicação usam `Map`/`Set` no processo. Elas são voláteis e locais à instância; não oferecem coordenação distribuída.

## Banco de dados

O repositório contém uma migração que cria `public.leads`, campos e constraints de validação, índices por e-mail e data de criação, e habilita Row Level Security. Não foi verificada policy de acesso na migração nem foi possível confirmar a configuração efetiva do banco hospedado. Não presumir que uma migração local já foi aplicada remotamente.

Mudanças no schema devem ser adicionadas como novas migrações ordenadas, preservando o histórico existente. Antes de alterar acesso a dados, inspecione RLS, policies e o uso do segredo server-side.

## Segurança e configuração

- `lib/supabase/server.ts` importa `server-only` e usa `SUPABASE_SECRET_KEY`; manter esse módulo fora de código client-side.
- `NEXT_PUBLIC_SUPABASE_URL` é pública por convenção de ambiente; a chave secreta e o token do webhook não são.
- `CONTACT_WEBHOOK_URL` aceita HTTPS, com HTTP limitado a localhost; o request desativa redirects e tem timeout.
- O endpoint de contato impõe limite de corpo e valida/sanitiza entrada antes de persistir.
- Não foi identificada autenticação de usuários nas rotas auditadas.

## Serviços externos e operação

Integrações identificadas no código: Supabase para leads, webhook HTTP configurável para notificação e Google Analytics condicionado a `NEXT_PUBLIC_GA_MEASUREMENT_ID`. Não se identificou provedor de e-mail/CRM dedicado.

O checkout não contém configuração identificável de CI/CD ou do provedor de deploy. Ambientes, secrets implantados, estado remoto de migrations e URL publicada não são verificáveis nesta documentação local.

## Decisões arquiteturais

Os arquivos atuais permitem descrever a arquitetura, mas não comprovam o contexto histórico ou alternativas consideradas para as escolhas existentes. Por isso, nenhum ADR retroativo foi criado. Decisões futuras significativas devem seguir [`../decisions/README.md`](../decisions/README.md).
