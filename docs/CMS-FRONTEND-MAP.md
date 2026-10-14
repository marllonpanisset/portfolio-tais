# CMS ↔ Frontend Map

Auditoria original do código disponível em 2026-10-01, quando o frontend ainda era estático e a integração com o CMS estava por fazer. Revisão de 2026-10-14 (HEAD `50870dd`): a integração foi implementada — todas as rotas públicas consomem o CMS, `content/portfolio.ts` e os fallbacks demonstrativos foram removidos (sem `content/`, sem Lorem ipsum, sem `picsum.photos` no código). Afirmações da auditoria original que não descrevem mais o estado atual estão marcadas com **[histórico 2026-10-01]**.

Convenções mantidas da versão original: **CONTENT** (editável no painel), **LAYOUT** (fixo em código), **SHARED COMPONENT** (reutilização sem duplicar visual).

## Home

### Estrutura atual

`app/(marketing)/page.tsx` busca `getHomeContent()` (`lib/home-content-source.ts`) e renderiza `HomeRenderer`. A Home consulta a página CMS `home` (rótulo da galeria) e os projetos publicados com `is_featured`, com categorias e mídia resolvidas por projeto; imagens de Storage viram URLs assinadas via `getMediaUrl`. **[histórico 2026-10-01]**: a rota montava galeria estática de `content/portfolio.ts` e não consultava `pages`, `projects`, `categories` ou `media`.

### Conteúdo atual

- Metadata: título `Portfólio` e descrição do portfólio de Taís, com canônico `/`.
- Linha acima da galeria: `galleryLabel` editável no CMS (`saveHomeGalleryLabel`).
- Itens: somente projetos publicados e em destaque; sem registro, galeria vazia honesta (`Nenhum projeto em destaque no momento`); em falha de leitura, `Não foi possível carregar os projetos em destaque agora`.
- `components/portfolio/PortfolioGallery.tsx` (client): uma miniatura por projeto (primeira mídia `image`, ou thumbnail YouTube quando houver vídeo); grade 2 colunas no mobile, 3 em `sm`, 4 em `md`; hover com escala `1.015`, opacidade e `duration-300 ease-out`.
- Modal: acessível (foco em Fechar ao abrir, Escape, ciclo de Tab contido, devolução de foco ao botão de origem, bloqueio de scroll do `body`, fechamento por backdrop); `max-w-6xl`, duas colunas em `md`, imagens 4:3 `object-contain`; exibe **todas** as mídias do projeto (imagens + embeds YouTube com `parseYouTubeUrl`), `caption`/`alt`, título, categoria, ano, descrição e link `VER PROJETO → /trabalhos/[slug]`. **[histórico 2026-10-01]**: o modal mostrava só a primeira imagem e ignorava demais mídias/vídeos. Sem navegação anterior/próxima (inalterado).

### Arquivos e componentes

- Rota e metadata: `app/(marketing)/page.tsx`.
- Fonte CMS: `lib/home-content-source.ts` (`getHomeContent`, `getFeaturedHomeContent`), `lib/cms/queries.ts` (`getPublicHomePage`, `listFeaturedProjects`, `getProjectCategories`, `getProjectMedia`), `lib/home-media.ts`, `lib/home-content.ts`.
- Parede, modal e foco: `components/portfolio/PortfolioGallery.tsx`; moldura: `HomeRenderer.tsx`, `PageWrapper.tsx`, `Container.tsx`.
- Estilos, fontes e redução de movimento: `app/globals.css`, `app/layout.tsx`.

### Classificação atual

- **CONTENT:** rótulo da galeria; projetos, categorias, imagens, alts, legendas, ordem, destaque e publicação — tudo no CMS via `/admin/projetos` e `/admin/paginas`.
- **LAYOUT:** grade, breakpoints, proporção/corte, modal, foco/teclado, scroll, tipografia, espaçamentos e hover em código.
- **SHARED COMPONENT:** `PortfolioGallery` recebe `HomeGalleryItem[]` e é reutilizado sem duplicação; `HomeRenderer` aceita `asPreview` + `onGalleryLabelClick` para o editor do admin (`HomePageEditor.tsx`).

## Biografia

### Estrutura atual

`app/(marketing)/biografia/page.tsx` lê a página CMS publicada `biografia`, valida com `parseCmsPageContent("biography", ...)` e renderiza `BiographyView`. `profileImage` com caminho de Storage é resolvido via `getMediaUrl` (`isStoragePath`); URL externa é usada diretamente. Sem página publicada ou payload inválido, estado vazio honesto. **[histórico 2026-10-01]**: textos Lorem ipsum em código, retrato fixo `/perfil.jpg`, linha `pages/biografia` em rascunho sem alimentar a rota.

