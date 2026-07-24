import type { Metadata } from "next";
import { LoginCard } from "@/components/auth/LoginCard";
import { APP_CONFIG } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Sign In | ${APP_CONFIG.name}`,
  description: "Sign in to your employee work tracker dashboard using your registered Google account.",
};

interface LoginPageProps {
  searchParams: Promise<{ error?: string; redirected?: string }>;
}

/**
 * Login page — server component that reads error state from URL params
 * and passes it to the client-side LoginCard.
 */
export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;

  const errorMessages: Record<string, string> = {
    unauthorized:
      "You are not authorized to access this application. Please contact the administrator.",
    oauth_failed:
      "Google sign-in failed. Please try again.",
    session_failed:
      "Failed to establish a session. Please try again.",
    no_code:
      "Authentication was incomplete. Please try signing in again.",
  };

  const errorMessage = params.error ? errorMessages[params.error] ?? null : null;

  return <LoginCard errorMessage={errorMessage} />;
}
