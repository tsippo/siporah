import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import nl from "@/app/[lang]/dictionaries/nl.json";
import en from "@/app/[lang]/dictionaries/en.json";
import { flightPath, friends, STAGE_H, STAGE_W } from "@/components/friends-data";
import { EDITIONS } from "@/lib/book";
import { locales } from "@/app/[lang]/dictionaries";

const publicFile = (src: string) => join(process.cwd(), "public", src);

describe("book editions", () => {
  it.each(locales)("%s edition is complete", (lang) => {
    const e = EDITIONS[lang];
    expect(e.url).toMatch(/^https:\/\//);
    expect(e.title.trim()).not.toBe("");
    expect(e.author.trim()).not.toBe("");
    if (e.cover) expect(existsSync(publicFile(e.cover)), e.cover).toBe(true);
  });
});

describe("friends album", () => {
  it("has unique ids", () => {
    const ids = friends.map((f) => f.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it.each(friends.map((f) => [f.id, f] as const))("%s has its picture and texts", (id, f) => {
    expect(existsSync(publicFile(f.image)), f.image).toBe(true);
    for (const dict of [nl, en]) {
      const item = dict.friends.items[id];
      expect(item, `missing text for ${id}`).toBeDefined();
      expect(item.caption && item.text && item.alt && item.greeting).toBeTruthy();
    }
  });

  it("puts every pin and photo on the stage", () => {
    for (const f of friends) {
      if (f.pin) {
        expect(f.pin.x).toBeGreaterThanOrEqual(0);
        expect(f.pin.x).toBeLessThanOrEqual(STAGE_W);
        expect(f.pin.y).toBeGreaterThanOrEqual(0);
        expect(f.pin.y).toBeLessThanOrEqual(STAGE_H);
      }
      expect(f.photo.x).toBeGreaterThanOrEqual(0);
      expect(f.photo.x).toBeLessThan(STAGE_W);
    }
  });

  it("draws the route through every pin, in travel order", () => {
    const pins = friends.flatMap((f) => (f.pin ? [f.pin] : []));
    const path = flightPath();
    expect(path.startsWith(`M ${pins[0].x} ${pins[0].y}`)).toBe(true);
    expect(path.match(/Q /g)).toHaveLength(pins.length - 1);
    for (const p of pins.slice(1)) expect(path).toContain(` ${p.x} ${p.y}`);
    expect(path).not.toContain("NaN");
    expect(path.trimEnd().endsWith(`${pins.at(-1)!.x} ${pins.at(-1)!.y}`)).toBe(true);
  });
});

describe("privacy page", () => {
  it.each([
    ["nl", nl],
    ["en", en],
  ])("%s names everything we store, so the policy stays true", async (_, dict) => {
    const { SPLASH_KEY } = await import("@/lib/splash");
    const { LOCALE_COOKIE } = await import("@/lib/locale-cookie");
    const text = JSON.stringify(dict.privacy.sections);
    expect(text).toContain(SPLASH_KEY);
    expect(text).toContain(LOCALE_COOKIE);
    expect(text).toContain("{email}");
  });
});
