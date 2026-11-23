import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

/**
 * Content Security Policy: which sources the browser may load anything from.
 * The site only uses its own files, so everything else is blocked.
 *
 * 'unsafe-inline' for scripts: Next.js and the loading-screen script use inline
 * scripts. The nonce-based alternative forces every page to render per request
 * (no static pages); this site has no visitor input to inject into, so the
 * static variant from the Next.js CSP guide is the right trade-off.
 */
function csp(extra: { connect?: string; img?: string; style?: string; font?: string } = {}) {
  return [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
    `style-src 'self' 'unsafe-inline'${extra.style ? ` ${extra.style}` : ""}`,
    `img-src 'self' blob: data:${extra.img ? ` ${extra.img}` : ""}`,
    `font-src 'self'${extra.font ? ` ${extra.font}` : ""}`,
    `connect-src 'self'${extra.connect ? ` ${extra.connect}` : ""}`,
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    ...(isDev ? [] : ["upgrade-insecure-requests"]),
  ].join("; ");
}

/** Sent with every response. */
const securityHeaders = [
  // only ever talk to this site over HTTPS (2 years)
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  // never let another site show this one in a frame (clickjacking)
  { key: "X-Frame-Options", value: "DENY" },
  // don't guess file types (stops disguised scripts)
  { key: "X-Content-Type-Options", value: "nosniff" },
  // other sites only see "tsippo…", never the full page address
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // the site needs none of these, so no page (or injected code) can ask for them
  {
    key: "Permissions-Policy",
    value:
      "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=(), browsing-topics=()",
  },
];

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // don't advertise "X-Powered-By: Next.js" to attackers
  poweredByHeader: false,
  images: {
    // AVIF is smaller; browsers without AVIF support get WebP.
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      {
        // the website
        source: "/((?!keystatic|api/keystatic).*)",
        headers: [
          ...securityHeaders,
          { key: "Content-Security-Policy", value: csp() },
          // pages opened from here (Amazon, Instagram) can't reach back into this tab
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
        ],
      },
      ...["/keystatic/:path*", "/api/keystatic/:path*"].map((source) => ({
        // the content editor also talks to GitHub, shows GitHub avatars and
        // loads its own font (Inter) from Google; visitors never load this page
        source,
        headers: [
          ...securityHeaders,
          {
            key: "Content-Security-Policy",
            value: csp({
              connect: "https://api.github.com",
              img: "https://avatars.githubusercontent.com https://*.githubusercontent.com",
              style: "https://fonts.googleapis.com",
              font: "https://fonts.gstatic.com",
            }),
          },
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
      })),
    ];
  },
};

export default nextConfig;
