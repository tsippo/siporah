import Image from "next/image";
import { notFound } from "next/navigation";
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
      <SiteHeader lang={lang} nav={t.nav} />

      <Image
        className="art pigeon"
        src="/images/pigeon.png"
        alt={t.hero.pigeonAlt}
        width={172}
        height={148}
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
        width={365}
        height={485}
        loading="eager"
      />

      <Image
        className="art world"
        src="/images/world.png"
        alt={t.hero.worldAlt}
        width={1536}
        height={494}
        sizes="100vw"
        loading="eager"
      />
    </main>

    <FriendsAlbum t={t.friends} />
    </>
  );
}
