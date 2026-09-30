// ============================================================================
// Media utilities: image validation and YouTube URL parsing
// ============================================================================

export const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
] as const;

export type AllowedImageType = (typeof ALLOWED_IMAGE_TYPES)[number];

/**
 * Validates an image file type and size.
 * Returns an error message in Portuguese if invalid, or null if valid.
 */
export function validateImageFile(file: File): string | null {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type as AllowedImageType)) {
    const allowed = ALLOWED_IMAGE_TYPES.map((t) => t.replace("image/", "")).join(", ");
    return `Tipo de arquivo não permitido. Formatos aceitos: ${allowed}.`;
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    const maxMB = MAX_IMAGE_SIZE_BYTES / (1024 * 1024);
    return `Arquivo muito grande. O tamanho máximo permitido é ${maxMB} MB.`;
  }

  return null;
}

/**
 * Extracts the YouTube video ID from various YouTube URL formats.
 * Returns the video ID if valid, or null if the URL is not a valid YouTube URL.
 *
 * Supported formats:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - https://www.youtube.com/shorts/VIDEO_ID
 * - https://www.youtube.com/v/VIDEO_ID
 */
export function parseYouTubeUrl(url: string): string | null {
  const trimmed = url.trim();
  if (!trimmed) return null;

  // Try youtu.be format first
  const shortMatch = trimmed.match(/^https?:\/\/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (shortMatch?.[1]) {
    return shortMatch[1];
  }

  // Try standard and other formats
  const patterns = [
    /^https?:\/\/(?:www\.)?youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]{11})/,
    /^https?:\/\/(?:www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    /^https?:\/\/(?:www\.)?youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
    /^https?:\/\/(?:www\.)?youtube\.com\/v\/([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = trimmed.match(pattern);
    if (match?.[1]) {
      return match[1];
    }
  }

  return null;
}

/**
 * Validates a YouTube URL and returns the video ID if valid.
 * Returns an error message in Portuguese if invalid, or null if valid.
 */
export function validateYouTubeUrl(url: string): string | null {
  const videoId = parseYouTubeUrl(url);
  if (!videoId) {
    return "URL do YouTube inválida. Forneça uma URL válida do YouTube.";
  }
  return null;
}
