import { describe, expect, it } from "vitest";
import nl from "@/app/[lang]/dictionaries/nl.json";
import en from "@/app/[lang]/dictionaries/en.json";
import { defaultLocale, getDictionary, hasLocale, locales } from "@/app/[lang]/dictionaries";

/** Every leaf path in a nested object, e.g. "book.cta". */
function keys(obj: unknown, prefix = ""): string[] {
  if (obj === null || typeof obj !== "object") return [prefix];
  return Object.entries(obj).flatMap(([k, v]) => keys(v, prefix ? `${prefix}.${k}` : k));
}

function leaves(obj: unknown, prefix = ""): [string, unknown][] {
  if (obj === null || typeof obj !== "object") return [[prefix, obj]];
  return Object.entries(obj).flatMap(([k, v]) => leaves(v, prefix ? `${prefix}.${k}` : k));
}

describe("dictionaries", () => {
  it("Dutch and English have exactly the same keys", () => {
    expect(keys(en).sort()).toEqual(keys(nl).sort());
  });

  it.each([
    ["nl", nl],
    ["en", en],
  ])("%s has no empty texts", (_, dict) => {
    const empty = leaves(dict).filter(([, v]) => typeof v === "string" && v.trim() === "");
    expect(empty.map(([k]) => k)).toEqual([]);
  });

  it("knows which locales exist", () => {
    expect(locales).toEqual(["nl", "en"]);
    expect(defaultLocale).toBe("nl");
    expect(hasLocale("nl")).toBe(true);
    expect(hasLocale("en")).toBe(true);
    expect(hasLocale("de")).toBe(false);
    expect(hasLocale("")).toBe(false);
  });

  it("loads the right dictionary per locale", async () => {
    expect(await getDictionary("nl")).toEqual(nl);
    expect(await getDictionary("en")).toEqual(en);
  });
});
