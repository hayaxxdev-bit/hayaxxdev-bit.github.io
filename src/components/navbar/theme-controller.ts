export type Theme = "light" | "dark";

const STORAGE_KEY = "theme";

const THEME_COLORS: Record<Theme, string> = {
  dark: "#030208",
  light: "#f0f8ff",
};

const isTheme = (value: string | null): value is Theme =>
  value === "light" || value === "dark";

export class ThemeController {
  private readonly root = document.documentElement;
  private readonly button = document.querySelector<HTMLButtonElement>(
    "[data-theme-toggle]",
  );
  private readonly themeColorMeta =
    document.querySelector<HTMLMetaElement>("#theme-color");

  private initialized = false;

  private readonly handleToggle = (): void => {
    const next: Theme = this.root.dataset.theme === "dark" ? "light" : "dark";

    this.applyTheme(next);
    this.persistTheme(next);
  };

  init(): void {
    if (this.initialized) return;
    this.initialized = true;

    const theme = this.resolveInitialTheme();

    this.applyTheme(theme);

    this.button?.addEventListener("click", this.handleToggle);
  }

  destroy(): void {
    if (!this.initialized) return;

    this.button?.removeEventListener("click", this.handleToggle);

    this.initialized = false;
  }

  private resolveInitialTheme(): Theme {
    try {
      const savedTheme = localStorage.getItem(STORAGE_KEY);

      if (isTheme(savedTheme)) {
        return savedTheme;
      }
    } catch {
      // Storage tidak tersedia; gunakan preferensi sistem.
    }

    try {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    } catch {
      return "dark";
    }
  }

  private applyTheme(theme: Theme): void {
    this.root.dataset.theme = theme;
    this.root.style.colorScheme = theme;

    if (this.themeColorMeta) {
      this.themeColorMeta.content = THEME_COLORS[theme];
    }

    this.button?.setAttribute(
      "aria-label",
      theme === "dark" ? "Aktifkan tema terang" : "Aktifkan tema gelap",
    );

    this.button?.setAttribute("aria-pressed", String(theme === "dark"));
  }

  private persistTheme(theme: Theme): void {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
    }
  }
}