### Conteúdo atual

- Metadata: título `Biografia`, descrição e canônico `/biografia`.
- Campos CMS (`BiographyPageContent`): `publicName`, `profileImage`, `introduction`, `biography` (parágrafos separados por linha em branco), `about[]`.
- Layout: rótulo, grade foto+texto (1 coluna → 2 em `md`, foto quadrada até 520px), faixa `MAIS SOBRE` separada por borda. Sem cargo/títulos profissionais em código; sem links sociais nesta página.

### Arquivos e componentes

- Rota: `app/(marketing)/biografia/page.tsx`; view: `components/biography/BiographyView.tsx` (com `asPreview` para `BiographyPageEditor.tsx`).
- Upload da foto pelo painel (`uploadBiographyImage`, prefixo `pages/`, validação de tipo/tamanho); remoção best-effort da imagem anterior ao salvar.

### Classificação atual

- **CONTENT:** todos os textos e o retrato no CMS.
- **LAYOUT:** grade, proporção/enquadramento, responsivo, bordas, tipografia e espaçamento em código.
- **Pendência editorial:** publicar somente biografia aprovada; nada deve ser extraído de placeholders (não há mais placeholders no código).

## Portfólio

### Estrutura atual

`app/(marketing)/portfolio/page.tsx` lê em paralelo a página CMS `portfolio` (validada como template `portfolio`) e `getPortfolioProjects()` (seleção ordenada de `portfolio_projects` com projetos publicados). Renderiza `PortfolioView` (eyebrow/título/descrição do CMS) com `PortfolioFilters` (client: filtro por categoria + ordenação curadoria/recentes/antigos) sobre `PortfolioProjectList`. **[histórico 2026-10-01]**: dados de `content/portfolio.ts`, 12 itens fictícios, sem filtros interativos, categoria só como etiqueta.

### Conteúdo atual

- Metadata e textos introdutórios vêm do CMS; cards com imagem, título, categorias, ano e descrição, ligando a `/trabalhos/[slug]`.
- Múltiplas categorias por projeto suportadas (`categories[]`, primeira como exibição); ordenação da curadoria via `sort_order` de `portfolio_projects`, com reordenação no painel (`reorderPortfolioProjects`).

### Arquivos e componentes

- Rota: `app/(marketing)/portfolio/page.tsx`; fonte: `lib/portfolio-content-source.ts`.
- Views: `PortfolioView.tsx` (com `asPreview` para `PortfolioPageEditor.tsx`), `PortfolioFilters.tsx`, `PortfolioProjectList.tsx`.

### Classificação atual

- **CONTENT:** textos da página, seleção/ordem do portfólio, projetos, categorias e mídias no CMS.
- **LAYOUT:** lista, proporções, recorte, hover e breakpoints em código; sem segunda galeria genérica.

## Contato

### Estrutura atual

`app/(marketing)/contato/page.tsx` lê em paralelo a página CMS `contato` (template `contact`) e `getSiteSettings()`, renderizando `ContactView` com `content` + `settings`. Sem página publicada ou inválida, estado `Contato em breve`. **[histórico 2026-10-01]**: título `Vamos conversar?` fixo, texto de "canais em preparação", sem redes sociais.

### Conteúdo atual

- Campos CMS (`ContactPageContent`): `title`, `subtitle`, `informationText`; seção `Canais` com `SocialLinks` a partir de `site_settings`, ou mensagem de canais a confirmar quando vazios.
- Link interno `Conhecer a biografia → /biografia`. Sem e-mail, telefone, endereço ou formulário em código — e seguem sem existir.

### Arquivos e componentes

- Rota: `app/(marketing)/contato/page.tsx`; view: `components/contact/ContactView.tsx` (com `asPreview` para `ContactPageEditor.tsx`); links: `components/social/SocialLinks.tsx`.

### Classificação atual

- **CONTENT:** textos e canais no CMS (`pages` + `site_settings`).
- **LAYOUT:** título, seções, grade, bordas e tipografia em código.

## Trabalhos

### Estrutura atual

`app/(marketing)/trabalhos/[slug]/page.tsx` tem caminho único CMS: `getPublishedProjectBySlug` + `getProjectMedia`; slug desconhecido ou não publicado retorna `notFound()` — sem fallback estático. **[histórico 2026-10-01]**: dois caminhos (CMS + `content/portfolio.ts`) com marcações diferentes.

Layout com `PageWrapper`/`Container`: link `← VOLTAR AO PORTFÓLIO`, rótulo, título, ano, descrição e sequência de mídias com `caption`. Imagens de Storage usam URLs assinadas (`getMediaUrl`); demais itens usam `external_url`; tudo que não é `image` vira embed YouTube via `parseYouTubeUrl`. Categorias não são consultadas nem exibidas nesta rota (relação existe e é usada no admin e nas listagens). Sem trabalho anterior/próximo ou relacionados.

