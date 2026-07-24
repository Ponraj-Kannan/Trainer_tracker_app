// ============================================================
// Profile Page — Employee Profile (mobile-first)
// Accessible via the user icon in the header
// Protected — middleware enforces authentication
// ============================================================

import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { EmployeeInfoCard } from "@/components/dashboard/EmployeeInfoCard";
import { ROUTES, APP_CONFIG } from "@/lib/constants";
import type { Employee } from "@/types";

export const metadata: Metadata = {
  title: `Profile | ${APP_CONFIG.name}`,
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

export default async function ProfilePage() {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user || !user.email) redirect(ROUTES.login);

  const employee = await getEmployeeProfile(user.email);
  if (!employee) redirect(ROUTES.unauthorized);

  return (
    <div className="min-h-screen bg-background flex flex-col">

      {/* ── Profile header with back arrow ────────────────── */}
      <header className="sticky top-0 z-40 bg-white border-b border-border">
        <div className="max-w-lg mx-auto px-4">
          <div className="h-14 flex items-center relative">

            {/* Back arrow — left */}
            <Link
              href={ROUTES.dashboard}
              id="profile-back-btn"
              aria-label="Back to dashboard"
              className="
                flex items-center gap-1.5
                text-sm font-medium text-muted-foreground
                hover:text-foreground transition-colors duration-150
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md px-1
              "
            >
              <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
              <span>Back</span>
            </Link>

            {/* Title — centred */}
            <p className="absolute left-1/2 -translate-x-1/2 text-sm font-semibold text-foreground">
              Profile
            </p>
          </div>
        </div>
      </header>

      {/* ── Content ───────────────────────────────────────── */}
      <main className="flex-1 w-full max-w-lg mx-auto px-4 py-4 sm:py-6 animate-fade-in">
        <EmployeeInfoCard employee={employee} />
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-3 px-4">
        <p className="text-center text-[10px] text-muted-foreground">
          &copy; {new Date().getFullYear()} {APP_CONFIG.company}
        </p>
      </footer>
    </div>
  );
}
