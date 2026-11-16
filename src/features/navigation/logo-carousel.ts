const LOGO_INTERVAL = 5000;
const TRANSITION_DURATION = 800;

const LOGO_IMAGES = [
  "assets/image/logo/logo.png",
  // "assets/image/logo/1-removebg-preview.png",
  // "assets/image/logo/2-removebg-preview.png",
] as const;

export function initLogoCarousel(): void {
  const currentLogo = document.querySelector<HTMLImageElement>(
    "#navbar-logo-current",
  );

  const nextLogo = document.querySelector<HTMLImageElement>(
    "#navbar-logo-next",
  );

  if (!currentLogo || !nextLogo || LOGO_IMAGES.length < 2) {
    return;
  }

  const baseUrl = import.meta.env.BASE_URL;

  const images = LOGO_IMAGES.map((path) => {
    const image = new Image();
    image.src = `${baseUrl}${path}`;

    return image;
  });

  let currentIndex = 0;
  let isTransitioning = false;

  const waitForImage = async (image: HTMLImageElement): Promise<void> => {
    if (image.complete) {
      if (image.naturalWidth === 0) {
        throw new Error(`Failed to load: ${image.src}`);
      }

      return;
    }

    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(
        new Error(`Failed to load: ${image.src}`),
      );
    });
  };

  const changeLogo = async (): Promise<void> => {
    if (isTransitioning) return;

    const nextIndex = (currentIndex + 1) % images.length;
    const image = images[nextIndex];

    // Explicitly handle potentially undefined array elements.
    if (!image) {
      console.error("[LogoCarousel] Image not found:", nextIndex);
      return;
    }

    isTransitioning = true;

    try {
      await waitForImage(image);

      nextLogo.src = image.src;

      // Start crossfade after the next image is ready.
      requestAnimationFrame(() => {
        nextLogo.classList.add("is-active");
        currentLogo.classList.remove("is-active");
      });

      window.setTimeout(() => {
        currentLogo.src = image.src;

        currentLogo.classList.add("is-active");
        nextLogo.classList.remove("is-active");

        currentIndex = nextIndex;
        isTransitioning = false;
      }, TRANSITION_DURATION);
    } catch (error) {
      console.error("[LogoCarousel]", error);
      isTransitioning = false;
    }
  };

  window.setInterval(changeLogo, LOGO_INTERVAL);
}