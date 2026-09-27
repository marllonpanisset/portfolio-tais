# Arquitetura

## Princípio

```text
CONJUGA CORE
      ↓
PROJETO CLIENTE
      ↓
CONTEÚDO / DADOS
```

O CORE concentra infraestrutura e comportamento técnico reutilizável. Cada projeto cliente mantém sua identidade, configuração editorial, conteúdo e dados próprios. O CORE não deve conhecer a identidade específica de Taís; o projeto cliente não deve duplicar infraestrutura que pertença ao CORE.

## CORE

São candidatos a responsabilidades reutilizáveis, quando houver necessidade comprovada:

- UI primitives e layout primitives;
- utilitários e validação;
- SEO genérico;
- motion quando reutilizável;
- abstrações de dados;
- infraestrutura Supabase;
- Auth, Storage e CMS;
- testes.

Auth, Storage para conteúdo e CMS ainda não estão implementados neste repositório. O Supabase existente é usado pelo fluxo de leads atual.

## Projeto cliente

O projeto cliente é responsável por identidade, tema, marca, navegação, conteúdo, categorias, projetos/trabalhos, páginas, contatos e configuração editorial.

## Estrutura atual do repositório

| Caminho | Responsabilidade verificada |
| --- | --- |
| `app/` | Rotas App Router, layouts, API, estilos, sitemap e robots. |
| `components/` | Componentes UI, layout, seções, motion, analytics e SEO. |
| `config/` | Configuração atual do site e navegação. |
| `content/` | Dados TypeScript de serviços/projetos e artigo MDX. |
| `lib/` | Utilitários, SEO, MDX, contato, leads e cliente Supabase server-side. |
| `types/` | Tipos atuais para serviços, projetos e artigos. |
| `supabase/migrations/` | Migração SQL atual para a tabela `leads`. |
| `public/` | Ativos estáticos atuais. |
| `docs/` | Documentação técnica, contrato CMS, prompts e histórico/arquivo. |

Esta é a estrutura existente, não uma afirmação de que todos esses módulos permanecerão no projeto final.

## Evolução

O portfolio-tais será usado para consolidar padrões que possam ser reutilizados em projetos futuros. Criar abstrações compartilhadas somente quando houver necessidade real e evidência de reutilização. A arquitetura CMS documentada em [CMS](CMS.md) é um contrato inicial, não uma descrição de funcionalidade implementada.
