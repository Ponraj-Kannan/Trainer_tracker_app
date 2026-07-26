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
 * Work type configurations — distinct colorful themes for visual visual clarity
 */
export const WORK_TYPES: WorkTypeConfig[] = [
  {
    type: "OIF",
    label: "OIF",
    icon: "OIF",
    description: "College",
    colorClass: "text-emerald-700",
    bgClass: "bg-emerald-50/80",
    borderClass: "border-emerald-200 hover:border-emerald-400",
  },
  {
    type: "IT",
    label: "IT",
    icon: "IT",
    description: "Internal Training",
    colorClass: "text-blue-700",
    bgClass: "bg-blue-50/80",
    borderClass: "border-blue-200 hover:border-blue-400",
  },
  {
    type: "TRAVEL",
    label: "Travel",
    icon: "TRV",
    description: "Travel / On-Site",
    colorClass: "text-amber-700",
    bgClass: "bg-amber-50/80",
    borderClass: "border-amber-200 hover:border-amber-400",
  },
  {
    type: "HALF DAY TRAVEL",
    label: "HD Travel",
    icon: "HDT",
    description: "Half Day Travel",
    colorClass: "text-orange-700",
    bgClass: "bg-orange-50/80",
    borderClass: "border-orange-200 hover:border-orange-400",
  },
  {
    type: "LEAVE",
    label: "Leave",
    icon: "LVE",
    description: "Planned Leave",
    colorClass: "text-purple-700",
    bgClass: "bg-purple-50/80",
    borderClass: "border-purple-200 hover:border-purple-400",
  },
  {
    type: "EMERGENCY LEAVE",
    label: "Emergency Leave",
    icon: "EML",
    description: "Emergency / Urgent",
    colorClass: "text-rose-700",
    bgClass: "bg-rose-50/80",
    borderClass: "border-rose-200 hover:border-rose-400",
  },
  {
    type: "OTHER",
    label: "Other",
    icon: "OTH",
    description: "Other Work Type",
    colorClass: "text-teal-700",
    bgClass: "bg-teal-50/80",
    borderClass: "border-teal-200 hover:border-teal-400",
  },
] as const;

export function getWorkTypeConfig(type: WorkType): WorkTypeConfig | undefined {
  return WORK_TYPES.find((w) => w.type === type);
}
