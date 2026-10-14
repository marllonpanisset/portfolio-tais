# Desenvolvimento e validação

## Requisitos observados

- Node.js `24.x`, declarado em `package.json`.
- npm e dependências registradas em `package-lock.json`.

## Scripts disponíveis

Os scripts verificados em `package.json` são:

```bash
npm install
npm run dev
npm run lint
npm run build
npm start
npm run analyze
```

`npm run start` serve o build de produção e deve ser precedido por `npm run build`. O servidor de desenvolvimento padrão atende em `http://localhost:3000`.

Não há scripts `typecheck` ou `test` declarados. `npx tsc --noEmit` foi executado em auditorias anteriores e passou; verifique o estado atual antes de usar como validação de alterações. Não foi identificada configuração de CI no checkout auditado (sem `.github/workflows`).

## Configuração de ambiente observada

| Variável | Uso no código atual |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Base absoluta para metadata, sitemap e URLs estruturadas; sem valor usa `http://localhost:3000` (opcional). |
| `NEXT_PUBLIC_SUPABASE_URL` | Exigida por `lib/supabase/server.ts`, `lib/supabase/client.ts` e `proxy.ts`; ausência lança erro. |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Exigida pelos mesmos módulos; ausência lança erro. |
| `SUPABASE_SECRET_KEY` | Consta em `.env.example`, mas não é lida pelo código da aplicação no HEAD atual. Manter somente se algum fluxo operacional exigir; caso contrário, remover em etapa própria. |
| `TEST_EMAIL` / `TEST_PASSWORD` | Nomes presentes em `.env.local`; sem leitura no código da aplicação. |

`.env.example` documenta nomes e finalidade, sem valores. Nomes/usos acima foram conferidos no código. Valores, secrets e configuração de ambientes externos não são conhecidos. Nunca registre valores secretos na documentação.

## Procedimento de mudança

1. Leia `AGENTS.md` e a documentação relevante em `docs/`.
2. Inspecione o código e dependências afetadas.
3. Mantenha a alteração no escopo autorizado e não antecipe fases futuras.
4. Atualize documentação técnica quando o comportamento ou arquitetura verificados mudarem.
5. Verifique `package.json` e execute os checks existentes e aplicáveis. Para implementação, confira também status e diff.

Para mudanças futuras de schema, inspecione constraints e RLS antes de planejar; qualquer alteração deverá seguir a autorização e o escopo da tarefa correspondente.
