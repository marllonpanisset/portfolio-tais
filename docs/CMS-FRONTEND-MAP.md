# CMS ↔ Frontend Map

Auditoria do código disponível em 2026-10-01. Este documento descreve o frontend implementado e propõe a ligação futura com o CMS. A proposta não representa comportamento já implantado. O site público existente é a referência visual; a integração deverá fornecer conteúdo aos componentes atuais sem criar uma segunda implementação de layout.

## Home

### Estrutura atual

`app/(marketing)/page.tsx` monta `PageWrapper` e `Container`, imprime uma linha de identificação da galeria e renderiza `PortfolioGallery`. A Home não consulta a tabela `pages`, `projects`, `categories` ou `media`.

### Conteúdo atual

- Metadata: título `Home` e descrição que identifica o portfólio como demonstrativo.
- Linha acima da galeria: `GALERIA DEMONSTRATIVA · IMAGENS TEMPORÁRIAS`.
- `content/portfolio.ts` declara 12 projetos demonstrativos, todos com status estático `published`, ordenados pelo campo `order`.
- Cada projeto tem título, slug, categoria, ano, descrição, três imagens externas `picsum.photos`, texto de `alt`, legenda e ordem. Textos de projeto e legendas usam Lorem ipsum. Esses valores não são conteúdo aprovado para publicação.
- `components/portfolio/PortfolioGallery.tsx` mostra uma miniatura por projeto: a primeira mídia cujo `kind` é `image`. A ordem da parede vem dos projetos filtrados e ordenados por `getPublishedPortfolioProjects()`; não há uma ordenação global de imagens entre projetos.
- Ao abrir um item, o modal mostra a primeira imagem do projeto, o título, categoria, ano, descrição e um link para `/trabalhos/[slug]`. O modal atual não apresenta as outras imagens nem vídeos do projeto.
- O modal abre por botão, bloqueia o scroll do `body`, move o foco para Fechar, fecha por Escape, clique no backdrop ou botão, contém o ciclo de Tab nos elementos focáveis e devolve foco ao botão de origem.
- Há animação CSS de hover nas miniaturas: escala até `1.015`, leve redução de opacidade, duração de 300 ms e easing `ease-out`. Não há navegação anterior/próxima no modal.
- Responsividade: grade com 2 colunas no mobile, 3 a partir de `sm` e 4 a partir de `md`; gaps também aumentam por breakpoint. O modal ocupa até `max-w-6xl`, passa a duas colunas em `md`, e usa imagem 4:3 com `object-contain`.
- O tipo aceita vídeo, mas os 36 itens gerados atualmente são imagens. Não há vídeo na Home atual.

### Arquivos e componentes

- Rota e metadata: `app/(marketing)/page.tsx`.
- Dados demonstrativos e categorias: `content/portfolio.ts`.
- Parede, modal e comportamento de foco: `components/portfolio/PortfolioGallery.tsx`.
- Estrutura externa: `components/layout/PageWrapper.tsx`, `components/ui/Container.tsx`.
- Estilos globais, fontes e redução de movimento: `app/globals.css`, `app/layout.tsx`.

### Classificação e migração futura

- **CONTENT:** título/identificador editorial da galeria se aprovado; projetos, categorias, imagens, textos alternativos, legendas e ordenação. Os dados atuais são temporários e precisam ser substituídos por conteúdo aprovado antes da publicação.
- **CMS EXISTENTE:** projetos, categorias, mídias por projeto e ordenação já têm modelos em `projects`, `categories`, `project_categories` e `media`. `projects.is_featured` existe, mas a Home estática não o usa; hoje apresenta todos os projetos publicados do conjunto estático.
- **LAYOUT:** a grade, breakpoints, proporção/corte da miniatura, modal, foco/teclado, bloqueio de scroll, tipografia, espaçamentos e hover permanecem em código.
- **SHARED COMPONENT:** `PortfolioGallery` é o componente visual específico que deve continuar responsável pela parede e modal. Para alimentar o CMS, sua fonte de dados deverá ser desacoplada de `content/portfolio.ts`; o visual e o comportamento não devem ser duplicados.
- **Limite do modelo atual:** `media.project_id` só associa mídia a projeto. Não existe associação de mídia geral a página. A foto de biografia é um arquivo em `public/perfil.jpg`; não há no modelo atual um campo de página que permita o CMS gerenciar essa imagem.

