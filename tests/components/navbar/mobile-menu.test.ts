// @vitest-environment jsdom

import { beforeEach, describe, expect, it } from "vitest";
import { MobileMenu } from "../../../src/components/navbar/mobile-menu";

describe("MobileMenu", () => {
  let menu: MobileMenu;

  const setViewportWidth = (width: number): void => {
    Object.defineProperty(window, "innerWidth", {
      configurable: true,
      value: width,
    });

    window.dispatchEvent(new Event("resize"));
  };

  beforeEach(() => {
    document.body.innerHTML = `
      <header id="navbar">
        <nav id="navMenu">
          <button class="nav-link" data-route="home">
            Home
          </button>
        </nav>

        <button id="menuToggle" type="button">
          Menu
        </button>
      </header>
    `;

    setViewportWidth(1920);
    menu = new MobileMenu();
  });

  it("should keep navigation interactive on desktop", () => {
    menu.init();

    const navMenu = document.querySelector<HTMLElement>("#navMenu");

    expect(navMenu?.inert).toBe(false);
    expect(navMenu?.classList.contains("navbar__menu--open")).toBe(false);
  });

  it("should close and disable navigation initially on mobile", () => {
    setViewportWidth(390);
    menu.init();

    const navMenu = document.querySelector<HTMLElement>("#navMenu");

    expect(navMenu?.inert).toBe(true);
  });

  it("should open navigation when toggle is clicked", () => {
    setViewportWidth(390);
    menu.init();

    document.querySelector<HTMLButtonElement>("#menuToggle")?.click();

    const navMenu = document.querySelector<HTMLElement>("#navMenu");
    const toggle = document.querySelector<HTMLButtonElement>("#menuToggle");

    expect(navMenu?.inert).toBe(false);
    expect(navMenu?.classList.contains("navbar__menu--open")).toBe(true);
    expect(toggle?.getAttribute("aria-expanded")).toBe("true");
  });

  it("should close navigation when Escape is pressed", () => {
    setViewportWidth(390);
    menu.init();

    document.querySelector<HTMLButtonElement>("#menuToggle")?.click();

    document.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
    );

    const navMenu = document.querySelector<HTMLElement>("#navMenu");

    expect(navMenu?.inert).toBe(true);
    expect(navMenu?.classList.contains("navbar__menu--open")).toBe(false);
  });

  it("should restore navigation when resized to desktop", () => {
    setViewportWidth(390);
    menu.init();

    document.querySelector<HTMLButtonElement>("#menuToggle")?.click();

    setViewportWidth(1920);

    const navMenu = document.querySelector<HTMLElement>("#navMenu");
    const toggle = document.querySelector<HTMLButtonElement>("#menuToggle");

    expect(navMenu?.inert).toBe(false);
    expect(navMenu?.classList.contains("navbar__menu--open")).toBe(false);
    expect(toggle?.getAttribute("aria-expanded")).toBe("false");
  });

  it("should remove event listeners after destroy", () => {
    setViewportWidth(390);
    menu.init();
    menu.destroy();

    document.querySelector<HTMLButtonElement>("#menuToggle")?.click();

    const navMenu = document.querySelector<HTMLElement>("#navMenu");

    expect(navMenu?.classList.contains("navbar__menu--open")).toBe(false);
  });
});