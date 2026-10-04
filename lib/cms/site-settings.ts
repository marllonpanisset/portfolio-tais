export const SITE_SETTING_KEYS = [
  "instagram",
  "youtube",
  "linkedin",
  "whatsapp",
  "linktree",
  "behance",
] as const;

export type SiteSettingKey = (typeof SITE_SETTING_KEYS)[number];

export type SiteSettings = Record<SiteSettingKey, string | null>;
