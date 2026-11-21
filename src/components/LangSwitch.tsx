"use client";

import { LOCALE_COOKIE, LOCALE_COOKIE_MAX_AGE } from "@/lib/locale-cookie";

type Props = {
  lang: string;
  locales: readonly string[];
  /** Path after the locale, e.g. "/about", so the switch stays on this page. */
  path: string;
  label: string;
};

/** Saves the visitor's choice, so the bare address opens in that language next time. */
function remember(locale: string) {
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${LOCALE_COOKIE}=${locale}; Path=/; Max-Age=${LOCALE_COOKIE_MAX_AGE}; SameSite=Lax${secure}`;
}

export default function LangSwitch({ lang, locales, path, label }: Props) {
  return (
    <span className="lang-switch" aria-label={label}>
      {/* Plain <a>, not <Link>: switching language reloads the page so the
          root layout (<html lang>, the head script) comes fresh from the server.
          Re-rendering it in the browser makes React warn about that script. */}
      {locales.map((l) => (
        <a
          key={l}
          href={`/${l}${path}`}
          hrefLang={l}
          aria-current={l === lang ? "true" : undefined}
          onClick={() => remember(l)}
        >
          {l.toUpperCase()}
        </a>
      ))}
    </span>
  );
}
