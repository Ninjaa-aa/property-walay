"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { usePropertyVideo } from "@/hooks/use-property-video";
import { Video, Download, Loader2, AlertCircle, Coins } from "lucide-react";
import { cn } from "@/lib/utils";

interface GenerateVideoButtonProps {
  propertyId: string;
  propertyTitle?: string;
  className?: string;
  variant?: "default" | "outline" | "secondary" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
}

export function GenerateVideoButton({
  propertyId,
  propertyTitle,
  className,
  variant = "outline",
  size = "default",
}: GenerateVideoButtonProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { status, videoUrl, loading, checkVideo, reset } =
    usePropertyVideo(propertyId);

  const handleClick = async () => {
    setDialogOpen(true);
    await checkVideo();
  };

  const handleClose = () => {
    setDialogOpen(false);
    setTimeout(reset, 300);
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={handleClick}
        disabled={loading}
        className={cn("gap-2", className)}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Video className="h-4 w-4" />
        )}
        {size !== "icon" && (loading ? "Checking..." : "Generate Video")}
      </Button>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Video className="h-5 w-5" />
              Property Video
            </DialogTitle>
            <DialogDescription>
              {propertyTitle
                ? `Video for "${propertyTitle}"`
                : "Property video preview"}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center justify-center space-y-4 py-4">
            {/* Loading */}
            {status === "checking" && (
              <>
                <Loader2 className="text-primary h-12 w-12 animate-spin" />
                <p className="font-medium">Looking for video...</p>
              </>
            )}

            {/* Video found */}
            {status === "found" && videoUrl && (
              <video
                src={videoUrl}
                controls
                className="w-full rounded-lg"
                preload="metadata"
              >
                Your browser does not support the video tag.
              </video>
            )}

            {/* Not found — tokens message */}
            {(status === "not_found" || status === "error") && (
              <div className="flex flex-col items-center space-y-3 text-center">
                <div className="bg-muted flex h-16 w-16 items-center justify-center rounded-full">
                  <Coins className="text-muted-foreground h-8 w-8" />
                </div>
                <p className="text-lg font-semibold">Tokens Ended</p>
                <p className="text-muted-foreground max-w-xs text-sm">
                  Buy tokens to generate more property videos.
                </p>
                {status === "error" && (
                  <div className="text-destructive flex items-center gap-1 text-xs">
                    <AlertCircle className="h-3 w-3" />
                    <span>Could not reach storage</span>
                  </div>
                )}
              </div>
            )}
          </div>

          <DialogFooter className="flex-col gap-2 sm:flex-row">
            {status === "found" && videoUrl ? (
              <>
                <Button variant="outline" onClick={handleClose}>
                  Close
                </Button>
                <Button asChild className="gap-2">
                  <a href={videoUrl} download>
                    <Download className="h-4 w-4" />
                    Download Video
                  </a>
                </Button>
              </>
            ) : (
              <Button variant="outline" onClick={handleClose}>
                Close
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
