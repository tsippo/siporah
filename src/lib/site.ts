/**
 * The live address of the site, used for sharing previews, the sitemap and
 * robots.txt.
 *
 * 1. NEXT_PUBLIC_SITE_URL, if set in the hosting settings
 * 2. the live site on Vercel: the real domain (Vercel's own variable below would
 *    give the *.vercel.app address, not the domain)
 * 3. other Vercel builds (previews): the project's production address
 * 4. otherwise (on your own computer) http://localhost:3000
 */
export const PRODUCTION_URL = "https://www.tsippo.com";

export function siteUrl(env: Record<string, string | undefined> = process.env) {
  const url =
    env.NEXT_PUBLIC_SITE_URL ||
    (env.VERCEL_ENV === "production" && PRODUCTION_URL) ||
    (env.VERCEL_PROJECT_PRODUCTION_URL && `https://${env.VERCEL_PROJECT_PRODUCTION_URL}`) ||
    "http://localhost:3000";
  return url.replace(/\/$/, "");
}

export const SITE_URL = siteUrl();
