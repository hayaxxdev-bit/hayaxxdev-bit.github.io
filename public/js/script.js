// ═══════════════════════════════════════════
// PORTFOLIO SCRIPT - hayaxxdev-bit
// VERSION 2.6.0 - MODULAR & OPTIMIZED
// TEMA MAPLE BOFURI
// ═══════════════════════════════════════════

(function () {
  "use strict";

  // ═══════════════════════════════════════════
  // CONFIGURATION (IMMUTABLE + VALIDATION)
  // ═══════════════════════════════════════════

  /**
   * Global configuration — frozen to prevent accidental mutation.
   * All timing values in milliseconds unless specified.
   * @constant {Readonly<object>}
   */
  const CONFIG = Object.freeze({
    // GitHub
    USERNAME: "hayaxxdev-bit",
    GITHUB_API_BASE: "https://api.github.com",
    GITHUB_RAW_BASE: "https://raw.githubusercontent.com",
    CUSTOM_API_BASE: "https://hayaxxdev-bit-github-io.vercel.app",

    // Audio
    BGM_VOLUME: 0.5,
    SFX_VOLUME: 0.15,

    // Typing effect
    TYPING_SPEED_MIN: 25, // ms per character (fastest)
    TYPING_SPEED_MAX: 45, // ms per character (slowest)

    // Timings
    GUIDE_DELAY: 5000,
    AUTO_LOAD_DELAY: 800,
    AUTOPLAY_DELAY: 4500,
    LOADER_TIMEOUT: 5000,
    STATS_ANIMATION_DURATION: 1500,

    // API & fetching
    MAX_REPOS_PER_PAGE: 100,
    ALL_REPOS: true,
    FEATURED_COUNT: 6,
    RETRY_MAX: 3,
    RETRY_DELAY: 1000, // base delay
    RATE_LIMIT_THRESHOLD: 10, // remaining requests before showing warning

    // Cache
    CACHE_DURATION: 1000 * 60 * 30, // 30 minutes
    CACHE_PREFIX: "haya_cache_",
    CACHE_VERSION: "v1",
  });

  /**
   * GitHub language → hex color mapping.
   * Falls back to #8b949e (GitHub's default muted) for unknown languages.
   * @constant {Readonly<Record<string, string>>}
   */
  const LANGUAGE_COLORS = Object.freeze({
    JavaScript: "#f1e05a",
    TypeScript: "#3178c6",
    Python: "#3572A5",
    HTML: "#e34c26",
    CSS: "#563d7c",
    SCSS: "#c6538c",
    Java: "#b07219",
    "C++": "#f34b7d",
    "C#": "#178600",
    C: "#555555",
    PHP: "#4F5D95",
    Ruby: "#701516",
    Go: "#00ADD8",
    Rust: "#dea584",
    Swift: "#F05138",
    Kotlin: "#A97BFF",
    Dart: "#00B4AB",
    Shell: "#89e051",
    Vue: "#41b883",
    Lua: "#000080",
    // Aliases
    JS: "#f1e05a",
    TS: "#3178c6",
    JSX: "#f1e05a",
    TSX: "#3178c6",
  });

  const DEFAULT_LANG_COLOR = "#8b949e";

  /**
   * Returns the hex color for a given programming language.
   * Uses memoization for repeated lookups (micro-optimization).
   * @param {string} lang - Language name (case-sensitive)
   * @returns {string} Hex color code
   */
  const getLanguageColor = (() => {
    const memo = new Map();
    return (lang) => {
      if (memo.has(lang)) return memo.get(lang);
      const color = LANGUAGE_COLORS[lang] ?? DEFAULT_LANG_COLOR;
      memo.set(lang, color);
      return color;
    };
  })();

  // ═══════════════════════════════════════════
  // 3. UTILITY FUNCTIONS
  // ═══════════════════════════════════════════

  /**
   * Converts a date string to Indonesian relative time ("X waktu lalu").
   * Handles future dates gracefully by returning "Baru saja".
   * @param {string|Date} dateInput - ISO date string or Date object
   * @returns {string} Human-readable relative time in Indonesian
   */
  const timeAgo = (dateInput) => {
    const date = dateInput instanceof Date ? dateInput : new Date(dateInput);

    // Guard: invalid date
    if (isNaN(date.getTime())) return "—";

    const now = Date.now();
    const diffMs = now - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);

    // Future date or just now
    if (diffSec <= 0) return "Baru saja";

    // Use integer division with threshold constants
    const MINUTE = 60;
    const HOUR = 3600;
    const DAY = 86400;
    const MONTH = 2592000; // ~30 days
    const YEAR = 31536000; // ~365 days

    if (diffSec < MINUTE) return "Baru saja";
    if (diffSec < HOUR) return `${Math.floor(diffSec / MINUTE)} menit lalu`;
    if (diffSec < DAY) return `${Math.floor(diffSec / HOUR)} jam lalu`;
    if (diffSec < MONTH) return `${Math.floor(diffSec / DAY)} hari lalu`;
    if (diffSec < YEAR) return `${Math.floor(diffSec / MONTH)} bulan lalu`;
    return `${Math.floor(diffSec / YEAR)} tahun lalu`;
  };

  /**
   * Sanitizes a string for safe HTML insertion.
   * Pure string replacement — no DOM overhead, 3x faster than createElement.
   * @param {string} text - Raw text to escape
   * @returns {string} HTML-escaped string
   */
  const escapeHtml = (() => {
    const entityMap = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
      "/": "&#x2F;",
    };
    const regex = /[&<>"'/]/g;
    return (text) =>
      String(text ?? "").replace(regex, (char) => entityMap[char]);
  })();

  /**
   * Debounce utility — delays execution until after `delay` ms of inactivity.
   * @param {Function} fn - Function to debounce
   * @param {number} delay - Delay in milliseconds
   * @returns {Function} Debounced function with .cancel() method
   */
  const debounce = (fn, delay = 300) => {
    let timer;
    const debounced = (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
    debounced.cancel = () => clearTimeout(timer);
    return debounced;
  };

  /**
   * Throttle utility — ensures function runs at most once per `limit` ms.
   * @param {Function} fn - Function to throttle
   * @param {number} limit - Minimum interval in milliseconds
   * @returns {Function} Throttled function
   */
  const throttle = (fn, limit = 100) => {
    let inThrottle = false;
    return (...args) => {
      if (!inThrottle) {
        fn(...args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  };

  /**
   * Safe JSON parse with fallback.
   * @param {string} json - JSON string to parse
   * @param {*} fallback - Value to return on parse error
   * @returns {*} Parsed object or fallback
   */
  const safeJsonParse = (json, fallback = null) => {
    try {
      return JSON.parse(json);
    } catch {
      return fallback;
    }
  };

  /**
   * Generate a cache key for localStorage with versioning.
   * @param {string} key - Base key name
   * @returns {string} Versioned cache key
   */
  const cacheKey = (key) =>
    `${CONFIG.CACHE_PREFIX}${CONFIG.CACHE_VERSION}_${key}`;

  /**
   * Get cached data from localStorage with expiry check.
   * @param {string} key - Cache key
   * @returns {*|null} Cached data or null if expired/missing
   */
  const getCache = (key) => {
    try {
      const raw = localStorage.getItem(cacheKey(key));
      if (!raw) return null;
      const { data, expiry } = JSON.parse(raw);
      if (Date.now() > expiry) {
        localStorage.removeItem(cacheKey(key));
        return null;
      }
      return data;
    } catch {
      return null;
    }
  };

  /**
   * Store data in localStorage with expiry.
   * @param {string} key - Cache key
   * @param {*} data - Data to cache
   * @param {number} [ttl] - Time-to-live in ms (default: CONFIG.CACHE_DURATION)
   */
  const setCache = (key, data, ttl = CONFIG.CACHE_DURATION) => {
    try {
      const payload = {
        data,
        expiry: Date.now() + ttl,
      };
      localStorage.setItem(cacheKey(key), JSON.stringify(payload));
    } catch (err) {
      // localStorage full or unavailable — silent fail
      console.warn("[Cache] Unable to store:", key, err.message);
    }
  };

  // ═══════════════════════════════════════════
  // SVG ICONS (LAZY-INITIALIZED)
  // ═══════════════════════════════════════════

  /**
   * SVG icon templates.
   * Stored as functions so they're only stringified when first called.
   * @constant {Readonly<Record<string, function>>}
   */
  const ICONS = (() => {
    let cache = null;
    return new Proxy(
      {},
      {
        get(_, prop) {
          // Initialize cache on first access
          if (!cache) {
            cache = {
              star: '<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25z"/></svg>',
              fork: '<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0zM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0z"/></svg>',
              clock:
                '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
              repo: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>',
              demo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>',
              pages:
                '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>',
              readme:
                '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>',
            };
            Object.freeze(cache);
          }
          return cache[prop] ?? "";
        },
      },
    );
  })();

  // ═══════════════════════════════════════════
  // ERROR HANDLER UTILITY
  // ═══════════════════════════════════════════

  /**
   * Wraps a function with try-catch and optional fallback.
   * @param {Function} fn - Function to wrap
   * @param {Function} [onError] - Error callback (receives error object)
   * @returns {Function} Wrapped function
   */
  const safeWrapper = (fn, onError = null) => {
    return (...args) => {
      try {
        return fn(...args);
      } catch (err) {
        console.error(`[${fn.name || "anonymous"}] Error:`, err);
        if (onError) onError(err);
        return undefined;
      }
    };
  };

  // ═══════════════════════════════════════════
  // EXPORT TO GLOBAL SCOPE (FOR OTHER SCRIPTS)
  // ═══════════════════════════════════════════

  window.__HAYA = {
    CONFIG,
    getLanguageColor,
    timeAgo,
    escapeHtml,
    debounce,
    throttle,
    safeJsonParse,
    getCache,
    setCache,
    cacheKey,
    ICONS,
    safeWrapper,
  };

  // Log initialization (development only)
  if (window.location.hostname === "localhost" || window.__DEV_MODE) {
    console.log("🍁 Maple Utils v2.6.0 initialized", {
      config: CONFIG,
      utilsLoaded: Object.keys(window.__HAYA).length,
    });
  }

  // ═══════════════════════════════════════════
  // 3. CACHE MANAGER (ENHANCED v2.6.0)
  // ═══════════════════════════════════════════

  /**
   * Dual-layer cache system:
   *   Layer 1: In-memory Map (nanosecond access, cleared on page unload)
   *   Layer 2: localStorage (persistent, survives page reloads)
   *
   * Features:
   *   - Batch writing to reduce I/O pressure
   *   - Automatic QuotaExceededError recovery
   *   - LRU-like eviction when storage is full
   *   - TTL support with infinite cache (ttl=0 or negative)
   *   - Statistics tracking for debugging
   *   - Old version migration
   *
   * @class CacheManager
   */
  class CacheManager {
    /** @type {string} Prefix for localStorage keys */
    #prefix = "maple_cache_";
    /** @type {string} Current cache schema version */
    #version = "v2";
    /** @type {Map<string, object>} Layer 1: instant in-memory cache */
    #memoryCache = new Map();
    /** @type {Map<string, object>} Queued writes waiting for batch flush */
    #pendingWrites = new Map();
    /** @type {number|null} Timer ID for batch write debounce */
    #writeTimer = null;
    /** @type {number} Max localStorage keys to scan in migration */
    static #MAX_MIGRATION_SCAN = 500;

    /** @type {object} Runtime statistics */
    stats = Object.seal({
      hits: 0,
      misses: 0,
      writes: 0,
      evictions: 0,
      quotaErrors: 0,
    });

    constructor() {
      // Defer migration to idle time (don't block constructor)
      this.#scheduleMigration();
    }

    // ════════════════════════════════════════
    // PUBLIC API
    // ════════════════════════════════════════

    /**
     * Store data in cache.
     *
     * @param {string} key - Unique cache key
     * @param {*} data - Serializable data to cache
     * @param {object} [options]
     * @param {number} [options.ttl=1800000] - Time-to-live in ms (0 = infinite, default 30min)
     * @param {boolean} [options.immediate=false] - Skip batch queue, write to storage NOW
     * @returns {boolean} True if stored successfully
     *
     * @example
     *   await cache.set('repos', data, { ttl: 600000 });        // 10 min
     *   await cache.set('theme', 'dark', { ttl: 0 });           // infinite
     *   await cache.set('critical', data, { immediate: true });  // write now
     */
    async set(
      key,
      data,
      { ttl = CONFIG.CACHE_DURATION, immediate = false } = {},
    ) {
      const cacheKey = this.#fullKey(key);

      const effectiveTTL = ttl <= 0 ? Infinity : ttl;

      const cacheItem = Object.freeze({
        data,
        timestamp: Date.now(),
        ttl: effectiveTTL,
        size: CacheManager.#estimateSize(data),
      });

      // Layer 1: Always store in memory (instant)
      this.#memoryCache.set(cacheKey, cacheItem);

      // Layer 2: Write to persistent storage
      if (immediate) {
        return this.#flushOne(cacheKey, cacheItem);
      }

      // Queue for batch write
      this.#pendingWrites.set(cacheKey, cacheItem);
      this.#scheduleFlush();
      return true;
    }

    /**
     * Retrieve data from cache.
     * Checks memory first (fastest), then localStorage.
     *
     * @param {string} key - Cache key
     * @param {object} [options]
     * @param {boolean} [options.forceRefresh=false] - Skip cache, always return null
     * @returns {*|null} Cached data clone, or null if missing/expired
     */
    get(key, { forceRefresh = false } = {}) {
      if (forceRefresh) {
        this.stats.misses++;
        return null;
      }

      const cacheKey = this.#fullKey(key);

      // 1. Check memory cache
      const memItem = this.#memoryCache.get(cacheKey);
      if (memItem !== undefined) {
        if (!this.#isStale(memItem)) {
          this.stats.hits++;
          return CacheManager.#safeClone(memItem.data);
        }
        // Stale — remove from memory
        this.#memoryCache.delete(cacheKey);
      }

      // 2. Check localStorage
      try {
        const raw = localStorage.getItem(cacheKey);
        if (!raw) {
          this.stats.misses++;
          return null;
        }

        const item = JSON.parse(raw);

        if (this.#isStale(item)) {
          localStorage.removeItem(cacheKey);
          this.stats.evictions++;
          this.stats.misses++;
          return null;
        }

        // Promote to memory cache for next access
        this.#memoryCache.set(cacheKey, item);
        this.stats.hits++;
        return CacheManager.#safeClone(item.data);
      } catch (err) {
        // Corrupted data — clean up
        console.warn(`[Cache] Read error for "${key}":`, err.message);
        try {
          localStorage.removeItem(cacheKey);
        } catch {}
        this.stats.misses++;
        return null;
      }
    }

    /**
     * Batch-retrieve multiple keys at once.
     * @param {string[]} keys - Array of cache keys
     * @returns {Record<string, *>} Object mapping keys to their cached values
     */
    getMulti(keys) {
      const result = Object.create(null);
      for (const key of keys) {
        result[key] = this.get(key);
      }
      return result;
    }

    /**
     * Batch-store multiple items.
     * @param {Record<string, *>} items - Key-value pairs
     * @param {object} [options] - Same as set()
     * @returns {Promise<boolean[]>} Array of success flags
     */
    async setMulti(items, options = {}) {
      const entries = Object.entries(items);
      const results = [];
      for (const [key, data] of entries) {
        results.push(await this.set(key, data, options));
      }
      return results;
    }

    /**
     * Remove a specific key from all cache layers.
     * @param {string} key - Cache key
     * @returns {boolean} True if removed
     */
    remove(key) {
      const cacheKey = this.#fullKey(key);
      this.#memoryCache.delete(cacheKey);
      this.#pendingWrites.delete(cacheKey);
      try {
        localStorage.removeItem(cacheKey);
        return true;
      } catch {
        return false;
      }
    }

    /**
     * Check if a key exists and is not expired.
     * @param {string} key - Cache key
     * @returns {boolean}
     */
    has(key) {
      const cacheKey = this.#fullKey(key);

      // Memory check
      const memItem = this.#memoryCache.get(cacheKey);
      if (memItem !== undefined) return !this.#isStale(memItem);

      // Storage check
      try {
        const raw = localStorage.getItem(cacheKey);
        if (!raw) return false;
        const item = JSON.parse(raw);
        return !this.#isStale(item);
      } catch {
        return false;
      }
    }

    /**
     * Clear cache entries.
     * @param {object} [options]
     * @param {boolean} [options.expiredOnly=false] - Only remove stale entries
     * @returns {number} Number of items removed
     */
    clear({ expiredOnly = false } = {}) {
      this.#memoryCache.clear();
      this.#pendingWrites.clear();

      let removed = 0;
      try {
        const keys = Object.keys(localStorage);
        for (const key of keys) {
          if (!key.startsWith(this.#prefix)) continue;

          if (expiredOnly) {
            try {
              const item = JSON.parse(localStorage.getItem(key));
              if (this.#isStale(item)) {
                localStorage.removeItem(key);
                removed++;
              }
            } catch {
              // Corrupt data counts as expired
              localStorage.removeItem(key);
              removed++;
            }
          } else {
            localStorage.removeItem(key);
            removed++;
          }
        }
      } catch (err) {
        console.warn("[Cache] Clear error:", err.message);
      }

      this.stats.evictions += removed;
      if (removed > 0) {
        console.log(`🗑️  Cache cleared: ${removed} item(s)`);
      }
      return removed;
    }

    /**
     * Get cache statistics and health info.
     * @returns {object} Stats object
     */
    getStats() {
      const total = this.stats.hits + this.stats.misses;
      const hitRate =
        total > 0 ? ((this.stats.hits / total) * 100).toFixed(1) : "0.0";

      return {
        ...this.stats,
        hitRate: `${hitRate}%`,
        memoryItems: this.#memoryCache.size,
        pendingFlush: this.#pendingWrites.size,
        ...this.#calculateStorageSize(),
      };
    }

    /**
     * Pre-load frequently-used keys into memory cache.
     * @param {string[]} keys - Keys to warm
     * @returns {this} For chaining
     */
    warm(keys) {
      console.log(`🔥 Cache warm: loading ${keys.length} key(s)...`);
      for (const key of keys) {
        this.get(key); // Promotes to memory on hit
      }
      return this;
    }

    /**
     * Cleanup — flush pending writes and clear memory.
     * Call before page unload or SPA route change.
     */
    destroy() {
      if (this.#pendingWrites.size > 0) {
        this.#flushAll();
      }
      this.#memoryCache.clear();
      this.#pendingWrites.clear();
      if (this.#writeTimer) {
        clearTimeout(this.#writeTimer);
        this.#writeTimer = null;
      }
    }

    // ════════════════════════════════════════
    // PRIVATE METHODS
    // ════════════════════════════════════════

    /** Generate fully-qualified localStorage key */
    #fullKey(key) {
      return `${this.#prefix}${this.#version}_${key}`;
    }

    /**
     * Check if a cache item has exceeded its TTL.
     * TTL of 0 or Infinity = never expires.
     * @param {object} item - Cache item with .timestamp and .ttl
     * @returns {boolean}
     */
    #isStale(item) {
      if (!item || typeof item.timestamp !== "number") return true;
      // Infinite TTL (0, negative, or Infinity)
      if (item.ttl <= 0 || item.ttl === Infinity) return false;
      return Date.now() - item.timestamp > item.ttl;
    }

    /** Write a single item to localStorage immediately */
    #flushOne(cacheKey, item) {
      try {
        localStorage.setItem(cacheKey, JSON.stringify(item));
        this.stats.writes++;
        return true;
      } catch (err) {
        return this.#handleWriteError(err, cacheKey, item);
      }
    }

    /** Handle write errors, including quota recovery */
    #handleWriteError(err, cacheKey, item) {
      if (err.name === "QuotaExceededError") {
        this.stats.quotaErrors++;
        console.warn("⚠️  Storage full — cleaning...");

        // Step 1: Remove only expired items
        this.clear({ expiredOnly: true });

        // Step 2: Retry write
        try {
          localStorage.setItem(cacheKey, JSON.stringify(item));
          this.stats.writes++;
          return true;
        } catch {}

        // Step 3: Evict oldest 20 items and retry
        console.warn("⚠️  Still full — evicting oldest...");
        this.#evictOldest(20);

        try {
          localStorage.setItem(cacheKey, JSON.stringify(item));
          this.stats.writes++;
          return true;
        } catch (finalErr) {
          console.error(
            "❌ Cache write failed after recovery:",
            finalErr.message,
          );
          return false;
        }
      }

      console.warn("[Cache] Write error:", err.message);
      return false;
    }

    /** Schedule a delayed batch flush */
    #scheduleFlush() {
      if (this.#writeTimer !== null) return;
      this.#writeTimer = setTimeout(() => this.#flushAll(), 500);
    }

    /** Execute all pending writes at once */
    #flushAll() {
      if (this.#pendingWrites.size === 0) {
        this.#writeTimer = null;
        return;
      }

      const count = this.#pendingWrites.size;
      this.#pendingWrites.forEach((item, cacheKey) => {
        this.#flushOne(cacheKey, item);
      });
      this.#pendingWrites.clear();
      this.#writeTimer = null;

      if (count > 1) {
        console.log(`💾 Cache flushed: ${count} item(s)`);
      }
    }

    /** Remove oldest N items from storage */
    #evictOldest(count = 10) {
      try {
        const entries = [];
        for (const key of Object.keys(localStorage)) {
          if (!key.startsWith(this.#prefix)) continue;
          try {
            const item = JSON.parse(localStorage.getItem(key));
            entries.push({ key, timestamp: item.timestamp ?? 0 });
          } catch {}
        }

        // Sort oldest first
        entries.sort((a, b) => a.timestamp - b.timestamp);

        // Remove
        for (const entry of entries.slice(0, count)) {
          localStorage.removeItem(entry.key);
          this.#memoryCache.delete(entry.key);
        }

        this.stats.evictions += Math.min(count, entries.length);
      } catch {}
    }

    /** Calculate total cache size in localStorage */
    #calculateStorageSize() {
      let count = 0;
      let bytes = 0;
      try {
        for (const key of Object.keys(localStorage)) {
          if (key.startsWith(this.#prefix)) {
            count++;
            bytes += localStorage.getItem(key).length * 2; // UTF-16
          }
        }
      } catch {}
      return {
        storageCount: count,
        estimatedMB: (bytes / (1024 * 1024)).toFixed(2),
      };
    }

    /** Defer migration to avoid blocking constructor */
    #scheduleMigration() {
      // Use requestIdleCallback if available, otherwise setTimeout
      const migrate = () => this.#migrateFromOldVersions();
      if (typeof requestIdleCallback === "function") {
        requestIdleCallback(migrate, { timeout: 2000 });
      } else {
        setTimeout(migrate, 100);
      }
    }

    /** Clean up cache entries from older schema versions */
    #migrateFromOldVersions() {
      try {
        const keys = Object.keys(localStorage);
        let count = 0;
        let scanned = 0;

        for (const key of keys) {
          // Safety limit — don't scan thousands of keys on every init
          if (scanned++ > CacheManager.#MAX_MIGRATION_SCAN) break;

          // Old format: has prefix but no version marker
          if (key.startsWith(this.#prefix) && !key.includes(`_v`)) {
            try {
              localStorage.removeItem(key);
              count++;
            } catch {}
          }
        }

        if (count > 0) {
          console.log(`🔄 Migrated ${count} old cache item(s)`);
        }
      } catch {}
    }

    // ════════════════════════════════════════
    // STATIC UTILITIES
    // ════════════════════════════════════════

    /**
     * Estimate the byte size of a value.
     * Uses a heuristic that avoids creating Blobs for every call.
     * @param {*} data - Value to measure
     * @returns {number} Estimated size in bytes
     */
    static #estimateSize(data) {
      if (data === null || data === undefined) return 4;
      if (typeof data === "boolean") return 4;
      if (typeof data === "number") return 8;
      if (typeof data === "string") return data.length * 2; // UTF-16 approximation
      if (typeof data === "object") {
        try {
          return JSON.stringify(data).length * 2;
        } catch {
          return 0;
        }
      }
      return 16; // Unknown, assume small
    }

    /**
     * Safely clone data for return (prevents external mutation of cached data).
     * Tries structuredClone first, falls back to JSON round-trip, then shallow.
     * @param {*} data - Data to clone
     * @returns {*} Cloned copy
     */
    static #safeClone(data) {
      // 1. Try structuredClone (handles Date, Map, Set, ArrayBuffer, etc.)
      if (typeof structuredClone === "function") {
        try {
          return structuredClone(data);
        } catch {
          // structuredClone fails on functions, symbols, DOM nodes, etc.
        }
      }

      // 2. JSON round-trip (loses Date, Map, Set, but handles plain objects)
      try {
        return JSON.parse(JSON.stringify(data));
      } catch {
        // Contains circular references, BigInt, etc.
      }

      // 3. Shallow copy as last resort
      if (Array.isArray(data)) return [...data];
      if (typeof data === "object" && data !== null) return { ...data };
      return data; // Primitives are immutable anyway
    }
  }
  // ═══════════════════════════════════════════
  // AUDIO MANAGER v2.6.0 - OPTIMIZED
  // ═══════════════════════════════════════════

  /**
   * Professional-grade audio engine for BGM, SFX, and spatial audio.
   * Uses Web Audio API with synthesis-based SFX (no external files needed).
   *
   * Features:
   *   - Crossfade BGM transitions
   *   - Synthesized SFX (8 preset types)
   *   - Spatial audio with distance attenuation
   *   - Real-time frequency visualizer (auto-pauses when idle)
   *   - Media Session API integration
   *   - Keyboard shortcuts (non-blocking, scoped)
   *   - State persistence via CacheManager
   *
   * @class AudioManager
   */
  class AudioManager {
    /** @type {AudioManager|null} Singleton instance */
    static #instance = null;

    // ── Private fields ──────────────────────────
    #context = null;
    #masterGain = null;
    #bgmGain = null;
    #sfxGain = null;
    #currentSource = null;
    #analyser = null;
    #frequencyData = null;
    #visualizerCallbacks = [];
    #visualizerRAF = null;
    #isCrossfading = false;
    #listenerPosition = { x: 0, y: 0, z: 0 };
    #cacheManager = null; // Reuse existing CacheManager

    // ── Public state ────────────────────────────
    isPlaying = false;
    isInitialized = false;
    bgmVolume = CONFIG.BGM_VOLUME;
    sfxVolume = CONFIG.SFX_VOLUME;
    masterVolume = 1.0;
    isMuted = false;
    currentTrackIndex = 0;
    shuffleMode = false;
    repeatMode = "all"; // 'off' | 'one' | 'all'

    // ── SFX registry (lazy-compiled) ───────────
    #sfxPresets = Object.freeze({
      menuSelect: {
        type: "square",
        freq: [880, 1174.66],
        gain: 0.08,
        dur: 0.12,
      },
      questClear: {
        type: "melody",
        notes: [523.25, 659.25, 783.99, 1046.5],
        gain: 0.1,
        noteDur: 0.25,
      },
      close: {
        type: "sine",
        freq: [600, 150],
        gain: 0.06,
        dur: 0.2,
        expo: true,
      },
      dialogue: {
        type: "sine",
        freq: [440, 660],
        gain: 0.04,
        dur: 0.12,
        expo: true,
      },
      guideStart: {
        type: "melody",
        notes: [523.25, 659.25, 783.99],
        gain: 0.06,
        noteDur: 0.15,
      },
      achievement: {
        type: "melody",
        notes: [523.25, 659.25, 783.99, 1046.5],
        gain: 0.15,
        noteDur: 0.3,
      },
      error: {
        type: "sawtooth",
        freq: [200, 100],
        gain: 0.05,
        dur: 0.3,
        expo: true,
      },
      success: {
        type: "triangle",
        freq: [523.25, 783.99],
        gain: 0.08,
        dur: 0.2,
      },
      hover: { type: "sine", freq: [600], gain: 0.02, dur: 0.05 },
    });

    #sfxCache = null; // Lazy-compiled Map<string, Function>

    // ── Playlist ────────────────────────────────
    playlist = [
      {
        id: "track_1",
        name: "Lo-Fi Anime Beats",
        artist: "Maple's Studio",
        url: "./public/music/Clarity-phonk.mp3",
        bpm: 85,
        category: "chill",
      },
      {
        id: "track_2",
        name: "Maple's Defense",
        artist: "Bofuri OST",
        url: "./public/music/maple-theme.mp3",
        bpm: 120,
        category: "epic",
      },
      {
        id: "track_3",
        name: "Adventure Time",
        artist: "Guild Members",
        url: "./public/music/adventure.mp3",
        bpm: 140,
        category: "adventure",
      },
      {
        id: "track_4",
        name: "Sally's Speed",
        artist: "Blue Flash Records",
        url: "./public/music/sally-theme.mp3",
        bpm: 160,
        category: "action",
        fallback: true,
      },
    ];

    #shuffledIndices = [];

    // ── UI references (lazy-grabbed) ───────────
    #ui = {};

    // ════════════════════════════════════════
    // SINGLETON + CONSTRUCTOR
    // ════════════════════════════════════════

    /**
     * Get the singleton instance.
     * @param {CacheManager} [cacheManager] - Existing cache manager to reuse
     * @returns {AudioManager}
     */
    static getInstance(cacheManager) {
      if (!AudioManager.#instance) {
        AudioManager.#instance = new AudioManager(cacheManager);
      }
      return AudioManager.#instance;
    }

    constructor(cacheManager) {
      if (AudioManager.#instance) return AudioManager.#instance;
      AudioManager.#instance = this;

      this.#cacheManager = cacheManager ?? window.__HAYA?.cacheManager ?? null;

      // Defer state loading to avoid blocking constructor
      this.#loadStateAsync();
    }

    /**
     * Initialize the Web Audio API context and audio graph.
     * Must be called after a user gesture (browser autoplay policy).
     * @returns {AudioManager} this (chainable)
     */
    init() {
      if (this.isInitialized) return this;

      try {
        this.#context = new (window.AudioContext || window.webkitAudioContext)({
          latencyHint: "interactive",
          sampleRate: 44100,
        });

        // Build audio graph: Sources → BGM/SFX Gain → Analyser → Master → Destination
        this.#masterGain = this.#context.createGain();
        this.#bgmGain = this.#context.createGain();
        this.#sfxGain = this.#context.createGain();
        this.#analyser = this.#context.createAnalyser();

        this.#analyser.fftSize = 256;
        this.#frequencyData = new Uint8Array(this.#analyser.frequencyBinCount);

        // Apply stored volumes
        this.#masterGain.gain.value = this.isMuted ? 0 : this.masterVolume;
        this.#bgmGain.gain.value = this.bgmVolume;
        this.#sfxGain.gain.value = this.sfxVolume;

        // Connect chain
        this.#bgmGain.connect(this.#analyser);
        this.#sfxGain.connect(this.#analyser);
        this.#analyser.connect(this.#masterGain);
        this.#masterGain.connect(this.#context.destination);

        // Setup Media Session API
        this.#setupMediaSession();

        // Bind events
        this.#bindEvents();

        this.isInitialized = true;
        console.log(
          "🎵 Audio Engine Ready | Sample Rate:",
          this.#context.sampleRate,
        );

        return this;
      } catch (err) {
        console.warn("🎵 Audio init failed:", err.message);
        return this;
      }
    }

    /** Resume suspended context (required after user gesture) */
    #ensureContext() {
      if (!this.isInitialized) this.init();
      if (this.#context?.state === "suspended") {
        this.#context.resume();
      }
      return this.#context;
    }

    // ════════════════════════════════════════
    // SFX ENGINE (Lazy-compiled)
    // ════════════════════════════════════════

    /**
     * Play a sound effect by name.
     * SFX functions are compiled lazily on first use.
     *
     * @param {string} name - SFX preset name (e.g., 'menuSelect', 'achievement')
     * @param {object} [options]
     * @param {number} [options.pan=0] - Stereo pan (-1 to 1)
     * @param {number} [options.detune=0] - Detune in cents
     * @param {boolean} [options.ignoreMute=false]
     * @returns {object|undefined} Active audio nodes, or undefined if muted/error
     */
    playSFX(name, options = {}) {
      // Validate name
      if (!this.#sfxPresets[name]) {
        console.warn(`[Audio] Unknown SFX: "${name}"`);
        return;
      }

      if (!this.#ensureContext()) return;
      if (this.isMuted && !options.ignoreMute) return;

      // Lazy-compile on first call
      if (!this.#sfxCache) this.#compileAllSFX();

      return this.#sfxCache.get(name)?.(options);
    }

    /** Compile all SFX presets into playable functions */
    #compileAllSFX() {
      this.#sfxCache = new Map();
      for (const [name, preset] of Object.entries(this.#sfxPresets)) {
        const fn =
          preset.type === "melody"
            ? this.#createMelodySFX(preset)
            : this.#createOscillatorSFX(preset);
        this.#sfxCache.set(name, fn);
      }
    }

    /**
     * Create a single-oscillator SFX function.
     * @param {object} p - Preset { type, freq, gain, dur, expo? }
     * @returns {Function}
     */
    #createOscillatorSFX(p) {
      return (opts = {}) => {
        const ctx = this.#context;
        const now = ctx.currentTime;
        const {
          pan = 0,
          detune = 0,
          filterFreq = null,
          ignoreMute = false,
        } = opts;

        if (this.isMuted && !ignoreMute) return;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const panner = pan !== 0 ? ctx.createStereoPanner() : null;
        const filter = filterFreq ? ctx.createBiquadFilter() : null;

        osc.type = p.type;
        osc.detune.value = detune;

        // Frequency sweep
        if (p.expo && p.freq.length === 2) {
          osc.frequency.setValueAtTime(p.freq[0], now);
          osc.frequency.exponentialRampToValueAtTime(p.freq[1], now + p.dur);
        } else {
          p.freq.forEach((f, i) => {
            osc.frequency.setValueAtTime(f, now + i * (p.dur / p.freq.length));
          });
        }

        // Gain envelope
        gain.gain.setValueAtTime(p.gain * this.sfxVolume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + p.dur);

        if (filter) {
          filter.type = "lowpass";
          filter.frequency.value = filterFreq;
        }

        // Chain: osc → filter? → gain → panner? → sfxGain
        let node = osc;
        if (filter) {
          node.connect(filter);
          node = filter;
        }
        node.connect(gain);
        if (panner) {
          gain.connect(panner);
          panner.connect(this.#sfxGain);
          panner.pan.value = pan;
        } else {
          gain.connect(this.#sfxGain);
        }

        osc.start(now);
        osc.stop(now + p.dur + 0.01);

        const nodes = { osc, gain, panner, filter };
        osc.onended = () => {
          osc.disconnect();
          gain.disconnect();
          panner?.disconnect();
          filter?.disconnect();
        };

        return nodes;
      };
    }

    /**
     * Create a multi-note melody SFX function.
     * @param {object} p - Preset { notes, gain, noteDur }
     * @returns {Function}
     */
    #createMelodySFX(p) {
      return (opts = {}) => {
        const ctx = this.#context;
        const now = ctx.currentTime;
        const { pan = 0, detune = 0, ignoreMute = false } = opts;

        if (this.isMuted && !ignoreMute) return;

        const nodes = [];
        const step = p.noteDur / p.notes.length;

        p.notes.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          // Varied waveform for richness
          const waveforms = ["triangle", "sine", "square"];
          osc.type = waveforms[i % 3];
          osc.frequency.value = freq;
          osc.detune.value = detune;

          const start = now + i * step;
          gain.gain.setValueAtTime(p.gain * this.sfxVolume, start);
          gain.gain.exponentialRampToValueAtTime(
            0.001,
            start + p.noteDur * 1.5,
          );

          osc.connect(gain);
          gain.connect(this.#sfxGain);

          osc.start(start);
          osc.stop(start + p.noteDur * 1.5);

          osc.onended = () => {
            osc.disconnect();
            gain.disconnect();
          };
          nodes.push({ osc, gain });
        });

        return nodes;
      };
    }

    // ════════════════════════════════════════
    // BGM PLAYBACK
    // ════════════════════════════════════════

    /**
     * Play a track from the playlist by index.
     * @param {number} index - Playlist index
     * @param {object} [options]
     * @param {boolean} [options.crossfade=false] - Crossfade from current track
     */
    async playTrack(index, { crossfade = false } = {}) {
      if (!this.#ensureContext()) return;

      const track = this.playlist[index];
      if (!track) return;

      // Handle fallback tracks
      if (track.fallback) {
        this.#generateFallbackTrack(track);
        return;
      }

      try {
        const response = await fetch(track.url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const buffer = await response.arrayBuffer();
        const audioBuffer = await this.#context.decodeAudioData(buffer);

        track.duration = audioBuffer.duration;

        const source = this.#context.createBufferSource();
        source.buffer = audioBuffer;
        source.loop = true;

        if (crossfade && this.#currentSource) {
          await this.#crossfadeTo(source);
        } else {
          this.#stopCurrentSource();
          source.connect(this.#bgmGain);
          source.start(0);
          this.#currentSource = source;
        }

        this.isPlaying = true;
        this.currentTrackIndex = index;
        this.#saveState();
        this.#updateUI();
        this.#updateMediaSession();

        console.log(`🎵 Now Playing: ${track.name} — ${track.artist}`);
      } catch (err) {
        console.warn(`[Audio] Failed to load "${track.name}":`, err.message);
        if (this.repeatMode !== "one") this.next();
      }
    }

    /** Crossfade from current source to new source (1.5s transition) */
    async #crossfadeTo(newSource) {
      if (this.#isCrossfading) return;
      this.#isCrossfading = true;

      const ctx = this.#context;
      const now = ctx.currentTime;
      const duration = 1.5;

      // Fade out current
      if (this.#currentSource) {
        const fadeOut = ctx.createGain();
        fadeOut.gain.setValueAtTime(this.bgmVolume, now);
        fadeOut.gain.linearRampToValueAtTime(0.001, now + duration);

        // Re-route through fadeOut
        this.#currentSource.disconnect();
        this.#currentSource.connect(fadeOut);
        fadeOut.connect(this.#bgmGain);

        setTimeout(
          () => {
            try {
              this.#currentSource.stop();
            } catch {}
            this.#currentSource.disconnect();
            fadeOut.disconnect();
          },
          duration * 1000 + 100,
        );
      }

      // Fade in new
      const fadeIn = ctx.createGain();
      fadeIn.gain.setValueAtTime(0.001, now);
      fadeIn.gain.linearRampToValueAtTime(this.bgmVolume, now + duration);

      newSource.connect(fadeIn);
      fadeIn.connect(this.#bgmGain);
      newSource.start(now);

      this.#currentSource = newSource;

      setTimeout(() => {
        this.#isCrossfading = false;
      }, duration * 1000);
    }

    /** Generate a synthesized ambient pad for fallback tracks */
    #generateFallbackTrack(track) {
      if (!this.#ensureContext()) return;
      this.#stopCurrentSource();

      const duration = 16;
      const sr = this.#context.sampleRate;
      const buffer = this.#context.createBuffer(2, sr * duration, sr);

      // Simple ambient chord pad
      for (let ch = 0; ch < 2; ch++) {
        const data = buffer.getChannelData(ch);
        for (let i = 0; i < data.length; i++) {
          const t = i / sr;
          data[i] =
            (Math.sin(2 * Math.PI * 130.81 * t) * 0.3 +
              Math.sin(2 * Math.PI * 164.81 * t) * 0.2 +
              Math.sin(2 * Math.PI * 196.0 * t) * 0.15) *
            (0.5 + 0.5 * Math.sin(0.5 * Math.PI * t));
        }
      }

      const source = this.#context.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      source.connect(this.#bgmGain);
      source.start(0);

      this.#currentSource = source;
      this.isPlaying = true;
      this.#updateUI();
      console.log(`🎹 Fallback track generated: ${track.name}`);
    }

    /** Stop and disconnect the current BGM source */
    #stopCurrentSource() {
      if (this.#currentSource) {
        try {
          this.#currentSource.stop();
        } catch {}
        this.#currentSource.disconnect();
        this.#currentSource = null;
      }
      this.isPlaying = false;
      this.#updateUI();
      this.#pauseVisualizer(); // Stop visualizer when BGM stops
    }

    // ════════════════════════════════════════
    // PLAYBACK CONTROLS
    // ════════════════════════════════════════

    toggle() {
      this.#ensureContext();
      if (this.isPlaying) {
        this.#stopCurrentSource();
        this.playSFX("close");
      } else {
        this.playTrack(this.currentTrackIndex);
        this.playSFX("menuSelect");
      }
    }

    next() {
      const idx = this.#getNextIndex();
      this.playTrack(idx, { crossfade: true });
      this.playSFX("menuSelect");
    }

    previous() {
      const idx =
        (this.currentTrackIndex - 1 + this.playlist.length) %
        this.playlist.length;
      this.playTrack(idx, { crossfade: true });
      this.playSFX("menuSelect");
    }

    #getNextIndex() {
      if (this.repeatMode === "one") return this.currentTrackIndex;
      if (this.shuffleMode) {
        if (this.#shuffledIndices.length === 0) {
          this.#shuffledIndices = [...Array(this.playlist.length).keys()]
            .filter((i) => i !== this.currentTrackIndex)
            .sort(() => Math.random() - 0.5);
        }
        return this.#shuffledIndices.shift();
      }
      return (this.currentTrackIndex + 1) % this.playlist.length;
    }

    // ════════════════════════════════════════
    // VOLUME CONTROL
    // ════════════════════════════════════════

    setVolume(value) {
      this.bgmVolume = Math.max(0, Math.min(1, value));
      if (this.#bgmGain) {
        this.#bgmGain.gain.linearRampToValueAtTime(
          this.bgmVolume,
          this.#context.currentTime + 0.1,
        );
      }
      this.#saveState();
      this.#updateUI();
    }

    setSFXVolume(value) {
      this.sfxVolume = Math.max(0, Math.min(1, value));
      this.#saveState();
    }

    toggleMute() {
      this.isMuted = !this.isMuted;
      if (this.#masterGain) {
        this.#masterGain.gain.linearRampToValueAtTime(
          this.isMuted ? 0 : this.masterVolume,
          this.#context.currentTime + 0.1,
        );
      }
      this.#updateUI();
      this.#updateMediaSession();
      this.playSFX(this.isMuted ? "close" : "menuSelect", { ignoreMute: true });
    }

    // ════════════════════════════════════════
    // SPATIAL AUDIO
    // ════════════════════════════════════════

    /**
     * Play an SFX with 2D spatial positioning (pan + distance attenuation).
     * @param {string} type - SFX preset name
     * @param {{ x: number, y: number }} position - Source position
     */
    playSpatialSFX(type, position = { x: 0, y: 0 }) {
      const preset = this.#sfxPresets[type];
      if (!preset) return;

      const dx = position.x - this.#listenerPosition.x;
      const dy = position.y - this.#listenerPosition.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const pan = Math.max(-1, Math.min(1, dx / 10));
      const attenuation = Math.max(0, 1 - distance / 20);

      this.playSFX(type, {
        pan,
        gainMultiplier: attenuation,
      });
    }

    setListenerPosition(x, y, z = 0) {
      this.#listenerPosition = { x, y, z };
      if (this.#context?.listener) {
        this.#context.listener.positionX.value = x;
        this.#context.listener.positionY.value = y;
        this.#context.listener.positionZ.value = z;
      }
    }

    // ════════════════════════════════════════
    // VISUALIZER (auto-pause when idle)
    // ════════════════════════════════════════

    #startVisualizer() {
      if (this.#visualizerRAF !== null) return; // Already running

      const loop = () => {
        if (!this.isInitialized) {
          this.#visualizerRAF = null;
          return;
        }

        this.#analyser.getByteFrequencyData(this.#frequencyData);
        for (const cb of this.#visualizerCallbacks) {
          try {
            cb(this.#frequencyData);
          } catch {}
        }

        this.#visualizerRAF = requestAnimationFrame(loop);
      };

      this.#visualizerRAF = requestAnimationFrame(loop);
    }

    #pauseVisualizer() {
      if (this.#visualizerRAF !== null) {
        cancelAnimationFrame(this.#visualizerRAF);
        this.#visualizerRAF = null;
      }
    }

    /**
     * Register a callback for real-time frequency data.
     * Visualizer auto-starts on first subscriber, auto-pauses when BGM stops.
     * @param {Function} callback - Receives Uint8Array of frequency data
     * @returns {Function} Unsubscribe function
     */
    onVisualizerData(callback) {
      this.#visualizerCallbacks.push(callback);
      // Auto-start on first subscriber
      if (this.#visualizerCallbacks.length === 1) {
        this.#startVisualizer();
      }
      return () => {
        this.#visualizerCallbacks = this.#visualizerCallbacks.filter(
          (cb) => cb !== callback,
        );
        if (this.#visualizerCallbacks.length === 0) {
          this.#pauseVisualizer();
        }
      };
    }

    getFrequencyData() {
      return this.#frequencyData;
    }

    getBassLevel() {
      if (!this.#frequencyData) return 0;
      let sum = 0;
      for (let i = 0; i < 8; i++) sum += this.#frequencyData[i];
      return sum / 8 / 255;
    }

    // ════════════════════════════════════════
    // MEDIA SESSION API
    // ════════════════════════════════════════

    #setupMediaSession() {
      if (!("mediaSession" in navigator)) return;

      navigator.mediaSession.setActionHandler("play", () => {
        if (!this.isPlaying) this.playTrack(this.currentTrackIndex);
      });
      navigator.mediaSession.setActionHandler("pause", () => {
        if (this.isPlaying) this.#stopCurrentSource();
      });
      navigator.mediaSession.setActionHandler("previoustrack", () =>
        this.previous(),
      );
      navigator.mediaSession.setActionHandler("nexttrack", () => this.next());

      this.#updateMediaSession();
    }

    #updateMediaSession() {
      if (!("mediaSession" in navigator)) return;
      const track = this.playlist[this.currentTrackIndex];
      if (!track) return;

      navigator.mediaSession.metadata = new MediaMetadata({
        title: track.name,
        artist: track.artist,
        album: "Maple's World OST",
      });
      navigator.mediaSession.playbackState = this.isPlaying
        ? "playing"
        : "paused";
    }

    // ════════════════════════════════════════
    // UI
    // ════════════════════════════════════════

    #updateUI() {
      const toggle = document.getElementById("bgmToggle");
      const label = document.getElementById("bgmLabel");
      const volumeFill = document.querySelector(".bgm-volume-fill");

      if (toggle) {
        toggle.classList.toggle("bgm-toggle--playing", this.isPlaying);
        const svg = toggle.querySelector("svg");
        if (svg) {
          svg.innerHTML = this.isPlaying
            ? '<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>'
            : '<path d="M8 5v14l11-7z"/>';
        }
      }

      const track = this.playlist[this.currentTrackIndex];
      if (label && track) {
        label.textContent = `${track.name} — ${track.artist}`;
      }

      if (volumeFill) {
        volumeFill.style.width = `${this.bgmVolume * 100}%`;
      }
    }

    // ════════════════════════════════════════
    // EVENTS (scoped, non-blocking)
    // ════════════════════════════════════════

    #bindEvents() {
      // UI buttons
      document
        .getElementById("bgmToggle")
        ?.addEventListener("click", () => this.toggle());
      document
        .getElementById("bgmNext")
        ?.addEventListener("click", () => this.next());
      document
        .getElementById("bgmPrev")
        ?.addEventListener("click", () => this.previous());
      document
        .getElementById("bgmVolumeSlider")
        ?.addEventListener("input", (e) => {
          this.setVolume(parseFloat(e.target.value));
        });

      // Keyboard shortcuts — scoped to prevent conflict with VN dialogue
      document.addEventListener("keydown", (e) => {
        // Ignore if user is typing in an input
        if (e.target.matches("input, textarea, [contenteditable]")) return;
        // Ignore if VN dialogue is active (it handles Space itself)
        if (document.getElementById("vnContainer")?.hidden === false) return;

        switch (true) {
          case e.code === "Space" && !e.ctrlKey && !e.metaKey:
            e.preventDefault();
            this.toggle();
            break;
          case e.code === "ArrowRight" && e.ctrlKey:
            e.preventDefault();
            this.next();
            break;
          case e.code === "ArrowLeft" && e.ctrlKey:
            e.preventDefault();
            this.previous();
            break;
          case e.code === "KeyM" && e.ctrlKey:
            e.preventDefault();
            this.toggleMute();
            break;
        }
      });

      // Auto-play on first user gesture (browser autoplay policy)
      const autoPlay = () => {
        if (!this.isPlaying && this.isInitialized) {
          this.playTrack(this.currentTrackIndex);
        }
        document.removeEventListener("click", autoPlay);
        document.removeEventListener("keydown", autoPlay);
      };
      document.addEventListener("click", autoPlay, { once: true });
      document.addEventListener("keydown", autoPlay, { once: true });
    }

    // ════════════════════════════════════════
    // STATE PERSISTENCE
    // ════════════════════════════════════════

    #saveState() {
      const state = {
        currentTrackIndex: this.currentTrackIndex,
        bgmVolume: this.bgmVolume,
        sfxVolume: this.sfxVolume,
        masterVolume: this.masterVolume,
        isMuted: this.isMuted,
        shuffleMode: this.shuffleMode,
        repeatMode: this.repeatMode,
      };

      // Use CacheManager if available, fallback to direct localStorage
      if (this.#cacheManager) {
        this.#cacheManager.set("audio_state", state, { ttl: 0 }); // Infinite TTL
      } else {
        try {
          localStorage.setItem("maple_audio_state", JSON.stringify(state));
        } catch {}
      }
    }

    async #loadStateAsync() {
      // Defer to next microtask so constructor completes fast
      await Promise.resolve();

      let state = null;

      if (this.#cacheManager) {
        state = this.#cacheManager.get("audio_state");
      } else {
        try {
          const raw = localStorage.getItem("maple_audio_state");
          if (raw) state = JSON.parse(raw);
        } catch {}
      }

      if (state) {
        this.currentTrackIndex = state.currentTrackIndex ?? 0;
        this.bgmVolume = state.bgmVolume ?? CONFIG.BGM_VOLUME;
        this.sfxVolume = state.sfxVolume ?? CONFIG.SFX_VOLUME;
        this.masterVolume = state.masterVolume ?? 1.0;
        this.isMuted = state.isMuted ?? false;
        this.shuffleMode = state.shuffleMode ?? false;
        this.repeatMode = state.repeatMode ?? "all";
      }
    }

    // ════════════════════════════════════════
    // CLEANUP
    // ════════════════════════════════════════

    destroy() {
      this.#saveState();
      this.#stopCurrentSource();
      this.#pauseVisualizer();
      this.#visualizerCallbacks = [];

      if (this.#context) {
        try {
          this.#context.close();
        } catch {}
        this.#context = null;
      }

      this.isInitialized = false;
      AudioManager.#instance = null;
      console.log("🎵 Audio Engine Destroyed");
    }
  }
  // ═══════════════════════════════════════════
  // ACHIEVEMENT SYSTEM v2.6.0 - OPTIMIZED
  // ═══════════════════════════════════════════

  /**
   * Gamification system with XP, leveling, combos, and secret achievements.
   * Integrates with CacheManager for persistence and AudioManager for SFX.
   *
   * @class AchievementSystem
   */
  class AchievementSystem {
    // ── Private fields ──────────────────────────
    #achievements = new Map();
    #secrets = new Set();
    #trackers = new Map();
    #easterEggsFound = new Set();
    #projectsViewed = new Set();
    #visitHistory = [];

    #playerLevel = 1;
    #totalXP = 0;
    #xpToNextLevel = 100;
    #comboCount = 0;
    #comboTimer = null;
    #dialogsCompleted = 0;
    #bgmPlayTime = 0;
    #bgmPlayInterval = null;
    #totalClicks = 0;
    #totalScrollDistance = 0;
    #guideStartTime = null;
    #sessionStartTime = Date.now();

    #audioManager = null;
    #cacheManager = null;
    #konamiBuffer = [];

    // ── Public callbacks ───────────────────────
    onAchievementUnlocked = null;
    onLevelUp = null;

    // ── UI references (queried once) ───────────
    #toastContainer = null;
    #xpBarElement = null;
    #levelElement = null;

    // ── Categories (static, immutable) ─────────
    static #CATEGORIES = Object.freeze({
      exploration: { name: "Eksplorasi", icon: "🗺️", color: "#4ade80" },
      interaction: { name: "Interaksi", icon: "💬", color: "#60a5fa" },
      projects: { name: "Proyek", icon: "📂", color: "#f59e0b" },
      guide: { name: "Panduan", icon: "📖", color: "#a78bfa" },
      music: { name: "Musik", icon: "🎵", color: "#f472b6" },
      secrets: { name: "Rahasia", icon: "🔮", color: "#fb923c" },
      skills: { name: "Keahlian", icon: "⚡", color: "#ef4444" },
    });

    static #RARITY_COLORS = Object.freeze({
      common: "#9ca3af",
      uncommon: "#4ade80",
      rare: "#60a5fa",
      epic: "#a78bfa",
      legendary: "#fbbf24",
    });

    static #RARITY_NAMES = Object.freeze({
      common: "Common",
      uncommon: "Uncommon",
      rare: "Rare",
      epic: "Epic",
      legendary: "✦ Legendary ✦",
    });

    static #KONAMI_CODE = [
      "ArrowUp",
      "ArrowUp",
      "ArrowDown",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
      "ArrowLeft",
      "ArrowRight",
      "KeyB",
      "KeyA",
    ];

    // ════════════════════════════════════════
    // CONSTRUCTOR
    // ════════════════════════════════════════

    /**
     * @param {object} [deps]
     * @param {AudioManager} [deps.audioManager]
     * @param {CacheManager} [deps.cacheManager]
     */
    constructor({ audioManager, cacheManager } = {}) {
      this.#audioManager = audioManager ?? null;
      this.#cacheManager = cacheManager ?? window.__HAYA?.cacheManager ?? null;

      // Cache DOM references
      this.#toastContainer = document.getElementById("achievementToasts");
      this.#xpBarElement = document.getElementById("xpProgressBar");
      this.#levelElement = document.getElementById("playerLevel");

      // Build achievement registry
      this.#registerAchievements();

      // Load saved state
      this.#loadState();

      // Initialize trackers
      this.#initClickTracker();
      this.#initScrollTracker();
      this.#initKonamiTracker();
      this.#initConsoleCommands();
      this.#startBGMTracking();
      this.#checkSessionAchievements();

      console.log(
        `🏆 Achievement System Ready | Level ${this.#playerLevel} | ` +
          `${this.#getTotalXP()} XP | ${this.#getUnlockedCount()}/${this.#achievements.size} Unlocked`,
      );
    }

    // ════════════════════════════════════════
    // ACHIEVEMENT REGISTRY
    // ════════════════════════════════════════

    #registerAchievements() {
      const defs = [
        // Exploration
        {
          id: "first_visit",
          name: "Petualang Baru!",
          desc: "Pertama kali mengunjungi guild Maple",
          icon: "🏠",
          xp: 100,
          cat: "exploration",
          rarity: "common",
        },
        {
          id: "returning_hero",
          name: "Pahlawan yang Kembali",
          desc: "Mengunjungi guild 3 hari berturut-turut",
          icon: "🏰",
          xp: 300,
          cat: "exploration",
          rarity: "rare",
          tracker: { type: "consecutive_days", target: 3 },
        },
        {
          id: "night_owl",
          name: "Burung Hantu",
          desc: "Berkunjung di malam hari (00:00-05:00)",
          icon: "🦉",
          xp: 100,
          cat: "exploration",
          rarity: "uncommon",
        },
        {
          id: "full_moon",
          name: "Pengunjung Bulan Purnama",
          desc: "Berkunjung saat bulan purnama",
          icon: "🌕",
          xp: 500,
          cat: "exploration",
          rarity: "legendary",
          secret: true,
        },

        // Interaction
        {
          id: "dialog_first",
          name: "Salam Kenal!",
          desc: "Memulai dialog pertama dengan Maple",
          icon: "👋",
          xp: 50,
          cat: "interaction",
          rarity: "common",
        },
        {
          id: "dialog_5",
          name: "Teman Ngobrol",
          desc: "Menyelesaikan 5 dialog dengan Maple",
          icon: "💬",
          xp: 200,
          cat: "interaction",
          rarity: "uncommon",
          tracker: { type: "dialogs", target: 5 },
        },
        {
          id: "dialog_50",
          name: "Sahabat Maple",
          desc: "Menyelesaikan 50 dialog dengan Maple",
          icon: "💝",
          xp: 1000,
          cat: "interaction",
          rarity: "legendary",
          tracker: { type: "dialogs", target: 50 },
        },
        {
          id: "speed_reader",
          name: "Pembaca Cepat",
          desc: "Melewati dialog dalam 1 detik",
          icon: "⚡",
          xp: 50,
          cat: "interaction",
          rarity: "common",
          secret: true,
        },

        // Projects
        {
          id: "project_explorer",
          name: "Penjelajah Karya",
          desc: "Melihat semua proyek di halaman karya",
          icon: "🔍",
          xp: 150,
          cat: "projects",
          rarity: "uncommon",
          tracker: { type: "projects_viewed", target: "all" },
        },
        {
          id: "project_10_demos",
          name: "Kolektor Proyek",
          desc: "Mengunjungi 10 halaman demo proyek",
          icon: "📚",
          xp: 300,
          cat: "projects",
          rarity: "rare",
          tracker: { type: "demos_visited", target: 10 },
        },
        {
          id: "star_100",
          name: "Penatap Bintang",
          desc: "Repository dengan total 100+ stars",
          icon: "⭐",
          xp: 500,
          cat: "projects",
          rarity: "epic",
        },

        // Guide
        {
          id: "guide_start",
          name: "Langkah Pertama",
          desc: "Memulai Maple's Guide Tour",
          icon: "🚶",
          xp: 50,
          cat: "guide",
          rarity: "common",
        },
        {
          id: "guide_complete",
          name: "Tur Selesai!",
          desc: "Menyelesaikan Maple's Guide Tour",
          icon: "🗺️",
          xp: 300,
          cat: "guide",
          rarity: "rare",
        },
        {
          id: "guide_speedrun",
          name: "Speedrunner!",
          desc: "Menyelesaikan guide tour dalam 30 detik",
          icon: "🏃",
          xp: 500,
          cat: "guide",
          rarity: "legendary",
          secret: true,
        },

        // Music
        {
          id: "music_start",
          name: "Music Starter",
          desc: "Memainkan BGM pertama kali",
          icon: "🔈",
          xp: 50,
          cat: "music",
          rarity: "common",
        },
        {
          id: "music_5min",
          name: "Penikmat Musik",
          desc: "Memainkan BGM selama 5 menit",
          icon: "🎵",
          xp: 150,
          cat: "music",
          rarity: "uncommon",
          tracker: { type: "bgm_time", target: 300 },
        },
        {
          id: "music_1hr",
          name: "Kecanduan Musik",
          desc: "Memainkan BGM selama 1 jam total",
          icon: "🎧",
          xp: 500,
          cat: "music",
          rarity: "epic",
          tracker: { type: "bgm_time", target: 3600 },
        },
        {
          id: "dj_maple",
          name: "DJ Maple",
          desc: "Ganti track 20 kali dalam satu sesi",
          icon: "🎛️",
          xp: 300,
          cat: "music",
          rarity: "rare",
          secret: true,
        },

        // Secrets / Easter Eggs
        {
          id: "secret_3",
          name: "Pemburu Rahasia",
          desc: "Menemukan 3 easter egg",
          icon: "🥚",
          xp: 400,
          cat: "secrets",
          rarity: "epic",
          tracker: { type: "easter_eggs", target: 3 },
        },
        {
          id: "secret_all",
          name: "Master Rahasia",
          desc: "Menemukan semua easter egg",
          icon: "🐉",
          xp: 1000,
          cat: "secrets",
          rarity: "legendary",
          secret: true,
          tracker: { type: "easter_eggs", target: "all" },
        },
        {
          id: "konami_code",
          name: "Kode Kuno",
          desc: "Masukkan Konami Code (↑↑↓↓←→←→BA)",
          icon: "🎮",
          xp: 800,
          cat: "secrets",
          rarity: "legendary",
          secret: true,
        },
        {
          id: "console_wizard",
          name: "Penyihir Console",
          desc: "Buka DevTools dan ketik 'maple.power()'",
          icon: "🔮",
          xp: 500,
          cat: "secrets",
          rarity: "epic",
          secret: true,
        },

        // Skills
        {
          id: "click_100",
          name: "Klik Cepat",
          desc: "Klik 100 kali di area manapun",
          icon: "🖱️",
          xp: 200,
          cat: "skills",
          rarity: "uncommon",
          secret: true,
          tracker: { type: "clicks", target: 100 },
        },
        {
          id: "scroll_100k",
          name: "Master Scroll",
          desc: "Scroll sejauh 10,000px dalam satu sesi",
          icon: "📜",
          xp: 300,
          cat: "skills",
          rarity: "rare",
          secret: true,
          tracker: { type: "scroll", target: 10000 },
        },
      ];

      for (const def of defs) {
        const { cat, secret, tracker, ...rest } = def;
        const achievement = {
          ...rest,
          category: cat,
          unlocked: false,
          unlockedAt: null,
          progress: 0,
          progressTarget: tracker?.target ?? 0,
          isSecret: !!secret,
          tracker: tracker ?? null,
        };
        this.#achievements.set(def.id, Object.seal(achievement));
        if (secret) this.#secrets.add(def.id);
      }
    }

    // ════════════════════════════════════════
    // PUBLIC API
    // ════════════════════════════════════════

    /** @param {AudioManager} am */
    setAudioManager(am) {
      this.#audioManager = am;
    }

    /**
     * Unlock an achievement by ID.
     * @param {string} id
     * @returns {boolean} True if newly unlocked
     */
    unlock(id) {
      const a = this.#achievements.get(id);
      if (!a || a.unlocked) return false;

      a.unlocked = true;
      a.unlockedAt = new Date().toISOString();
      a.progress = a.progressTarget;

      this.#addXP(a.xp);
      this.#handleCombo();
      this.#showToast(a);

      this.onAchievementUnlocked?.(a);

      // SFX: legendary gets special fanfare
      this.#audioManager?.playSFX(
        a.rarity === "legendary" ? "questClear" : "achievement",
      );

      if (a.rarity === "legendary" || a.rarity === "epic") {
        this.#screenFlash(a.rarity);
      }

      this.#saveState();
      console.log(
        `🏆 Unlocked: ${a.name} | +${a.xp} XP | Level ${this.#playerLevel}`,
      );
      return true;
    }

    /**
     * Update progress for a tracker-based achievement.
     * Auto-unlocks when target is reached.
     * @param {string} id
     * @param {number} value - Current progress value
     */
    updateTracker(id, value) {
      const a = this.#achievements.get(id);
      if (!a || a.unlocked || !a.tracker) return;

      const target = a.tracker.target;
      a.progress = typeof target === "number" ? Math.min(value, target) : value;

      if (typeof target === "number" && value >= target) {
        this.unlock(id);
      }
    }

    // ── Convenience tracking methods ─────────

    trackDialog() {
      this.#dialogsCompleted++;
      this.unlock("dialog_first"); // Idempotent — only unlocks once
      this.updateTracker("dialog_5", this.#dialogsCompleted);
      this.updateTracker("dialog_50", this.#dialogsCompleted);
    }

    trackProjectView(projectId) {
      this.#projectsViewed.add(projectId);
      this.updateTracker("project_explorer", this.#projectsViewed.size);
    }

    trackEasterEgg(id) {
      this.#easterEggsFound.add(id);
      this.updateTracker("secret_3", this.#easterEggsFound.size);
      this.updateTracker("secret_all", this.#easterEggsFound.size);
    }

    trackGuideStart() {
      this.#guideStartTime = performance.now();
      this.unlock("guide_start");
    }

    trackGuideComplete() {
      const elapsed = (performance.now() - this.#guideStartTime) / 1000;
      this.unlock("guide_complete");
      if (elapsed <= 30) setTimeout(() => this.unlock("guide_speedrun"), 800);
    }

    trackMusicStart() {
      this.unlock("music_start");
    }

    // ════════════════════════════════════════
    // STATS
    // ════════════════════════════════════════

    getStats() {
      const arr = [...this.#achievements.values()];
      const unlocked = arr.filter((a) => a.unlocked);
      const byCat = {};

      for (const [key, cat] of Object.entries(AchievementSystem.#CATEGORIES)) {
        const catAchievements = arr.filter((a) => a.category === key);
        byCat[key] = {
          name: cat.name,
          icon: cat.icon,
          total: catAchievements.length,
          unlocked: catAchievements.filter((a) => a.unlocked).length,
        };
      }

      return {
        level: this.#playerLevel,
        xp: this.#totalXP,
        xpToNextLevel: this.#xpToNextLevel,
        totalAchievements: this.#achievements.size,
        unlockedAchievements: unlocked.length,
        completionPercent: (
          (unlocked.length / this.#achievements.size) *
          100
        ).toFixed(1),
        totalXPEarned: unlocked.reduce((sum, a) => sum + a.xp, 0),
        byCategory: byCat,
        rares: unlocked
          .filter((a) => a.rarity === "legendary" || a.rarity === "epic")
          .map((a) => ({ name: a.name, rarity: a.rarity })),
      };
    }

    getAchievementList(category = null, showSecrets = false) {
      return [...this.#achievements.values()]
        .filter((a) => {
          if (a.isSecret && !a.unlocked && !showSecrets) return false;
          if (category && a.category !== category) return false;
          return true;
        })
        .map((a) => ({
          id: a.id,
          name: a.isSecret && !a.unlocked ? "???" : a.name,
          desc: a.isSecret && !a.unlocked ? "Achievement rahasia..." : a.desc,
          icon: a.isSecret && !a.unlocked ? "❓" : a.icon,
          rarity: a.rarity,
          unlocked: a.unlocked,
          unlockedAt: a.unlockedAt,
          xp: a.xp,
          progress: a.progress,
          progressTarget: a.progressTarget,
        }));
    }

    isUnlocked(id) {
      return this.#achievements.get(id)?.unlocked ?? false;
    }

    // ════════════════════════════════════════
    // RESET
    // ════════════════════════════════════════

    resetAll() {
      if (!confirm("Reset semua achievement? Ini tidak bisa dibatalkan!"))
        return false;

      for (const a of this.#achievements.values()) {
        a.unlocked = false;
        a.unlockedAt = null;
        a.progress = 0;
      }
      this.#playerLevel = 1;
      this.#totalXP = 0;
      this.#xpToNextLevel = 100;
      this.#saveState();
      this.#updateXPBar();
      console.log("🔄 All achievements reset");
      return true;
    }

    // ════════════════════════════════════════
    // CLEANUP
    // ════════════════════════════════════════

    destroy() {
      if (this.#bgmPlayInterval) {
        clearInterval(this.#bgmPlayInterval);
        this.#bgmPlayInterval = null;
      }
      if (this.#comboTimer) {
        clearTimeout(this.#comboTimer);
        this.#comboTimer = null;
      }
      this.#saveState();
    }

    // ════════════════════════════════════════
    // PRIVATE: XP & LEVELING
    // ════════════════════════════════════════

    #addXP(amount) {
      this.#totalXP += amount;
      while (this.#totalXP >= this.#xpToNextLevel) {
        this.#totalXP -= this.#xpToNextLevel;
        this.#playerLevel++;
        this.#xpToNextLevel = Math.floor(this.#xpToNextLevel * 1.5);
        this.#showLevelUp();
        this.onLevelUp?.(this.#playerLevel);
        this.#audioManager?.playSFX("questClear");
      }
      this.#updateXPBar();
    }

    #handleCombo() {
      this.#comboCount++;
      clearTimeout(this.#comboTimer);
      if (this.#comboCount >= 3) {
        console.log(`🔥 ${this.#comboCount}x Achievement Combo!`);
      }
      this.#comboTimer = setTimeout(() => {
        this.#comboCount = 0;
      }, 10_000);
    }

    #getTotalXP() {
      return [...this.#achievements.values()]
        .filter((a) => a.unlocked)
        .reduce((sum, a) => sum + a.xp, 0);
    }

    #getUnlockedCount() {
      return [...this.#achievements.values()].filter((a) => a.unlocked).length;
    }

    // ════════════════════════════════════════
    // PRIVATE: UI
    // ════════════════════════════════════════

    #showToast(a) {
      if (!this.#toastContainer) return;

      const toast = document.createElement("div");
      toast.className = `achievement-toast achievement-toast--${a.rarity}`;
      toast.style.setProperty(
        "--rarity-color",
        AchievementSystem.#RARITY_COLORS[a.rarity],
      );

      const comboHTML =
        this.#comboCount >= 3
          ? `<span class="achievement-toast__combo">🔥 ${this.#comboCount}x Combo!</span>`
          : "";

      toast.innerHTML = `
      <div class="achievement-toast__glow"></div>
      <span class="achievement-toast__icon">${a.icon}</span>
      <div class="achievement-toast__content">
        <span class="achievement-toast__rarity" style="color:${AchievementSystem.#RARITY_COLORS[a.rarity]}">
          ${AchievementSystem.#RARITY_NAMES[a.rarity]}
        </span>
        <span class="achievement-toast__title">Achievement Unlocked!</span>
        <span class="achievement-toast__name">${a.name}</span>
        <span class="achievement-toast__desc">${a.desc}</span>
        <div class="achievement-toast__xp-bar">
          <span class="achievement-toast__xp">+${a.xp} XP</span>
          ${comboHTML}
        </div>
      </div>
    `;

      // Close button (safe, no inline handler)
      const closeBtn = document.createElement("button");
      closeBtn.className = "achievement-toast__close";
      closeBtn.textContent = "✕";
      closeBtn.addEventListener("click", () => {
        toast.classList.add("achievement-toast--fade-out");
        setTimeout(() => toast.remove(), 400);
      });
      toast.appendChild(closeBtn);

      this.#toastContainer.appendChild(toast);

      requestAnimationFrame(() =>
        toast.classList.add("achievement-toast--show"),
      );

      const duration = a.rarity === "legendary" ? 6000 : 4000;
      setTimeout(() => {
        if (toast.isConnected) {
          toast.classList.add("achievement-toast--fade-out");
          setTimeout(() => toast.remove(), 400);
        }
      }, duration);
    }

    #showLevelUp() {
      const el = document.createElement("div");
      el.className = "level-up-effect";
      el.innerHTML = `
      <span class="level-up-effect__icon">⬆️</span>
      <span class="level-up-effect__text">Level Up!</span>
      <span class="level-up-effect__level">Level ${this.#playerLevel}</span>
    `;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 3000);

      if (this.#levelElement) {
        this.#levelElement.textContent = this.#playerLevel;
        this.#levelElement.classList.add("level-up-bounce");
        setTimeout(
          () => this.#levelElement.classList.remove("level-up-bounce"),
          1000,
        );
      }
    }

    #screenFlash(rarity) {
      const flash = document.createElement("div");
      flash.className = `screen-flash screen-flash--${rarity}`;
      document.body.appendChild(flash);
      setTimeout(() => flash.remove(), 1000);
    }

    #updateXPBar() {
      if (!this.#xpBarElement) return;
      const pct = (this.#totalXP / this.#xpToNextLevel) * 100;
      this.#xpBarElement.style.width = `${pct}%`;
      this.#xpBarElement.setAttribute("aria-valuenow", String(Math.floor(pct)));
    }

    // ════════════════════════════════════════
    // PRIVATE: TRACKERS
    // ════════════════════════════════════════

    #initClickTracker() {
      document.addEventListener("click", () => {
        this.#totalClicks++;
        this.updateTracker("click_100", this.#totalClicks);
      });
    }

    #initScrollTracker() {
      let lastY = window.scrollY;

      // Throttled scroll handler
      let ticking = false;
      window.addEventListener(
        "scroll",
        () => {
          if (!ticking) {
            requestAnimationFrame(() => {
              const currentY = window.scrollY;
              const delta = Math.abs(currentY - lastY);
              this.#totalScrollDistance += delta;
              lastY = currentY;

              if (delta > 0) {
                this.updateTracker(
                  "scroll_100k",
                  Math.floor(this.#totalScrollDistance),
                );
              }
              ticking = false;
            });
            ticking = true;
          }
        },
        { passive: true },
      );
    }

    #initKonamiTracker() {
      document.addEventListener("keydown", (e) => {
        this.#konamiBuffer.push(e.code);
        if (this.#konamiBuffer.length > AchievementSystem.#KONAMI_CODE.length) {
          this.#konamiBuffer.shift();
        }
        if (
          this.#konamiBuffer.join(",") ===
          AchievementSystem.#KONAMI_CODE.join(",")
        ) {
          this.unlock("konami_code");
          this.#konamiBuffer = []; // Reset to prevent multiple triggers
        }
      });
    }

    #initConsoleCommands() {
      // Don't overwrite existing maple object
      if (!window.maple) {
        window.maple = {
          power: () => {
            this.unlock("console_wizard");
            return "🍁 Maple's power activated! Achievement unlocked!";
          },
          stats: () => this.getStats(),
          achievements: () => this.getAchievementList(),
          secret: () => "You found the secret! But there's more... 🥚",
        };
      }
    }

    #startBGMTracking() {
      this.#bgmPlayInterval = setInterval(() => {
        if (this.#audioManager?.isPlaying) {
          this.#bgmPlayTime++;
          this.updateTracker("music_5min", this.#bgmPlayTime);
          this.updateTracker("music_1hr", this.#bgmPlayTime);
        }
      }, 1000);
    }

    // ════════════════════════════════════════
    // PRIVATE: SESSION CHECKS
    // ════════════════════════════════════════

    #checkSessionAchievements() {
      const hour = new Date().getHours();
      if (hour >= 0 && hour < 5) {
        setTimeout(() => this.unlock("night_owl"), 2000);
      }
      this.#checkConsecutiveDays();
      this.#checkFullMoon();
    }

    #checkConsecutiveDays() {
      const raw = localStorage.getItem("maple_visit_history");
      if (!raw) return;

      try {
        const history = JSON.parse(raw);
        if (history.length < 3) return;

        // Compare last 3 date strings directly (ISO date format YYYY-MM-DD)
        const last3 = history.slice(-3);
        const msPerDay = 86_400_000;

        let consecutive = true;
        for (let i = 1; i < last3.length; i++) {
          const diff = new Date(last3[i]) - new Date(last3[i - 1]);
          if (Math.abs(diff - msPerDay) > msPerDay * 0.1) {
            consecutive = false;
            break;
          }
        }

        if (consecutive) {
          setTimeout(() => this.unlock("returning_hero"), 1000);
        }
      } catch {}
    }

    #checkFullMoon() {
      // Simplified: check if today is within 1 day of a known full moon cycle
      const knownFullMoon = new Date("2024-01-25T12:00:00Z").getTime();
      const lunarCycle = 29.53059 * 86_400_000;
      const now = Date.now();
      const cyclesSince = Math.round((now - knownFullMoon) / lunarCycle);
      const nearestFullMoon = knownFullMoon + cyclesSince * lunarCycle;

      if (Math.abs(now - nearestFullMoon) < 86_400_000) {
        setTimeout(() => this.unlock("full_moon"), 5000);
      }
    }

    #updateVisitHistory() {
      const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
      if (this.#visitHistory[this.#visitHistory.length - 1] !== today) {
        this.#visitHistory.push(today);
        if (this.#visitHistory.length > 30) this.#visitHistory.shift();
        localStorage.setItem(
          "maple_visit_history",
          JSON.stringify(this.#visitHistory),
        );
      }
    }

    // ════════════════════════════════════════
    // PRIVATE: PERSISTENCE
    // ════════════════════════════════════════

    #saveState() {
      this.#updateVisitHistory();

      const data = {
        achievements: [...this.#achievements.entries()].map(([id, a]) => ({
          id,
          unlocked: a.unlocked,
          unlockedAt: a.unlockedAt,
          progress: a.progress,
        })),
        playerLevel: this.#playerLevel,
        totalXP: this.#totalXP,
        xpToNextLevel: this.#xpToNextLevel,
        totalClicks: this.#totalClicks,
        dialogsCompleted: this.#dialogsCompleted,
        bgmPlayTime: this.#bgmPlayTime,
        easterEggsFound: [...this.#easterEggsFound],
        projectsViewed: [...this.#projectsViewed],
      };

      if (this.#cacheManager) {
        this.#cacheManager.set("achievements", data, { ttl: 0 }); // Infinite
      } else {
        try {
          localStorage.setItem("maple_achievements_v2", JSON.stringify(data));
        } catch {}
      }
    }

    #loadState() {
      let data = null;

      if (this.#cacheManager) {
        data = this.#cacheManager.get("achievements");
      } else {
        try {
          const raw = localStorage.getItem("maple_achievements_v2");
          if (raw) data = JSON.parse(raw);
        } catch {}
      }

      // Migration from v1
      if (!data) {
        try {
          const v1 = localStorage.getItem("maple_achievements");
          if (v1) {
            const arr = JSON.parse(v1);
            data = { achievements: arr };
            console.log("📦 Migrated achievements from v1");
          }
        } catch {}
      }

      if (data) {
        data.achievements?.forEach((saved) => {
          const a = this.#achievements.get(saved.id);
          if (a) {
            a.unlocked = saved.unlocked ?? false;
            a.unlockedAt = saved.unlockedAt ?? null;
            a.progress = saved.progress ?? 0;
          }
        });
        this.#playerLevel = data.playerLevel ?? 1;
        this.#totalXP = data.totalXP ?? 0;
        this.#xpToNextLevel = data.xpToNextLevel ?? 100;
        this.#totalClicks = data.totalClicks ?? 0;
        this.#dialogsCompleted = data.dialogsCompleted ?? 0;
        this.#bgmPlayTime = data.bgmPlayTime ?? 0;
        this.#easterEggsFound = new Set(data.easterEggsFound ?? []);
        this.#projectsViewed = new Set(data.projectsViewed ?? []);
      }

      // Load visit history
      try {
        const raw = localStorage.getItem("maple_visit_history");
        if (raw) this.#visitHistory = JSON.parse(raw);
      } catch {}

      this.#updateXPBar();
    }
  }
  // 6. GITHUB MANAGER v2.6.0 - OPTIMIZED
  // ═══════════════════════════════════════════

  /**
   * GitHub data manager with multi-source fetching, caching, and rate limiting.
   * Handles profile, repositories, README, commits, and analytics.
   *
   * Features:
   *   - Multi-source: Custom API → GitHub API → Raw fallback
   *   - Smart caching with TTL + stale fallback
   *   - Rate limiting with exponential backoff
   *   - README fetching prioritized for featured repos
   *   - Background auto-sync with tab visibility check
   *   - Repo categorization & filtering
   *
   * @class GitHubManager
   */
  class GitHubManager {
    // ── Private fields ──────────────────────────
    #username;
    #repositories = [];
    #profile = null;
    #languageStats = null;

    #isLoaded = false;
    #isLoading = false;
    #loadProgress = 0;
    #lastFetchTime = null;

    #totalCommits = 0;
    #totalStars = 0;
    #totalForks = 0;
    #totalWatchers = 0;
    #lastActiveDate = null;
    #oldestRepoDate = null;
    #newestRepoDate = null;

    #excludedRepos = new Set();
    #pinnedRepos = new Set();

    #cache = null;
    #rateLimiter = null;
    #syncInterval = null;
    #autoSyncEnabled = false;

    // ── Public callbacks ───────────────────────
    onProgress = null;
    onError = null;
    onComplete = null;

    // ── Static constants ───────────────────────
    static #API_BASE = CONFIG.CUSTOM_API_BASE;
    static #GITHUB_API = CONFIG.GITHUB_API_BASE;
    static #GITHUB_RAW = `${CONFIG.GITHUB_RAW_BASE}`;

    static #README_CACHE_TTL = 3_600_000; // 1 hour
    static #NULL_README_TTL = 1_800_000; // 30 min for negative cache
    static #PROFILE_CACHE_TTL = 1_800_000; // 30 min
    static #COMMITS_CACHE_TTL = 7_200_000; // 2 hours
    static #ACTIVITY_CACHE_TTL = 300_000; // 5 min

    static #SORT_FUNCTIONS = Object.freeze({
      stars: (a, b) => b.stargazers_count - a.stargazers_count,
      forks: (a, b) => b.forks_count - a.forks_count,
      updated: (a, b) => new Date(b.updated_at) - new Date(a.updated_at),
      created: (a, b) => new Date(b.created_at) - new Date(a.created_at),
      name: (a, b) => a.name.localeCompare(b.name),
      size: (a, b) => (b.size || 0) - (a.size || 0),
      score: (a, b) => {
        const score = (r) =>
          (r.stargazers_count || 0) * 3 +
          (r.forks_count || 0) * 2 +
          (r.watchers_count || 0);
        return score(b) - score(a);
      },
    });

    // ════════════════════════════════════════
    // CONSTRUCTOR
    // ════════════════════════════════════════

    /**
     * @param {string} username - GitHub username
     * @param {object} [deps]
     * @param {CacheManager} [deps.cacheManager]
     * @param {RateLimiter} [deps.rateLimiter]
     */
    constructor(username, { cacheManager, rateLimiter } = {}) {
      this.#username = username;

      // Dependency injection — accept existing instances or create defaults
      this.#cache = cacheManager ?? new CacheManager();
      this.#rateLimiter =
        rateLimiter ??
        new RateLimiter({
          maxRequests: 60,
          perTimeWindow: 3_600_000,
          minDelay: 100,
        });

      console.log(`📦 GitHubManager Ready | User: ${username}`);
    }

    // ════════════════════════════════════════
    // PUBLIC GETTERS
    // ════════════════════════════════════════

    get repositories() {
      return [...this.#repositories];
    }
    get profile() {
      return this.#profile ? { ...this.#profile } : null;
    }
    get isLoaded() {
      return this.#isLoaded;
    }
    get isLoading() {
      return this.#isLoading;
    }
    get loadProgress() {
      return this.#loadProgress;
    }
    get totalStars() {
      return this.#totalStars;
    }
    get totalForks() {
      return this.#totalForks;
    }
    get totalCommits() {
      return this.#totalCommits;
    }
    get lastActiveDate() {
      return this.#lastActiveDate;
    }

    // ════════════════════════════════════════
    // FETCH: PROFILE
    // ════════════════════════════════════════

    async fetchUserProfile() {
      const cacheKey = `profile_${this.#username}`;
      const cached = this.#cache.get(cacheKey);
      if (cached) {
        this.#profile = cached;
        return cached;
      }

      console.log("👤 Fetching user profile...");

      const strategies = [
        () => this.#fetchProfileFromCustomAPI(),
        () => this.#fetchProfileFromGitHubAPI(),
      ];

      for (const strategy of strategies) {
        try {
          const profile = await strategy();
          if (profile) {
            this.#profile = profile;
            this.#cache.set(cacheKey, profile, {
              ttl: GitHubManager.#PROFILE_CACHE_TTL,
            });
            return profile;
          }
        } catch {}
      }

      // Fallback: minimal profile
      return this.#buildMinimalProfile();
    }

    async #fetchProfileFromCustomAPI() {
      const url = `${GitHubManager.#API_BASE}/api/github?action=user&username=${this.#username}`;
      const response = await this.#fetchWithRetry(url, { retries: 1 });
      const data = await response.json();
      const profile = data.user || data.profile || data;
      return profile.login || profile.name
        ? this.#normalizeProfile(profile)
        : null;
    }

    async #fetchProfileFromGitHubAPI() {
      const url = `${GitHubManager.#GITHUB_API}/users/${this.#username}`;
      const response = await this.#fetchWithRetry(url, { retries: 2 });
      return this.#normalizeProfile(await response.json());
    }

    #normalizeProfile(data) {
      return {
        login: data.login || this.#username,
        name: data.name || data.login || this.#username,
        avatar_url: data.avatar_url || null,
        bio: data.bio || null,
        public_repos: data.public_repos || 0,
        followers: data.followers || 0,
        following: data.following || 0,
        created_at: data.created_at || null,
        updated_at: data.updated_at || null,
        html_url: data.html_url || `https://github.com/${this.#username}`,
        blog: data.blog || null,
        location: data.location || null,
        company: data.company || null,
        twitter_username: data.twitter_username || null,
      };
    }

    #buildMinimalProfile() {
      const profile = {
        login: this.#username,
        name: this.#username,
        avatar_url: null,
        bio: null,
        public_repos: this.#repositories.length,
        followers: 0,
        following: 0,
        created_at: this.#oldestRepoDate,
        updated_at: this.#newestRepoDate,
        html_url: `https://github.com/${this.#username}`,
      };
      this.#profile = profile;
      this.#cache.set(`profile_${this.#username}`, profile, { ttl: 900_000 });
      return profile;
    }

    // ════════════════════════════════════════
    // FETCH: ALL REPOSITORIES
    // ════════════════════════════════════════

    /**
     * Fetch all repositories with caching and multi-source fallback.
     * @param {object} [options]
     * @param {boolean} [options.forceRefresh=false]
     * @param {string} [options.sortBy='updated']
     */
    async fetchAllRepos({ forceRefresh = false, sortBy = "updated" } = {}) {
      // Return cached if available
      if (!forceRefresh) {
        const cached = this.#cache.get(`repos_${this.#username}`);
        if (cached) {
          console.log("📦 Using cached repositories");
          this.#repositories = cached;
          this.#isLoaded = true;
          this.#calculateTotals();
          this.#updateProgress(100);
          return this.#repositories;
        }
      }

      if (this.#isLoading) {
        console.log("⏳ Already loading...");
        return this.#repositories;
      }

      this.#isLoading = true;
      this.#updateProgress(5);

      try {
        let repos = await this.#fetchReposFromCustomAPI();
        this.#updateProgress(30);

        if (!repos?.length) {
          repos = await this.#fetchReposFromGitHubAPI();
          this.#updateProgress(50);
        }

        if (!repos?.length) throw new Error("No repositories found");

        // Filter & sort
        repos = repos
          .filter((r) => !this.#excludedRepos.has(r.name))
          .sort(
            GitHubManager.#SORT_FUNCTIONS[sortBy] ||
              GitHubManager.#SORT_FUNCTIONS.stars,
          );

        this.#updateProgress(60);

        // Fetch README for featured repos only (optimized)
        repos = await this.#fetchReadmesSmart(repos, (pct) => {
          this.#updateProgress(60 + Math.floor(pct * 0.35));
        });

        this.#repositories = repos;
        this.#isLoaded = true;
        this.#lastFetchTime = Date.now();

        this.#calculateTotals();
        this.#cache.set(`repos_${this.#username}`, repos);

        this.#updateProgress(100);
        this.onComplete?.(repos);

        console.log(`✅ Loaded ${repos.length} repositories`);
        return repos;
      } catch (err) {
        console.error("❌ Failed to fetch repos:", err.message);

        // Try stale cache
        const stale = this.#cache.get(`repos_${this.#username}`);
        if (stale) {
          console.warn("⚠️ Using stale cache");
          this.#repositories = stale;
          this.#isLoaded = true;
          this.#calculateTotals();
          return stale;
        }

        this.onError?.(err);
        throw err;
      } finally {
        this.#isLoading = false;
      }
    }

    async #fetchReposFromCustomAPI() {
      try {
        const url = `${GitHubManager.#API_BASE}/api/github?action=repos&username=${this.#username}&per_page=100`;
        const response = await this.#fetchWithRetry(url, { retries: 1 });
        const data = await response.json();
        const repos =
          data.success && Array.isArray(data.repos)
            ? data.repos
            : Array.isArray(data)
              ? data
              : [];
        return repos.length ? this.#normalizeRepos(repos) : null;
      } catch {
        return null;
      }
    }

    async #fetchReposFromGitHubAPI() {
      const all = [];
      let page = 1;
      let hasMore = true;

      while (hasMore) {
        try {
          const url = `${GitHubManager.#GITHUB_API}/users/${this.#username}/repos?sort=updated&per_page=100&page=${page}`;
          const response = await this.#fetchWithRetry(url, { retries: 2 });
          const repos = await response.json();

          if (!Array.isArray(repos) || !repos.length) {
            hasMore = false;
          } else {
            all.push(...repos);
            hasMore = repos.length === 100;
            page++;
          }
        } catch {
          hasMore = false;
        }
      }

      return all.length ? this.#normalizeRepos(all) : null;
    }

    #normalizeRepos(repos) {
      return repos.map((repo) => ({
        id: repo.id || repo.name,
        name: repo.name || repo.repo || "unknown",
        full_name: repo.full_name || `${this.#username}/${repo.name}`,
        description: repo.description || null,
        language: repo.language || null,

        stargazers_count: repo.stargazers_count || repo.stars || 0,
        forks_count: repo.forks_count || repo.forks || 0,
        watchers_count: repo.watchers_count || repo.watchers || 0,
        open_issues_count: repo.open_issues_count || repo.open_issues || 0,
        size: repo.size || 0,

        html_url:
          repo.html_url ||
          repo.url ||
          `https://github.com/${this.#username}/${repo.name}`,
        homepage: repo.homepage || null,
        clone_url: repo.clone_url || null,

        fork: repo.fork === true,
        has_pages: repo.has_pages || Boolean(repo.homepage),
        archived: repo.archived || false,
        disabled: repo.disabled || false,

        created_at:
          repo.created_at || repo.createdAt || new Date().toISOString(),
        updated_at:
          repo.updated_at || repo.updatedAt || new Date().toISOString(),
        pushed_at: repo.pushed_at || repo.pushedAt || repo.updated_at || null,

        topics: repo.topics || [],
        license: repo.license?.spdx_id || repo.license || null,
        default_branch: repo.default_branch || "main",

        isPinned: this.#pinnedRepos.has(repo.name),
        readme: null,
        category: null,
      }));
    }

    // ════════════════════════════════════════
    // FETCH: README (UNIFIED, OPTIMIZED)
    // ════════════════════════════════════════

    /**
     * Smart README fetching — only for featured repos, with caching.
     * Replaces the three duplicate methods.
     */
    async #fetchReadmesSmart(repos, progressCallback) {
      // Determine which repos need README (skip those already cached)
      const reposNeedingReadme = repos.filter((r) => {
        const cached = this.#cache.get(`readme_${r.name}`);
        return cached === undefined; // Only fetch if not cached at all
      });

      // Only fetch for top repos (by stars), max 6
      const candidates = reposNeedingReadme
        .filter((r) => !r.fork || r.stargazers_count > 0)
        .sort((a, b) => b.stargazers_count - a.stargazers_count)
        .slice(0, CONFIG.FEATURED_COUNT);

      console.log(`📄 Fetching README for ${candidates.length} repos...`);

      let completed = 0;
      const batchSize = 2;

      for (let i = 0; i < candidates.length; i += batchSize) {
        const batch = candidates.slice(i, i + batchSize);

        await Promise.allSettled(
          batch.map(async (repo) => {
            const readme = await this.#fetchReadmeSingle(repo.name);
            repo.readme = readme;
          }),
        );

        completed += batch.length;
        progressCallback?.(completed / candidates.length);

        // Delay between batches
        if (i + batchSize < candidates.length) {
          await this.#sleep(300);
        }
      }

      // Restore README from cache for repos we didn't fetch
      for (const repo of repos) {
        if (repo.readme === null && !candidates.includes(repo)) {
          const cached = this.#cache.get(`readme_${repo.name}`);
          if (cached !== undefined) repo.readme = cached;
        }
      }

      return repos;
    }

    /**
     * Fetch README for a single repo — tries multiple sources.
     * Caches both success and null results.
     */
    async #fetchReadmeSingle(repoName) {
      const cacheKey = `readme_${repoName}`;

      // Check cache
      const cached = this.#cache.get(cacheKey);
      if (cached !== undefined) return cached;

      // Skip empty repos
      const repo = this.#repositories.find((r) => r.name === repoName);
      if (repo && !repo.size) {
        this.#cache.set(cacheKey, null, {
          ttl: GitHubManager.#NULL_README_TTL,
        });
        return null;
      }

      const strategies = [
        () => this.#fetchReadmeFromCustomAPI(repoName),
        () => this.#fetchReadmeFromGitHubAPI(repoName),
        () => this.#fetchReadmeFromRaw(repoName),
      ];

      for (const strategy of strategies) {
        try {
          const readme = await strategy();
          if (readme) {
            this.#cache.set(cacheKey, readme, {
              ttl: GitHubManager.#README_CACHE_TTL,
            });
            return readme;
          }
        } catch {}
      }

      // Cache negative result
      this.#cache.set(cacheKey, null, { ttl: GitHubManager.#NULL_README_TTL });
      return null;
    }

    async #fetchReadmeFromCustomAPI(repoName) {
      const url = `${GitHubManager.#API_BASE}/api/github?action=readme&username=${this.#username}&repo=${repoName}`;
      const res = await this.#fetchWithRetry(url, {
        retries: 1,
        timeout: 8_000,
      });
      if (!res.ok) return null;
      const data = await res.json();
      return data.readme?.length > 10 ? data.readme : null;
    }

    async #fetchReadmeFromGitHubAPI(repoName) {
      const url = `${GitHubManager.#GITHUB_API}/repos/${this.#username}/${repoName}/readme`;
      const res = await this.#fetchWithRetry(url, {
        headers: { Accept: "application/vnd.github.v3.raw" },
        timeout: 10_000,
      });
      if (!res.ok) return null;
      const text = await res.text();
      return text?.length > 10 && !text.includes("<!DOCTYPE html>")
        ? text
        : null;
    }

    async #fetchReadmeFromRaw(repoName) {
      const branches = ["main", "master"];
      for (const branch of branches) {
        try {
          const url = `https://raw.githubusercontent.com/${this.#username}/${repoName}/${branch}/README.md`;
          const ctrl = new AbortController();
          const timer = setTimeout(() => ctrl.abort(), 3_000);

          const res = await fetch(url, { signal: ctrl.signal });
          clearTimeout(timer);

          if (res.ok) {
            const text = await res.text();
            if (text?.length > 10 && !text.includes("<!DOCTYPE html>")) {
              return text;
            }
          }
        } catch {
          continue;
        }
      }
      return null;
    }

    // ════════════════════════════════════════
    // FETCH: COMMITS & ACTIVITY
    // ════════════════════════════════════════

    async fetchTotalCommits() {
      const cacheKey = `commits_${this.#username}`;
      const cached = this.#cache.get(cacheKey);
      if (cached) {
        this.#totalCommits = cached;
        return cached;
      }

      console.log("📊 Calculating total commits...");

      try {
        const commits = await this.#fetchCommitsFromCustomAPI();
        if (commits) {
          this.#totalCommits = commits;
          this.#cache.set(cacheKey, commits, {
            ttl: GitHubManager.#COMMITS_CACHE_TTL,
          });
          return commits;
        }
      } catch {}

      try {
        const commits = await this.#estimateCommitsFromEvents();
        if (commits) {
          this.#totalCommits = commits;
          this.#cache.set(cacheKey, commits, { ttl: 3_600_000 });
          return commits;
        }
      } catch {}

      // Rough estimate
      const estimate = this.#repositories.length * 15;
      this.#totalCommits = estimate;
      this.#cache.set(cacheKey, estimate, { ttl: 1_800_000 });
      return estimate;
    }

    async #fetchCommitsFromCustomAPI() {
      const url = `${GitHubManager.#API_BASE}/api/github?action=commits&username=${this.#username}`;
      const res = await this.#fetchWithRetry(url, { retries: 1 });
      const data = await res.json();
      const total = data.total_commits || data.total || 0;
      return total > 0 ? total : null;
    }

    async #estimateCommitsFromEvents() {
      const url = `${GitHubManager.#GITHUB_API}/users/${this.#username}/events/public?per_page=100`;
      const res = await this.#fetchWithRetry(url, { retries: 2 });
      const events = await res.json();
      const recentCommits = events
        .filter((e) => e.type === "PushEvent")
        .reduce((sum, e) => sum + (e.payload?.commits?.length || 0), 0);
      const yearly = Math.round((recentCommits / 90) * 365);
      return yearly > 0 ? yearly : null;
    }

    async fetchLastActivity() {
      const cacheKey = `last_activity_${this.#username}`;
      const cached = this.#cache.get(cacheKey);
      if (cached) return cached;

      try {
        const url = `${GitHubManager.#GITHUB_API}/users/${this.#username}/events/public?per_page=5`;
        const res = await this.#fetchWithRetry(url, {
          retries: 1,
          timeout: 5_000,
        });
        const events = await res.json();

        const activityEvents = events.filter((e) =>
          [
            "PushEvent",
            "CreateEvent",
            "IssuesEvent",
            "PullRequestEvent",
            "ReleaseEvent",
          ].includes(e.type),
        );
        const lastEvent = activityEvents[0] || events[0];

        if (lastEvent) {
          const date = lastEvent.created_at;
          this.#cache.set(cacheKey, date, {
            ttl: GitHubManager.#ACTIVITY_CACHE_TTL,
          });
          return date;
        }
      } catch {}

      // Fallback to repos pushed_at
      this.#lastActiveDate = this.#calculateLastActiveDate();
      return this.#lastActiveDate;
    }

    // ════════════════════════════════════════
    // CATEGORIZATION & FILTERING
    // ════════════════════════════════════════

    categorizeRepo(repo) {
      if (repo.category) return repo.category;

      const text = [
        repo.name,
        repo.description,
        repo.language,
        ...(repo.topics || []),
      ]
        .join(" ")
        .toLowerCase();

      if (/game|unity|godot|unreal|rpg|puzzle/.test(text)) return "game";
      if (/design|figma|ui\b|ux\b|art|animation|css-art|creative/.test(text))
        return "design";
      if (
        repo.homepage ||
        repo.has_pages ||
        /html|css|javascript|typescript|vue|react|svelte/.test(
          repo.language?.toLowerCase() || "",
        )
      )
        return "web";
      if (/tool|cli|utility|helper|automation|bot/.test(text)) return "tools";
      if (/docs|documentation|wiki|tutorial|guide|cheatsheet/.test(text))
        return "docs";

      return "other";
    }

    getFilteredRepos(filter = "all", sortBy = "stars") {
      let filtered = [...this.#repositories];
      if (filter !== "all") {
        filtered = filtered.filter((r) => this.categorizeRepo(r) === filter);
      }
      return filtered.sort(
        GitHubManager.#SORT_FUNCTIONS[sortBy] ||
          GitHubManager.#SORT_FUNCTIONS.stars,
      );
    }

    getFeaturedRepos(count = CONFIG.FEATURED_COUNT) {
      return [...this.#repositories]
        .filter((r) => !r.fork || r.stargazers_count > 0)
        .sort((a, b) => {
          const score = (r) =>
            (r.stargazers_count || 0) * 2 + (r.forks_count || 0);
          return (
            score(b) - score(a) ||
            new Date(b.updated_at) - new Date(a.updated_at)
          );
        })
        .slice(0, count);
    }

    searchRepos(query) {
      const q = query.toLowerCase();
      return this.#repositories.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.description?.toLowerCase().includes(q) ||
          r.topics?.some((t) => t.toLowerCase().includes(q)),
      );
    }

    // ════════════════════════════════════════
    // ANALYTICS
    // ════════════════════════════════════════

    getLanguageStats() {
      if (this.#languageStats) return this.#languageStats;

      const stats = {};
      for (const repo of this.#repositories) {
        if (repo.language) {
          stats[repo.language] = (stats[repo.language] || 0) + 1;
        }
      }

      const sorted = Object.entries(stats).sort((a, b) => b[1] - a[1]);
      this.#languageStats = {
        byCount: Object.fromEntries(sorted.slice(0, 10)),
        topLanguage: sorted[0]?.[0] || null,
        totalLanguages: sorted.length,
      };

      return this.#languageStats;
    }

    getStats() {
      return {
        totalRepos: this.#repositories.length,
        totalStars: this.#totalStars,
        totalForks: this.#totalForks,
        totalWatchers: this.#totalWatchers,
        totalCommits: this.#totalCommits,
        oldestRepo: this.#oldestRepoDate,
        newestRepo: this.#newestRepoDate,
        lastActive: this.#lastActiveDate,
        languageStats: this.getLanguageStats(),
        isLoaded: this.#isLoaded,
        isLoading: this.#isLoading,
        lastFetch: this.#lastFetchTime,
        loadProgress: this.#loadProgress,
      };
    }

    // ════════════════════════════════════════
    // AUTO-SYNC
    // ════════════════════════════════════════

    startAutoSync(intervalMs = 300_000) {
      if (this.#syncInterval) return;
      console.log(`🔄 Auto-sync started (every ${intervalMs / 1000}s)`);
      this.#autoSyncEnabled = true;

      this.#syncInterval = setInterval(async () => {
        if (document.hidden) return;
        try {
          await this.fetchAllRepos({ forceRefresh: true });
          console.log("🔄 Background sync completed");
        } catch {}
      }, intervalMs);
    }

    stopAutoSync() {
      if (this.#syncInterval) {
        clearInterval(this.#syncInterval);
        this.#syncInterval = null;
      }
      this.#autoSyncEnabled = false;
    }

    // ════════════════════════════════════════
    // UTILITY
    // ════════════════════════════════════════

    pinRepo(name) {
      this.#pinnedRepos.add(name);
    }
    unpinRepo(name) {
      this.#pinnedRepos.delete(name);
    }
    excludeRepo(name) {
      this.#excludedRepos.add(name);
      this.#repositories = this.#repositories.filter((r) => r.name !== name);
    }
    getRepoByName(name) {
      return this.#repositories.find((r) => r.name === name) || null;
    }

    clearCache() {
      this.#cache.clear();
      this.#repositories = [];
      this.#profile = null;
      this.#isLoaded = false;
      this.#lastFetchTime = null;
      this.#languageStats = null;
      console.log("🗑️ Cache cleared");
    }

    destroy() {
      this.stopAutoSync();
      this.#repositories = [];
      this.#profile = null;
      console.log("📦 GitHubManager destroyed");
    }

    // ════════════════════════════════════════
    // PRIVATE HELPERS
    // ════════════════════════════════════════

    #calculateTotals() {
      this.#totalStars = this.#repositories.reduce(
        (s, r) => s + (r.stargazers_count || 0),
        0,
      );
      this.#totalForks = this.#repositories.reduce(
        (s, r) => s + (r.forks_count || 0),
        0,
      );
      this.#totalWatchers = this.#repositories.reduce(
        (s, r) => s + (r.watchers_count || 0),
        0,
      );
      this.#lastActiveDate = this.#calculateLastActiveDate();
      this.#oldestRepoDate = this.#calculateOldestDate();
      this.#newestRepoDate = this.#calculateNewestDate();
    }

    #calculateLastActiveDate() {
      if (!this.#repositories.length) return null;
      const dates = this.#repositories
        .map((r) => r.pushed_at || r.updated_at)
        .filter(Boolean)
        .sort((a, b) => new Date(b) - new Date(a));
      return dates[0] || null;
    }

    #calculateOldestDate() {
      const dates = this.#repositories
        .map((r) => r.created_at)
        .filter(Boolean)
        .sort();
      return dates[0] || null;
    }

    #calculateNewestDate() {
      const dates = this.#repositories
        .map((r) => r.updated_at)
        .filter(Boolean)
        .sort((a, b) => new Date(b) - new Date(a));
      return dates[0] || null;
    }

    #updateProgress(pct) {
      this.#loadProgress = pct;
      this.onProgress?.(pct);
    }

    #sleep(ms) {
      return new Promise((r) => setTimeout(r, ms));
    }

    async #fetchWithRetry(url, options = {}) {
      const {
        retries = CONFIG.RETRY_MAX,
        timeout = 15_000,
        headers = {},
        useRateLimit = true,
      } = options;

      if (useRateLimit) await this.#rateLimiter.acquire();

      for (let attempt = 0; attempt < retries; attempt++) {
        const ctrl = new AbortController();
        const timer = setTimeout(() => ctrl.abort(), timeout);

        try {
          const res = await fetch(url, {
            signal: ctrl.signal,
            headers: { Accept: "application/json", ...headers },
          });
          clearTimeout(timer);

          // Rate limit handling
          if (
            res.status === 403 &&
            res.headers.get("X-RateLimit-Remaining") === "0"
          ) {
            const resetTime =
              parseInt(res.headers.get("X-RateLimit-Reset")) * 1000;
            const wait = resetTime - Date.now();
            if (wait > 0 && wait < 300_000) {
              console.warn(
                `⏳ Rate limited. Waiting ${Math.ceil(wait / 1000)}s...`,
              );
              await this.#sleep(wait + 1000);
              continue;
            }
            throw new Error("Rate limited");
          }

          if (res.status === 404) throw new Error(`Not found: ${url}`);
          if (!res.ok) throw new Error(`HTTP ${res.status}`);

          return res;
        } catch (err) {
          clearTimeout(timer);
          if (attempt < retries - 1) {
            const delay =
              CONFIG.RETRY_DELAY * Math.pow(2, attempt) + Math.random() * 1000;
            await this.#sleep(delay);
          } else {
            throw err;
          }
        }
      }
    }
  }

  // ═══════════════════════════════════════════
  // RATE LIMITER & REQUEST QUEUE v2.6.0
  // ═══════════════════════════════════════════

  /**
   * Sliding-window rate limiter.
   * Prevents exceeding a maximum number of requests within a time window.
   *
   * Features:
   *   - Sliding window with automatic cleanup
   *   - Minimum inter-request delay
   *   - Abortable wait (via AbortSignal)
   *   - Non-recursive implementation (prevents stack overflow)
   *
   * @example
   *   const limiter = new RateLimiter({ maxRequests: 60, perTimeWindow: 3600000 });
   *   await limiter.acquire();
   *   // ... make request ...
   */
  class RateLimiter {
    /** @type {number[]} Timestamps of recent requests */
    #requests = [];
    /** @type {number} Max requests per time window */
    #maxRequests;
    /** @type {number} Time window in milliseconds */
    #timeWindow;
    /** @type {number} Minimum delay between requests */
    #minDelay;

    /**
     * @param {object} [options]
     * @param {number} [options.maxRequests=60] - Max requests per window
     * @param {number} [options.perTimeWindow=3600000] - Window size in ms (default: 1 hour)
     * @param {number} [options.minDelay=100] - Minimum ms between requests
     */
    constructor({
      maxRequests = 60,
      perTimeWindow = 3_600_000,
      minDelay = 100,
    } = {}) {
      this.#maxRequests = maxRequests;
      this.#timeWindow = perTimeWindow;
      this.#minDelay = minDelay;
    }

    /**
     * Wait until a request slot is available.
     * Uses a while-loop with async sleep — NO recursion.
     *
     * @param {AbortSignal} [signal] - Optional AbortSignal to cancel the wait
     * @returns {Promise<boolean>} True when acquired
     * @throws {DOMException} If aborted via signal
     */
    async acquire(signal = null) {
      // Loop (non-recursive) until we get a slot
      while (true) {
        // Check abort signal
        signal?.throwIfAborted();

        const now = Date.now();

        // Clean expired timestamps (mutate in-place to avoid GC)
        this.#cleanExpired(now);

        // ── Case 1: Over the rate limit ──
        if (this.#requests.length >= this.#maxRequests) {
          const oldest = this.#requests[0];
          const waitMs = oldest + this.#timeWindow - now + 10;

          await this.#sleep(waitMs, signal);
          continue; // Re-check after waiting
        }

        // ── Case 2: Within limit, but need minimum delay ──
        if (this.#requests.length > 0) {
          const lastRequest = this.#requests[this.#requests.length - 1];
          const elapsed = now - lastRequest;

          if (elapsed < this.#minDelay) {
            await this.#sleep(this.#minDelay - elapsed, signal);
            // Don't continue, wait
          }
        }

        // ── Acquire slot ──
        this.#requests.push(Date.now());
        return true;
      }
    }

    /**
     * Get current usage stats.
     * @returns {{ used: number, remaining: number, windowMs: number }}
     */
    getStats() {
      this.#cleanExpired(Date.now());
      return {
        used: this.#requests.length,
        remaining: Math.max(0, this.#maxRequests - this.#requests.length),
        windowMs: this.#timeWindow,
      };
    }

    /** Reset all tracked requests */
    reset() {
      this.#requests.length = 0;
    }

    /** Cleanup — clears pending state */
    destroy() {
      this.#requests.length = 0;
    }

    // ── Private helpers ──────────────────────

    /** Remove expired timestamps (mutates array in-place) */
    #cleanExpired(now) {
      const cutoff = now - this.#timeWindow;
      // Find first non-expired index
      let keepFrom = 0;
      while (
        keepFrom < this.#requests.length &&
        this.#requests[keepFrom] < cutoff
      ) {
        keepFrom++;
      }
      // Remove all expired in one operation
      if (keepFrom > 0) {
        this.#requests.splice(0, keepFrom);
      }
    }

    /**
     * Async sleep with optional AbortSignal support.
     * @param {number} ms - Milliseconds to sleep
     * @param {AbortSignal} [signal]
     */
    #sleep(ms, signal) {
      return new Promise((resolve, reject) => {
        if (signal?.aborted) {
          return reject(
            signal.reason || new DOMException("Aborted", "AbortError"),
          );
        }

        const timer = setTimeout(resolve, ms);

        if (signal) {
          signal.addEventListener(
            "abort",
            () => {
              clearTimeout(timer);
              reject(
                signal.reason || new DOMException("Aborted", "AbortError"),
              );
            },
            { once: true },
          );
        }
      });
    }
  }

  // ═══════════════════════════════════════════
  // REQUEST QUEUE v2.6.0
  // ═══════════════════════════════════════════

  /**
   * Priority-based request queue with:
   *   - Configurable concurrency
   *   - Per-task timeout
   *   - AbortController support
   *   - Progress/event callbacks
   *
   * @example
   *   const queue = new RequestQueue({ concurrency: 3 });
   *   const result = await queue.enqueue(() => fetch(url), { priority: 2, timeout: 5000 });
   */
  class RequestQueue {
    /** @type {Array<{ fn: Function, priority: number, resolve: Function, reject: Function, timeout: number, signal: AbortSignal|null }>} */
    #queue = [];
    /** @type {number} How many tasks can run concurrently */
    #concurrency;
    /** @type {number} Currently running tasks count */
    #running = 0;
    /** @type {boolean} Whether the queue is destroyed */
    #destroyed = false;

    // ── Callbacks ────────────────────────────
    onTaskStart = null; // (task) => void
    onTaskComplete = null; // (task, result) => void
    onTaskError = null; // (task, error) => void
    onDrain = null; // () => void — called when queue becomes empty

    /**
     * @param {object} [options]
     * @param {number} [options.concurrency=1] - Max concurrent tasks
     */
    constructor({ concurrency = 1 } = {}) {
      this.#concurrency = Math.max(1, concurrency);
    }

    /**
     * Add a task to the queue.
     *
     * @param {Function} fn - Async function to execute
     * @param {object} [options]
     * @param {number} [options.priority=0] - Higher = executed sooner
     * @param {number} [options.timeout=30000] - Max ms before task is rejected
     * @param {AbortSignal} [options.signal] - External abort signal
     * @returns {Promise<*>} Result of fn()
     */
    enqueue(fn, { priority = 0, timeout = 30_000, signal = null } = {}) {
      if (this.#destroyed) {
        return Promise.reject(new Error("Queue has been destroyed"));
      }

      return new Promise((resolve, reject) => {
        const task = { fn, priority, resolve, reject, timeout, signal };

        // Check if already aborted
        if (signal?.aborted) {
          return reject(
            signal.reason || new DOMException("Aborted", "AbortError"),
          );
        }

        // Listen for abort
        if (signal) {
          signal.addEventListener(
            "abort",
            () => {
              // Remove from queue if still pending
              const idx = this.#queue.indexOf(task);
              if (idx !== -1) {
                this.#queue.splice(idx, 1);
              }
              reject(
                signal.reason || new DOMException("Aborted", "AbortError"),
              );
            },
            { once: true },
          );
        }

        // Insert sorted by priority (descending)
        const insertAt = this.#queue.findIndex((t) => t.priority < priority);
        if (insertAt === -1) {
          this.#queue.push(task);
        } else {
          this.#queue.splice(insertAt, 0, task);
        }

        // Try to process
        this.#processNext();
      });
    }

    /**
     * Get current queue stats.
     * @returns {{ pending: number, running: number, concurrency: number }}
     */
    getStats() {
      return {
        pending: this.#queue.length,
        running: this.#running,
        concurrency: this.#concurrency,
      };
    }

    /** Remove all pending tasks (running tasks continue) */
    clear() {
      const removed = this.#queue.length;
      // Reject all pending tasks
      for (const task of this.#queue) {
        task.reject(new Error("Queue cleared"));
      }
      this.#queue.length = 0;
      return removed;
    }

    /** Wait until all pending + running tasks complete */
    async drain() {
      while (this.#queue.length > 0 || this.#running > 0) {
        await new Promise((r) => setTimeout(r, 50));
      }
    }

    /** Destroy the queue — clear pending + prevent new tasks */
    destroy() {
      this.#destroyed = true;
      this.clear();
      this.#queue.length = 0;
      this.#running = 0;
    }

    // ── Private ──────────────────────────────

    #processNext() {
      // Already at max concurrency or nothing to run
      while (
        this.#running < this.#concurrency &&
        this.#queue.length > 0 &&
        !this.#destroyed
      ) {
        const task = this.#queue.shift();
        this.#running++;
        this.#executeTask(task);
      }

      // Emit drain event if queue is completely empty
      if (this.#queue.length === 0 && this.#running === 0) {
        this.onDrain?.();
      }
    }

    async #executeTask(task) {
      const { fn, resolve, reject, timeout, signal } = task;

      this.onTaskStart?.(task);

      try {
        // Create timeout controller
        const timeoutCtrl = new AbortController();
        const timeoutId = setTimeout(() => timeoutCtrl.abort(), timeout);

        // Merge external signal with timeout signal
        const mergedSignal = signal
          ? this.#combineSignals(signal, timeoutCtrl.signal)
          : timeoutCtrl.signal;

        // Execute with timeout + signal
        const result = await this.#executeWithSignal(fn, mergedSignal);

        clearTimeout(timeoutId);
        resolve(result);
        this.onTaskComplete?.(task, result);
      } catch (err) {
        reject(err);
        this.onTaskError?.(task, err);
      } finally {
        this.#running--;
        this.#processNext();
      }
    }

    /**
     * Execute a function that may or may not accept an AbortSignal.
     * Detects function signature and passes signal if supported.
     */
    async #executeWithSignal(fn, signal) {
      // If function expects a signal parameter, pass it
      if (fn.length >= 1) {
        // Check if it's a fetch-like function that uses { signal }
        return fn(signal);
      }
      // Otherwise just execute normally
      return fn();
    }

    /**
     * Combine two AbortSignals — aborts if either aborts.
     */
    #combineSignals(signalA, signalB) {
      const controller = new AbortController();

      const onAbort = () => {
        controller.abort(signalA.reason || signalB.reason);
      };

      signalA.addEventListener("abort", onAbort, { once: true });
      signalB.addEventListener("abort", onAbort, { once: true });

      // If either is already aborted
      if (signalA.aborted || signalB.aborted) {
        controller.abort(signalA.reason || signalB.reason);
      }

      return controller.signal;
    }
  }

  // ═══════════════════════════════════════════
  // SIMPLE EVENT EMITTER (UTILITY)
  // ═══════════════════════════════════════════

  /**
   * Lightweight event emitter for internal pub/sub.
   * Used when full CustomEvent is overkill.
   *
   * @example
   *   const emitter = new EventEmitter();
   *   emitter.on('data', (payload) => console.log(payload));
   *   emitter.emit('data', { key: 'value' });
   */
  class EventEmitter {
    /** @type {Map<string, Set<Function>>} */
    #listeners = new Map();

    /**
     * Register an event listener.
     * @param {string} event
     * @param {Function} callback
     * @returns {Function} Unsubscribe function
     */
    on(event, callback) {
      if (!this.#listeners.has(event)) {
        this.#listeners.set(event, new Set());
      }
      this.#listeners.get(event).add(callback);

      // Return unsubscribe function
      return () => this.off(event, callback);
    }

    /**
     * Register a one-time listener.
     * @param {string} event
     * @param {Function} callback
     */
    once(event, callback) {
      const wrapper = (...args) => {
        this.off(event, wrapper);
        callback(...args);
      };
      return this.on(event, wrapper);
    }

    /**
     * Remove a listener.
     * @param {string} event
     * @param {Function} callback
     */
    off(event, callback) {
      this.#listeners.get(event)?.delete(callback);
      if (this.#listeners.get(event)?.size === 0) {
        this.#listeners.delete(event);
      }
    }

    /**
     * Emit an event to all listeners.
     * @param {string} event
     * @param {...*} args
     */
    emit(event, ...args) {
      for (const cb of this.#listeners.get(event) ?? []) {
        try {
          cb(...args);
        } catch (err) {
          console.error(`[EventEmitter] Error in "${event}" handler:`, err);
        }
      }
    }

    /** Remove all listeners */
    clear() {
      this.#listeners.clear();
    }

    /** Get count of listeners for an event */
    listenerCount(event) {
      return this.#listeners.get(event)?.size ?? 0;
    }

    destroy() {
      this.clear();
    }
  }

  // ═══════════════════════════════════════════
  // AI VISUAL NOVEL DIALOGUE SYSTEM v2.6.0
  // ═══════════════════════════════════════════

  /**
   * Interactive Visual Novel dialogue system featuring Maple (Bofuri).
   *
   * Features:
   *   - AI Memory: tracks user relationship, personality, visit history
   *   - Emotion Engine: contextual emotions with visual feedback
   *   - Dynamic Dialogue: route-specific generators with weighted selection
   *   - Interactive Quick Replies: keyboard shortcuts (1-4) + click
   *   - Typing Effect: HTML-aware text animation with skip support
   *   - Achievement Integration: auto-unlock achievements through dialogue
   *
   * @class AIVNDialogueSystem
   */
  class AIVNDialogueSystem {
    // ── Private fields ──────────────────────────
    #container = null;
    #messageEl = null;
    #speakerEl = null;
    #badgeEl = null;
    #routeBadgeEl = null;
    #avatarImg = null;
    #avatarEmotion = null;
    #quickRepliesEl = null;
    #progressBar = null;
    #contextText = null;

    #audioManager = null;
    #achievementSystem = null;

    #currentRoute = "home";
    #isTyping = false;
    #typeTimer = null;
    #isOpen = false;
    #currentFullText = "";
    #currentDialogueIndex = 0;
    #totalDialogues = 0;
    #currentDialogues = null;
    #currentEmotion = "😊";

    // ── AbortController untuk typing effect ──
    #typeAbortController = null;

    // ── Debounced save ──
    #saveTimeout = null;
    #SAVE_DEBOUNCE_MS = 2000;

    // ── Navigasi callback (injected, bukan window global) ──
    #navigateCallback = null;

    // ── User memory ───────────────────────────
    #userMemory = {
      name: null,
      visitCount: 0,
      totalInteractions: 0,
      favoriteRoute: null,
      lastVisitTime: null,
      achievements: [],
      relationship: { level: 1, points: 0, title: "Stranger" },
      conversationHistory: [],
      personalityInsights: {
        curiosity: 0,
        friendliness: 0,
        humorAppreciation: 0,
        explorationLevel: 0,
      },
    };

    // ── Static constants ──────────────────────
    static #ROUTE_CONFIG = Object.freeze({
      home: {
        icon: "🏠",
        color: "#d4af37",
        badge: "Beranda",
        theme: "welcome",
      },
      maple: { icon: "🛡️", color: "#7c3aed", badge: "Vault", theme: "lore" },
      project: {
        icon: "🎮",
        color: "#10b981",
        badge: "Karya",
        theme: "showcase",
      },
      about: {
        icon: "📋",
        color: "#3b82f6",
        badge: "Tentang",
        theme: "personal",
      },
      contact: {
        icon: "💌",
        color: "#ef4444",
        badge: "Kontak",
        theme: "social",
      },
    });

    static #EMOTION_MODIFIERS = Object.freeze({
      happy: ["😊", "😄", "🥰", "✨"],
      excited: ["😆", "🤩", "🎉", "💃"],
      shy: ["😅", "🫣", "💦", "😳"],
      determined: ["💪", "😤", "🔥", "⚡"],
      curious: ["🤔", "🧐", "💡", "❓"],
      playful: ["😋", "😜", "🎮", "🍖"],
      surprised: ["😱", "😲", "‼️", "💥"],
    });

    static #RELATIONSHIP_TITLES = Object.freeze([
      "Stranger",
      "Acquaintance",
      "Friend",
      "Good Friend",
      "Close Friend",
      "Best Friend",
      "Guild Member",
      "Guild Elite",
      "Guild Vice-Leader",
      "Partner",
    ]);

    static #RELATIONSHIP_POINTS = Object.freeze({
      greeting: 1,
      compliment: 3,
      question: 2,
      explore: 2,
      farewell: 1,
      game: 4,
      secret: 5,
    });

    static #CONTEXT_MESSAGES = Object.freeze({
      home: "Pilih quick reply untuk ngobrol dengan Maple! 🍁",
      maple: "Pelajari rahasia kekuatan Maple! 🛡️",
      project: "Jelajahi loot dan hasil coding! 🎮",
      about: "Kenali Maple lebih dekat! 💕",
      contact: "Hubungi Maple untuk party bareng! 💌",
    });

    // ════════════════════════════════════════
    // CONSTRUCTOR
    // ════════════════════════════════════════

    /**
     * @param {object} [deps]
     * @param {AudioManager} [deps.audioManager]
     * @param {AchievementSystem} [deps.achievementSystem]
     * @param {Function} [deps.navigateCallback] - (route: string) => void
     */
    constructor({ audioManager, achievementSystem, navigateCallback } = {}) {
      // Cache DOM elements
      this.#container = document.getElementById("vnContainer");
      this.#messageEl = document.getElementById("vnMessage");
      this.#speakerEl = document.querySelector(".vn-speaker");
      this.#badgeEl = document.querySelector(".vn-badge");
      this.#routeBadgeEl = document.querySelector("[data-route-indicator]");
      this.#avatarImg = document.querySelector(".vn-avatar-img");
      this.#avatarEmotion = document.querySelector(".vn-avatar-emotion");
      this.#quickRepliesEl = document.getElementById("vnQuickReplies");
      this.#progressBar = document.getElementById("vnProgressBar");
      this.#contextText = document.querySelector(".vn-context-text");

      // Inject dependencies
      this.#audioManager = audioManager ?? null;
      this.#achievementSystem = achievementSystem ?? null;
      this.#navigateCallback = navigateCallback ?? null;

      // Load persisted memory (deferred)
      this.#loadMemoryAsync();

      // Bind events
      this.#bindEvents();
    }

    // ════════════════════════════════════════
    // PUBLIC API
    // ════════════════════════════════════════

    setAudioManager(am) {
      this.#audioManager = am;
    }
    setAchievementSystem(as) {
      this.#achievementSystem = as;
    }
    setNavigateCallback(fn) {
      this.#navigateCallback = fn;
    }

    get isActive() {
      return this.#isOpen;
    }
    get currentRoute() {
      return this.#currentRoute;
    }

    /**
     * Open the dialogue system for a specific route.
     * @param {string} route - Route name (home, maple, project, about, contact)
     * @param {string} [customText] - Override generated dialogue with custom text
     */
    open(route, customText = null) {
      // Reset if route changed
      if (this.#isOpen && this.#currentRoute !== route) {
        this.#currentDialogues = null;
        this.#currentDialogueIndex = 0;
      }

      this.#currentRoute = route;
      this.#isOpen = true;
      this.#currentDialogueIndex = 0;

      // Update memory
      if (route === "home") {
        if (this.#userMemory.visitCount === 0) {
          this.#achievementSystem?.unlock("first_visit");
        }
        this.#userMemory.visitCount++;
      }
      this.#userMemory.lastVisitTime = new Date().toISOString();
      this.#scheduleSave();

      // Generate dialogues ONCE
      if (customText) {
        this.#currentDialogues = [
          { speaker: "🍁 Maple", text: customText, emotion: "😊" },
        ];
      } else {
        this.#currentDialogues = this.#generateDialogues(route);
      }

      // Fallback
      if (!this.#currentDialogues?.length) {
        this.#currentDialogues = [
          {
            speaker: "🍁 Maple",
            text: "Ehehe... sepertinya aku kehabisan kata-kata nih~ ✨",
            emotion: "😅",
          },
        ];
      }

      this.#totalDialogues = this.#currentDialogues.length;

      // Show container
      if (this.#container) {
        this.#container.classList.add("vn-container--active");
        this.#container.removeAttribute("hidden");
        this.#container.setAttribute("data-current-route", route);
        this.#container.setAttribute("aria-hidden", "false");
      }

      this.#updateRouteBadge(route);
      this.#updateContext(route);
      this.#updateProgress();

      this.#audioManager?.playSFX("dialogue");

      // Track achievement
      if (this.#userMemory.totalInteractions >= 5) {
        this.#achievementSystem?.unlock("dialog_5");
      }

      // Type first dialogue
      this.#typeText(this.#currentDialogues[0]);
    }

    /** Close the dialogue system */
    close() {
      this.#stopTyping();
      this.#isOpen = false;
      this.#currentDialogues = null;
      this.#currentDialogueIndex = 0;

      this.#quickRepliesEl?.classList.remove("vn-quick-replies--active");

      if (this.#container) {
        this.#container.classList.remove("vn-container--active");
        this.#container.setAttribute("hidden", "");
        this.#container.setAttribute("aria-hidden", "true");
      }

      this.#audioManager?.playSFX("close");
    }

    /** Advance to next dialogue or skip typing */
    next() {
      // If currently typing, skip to end
      if (this.#isTyping) {
        this.#skipTyping();
        return;
      }

      if (!this.#currentDialogues?.length) {
        this.close();
        return;
      }

      this.#currentDialogueIndex++;

      if (this.#currentDialogueIndex >= this.#currentDialogues.length) {
        this.close();
        return;
      }

      const dialogue = this.#currentDialogues[this.#currentDialogueIndex];
      this.#audioManager?.playSFX("dialogue");
      this.#typeText(dialogue);
    }

    /** Skip all dialogues and close */
    skipAll() {
      this.#stopTyping();
      this.close();
      this.#audioManager?.playSFX("close");
    }

    /** Repeat current dialogue sequence from start */
    repeat() {
      this.#currentDialogueIndex = 0;
      this.#updateProgress();

      if (this.#currentDialogues?.length) {
        this.#audioManager?.playSFX("dialogue");
        this.#typeText(this.#currentDialogues[0]);
      }
    }

    /** Cleanup — remove event listeners, stop timers */
    destroy() {
      this.#stopTyping();
      this.#flushSave();
      this.#unbindEvents();
    }

    // ════════════════════════════════════════
    // PRIVATE: DIALOGUE GENERATION
    // ════════════════════════════════════════

    /**
     * Generate dialogues for a route.
     * Uses weighted random selection from available generators.
     */
    #generateDialogues(route) {
      const generators = this.#getGenerators(route);
      if (!generators?.length) return this.#welcomeDialogue();

      // Pick a random generator
      const idx = Math.floor(Math.random() * generators.length);
      const generator = generators[idx];

      // Call generator — it returns an array of dialogue objects
      const result = generator.call(this);

      return result?.length ? result : this.#welcomeDialogue();
    }

    /**
     * Get available generators for a route.
     * Centralized mapping — easy to extend.
     */
    #getGenerators(route) {
      const map = {
        home: [
          this.#welcomeDialogue,
          this.#guildDialogue,
          this.#casualDialogue,
        ],
        maple: [
          this.#loreDialogue,
          this.#skillDialogue,
          this.#adventureDialogue,
        ],
        project: [
          this.#projectDialogue,
          this.#codingDialogue,
          this.#achievementDialogue,
        ],
        about: [
          this.#personalDialogue,
          this.#backstoryDialogue,
          this.#futureDialogue,
        ],
        contact: [
          this.#socialDialogue,
          this.#collaborationDialogue,
          this.#goodbyeDialogue,
        ],
      };
      return map[route] || map.home;
    }

    // ── Individual dialogue generators ──────

    #welcomeDialogue() {
      const { visitCount, relationship } = this.#userMemory;
      const hour = new Date().getHours();
      const timeGreeting = hour < 12 ? "pagi" : hour < 17 ? "siang" : "malam";

      if (visitCount <= 1) {
        this.#setEmotion("😊");
        return [
          {
            speaker: "🍁 Maple",
            text: "Ehehe.. Halo! Selamat datang di guild-ku! Namaku Kaede, tapi panggil aku Maple ya~ ✨",
            emotion: "😊",
            quickReplies: [
              {
                text: "Hai Maple! Senang bertemu denganmu!",
                action: "greeting",
              },
              { text: "Wah, guild-nya keren banget!", action: "compliment" },
              { text: "Kamu player game ya?", action: "question" },
            ],
          },
          {
            speaker: "🍁 Maple",
            text: "Ini pertama kalinya kamu ke sini ya? Aku bakal jadi pemandumu! 🛡️",
            emotion: "✨",
          },
          {
            speaker: "🍁 Maple",
            text: "Aku punya skill spesial lho! Semua status point-ku ku-isi ke VIT! Jadi nggak ada yang bisa ngalahin pertahananku! 💪",
            emotion: "💪",
            quickReplies: [
              { text: "Keren! Ceritakan lebih banyak!", action: "explore" },
              { text: "VIT doang? Seriusan?", action: "question" },
            ],
          },
        ];
      }

      const greetings = [
        `Oh, kamu lagi! Senang deh kamu balik~ Ini kunjungan ke-${visitCount} lho! ✨`,
        `Selamat ${timeGreeting}! Balik lagi ke guild? Ada quest baru nih! 🎮`,
        `Wah, ${relationship.title}-ku datang! Gimana kabarnya? 😊`,
      ];

      this.#setEmotion(this.#getContextualEmotion());
      return [
        {
          speaker: "🍁 Maple",
          text: greetings[Math.floor(Math.random() * greetings.length)],
          emotion: this.#currentEmotion,
          quickReplies: [
            { text: "Apa kabar Maple?", action: "greeting" },
            { text: "Ada quest apa hari ini?", action: "explore" },
            { text: "Aku mau lihat-lihat guild lagi", action: "explore" },
          ],
        },
      ];
    }

    #guildDialogue() {
      this.#setEmotion("✨");
      return [
        {
          speaker: "🍁 Maple",
          text: "Ini dia guild-ku! 'Maple Tree' namanya. Semua anggota guild itu teman baikku! 🌳",
          emotion: "✨",
          quickReplies: [
            { text: "Siapa aja anggotanya?", action: "question" },
            { text: "Guild ini spesialisasinya apa?", action: "question" },
          ],
        },
        {
          speaker: "🍁 Maple",
          text: "Yang paling hebat itu Sally! Sahabatku sejak di dunia nyata. Dia jago banget hindarin serangan! 💨",
          emotion: "🥰",
        },
        {
          speaker: "🍁 Maple",
          text: "Terus ada Chrome, Iz, Kasumi, Kanade, dan yang lainnya! Semua punya skill unik!",
          emotion: "😊",
          quickReplies: [
            { text: "Ceritakan tentang Sally!", action: "explore" },
            { text: "Skill mereka apa aja?", action: "question" },
          ],
        },
      ];
    }

    #casualDialogue() {
      const hour = new Date().getHours();
      if (hour >= 0 && hour < 6) {
        this.#setEmotion("😅");
        this.#achievementSystem?.unlock("night_owl");
        return [
          {
            speaker: "🍁 Maple",
            text: "Eh?! Kamu masih bangun jam segini? Aku sih lagi farming monster malam~ Mau ikut? 🌙",
            emotion: "😅",
            quickReplies: [
              {
                text: "Boleh! Monster apa yang muncul malam hari?",
                action: "question",
              },
              {
                text: "Aku insomnia, nemenin kamu aja deh",
                action: "greeting",
              },
            ],
          },
        ];
      }
      return this.#welcomeDialogue(); // Fallback
    }

    #loreDialogue() {
      this.#setEmotion("📖");
      return [
        {
          speaker: "📖 Guild Master",
          text: "Penjelajah! Kamu mau tahu lebih banyak tentang legenda Maple? Duduklah, ini cerita yang panjang~ 📖",
          emotion: "📖",
          quickReplies: [
            { text: "Ceritakan semuanya!", action: "explore" },
            { text: "Aku penasaran soal Absolute Defense", action: "question" },
          ],
        },
        {
          speaker: "📖 Guild Master",
          text: "Jadi, dulu ada seorang gadis bernama Kaede yang baru pertama kali main VRMMO. Dia nggak suka sakit... Jadi semua poinnya dimasukkan ke VIT! 🛡️",
          emotion: "✨",
        },
        {
          speaker: "📖 Guild Master",
          text: 'Karena VIT-nya gila-gilaan, dia dapet skill <span class="highlight">Absolute Defense</span>! Skill yang bikin semua serangan jadi 0 damage!',
          emotion: "😱",
        },
        {
          speaker: "📖 Guild Master",
          text: 'Terus dia dapet skill aneh-aneh kayak <span class="highlight">Devour</span> (makan monster!), <span class="highlight">Machine God</span> (jadi mecha raksasa!), dan <span class="highlight">Atrocity</span> (berubah jadi monster serem)!',
          emotion: "👹",
          quickReplies: [
            { text: "WOW! Itu semua skill official?!", action: "question" },
            { text: "Developer gamenya nggak marah tuh?", action: "funny" },
          ],
        },
        {
          speaker: "📖 Guild Master",
          text: "HAHAHA! Developer-nya sampe pusing! Tapi mereka biarin aja karena Maple jadi legenda di game itu! 😂",
          emotion: "😂",
        },
      ];
    }

    #skillDialogue() {
      this.#setEmotion("⚡");
      return [
        {
          speaker: "⚡ Maple",
          text: 'Mau lihat skill-ku? Nih, <span class="highlight">Machine God</span>! *BRRRRR* Aku berubah jadi mecha raksasa dengan senjata laser! ⚡',
          emotion: "⚡",
          quickReplies: [
            { text: "KEREN BANGET! Itu legal?!", action: "question" },
            { text: "Skill itu gimana cara dapetinnya?", action: "question" },
          ],
        },
        {
          speaker: "⚡ Maple",
          text: "Hehe, rahasia dong~ Tapi intinya sih... aku nggak sengaja! Semua skill anehku itu dapetnya nggak sengaja! 💦",
          emotion: "😅",
        },
      ];
    }

    #adventureDialogue() {
      this.#setEmotion("🎮");
      return [
        {
          speaker: "🎮 Maple",
          text: "Pernah suatu hari aku lawan boss sendirian! Party-ku pada takut semua, tapi aku maju aja~ 🛡️",
          emotion: "🎮",
          quickReplies: [
            { text: "Terus menang nggak?", action: "question" },
            { text: "Boss-nya kuat banget ya?", action: "question" },
          ],
        },
        {
          speaker: "🎮 Maple",
          text: "Menang dong! Kan skill-ku OP! Eh tapi... itu gara-gara boss-nya kehabisan MP duluan sih. Aku cuma diem doang pake Absolute Defense sambil makan camilan~ 🍖",
          emotion: "😋",
        },
        {
          speaker: "🎮 Maple",
          text: "Temen-temenku sampe bengong. Mereka pikir bakal wipe, eh taunya aku malah AFK makan! 😂",
          emotion: "😂",
        },
      ];
    }

    #projectDialogue() {
      const total =
        document.getElementById("repoCount")?.textContent || "banyak";
      this.#setEmotion("😎");
      return [
        {
          speaker: "🎮 Maple",
          text: `Ini dia gudang loot-ku! Ada ${total} hasil coding yang udah ku-selesaikan! Lumayan kan buat pamer ke Sally? 😎`,
          emotion: "😎",
          quickReplies: [
            { text: "Keren! Filter berdasarkan tipe dong!", action: "filter" },
            { text: "Mana yang paling bagus?", action: "question" },
          ],
        },
        {
          speaker: "🎮 Maple",
          text: 'Setiap proyek punya tingkat kelangkaan lho! Kayak rarity di game: <span class="highlight">SSR</span> (Legendary), <span class="highlight">SR</span> (Rare), <span class="highlight">R</span> (Common).',
          emotion: "⭐",
        },
      ];
    }

    #codingDialogue() {
      this.#setEmotion("💡");
      return [
        {
          speaker: "💻 Maple",
          text: "Tahu nggak? Coding itu sebenernya mirip kayak nyusun skill combo di game! Harus pas timing-nya, harus tau sinerginya~ 💻",
          emotion: "💡",
          quickReplies: [
            { text: "Wah, penjelasan menarik!", action: "compliment" },
            { text: "Emangnya susah ya coding?", action: "question" },
          ],
        },
        {
          speaker: "💻 Maple",
          text: "Tapi begitu berhasil fix bug... Rasanya kayak dapet rare item! Puas banget! ✨",
          emotion: "✨",
        },
      ];
    }

    #achievementDialogue() {
      const unlocked = this.#achievementSystem?.getUnlockedCount?.() ?? 0;
      const totalXP = this.#achievementSystem?.getTotalXP?.() ?? 0;

      if (unlocked === 0) {
        return [
          {
            speaker: "🏆 Maple",
            text: "Kamu belum dapet achievement apa-apa nih! Coba eksplor guild-ku lebih jauh, pasti dapet banyak achievement! 🏆",
            emotion: "🏆",
            quickReplies: [
              { text: "Caranya gimana?", action: "question" },
              { text: "Aku mau coba dapetin!", action: "explore" },
            ],
          },
        ];
      }

      this.#setEmotion("🏆");
      return [
        {
          speaker: "🏆 Maple",
          text: `WOW! Kamu udah dapet ${unlocked} achievement dengan total ${totalXP} XP! Keren banget! 🏆`,
          emotion: "🏆",
          quickReplies: [
            { text: "Masih ada berapa lagi?", action: "question" },
            { text: "Aku pengen yang legendary!", action: "explore" },
          ],
        },
      ];
    }

    #personalDialogue() {
      this.#setEmotion("💕");
      return [
        {
          speaker: "💕 Maple",
          text: "Tentang aku ya? Hmm... Aku cuma gadis biasa yang suka main game dan... makan monster! 🍖",
          emotion: "💕",
          quickReplies: [
            { text: "MAKAN MONSTER?! Seriusan?!", action: "question" },
            { text: "Selain game, hobinya apa?", action: "question" },
          ],
        },
        {
          speaker: "🍖 Maple",
          text: "Iya! Enak lho! Apalagi kalo di-grill dulu... Daging Hydra itu gurih banget! Mau coba? 🍖",
          emotion: "😋",
          quickReplies: [
            { text: "Mau! (agak takut sih)", action: "game" },
            { text: "Nggak deh, aku vegetarian...", action: "funny" },
          ],
        },
      ];
    }

    #backstoryDialogue() {
      this.#setEmotion("📖");
      return [
        {
          speaker: "📖 Maple",
          text: "Dulu aku takut main game VR karena katanya sakit kalo kena hit... Makanya aku full VIT! Tapi ternyata malah jadi OP! 😂",
          emotion: "😂",
        },
      ];
    }

    #futureDialogue() {
      this.#setEmotion("✨");
      return [
        {
          speaker: "✨ Maple",
          text: "Ke depannya? Aku mau terus eksplor game ini! Masih banyak skill aneh yang belum ke-unlock! ✨",
          emotion: "✨",
          quickReplies: [
            { text: "Bakal ada skill baru lagi?", action: "question" },
            { text: "Aku mau ikut eksplorasi!", action: "explore" },
          ],
        },
      ];
    }

    #socialDialogue() {
      this.#setEmotion("💌");
      return [
        {
          speaker: "💌 Maple",
          text: 'Mau kirim pesan ke aku? Bisa lewat email, GitHub, atau LinkedIn! Semua aman di bawah perlindungan <span class="highlight">Aegis-ku</span>! 💌',
          emotion: "💌",
          quickReplies: [
            { text: "Aku mau kolaborasi proyek!", action: "collaboration" },
            { text: "Boleh minta saran coding?", action: "question" },
          ],
        },
      ];
    }

    #collaborationDialogue() {
      this.#setEmotion("🤝");
      return [
        {
          speaker: "🤝 Maple",
          text: "Kamu mau party bareng? Aku terbuka buat kolaborasi! Kita bisa bikin proyek keren bareng! 🤝",
          emotion: "🤝",
          quickReplies: [
            { text: "Aku ada ide proyek nih!", action: "collaboration" },
            { text: "Skill apa yang bisa kamu bantu?", action: "question" },
          ],
        },
      ];
    }

    #goodbyeDialogue() {
      this.#setEmotion("👋");
      return [
        {
          speaker: "👋 Maple",
          text: "Udah mau pergi? Dadah~ Jangan lupa mampir lagi ya! Guild-ku selalu terbuka buat kamu! 👋🍁",
          emotion: "👋",
          quickReplies: [
            { text: "Pasti balik lagi! Dadah Maple!", action: "farewell" },
            { text: "Tunggu, aku masih mau ngobrol!", action: "greeting" },
          ],
        },
      ];
    }

    // ════════════════════════════════════════
    // PRIVATE: TYPING EFFECT
    // ════════════════════════════════════════

    #typeText(dialogue) {
      this.#stopTyping();
      this.#isTyping = true;
      this.#currentFullText = dialogue.text;

      // Create new abort controller for this typing session
      this.#typeAbortController = new AbortController();
      const signal = this.#typeAbortController.signal;

      if (dialogue.emotion) {
        this.#showEmotion(dialogue.emotion);
        this.#setEmotion(dialogue.emotion);
      }

      if (this.#speakerEl) {
        this.#speakerEl.textContent = dialogue.speaker;
      }

      if (!this.#messageEl) return;

      this.#messageEl.innerHTML = "";
      this.#messageEl.classList.add("vn-message--new");
      setTimeout(
        () => this.#messageEl.classList.remove("vn-message--new"),
        300,
      );

      this.#quickRepliesEl?.classList.remove("vn-quick-replies--active");

      const text = dialogue.text;
      const speed =
        CONFIG.TYPING_SPEED_MIN +
        Math.random() * (CONFIG.TYPING_SPEED_MAX - CONFIG.TYPING_SPEED_MIN);

      let charIndex = 0;

      const typeNext = () => {
        // Check if aborted
        if (signal.aborted) return;

        if (charIndex < text.length) {
          // Handle HTML tags — insert whole tag at once
          if (text[charIndex] === "<") {
            const endTag = text.indexOf(">", charIndex);
            if (endTag !== -1) {
              const tag = text.substring(charIndex, endTag + 1);
              this.#messageEl.insertAdjacentHTML("beforeend", tag);
              charIndex = endTag + 1;
              this.#typeTimer = setTimeout(typeNext, speed);
              return;
            }
          }

          // Insert single character
          this.#messageEl.insertAdjacentText(
            "beforeend",
            text.charAt(charIndex),
          );
          charIndex++;
          this.#typeTimer = setTimeout(typeNext, speed);
        } else {
          // Typing complete
          this.#isTyping = false;

          // Add blinking cursor briefly
          this.#messageEl.insertAdjacentHTML(
            "beforeend",
            '<span class="typing-cursor"></span>',
          );
          setTimeout(() => {
            this.#messageEl?.querySelector(".typing-cursor")?.remove();
          }, 800);

          // Show quick replies
          if (dialogue.quickReplies) {
            setTimeout(
              () => this.#showQuickReplies(dialogue.quickReplies),
              500,
            );
          }

          this.#updateProgress();
        }
      };

      typeNext();
    }

    #stopTyping() {
      if (this.#typeTimer) {
        clearTimeout(this.#typeTimer);
        this.#typeTimer = null;
      }
      // Abort current typing session
      if (this.#typeAbortController) {
        this.#typeAbortController.abort();
        this.#typeAbortController = null;
      }
      this.#isTyping = false;
    }

    #skipTyping() {
      this.#stopTyping();
      if (this.#messageEl) {
        this.#messageEl.innerHTML = this.#currentFullText;
      }
      this.#audioManager?.playSFX("menuSelect");
    }

    // ════════════════════════════════════════
    // PRIVATE: UI UPDATES
    // ════════════════════════════════════════

    #showEmotion(emotion) {
      if (this.#avatarEmotion) {
        this.#avatarEmotion.textContent = emotion || "😊";
        this.#avatarEmotion.classList.add("vn-avatar-emotion--show");
        setTimeout(() => {
          this.#avatarEmotion?.classList.remove("vn-avatar-emotion--show");
        }, 2000);
      }
    }

    #showQuickReplies(replies) {
      if (!this.#quickRepliesEl) return;
      this.#quickRepliesEl.innerHTML = "";

      if (!replies?.length) {
        this.#quickRepliesEl.classList.remove("vn-quick-replies--active");
        return;
      }

      replies.forEach((reply, index) => {
        const btn = document.createElement("button");
        btn.className = "vn-quick-reply";
        btn.textContent = `${index + 1}. ${reply.text}`;
        btn.dataset.action = reply.action;
        btn.addEventListener("click", () => this.#handleQuickReply(reply));
        this.#quickRepliesEl.appendChild(btn);
      });

      this.#quickRepliesEl.classList.add("vn-quick-replies--active");
    }

    #handleQuickReply(reply) {
      this.#audioManager?.playSFX("menuSelect");
      this.#quickRepliesEl?.classList.remove("vn-quick-replies--active");

      // Update AI memory
      this.#updateRelationship(reply.action);
      this.#updatePersonality(reply.action);

      this.#userMemory.conversationHistory.push({
        action: reply.action,
        timestamp: Date.now(),
        route: this.#currentRoute,
      });
      this.#scheduleSave();

      // Handle special navigation actions
      switch (reply.action) {
        case "explore":
          this.close();
          this.#navigateTo?.("maple");
          break;
        case "filter":
          this.close();
          document.querySelector(".filter-tab")?.click();
          break;
        case "collaboration":
          this.close();
          this.#navigateTo?.("contact");
          break;
        case "farewell":
          this.close();
          break;
        case "github":
          window.open(`https://github.com/${CONFIG.USERNAME}`, "_blank");
          break;
        default:
          this.next();
      }
    }

    #navigateTo(route) {
      if (this.#navigateCallback) {
        this.#navigateCallback(route);
      } else {
        // Fallback: use global navigateTo if available
        window.navigateTo?.(route, true);
      }
    }

    #updateProgress() {
      if (this.#progressBar && this.#totalDialogues > 0) {
        const pct =
          ((this.#currentDialogueIndex + 1) / this.#totalDialogues) * 100;
        this.#progressBar.style.width = `${Math.min(100, Math.max(0, pct))}%`;
        this.#progressBar.setAttribute(
          "aria-valuenow",
          String(Math.round(pct)),
        );
      }
    }

    #updateRouteBadge(route) {
      if (!this.#routeBadgeEl) return;
      const config =
        AIVNDialogueSystem.#ROUTE_CONFIG[route] ||
        AIVNDialogueSystem.#ROUTE_CONFIG.home;
      this.#routeBadgeEl.textContent = config.badge;
      this.#routeBadgeEl.style.background = `${config.color}20`;
      this.#routeBadgeEl.style.color = config.color;
      this.#routeBadgeEl.style.borderColor = `${config.color}30`;
    }

    #updateContext(route) {
      if (this.#contextText) {
        this.#contextText.textContent =
          AIVNDialogueSystem.#CONTEXT_MESSAGES[route] ||
          "Tekan Space/Enter untuk lanjut, 1-4 untuk quick reply";
      }
    }

    // ════════════════════════════════════════
    // PRIVATE: MEMORY & EMOTION
    // ════════════════════════════════════════

    #setEmotion(emotion) {
      this.#currentEmotion = emotion;
    }

    #getContextualEmotion() {
      const hour = new Date().getHours();
      const lvl = this.#userMemory.relationship.level;

      if (hour < 6) return AIVNDialogueSystem.#EMOTION_MODIFIERS.shy[0];
      if (lvl >= 7) return AIVNDialogueSystem.#EMOTION_MODIFIERS.happy[2];
      if (lvl >= 4) return AIVNDialogueSystem.#EMOTION_MODIFIERS.happy[1];
      return AIVNDialogueSystem.#EMOTION_MODIFIERS.happy[0];
    }

    #updateRelationship(type) {
      const points = AIVNDialogueSystem.#RELATIONSHIP_POINTS[type] || 0;
      this.#userMemory.relationship.points += points;
      this.#userMemory.totalInteractions++;

      const newLevel =
        Math.floor(this.#userMemory.relationship.points / 10) + 1;
      if (newLevel > this.#userMemory.relationship.level) {
        this.#userMemory.relationship.level = Math.min(newLevel, 10);
        const titles = AIVNDialogueSystem.#RELATIONSHIP_TITLES;
        this.#userMemory.relationship.title =
          titles[this.#userMemory.relationship.level - 1] || "Partner";
      }
    }

    #updatePersonality(type) {
      const map = {
        curious: "curiosity",
        friendly: "friendliness",
        funny: "humorAppreciation",
        explorer: "explorationLevel",
      };
      const trait = map[type];
      if (trait && this.#userMemory.personalityInsights[trait] !== undefined) {
        this.#userMemory.personalityInsights[trait] = Math.min(
          100,
          this.#userMemory.personalityInsights[trait] + 5,
        );
      }
    }

    // ════════════════════════════════════════
    // PRIVATE: PERSISTENCE
    // ════════════════════════════════════════

    async #loadMemoryAsync() {
      await Promise.resolve(); // Defer to next microtask
      try {
        const raw = localStorage.getItem("maple_user_memory");
        if (raw) {
          const data = JSON.parse(raw);
          this.#userMemory = { ...this.#userMemory, ...data };
        }
      } catch {}
    }

    #scheduleSave() {
      clearTimeout(this.#saveTimeout);
      this.#saveTimeout = setTimeout(
        () => this.#flushSave(),
        this.#SAVE_DEBOUNCE_MS,
      );
    }

    #flushSave() {
      clearTimeout(this.#saveTimeout);
      try {
        localStorage.setItem(
          "maple_user_memory",
          JSON.stringify(this.#userMemory),
        );
      } catch {}
    }

    // ════════════════════════════════════════
    // PRIVATE: EVENT BINDING
    // ════════════════════════════════════════

    #keydownHandler = (e) => {
      if (!this.#isOpen) return;

      switch (true) {
        case e.key === "Enter" || e.key === " ":
          e.preventDefault();
          this.next();
          break;
        case e.key === "Escape":
          this.close();
          break;
        case e.key === "s" || e.key === "S":
          this.skipAll();
          break;
        case e.key === "r" || e.key === "R":
          this.repeat();
          break;
        case e.key >= "1" && e.key <= "4":
          const replies =
            this.#quickRepliesEl?.querySelectorAll(".vn-quick-reply");
          if (replies?.[parseInt(e.key) - 1]) {
            replies[parseInt(e.key) - 1].click();
          }
          break;
      }
    };

    #containerClickHandler = (e) => {
      if (e.target === this.#container || e.target.closest(".vn-textbox")) {
        if (!e.target.closest(".vn-quick-replies")) {
          this.next();
        }
      }
    };

    #bindEvents() {
      document
        .getElementById("vnNext")
        ?.addEventListener("click", () => this.next());
      document
        .getElementById("vnClose")
        ?.addEventListener("click", () => this.close());
      document
        .getElementById("vnSkip")
        ?.addEventListener("click", () => this.skipAll());
      document
        .getElementById("vnRepeat")
        ?.addEventListener("click", () => this.repeat());

      this.#container?.addEventListener("click", this.#containerClickHandler);
      document.addEventListener("keydown", this.#keydownHandler);
    }

    #unbindEvents() {
      document.removeEventListener("keydown", this.#keydownHandler);
      this.#container?.removeEventListener(
        "click",
        this.#containerClickHandler,
      );
    }
  }

  // ═══════════════════════════════════════════
  // 8. GUIDE SYSTEM v2.6.0 - OPTIMIZED
  // ═══════════════════════════════════════════

  /**
   * Interactive guided tour through the portfolio pages.
   * Maple walks the user through each section with VN dialogue.
   *
   * Features:
   *   - Sequential page navigation with configurable delays
   *   - Visual step indicator (dots)
   *   - Abortable — can be cancelled mid-tour
   *   - Per-step error recovery
   *   - Achievement integration
   *
   * @class GuideSystem
   */
  class GuideSystem {
    // ── Private fields ──────────────────────────
    #button = null;
    #indicator = null;
    #dots = null;
    #vnSystem = null;
    #audioManager = null;
    #achievementSystem = null;
    #navigateCallback = null;

    #isActive = false;
    #isRunning = false;
    #currentStep = 0;

    /** @type {AbortController|null} For cancelling the tour mid-way */
    #abortController = null;

    // ── Tour steps ────────────────────────────
    static #STEPS = Object.freeze([
      {
        route: "home",
        message:
          "Ehehe, ayo aku pandu keliling guild-ku! Kita mulai dari sini, ini halaman utamaku. Ada banyak info keren loh! ✨",
      },
      {
        route: "maple",
        message:
          "Sekarang kita ke Maple's Vault! Di sini aku tunjukin semua skill dan equipment legendari-ku! 🛡️",
      },
      {
        route: "project",
        message:
          "Nah, sekarang kita ke gudang loot! Ini semua hasil karyaku selama main game... eh, maksudku ngoding! 😎",
      },
      {
        route: "about",
        message:
          "Sekarang ke halaman tentang aku! Di sini kamu bisa lihat skill dan tech stack yang kupakai. 📋",
      },
      {
        route: "contact",
        message:
          "Akhirnya kita sampai di halaman kontak! Kalau kamu mau party bareng atau kirim quest, bisa lewat sini ya! 💌",
      },
      {
        route: "home",
        message:
          "Nah, tur guild-ku udah selesai! Sekarang kita balik ke beranda lagi. Dadah~ 👋🍁",
      },
    ]);

    // ════════════════════════════════════════
    // CONSTRUCTOR
    // ════════════════════════════════════════

    /**
     * @param {object} [deps]
     * @param {AIVNDialogueSystem} [deps.vnSystem]
     * @param {AudioManager} [deps.audioManager]
     * @param {AchievementSystem} [deps.achievementSystem]
     * @param {Function} [deps.navigateCallback] - (route: string) => void
     */
    constructor({
      vnSystem,
      audioManager,
      achievementSystem,
      navigateCallback,
    } = {}) {
      // Cache DOM
      this.#button = document.getElementById("guideModeBtn");
      this.#indicator = document.getElementById("guideIndicator");
      this.#dots = this.#indicator?.querySelectorAll(".dot");

      // Inject dependencies
      this.#vnSystem = vnSystem ?? null;
      this.#audioManager = audioManager ?? null;
      this.#achievementSystem = achievementSystem ?? null;
      this.#navigateCallback = navigateCallback ?? null;

      // Bind events
      this.#bindEvents();
    }

    // ════════════════════════════════════════
    // PUBLIC API
    // ════════════════════════════════════════

    /** @returns {boolean} Whether the guide tour is currently active */
    get isActive() {
      return this.#isActive;
    }

    setVNDialogue(vn) {
      this.#vnSystem = vn;
    }
    setAudioManager(am) {
      this.#audioManager = am;
    }
    setAchievementSystem(as) {
      this.#achievementSystem = as;
    }
    setNavigateCallback(fn) {
      this.#navigateCallback = fn;
    }

    /** Toggle guide on/off */
    toggle() {
      if (this.#isActive) {
        this.stop();
      } else {
        this.start();
      }
    }

    /**
     * Start the guided tour.
     * Traverses all steps sequentially with dialogue in between.
     */
    async start() {
      if (this.#isActive || this.#isRunning) return;

      this.#isActive = true;
      this.#isRunning = true;
      this.#currentStep = 0;

      // Create abort controller for this tour
      this.#abortController = new AbortController();
      const signal = this.#abortController.signal;

      // Update UI
      this.#button?.classList.add("guide-mode-btn--active");
      this.#indicator?.classList.add("guide-indicator--active");
      this.#indicator?.removeAttribute("aria-hidden");

      this.#audioManager?.playSFX("guideStart");
      this.#achievementSystem?.trackGuideStart();

      try {
        for (let i = 0; i < GuideSystem.#STEPS.length; i++) {
          // Check if cancelled
          if (signal.aborted || !this.#isActive) break;

          this.#currentStep = i;
          const step = GuideSystem.#STEPS[i];

          this.#updateIndicator(i);

          try {
            // Navigate to the step's route
            this.#navigateTo(step.route);

            // Small delay for page transition
            await this.#sleep(150, signal);

            // Open VN dialogue
            this.#vnSystem?.open(step.route, step.message);

            // Wait for user to read
            await this.#sleep(CONFIG.GUIDE_DELAY, signal);

            // Close dialogue before next step
            this.#vnSystem?.close();

            // Delay between steps
            await this.#sleep(300, signal);
          } catch (stepErr) {
            // Per-step error — log and continue
            console.warn(`[Guide] Step ${i} error:`, stepErr.message);
            // Don't break the whole tour for one step failure
          }
        }
      } catch (err) {
        console.warn("[Guide] Tour interrupted:", err.message);
      } finally {
        this.#isRunning = false;

        // Unlock achievement if completed all steps
        if (this.#currentStep >= GuideSystem.#STEPS.length - 1) {
          this.#achievementSystem?.trackGuideComplete();
        }

        // Auto-stop after completion
        if (this.#isActive) {
          setTimeout(() => {
            if (this.#isActive) this.stop();
          }, 2000);
        }
      }
    }

    /** Stop the guide tour immediately */
    stop() {
      // Abort current tour
      if (this.#abortController) {
        this.#abortController.abort();
        this.#abortController = null;
      }

      this.#isActive = false;
      this.#isRunning = false;
      this.#currentStep = 0;

      // Reset UI
      this.#button?.classList.remove("guide-mode-btn--active");
      this.#indicator?.classList.remove("guide-indicator--active");
      this.#indicator?.setAttribute("aria-hidden", "true");

      // Reset dots
      this.#dots?.forEach((dot) => {
        dot.className = "dot";
      });

      // Close VN dialogue if open
      this.#vnSystem?.close();

      this.#audioManager?.playSFX("close");
    }

    /** Cleanup event listeners and abort running tour */
    destroy() {
      this.stop();
      this.#button?.removeEventListener("click", this.#handleClick);
    }

    // ════════════════════════════════════════
    // PRIVATE
    // ════════════════════════════════════════

    /** @type {EventListener} Arrow function preserves `this` */
    #handleClick = () => {
      this.toggle();
    };

    #bindEvents() {
      this.#button?.addEventListener("click", this.#handleClick);
    }

    /**
     * Navigate to a route.
     * Uses injected callback, falls back to global.
     */
    #navigateTo(route) {
      if (this.#navigateCallback) {
        this.#navigateCallback(route);
      } else if (typeof window.navigateTo === "function") {
        window.navigateTo(route, true);
      }
    }

    /**
     * Async sleep with AbortSignal support.
     * @param {number} ms
     * @param {AbortSignal} [signal]
     */
    #sleep(ms, signal) {
      return new Promise((resolve, reject) => {
        if (signal?.aborted) {
          return reject(
            signal.reason || new DOMException("Aborted", "AbortError"),
          );
        }

        const timer = setTimeout(resolve, ms);

        if (signal) {
          signal.addEventListener(
            "abort",
            () => {
              clearTimeout(timer);
              reject(
                signal.reason || new DOMException("Aborted", "AbortError"),
              );
            },
            { once: true },
          );
        }
      });
    }

    /**
     * Update the step indicator dots.
     * @param {number} step - Current step index (0-based)
     */
    #updateIndicator(step) {
      if (!this.#dots) return;

      for (let i = 0; i < this.#dots.length; i++) {
        const dot = this.#dots[i];
        // Reset classes
        dot.className = "dot";
        if (i < step) dot.classList.add("completed");
        if (i === step) dot.classList.add("active");
      }

      // Update ARIA
      const progressBar = this.#indicator?.querySelector(".guide-progress");
      if (progressBar) {
        progressBar.setAttribute("aria-valuenow", String(step));
      }
    }
  }
  // ═══════════════════════════════════════════
  // UI RENDERER v2.6.0 - OPTIMIZED
  // ═══════════════════════════════════════════

  /**
   * Handles all DOM rendering: carousel, project grid, stats, previews.
   *
   * Features:
   *   - Smart screenshot with multi-layer fallback
   *   - SVG placeholder generation
   *   - Image error handling with retry
   *   - Carousel with autoplay, swipe, keyboard nav
   *   - Project cards with rarity, preview toggle, README overlay
   *   - Stats counter animation
   *
   * @class UIRenderer
   */
  class UIRenderer {
    // ── Private fields ──────────────────────────
    #githubManager = null;
    #audioManager = null;
    #carouselTrack = null;
    #carouselDots = null;
    #projectGrid = null;
    #projectLoader = null;
    #projectEmpty = null;
    #filterTabs = null;

    #currentCarouselIndex = 0;
    #autoplayTimer = null;
    #autoplayDelay = CONFIG.AUTOPLAY_DELAY;
    #isHovering = false;
    #totalCarouselSlides = 0;
    #goToCarouselSlide = null;

    /** @type {Map<string, string>} Screenshot cache (no TTL, cleared on new fetch) */
    #screenshotCache = new Map();

    // ── Bound handlers (arrow functions = auto-bound) ──
    #handlePreviewToggle = (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;

      const card = btn.closest(".project-card");
      if (!card) return;

      const preview = card.querySelector(".project-card__preview");
      if (!preview) return;

      const layers = {
        cover: preview.querySelector(".project-card__preview-cover"),
        live: preview.querySelector(".project-card__preview-live"),
        readme: preview.querySelector(".project-card__readme-overlay"),
      };

      // Hide all
      for (const layer of Object.values(layers)) {
        if (layer) layer.style.display = "none";
      }

      // Show selected
      const target = layers[btn.dataset.view];
      if (target) {
        target.style.display = btn.dataset.view === "readme" ? "flex" : "block";
      }

      // Update active state
      preview
        .querySelectorAll(".project-card__preview-toggle button")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
    };

    #handleReadmeBtnClick = (e) => {
      e.preventDefault();
      const btn = e.currentTarget;
      const card = btn.closest(".project-card");
      if (!card) return;

      const readmeOverlay = card.querySelector(".project-card__readme-overlay");
      const cover = card.querySelector(".project-card__preview-cover");

      if (readmeOverlay && cover) {
        const isShowing = readmeOverlay.style.display === "flex";
        if (isShowing) {
          readmeOverlay.style.display = "none";
          cover.style.display = "block";
          btn.innerHTML = `${ICONS.readme} README`;
          btn.classList.remove("active");
        } else {
          readmeOverlay.style.display = "flex";
          cover.style.display = "none";
          btn.innerHTML = "✕ Tutup README";
          btn.classList.add("active");

          const toggleBtns = card.querySelectorAll(
            ".project-card__preview-toggle button",
          );
          toggleBtns.forEach((b) => b.classList.remove("active"));
          const readmeBtn = card.querySelector('[data-view="readme"]');
          if (readmeBtn) readmeBtn.classList.add("active");
        }
      }
    };

    #handleImageError = (e) => {
      const img = e.target;

      // Prevent infinite loop
      if (img.dataset.errorHandled === "true") {
        this.#showImageFallback(img);
        return;
      }

      const retryCount = parseInt(img.dataset.retryCount) || 0;
      const maxRetries = 2;

      console.warn(`⚠️ Image error (retry: ${retryCount}/${maxRetries})`);

      if (retryCount < maxRetries) {
        const repoName = img.closest("[data-repo]")?.dataset?.repo;
        const repo = this.#githubManager?.repositories?.find(
          (r) => r.name === repoName,
        );

        if (repo) {
          const hasPages = repo.has_pages || repo.homepage;
          const pagesUrl =
            repo.homepage ||
            `https://${this.#githubManager.username}.github.io/${repo.name}`;
          const alternatives = this.#getAlternativeScreenshot(
            repo,
            pagesUrl,
            hasPages,
          );

          if (alternatives[retryCount]) {
            console.log(`   🔄 Trying alternative...`);
            img.src = alternatives[retryCount];
            img.dataset.retryCount = String(retryCount + 1);
            return;
          }
        }
      }

      this.#showImageFallback(img);
    };

    // ════════════════════════════════════════
    // CONSTRUCTOR
    // ════════════════════════════════════════

    /**
     * @param {object} [deps]
     * @param {GitHubManager} [deps.githubManager]
     * @param {AudioManager} [deps.audioManager]
     */
    constructor({ githubManager, audioManager } = {}) {
      this.#githubManager = githubManager ?? null;
      this.#audioManager = audioManager ?? null;

      // Cache DOM
      this.#carouselTrack = document.getElementById("carTrack");
      this.#carouselDots = document.getElementById("carDots");
      this.#projectGrid = document.getElementById("projectGrid");
      this.#projectLoader = document.getElementById("projectLoader");
      this.#projectEmpty = document.getElementById("projectEmpty");
      this.#filterTabs = document.querySelectorAll("#filterTabs .filter-tab");
    }

    // ════════════════════════════════════════
    // PUBLIC SETTERS
    // ════════════════════════════════════════

    setGitHubManager(m) {
      this.#githubManager = m;
    }
    setAudioManager(a) {
      this.#audioManager = a;
    }

    // ════════════════════════════════════════
    // CAROUSEL RENDERING
    // ════════════════════════════════════════

    renderSkeleton(count = 3) {
      if (!this.#carouselTrack) return;
      this.stopAutoplay();
      this.#carouselTrack.innerHTML = "";
      if (this.#carouselDots) this.#carouselDots.innerHTML = "";

      const html = this.#createSkeletonSlideHTML();
      for (let i = 0; i < count; i++) {
        const s = document.createElement("div");
        s.className = "carousel__slide carousel__slide--skeleton";
        s.innerHTML = html;
        this.#carouselTrack.appendChild(s);
      }
    }

    renderError(msg = "Gagal memuat data.", onRetry = null) {
      if (!this.#carouselTrack) return;
      this.stopAutoplay();
      this.#carouselTrack.innerHTML = `
      <div class="car-error">
        <span class="car-error__icon">⚠️</span>
        <p class="car-error__msg">${escapeHtml(msg)}</p>
        ${onRetry ? '<button class="car-error__retry" id="carRetryBtn">Coba Lagi</button>' : ""}
      </div>`;
      if (this.#carouselDots) this.#carouselDots.innerHTML = "";

      document
        .getElementById("carRetryBtn")
        ?.addEventListener("click", onRetry);
    }

    renderCarousel() {
      if (!this.#carouselTrack || !this.#carouselDots || !this.#githubManager)
        return;
      this.stopAutoplay();

      const slides = this.#githubManager.getFeaturedRepos(
        CONFIG.FEATURED_COUNT,
      );
      this.#totalCarouselSlides = slides.length;

      this.#carouselTrack.innerHTML = "";
      this.#carouselDots.innerHTML = "";

      if (!slides.length) {
        this.renderError("Belum ada repository.");
        return;
      }

      const frag = document.createDocumentFragment();
      const dotsFrag = document.createDocumentFragment();

      slides.forEach((repo, i) => {
        // Slide
        const s = document.createElement("div");
        s.className = "carousel__slide";
        s.setAttribute("role", "listitem");
        s.tabIndex = 0;
        s.innerHTML = this.#createSlideHTML(repo, i);
        frag.appendChild(s);

        // Dot
        const d = document.createElement("button");
        d.type = "button";
        d.className = "carousel__dot";
        d.setAttribute("role", "tab");
        d.setAttribute("aria-label", `Slide ${i + 1}`);
        if (i === 0) d.classList.add("carousel__dot--active");
        d.addEventListener("click", () => {
          this.#goToCarouselSlide?.(i);
          this.#restartAutoplay();
        });
        dotsFrag.appendChild(d);
      });

      this.#carouselTrack.appendChild(frag);
      this.#carouselDots.appendChild(dotsFrag);

      const totalEl = document.getElementById("totalSlideNum");
      if (totalEl) totalEl.textContent = String(slides.length);

      this.#setupCarouselNavigation(slides.length);
      this.#setupSwipeSupport();
      this.#setupAutoplayPause();
      this.startAutoplay();

      // Attach image error handlers
      this.#attachImageErrorHandlers();
    }

    // ════════════════════════════════════════
    // PROJECT GRID RENDERING
    // ════════════════════════════════════════

    renderProjects(filter = "all") {
      if (!this.#projectGrid || !this.#githubManager) return;

      const repos = this.#githubManager.getFilteredRepos(filter);

      if (!repos.length) {
        this.#projectGrid.innerHTML = "";
        if (this.#projectEmpty) this.#projectEmpty.style.display = "block";
        return;
      }

      if (this.#projectEmpty) this.#projectEmpty.style.display = "none";

      const frag = document.createDocumentFragment();
      for (const repo of repos) {
        const div = document.createElement("div");
        div.innerHTML = this.#createProjectCardHTML(repo);
        frag.appendChild(div.firstElementChild);
      }

      this.#projectGrid.innerHTML = "";
      this.#projectGrid.appendChild(frag);

      this.#attachPreviewListeners();
      this.#attachImageErrorHandlers();
    }

    setupFilterTabs() {
      this.#filterTabs.forEach((tab) => {
        tab.addEventListener("click", () => {
          this.#filterTabs.forEach((t) =>
            t.classList.remove("filter-tab--active"),
          );
          tab.classList.add("filter-tab--active");
          this.renderProjects(tab.dataset.filter);
          this.#audioManager?.playSFX("menuSelect");
        });
      });
    }

    // ════════════════════════════════════════
    // STATS
    // ════════════════════════════════════════

    updateStats(repos, totalCommits, userData, lastActiveDate = null) {
      const repoCountEl = document.getElementById("repoCount");
      if (repoCountEl) repoCountEl.textContent = String(repos.length);

      const starCountEl = document.getElementById("starCount");
      if (starCountEl) {
        const totalStars = repos.reduce(
          (sum, r) => sum + (r.stargazers_count || 0),
          0,
        );
        starCountEl.textContent = String(totalStars);
      }

      const commitCountEl = document.getElementById("commitCount");
      if (commitCountEl) commitCountEl.textContent = `${totalCommits}+`;

      const activeSinceEl = document.getElementById("activeSince");
      if (activeSinceEl && userData?.created_at) {
        activeSinceEl.textContent = String(
          new Date(userData.created_at).getFullYear(),
        );
      }

      const lastActiveEl = document.getElementById("lastActive");
      if (lastActiveEl) {
        lastActiveEl.textContent = lastActiveDate
          ? timeAgo(lastActiveDate)
          : userData?.updated_at
            ? timeAgo(userData.updated_at)
            : "—";
      }
    }

    async animateStats(githubManager) {
      const duration = CONFIG.STATS_ANIMATION_DURATION || 1500;

      const animateCounter = (element, target, suffix = "") => {
        if (!element) return;
        const startTime = performance.now();
        const update = (currentTime) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          element.textContent = Math.floor(eased * target) + suffix;
          if (progress < 1) {
            requestAnimationFrame(update);
          } else {
            element.textContent = target + suffix;
          }
        };
        requestAnimationFrame(update);
      };

      const repoEl = document.getElementById("repoCount");
      if (repoEl) {
        animateCounter(repoEl, githubManager.repositories.length);
        await new Promise((r) => setTimeout(r, 200));
      }
      const starEl = document.getElementById("starCount");
      if (starEl) {
        animateCounter(starEl, githubManager.totalStars);
        await new Promise((r) => setTimeout(r, 200));
      }
      const commitEl = document.getElementById("commitCount");
      if (commitEl) animateCounter(commitEl, githubManager.totalCommits, "+");
    }

    showLoader(show) {
      if (this.#projectLoader) {
        this.#projectLoader.style.display = show ? "flex" : "none";
      }
    }

    // ════════════════════════════════════════
    // AUTOPLAY
    // ════════════════════════════════════════

    startAutoplay() {
      this.stopAutoplay();
      if (this.#totalCarouselSlides <= 1) return;
      this.#autoplayTimer = setInterval(() => {
        if (!this.#isHovering && this.#goToCarouselSlide) {
          this.#goToCarouselSlide(
            (this.#currentCarouselIndex + 1) % this.#totalCarouselSlides,
          );
        }
      }, this.#autoplayDelay);
    }

    stopAutoplay() {
      if (this.#autoplayTimer) {
        clearInterval(this.#autoplayTimer);
        this.#autoplayTimer = null;
      }
    }

    #restartAutoplay() {
      if (this.#totalCarouselSlides > 1) this.startAutoplay();
    }

    #setupAutoplayPause() {
      const carousel = this.#carouselTrack?.closest(".carousel");
      if (!carousel || carousel.dataset.autoplayPause) return;
      carousel.dataset.autoplayPause = "1";

      carousel.addEventListener("mouseenter", () => {
        this.#isHovering = true;
      });
      carousel.addEventListener("mouseleave", () => {
        this.#isHovering = false;
      });
    }

    // ════════════════════════════════════════
    // SWIPE SUPPORT
    // ════════════════════════════════════════

    #setupSwipeSupport() {
      const track = this.#carouselTrack;
      if (!track || track.dataset.swipeSetup) return;
      track.dataset.swipeSetup = "1";

      let startX = 0,
        startY = 0,
        isSwiping = false;

      track.addEventListener(
        "touchstart",
        (e) => {
          startX = e.touches[0].clientX;
          startY = e.touches[0].clientY;
          isSwiping = true;
          this.#isHovering = true;
        },
        { passive: true },
      );

      track.addEventListener(
        "touchend",
        (e) => {
          if (!isSwiping) return;
          isSwiping = false;
          this.#isHovering = false;

          const dx = startX - e.changedTouches[0].clientX;
          const dy = startY - e.changedTouches[0].clientY;

          if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
            const nextIdx =
              dx > 0
                ? Math.min(
                    this.#currentCarouselIndex + 1,
                    this.#totalCarouselSlides - 1,
                  )
                : Math.max(this.#currentCarouselIndex - 1, 0);
            this.#goToCarouselSlide?.(nextIdx);
            this.#restartAutoplay();
          }
        },
        { passive: true },
      );
    }

    // ════════════════════════════════════════
    // CAROUSEL NAVIGATION
    // ════════════════════════════════════════

    #setupCarouselNavigation(total) {
      const prev = document.getElementById("carPrev");
      const next = document.getElementById("carNext");
      const slides = this.#carouselTrack?.querySelectorAll(".carousel__slide");
      const dots = this.#carouselDots?.querySelectorAll(".carousel__dot");

      if (!slides?.length) return;

      const update = (i) => {
        dots?.forEach((d, j) =>
          d.classList.toggle("carousel__dot--active", j === i),
        );

        const currentNumEl = document.getElementById("currentSlideNum");
        if (currentNumEl) currentNumEl.textContent = String(i + 1);

        const progressFill = document.getElementById("carProgressFill");
        if (progressFill)
          progressFill.style.width = `${((i + 1) / total) * 100}%`;

        if (prev) prev.disabled = i === 0;
        if (next) next.disabled = i === total - 1;
      };

      const go = (i) => {
        i = Math.max(0, Math.min(i, total - 1));
        this.#carouselTrack?.scrollTo({
          left: i * (slides[0].offsetWidth + 18),
          behavior: "smooth",
        });
        this.#currentCarouselIndex = i;
        update(i);
      };

      // Store reference for external use
      this.#goToCarouselSlide = go;

      prev?.addEventListener("click", () => {
        go(Math.max(this.#currentCarouselIndex - 1, 0));
        this.#restartAutoplay();
      });

      next?.addEventListener("click", () => {
        go(Math.min(this.#currentCarouselIndex + 1, total - 1));
        this.#restartAutoplay();
      });

      // Scroll-based index detection
      let scrollTimer;
      this.#carouselTrack?.addEventListener("scroll", () => {
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(() => {
          const newIndex = Math.round(
            (this.#carouselTrack?.scrollLeft ?? 0) /
              (slides[0].offsetWidth + 18),
          );
          if (
            newIndex !== this.#currentCarouselIndex &&
            newIndex >= 0 &&
            newIndex < total
          ) {
            this.#currentCarouselIndex = newIndex;
            update(newIndex);
          }
        }, 50);
      });

      update(0);
    }

    // ════════════════════════════════════════
    // PRIVATE: HTML GENERATORS
    // ════════════════════════════════════════

    #createSlideHTML(repo, index = 0) {
      const initial = (repo.name || "?").charAt(0).toUpperCase();
      const hasPages = repo.has_pages || repo.homepage;
      const pagesUrl =
        repo.homepage ||
        `https://${this.#githubManager.username}.github.io/${repo.name}`;

      const screenshotUrl = this.#getSmartScreenshot(repo, pagesUrl, hasPages);

      const langBadge = repo.language
        ? `<span class="slide__tag slide__tag--language">
          <span class="slide__lang-dot" style="background:${getLanguageColor(repo.language)}"></span>${escapeHtml(repo.language)}
        </span>`
        : "";

      const demoLink = hasPages
        ? `<a class="slide__link slide__link--demo" href="${escapeHtml(pagesUrl)}" target="_blank" rel="noopener">
          ${ICONS.demo} Live Demo
        </a>`
        : "";

      return `
      <div class="slide__screenshot-wrapper">
        <img src="${screenshotUrl}" 
             alt="${escapeHtml(repo.name)}" 
             class="slide__screenshot" 
             loading="lazy"
             onerror="this.dataset.errorHandled || (this.style.display='none', this.nextElementSibling?.style?.display='flex')">
        ${
          hasPages
            ? '<span class="slide__badge slide__badge--live">🌐 LIVE</span>'
            : '<span class="slide__badge slide__badge--repo">📂 REPO</span>'
        }
        <div class="slide__screenshot-overlay"></div>
      </div>
      
      <span class="slide__rank">#${String(index + 1).padStart(2, "0")}</span>
      
      <div class="slide__header">
        <div class="slide__icon" aria-hidden="true">${initial}</div>
        <h4 class="slide__title">
          <a href="${escapeHtml(repo.html_url)}" target="_blank" rel="noopener">${escapeHtml(repo.name)}</a>
        </h4>
      </div>
      
      <p class="slide__desc">${escapeHtml(repo.description || "Tidak ada deskripsi.")}</p>
      
      <div class="slide__stats">
        ${langBadge}
        <span class="slide__stat slide__stat--stars">${ICONS.star} ${repo.stargazers_count || 0}</span>
        <span class="slide__stat slide__stat--forks">${ICONS.fork} ${repo.forks_count || 0}</span>
        <span class="slide__stat slide__stat--updated">${ICONS.clock} ${timeAgo(repo.updated_at)}</span>
      </div>
      
      <div class="slide__actions">
        <a class="slide__link slide__link--repo" href="${escapeHtml(repo.html_url)}" target="_blank" rel="noopener">
          ${ICONS.repo} Source
        </a>
        ${demoLink}
      </div>`;
    }

    #createSkeletonSlideHTML() {
      return `
      <div class="skeleton skeleton--image"></div>
      <div class="skeleton skeleton--icon"></div>
      <div class="skeleton skeleton--title"></div>
      <div class="skeleton skeleton--text"></div>
      <div class="skeleton skeleton--text short"></div>
      <div class="skeleton skeleton--tags"></div>`;
    }

    #createProjectCardHTML(repo) {
      const created = new Date(repo.created_at);
      const dateStr = created.toLocaleDateString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      const hasPages = repo.has_pages || repo.homepage;
      const pagesUrl =
        repo.homepage ||
        `https://${this.#githubManager.username}.github.io/${repo.name}`;

      const category = this.#githubManager.categorizeRepo(repo);
      const categoryLabels = {
        web: "🌐 Web",
        game: "🎮 Game",
        design: "🎨 Design",
        other: "📦 Lainnya",
      };
      const categoryLabel = categoryLabels[category] || "📦 Lainnya";

      const rarity = this.#getRarity(repo);
      const screenshotUrl = this.#getSmartScreenshot(repo, pagesUrl, hasPages);
      const hasReadme = repo.readme?.length > 10;
      const showPagesTab = hasPages;
      const showReadmeTab = hasReadme && !hasPages;
      const showToggle = showPagesTab || showReadmeTab;

      return `
      <article class="project-card project-card--${rarity}" data-repo="${escapeHtml(repo.name)}">
        <div class="project-card__preview">
          <div class="project-card__preview-cover">
            <img src="${screenshotUrl}" 
                 alt="${escapeHtml(repo.name)}" 
                 class="project-card__preview-img" 
                 loading="lazy">
            ${
              hasPages
                ? '<span class="project-card__badge project-card__badge--live">🌐</span>'
                : '<span class="project-card__badge project-card__badge--repo">📂 Repository</span>'
            }
          </div>
          
          ${
            showReadmeTab
              ? `
          <div class="project-card__readme-overlay" hidden>
            <div class="readme-header">
              <span>📄 README.md</span>
              <a href="${escapeHtml(repo.html_url)}#readme" target="_blank" rel="noopener" class="readme-view-full">Lihat di GitHub ↗</a>
            </div>
            <div class="readme-content">${this.#safeMarkdownParse(repo.readme)}</div>
            <div class="readme-fade"></div>
          </div>`
              : ""
          }
          
          ${
            showToggle
              ? `
          <div class="project-card__preview-toggle">
            <button class="active" data-view="cover" title="Screenshot">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21,15 16,10 5,21"/>
              </svg>
            </button>
            ${
              showPagesTab
                ? `
            <button data-view="live" title="Preview Website">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
            </button>`
                : ""
            }
            ${
              showReadmeTab
                ? `
            <button data-view="readme" title="Lihat README">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
              </svg>
            </button>`
                : ""
            }
          </div>`
              : ""
          }
          
          <span class="project-card__rarity">${rarity}</span>
        </div>
        
        <div class="project-card__body">
          <h3 class="project-card__title">${escapeHtml(repo.name)}</h3>
          <p class="project-card__desc">${escapeHtml(repo.description || "Tidak ada deskripsi.")}</p>
          <span class="project-card__date">📅 ${dateStr} | Diperbarui: ${timeAgo(repo.updated_at)}</span>
          <div class="project-card__meta">
            ${repo.language ? `<span class="project-card__tag project-card__tag--lang" style="background:${getLanguageColor(repo.language)}20;color:${getLanguageColor(repo.language)}">${escapeHtml(repo.language)}</span>` : ""}
            <span class="project-card__tag">⭐ ${repo.stargazers_count || 0}</span>
            <span class="project-card__tag">🍴 ${repo.forks_count || 0}</span>
            <span class="project-card__tag">${categoryLabel}</span>
            ${hasPages ? '<span class="project-card__tag project-card__tag--pages">🌐 Live</span>' : ""}
          </div>
          <div class="project-card__actions">
            <a href="${escapeHtml(repo.html_url)}" target="_blank" rel="noopener" class="project-card__link">${ICONS.repo} Source</a>
            ${hasPages ? `<a href="${escapeHtml(pagesUrl)}" target="_blank" rel="noopener" class="project-card__view project-card__view--demo">${ICONS.demo} Live Demo</a>` : ""}
            ${hasReadme ? `<button class="project-card__view project-card__view--readme-btn" data-view-readme="${escapeHtml(repo.name)}">${ICONS.readme} README</button>` : ""}
          </div>
        </div>
      </article>`;
    }

    // ════════════════════════════════════════
    // PRIVATE: SCREENSHOT LOGIC
    // ════════════════════════════════════════

    #getSmartScreenshot(repo, pagesUrl, hasPages) {
      const cacheKey = `screenshot_${repo.name}`;
      if (this.#screenshotCache.has(cacheKey)) {
        return this.#screenshotCache.get(cacheKey);
      }

      const isLocalhost =
        ["localhost", "127.0.0.1"].includes(window.location.hostname) ||
        window.location.hostname.includes("192.168.");

      let url;
      if (hasPages && pagesUrl && !isLocalhost) {
        url = `https://image.thum.io/get/width/640/crop/400/viewportWidth/1280/viewportHeight/800/wait/3/noanimate/${pagesUrl.replace(/\/$/, "")}`;
      } else {
        url = this.#getGitHubOGImage(repo);
      }

      this.#screenshotCache.set(cacheKey, url);
      return url;
    }

    #getGitHubOGImage(repo) {
      const username = this.#githubManager?.username || CONFIG.USERNAME;
      return `https://opengraph.githubassets.com/1/${username}/${repo.name}`;
    }

    #getAlternativeScreenshot(repo, pagesUrl, hasPages) {
      const username = this.#githubManager?.username || CONFIG.USERNAME;
      const alternatives = [
        `https://opengraph.githubassets.com/${Date.now()}/${username}/${repo.name}`,
      ];

      if (hasPages && pagesUrl) {
        alternatives.push(
          `https://api.microlink.io/?url=${encodeURIComponent(pagesUrl)}&screenshot=true&meta=false&embed=screenshot.url`,
        );
      }

      if (
        repo.homepage?.includes("vercel.app") ||
        repo.homepage?.includes("netlify.app")
      ) {
        alternatives.push(
          `https://image.thum.io/get/width/640/crop/400/quality/80/noanimate/${repo.homepage.replace(/\/$/, "")}`,
        );
      }

      return alternatives;
    }

    #showImageFallback(img) {
      img.dataset.errorHandled = "true";
      const repoName = img.closest("[data-repo]")?.dataset?.repo || "Project";
      const repo = this.#githubManager?.repositories?.find(
        (r) => r.name === repoName,
      );
      const lang = repo?.language || "Repository";
      img.src = this.#getSVGPlaceholder(repoName, lang);
      img.onerror = null;
    }

    // ════════════════════════════════════════
    // PRIVATE: SVG PLACEHOLDER (SINGLE VERSION)
    // ════════════════════════════════════════

    #getSVGPlaceholder(name, lang) {
      const colors = {
        JavaScript: "#f7df1e",
        TypeScript: "#3178c6",
        Python: "#3776ab",
        HTML: "#e34f26",
        CSS: "#563d7c",
        Java: "#b07219",
        "C++": "#f34b7d",
        C: "#555555",
        "C#": "#178600",
        PHP: "#4F5D95",
        Ruby: "#701516",
        Go: "#00ADD8",
        Rust: "#dea584",
        Swift: "#F05138",
        Kotlin: "#A97BFF",
        Dart: "#00B4AB",
        Shell: "#89e051",
        Vue: "#41b883",
        Lua: "#000080",
        default: "#7c3aed",
      };
      const color = colors[lang] || colors.default;
      const shortName = String(name || "Project").substring(0, 20);

      const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="640" height="400" viewBox="0 0 640 400">
        <defs>
          <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="${color}15"/>
            <stop offset="100%" stop-color="${color}08"/>
          </linearGradient>
        </defs>
        <rect fill="#0a0a14" width="640" height="400"/>
        <rect fill="url(#bg)" width="640" height="400"/>
        <rect x="20" y="20" width="600" height="360" rx="12" fill="none" stroke="${color}20" stroke-width="1.5"/>
        <circle cx="80" cy="80" r="40" fill="${color}08"/>
        <circle cx="560" cy="320" r="60" fill="${color}05"/>
        <text x="320" y="180" text-anchor="middle" font-size="64" opacity="0.3">📂</text>
        <text x="320" y="240" text-anchor="middle" fill="${color}" font-family="monospace" font-size="22" font-weight="bold" opacity="0.9">${escapeHtml(shortName)}</text>
        <rect x="270" y="265" width="100" height="28" rx="14" fill="${color}20" stroke="${color}40" stroke-width="1"/>
        <text x="320" y="284" text-anchor="middle" fill="${color}" font-family="monospace" font-size="12" font-weight="600">${escapeHtml(lang || "Repository")}</text>
        <text x="320" y="360" text-anchor="middle" fill="${color}40" font-family="monospace" font-size="11">GitHub Repository</text>
      </svg>`;

      return `data:image/svg+xml,${encodeURIComponent(svg.replace(/\s+/g, " ").trim())}`;
    }

    // ════════════════════════════════════════
    // PRIVATE: UTILITIES
    // ════════════════════════════════════════

    #getRarity(repo) {
      const s = repo.stargazers_count || 0;
      if (s >= 10) return "Legend";
      if (s >= 3) return "Epic";
      return "Common";
    }

    #safeMarkdownParse(md) {
      if (!md) return "<p>No README available</p>";
      try {
        const truncated = md.substring(0, 3000);
        if (typeof marked !== "undefined" && marked.parse) {
          return marked.parse(truncated);
        }
        return `<pre>${escapeHtml(truncated)}</pre>`;
      } catch {
        return `<pre>${escapeHtml(md.substring(0, 500))}</pre>`;
      }
    }

    #attachPreviewListeners() {
      document
        .querySelectorAll(".project-card__preview-toggle")
        .forEach((toggle) => {
          toggle.removeEventListener("click", this.#handlePreviewToggle);
          toggle.addEventListener("click", this.#handlePreviewToggle);
        });

      document
        .querySelectorAll(".project-card__view--readme-btn")
        .forEach((btn) => {
          btn.removeEventListener("click", this.#handleReadmeBtnClick);
          btn.addEventListener("click", this.#handleReadmeBtnClick);
        });
    }

    #attachImageErrorHandlers() {
      document
        .querySelectorAll(".project-card__preview-img, .slide__screenshot")
        .forEach((img) => {
          img.removeEventListener("error", this.#handleImageError);
          img.addEventListener("error", this.#handleImageError);
        });
    }

    // ════════════════════════════════════════
    // CLEANUP
    // ════════════════════════════════════════

    destroy() {
      this.stopAutoplay();
      this.#screenshotCache.clear();
      this.#goToCarouselSlide = null;
    }
  }

  // ═══════════════════════════════════════════
  // NAVIGATION SYSTEM v2.6.0 - OPTIMIZED
  // ═══════════════════════════════════════════

  /**
   * SPA-style navigation with view switching, mobile menu, and URL sync.
   *
   * Features:
   *   - Route-based view activation
   *   - Mobile hamburger menu with outside-click dismiss
   *   - URL query parameter sync (pushState)
   *   - Lazy loading for projects section
   *   - Keyboard navigation support
   *   - Clean event cleanup
   *
   * @class NavigationSystem
   */
  class NavigationSystem {
    // ── Private fields ──────────────────────────
    #views = null;
    #navLinks = null;
    #menuToggle = null;
    #navMenu = null;
    #currentRoute = "home";

    // Dependencies
    #vnSystem = null;
    #audioManager = null;
    #githubManager = null;
    #uiRenderer = null;

    // ── Bound event handlers (arrow functions = auto-bound) ──
    #handleNavClick = (e) => {
      e.preventDefault();
      const route = e.currentTarget.dataset.route;
      this.navigate(route);
    };

    #handleMenuToggle = () => {
      const isOpen = this.#navMenu?.classList.toggle("navbar__menu--open");
      this.#menuToggle?.setAttribute("aria-expanded", String(Boolean(isOpen)));
    };

    #handleOutsideClick = (e) => {
      if (this.#navMenu?.classList.contains("navbar__menu--open")) {
        if (!e.target.closest(".navbar")) {
          this.#closeMenu();
        }
      }
    };

    #handleKeydown = (e) => {
      // Escape to close menu
      if (
        e.key === "Escape" &&
        this.#navMenu?.classList.contains("navbar__menu--open")
      ) {
        this.#closeMenu();
        this.#menuToggle?.focus();
      }
    };

    // ════════════════════════════════════════
    // CONSTRUCTOR
    // ════════════════════════════════════════

    /**
     * @param {object} [deps]
     * @param {AIVNDialogueSystem} [deps.vnSystem]
     * @param {AudioManager} [deps.audioManager]
     * @param {GitHubManager} [deps.githubManager]
     * @param {UIRenderer} [deps.uiRenderer]
     */
    constructor({ vnSystem, audioManager, githubManager, uiRenderer } = {}) {
      // Cache DOM
      this.#views = document.querySelectorAll(".view");
      this.#navLinks = document.querySelectorAll("[data-route]");
      this.#menuToggle = document.getElementById("menuToggle");
      this.#navMenu = document.getElementById("navMenu");

      // Inject dependencies
      this.#vnSystem = vnSystem ?? null;
      this.#audioManager = audioManager ?? null;
      this.#githubManager = githubManager ?? null;
      this.#uiRenderer = uiRenderer ?? null;

      // Bind events
      this.#bindEvents();

      // Handle initial route from URL
      this.#handleInitialRoute();
    }

    // ════════════════════════════════════════
    // PUBLIC API
    // ════════════════════════════════════════

    /** @returns {string} Current active route */
    get currentRoute() {
      return this.#currentRoute;
    }

    setVNDialogue(vn) {
      this.#vnSystem = vn;
    }
    setAudioManager(am) {
      this.#audioManager = am;
    }
    setGitHubManager(gm) {
      this.#githubManager = gm;
    }
    setUIRenderer(ui) {
      this.#uiRenderer = ui;
    }

    /**
     * Navigate to a route.
     * @param {string} route - Route name (home, maple, project, about, contact)
     * @param {object} [options]
     * @param {boolean} [options.skipDialogue=false] - Don't open VN dialogue
     */
    navigate(route, { skipDialogue = false } = {}) {
      if (!route || route === this.#currentRoute) return;

      // Validate route exists
      if (!document.getElementById(route)) {
        console.warn(`[Navigation] Route "${route}" not found`);
        return;
      }

      // Update views
      this.#setActiveView(route);
      this.#setActiveNav(route);
      this.#currentRoute = route;

      // Update document title
      this.#updateTitle(route);

      // Close mobile menu
      this.#closeMenu();

      // Scroll to top
      window.scrollTo({ top: 0, behavior: "smooth" });

      // Lazy load projects
      if (route === "project") {
        this.#loadProjectsIfNeeded();
      }

      // Open VN dialogue (check getter properly)
      if (!skipDialogue && this.#vnSystem) {
        // vnSystem.isActive is a getter — access without ()
        const isVNActive = this.#vnSystem.isActive;
        if (!isVNActive) {
          setTimeout(() => this.#vnSystem.open(route), 500);
        }
      }

      // Update URL
      this.#syncURL(route);
    }

    // ════════════════════════════════════════
    // PRIVATE: VIEW & NAV UPDATES
    // ════════════════════════════════════════

    #setActiveView(route) {
      for (const view of this.#views) {
        view.classList.remove("view--active");
      }
      const target = document.getElementById(route);
      target?.classList.add("view--active");
    }

    #setActiveNav(route) {
      for (const link of this.#navLinks) {
        link.classList.remove("active");
        if (link.dataset.route === route) {
          link.classList.add("active");
          link.setAttribute("aria-current", "page");
        } else {
          link.removeAttribute("aria-current");
        }
      }
    }

    #updateTitle(route) {
      const titles = {
        home: "hayaxxdev-bit | Portfolio & Game Developer",
        maple: "Maple's Vault | hayaxxdev-bit",
        project: "Karya | hayaxxdev-bit",
        about: "Tentang | hayaxxdev-bit",
        contact: "Kontak | hayaxxdev-bit",
      };
      document.title = titles[route] || titles.home;
    }

    // ════════════════════════════════════════
    // PRIVATE: PROJECTS LAZY LOAD
    // ════════════════════════════════════════

    async #loadProjectsIfNeeded() {
      if (!this.#githubManager || !this.#uiRenderer) return;

      // Already loaded — just render
      if (this.#githubManager.isLoaded) {
        this.#uiRenderer.renderProjects("all");
        return;
      }

      this.#uiRenderer.showLoader(true);

      try {
        await this.#githubManager.fetchAllRepos();

        // Render carousel & projects
        this.#uiRenderer.renderCarousel();
        this.#uiRenderer.renderProjects("all");
        this.#uiRenderer.setupFilterTabs();

        // Update stats with lastActiveDate
        const lastActive = await this.#githubManager.fetchLastActivity();
        this.#uiRenderer.updateStats(
          this.#githubManager.repositories,
          this.#githubManager.totalCommits,
          this.#githubManager.profile,
          lastActive,
        );

        this.#audioManager?.playSFX("questClear");
      } catch (err) {
        console.error("[Navigation] Failed to load projects:", err);
        if (this.#uiRenderer.projectGrid) {
          this.#uiRenderer.projectGrid.innerHTML = `
          <p style="color:var(--accent);text-align:center;grid-column:1/-1;">
            Gagal memuat: ${escapeHtml(err.message)}
          </p>`;
        }
      } finally {
        this.#uiRenderer.showLoader(false);
      }
    }

    // ════════════════════════════════════════
    // PRIVATE: URL SYNC
    // ════════════════════════════════════════

    #syncURL(route) {
      try {
        const url = new URL(window.location);
        url.searchParams.set("route", route);
        window.history.pushState({ route }, "", url);
      } catch {
        // Fallback for older browsers
        window.history.pushState({ route }, "", `?route=${route}`);
      }
    }

    #handleInitialRoute() {
      // Check URL query param
      const params = new URLSearchParams(window.location.search);
      const route = params.get("route");

      if (route && document.getElementById(route)) {
        // Use microtask to ensure DOM is ready
        Promise.resolve().then(() => {
          this.navigate(route, { skipDialogue: true });
        });
        // Clean URL
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname,
        );
      }
    }

    // ════════════════════════════════════════
    // PRIVATE: MOBILE MENU
    // ════════════════════════════════════════

    #closeMenu() {
      this.#navMenu?.classList.remove("navbar__menu--open");
      this.#menuToggle?.setAttribute("aria-expanded", "false");
    }

    // ════════════════════════════════════════
    // PRIVATE: EVENT BINDING
    // ════════════════════════════════════════

    #bindEvents() {
      // Nav links
      for (const link of this.#navLinks) {
        link.addEventListener("click", this.#handleNavClick);
      }

      // Mobile menu toggle
      this.#menuToggle?.addEventListener("click", this.#handleMenuToggle);

      // Close on outside click
      document.addEventListener("click", this.#handleOutsideClick);

      // Keyboard shortcuts
      document.addEventListener("keydown", this.#handleKeydown);

      // Handle browser back/forward
      window.addEventListener("popstate", (e) => {
        if (e.state?.route) {
          this.navigate(e.state.route, { skipDialogue: true });
        }
      });
    }

    // ════════════════════════════════════════
    // CLEANUP
    // ════════════════════════════════════════

    destroy() {
      // Remove nav link listeners
      for (const link of this.#navLinks) {
        link.removeEventListener("click", this.#handleNavClick);
      }

      // Remove menu toggle
      this.#menuToggle?.removeEventListener("click", this.#handleMenuToggle);

      // Remove document listeners
      document.removeEventListener("click", this.#handleOutsideClick);
      document.removeEventListener("keydown", this.#handleKeydown);
    }
  }

  // ═══════════════════════════════════════════
  // PAGE LOADER v2.5.0
  // ═══════════════════════════════════════════
  class PageLoader {
    constructor() {
      this.loader = document.getElementById("pageLoader");
      this.progressFill = document.querySelector(".loader-progress__fill");
      this.progressGlow = document.querySelector(".loader-progress__glow");
      this.percentText = document.getElementById("loaderPercent");
      this.progress = 0;
      this.isComplete = false;
    }

    init() {
      if (!this.loader) return;
      this.simulateProgress();

      window.addEventListener(
        "load",
        () => {
          this.complete();
        },
        { once: true },
      );

      // Safety timeout
      setTimeout(() => {
        if (!this.isComplete) {
          console.warn("⚠️ Loader timeout - force hiding");
          this.complete();
        }
      }, CONFIG.LOADER_TIMEOUT || 5000);
    }

    simulateProgress() {
      const steps = [
        { progress: 15, delay: 200 },
        { progress: 35, delay: 400 },
        { progress: 55, delay: 600 },
        { progress: 75, delay: 800 },
        { progress: 90, delay: 1000 },
      ];

      steps.forEach((step) => {
        setTimeout(() => {
          if (!this.isComplete) {
            this.setProgress(step.progress);
          }
        }, step.delay);
      });
    }

    /**
     * Update progress bar.
     * @param {number} value - 0-100
     * @param {boolean} [allowComplete=false] - If true, allow 100%
     */
    setProgress(value, allowComplete = false) {
      // Clamp: max 90% for simulated, max 100% for complete
      this.progress = allowComplete
        ? Math.min(value, 100)
        : Math.min(value, 90);

      if (this.progressFill) {
        this.progressFill.style.width = `${this.progress}%`;
      }
      if (this.progressGlow) {
        this.progressGlow.style.left = `${this.progress}%`;
      }
      if (this.percentText) {
        this.percentText.textContent = `${Math.round(this.progress)}%`;
      }
    }

    complete() {
      if (this.isComplete) return;
      this.isComplete = true;

      // Allow progress to reach 100%
      this.setProgress(100, true);

      // Fade out animation
      setTimeout(() => {
        this.loader?.classList.add("hidden");

        // Remove from DOM after fade
        setTimeout(() => {
          this.loader?.remove();
          this.loader = null;
          console.log("🍁 Page loaded successfully!");
        }, 600);
      }, 400);
    }
  }

  // ═══════════════════════════════════════════
  // PWA HANDLER v2.6.0 - OPTIMIZED
  // ═══════════════════════════════════════════

  /**
   * Progressive Web App handler — install prompt, service worker, offline support.
   *
   * Features:
   *   - Cross-platform install flow (iOS guide, Android/Desktop beforeinstallprompt)
   *   - Service Worker registration with update detection
   *   - Offline indicator & background sync
   *   - Periodic update checker with cleanup
   *   - Analytics tracking (optional)
   *
   * @class PWAHandler
   */
  class PWAHandler {
    // ── Private fields ──────────────────────────
    #installBtn = null;
    #updateBtn = null;
    #offlineIndicator = null;
    #installToast = null;

    #deferredPrompt = null;
    #isInstalled = false;
    #isOnline = navigator.onLine;
    #isUpdateAvailable = false;
    #waitingWorker = null;
    #registration = null;

    // Timers for cleanup
    #updateInterval = null;
    #installPromptTimer = null;

    // Config
    #config;

    // ── Bound handlers (arrow functions = auto-bound) ──
    #handleConnectionChange = () => {
      this.#isOnline = navigator.onLine;
      if (this.#isOnline) {
        console.log("📡 Back online!");
        this.#hideOfflineIndicator();
        this.#syncData();
      } else {
        console.log("📡 Offline mode");
        this.#showOfflineIndicator();
        this.#trackEvent("pwa", "offline_mode");
      }
    };

    #handleUpdateFound = () => {
      const newWorker = this.#registration?.installing;
      if (!newWorker) return;

      console.log("📱 New service worker found...");

      newWorker.addEventListener("statechange", () => {
        if (
          newWorker.state === "installed" &&
          navigator.serviceWorker.controller
        ) {
          this.#onUpdateReady(newWorker);
        }
      });
    };

    // ════════════════════════════════════════
    // CONSTRUCTOR
    // ════════════════════════════════════════

    /**
     * @param {object} [options]
     * @param {number} [options.installPromptDelay=30000]
     * @param {number} [options.installPromptMinVisits=2]
     * @param {number} [options.updateCheckInterval=3600000]
     * @param {boolean} [options.enableAnalytics=true]
     */
    constructor(options = {}) {
      // Cache DOM
      this.#installBtn = document.getElementById("installApp");
      this.#updateBtn = document.getElementById("updateApp");
      this.#offlineIndicator = document.getElementById("offlineIndicator");
      this.#installToast = document.getElementById("installToast");

      // Config with defaults
      this.#config = {
        installPromptDelay: 30_000,
        installPromptMinVisits: 2,
        updateCheckInterval: 3_600_000,
        cacheName: "maple-portfolio-v2",
        enableAnalytics: true,
        platform: this.#detectPlatform(),
        ...options,
      };

      // Init
      this.#init();
    }

    // ════════════════════════════════════════
    // PUBLIC API
    // ════════════════════════════════════════

    get isInstalled() {
      return this.#isInstalled;
    }
    get isOnline() {
      return this.#isOnline;
    }

    /** Trigger the install prompt manually */
    async install() {
      if (!this.#deferredPrompt) {
        if (this.#config.platform.name === "ios") {
          this.showIOSInstallGuide();
        } else {
          this.showManualInstallGuide();
        }
        return;
      }

      try {
        await this.#deferredPrompt.prompt();
        const { outcome } = await this.#deferredPrompt.userChoice;

        if (outcome === "accepted") {
          console.log("🍁 User accepted install");
          this.#trackEvent("pwa", "install_accepted");
        } else {
          console.log("🍂 User dismissed install");
          this.#trackEvent("pwa", "install_dismissed");
          localStorage.setItem("maple_install_dismissed", String(Date.now()));
        }

        this.#deferredPrompt = null;
        this.#hideInstallUI();
      } catch (err) {
        console.error("Install failed:", err.message);
      }
    }

    /** Apply waiting service worker update */
    updateApp() {
      if (!this.#waitingWorker) return;
      console.log("📱 Applying update...");
      this.#waitingWorker.postMessage({ type: "SKIP_WAITING" });
      this.#trackEvent("pwa", "update_applied");
      window.location.reload();
    }

    /** Get current PWA status */
    getStatus() {
      return {
        isInstalled: this.#isInstalled,
        isOnline: this.#isOnline,
        isUpdateAvailable: this.#isUpdateAvailable,
        platform: this.#config.platform,
        displayMode: window.matchMedia("(display-mode: standalone)").matches
          ? "standalone"
          : "browser",
      };
    }

    /** Clear all caches via service worker */
    async clearCache() {
      if (!this.#registration) return;
      try {
        this.#registration.active?.postMessage({ type: "CLEAR_CACHE" });
        console.log("📱 Cache clear requested");
      } catch (err) {
        console.error("Clear cache failed:", err.message);
      }
    }

    /** Unregister service worker and clear caches */
    async unregister() {
      if (!this.#registration) return;
      try {
        await this.#registration.unregister();
        const keys = await caches.keys();
        await Promise.all(keys.map((name) => caches.delete(name)));
        this.#registration = null;
        console.log("📱 Service Worker unregistered");
      } catch (err) {
        console.error("Unregister failed:", err.message);
      }
    }

    /** Cleanup all listeners, timers, and intervals */
    destroy() {
      // Remove event listeners
      window.removeEventListener("online", this.#handleConnectionChange);
      window.removeEventListener("offline", this.#handleConnectionChange);

      if (this.#registration) {
        this.#registration.removeEventListener(
          "updatefound",
          this.#handleUpdateFound,
        );
      }

      // Clear intervals & timers
      if (this.#updateInterval) {
        clearInterval(this.#updateInterval);
        this.#updateInterval = null;
      }
      if (this.#installPromptTimer) {
        clearTimeout(this.#installPromptTimer);
        this.#installPromptTimer = null;
      }

      this.#hideInstallUI();
      this.#hideOfflineIndicator();
      console.log("📱 PWA Handler destroyed");
    }

    // ════════════════════════════════════════
    // PRIVATE: INIT
    // ════════════════════════════════════════

    #init() {
      console.log("📱 Initializing PWA Handler...");

      this.#checkInstallStatus();
      this.#bindInstallEvents();
      this.#registerServiceWorker();
      this.#bindConnectionEvents();
      this.#setupUpdateChecker();
      this.#trackPWAUsage();
      this.#scheduleInstallPrompt();
      this.#applyPlatformOptimizations();

      console.log(`📱 Platform: ${this.#config.platform.name}`);
    }

    // ════════════════════════════════════════
    // PRIVATE: PLATFORM
    // ════════════════════════════════════════

    #detectPlatform() {
      const ua = navigator.userAgent || "";

      if (/iPad|iPhone|iPod/.test(ua) && !window.MSStream) {
        return {
          name: "ios",
          isStandalone: !!window.navigator.standalone,
          supportsBeforeInstallPrompt: false,
          installGuide: "Tap Share → 'Add to Home Screen' → 'Add'",
          icon: "📲",
          color: "#007AFF",
        };
      }

      if (/android/i.test(ua)) {
        return {
          name: "android",
          isStandalone: window.matchMedia("(display-mode: standalone)").matches,
          supportsBeforeInstallPrompt: true,
          installGuide: "Tap 'Install' or use browser menu",
          icon: "🤖",
          color: "#3DDC84",
        };
      }

      return {
        name: "desktop",
        isStandalone: window.matchMedia("(display-mode: standalone)").matches,
        supportsBeforeInstallPrompt: true,
        installGuide: "Click the install icon in the address bar",
        icon: "💻",
        color: "#a855f7",
      };
    }

    #applyPlatformOptimizations() {
      document.body.classList.add(`platform--${this.#config.platform.name}`);
      document.body.classList.add(
        this.#isInstalled ? "pwa--installed" : "pwa--browser",
      );

      // iOS: Don't override existing viewport meta, just ensure it exists
      if (
        this.#config.platform.name === "ios" &&
        !document.querySelector('meta[name="apple-mobile-web-app-capable"]')
      ) {
        const meta = document.createElement("meta");
        meta.name = "apple-mobile-web-app-capable";
        meta.content = "yes";
        document.head.appendChild(meta);
      }

      if (
        this.#config.platform.name === "android" &&
        !document.querySelector('meta[name="theme-color"]')
      ) {
        const meta = document.createElement("meta");
        meta.name = "theme-color";
        meta.content = "#050308";
        document.head.appendChild(meta);
      }
    }

    // ════════════════════════════════════════
    // PRIVATE: INSTALL
    // ════════════════════════════════════════

    #bindInstallEvents() {
      window.addEventListener("beforeinstallprompt", (e) => {
        e.preventDefault();
        this.#deferredPrompt = e;
        console.log("📲 Install prompt available");
        this.#trackEvent("pwa", "install_prompt_available");
        if (!this.#isInstalled) this.#showInstallUI();
      });

      window.addEventListener("appinstalled", () => {
        this.#isInstalled = true;
        this.#deferredPrompt = null;
        console.log("✅ App installed!");
        this.#trackEvent("pwa", "app_installed", {
          platform: this.#config.platform.name,
        });
        this.#hideInstallUI();
        this.#showToast(
          "🎉 App Terinstall!",
          "Maple's Portfolio siap digunakan!",
          "success",
        );
      });
    }

    async #checkInstallStatus() {
      if (window.matchMedia("(display-mode: standalone)").matches) {
        this.#isInstalled = true;
        this.#hideInstallUI();
        return;
      }

      if ("getInstalledRelatedApps" in navigator) {
        try {
          const apps = await navigator.getInstalledRelatedApps();
          if (apps.length > 0) {
            this.#isInstalled = true;
            this.#hideInstallUI();
          }
        } catch {}
      }
    }

    #scheduleInstallPrompt() {
      // Check dismissal
      const dismissed = localStorage.getItem("maple_install_dismissed");
      if (dismissed) {
        const daysSince = (Date.now() - parseInt(dismissed)) / 86_400_000;
        if (daysSince < 7) return;
      }

      // Check visits
      const visits = parseInt(localStorage.getItem("maple_visit_count") || "0");
      if (visits < this.#config.installPromptMinVisits) return;

      // Schedule
      this.#installPromptTimer = setTimeout(() => {
        if (!this.#isInstalled && !this.#deferredPrompt) {
          this.#showInstallToast();
        }
      }, this.#config.installPromptDelay);
    }

    // ════════════════════════════════════════
    // PRIVATE: UI
    // ════════════════════════════════════════

    #showInstallUI() {
      if (!this.#installBtn) return;
      this.#installBtn.style.display = "flex";
      this.#installBtn.classList.add("install-btn--show");
      this.#installBtn.addEventListener("click", () => this.install(), {
        once: true,
      });
    }

    #hideInstallUI() {
      if (!this.#installBtn) return;
      this.#installBtn.classList.remove("install-btn--show");
      this.#installBtn.classList.add("install-btn--hide");
      setTimeout(() => {
        this.#installBtn.style.display = "none";
      }, 500);
    }

    #showInstallToast() {
      if (!this.#installToast) return;
      this.#installToast.classList.add("install-toast--show");

      const actionBtn = this.#installToast.querySelector(
        ".install-toast__action",
      );
      actionBtn?.addEventListener(
        "click",
        () => {
          this.install();
          this.#installToast?.classList.remove("install-toast--show");
        },
        { once: true },
      );

      setTimeout(() => {
        this.#installToast?.classList.remove("install-toast--show");
      }, 10_000);
    }

    showIOSInstallGuide() {
      this.#showToast(
        "📲 Cara Install di iOS",
        "Tap Share → 'Add to Home Screen' → 'Add'",
        "info",
        8_000,
      );
    }

    showManualInstallGuide() {
      this.#showToast(
        "📲 Cara Install",
        this.#config.platform.installGuide,
        "info",
        6_000,
      );
    }

    #showToast(title, message, type = "info", duration = 5_000) {
      const toast = document.createElement("div");
      toast.className = `pwa-toast pwa-toast--${type}`;
      toast.setAttribute("role", "status");
      toast.setAttribute("aria-live", "polite");

      // Build safely (no inline onclick)
      const icon = document.createElement("div");
      icon.className = "pwa-toast__icon";
      icon.textContent = this.#config.platform.icon;

      const content = document.createElement("div");
      content.className = "pwa-toast__content";
      content.innerHTML = `
      <span class="pwa-toast__title">${escapeHtml(title)}</span>
      <span class="pwa-toast__message">${escapeHtml(message)}</span>`;

      const closeBtn = document.createElement("button");
      closeBtn.className = "pwa-toast__close";
      closeBtn.textContent = "✕";
      closeBtn.setAttribute("aria-label", "Tutup notifikasi");
      closeBtn.addEventListener("click", () => {
        toast.classList.remove("pwa-toast--visible");
        setTimeout(() => toast.remove(), 500);
      });

      toast.appendChild(icon);
      toast.appendChild(content);
      toast.appendChild(closeBtn);
      document.body.appendChild(toast);

      requestAnimationFrame(() => toast.classList.add("pwa-toast--visible"));

      if (duration > 0) {
        setTimeout(() => {
          if (toast.isConnected) {
            toast.classList.remove("pwa-toast--visible");
            setTimeout(() => toast.remove(), 500);
          }
        }, duration);
      }
    }

    // ════════════════════════════════════════
    // PRIVATE: SERVICE WORKER
    // ════════════════════════════════════════

    async #registerServiceWorker() {
      if (!("serviceWorker" in navigator)) {
        console.warn("📱 Service Worker not supported");
        return;
      }

      try {
        this.#registration = await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
        });
        console.log("📱 SW registered:", this.#registration.scope);

        this.#registration.addEventListener(
          "updatefound",
          this.#handleUpdateFound,
        );

        if (this.#registration.waiting) {
          this.#onUpdateReady(this.#registration.waiting);
        }

        navigator.serviceWorker.addEventListener("message", (e) => {
          if (e.data?.type === "CACHE_UPDATED") console.log("📱 Cache updated");
          if (e.data?.type === "OFFLINE_READY")
            this.#trackEvent("pwa", "offline_ready");
        });
      } catch (err) {
        console.error("📱 SW registration failed:", err.message);
      }
    }

    #onUpdateReady(worker) {
      this.#waitingWorker = worker;
      this.#isUpdateAvailable = true;
      console.log("📱 Update available!");
      this.#showUpdateUI();
      this.#trackEvent("pwa", "update_available");
    }

    #showUpdateUI() {
      if (!this.#updateBtn) return;
      this.#updateBtn.style.display = "flex";
      this.#updateBtn.classList.add("update-btn--show");
      this.#updateBtn.addEventListener("click", () => this.updateApp(), {
        once: true,
      });
      this.#showToast(
        "🔄 Update Tersedia!",
        "Versi baru siap diinstall",
        "info",
        0,
      );
    }

    #setupUpdateChecker() {
      this.#updateInterval = setInterval(() => {
        this.#registration?.update().catch(() => {});
      }, this.#config.updateCheckInterval);

      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") {
          this.#registration?.update().catch(() => {});
        }
      });
    }

    // ════════════════════════════════════════
    // PRIVATE: OFFLINE
    // ════════════════════════════════════════

    #bindConnectionEvents() {
      window.addEventListener("online", this.#handleConnectionChange);
      window.addEventListener("offline", this.#handleConnectionChange);
      this.#handleConnectionChange(); // Initial check
    }

    #showOfflineIndicator() {
      this.#offlineIndicator?.classList.add("offline-indicator--visible");
      this.#showToast(
        "📡 Offline Mode",
        "Beberapa fitur mungkin terbatas.",
        "warning",
        4_000,
      );
    }

    #hideOfflineIndicator() {
      this.#offlineIndicator?.classList.remove("offline-indicator--visible");
    }

    async #syncData() {
      if (!("serviceWorker" in navigator)) return;
      try {
        const reg = this.#registration || (await navigator.serviceWorker.ready);
        if ("sync" in reg) {
          await reg.sync.register("sync-github-data");
          console.log("📱 Background sync registered");
        }
      } catch {}
    }

    // ════════════════════════════════════════
    // PRIVATE: ANALYTICS
    // ════════════════════════════════════════

    #trackEvent(category, action, data = {}) {
      if (!this.#config.enableAnalytics) return;

      if (window.gtag) {
        window.gtag("event", action, {
          event_category: category,
          event_label: JSON.stringify(data),
          ...data,
        });
      }

      // Dev logging (always log in development)
      if (
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1"
      ) {
        console.log(`📊 [PWA] ${category}/${action}:`, data);
      }
    }

    #trackPWAUsage() {
      const mode = window.matchMedia("(display-mode: standalone)").matches
        ? "standalone"
        : "browser";
      this.#trackEvent("pwa", "display_mode", { mode });
      this.#trackEvent("pwa", "platform", {
        platform: this.#config.platform.name,
        isInstalled: this.#isInstalled,
      });

      try {
        const visits = parseInt(
          localStorage.getItem("maple_visit_count") || "0",
        );
        localStorage.setItem("maple_visit_count", String(visits + 1));
      } catch {}
    }
  }
  // ═══════════════════════════════════════════
  // GUARD: Prevent double initialization
  // ═══════════════════════════════════════════
  let _appInitialized = false;
  let _appInstance = null;

  // ═══════════════════════════════════════════
  // SVG PLACEHOLDER UTILITIES
  // ═══════════════════════════════════════════

  /**
   * Pure utility functions for generating SVG data URIs.
   * All methods are stateless — no `this` needed.
   */
  const SVGUtils = {
    /**
     * Adjust hex color brightness by a percentage.
     * @param {string} hex - Hex color (e.g., "#ff0000")
     * @param {number} percent - Adjustment (-255 to +255)
     * @returns {string} Adjusted hex color
     */
    adjustColor(hex, percent) {
      const num = parseInt(hex.replace("#", ""), 16);
      const clamp = (val) => Math.min(255, Math.max(0, val));
      const r = clamp((num >> 16) + percent);
      const g = clamp(((num >> 8) & 0xff) + percent);
      const b = clamp((num & 0xff) + percent);
      return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
    },

    /**
     * Escape XML special characters.
     * @param {string} str - Raw string
     * @returns {string} XML-safe string
     */
    escapeXml(str) {
      const entities = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&apos;",
      };
      return String(str).replace(/[&<>"']/g, (c) => entities[c]);
    },

    /**
     * Convert SVG markup to a data URI.
     * @param {string} svg - Raw SVG markup
     * @returns {string} data:image/svg+xml URI
     */
    svgToDataUri(svg) {
      const cleaned = svg.replace(/\s+/g, " ").trim();
      return `data:image/svg+xml,${encodeURIComponent(cleaned)}`;
    },

    /**
     * Generate a card art placeholder (full-body character card).
     */
    generateCardArtPlaceholder(icon, bgColor, width, height) {
      const darker1 = this.adjustColor(bgColor, -10);
      const darker2 = this.adjustColor(bgColor, -20);
      const fontSize = Math.min(width, height) * 0.35;

      return this.svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
        <defs>
          <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${bgColor}"/>
            <stop offset="55%" stop-color="${darker1}"/>
            <stop offset="100%" stop-color="${darker2}"/>
          </linearGradient>
        </defs>
        <rect width="${width}" height="${height}" fill="url(#bg)"/>
        <text x="50%" y="52%" text-anchor="middle" font-size="${fontSize}" opacity="0.6">${icon}</text>
      </svg>`);
    },

    /**
     * Generate a circular profile picture placeholder.
     */
    generatePfpPlaceholder(
      icon,
      bgColor,
      width,
      height,
      textColor = "#a78bfa",
    ) {
      return this.svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
        <rect fill="${bgColor}" width="${width}" height="${height}" rx="${width / 2}"/>
        <text fill="${textColor}" x="50%" y="55%" text-anchor="middle" font-size="${width * 0.43}">${icon}</text>
      </svg>`);
    },

    /**
     * Generate an initial-based avatar placeholder (e.g., "NK").
     */
    generateInitialAvatar(
      initial,
      bgColor,
      width,
      height,
      textColor = "#c9a84c",
    ) {
      const fontSize = Math.floor(Math.min(width, height) * 0.4);
      return this.svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
        <rect fill="${bgColor}" width="${width}" height="${height}" rx="${width / 2}"/>
        <text fill="${textColor}" x="50%" y="50%" text-anchor="middle" dy=".3em" 
              font-size="${fontSize}px" font-family="sans-serif" font-weight="bold">
          ${this.escapeXml(initial)}
        </text>
      </svg>`);
    },
  };

  // ═══════════════════════════════════════════
  // IMAGE FALLBACK HANDLER
  // ═══════════════════════════════════════════

  /**
   * Handles image load errors by replacing with SVG placeholders.
   * Uses WeakSet to prevent infinite fallback loops.
   */
  class ImageFallbackHandler {
    /** @type {WeakSet<HTMLImageElement>} */
    #handled = new WeakSet();

    /**
     * Attach error handlers to all image types.
     */
    setupAll() {
      this.#setupCharacterCards();
      this.#setupAboutContact();
      this.#setupGenericImages();
    }

    /**
     * Replace an image with an appropriate SVG placeholder.
     * @param {HTMLImageElement} img
     * @param {'card-art'|'pfp'|'initial-avatar'} type
     * @param {object} [opts]
     */
    #replace(img, type, opts = {}) {
      if (this.#handled.has(img)) return;
      this.#handled.add(img);

      let src;
      switch (type) {
        case "card-art":
          src = SVGUtils.generateCardArtPlaceholder(
            opts.icon || "🛡️",
            opts.bg || "#120a16",
            opts.w || 320,
            opts.h || 448,
          );
          break;
        case "pfp":
          src = SVGUtils.generatePfpPlaceholder(
            opts.icon || "🍁",
            opts.bg || "#120a16",
            opts.w || 58,
            opts.h || 58,
            opts.textColor,
          );
          break;
        case "initial-avatar":
        default:
          src = SVGUtils.generateInitialAvatar(
            opts.initial || "?",
            opts.bg || "#333",
            opts.w || 100,
            opts.h || 100,
            opts.textColor,
          );
      }

      img.src = src;
      img.onerror = null;
    }

    #setupCharacterCards() {
      document
        .querySelectorAll(".char-card img[data-fallback-icon]")
        .forEach((img) => {
          img.addEventListener(
            "error",
            () => {
              const isPfp = !!img.closest(".card-pfp");
              this.#replace(img, isPfp ? "pfp" : "card-art", {
                icon: img.dataset.fallbackIcon,
                bg: img.dataset.fallbackBg,
                w: img.width || 320,
                h: img.height || 448,
              });
            },
            { once: true },
          );
        });
    }

    #setupAboutContact() {
      const selectors = [".about__img", ".contact-card__avatar"];
      selectors.forEach((sel) => {
        const img = document.querySelector(sel);
        if (!img) return;
        img.addEventListener(
          "error",
          () => {
            this.#replace(img, "initial-avatar", {
              initial: img.dataset.fallbackInitial || "NK",
              bg: img.dataset.fallbackBg || "#141414",
              w: img.width || 160,
              h: img.height || 160,
              textColor: img.dataset.fallbackColor,
            });
          },
          { once: true },
        );
      });
    }

    /**
     * Generic fallback for any image not already handled.
     * Only targets images without existing fallback attributes.
     */
    #setupGenericImages() {
      document
        .querySelectorAll(
          "img:not([data-fallback-icon]):not(.about__img):not(.contact-card__avatar):not(.vn-avatar-img)",
        )
        .forEach((img) => {
          img.addEventListener(
            "error",
            () => {
              this.#replace(img, "initial-avatar", {
                initial: "?",
                bg: "#333",
                w: img.width || 100,
                h: img.height || 100,
              });
            },
            { once: true },
          );
        });
    }
  }

  // ═══════════════════════════════════════════
  // CHARACTER CARD CLICK HANDLERS
  // ═══════════════════════════════════════════

  /**
   * Make character cards clickable — navigates to data-target URL.
   * Supports both click and keyboard (Enter/Space).
   */
  function setupCharacterCards() {
    document.querySelectorAll(".char-card[data-target]").forEach((card) => {
      const target = card.dataset.target;
      if (!target) return;

      const navigate = () => {
        window.location.href = target;
      };

      card.addEventListener("click", (e) => {
        // Don't navigate if user clicked an anchor inside the card
        if (!e.target.closest("a")) navigate();
      });

      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          navigate();
        }
      });
    });
  }

  // ═══════════════════════════════════════════
  // SKILL BAR ANIMATION (INTERSECTION OBSERVER)
  // ═══════════════════════════════════════════

  /**
   * Animate skill bar widths when they scroll into view.
   */
  function setupSkillBarAnimation() {
    const bars = document.querySelectorAll(".skill-bar__fill[data-width]");
    if (!bars.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const bar = entry.target;
            const width = bar.dataset.width || 0;
            // CSS transition handles the animation
            bar.style.width = `${width}%`;
            bar.setAttribute("aria-valuenow", width);
            observer.unobserve(bar);
          }
        }
      },
      { threshold: 0.3 },
    );

    bars.forEach((bar) => observer.observe(bar));
  }

  // ═══════════════════════════════════════════
  // LAZY LOADING IMAGES
  // ═══════════════════════════════════════════

  /**
   * Initialize lazy loading for images using IntersectionObserver.
   * Falls back to immediate loading for unsupported browsers.
   */
  function initLazyLoading() {
    // Select all lazy images, exclude VN dialogue avatars (always eager)
    const lazyImages = document.querySelectorAll(
      'img[loading="lazy"]:not(.vn-avatar-img):not(.vn-avatar-emotion), ' +
        "img[data-src]:not(.vn-avatar-img):not(.vn-avatar-emotion)",
    );

    // Filter to only IMG elements (safety)
    const validImages = [...lazyImages].filter((el) => el.tagName === "IMG");

    if (!validImages.length) {
      console.log("📸 No lazy images found");
      return;
    }

    console.log(`📸 Found ${validImages.length} lazy images`);

    // Fallback: load all immediately
    if (!("IntersectionObserver" in window)) {
      validImages.forEach((img) => {
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute("data-src");
        }
        if (img.dataset.srcset) {
          img.srcset = img.dataset.srcset;
          img.removeAttribute("data-srcset");
        }
      });
      return;
    }

    // IntersectionObserver-based lazy loading
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute("data-src");
            }
            if (img.dataset.srcset) {
              img.srcset = img.dataset.srcset;
              img.removeAttribute("data-srcset");
            }
            observer.unobserve(img);
          }
        }
      },
      {
        rootMargin: "200px 0px", // Start loading 200px before visible
        threshold: 0.01,
      },
    );

    validImages.forEach((img) => observer.observe(img));
  }

  /**
   * Make character cards clickable — navigates to data-target URL.
   * Supports click (with anchor exclusion) and keyboard (Enter/Space).
   */
  function setupCharacterCards() {
    const cards = document.querySelectorAll(".char-card[data-target]");

    for (const card of cards) {
      const target = card.dataset.target;
      if (!target) continue;

      const navigate = () => {
        window.location.href = target;
      };

      // Click — ignore if user clicked an <a> inside the card
      card.addEventListener("click", (e) => {
        if (!e.target.closest("a")) navigate();
      });

      // Keyboard — Enter or Space
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          navigate();
        }
      });
    }
  }

  // ═══════════════════════════════════════════
  // SKILL BAR ANIMATION
  // ═══════════════════════════════════════════

  /**
   * Animate skill bar widths when they scroll into view.
   * Uses IntersectionObserver + CSS transition for smooth animation.
   */
  function setupSkillBarAnimation() {
    const bars = document.querySelectorAll(".skill-bar__fill[data-width]");
    if (!bars.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const bar = entry.target;
            const width = bar.dataset.width || 0;

            // CSS transition handles the animation — just set the final width
            bar.style.width = `${width}%`;
            bar.setAttribute("aria-valuenow", width);

            observer.unobserve(bar);
          }
        }
      },
      { threshold: 0.3 },
    );

    for (const bar of bars) {
      observer.observe(bar);
    }
  }

  // ═══════════════════════════════════════════
  // LAZY LOADING IMAGES
  // ═══════════════════════════════════════════

  /**
   * Initialize lazy loading for images using IntersectionObserver.
   * Falls back to immediate loading for browsers without support.
   */
  function initLazyLoading() {
    // Select all lazy-loadable images (exclude VN dialogue avatars)
    const lazyImages = document.querySelectorAll(
      'img[loading="lazy"]:not(.vn-avatar-img):not(.vn-avatar-emotion), ' +
        "img[data-src]:not(.vn-avatar-img):not(.vn-avatar-emotion)",
    );

    // Safety: filter to only <img> elements
    const validImages = [...lazyImages].filter((el) => el.tagName === "IMG");

    if (!validImages.length) {
      console.log("📸 No lazy images found");
      return;
    }

    console.log(`📸 Found ${validImages.length} lazy images`);

    // Fallback: load all immediately
    if (!("IntersectionObserver" in window)) {
      for (const img of validImages) {
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute("data-src");
        }
        if (img.dataset.srcset) {
          img.srcset = img.dataset.srcset;
          img.removeAttribute("data-srcset");
        }
      }
      return;
    }

    // IntersectionObserver-based lazy loading
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const img = entry.target;

            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute("data-src");
            }
            if (img.dataset.srcset) {
              img.srcset = img.dataset.srcset;
              img.removeAttribute("data-srcset");
            }

            observer.unobserve(img);
          }
        }
      },
      {
        rootMargin: "200px 0px", // Start loading 200px before visible
        threshold: 0.01,
      },
    );

    for (const img of validImages) {
      observer.observe(img);
    }
  }
  // ═══════════════════════════════════════════
  // MAIN INITIALIZATION (SINGLE ENTRY POINT)
  // ═══════════════════════════════════════════
  function initializeApp() {
    console.log("🍁 Maple's Portfolio v2.5.0 initializing...");

    // ── Step 1: DOM-dependent initializations (synchronous) ──
    setupCharacterCards();
    setupSkillBarAnimation();

    // Setup image fallbacks (consolidated)
    const imageFallback = new ImageFallbackHandler();
    imageFallback.setupAll();

    // ── Step 2: Lazy loading ──
    initLazyLoading();

    // ── Step 3: Footer year ──
    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // ── Step 4: Initialize core systems ──
    const pageLoader = new PageLoader();
    pageLoader.init();

    const audioManager = new AudioManager();
    const achievementSystem = new AchievementSystem();
    const vnSystem = new AIVNDialogueSystem();
    const guideSystem = new GuideSystem();
    const githubManager = new GitHubManager(CONFIG.USERNAME);
    const uiRenderer = new UIRenderer();
    const navigation = new NavigationSystem();
    const pwaHandler = new PWAHandler();

    // ── Step 5: Wire up dependencies ──
    achievementSystem.setAudioManager(audioManager);
    vnSystem.setAudioManager(audioManager);
    vnSystem.setAchievementSystem(achievementSystem);
    guideSystem.setVNDialogue(vnSystem);
    guideSystem.setAudioManager(audioManager);
    guideSystem.setAchievementSystem(achievementSystem);
    uiRenderer.setGitHubManager(githubManager);
    uiRenderer.setAudioManager(audioManager);
    navigation.setVNDialogue(vnSystem);
    navigation.setAudioManager(audioManager);
    navigation.setGitHubManager(githubManager);
    navigation.setUIRenderer(uiRenderer);

    // ── Step 6: Build public API ──
    const publicAPI = {
      audioManager,
      achievementSystem,
      vnSystem,
      guideSystem,
      githubManager,
      uiRenderer,
      navigation,
      pwaHandler,
      playSFX: (type) => audioManager?.playSFX(type),
      triggerVNDialogue: (route, customText) =>
        vnSystem?.open(route, customText),
      closeVNDialogue: () => vnSystem?.close(),
      nextVNDialogue: () => vnSystem?.next(),
      navigateTo: (route, skipDialogue) =>
        navigation?.navigate(route, skipDialogue),
      startGuide: () => guideSystem?.start(),
      stopGuide: () => guideSystem?.stop(),
      loadProjects: () => navigation?.loadProjects(),
      refreshStats: async () => {
        try {
          console.log("🔄 Manual refresh requested...");

          // ✅ Force refresh semua data
          await githubManager.fetchAllRepos({ forceRefresh: true });
          await githubManager.fetchTotalCommits();
          const userData = await githubManager.fetchUserProfile();

          uiRenderer.updateStats(
            githubManager.repositories,
            githubManager.totalCommits,
            userData,
          );
          uiRenderer.renderCarousel();
          uiRenderer.renderProjects("all");

          audioManager?.playSFX("questClear");
          console.log("📊 Stats refreshed!");
          return true;
        } catch (error) {
          console.error("Refresh failed:", error);
          return false;
        }
      },
      clearCache: () => githubManager?.clearCache(),
      getMemory: () => vnSystem?.userMemory || {},
      getAchievements: () => achievementSystem?.achievements || new Map(),
    };

    // ── Step 7: Expose to window ──
    Object.assign(window, publicAPI);
    window.MaplePortfolio = {
      publicAPI,
      SVGUtils,
      ImageFallbackHandler,
      AudioManager,
      AchievementSystem,
      GitHubManager,
      UIRenderer,
      CONFIG,
    };

    // ── Step 8: Load portfolio data ──
    loadPortfolioData(
      audioManager,
      achievementSystem,
      githubManager,
      uiRenderer,
    );

    // ── Step 9: Setup event listeners ──
    setupEventListeners(audioManager, guideSystem, githubManager, publicAPI);

    // ── Step 10: Log ready ──
    console.log("🍁 Maple's Portfolio v2.5.0 initialized!");
    console.log("🤖 AI Dialogue System active");
    console.log("📄 Multi-source README fetching enabled");
    console.log("🌐 GitHub Pages preview for repos with Pages");
    console.log("📋 README preview for repos without Pages");
    console.log("🛡️ System ready!");
    console.log(
      "⌨️ Shortcuts: Alt+G (Guide), Alt+M (Music), Alt+C (Clear Cache), Alt+R (Refresh Stats)",
    );
  }

  // ═══════════════════════════════════════════
  // LOAD PORTFOLIO DATA
  // ═══════════════════════════════════════════
  // ═══════════════════════════════════════════
  // PERBAIKAN 4: Update loadPortfolioData
  // ═══════════════════════════════════════════
  async function loadPortfolioData(
    audioManager,
    achievementSystem,
    githubManager,
    uiRenderer,
  ) {
    uiRenderer.setupFilterTabs();
    uiRenderer.renderSkeleton(3);
    uiRenderer.showLoader(true);

    if (!localStorage.getItem("maple_first_visit")) {
      localStorage.setItem("maple_first_visit", "1");
      setTimeout(() => achievementSystem?.unlock("first_visit"), 1500);
    }

    try {
      console.log("🚀 Loading portfolio data...");

      const urlParams = new URLSearchParams(window.location.search);
      const forceRefresh =
        urlParams.has("refresh") ||
        urlParams.has("clear") ||
        urlParams.has("force");

      if (forceRefresh) {
        console.log("🔄 Force refresh requested - clearing cache...");
        githubManager.clearCache();
        if (window.history?.replaceState) {
          const newUrl = window.location.pathname;
          window.history.replaceState({}, document.title, newUrl);
        }
      }

      // Fetch repos
      const repos = await githubManager.fetchAllRepos({ forceRefresh });
      console.log(`📦 Got ${repos.length} repositories`);

      // Fetch total commits
      if (forceRefresh) {
        githubManager.cache.remove(`commits_${githubManager.username}`);
      }
      const totalCommits = await githubManager.fetchTotalCommits();
      console.log(`📊 Total commits: ${totalCommits}+`);

      // Fetch user profile
      if (forceRefresh) {
        githubManager.cache.remove(`profile_${githubManager.username}`);
      }
      const userData = await githubManager.fetchUserProfile();
      console.log(`👤 User: ${userData?.name || userData?.login || "Unknown"}`);

      // ⚠️ TAMBAHKAN: Fetch last activity
      const lastActiveDate = await githubManager.fetchLastActivity();
      console.log(
        `🕐 Last active: ${lastActiveDate ? timeAgo(lastActiveDate) : "N/A"}`,
      );

      // Update stats
      uiRenderer.updateStats(repos, totalCommits, userData, lastActiveDate);

      // Animate stats
      await uiRenderer.animateStats(githubManager);

      // Render carousel & projects
      uiRenderer.renderCarousel();
      uiRenderer.renderProjects("all");

      console.log("✅ Portfolio loaded successfully!");
      console.log(`📊 Total repos: ${repos.length}`);
      console.log(`⭐ Total stars: ${githubManager.totalStars || 0}`);
      console.log(`📝 Total commits: ${totalCommits}+`);
      console.log(
        `📅 Active since: ${userData?.created_at ? new Date(userData.created_at).getFullYear() : "N/A"}`,
      );
      console.log(
        `🕐 Last active: ${lastActiveDate ? timeAgo(lastActiveDate) : "N/A"}`,
      );
      console.log(
        `📄 Repos with README: ${repos.filter((r) => r.readme).length}`,
      );
      console.log(
        `🌐 Repos with Pages: ${repos.filter((r) => r.has_pages || r.homepage).length}`,
      );
    } catch (error) {
      console.error("❌ Failed to load portfolio:", error);
      uiRenderer.renderError(
        "Gagal menghubungkan ke server. Coba lagi nanti.",
        () => window.location.reload(),
      );

      ["repoCount", "starCount", "commitCount"].forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.textContent = "—";
      });
    } finally {
      uiRenderer.showLoader(false);
    }
  }
  // ═══════════════════════════════════════════
  // SETUP EVENT LISTENERS
  // ═══════════════════════════════════════════
  function setupEventListeners(
    audioManager,
    guideSystem,
    githubManager,
    publicAPI,
  ) {
    // Navbar hover SFX
    document
      .querySelectorAll(".nav-link:not(.nav-link--cta)")
      .forEach((link) => {
        link.addEventListener("mouseenter", () => {
          if (!link.classList.contains("active")) {
            audioManager?.playSFX("menuSelect");
          }
        });
      });

    // BGM Volume Control via scroll
    const bgmPlayer = document.querySelector(".bgm-player");
    if (bgmPlayer && audioManager) {
      bgmPlayer.addEventListener(
        "wheel",
        (e) => {
          e.preventDefault();
          const delta = e.deltaY > 0 ? -0.05 : 0.05;
          const newVolume = Math.max(
            0,
            Math.min(1, (audioManager.volume || 0.5) + delta),
          );
          audioManager.setVolume(newVolume);
        },
        { passive: false },
      );

      bgmPlayer.addEventListener("dblclick", () => {
        audioManager.setVolume(0.5);
        audioManager.playSFX("menuSelect");
      });
    }

    // Keyboard Shortcuts
    window.addEventListener("keydown", (e) => {
      const tag = document.activeElement?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

      switch (true) {
        case e.altKey && e.key === "g":
          e.preventDefault();
          guideSystem?.toggle();
          break;

        case e.altKey && e.key === "m":
          e.preventDefault();
          audioManager?.toggle();
          break;

        case e.altKey && e.key === "c":
          e.preventDefault();
          githubManager?.clearCache();
          audioManager?.playSFX("questClear");
          break;

        case e.altKey && e.key === "r":
          e.preventDefault();
          publicAPI?.refreshStats();
          break;

        case e.key === "Escape":
          publicAPI?.closeVNDialogue();
          break;
      }
    });

    // // Service Worker Registration
    // if ("serviceWorker" in navigator) {
    //   window.addEventListener("load", () => {
    //     navigator.serviceWorker
    //       .register("/sw.js")
    //       .then((reg) => {
    //         console.log("📦 Service Worker registered:", reg.scope);
    //       })
    //       .catch((err) => {
    //         console.warn("⚠️ Service Worker registration failed:", err.message);
    //       });
    //   });
    // }

    // Online/Offline events
    window.addEventListener("online", () => {
      console.log("🌐 Back online!");
      audioManager?.playSFX("questClear");
    });

    window.addEventListener("offline", () => {
      console.log("📡 Offline - cached content available");
    });
  }

  // ═══════════════════════════════════════════
  // START APPLICATION (GUARDED)
  // ═══════════════════════════════════════════
  function startApp() {
    if (_appInitialized) {
      console.warn("⚠️ App already initialized, skipping duplicate call");
      return;
    }
    _appInitialized = true;

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initializeApp);
    } else {
      initializeApp();
    }
  }

  // HANYA PANGGIL SEKALI
  startApp();

  // ═══════════════════════════════════════════
  // HANDLE BFCACHE
  // ═══════════════════════════════════════════
  window.addEventListener("pageshow", (event) => {
    if (event.persisted) {
      console.log("🍁 Page restored from bfcache");
      initLazyLoading();
    }
  });
})();
