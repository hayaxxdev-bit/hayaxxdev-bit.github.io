/**
 * Transisi antar-halaman "warp black hole".
 * Hanya logika: toggle class + custom property.
 * Seluruh tampilan ada di warp.css.
 *
 * Pakai: tambahkan atribut `data-warp` pada <a> internal mana pun.
 */

const LEAVE_CLASS = 'is-leaving';
const ARRIVE_CLASS = 'warp-arrive';
const STORAGE_KEY = 'warp';
const FALLBACK_MS = 1200;

const prefetched = new Set<string>();

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function findWarpLink(target: EventTarget | null): HTMLAnchorElement | null {
  return target instanceof Element
    ? target.closest<HTMLAnchorElement>('a[data-warp]')
    : null;
}

function isModifiedClick(event: MouseEvent): boolean {
  return (
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  );
}

/** Titik asal lubang hitam: posisi klik, atau tengah link jika lewat keyboard. */
function getOrigin(
  event: MouseEvent,
  link: HTMLAnchorElement,
): { x: number; y: number } {
  if (event.detail === 0) {
    const rect = link.getBoundingClientRect();
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
  }
  return { x: event.clientX, y: event.clientY };
}

function prefetch(url: string): void {
  if (prefetched.has(url)) return;
  prefetched.add(url);

  const hint = document.createElement('link');
  hint.rel = 'prefetch';
  hint.href = url;
  document.head.appendChild(hint);
}

function isSameOriginPage(url: URL): boolean {
  return url.origin === window.location.origin;
}

export function initPageTransition(): void {
  const root = document.documentElement;
  const warp = document.querySelector<HTMLElement>('.warp');
  let pendingUrl: string | null = null;

  const go = (): void => {
    if (!pendingUrl) return;
    const url = pendingUrl;
    pendingUrl = null;
    window.location.assign(url);
  };

  // Satu listener untuk animasi keluar (lalu pindah halaman) dan masuk (bersih-bersih)
  warp?.addEventListener('animationend', () => {
    if (root.classList.contains(LEAVE_CLASS)) {
      go();
    } else {
      root.classList.remove(ARRIVE_CLASS);
    }
  });

  // Prefetch halaman tujuan saat hover / fokus agar pindah terasa instan
  const warmUp = (event: Event): void => {
    const link = findWarpLink(event.target);
    if (!link) return;
    const url = new URL(link.href, window.location.href);
    if (isSameOriginPage(url)) prefetch(url.href);
  };
  document.addEventListener('pointerover', warmUp, { passive: true });
  document.addEventListener('focusin', warmUp);

  document.addEventListener('click', (event: MouseEvent) => {
    if (event.defaultPrevented || isModifiedClick(event)) return;

    const link = findWarpLink(event.target);
    if (!link || link.target === '_blank' || link.hasAttribute('download')) return;

    const url = new URL(link.href, window.location.href);
    if (!isSameOriginPage(url)) return;

    // Tanpa animasi / tanpa elemen overlay: biarkan navigasi biasa
    if (prefersReducedMotion() || !warp) return;

    event.preventDefault();
    if (root.classList.contains(LEAVE_CLASS)) return;

    const { x, y } = getOrigin(event, link);
    root.style.setProperty('--wx', `${x}px`);
    root.style.setProperty('--wy', `${y}px`);

    try {
      sessionStorage.setItem(STORAGE_KEY, '1');
    } catch {
      /* storage dimatikan: halaman tujuan tetap jalan tanpa animasi masuk */
    }

    pendingUrl = url.href;
    root.classList.add(LEAVE_CLASS);

    // Jaga-jaga jika animationend tidak pernah terpicu
    window.setTimeout(go, FALLBACK_MS);
  });

  // Tombol Back (bfcache): bersihkan state agar halaman tidak tertinggal hitam
  window.addEventListener('pageshow', (event: PageTransitionEvent) => {
    if (event.persisted) {
      pendingUrl = null;
      root.classList.remove(LEAVE_CLASS, ARRIVE_CLASS);
    }
  });
}