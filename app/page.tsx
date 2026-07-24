// ============================================================
// Root Page — Smart redirect based on auth state
// ============================================================

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ROUTES } from "@/lib/constants";

/**
 * Root page performs a server-side auth check and redirects:
 * - Authenticated user → /dashboard
 * - Unauthenticated → /login
 */
export default async function RootPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect(ROUTES.dashboard);
  } else {
    redirect(ROUTES.login);
  }
}
