import "server-only";

import { createClient } from "@/lib/supabase/server";

const BUCKET_NAME = "project-media";

/**
 * Generates a storage path for a media file.
 * Format: {scopeId}/{uuid}.{ext}, or {prefix}/{scopeId}/{uuid}.{ext} when a prefix is given.
 */
export function generateMediaPath(
  scopeId: string,
  filename: string,
  prefix?: string,
): string {
  const ext = filename.split(".").pop() ?? "";
  const uuid = crypto.randomUUID();
  return prefix
    ? `${prefix}/${scopeId}/${uuid}.${ext}`
    : `${scopeId}/${uuid}.${ext}`;
}

/**
 * Uploads an image file to the project-media bucket.
 * Returns the storage path on success.
 */
export async function uploadImage(
  scopeId: string,
  file: File,
  prefix?: string,
): Promise<string> {
  const supabase = await createClient();
  const path = generateMediaPath(scopeId, file.name, prefix);

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    throw new Error(`Failed to upload image: ${error.message}`);
  }

  return path;
}

/**
 * Removes an image file from the project-media bucket.
 */
export async function removeImage(path: string): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase.storage.from(BUCKET_NAME).remove([path]);

  if (error) {
    throw new Error(`Failed to remove image: ${error.message}`);
  }
}

/**
 * Creates a time-limited URL for a media file the current session may access.
 * RLS permits public signing only for published media and owner signing for drafts.
 */
export async function getMediaUrl(path: string): Promise<string> {
  const supabase = await createClient();

  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .createSignedUrl(path, 60 * 60);

  if (error || !data?.signedUrl) {
    throw new Error(`Failed to sign media URL: ${error?.message ?? "Unknown error"}`);
  }

  return data.signedUrl;
}
