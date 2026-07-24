"use server";

// ============================================================
// Authentication Server Actions
// Employee Daily Work Tracker
// ============================================================

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ROUTES } from "@/lib/constants";

/**
 * Initiates Google OAuth sign-in flow.
 * Redirects to Google's consent screen.
 */
export async function signInWithGoogle() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });

  if (error) {
    console.error("[AUTH] signInWithGoogle error:", error.message);
    redirect(`${ROUTES.login}?error=oauth_failed`);
  }

  if (data.url) {
    redirect(data.url);
  }
}

/**
 * Signs out the current user and redirects to login.
 */
export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect(ROUTES.login);
}
