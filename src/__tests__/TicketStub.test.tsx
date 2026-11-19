import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import TicketStub from "@/components/TicketStub";

const props = {
  href: "https://www.amazon.nl",
  label: "Koop het boek",
  newTab: "opent in een nieuw tabblad",
  bonVoyage: "Goede reis!",
  opening: "Amazon wordt geopend…",
};

const stub = () => document.querySelector(".pass-stub")!;
const overlay = () => document.querySelector(".voyage");
const link = () => screen.getByRole("link", { name: /Koop het boek/ });

describe("TicketStub", () => {
  let open: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.useFakeTimers();
    open = vi.fn(() => ({ opener: window }) as unknown as Window);
    vi.stubGlobal("open", open);
  });
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("is a normal, accessible new-tab link", () => {
    render(<TicketStub {...props} />);
    expect(link()).toHaveAttribute("href", props.href);
    expect(link()).toHaveAttribute("target", "_blank");
    expect(link()).toHaveAttribute("rel", "noopener noreferrer");
    expect(link()).toHaveAccessibleName(/opent in een nieuw tabblad/);
    expect(overlay()).toBeNull();
  });

  it("tears off, shows the bon-voyage screen, then opens Amazon", () => {
    render(<TicketStub {...props} />);
    const notPrevented = fireEvent.click(link());
    expect(notPrevented).toBe(false); // we take over the navigation

    expect(stub()).toHaveClass("is-wiggle");
    act(() => vi.advanceTimersByTime(200));
    expect(stub()).toHaveClass("is-torn");

    act(() => vi.advanceTimersByTime(250)); // 450 ms
    expect(overlay()).toHaveClass("is-shown");
    expect(screen.getByText("Goede reis!")).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("Amazon wordt geopend…");
    expect(open).not.toHaveBeenCalled();

    act(() => vi.advanceTimersByTime(400)); // 850 ms
    expect(open).toHaveBeenCalledOnce();
    expect(open).toHaveBeenCalledWith(props.href, "_blank");
    expect(open.mock.results[0].value.opener).toBeNull();

    act(() => vi.advanceTimersByTime(1000)); // back to normal
    expect(stub()).not.toHaveClass("is-torn");
    expect(overlay()).toBeNull();
  });

  it("ignores extra clicks while the animation runs", () => {
    render(<TicketStub {...props} />);
    fireEvent.click(link());
    expect(fireEvent.click(link())).toBe(false);
    act(() => vi.advanceTimersByTime(2000));
    expect(open).toHaveBeenCalledOnce();
  });

  it("goes to Amazon in the same tab when the new tab is blocked", () => {
    open.mockReturnValue(null);
    const location = { href: "http://localhost/nl" };
    vi.stubGlobal("location", location);
    render(<TicketStub {...props} />);
    fireEvent.click(link());
    act(() => vi.advanceTimersByTime(900));
    expect(location.href).toBe(props.href);
  });

  it.each([{ ctrlKey: true }, { metaKey: true }, { shiftKey: true }, { button: 1 }])(
    "leaves %o clicks to the browser",
    (init) => {
      render(<TicketStub {...props} />);
      expect(fireEvent.click(link(), init)).toBe(true);
      expect(stub()).not.toHaveClass("is-wiggle");
      act(() => vi.advanceTimersByTime(2000));
      expect(open).not.toHaveBeenCalled();
    },
  );

  it("skips the animation for people who prefer reduced motion", () => {
    (globalThis as { __reducedMotion?: boolean }).__reducedMotion = true;
    render(<TicketStub {...props} />);
    expect(fireEvent.click(link())).toBe(true);
    expect(overlay()).toBeNull();
  });

  it("cleans up its timers when it disappears mid-animation", () => {
    const { unmount } = render(<TicketStub {...props} />);
    fireEvent.click(link());
    unmount();
    act(() => vi.advanceTimersByTime(2000));
    expect(open).not.toHaveBeenCalled();
  });
});
