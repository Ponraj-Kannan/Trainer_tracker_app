"use client";

// ============================================================
// Login Card — Flat design, no emojis, mobile-first
// ============================================================

import { useState } from "react";
import { signInWithGoogle } from "@/actions/auth";
import { APP_CONFIG } from "@/lib/constants";
import { Loader2, Shield } from "lucide-react";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

interface LoginCardProps {
  errorMessage?: string | null;
}

export function LoginCard({ errorMessage }: LoginCardProps) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleGoogleSignIn() {
    setIsLoading(true);
    try {
      await signInWithGoogle();
    } catch {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-background">

      {/* ── Brand Panel — flat solid color ──────────────── */}
      <div className="flat-brand lg:w-5/12 xl:w-2/5 flex flex-col justify-between px-8 py-12 lg:py-16 lg:px-14">

        {/* Logo mark */}
        <div>
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mb-8">
            <div className="w-5 h-5 bg-white rounded-sm" />
          </div>
          <p className="text-white/50 text-xs font-medium tracking-widest uppercase mb-1">
            {APP_CONFIG.company}
          </p>
          <h1 className="text-white text-2xl lg:text-3xl font-bold leading-snug">
            {APP_CONFIG.name}
          </h1>
          <p className="text-white/60 text-sm mt-3 leading-relaxed max-w-xs">
            Secure daily work status tracking for your organisation.
          </p>
        </div>

        {/* Feature list */}
        <div className="hidden lg:block space-y-4 mt-10">
          {[
            "Google OAuth — no passwords stored",
            "One submission per calendar day",
            "Restricted to registered employees only",
          ].map((item) => (
            <div key={item} className="flex items-start gap-3">
              <div className="w-1 h-1 rounded-full bg-white/50 mt-2 flex-shrink-0" />
              <p className="text-white/65 text-sm leading-relaxed">{item}</p>
            </div>
          ))}
        </div>

        <p className="hidden lg:block text-white/30 text-xs mt-10">
          {APP_CONFIG.company} &copy; {new Date().getFullYear()}
        </p>
      </div>

      {/* ── Sign-In Panel — flat white ───────────────────── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 lg:py-0 bg-white">
        <div className="w-full max-w-sm animate-fade-in">

          {/* Mobile header */}
          <div className="mb-10 lg:mb-8">
            <p className="text-muted-foreground text-xs font-medium tracking-widest uppercase mb-2">
              Sign In
            </p>
            <h2 className="text-xl font-bold text-foreground">
              Welcome back
            </h2>
            <p className="text-muted-foreground text-sm mt-2 leading-relaxed">
              Sign in with your registered work email to continue.
            </p>
          </div>

          {/* Error */}
          {errorMessage && (
            <div className="mb-6 p-4 bg-destructive/8 border border-destructive/20 rounded-lg">
              <p className="text-destructive text-sm leading-relaxed">
                {errorMessage}
              </p>
            </div>
          )}

          {/* Google button — flat, clean */}
          <button
            id="google-signin-btn"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="
              w-full flex items-center justify-center gap-3
              h-11 px-5 rounded-lg
              bg-white border border-border
              text-foreground text-sm font-medium
              hover:bg-muted transition-colors duration-150
              active:bg-secondary
              disabled:opacity-50 disabled:cursor-not-allowed
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
            "
            aria-label="Continue with Google"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <GoogleIcon />
                <span>Continue with Google</span>
              </>
            )}
          </button>

          {/* Divider */}
          <div className="flat-divider my-7" />

          {/* Notice */}
          <div className="flex items-start gap-3">
            <Shield className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              Access is limited to{" "}
              <span className="text-foreground font-medium">
                registered employees
              </span>
              . Contact your administrator if you need access.
            </p>
          </div>

          {/* Mobile footer */}
          <p className="lg:hidden text-xs text-muted-foreground mt-10">
            {APP_CONFIG.company} &copy; {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  );
}
