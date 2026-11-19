import { act, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Splash from "@/components/Splash";
import { SPLASH_KEY } from "@/lib/splash";

const html = document.documentElement;

describe("Splash (loading screen)", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    html.className = "";
    sessionStorage.clear();
  });
  afterEach(() => vi.useRealTimers());

  it("is decorative only, so screen readers skip it", () => {
    const { container } = render(<Splash text="Even de rugzak inpakken…" />);
    expect(container.querySelector(".splash")).toHaveAttribute("aria-hidden", "true");
  });

  it("stays at least a moment, then fades out and remembers it was seen", () => {
    render(<Splash text="…" />); // jsdom's page is already loaded
    act(() => vi.advanceTimersByTime(500));
    expect(html).not.toHaveClass("splash-done");

    act(() => vi.advanceTimersByTime(500));
    expect(html).toHaveClass("splash-done");
    expect(sessionStorage.getItem(SPLASH_KEY)).toBe("1");

    act(() => vi.advanceTimersByTime(700));
    expect(html).toHaveClass("splash-skip");
  });

  it("never waits longer than 2.5 seconds for a slow page", () => {
    const state = vi.spyOn(document, "readyState", "get").mockReturnValue("loading");
    render(<Splash text="…" />);
    act(() => vi.advanceTimersByTime(2400));
    expect(html).not.toHaveClass("splash-done");
    act(() => vi.advanceTimersByTime(200));
    expect(html).toHaveClass("splash-done");
    state.mockRestore();
  });

  it("does nothing when it was already shown this visit", () => {
    html.classList.add("splash-skip");
    render(<Splash text="…" />);
    act(() => vi.advanceTimersByTime(3000));
    expect(html).not.toHaveClass("splash-done");
    expect(sessionStorage.getItem(SPLASH_KEY)).toBeNull();
  });
});
