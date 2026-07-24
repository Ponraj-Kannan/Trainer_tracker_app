import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle, ArrowLeft, Phone } from "lucide-react";
import { APP_CONFIG, ROUTES } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Access Denied | ${APP_CONFIG.name}`,
};

/**
 * Unauthorized access page.
 * Shown when a Google-authenticated user is not found in the employees table.
 */
export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen hero-gradient mesh-pattern flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="glass-card rounded-2xl p-8 sm:p-10 text-center">
          {/* Icon */}
          <div className="relative flex items-center justify-center mb-6">
            <div className="absolute w-20 h-20 bg-rose-500/20 rounded-full pulse-ring" />
            <div className="relative w-16 h-16 bg-rose-100 dark:bg-rose-900/40 rounded-2xl flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-rose-600 dark:text-rose-400" />
            </div>
          </div>

          {/* Content */}
          <h1 className="text-xl font-bold text-foreground mb-3">
            Access Denied
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed mb-6">
            You are not authorized to access this application.
            <br />
            Your email address is not registered in our system.
          </p>

          {/* Admin contact */}
          <div className="bg-muted/60 rounded-xl p-4 mb-6">
            <p className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wide">
              Need Access?
            </p>
            <div className="flex items-center justify-center gap-2">
              <Phone className="w-4 h-4 text-primary" />
              <a
                href={`tel:${APP_CONFIG.adminContact}`}
                className="text-primary font-semibold hover:underline"
                aria-label={`Call administrator at ${APP_CONFIG.adminContact}`}
              >
                {APP_CONFIG.adminContact}
              </a>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Contact your administrator to get access
            </p>
          </div>

          {/* Back to login */}
          <Link
            href={ROUTES.login}
            id="back-to-login-btn"
            className="
              inline-flex items-center gap-2
              text-sm font-medium text-primary
              hover:text-primary/80 transition-colors
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md
            "
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Sign In
          </Link>
        </div>

        <p className="text-center text-white/50 text-xs mt-4">
          © {new Date().getFullYear()} {APP_CONFIG.company}
        </p>
      </div>
    </div>
  );
}
