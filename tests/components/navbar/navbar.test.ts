// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { Navbar } from "../../../src/components/navbar/navbar";

describe("Navbar", () => {
  let navbar: Navbar;

  const createDOM = (): void => {
    document.body.innerHTML = `
      <header id="navbar">
        <a href="#home" data-route="home">Brand</a>

        <nav id="navMenu" class="navbar__menu">
          <button class="nav-link active" data-route="home">
            Home
          </button>

          <button class="nav-link" data-route="about">
            About
          </button>

          <button
            class="nav-link nav-link--theme"
            data-theme-toggle
          >
            Theme
          </button>

          <button
            class="nav-link nav-link--cta"
            data-route="contact"
          >
            Contact
          </button>
        </nav>

        <button id="menuToggle" type="button">
          Menu
        </button>
      </header>

      <main>
        <section id="home" data-section></section>
        <section id="about" data-section></section>
        <section id="contact" data-section></section>
      </main>

      <meta id="theme-color" content="#030208" />
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
        media: "(prefers-color-scheme: dark)",
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      } satisfies MediaQueryList),
    );

    Reflect.deleteProperty(window, "IntersectionObserver");
    Reflect.deleteProperty(globalThis, "IntersectionObserver");

    localStorage.clear();
    localStorage.setItem("theme", "dark");
    navbar = new Navbar();
  };

  beforeEach(() => {
    createDOM();
  });

  afterEach(() => {
    navbar.destroy();

    vi.restoreAllMocks();
    vi.unstubAllGlobals();

    Reflect.deleteProperty(HTMLElement.prototype, "scrollIntoView");

    localStorage.clear();
  });

  it("should initialize all navbar controllers", () => {
    navbar.init();

    const navMenu = document.querySelector<HTMLElement>("#navMenu");

    expect(navMenu?.inert).toBe(false);

    expect(
      document.querySelector("#navbar")?.classList.contains("scrolled"),
    ).toBe(false);

    expect(
      document
        .querySelector("[data-theme-toggle]")
        ?.getAttribute("aria-pressed"),
    ).toBe("true");
  });

  it("should prevent duplicate initialization", () => {
    navbar.init();
    navbar.init();

    const themeButton = document.querySelector<HTMLButtonElement>(
      "[data-theme-toggle]",
    );

    themeButton?.click();

    expect(document.documentElement.dataset.theme).toBe("light");
  });

  it("should clean up all controllers after destroy", () => {
    navbar.init();
    navbar.destroy();

    const navMenu = document.querySelector<HTMLElement>("#navMenu");

    expect(navMenu?.inert).toBe(false);

    expect(
      document.querySelector("#navbar")?.classList.contains("scrolled"),
    ).toBe(false);

    expect(
      document
        .querySelector("[data-theme-toggle]")
        ?.getAttribute("aria-pressed"),
    ).toBe("true");
  });

  it("should support reinitialization after destroy", () => {
    navbar.init();
    navbar.destroy();

    expect(() => navbar.init()).not.toThrow();

    const themeButton = document.querySelector<HTMLButtonElement>(
      "[data-theme-toggle]",
    );

    themeButton?.click();

    expect(document.documentElement.dataset.theme).toBe("light");
  });

  it("should ignore destroy when not initialized", () => {
    expect(() => navbar.destroy()).not.toThrow();

    expect(() => navbar.destroy()).not.toThrow();
  });
});
