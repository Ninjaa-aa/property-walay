"use client";

import { useEffect, useState } from "react";
import { getAvatarSignedUrl } from "@/lib/utils/avatar";

export function useAvatarUrl(path: string | null | undefined): string | null {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const resolved = await getAvatarSignedUrl(path);
      if (!cancelled) setUrl(resolved);
    })();
    return () => {
      cancelled = true;
    };
  }, [path]);

  return url;
}
