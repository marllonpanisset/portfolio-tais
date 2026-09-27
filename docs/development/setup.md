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

Não há scripts `typecheck` ou `test` declarados. `npx tsc --noEmit` foi executado na auditoria inicial e passou; verifique o estado atual antes de usar como validação de alterações. Não foi identificada configuração de CI no checkout auditado.

## Configuração de ambiente observada

| Variável | Uso no código atual |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Base absoluta para metadata, sitemap e URLs estruturadas; sem valor usa `http://localhost:3000`. |
| `NEXT_PUBLIC_SUPABASE_URL` | Inicialização do cliente Supabase server-side. |
| `SUPABASE_SECRET_KEY` | Credencial privilegiada do cliente Supabase server-side. |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | ID lido pelo provider legado de Google Analytics, que não é montado no layout público. |

Nomes/usos foram conferidos no código. Valores, secrets e configuração de ambientes externos não são conhecidos. Não há `.env.example` no checkout auditado. Nunca registre valores secretos na documentação.

## Procedimento de mudança

1. Leia `AGENTS.md` e a documentação relevante em `docs/`.
2. Inspecione o código e dependências afetadas.
3. Mantenha a alteração no escopo autorizado e não antecipe fases futuras.
4. Atualize documentação técnica quando o comportamento ou arquitetura verificados mudarem.
5. Verifique `package.json` e execute os checks existentes e aplicáveis. Para implementação, confira também status e diff.

Para mudanças futuras de schema, inspecione constraints e RLS antes de planejar; qualquer alteração deverá seguir a autorização e o escopo da tarefa correspondente.
