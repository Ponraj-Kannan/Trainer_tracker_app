"use client";

// ============================================================
// Work Type Selector — Flat design, no emojis, mobile-first
// ============================================================

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ConfirmDialog } from "./ConfirmDialog";
import { SuccessState } from "./SuccessState";
import { submitDailyWork } from "@/actions/work";
import { WORK_TYPES, APP_CONFIG } from "@/lib/constants";
import { toast } from "sonner";
import { Lock, Send } from "lucide-react";
import type { WorkType, DailyWork, Employee } from "@/types";

/* Lucide icon mapping for each work type */
import {
  Building2,
  Monitor,
  Plane,
  Car,
  CalendarOff,
  AlertCircle,
  FileText,
} from "lucide-react";

const WORK_ICONS: Record<string, React.ElementType> = {
  "OIF":              Building2,
  "IT":               Monitor,
  "TRAVEL":           Plane,
  "HALF DAY TRAVEL":  Car,
  "LEAVE":            CalendarOff,
  "EMERGENCY LEAVE":  AlertCircle,
  "OTHER":            FileText,
};

interface WorkTypeSelectorProps {
  employee: Employee;
  initialSubmission: DailyWork | null;
}

export function WorkTypeSelector({ employee, initialSubmission }: WorkTypeSelectorProps) {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<WorkType | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submission, setSubmission] = useState<DailyWork | null>(initialSubmission);

  // Sync server-refreshed data into local state.
  // When router.refresh() re-renders the server component, initialSubmission
  // gets the real DB record — this keeps TodayStatusCard in sync.
  useEffect(() => {
    if (initialSubmission !== null) {
      setSubmission(initialSubmission);
    }
  }, [initialSubmission]);

  const isAlreadySubmitted = submission !== null;

  function handleSubmitClick() {
    if (!selectedType) {
      toast.warning("Select a work type before submitting.");
      return;
    }
    setDialogOpen(true);
  }

  async function handleConfirm() {
    if (!selectedType) return;
    setIsSubmitting(true);

    const result = await submitDailyWork(selectedType, employee.id, employee.employee_id);

    setIsSubmitting(false);
    setDialogOpen(false);

    if (result.success && result.data) {
      setSubmission(result.data);
      toast.success("Work status submitted.");
      // Refresh server components so TodayStatusCard reflects the new submission
      router.refresh();
    } else if (result.error === "ALREADY_SUBMITTED") {
      toast.error(
        `Already submitted today. Contact admin at ${APP_CONFIG.adminContact} for changes.`
      );
      window.location.reload();
    } else {
      toast.error(result.error ?? "Submission failed. Please try again.");
    }
  }

  /* ── Already submitted ─────────────────────────────────── */
  if (isAlreadySubmitted && submission) {
    return null;
  }

  /* ── Work type selector ────────────────────────────────── */
  return (
    <>
      <div className="bg-white border border-border rounded-xl animate-fade-in">
        {/* Header */}
        <div className="px-4 pt-4 pb-3 border-b border-border">
          <p className="text-xs font-semibold text-foreground uppercase tracking-widest">
            Daily Work Submission
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Select your work type and submit once per day.
          </p>
        </div>

        <div className="px-4 py-4 space-y-4">

          {/* Info strip — flat muted */}
          <div className="flex items-start gap-2.5 bg-muted rounded-lg px-4 py-3">
            <div className="w-1 h-1 rounded-full bg-muted-foreground mt-1.5 flex-shrink-0" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              Submissions are{" "}
              <span className="text-foreground font-medium">final</span>{" "}
              and cannot be edited after confirmation.
            </p>
          </div>

          {/* Work type grid — 2 columns, colorful cards */}
          <div className="grid grid-cols-2 gap-2">
            {WORK_TYPES.map((workConfig) => {
              const isSelected = selectedType === workConfig.type;
              const Icon = WORK_ICONS[workConfig.type] ?? FileText;

              return (
                <button
                  key={workConfig.type}
                  id={`work-type-${workConfig.type.toLowerCase().replace(/\s+/g, "-")}`}
                  onClick={() => setSelectedType(workConfig.type)}
                  className={`
                    rounded-lg p-3 text-left border transition-all duration-150
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1
                    touch-target
                    ${isSelected
                      ? `${workConfig.selectedBgClass} ${workConfig.selectedBorderClass} shadow-xs`
                      : `bg-white ${workConfig.borderClass} ${workConfig.bgClass}`
                    }
                  `}
                  aria-pressed={isSelected}
                  aria-label={`Select ${workConfig.label}`}
                >
                  {/* Icon row */}
                  <div className="flex items-center justify-between mb-2">
                    <div
                      className={`w-7 h-7 rounded-md flex items-center justify-center transition-colors ${
                        isSelected
                          ? `bg-white shadow-xs ${workConfig.colorClass}`
                          : `bg-white/80 ${workConfig.colorClass}`
                      }`}
                    >
                      <Icon className="w-4 h-4" strokeWidth={2} />
                    </div>

                    {/* Radio dot */}
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                        isSelected
                          ? `border-transparent ${workConfig.dotClass}`
                          : "border-border/80 bg-white"
                      }`}
                    >
                      {isSelected && (
                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                      )}
                    </div>
                  </div>

                  {/* Label */}
                  <p className={`text-xs font-bold leading-tight ${workConfig.colorClass}`}>
                    {workConfig.label}
                  </p>
                  <p className="text-[10px] mt-0.5 leading-snug text-muted-foreground font-medium">
                    {workConfig.description}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Submit button — flat solid */}
          <button
            id="submit-work-btn"
            onClick={handleSubmitClick}
            disabled={!selectedType || isSubmitting}
            className={`
              w-full h-11 rounded-lg flex items-center justify-center gap-2
              text-sm font-semibold transition-colors duration-150
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
              disabled:opacity-40 disabled:cursor-not-allowed
              ${selectedType
                ? "flat-brand text-white hover:flat-brand-dark active:opacity-90"
                : "bg-muted text-muted-foreground cursor-not-allowed"
              }
            `}
          >
            <Send className="w-3.5 h-3.5" strokeWidth={1.5} />
            {selectedType ? `Submit — ${selectedType}` : "Select a Work Type"}
          </button>

          {/* Selected hint */}
          {selectedType && (
            <p className="text-xs text-center text-muted-foreground -mt-1">
              Tap <strong className="text-foreground">Submit</strong> to confirm your selection.
            </p>
          )}

          {/* Admin line */}
          <p className="text-[10px] text-center text-muted-foreground pt-1">
            Need help? Call admin:{" "}
            <a href={`tel:${APP_CONFIG.adminContact}`} className="text-primary font-medium hover:underline">
              {APP_CONFIG.adminContact}
            </a>
          </p>
        </div>
      </div>

      <ConfirmDialog
        open={dialogOpen}
        workType={selectedType}
        isSubmitting={isSubmitting}
        onConfirm={handleConfirm}
        onCancel={() => setDialogOpen(false)}
      />
    </>
  );
}
