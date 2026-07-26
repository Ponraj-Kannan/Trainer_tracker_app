"use client";

// ============================================================
// Today's Status Card — Flat design, no emojis
// ============================================================

import { Clock, CalendarCheck, Check } from "lucide-react";
import { useLiveClock } from "@/hooks/useLiveClock";
import { getWorkTypeConfig } from "@/lib/constants";
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
    <div className="bg-white border border-border rounded-xl animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-border">
        <p className="text-xs font-semibold text-foreground uppercase tracking-widest">
          Today&apos;s Status
        </p>
        <span
          className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${
            submission
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : "bg-amber-50 text-amber-700 border-amber-200"
          }`}
        >
          {submission ? "Submitted" : "Pending"}
        </span>
      </div>

      <div className="px-4 py-4">
        {submission && workConfig ? (
          <div className="space-y-3">
            {/* Work type — colorful card block */}
            <div className={`rounded-lg px-4 py-3 border flex items-center justify-between ${workConfig.bgClass} ${workConfig.borderClass}`}>
              <div>
                <p className={`text-[10px] font-semibold uppercase tracking-widest mb-0.5 ${workConfig.colorClass}`}>
                  Work Type
                </p>
                <p className={`font-bold text-sm ${workConfig.colorClass}`}>
                  {workConfig.label} — {workConfig.description}
                </p>
              </div>
              <div className={`w-7 h-7 rounded-md flex items-center justify-center bg-white shadow-xs ${workConfig.colorClass}`}>
                <Check className="w-4 h-4" strokeWidth={2.5} />
              </div>
            </div>

            {/* Meta row */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-muted/70 rounded-lg px-3 py-2.5 border border-border/50">
                <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-widest mb-1">
                  Date
                </p>
                <p className="text-xs font-medium text-foreground leading-snug">
                  {todayDisplay}
                </p>
              </div>
              <div className="bg-muted/70 rounded-lg px-3 py-2.5 border border-border/50">
                <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-widest mb-1">
                  Time
                </p>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-muted-foreground flex-shrink-0" strokeWidth={1.5} />
                  <p className="text-xs font-mono font-semibold text-foreground">
                    {submittedTime}
                  </p>
                </div>
              </div>
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
