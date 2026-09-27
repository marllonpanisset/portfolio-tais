# Contrato inicial do CMS

Este documento registra uma direção conceitual. Não descreve uma implementação existente e não autoriza criar rotas, tabelas, políticas ou funcionalidades nesta etapa.

## Área administrativa conceitual

```text
/admin
    /projetos
    /páginas
    /mídia
    /mensagens
    /configurações
```

Essas rotas administrativas ainda não existem.

## Responsabilidades

O CMS deverá controlar conteúdo, projetos, páginas, mídia, mensagens e configurações editoriais.

O código deverá controlar estrutura, layout, comportamento, componentes, validação, segurança e permissões.

> O código controla o design. O painel controla o conteúdo.

## Entidades candidatas

As entidades iniciais a avaliar são:

- `projects`
- `categories`
- `pages`
- `media`
- `contact_messages`

São candidatos, não tabelas ou modelos existentes. Nenhuma migration será criada com base apenas nesta lista.

## Requisitos futuros

O desenho do CMS deverá considerar autenticação, autorização, RLS, upload seguro, publicação e rascunho, ordenação, slugs, validação e preview quando necessário. Essas necessidades exigem decisões próprias antes da implementação.
