const BUCKET_NAME = "project-media";

/** True when the value looks like a Storage object path instead of a public URL or local asset. */
export function isStoragePath(value: string): boolean {
  return (
    value.length > 0 &&
    !value.startsWith("/") &&
    !value.startsWith("http://") &&
    !value.startsWith("https://")
  );
}

/** Resolves a profile image reference to a browser-usable URL, preserving local paths and external URLs. */
export function resolveMediaUrl(value: string): string {
  if (!value || !isStoragePath(value)) return value;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) return value;

  return `${supabaseUrl}/storage/v1/object/public/${BUCKET_NAME}/${value}`;
}
