"use client";

// ============================================================
// Today's Status Card — Flat design, clean submission status
// ============================================================

import { Clock, CalendarCheck, Check, Lock } from "lucide-react";
import { useLiveClock } from "@/hooks/useLiveClock";
import { getWorkTypeConfig, APP_CONFIG } from "@/lib/constants";
import type { DailyWork } from "@/types";

interface TodayStatusCardProps {
  submission: DailyWork | null;
}

export function TodayStatusCard({ submission }: TodayStatusCardProps) {
  const clock = useLiveClock();
  const workConfig = submission ? getWorkTypeConfig(submission.work_type) : null;

  const submittedTime = submission
    ? new Date(submission.submitted_at).toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    : null;

  const todayDisplay =
    clock?.dateShort ??
    new Date().toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  return (
    <div className="bg-white border border-border rounded-xl animate-fade-in overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 sm:px-5 pt-4 pb-3 border-b border-border">
        <p className="text-xs font-semibold text-foreground uppercase tracking-widest">
          Today&apos;s Status
        </p>
        <span
          className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${
            submission
              ? "bg-emerald-50 text-emerald-700 border-emerald-200 flex items-center gap-1"
              : "bg-amber-50 text-amber-700 border-amber-200"
          }`}
        >
          {submission && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}
          {submission ? "Submitted" : "Pending"}
        </span>
      </div>

      <div className="px-4 sm:px-5 py-4">
        {submission && workConfig ? (
          <div className="space-y-4">
            {/* Success Banner */}
            <div className="flex items-center gap-3.5 bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-3.5">
              <div className="w-9 h-9 bg-emerald-600 text-white rounded-lg flex items-center justify-center flex-shrink-0 shadow-xs">
                <Check className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">
                  Work Status Recorded
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Your daily update for today has been saved successfully.
                </p>
              </div>
            </div>

            {/* Work type — colorful card block */}
            <div className={`rounded-xl p-3.5 border ${workConfig.selectedBgClass} ${workConfig.selectedBorderClass}`}>
              <p className={`text-[10px] font-semibold uppercase tracking-widest mb-0.5 ${workConfig.colorClass}`}>
                Today&apos;s Work Type
              </p>
              <p className={`font-bold text-sm sm:text-base ${workConfig.colorClass}`}>
                {workConfig.label}
              </p>
              <p className="text-xs text-muted-foreground font-medium mt-0.5">
                {workConfig.description}
              </p>
            </div>

            {/* Meta row */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="bg-muted/60 rounded-lg px-3.5 py-2.5 border border-border/50">
                <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-widest mb-1">
                  Date
                </p>
                <p className="text-xs font-medium text-foreground leading-snug">
                  {todayDisplay}
                </p>
              </div>
              <div className="bg-muted/60 rounded-lg px-3.5 py-2.5 border border-border/50">
                <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-widest mb-1">
                  Submitted At
                </p>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" strokeWidth={1.5} />
                  <p className="text-xs font-mono font-semibold text-foreground">
                    {submittedTime}
                  </p>
                </div>
              </div>
            </div>

            {/* Locked notice & Admin contact */}
            <div className="flex items-start gap-2.5 bg-muted/40 border border-border/60 rounded-lg px-3.5 py-2.5 text-xs text-muted-foreground">
              <Lock className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0 mt-0.5" strokeWidth={1.5} />
              <p className="leading-relaxed">
                Submission locked for today. To request changes, contact admin at{" "}
                <a href={`tel:${APP_CONFIG.adminContact}`} className="text-primary font-semibold hover:underline">
                  {APP_CONFIG.adminContact}
                </a>.
              </p>
            </div>
          </div>
        ) : (
          /* Not submitted */
          <div className="flex flex-col items-center justify-center py-5 gap-3 text-center">
            <div className="w-10 h-10 border border-border rounded-lg flex items-center justify-center">
              <CalendarCheck className="w-5 h-5 text-muted-foreground" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Not Submitted</p>
              <p className="text-xs text-muted-foreground mt-0.5">{todayDisplay}</p>
            </div>
            {clock && (
              <p className="font-mono text-xs font-semibold text-primary tabular-nums">
                {clock.time}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
