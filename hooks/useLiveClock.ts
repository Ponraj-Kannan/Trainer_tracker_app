"use client";

// ============================================================
// Live Clock Hook
// Auto-refreshes every second
// ============================================================

import { useState, useEffect } from "react";

export interface LiveClockData {
  time: string;       // e.g. "10:35:20 AM"
  date: string;       // e.g. "Friday, 24 July 2026"
  day: string;        // e.g. "Friday"
  dateShort: string;  // e.g. "24 July 2026"
}

/**
 * Hook that returns live time data, updated every second.
 * Handles SSR safely by starting with null and hydrating on mount.
 */
export function useLiveClock(): LiveClockData | null {
  const [clockData, setClockData] = useState<LiveClockData | null>(null);

  useEffect(() => {
    const formatClock = (): LiveClockData => {
      const now = new Date();

      const time = now.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });

      const day = now.toLocaleDateString("en-IN", { weekday: "long" });
      const dateShort = now.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      const date = `${day}, ${dateShort}`;

      return { time, date, day, dateShort };
    };

    // Set immediately to avoid delay
    setClockData(formatClock());

    const interval = setInterval(() => {
      setClockData(formatClock());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return clockData;
}
