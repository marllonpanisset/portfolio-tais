# 00 — MIGRATION STRATEGY

## Objetivo

Transformar o clone técnico do Conjuga em portfolio-tais sem carregar automaticamente identidade, conteúdo, regras de negócio ou integrações específicas do Conjuga.

Esta estratégia foi criada com base na auditoria executada em 01-AUDIT-CLEANUP.md.

O objetivo arquitetural é consolidar uma base reutilizável para futuros projetos Conjuga:

```text
CONJUGA CORE
    │
    ├── infraestrutura
    ├── UI
    ├── CMS
    ├── Auth
    ├── Media
    ├── Projects
    ├── Pages
    └── Contact
            │
            ├── portfolio-tais
            ├── cliente B
            ├── cliente C
            └── cliente D
```

A regra principal:

> O CORE controla infraestrutura e comportamento reutilizável. O projeto cliente controla identidade, conteúdo, categorias e configuração específica.

## 1. Estado inicial confirmado

A auditoria encontrou:

- Next.js App Router;
- TypeScript;
- React;
- Tailwind CSS;
- componentes UI reutilizáveis;
- infraestrutura de SEO;
- motion;
- conteúdo em TypeScript;
- conteúdo MDX;
- formulário de contato;
- Supabase utilizado atualmente para leads;
- analytics/cookies;
- site institucional fortemente ligado ao Conjuga;
- nenhum CMS;
- nenhum Dashboard;
- nenhuma implementação de Auth da aplicação;
- nenhum Storage do CMS.

O código técnico reutilizável deve ser preservado sempre que isso não obrigar o novo projeto a carregar regras do Conjuga.

## 2. Princípio de migração

Não fazer uma reescrita completa.

Aplicar:

```text
AUDITAR
   ↓
SEPARAR
   ↓
ADAPTAR
   ↓
SUBSTITUIR
   ↓
CONSTRUIR CORE
   ↓
CONSTRUIR CMS
   ↓
LIMPAR LEGADO
   ↓
VALIDAR
```

Evitar:

```text
apagar tudo
↓
reconstruir tudo
```

A base existente deve ser aproveitada onde tecnicamente fizer sentido.

## 3. Separação CORE × CLIENTE

### CORE

Deve concentrar código que possa ser reutilizado em outros projetos:

- configuração técnica;
- UI primitives;
- layout primitives;
- utilitários;
- validação;
- abstrações de dados;
- infraestrutura Supabase;
- Auth;
- Storage;
- Media;
- Projects;
- Pages;
- Contact;
- Dashboard;
- componentes administrativos;
- testes;
- padrões de segurança;
- padrões de navegação e SEO quando forem genéricos.

### CLIENTE

Deve concentrar:

- marca;
- identidade visual;
- logo;
- cores;
- tipografia;
- textos;
- imagens;
- vídeos;
- categorias;
- trabalhos;
- biografia;
- contatos;
- redes sociais;
- metadados;
- configuração editorial;
- páginas específicas.

Não criar abstrações genéricas prematuramente. Primeiro consolidar o modelo real usado por Taís e extrair o CORE onde houver evidência de reutilização.

## 4. Documentação herdada

A documentação atual do Conjuga não deve continuar como autoridade do novo projeto.

### Substituir

**AGENTS.md**

Deve passar a conter apenas regras realmente aplicáveis ao projeto e ao CORE.

**README.md**

Deve descrever o projeto real, comandos reais e arquitetura real.

### Arquivar/adaptar

Os documentos de negócio, marca, copy e roadmap do Conjuga não devem ser usados como especificação de Taís.

Classificação já estabelecida pela auditoria:

- `docs/01-BUSINESS.md` → arquivar;
- `docs/02-PRINCIPLES.md` → adaptar seletivamente;
- `docs/03-BRAND.md` → arquivar;
- `docs/04-WEBSITE.md` → arquivar;
- `docs/05-COPY.md` → arquivar;
- `docs/06-ROADMAP.md` → arquivar;
- `docs/project-state.md` → adaptar;
- `docs/architecture/overview.md` → adaptar;
- `docs/development/setup.md` → adaptar;
- `docs/README.md` → adaptar;
- documentação de decisões/changelog/release → manter e adaptar.

Não apagar esses documentos cegamente. Primeiro criar a nova documentação canônica e depois arquivar/remover o legado conforme a ordem de limpeza.

## 5. Site público alvo

O site de Taís terá:

```text
/
/biografia
/contato
/trabalhos/[slug]
```

A Home será o próprio portfólio.

Categorias:

- Arte e Educação
- Cinema / Pós-produção

O projeto atual `/projetos` e `/projetos/[slug]` será utilizado como referência técnica, mas o conceito público deverá ser adaptado para trabalhos.

A existência de uma página `/trabalhos` de listagem deve ser decidida durante a implementação do modelo de conteúdo. Não criar uma rota apenas por simetria.

## 6. Estrutura editorial

O modelo atual `CaseStudy` não deve ser assumido como modelo definitivo.

Primeiro definir um modelo de `Project`/`Work` que represente:

