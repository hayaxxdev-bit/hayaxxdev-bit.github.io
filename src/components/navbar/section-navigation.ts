const SECTION_SELECTOR = "[data-section]";
const ROUTE_SELECTOR = "[data-route]";
const NAV_LINK_SELECTOR = ".nav-link[data-route]";

const NAVBAR_SCROLL_THRESHOLD = 20;
const ACTIVE_SECTION_ROOT_MARGIN = "-45% 0px -50% 0px";
const ACTIVE_SECTION_VIEWPORT_RATIO = 0.45;

export class SectionNavigation {
  private readonly navbar =
    document.querySelector<HTMLElement>("#navbar");

  private readonly routes = Array.from(
    document.querySelectorAll<HTMLElement>(ROUTE_SELECTOR),
  );

  private readonly navLinks = Array.from(
    document.querySelectorAll<HTMLButtonElement>(NAV_LINK_SELECTOR),
  );

  private readonly sections = Array.from(
    document.querySelectorAll<HTMLElement>(SECTION_SELECTOR),
  );

  private readonly sectionVisibility = new Map<string, number>();

  private observer: IntersectionObserver | null = null;

  private initialized = false;

  private readonly reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  );

  private readonly handleRouteClick = (event: MouseEvent): void => {
    const target = event.target;

    if (!(target instanceof Element)) return;

    const routeElement = target.closest<HTMLElement>(ROUTE_SELECTOR);

    if (!routeElement || !this.routes.includes(routeElement)) return;

    const sectionId = routeElement.dataset.route;

    if (!sectionId) return;

    const section = this.sections.find(
      (item) => item.id === sectionId,
    );

    if (!section) return;

    event.preventDefault();

    section.scrollIntoView({
      behavior: this.reduceMotion.matches ? "auto" : "smooth",
      block: "start",
    });

    history.replaceState(
      null,
      "",
      `#${encodeURIComponent(sectionId)}`,
    );

    this.setActiveSection(sectionId);
  };

  private readonly handleScroll = (): void => {
    const isScrolled = window.scrollY > NAVBAR_SCROLL_THRESHOLD;

    this.navbar?.classList.toggle("scrolled", isScrolled);

    if (!this.observer) {
      this.updateActiveSectionFallback();
    }
  };

  private readonly handleVisibilityChange = (
    entries: IntersectionObserverEntry[],
  ): void => {
    for (const entry of entries) {
      const section = entry.target as HTMLElement;

      if (entry.isIntersecting) {
        this.sectionVisibility.set(
          section.id,
          entry.intersectionRatio,
        );
      } else {
        this.sectionVisibility.delete(section.id);
      }
    }

    this.updateActiveSection();
  };

  init(): void {
    if (this.initialized) return;

    this.initialized = true;

    document.addEventListener("click", this.handleRouteClick);

    window.addEventListener("scroll", this.handleScroll, {
      passive: true,
    });

    this.initializeObserver();

    this.handleScroll();

    const initialSection = this.getInitialHashSection();

    if (initialSection) {
      this.setActiveSection(initialSection.id);
    } else if (this.observer) {
      this.updateActiveSection();
    } else {
      this.updateActiveSectionFallback();
    }
  }

  destroy(): void {
    if (!this.initialized) return;

    document.removeEventListener("click", this.handleRouteClick);
    window.removeEventListener("scroll", this.handleScroll);

    this.observer?.disconnect();
    this.observer = null;

    this.sectionVisibility.clear();

    this.navbar?.classList.remove("scrolled");

    this.clearActiveSection();

    this.initialized = false;
  }

  private getInitialHashSection(): HTMLElement | undefined {
    const hash = window.location.hash.slice(1);

    if (!hash) return undefined;

    try {
      const sectionId = decodeURIComponent(hash);

      return this.sections.find(
        (section) => section.id === sectionId,
      );
    } catch {
      return undefined;
    }
  }

  private initializeObserver(): void {
    if (!("IntersectionObserver" in window)) return;

    this.observer = new IntersectionObserver(
      this.handleVisibilityChange,
      {
        rootMargin: ACTIVE_SECTION_ROOT_MARGIN,
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
      },
    );

    this.sections.forEach((section) => {
      this.observer?.observe(section);
    });
  }

  private updateActiveSection(): void {
    if (this.sectionVisibility.size === 0) return;

    const activeSection = Array.from(
      this.sectionVisibility.entries(),
    ).sort((a, b) => {
      if (b[1] !== a[1]) {
        return b[1] - a[1];
      }

      return (
        this.sections.findIndex((section) => section.id === a[0]) -
        this.sections.findIndex((section) => section.id === b[0])
      );
    })[0];

    if (activeSection) {
      this.setActiveSection(activeSection[0]);
    }
  }

  private updateActiveSectionFallback(): void {
    if (this.sections.length === 0) return;

    const activationLine =
      window.innerHeight * ACTIVE_SECTION_VIEWPORT_RATIO;

    let activeSection: HTMLElement | undefined;
    let minimumDistance = Number.POSITIVE_INFINITY;

    for (const section of this.sections) {
      const rect = section.getBoundingClientRect();

      let distance = 0;

      if (activationLine < rect.top) {
        distance = rect.top - activationLine;
      } else if (activationLine > rect.bottom) {
        distance = activationLine - rect.bottom;
      }

      if (distance < minimumDistance) {
        minimumDistance = distance;
        activeSection = section;
      }
    }

    if (activeSection) {
      this.setActiveSection(activeSection.id);
    }
  }

  private setActiveSection(sectionId: string): void {
    this.navLinks.forEach((link) => {
      const isActive = link.dataset.route === sectionId;
      const isNavigationLink = !link.classList.contains("nav-link--cta");

      link.classList.toggle(
        "active",
        isActive && isNavigationLink,
      );

      if (isActive && isNavigationLink) {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  private clearActiveSection(): void {
    this.navLinks.forEach((link) => {
      link.classList.remove("active");
      link.removeAttribute("aria-current");
    });
  }
}