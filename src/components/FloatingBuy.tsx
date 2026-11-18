"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type Props = { href: string; label: string };

/**
 * A round "stamp" in the corner that appears once the visitor scrolls past
 * the top of the page. It links to the shop page, steps aside while the
 * book section is on screen, and is not shown on the shop page itself.
 */
export default function FloatingBuy({ href, label }: Props) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [bookVisible, setBookVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.7);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const book = document.getElementById("boek");
    const io = book
      ? new IntersectionObserver(([e]) => setBookVisible(e.isIntersecting), { threshold: 0.2 })
      : null;
    if (book && io) io.observe(book);

    return () => {
      window.removeEventListener("scroll", onScroll);
      io?.disconnect();
    };
  }, [pathname]);

  if (pathname === href) return null;
  const show = scrolled && !bookVisible;

  return (
    <Link
      href={href}
      className={`float-buy${show ? " is-shown" : ""}`}
      tabIndex={show ? 0 : -1}
      aria-hidden={!show}
    >
      <span className="float-buy-plane" aria-hidden="true">
        ✈
      </span>
      <span className="float-buy-text">{label}</span>
    </Link>
  );
}
