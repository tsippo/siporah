"use client";

import { useEffect, useState } from "react";

type Props = { href: string; label: string; newTab: string };

/**
 * A round "stamp" in the corner that appears once the visitor scrolls past
 * the top of the page, and steps aside while the book section is on screen.
 */
export default function FloatingBuy({ href, label, newTab }: Props) {
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
  }, []);

  const show = scrolled && !bookVisible;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`float-buy${show ? " is-shown" : ""}`}
      aria-label={`${label} (${newTab})`}
      tabIndex={show ? 0 : -1}
      aria-hidden={!show}
    >
      <span className="float-buy-plane" aria-hidden="true">
        ✈
      </span>
      <span className="float-buy-text">{label}</span>
    </a>
  );
}
