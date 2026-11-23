import { describe, expect, it } from "vitest";
import nl from "@/app/[lang]/dictionaries/nl.json";
import en from "@/app/[lang]/dictionaries/en.json";
import book from "@/content/book.json";
import cms, { textsSchema } from "../../keystatic.config";

type Field = { kind: string; fields?: Record<string, Field>; element?: Field };

/** Paths of every text in a dictionary that the editor has no field for. */
function uncovered(value: unknown, field: Field | undefined, path: string): string[] {
  if (!field) return [path];
  if (Array.isArray(value)) {
    if (field.kind !== "array") return [path];
    return value.flatMap((v, i) => uncovered(v, field.element, `${path}[${i}]`));
  }
  if (value && typeof value === "object") {
    if (field.kind !== "object") return [path];
    return Object.entries(value).flatMap(([k, v]) => uncovered(v, field.fields?.[k], `${path}.${k}`));
  }
  return field.kind === "form" ? [] : [path];
}

const root = { kind: "object", fields: textsSchema } as unknown as Field;

describe("content editor (Keystatic)", () => {
  it.each([
    ["nl", nl],
    ["en", en],
  ])("has a field for every %s text, so saving never drops one", (_, dict) => {
    expect(uncovered(dict, root, "")).toEqual([]);
  });

  it("edits the files the site actually reads", () => {
    const s = cms.singletons!;
    expect(s.textsNl.path).toBe("src/app/[lang]/dictionaries/nl");
    expect(s.textsEn.path).toBe("src/app/[lang]/dictionaries/en");
    expect(s.book.path).toBe("src/content/book");
  });

  it("covers sit where the image field looks for them", () => {
    // Keystatic only recognises an image that lives under the field's publicPath;
    // anything else shows as empty and would be erased on the next save.
    for (const [lang, e] of Object.entries(book.editions)) {
      expect(e.cover.startsWith(`/images/covers/${lang}/`), e.cover).toBe(true);
    }
  });

  it("works on local files in development", () => {
    expect(cms.storage.kind).toBe("local");
  });
});
