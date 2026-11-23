/**
 * The live address of the site, used for sharing previews, the sitemap and
 * robots.txt.
 *
 * 1. NEXT_PUBLIC_SITE_URL, if set in the hosting settings (e.g. https://tsippo.nl)
 * 2. otherwise, on Vercel, the project's production domain (VERCEL_PROJECT_PRODUCTION_URL,
 *    set by Vercel on every build, also for previews)
 * 3. otherwise (on your own computer) http://localhost:3000
 */
export function siteUrl(env: Record<string, string | undefined> = process.env) {
  const url =
    env.NEXT_PUBLIC_SITE_URL ||
    (env.VERCEL_PROJECT_PRODUCTION_URL && `https://${env.VERCEL_PROJECT_PRODUCTION_URL}`) ||
    "http://localhost:3000";
  return url.replace(/\/$/, "");
}

export const SITE_URL = siteUrl();
