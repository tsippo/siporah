import { config, fields, singleton } from "@keystatic/core";
import type { ComponentSchema } from "@keystatic/core";
import nl from "./src/app/[lang]/dictionaries/nl.json";

/**
 * Content editor for the author, at /keystatic.
 *
 * - Locally (npm run dev) it saves straight to the files on disk.
 * - On the live site it saves to GitHub; Vercel then republishes (1–2 min).
 *   Set NEXT_PUBLIC_KEYSTATIC_STORAGE=github to try GitHub mode locally
 *   (needed once, to create the GitHub App).
 */
const useGitHub =
  process.env.NODE_ENV === "production" ||
  process.env.NEXT_PUBLIC_KEYSTATIC_STORAGE === "github";

// ---------------------------------------------------------------------------
// The site texts live in nl.json / en.json. Their editor fields are generated
// from the file itself, so every text is editable and none can be lost on save
// (a field missing from the schema would be dropped when the file is written).
// ---------------------------------------------------------------------------

/** Friendlier names for the sections and some keys; others are derived. */
const LABELS: Record<string, string> = {
  meta: "Search engines & sharing",
  nav: "Menu",
  hero: "Home – top (hero)",
  friends: "Home – photo album",
  items: "Friends",
  book: "Home – the book",
  about: "Page – Who am I?",
  shop: "Page – Shop",
  privacy: "Page – Privacy & cookies",
  footer: "Footer",
  floatingBuy: "Floating 'buy' button",
  notFound: "Page not found (404)",
  splash: "Loading screen text",
  editions: "Editions",
};

const label = (key: string) =>
  LABELS[key] ??
  key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/^./, (c) => c.toUpperCase());

type Json = string | number | boolean | null | Json[] | { [key: string]: Json };

function fieldFor(key: string, value: Json): ComponentSchema {
  if (typeof value === "string") {
    return fields.text({ label: label(key), multiline: value.length > 70 });
  }
  if (Array.isArray(value)) {
    const element = fieldFor(key, value[0]);
    return fields.array(element, {
      label: label(key),
      itemLabel: (props) => {
        // first text inside the item, shortened, as its name in the list
        const p = props as unknown as {
          value?: unknown;
          fields?: Record<string, { value?: unknown }>;
        };
        const first =
          typeof p.value === "string"
            ? p.value
            : (Object.values(p.fields ?? {})
                .map((f) => f.value)
                .find((x) => typeof x === "string") as string | undefined);
        return first ? (first.length > 48 ? `${first.slice(0, 48)}…` : first) : "Item";
      },
    });
  }
  if (value && typeof value === "object") {
    return fields.object(
      Object.fromEntries(Object.entries(value).map(([k, v]) => [k, fieldFor(k, v)])),
      { label: label(key) },
    );
  }
  throw new Error(`Unsupported value for "${key}" in the dictionary`);
}

/** Exported for the test that checks the schema covers every text. */
export const textsSchema = Object.fromEntries(
  Object.entries(nl as Json as Record<string, Json>).map(([k, v]) => [k, fieldFor(k, v)]),
);

const texts = (lang: "nl" | "en", name: string) =>
  singleton({
    label: name,
    path: `src/app/[lang]/dictionaries/${lang}`,
    format: { data: "json" },
    schema: textsSchema,
  });

// ---------------------------------------------------------------------------
// Book editions and the author photo
// ---------------------------------------------------------------------------
const edition = (name: string, slug: string) =>
  fields.object(
    {
      title: fields.text({ label: "Title (as on the cover)" }),
      author: fields.text({ label: "Author" }),
      url: fields.url({
        label: "Amazon link",
        description: "The full address of the book on Amazon, starting with https://",
        validation: { isRequired: true },
      }),
      cover: fields.image({
        label: "Cover",
        description: "Upright image, about 2:3 (e.g. 1200 × 1800 pixels).",
        directory: `public/images/covers/${slug}`,
        publicPath: `/images/covers/${slug}/`,
      }),
    },
    { label: name },
  );

export default config({
  storage: useGitHub
    ? { kind: "github", repo: { owner: "tsippo", name: "siporah" } }
    : { kind: "local" },
  ui: {
    brand: { name: "Tsippo" },
    navigation: {
      "Site texts": ["textsNl", "textsEn"],
      "Book & author": ["book"],
    },
  },
  singletons: {
    textsNl: texts("nl", "Texts – Nederlands"),
    textsEn: texts("en", "Texts – English"),
    book: singleton({
      label: "Book & author photo",
      path: "src/content/book",
      format: { data: "json" },
      schema: {
        authorPhoto: fields.image({
          label: "Author photo (Who am I? page)",
          description: "Upright photo, about 3:4. Leave empty to show the placeholder.",
          directory: "public/images/author",
          publicPath: "/images/author/",
        }),
        editions: fields.object(
          {
            nl: edition("Dutch edition", "nl"),
            en: edition("English edition", "en"),
          },
          { label: "Editions" },
        ),
      },
    }),
  },
});
