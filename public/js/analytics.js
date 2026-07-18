/**
 * GOOGLE ANALYTICS 4 (Deferred & Consolidated)
 * Dipisah ke file eksternal + tetap dimuat secara idle/deferred
 * agar tidak mengganggu First Contentful Paint / TTI.
 * Bergantung pada window.__CONFIG (dimuat lebih dulu via config.js).
 */
window.dataLayer = window.dataLayer || [];
function gtag() {
  dataLayer.push(arguments);
}

// Default consent
gtag("consent", "default", {
  analytics_storage: "denied",
  ad_storage: "denied",
  functionality_storage: "granted",
  personalization_storage: "denied",
  security_storage: "granted",
});

// Fungsi untuk memuat Google Analytics secara deferred
function loadGoogleAnalytics() {
  var script = document.createElement("script");
  script.src =
    "https://www.googletagmanager.com/gtag/js?id=" +
    window.__CONFIG.analytics.gaId;
  script.async = true;
  document.head.appendChild(script);
  script.onload = function () {
    gtag("js", new Date());
    gtag("config", window.__CONFIG.analytics.gaId, {
      send_page_view: true,
      anonymize_ip: true,
    });
  };
}

// Memuat GA saat browser idle, atau setelah 3 detik sebagai fallback
if ("requestIdleCallback" in window) {
  requestIdleCallback(loadGoogleAnalytics, { timeout: 3000 });
} else {
  window.addEventListener("load", function () {
    setTimeout(loadGoogleAnalytics, 3000);
  });
}