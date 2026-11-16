/**
 * Menyembunyikan foto kartu yang gagal dimuat agar art cadangan di CSS
 * (di belakang <img>) tetap terlihat. Pengganti atribut `onerror` inline,
 * yang akan diblokir oleh Content-Security-Policy.
 */

const SELECTOR = 'img.card__img';

function hideIfBroken(img: HTMLImageElement): void {
  if (img.complete && img.naturalWidth === 0 && img.currentSrc !== '') {
    img.hidden = true;
  }
}

export function initImageFallback(root: ParentNode = document): void {
  root.querySelectorAll<HTMLImageElement>(SELECTOR).forEach((img) => {
    img.addEventListener(
      'error',
      () => {
        img.hidden = true;
      },
      { once: true },
    );
    hideIfBroken(img);
  });
}