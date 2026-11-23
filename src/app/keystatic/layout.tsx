import type { Metadata } from "next";
import KeystaticApp from "./keystatic";

export const metadata: Metadata = {
  title: "Tsippo – editor",
  robots: { index: false, follow: false },
};

// The content editor has its own root layout: it is not part of the site.
export default function KeystaticLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning: browser extensions (e.g. Grammarly) add attributes
    // to <html>/<body> before React loads; that is not an error in the site
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <KeystaticApp />
        {children}
      </body>
    </html>
  );
}
