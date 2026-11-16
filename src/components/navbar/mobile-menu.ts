const MOBILE_BREAKPOINT = 768;
const MENU_OPEN_CLASS = "navbar__menu--open";
const TOGGLE_OPEN_CLASS = "navbar__toggle--open";

export class MobileMenu {
  private readonly toggle =
    document.querySelector<HTMLButtonElement>("#menuToggle");

  private readonly menu = document.querySelector<HTMLElement>("#navMenu");

  private initialized = false;

  private readonly handleToggle = (): void => {
    if (this.isOpen()) {
      this.close();
    } else {
      this.open();
    }
  };

  private readonly handleKeydown = (event: KeyboardEvent): void => {
    if (event.key !== "Escape" || !this.isOpen()) return;

    this.close();
    this.toggle?.focus();
  };

  private readonly handleOutsideClick = (event: MouseEvent): void => {
    if (!this.isOpen()) return;

    const target = event.target;

    if (!(target instanceof Node)) return;

    if (this.menu?.contains(target) || this.toggle?.contains(target)) {
      return;
    }

    this.close();
  };

  private readonly handleRouteClick = (event: MouseEvent): void => {
    if (!this.isOpen()) return;

    const target = event.target;

    if (!(target instanceof Element)) return;

    if (target.closest("[data-route]") && this.menu?.contains(target)) {
      this.close();
    }
  };

  private readonly handleResize = (): void => {
    if (window.innerWidth > MOBILE_BREAKPOINT) {
      this.setDesktopState();
    } else {
      this.close();
    }
  };

  init(): void {
    if (this.initialized || !this.toggle || !this.menu) return;

    this.initialized = true;

    this.toggle.addEventListener("click", this.handleToggle);
    document.addEventListener("keydown", this.handleKeydown);
    document.addEventListener("click", this.handleOutsideClick);
    this.menu.addEventListener("click", this.handleRouteClick);

    window.addEventListener("resize", this.handleResize, {
      passive: true,
    });

    this.handleResize();
  }

  destroy(): void {
    if (!this.initialized || !this.toggle || !this.menu) return;

    this.toggle.removeEventListener("click", this.handleToggle);
    document.removeEventListener("keydown", this.handleKeydown);
    document.removeEventListener("click", this.handleOutsideClick);
    this.menu.removeEventListener("click", this.handleRouteClick);

    window.removeEventListener("resize", this.handleResize);

    this.handleResize();
    this.initialized = false;
  }

  private setDesktopState(): void {
    if (!this.toggle || !this.menu) return;

    this.menu.classList.remove(MENU_OPEN_CLASS);
    this.menu.inert = false;

    this.toggle.classList.remove(TOGGLE_OPEN_CLASS);
    this.toggle.setAttribute("aria-expanded", "false");
    this.toggle.setAttribute("aria-label", "Buka menu navigasi");
  }

  private isOpen(): boolean {
    return this.menu?.classList.contains(MENU_OPEN_CLASS) ?? false;
  }

  private open(): void {
    if (!this.toggle || !this.menu) return;

    if (window.innerWidth > MOBILE_BREAKPOINT) return;

    this.menu.classList.add(MENU_OPEN_CLASS);
    this.menu.inert = false;

    this.toggle.classList.add(TOGGLE_OPEN_CLASS);
    this.toggle.setAttribute("aria-expanded", "true");
    this.toggle.setAttribute("aria-label", "Tutup menu navigasi");
  }

  private close(): void {
    if (!this.toggle || !this.menu) return;

    this.menu.classList.remove(MENU_OPEN_CLASS);
    this.menu.inert = true;

    this.toggle.classList.remove(TOGGLE_OPEN_CLASS);
    this.toggle.setAttribute("aria-expanded", "false");
    this.toggle.setAttribute("aria-label", "Buka menu navigasi");
  }
}
