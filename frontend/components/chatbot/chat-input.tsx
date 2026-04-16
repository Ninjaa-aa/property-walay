"use client";

import {
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { Loader2, Mic, Send, Square } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAudioRecorder } from "@/hooks/use-audio-recorder";
import { transcribeAudio } from "@/lib/api/chatbot";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

function formatElapsed(ms: number): string {
  const total = Math.floor(ms / 1000);
  const mm = Math.floor(total / 60)
    .toString()
    .padStart(2, "0");
  const ss = (total % 60).toString().padStart(2, "0");
  return `${mm}:${ss}`;
}

function extensionFromMime(mime: string): string {
  if (mime.includes("webm")) return "webm";
  if (mime.includes("ogg")) return "ogg";
  if (mime.includes("mp4")) return "mp4";
  if (mime.includes("wav")) return "wav";
  return "webm";
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [value, setValue] = useState("");
  const [isTranscribing, setIsTranscribing] = useState(false);
  const {
    isRecording,
    isSupported,
    elapsedMs,
    start,
    stop,
    cancel,
  } = useAudioRecorder();

  const busy = disabled || isTranscribing || isRecording;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || busy) return;
    onSend(trimmed);
    setValue("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleStartRecording = async () => {
    if (!isSupported) {
      toast.error("Your browser does not support audio recording.");
      return;
    }
    try {
      await start();
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Could not access microphone.";
      toast.error(msg);
    }
  };

  const handleStopRecording = async () => {
    try {
      const { blob, mimeType, durationMs } = await stop();
      if (durationMs < 500 || blob.size === 0) {
        toast.error("Recording too short. Please hold the mic and speak.");
        return;
      }
      setIsTranscribing(true);
      const ext = extensionFromMime(mimeType);
      const { text } = await transcribeAudio(blob, `recording.${ext}`);
      if (!text) {
        toast.error("No speech detected. Please try again.");
        return;
      }
      setValue((prev) => (prev ? `${prev} ${text}` : text));
      toast.success("Transcribed", { duration: 2000 });
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Transcription failed.";
      toast.error(msg);
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleMicClick = () => {
    if (isTranscribing) return;
    if (isRecording) {
      void handleStopRecording();
    } else {
      void handleStartRecording();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      {(isRecording || isTranscribing) && (
        <div className="mb-2 flex items-center justify-between rounded-lg border border-border bg-muted/50 px-3 py-2 text-xs">
          <div className="flex items-center gap-2">
            {isRecording ? (
              <>
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
                </span>
                <span className="font-medium text-foreground">
                  Recording
                </span>
                <span className="text-muted-foreground tabular-nums">
                  {formatElapsed(elapsedMs)}
                </span>
              </>
            ) : (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Transcribing…</span>
              </>
            )}
          </div>
          {isRecording && (
            <button
              type="button"
              onClick={cancel}
              className="text-muted-foreground hover:text-foreground"
            >
              Cancel
            </button>
          )}
        </div>
      )}

      <div className="flex items-end gap-2">
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            isRecording
              ? "Listening…"
              : isTranscribing
                ? "Transcribing your audio…"
                : "Ask about properties..."
          }
          rows={1}
          disabled={busy}
          className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex-1 resize-none rounded-xl border px-4 py-3 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:opacity-50"
        />

        <Button
          type="button"
          size="icon"
          variant={isRecording ? "destructive" : "outline"}
          onClick={handleMicClick}
          disabled={disabled || isTranscribing || !isSupported}
          title={
            !isSupported
              ? "Audio recording not supported"
              : isRecording
                ? "Stop recording"
                : "Record voice query"
          }
          className={cn(
            "h-11 w-11 shrink-0 rounded-xl",
            isRecording && "animate-pulse"
          )}
        >
          {isTranscribing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : isRecording ? (
            <Square className="h-4 w-4" />
          ) : (
            <Mic className="h-4 w-4" />
          )}
        </Button>

        <Button
          type="submit"
          size="icon"
          disabled={busy || !value.trim()}
          className="h-11 w-11 shrink-0 rounded-xl"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
