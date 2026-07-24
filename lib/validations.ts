// ============================================================
// Input Validation Schemas (Zod)
// Employee Daily Work Tracker
// ============================================================

import { z } from "zod";

/**
 * Valid work types for server-side validation
 */
export const workTypeSchema = z.enum([
  "OIF",
  "IT",
  "TRAVEL",
  "HALF DAY TRAVEL",
  "LEAVE",
  "EMERGENCY LEAVE",
  "OTHER",
]);

/**
 * Schema for daily work submission
 */
export const submitWorkSchema = z.object({
  workType: workTypeSchema,
  employeeUuid: z.string().uuid("Invalid employee UUID"),
  employeeId: z.string().min(1, "Employee ID is required"),
  workDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
});

export type SubmitWorkInput = z.infer<typeof submitWorkSchema>;
