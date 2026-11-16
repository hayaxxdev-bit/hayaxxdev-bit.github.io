import { ThemeController } from "./theme-controller";
import { MobileMenu } from "./mobile-menu";
import { SectionNavigation } from "./section-navigation";

export class Navbar {
  private readonly themeController = new ThemeController();
  private readonly mobileMenu = new MobileMenu();
  private readonly sectionNavigation = new SectionNavigation();

  private initialized = false;

  init(): void {
    if (this.initialized) return;

    this.initialized = true;

    try {
      this.themeController.init();
      this.mobileMenu.init();
      this.sectionNavigation.init();
    } catch (error: unknown) {
      this.destroy();
      throw error;
    }
  }

  destroy(): void {
    if (!this.initialized) return;

    this.sectionNavigation.destroy();
    this.mobileMenu.destroy();
    this.themeController.destroy();

    this.initialized = false;
  }
}