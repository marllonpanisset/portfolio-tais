/**
 * Decisão pura de autorização do proprietário do site.
 *
 * Módulo sem dependências de Next.js ou Supabase: pode ser testado com
 * `node:test` sem segredos ou conexão remota. A consulta real à RPC
 * `is_site_owner()` acontece em `require-site-owner.ts`, que reutiliza
 * esta decisão para negar por padrão qualquer estado ambíguo.
 */

export const SITE_OWNER_SESSION_EXPIRED_ERROR =
  "Sua sessão expirou. Entre novamente para continuar.";

export const SITE_OWNER_FORBIDDEN_ERROR =
  "Acesso negado. Você não tem permissão para esta operação.";

export type SiteOwnerDenialReason = "unauthenticated" | "forbidden";

export interface SiteOwnerClaimsInput {
  /** `true` quando `getClaims()` retornou claims sem erro. */
  hasSession: boolean;
  /** `true` quando `getClaims()` retornou erro. */
  claimsError: boolean;
}

export interface SiteOwnerRpcInput {
  /** Valor bruto de `data` retornado por `rpc("is_site_owner")`. */
  data: unknown;
  /** `true` quando a RPC retornou erro. */
  rpcError: boolean;
}

export type SiteOwnerDecision =
  | { authorized: true }
  | { authorized: false; reason: SiteOwnerDenialReason };

/**
 * Retorna `true` somente para a resposta válida e explícita da RPC.
 * Qualquer outro valor (null, undefined, 1, "true", objetos) nega.
 */
export function isValidSiteOwnerResponse(data: unknown): data is true {
  return data === true;
}

/**
 * Aplica a política fail-closed:
 * - sem sessão válida → `unauthenticated`;
 * - erro de RPC ou resposta diferente de `true` → `forbidden`;
 * - somente sessão válida + `true` → autorizado.
 *
 * Nunca trata erro de rede ou do Supabase como autorização concedida e
 * nunca usa e-mail, ID do cliente ou claims isoladas como prova de owner.
 */
export function decideSiteOwnerAuthorization(
  claims: SiteOwnerClaimsInput,
  rpc: SiteOwnerRpcInput,
): SiteOwnerDecision {
  if (claims.claimsError || !claims.hasSession) {
    return { authorized: false, reason: "unauthenticated" };
  }

  if (rpc.rpcError || !isValidSiteOwnerResponse(rpc.data)) {
    return { authorized: false, reason: "forbidden" };
  }

  return { authorized: true };
}

/** Mensagem segura para Actions, sem expor detalhes internos. */
export function siteOwnerDenialMessage(reason: SiteOwnerDenialReason): string {
  return reason === "unauthenticated"
    ? SITE_OWNER_SESSION_EXPIRED_ERROR
    : SITE_OWNER_FORBIDDEN_ERROR;
}
