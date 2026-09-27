# Portfolio Taís

Portfolio profissional para Taís, em migração a partir de uma base técnica reutilizável da Conjuga. A identidade e o conteúdo do portfolio devem usar somente informações aprovadas; este README não presume biografia ou dados profissionais.

## Stack atual

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Supabase JS, atualmente usado pelo fluxo de leads herdado
- Framer Motion
- Lucide
- MDX, atualmente presente para conteúdo editorial herdado

CMS, autenticação da aplicação e Storage para o CMS ainda não estão implementados.

## Executar localmente

Requer Node.js `24.x` conforme `package.json`.

```bash
npm install
npm run dev
```

O servidor de desenvolvimento padrão fica em `http://localhost:3000`.

Scripts disponíveis no `package.json`: `dev`, `build`, `start`, `lint` e `analyze`. Não há scripts `typecheck` ou `test` declarados.

## Estrutura atual

```text
app/          Rotas, layout, API, estilos e metadados
components/   Componentes de interface, layout, seções, motion, analytics e SEO
config/       Configuração específica do site cliente
content/      Conteúdo TypeScript e MDX
lib/          Utilitários, SEO, MDX, contato, leads e Supabase
types/        Tipos de conteúdo atuais
supabase/     Migrações SQL versionadas
public/       Ativos estáticos
docs/         Documentação do projeto e histórico migrado
```

## Arquitetura

O objetivo é separar infraestrutura reutilizável (**CORE**) da identidade e configuração do **CLIENTE**, do **CONTEÚDO** e dos **DADOS**. O CORE não deve conhecer a identidade específica de Taís. A arquitetura CMS ainda está sendo construída, e o site público ainda está sendo adaptado.

## Documentação

- [Arquitetura](docs/ARCHITECTURE.md)
- [Contrato inicial do CMS](docs/CMS.md)
- [Índice da documentação](docs/README.md)
- [Prompts de migração](docs/prompts/)

A migração está em andamento. Os documentos descrevem separadamente o estado implementado e os requisitos futuros; páginas administrativas, CMS, Auth e Storage não devem ser considerados concluídos.
