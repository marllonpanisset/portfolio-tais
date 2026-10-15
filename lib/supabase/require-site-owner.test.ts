/**
 * requireSiteOwner Tests (Fase 2B)
 *
 * Verifica que nenhuma operação privilegiada ocorre antes da autorização,
 * usando mocks do cliente Supabase (sem rede, sem segredos). Compile este
 * arquivo, `require-site-owner.ts` e `site-owner-decision.ts` com `npx tsc`
 * para um diretório temporário e execute com `node --test`.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import {
  requireSiteOwner,
  type SiteOwnerClientLike,
} from "./require-site-owner";

function mockClient(options: {
  claims?: unknown;
  claimsError?: unknown;
  rpcData?: unknown;
  rpcError?: unknown;
  throwOnClaims?: boolean;
  onRpc?: () => void;
}): SiteOwnerClientLike & { rpcCalls: number } {
  let rpcCalls = 0;
  const client = {
    get rpcCalls() {
      return rpcCalls;
    },
    auth: {
      async getClaims() {
        if (options.throwOnClaims) {
          throw new Error("network failure");
        }
        return {
          data:
            options.claims === undefined
              ? null
              : { claims: options.claims },
          error: options.claimsError ?? null,
        };
      },
    },
    async rpc() {
      rpcCalls += 1;
      options.onRpc?.();
      return {
        data: options.rpcData,
        error: options.rpcError ?? null,
      };
    },
  };
  return client;
}

test("sem sessão: nega e não chama a RPC (nada antes da autorização)", async () => {
  const client = mockClient({ claims: null });
  const result = await requireSiteOwner(client);
  assert.equal(result.authorized, false);
  assert.equal(client.rpcCalls, 0);
  if (!result.authorized) {
    assert.equal(result.reason, "unauthenticated");
    assert.ok(result.denialMessage.length > 0);
  }
});

test("autenticado sem owner: nega como forbidden", async () => {
  const client = mockClient({ claims: { sub: "user-1" }, rpcData: false });
  const result = await requireSiteOwner(client);
  assert.equal(result.authorized, false);
  assert.equal(client.rpcCalls, 1);
  if (!result.authorized) {
    assert.equal(result.reason, "forbidden");
  }
});

test("erro da RPC: nega como forbidden (fail-closed)", async () => {
  const client = mockClient({
    claims: { sub: "user-1" },
    rpcData: true,
    rpcError: new Error("db unavailable"),
  });
  const result = await requireSiteOwner(client);
  assert.equal(result.authorized, false);
  if (!result.authorized) {
    assert.equal(result.reason, "forbidden");
  }
});

test("resposta inválida da RPC: nega (null e truthy não-booleano)", async () => {
  for (const rpcData of [null, 1, "true", {}]) {
    const client = mockClient({ claims: { sub: "user-1" }, rpcData });
    const result = await requireSiteOwner(client);
    assert.equal(result.authorized, false);
  }
});

test("owner autorizado: retorna o mesmo cliente para reuso", async () => {
  const client = mockClient({ claims: { sub: "owner-1" }, rpcData: true });
  const result = await requireSiteOwner(client);
  assert.equal(result.authorized, true);
  if (result.authorized) {
    assert.equal(result.supabase, client as unknown);
  }
});

test("exceção em getClaims: nega como forbidden sem propagar detalhes", async () => {
  const client = mockClient({ throwOnClaims: true });
  const result = await requireSiteOwner(client);
  assert.equal(result.authorized, false);
  if (!result.authorized) {
    assert.equal(result.reason, "forbidden");
    assert.doesNotMatch(result.denialMessage, /network failure/);
  }
});

test("mutação simulada: não executa escrita quando negado", async () => {
  let writes = 0;
  const client = mockClient({ claims: null });
  const result = await requireSiteOwner(client);
  if (result.authorized) {
    writes += 1;
  }
  assert.equal(writes, 0);
  assert.equal(result.authorized, false);
});
