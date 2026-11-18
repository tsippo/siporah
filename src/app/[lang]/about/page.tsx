import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import { getDictionary, hasLocale } from "../dictionaries";

// Put the author's photo in public/images/ and set its path here,
// e.g. "/images/author.jpg". While this is null, a placeholder is shown.
const AUTHOR_PHOTO: string | null = null;

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/about">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const t = await getDictionary(lang);
  return {
    title: t.about.metaTitle,
    description: t.about.lead,
    alternates: { languages: { nl: "/nl/about", en: "/en/about" } },
  };
}

export default async function AboutPage({ params }: PageProps<"/[lang]/about">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = await getDictionary(lang);
  const a = t.about;

  return (
    <div className="subpage">
      <div className="subpage-top">
        <SiteHeader lang={lang} nav={t.nav} path="/about" />
      </div>

      <main className="about">
        <div className="about-grid">
          <figure className="author">
            <div className="author-frame">
              {AUTHOR_PHOTO ? (
                <Image
                  src={AUTHOR_PHOTO}
                  alt={a.photoAlt}
                  fill
                  sizes="(max-width: 820px) 80vw, 420px"
                  className="author-img"
                  loading="eager"
                />
              ) : (
                <div className="author-placeholder">
                  <svg viewBox="0 0 48 48" aria-hidden="true">
                    <path
                      d="M16 12l3-5h10l3 5h6a4 4 0 0 1 4 4v20a4 4 0 0 1-4 4H10a4 4 0 0 1-4-4V16a4 4 0 0 1 4-4z"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinejoin="round"
                    />
                    <circle cx="24" cy="26" r="7.5" fill="none" stroke="currentColor" strokeWidth="2.5" />
                  </svg>
                  <span>{a.photoPlaceholder}</span>
                </div>
              )}
            </div>
            <figcaption>{a.photoCaption}</figcaption>
            <Image
              className="author-tsippo"
              src="/images/tsippo-sketch.png"
              alt=""
              width={374}
              height={500}
            />
          </figure>

          <div className="about-text">
            <p className="about-eyebrow">{a.eyebrow}</p>
            <h1>{a.title}</h1>
            <p className="about-lead">{a.lead}</p>
            {a.body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
            <p className="about-sign">{a.signoff}</p>
          </div>
        </div>

        <section className="about-facts" aria-labelledby="facts-title">
          <h2 id="facts-title">{a.factsTitle}</h2>
          <ul>
            {a.facts.map((f, i) => (
              <li key={i}>
                <span className="fact-num">{i + 1}</span>
                <strong>{f.label}</strong>
                <span>{f.text}</span>
              </li>
            ))}
          </ul>
          <Link href={`/${lang}#avonturen`} className="cta">
            {a.cta} <span aria-hidden="true">→</span>
          </Link>
        </section>
      </main>
    </div>
  );
}
