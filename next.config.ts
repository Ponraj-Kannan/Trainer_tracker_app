import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ── Security Headers ──────────────────────────────────────
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Prevents clickjacking attacks
          { key: "X-Frame-Options", value: "DENY" },
          // Prevents MIME type sniffing
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Controls referrer information
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Permissions policy
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          // XSS protection for older browsers
          { key: "X-XSS-Protection", value: "1; mode=block" },
          // HSTS — force HTTPS
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },

  // ── Image optimization ────────────────────────────────────
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com", // Google profile images
      },
    ],
  },
};

export default nextConfig;
