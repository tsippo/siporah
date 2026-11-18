import Image from "next/image";
import { notFound } from "next/navigation";
import BuyBook from "@/components/BuyBook";
import FriendsAlbum from "@/components/FriendsAlbum";
import SiteHeader from "@/components/SiteHeader";
import { getDictionary, hasLocale } from "./dictionaries";

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = await getDictionary(lang);

  return (
    <>
      <main className="hero">
        <div className="hero-canvas">
          <SiteHeader lang={lang} nav={t.nav} />

          <Image
            className="art pigeon"
            src="/images/pigeon.png"
            alt={t.hero.pigeonAlt}
            width={149}
            height={127}
            sizes="(max-width: 900px) 120px, 149px"
          />

          <div className="copy">
            <h1>
              <span className="title-top">{t.hero.titleTop}</span>
              <span className="title-bottom">{t.hero.titleBottom}</span>
            </h1>
            <p>
              {t.hero.line1}
              <br />
              {t.hero.line2}
            </p>
            <a href="#avonturen" className="cta">
              {t.hero.cta} <span aria-hidden="true">→</span>
            </a>
          </div>

          <Image
            className="art compass"
            src="/images/tsippo-compass.png"
            alt={t.hero.birdAlt}
            width={816}
            height={1100}
            sizes="(max-width: 900px) 330px, (min-width: 1920px) 435px, 23vw"
            loading="eager"
          />

          <Image
            className="art world"
            src="/images/world.png"
            alt={t.hero.worldAlt}
            width={1536}
            height={494}
            sizes="(max-width: 900px) 150vw, (min-width: 1920px) 1920px, 100vw"
            loading="eager"
            fetchPriority="high"
          />
        </div>
      </main>

      <FriendsAlbum t={t.friends} />
      <BuyBook lang={lang} t={t.book} />
    </>
  );
}
