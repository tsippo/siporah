"use client";

import { useEffect } from "react";
import { SPLASH_KEY } from "@/lib/splash";

const MIN_MS = 900; // long enough to see Tsippo fly
const MAX_MS = 2500; // never keep visitors waiting longer than this

/**
 * A short loading screen with Tsippo flying through the clouds.
 * Shown once per visit; a tiny script in the layout skips it before the
 * first paint when it has already been seen.
 */
export default function Splash({ text }: { text: string }) {
  useEffect(() => {
    const html = document.documentElement;
    if (html.classList.contains("splash-skip")) return;

    const shownAt = performance.now();
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      const wait = Math.max(0, MIN_MS - (performance.now() - shownAt));
      setTimeout(() => {
        html.classList.add("splash-done");
        try {
          sessionStorage.setItem(SPLASH_KEY, "1");
        } catch {}
        setTimeout(() => html.classList.add("splash-skip"), 600);
      }, wait);
    };

    if (document.readyState === "complete") finish();
    else window.addEventListener("load", finish, { once: true });
    const cap = setTimeout(finish, MAX_MS);
    return () => {
      clearTimeout(cap);
      window.removeEventListener("load", finish);
    };
  }, []);

  return (
    <div className="splash" aria-hidden="true">
      <span className="splash-cloud splash-cloud-1" />
      <span className="splash-cloud splash-cloud-2" />
      <span className="splash-cloud splash-cloud-3" />
      <div className="splash-center">
        <span className="splash-trail" />
        {/* plain img: it must appear instantly, before anything else loads */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="splash-bird" src="/images/tsippo-flying.webp" alt="" width={180} height={150} />
        <p className="splash-logo">Tsippo</p>
        <p className="splash-text">{text}</p>
      </div>
    </div>
  );
}
