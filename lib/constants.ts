// ============================================================
// Application Constants — Flat design, no emojis
// ============================================================

import type { WorkTypeConfig, WorkType } from "@/types";

export const APP_CONFIG = {
  name: "WorkTracker",
  fullName: "Employee Daily Work Tracker",
  company: "Tracker Corp",
  adminContact: "98894058914",
  version: "1.0.0",
} as const;

export const ROUTES = {
  login: "/login",
  dashboard: "/dashboard",
  authCallback: "/auth/callback",
  unauthorized: "/auth/unauthorized",
} as const;

/**
 * Work type configurations — flat design palette, no emojis.
 * Selected state overrides to primary rose; these classes apply unselected.
 */
export const WORK_TYPES: WorkTypeConfig[] = [
  {
    type: "OIF",
    label: "OIF",
    icon: "OIF",
    description: "College",
    colorClass: "text-foreground",
    bgClass: "bg-white",
    borderClass: "border-border",
  },
  {
    type: "IT",
    label: "IT",
    icon: "IT",
    description: "Internal Training",
    colorClass: "text-foreground",
    bgClass: "bg-white",
    borderClass: "border-border",
  },
  {
    type: "TRAVEL",
    label: "Travel",
    icon: "TRV",
    description: "Travel / On-Site",
    colorClass: "text-foreground",
    bgClass: "bg-white",
    borderClass: "border-border",
  },
  {
    type: "HALF DAY TRAVEL",
    label: "HD Travel",
    icon: "HDT",
    description: "Half Day Travel",
    colorClass: "text-foreground",
    bgClass: "bg-white",
    borderClass: "border-border",
  },
  {
    type: "LEAVE",
    label: "Leave",
    icon: "LVE",
    description: "Planned Leave",
    colorClass: "text-foreground",
    bgClass: "bg-white",
    borderClass: "border-border",
  },
  {
    type: "EMERGENCY LEAVE",
    label: "Emergency Leave",
    icon: "EML",
    description: "Emergency / Urgent",
    colorClass: "text-foreground",
    bgClass: "bg-white",
    borderClass: "border-border",
  },
  {
    type: "OTHER",
    label: "Other",
    icon: "OTH",
    description: "Other Work Type",
    colorClass: "text-foreground",
    bgClass: "bg-white",
    borderClass: "border-border",
  },
] as const;

export function getWorkTypeConfig(type: WorkType): WorkTypeConfig | undefined {
  return WORK_TYPES.find((w) => w.type === type);
}
