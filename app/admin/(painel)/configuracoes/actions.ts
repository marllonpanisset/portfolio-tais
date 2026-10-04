"use server";

import { revalidatePath } from "next/cache";
import { SITE_SETTING_KEYS, type SiteSettingKey } from "@/lib/cms/site-settings";
import { createClient } from "@/lib/supabase/server";

export type SaveSiteSettingsResult =
  | { success: true }
  | { success: false; error: string };

const FIELD_LABELS: Record<SiteSettingKey, string> = {
  instagram: "Instagram",
  youtube: "YouTube",
  linkedin: "LinkedIn",
  whatsapp: "WhatsApp",
  linktree: "Linktree",
  behance: "Behance",
};

function isValidHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export async function saveSiteSettings(
  values: Partial<Record<SiteSettingKey, unknown>>,
): Promise<SaveSiteSettingsResult> {
  if (typeof values !== "object" || values === null || Array.isArray(values)) {
    return { success: false, error: "Dados de configuração inválidos." };
  }

  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.getClaims();
  if (authError || !authData?.claims) {
    return { success: false, error: "Sua sessão expirou. Entre novamente para salvar." };
  }

  const sanitized: Record<SiteSettingKey, string | null> = {
    instagram: null,
    youtube: null,
    linkedin: null,
    whatsapp: null,
    linktree: null,
    behance: null,
  };

  for (const key of SITE_SETTING_KEYS) {
    const raw = values[key];
    if (raw === undefined || raw === null) continue;
    if (typeof raw !== "string") {
      return { success: false, error: `O campo ${FIELD_LABELS[key]} é inválido.` };
    }
    const trimmed = raw.trim();
    if (trimmed.length === 0) continue;
    if (!isValidHttpUrl(trimmed)) {
      return {
        success: false,
        error: `O campo ${FIELD_LABELS[key]} deve ser uma URL válida (http/https) ou ficar vazio.`,
      };
    }
    sanitized[key] = trimmed;
  }

  const { error: upsertError } = await supabase
    .from("site_settings")
    .upsert(
      SITE_SETTING_KEYS.map((key) => ({ key, value: sanitized[key] })),
      { onConflict: "key" },
    );

  if (upsertError) {
    return { success: false, error: "Não foi possível salvar as configurações." };
  }

  revalidatePath("/admin/configuracoes", "page");

  return { success: true };
}
