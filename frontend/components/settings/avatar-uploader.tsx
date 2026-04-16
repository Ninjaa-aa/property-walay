"use client";

import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Camera, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import {
  AVATAR_ALLOWED_MIME,
  AVATAR_BUCKET,
  AVATAR_MAX_BYTES,
  getAvatarExtension,
  getAvatarSignedUrl,
} from "@/lib/utils/avatar";

interface AvatarUploaderProps {
  userId: string;
  currentPath: string | null;
  initials: string;
  onUploaded: (path: string | null) => Promise<void> | void;
}

export function AvatarUploader({
  userId,
  currentPath,
  initials,
  onUploaded,
}: AvatarUploaderProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const url = await getAvatarSignedUrl(currentPath);
      if (!cancelled) setPreviewUrl(url);
    })();
    return () => {
      cancelled = true;
    };
  }, [currentPath]);

  const handlePick = () => inputRef.current?.click();

  const handleFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!AVATAR_ALLOWED_MIME.includes(file.type as (typeof AVATAR_ALLOWED_MIME)[number])) {
      toast.error("Unsupported file type", {
        description: "Upload jpg, png, webp, gif, or svg only.",
      });
      return;
    }
    if (file.size > AVATAR_MAX_BYTES) {
      toast.error("File too large", {
        description: "Avatar must be less than 2 MB.",
      });
      return;
    }

    const ext = getAvatarExtension(file.type);
    if (!ext) {
      toast.error("Unsupported file type");
      return;
    }

    setUploading(true);
    try {
      const supabase = createClient();
      const path = `${userId}/avatar.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from(AVATAR_BUCKET)
        .upload(path, file, {
          upsert: true,
          contentType: file.type,
          cacheControl: "0",
        });

      if (uploadError) throw uploadError;

      await onUploaded(path);

      const url = await getAvatarSignedUrl(path);
      setPreviewUrl(url);
      toast.success("Avatar updated");
    } catch (err) {
      console.error(err);
      toast.error("Upload failed", {
        description: err instanceof Error ? err.message : "Please try again.",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async () => {
    if (!currentPath) return;
    setDeleting(true);
    try {
      const supabase = createClient();
      await supabase.storage.from(AVATAR_BUCKET).remove([currentPath]);
      await onUploaded(null);
      setPreviewUrl(null);
      toast.success("Avatar removed");
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove avatar");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <Avatar className="h-24 w-24">
        {previewUrl && <AvatarImage src={previewUrl} alt="Avatar" />}
        <AvatarFallback className="bg-primary/10 text-primary text-2xl">
          {initials}
        </AvatarFallback>
      </Avatar>

      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handlePick}
            disabled={uploading || deleting}
          >
            {uploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Camera className="h-4 w-4" />
            )}
            Change
          </Button>
          {currentPath && (
            <Button
              type="button"
              variant="ghost"
              onClick={handleRemove}
              disabled={uploading || deleting}
            >
              <Trash2 className="h-4 w-4" />
              Remove
            </Button>
          )}
        </div>
        <p className="text-muted-foreground text-xs">
          JPG, PNG, WebP, GIF, or SVG. Max 2 MB.
        </p>
        <input
          ref={inputRef}
          type="file"
          accept={AVATAR_ALLOWED_MIME.join(",")}
          className="hidden"
          onChange={handleFile}
        />
      </div>
    </div>
  );
}
