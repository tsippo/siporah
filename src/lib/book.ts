import type { Locale } from "@/app/[lang]/dictionaries";

// Everything about the book that is not translated text lives here.
export const BOOK = {
  // Swap these for the book's real Amazon page when it is live.
  url: {
    nl: "https://www.amazon.nl",
    en: "https://www.amazon.com",
  } satisfies Record<Locale, string>,
  // Put the cover in public/images/ and set e.g. "/images/book-cover.jpg".
  // While this is null, a drawn placeholder cover is shown.
  cover: null as string | null,
};
