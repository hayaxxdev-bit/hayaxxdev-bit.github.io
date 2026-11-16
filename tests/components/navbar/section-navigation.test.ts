// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { SectionNavigation } from "../../../src/components/navbar/section-navigation";

describe("SectionNavigation", () => {
  let navigation: SectionNavigation ;

  const createDOM = (): void => {
    document.body.innerHTML = `
      <header id="navbar">
        <a data-route="home" href="#home">Brand</a>

        <nav>
          <button class="nav-link active" data-route="home">
            Home
          </button>
          <button class="nav-link" data-route="about">
            About
          </button>
          <button class="nav-link nav-link--cta" data-route="contact">
            Contact
          </button>
        </nav>
      </header>

      <main>
        <section id="home" data-section></section>
        <section id="about" data-section></section>
        <section id="contact" data-section></section>
      </main>
    `;

    Object.defineProperty(HTMLElement.prototype, "scrollIntoView", {
      configurable: true,
      writable: true,
      value: vi.fn(),
    });

    vi.stubGlobal(
      "matchMedia",
      vi.fn().mockReturnValue({
        matches: false,
        media: "(prefers-reduced-motion: reduce)",
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      } satisfies MediaQueryList),
    );

    navigation = new SectionNavigation();
  };

  beforeEach(() => {
    createDOM();
  });
  afterEach(() => {
    navigation?.destroy();

    vi.restoreAllMocks();
    vi.unstubAllGlobals();

    Reflect.deleteProperty(HTMLElement.prototype, "scrollIntoView");
  });
  it("should activate the section from the initial URL hash", () => {
    window.history.replaceState(null, "", "#about");

    navigation = new SectionNavigation();
    navigation.init();

    const aboutLink = document.querySelector('.nav-link[data-route="about"]');

    expect(aboutLink?.classList.contains("active")).toBe(true);
    expect(aboutLink?.getAttribute("aria-current")).toBe("location");
  });

  it("should handle malformed URL hash without throwing", () => {
    window.history.replaceState(null, "", "#%E0%A4%A");

    navigation = new SectionNavigation();

    expect(() => navigation.init()).not.toThrow();
  });

  it("should navigate to the selected section", () => {
    navigation.init();

    const aboutLink = document.querySelector<HTMLButtonElement>(
      '.nav-link[data-route="about"]',
    );

    const event = new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
    });

    aboutLink?.dispatchEvent(event);

    const aboutSection = document.querySelector<HTMLElement>("#about");

    expect(event.defaultPrevented).toBe(true);
    expect(aboutSection?.scrollIntoView).toHaveBeenCalled();
    expect(window.location.hash).toBe("#about");
  });

  it("should update navbar scroll state", () => {
    navigation.init();

    Object.defineProperty(window, "scrollY", {
      configurable: true,
      value: 100,
    });

    window.dispatchEvent(new Event("scroll"));

    expect(
      document.querySelector("#navbar")?.classList.contains("scrolled"),
    ).toBe(true);
  });

  it("should clear active state and scroll state after destroy", () => {
    navigation.init();

    Object.defineProperty(window, "scrollY", {
      configurable: true,
      value: 100,
    });

    window.dispatchEvent(new Event("scroll"));

    navigation.destroy();

    expect(
      document.querySelector("#navbar")?.classList.contains("scrolled"),
    ).toBe(false);

    expect(document.querySelector(".nav-link.active")).toBeNull();

    expect(document.querySelector("[aria-current]")).toBeNull();
  });

  it("should support destroy and reinitialize lifecycle", () => {
    navigation.init();
    navigation.destroy();

    expect(() => navigation.init()).not.toThrow();

    const aboutLink = document.querySelector<HTMLButtonElement>(
      '.nav-link[data-route="about"]',
    );

    const event = new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
    });

    aboutLink?.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(true);
  });
});
