"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import {
  friends,
  flightPath,
  MAP_TOP,
  PHOTO_W,
  STAGE_H,
  STAGE_W,
  type FriendId,
} from "./friends-data";

type Item = { caption: string; greeting: string; text: string; alt: string };

export type FriendsText = {
  eyebrow: string;
  title: string;
  intro: string;
  hint: string;
  flipHint: string;
  signoff: string;
  mapAlt: string;
  items: Record<FriendId, Item>;
};

const route = flightPath();

// Flying Tsippo on the route, in stage units
const BIRD_W = 128;
const BIRD_H = (BIRD_W * 300) / 360;
const LEG_SECONDS = 15; // one trip along the route; then he flies back
const START_DELAY_MS = 3400; // wait until the route has drawn itself

export default function FriendsAlbum({ t }: { t: FriendsText }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const routeRef = useRef<SVGPathElement>(null);
  const birdRef = useRef<SVGGElement>(null);
  const [inView, setInView] = useState(false);
  const [flipped, setFlipped] = useState<FriendId | null>(null);

  // Draw the flight path the first time the map scrolls into view.
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Tsippo flies the route, turns around at the end and flies back.
  // Only runs while the map is on screen.
  useEffect(() => {
    const path = routeRef.current;
    const bird = birdRef.current;
    const stage = stageRef.current;
    if (!inView || !path || !bird || !stage) return;

    const len = path.getTotalLength();
    const place = (dist: number, forward: boolean, bob: number) => {
      const p = path.getPointAtLength(dist);
      const q = path.getPointAtLength(Math.min(len, Math.max(0, dist + (forward ? 6 : -6))));
      const goingLeft = q.x < p.x;
      let angle = (Math.atan2(q.y - p.y, q.x - p.x) * 180) / Math.PI;
      if (goingLeft) angle -= 180;
      angle = ((angle + 540) % 360) - 180;
      const tilt = Math.max(-24, Math.min(24, angle));
      bird.setAttribute(
        "transform",
        `translate(${p.x.toFixed(1)} ${(p.y + bob).toFixed(1)}) rotate(${tilt.toFixed(1)}) scale(${goingLeft ? -1 : 1} 1)`,
      );
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      place(0, true, 0);
      bird.classList.add("is-flying");
      return;
    }

    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(stage);

    let raf = 0;
    let elapsed = 0;
    let last = performance.now();
    const startAt = last + START_DELAY_MS;
    const ease = (t: number) => 0.5 - Math.cos(Math.PI * t) / 2;

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const dt = now - last;
      last = now;
      if (now < startAt || !visible || document.hidden) return;
      elapsed += dt;
      const leg = elapsed / 1000 / LEG_SECONDS;
      const forward = Math.floor(leg) % 2 === 0;
      const t = leg % 1;
      const along = forward ? ease(t) : 1 - ease(t);
      place(along * len, forward, Math.sin(now / 260) * 5);
      bird.classList.add("is-flying");
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [inView]);

  return (
    <section id="avonturen" className="album">
      <div className="album-head">
        <Image
          className="album-sketch"
          src="/images/tsippo-sketch.png"
          alt=""
          width={374}
          height={500}
        />
        <span className="album-bubble">{t.hint}</span>
        <p className="album-eyebrow">{t.eyebrow}</p>
        <h2>{t.title}</h2>
        <p className="album-intro">{t.intro}</p>
        <Image
          className="album-flock"
          src="/images/flock.png"
          alt=""
          width={1200}
          height={400}
          sizes="(max-width: 820px) 200px, 260px"
        />
      </div>

      <div
        ref={stageRef}
        className={`album-stage${inView ? " is-in-view" : ""}`}
      >
        <div className="album-canvas">
        <Image
          className="album-map"
          src="/images/europe-map.png"
          alt={t.mapAlt}
          width={1536}
          height={1024}
          sizes="(max-width: 820px) 100vw, 1200px"
          style={{ top: `${(MAP_TOP / STAGE_H) * 100}%` }}
        />

        <svg
          className="album-lines"
          viewBox={`0 0 ${STAGE_W} ${STAGE_H}`}
          aria-hidden="true"
        >
          <defs>
            {/* a solid stroke that "draws" over the dashed route */}
            <mask id="route-reveal" maskUnits="userSpaceOnUse">
              <path
                className="route-draw"
                d={route}
                pathLength={1}
                fill="none"
                stroke="#fff"
                strokeWidth={14}
              />
            </mask>
          </defs>

          {/* strings from each pin up to the tape on its photo */}
          {friends.map((f) =>
            f.pin ? (
              <path
                key={f.id}
                className="album-string"
                d={`M ${f.pin.x} ${f.pin.y} Q ${(f.pin.x + f.photo.x + PHOTO_W / 2) / 2} ${
                  Math.max(f.pin.y, f.photo.y) + 30
                } ${f.photo.x + PHOTO_W / 2} ${f.photo.y + 14}`}
              />
            ) : null,
          )}

          <path ref={routeRef} className="route" d={route} mask="url(#route-reveal)" />


          {friends.map((f, i) => {
            if (!f.pin) return null;
            return (
              <g key={f.id} className="album-pin" transform={`translate(${f.pin.x} ${f.pin.y})`}>
                <circle className="pin-pulse" r={18} />
                <circle className="pin-dot" r={15} />
                <text className="pin-num" y={5.5}>
                  {i + 1}
                </text>
              </g>
            );
          })}
          <g ref={birdRef} className="route-bird">
            {/* scaled up on phones via CSS, around the bird's anchor point */}
            <g className="route-bird-art">
              <image
                href="/images/tsippo-flying.webp"
                x={-BIRD_W / 2}
                y={-BIRD_H * 0.62}
                width={BIRD_W}
                height={BIRD_H}
              />
            </g>
          </g>
        </svg>
        </div>

        <ul className="album-photos">
          {friends.map((f, i) => {
            const item = t.items[f.id];
            const isFlipped = flipped === f.id;
            return (
              <li
                key={f.id}
                className="photo-slot"
                style={
                  {
                    "--x": f.photo.x,
                    "--y": f.photo.y,
                    "--tilt": `${f.photo.tilt}deg`,
                    "--tint": f.tint,
                    "--delay": `${i * 90}ms`,
                  } as CSSProperties
                }
              >
                <button
                  type="button"
                  className={`photo${isFlipped ? " is-flipped" : ""}`}
                  aria-pressed={isFlipped}
                  aria-label={`${item.caption}. ${isFlipped ? item.text : t.flipHint}`}
                  onClick={() => setFlipped(isFlipped ? null : f.id)}
                >
                  <span className="photo-inner">
                    <span className="photo-face photo-front">
                      <span className="photo-img">
                        <Image
                          src={f.image}
                          alt={item.alt}
                          width={f.width}
                          height={f.height}
                          sizes="(max-width: 820px) 70vw, 260px"
                        />
                      </span>
                      <span className="photo-caption">
                        {f.pin && <span className="photo-num">{i + 1}</span>}
                        {item.caption}
                      </span>
                    </span>
                    <span className="photo-face photo-back" aria-hidden="true">
                      <span className="postcard-stamp">
                        <Image src={f.image} alt="" width={f.width} height={f.height} sizes="60px" />
                      </span>
                      <span className="postcard-greeting">{item.greeting}</span>
                      <span className="postcard-text">{item.text}</span>
                      <span className="postcard-sign">{t.signoff}</span>
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
