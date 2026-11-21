"use client";

import { usePathname } from "next/navigation";

/** The website credit, shown only on the "Wie ben ik?" (about) page. */
export default function FooterCredit({ text }: { text: string }) {
  const pathname = usePathname();
  if (!pathname?.endsWith("/about")) return null;
  return <p className="footer-credit">{text}</p>;
}
