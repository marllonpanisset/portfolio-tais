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

Na estrutura atual, `components/ui/` e utilitários em `lib/` são os candidatos mais claros ao CORE. A infraestrutura Next.js e suas configurações técnicas também são compartilhadas. Ainda não há um diretório ou pacote CORE separado; não foi necessário criar uma camada nova nesta fase.

## Projeto cliente

O projeto cliente é responsável por identidade, tema, marca, navegação, conteúdo, categorias, projetos/trabalhos, páginas, contatos e configuração editorial.

Atualmente, `config/client-site.ts` e `config/client-navigation.ts` identificam explicitamente a configuração específica do site. Seus valores ainda são herdados da Conjuga, enquanto páginas e conteúdo em `app/` e `content/` também mantêm referências à marca anterior. Esses dados são provisórios e precisam ser substituídos com informações aprovadas durante a adaptação do site público. Integrações antigas permanecem enquanto têm consumidores.

## Estrutura atual do repositório

| Caminho | Responsabilidade verificada |
| --- | --- |
| `app/` | Rotas App Router, layouts, API, estilos, sitemap e robots. |
| `components/` | Componentes UI, layout, seções, motion, analytics e SEO. |
| `config/` | Configuração específica do site cliente (`client-site.ts`, `client-navigation.ts`). |
| `content/` | Dados TypeScript de serviços/projetos e artigo MDX. |
| `lib/` | Utilitários, SEO, MDX, contato, leads e cliente Supabase server-side. |
| `types/` | Tipos atuais para serviços, projetos e artigos; inclui a forma inicial do domínio de portfólio em `portfolio.ts`. |
| `supabase/migrations/` | Migração SQL atual para a tabela `leads`. |
| `public/` | Ativos estáticos atuais. |
| `docs/` | Documentação técnica, contrato CMS, prompts e histórico/arquivo. |

Esta é a estrutura existente, não uma afirmação de que todos esses módulos permanecerão no projeto final.

O domínio TypeScript em `types/portfolio.ts` descreve categorias, projetos, mídia, ordem e status de publicação como tipos, sem persistência ou CRUD. `types/service.ts` e `types/case-study.ts` continuam atendendo as rotas herdadas.

## Componentes e dependências nesta fundação

- `components/ui/*`, wrappers de layout, SEO e os componentes de motion ainda usados são candidatos ao CORE; não foram redesenhados.
- Header, MobileNav, Footer e seções de serviços/projetos continuam ligados à navegação e ao conteúdo herdados, portanto são componentes cliente/provisórios.
- Componentes sem consumidores (`FeatureGrid`, `TestimonialBlock`, `FAQAccordion`, `StatsBlock`, `SlideIn`, `StaggerGroup`, `RevealOnScroll`) foram removidos junto de suas exportações.
- Nenhuma dependência foi removida ou atualizada. Supabase continua usado por leads; MDX por rotas/conteúdo atuais; Framer Motion e `@next/third-parties` por motion e analytics.

`config/client-site.ts` e `config/client-navigation.ts` deixam explícita a fronteira de configuração cliente. Seus valores ainda não são os dados aprovados de Taís. Analytics, webhook e Supabase permanecem provisórios enquanto seus consumidores existirem; a decisão de destino é posterior.

## Evolução

O portfolio-tais será usado para consolidar padrões que possam ser reutilizados em projetos futuros. Criar abstrações compartilhadas somente quando houver necessidade real e evidência de reutilização. A arquitetura CMS documentada em [CMS](CMS.md) é um contrato inicial, não uma descrição de funcionalidade implementada.
