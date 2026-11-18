const dictionaries = {
  nl: () => import("./dictionaries/nl.json").then((m) => m.default),
  en: () => import("./dictionaries/en.json").then((m) => m.default),
};

export type Locale = keyof typeof dictionaries;
export type Dictionary = Awaited<ReturnType<(typeof dictionaries)["nl"]>>;

export const locales = Object.keys(dictionaries) as Locale[];
export const defaultLocale: Locale = "nl";

export const hasLocale = (locale: string): locale is Locale =>
  locale in dictionaries;

export const getDictionary = (locale: Locale) => dictionaries[locale]();
