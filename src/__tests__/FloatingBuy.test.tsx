import { act, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import FloatingBuy from "@/components/FloatingBuy";

const nav = vi.hoisted(() => ({ pathname: "/nl" }));
vi.mock("next/navigation", () => ({ usePathname: () => nav.pathname }));

const button = () => screen.queryByRole("link", { hidden: true });

function scrollTo(y: number) {
  Object.defineProperty(window, "scrollY", { value: y, configurable: true });
  act(() => {
    window.dispatchEvent(new Event("scroll"));
  });
}

describe("FloatingBuy", () => {
  beforeEach(() => {
    nav.pathname = "/nl";
    Object.defineProperty(window, "innerHeight", { value: 800, configurable: true });
    Object.defineProperty(window, "scrollY", { value: 0, configurable: true });
  });

  it("is hidden at the top of the page", () => {
    render(<FloatingBuy href="/nl/shop" label="Koop het boek" />);
    expect(button()).toHaveAttribute("aria-hidden", "true");
    expect(button()).toHaveAttribute("tabindex", "-1");
    expect(button()).not.toHaveClass("is-shown");
  });

  it("appears after scrolling down and links to the shop", () => {
    render(<FloatingBuy href="/nl/shop" label="Koop het boek" />);
    scrollTo(1000);
    expect(button()).toHaveClass("is-shown");
    expect(button()).toHaveAttribute("aria-hidden", "false");
    expect(button()).toHaveAttribute("href", "/nl/shop");
    scrollTo(100);
    expect(button()).not.toHaveClass("is-shown");
  });

  it("steps aside while the book section is on screen", () => {
    const section = document.createElement("section");
    section.id = "boek";
    document.body.append(section);
    render(<FloatingBuy href="/nl/shop" label="Koop het boek" />);
    scrollTo(1000);

    // next/link has observers of its own (for prefetching): find the one watching the section
    type FakeIO = { cb: IntersectionObserverCallback; observe: { mock: { calls: unknown[][] } } };
    const io = (IntersectionObserver as unknown as { instances: FakeIO[] }).instances.find((o) =>
      o.observe.mock.calls.some(([el]) => el === section),
    )!;
    act(() => io.cb([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver));
    expect(button()).not.toHaveClass("is-shown");
    act(() => io.cb([{ isIntersecting: false } as IntersectionObserverEntry], {} as IntersectionObserver));
    expect(button()).toHaveClass("is-shown");
    section.remove();
  });

  it("is not shown on the shop page itself", () => {
    nav.pathname = "/nl/shop";
    render(<FloatingBuy href="/nl/shop" label="Koop het boek" />);
    scrollTo(1000);
    expect(button()).toBeNull();
  });
});
