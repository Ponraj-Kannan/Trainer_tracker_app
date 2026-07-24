// ============================================================
// Dashboard Page — Protected Route
// Server Component: fetches employee data and today's submission
// ============================================================

import { redirect } from "next/navigation";
import { Suspense } from "react";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/dashboard/Header";
import { EmployeeInfoCard } from "@/components/dashboard/EmployeeInfoCard";
import { TodayStatusCard } from "@/components/dashboard/TodayStatusCard";
import { WorkTypeSelector } from "@/components/dashboard/WorkTypeSelector";
import { DashboardSkeleton } from "@/components/shared/LoadingSkeleton";
import { ROUTES, APP_CONFIG } from "@/lib/constants";
import type { Employee, DailyWork } from "@/types";

export const metadata: Metadata = {
  title: `Dashboard | ${APP_CONFIG.name}`,
  description: "Your daily work tracking dashboard",
};

export const dynamic = "force-dynamic";

async function getEmployeeProfile(email: string): Promise<Employee | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("employees")
    .select("*")
    .eq("personal_email", email.toLowerCase())
    .eq("is_active", true)
    .single();
  if (error) return null;
  return data as Employee;
}

async function getTodaySubmission(employeeUuid: string): Promise<DailyWork | null> {
  const supabase = await createClient();
  const today = new Date().toISOString().split("T")[0];
  const { data, error } = await supabase
    .from("daily_work")
    .select("*")
    .eq("employee_uuid", employeeUuid)
    .eq("work_date", today)
    .maybeSingle();
  if (error) return null;
  return data as DailyWork | null;
}

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user || !user.email) redirect(ROUTES.login);

  const employee = await getEmployeeProfile(user.email);
  if (!employee) redirect(ROUTES.unauthorized);

  const todaySubmission = await getTodaySubmission(employee.id);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header employee={employee} />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-8">

        {/* Page heading — desktop only */}
        <div className="hidden lg:block mb-6 animate-fade-in">
          <h2 className="text-xl font-bold text-foreground">
            Daily Work Dashboard
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Track and submit your work status for today
          </p>
        </div>

        <Suspense fallback={<DashboardSkeleton />}>

          {/* ── Mobile layout: Today's Status → Work Submission ── */}
          {/* Employee profile is hidden — accessible via profile icon */}
          <div className="space-y-3 lg:hidden animate-fade-in">
            <TodayStatusCard submission={todaySubmission} />
            <WorkTypeSelector employee={employee} initialSubmission={todaySubmission} />
          </div>

          {/* ── Desktop layout: 3-column grid ───────────────────── */}
          <div className="hidden lg:grid lg:grid-cols-3 lg:gap-6">
            {/* Left column: Profile + Status */}
            <div className="lg:col-span-1 space-y-5">
              <EmployeeInfoCard employee={employee} />
              <TodayStatusCard submission={todaySubmission} />
            </div>

            {/* Right column: Work Submission */}
            <div className="lg:col-span-2">
              <WorkTypeSelector employee={employee} initialSubmission={todaySubmission} />
            </div>
          </div>

        </Suspense>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-6 py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1">
          <p className="text-[10px] text-muted-foreground">
            &copy; {new Date().getFullYear()} {APP_CONFIG.company}
          </p>
          <p className="text-[10px] text-muted-foreground">
            v{APP_CONFIG.version}
          </p>
        </div>
      </footer>
    </div>
  );
}
