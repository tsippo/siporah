import { NextResponse, type NextRequest } from "next/server";
import { LOCALE_COOKIE } from "@/lib/locale-cookie";

const locales = ["nl", "en"];
const defaultLocale = "nl";

// 1. The language the visitor picked before (cookie from the NL/EN switch).
// 2. Otherwise English only when the browser ranks it above Dutch; else Dutch.
function getLocale(request: NextRequest) {
  const saved = request.cookies.get(LOCALE_COOKIE)?.value;
  if (saved && locales.includes(saved)) return saved;

  const header = request.headers.get("accept-language") ?? "";
  const ranked = header
    .split(",")
    .map((part) => {
      const [tag, q] = part.trim().split(";q=");
      return { lang: tag.slice(0, 2).toLowerCase(), q: q ? Number(q) : 1 };
    })
    .sort((a, b) => b.q - a.q);
  return ranked.find((r) => locales.includes(r.lang))?.lang ?? defaultLocale;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasLocale = locales.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`),
  );
  if (hasLocale) return;

  request.nextUrl.pathname = `/${getLocale(request)}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  // Skip Next internals and any file with an extension (images, favicon…)
  matcher: ["/((?!_next|.*\\..*).*)"],
};
