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

Auth, Storage e CMS estão implementados neste repositório sobre Supabase: sessão e autorização no `proxy.ts` (rotas `/admin/:path*` + RPC `is_site_owner`), clientes server/browser em `lib/supabase/`, painel em `app/admin/`, consultas e validação em `lib/cms/` e 19 migrations versionadas em `supabase/migrations/`. Não há fluxo de leads: nenhum formulário, endpoint, serviço ou migration de `leads` existe no checkout.

Na estrutura atual, `components/ui/` e utilitários em `lib/` são os candidatos mais claros ao CORE. A infraestrutura Next.js e suas configurações técnicas também são compartilhadas. Ainda não há um diretório ou pacote CORE separado; não foi necessário criar uma camada nova nesta fase.

## Projeto cliente

O projeto cliente é responsável por identidade, tema, marca, navegação, conteúdo, categorias, projetos/trabalhos, páginas, contatos e configuração editorial.

`config/client-site.ts` e `config/client-navigation.ts` identificam explicitamente a configuração específica do site, já ajustada ao portfólio de Taís (nome, título, descrição, `locale: "pt-BR"`, navegação HOME/BIOGRAFIA/PORTFÓLIO/CONTATO). Resquícios da marca anterior permanecem no código: crédito "Desenvolvido por: CONJUGA" no rodapé público (`components/layout/Footer.tsx`) e painel de marca na tela de login do admin (`app/admin/login/LoginForm.tsx`). Esses pontos aguardam decisão com material aprovado.

## Estrutura atual do repositório

| Caminho | Responsabilidade verificada |
| --- | --- |
| `app/` | Rotas App Router (`(marketing)/`, `admin/`), layouts, sitemap e robots gerados do CMS, estilos e fontes. Não há rotas de API. |
| `components/` | Componentes de biografia, contato, portfólio, layout, UI, SEO, motion e social. Não há providers de analytics. |
| `config/` | Configuração específica do site cliente (`client-site.ts`, `client-navigation.ts`). |
| `lib/` | CMS (`cms/`), clientes Supabase (`supabase/`), fontes de conteúdo da Home/portfólio, SEO, URLs de mídia e utilitários. Não há MDX, leads ou serviços de contato. |
| `types/` | `database.ts` (espelho do schema Supabase) e `portfolio.ts` (tipos de domínio). |
| `supabase/migrations/` | 19 migrations SQL versionadas: fundação do CMS, bucket `project-media`, tabelas de páginas/seleção/configurações, fundação de identidade e autorização por `is_site_owner`. |
| `public/` | Ativos estáticos (favicons, `perfil.jpg`). |
| `docs/` | Documentação técnica, estado do projeto, mapa CMS↔frontend, prompts e histórico/arquivo. |
| `proxy.ts` | Sessão Supabase e autorização das rotas `/admin/:path*`. |

Não há diretório `content/` nem arquivos MDX no checkout.

Esta é a estrutura existente, não uma afirmação de que todos esses módulos permanecerão no projeto final.

As páginas públicas são `/`, `/biografia`, `/portfolio`, `/contato` e `/trabalhos/[slug]`, todas servidas exclusivamente de registros publicados no CMS, com estados vazios honestos quando o conteúdo não está publicado ou é inválido. Não há conteúdo demonstrativo em código, imagens externas temporárias, rotas legais herdadas, blog, serviços/soluções nem redirects legados no checkout. A página `/contato` é informativa e não tem formulário.

O conteúdo editorial vive nas tabelas `pages` (templates `home`, `biography`, `portfolio`, `contact`, `global`), `projects`, `categories`, `media`, `portfolio_projects` e `site_settings`, editadas pelo painel `/admin`. Os tipos de domínio em `types/portfolio.ts` descrevem categorias, projetos, mídia, ordem e status de publicação; `types/database.ts` espelha o schema com `Row`/`Insert`/`Update` por tabela.

## Componentes e dependências nesta fundação

- `components/ui/*`, wrappers de layout, SEO e os componentes de motion ainda usados são candidatos ao CORE; não foram redesenhados.
- Header, MobileNav e Footer seguem a navegação de `config/client-navigation.ts`; o Footer exibe a marca TAIS com crédito à Conjuga (ver seção Projeto cliente).
- As dependências do CMS são as do Supabase (`@supabase/ssr`, `@supabase/supabase-js`, CLI em devDependencies), além da base Next.js/React existente. Não há MDX, `@next/third-parties` ou provedor de analytics em `package.json`.

`config/client-site.ts` e `config/client-navigation.ts` identificam a configuração cliente, ajustada ao portfolio. A URL usa `NEXT_PUBLIC_SITE_URL` e recua para localhost durante desenvolvimento; domínio de produção não foi informado.

## Evolução

O portfolio-tais será usado para consolidar padrões que possam ser reutilizados em projetos futuros. Criar abstrações compartilhadas somente quando houver necessidade real e evidência de reutilização. O desenho inicial do CMS documentado em [CMS](CMS.md) convive agora com a implementação descrita acima; o contrato conceitual permanece como direção, e o comportamento implementado é a autoridade sobre o que já existe.