## Biografia

### Estrutura atual

`app/(marketing)/biografia/page.tsx` usa uma seção com `Container`, um rótulo, uma grade de foto e texto, seguida por outra faixa de texto separada por borda. A grade muda de uma coluna para duas em `md`; a imagem mantém proporção quadrada e limite de largura.

### Conteúdo atual

- Metadata: título `Biografia` e descrição indicando conteúdo demonstrativo.
- Título principal vem de `siteConfig.author.name` (`Taís`).
- Retrato: `/perfil.jpg`, com texto alternativo derivado do nome.
- Há um parágrafo de introdução, dois parágrafos no corpo e dois parágrafos na área `MAIS SOBRE`; todos são Lorem ipsum.
- Não há título/cargo profissional, créditos, lista de funções ou links sociais nesta página.

### Arquivos e componentes

- Rota e conteúdo textual: `app/(marketing)/biografia/page.tsx`.
- Nome/identidade configurada: `config/client-site.ts`.
- Retrato: `public/perfil.jpg`.
- Layout: `components/ui/Container.tsx`, `components/ui/Heading.tsx`, `components/layout/PageWrapper.tsx`; imagem por `next/image`.

### Classificação e migração futura

- **CONTENT:** nome exibido, rótulos, título, textos e texto alternativo; o retrato só deve ser editável após definir como páginas se relacionam a imagens aprovadas.
- **LAYOUT:** grade, proporção e enquadramento da foto, tamanhos responsivos, colunas, bordas, hierarquia tipográfica e espaçamento.
- **CMS EXISTENTE:** não há entidade biográfica nem mídia de página. A linha `pages` com slug `biografia` é atualmente rascunho e tem `content: { sections: [] }`; não alimenta a rota pública.
- **SHARED COMPONENT:** `Container`, `Heading` e `PageWrapper`; `Image` do Next é usado diretamente.
- **Pendência editorial:** os textos atuais são placeholders, não biografia aprovada. Nenhum texto biográfico deve ser publicado a partir deles.

## Portfólio

### Estrutura atual

`app/(marketing)/portfolio/page.tsx` obtém os projetos publicados do módulo estático. Apresenta um rótulo, título `Portfólio` e lista vertical de cards alternados. Em telas médias cada item usa uma grade de 12 colunas; a imagem ocupa 8 colunas e o texto 4, alternando a posição a cada item. Em telas menores, imagem e texto ficam empilhados.

Não há filtros interativos na página atual. A categoria é uma etiqueta informativa em cada card, não um controle de filtro.

### Conteúdo atual

- Metadata e rótulo descrevem uma seleção demonstrativa.
- Os cards exibem primeira imagem disponível, título, categoria, ano e descrição; imagem e título levam ao detalhe do trabalho.
- A fonte é `content/portfolio.ts`, com 12 itens fictícios, duas categorias demonstrativas e URLs externas `picsum.photos`; não é o CMS.

### Arquivos e componentes

- Rota, cards e links: `app/(marketing)/portfolio/page.tsx`.
- Dados e helpers: `content/portfolio.ts`.
- Estrutura compartilhada: `Container`, `Heading`, `PageWrapper`; imagens/links usam `next/image` e `next/link` diretamente.

### Classificação e migração futura

- **CONTENT:** título/descrição introdutórios aprovados, projetos, categorias, metadados das imagens e ordem.
- **CMS EXISTENTE:** projetos e mídias estão cobertos pelas tabelas próprias; categorias ligam-se a projetos por `project_categories` (relação muitos-para-muitos). As queries públicas existem, mas esta rota ainda não as chama.
- **LAYOUT:** lista alternada, proporção 4:3, recorte, colunas, espaços, hover e breakpoints.
- **SHARED COMPONENT:** a rota deve continuar usando o layout existente. A parede da Home (`PortfolioGallery`) é outro padrão visual; não deve ser substituída por uma segunda galeria genérica.
- **Diferença de dados:** o tipo estático `PortfolioProject` possui um único `categoryId`; o CMS permite várias categorias por projeto. Uma adaptação futura deve decidir como exibir múltiplas categorias sem alterar silenciosamente o design aprovado.
- A linha `pages` com slug `portfolio` está sem conteúdo e não controla a rota.

