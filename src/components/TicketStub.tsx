"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { createPortal } from "react-dom";

type Props = {
  href: string;
  label: string;
  newTab: string;
  bonVoyage: string;
  opening: string;
};

// Timeline (ms). Amazon must open soon after the click, or browsers block the new tab.
const WIGGLE = 180;
const OVERLAY_AT = 420;
const OPEN_AT = 800;
const RESET_AT = 1700;

/**
 * The boarding pass stub. Clicking it tears the stub off, fades the page to
 * a "bon voyage" sky with Tsippo, then opens Amazon in a new tab.
 */
export default function TicketStub({ href, label, newTab, bonVoyage, opening }: Props) {
  const [phase, setPhase] = useState<"idle" | "wiggle" | "torn">("idle");
  const [overlay, setOverlay] = useState(false);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const list = timers.current;
    return () => list.forEach(clearTimeout);
  }, []);

  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    // keep normal behaviour for ctrl/cmd/shift/middle clicks and reduced motion
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (phase !== "idle") {
      e.preventDefault();
      return;
    }
    e.preventDefault();

    const at = (ms: number, fn: () => void) => timers.current.push(window.setTimeout(fn, ms));
    setPhase("wiggle");
    at(WIGGLE, () => setPhase("torn"));
    at(OVERLAY_AT, () => setOverlay(true));
    at(OPEN_AT, () => {
      const win = window.open(href, "_blank");
      if (win) win.opener = null;
      else window.location.href = href; // new tab blocked: go in this tab instead
    });
    at(OPEN_AT + 350, () => setOverlay(false));
    at(RESET_AT, () => setPhase("idle"));
  };

  return (
    <div className={`pass-stub${phase !== "idle" ? ` is-${phase}` : ""}`}>
      <a href={href} target="_blank" rel="noopener noreferrer" className="pass-cta" onClick={onClick}>
        {label} <span aria-hidden="true">→</span>
        <span className="sr-only"> ({newTab})</span>
      </a>

      {/* only exists after a click, so it is always rendered in the browser */}
      {phase !== "idle" &&
        createPortal(
          <div className={`voyage${overlay ? " is-shown" : ""}`} aria-hidden={!overlay}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="voyage-bird" src="/images/tsippo-flying.webp" alt="" width={180} height={150} />
            <p className="voyage-title">{bonVoyage}</p>
            <p className="voyage-text" role="status">
              {overlay ? opening : ""}
            </p>
          </div>,
          document.body,
        )}
    </div>
  );
}
