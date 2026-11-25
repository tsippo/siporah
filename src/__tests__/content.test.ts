import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import nl from "@/app/[lang]/dictionaries/nl.json";
import en from "@/app/[lang]/dictionaries/en.json";
import {
  flightPath,
  friends,
  PHOTO_W,
  STAGE_H,
  STAGE_W,
  stopNumber,
  stops,
} from "@/components/friends-data";
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

  it("puts every stop and photo on the stage", () => {
    for (const p of stops) {
      expect(p.x).toBeGreaterThanOrEqual(0);
      expect(p.x).toBeLessThanOrEqual(STAGE_W);
      expect(p.y).toBeGreaterThanOrEqual(0);
      expect(p.y).toBeLessThanOrEqual(STAGE_H);
    }
    for (const f of friends) {
      expect(f.photo.x).toBeGreaterThanOrEqual(0);
      expect(f.photo.x + PHOTO_W).toBeLessThanOrEqual(STAGE_W);
    }
  });

  it("flies the route in the agreed order", () => {
    expect(stops.map((s) => s.id)).toEqual([
      "norway", "denmark", "amsterdam", "london", "berlin", "vienna", "budapest",
      "greece", "rome", "switzerland", "paris", "portugal", "sevilla", "tarifa", "merjaZerga",
    ]);
  });

  it("names every stop in both languages and links friends to real stops", () => {
    for (const dict of [nl, en]) {
      for (const p of stops) expect(dict.friends.stops[p.id], p.id).toBeTruthy();
    }
    for (const f of friends) if (f.stop) expect(stopNumber(f.stop)).toBeGreaterThan(0);
  });

  it("no photo covers a pin", () => {
    // a polaroid is about PHOTO_W wide and 300 tall (with the tape); keep pins clear of it
    const H = 300;
    const PAD = 20;
    for (const f of friends) {
      for (const p of stops) {
        const inside =
          p.x > f.photo.x - PAD &&
          p.x < f.photo.x + PHOTO_W + PAD &&
          p.y > f.photo.y - PAD &&
          p.y < f.photo.y + H + PAD;
        expect(inside, `${f.id} photo covers the ${p.id} pin`).toBe(false);
      }
    }
  });

  it("draws the route through every stop, in travel order", () => {
    const path = flightPath();
    expect(path.startsWith(`M ${stops[0].x} ${stops[0].y}`)).toBe(true);
    expect(path.match(/Q /g)).toHaveLength(stops.length - 1);
    for (const p of stops.slice(1)) expect(path).toContain(` ${p.x} ${p.y}`);
    expect(path).not.toContain("NaN");
    expect(path.trimEnd().endsWith(`${stops.at(-1)!.x} ${stops.at(-1)!.y}`)).toBe(true);
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

describe("site address (sharing previews, sitemap)", () => {
  it("prefers the address set by hand", async () => {
    const { siteUrl } = await import("@/lib/site");
    expect(
      siteUrl({ NEXT_PUBLIC_SITE_URL: "https://tsippo.nl/", VERCEL_PROJECT_PRODUCTION_URL: "x.vercel.app" }),
    ).toBe("https://tsippo.nl");
  });

  it("falls back to the Vercel production domain, never localhost on Vercel", async () => {
    const { siteUrl } = await import("@/lib/site");
    expect(siteUrl({ VERCEL_PROJECT_PRODUCTION_URL: "siporah.vercel.app" })).toBe(
      "https://siporah.vercel.app",
    );
    expect(siteUrl({ NEXT_PUBLIC_SITE_URL: "", VERCEL_PROJECT_PRODUCTION_URL: "siporah.vercel.app" })).toBe(
      "https://siporah.vercel.app",
    );
  });

  it("uses the real domain on the live site, not the vercel.app address", async () => {
    const { siteUrl } = await import("@/lib/site");
    expect(
      siteUrl({ VERCEL_ENV: "production", VERCEL_PROJECT_PRODUCTION_URL: "siporah-beta.vercel.app" }),
    ).toBe("https://www.tsippo.com");
  });

  it("uses localhost on your own computer", async () => {
    const { siteUrl } = await import("@/lib/site");
    expect(siteUrl({})).toBe("http://localhost:3000");
  });
});