## Contato

### Estrutura atual

`app/(marketing)/contato/page.tsx` renderiza uma seção de altura mínima, um título grande e uma área informativa com borda superior. A estrutura responde em uma coluna no mobile e em duas colunas a partir de `md`.

### Conteúdo atual

- Metadata informa que os contatos estão em preparação.
- O título é `Vamos conversar?`.
- O texto informa que os canais ainda aguardam confirmação.
- Há um link interno para `/biografia` com o rótulo `Conhecer a biografia`.
- Não há e-mail, telefone, cidade, área, funções, redes sociais, endereço nem formulário.

### Arquivos e componentes

- Conteúdo e layout da rota: `app/(marketing)/contato/page.tsx`.
- Componentes: `Container`, `Heading`, `PageWrapper` e `Link` do Next.
- A navegação geral vem de `config/client-navigation.ts` e é usada pelo header, menu mobile e footer.

### Classificação e migração futura

- **CONTENT:** introdução e link/CTA aprovado. Dados de contato só podem ser adicionados após confirmação; não há valores para migrar hoje.
- **LAYOUT:** título, seção, altura, grade, bordas, tipografia e espaçamento.
- **CMS EXISTENTE:** não há campos de contato em `pages`, `projects`, `categories` ou `media`. `pages` tem somente título, slug, JSON, publicação e timestamps.
- **SHARED COMPONENT:** `Container`, `Heading`, `PageWrapper`; links e estrutura sem componente específico de contato.

## Trabalhos

### Estrutura atual

`app/(marketing)/trabalhos/[slug]/page.tsx` é uma rota dinâmica com dois caminhos de dados. Primeiro tenta carregar um projeto publicado do CMS pelo slug; se não encontra dados, procura o mesmo slug no conjunto estático. Se nenhum caminho encontra projeto, chama `notFound()`.

O layout usa `PageWrapper` e `Container`; mostra rótulo, título, ano e descrição, uma lista de mídias e link de retorno a `/portfolio`. Não há navegação para trabalho anterior/próximo, nem seção de trabalhos relacionados.

### Conteúdo atual

- **Caminho CMS:** título, ano e descrição vêm de `projects`; mídias vêm de `media`, ordenadas por `sort_order` e `created_at`. Imagens com `storage_path` geram URL pública do bucket `project-media`; outros itens usam `external_url`. Vídeos são renderizados como iframe YouTube a partir do ID obtido por `parseYouTubeUrl`. `caption` e `alt` são usados quando existentes.
- No caminho CMS, categorias não são consultadas nem exibidas, embora exista a relação `project_categories` e helper para consultá-la. Se a query de mídia retornar erro, a rota continua com a lista vazia via `data ?? []`.
- **Caminho estático:** título, descrição, ano, categoria e três imagens vêm de `content/portfolio.ts`; mídia é ordenada por `order`. O renderer usa `<video controls>` para itens `kind: "video"`, embora os dados estáticos atuais só tenham imagens.
- O detalhe CMS e o detalhe estático têm marcações/elementos levemente diferentes (por exemplo, categoria e rótulo demonstrativo só aparecem no caminho estático). Ambos mantêm a moldura visual geral do detalhe.

### Arquivos e componentes

- Rota, metadata dinâmica, adaptação de linhas CMS a mídia visual, fallback e apresentação: `app/(marketing)/trabalhos/[slug]/page.tsx`.
- Dados de fallback: `content/portfolio.ts`.
- Consultas: `lib/cms/queries.ts` (`getPublishedProjectBySlug`, `getProjectMedia`); parser: `lib/cms/media.ts`.
- URL do bucket e nome `project-media` são montados na própria rota; `lib/cms/storage.ts` contém helper de URL separado para uso server-side.
- Layout compartilhado: `Container`, `PageWrapper`; renderizadores de imagem, iframe e vídeo são inline na rota, não componentes compartilhados.

### Classificação e migração futura

