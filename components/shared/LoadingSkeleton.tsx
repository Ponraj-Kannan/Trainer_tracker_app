"use client";

// ============================================================
// Loading Skeleton Components
// Used while dashboard data is loading
// ============================================================

import { Skeleton } from "@/components/ui/skeleton";

/**
 * Dashboard skeleton — mimics the layout of the actual dashboard
 */
export function DashboardSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column skeletons */}
        <div className="lg:col-span-1 space-y-4">
          {/* Employee card skeleton */}
          <div className="bg-card border border-border/60 rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Skeleton className="w-5 h-5 rounded" />
              <Skeleton className="h-5 w-36" />
              <Skeleton className="h-5 w-16 ml-auto rounded-full" />
            </div>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-start gap-3 py-3 border-b border-border/50 last:border-0">
                <Skeleton className="w-8 h-8 rounded-lg flex-shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-4 w-48" />
                </div>
              </div>
            ))}
          </div>

          {/* Status card skeleton */}
          <div className="bg-card border border-border/60 rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Skeleton className="w-5 h-5 rounded" />
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-5 w-16 ml-auto rounded-full" />
            </div>
            <div className="flex flex-col items-center py-6 gap-3">
              <Skeleton className="w-12 h-12 rounded-full" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        </div>

        {/* Right column skeleton */}
        <div className="lg:col-span-2">
          <div className="bg-card border border-border/60 rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Skeleton className="w-5 h-5 rounded" />
              <Skeleton className="h-5 w-40" />
            </div>
            <Skeleton className="h-3 w-64 mb-5" />
            <Skeleton className="h-12 w-full rounded-xl mb-4" />
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
              {Array.from({ length: 7 }).map((_, i) => (
                <Skeleton key={i} className="h-24 rounded-xl" />
              ))}
            </div>
            <Skeleton className="h-11 w-full rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
