import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import SiteHeader from "@/components/SiteHeader";
import { getDictionary, hasLocale } from "../dictionaries";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/privacy">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const t = await getDictionary(lang);
  return {
    title: t.privacy.metaTitle,
    description: t.privacy.metaDescription,
    alternates: { languages: { nl: "/nl/privacy", en: "/en/privacy" } },
  };
}

/** Turns "{email}" in a sentence into a mail link. */
function withEmail(text: string, email: string): ReactNode[] {
  return text.split("{email}").flatMap((part, i) =>
    i === 0 ? [part] : [<a key={i} href={`mailto:${email}`}>{email}</a>, part],
  );
}

export default async function PrivacyPage({ params }: PageProps<"/[lang]/privacy">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = await getDictionary(lang);
  const p = t.privacy;
  const email = t.footer.email;

  return (
    <div className="subpage">
      <div className="subpage-top">
        <SiteHeader lang={lang} nav={t.nav} path="/privacy" />
      </div>

      <main className="privacy">
        <header className="privacy-head">
          <Image
            className="privacy-tsippo"
            src="/images/tsippo-sketch.png"
            alt=""
            width={374}
            height={500}
          />
          <p className="about-eyebrow">{p.eyebrow}</p>
          <h1>{p.title}</h1>
          <p className="privacy-lead">{p.lead}</p>
        </header>

        <div className="privacy-sheet">
          {p.sections.map((s) => (
            <section key={s.title}>
              <h2>{s.title}</h2>
              {s.body.map((text, i) => (
                <p key={i}>{withEmail(text, email)}</p>
              ))}
            </section>
          ))}
          <p className="privacy-contact">
            {p.contact} <a href={`mailto:${email}`}>{email}</a>
          </p>
          <p className="privacy-updated">{p.updated}</p>
        </div>
      </main>
    </div>
  );
}
