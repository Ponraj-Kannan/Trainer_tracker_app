// ============================================================
// TypeScript Type Definitions
// Employee Daily Work Tracker
// ============================================================

/**
 * Employee record from the `employees` table
 */
export interface Employee {
  id: string;
  employee_id: string;
  full_name: string;
  date_of_birth: string | null;
  gender: "Male" | "Female" | "Other" | null;
  personal_email: string;
  contact_number: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Daily work submission record from the `daily_work` table
 */
export interface DailyWork {
  id: string;
  employee_uuid: string;
  employee_id: string;
  work_date: string;
  work_type: WorkType;
  submitted_at: string;
  created_at: string;
}

/**
 * Valid work types employees can submit
 */
export type WorkType =
  | "OIF"
  | "IT"
  | "TRAVEL"
  | "HALF DAY TRAVEL"
  | "LEAVE"
  | "EMERGENCY LEAVE"
  | "OTHER";

/**
 * Authenticated user session data (used across server/client)
 */
export interface AuthUser {
  id: string;
  email: string;
}

/**
 * Combined dashboard data loaded on server
 */
export interface DashboardData {
  employee: Employee;
  todaySubmission: DailyWork | null;
}

/**
 * Server action response wrapper
 */
export interface ActionResult<T = null> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Work type display metadata for UI rendering
 */
export interface WorkTypeConfig {
  type: WorkType;
  label: string;
  icon: string;
  description: string;
  colorClass: string;
  bgClass: string;
  borderClass: string;
  selectedBgClass: string;
  selectedBorderClass: string;
  dotClass: string;
}
