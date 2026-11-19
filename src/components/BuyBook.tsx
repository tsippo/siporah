import Image from "next/image";
import type { Dictionary, Locale } from "@/app/[lang]/dictionaries";
import { EDITIONS } from "@/lib/book";
import BookCover from "./BookCover";
import TicketStub from "./TicketStub";

type Props = { lang: Locale; t: Dictionary["book"] };

// Little peeks at the adventures, fanned out behind the book.
const peeks = [
  { src: "/images/friends/mike.png", w: 900, h: 624, tint: "#fbe6d4" },
  { src: "/images/friends/carmen.png", w: 597, h: 900, tint: "#fde0de" },
  { src: "/images/friends/matteo.png", w: 900, h: 682, tint: "#fdf0cf" },
];

export default function BuyBook({ lang, t }: Props) {
  const edition = EDITIONS[lang];
  const href = edition.url;

  return (
    <section id="boek" className="buy">
      <div className="buy-grid">
        <div className="buy-visual">
          {peeks.map((p, i) => (
            <span key={p.src} className={`buy-peek buy-peek-${i + 1}`} style={{ background: p.tint }}>
              <Image src={p.src} alt="" width={p.w} height={p.h} sizes="160px" />
            </span>
          ))}

          <BookCover edition={edition} label={`${t.cta} (${t.newTab})`} coverAlt={t.coverAlt} />

          <Image
            className="book-tsippo"
            src="/images/tsippo-sketch.png"
            alt=""
            width={374}
            height={500}
          />
        </div>

        <div className="buy-copy">
          <p className="buy-eyebrow">{t.eyebrow}</p>
          <h2>{t.title}</h2>
          <p className="buy-text">{t.text}</p>

          <div className="pass">
            <div className="pass-main">
              <div className="pass-head">
                <span>✈ {t.airline}</span>
                <span>{t.pass}</span>
              </div>
              <dl className="pass-fields">
                <div className="pass-wide">
                  <dt>{t.passengerLabel}</dt>
                  <dd>{t.passenger}</dd>
                </div>
                <div>
                  <dt>{t.fromLabel}</dt>
                  <dd>{t.from}</dd>
                </div>
                <div>
                  <dt>{t.toLabel}</dt>
                  <dd>{t.to}</dd>
                </div>
                <div>
                  <dt>{t.gateLabel}</dt>
                  <dd>{t.gate}</dd>
                </div>
                <div>
                  <dt>{t.seatLabel}</dt>
                  <dd>{t.seat}</dd>
                </div>
              </dl>
              <span className="pass-barcode" aria-hidden="true" />
            </div>

            <TicketStub
              href={href}
              label={t.cta}
              newTab={t.newTab}
              bonVoyage={t.bonVoyage}
              opening={t.opening}
            />

            <span className="pass-stamp" aria-hidden="true">
              {t.gift}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