- **CONTENT / CMS EXISTENTE:** título, slug, descrição, ano, estado de publicação, ordem, categorias e mídias pertencem ao modelo `projects`/`categories`/`project_categories`/`media`. Caption/alt e ordem vivem em `media`.
- **LAYOUT:** proporção de imagem, espaçamento vertical, largura do texto, estilos do título, player, captions e botão de retorno ficam em código.
- **SHARED COMPONENT:** `Container` e `PageWrapper`; ainda não existe um renderer compartilhado para mídia CMS/estática ou para a sequência de mídia do trabalho.
- **Diferença de mídia:** `media` distingue `kind` e `source`. No caminho atual CMS, tudo que não é `image` vira embed YouTube; upload de vídeo não é suportado pelo bucket atual, que aceita tipos de imagem. O domínio estático aceita `<video>` local. É preciso definir essa diferença antes de unificar comportamento.
- A query `getProjectCategories` existe e é usada pelo admin, mas não nesta rota pública.

## Shared Renderer

### Estado atual

Não há hoje um renderer compartilhado de `pages.content`. `PageEditor.tsx` renderiza sua própria estrutura `sections → columns → blocks` e placeholders. O frontend público usa layouts específicos por rota. `PortfolioGallery` concentra seus próprios dados estáticos e a interação do modal. As rotas públicas de trabalhos têm duas implementações de apresentação para dados CMS e fallback estático.

Há componentes visuais reutilizáveis: `PageWrapper`, `Container`, `Heading`, `Text`, `Section`, `Grid`, `Card`, `Button`, `Tag`, `Badge` e `Divider`. As páginas auditadas usam principalmente `PageWrapper`, `Container` e `Heading`; outros componentes do design system existem, mas não são a base visual da galeria/modal atual.

`app/layout.tsx` fornece Header, Footer, fontes locais Space Grotesk, Inter e JetBrains Mono, `MotionProvider` e metadata global. A animação visível da Home é CSS de hover; `MotionProvider` não implica, por si só, que as páginas auditadas tenham animações Framer Motion. `app/globals.css` define tokens e `prefers-reduced-motion`.

### Proposta

1. Resolver a rota no servidor e buscar o `PageRow` publicado pelo slug mapeado. A Home usa o caminho `/` e hoje a seed tem slug `home`, portanto o mapeamento `home → /` deve ser explícito. Slugs `biografia`, `portfolio` e `contato` coincidem com as rotas atuais.
2. Validar/normalizar `PageRow.content` num contrato discriminado e construir modelos visuais a partir dos dados CMS. O renderer não deve chamar Supabase diretamente nem conhecer credenciais.
3. Criar um `PageRenderer` de servidor que encaminhe cada tipo semântico de seção para componentes existentes, preservando classes, breakpoints e interações. Para a parede, o adapter fornece projetos publicados e mídia associada; o componente de apresentação mantém o comportamento atual da `PortfolioGallery`.
4. No futuro, o editor poderá passar seu estado local ao mesmo `PageRenderer` e fornecer dados de referência carregados no servidor. O editor não deve desenhar uma versão visual paralela. Campos de seleção/estrutura podem ser específicos do editor, mas a apresentação final deve vir dos mesmos componentes.
5. A página de portfólio e a página de detalhe são coleções/entidades do CMS, não cópias dos dados de projeto dentro do JSON de `pages`. Os blocos de listagem referenciam uma fonte de projetos; detalhes são resolvidos pela rota `[slug]`.

Fallbacks devem preservar as rotas e o site atual enquanto a migração não tiver aprovação editorial e validação de correspondência visual. A ativação pública do JSON de `pages` deve ocorrer em etapa própria; nenhuma rota pública o consome atualmente.

## PageBuilderContent

### Avaliação da estrutura atual

O formato `sections → columns → blocks` implementado em `lib/cms/page-builder.ts` é estruturalmente simples, mas ainda não representa os padrões reais deste frontend:

- A Home é uma coleção derivada de projetos com parede de imagens e modal ligado ao projeto. Um `image`/`gallery` genérico não descreve a origem nos projetos, a regra de primeira imagem, os metadados mostrados ou o destino do link.
- Biografia e contato são composições com campos próprios, textos longos, retrato ou dados de contato; não são colunas de blocos livres.
- Portfólio é uma lista de entidades `projects`; não é conteúdo de projeto duplicado dentro de blocos.
- Detalhe do trabalho deriva conteúdo de `projects`, categorias e `media`, com tipos de mídia e ordenação próprios.
- Larguras livres/colunas permitem reconstruir arbitrariamente uma página e podem divergir da composição responsiva aprovada.

