import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Caveat, Noto_Serif } from "next/font/google";
import SiteFooter from "@/components/SiteFooter";
import FloatingBuy from "@/components/FloatingBuy";
import { BOOK } from "@/lib/book";
import { getDictionary, hasLocale, locales } from "./dictionaries";
import "../globals.css";

const serif = Noto_Serif({
  variable: "--font-tsippo",
  subsets: ["latin"],
  weight: ["700", "800"],
});

const hand = Caveat({
  variable: "--font-hand",
  subsets: ["latin"],
  weight: ["500", "700"],
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
  return {
    title: dict.meta.title,
    description: dict.meta.description,
    alternates: { languages: { nl: "/nl", en: "/en" } },
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
    <html lang={lang} className={`${serif.variable} ${hand.variable} antialiased`}>
      <body suppressHydrationWarning>
        {children}
        <SiteFooter lang={lang} t={t.footer} nav={t.nav} />
        <FloatingBuy href={BOOK.url[lang]} label={t.floatingBuy} newTab={t.book.newTab} />
      </body>
    </html>
  );
}
