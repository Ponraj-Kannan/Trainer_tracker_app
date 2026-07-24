"use server";

// ============================================================
// Daily Work Submission Server Actions
// Employee Daily Work Tracker
// ============================================================

import { createClient } from "@/lib/supabase/server";
import { submitWorkSchema } from "@/lib/validations";
import type { ActionResult, DailyWork } from "@/types";

/**
 * Submits the employee's daily work status.
 *
 * Security:
 * - Validates JWT session server-side
 * - Validates all input via Zod schema
 * - Employee UUID from session — never trusted from client
 * - DB UNIQUE constraint enforces one-per-day
 * - RLS ensures employee can only insert their own record
 */
export async function submitDailyWork(
  workType: string,
  employeeUuid: string,
  employeeId: string
): Promise<ActionResult<DailyWork>> {
  try {
    const supabase = await createClient();

    // 1. Validate the authenticated session
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Unauthorized: No valid session" };
    }

    // 2. Verify the employee UUID belongs to the authenticated user
    //    This prevents a malicious client from submitting for another employee
    const { data: employee, error: empError } = await supabase
      .from("employees")
      .select("id, employee_id, personal_email")
      .eq("id", employeeUuid)
      .eq("personal_email", user.email!)
      .eq("is_active", true)
      .single();

    if (empError || !employee) {
      return {
        success: false,
        error: "Unauthorized: Employee verification failed",
      };
    }

    // 3. Compute today's date in YYYY-MM-DD format (server-side — never trust client)
    const today = new Date().toISOString().split("T")[0];

    // 4. Validate all inputs with Zod
    const validation = submitWorkSchema.safeParse({
      workType,
      employeeUuid,
      employeeId: employee.employee_id,
      workDate: today,
    });

    if (!validation.success) {
      return {
        success: false,
        error: validation.error.issues[0]?.message ?? "Invalid input",
      };
    }

    // 5. Check if already submitted today (double-check before insert)
    const { data: existing } = await supabase
      .from("daily_work")
      .select("id, work_type, submitted_at")
      .eq("employee_uuid", employeeUuid)
      .eq("work_date", today)
      .maybeSingle();

    if (existing) {
      return {
        success: false,
        error: "ALREADY_SUBMITTED",
      };
    }

    // 6. Insert the new submission
    const { data: submission, error: insertError } = await supabase
      .from("daily_work")
      .insert({
        employee_uuid: employeeUuid,
        employee_id: employee.employee_id,
        work_date: today,
        work_type: validation.data.workType,
        submitted_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (insertError) {
      // Handle unique constraint violation (race condition)
      if (insertError.code === "23505") {
        return { success: false, error: "ALREADY_SUBMITTED" };
      }
      console.error("[WORK] Insert error:", insertError.message);
      return { success: false, error: "Failed to submit. Please try again." };
    }

    return { success: true, data: submission as DailyWork };
  } catch (err) {
    console.error("[WORK] Unexpected error:", err);
    return { success: false, error: "An unexpected error occurred." };
  }
}

/**
 * Fetches today's work submission for the given employee.
 */
export async function getTodaySubmission(
  employeeUuid: string
): Promise<ActionResult<DailyWork | null>> {
  try {
    const supabase = await createClient();

    const today = new Date().toISOString().split("T")[0];

    const { data, error } = await supabase
      .from("daily_work")
      .select("*")
      .eq("employee_uuid", employeeUuid)
      .eq("work_date", today)
      .maybeSingle();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data: data as DailyWork | null };
  } catch (err) {
    console.error("[WORK] getTodaySubmission error:", err);
    return { success: false, error: "Failed to fetch submission." };
  }
}
