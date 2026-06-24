/* ══════════════════════════════════════════════════════════════
   FLIP CARD ENGINE - SIMPLE CLICK ONLY
   Hanya klik/tap untuk flip, tidak ada swipe/drag
   ══════════════════════════════════════════════════════════════ */

(function () {
  function initCharCardFlip(root = document) {
    root.querySelectorAll('.char-card-flip').forEach(setupCard);
  }
 
  function setupCard(card) {
    if (card.dataset.flipReady === 'true') return;
    card.dataset.flipReady = 'true';

    const inner = card.querySelector('.char-card-flip__inner');
    const frontFace = card.querySelector('.char-card-face--front');
    const closeBtn = card.querySelector('[data-flip-trigger="close"]');
    
    if (!inner) return;

    let isAnimating = false;

    // Reset state setelah animasi selesai
    inner.addEventListener('transitionend', function(e) {
      if (e.propertyName === 'transform') {
        isAnimating = false;
        card.classList.remove('is-animating');
      }
    });

    function flipCard() {
      if (isAnimating) return; // Jangan lakukan apa-apa jika sedang animasi
      
      isAnimating = true;
      card.classList.add('is-animating');
      card.classList.toggle('is-flipped');
    }

    // Handler untuk klik di bagian depan kartu
    if (frontFace) {
      frontFace.addEventListener('click', function(e) {
        // Cek apakah yang diklik adalah link/button
        if (e.target.closest('a, button')) return;
        
        if (!card.classList.contains('is-flipped')) {
          flipCard();
        }
      });
    }

    // Handler untuk tombol close di belakang kartu
    if (closeBtn) {
      closeBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        if (card.classList.contains('is-flipped')) {
          flipCard();
        }
      });
    }
  }

  // Inisialisasi saat DOM siap
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      initCharCardFlip();
    });
  } else {
    initCharCardFlip();
  }

  // Expose untuk dynamic content
  window.initCharCardFlip = initCharCardFlip;
})();