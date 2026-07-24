"use client";

// ============================================================
// Confirm Dialog — Flat design, no emojis
// ============================================================

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { getWorkTypeConfig } from "@/lib/constants";
import type { WorkType } from "@/types";

interface ConfirmDialogProps {
  open: boolean;
  workType: WorkType | null;
  isSubmitting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  workType,
  isSubmitting,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const config = workType ? getWorkTypeConfig(workType) : null;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && !isSubmitting && onCancel()}>
      <DialogContent className="sm:max-w-sm rounded-xl border border-border bg-white p-0 overflow-hidden">

        {/* Header — flat solid strip */}
        <div className="flat-brand px-6 py-5">
          <DialogTitle className="text-white text-base font-bold">
            Confirm Submission
          </DialogTitle>
          <DialogDescription className="text-white/65 text-xs mt-1">
            This cannot be changed after confirmation.
          </DialogDescription>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {/* Work type display */}
          {config && (
            <div className="border border-border rounded-lg px-4 py-3.5">
              <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-widest mb-1">
                Selected Work
              </p>
              <p className="text-foreground font-bold text-sm">{config.label}</p>
              <p className="text-muted-foreground text-xs mt-0.5">{config.description}</p>
            </div>
          )}

          <p className="text-xs text-muted-foreground leading-relaxed">
            You are about to submit{" "}
            <strong className="text-foreground">{config?.label}</strong> as your
            work status for today. This action is final.
          </p>
        </div>

        {/* Footer */}
        <DialogFooter className="px-6 pb-5 gap-2 flex-row border-t border-border pt-4">
          <Button
            id="cancel-submission-btn"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
            className="flex-1 h-10 rounded-lg border-border text-sm"
          >
            Cancel
          </Button>
          <Button
            id="confirm-submission-btn"
            onClick={onConfirm}
            disabled={isSubmitting}
            className="flex-1 h-10 rounded-lg bg-primary hover:bg-primary/90 text-white text-sm gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Submitting...
              </>
            ) : (
              "Confirm"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
