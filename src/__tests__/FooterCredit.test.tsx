import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import FooterCredit from "@/components/FooterCredit";

const nav = vi.hoisted(() => ({ pathname: "/nl" }));
vi.mock("next/navigation", () => ({ usePathname: () => nav.pathname }));

const credit = "Website gemaakt door Abdulrahman Sadek";

describe("FooterCredit", () => {
  it.each(["/nl/about", "/en/about"])("is shown on the about page (%s)", (path) => {
    nav.pathname = path;
    render(<FooterCredit text={credit} />);
    expect(screen.getByText(credit)).toBeInTheDocument();
  });

  it.each(["/nl", "/en/shop", "/nl/onbekend"])("is hidden on %s", (path) => {
    nav.pathname = path;
    render(<FooterCredit text={credit} />);
    expect(screen.queryByText(credit)).not.toBeInTheDocument();
  });
});
