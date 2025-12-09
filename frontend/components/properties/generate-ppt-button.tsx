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
import { Progress } from "@/components/ui/progress";
import { usePptExport } from "@/hooks/use-ppt-export";
import { useUserProfile } from "@/hooks/use-user-profile";
import {
  FilePresentation,
  Download,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface GeneratePptButtonProps {
  propertyId: string;
  propertyTitle?: string;
  className?: string;
  variant?: "default" | "outline" | "secondary" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
}

export function GeneratePptButton({
  propertyId,
  propertyTitle,
  className,
  variant = "outline",
  size = "default",
}: GeneratePptButtonProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { user } = useUserProfile();
  const {
    isGenerating,
    status,
    exportData,
    error,
    progress,
    generatePropertyPpt,
    downloadPpt,
    reset,
  } = usePptExport();

  const handleGenerate = async () => {
    if (!user?.id) {
      // Show login prompt or handle unauthenticated state
      alert("Please log in to generate PPT presentations");
      return;
    }

    setDialogOpen(true);
    await generatePropertyPpt(propertyId, user.id);
  };

  const handleClose = () => {
    setDialogOpen(false);
    // Reset state after a short delay to allow dialog animation
    setTimeout(reset, 300);
  };

  const handleDownload = () => {
    downloadPpt();
    handleClose();
  };

  const getStatusIcon = () => {
    switch (status) {
      case "queued":
      case "processing":
        return <Loader2 className="text-primary h-12 w-12 animate-spin" />;
      case "completed":
        return <CheckCircle2 className="h-12 w-12 text-green-500" />;
      case "failed":
        return <XCircle className="text-destructive h-12 w-12" />;
      default:
        return <FilePresentation className="text-muted-foreground h-12 w-12" />;
    }
  };

  const getStatusMessage = () => {
    switch (status) {
      case "queued":
        return "Preparing your presentation...";
      case "processing":
        return "Generating slides and adding images...";
      case "completed":
        return "Your presentation is ready!";
      case "failed":
        return error || "Failed to generate presentation";
      default:
        return "Starting generation...";
    }
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={handleGenerate}
        disabled={isGenerating}
        className={cn("gap-2", className)}
      >
        {isGenerating ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <FilePresentation className="h-4 w-4" />
        )}
        {size !== "icon" && (isGenerating ? "Generating..." : "Generate PPT")}
      </Button>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FilePresentation className="h-5 w-5" />
              Generate Presentation
            </DialogTitle>
            <DialogDescription>
              {propertyTitle
                ? `Creating a professional PPT for "${propertyTitle}"`
                : "Creating a professional property presentation"}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center justify-center space-y-6 py-8">
            {getStatusIcon()}

            <div className="space-y-2 text-center">
              <p className="font-medium">{getStatusMessage()}</p>
              {status === "completed" && exportData && (
                <p className="text-muted-foreground text-sm">
                  File size:{" "}
                  {exportData.file_size
                    ? `${(exportData.file_size / 1024).toFixed(1)} KB`
                    : "Unknown"}
                  {exportData.duration_ms && (
                    <>
                      {" "}
                      • Generated in{" "}
                      {(exportData.duration_ms / 1000).toFixed(1)}s
                    </>
                  )}
                </p>
              )}
            </div>

            {(status === "queued" || status === "processing") && (
              <div className="w-full space-y-2">
                <Progress value={progress} className="h-2" />
                <p className="text-muted-foreground text-center text-xs">
                  {progress}% complete
                </p>
              </div>
            )}

            {status === "failed" && (
              <div className="text-destructive flex items-center gap-2 text-sm">
                <AlertCircle className="h-4 w-4" />
                <span>Please try again later</span>
              </div>
            )}
          </div>

          <DialogFooter className="flex-col gap-2 sm:flex-row">
            {status === "completed" ? (
              <>
                <Button variant="outline" onClick={handleClose}>
                  Close
                </Button>
                <Button onClick={handleDownload} className="gap-2">
                  <Download className="h-4 w-4" />
                  Download PPT
                </Button>
              </>
            ) : status === "failed" ? (
              <>
                <Button variant="outline" onClick={handleClose}>
                  Close
                </Button>
                <Button onClick={handleGenerate} className="gap-2">
                  <Loader2 className="h-4 w-4" />
                  Try Again
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={isGenerating}
              >
                Cancel
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}





