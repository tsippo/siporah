import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import BookCover from "@/components/BookCover";
import { EDITIONS, type Edition } from "@/lib/book";

describe("BookCover", () => {
  it("opens the Amazon page safely in a new tab", () => {
    render(<BookCover edition={EDITIONS.nl} label="Koop het boek" coverAlt="Omslag" />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", EDITIONS.nl.url);
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", expect.stringContaining("noopener"));
    // the accessible name starts with the visible title (WCAG "label in name")
    expect(link).toHaveAccessibleName(`${EDITIONS.nl.title}: Koop het boek`);
  });

  it("shows the real cover when there is one", () => {
    render(<BookCover edition={EDITIONS.en} label="Buy" coverAlt="The cover" />);
    expect(screen.getByAltText("The cover")).toBeInTheDocument();
  });

  it("draws a placeholder cover when there is no image yet", () => {
    const edition: Edition = { ...EDITIONS.en, cover: null };
    render(<BookCover edition={edition} label="Buy" coverAlt="The cover" />);
    expect(screen.queryByAltText("The cover")).not.toBeInTheDocument();
    expect(screen.getByText(edition.title)).toBeInTheDocument();
    expect(screen.getByText(edition.author)).toBeInTheDocument();
  });
});
