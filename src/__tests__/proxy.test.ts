// @vitest-environment node
import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { proxy } from "@/proxy";

const request = (path: string, acceptLanguage?: string) =>
  new NextRequest(`https://tsippo.test${path}`, {
    headers: acceptLanguage ? { "accept-language": acceptLanguage } : {},
  });

const redirectTarget = (res: Response | undefined) => res?.headers.get("location");

describe("proxy (language redirect)", () => {
  it("leaves pages that already have a language alone", () => {
    expect(proxy(request("/nl"))).toBeUndefined();
    expect(proxy(request("/en/shop"))).toBeUndefined();
    expect(proxy(request("/nl/about"))).toBeUndefined();
  });

  it("sends visitors without a language preference to Dutch", () => {
    const res = proxy(request("/"));
    expect(res?.status).toBe(307);
    expect(redirectTarget(res)).toBe("https://tsippo.test/nl");
  });

  it("sends English browsers to English and keeps the path", () => {
    expect(redirectTarget(proxy(request("/shop", "en-GB,en;q=0.9")))).toBe(
      "https://tsippo.test/en/shop",
    );
  });

  it("respects the order of preference", () => {
    expect(redirectTarget(proxy(request("/", "nl;q=0.5,en;q=0.8")))).toBe("https://tsippo.test/en");
    expect(redirectTarget(proxy(request("/", "en;q=0.5,nl-NL")))).toBe("https://tsippo.test/nl");
  });

  it("falls back to Dutch for languages the site does not have", () => {
    expect(redirectTarget(proxy(request("/about", "de-DE,fr;q=0.8")))).toBe(
      "https://tsippo.test/nl/about",
    );
  });

  it("does not mistake paths that only start with a locale", () => {
    // "/english" is not "/en"
    expect(redirectTarget(proxy(request("/english")))).toBe("https://tsippo.test/nl/english");
  });
});
