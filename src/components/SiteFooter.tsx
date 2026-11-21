import Image from "next/image";
import Link from "next/link";
import FooterCredit from "./FooterCredit";
import type { Dictionary, Locale } from "@/app/[lang]/dictionaries";

const INSTAGRAM_URL = "https://www.instagram.com/tsippo.books/";

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
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="footer-instagram"
            aria-label={`${t.instagram}: ${t.instagramLabel}`}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="2" />
              <circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" strokeWidth="2" />
              <circle cx="17.4" cy="6.6" r="1.3" fill="currentColor" />
            </svg>
            {t.instagram}
          </a>
        </div>

        {/* to scan with a phone, so only shown on bigger screens */}
        <div className="footer-qr">
          <Image src="/images/instagram-qr.png" alt={t.qrAlt} width={687} height={833} sizes="116px" />
        </div>
      </div>

      <div className="footer-bottom">
        <p>{t.copyright}</p>
        <p className="footer-made">{t.madeWith}</p>
        <a href="#" className="footer-top">
          {t.backToTop} <span aria-hidden="true">↑</span>
        </a>
      </div>

      <FooterCredit text={t.credit} />
    </footer>
  );
}