### Arquivos e componentes

- Rota, metadata dinâmica e apresentação: `app/(marketing)/trabalhos/[slug]/page.tsx`.
- Consultas: `getPublishedProjectBySlug`, `getProjectMedia`; parser: `parseYouTubeUrl`; URLs: `getMediaUrl`.
- Diferença de mídia resolvida: upload só de imagens no bucket; vídeo somente via YouTube — sem `<video>` local.

### Classificação atual

- **CONTENT:** título, slug, descrição, ano, publicação, ordem, categorias e mídias no modelo `projects`/`categories`/`project_categories`/`media`.
- **LAYOUT:** proporção, espaçamento, player, captions e retorno em código.

## Renderização compartilhada

Não existe `PageRenderer` genérico (nenhuma ocorrência no código). O padrão implementado é o inverso da proposta original: views tipadas por rota (`HomeRenderer`, `BiographyView`, `PortfolioView`, `ContactView`), todas com `asPreview`, reutilizadas pelos editores do admin para pré-visualização ao vivo (`HomePageEditor`, `BiographyPageEditor`, `PortfolioPageEditor`, `ContactPageEditor`). `PageEditor.tsx` permanece para o caminho genérico de `sections → columns → blocks`. Proposta original de resolver `PageRow` por slug + validar `content` em contrato discriminado: realizada via `getPublishedPageBySlug`/`getPublicHomePage` + `parseCmsPageContent` por template. Nenhuma rota pública consome JSON sem validação.

## PageBuilderContent

O formato `sections → columns → blocks` (`lib/cms/page-builder.ts`, com testes) segue existindo como estrutura genérica (tipos, larguras, normalização e validação). O contrato efetivo das páginas, porém, são os templates tipados (`lib/cms/content-types.ts` + `lib/cms/content-validation.ts`: `home`, `biography`, `contact`, `global`, `portfolio`), editados pelos editores dedicados do admin. A recomendação original se mantém e foi atendida na prática: páginas como composição semântica (parede de projetos com fonte em `projects`, perfil tipado, lista referenciando entidades) em vez de blocos livres duplicando dados. A seed criou as 4 páginas como rascunhos com `{"sections":[]}` (`20260930000002`); migrations posteriores (`20261001193323`, `20261003000000`) adaptaram os conteúdos aos templates; a publicação é o que ativa cada rota.

## Relação com o CMS atual

### Entidades existentes

- **`pages`:** `id`, `title`, `slug`, `content` JSON, `is_published`, timestamps. Leitura pública restrita a conteúdo publicado (inclusive a Home, que também precisa estar publicada); escrita do site owner. Estado remoto não verificado.
- **`projects`:** `title`, `slug`, `description`, `year`, `is_published`, `is_featured`, `sort_order`. Fonte da Home (destaques), do Portfólio (seleção) e do detalhe; nunca copiada para `pages.content`.
- **`categories`:** `name`, `slug`, `sort_order`, `is_active`; muitos-para-muitos via `project_categories`.
- **`media`:** obrigatoriamente ligada a `project_id`; `kind` (`image`/`video`), `source` (`upload`/`youtube`), `external_url`, `storage_path`, `thumbnail_path`, `alt`, `caption`, `sort_order`. Bucket `project-media` (10 MB, MIMEs de imagem); acesso por URLs assinadas (políticas evoluíram de leitura pública para o modelo de assinatura: `Public can sign published project media` + objetos gerenciados pelo owner). Sem relação direta com `pages` (imagem da biografia vive no JSON da página); sem upload de vídeo.
- **Seleção e globais:** `portfolio_projects` (curadoria ordenada do Portfólio), `site_settings` (6 chaves sociais), identidade/autorização em `profiles`/`sites`/`memberships` + `is_site_owner()`.

```text
pages.content ── composição semântica da página
                     │ referências/fonte, não cópias de projetos
                     ▼
projects ──< project_categories >── categories
    │
    └──< media (ordenada por sort_order e created_at)
```

### Uso público atual

- Home, Portfólio, Biografia, Contato e detalhe consomem exclusivamente queries CMS de conteúdo publicado; `listPublishedPages()` alimenta o sitemap. Nenhum fallback estático em nenhuma rota.
- `contact_messages` continua inexistente (tabela, migration e UI) — único item da lista original de candidatas ainda não implementado.
- Em resumo: `pages` guarda composição/editorial, `projects`/`categories`/`media` são a fonte normalizada do portfólio; design em código, dados por referência — conforme proposto em 2026-10-01 e agora implementado.
