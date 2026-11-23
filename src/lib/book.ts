import type { Locale } from "@/app/[lang]/dictionaries";
// Edited by the author in the content editor (/keystatic), see keystatic.config.ts
import content from "@/content/book.json";

export type Edition = {
  /** The book's Amazon page. */
  url: string;
  /** Cover image in public/images/. null = drawn placeholder. */
  cover: string | null;
  /** Title as printed on this edition's cover. */
  title: string;
  author: string;
};

// One book per language. The shop page shows both; elsewhere on the site
// the edition matching the page language is used.
export const EDITIONS: Record<Locale, Edition> = content.editions;

/** The author's photo on the "Wie ben ik?" page. null = placeholder. */
export const AUTHOR_PHOTO: string | null = content.authorPhoto;
