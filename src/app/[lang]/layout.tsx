import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Caveat, Noto_Sans, Noto_Serif } from "next/font/google";
import SiteFooter from "@/components/SiteFooter";
import FloatingBuy from "@/components/FloatingBuy";
import { getDictionary, hasLocale, locales } from "./dictionaries";
import { SITE_URL } from "@/lib/site";
import "../globals.css";

const serif = Noto_Serif({
  variable: "--font-tsippo",
  subsets: ["latin"],
  weight: ["700", "800"],
});

const hand = Caveat({
  variable: "--font-hand",
  subsets: ["latin"],
  weight: ["700"],
  // not used in the hero, so it should not compete with the hero image
  preload: false,
});

const sans = Noto_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  const image = { url: `/og/${lang}.jpg`, width: 1200, height: 630, alt: dict.meta.title };
  return {
    metadataBase: new URL(SITE_URL),
    title: dict.meta.title,
    description: dict.meta.description,
    alternates: { languages: { nl: "/nl", en: "/en" } },
    // The preview shown when a link is shared (WhatsApp, Facebook, LinkedIn, X…)
    openGraph: {
      type: "website",
      siteName: "Tsippo",
      locale: lang === "nl" ? "nl_NL" : "en_GB",
      title: dict.meta.title,
      description: dict.meta.description,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: dict.meta.title,
      description: dict.meta.description,
      images: [image.url],
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = await getDictionary(lang);

  return (
    <html lang={lang} className={`${serif.variable} ${hand.variable} ${sans.variable} antialiased`}>
      <body suppressHydrationWarning>
        {children}
        <SiteFooter lang={lang} t={t.footer} nav={t.nav} />
        <FloatingBuy href={`/${lang}/shop`} label={t.floatingBuy} />
      </body>
    </html>
  );
}
