import Link from "next/link";
import { locales, type Dictionary, type Locale } from "@/app/[lang]/dictionaries";
import { BOOK } from "@/lib/book";

type Props = {
  lang: Locale;
  nav: Dictionary["nav"];
  /** Path after the locale, e.g. "/about", so the language switch stays on this page. */
  path?: string;
};

export default function SiteHeader({ lang, nav, path = "" }: Props) {
  return (
    <header className="nav">
      <Link href={`/${lang}`} className="logo">
        Tsippo
      </Link>
      <nav className="nav-links">
        <Link href={`/${lang}#avonturen`}>{nav.adventures}</Link>
        <Link
          href={`/${lang}/about`}
          aria-current={path === "/about" ? "page" : undefined}
        >
          {nav.about}
        </Link>
        <a
          href={BOOK.url[lang]}
          target="_blank"
          rel="noopener noreferrer"
          className="nav-buy"
        >
          {nav.buy}
        </a>
        <span className="lang-switch" aria-label={nav.switchLabel}>
          {locales.map((l) => (
            <Link
              key={l}
              href={`/${l}${path}`}
              hrefLang={l}
              aria-current={l === lang ? "true" : undefined}
            >
              {l.toUpperCase()}
            </Link>
          ))}
        </span>
      </nav>
    </header>
  );
}
