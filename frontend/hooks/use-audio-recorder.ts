"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type RecorderStatus = "idle" | "recording" | "stopping";

interface UseAudioRecorderReturn {
  status: RecorderStatus;
  isRecording: boolean;
  isSupported: boolean;
  error: string | null;
  elapsedMs: number;
  start: () => Promise<void>;
  stop: () => Promise<{ blob: Blob; mimeType: string; durationMs: number }>;
  cancel: () => void;
  mimeType: string;
}

const PREFERRED_MIME_TYPES = [
  "audio/webm;codecs=opus",
  "audio/webm",
  "audio/ogg;codecs=opus",
  "audio/mp4",
];

function pickSupportedMimeType(): string {
  if (typeof window === "undefined" || typeof MediaRecorder === "undefined") {
    return "";
  }
  for (const type of PREFERRED_MIME_TYPES) {
    if (MediaRecorder.isTypeSupported(type)) {
      return type;
    }
  }
  return "";
}

export function useAudioRecorder(): UseAudioRecorderReturn {
  const [status, setStatus] = useState<RecorderStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [isSupported, setIsSupported] = useState(false);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const startTimeRef = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const mimeTypeRef = useRef<string>("");

  const cleanup = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    recorderRef.current = null;
    chunksRef.current = [];
  }, []);

  const start = useCallback(async () => {
    if (!isSupported) {
      setError("Audio recording is not supported in this browser.");
      throw new Error("Audio recording is not supported in this browser.");
    }
    setError(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mimeType = pickSupportedMimeType();
      mimeTypeRef.current = mimeType;

      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);
      recorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.start();
      startTimeRef.current = Date.now();
      setElapsedMs(0);

      timerRef.current = setInterval(() => {
        setElapsedMs(Date.now() - startTimeRef.current);
      }, 200);

      setStatus("recording");
    } catch (err) {
      cleanup();
      const message =
        err instanceof Error
          ? err.message
          : "Could not start audio recording.";
      setError(message);
      setStatus("idle");
      throw err;
    }
  }, [cleanup, isSupported]);

  const stop = useCallback((): Promise<{
    blob: Blob;
    mimeType: string;
    durationMs: number;
  }> => {
    return new Promise((resolve, reject) => {
      const recorder = recorderRef.current;
      if (!recorder) {
        reject(new Error("No active recording."));
        return;
      }

      setStatus("stopping");

      recorder.onstop = () => {
        const durationMs = Date.now() - startTimeRef.current;
        const mimeType =
          mimeTypeRef.current || recorder.mimeType || "audio/webm";
        const blob = new Blob(chunksRef.current, { type: mimeType });
        cleanup();
        setStatus("idle");
        setElapsedMs(0);
        resolve({ blob, mimeType, durationMs });
      };

      recorder.onerror = (event) => {
        cleanup();
        setStatus("idle");
        setElapsedMs(0);
        reject(
          event instanceof Error ? event : new Error("Recorder failed.")
        );
      };

      try {
        recorder.stop();
      } catch (err) {
        cleanup();
        setStatus("idle");
        reject(err);
      }
    });
  }, [cleanup]);

  const cancel = useCallback(() => {
    const recorder = recorderRef.current;
    if (recorder && recorder.state !== "inactive") {
      recorder.onstop = null;
      try {
        recorder.stop();
      } catch {
        // ignore
      }
    }
    cleanup();
    setStatus("idle");
    setElapsedMs(0);
  }, [cleanup]);

  useEffect(() => {
    // Detect support only on the client to avoid SSR/client mismatches.
    if (typeof window !== "undefined") {
      const supported =
        typeof navigator !== "undefined" &&
        !!navigator.mediaDevices &&
        typeof navigator.mediaDevices.getUserMedia === "function" &&
        typeof window.MediaRecorder !== "undefined";
      setIsSupported(supported);
    }

    return () => {
      cleanup();
    };
  }, [cleanup]);

  return {
    status,
    isRecording: status === "recording",
    isSupported,
    error,
    elapsedMs,
    start,
    stop,
    cancel,
    mimeType: mimeTypeRef.current,
  };
}
