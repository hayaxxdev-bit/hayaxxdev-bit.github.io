// ════════════════════════════════════════════════════════════════
// FRONTEND CONFIG - hayaxxdev-bit Portfolio
// Path: /public/js/config.js
// Single source of truth untuk semua konfigurasi frontend
// ════════════════════════════════════════════════════════════════

(function () {
  "use strict";

  // ═══════════════ ENVIRONMENT DETECTION ═══════════════
  const hostname = window.location.hostname;
  const isProduction = hostname === "hayaxxdev-bit.my.id";
  const isVercel = hostname.includes("vercel.app");
  const isGitHubPages = hostname.includes("github.io");
  const isLocal = ["localhost", "127.0.0.1", "0.0.0.0"].includes(hostname) ||
    window.location.port === "5500" ||
    window.location.protocol === "file:";
  const isDevelopment = isLocal || window.location.port === "3000" || 
    window.location.port === "5173";

  // ═══════════════ CORE CONFIGURATION ═══════════════
  window.__MAPLE_CONFIG = {
    // ── Version ──
    version: "2.5.0",
    buildDate: "2026-07-18",
    codename: "Maple's Eternal Shield",

    // ── Environment ──
    env: {
      isProduction,
      isVercel,
      isGitHubPages,
      isLocal,
      isDevelopment,
      mode: isProduction ? "production" : "development",
    },

    // ── Domain ──
    domain: {
      primary: "hayaxxdev-bit.my.id",
      baseUrl: isProduction
        ? "https://hayaxxdev-bit.my.id"
        : window.location.origin,
      canonical: "https://hayaxxdev-bit.my.id",
    },

    // ── GitHub ──
    github: {
      username: "hayaxxdev-bit",
      repository: "hayaxxdev-bit",
      
      // API endpoints
      api: {
        base: "https://api.github.com",
        raw: "https://raw.githubusercontent.com",
        graphql: "https://api.github.com/graphql",
      },
      
      // Vercel proxy (custom API)
      proxy: {
        base: isProduction
          ? "https://hayaxxdev-bit-github-io.vercel.app"
          : "http://localhost:3000",
        health: isProduction
          ? "https://hayaxxdev-bit-github-io.vercel.app/api/health"
          : "http://localhost:3000/api/health",
        github: isProduction
          ? "https://hayaxxdev-bit-github-io.vercel.app/api/github"
          : "http://localhost:3000/api/github",
      },
      
      // Repo settings
      repos: {
        perPage: 100,
        sortBy: "updated",
        excludeForks: false,
        featuredCount: 6,
      },
    },

    // ── Social Links ──
    social: {
      github: "https://github.com/hayaxxdev-bit",
      linkedin: "https://linkedin.com/in/hayaxxdev",
      twitter: "https://twitter.com/hayaxxdev",
      instagram: "https://instagram.com/hayaxxdev",
      email: "mailto:hayaxxdev@gmail.com",
      discord: "https://discord.gg/hayaxxdev",
      youtube: null,
    },

    // ── Audio ──
    audio: {
      bgmVolume: 0.5,
      sfxVolume: 0.15,
      mutedByDefault: false,
      autoplayOnInteraction: true,
      
      playlist: [
        {
          id: "track_1",
          name: "Lo-Fi Anime Beats",
          artist: "Maple's Studio",
          url: "./public/music/Clarity-phonk.wav",
          category: "chill",
        },
        {
          id: "track_2",
          name: "Maple's Defense",
          artist: "Bofuri OST",
          url: "./public/music/maple-theme.mp3",
          category: "epic",
        },
        {
          id: "track_3",
          name: "Adventure Time",
          artist: "Guild Members",
          url: "./public/music/adventure.mp3",
          category: "adventure",
        },
      ],
      
      sfx: {
        menuSelect: { type: "square", frequencies: [880, 1174.66], gain: 0.08, duration: 0.12 },
        questClear: { type: "melody", notes: [523.25, 659.25, 783.99, 1046.5], gain: 0.1, duration: 0.25 },
        achievement: { type: "melody", notes: [523.25, 659.25, 783.99, 1046.5], gain: 0.15, duration: 0.3 },
        close: { type: "sine", frequencies: [600, 150], gain: 0.06, duration: 0.2, exponential: true },
        dialogue: { type: "sine", frequencies: [440, 660], gain: 0.04, duration: 0.12, exponential: true },
        error: { type: "sawtooth", frequencies: [200, 100], gain: 0.05, duration: 0.3, exponential: true },
        success: { type: "triangle", frequencies: [523.25, 783.99], gain: 0.08, duration: 0.2 },
        hover: { type: "sine", frequencies: [600], gain: 0.02, duration: 0.05 },
      },
    },

    // ── UI / Theme ──
    ui: {
      // Typography
      typingSpeed: { min: 25, max: 45 },
      typingCursorBlink: 530,
      
      // Loader
      loader: {
        timeout: 5000,
        minDisplayTime: 1500,
        progressSteps: 100,
      },
      
      // Carousel
      carousel: {
        autoplayDelay: 4500,
        transitionDuration: 500,
        pauseOnHover: true,
      },
      
      // Toast notifications
      toasts: {
        duration: 4000,
        maxVisible: 3,
        position: "bottom-right",
      },
      
      // Visual Novel / Dialogue
      dialogue: {
        autoStartDelay: 3000,
        typingEffect: true,
        allowSkip: true,
        showCharacterAvatar: true,
      },
      
      // Guide Tour
      guide: {
        autoStartDelay: 5000,
        stepDuration: 3000,
        highlightColor: "#a855f7",
        overlayOpacity: 0.7,
      },
    },

    // ── Performance ──
    performance: {
      // Lazy loading
      lazyLoadThreshold: "200px",
      imageLazyLoad: true,
      
      // Caching
      cache: {
        enabled: true,
        duration: 1000 * 60 * 30, // 30 minutes
        version: "v2",
      },
      
      // Request optimization
      requests: {
        retryMax: 3,
        retryDelay: 1000,
        timeout: 15000,
        maxConcurrent: 5,
        rateLimitThreshold: 10,
      },
      
      // Animation
      animations: {
        enabled: true,
        reduceMotion: false, // Will be overridden by prefers-reduced-motion
        statsAnimationDuration: 1500,
      },
    },

    // ── Analytics ──
    analytics: {
      googleAnalyticsId: "G-E87BE53RJ2",
      enableTracking: true,
      anonymizeIP: true,
      respectDNT: true,
      loadDeferred: true,
    },

    // ── Maintenance Mode ──
    maintenance: {
      checkInterval: 60000,
      maxFailures: 3,
      gracePeriod: 10000,
      page: "/maintenance.html",
      bypassParam: "bypass_maintenance",
    },

    // ── Feature Flags ──
    features: {
      // Core features
      audioPlayer: true,
      achievements: true,
      visualNovel: true,
      guideTour: true,
      carouselAutoplay: true,
      
      // Experimental features
      snowEffect: false,
      particleEffect: false,
      webGLBackground: false,
      p2pChat: false,
      
      // Debug features
      debugMode: !isProduction,
      verboseLogging: !isProduction,
      showPerformanceMetrics: !isProduction,
    },

    // ── Content ──
    content: {
      // Hero section
      hero: {
        name: "hayaxxdev",
        title: "Fullstack Developer & Game Developer",
        description: "Membangun pengalaman web imersif dengan estetika manga dan performa optimal.",
        badges: ["Fullstack Developer", "Game Developer", "UI/UX Designer"],
        nowBuilding: "Nexovra — Finance Dashboard",
      },
      
      // About section
      about: {
        bio: [
          "Halo! Saya hayaxxdev, seorang developer yang passionate dalam membangun web application, game, dan tools kreatif.",
          "Saat ini fokus pada frontend development, game design, dan eksplorasi teknologi baru.",
        ],
        skills: {
          frontend: ["HTML5", "CSS3", "JavaScript", "TypeScript", "React", "Vue"],
          backend: ["Node.js", "Python", "PHP", "Go"],
          tools: ["Git", "Docker", "Figma", "VS Code"],
        },
        proficiency: {
          frontend: 90,
          backend: 75,
          gameDev: 65,
          uiux: 80,
        },
        journey: [
          { year: "2023", stage: "Awal Mula", desc: "Memulai perjalanan coding dengan HTML, CSS, dan JavaScript." },
          { year: "2024", stage: "Eksplorasi", desc: "Mendalami React, Node.js, dan Python. Mulai open-source." },
          { year: "2025", stage: "Sekarang", desc: "Fokus full-stack development, game design, dan komunitas." },
        ],
      },
      
      // Contact section
      contact: {
        email: "hayaxxdev@gmail.com",
        responseTime: "1-2 hari kerja",
        location: "Indonesia",
        availability: "Available for freelance & collaboration",
      },
      
      // Footer
      footer: {
        copyright: "hayaxxdev",
        techStack: "HTML/CSS/JS",
        platform: "GitHub Pages & Vercel",
      },
    },

    // ── Language & Localization ──
    i18n: {
      defaultLocale: "id",
      supportedLocales: ["id", "en"],
      fallbackLocale: "id",
      translationsPath: "/public/locales",
    },

    // ── Easter Eggs ──
    easterEggs: {
      konamiCode: ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "KeyB", "KeyA"],
      consoleCommands: {
        "maple.power()": "Activate Maple's power",
        "maple.stats()": "Show portfolio stats",
        "maple.achievements()": "Show achievements",
        "maple.secret()": "Find the secret",
        "maple.version()": "Show version info",
      },
    },
  };

  // ═══════════════ ACCESSIBILITY DETECTION ═══════════════
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const prefersHighContrast = window.matchMedia("(prefers-contrast: high)").matches;
  const isMobileDevice = /Android|iPhone|iPad|iPod|webOS/i.test(navigator.userAgent);

  window.__MAPLE_CONFIG.ui.carousel.autoplayDelay = prefersReducedMotion ? 0 : 4500;
  window.__MAPLE_CONFIG.performance.animations.reduceMotion = prefersReducedMotion;
  window.__MAPLE_CONFIG.performance.animations.enabled = !prefersReducedMotion;

  // ═══════════════ ALIAS FOR BACKWARD COMPATIBILITY ═══════════════
  window.__CONFIG = {
    get isProduction() { return window.__MAPLE_CONFIG.env.isProduction; },
    get isVercel() { return window.__MAPLE_CONFIG.env.isVercel; },
    get isGitHubPages() { return window.__MAPLE_CONFIG.env.isGitHubPages; },
    get isLocal() { return window.__MAPLE_CONFIG.env.isLocal; },
    get isDevelopment() { return window.__MAPLE_CONFIG.env.isDevelopment; },
    get domain() { return window.__MAPLE_CONFIG.domain.primary; },
    get baseUrl() { return window.__MAPLE_CONFIG.domain.baseUrl; },
    get api() { return {
      github: window.__MAPLE_CONFIG.github.api.base,
      rawGithub: window.__MAPLE_CONFIG.github.api.raw,
      vercel: window.__MAPLE_CONFIG.github.proxy.base,
      health: window.__MAPLE_CONFIG.github.proxy.health,
      githubProxy: window.__MAPLE_CONFIG.github.proxy.github,
    };},
    get github() { return {
      username: window.__MAPLE_CONFIG.github.username,
      repo: window.__MAPLE_CONFIG.github.repository,
    };},
    get maintenance() { return window.__MAPLE_CONFIG.maintenance; },
    get analytics() { return window.__MAPLE_CONFIG.analytics; },
    get social() { return window.__MAPLE_CONFIG.social; },
    get version() { return window.__MAPLE_CONFIG.version; },
    get buildDate() { return window.__MAPLE_CONFIG.buildDate; },
  };

  // ═══════════════ CONSOLE WELCOME ═══════════════
  if (window.__MAPLE_CONFIG.features.debugMode) {
    console.log(
      `%c🍁 %cMaple Portfolio %cv${window.__MAPLE_CONFIG.version}`,
      "font-size: 1.2em;",
      "font-weight: bold; color: #a855f7;",
      "color: #94a3b8; font-size: 0.8em;"
    );
    console.log(
      `%c"防御力に全振りしたら、最強になった"`,
      "font-style: italic; color: #cbd5e1;"
    );
    console.log(
      `%c🔧 ${window.__MAPLE_CONFIG.env.mode.toUpperCase()} MODE | ${window.__MAPLE_CONFIG.codename}`,
      "color: #f59e0b;"
    );
    console.log(
      `%c💡 Try: maple.power() | maple.stats() | maple.secret()`,
      "color: #60a5fa; font-size: 0.85em;"
    );
  }

  // ═══════════════ FREEZE CONFIG ═══════════════
  // Prevent accidental modifications
  if (isProduction) {
    Object.freeze(window.__MAPLE_CONFIG);
    Object.freeze(window.__MAPLE_CONFIG.github);
    Object.freeze(window.__MAPLE_CONFIG.social);
    Object.freeze(window.__MAPLE_CONFIG.audio);
    Object.freeze(window.__MAPLE_CONFIG.features);
  }

  // ═══════════════ EXPORT CONFIG EVENT ═══════════════
  // Dispatch event when config is ready
  window.dispatchEvent(new CustomEvent("maple:configReady", {
    detail: { config: window.__MAPLE_CONFIG },
  }));

})();