// ============================================================
// Google OAuth Callback Handler
// Validates employee authorization after OAuth login
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { ROUTES } from "@/lib/constants";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? ROUTES.dashboard;

  if (!code) {
    console.error("[AUTH CALLBACK] No code parameter in URL");
    return NextResponse.redirect(`${origin}${ROUTES.login}?error=no_code`);
  }

  const supabase = await createClient();

  // ── 1. Exchange code for session ──────────────────────────
  const { data: sessionData, error: sessionError } =
    await supabase.auth.exchangeCodeForSession(code);

  if (sessionError || !sessionData.user) {
    console.error("[AUTH CALLBACK] Session exchange failed:", sessionError?.message);
    return NextResponse.redirect(`${origin}${ROUTES.login}?error=session_failed`);
  }

  const userEmail = sessionData.user.email;
  const userId = sessionData.user.id;

  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("[AUTH CALLBACK] Google login attempt");
  console.log("  Auth User ID :", userId);
  console.log("  Auth Email   :", userEmail);
  console.log("  Email lower  :", userEmail?.toLowerCase());
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  if (!userEmail) {
    console.error("[AUTH CALLBACK] No email returned by Google OAuth");
    await supabase.auth.signOut();
    return NextResponse.redirect(`${origin}${ROUTES.unauthorized}`);
  }

  // ── 2. Check service role key ─────────────────────────────
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error("[AUTH CALLBACK] SUPABASE_SERVICE_ROLE_KEY is not set in .env.local");
    await supabase.auth.signOut();
    return NextResponse.redirect(`${origin}${ROUTES.login}?error=config_error`);
  }

  // ── 3. Query employees table via admin client (bypasses RLS) ─
  const adminClient = await createAdminClient();

  // First: list ALL employees to help debug
  const { data: allEmployees, error: listError } = await adminClient
    .from("employees")
    .select("id, employee_id, full_name, personal_email, is_active");

  if (listError) {
    console.error("[AUTH CALLBACK] Failed to query employees table:", listError.message);
    console.error("  Code:", listError.code);
    console.error("  Hint:", listError.hint);
    await supabase.auth.signOut();
    return NextResponse.redirect(`${origin}${ROUTES.login}?error=db_error`);
  }

  console.log("[AUTH CALLBACK] All employees in DB:");
  if (!allEmployees || allEmployees.length === 0) {
    console.log("  *** NO EMPLOYEES FOUND IN TABLE — is the schema.sql applied? ***");
  } else {
    allEmployees.forEach((emp) => {
      const match = emp.personal_email?.toLowerCase() === userEmail.toLowerCase();
      console.log(
        `  [${match ? "MATCH" : "     "}] ${emp.employee_id} | ${emp.full_name} | "${emp.personal_email}" | active=${emp.is_active}`
      );
    });
  }

  // Exact lookup
  const { data: employee, error: empError } = await adminClient
    .from("employees")
    .select("id, employee_id, full_name, is_active")
    .eq("personal_email", userEmail.toLowerCase())
    .maybeSingle();

  // ── 4. Authorization gate ─────────────────────────────────
  if (empError) {
    console.error("[AUTH CALLBACK] Lookup error:", empError.message);
    await supabase.auth.signOut();
    return NextResponse.redirect(`${origin}${ROUTES.login}?error=db_error`);
  }

  if (!employee) {
    console.warn(
      `[AUTH CALLBACK] DENIED — email "${userEmail}" not found in employees table.`
    );
    console.warn(
      `  Fix: Run this SQL in Supabase → INSERT INTO employees (employee_id, full_name, personal_email, is_active) VALUES ('EMP001', 'Your Name', '${userEmail}', true);`
    );
    await supabase.auth.signOut();
    return NextResponse.redirect(`${origin}${ROUTES.unauthorized}`);
  }

  if (!employee.is_active) {
    console.warn(
      `[AUTH CALLBACK] DENIED — employee "${employee.full_name}" is_active=false`
    );
    console.warn(`  Fix: UPDATE employees SET is_active=true WHERE id='${employee.id}';`);
    await supabase.auth.signOut();
    return NextResponse.redirect(`${origin}${ROUTES.unauthorized}`);
  }

  // ── 5. Access granted ─────────────────────────────────────
  console.log(
    `[AUTH CALLBACK] AUTHORIZED — ${employee.full_name} (${employee.employee_id})`
  );

  const forwardedHost = request.headers.get("x-forwarded-host");
  const isLocalEnv = process.env.NODE_ENV === "development";

  if (isLocalEnv) {
    return NextResponse.redirect(`${origin}${next}`);
  } else if (forwardedHost) {
    return NextResponse.redirect(`https://${forwardedHost}${next}`);
  } else {
    return NextResponse.redirect(`${origin}${next}`);
  }
}
