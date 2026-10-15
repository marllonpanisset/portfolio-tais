import "server-only";

import {
  decideSiteOwnerAuthorization,
  siteOwnerDenialMessage,
  type SiteOwnerDenialReason,
} from "./site-owner-decision";

/**
 * Cliente Supabase server-side completo (tipo apenas; sem import runtime).
 * Reutiliza o contrato real de `lib/supabase/server.ts` para que Actions
 * continuem usando `.from()`, `.storage`, etc. sem mudanças de tipo.
 */
import type { createClient as createServerClient } from "./server";

export type SiteOwnerSupabaseClient = Awaited<
  ReturnType<typeof createServerClient>
>;

/**
 * Subconjunto usado apenas para injeção em testes (sem rede/segredos).
 * O cliente real satisfaz esta interface em runtime via cast estrutural.
 */
export interface SiteOwnerClientLike {
  auth: {
    getClaims(): Promise<{
      data: { claims: unknown } | null;
      error: unknown;
    }>;
  };
  rpc(
    fn: "is_site_owner",
  ): Promise<{ data: unknown; error: unknown }>;
}

export type RequireSiteOwnerSuccess = {
  authorized: true;
  supabase: SiteOwnerSupabaseClient;
  denialMessage?: undefined;
  reason?: undefined;
};

export type RequireSiteOwnerFailure = {
  authorized: false;
  supabase?: undefined;
  reason: SiteOwnerDenialReason;
  denialMessage: string;
};

export type RequireSiteOwnerResult =
  | RequireSiteOwnerSuccess
  | RequireSiteOwnerFailure;

/**
 * Verifica no servidor que a requisição tem sessão válida E que o usuário
 * é owner via `rpc("is_site_owner")`.
 *
 * - Rejeita sessão ausente, erro de claims, erro de RPC e resposta ≠ `true`.
 * - Falha fechada: qualquer exceção inesperada nega o acesso.
 * - Não cria cliente privilegiado; reutiliza `createClient()` com publishable key.
 * - Aceita cliente injetado (testes) para evitar nova criação.
 *
 * Retorna o mesmo `supabase` autenticado para a Action/página reutilizar,
 * garantindo que nenhuma leitura/escrita privilegiada ocorra antes da checagem.
 */
export async function requireSiteOwner(
  client?: SiteOwnerClientLike,
): Promise<RequireSiteOwnerResult> {
  let supabase: SiteOwnerSupabaseClient;
  let authClient: SiteOwnerClientLike;
  if (client) {
    authClient = client;
    supabase = client as unknown as SiteOwnerSupabaseClient;
  } else {
    const { createClient } = await import("./server");
    supabase = await createClient();
    authClient = supabase as unknown as SiteOwnerClientLike;
  }

  try {
    const { data: claimsData, error: claimsError } =
      await authClient.auth.getClaims();
    const hasSession = claimsError == null && claimsData?.claims != null;

    if (!hasSession) {
      return {
        authorized: false,
        reason: "unauthenticated",
        denialMessage: siteOwnerDenialMessage("unauthenticated"),
      };
    }

    const { data: isOwner, error: ownerError } =
      await authClient.rpc("is_site_owner");

    const decision = decideSiteOwnerAuthorization(
      { hasSession: true, claimsError: false },
      { data: isOwner, rpcError: ownerError != null },
    );

    if (!decision.authorized) {
      return {
        authorized: false,
        reason: decision.reason,
        denialMessage: siteOwnerDenialMessage(decision.reason),
      };
    }

    return { authorized: true, supabase };
  } catch {
    return {
      authorized: false,
      reason: "forbidden",
      denialMessage: siteOwnerDenialMessage("forbidden"),
    };
  }
}
