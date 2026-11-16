// Named import: Vite hanya menyertakan field "version", bukan seluruh package.json
// (scripts, dependencies, dll) ke dalam bundle JS.
import { version } from '../package.json';

import { initImageFallback } from './features/media/image-fallback';
import { initLogoCarousel } from './features/navigation/logo-carousel';
import { initPageTransition } from './features/navigation/page-transition';
import { initProjects } from './features/projects/project-catalog';
import { Navbar } from './components/navbar/navbar';

/** Satu init yang gagal tidak boleh mematikan init lainnya. */
function safe(name: string, fn: () => void): void {
  try {
    fn();
  } catch (error: unknown) {
    console.error(`[${name}] gagal diinisialisasi:`, error);
  }
}

/** Jalankan saat browser idle; Safari belum punya requestIdleCallback. */
function whenIdle(task: () => void): void {
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(task, { timeout: 1500 });
  } else {
    setTimeout(task, 200);
  }
}

function setAppVersion(): void {
  const el = document.querySelector<HTMLElement>('[data-app-version]');
  if (el) el.textContent = `v${version}`;
}

function bootstrap(): void {
  // Kritis: dibutuhkan sebelum pengguna berinteraksi
  safe('version', setAppVersion);
  safe('navbar', () => {
  console.log('[Navbar] Initializing...');

  const navbar = new Navbar();
  navbar.init()

  console.log('[Navbar] Initialized successfully.');

});// tema + menu mobile
  safe('image-fallback', initImageFallback);
  safe('page-transition', initPageTransition);
  safe('projects', initProjects);

  // Tidak kritis: tunda sampai main thread senggang
  whenIdle(() => safe('logo-carousel', initLogoCarousel));

  // reveal / tilt / magnetic: dimuat sebagai chunk terpisah, tidak memblokir render awal
  void import('./scripts/interactions').catch((error: unknown) => {
    console.error('Gagal memuat interactions:', error);
  });
}

bootstrap();