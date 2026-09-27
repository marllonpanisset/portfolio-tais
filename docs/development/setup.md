# Desenvolvimento e validação

## Requisitos verificados

- Node.js `24.x`, conforme `engines` em `package.json`.
- npm e dependências descritas em `package-lock.json`.
- Variáveis para funcionalidades integradas: `NEXT_PUBLIC_SUPABASE_URL` e `SUPABASE_SECRET_KEY` para acesso à persistência; `CONTACT_WEBHOOK_URL` e opcionalmente `CONTACT_WEBHOOK_TOKEN` para notificação; `NEXT_PUBLIC_GA_MEASUREMENT_ID` para analytics. Os valores devem ser fornecidos pelo ambiente e nunca versionados.

## Comandos disponíveis

```bash
npm install
npm run dev
npm run lint
npm run build
npm start
```

O servidor de desenvolvimento padrão do Next.js atende em `http://localhost:3000`. `npm run start` serve o build de produção e deve ser precedido por `npm run build`.

Os scripts declarados não incluem testes automatizados nem typecheck isolado. Não há configuração de CI identificada no checkout auditado.

## Fluxo recomendado

1. Leia `AGENTS.md`, este guia e os documentos canônicos relevantes.
2. Inspecione a rota, componentes e dependências que serão alterados.
3. Faça uma mudança focada, preservando padrões existentes e sem incluir segredos.
4. Para alterações de schema, crie uma nova migração em `supabase/migrations/`; inspecione constraints e RLS antes de definir acesso.
5. Atualize documentação técnica, estado do projeto e changelog quando a mudança for relevante; registre um ADR para decisões arquiteturais significativas.
6. Execute lint, build e `git diff --check` para alterações de implementação; revise status e diff antes de concluir.

## Variáveis de ambiente

| Variável | Uso observado | Obrigatória |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | URL utilizada pelo cliente Supabase server-side. | Sim para inicializar persistência. |
| `SUPABASE_SECRET_KEY` | Credencial privilegiada do cliente Supabase server-side. | Sim para inicializar persistência. |
| `CONTACT_WEBHOOK_URL` | Destino opcional de notificação após persistir lead. | Não para persistência; sem ela não há entrega de notificação. |
| `CONTACT_WEBHOOK_TOKEN` | Bearer token opcional para webhook. | Não. |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Identificador consultado pela implementação de analytics. | Não indicado pelo código como obrigatório. |

Não existe arquivo `.env.example` no checkout auditado. Nomes e usos acima foram conferidos no código; valores e configuração dos ambientes não são conhecidos.
