// ============================================================
// Application Constants — Flat design, colorful category themes
// ============================================================

import type { WorkTypeConfig, WorkType } from "@/types";

export const APP_CONFIG = {
  name: "WorkTracker",
  fullName: "Employee Daily Work Tracker",
  company: "Tracker Corp",
  adminContact: "9894058914",
  version: "1.0.0",
} as const;

export const ROUTES = {
  login: "/login",
  dashboard: "/dashboard",
  authCallback: "/auth/callback",
  unauthorized: "/auth/unauthorized",
} as const;

/**
 * Work type configurations — distinct colorful themes for visual clarity.
 * When selected, cards are filled with a light tint related to their border color (not red).
 */
export const WORK_TYPES: WorkTypeConfig[] = [
  {
    type: "OIF",
    label: "OIF",
    icon: "OIF",
    description: "College",
    colorClass: "text-emerald-700",
    bgClass: "bg-emerald-50/50 hover:bg-emerald-50",
    borderClass: "border-emerald-300",
    selectedBgClass: "bg-emerald-100/80",
    selectedBorderClass: "border-emerald-500 ring-2 ring-emerald-500/30",
    dotClass: "bg-emerald-600 border-emerald-600",
  },
  {
    type: "IT",
    label: "IT",
    icon: "IT",
    description: "Internal Training",
    colorClass: "text-blue-700",
    bgClass: "bg-blue-50/50 hover:bg-blue-50",
    borderClass: "border-blue-300",
    selectedBgClass: "bg-blue-100/80",
    selectedBorderClass: "border-blue-500 ring-2 ring-blue-500/30",
    dotClass: "bg-blue-600 border-blue-600",
  },
  {
    type: "TRAVEL",
    label: "Travel",
    icon: "TRV",
    description: "Travel / On-Site",
    colorClass: "text-amber-700",
    bgClass: "bg-amber-50/50 hover:bg-amber-50",
    borderClass: "border-amber-300",
    selectedBgClass: "bg-amber-100/80",
    selectedBorderClass: "border-amber-500 ring-2 ring-amber-500/30",
    dotClass: "bg-amber-600 border-amber-600",
  },
  {
    type: "HALF DAY TRAVEL",
    label: "HD Travel",
    icon: "HDT",
    description: "Half Day Travel",
    colorClass: "text-orange-700",
    bgClass: "bg-orange-50/50 hover:bg-orange-50",
    borderClass: "border-orange-300",
    selectedBgClass: "bg-orange-100/80",
    selectedBorderClass: "border-orange-500 ring-2 ring-orange-500/30",
    dotClass: "bg-orange-600 border-orange-600",
  },
  {
    type: "LEAVE",
    label: "Leave",
    icon: "LVE",
    description: "Planned Leave",
    colorClass: "text-purple-700",
    bgClass: "bg-purple-50/50 hover:bg-purple-50",
    borderClass: "border-purple-300",
    selectedBgClass: "bg-purple-100/80",
    selectedBorderClass: "border-purple-500 ring-2 ring-purple-500/30",
    dotClass: "bg-purple-600 border-purple-600",
  },
  {
    type: "EMERGENCY LEAVE",
    label: "Emergency Leave",
    icon: "EML",
    description: "Emergency / Urgent",
    colorClass: "text-rose-700",
    bgClass: "bg-rose-50/50 hover:bg-rose-50",
    borderClass: "border-rose-300",
    selectedBgClass: "bg-rose-100/80",
    selectedBorderClass: "border-rose-500 ring-2 ring-rose-500/30",
    dotClass: "bg-rose-600 border-rose-600",
  },
  {
    type: "OTHER",
    label: "Other",
    icon: "OTH",
    description: "Other Work Type",
    colorClass: "text-teal-700",
    bgClass: "bg-teal-50/50 hover:bg-teal-50",
    borderClass: "border-teal-300",
    selectedBgClass: "bg-teal-100/80",
    selectedBorderClass: "border-teal-500 ring-2 ring-teal-500/30",
    dotClass: "bg-teal-600 border-teal-600",
  },
] as const;

export function getWorkTypeConfig(type: WorkType): WorkTypeConfig | undefined {
  return WORK_TYPES.find((w) => w.type === type);
}
