"use client";

import { useState, useCallback } from "react";

type VideoStatus = "idle" | "checking" | "found" | "not_found" | "error";

interface UsePropertyVideoReturn {
  status: VideoStatus;
  videoUrl: string | null;
  loading: boolean;
  checkVideo: () => Promise<void>;
  reset: () => void;
}

function buildVideoUrl(propertyId: string): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  return `${base}/storage/v1/object/public/videos/vid/${propertyId}.mp4`;
}

export function usePropertyVideo(propertyId: string): UsePropertyVideoReturn {
  const [status, setStatus] = useState<VideoStatus>("idle");
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const checkVideo = useCallback(async () => {
    setStatus("checking");
    setVideoUrl(null);

    const url = buildVideoUrl(propertyId);

    try {
      const res = await fetch(url, { method: "HEAD" });

      if (res.ok) {
        setVideoUrl(url);
        setStatus("found");
      } else {
        setStatus("not_found");
      }
    } catch {
      setStatus("error");
    }
  }, [propertyId]);

  const reset = useCallback(() => {
    setStatus("idle");
    setVideoUrl(null);
  }, []);

  return {
    status,
    videoUrl,
    loading: status === "checking",
    checkVideo,
    reset,
  };
}
