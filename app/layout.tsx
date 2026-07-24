import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { APP_CONFIG } from "@/lib/constants";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: APP_CONFIG.fullName,
    template: `%s | ${APP_CONFIG.name}`,
  },
  description:
    "Secure employee daily work status tracking application. Log your work type once per day with enterprise-grade security.",
  keywords: ["employee tracker", "work status", "attendance", "daily work log"],
  robots: { index: false, follow: false }, // Private enterprise app
};

/**
 * Root layout — applies global font, theme, and toast provider.
 * Does NOT include auth logic — that's handled by middleware + page components.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
        <Toaster
          position="top-right"
          richColors
          closeButton
          toastOptions={{
            duration: 4000,
            style: {
              borderRadius: "0.75rem",
            },
          }}
        />
      </body>
    </html>
  );
}
