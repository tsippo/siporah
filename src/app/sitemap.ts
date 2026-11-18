import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

const pages = ["", "/about", "/shop"];

// Each page in both languages, telling search engines they belong together.
export default function sitemap(): MetadataRoute.Sitemap {
  return pages.flatMap((page) =>
    (["nl", "en"] as const).map((lang) => ({
      url: `${SITE_URL}/${lang}${page}`,
      changeFrequency: "monthly" as const,
      priority: page === "" ? 1 : 0.7,
      alternates: {
        languages: {
          nl: `${SITE_URL}/nl${page}`,
          en: `${SITE_URL}/en${page}`,
        },
      },
    })),
  );
}
