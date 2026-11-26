// Named import: Vite hanya menyertakan field "version", bukan seluruh package.json
// (scripts, dependencies, dll) ke dalam bundle JS.
import { version } from '../package.json';

import { Navbar } from './components/navbar/navbar';
import { initImageFallback } from './features/media/image-fallback';
import { initLogoCarousel } from './features/navigation/logo-carousel';
import { initPageTransition } from './features/navigation/page-transition';
import { initEffectsBudget } from './features/performance/effects-budget';
import { initProjects } from './features/projects/project-catalog';

type InitTask = () => void | Promise<void>;

function reportInitError(name: string, error: unknown): void {
  console.error(`[${name}] gagal diinisialisasi:`, error);
}

/**
 * Satu init yang gagal tidak boleh mematikan init lainnya.
 * Menangkap error sinkron maupun penolakan promise (misalnya fetch di initProjects).
 */
function safe(name: string, task: InitTask): void {
  try {
    const result = task();

    if (result instanceof Promise) {
      result.catch((error: unknown) => reportInitError(name, error));
    }
  } catch (error: unknown) {
    reportInitError(name, error);
  }
}

/** Jalankan saat browser idle; Safari belum punya requestIdleCallback. */
function whenIdle(task: () => void): void {
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(task, { timeout: 1500 });
    return;
  }

  setTimeout(task, 200);
}

function setAppVersion(): void {
  const versionBadge = document.querySelector<HTMLElement>('[data-app-version]');
  if (!versionBadge) return;

  versionBadge.textContent = `v${version}`;
  // Di HTML elemen ini diberi `hidden` supaya "v-" tidak sempat tampil.
  versionBadge.hidden = false;
}

function initNavbar(): void {
  // Menangani tema, menu mobile, aria-pressed, dan penanda tautan aktif.
  const navbar = new Navbar();
  navbar.init();
}

/**
 * reveal / tilt / magnetic dimuat sebagai chunk terpisah supaya tidak
 * memblokir render awal. Elemen [data-reveal] tersembunyi sampai chunk ini
 * jalan, jadi kalau gagal dimuat, tampilkan semuanya lewat kelas `no-reveal`.
 */
function loadInteractions(): void {
  import('./scripts/interactions').catch((error: unknown) => {
    console.error('Gagal memuat interactions:', error);
    document.documentElement.classList.add('no-reveal');
  });
}

function bootstrap(): void {
  // Paling awal: menentukan apakah efek berat perlu dimatikan
  safe('effects-budget', initEffectsBudget);

  // Kritis: dibutuhkan sebelum pengguna berinteraksi
  safe('version', setAppVersion);
  safe('navbar', initNavbar);
  safe('image-fallback', initImageFallback);
  safe('page-transition', initPageTransition);
  safe('projects', initProjects);

  // Tidak kritis: tunda sampai main thread senggang
  whenIdle(() => safe('logo-carousel', initLogoCarousel));

  loadInteractions();
}

bootstrap();