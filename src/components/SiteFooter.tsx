import Image from "next/image";
import Link from "next/link";
import type { Dictionary, Locale } from "@/app/[lang]/dictionaries";

type Props = { lang: Locale; t: Dictionary["footer"]; nav: Dictionary["nav"] };

export default function SiteFooter({ lang, t, nav }: Props) {
  return (
    <footer className="footer">
      <Image
        className="footer-flock"
        src="/images/flock.png"
        alt=""
        width={1200}
        height={400}
        sizes="(max-width: 820px) 150px, 210px"
      />

      <div className="footer-inner">
        <div className="footer-brand">
          <Link href={`/${lang}`} className="footer-logo">
            Tsippo
          </Link>
          <p>{t.tagline}</p>
        </div>

        <nav className="footer-col" aria-label={t.exploreTitle}>
          <h2>{t.exploreTitle}</h2>
          <Link href={`/${lang}#avonturen`}>{nav.adventures}</Link>
          <Link href={`/${lang}/about`}>{nav.about}</Link>
        </nav>

        <div className="footer-col">
          <h2>{t.contactTitle}</h2>
          <a href={`mailto:${t.email}`}>{t.email}</a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>{t.copyright}</p>
        <p className="footer-made">{t.madeWith}</p>
        <a href="#" className="footer-top">
          {t.backToTop} <span aria-hidden="true">↑</span>
        </a>
      </div>

      <p className="footer-credit">{t.credit}</p>
    </footer>
  );
}
