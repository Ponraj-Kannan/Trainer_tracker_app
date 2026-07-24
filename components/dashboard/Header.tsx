"use client";

// ============================================================
// Header — Flat design, mobile-first
// Mobile: logo | clock | [profile icon] [logout icon]
// Desktop: logo+name+id | clock | logout text+icon
// ============================================================

import { signOut } from "@/actions/auth";
import { useLiveClock } from "@/hooks/useLiveClock";
import { Button } from "@/components/ui/button";
import { LogOut, Loader2, UserCircle } from "lucide-react";
import Link from "next/link";
import type { Employee } from "@/types";
import { useState } from "react";

interface HeaderProps {
  employee: Employee;
}

export function Header({ employee }: HeaderProps) {
  const clock = useLiveClock();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const firstName = employee.full_name.split(" ")[0];

  async function handleLogout() {
    setIsLoggingOut(true);
    await signOut();
  }

  return (
    <header className="w-full bg-white border-b border-border sticky top-0 z-40">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <div className="h-14 flex items-center justify-between gap-4">

          {/* ── Left: brand + employee ──────────────────────── */}
          <div className="flex items-center gap-3 min-w-0">
            {/* Flat logo mark */}
            <div className="flex-shrink-0 w-7 h-7 flat-brand rounded-md flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-sm" />
            </div>

            {/* Name + ID — desktop shows more, mobile just shows name */}
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground leading-none mb-0.5 hidden sm:block">
                Welcome
              </p>
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-sm font-semibold text-foreground truncate">
                  {firstName}
                </span>
                <span className="text-xs text-muted-foreground font-mono bg-muted px-1.5 py-0.5 rounded hidden sm:inline-block">
                  {employee.employee_id}
                </span>
              </div>
            </div>
          </div>

          {/* ── Center: live clock ──────────────────────────── */}
          <div className="text-center flex-shrink-0">
            {clock ? (
              <>
                <p className="font-mono text-sm font-semibold text-foreground tabular-nums leading-none">
                  {clock.time}
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5 hidden sm:block">
                  {clock.day}, {clock.dateShort}
                </p>
              </>
            ) : (
              <div className="space-y-1">
                <div className="h-4 w-20 bg-muted rounded animate-pulse" />
                <div className="h-2.5 w-28 bg-muted rounded animate-pulse hidden sm:block" />
              </div>
            )}
          </div>

          {/* ── Right: actions ──────────────────────────────── */}
          <div className="flex items-center gap-1 flex-shrink-0">

            {/* Profile icon — mobile only */}
            <Link
              href="/profile"
              id="profile-icon-btn"
              aria-label="View your profile"
              className="
                lg:hidden
                w-8 h-8 flex items-center justify-center rounded-md
                text-muted-foreground hover:text-foreground hover:bg-muted
                transition-colors duration-150
              "
            >
              <UserCircle className="w-5 h-5" strokeWidth={1.5} />
            </Link>

            {/* Logout button */}
            <Button
              id="logout-btn"
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="
                h-8 px-2.5 gap-1.5
                text-muted-foreground hover:text-foreground
                hover:bg-muted rounded-md
                text-xs font-medium
              "
              aria-label="Sign out"
            >
              {isLoggingOut ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <LogOut className="w-3.5 h-3.5" />
              )}
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
