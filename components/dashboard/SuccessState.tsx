"use client";

// ============================================================
// Success State — Flat design, no emojis
// ============================================================

import { Check, Clock } from "lucide-react";
import { getWorkTypeConfig } from "@/lib/constants";
import type { DailyWork } from "@/types";

interface SuccessStateProps {
  submission: DailyWork;
}

export function SuccessState({ submission }: SuccessStateProps) {
  const config = getWorkTypeConfig(submission.work_type);

  const submittedTime = new Date(submission.submitted_at).toLocaleTimeString(
    "en-IN",
    { hour: "2-digit", minute: "2-digit", hour12: true }
  );

  return (
    <div className="flex flex-col items-center py-6 gap-5 animate-fade-in">

      {/* Flat check mark — solid rose square icon */}
      <div className="w-14 h-14 flat-brand rounded-xl flex items-center justify-center animate-check-in">
        <Check className="w-7 h-7 text-white" strokeWidth={2.5} />
      </div>

      {/* Message */}
      <div className="text-center">
        <p className="text-base font-bold text-foreground">
          Work Status Recorded
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Your submission for today has been saved successfully.
        </p>
      </div>

      {/* Work type — flat solid block */}
      {config && (
        <div className="w-full max-w-xs flat-brand rounded-xl px-5 py-4">
          <p className="text-white/60 text-[10px] font-semibold uppercase tracking-widest mb-1">
            Today&apos;s Work
          </p>
          <p className="text-white font-bold text-base">{config.label}</p>
          <p className="text-white/60 text-xs mt-0.5">{config.description}</p>
        </div>
      )}

      {/* Time pill */}
      <div className="flex items-center gap-2 bg-muted rounded-lg px-4 py-2.5">
        <Clock className="w-3.5 h-3.5 text-muted-foreground" strokeWidth={1.5} />
        <span className="text-xs text-muted-foreground">
          Submitted at{" "}
          <span className="font-mono font-semibold text-foreground">
            {submittedTime}
          </span>
        </span>
      </div>

      <p className="text-xs text-muted-foreground">
        Thank you. Have a productive day.
      </p>
    </div>
  );
}
