import Image from "next/image";
import Link from "next/link";
import { lang as rootLang } from "next/root-params";
import SiteHeader from "@/components/SiteHeader";
import { defaultLocale, getDictionary, hasLocale } from "./dictionaries";

export default async function NotFound() {
  const raw = await rootLang();
  // undefined outside the [lang] layout (e.g. under /keystatic)
  const lang = raw && hasLocale(raw) ? raw : defaultLocale;
  const t = await getDictionary(lang);
  const n = t.notFound;

  return (
    <div className="subpage">
      <title>{n.metaTitle}</title>
      <div className="subpage-top">
        <SiteHeader lang={lang} nav={t.nav} />
      </div>

      <main className="lost">
        <div className="lost-art" aria-hidden="true">
          <span className="lost-code">{n.code}</span>
          <Image className="lost-tsippo" src="/images/tsippo-sketch.png" alt="" width={374} height={500} />
          <span className="lost-q lost-q1">?</span>
          <span className="lost-q lost-q2">?</span>
        </div>
        <h1>{n.title}</h1>
        <p>{n.text}</p>
        <div className="cta-row cta-row-center lost-actions">
          <Link href={`/${lang}`} className="cta">
            {n.home} <span aria-hidden="true">→</span>
          </Link>
          <Link href={`/${lang}#avonturen`} className="cta cta-ghost">
            {n.adventures}
          </Link>
        </div>
      </main>
    </div>
  );
}
