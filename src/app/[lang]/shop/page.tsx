import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import BookCover from "@/components/BookCover";
import SiteHeader from "@/components/SiteHeader";
import { EDITIONS } from "@/lib/book";
import { getDictionary, hasLocale, locales } from "../dictionaries";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/shop">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const t = await getDictionary(lang);
  return {
    title: t.shop.metaTitle,
    description: t.shop.lead,
    alternates: { languages: { nl: "/nl/shop", en: "/en/shop" } },
  };
}

export default async function ShopPage({ params }: PageProps<"/[lang]/shop">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = await getDictionary(lang);
  const s = t.shop;

  // Show the visitor's own language first.
  const order = [lang, ...locales.filter((l) => l !== lang)];

  return (
    <div className="subpage">
      <div className="subpage-top">
        <SiteHeader lang={lang} nav={t.nav} path="/shop" />
      </div>

      <main className="shop">
        <header className="shop-head">
          <p className="about-eyebrow">{s.eyebrow}</p>
          <h1>{s.title}</h1>
          <p className="shop-lead">{s.lead}</p>
        </header>

        <ul className="shop-books">
          {order.map((code) => {
            const edition = EDITIONS[code];
            const e = s.editions[code];
            return (
              <li key={code} className="shop-card">
                <span className="shop-lang">{e.language}</span>
                <div className="shop-book">
                  <BookCover
                    edition={edition}
                    label={`${e.cta} (${s.newTab})`}
                    coverAlt={e.coverAlt}
                  />
                </div>
                <p className="shop-edition">{e.edition}</p>
                <h2 lang={code}>{edition.title}</h2>
                <p className="shop-text">{e.text}</p>
                <a
                  href={edition.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cta shop-cta"
                >
                  {e.cta} <span aria-hidden="true">→</span>
                  <span className="sr-only"> ({s.newTab})</span>
                </a>
              </li>
            );
          })}
        </ul>

        <div className="shop-gift">
          <Image src="/images/tsippo-sketch.png" alt="" width={374} height={500} />
          <span>{s.gift}</span>
        </div>
      </main>
    </div>
  );
}
