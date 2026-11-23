// @vitest-environment node
import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import nextConfig from "../../next.config";
import { proxy } from "@/proxy";

async function headersFor(path: string) {
  const rules = (await nextConfig.headers!()) ?? [];
  // the first rule whose source matches (same patterns Next.js uses)
  const match = rules.find((r) =>
    r.source.startsWith("/((?!")
      ? !/^\/(keystatic|api\/keystatic)/.test(path)
      : path.startsWith(r.source.replace("/:path*", "")),
  );
  return Object.fromEntries((match?.headers ?? []).map((h) => [h.key, h.value]));
}

describe("security headers", () => {
  it.each(["/nl", "/en/shop", "/keystatic", "/api/keystatic/github/login"])(
    "%s gets the protective headers",
    async (path) => {
      const h = await headersFor(path);
      expect(h["Strict-Transport-Security"]).toMatch(/max-age=\d{8,}/);
      expect(h["X-Frame-Options"]).toBe("DENY");
      expect(h["X-Content-Type-Options"]).toBe("nosniff");
      expect(h["Referrer-Policy"]).toBe("strict-origin-when-cross-origin");
      expect(h["Permissions-Policy"]).toContain("camera=()");
      const csp = h["Content-Security-Policy"];
      expect(csp).toContain("default-src 'self'");
      expect(csp).toContain("frame-ancestors 'none'");
      expect(csp).toContain("object-src 'none'");
      expect(csp).not.toContain("unsafe-eval"); // only allowed in development
    },
  );

  it("the website itself loads nothing from other servers", async () => {
    const csp = (await headersFor("/nl"))["Content-Security-Policy"];
    expect(csp).not.toMatch(/https?:\/\//);
  });

  it("only the editor may talk to GitHub, and it is kept out of search engines", async () => {
    const h = await headersFor("/keystatic");
    expect(h["Content-Security-Policy"]).toContain("connect-src 'self' https://api.github.com");
    expect(h["X-Robots-Tag"]).toBe("noindex, nofollow");
  });

  it("does not advertise the framework", () => {
    expect(nextConfig.poweredByHeader).toBe(false);
  });
});

describe("language redirect cannot be abused", () => {
  it.each(["//evil.example", "/\\evil.example", "//evil.example/nl"])(
    "keeps %s on this site",
    (path) => {
      const res = proxy(new NextRequest(`https://tsippo.test${path}`));
      const location = res?.headers.get("location");
      if (location) expect(new URL(location).host).toBe("tsippo.test");
    },
  );
});