- título;
- slug;
- categoria;
- ano, quando aplicável;
- descrição;
- imagens;
- vídeos;
- créditos, quando aplicável;
- ordem;
- publicação;
- metadados necessários.

Categorias devem ser dados estruturados, não strings espalhadas pelo frontend.

O modelo deve permitir crescimento futuro sem depender de código para cadastrar cada trabalho.

## 7. CMS futuro

O CMS é parte central desta migração.

A intenção é criar uma estrutura reutilizável para futuros clientes.

Conceitualmente:

```text
/admin
    /projetos
    /paginas
    /midia
    /mensagens
    /configuracoes
```

Possível fluxo:

```text
Dashboard
   │
   ├── Projetos
   ├── Páginas
   ├── Mídia
   ├── Mensagens
   └── Configurações
```

O CMS deve controlar conteúdo.

O código deve controlar:

- estrutura;
- layout;
- comportamento;
- permissões;
- validação;
- segurança.

Regra:

> O código controla o design. O painel controla o conteúdo.

Não construir todas as telas administrativas antes de definir o modelo de dados.

## 8. Supabase

A implementação atual do Supabase é de leads e é específica do fluxo Conjuga.

Não tratá-la automaticamente como CMS.

A auditoria encontrou:

- `lib/leads/*`;
- `lib/contact.ts`;
- `app/api/contato/*`;
- migration `create_leads`;
- tabela `public.leads`;
- RLS habilitado;
- ausência de policies declaradas nessa migration;
- nenhuma implementação local de Auth/Storage do CMS.

Antes de reutilizar:

- decidir modelo de contato;
- decidir persistência de mensagens;
- decidir modelo de projetos;
- decidir mídia;
- definir Auth;
- definir Storage;
- definir RLS;
- definir permissões.

Não transportar a tabela `leads` para o CMS sem necessidade.

## 9. Contato

O fluxo atual de contato deve ser tratado como legado/adaptação.

A auditoria identificou uma inconsistência entre opções aceitas pela aplicação e a constraint SQL atual.

Portanto:

- não reutilizar o modelo de lead cegamente;
- definir os campos reais do contato de Taís;
- definir se mensagens serão persistidas;
- definir se haverá webhook;
- definir se haverá e-mail;
- definir retenção;
- definir consentimento;
- corrigir o modelo antes de implementar o novo fluxo.

## 10. Analytics, cookies e políticas

Analytics e consentimento estão atualmente integrados ao layout.

Não assumir que devem permanecer.

Antes de manter:

- decidir se haverá analytics;
- decidir qual ferramenta;
- revisar consentimento;
- revisar política de privacidade;
- revisar termos;
- adaptar o comportamento ao novo projeto.

Não copiar textos legais do Conjuga para Taís.

## 11. Conteúdo e identidade

Nunca inferir dados de Taís a partir do Conjuga.

Não inventar:

- biografia;
- e-mail;
- telefone;
- redes sociais;
- domínio;
- créditos;
- clientes;
- trabalhos;
- imagens;
- vídeos;
- textos.

Usar somente informações aprovadas/disponíveis.

Enquanto informações ainda não existirem, estruturar o sistema sem fabricar conteúdo.

## 12. Ativos

Os seguintes ativos precisam ser avaliados antes de remoção/substituição:

- `public/og-image.png`;
- favicon;
- ícones;
- fontes;
- imagens;
- tokens visuais;
- ativos da marca atual.

Não assumir titularidade ou reutilização de ativos apenas porque estão no repositório.

## 13. Componentes

### Prioridade: preservar como base

- `components/ui/*`;
- utilitários;
- wrappers;
- infraestrutura técnica genérica;
- SEO genérico;
- motion se necessário.

### Adaptar

- Header;
- MobileNav;
- Footer;
- ContactForm;
- SEO;
- sitemap;
- robots;
- layout.

### Substituir/remover progressivamente

Componentes diretamente ligados ao modelo empresarial Conjuga:

- `ServiceCard`;
- `ProcessStep`;
- `DifferentialsSection`;
- `HomeHero`;
- `CTASection`;
- seções comerciais;
- componentes de serviços;
- componentes de soluções.

Componentes sem uso encontrado devem ser removidos somente após verificar barrels/imports.

## 14. Rotas

Trabalhar em blocos.

### Bloco público principal

- Home
- Biografia
- Trabalhos
- Contato

### Legado

Revisar/remover:

- `/blog`
- `/servicos`
- `/solucoes`
- `/sobre`

`/sobre` pode servir como referência estrutural para `/biografia`.

Políticas legais devem ser tratadas separadamente, não removidas automaticamente.

## 15. Ordem de implementação

### FASE 1 — Documentação e contratos

Criar/substituir:

- `AGENTS.md`
- `README.md`
- `docs/ARCHITECTURE.md`
- `docs/CMS.md`

Definir claramente:

- CORE;
- cliente;
- convenções;
- limites;
- segurança;
- comandos;
- estrutura.

### FASE 2 — Fundação

Consolidar:

- configuração;
- aliases;
- UI primitives;
- utilitários;
- layout primitives;
- padrões de validação;
- tipos;
- estrutura de conteúdo;
- padrões de erro.

