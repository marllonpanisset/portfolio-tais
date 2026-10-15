/**
 * Site Owner Decision Tests (Fase 2B)
 *
 * Testes puros da política fail-closed, sem runner adicional: compile
 * este arquivo e `site-owner-decision.ts` com `npx tsc` para um diretório
 * temporário e execute o JS gerado com `node`. O próprio `node:test`
 * registra e executa todos os casos ao carregar o arquivo.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import {
  decideSiteOwnerAuthorization,
  isValidSiteOwnerResponse,
  siteOwnerDenialMessage,
} from "./site-owner-decision";

test("sem sessão: nega como unauthenticated", () => {
  const decision = decideSiteOwnerAuthorization(
    { hasSession: false, claimsError: false },
    { data: true, rpcError: false },
  );
  assert.deepEqual(decision, {
    authorized: false,
    reason: "unauthenticated",
  });
});

test("erro de claims: nega como unauthenticated mesmo com RPC owner", () => {
  const decision = decideSiteOwnerAuthorization(
    { hasSession: false, claimsError: true },
    { data: true, rpcError: false },
  );
  assert.deepEqual(decision, {
    authorized: false,
    reason: "unauthenticated",
  });
});

test("autenticado sem papel de owner: nega como forbidden", () => {
  const decision = decideSiteOwnerAuthorization(
    { hasSession: true, claimsError: false },
    { data: false, rpcError: false },
  );
  assert.deepEqual(decision, { authorized: false, reason: "forbidden" });
});

test("erro da RPC is_site_owner(): nega como forbidden", () => {
  const decision = decideSiteOwnerAuthorization(
    { hasSession: true, claimsError: false },
    { data: true, rpcError: true },
  );
  assert.deepEqual(decision, { authorized: false, reason: "forbidden" });
});

test("resposta inválida da RPC: nega (null, 1, string, objeto)", () => {
  for (const data of [null, undefined, 0, 1, "true", {}, [], "TRUE"]) {
    const decision = decideSiteOwnerAuthorization(
      { hasSession: true, claimsError: false },
      { data, rpcError: false },
    );
    assert.deepEqual(decision, { authorized: false, reason: "forbidden" });
  }
});

test("proprietário autorizado: sessão válida + RPC true", () => {
  const decision = decideSiteOwnerAuthorization(
    { hasSession: true, claimsError: false },
    { data: true, rpcError: false },
  );
  assert.deepEqual(decision, { authorized: true });
});

test("isValidSiteOwnerResponse: estrito para true booleano", () => {
  assert.equal(isValidSiteOwnerResponse(true), true);
  assert.equal(isValidSiteOwnerResponse(false), false);
  assert.equal(isValidSiteOwnerResponse(null), false);
  assert.equal(isValidSiteOwnerResponse(1), false);
  assert.equal(isValidSiteOwnerResponse("true"), false);
});

test("mensagens de negação: seguras e sem detalhes internos", () => {
  const unauthenticated = siteOwnerDenialMessage("unauthenticated");
  const forbidden = siteOwnerDenialMessage("forbidden");
  assert.ok(unauthenticated.length > 0);
  assert.ok(forbidden.length > 0);
  for (const message of [unauthenticated, forbidden]) {
    assert.doesNotMatch(message, /token|jwt|supabase|is_site_owner|stack/i);
  }
});