Portanto, não se recomenda expandir o modelo atual como editor genérico. A tabela `pages.content` aceita JSONB, mas os registros seedados continuam vazios e não há renderer público usando o formato. O contrato atual de placeholders não possui campos de conteúdo nem referências a entidades CMS.

### Proposta de contrato orientado às páginas reais

Usar `schemaVersion` e `template` discriminados, e seções semânticas de opções limitadas. Os renderers dessas seções devem encapsular o layout existente; os valores editáveis ficam no JSON e referências a projetos/mídias não duplicam os registros.

Exemplo ilustrativo sem conteúdo editorial inventado:

```json
{
  "schemaVersion": 1,
  "template": "home",
  "sections": [
    {
      "id": "home-project-wall",
      "type": "project-wall",
      "source": {
        "entity": "projects",
        "filter": "published",
        "orderBy": "sort_order"
      }
    }
  ]
}
```

Tipos previstos como proposta — ainda não implementados:

- `home`: `project-wall`, que recebe projetos e mídias resolvidos pelo CMS e delega ao mesmo componente visual da galeria/modal.
- `biography`: composição perfil tipada com rótulo, título, imagem aprovada/referência, introdução e parágrafos; preserva o layout de duas áreas existente.
- `portfolio`: `project-list` que consulta `projects` publicados e categorias, preservando a lista alternada atual; não inventa filtros, pois a página atual não os tem.
- `contact`: composição tipada com título, introdução e campos opcionais de contato/links. Só deve receber valores depois de aprovação; hoje esses dados não existem.

Essas formas semânticas são templates/componentes de domínio, não elementos de layout livre. O schema definitivo deve ser validado com o frontend antes de ser implementado. Campos comuns de SEO podem ser definidos após uma decisão de produto: o schema de `pages` atualmente não tem colunas SEO dedicadas.

## Relation to current CMS

### Entidades existentes

- **`pages`:** `id`, `title`, `slug`, `content` JSONB, `is_published`, timestamps. `content` default é `{ "sections": [] }`. A seed cria Home (`home`), Biografia (`biografia`), Portfólio (`portfolio`) e Contato (`contato`) como não publicadas, todas com seções vazias. A migration declara políticas de leitura pública para publicadas e leitura/escrita para usuários autenticados. Estado remoto não foi verificado nesta auditoria.
- **`projects`:** `title`, `slug`, `description`, `year`, `is_published`, `is_featured`, `sort_order`. É fonte de projetos e rota de detalhe; não deve ser copiada para `pages.content`.
- **`categories`:** `name`, `slug`, `sort_order`, `is_active`. A associação é muitos-para-muitos via `project_categories`, diferente do `categoryId` singular do tipo estático.
- **`media`:** cada linha pertence obrigatoriamente a um `project_id`; registra `kind` (`image`/`video`), `source` (`upload`/`youtube`), `external_url`, `storage_path`, `thumbnail_path`, `alt`, `caption` e `sort_order`. O bucket público `project-media` foi configurado para imagens. Não há relação direta com `pages` nem suporte de upload de vídeo no bucket observado.

```text
pages.content ── descreve a composição semântica da página
                     │ referências/fonte, não cópias de projetos
                     ▼
projects ──< project_categories >── categories
    │
    └──< media (ordenada por sort_order e created_at)
```

### Uso público atual

- Home e Portfólio seguem consumindo `content/portfolio.ts`; ainda não chamam queries CMS.
- Detalhe `/trabalhos/[slug]` consulta primeiro `projects` publicados e `media`, com fallback para conteúdo estático. Na ramificação CMS, a categoria não é consultada/exibida.
- `listPublishedPages()` e `getPublishedPageBySlug()` existem em `lib/cms/queries.ts`, mas a auditoria de usos não encontrou chamada pública para páginas.
- A fotografia de biografia e quaisquer futuros arquivos específicos de página não têm vínculo natural com o `media` atual, que exige um projeto. A estratégia de mídia de página requer decisão futura; esta auditoria não propõe migration.

Em resumo, `pages` deve guardar composição/editorial da página, enquanto `projects`, `categories` e `media` continuam sendo fonte normalizada de portfólio. A integração deve manter o design em código e usar referências/resolvedores para alimentar os mesmos componentes.