Não implementar CMS ainda.

### FASE 3 — Modelo de dados

Definir entidades necessárias para o CMS.

Começar pelo mínimo necessário:

- `projects`
- `categories`
- `pages`
- `media`
- `contact_messages`

Adicionar outras entidades somente quando justificadas.

Definir:

- IDs;
- slugs;
- timestamps;
- status;
- relacionamentos;
- ordenação;
- publicação;
- RLS;
- índices.

Não criar tabelas desnecessárias.

### FASE 4 — Supabase

Implementar:

- database;
- Auth;
- Storage;
- RLS;
- repositories;
- validação;
- tipos.

Tudo deve ser preparado para reutilização.

### FASE 5 — Admin/CMS

Implementar primeiro o shell:

- `/admin`

Depois:

- Projetos
- Páginas
- Mídia
- Mensagens
- Configurações

Prioridade:

```text
Projetos
↓
Mídia
↓
Páginas
↓
Mensagens
↓
Configurações
```

O CMS deve ser utilizável por alguém que não precise editar código.

### FASE 6 — Site público

Adaptar:

- Home
- Biografia
- Trabalhos
- Contato

Conectar o frontend ao CMS.

O conteúdo público deve ser originado do modelo definido para o projeto.

### FASE 7 — Limpeza

Somente depois que o novo fluxo estiver funcional:

- remover rotas antigas;
- remover componentes mortos;
- remover conteúdo Conjuga;
- remover integrações não utilizadas;
- remover dependências não utilizadas;
- remover redirects antigos;
- remover documentação legada;
- atualizar sitemap;
- atualizar SEO;
- revisar `public/`.

### FASE 8 — Polish

Somente depois da arquitetura funcional:

- tipografia;
- espaçamento;
- responsividade;
- animações;
- microinterações;
- acessibilidade;
- estados vazios;
- loading;
- erros;
- SEO;
- performance.

Não gastar tempo refinando visual antes de estabilizar estrutura e CMS.

## 16. Validação

Depois de cada grande fase:

```text
lint
typecheck
build
```

Quando testes forem adicionados:

```text
test
e2e
```

O estado inicial conhecido é:

- lint: passou;
- typecheck: passou;
- testes: não existe script;
- build: inconclusivo, pois ficou sem saída durante a compilação e precisou ser interrompido.

Não considerar o build como resolvido até uma execução posterior concluir.

## 17. Git

Manter commits pequenos e semanticamente claros.

Usar Conventional Commits.

Exemplos:

```text
docs: replace inherited project documentation
refactor: separate client configuration from core
feat: add project content model
feat: add cms project management
feat: add media management
refactor: remove legacy conjuga routes
```

Não reescrever histórico.

Não fazer commits gigantes que misturem:

- limpeza;
- banco;
- CMS;
- UI;
- conteúdo.

## 18. Segurança

Nunca:

- commitar secrets;
- expor service keys;
- colocar credenciais no client;
- confiar em autorização apenas no frontend;
- ignorar RLS;
- permitir upload sem validação;
- aceitar conteúdo sem validação server-side.

O futuro CMS deve tratar Auth + autorização + RLS como parte da arquitetura, não como acabamento.

## 19. Regra de execução dos próximos prompts

Cada prompt posterior deve:

- ler `AGENTS.md`;
- ler a documentação relevante;
- verificar o estado atual;
- trabalhar somente no escopo definido;
- não refazer trabalho já concluído;
- validar suas alterações;
- informar o que foi alterado;
- informar checks executados;
- parar.

Não implementar fases futuras antecipadamente.

## 20. Sequência oficial

A partir deste documento, a sequência é:

```text
01-AUDIT-CLEANUP       ← concluído
        ↓
00-MIGRATION-STRATEGY  ← este documento
        ↓
02-DOCUMENTATION
        ↓
03-FOUNDATION
        ↓
04-CMS-CORE
        ↓
05-SUPABASE
        ↓
06-ADMIN
        ↓
07-PUBLIC-SITE
        ↓
08-CLEANUP
        ↓
09-POLISH
        ↓
10-RELEASE
```

Os prompts seguintes devem ser escritos para consumir o mínimo necessário de contexto e assumir que as fases anteriores foram validadas.

## 21. Critério de sucesso da migração

Ao final, `portfolio-tais` deve ser um projeto independente do Conjuga como produto/identidade, mas tecnicamente baseado em um padrão reutilizável.

Deve existir uma separação clara entre:

- CORE
- CLIENTE
- CONTEÚDO
- DADOS
- CONFIGURAÇÃO

O resultado não deve ser simplesmente:

> “um site Conjuga com textos trocados”.

Deve ser:

> “a primeira implementação de uma base CMS reutilizável para projetos de clientes da Conjuga”.

## 22. Encerramento desta fase

Este documento define a estratégia.

Não executar todas as fases agora.

O próximo prompt é:

`02-DOCUMENTATION.md`

Ele deverá implementar somente a nova documentação canônica e substituir/arquivar a documentação herdada de acordo com esta estratégia.

**PARE ao concluir esta fase.**
