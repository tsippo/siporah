import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import SiteHeader from "@/components/SiteHeader";
import nl from "@/app/[lang]/dictionaries/nl.json";
import en from "@/app/[lang]/dictionaries/en.json";

describe("SiteHeader", () => {
  it("links to the pages in the current language", () => {
    render(<SiteHeader lang="en" nav={en.nav} />);
    expect(screen.getByRole("link", { name: "Tsippo" })).toHaveAttribute("href", "/en");
    expect(screen.getByRole("link", { name: en.nav.about })).toHaveAttribute("href", "/en/about");
    expect(screen.getByRole("link", { name: en.nav.buy })).toHaveAttribute("href", "/en/shop");
    expect(screen.getByRole("link", { name: en.nav.adventures })).toHaveAttribute(
      "href",
      "/en#avonturen",
    );
  });

  it("marks the current page", () => {
    render(<SiteHeader lang="nl" nav={nl.nav} path="/shop" />);
    expect(screen.getByRole("link", { name: nl.nav.buy })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: nl.nav.about })).not.toHaveAttribute("aria-current");
  });

  it("language switch stays on the same page", () => {
    render(<SiteHeader lang="nl" nav={nl.nav} path="/about" />);
    const sw = within(screen.getByLabelText(nl.nav.switchLabel));
    expect(sw.getByRole("link", { name: "NL" })).toHaveAttribute("href", "/nl/about");
    expect(sw.getByRole("link", { name: "NL" })).toHaveAttribute("aria-current", "true");
    expect(sw.getByRole("link", { name: "EN" })).toHaveAttribute("href", "/en/about");
    expect(sw.getByRole("link", { name: "EN" })).toHaveAttribute("hreflang", "en");
  });
});
