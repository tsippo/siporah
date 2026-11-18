import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Noto_Serif } from "next/font/google";
import { getDictionary, hasLocale, locales } from "./dictionaries";
import "../globals.css";

const serif = Noto_Serif({
  variable: "--font-tsippo",
  subsets: ["latin"],
  weight: ["700", "800"],
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

  return (
    <html lang={lang} className={`${serif.variable} antialiased`}>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
