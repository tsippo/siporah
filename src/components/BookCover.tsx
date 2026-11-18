import Image from "next/image";
import type { Edition } from "@/lib/book";

type Props = {
  edition: Edition;
  /** Accessible name for the link, e.g. "Buy the book (opens Amazon in a new tab)". */
  label: string;
  coverAlt: string;
};

/** The book as a clickable object that opens its Amazon page. */
export default function BookCover({ edition, label, coverAlt }: Props) {
  return (
    <a href={edition.url} target="_blank" rel="noopener noreferrer" className="book" aria-label={`${edition.title}: ${label}`}>
      {edition.cover ? (
        <Image src={edition.cover} alt={coverAlt} fill sizes="320px" className="book-cover-img" />
      ) : (
        <span className="book-cover">
          <span className="book-title">{edition.title}</span>
          <Image className="book-art" src="/images/tsippo-compass.png" alt="" width={816} height={1100} sizes="200px" />
          <span className="book-author">{edition.author}</span>
        </span>
      )}
    </a>
  );
}
