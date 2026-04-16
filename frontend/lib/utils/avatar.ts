import { createClient } from "@/lib/supabase/client";

const BUCKET = "avatar";
const SIGNED_URL_TTL_SECONDS = 60 * 60; // 1 hour

/**
 * Generate a signed URL for an avatar stored in the private `avatar` bucket.
 * Accepts either a raw object path (e.g. `{user_id}/avatar.png`) or a full
 * http(s) URL (returned as-is for backward compatibility with older rows).
 */
export async function getAvatarSignedUrl(
  path: string | null | undefined
): Promise<string | null> {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;

  const supabase = createClient();
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(path, SIGNED_URL_TTL_SECONDS);

  if (error || !data?.signedUrl) {
    console.error("Failed to create avatar signed URL:", error);
    return null;
  }
  return data.signedUrl;
}

export const AVATAR_BUCKET = BUCKET;
export const AVATAR_MAX_BYTES = 2 * 1024 * 1024;
export const AVATAR_ALLOWED_MIME = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
] as const;

export function getAvatarExtension(mime: string): string | null {
  switch (mime) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    case "image/gif":
      return "gif";
    case "image/svg+xml":
      return "svg";
    default:
      return null;
  }
}
