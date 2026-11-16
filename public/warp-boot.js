(function () {
  var root = document.documentElement;

  function markArrival() {
    try {
      if (sessionStorage.getItem('warp')) {
        root.classList.add('warp-arrive');
        sessionStorage.removeItem('warp');
      }
    } catch (error) {
    }
  }

  if (document.prerendering) {
    document.addEventListener('prerenderingchange', markArrival, { once: true });
  } else {
    markArrival();
  }
})();