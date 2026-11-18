// The live address of the site. Set NEXT_PUBLIC_SITE_URL in the hosting
// settings (e.g. https://tsippo.nl); it is used for sharing previews,
// the sitemap and robots.txt.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
