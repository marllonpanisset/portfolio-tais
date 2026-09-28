import "server-only";

import { createClient } from "@/lib/supabase/server";

const BUCKET_NAME = "project-media";

/**
 * Generates a storage path for a project media file.
 * Format: {project_id}/{uuid}.{ext}
 */
export function generateMediaPath(
  projectId: string,
  filename: string,
): string {
  const ext = filename.split(".").pop() ?? "";
  const uuid = crypto.randomUUID();
  return `${projectId}/${uuid}.${ext}`;
}

/**
 * Uploads an image file to the project-media bucket.
 * Returns the storage path on success.
 */
export async function uploadImage(
  projectId: string,
  file: File,
): Promise<string> {
  const supabase = await createClient();
  const path = generateMediaPath(projectId, file.name);

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
 * Gets the public URL for a media file.
 */
export async function getMediaUrl(path: string): Promise<string> {
  const supabase = await createClient();

  const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(path);

  return data.publicUrl;
}
