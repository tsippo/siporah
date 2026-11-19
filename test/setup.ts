import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

afterEach(() => cleanup());

// jsdom has no layout engine, so these browser APIs need simple stand-ins.
if (typeof window !== "undefined") {
  /** Tests can flip this to simulate "reduce motion" in the OS settings. */
  (globalThis as { __reducedMotion?: boolean }).__reducedMotion = false;
  window.matchMedia = vi.fn((query: string) => ({
    matches:
      query.includes("prefers-reduced-motion") &&
      !!(globalThis as { __reducedMotion?: boolean }).__reducedMotion,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })) as unknown as typeof window.matchMedia;

  class IO {
    static instances: IO[] = [];
    constructor(public cb: IntersectionObserverCallback) {
      IO.instances.push(this);
    }
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
    takeRecords = () => [];
  }
  (globalThis as unknown as { IntersectionObserver: typeof IO }).IntersectionObserver = IO;
}

afterEach(() => {
  (globalThis as { __reducedMotion?: boolean }).__reducedMotion = false;
});
