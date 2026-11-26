/**
 * Mematikan efek latar yang berat (komet, lubang hitam, spotlight) pada
 * perangkat lemah. Efek penuh tetap jalan di perangkat yang kuat.
 *
 * Mengaktifkan kelas `fx-lite` di <html>; CSS-nya yang menyembunyikan efek.
 */

const LITE_CLASS = 'fx-lite';
const SETTLE_DELAY_MS = 1000;
const SAMPLE_DURATION_MS = 2000;
const MINIMUM_FPS = 45;
const LOW_MEMORY_GB = 4;
const LOW_CORE_COUNT = 4;

interface NavigatorWithHints extends Navigator {
  deviceMemory?: number;
  connection?: { saveData?: boolean };
}

function hasWeakDeviceHints(): boolean {
  const hints = navigator as NavigatorWithHints;

  const isLowMemory =
    hints.deviceMemory !== undefined && hints.deviceMemory <= LOW_MEMORY_GB;
  const isSavingData = hints.connection?.saveData === true;
  const isWeakTouchDevice =
    window.matchMedia('(pointer: coarse)').matches &&
    navigator.hardwareConcurrency <= LOW_CORE_COUNT;

  return isLowMemory || isSavingData || isWeakTouchDevice;
}

/**
 * Mengukur rata-rata FPS selama beberapa detik. Pengukuran dibatalkan kalau
 * tab disembunyikan, karena requestAnimationFrame berhenti dan hasilnya palsu.
 */
function watchFramerate(onSlow: () => void): void {
  let frameCount = 0;
  let startTime: number | null = null;
  let isAborted = false;

  function abort(): void {
    isAborted = true;
  }

  document.addEventListener('visibilitychange', abort, { once: true });

  function measure(timestamp: number): void {
    if (isAborted) return;

    if (startTime === null) startTime = timestamp;
    frameCount += 1;

    const elapsedMs = timestamp - startTime;

    if (elapsedMs < SAMPLE_DURATION_MS) {
      requestAnimationFrame(measure);
      return;
    }

    document.removeEventListener('visibilitychange', abort);

    const averageFps = (frameCount / elapsedMs) * 1000;
    if (averageFps < MINIMUM_FPS) onSlow();
  }

  requestAnimationFrame(measure);
}

export function initEffectsBudget(): void {
  const root = document.documentElement;
  const enableLiteEffects = (): void => root.classList.add(LITE_CLASS);

  if (hasWeakDeviceHints()) {
    enableLiteEffects();
    return;
  }

  // Frame saat halaman baru dimuat selalu lambat; tunggu sampai tenang.
  window.addEventListener(
    'load',
    () => {
      window.setTimeout(() => {
        if (!document.hidden) watchFramerate(enableLiteEffects);
      }, SETTLE_DELAY_MS);
    },
    { once: true },
  );
}