import type { Locale } from "@/app/[lang]/dictionaries";

export type Edition = {
  /** The book's Amazon page. Swap in the real product link when it is live. */
  url: string;
  /** Cover image in public/images/, e.g. "/images/book-cover-nl.jpg". null = drawn placeholder. */
  cover: string | null;
  /** Title as printed on this edition's cover. */
  title: string;
  author: string;
};

// One book per language. The shop page shows both; elsewhere on the site
// the edition matching the page language is used.
export const EDITIONS: Record<Locale, Edition> = {
  nl: {
    url: "https://www.amazon.nl",
    cover: null,
    title: "Tsippo ontdekt de wereld",
    author: "Lorem Ipsum",
  },
  en: {
    url: "https://www.amazon.com",
    cover: null,
    title: "Tsippo explores the world",
    author: "Lorem Ipsum",
  },
};
