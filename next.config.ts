import type { NextConfig } from "next"

const securityHeaders = [
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
]

const noIndexHeaders = [
  {
    key: "X-Robots-Tag",
    value: "noindex, nofollow, noarchive",
  },
]

const nextConfig: NextConfig = {
  poweredByHeader: false,

  images: {
    localPatterns: [
      {
        pathname: "/api/media/google-drive/**",
      },
      {
        pathname: "/gkj-slogohimo-logo.png",
      },
    ],
    formats: ["image/avif", "image/webp"],
    qualities: [60, 75],
    imageSizes: [16, 32, 48, 64, 96, 128, 160, 192, 256, 384],
    minimumCacheTTL: 86400,
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        source: "/admin/:path*",
        headers: noIndexHeaders,
      },
      {
        source: "/api/:path*",
        headers: noIndexHeaders,
      },
      {
        source: "/design-system",
        headers: noIndexHeaders,
      },
    ]
  },
}

export default nextConfig
