// ═══════════════════════════════════════════
// PORTFOLIO SCRIPT - hayaxxdev-bit
// VERSION 4.0 - MODULAR & OPTIMIZED
// TEMA MAPLE BOFURI
// ═══════════════════════════════════════════

(function () {
  "use strict";

  // ═══════════════════════════════════════════
  // 1. CONFIGURATION
  // ═══════════════════════════════════════════
  const CONFIG = {
    USERNAME: "hayaxxdev-bit",
    GITHUB_API_BASE: "https://api.github.com",
    GITHUB_RAW_BASE: "https://raw.githubusercontent.com",
    CUSTOM_API_BASE: "https://hayaxxdev-bit-github-io.vercel.app",
    BGM_VOLUME: 0.5,
    SFX_VOLUME: 0.15,
    TYPING_SPEED_MIN: 25,
    TYPING_SPEED_MAX: 45,
    GUIDE_DELAY: 5000,
    AUTO_LOAD_DELAY: 800,
    AUTOPLAY_DELAY: 4500,
    MAX_REPOS_PER_PAGE: 100,
    ALL_REPOS: true,
    FEATURED_COUNT: 6,
    LOADER_TIMEOUT: 5000,
    STATS_ANIMATION_DURATION: 1500,
    CACHE_DURATION: 1000 * 60 * 30,
    RETRY_MAX: 3,
    RETRY_DELAY: 1000,
    RATE_LIMIT_THRESHOLD: 10,
  };

  // ═══════════════════════════════════════════
  // 2. UTILITY FUNCTIONS
  // ═══════════════════════════════════════════
  const LANGUAGE_COLORS = {
    JavaScript: "#f1e05a",
    TypeScript: "#3178c6",
    Python: "#3572A5",
    HTML: "#e34c26",
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
  };

  const getLanguageColor = (lang) => LANGUAGE_COLORS[lang] || "#8b949e";

  const timeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffSec = Math.floor((now - date) / 1000);
    if (diffSec < 60) return "Baru saja";
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)} menit lalu`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)} jam lalu`;
    if (diffSec < 2592000) return `${Math.floor(diffSec / 86400)} hari lalu`;
    if (diffSec < 31536000)
      return `${Math.floor(diffSec / 2592000)} bulan lalu`;
    return `${Math.floor(diffSec / 31536000)} tahun lalu`;
  };

  const escapeHtml = (text) => {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  };

  const ICONS = {
    star: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25z"/></svg>',
    fork: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0zM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0z"/></svg>',
    clock:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
    repo: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>',
    demo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>',
    pages:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>',
    readme:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>',
  };

  // ═══════════════════════════════════════════
  // 3. CACHE MANAGER (ENHANCED)
  // ═══════════════════════════════════════════
  class CacheManager {
    constructor() {
      this.prefix = "maple_cache_";
      this.version = "v2";
      this.memoryCache = new Map(); // In-memory cache untuk akses instant
      this.pendingWrites = new Map(); // Batch writes untuk mengurangi I/O
      this.writeQueueTimer = null;
      this.stats = {
        hits: 0,
        misses: 0,
        writes: 0,
        evictions: 0,
      };

      // Bersihkan cache dari versi lama saat inisialisasi
      this._migrateFromOldVersions();
    }

    /**
     * Generate cache key dengan prefix dan version
     */
    _getKey(key) {
      return `${this.prefix}${this.version}_${key}`;
    }

    /**
     * SET - Simpan data ke cache (dengan batch writing)
     * @param {string} key - Cache key
     * @param {*} data - Data yang akan disimpan
     * @param {number} ttl - Time to live dalam milliseconds
     * @param {boolean} immediate - Jika true, tulis langsung ke localStorage
     */
    async set(key, data, ttl = CONFIG.CACHE_DURATION, immediate = false) {
      const cacheKey = this._getKey(key);
      const cacheItem = {
        data,
        timestamp: Date.now(),
        ttl,
        size: this._estimateSize(data),
      };

      // 1. Simpan ke memory cache (instant)
      this.memoryCache.set(cacheKey, cacheItem);

      // 2. Tulis ke localStorage (bisa ditunda)
      if (immediate) {
        return this._writeToStorage(cacheKey, cacheItem);
      } else {
        // Batch writing: kumpulkan writes, eksekusi dalam batch
        this.pendingWrites.set(cacheKey, cacheItem);
        this._scheduleBatchWrite();
        return true;
      }
    }

    /**
     * GET - Ambil data dari cache
     * @param {string} key - Cache key
     * @param {boolean} forceRefresh - Jika true, skip cache dan return null
     */
    get(key, forceRefresh = false) {
      if (forceRefresh) {
        this.stats.misses++;
        return null;
      }

      const cacheKey = this._getKey(key);

      // 1. Cek memory cache dulu (paling cepat)
      if (this.memoryCache.has(cacheKey)) {
        const item = this.memoryCache.get(cacheKey);
        if (!this._isExpired(item)) {
          this.stats.hits++;
          return this._deepClone(item.data); // Return clone untuk mencegah mutasi
        } else {
          // Expired di memory, hapus
          this.memoryCache.delete(cacheKey);
        }
      }

      // 2. Cek localStorage
      try {
        const raw = localStorage.getItem(cacheKey);
        if (!raw) {
          this.stats.misses++;
          return null;
        }

        const item = JSON.parse(raw);

        if (this._isExpired(item)) {
          // Expired, hapus dari storage
          localStorage.removeItem(cacheKey);
          this.stats.evictions++;
          this.stats.misses++;
          return null;
        }

        // Masukkan ke memory cache untuk akses berikutnya
        this.memoryCache.set(cacheKey, item);
        this.stats.hits++;

        return this._deepClone(item.data);
      } catch (e) {
        console.warn(`Cache read failed for ${key}:`, e.message);
        localStorage.removeItem(cacheKey); // Hapus data corrupt
        this.stats.misses++;
        return null;
      }
    }

    /**
     * GET MULTI - Ambil multiple cache keys sekaligus
     * @param {string[]} keys - Array of cache keys
     * @returns {Object} Object dengan key-value pairs
     */
    getMulti(keys) {
      const result = {};
      keys.forEach((key) => {
        result[key] = this.get(key);
      });
      return result;
    }

    /**
     * SET MULTI - Simpan multiple items sekaligus
     * @param {Object} items - Object dengan key-value pairs
     * @param {number} ttl - Time to live
     */
    async setMulti(items, ttl = CONFIG.CACHE_DURATION) {
      const promises = Object.entries(items).map(([key, data]) =>
        this.set(key, data, ttl),
      );
      return Promise.all(promises);
    }

    /**
     * REMOVE - Hapus item dari cache
     */
    remove(key) {
      const cacheKey = this._getKey(key);
      this.memoryCache.delete(cacheKey);
      this.pendingWrites.delete(cacheKey);

      try {
        localStorage.removeItem(cacheKey);
        return true;
      } catch (e) {
        return false;
      }
    }

    /**
     * HAS - Cek apakah key ada di cache dan belum expired
     */
    has(key) {
      const cacheKey = this._getKey(key);

      // Cek memory cache
      if (this.memoryCache.has(cacheKey)) {
        return !this._isExpired(this.memoryCache.get(cacheKey));
      }

      // Cek localStorage
      const raw = localStorage.getItem(cacheKey);
      if (!raw) return false;

      try {
        const item = JSON.parse(raw);
        return !this._isExpired(item);
      } catch (e) {
        return false;
      }
    }

    /**
     * CLEAR - Bersihkan semua cache dengan prefix ini
     * @param {boolean} softClear - Jika true, hanya hapus yang expired
     */
    clear(softClear = false) {
      // Bersihkan memory cache
      this.memoryCache.clear();
      this.pendingWrites.clear();

      try {
        const keys = Object.keys(localStorage);
        let removedCount = 0;

        keys.forEach((key) => {
          if (key.startsWith(this.prefix)) {
            if (softClear) {
              // Hanya hapus yang expired
              try {
                const item = JSON.parse(localStorage.getItem(key));
                if (this._isExpired(item)) {
                  localStorage.removeItem(key);
                  removedCount++;
                }
              } catch (e) {
                localStorage.removeItem(key);
                removedCount++;
              }
            } else {
              // Hapus semua
              localStorage.removeItem(key);
              removedCount++;
            }
          }
        });

        console.log(`🗑️ Cache cleared: ${removedCount} items removed`);
        this.stats.evictions += removedCount;
        return removedCount;
      } catch (e) {
        console.warn("Cache clear failed:", e.message);
        return 0;
      }
    }

    /**
     * GET SIZE - Dapatkan total ukuran cache
     * @returns {Object} {count, estimatedSize}
     */
    getSize() {
      let totalSize = 0;
      let count = 0;

      try {
        const keys = Object.keys(localStorage);
        keys.forEach((key) => {
          if (key.startsWith(this.prefix)) {
            totalSize += localStorage.getItem(key).length * 2; // UTF-16 = 2 bytes per char
            count++;
          }
        });
      } catch (e) {}

      return {
        count,
        estimatedSizeMB: (totalSize / (1024 * 1024)).toFixed(2),
      };
    }

    /**
     * GET STATS - Dapatkan statistik cache
     */
    getStats() {
      const hitRate =
        this.stats.hits + this.stats.misses > 0
          ? (
              (this.stats.hits / (this.stats.hits + this.stats.misses)) *
              100
            ).toFixed(1)
          : 0;

      return {
        ...this.stats,
        hitRate: `${hitRate}%`,
        memoryCacheSize: this.memoryCache.size,
        pendingWrites: this.pendingWrites.size,
        ...this.getSize(),
      };
    }

    /**
     * WARM - Pre-load frequently used cache items
     * @param {string[]} keys - Keys to pre-load
     */
    warm(keys) {
      console.log(`🔥 Warming cache: ${keys.length} items`);
      keys.forEach((key) => this.get(key));
      return this;
    }

    // ═══════════════ PRIVATE METHODS ═══════════════

    /**
     * Check if cache item is expired
     */
    _isExpired(item) {
      if (!item || !item.timestamp) return true;
      const ttl = item.ttl || CONFIG.CACHE_DURATION;
      return Date.now() - item.timestamp > ttl;
    }

    /**
     * Write item to localStorage
     */
    _writeToStorage(cacheKey, item) {
      try {
        const serialized = JSON.stringify(item);
        localStorage.setItem(cacheKey, serialized);
        this.stats.writes++;
        return true;
      } catch (e) {
        if (e.name === "QuotaExceededError") {
          // Storage penuh! Bersihkan cache expired terlebih dahulu
          console.warn("⚠️ Storage quota exceeded, cleaning expired cache...");
          this.clear(true); // Soft clear

          // Coba lagi
          try {
            localStorage.setItem(cacheKey, JSON.stringify(item));
            return true;
          } catch (retryError) {
            // Masih penuh, hapus cache tertua
            console.warn("⚠️ Removing oldest cache items...");
            this._evictOldest(10); // Hapus 10 item tertua

            try {
              localStorage.setItem(cacheKey, JSON.stringify(item));
              return true;
            } catch (finalError) {
              console.error(
                "❌ Cache write failed after cleanup:",
                finalError.message,
              );
              return false;
            }
          }
        }

        console.warn("Cache write failed:", e.message);
        return false;
      }
    }

    /**
     * Schedule batch write to localStorage
     */
    _scheduleBatchWrite() {
      if (this.writeQueueTimer) return;

      this.writeQueueTimer = setTimeout(() => {
        this._executeBatchWrite();
      }, 500); // Tunda 500ms untuk mengumpulkan writes
    }

    /**
     * Execute all pending writes
     */
    _executeBatchWrite() {
      if (this.pendingWrites.size === 0) {
        this.writeQueueTimer = null;
        return;
      }

      console.log(`💾 Writing ${this.pendingWrites.size} items to cache...`);

      this.pendingWrites.forEach((item, cacheKey) => {
        this._writeToStorage(cacheKey, item);
      });

      this.pendingWrites.clear();
      this.writeQueueTimer = null;
    }

    /**
     * Evict oldest items from cache
     */
    _evictOldest(count = 5) {
      try {
        const cacheItems = [];
        const keys = Object.keys(localStorage);

        keys.forEach((key) => {
          if (key.startsWith(this.prefix)) {
            try {
              const item = JSON.parse(localStorage.getItem(key));
              cacheItems.push({ key, timestamp: item.timestamp || 0 });
            } catch (e) {}
          }
        });

        // Sort by oldest first
        cacheItems.sort((a, b) => a.timestamp - b.timestamp);

        // Remove oldest items
        const toRemove = cacheItems.slice(0, count);
        toRemove.forEach((item) => {
          localStorage.removeItem(item.key);
          this.memoryCache.delete(item.key);
        });

        this.stats.evictions += toRemove.length;
      } catch (e) {}
    }

    /**
     * Estimate size of data in bytes
     */
    _estimateSize(data) {
      try {
        return new Blob([JSON.stringify(data)]).size;
      } catch (e) {
        return 0;
      }
    }

    /**
     * Deep clone data to prevent mutation
     */
    _deepClone(data) {
      // Untuk data sederhana, JSON parse/stringify sudah cukup
      // Untuk data kompleks, bisa gunakan structuredClone
      if (typeof structuredClone === "function") {
        return structuredClone(data);
      }
      try {
        return JSON.parse(JSON.stringify(data));
      } catch (e) {
        // Fallback: shallow copy untuk data yang tidak bisa di-serialize
        if (Array.isArray(data)) return [...data];
        if (typeof data === "object" && data !== null) return { ...data };
        return data;
      }
    }

    /**
     * Migrate cache from old versions
     */
    _migrateFromOldVersions() {
      try {
        const keys = Object.keys(localStorage);
        let migratedCount = 0;

        keys.forEach((key) => {
          // Cari cache versi lama (tanpa version prefix)
          if (key.startsWith(this.prefix) && !key.includes("_v")) {
            try {
              const data = localStorage.getItem(key);
              localStorage.removeItem(key); // Hapus versi lama
              migratedCount++;
            } catch (e) {}
          }
        });

        if (migratedCount > 0) {
          console.log(
            `🔄 Migrated ${migratedCount} items from old cache version`,
          );
        }
      } catch (e) {}
    }

    /**
     * Destroy - cleanup sebelum halaman unload
     */
    destroy() {
      // Flush pending writes
      if (this.pendingWrites.size > 0) {
        this._executeBatchWrite();
      }

      this.memoryCache.clear();
      this.pendingWrites.clear();
    }
  }

  // ═══════════════════════════════════════════
  // 4. AUDIO MANAGER
  // ═══════════════════════════════════════════
  // ═══════════════════════════════════════════
  // 4. AUDIO MANAGER v2.0 - ENHANCED
  // ═══════════════════════════════════════════
  class AudioManager {
    static instance = null;

    constructor() {
      if (AudioManager.instance) return AudioManager.instance;
      AudioManager.instance = this;

      // Core audio
      this.context = null;
      this.masterGain = null;
      this.bgmGain = null;
      this.sfxGain = null;
      this.currentSource = null;
      this.nextSource = null; // Untuk crossfade

      // State
      this.isPlaying = false;
      this.isInitialized = false;
      this.isCrossfading = false;

      // Volume
      this.bgmVolume = CONFIG.BGM_VOLUME;
      this.sfxVolume = CONFIG.SFX_VOLUME;
      this.masterVolume = 1.0;
      this.isMuted = false;

      // Playlist management
      this.currentTrackIndex = 0;
      this.shuffleMode = false;
      this.repeatMode = "all"; // 'off', 'one', 'all'
      this.shuffledIndices = [];

      // Audio analysis
      this.analyser = null;
      this.frequencyData = null;
      this.visualizerCallbacks = [];

      // Enhanced SFX with spatial audio
      this.sfxNodes = new Map();
      this.listenerPosition = { x: 0, y: 0, z: 0 };

      // UI
      this.uiElements = {
        toggle: document.getElementById("bgmToggle"),
        next: document.getElementById("bgmNext"),
        prev: document.getElementById("bgmPrev"),
        label: document.getElementById("bgmLabel"),
        volumeFill: document.querySelector(".bgm-volume-fill"),
        volumeSlider: document.getElementById("bgmVolumeSlider"),
        trackInfo: document.getElementById("bgmTrackInfo"),
        playlistContainer: document.getElementById("bgmPlaylist"),
      };

      // Enhanced playlist
      this.playlist = [
        {
          id: "track_1",
          name: "Lo-Fi Anime Beats",
          artist: "Maple's Studio",
          url: "./public/music/Clarity-phonk.wav",
          duration: 0,
          category: "chill",
          bpm: 85,
        },
        {
          id: "track_2",
          name: "Maple's Defense",
          artist: "Bofuri OST",
          url: "./public/music/maple-theme.mp3",
          duration: 0,
          category: "epic",
          bpm: 120,
        },
        {
          id: "track_3",
          name: "Adventure Time",
          artist: "Guild Members",
          url: "./public/music/adventure.mp3",
          duration: 0,
          category: "adventure",
          bpm: 140,
        },
        {
          id: "track_4",
          name: "Sally's Speed",
          artist: "Blue Flash Records",
          url: "./public/music/sally-theme.mp3",
          duration: 0,
          category: "action",
          bpm: 160,
          fallback: true, // Gunakan synthesized audio jika file tidak ada
        },
      ];

      // SFX presets dengan dynamic generation
      this.sfxPresets = {
        menuSelect: {
          type: "square",
          frequencies: [880, 1174.66],
          gainValue: 0.08,
          duration: 0.12,
          category: "ui",
        },
        questClear: {
          type: "melody",
          notes: [523.25, 659.25, 783.99, 1046.5],
          gainValue: 0.1,
          noteDuration: 0.25,
          category: "achievement",
        },
        close: {
          type: "sine",
          frequencies: [600, 150],
          gainValue: 0.06,
          duration: 0.2,
          exponential: true,
          category: "ui",
        },
        dialogue: {
          type: "sine",
          frequencies: [440, 660],
          gainValue: 0.04,
          duration: 0.12,
          exponential: true,
          category: "ui",
        },
        guideStart: {
          type: "melody",
          notes: [523.25, 659.25, 783.99],
          gainValue: 0.06,
          noteDuration: 0.15,
          category: "guide",
        },
        achievement: {
          type: "melody",
          notes: [523.25, 659.25, 783.99, 1046.5],
          gainValue: 0.15,
          noteDuration: 0.3,
          category: "achievement",
        },
        error: {
          type: "sawtooth",
          frequencies: [200, 100],
          gainValue: 0.05,
          duration: 0.3,
          exponential: true,
          category: "system",
        },
        success: {
          type: "triangle",
          frequencies: [523.25, 783.99],
          gainValue: 0.08,
          duration: 0.2,
          category: "system",
        },
        hover: {
          type: "sine",
          frequencies: [600],
          gainValue: 0.02,
          duration: 0.05,
          category: "ui",
        },
      };

      // Compile SFX map
      this.sfxMap = {};
      this._compileSFXMap();

      // Auto-save state
      this._loadState();

      // Bind events
      this._bindEvents();
    }

    // ═══════════════ INITIALIZATION ═══════════════

    init() {
      if (this.isInitialized) return this;

      try {
        // Create audio context with optimal settings
        this.context = new (window.AudioContext || window.webkitAudioContext)({
          latencyHint: "interactive",
          sampleRate: 44100,
        });

        // Master chain: BGM/SFX → Master → Analyser → Destination
        this.masterGain = this.context.createGain();
        this.bgmGain = this.context.createGain();
        this.sfxGain = this.context.createGain();

        // Analyser untuk visualisasi
        this.analyser = this.context.createAnalyser();
        this.analyser.fftSize = 256;
        this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount);

        // Set initial volumes
        this.masterGain.gain.value = this.masterVolume;
        this.bgmGain.gain.value = this.bgmVolume;
        this.sfxGain.gain.value = this.sfxVolume;

        // Connect audio graph
        this.bgmGain.connect(this.analyser);
        this.sfxGain.connect(this.analyser);
        this.analyser.connect(this.masterGain);
        this.masterGain.connect(this.context.destination);

        // Setup spatial audio listener
        if (this.context.listener) {
          this.context.listener.positionX.value = 0;
          this.context.listener.positionY.value = 0;
          this.context.listener.positionZ.value = 0;
        }

        this.isInitialized = true;
        console.log(
          "🎵 Audio Engine Initialized | Sample Rate:",
          this.context.sampleRate,
        );

        // Start visualizer loop
        this._startVisualizer();

        return this;
      } catch (error) {
        console.warn("🎵 Audio initialization failed:", error.message);
        return this;
      }
    }

    ensureContext() {
      if (!this.isInitialized) this.init();
      if (this.context?.state === "suspended") {
        this.context.resume();
      }
      return this.context;
    }

    // ═══════════════ SFX GENERATION ═══════════════

    _compileSFXMap() {
      Object.entries(this.sfxPresets).forEach(([name, preset]) => {
        if (preset.type === "melody") {
          this.sfxMap[name] = this._createMelodySFX(
            preset.notes,
            preset.gainValue,
            preset.noteDuration,
            name,
          );
        } else {
          this.sfxMap[name] = this._createSFX(
            preset.type,
            preset.frequencies,
            preset.gainValue,
            preset.duration,
            preset.exponential || false,
            name,
          );
        }
      });
    }

    _createSFX(
      type,
      frequencies,
      gainValue,
      duration,
      exponential = false,
      name = "",
    ) {
      return (options = {}) => {
        if (!this.ensureContext()) return;
        if (this.isMuted && options.ignoreMute !== true) return;

        const now = this.context.currentTime;
        const { pan = 0, detune = 0, filterFreq = null } = options;

        // Create nodes
        const osc = this.context.createOscillator();
        const gain = this.context.createGain();
        const panner = pan !== 0 ? this.context.createStereoPanner() : null;
        const filter = filterFreq ? this.context.createBiquadFilter() : null;

        // Oscillator settings
        osc.type = type;
        osc.detune.value = detune;

        // Frequency automation
        if (exponential && frequencies.length === 2) {
          osc.frequency.setValueAtTime(frequencies[0], now);
          osc.frequency.exponentialRampToValueAtTime(
            frequencies[1],
            now + duration,
          );
        } else {
          frequencies.forEach((freq, i) => {
            osc.frequency.setValueAtTime(
              freq,
              now + i * (duration / frequencies.length),
            );
          });
        }

        // Gain envelope
        gain.gain.setValueAtTime(gainValue * this.sfxVolume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

        // Filter settings
        if (filter) {
          filter.type = "lowpass";
          filter.frequency.value = filterFreq;
        }

        // Connect chain
        let lastNode = osc;
        if (filter) {
          lastNode.connect(filter);
          lastNode = filter;
        }
        lastNode.connect(gain);
        if (panner) {
          gain.connect(panner);
          panner.connect(this.sfxGain);
          panner.pan.value = pan;
        } else {
          gain.connect(this.sfxGain);
        }

        // Play
        osc.start(now);
        osc.stop(now + duration + 0.01);

        // Cleanup
        osc.onended = () => {
          osc.disconnect();
          gain.disconnect();
          if (panner) panner.disconnect();
          if (filter) filter.disconnect();
        };

        return { osc, gain, panner, filter };
      };
    }

    _createMelodySFX(notes, gainValue, noteDuration, name = "") {
      return (options = {}) => {
        if (!this.ensureContext()) return;
        if (this.isMuted && options.ignoreMute !== true) return;

        const now = this.context.currentTime;
        const { pan = 0, detune = 0 } = options;

        const activeNodes = [];

        notes.forEach((freq, i) => {
          const osc = this.context.createOscillator();
          const gain = this.context.createGain();

          // Varied waveforms for richness
          osc.type = i % 3 === 0 ? "triangle" : i % 3 === 1 ? "sine" : "square";
          osc.frequency.value = freq;
          osc.detune.value = detune;

          const start = now + i * (noteDuration / notes.length);
          gain.gain.setValueAtTime(gainValue * this.sfxVolume, start);
          gain.gain.exponentialRampToValueAtTime(
            0.001,
            start + noteDuration * 1.5,
          );

          osc.connect(gain);
          gain.connect(this.sfxGain);

          osc.start(start);
          osc.stop(start + noteDuration * 1.5);

          osc.onended = () => {
            osc.disconnect();
            gain.disconnect();
          };

          activeNodes.push({ osc, gain });
        });

        return activeNodes;
      };
    }

    // ═══════════════ BGM PLAYBACK ═══════════════

    async playTrack(index, crossfade = false) {
      if (!this.ensureContext()) return;

      const track = this.playlist[index];
      if (!track) return;

      // Handle fallback untuk file yang tidak ada
      if (track.fallback) {
        this._generateFallbackTrack(track);
        return;
      }

      try {
        // Fetch dan decode audio
        const response = await fetch(track.url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await this.context.decodeAudioData(arrayBuffer);

        // Update track duration
        track.duration = audioBuffer.duration;

        // Create source
        const source = this.context.createBufferSource();
        source.buffer = audioBuffer;
        source.loop = true;

        if (crossfade && this.currentSource) {
          // Crossfade transition
          await this._crossfadeTo(source);
        } else {
          // Stop current and play new
          this.stopTrack();
          source.connect(this.bgmGain);
          source.start(0);
          this.currentSource = source;
        }

        this.isPlaying = true;
        this.currentTrackIndex = index;
        this._saveState();
        this.updateUI();

        console.log(`🎵 Now Playing: ${track.name} | ${track.artist}`);
      } catch (error) {
        console.warn(`Failed to load track "${track.name}":`, error.message);

        // Coba track berikutnya jika gagal
        if (this.repeatMode !== "one") {
          console.log("⏭ Skipping to next track...");
          this.next();
        }
      }
    }

    async _crossfadeTo(newSource) {
      if (this.isCrossfading) return;
      this.isCrossfading = true;

      const crossfadeDuration = 1.5; // 1.5 detik crossfade
      const now = this.context.currentTime;

      // Fade out current
      if (this.currentSource) {
        const fadeOutGain = this.context.createGain();
        fadeOutGain.gain.setValueAtTime(this.bgmVolume, now);
        fadeOutGain.gain.linearRampToValueAtTime(
          0.001,
          now + crossfadeDuration,
        );

        this.currentSource.disconnect();
        this.currentSource.connect(fadeOutGain);
        fadeOutGain.connect(this.bgmGain);

        // Stop setelah fade out
        setTimeout(() => {
          try {
            this.currentSource.stop();
            this.currentSource.disconnect();
            fadeOutGain.disconnect();
          } catch (e) {}
        }, crossfadeDuration * 1000);
      }

      // Fade in new
      const fadeInGain = this.context.createGain();
      fadeInGain.gain.setValueAtTime(0.001, now);
      fadeInGain.gain.linearRampToValueAtTime(
        this.bgmVolume,
        now + crossfadeDuration,
      );

      newSource.connect(fadeInGain);
      fadeInGain.connect(this.bgmGain);
      newSource.start(now);

      this.currentSource = newSource;

      setTimeout(() => {
        this.isCrossfading = false;
      }, crossfadeDuration * 1000);
    }

    _generateFallbackTrack(track) {
      // Generate synthesized BGM untuk fallback
      if (!this.ensureContext()) return;

      this.stopTrack();

      const duration = 16; // 16 detik loop
      const sampleRate = this.context.sampleRate;
      const buffer = this.context.createBuffer(
        2,
        sampleRate * duration,
        sampleRate,
      );

      // Generate simple ambient pad
      for (let channel = 0; channel < 2; channel++) {
        const data = buffer.getChannelData(channel);
        for (let i = 0; i < data.length; i++) {
          const t = i / sampleRate;
          // Simple chord progression
          data[i] =
            (Math.sin(2 * Math.PI * 130.81 * t) * 0.3 +
              Math.sin(2 * Math.PI * 164.81 * t) * 0.2 +
              Math.sin(2 * Math.PI * 196.0 * t) * 0.15) *
            (0.5 + 0.5 * Math.sin(0.5 * Math.PI * t));
        }
      }

      const source = this.context.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      source.connect(this.bgmGain);
      source.start(0);

      this.currentSource = source;
      this.isPlaying = true;
      this.updateUI();

      console.log(`🎹 Generated fallback track for: ${track.name}`);
    }

    stopTrack() {
      if (this.currentSource) {
        try {
          this.currentSource.stop();
          this.currentSource.disconnect();
        } catch (e) {
          // May already be stopped
        }
        this.currentSource = null;
      }
      this.isPlaying = false;
      this.updateUI();
    }

    // ═══════════════ PLAYBACK CONTROLS ═══════════════

    toggle() {
      if (!this.ensureContext()) return;

      if (this.isPlaying) {
        this.stopTrack();
        this.playSFX("close");
      } else {
        this.playTrack(this.currentTrackIndex);
        this.playSFX("menuSelect");
      }
    }

    next() {
      const nextIndex = this._getNextIndex();
      this.playTrack(nextIndex, true); // Crossfade ke track berikutnya
      this.playSFX("menuSelect");
    }

    previous() {
      const prevIndex = this._getPrevIndex();
      this.playTrack(prevIndex, true);
      this.playSFX("menuSelect");
    }

    _getNextIndex() {
      if (this.repeatMode === "one") return this.currentTrackIndex;

      if (this.shuffleMode) {
        if (this.shuffledIndices.length === 0) {
          this._generateShuffledIndices();
        }
        return this.shuffledIndices.shift();
      }

      return (this.currentTrackIndex + 1) % this.playlist.length;
    }

    _getPrevIndex() {
      return (
        (this.currentTrackIndex - 1 + this.playlist.length) %
        this.playlist.length
      );
    }

    _generateShuffledIndices() {
      this.shuffledIndices = [...Array(this.playlist.length).keys()]
        .filter((i) => i !== this.currentTrackIndex) // Exclude current
        .sort(() => Math.random() - 0.5);
    }

    // ═══════════════ VOLUME CONTROL ═══════════════

    setVolume(value) {
      this.bgmVolume = Math.max(0, Math.min(1, value));
      if (this.bgmGain) {
        this.bgmGain.gain.linearRampToValueAtTime(
          this.bgmVolume,
          this.context.currentTime + 0.1,
        );
      }
      this._saveState();
      this.updateUI();
    }

    setSFXVolume(value) {
      this.sfxVolume = Math.max(0, Math.min(1, value));
      this._saveState();
    }

    setMasterVolume(value) {
      this.masterVolume = Math.max(0, Math.min(1, value));
      if (this.masterGain) {
        this.masterGain.gain.linearRampToValueAtTime(
          this.masterVolume,
          this.context.currentTime + 0.1,
        );
      }
    }

    toggleMute() {
      this.isMuted = !this.isMuted;
      if (this.masterGain) {
        this.masterGain.gain.linearRampToValueAtTime(
          this.isMuted ? 0 : this.masterVolume,
          this.context.currentTime + 0.1,
        );
      }
      this.updateUI();
      this.playSFX(this.isMuted ? "close" : "menuSelect");
    }

    // ═══════════════ SPATIAL AUDIO ═══════════════

    playSpatialSFX(type, position = { x: 0, y: 0, z: 0 }) {
      if (!this.ensureContext()) return;

      const preset = this.sfxPresets[type];
      if (!preset) return;

      // Calculate pan based on position relative to listener
      const dx = position.x - this.listenerPosition.x;
      const dy = position.y - this.listenerPosition.y;
      const pan = Math.max(-1, Math.min(1, dx / 10)); // Normalize to -1..1

      // Calculate distance attenuation
      const distance = Math.sqrt(dx * dx + dy * dy);
      const attenuation = Math.max(0, 1 - distance / 20);

      const options = {
        pan,
        gainValue: (preset.gainValue || 0.08) * attenuation,
        ignoreMute: false,
      };

      this.sfxMap[type]?.(options);
    }

    setListenerPosition(x, y, z = 0) {
      this.listenerPosition = { x, y, z };
      if (this.context?.listener) {
        this.context.listener.positionX.value = x;
        this.context.listener.positionY.value = y;
        this.context.listener.positionZ.value = z;
      }
    }

    // ═══════════════ VISUALIZER ═══════════════

    _startVisualizer() {
      const updateVisualizer = () => {
        if (this.analyser) {
          this.analyser.getByteFrequencyData(this.frequencyData);

          // Notify callbacks
          this.visualizerCallbacks.forEach((cb) => {
            try {
              cb(this.frequencyData);
            } catch (e) {}
          });
        }

        if (this.isInitialized) {
          requestAnimationFrame(updateVisualizer);
        }
      };

      requestAnimationFrame(updateVisualizer);
    }

    onVisualizerData(callback) {
      this.visualizerCallbacks.push(callback);
      return () => {
        this.visualizerCallbacks = this.visualizerCallbacks.filter(
          (cb) => cb !== callback,
        );
      };
    }

    getFrequencyData() {
      return this.frequencyData;
    }

    getBassLevel() {
      if (!this.frequencyData) return 0;
      // Average of low frequencies (bass)
      let sum = 0;
      for (let i = 0; i < 8; i++) {
        sum += this.frequencyData[i];
      }
      return sum / 8 / 255;
    }

    // ═══════════════ PLAYLIST MANAGEMENT ═══════════════

    addTrack(track) {
      this.playlist.push({
        id: `track_${Date.now()}`,
        ...track,
        duration: 0,
      });
      this._saveState();
    }

    removeTrack(index) {
      if (this.playlist.length <= 1) return; // Jangan hapus track terakhir
      this.playlist.splice(index, 1);
      if (this.currentTrackIndex >= this.playlist.length) {
        this.currentTrackIndex = 0;
      }
      this._saveState();
    }

    setShuffleMode(enabled) {
      this.shuffleMode = enabled;
      if (enabled) this._generateShuffledIndices();
      this._saveState();
      this.playSFX("menuSelect");
    }

    setRepeatMode(mode) {
      this.repeatMode = mode; // 'off', 'one', 'all'
      this._saveState();
      this.playSFX("menuSelect");
    }

    // ═══════════════ STATE PERSISTENCE ═══════════════

    _saveState() {
      try {
        const state = {
          currentTrackIndex: this.currentTrackIndex,
          bgmVolume: this.bgmVolume,
          sfxVolume: this.sfxVolume,
          masterVolume: this.masterVolume,
          isMuted: this.isMuted,
          shuffleMode: this.shuffleMode,
          repeatMode: this.repeatMode,
          playlist: this.playlist.map((t) => ({
            id: t.id,
            name: t.name,
            artist: t.artist,
            url: t.url,
            category: t.category,
          })),
        };
        localStorage.setItem("maple_audio_state", JSON.stringify(state));
      } catch (e) {}
    }

    _loadState() {
      try {
        const raw = localStorage.getItem("maple_audio_state");
        if (!raw) return;
        const state = JSON.parse(raw);

        this.currentTrackIndex = state.currentTrackIndex || 0;
        this.bgmVolume = state.bgmVolume || CONFIG.BGM_VOLUME;
        this.sfxVolume = state.sfxVolume || CONFIG.SFX_VOLUME;
        this.masterVolume = state.masterVolume || 1.0;
        this.isMuted = state.isMuted || false;
        this.shuffleMode = state.shuffleMode || false;
        this.repeatMode = state.repeatMode || "all";
      } catch (e) {}
    }

    // ═══════════════ UI ═══════════════

    playSFX(type, options = {}) {
      if (!this.ensureContext()) return;
      if (this.isMuted && options.ignoreMute !== true) return;
      this.sfxMap[type]?.(options);
    }

    updateUI() {
      const { toggle, label } = this.uiElements;

      if (toggle) {
        toggle.classList.toggle("bgm-toggle--playing", this.isPlaying);
        const svg = toggle.querySelector("svg");
        if (svg) {
          svg.innerHTML = this.isPlaying
            ? '<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>'
            : '<path d="M8 5v14l11-7z"/>';
        }
      }

      if (label && this.playlist[this.currentTrackIndex]) {
        const track = this.playlist[this.currentTrackIndex];
        label.textContent = `${track.name} - ${track.artist}`;
      }

      if (this.uiElements.volumeFill) {
        this.uiElements.volumeFill.style.width = `${this.bgmVolume * 100}%`;
      }
    }

    _bindEvents() {
      // Toggle play/pause
      this.uiElements.toggle?.addEventListener("click", () => this.toggle());

      // Next track
      this.uiElements.next?.addEventListener("click", () => {
        this.playSFX("menuSelect");
        this.next();
      });

      // Previous track
      this.uiElements.prev?.addEventListener("click", () => {
        this.playSFX("menuSelect");
        this.previous();
      });

      // Volume slider
      this.uiElements.volumeSlider?.addEventListener("input", (e) => {
        this.setVolume(parseFloat(e.target.value));
      });

      // Keyboard shortcuts
      document.addEventListener("keydown", (e) => {
        // Media keys atau custom shortcuts
        if (e.code === "Space" && e.target === document.body) {
          e.preventDefault();
          this.toggle();
        } else if (e.code === "ArrowRight" && e.ctrlKey) {
          e.preventDefault();
          this.next();
        } else if (e.code === "ArrowLeft" && e.ctrlKey) {
          e.preventDefault();
          this.previous();
        } else if (e.code === "KeyM" && e.ctrlKey) {
          e.preventDefault();
          this.toggleMute();
        }
      });

      // Auto-play on user interaction (respect browser policy)
      const autoPlayHandler = () => {
        if (!this.isPlaying && this.isInitialized) {
          this.playTrack(this.currentTrackIndex);
        }
        document.removeEventListener("click", autoPlayHandler);
        document.removeEventListener("keydown", autoPlayHandler);
      };

      document.addEventListener("click", autoPlayHandler, { once: true });
      document.addEventListener("keydown", autoPlayHandler, { once: true });
    }

    // ═══════════════ CLEANUP ═══════════════

    destroy() {
      this._saveState();
      this.stopTrack();
      this.visualizerCallbacks = [];

      if (this.context) {
        try {
          this.context.close();
        } catch (e) {}
        this.context = null;
      }

      this.isInitialized = false;
      AudioManager.instance = null;
      console.log("🎵 Audio Engine Destroyed");
    }
  }

  // ═══════════════════════════════════════════
  // 5. ACHIEVEMENT SYSTEM v2.0 - ENHANCED
  // ═══════════════════════════════════════════
  class AchievementSystem {
    constructor() {
      // Core data
      this.achievements = new Map();
      this.categories = new Map();
      this.secrets = new Set(); // Secret achievements (hidden until unlocked)

      // Player stats
      this.playerLevel = 1;
      this.totalXP = 0;
      this.xpToNextLevel = 100;
      this.comboCount = 0;
      this.comboTimer = null;
      this.comboTimeout = 10000; // 10 detik untuk combo chain

      // Tracking data
      this.trackers = new Map(); // Progress trackers untuk milestone achievements
      this.sessionStartTime = Date.now();
      this.bgmPlayTime = 0;
      this.bgmPlayInterval = null;
      this.easterEggsFound = new Set();
      this.dialogsCompleted = 0;
      this.projectsViewed = new Set();

      // UI
      this.toastContainer = document.getElementById("achievementToasts");
      this.xpBarElement = document.getElementById("xpProgressBar");
      this.levelElement = document.getElementById("playerLevel");
      this.statsElement = document.getElementById("achievementStats");

      // Audio reference
      this.audioManager = null;

      // Event callbacks
      this.onAchievementUnlocked = null;
      this.onLevelUp = null;

      // Initialize
      this._defineAchievements();
      this._defineCategories();
      this._loadFromStorage();
      this._initTrackers();
      this._startBGMTracking();
      this._checkSessionAchievements();

      console.log(
        `🏆 Achievement System Initialized | Level ${this.playerLevel} | ${this.getTotalXP()} XP`,
      );
    }

    // ═══════════════ ACHIEVEMENT DEFINITIONS ═══════════════

    _defineAchievements() {
      const achievements = [
        // ── EXPLORATION ACHIEVEMENTS ──
        {
          id: "first_visit",
          name: "Petualang Baru!",
          desc: "Pertama kali mengunjungi guild Maple",
          icon: "🏠",
          xp: 100,
          category: "exploration",
          rarity: "common",
          isSecret: false,
        },
        {
          id: "returning_hero",
          name: "Pahlawan yang Kembali",
          desc: "Mengunjungi guild 3 hari berturut-turut",
          icon: "🏰",
          xp: 300,
          category: "exploration",
          rarity: "rare",
          isSecret: false,
          tracker: { type: "consecutive_days", target: 3 },
        },
        {
          id: "night_owl",
          name: "Burung Hantu",
          desc: "Berkunjung di malam hari (00:00 - 05:00)",
          icon: "🦉",
          xp: 100,
          category: "exploration",
          rarity: "uncommon",
          isSecret: false,
        },
        {
          id: "full_moon_visitor",
          name: "Pengunjung Bulan Purnama",
          desc: "Berkunjung saat bulan purnama",
          icon: "🌕",
          xp: 500,
          category: "exploration",
          rarity: "legendary",
          isSecret: true,
        },

        // ── INTERACTION ACHIEVEMENTS ──
        {
          id: "dialog_initiate",
          name: "Salam Kenal!",
          desc: "Memulai dialog pertama dengan Maple",
          icon: "👋",
          xp: 50,
          category: "interaction",
          rarity: "common",
          isSecret: false,
        },
        {
          id: "dialog_master",
          name: "Teman Ngobrol",
          desc: "Menyelesaikan 5 dialog dengan Maple",
          icon: "💬",
          xp: 200,
          category: "interaction",
          rarity: "uncommon",
          isSecret: false,
          tracker: { type: "dialogs", target: 5 },
        },
        {
          id: "dialog_legend",
          name: "Sahabat Maple",
          desc: "Menyelesaikan 50 dialog dengan Maple",
          icon: "💝",
          xp: 1000,
          category: "interaction",
          rarity: "legendary",
          isSecret: false,
          tracker: { type: "dialogs", target: 50 },
        },
        {
          id: "speed_reader",
          name: "Pembaca Cepat",
          desc: "Melewati dialog dalam 1 detik",
          icon: "⚡",
          xp: 50,
          category: "interaction",
          rarity: "common",
          isSecret: true,
        },

        // ── PROJECT ACHIEVEMENTS ──
        {
          id: "project_explorer",
          name: "Penjelajah Karya",
          desc: "Melihat semua proyek di halaman karya",
          icon: "🔍",
          xp: 150,
          category: "projects",
          rarity: "uncommon",
          isSecret: false,
          tracker: { type: "projects_viewed", target: "all" },
        },
        {
          id: "project_collector",
          name: "Kolektor Proyek",
          desc: "Mengunjungi 10 halaman demo proyek",
          icon: "📚",
          xp: 300,
          category: "projects",
          rarity: "rare",
          isSecret: false,
          tracker: { type: "demos_visited", target: 10 },
        },
        {
          id: "star_gazer",
          name: "Penatap Bintang",
          desc: "Repository dengan total 100+ stars",
          icon: "⭐",
          xp: 500,
          category: "projects",
          rarity: "epic",
          isSecret: false,
        },

        // ── GUIDE ACHIEVEMENTS ──
        {
          id: "guide_start",
          name: "Langkah Pertama",
          desc: "Memulai Maple's Guide Tour",
          icon: "🚶",
          xp: 50,
          category: "guide",
          rarity: "common",
          isSecret: false,
        },
        {
          id: "guide_complete",
          name: "Tur Selesai!",
          desc: "Menyelesaikan Maple's Guide Tour",
          icon: "🗺️",
          xp: 300,
          category: "guide",
          rarity: "rare",
          isSecret: false,
        },
        {
          id: "guide_speedrun",
          name: "Speedrunner!",
          desc: "Menyelesaikan guide tour dalam 30 detik",
          icon: "🏃",
          xp: 500,
          category: "guide",
          rarity: "legendary",
          isSecret: true,
        },

        // ── MUSIC ACHIEVEMENTS ──
        {
          id: "music_initiate",
          name: "Music Starter",
          desc: "Memainkan BGM pertama kali",
          icon: "🔈",
          xp: 50,
          category: "music",
          rarity: "common",
          isSecret: false,
        },
        {
          id: "music_lover",
          name: "Penikmat Musik",
          desc: "Memainkan BGM selama 5 menit",
          icon: "🎵",
          xp: 150,
          category: "music",
          rarity: "uncommon",
          isSecret: false,
          tracker: { type: "bgm_time", target: 300 }, // 300 detik
        },
        {
          id: "music_addict",
          name: "Kecanduan Musik",
          desc: "Memainkan BGM selama 1 jam total",
          icon: "🎧",
          xp: 500,
          category: "music",
          rarity: "epic",
          isSecret: false,
          tracker: { type: "bgm_time", target: 3600 },
        },
        {
          id: "dj_maple",
          name: "DJ Maple",
          desc: "Ganti track 20 kali dalam satu sesi",
          icon: "🎛️",
          xp: 300,
          category: "music",
          rarity: "rare",
          isSecret: true,
        },

        // ── EASTER EGG ACHIEVEMENTS ──
        {
          id: "secret_finder",
          name: "Pemburu Rahasia",
          desc: "Menemukan 3 easter egg",
          icon: "🥚",
          xp: 400,
          category: "secrets",
          rarity: "epic",
          isSecret: false,
          tracker: { type: "easter_eggs", target: 3 },
        },
        {
          id: "secret_master",
          name: "Master Rahasia",
          desc: "Menemukan semua easter egg",
          icon: "🐉",
          xp: 1000,
          category: "secrets",
          rarity: "legendary",
          isSecret: true,
          tracker: { type: "easter_eggs", target: "all" },
        },
        {
          id: "konami_code",
          name: "Kode Kuno",
          desc: "Masukkan Konami Code (↑↑↓↓←→←→BA)",
          icon: "🎮",
          xp: 800,
          category: "secrets",
          rarity: "legendary",
          isSecret: true,
        },
        {
          id: "console_wizard",
          name: "Penyihir Console",
          desc: "Buka DevTools dan ketik 'maple.power()'",
          icon: "🔮",
          xp: 500,
          category: "secrets",
          rarity: "epic",
          isSecret: true,
        },

        // ── SKILL ACHIEVEMENTS ──
        {
          id: "fast_clicker",
          name: "Klik Cepat",
          desc: "Klik 100 kali di area manapun",
          icon: "🖱️",
          xp: 200,
          category: "skills",
          rarity: "uncommon",
          isSecret: true,
          tracker: { type: "clicks", target: 100 },
        },
        {
          id: "scroll_master",
          name: "Master Scroll",
          desc: "Scroll sejauh 10,000px dalam satu sesi",
          icon: "📜",
          xp: 300,
          category: "skills",
          rarity: "rare",
          isSecret: true,
        },
      ];

      // Store achievements
      achievements.forEach((def) => {
        this.achievements.set(def.id, {
          ...def,
          unlocked: false,
          unlockedAt: null,
          progress: 0,
          progressTarget: def.tracker?.target || 0,
        });

        if (def.isSecret) {
          this.secrets.add(def.id);
        }
      });
    }

    _defineCategories() {
      this.categories = new Map([
        ["exploration", { name: "Eksplorasi", icon: "🗺️", color: "#4ade80" }],
        ["interaction", { name: "Interaksi", icon: "💬", color: "#60a5fa" }],
        ["projects", { name: "Proyek", icon: "📂", color: "#f59e0b" }],
        ["guide", { name: "Panduan", icon: "📖", color: "#a78bfa" }],
        ["music", { name: "Musik", icon: "🎵", color: "#f472b6" }],
        ["secrets", { name: "Rahasia", icon: "🔮", color: "#fb923c" }],
        ["skills", { name: "Keahlian", icon: "⚡", color: "#ef4444" }],
      ]);
    }

    // ═══════════════ TRACKING INITIALIZATION ═══════════════

    _initTrackers() {
      // Click tracking
      this._totalClicks = 0;
      document.addEventListener("click", () => {
        this._totalClicks++;
        this._updateTracker("fast_clicker", this._totalClicks);
      });

      // Scroll tracking
      this._totalScrollDistance = 0;
      let lastScrollY = window.scrollY;
      window.addEventListener("scroll", () => {
        this._totalScrollDistance += Math.abs(window.scrollY - lastScrollY);
        lastScrollY = window.scrollY;
        this._updateTracker(
          "scroll_master",
          Math.floor(this._totalScrollDistance / 100),
        );
      });

      // Konami Code detection
      this._konamiBuffer = [];
      const konamiCode = [
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
      document.addEventListener("keydown", (e) => {
        this._konamiBuffer.push(e.code);
        if (this._konamiBuffer.length > konamiCode.length) {
          this._konamiBuffer.shift();
        }
        if (this._konamiBuffer.join(",") === konamiCode.join(",")) {
          this.unlock("konami_code");
        }
      });

      // Console wizard detection
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

    _startBGMTracking() {
      // Track BGM play time
      setInterval(() => {
        if (this.audioManager?.isPlaying) {
          this.bgmPlayTime += 1;
          this._updateTracker("music_lover", this.bgmPlayTime);
          this._updateTracker("music_addict", this.bgmPlayTime);
        }
      }, 1000);
    }

    _checkSessionAchievements() {
      // Night owl check
      const hour = new Date().getHours();
      if (hour >= 0 && hour < 5) {
        setTimeout(() => this.unlock("night_owl"), 2000);
      }

      // Returning hero check
      this._checkConsecutiveDays();

      // Full moon check (approximately every 29.5 days)
      const fullMoonDate = this._getNextFullMoon();
      const today = new Date();
      if (Math.abs(today - fullMoonDate) < 86400000) {
        // Within 1 day
        setTimeout(() => this.unlock("full_moon_visitor"), 5000);
      }
    }

    _getNextFullMoon() {
      // Simplified full moon calculation
      const knownFullMoon = new Date("2024-01-25");
      const daysSince = (Date.now() - knownFullMoon) / 86400000;
      const lunarCycle = 29.53059;
      const cyclesSince = Math.floor(daysSince / lunarCycle);
      return new Date(
        knownFullMoon.getTime() + cyclesSince * lunarCycle * 86400000,
      );
    }

    // ═══════════════ ACHIEVEMENT MANAGEMENT ═══════════════

    setAudioManager(audioManager) {
      this.audioManager = audioManager;
    }

    unlock(achievementId) {
      const achievement = this.achievements.get(achievementId);
      if (!achievement || achievement.unlocked) return false;

      // Unlock achievement
      achievement.unlocked = true;
      achievement.unlockedAt = new Date().toISOString();
      achievement.progress = achievement.progressTarget;

      // Add XP
      this._addXP(achievement.xp);

      // Combo chain
      this._handleCombo();

      // Show notification
      this._showToast(achievement);

      // Trigger callbacks
      if (this.onAchievementUnlocked) {
        this.onAchievementUnlocked(achievement);
      }

      // Play sound
      if (achievement.rarity === "legendary") {
        this.audioManager?.playSFX("questClear");
      } else {
        this.audioManager?.playSFX("achievement");
      }

      // Special effects for rare achievements
      if (achievement.rarity === "legendary" || achievement.rarity === "epic") {
        this._triggerScreenEffect(achievement.rarity);
      }

      // Save progress
      this._saveToStorage();

      console.log(
        `🏆 Achievement Unlocked: ${achievement.name} | +${achievement.xp} XP | Level ${this.playerLevel}`,
      );

      return true;
    }

    _updateTracker(achievementId, currentValue) {
      const achievement = this.achievements.get(achievementId);
      if (!achievement || achievement.unlocked) return;

      const target = achievement.tracker?.target;
      if (!target) return;

      achievement.progress =
        typeof target === "number"
          ? Math.min(currentValue, target)
          : currentValue;
      achievement.progressTarget = target;

      // Auto-unlock if target reached
      if (typeof target === "number" && currentValue >= target) {
        this.unlock(achievementId);
      }
    }

    trackDialog() {
      this.dialogsCompleted++;
      this._updateTracker("dialog_initiate", 1);
      this._updateTracker("dialog_master", this.dialogsCompleted);
      this._updateTracker("dialog_legend", this.dialogsCompleted);

      // Auto unlock dialog_initiate on first dialog
      if (this.dialogsCompleted === 1) {
        this.unlock("dialog_initiate");
      }
    }

    trackProjectView(projectId) {
      this.projectsViewed.add(projectId);
      this._updateTracker("project_explorer", this.projectsViewed.size);
    }

    trackEasterEgg(easterEggId) {
      this.easterEggsFound.add(easterEggId);
      this._updateTracker("secret_finder", this.easterEggsFound.size);
      this._updateTracker("secret_master", this.easterEggsFound.size);
    }

    trackGuideStart() {
      this.unlock("guide_start");
      this._guideStartTime = Date.now();
    }

    trackGuideComplete() {
      const completionTime = (Date.now() - this._guideStartTime) / 1000;
      this.unlock("guide_complete");

      if (completionTime <= 30) {
        setTimeout(() => this.unlock("guide_speedrun"), 1000);
      }
    }

    trackMusicStart() {
      this.unlock("music_initiate");
    }

    _handleCombo() {
      this.comboCount++;

      if (this.comboTimer) {
        clearTimeout(this.comboTimer);
      }

      if (this.comboCount >= 3) {
        this._showComboEffect(this.comboCount);
      }

      this.comboTimer = setTimeout(() => {
        this.comboCount = 0;
      }, this.comboTimeout);
    }

    _addXP(amount) {
      this.totalXP += amount;

      // Check level up
      while (this.totalXP >= this.xpToNextLevel) {
        this.totalXP -= this.xpToNextLevel;
        this.playerLevel++;
        this.xpToNextLevel = Math.floor(this.xpToNextLevel * 1.5);

        // Level up effects
        this._showLevelUpEffect();

        if (this.onLevelUp) {
          this.onLevelUp(this.playerLevel);
        }

        this.audioManager?.playSFX("questClear");
      }

      this._updateXPBar();
    }

    // ═══════════════ UI METHODS ═══════════════

    _showToast(achievement) {
      if (!this.toastContainer) return;

      const rarityColors = {
        common: "#9ca3af",
        uncommon: "#4ade80",
        rare: "#60a5fa",
        epic: "#a78bfa",
        legendary: "#fbbf24",
      };

      const rarityNames = {
        common: "Common",
        uncommon: "Uncommon",
        rare: "Rare",
        epic: "Epic",
        legendary: "✦ Legendary ✦",
      };

      const toast = document.createElement("div");
      toast.className = `achievement-toast achievement-toast--${achievement.rarity}`;
      toast.style.setProperty(
        "--rarity-color",
        rarityColors[achievement.rarity],
      );

      toast.innerHTML = `
      <div class="achievement-toast__glow"></div>
      <span class="achievement-toast__icon">${achievement.icon}</span>
      <div class="achievement-toast__content">
        <span class="achievement-toast__rarity" style="color: ${rarityColors[achievement.rarity]}">
          ${rarityNames[achievement.rarity]}
        </span>
        <span class="achievement-toast__title">Achievement Unlocked!</span>
        <span class="achievement-toast__name">${achievement.name}</span>
        <span class="achievement-toast__desc">${achievement.desc}</span>
        <div class="achievement-toast__xp-bar">
          <span class="achievement-toast__xp">+${achievement.xp} XP</span>
          ${this.comboCount >= 3 ? `<span class="achievement-toast__combo">🔥 ${this.comboCount}x Combo!</span>` : ""}
        </div>
      </div>
      <button class="achievement-toast__close" onclick="this.parentElement.remove()">✕</button>
    `;

      this.toastContainer.appendChild(toast);

      // Animate in
      requestAnimationFrame(() => {
        toast.classList.add("achievement-toast--show");
      });

      // Auto remove
      const duration = achievement.rarity === "legendary" ? 6000 : 4000;
      setTimeout(() => {
        toast.classList.add("achievement-toast--fade-out");
        setTimeout(() => toast.remove(), 500);
      }, duration);
    }

    _showLevelUpEffect() {
      // Create floating level up text
      const levelUpText = document.createElement("div");
      levelUpText.className = "level-up-effect";
      levelUpText.innerHTML = `
      <span class="level-up-effect__icon">⬆️</span>
      <span class="level-up-effect__text">Level Up!</span>
      <span class="level-up-effect__level">Level ${this.playerLevel}</span>
    `;
      document.body.appendChild(levelUpText);

      setTimeout(() => levelUpText.remove(), 3000);

      if (this.levelElement) {
        this.levelElement.textContent = this.playerLevel;
        this.levelElement.classList.add("level-up-bounce");
        setTimeout(
          () => this.levelElement.classList.remove("level-up-bounce"),
          1000,
        );
      }
    }

    _showComboEffect(count) {
      console.log(`🔥 ${count}x Achievement Combo!`);
    }

    _triggerScreenEffect(rarity) {
      // Screen flash effect for rare achievements
      const flash = document.createElement("div");
      flash.className = `screen-flash screen-flash--${rarity}`;
      document.body.appendChild(flash);
      setTimeout(() => flash.remove(), 1000);
    }

    _updateXPBar() {
      if (!this.xpBarElement) return;

      const progress = (this.totalXP / this.xpToNextLevel) * 100;
      this.xpBarElement.style.width = `${progress}%`;
      this.xpBarElement.setAttribute("aria-valuenow", Math.floor(progress));
    }

    // ═══════════════ DATA METHODS ═══════════════

    getStats() {
      const unlocked = this.getUnlockedCount();
      const total = this.achievements.size;
      const byCategory = {};

      this.categories.forEach((cat, key) => {
        const catAchievements = Array.from(this.achievements.values()).filter(
          (a) => a.category === key,
        );
        byCategory[key] = {
          name: cat.name,
          icon: cat.icon,
          total: catAchievements.length,
          unlocked: catAchievements.filter((a) => a.unlocked).length,
        };
      });

      return {
        level: this.playerLevel,
        xp: this.totalXP,
        xpToNextLevel: this.xpToNextLevel,
        totalAchievements: total,
        unlockedAchievements: unlocked,
        completionPercent: ((unlocked / total) * 100).toFixed(1),
        totalXP: this.getTotalXP(),
        byCategory,
        rareAchievements: Array.from(this.achievements.values())
          .filter(
            (a) =>
              a.unlocked && (a.rarity === "legendary" || a.rarity === "epic"),
          )
          .map((a) => ({ name: a.name, rarity: a.rarity })),
      };
    }

    getAchievementList(category = null, showSecrets = false) {
      return Array.from(this.achievements.values())
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

    getUnlockedCount() {
      return Array.from(this.achievements.values()).filter((a) => a.unlocked)
        .length;
    }

    getTotalXP() {
      return Array.from(this.achievements.values())
        .filter((a) => a.unlocked)
        .reduce((sum, a) => sum + a.xp, 0);
    }

    isUnlocked(achievementId) {
      return this.achievements.get(achievementId)?.unlocked || false;
    }

    // ═══════════════ PERSISTENCE ═══════════════

    _saveToStorage() {
      try {
        const saveData = {
          achievements: Array.from(this.achievements.entries()).map(
            ([id, a]) => ({
              id,
              unlocked: a.unlocked,
              unlockedAt: a.unlockedAt,
              progress: a.progress,
            }),
          ),
          playerLevel: this.playerLevel,
          totalXP: this.totalXP,
          xpToNextLevel: this.xpToNextLevel,
          totalClicks: this._totalClicks,
          dialogsCompleted: this.dialogsCompleted,
          bgmPlayTime: this.bgmPlayTime,
          easterEggsFound: Array.from(this.easterEggsFound),
          projectsViewed: Array.from(this.projectsViewed),
          visitHistory: this._updateVisitHistory(),
        };

        localStorage.setItem("maple_achievements_v2", JSON.stringify(saveData));
      } catch (e) {
        console.warn("Failed to save achievements:", e.message);
      }
    }

    _loadFromStorage() {
      try {
        const raw = localStorage.getItem("maple_achievements_v2");
        if (!raw) {
          // Try loading from old version
          this._migrateFromV1();
          return;
        }

        const saveData = JSON.parse(raw);

        // Restore achievements
        saveData.achievements?.forEach((saved) => {
          const achievement = this.achievements.get(saved.id);
          if (achievement) {
            achievement.unlocked = saved.unlocked;
            achievement.unlockedAt = saved.unlockedAt;
            achievement.progress = saved.progress || 0;
          }
        });

        // Restore player stats
        this.playerLevel = saveData.playerLevel || 1;
        this.totalXP = saveData.totalXP || 0;
        this.xpToNextLevel = saveData.xpToNextLevel || 100;
        this._totalClicks = saveData.totalClicks || 0;
        this.dialogsCompleted = saveData.dialogsCompleted || 0;
        this.bgmPlayTime = saveData.bgmPlayTime || 0;
        this.easterEggsFound = new Set(saveData.easterEggsFound || []);
        this.projectsViewed = new Set(saveData.projectsViewed || []);

        this._updateXPBar();
      } catch (e) {
        console.warn("Failed to load achievements:", e.message);
      }
    }

    _migrateFromV1() {
      try {
        const oldData = localStorage.getItem("maple_achievements");
        if (!oldData) return;

        const achievements = JSON.parse(oldData);
        achievements.forEach((saved) => {
          const achievement = this.achievements.get(saved.id);
          if (achievement) {
            achievement.unlocked = saved.unlocked;
            achievement.unlockedAt = saved.unlockedAt;
          }
        });

        console.log("📦 Migrated achievements from v1");
        this._saveToStorage();
        localStorage.removeItem("maple_achievements"); // Clean old data
      } catch (e) {}
    }

    _updateVisitHistory() {
      try {
        const raw = localStorage.getItem("maple_visit_history");
        const history = raw ? JSON.parse(raw) : [];
        const today = new Date().toDateString();

        if (history[history.length - 1] !== today) {
          history.push(today);
          if (history.length > 30) history.shift(); // Keep last 30 days
        }

        localStorage.setItem("maple_visit_history", JSON.stringify(history));
        return history;
      } catch (e) {
        return [];
      }
    }

    _checkConsecutiveDays() {
      try {
        const raw = localStorage.getItem("maple_visit_history");
        if (!raw) return;

        const history = JSON.parse(raw);
        if (history.length < 3) return;

        const last3Days = history.slice(-3);
        const dates = last3Days.map((d) => new Date(d));

        // Check if dates are consecutive
        let isConsecutive = true;
        for (let i = 1; i < dates.length; i++) {
          const diff = (dates[i] - dates[i - 1]) / 86400000;
          if (Math.abs(diff - 1) > 0.1) {
            isConsecutive = false;
            break;
          }
        }

        if (isConsecutive) {
          setTimeout(() => this.unlock("returning_hero"), 1000);
        }
      } catch (e) {}
    }

    // ═══════════════ RESET ═══════════════

    resetAll() {
      if (
        confirm(
          "Apakah kamu yakin ingin mereset semua achievement? Ini tidak bisa dibatalkan!",
        )
      ) {
        this.achievements.forEach((a) => {
          a.unlocked = false;
          a.unlockedAt = null;
          a.progress = 0;
        });
        this.playerLevel = 1;
        this.totalXP = 0;
        this.xpToNextLevel = 100;
        this._saveToStorage();
        this._updateXPBar();
        console.log("🔄 All achievements reset");
        return true;
      }
      return false;
    }
  }
  // ═══════════════════════════════════════════
  // 6. GITHUB API MANAGER - MULTI-SOURCE
  // ═══════════════════════════════════════════
  // ═══════════════════════════════════════════
  // 6. GITHUB MANAGER v2.0 - ENHANCED
  // ═══════════════════════════════════════════
  class GitHubManager {
    constructor(username) {
      this.username = username;

      // Data stores
      this.repositories = [];
      this.profile = null;
      this.contributionData = null;
      this.languageStats = null;
      this.organizationData = [];

      // State management
      this.isLoaded = false;
      this.isLoading = false;
      this.loadProgress = 0;
      this.lastFetchTime = null;

      // Totals
      this.totalCommits = 0;
      this.totalStars = 0;
      this.totalForks = 0;
      this.totalWatchers = 0;
      this.totalContributors = 0;

      // Infrastructure
      this.cache = new CacheManager();
      this.requestQueue = new RequestQueue();
      this.rateLimiter = new RateLimiter({
        maxRequests: 60,
        perTimeWindow: 3600000, // 1 jam
        minDelay: 100, // Minimum 100ms antar request
      });

      // API Configuration
      this.API_BASE = CONFIG.CUSTOM_API_BASE;
      this.GITHUB_API = CONFIG.GITHUB_API_BASE;
      this.GITHUB_RAW = `${CONFIG.GITHUB_RAW_BASE}/${username}`;

      // Event hooks
      this.onProgress = null;
      this.onError = null;
      this.onComplete = null;

      // Filters & sorting
      this.excludedRepos = new Set(); // Repos to exclude
      this.pinnedRepos = new Set(); // Repos to highlight

      // Background sync
      this.syncInterval = null;
      this.autoSyncEnabled = false;

      console.log(`📦 GitHubManager Initialized | User: ${username}`);
    }

    // ═══════════════ REQUEST INFRASTRUCTURE ═══════════════

    async _fetchWithRetry(url, options = {}) {
      const {
        retries = CONFIG.RETRY_MAX,
        retryDelay = CONFIG.RETRY_DELAY,
        timeout = 15000,
        headers = {},
        priority = 1,
        useRateLimit = true,
      } = options;

      // Wait for rate limiter if needed
      if (useRateLimit) {
        await this.rateLimiter.acquire();
      }

      for (let attempt = 0; attempt < retries; attempt++) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        try {
          const response = await fetch(url, {
            signal: controller.signal,
            headers: {
              Accept: "application/json",
              ...headers,
            },
          });

          clearTimeout(timeoutId);

          // Handle rate limiting
          if (
            response.status === 403 &&
            response.headers.get("X-RateLimit-Remaining") === "0"
          ) {
            const resetTime =
              parseInt(response.headers.get("X-RateLimit-Reset")) * 1000;
            const waitTime = resetTime - Date.now();

            if (waitTime > 0 && waitTime < 300000) {
              // Max wait 5 minutes
              console.warn(
                `⏳ Rate limited. Waiting ${Math.ceil(waitTime / 1000)}s...`,
              );
              await this._sleep(waitTime + 1000);
              continue;
            }
            throw new Error("Rate limited - please try again later");
          }

          if (response.status === 404) {
            throw new Error(`Not found: ${url}`);
          }

          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }

          return response;
        } catch (error) {
          clearTimeout(timeoutId);

          if (error.name === "AbortError") {
            console.warn(`⏱️ Request timeout: ${url}`);
          }

          console.warn(
            `⚠️ Attempt ${attempt + 1}/${retries}: ${error.message}`,
          );

          if (attempt < retries - 1) {
            const delay =
              retryDelay * Math.pow(2, attempt) + Math.random() * 1000;
            await this._sleep(delay);
          } else {
            throw error;
          }
        }
      }
    }

    _sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }

    // ═══════════════ FETCH USER PROFILE ═══════════════

    async fetchUserProfile() {
      const cacheKey = `profile_${this.username}`;
      const cached = this.cache.get(cacheKey);
      if (cached) {
        this.profile = cached;
        return cached;
      }

      console.log("👤 Fetching user profile...");

      try {
        // Strategy 1: Custom API
        const profile = await this._fetchProfileFromCustomAPI();
        if (profile) {
          this.profile = profile;
          this.cache.set(cacheKey, profile, 1800000); // 30 menit
          return profile;
        }
      } catch (e) {
        console.warn("Custom API profile failed:", e.message);
      }

      try {
        // Strategy 2: GitHub API
        const profile = await this._fetchProfileFromGitHubAPI();
        if (profile) {
          this.profile = profile;
          this.cache.set(cacheKey, profile, 1800000);
          return profile;
        }
      } catch (e) {
        console.warn("GitHub API profile failed:", e.message);
      }

      // Strategy 3: Construct minimal profile from repos
      return this._buildMinimalProfile();
    }

    async _fetchProfileFromCustomAPI() {
      const url = `${this.API_BASE}/api/github?action=user&username=${this.username}`;
      const response = await this._fetchWithRetry(url, { retries: 1 });
      const data = await response.json();

      const profile = data.user || data.profile || data;
      if (profile.login || profile.name) {
        return this._normalizeProfile(profile);
      }
      return null;
    }

    async _fetchProfileFromGitHubAPI() {
      const url = `${this.GITHUB_API}/users/${this.username}`;
      const response = await this._fetchWithRetry(url, { retries: 2 });
      const data = await response.json();
      return this._normalizeProfile(data);
    }

    _normalizeProfile(data) {
      return {
        login: data.login || this.username,
        name: data.name || data.login || this.username,
        avatar_url: data.avatar_url || null,
        bio: data.bio || null,
        public_repos: data.public_repos || 0,
        followers: data.followers || 0,
        following: data.following || 0,
        created_at: data.created_at || null,
        updated_at: data.updated_at || null,
        html_url: data.html_url || `https://github.com/${this.username}`,
        blog: data.blog || null,
        location: data.location || null,
        company: data.company || null,
        twitter_username: data.twitter_username || null,
      };
    }

    _buildMinimalProfile() {
      const profile = {
        login: this.username,
        name: this.username,
        avatar_url: null,
        bio: null,
        public_repos: this.repositories.length,
        followers: 0,
        following: 0,
        created_at: this._getOldestRepoDate(),
        updated_at: this._getNewestRepoDate(),
        html_url: `https://github.com/${this.username}`,
      };

      this.profile = profile;
      this.cache.set(`profile_${this.username}`, profile, 900000); // 15 menit
      return profile;
    }

    // ═══════════════ FETCH ALL REPOS ═══════════════

    async fetchAllRepos(options = {}) {
      const {
        forceRefresh = false,
        includeForks = true,
        sortBy = "updated",
        onProgress = null,
      } = options;

      // Check cache first
      if (!forceRefresh) {
        const cached = this.cache.get(`repos_${this.username}`);
        if (cached) {
          console.log("📦 Using cached repositories");
          this.repositories = cached;
          this.isLoaded = true;
          this._calculateTotals();
          this._updateProgress(100);
          return this.repositories;
        }
      }

      if (this.isLoading) {
        console.log("⏳ Already loading repositories...");
        return this.repositories;
      }

      this.isLoading = true;
      this._updateProgress(5);

      console.log("🔍 Fetching repositories...");

      try {
        // Multi-source fetch dengan prioritas
        let repos = await this._fetchReposFromCustomAPI();
        this._updateProgress(30);

        if (!repos || repos.length === 0) {
          repos = await this._fetchReposFromGitHubAPI(includeForks);
          this._updateProgress(50);
        }

        if (!repos || repos.length === 0) {
          throw new Error("No repositories found from any source");
        }

        // Filter dan sort
        repos = repos
          .filter((repo) => !this.excludedRepos.has(repo.name))
          .sort(this._sortRepos(sortBy));

        this._updateProgress(60);

        // Fetch README untuk featured repos terlebih dahulu
        console.log(`📄 Fetching README for ${repos.length} repos...`);
        const reposWithReadme = await this._fetchReadmesPrioritized(
          repos,
          (progress) => {
            this._updateProgress(60 + Math.floor(progress * 0.35));
          },
        );

        this.repositories = reposWithReadme;
        this.isLoaded = true;
        this.isLoading = false;
        this.lastFetchTime = Date.now();

        this._calculateTotals();
        this.cache.set(`repos_${this.username}`, reposWithReadme);

        this._updateProgress(100);

        // Trigger callback
        if (this.onComplete) {
          this.onComplete(reposWithReadme);
        }

        console.log(`✅ Loaded ${reposWithReadme.length} repositories`);
        return reposWithReadme;
      } catch (error) {
        console.error("❌ Failed to fetch repos:", error.message);

        // Try stale cache
        const staleCache = this._getStaleCache(`repos_${this.username}`);
        if (staleCache) {
          console.warn("⚠️ Using stale cache data");
          this.repositories = staleCache;
          this.isLoaded = true;
          this.isLoading = false;
          this._calculateTotals();
          return staleCache;
        }

        this.isLoading = false;

        if (this.onError) {
          this.onError(error);
        }

        throw error;
      }
    }

    async _fetchReposFromCustomAPI() {
      try {
        const url = `${this.API_BASE}/api/github?action=repos&username=${this.username}&per_page=100`;
        console.log(`📡 Custom API: ${url}`);

        const response = await this._fetchWithRetry(url, {
          retries: 1,
          priority: 2,
        });
        const data = await response.json();

        let repos = [];
        if (data.success && Array.isArray(data.repos)) {
          repos = data.repos;
        } else if (Array.isArray(data)) {
          repos = data;
        }

        return repos.length > 0 ? this._normalizeRepos(repos) : null;
      } catch (e) {
        console.warn("Custom API repos failed:", e.message);
        return null;
      }
    }

    async _fetchReposFromGitHubAPI(includeForks = true) {
      const allRepos = [];
      let page = 1;
      let hasMore = true;

      while (hasMore) {
        try {
          const url = `${this.GITHUB_API}/users/${this.username}/repos?sort=updated&per_page=100&page=${page}`;
          console.log(`📡 GitHub API (page ${page}): ${url}`);

          const response = await this._fetchWithRetry(url, {
            retries: 2,
            priority: 1,
          });
          const repos = await response.json();

          if (!Array.isArray(repos) || repos.length === 0) {
            hasMore = false;
          } else {
            allRepos.push(...repos);
            page++;

            // Check if we might have more
            hasMore = repos.length === 100;
          }
        } catch (e) {
          console.warn(`GitHub API page ${page} failed:`, e.message);
          hasMore = false;
        }
      }

      if (!includeForks) {
        return allRepos.filter((r) => !r.fork);
      }

      return allRepos.length > 0 ? this._normalizeRepos(allRepos) : null;
    }

    // ═══════════════════════════════════════════
    // PERBAIKAN 1: Normalize Repos (Tambahkan pushed_at)
    // ═══════════════════════════════════════════
    _normalizeRepos(repos) {
      return repos.map((repo) => ({
        // Core fields
        id: repo.id || repo.name,
        name: repo.name || repo.repo || "unknown",
        full_name: repo.full_name || `${this.username}/${repo.name}`,
        description: repo.description || null,
        language: repo.language || null,

        // Stats
        stargazers_count: repo.stargazers_count || repo.stars || 0,
        forks_count: repo.forks_count || repo.forks || 0,
        watchers_count: repo.watchers_count || repo.watchers || 0,
        open_issues_count: repo.open_issues_count || repo.open_issues || 0,
        size: repo.size || 0,

        // URLs
        html_url:
          repo.html_url ||
          repo.url ||
          `https://github.com/${this.username}/${repo.name}`,
        homepage: repo.homepage || null,
        clone_url: repo.clone_url || null,

        // Flags
        fork: repo.fork || false,
        has_pages: repo.has_pages || Boolean(repo.homepage),
        has_issues: repo.has_issues !== false,
        has_projects: repo.has_projects !== false,
        has_wiki: repo.has_wiki !== false,
        archived: repo.archived || false,
        disabled: repo.disabled || false,

        // ⚠️ DATES - TAMBAHKAN pushed_at!
        created_at:
          repo.created_at || repo.createdAt || new Date().toISOString(),
        updated_at:
          repo.updated_at || repo.updatedAt || new Date().toISOString(),
        pushed_at: repo.pushed_at || repo.pushedAt || repo.updated_at || null, // ← TAMBAHKAN!

        // Metadata
        topics: repo.topics || [],
        license: repo.license?.spdx_id || repo.license || null,
        default_branch: repo.default_branch || "main",
        is_template: repo.is_template || false,

        // Custom
        isPinned: this.pinnedRepos.has(repo.name),
        readme: null,
        category: null,
        score: 0,
      }));
    }

    // ═══════════════ README FETCHING (PRIORITIZED) ═══════════════

    // Di dalam GitHubManager class, tambahkan/modifikasi method ini:

    async _fetchReadmesPrioritized(repos, progressCallback = null) {
      // Phase 1: HANYA fetch README untuk featured repos (top 6)
      const featured = [...repos]
        .filter((r) => !r.fork || r.stargazers_count > 0)
        .sort((a, b) => b.stargazers_count - a.stargazers_count)
        .slice(0, 6);

      console.log(
        `📄 Fetching README for ${featured.length} featured repos...`,
      );

      // Fetch README dengan rate limiting yang lebih ketat
      const featuredResults = [];
      for (const repo of featured) {
        try {
          const readme = await this.fetchReadme(repo.name);
          featuredResults.push({ ...repo, readme });
        } catch (e) {
          featuredResults.push({ ...repo, readme: null });
        }
        // Tambahkan delay antar request
        await this._sleep(200);
      }

      if (progressCallback) progressCallback(0.5);

      // Phase 2: Skip README untuk repos lainnya jika tidak diperlukan
      const others = repos.filter((r) => !featured.includes(r));
      const othersWithReadme = others.map((repo) => ({
        ...repo,
        readme: null,
      }));

      if (progressCallback) progressCallback(1.0);

      return [...featuredResults, ...othersWithReadme];
    }

    async fetchReadme(repoName) {
      const cacheKey = `readme_${repoName}`;

      // Cek cache terlebih dahulu
      const cached = this.cache.get(cacheKey);
      if (cached) {
        return cached;
      }

      // Cek apakah repo ini punya README (dari data repo)
      const repo = this.repositories.find((r) => r.name === repoName);
      if (repo?.size === 0) {
        // Repo kosong, skip
        return null;
      }

      try {
        // Strategy 1: Custom API (paling cepat jika berhasil)
        const readme = await this._fetchReadmeFromCustomAPI(repoName);
        if (readme) {
          this.cache.set(cacheKey, readme, 3600000); // 1 jam
          return readme;
        }
      } catch (e) {
        // Custom API failed, try next
      }

      try {
        // Strategy 2: GitHub API
        const readme = await this._fetchReadmeFromGitHubAPI(repoName);
        if (readme) {
          this.cache.set(cacheKey, readme, 3600000);
          return readme;
        }
      } catch (e) {
        // GitHub API failed
      }

      // Strategy 3: Raw hanya untuk branch main/master (jangan coba semua)
      try {
        const readme = await this._fetchReadmeFromRawOptimized(repoName);
        if (readme) {
          this.cache.set(cacheKey, readme, 3600000);
          return readme;
        }
      } catch (e) {
        // Raw failed
      }

      // Cache null result untuk menghindari repeat attempts
      this.cache.set(cacheKey, null, 1800000); // 30 menit
      return null;
    }

    async _fetchReadmeFromRawOptimized(repoName) {
      // HANYA coba branch main dan master, HANYA README.md
      const branches = ["main", "master"];

      for (const branch of branches) {
        try {
          const url = `${this.GITHUB_RAW}/${repoName}/${branch}/README.md`;
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 3000); // 3 detik timeout

          const response = await fetch(url, { signal: controller.signal });
          clearTimeout(timeout);

          if (response.ok) {
            const text = await response.text();
            if (text && text.length > 10 && !text.includes("<!DOCTYPE html>")) {
              return text;
            }
          }
        } catch (e) {
          continue;
        }
      }

      return null;
    }
    async _fetchReadmesInBatches(
      repos,
      batchSize = 5,
      progressCallback = null,
    ) {
      const results = [];
      const totalBatches = Math.ceil(repos.length / batchSize);

      for (let i = 0; i < repos.length; i += batchSize) {
        const batch = repos.slice(i, i + batchSize);
        const batchNumber = Math.floor(i / batchSize) + 1;

        const batchResults = await Promise.allSettled(
          batch.map(async (repo) => {
            const readme = await this.fetchReadme(repo.name);
            return { ...repo, readme };
          }),
        );

        results.push(
          ...batchResults.map((r, idx) =>
            r.status === "fulfilled"
              ? r.value
              : { ...batch[idx], readme: null },
          ),
        );

        const progress = batchNumber / totalBatches;
        if (progressCallback) progressCallback(progress);

        console.log(
          `  📄 README: ${Math.min(i + batchSize, repos.length)}/${repos.length} (${Math.floor(progress * 100)}%)`,
        );
      }

      return results;
    }

    async fetchReadme(repoName) {
      const cacheKey = `readme_${repoName}`;
      const cached = this.cache.get(cacheKey);
      if (cached) return cached;

      // Try all strategies in parallel for speed
      const strategies = [
        () => this._fetchReadmeFromCustomAPI(repoName),
        () => this._fetchReadmeFromGitHubAPI(repoName),
        () => this._fetchReadmeFromRaw(repoName),
      ];

      for (const strategy of strategies) {
        try {
          const readme = await strategy();
          if (readme) {
            this.cache.set(cacheKey, readme, 3600000); // 1 hour
            return readme;
          }
        } catch (e) {
          // Continue to next strategy
        }
      }

      return null;
    }

    async _fetchReadmeFromCustomAPI(repoName) {
      const url = `${this.API_BASE}/api/github?action=readme&username=${this.username}&repo=${repoName}`;
      const response = await this._fetchWithRetry(url, {
        retries: 1,
        timeout: 8000,
      });
      if (!response.ok) return null;

      const data = await response.json();
      return data.readme &&
        typeof data.readme === "string" &&
        data.readme.length > 10
        ? data.readme
        : null;
    }

    async _fetchReadmeFromGitHubAPI(repoName) {
      const url = `${this.GITHUB_API}/repos/${this.username}/${repoName}/readme`;
      const response = await this._fetchWithRetry(url, {
        headers: { Accept: "application/vnd.github.v3.raw" },
        timeout: 10000,
      });

      if (!response.ok) return null;
      const text = await response.text();
      return text && text.length > 10 && !text.includes("<!DOCTYPE html>")
        ? text
        : null;
    }

    async _fetchReadmeFromRaw(repoName) {
      // ⛔ HANYA 2 PERCOBAAN! Jangan coba semua kombinasi!
      const attempts = [
        `https://raw.githubusercontent.com/${this.username}/${repoName}/main/README.md`,
        `https://raw.githubusercontent.com/${this.username}/${repoName}/master/README.md`,
      ];

      for (const url of attempts) {
        try {
          // ⏱️ Timeout 3 detik
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 3000);

          const response = await fetch(url, { signal: controller.signal });
          clearTimeout(timeout);

          if (response.ok) {
            const text = await response.text();
            if (text && text.length > 10 && !text.includes("<!DOCTYPE html>")) {
              console.log(`✅ README found: ${repoName}`);
              return text;
            }
          }
        } catch (e) {
          // Skip error, coba next attempt
          continue;
        }
      }

      // Jika tidak ditemukan, return null (JANGAN coba branch/filename lain!)
      console.log(`📭 No README for: ${repoName}`);
      return null;
    }

    // ═══════════════════════════════════════════
    // TAMBAHKAN: Cache untuk repo tanpa README
    // ═══════════════════════════════════════════

    async fetchReadme(repoName) {
      const cacheKey = `readme_${repoName}`;

      // Cek cache
      const cached = this.cache.get(cacheKey);
      if (cached !== undefined) {
        return cached; // Bisa null (jika sebelumnya tidak ditemukan)
      }

      let readme = null;

      // Strategy 1: Custom API
      try {
        readme = await this._fetchReadmeFromCustomAPI(repoName);
        if (readme) {
          this.cache.set(cacheKey, readme, 3600000);
          return readme;
        }
      } catch (e) {}

      // Strategy 2: GitHub API
      try {
        readme = await this._fetchReadmeFromGitHubAPI(repoName);
        if (readme) {
          this.cache.set(cacheKey, readme, 3600000);
          return readme;
        }
      } catch (e) {}

      // Strategy 3: Raw (HANYA 2 attempts!)
      try {
        readme = await this._fetchReadmeFromRaw(repoName);
        if (readme) {
          this.cache.set(cacheKey, readme, 3600000);
          return readme;
        }
      } catch (e) {}

      // ⚠️ PENTING: Cache null result juga!
      // Ini mencegah 404 storm di masa depan
      this.cache.set(cacheKey, null, 1800000); // 30 menit
      return null;
    }

    // ═══════════════════════════════════════════
    // TAMBAHKAN: Batasi jumlah README fetch paralel
    // ═══════════════════════════════════════════

    async _fetchReadmesInBatches(repos, batchSize = 2) {
      // Kurangi batch size!
      const results = [];

      // ⚠️ HANYA fetch untuk repo yang punya konten
      const reposToFetch = repos.filter((repo) => {
        if (!repo.size || repo.size < 50) {
          console.log(`⏭️ Skipping ${repo.name} (size: ${repo.size || 0})`);
          return false;
        }
        return true;
      });

      // ⚠️ BATASI maksimal 6 repo
      const limitedRepos = reposToFetch.slice(0, 6);

      console.log(
        `📄 Fetching README for ${limitedRepos.length} repos (limited to 6)`,
      );

      for (let i = 0; i < limitedRepos.length; i += batchSize) {
        const batch = limitedRepos.slice(i, i + batchSize);

        const batchResults = await Promise.allSettled(
          batch.map(async (repo) => {
            try {
              const readme = await this.fetchReadme(repo.name);
              return { ...repo, readme };
            } catch (e) {
              return { ...repo, readme: null };
            }
          }),
        );

        results.push(
          ...batchResults.map((r, idx) =>
            r.status === "fulfilled"
              ? r.value
              : { ...batch[idx], readme: null },
          ),
        );

        console.log(
          `  📄 README: ${Math.min(i + batchSize, limitedRepos.length)}/${limitedRepos.length}`,
        );

        // ⚠️ Delay antar batch untuk menghindari rate limit
        if (i + batchSize < limitedRepos.length) {
          await this._sleep(500);
        }
      }

      // Tambahkan repos yang tidak di-fetch
      const skippedRepos = repos.filter((r) => !limitedRepos.includes(r));
      return [...results, ...skippedRepos.map((r) => ({ ...r, readme: null }))];
    }
    // ═══════════════ TOTAL COMMITS CALCULATION ═══════════════

    async fetchTotalCommits() {
      const cacheKey = `commits_${this.username}`;
      const cached = this.cache.get(cacheKey);
      if (cached) {
        this.totalCommits = cached;
        return cached;
      }

      console.log("📊 Calculating total commits...");

      try {
        // Strategy 1: Custom API
        const commits = await this._fetchCommitsFromCustomAPI();
        if (commits) {
          this.totalCommits = commits;
          this.cache.set(cacheKey, commits, 7200000); // 2 hours
          return commits;
        }
      } catch (e) {
        console.warn("Custom API commits failed:", e.message);
      }

      try {
        // Strategy 2: GitHub Events API
        const commits = await this._estimateCommitsFromEvents();
        if (commits) {
          this.totalCommits = commits;
          this.cache.set(cacheKey, commits, 3600000);
          return commits;
        }
      } catch (e) {
        console.warn("Events API estimation failed:", e.message);
      }

      // Strategy 3: Rough estimation
      const estimatedCommits = this.repositories.length * 15;
      this.totalCommits = estimatedCommits;
      this.cache.set(cacheKey, estimatedCommits, 1800000); // 30 minutes
      return estimatedCommits;
    }

    async _fetchCommitsFromCustomAPI() {
      const url = `${this.API_BASE}/api/github?action=commits&username=${this.username}`;
      const response = await this._fetchWithRetry(url, { retries: 1 });
      const data = await response.json();

      const total = data.total_commits || data.total || 0;
      return total > 0 ? total : null;
    }

    async _estimateCommitsFromEvents() {
      const url = `${this.GITHUB_API}/users/${this.username}/events/public?per_page=100`;
      const response = await this._fetchWithRetry(url, { retries: 2 });
      const events = await response.json();

      const pushEvents = events.filter((e) => e.type === "PushEvent");
      const recentCommits = pushEvents.reduce(
        (sum, e) => sum + (e.payload?.commits?.length || 0),
        0,
      );

      // Extrapolate to yearly estimate
      const daysCovered = 90; // Events API covers ~90 days
      const yearlyEstimate = Math.round((recentCommits / daysCovered) * 365);

      return yearlyEstimate > 0 ? yearlyEstimate : null;
    }

    // ═══════════════ LANGUAGE ANALYTICS ═══════════════

    getLanguageStats() {
      if (this.languageStats) return this.languageStats;

      const stats = {};
      let totalBytes = 0;

      this.repositories.forEach((repo) => {
        if (repo.language) {
          stats[repo.language] = (stats[repo.language] || 0) + 1;
          totalBytes += repo.size || 0;
        }
      });

      this.languageStats = {
        byCount: Object.entries(stats)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 10)
          .reduce((obj, [k, v]) => {
            obj[k] = v;
            return obj;
          }, {}),
        topLanguage:
          Object.entries(stats).sort((a, b) => b[1] - a[1])[0]?.[0] || null,
        totalLanguages: Object.keys(stats).length,
        totalBytes,
      };

      return this.languageStats;
    }

    // ═══════════════ REPO CATEGORIZATION ═══════════════

    categorizeRepo(repo) {
      if (repo.category) return repo.category;

      const text = [
        repo.name || "",
        repo.description || "",
        repo.language || "",
        ...(repo.topics || []),
      ]
        .join(" ")
        .toLowerCase();

      // Game development
      if (
        text.includes("game") ||
        text.includes("unity") ||
        text.includes("godot") ||
        text.includes("unreal") ||
        text.includes("rpg") ||
        text.includes("puzzle")
      ) {
        return "game";
      }

      // Design & UI
      if (
        text.includes("design") ||
        text.includes("figma") ||
        text.includes("ui") ||
        text.includes("ux") ||
        text.includes("art") ||
        text.includes("animation") ||
        text.includes("css-art") ||
        text.includes("creative")
      ) {
        return "design";
      }

      // Web development
      if (
        repo.homepage ||
        repo.has_pages ||
        [
          "html",
          "css",
          "javascript",
          "typescript",
          "jsx",
          "tsx",
          "vue",
          "react",
          "svelte",
          "angular",
        ].includes(repo.language?.toLowerCase() || "") ||
        text.includes("website") ||
        text.includes("web") ||
        text.includes("frontend") ||
        text.includes("spa")
      ) {
        return "web";
      }

      // Tools & CLI
      if (
        text.includes("tool") ||
        text.includes("cli") ||
        text.includes("utility") ||
        text.includes("helper") ||
        text.includes("automation") ||
        text.includes("bot")
      ) {
        return "tools";
      }

      // Documentation
      if (
        text.includes("docs") ||
        text.includes("documentation") ||
        text.includes("wiki") ||
        text.includes("tutorial") ||
        text.includes("guide") ||
        text.includes("cheatsheet")
      ) {
        return "docs";
      }

      return "other";
    }

    // ═══════════════ FILTERING & SORTING ═══════════════

    getFilteredRepos(filter = "all", sortBy = "stars") {
      let filtered = [...this.repositories];

      // Apply filter
      if (filter !== "all") {
        filtered = filtered.filter((r) => this.categorizeRepo(r) === filter);
      }

      // Apply sorting
      filtered.sort(this._sortRepos(sortBy));

      return filtered;
    }

    _sortRepos(sortBy = "stars") {
      const sortFunctions = {
        stars: (a, b) => b.stargazers_count - a.stargazers_count,
        forks: (a, b) => b.forks_count - a.forks_count,
        updated: (a, b) => new Date(b.updated_at) - new Date(a.updated_at),
        created: (a, b) => new Date(b.created_at) - new Date(a.created_at),
        name: (a, b) => a.name.localeCompare(b.name),
        size: (a, b) => (b.size || 0) - (a.size || 0),
        score: (a, b) => {
          const scoreA =
            (a.stargazers_count || 0) * 3 +
            (a.forks_count || 0) * 2 +
            (a.watchers_count || 0);
          const scoreB =
            (b.stargazers_count || 0) * 3 +
            (b.forks_count || 0) * 2 +
            (b.watchers_count || 0);
          return scoreB - scoreA;
        },
      };

      return sortFunctions[sortBy] || sortFunctions.stars;
    }

    getFeaturedRepos(count = CONFIG.FEATURED_COUNT) {
      return [...this.repositories]
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
      return this.repositories.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          (r.description && r.description.toLowerCase().includes(q)) ||
          (r.topics && r.topics.some((t) => t.toLowerCase().includes(q))),
      );
    }

    // ═══════════════ TOTALS CALCULATION ═══════════════
    // ═══════════════════════════════════════════
    // PERBAIKAN 2: Calculate Totals (Tambahkan lastActiveDate)
    // ═══════════════════════════════════════════
    _calculateTotals() {
      this.totalStars = this.repositories.reduce(
        (sum, r) => sum + (r.stargazers_count || 0),
        0,
      );
      this.totalForks = this.repositories.reduce(
        (sum, r) => sum + (r.forks_count || 0),
        0,
      );
      this.totalWatchers = this.repositories.reduce(
        (sum, r) => sum + (r.watchers_count || 0),
        0,
      );

      // ⚠️ TAMBAHKAN: Calculate last active date dari pushed_at
      this.lastActiveDate = this._getLastActiveDate();
      this._oldestRepoDate = this._getOldestRepoDate();
      this._newestRepoDate = this._getNewestRepoDate();

      console.log(
        `🕐 Last active (calculated): ${this.lastActiveDate ? timeAgo(this.lastActiveDate) : "N/A"}`,
      );
    }

    // ⚠️ TAMBAHKAN: Method untuk mendapatkan last active date
    _getLastActiveDate() {
      if (this.repositories.length === 0) return null;

      // Cari pushed_at terbaru dari semua repo
      const dates = this.repositories
        .map((repo) => repo.pushed_at || repo.updated_at)
        .filter(Boolean)
        .sort((a, b) => new Date(b) - new Date(a));

      return dates.length > 0 ? dates[0] : null;
    }

    _getOldestRepoDate() {
      if (this.repositories.length === 0) return null;
      const dates = this.repositories
        .map((repo) => repo.created_at)
        .filter(Boolean)
        .sort((a, b) => new Date(a) - new Date(b));
      return dates.length > 0 ? dates[0] : null;
    }

    _getNewestRepoDate() {
      if (this.repositories.length === 0) return null;
      const dates = this.repositories
        .map((repo) => repo.updated_at)
        .filter(Boolean)
        .sort((a, b) => new Date(b) - new Date(a));
      return dates.length > 0 ? dates[0] : null;
    }
    // ═══════════════ BACKGROUND SYNC ═══════════════

    startAutoSync(intervalMs = 300000) {
      // Default 5 minutes
      if (this.syncInterval) return;

      console.log(`🔄 Auto-sync started (every ${intervalMs / 1000}s)`);
      this.autoSyncEnabled = true;

      this.syncInterval = setInterval(async () => {
        if (document.hidden) return; // Don't sync when tab is hidden

        try {
          await this.fetchAllRepos({ forceRefresh: true });
          console.log("🔄 Background sync completed");
        } catch (e) {
          console.warn("Background sync failed:", e.message);
        }
      }, intervalMs);
    }

    stopAutoSync() {
      if (this.syncInterval) {
        clearInterval(this.syncInterval);
        this.syncInterval = null;
      }
      this.autoSyncEnabled = false;
      console.log("🔄 Auto-sync stopped");
    }

    // ═══════════════ UTILITY METHODS ═══════════════

    _updateProgress(percent) {
      this.loadProgress = percent;
      if (this.onProgress) {
        this.onProgress(percent);
      }
    }

    _getStaleCache(key) {
      try {
        const raw = localStorage.getItem(this.cache._getKey(key));
        if (!raw) return null;
        const data = JSON.parse(raw).data;
        return data;
      } catch (e) {
        return null;
      }
    }

    pinRepo(repoName) {
      this.pinnedRepos.add(repoName);
      const repo = this.repositories.find((r) => r.name === repoName);
      if (repo) repo.isPinned = true;
    }

    unpinRepo(repoName) {
      this.pinnedRepos.delete(repoName);
      const repo = this.repositories.find((r) => r.name === repoName);
      if (repo) repo.isPinned = false;
    }

    excludeRepo(repoName) {
      this.excludedRepos.add(repoName);
      this.repositories = this.repositories.filter((r) => r.name !== repoName);
    }

    getRepoByName(name) {
      return this.repositories.find((r) => r.name === name) || null;
    }

    getStats() {
      return {
        totalRepos: this.repositories.length,
        totalStars: this.totalStars,
        totalForks: this.totalForks,
        totalWatchers: this.totalWatchers,
        totalCommits: this.totalCommits,
        oldestRepo: this._oldestRepoDate,
        newestRepo: this._newestRepoDate,
        languageStats: this.getLanguageStats(),
        isLoaded: this.isLoaded,
        isLoading: this.isLoading,
        lastFetch: this.lastFetchTime,
        loadProgress: this.loadProgress,
      };
    }

    clearCache() {
      this.cache.clear();
      this.repositories = [];
      this.profile = null;
      this.isLoaded = false;
      this.lastFetchTime = null;
      console.log("🗑️ Cache cleared");
    }

    destroy() {
      this.stopAutoSync();
      this.requestQueue.clear();
      this.repositories = [];
      this.profile = null;
      console.log("📦 GitHubManager destroyed");
    }
    // ═══════════════════════════════════════════
    // PERBAIKAN 3: Fetch Last Activity dari Events API
    // ═══════════════════════════════════════════
    async fetchLastActivity() {
      const cacheKey = `last_activity_${this.username}`;

      // Cek cache (hanya 5 menit untuk data aktivitas)
      const cached = this.cache.get(cacheKey);
      if (cached && Date.now() - cached._cacheTime < 300000) {
        console.log("📦 Using cached last activity");
        return cached;
      }

      console.log("🔍 Fetching last activity from GitHub Events...");

      try {
        // Strategy 1: GitHub Events API
        const url = `https://api.github.com/users/${this.username}/events/public?per_page=5`;
        const response = await this._fetchWithRetry(url, {
          retries: 1,
          timeout: 5000,
        });

        if (response.ok) {
          const events = await response.json();

          if (events.length > 0) {
            // Cari event yang menunjukkan aktivitas real
            const activityEvents = events.filter((e) =>
              [
                "PushEvent",
                "CreateEvent",
                "IssuesEvent",
                "PullRequestEvent",
                "ReleaseEvent",
              ].includes(e.type),
            );

            const lastEvent =
              activityEvents.length > 0 ? activityEvents[0] : events[0];
            const lastActiveDate = lastEvent.created_at;

            // Cache dengan timestamp
            const cachedData = lastActiveDate;
            cachedData._cacheTime = Date.now();
            this.cache.set(cacheKey, cachedData, 300000); // 5 menit

            console.log(
              `✅ Last activity from Events: ${timeAgo(lastActiveDate)} (${lastEvent.type})`,
            );
            return lastActiveDate;
          }
        }
      } catch (e) {
        console.warn("Events API failed:", e.message);
      }

      // Strategy 2: Fallback ke pushed_at dari repositori
      const lastActiveFromRepos = this._getLastActiveDate();
      if (lastActiveFromRepos) {
        console.log(
          `📦 Using last active from repos: ${timeAgo(lastActiveFromRepos)}`,
        );
        return lastActiveFromRepos;
      }

      // Strategy 3: Fallback ke profile updated_at
      if (this.profile?.updated_at) {
        console.log(
          `📦 Using profile updated_at: ${timeAgo(this.profile.updated_at)}`,
        );
        return this.profile.updated_at;
      }

      return null;
    }
  }

  // ═══════════════════════════════════════════
  // SUPPORTING CLASSES
  // ═══════════════════════════════════════════

  class RateLimiter {
    constructor({
      maxRequests = 60,
      perTimeWindow = 3600000,
      minDelay = 100,
    } = {}) {
      this.maxRequests = maxRequests;
      this.timeWindow = perTimeWindow;
      this.minDelay = minDelay;
      this.requests = [];
      this.waiting = [];
    }

    async acquire() {
      const now = Date.now();

      // Clean old requests
      this.requests = this.requests.filter(
        (time) => now - time < this.timeWindow,
      );

      if (this.requests.length >= this.maxRequests) {
        // Wait until oldest request expires
        const oldestRequest = this.requests[0];
        const waitTime = oldestRequest + this.timeWindow - now + 10;

        await new Promise((resolve) => {
          const timeout = setTimeout(() => {
            resolve();
          }, waitTime);
        });

        return this.acquire();
      }

      // Add delay between requests
      if (this.requests.length > 0) {
        const lastRequest = this.requests[this.requests.length - 1];
        const timeSinceLastRequest = now - lastRequest;

        if (timeSinceLastRequest < this.minDelay) {
          await new Promise((resolve) =>
            setTimeout(resolve, this.minDelay - timeSinceLastRequest),
          );
        }
      }

      this.requests.push(Date.now());
      return true;
    }
  }

  class RequestQueue {
    constructor() {
      this.queue = [];
      this.processing = false;
    }

    async enqueue(fn, priority = 0) {
      return new Promise((resolve, reject) => {
        this.queue.push({ fn, priority, resolve, reject });
        this.queue.sort((a, b) => b.priority - a.priority);
        this._processQueue();
      });
    }

    async _processQueue() {
      if (this.processing || this.queue.length === 0) return;

      this.processing = true;

      while (this.queue.length > 0) {
        const { fn, resolve, reject } = this.queue.shift();

        try {
          const result = await fn();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      }

      this.processing = false;
    }

    clear() {
      this.queue = [];
    }

    get length() {
      return this.queue.length;
    }
  }

  // ═══════════════════════════════════════════
  // 7. AI VN DIALOGUE SYSTEM - ENHANCED
  // ═══════════════════════════════════════════
  class AIVNDialogueSystem {
    constructor() {
      // DOM Elements
      this.container = document.getElementById("vnContainer");
      this.messageEl = document.getElementById("vnMessage");
      this.nextBtn = document.getElementById("vnNext");
      this.closeBtn = document.getElementById("vnClose");
      this.skipBtn = document.getElementById("vnSkip");
      this.repeatBtn = document.getElementById("vnRepeat");
      this.speakerEl = document.querySelector(".vn-speaker");
      this.badgeEl = document.querySelector(".vn-badge");
      this.routeBadgeEl = document.querySelector("[data-route-indicator]");
      this.avatarImg = document.querySelector(".vn-avatar-img");
      this.avatarEmotion = document.querySelector(".vn-avatar-emotion");
      this.quickRepliesEl = document.getElementById("vnQuickReplies");
      this.progressBar = document.getElementById("vnProgressBar");
      this.contextText = document.querySelector(".vn-context-text");

      // Systems
      this.audioManager = null;
      this.achievementSystem = null;

      // State
      this.currentRoute = "home";
      this.isTyping = false;
      this.typeTimer = null;
      this.isOpen = false;
      this.currentFullText = "";
      this.currentDialogueIndex = 0;
      this.totalDialogues = 0;
      this._currentDialogues = null; // ✅ Tambahkan ini

      // AI Memory System
      this.userMemory = {
        name: null,
        visitCount: 0,
        totalInteractions: 0,
        favoriteRoute: null,
        lastVisitTime: null,
        achievements: [],
        relationship: {
          level: 1, // 1-10
          points: 0,
          title: "Stranger",
        },
        conversationHistory: [],
        personalityInsights: {
          curiosity: 0,
          friendliness: 0,
          humorAppreciation: 0,
          explorationLevel: 0,
        },
      };

      // Emotion Engine
      this.currentEmotion = "😊";
      this.emotionHistory = [];
      this.emotionModifiers = {
        happy: ["😊", "😄", "🥰", "✨"],
        excited: ["😆", "🤩", "🎉", "💃"],
        shy: ["😅", "🫣", "💦", "😳"],
        determined: ["💪", "😤", "🔥", "⚡"],
        curious: ["🤔", "🧐", "💡", "❓"],
        playful: ["😋", "😜", "🎮", "🍖"],
        surprised: ["😱", "😲", "‼️", "💥"],
      };

      this.routeConfig = {
        home: {
          icon: "🏠",
          color: "#d4af37",
          badge: "Beranda",
          theme: "welcome",
        },
        maple: {
          icon: "🛡️",
          color: "#7c3aed",
          badge: "Vault",
          theme: "lore",
        },
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
      };

      // Dynamic Dialogue Templates
      this.dialogueTemplates = new Map([
        [
          "home",
          {
            themes: ["welcome", "guild_intro", "casual_chat"],
            generators: [
              () => this._generateWelcomeDialogue(),
              () => this._generateGuildDialogue(),
              () => this._generateCasualDialogue(),
            ],
          },
        ],
        [
          "maple",
          {
            themes: ["lore", "skills", "adventures"],
            generators: [
              () => this._generateLoreDialogue(),
              () => this._generateSkillDialogue(),
              () => this._generateAdventureDialogue(),
            ],
          },
        ],
        [
          "project",
          {
            themes: ["showcase", "coding", "achievements"],
            generators: [
              () => this._generateProjectDialogue(),
              () => this._generateCodingDialogue(),
              () => this._generateAchievementDialogue(),
            ],
          },
        ],
        [
          "about",
          {
            themes: ["personal", "backstory", "future"],
            generators: [
              () => this._generatePersonalDialogue(),
              () => this._generateBackstoryDialogue(),
              () => this._generateFutureDialogue(),
            ],
          },
        ],
        [
          "contact",
          {
            themes: ["social", "collaboration", "goodbye"],
            generators: [
              () => this._generateSocialDialogue(),
              () => this._generateCollaborationDialogue(),
              () => this._generateGoodbyeDialogue(),
            ],
          },
        ],
      ]);

      this._boundHandleKeydown = this._handleKeydown.bind(this);
      this._boundHandleQuickReply = this._handleQuickReply.bind(this);
      this.bindEvents();
      this._loadMemory();
    }

    // ═══════════════════════════════════════
    // AI MEMORY MANAGEMENT
    // ═══════════════════════════════════════
    _loadMemory() {
      try {
        const saved = localStorage.getItem("maple_user_memory");
        if (saved) {
          const data = JSON.parse(saved);
          this.userMemory = { ...this.userMemory, ...data };
        }
      } catch (e) {
        console.warn("Failed to load memory:", e);
      }
    }

    _saveMemory() {
      try {
        localStorage.setItem(
          "maple_user_memory",
          JSON.stringify(this.userMemory),
        );
      } catch (e) {
        console.warn("Failed to save memory:", e);
      }
    }

    _updateRelationship(interactionType) {
      const points = {
        greeting: 1,
        compliment: 3,
        question: 2,
        explore: 2,
        farewell: 1,
        game: 4,
        secret: 5,
      };

      const earned = points[interactionType] || 0;
      this.userMemory.relationship.points += earned;
      this.userMemory.totalInteractions++;

      // Update level
      const newLevel = Math.floor(this.userMemory.relationship.points / 10 + 1);
      if (newLevel > this.userMemory.relationship.level) {
        this.userMemory.relationship.level = Math.min(newLevel, 10);
        this._updateRelationshipTitle();
      }

      this._saveMemory();
    }

    _updateRelationshipTitle() {
      const titles = [
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
      ];
      this.userMemory.relationship.title =
        titles[this.userMemory.relationship.level - 1] || "Partner";
    }

    _updatePersonality(type) {
      const personalityMap = {
        curious: "curiosity",
        friendly: "friendliness",
        funny: "humorAppreciation",
        explorer: "explorationLevel",
      };

      const trait = personalityMap[type];
      if (trait && this.userMemory.personalityInsights[trait] !== undefined) {
        this.userMemory.personalityInsights[trait] = Math.min(
          100,
          this.userMemory.personalityInsights[trait] + 5,
        );
        this._saveMemory();
      }
    }

    // ═══════════════════════════════════════
    // EMOTION ENGINE
    // ═══════════════════════════════════════
    _setEmotion(emotion) {
      this.currentEmotion = emotion;
      this.emotionHistory.push({
        emotion,
        timestamp: Date.now(),
        route: this.currentRoute,
      });

      // Limit history
      if (this.emotionHistory.length > 50) {
        this.emotionHistory.shift();
      }
    }

    _getContextualEmotion() {
      const hour = new Date().getHours();
      const relLevel = this.userMemory.relationship.level;

      if (hour < 6) return this.emotionModifiers.shy[0];
      if (relLevel >= 7) return this.emotionModifiers.happy[2];
      if (relLevel >= 4) return this.emotionModifiers.happy[1];
      return this.emotionModifiers.happy[0];
    }

    // ═══════════════════════════════════════
    // DYNAMIC DIALOGUE GENERATORS
    // ═══════════════════════════════════════
    _generateWelcomeDialogue() {
      const { visitCount, relationship } = this.userMemory;
      const hour = new Date().getHours();
      const timeGreeting = hour < 12 ? "pagi" : hour < 17 ? "siang" : "malam";

      if (visitCount === 0) {
        this._setEmotion("😊");
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

      // Return visitor
      const greetings = [
        `Oh, kamu lagi! Senang deh kamu balik~ Ini kunjungan ke-${visitCount} lho! ✨`,
        `Selamat ${timeGreeting}! Balik lagi ke guild? Ada quest baru nih! 🎮`,
        `Wah, ${relationship.title}-ku datang! Gimana kabarnya? 😊`,
      ];

      this._setEmotion(this._getContextualEmotion());
      const chosenGreeting =
        greetings[Math.floor(Math.random() * greetings.length)];

      return [
        {
          speaker: "🍁 Maple",
          text: chosenGreeting,
          emotion: this.currentEmotion,
          quickReplies: [
            { text: "Apa kabar Maple?", action: "greeting" },
            { text: "Ada quest apa hari ini?", action: "explore" },
            { text: "Aku mau lihat-lihat guild lagi", action: "explore" },
          ],
        },
      ];
    }

    _generateGuildDialogue() {
      this._setEmotion("✨");
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

    _generateCasualDialogue() {
      const hour = new Date().getHours();
      if (hour >= 0 && hour < 6) {
        this._setEmotion("😅");
        this.achievementSystem?.unlock("night_owl");
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
      return null; // Fallback ke generator lain
    }

    _generateLoreDialogue() {
      this._setEmotion("📖");
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
          text: "Karena VIT-nya gila-gilaan, dia dapet skill <span class='highlight'>Absolute Defense</span>! Skill yang bikin semua serangan jadi 0 damage!",
          emotion: "😱",
        },
        {
          speaker: "📖 Guild Master",
          text: "Terus dia dapet skill aneh-aneh kayak <span class='highlight'>Devour</span> (makan monster!), <span class='highlight'>Machine God</span> (jadi mecha raksasa!), dan <span class='highlight'>Atrocity</span> (berubah jadi monster serem)!",
          emotion: "👹",
          quickReplies: [
            { text: "WOW! Itu semua skill official?!", action: "question" },
            { text: "Developer gamenya nggak marah tuh?", action: "funny" },
          ],
        },
        {
          speaker: "📖 Guild Master",
          text: "HAHAHA! Developer-nya sampe pusing! Tapi mereka biarin aja karena Maple jadi legenda di game itu! Bahkan pemain lain pada bikin build VIT semua gara-gara dia! 😂",
          emotion: "😂",
        },
      ];
    }

    _generateSkillDialogue() {
      this._setEmotion("⚡");
      return [
        {
          speaker: "⚡ Maple",
          text: "Mau lihat skill-ku? Nih, <span class='highlight'>Machine God</span>! *BRRRRR* Aku berubah jadi mecha raksasa dengan senjata laser! ⚡",
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
        {
          speaker: "🛡️ Maple",
          text: "Yang paling berguna sih <span class='highlight'>Cover Move</span>. Aku bisa lindungin semua temen-temenku dengan tameng ini! 🛡️",
          emotion: "🛡️",
        },
      ];
    }

    _generateAdventureDialogue() {
      this._setEmotion("🎮");
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

    _generateProjectDialogue() {
      this._setEmotion("🎮");
      const totalProjects =
        document.getElementById("repoCount")?.textContent || "banyak";
      return [
        {
          speaker: "🎮 Maple",
          text: `Ini dia gudang loot-ku! Ada ${totalProjects} hasil coding yang udah ku-selesaikan! Lumayan kan buat pamer ke Sally? 😎`,
          emotion: "😎",
          quickReplies: [
            { text: "Keren! Filter berdasarkan tipe dong!", action: "filter" },
            { text: "Mana yang paling bagus?", action: "question" },
            { text: "Kamu bikin semua sendiri?", action: "question" },
          ],
        },
        {
          speaker: "🎮 Maple",
          text: "Setiap proyek punya tingkat kelangkaan lho! Kayak rarity di game: <span class='highlight'>SSR</span> (Legendary), <span class='highlight'>SR</span> (Rare), <span class='highlight'>R</span> (Common).",
          emotion: "⭐",
        },
        {
          speaker: "🎮 Maple",
          text: "<span class='action-hint'>💡 Tips:</span> Kamu bisa filter berdasarkan tipe: Web, Game, Design, atau Lainnya. Serasa nyortir loot di inventory!",
          emotion: "💡",
          quickReplies: [
            { text: "Oke, aku coba filternya!", action: "filter" },
            { text: "Tunjukin yang SSR aja!", action: "question" },
          ],
        },
      ];
    }

    _generateCodingDialogue() {
      this._setEmotion("🤔");
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
          text: "Kadang ada bug... Itu kayak kena debuff di game. Harus dicari source-nya, terus di-fix! 🐛",
          emotion: "😤",
        },
        {
          speaker: "💻 Maple",
          text: "Tapi begitu berhasil fix bug... Rasanya kayak dapet rare item! Puas banget! ✨",
          emotion: "✨",
        },
      ];
    }

    _generateAchievementDialogue() {
      const unlockedCount = this.achievementSystem?.getUnlockedCount() || 0;
      const totalXP = this.achievementSystem?.getTotalXP() || 0;

      if (unlockedCount === 0) {
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

      this._setEmotion("🏆");
      return [
        {
          speaker: "🏆 Maple",
          text: `WOW! Kamu udah dapet ${unlockedCount} achievement dengan total ${totalXP} XP! Keren banget! 🏆`,
          emotion: "🏆",
          quickReplies: [
            { text: "Masih ada berapa lagi?", action: "question" },
            { text: "Aku pengen yang legendary!", action: "explore" },
          ],
        },
        {
          speaker: "🏆 Maple",
          text: "Achievement terlangka itu <span class='highlight'>Secret Finder</span>! Cuma pemain jago yang bisa dapetin! 🔥",
          emotion: "🔥",
        },
      ];
    }

    _generatePersonalDialogue() {
      this._setEmotion("💕");
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
        {
          speaker: "💕 Maple",
          text: "Kalo di dunia nyata, aku suka jalan-jalan sama Sally! Kadang ke arcade, kadang ke kafe, kadang ke toko game~ 💕",
          emotion: "😊",
        },
      ];
    }

    _generateBackstoryDialogue() {
      this._setEmotion("📖");
      return [
        {
          speaker: "📖 Maple",
          text: "Dulu aku takut main game VR karena katanya sakit kalo kena hit... Makanya aku full VIT! 📖",
          emotion: "📖",
        },
        {
          speaker: "📖 Maple",
          text: "Tapi ternyata malah jadi OP! Siapa sangka build aneh kayak gitu malah jadi meta? 😂",
          emotion: "😂",
        },
      ];
    }

    _generateFutureDialogue() {
      this._setEmotion("✨");
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
        {
          speaker: "🛡️ Maple",
          text: "Yang pasti, aku bakal terus jadi tameng buat teman-temanku! <span class='highlight'>Defense is the best offense!</span> 🛡️",
          emotion: "💪",
        },
      ];
    }

    _generateSocialDialogue() {
      this._setEmotion("💌");
      return [
        {
          speaker: "💌 Maple",
          text: "Mau kirim pesan ke aku? Bisa lewat email, GitHub, atau LinkedIn! Semua aman di bawah perlindungan <span class='highlight'>Aegis-ku</span>! 💌",
          emotion: "💌",
          quickReplies: [
            { text: "Aku mau kolaborasi proyek!", action: "collaboration" },
            { text: "Boleh minta saran coding?", action: "question" },
          ],
        },
        {
          speaker: "🐌 Maple",
          text: "Aku bakal balas pesanmu secepatnya... Tapi maaf kalo agak lambat ya. Pergerakanku emang lambat soalnya~ 🐌",
          emotion: "😅",
        },
      ];
    }

    _generateCollaborationDialogue() {
      this._setEmotion("🤝");
      return [
        {
          speaker: "🤝 Maple",
          text: "Kamu mau party bareng? Aku terbuka buat kolaborasi! Kita bisa bikin proyek keren bareng! 🤝",
          emotion: "🤝",
          quickReplies: [
            { text: "Aku ada ide proyek nih!", action: "collaboration" },
            {
              text: "Skill apa yang kamu bisa kontribusiin?",
              action: "question",
            },
          ],
        },
        {
          speaker: "🛡️ Maple",
          text: "Aku bisa bantu bagian frontend, UI/UX, game design, atau... jagain server biar nggak down? Kan VIT-ku tinggi! 🛡️",
          emotion: "😊",
        },
      ];
    }

    _generateGoodbyeDialogue() {
      this._setEmotion("👋");
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

    // ═══════════════════════════════════════
    // DIALOGUE CONTROLLER
    // ═══════════════════════════════════════
    _getDialogues(route) {
      const templates = this.dialogueTemplates.get(route);
      if (!templates) return this._generateWelcomeDialogue();

      // ✅ Pilih generator & panggil SEKALI
      const randomIndex = Math.floor(
        Math.random() * templates.generators.length,
      );
      const generator = templates.generators[randomIndex];

      // ✅ Simpan hasilnya, jangan panggil berulang
      const generated = generator.call(this);

      if (generated && generated.length > 0) {
        // ✅ Deep clone untuk mencegah reference issue
        return JSON.parse(JSON.stringify(generated));
      }

      return this._generateWelcomeDialogue();
    }

    _getRouteConfig(route) {
      return this.routeConfig[route] || this.routeConfig.home;
    }

    // ═══════════════════════════════════════
    // EVENT HANDLERS
    // ═══════════════════════════════════════
    _handleKeydown(e) {
      if (!this.isOpen) return;

      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        this.next();
      }
      if (e.key === "Escape") {
        this.close();
      }
      if (e.key === "s" || e.key === "S") {
        this.skipAll();
      }
      if (e.key === "r" || e.key === "R") {
        this.repeat();
      }
      // Quick reply shortcuts (1-4)
      const num = parseInt(e.key);
      if (num >= 1 && num <= 4) {
        const replies =
          this.quickRepliesEl?.querySelectorAll(".vn-quick-reply");
        if (replies && replies[num - 1]) {
          replies[num - 1].click();
        }
      }
    }

    _skipTyping() {
      if (this.typeTimer) {
        clearTimeout(this.typeTimer);
        this.typeTimer = null;
      }
      this.isTyping = false;
      if (this.messageEl) {
        this.messageEl.innerHTML = this.currentFullText;
      }
      this.audioManager?.playSFX("menuSelect");
    }

    _showEmotion(emotion) {
      if (this.avatarEmotion) {
        this.avatarEmotion.textContent = emotion || "😊";
        this.avatarEmotion.classList.add("vn-avatar-emotion--show");

        setTimeout(() => {
          this.avatarEmotion?.classList.remove("vn-avatar-emotion--show");
        }, 2000);
      }
    }

    _showQuickReplies(replies) {
      if (!this.quickRepliesEl) return;

      this.quickRepliesEl.innerHTML = "";

      if (!replies || !replies.length) {
        this.quickRepliesEl.classList.remove("vn-quick-replies--active");
        return;
      }

      replies.forEach((reply, index) => {
        const button = document.createElement("button");
        button.className = "vn-quick-reply";
        button.textContent = `${index + 1}. ${reply.text}`;
        button.dataset.action = reply.action;
        button.addEventListener("click", () => this._handleQuickReply(reply));
        this.quickRepliesEl.appendChild(button);
      });

      this.quickRepliesEl.classList.add("vn-quick-replies--active");
    }

    _handleQuickReply(reply) {
      this.audioManager?.playSFX("menuSelect");
      this.quickRepliesEl?.classList.remove("vn-quick-replies--active");

      // Update AI memory based on action
      this._updateRelationship(reply.action);
      this._updatePersonality(reply.action);

      // Track conversation
      this.userMemory.conversationHistory.push({
        action: reply.action,
        timestamp: Date.now(),
        route: this.currentRoute,
      });
      this._saveMemory();

      // Handle special actions
      switch (reply.action) {
        case "explore":
          this.close();
          window.navigateTo?.("maple", true);
          break;
        case "filter":
          this.close();
          document.querySelector(".filter-tab")?.click();
          break;
        case "collaboration":
          this.close();
          window.navigateTo?.("contact", true);
          break;
        case "farewell":
          this.close();
          break;
        case "github":
          window.open(`https://github.com/${CONFIG.USERNAME}`, "_blank");
          break;
        default:
          this.next();
          break;
      }
    }

    _updateProgress() {
      if (this.progressBar && this.totalDialogues > 0) {
        const progress =
          ((this.currentDialogueIndex + 1) / this.totalDialogues) * 100;
        this.progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;

        // ✅ Tambahkan aria-label untuk aksesibilitas
        this.progressBar.setAttribute("aria-valuenow", Math.round(progress));
      }
    }

    _updateRouteBadge(route) {
      if (this.routeBadgeEl) {
        const config = this._getRouteConfig(route);
        this.routeBadgeEl.textContent = config.badge;
        this.routeBadgeEl.style.background = `${config.color}20`;
        this.routeBadgeEl.style.color = config.color;
        this.routeBadgeEl.style.borderColor = `${config.color}30`;
      }
    }

    _updateContext(route) {
      if (this.contextText) {
        const messages = {
          home: "Pilih quick reply untuk ngobrol dengan Maple! 🍁",
          maple: "Pelajari rahasia kekuatan Maple! 🛡️",
          project: "Jelajahi loot dan hasil coding! 🎮",
          about: "Kenali Maple lebih dekat! 💕",
          contact: "Hubungi Maple untuk party bareng! 💌",
        };
        this.contextText.textContent =
          messages[route] ||
          "Tekan Space/Enter untuk lanjut, 1-4 untuk quick reply";
      }
    }

    // ═══════════════════════════════════════
    // PUBLIC METHODS
    // ═══════════════════════════════════════
    bindEvents() {
      this.nextBtn?.addEventListener("click", (e) => {
        e.stopPropagation();
        this.next();
      });

      this.closeBtn?.addEventListener("click", (e) => {
        e.stopPropagation();
        this.close();
      });

      this.skipBtn?.addEventListener("click", (e) => {
        e.stopPropagation();
        this.skipAll();
      });

      this.repeatBtn?.addEventListener("click", (e) => {
        e.stopPropagation();
        this.repeat();
      });

      this.container?.addEventListener("click", (e) => {
        if (e.target === this.container || e.target.closest(".vn-textbox")) {
          if (!e.target.closest(".vn-quick-replies")) {
            this.next();
          }
        }
      });

      document.addEventListener("keydown", this._boundHandleKeydown);
    }

    destroy() {
      document.removeEventListener("keydown", this._boundHandleKeydown);
      this.stopTyping();
    }

    setAudioManager(audioManager) {
      this.audioManager = audioManager;
    }

    setAchievementSystem(achievementSystem) {
      this.achievementSystem = achievementSystem;
    }

    open(route, customText = null) {
      // ── Reset jika route berbeda ──
      if (this.isOpen && this.currentRoute !== route) {
        this._currentDialogues = null;
        this.currentDialogueIndex = 0;
      }

      // ── Set state ──
      this.currentRoute = route;
      this.isOpen = true;
      this.currentDialogueIndex = 0;

      // ── Update memory ──
      if (route === "home" && this.userMemory.visitCount === 0) {
        this.userMemory.visitCount = 1;
        this.achievementSystem?.unlock("first_visit");
      } else if (route === "home") {
        this.userMemory.visitCount++;
      }
      this.userMemory.lastVisitTime = new Date().toISOString();
      this._saveMemory();

      // ── Generate dialogues (SEKALI SAJA) ──
      if (customText) {
        this._currentDialogues = [
          { speaker: "🍁 Maple", text: customText, emotion: "😊" },
        ];
      } else {
        // ✅ PENTING: Simpan hasil generate, jangan regenerate setiap next()
        this._currentDialogues = this._getDialogues(route);
      }

      // ── Validasi ──
      if (!this._currentDialogues || !this._currentDialogues.length) {
        console.warn("⚠️ No dialogues generated for route:", route);
        this._currentDialogues = [
          {
            speaker: "🍁 Maple",
            text: "Ehehe... sepertinya aku kehabisan kata-kata nih~ Coba lagi nanti ya! ✨",
            emotion: "😅",
          },
        ];
      }

      this.totalDialogues = this._currentDialogues.length;

      // ── Show container ──
      if (this.container) {
        this.container.classList.add("vn-container--active");
        this.container.removeAttribute("hidden");
        this.container.setAttribute("data-current-route", route);
        this.container.setAttribute("aria-hidden", "false");
      }

      // ── Update UI ──
      this._updateRouteBadge(route);
      this._updateContext(route);
      this._updateProgress();

      // ── Play sound ──
      this.audioManager?.playSFX("dialogue");

      // ── Track achievement ──
      if (this.userMemory.totalInteractions >= 5) {
        this.achievementSystem?.unlock("dialog_master");
      }

      // ── Type first dialogue ──
      if (this._currentDialogues.length > 0) {
        const firstDialogue = this._currentDialogues[0];

        // ✅ Debug: Log text sebelum typing
        console.log(
          `📝 [${route}] Dialogue 1/${this.totalDialogues}:`,
          firstDialogue.text.substring(0, 50) + "...",
        );

        this._typeText(firstDialogue);
      }
    }

    _typeText(dialogue) {
      this.stopTyping();
      this.isTyping = true;
      this.currentFullText = dialogue.text;

      if (dialogue.emotion) {
        this._showEmotion(dialogue.emotion);
        this._setEmotion(dialogue.emotion);
      }

      if (this.speakerEl) {
        this.speakerEl.textContent = dialogue.speaker;
      }

      if (!this.messageEl) return;

      // Clear previous content
      this.messageEl.innerHTML = "";
      this.messageEl.classList.add("vn-message--new");
      setTimeout(() => this.messageEl.classList.remove("vn-message--new"), 300);

      // Clear quick replies
      this.quickRepliesEl?.classList.remove("vn-quick-replies--active");

      const text = dialogue.text;
      const hasHTML = /<[^>]+>/.test(text);

      // ✅ DEKLARASI VARIABEL DI SINI
      let charIndex = 0;
      const speed =
        CONFIG.TYPING_SPEED_MIN +
        Math.random() * (CONFIG.TYPING_SPEED_MAX - CONFIG.TYPING_SPEED_MIN);

      const type = () => {
        if (charIndex < text.length) {
          // Handle HTML tags
          if (text[charIndex] === "<") {
            const endTag = text.indexOf(">", charIndex);
            if (endTag !== -1) {
              // ✅ Gunakan insertAdjacentHTML agar tidak overwrite
              const tagContent = text.substring(charIndex, endTag + 1);
              this.messageEl.insertAdjacentHTML("beforeend", tagContent);
              charIndex = endTag + 1;
              this.typeTimer = setTimeout(type, speed);
              return;
            }
          }

          // ✅ Untuk teks biasa, gunakan insertAdjacentText
          // Ini lebih aman karena tidak meng-overwrite innerHTML
          this.messageEl.insertAdjacentText(
            "beforeend",
            text.charAt(charIndex),
          );
          charIndex++;
          this.typeTimer = setTimeout(type, speed);
        } else {
          // ✅ Selesai mengetik
          this.isTyping = false;

          // Tambahkan cursor
          this.messageEl.insertAdjacentHTML(
            "beforeend",
            '<span class="typing-cursor"></span>',
          );
          setTimeout(() => {
            const cursor = this.messageEl?.querySelector(".typing-cursor");
            cursor?.remove();
          }, 800);

          // Tampilkan quick replies setelah selesai
          if (dialogue.quickReplies) {
            setTimeout(() => {
              this._showQuickReplies(dialogue.quickReplies);
            }, 500);
          }

          this._updateProgress();
        }
      };

      type();
    }

    stopTyping() {
      if (this.typeTimer) {
        clearTimeout(this.typeTimer);
        this.typeTimer = null;
      }
      this.isTyping = false;
    }

    // ═══════════════ PERBAIKAN _skipTyping ═══════════════
    _skipTyping() {
      if (this.typeTimer) {
        clearTimeout(this.typeTimer);
        this.typeTimer = null;
      }
      this.isTyping = false;
      if (this.messageEl) {
        // ✅ Tampilkan full text dengan HTML tags yang utuh
        this.messageEl.innerHTML = this.currentFullText;
      }
      this.audioManager?.playSFX("menuSelect");
    }

    next() {
      // ── Skip typing jika sedang mengetik ──
      if (this.isTyping) {
        this._skipTyping();
        return;
      }

      // ── Gunakan dialogues yang sudah disimpan ──
      if (!this._currentDialogues || !this._currentDialogues.length) {
        console.warn("⚠️ No dialogues available");
        this.close();
        return;
      }

      // ── Increment index ──
      this.currentDialogueIndex++;

      // ── Cek apakah sudah habis ──
      if (this.currentDialogueIndex >= this._currentDialogues.length) {
        this.close();
        return;
      }

      // ── Type next dialogue ──
      const nextDialogue = this._currentDialogues[this.currentDialogueIndex];

      console.log(
        `📝 [${this.currentRoute}] Dialogue ${this.currentDialogueIndex + 1}/${this.totalDialogues}:`,
        nextDialogue.text.substring(0, 50) + "...",
      );

      this.audioManager?.playSFX("dialogue");
      this._typeText(nextDialogue);
    }
    skipAll() {
      this.stopTyping();
      this.close();
      this.audioManager?.playSFX("close");
    }

    repeat() {
      this.currentDialogueIndex = 0;
      this._updateProgress();

      const dialogues = this._getDialogues(this.currentRoute);
      if (dialogues?.length) {
        this.audioManager?.playSFX("dialogue");
        this._typeText(dialogues[0]);
      }
    }

    close() {
      this.stopTyping();
      this.isOpen = false;

      // ✅ Reset dialogues saat close
      this._currentDialogues = null;
      this.currentDialogueIndex = 0;

      this.quickRepliesEl?.classList.remove("vn-quick-replies--active");

      if (this.container) {
        this.container.classList.remove("vn-container--active");
        this.container.setAttribute("hidden", "");
        this.container.setAttribute("aria-hidden", "true");
      }

      this.audioManager?.playSFX("close");
    }
    isActive() {
      return this.isOpen;
    }
  }

  // ═══════════════════════════════════════════
  // 8. GUIDE SYSTEM
  // ═══════════════════════════════════════════
  class GuideSystem {
    constructor() {
      this.button = document.getElementById("guideModeBtn");
      this.indicator = document.getElementById("guideIndicator");
      this.dots = this.indicator?.querySelectorAll(".dot");
      this.vnSystem = null;
      this.audioManager = null;
      this.achievementSystem = null;
      this.isActive = false;
      this.currentStep = 0;
      this.isRunning = false;

      this.steps = [
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
      ];

      this._boundHandleClick = this._handleClick.bind(this);
      this.bindEvents();
    }

    _handleClick() {
      this.toggle();
    }

    _sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }

    _updateIndicator(step) {
      if (!this.dots) return;

      this.dots.forEach((dot, i) => {
        requestAnimationFrame(() => {
          dot.className = "dot";
          if (i < step) dot.classList.add("completed");
          if (i === step) dot.classList.add("active");
        });
      });

      const progressBar = this.indicator?.querySelector(".guide-progress");
      if (progressBar) {
        progressBar.setAttribute("aria-valuenow", step);
      }
    }

    bindEvents() {
      this.button?.addEventListener("click", this._boundHandleClick);
    }

    destroy() {
      this.button?.removeEventListener("click", this._boundHandleClick);
      this.stop();
    }

    setVNDialogue(vnSystem) {
      this.vnSystem = vnSystem;
    }

    setAudioManager(audioManager) {
      this.audioManager = audioManager;
    }

    setAchievementSystem(achievementSystem) {
      this.achievementSystem = achievementSystem;
    }

    toggle() {
      if (this.isActive) {
        this.stop();
      } else {
        this.start();
      }
    }

    async start() {
      if (this.isActive || this.isRunning) return;

      this.isActive = true;
      this.isRunning = true;
      this.currentStep = 0;

      requestAnimationFrame(() => {
        this.button?.classList.add("guide-mode-btn--active");
        this.indicator?.classList.add("guide-indicator--active");
        this.indicator?.removeAttribute("aria-hidden");
      });

      this.audioManager?.playSFX("guideStart");

      try {
        for (let i = 0; i < this.steps.length; i++) {
          if (!this.isActive) break;

          this.currentStep = i;
          const step = this.steps[i];

          this._updateIndicator(i);

          window.navigateTo?.(step.route, true);

          await this._sleep(150);

          this.vnSystem?.open(step.route, step.message);
          await this._sleep(CONFIG.GUIDE_DELAY);

          this.vnSystem?.close();
          await this._sleep(300);
        }
      } catch (e) {
        console.warn("Guide interrupted:", e);
      } finally {
        this.isRunning = false;
        this.achievementSystem?.unlock("guide_complete");
        setTimeout(() => {
          if (this.isActive) {
            this.stop();
          }
        }, 2000);
      }
    }

    stop() {
      this.isActive = false;
      this.isRunning = false;
      this.currentStep = 0;

      requestAnimationFrame(() => {
        this.button?.classList.remove("guide-mode-btn--active");
        this.indicator?.classList.remove("guide-indicator--active");
        this.indicator?.setAttribute("aria-hidden", "true");

        this.dots?.forEach((dot) => {
          dot.className = "dot";
        });
      });

      this.vnSystem?.close();
      this.audioManager?.playSFX("close");
    }
  }

  // ═══════════════════════════════════════════
  // 9. UI RENDERER - OPTIMIZED WITH README DISPLAY
  // ═══════════════════════════════════════════
  // ═══════════════ UPDATED UIRenderer CLASS - AUTO DISPLAY SCREENSHOT ═══════════════
  class UIRenderer {
    constructor() {
      this.githubManager = null;
      this.carouselTrack = document.getElementById("carTrack");
      this.carouselDots = document.getElementById("carDots");
      this.projectGrid = document.getElementById("projectGrid");
      this.projectLoader = document.getElementById("projectLoader");
      this.projectEmpty = document.getElementById("projectEmpty");
      this.filterTabs = document.querySelectorAll("#filterTabs .filter-tab");
      this.currentCarouselIndex = 0;
      this.autoplayTimer = null;
      this.autoplayDelay = CONFIG.AUTOPLAY_DELAY;
      this.isHovering = false;
      this.totalCarouselSlides = 0;
      this.audioManager = null;
      this.screenshotCache = new Map();
      this.isGithubPages = window.location.hostname.includes("github.io");
      this.isVercel = window.location.hostname.includes("vercel.app");
      this.basePath = this.isGithubPages
        ? `/${window.location.pathname.split("/")[1]}`
        : "";
      this._handlePreviewToggle = this._handlePreviewToggle.bind(this);
    }

    // ═══════════════ CAROUSEL METHODS ═══════════════
    // ═══════════════ CAROUSEL METHODS - UPDATED ═══════════════
    _createSlideHTML(repo, index = 0) {
      const initial = (repo.name || "?").charAt(0).toUpperCase();
      const hasPages = repo.has_pages || repo.homepage;
      const pagesUrl =
        repo.homepage ||
        `https://${this.githubManager.username}.github.io/${repo.name}`;

      // SMART SCREENSHOT untuk carousel
      const screenshotUrl = this._getSmartScreenshot(repo, pagesUrl, hasPages);

      const langBadge = repo.language
        ? `<span class="slide__tag slide__tag--language">
        <span class="slide__lang-dot" style="background:${getLanguageColor(repo.language)}"></span>${repo.language}
       </span>`
        : "";

      const demoLink = hasPages
        ? `<a class="slide__link slide__link--demo" href="${pagesUrl}" target="_blank" rel="noopener">
        ${ICONS.demo} Live Demo
       </a>`
        : "";

      return `
    <!-- Screenshot Preview -->
    <div class="slide__screenshot-wrapper">
      <img src="${screenshotUrl}" 
           alt="${repo.name}" 
           class="slide__screenshot" 
           loading="lazy"
           onerror="this.onerror=null; this.style.display='none'; this.nextElementSibling.style.display='flex';">
    
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
        <a href="${repo.html_url}" target="_blank" rel="noopener">${repo.name}</a>
      </h4>
    </div>
    
    <p class="slide__desc">${repo.description || "Tidak ada deskripsi."}</p>
    
    <div class="slide__stats">
      ${langBadge}
      <span class="slide__stat slide__stat--stars">${ICONS.star} ${repo.stargazers_count || 0}</span>
      <span class="slide__stat slide__stat--forks">${ICONS.fork} ${repo.forks_count || 0}</span>
      <span class="slide__stat slide__stat--updated">${ICONS.clock} ${timeAgo(repo.updated_at)}</span>
    </div>
    
    <div class="slide__actions">
      <a class="slide__link slide__link--repo" href="${repo.html_url}" target="_blank" rel="noopener">
        ${ICONS.repo} Source
      </a>
      ${demoLink}
    </div>`;
    }

    _createSkeletonSlideHTML() {
      return `
    <div class="skeleton skeleton--image"></div>
    <div class="skeleton skeleton--icon"></div>
    <div class="skeleton skeleton--title"></div>
    <div class="skeleton skeleton--text"></div>
    <div class="skeleton skeleton--text short"></div>
    <div class="skeleton skeleton--tags"></div>`;
    }

    _createSkeletonSlideHTML() {
      return `<div class="skeleton skeleton--image"></div><div class="skeleton skeleton--icon"></div><div class="skeleton skeleton--title"></div><div class="skeleton skeleton--text"></div><div class="skeleton skeleton--text short"></div><div class="skeleton skeleton--tags"></div>`;
    }

    // ═══════════════ PROJECT CARD - AUTO DISPLAY SCREENSHOT ═══════════════
    _createProjectCardHTML(repo) {
      const created = new Date(repo.created_at);
      const dateStr = created.toLocaleDateString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      // Determine if repo has GitHub Pages
      const hasPages = repo.has_pages || repo.homepage;
      const pagesUrl =
        repo.homepage ||
        `https://${this.githubManager.username}.github.io/${repo.name}`;

      // Determine category
      const category = this.githubManager.categorizeRepo(repo);
      const categoryLabels = {
        web: "🌐 Web",
        game: "🎮 Game",
        design: "🎨 Design",
        other: "📦 Lainnya",
      };
      const categoryLabel = categoryLabels[category] || "📦 Lainnya";

      // Determine rarity
      const rarity = this._getRarity(repo);

      // Check README
      const hasReadme =
        repo.readme &&
        typeof repo.readme === "string" &&
        repo.readme.length > 10;

      // SMART SCREENSHOT - Auto display sesuai tipe repo
      const screenshotUrl = this._getSmartScreenshot(repo, pagesUrl, hasPages);

      // Determine what preview tabs to show
      const showPagesTab = hasPages;
      const showReadmeTab = hasReadme && !hasPages; // Hanya tampilkan tab README jika TIDAK ada Pages
      const showToggle = showPagesTab || showReadmeTab;

      return `
      <article class="project-card project-card--${rarity}" data-repo="${repo.name}">
        <div class="project-card__preview">
          <!-- Screenshot Auto-Display -->
          <div class="project-card__preview-cover">
            <img src="${screenshotUrl}" alt="${repo.name}" class="project-card__preview-img" loading="lazy"
                 onerror="this.onerror=null; this.src='${this._getSVGPlaceholder(repo.name, repo.language)}'">
            
            <!-- Badge indicator -->
            ${
              hasPages
                ? '<span class="project-card__badge project-card__badge--live">🌐</span>'
                : '<span class="project-card__badge project-card__badge--repo">📂 Repository</span>'
            }
          </div>
          
          <!-- GitHub Pages Preview Overlay (for toggle) -->
          ${showPagesTab ? `` : ""}
          
          <!-- README Preview Overlay (for code-only repos) -->
          ${
            showReadmeTab
              ? `
        <div class="project-card__readme-overlay" hidden;">
            <div class="readme-header">
              <span>📄 README.md</span>
              <a href="${repo.html_url}#readme" target="_blank" rel="noopener" class="readme-view-full">Lihat di GitHub ↗</a>
            </div>
            <div class="readme-content">${this._safeMarkdownParse(repo.readme)}</div>
            <div class="readme-fade"></div>
          </div>`
              : ""
          }
          
          <!-- Toggle Buttons (hanya jika ada yang bisa di-toggle) -->
          ${
            showToggle
              ? `
          <div class="project-card__preview-toggle">
            <button class="active" data-view="cover" title="Tampilan Screenshot">
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
        
        <!-- Card Body -->
        <div class="project-card__body">
          <h3 class="project-card__title">${repo.name}</h3>
          <p class="project-card__desc">${repo.description || "Tidak ada deskripsi."}</p>
          <span class="project-card__date">📅 ${dateStr} | Diperbarui: ${timeAgo(repo.updated_at)}</span>
          <div class="project-card__meta">
            ${repo.language ? `<span class="project-card__tag project-card__tag--lang" style="background:${getLanguageColor(repo.language)}20;color:${getLanguageColor(repo.language)}">${repo.language}</span>` : ""}
            <span class="project-card__tag">⭐ ${repo.stargazers_count || 0}</span>
            <span class="project-card__tag">🍴 ${repo.forks_count || 0}</span>
            <span class="project-card__tag">${categoryLabel}</span>
            ${hasPages ? '<span class="project-card__tag project-card__tag--pages">🌐 Live</span>' : ""}
          </div>
          <div class="project-card__actions">
            <a href="${repo.html_url}" target="_blank" rel="noopener" class="project-card__link">${ICONS.repo} Source</a>
            ${hasPages ? `<a href="${pagesUrl}" target="_blank" rel="noopener" class="project-card__view project-card__view--demo">${ICONS.demo} Live Demo</a>` : ""}
            ${hasReadme ? `<button class="project-card__view project-card__view--readme-btn" data-view-readme="${repo.name}">${ICONS.readme} README</button>` : ""}
          </div>
        </div>
      </article>`;
    }

    // ═══════════════ SMART SCREENSHOT LOGIC ═══════════════
    /**
     * Get the best screenshot for a repository
     * - Repo dengan GitHub Pages → Screenshot website live
     * - Repo code-only → Screenshot halaman GitHub (menampilkan README)
     * @param {Object} repo - Repository object
     * @param {string} pagesUrl - GitHub Pages URL
     * @param {boolean} hasPages - Whether repo has GitHub Pages
     * @returns {string} Screenshot URL
     */
    // ═══════════════ UPDATED SCREENSHOT METHODS ═══════════════

    /**
     * Get the best screenshot for a repository
     * Multiple fallback layers:
     * 1. GitHub OpenGraph Image (selalu works)
     * 2. thum.io (hanya di production)
     * 3. SVG Placeholder (last resort)
     */
    _getSmartScreenshot(repo, pagesUrl, hasPages) {
      const cacheKey = `screenshot_${repo.name}`;

      // Check cache first
      if (this.screenshotCache.has(cacheKey)) {
        return this.screenshotCache.get(cacheKey);
      }

      let screenshotUrl;
      const isLocalhost =
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1" ||
        window.location.hostname.includes("192.168.");

      if (hasPages && pagesUrl) {
        // ═══════════════════════════════════════
        // REPO DENGAN GITHUB PAGES
        // ═══════════════════════════════════════
        console.log(`📸 [Pages] Screenshot: ${repo.name}`);

        if (isLocalhost) {
          // Localhost: langsung gunakan OpenGraph image sebagai fallback
          screenshotUrl = this._getGitHubOGImage(repo);
          console.log("   ⚠️ Localhost detected, using OpenGraph image");
        } else {
          // Production: coba thum.io
          screenshotUrl = `https://image.thum.io/get/width/640/crop/400/viewportWidth/1280/viewportHeight/800/wait/3/noanimate/${pagesUrl.replace(/\/$/, "")}`;
        }
      } else {
        // ═══════════════════════════════════════
        // REPO CODE-ONLY (TIDAK ADA PAGES)
        // ═══════════════════════════════════════
        console.log(`📸 [Repo] Screenshot: ${repo.name}`);

        // GitHub OpenGraph Image (paling reliable)
        screenshotUrl = this._getGitHubOGImage(repo);
      }

      // Cache untuk performance
      this.screenshotCache.set(cacheKey, screenshotUrl);
      return screenshotUrl;
    }

    /**
     * Generate GitHub OpenGraph Image URL
     * Ini adalah gambar yang selalu tersedia dari GitHub
     * Menampilkan: repo name, description, stars, language, dll
     */
    _getGitHubOGImage(repo) {
      const repoName = repo.name;
      const username = this.githubManager?.username || CONFIG.USERNAME;

      // GitHub OpenGraph Image - selalu available, no rate limit
      return `https://opengraph.githubassets.com/1/${username}/${repoName}`;
    }

    /**
     * Get alternative screenshot URL (untuk retry)
     */
    _getAlternativeScreenshot(repo, pagesUrl, hasPages) {
      const alternatives = [];

      // 1. GitHub OpenGraph Image
      alternatives.push(this._getGitHubOGImage(repo));

      // 2. GitHub Social Preview (alternatif OG image)
      alternatives.push(
        `https://opengraph.githubassets.com/${Date.now()}/${this.githubManager?.username || CONFIG.USERNAME}/${repo.name}`,
      );

      // 3. Jika ada Pages, coba dengan parameter berbeda
      if (hasPages && pagesUrl) {
        // Gunakan screenshot service lain
        alternatives.push(
          `https://api.microlink.io/?url=${encodeURIComponent(pagesUrl)}&screenshot=true&meta=false&embed=screenshot.url`,
        );
      }

      // 4. Jika ada demo di Vercel/Netlify
      if (
        repo.homepage &&
        (repo.homepage.includes("vercel.app") ||
          repo.homepage.includes("netlify.app"))
      ) {
        alternatives.push(
          `https://image.thum.io/get/width/640/crop/400/quality/80/noanimate/${repo.homepage.replace(/\/$/, "")}`,
        );
      }

      return alternatives;
    }

    /**
     * Handle image error dengan retry logic
     */
    _handleImageError(e) {
      const img = e.target;

      // Cegah infinite loop
      if (img.dataset.errorHandled === "true") {
        this._showImageFallback(img);
        return;
      }

      const retryCount = parseInt(img.dataset.retryCount) || 0;
      const maxRetries = 2;

      console.warn(
        `⚠️ Image error for ${img.alt || "unknown"} (retry: ${retryCount}/${maxRetries})`,
      );

      if (retryCount < maxRetries) {
        // Cari alternative URL
        const repoName = img.closest("[data-repo]")?.dataset?.repo;
        const card = img.closest(".project-card");
        const repo = this.githubManager?.repositories?.find(
          (r) => r.name === repoName,
        );

        if (repo) {
          const hasPages = repo.has_pages || repo.homepage;
          const pagesUrl =
            repo.homepage ||
            `https://${this.githubManager.username}.github.io/${repo.name}`;
          const alternatives = this._getAlternativeScreenshot(
            repo,
            pagesUrl,
            hasPages,
          );

          if (alternatives[retryCount]) {
            console.log(
              `   🔄 Trying alternative: ${alternatives[retryCount].substring(0, 80)}...`,
            );
            img.src = alternatives[retryCount];
            img.dataset.retryCount = retryCount + 1;
            return;
          }
        }
      }

      // Jika semua retry gagal, tampilkan fallback
      this._showImageFallback(img);
    }

    /**
     * Tampilkan placeholder jika semua gambar gagal
     */
    _showImageFallback(img) {
      img.dataset.errorHandled = "true";

      // Gunakan SVG placeholder
      const repoName = img.closest("[data-repo]")?.dataset?.repo || "Project";
      const card = img.closest(".project-card");
      const repo = this.githubManager?.repositories?.find(
        (r) => r.name === repoName,
      );
      const lang = repo?.language || "Repository";

      // Buat SVG placeholder sebagai data URL
      const svgPlaceholder = this._getSVGPlaceholder(repoName, lang);
      img.src = svgPlaceholder;

      // Tampilkan juga fallback element jika ada
      const wrapper = img.closest(
        ".slide__screenshot-wrapper, .project-card__preview-cover",
      );
      if (wrapper) {
        const fallbackEl = wrapper.querySelector(
          ".slide__screenshot-fallback, .project-card__preview--placeholder",
        );
        if (fallbackEl) {
          fallbackEl.classList.add("is-flex");
          fallbackEl.classList.remove("is-hidden");
        }
      }

      // Hapus onerror untuk mencegah loop
      img.onerror = null;
    }

    /**
     * Generate SVG Placeholder (diperbarui)
     */
    _getSVGPlaceholder(name, lang) {
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
      const shortName = (name || "Project").substring(0, 20);

      const svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" width="640" height="400" viewBox="0 0 640 400">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${color}15"/>
          <stop offset="50%" stop-color="${color}08"/>
          <stop offset="100%" stop-color="${color}12"/>
        </linearGradient>
        <linearGradient id="border" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${color}30"/>
          <stop offset="100%" stop-color="${color}10"/>
        </linearGradient>
      </defs>
      
      <!-- Background -->
      <rect fill="#0a0a14" width="640" height="400"/>
      <rect fill="url(#bg)" width="640" height="400"/>
      
      <!-- Border -->
      <rect x="20" y="20" width="600" height="360" rx="12" 
            fill="none" stroke="url(#border)" stroke-width="1.5"/>
      
      <!-- Decorative elements -->
      <circle cx="80" cy="80" r="40" fill="${color}08"/>
      <circle cx="560" cy="320" r="60" fill="${color}05"/>
      <rect x="400" y="60" width="180" height="2" rx="1" fill="${color}15"/>
      <rect x="420" y="75" width="120" height="2" rx="1" fill="${color}10"/>
      
      <!-- Icon -->
      <text x="320" y="170" text-anchor="middle" font-size="64" opacity="0.3">📂</text>
      
      <!-- Repository Name -->
      <text x="320" y="230" text-anchor="middle" 
            fill="${color}" font-family="monospace" font-size="22" 
            font-weight="bold" opacity="0.9">
        ${this._escapeXml(shortName)}
      </text>
      
      <!-- Language Badge -->
      <rect x="270" y="260" width="100" height="28" rx="14" 
            fill="${color}20" stroke="${color}40" stroke-width="1"/>
      <text x="320" y="279" text-anchor="middle" 
            fill="${color}" font-family="monospace" font-size="12" font-weight="600">
        ${this._escapeXml(lang || "Repository")}
      </text>
      
      <!-- Decorative dots -->
      <circle cx="140" cy="340" r="3" fill="${color}20"/>
      <circle cx="155" cy="340" r="3" fill="${color}25"/>
      <circle cx="170" cy="340" r="3" fill="${color}30"/>
      
      <!-- Bottom text -->
      <text x="320" y="360" text-anchor="middle" 
            fill="${color}40" font-family="monospace" font-size="11">
        GitHub Repository
      </text>
    </svg>
  `;

      return `data:image/svg+xml,${encodeURIComponent(svgContent.replace(/\s+/g, " ").trim())}`;
    }

    /**
     * Escape XML special characters
     */
    _escapeXml(str) {
      return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
    }

    /**
     * Attach image error handlers
     */
    _attachImageErrorHandlers() {
      const images = document.querySelectorAll(
        ".project-card__preview-img, .slide__screenshot",
      );

      images.forEach((img) => {
        // Hapus handler lama
        img.removeEventListener("error", this._boundHandleImageError);
        // Tambah handler baru
        img.addEventListener("error", this._boundHandleImageError);
      });
    }
    // Safe markdown parser for README overlay
    _safeMarkdownParse(md) {
      if (!md) return "<p>No README available</p>";
      try {
        const truncated = md.substring(0, 3000);
        if (typeof marked !== "undefined" && marked.parse) {
          return marked.parse(truncated);
        }
        return `<pre>${escapeHtml(truncated)}</pre>`;
      } catch (e) {
        return `<pre>${escapeHtml(md.substring(0, 500))}</pre>`;
      }
    }

    // Generate SVG placeholder
    _getSVGPlaceholder(name, lang) {
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
        default: "#7c3aed",
      };
      const color = colors[lang] || colors.default;
      return `data:image/svg+xml,${encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="400">
          <defs>
            <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="${color}22"/>
              <stop offset="100%" stop-color="${color}08"/>
            </linearGradient>
          </defs>
          <rect fill="url(#g)" width="640" height="400"/>
          <text fill="${color}" font-family="monospace" font-size="24" font-weight="bold" 
                x="320" y="180" text-anchor="middle" opacity="0.8">
            ${(name || "Project").substring(0, 20)}
          </text>
          <text fill="${color}88" font-family="monospace" font-size="14"
                x="320" y="220" text-anchor="middle" opacity="0.6">
            ${lang || "Repository"}
          </text>
        </svg>`,
      )}`;
    }

    // Get rarity based on stars
    _getRarity(repo) {
      const s = repo.stargazers_count || 0;
      if (s >= 10) return "Legend";
      if (s >= 3) return "Epic";
      return "Common";
    }

    // Handle preview toggle button clicks
    _handlePreviewToggle(e) {
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

      // Hide all layers
      Object.values(layers).forEach((l) => {
        if (l) l.style.display = "none";
      });

      // Show selected layer
      if (layers[btn.dataset.view]) {
        layers[btn.dataset.view].style.display =
          btn.dataset.view === "readme" ? "flex" : "block";
      }

      // Update active button state
      preview
        .querySelectorAll(".project-card__preview-toggle button")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
    }

    // Attach preview toggle listeners
    _attachPreviewListeners() {
      // Toggle buttons
      document
        .querySelectorAll(".project-card__preview-toggle")
        .forEach((toggle) => {
          toggle.removeEventListener("click", this._handlePreviewToggle);
          toggle.addEventListener("click", this._handlePreviewToggle);
        });

      // README button (toggle to show README overlay)
      document
        .querySelectorAll(".project-card__view--readme-btn")
        .forEach((btn) => {
          btn.removeEventListener("click", this._handleReadmeBtnClick);
          btn.addEventListener("click", this._handleReadmeBtnClick.bind(this));
        });
    }

    _handleReadmeBtnClick(e) {
      e.preventDefault();
      const btn = e.currentTarget;
      const card = btn.closest(".project-card");
      if (!card) return;

      const readmeOverlay = card.querySelector(".project-card__readme-overlay");
      const cover = card.querySelector(".project-card__preview-cover");

      if (readmeOverlay && cover) {
        const isShowing = readmeOverlay.style.display === "flex";

        if (isShowing) {
          // Kembali ke screenshot
          readmeOverlay.style.display = "none";
          cover.style.display = "block";
          btn.innerHTML = `${ICONS.readme} README`;
          btn.classList.remove("active");
        } else {
          // Tampilkan README
          readmeOverlay.style.display = "flex";
          cover.style.display = "none";
          btn.innerHTML = "✕ Tutup README";
          btn.classList.add("active");

          // Reset toggle buttons ke cover
          const toggleBtns = card.querySelectorAll(
            ".project-card__preview-toggle button",
          );
          toggleBtns.forEach((b) => b.classList.remove("active"));
          const coverBtn = card.querySelector('[data-view="readme"]');
          if (coverBtn) coverBtn.classList.add("active");
        }
      }
    }

    // ═══════════════ SETTERS ═══════════════
    setGitHubManager(m) {
      this.githubManager = m;
    }
    setAudioManager(a) {
      this.audioManager = a;
    }

    // ═══════════════ RENDER METHODS ═══════════════
    renderSkeleton(count = 3) {
      if (!this.carouselTrack) return;
      this.stopAutoplay();
      this.carouselTrack.innerHTML = "";
      if (this.carouselDots) this.carouselDots.innerHTML = "";

      for (let i = 0; i < count; i++) {
        const s = document.createElement("div");
        s.className = "carousel__slide carousel__slide--skeleton";
        s.innerHTML = this._createSkeletonSlideHTML();
        this.carouselTrack.appendChild(s);
      }
    }

    renderError(msg = "Gagal memuat data.", onRetry = null) {
      if (!this.carouselTrack) return;
      this.stopAutoplay();
      this.carouselTrack.innerHTML = `
        <div class="car-error">
          <span class="car-error__icon">⚠️</span>
          <p class="car-error__msg">${msg}</p>
          <button class="car-error__retry" id="carRetryBtn">Coba Lagi</button>
        </div>`;
      if (this.carouselDots) this.carouselDots.innerHTML = "";
      document
        .getElementById("carRetryBtn")
        ?.addEventListener("click", onRetry);
    }

    renderCarousel() {
      if (!this.carouselTrack || !this.carouselDots || !this.githubManager)
        return;
      this.stopAutoplay();

      const slides = this.githubManager.getFeaturedRepos(6);
      this.totalCarouselSlides = slides.length;
      this.carouselTrack.innerHTML = "";
      this.carouselDots.innerHTML = "";

      if (!slides.length) {
        this.renderError("Belum ada repository.");
        return;
      }

      slides.forEach((repo, i) => {
        const s = document.createElement("div");
        s.className = "carousel__slide";
        s.setAttribute("role", "listitem");
        s.tabIndex = 0;
        s.innerHTML = this._createSlideHTML(repo, i);
        this.carouselTrack.appendChild(s);

        const d = document.createElement("button");
        d.type = "button";
        d.className = "carousel__dot";
        d.setAttribute("role", "tab");
        d.setAttribute("aria-label", `Slide ${i + 1}`);
        if (i === 0) d.classList.add("carousel__dot--active");
        d.addEventListener("click", () => {
          this.goToCarouselSlide(i);
          this._restartAutoplay();
        });
        this.carouselDots.appendChild(d);
      });

      document.getElementById("totalSlideNum") &&
        (document.getElementById("totalSlideNum").textContent = slides.length);

      this._setupCarouselNavigation(slides.length);
      this.setupSwipeSupport();
      this.setupAutoplayPause();
      this.startAutoplay();
    }

    _setupCarouselNavigation(total) {
      const prev = document.getElementById("carPrev");
      const next = document.getElementById("carNext");
      const slides = this.carouselTrack.querySelectorAll(".carousel__slide");
      const dots = this.carouselDots.querySelectorAll(".carousel__dot");

      const update = (i) => {
        dots.forEach((d, j) =>
          d.classList.toggle("carousel__dot--active", j === i),
        );
        document.getElementById("currentSlideNum") &&
          (document.getElementById("currentSlideNum").textContent = i + 1);
        document.getElementById("carProgressFill") &&
          (document.getElementById("carProgressFill").style.width =
            `${((i + 1) / total) * 100}%`);
        if (prev) prev.disabled = i === 0;
        if (next) next.disabled = i === total - 1;
      };

      const go = (i) => {
        if (!slides.length) return;
        i = Math.max(0, Math.min(i, total - 1));
        this.carouselTrack.scrollTo({
          left: i * (slides[0].offsetWidth + 18),
          behavior: "smooth",
        });
        this.currentCarouselIndex = i;
        update(i);
      };

      prev?.addEventListener("click", () => {
        go(Math.max(this.currentCarouselIndex - 1, 0));
        this._restartAutoplay();
      });
      next?.addEventListener("click", () => {
        go(Math.min(this.currentCarouselIndex + 1, total - 1));
        this._restartAutoplay();
      });

      let scrollTimer;
      this.carouselTrack.addEventListener("scroll", () => {
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(() => {
          if (!slides.length) return;
          const newIndex = Math.round(
            this.carouselTrack.scrollLeft / (slides[0].offsetWidth + 18),
          );
          if (
            newIndex !== this.currentCarouselIndex &&
            newIndex >= 0 &&
            newIndex < total
          ) {
            this.currentCarouselIndex = newIndex;
            update(newIndex);
          }
        }, 50);
      });

      update(0);
      this.goToCarouselSlide = go;
    }

    startAutoplay() {
      this.stopAutoplay();
      if (this.totalCarouselSlides <= 1) return;
      this.autoplayTimer = setInterval(() => {
        if (this.isHovering) return;
        this.goToCarouselSlide(
          (this.currentCarouselIndex + 1) % this.totalCarouselSlides,
        );
      }, this.autoplayDelay);
    }

    stopAutoplay() {
      if (this.autoplayTimer) {
        clearInterval(this.autoplayTimer);
        this.autoplayTimer = null;
      }
    }

    _restartAutoplay() {
      if (this.totalCarouselSlides > 1) this.startAutoplay();
    }

    setupAutoplayPause() {
      const carousel = this.carouselTrack?.closest(".carousel");
      if (!carousel || carousel.dataset.ab) return;
      carousel.dataset.ab = "1";
      carousel.addEventListener("mouseenter", () => (this.isHovering = true));
      carousel.addEventListener("mouseleave", () => (this.isHovering = false));
    }

    setupSwipeSupport() {
      const track = this.carouselTrack;
      if (!track || track.dataset.sb) return;
      track.dataset.sb = "1";

      let startX = 0,
        startY = 0,
        isSwiping = false;

      track.addEventListener(
        "touchstart",
        (e) => {
          startX = e.touches[0].clientX;
          startY = e.touches[0].clientY;
          isSwiping = true;
          this.isHovering = true;
        },
        { passive: true },
      );

      track.addEventListener(
        "touchend",
        (e) => {
          if (!isSwiping) return;
          isSwiping = false;
          this.isHovering = false;
          const dx = startX - e.changedTouches[0].clientX;
          const dy = startY - e.changedTouches[0].clientY;
          if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
            this.goToCarouselSlide(
              dx > 0
                ? Math.min(
                    this.currentCarouselIndex + 1,
                    this.totalCarouselSlides - 1,
                  )
                : Math.max(this.currentCarouselIndex - 1, 0),
            );
            this._restartAutoplay();
          }
        },
        { passive: true },
      );
    }

    renderProjects(filter = "all") {
      if (!this.projectGrid || !this.githubManager) return;
      const repos = this.githubManager.getFilteredRepos(filter);

      if (!repos.length) {
        this.projectGrid.innerHTML = "";
        if (this.projectEmpty) this.projectEmpty.style.display = "block";
        return;
      }

      if (this.projectEmpty) this.projectEmpty.style.display = "none";

      const frag = document.createDocumentFragment();
      repos.forEach((repo) => {
        const div = document.createElement("div");
        div.innerHTML = this._createProjectCardHTML(repo);
        frag.appendChild(div.firstElementChild);
      });

      this.projectGrid.innerHTML = "";
      this.projectGrid.appendChild(frag);
      this._attachPreviewListeners();
    }

    setupFilterTabs() {
      this.filterTabs.forEach((tab) => {
        tab.addEventListener("click", () => {
          this.filterTabs.forEach((t) =>
            t.classList.remove("filter-tab--active"),
          );
          tab.classList.add("filter-tab--active");
          this.renderProjects(tab.dataset.filter);
          this.audioManager?.playSFX("menuSelect");
        });
      });
    }

    // ═══════════════════════════════════════════
    // PERBAIKAN 5: Update UIRenderer.updateStats
    // ═══════════════════════════════════════════
    // Di UIRenderer class, update method updateStats:
    updateStats(repos, totalCommits, userData, lastActiveDate = null) {
      // Update repo count
      const repoCountEl = document.getElementById("repoCount");
      if (repoCountEl) repoCountEl.textContent = repos.length;

      // Update star count
      const starCountEl = document.getElementById("starCount");
      if (starCountEl) {
        const totalStars = repos.reduce(
          (sum, r) => sum + (r.stargazers_count || 0),
          0,
        );
        starCountEl.textContent = totalStars;
      }

      // Update commit count
      const commitCountEl = document.getElementById("commitCount");
      if (commitCountEl) commitCountEl.textContent = totalCommits + "+";

      // Update active since
      const activeSinceEl = document.getElementById("activeSince");
      if (activeSinceEl && userData?.created_at) {
        activeSinceEl.textContent = new Date(userData.created_at).getFullYear();
      }

      // ⚠️ UPDATE LAST ACTIVE - Gunakan lastActiveDate!
      const lastActiveEl = document.getElementById("lastActive");
      if (lastActiveEl) {
        if (lastActiveDate) {
          lastActiveEl.textContent = timeAgo(lastActiveDate);
        } else if (userData?.updated_at) {
          // Fallback ke profile updated_at
          lastActiveEl.textContent = timeAgo(userData.updated_at);
        } else {
          lastActiveEl.textContent = "—";
        }
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
          if (progress < 1) requestAnimationFrame(update);
          else element.textContent = target + suffix;
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
      if (this.projectLoader)
        this.projectLoader.style.display = show ? "flex" : "none";
    }
  }

  // ═══════════════════════════════════════════
  // 10. NAVIGATION SYSTEM
  // ═══════════════════════════════════════════
  class NavigationSystem {
    constructor() {
      this.views = document.querySelectorAll(".view");
      this.navLinks = document.querySelectorAll("[data-route]");
      this.menuToggle = document.getElementById("menuToggle");
      this.navMenu = document.getElementById("navMenu");
      this.currentRoute = "home";
      this.vnSystem = null;
      this.audioManager = null;
      this.githubManager = null;
      this.uiRenderer = null;

      this.bindEvents();
      this.handleRouteParam();
    }

    _setActiveView(route) {
      this.views.forEach((v) => v.classList.remove("view--active"));
      const target = document.getElementById(route);
      if (target) {
        target.classList.add("view--active");
      }
    }

    _setActiveNav(route) {
      this.navLinks.forEach((link) => {
        link.classList.remove("active");
        if (link.dataset.route === route) link.classList.add("active");
      });
    }

    bindEvents() {
      this.navLinks.forEach((link) => {
        link.addEventListener("click", (e) => {
          e.preventDefault();
          const route = link.dataset.route;
          this.navigate(route);
        });
      });

      this.menuToggle?.addEventListener("click", () => {
        this.navMenu?.classList.toggle("navbar__menu--open");
        this.menuToggle?.setAttribute(
          "aria-expanded",
          this.navMenu?.classList.contains("navbar__menu--open"),
        );
      });

      // Close menu when clicking outside
      document.addEventListener("click", (e) => {
        if (this.navMenu?.classList.contains("navbar__menu--open")) {
          if (!e.target.closest(".navbar")) {
            this.navMenu.classList.remove("navbar__menu--open");
            this.menuToggle?.setAttribute("aria-expanded", "false");
          }
        }
      });

      // Keyboard navigation
      document.addEventListener("keydown", (e) => {
        if (
          e.key === "Escape" &&
          this.navMenu?.classList.contains("navbar__menu--open")
        ) {
          this.navMenu.classList.remove("navbar__menu--open");
          this.menuToggle?.setAttribute("aria-expanded", "false");
          this.menuToggle?.focus();
        }
      });
    }

    setVNDialogue(vnSystem) {
      this.vnSystem = vnSystem;
    }
    setAudioManager(audioManager) {
      this.audioManager = audioManager;
    }
    setGitHubManager(githubManager) {
      this.githubManager = githubManager;
    }
    setUIRenderer(uiRenderer) {
      this.uiRenderer = uiRenderer;
    }

    handleRouteParam() {
      const params = new URLSearchParams(window.location.search);
      const route = params.get("route");
      if (route) {
        setTimeout(() => this.navigate(route, true), 100);
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname,
        );
      }
    }

    navigate(route, skipDialogue = false) {
      if (!route || route === this.currentRoute) return;

      this._setActiveView(route);
      this._setActiveNav(route);
      this.currentRoute = route;

      // Close mobile menu
      this.navMenu?.classList.remove("navbar__menu--open");
      this.menuToggle?.setAttribute("aria-expanded", "false");

      // Scroll to top
      window.scrollTo({ top: 0, behavior: "smooth" });

      // Load projects when navigating to project view
      if (route === "project") {
        this.loadProjects();
      }

      // Open dialogue
      if (!skipDialogue && this.vnSystem && !this.vnSystem.isActive()) {
        setTimeout(() => this.vnSystem.open(route), 500);
      }

      // Update URL
      const url = new URL(window.location);
      url.searchParams.set("route", route);
      window.history.pushState({ route }, "", url);
    }

    async loadProjects() {
      if (!this.githubManager || !this.uiRenderer) return;

      // If already loaded, just render
      if (this.githubManager.isLoaded) {
        this.uiRenderer.renderProjects("all");
        return;
      }

      this.uiRenderer.showLoader(true);
      try {
        await this.githubManager.fetchAllRepos();
        this.uiRenderer.renderCarousel(this.githubManager.repositories);
        this.uiRenderer.renderProjects("all");
        this.uiRenderer.setupFilterTabs();
        this.uiRenderer.updateStats(
          this.githubManager.repositories,
          this.githubManager.totalCommits,
        );
        window.playSFX?.("questClear");
      } catch (error) {
        console.error("Failed to load projects:", error);
        if (this.uiRenderer.projectGrid) {
          this.uiRenderer.projectGrid.innerHTML = `<p style="color:var(--accent);text-align:center;">Gagal memuat: ${error.message}</p>`;
        }
      } finally {
        this.uiRenderer.showLoader(false);
      }
    }

    getCurrentRoute() {
      return this.currentRoute;
    }
  }

  // ═══════════════════════════════════════════
  // 11. PAGE LOADER
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

      window.addEventListener("load", () => {
        this.complete();
      });

      // Safety timeout
      setTimeout(() => {
        if (!this.isComplete) {
          console.warn("⚠️ Loader timeout - force hiding");
          this.complete();
        }
      }, CONFIG.LOADER_TIMEOUT);
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
          this.setProgress(step.progress);
        }, step.delay);
      });
    }

    setProgress(value) {
      this.progress = Math.min(value, 90);
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

      this.setProgress(100);

      setTimeout(() => {
        this.loader?.classList.add("hidden");
        setTimeout(() => {
          this.loader?.remove();
          console.log("🍁 Page loaded successfully!");
        }, 600);
      }, 400);
    }
  }
  // ═══════════════════════════════════════════
  // PWA HANDLER v2.0 - ENHANCED
  // ═══════════════════════════════════════════
  class PWAHandler {
    constructor(options = {}) {
      // DOM Elements
      this.installBtn = document.getElementById("installApp");
      this.updateBtn = document.getElementById("updateApp");
      this.offlineIndicator = document.getElementById("offlineIndicator");
      this.pwaStatus = document.getElementById("pwaStatus");
      this.installToast = document.getElementById("installToast");

      // State
      this.deferredPrompt = null;
      this.isInstalled = false;
      this.isOnline = navigator.onLine;
      this.isUpdateAvailable = false;
      this.waitingWorker = null;
      this.registration = null;

      // Configuration
      this.config = {
        installPromptDelay: 30000, // 30 detik sebelum prompt
        installPromptMinVisits: 2, // Minimal 2 kunjungan sebelum prompt
        updateCheckInterval: 3600000, // Check update setiap 1 jam
        offlinePage: "/offline.html",
        cacheName: "maple-portfolio-v2",
        cacheUrls: [
          "/",
          "/index.html",
          "/public/css/all.bundle.css",
          "/public/js/script.js",
          "/public/image/character/bofuri.jpeg",
          "/offline.html",
        ],
        analytics: {
          trackInstall: true,
          trackUpdate: true,
          trackOffline: true,
        },
        platform: this._detectPlatform(),
        ...options,
      };

      // Analytics
      this.analytics = options.analytics || null;

      // Bind methods
      this._onConnectionChange = this._onConnectionChange.bind(this);
      this._onUpdateFound = this._onUpdateFound.bind(this);
      this._onUpdateReady = this._onUpdateReady.bind(this);

      // Initialize
      this._init();
    }

    // ═══════════════ INITIALIZATION ═══════════════

    _init() {
      console.log("📱 Initializing PWA Handler...");

      // Check if already installed
      this._checkInstallStatus();

      // Bind install events
      this._bindInstallEvents();

      // Register service worker
      this._registerServiceWorker();

      // Monitor online/offline status
      this._bindConnectionEvents();

      // Setup update checker
      this._setupUpdateChecker();

      // Track PWA usage
      this._trackPWAUsage();

      // Show install prompt after delay
      this._scheduleInstallPrompt();

      // Add platform-specific optimizations
      this._applyPlatformOptimizations();

      console.log(`📱 Platform detected: ${this.config.platform.name}`);
    }

    // ═══════════════ PLATFORM DETECTION ═══════════════

    _detectPlatform() {
      const ua = navigator.userAgent || navigator.vendor || window.opera;

      // iOS detection
      if (/iPad|iPhone|iPod/.test(ua) && !window.MSStream) {
        return {
          name: "ios",
          isStandalone: window.navigator.standalone,
          supportsBeforeInstallPrompt: false,
          installGuide: "Tap the Share button and select 'Add to Home Screen'",
          icon: "📲",
          color: "#007AFF",
        };
      }

      // Android detection
      if (/android/i.test(ua)) {
        return {
          name: "android",
          isStandalone: window.matchMedia("(display-mode: standalone)").matches,
          supportsBeforeInstallPrompt: true,
          installGuide: "Tap 'Install' or use the browser menu",
          icon: "🤖",
          color: "#3DDC84",
        };
      }

      // Desktop detection
      return {
        name: "desktop",
        isStandalone: window.matchMedia("(display-mode: standalone)").matches,
        supportsBeforeInstallPrompt: true,
        installGuide: "Click the install icon in the address bar",
        icon: "💻",
        color: "#a855f7",
      };
    }

    // ═══════════════ INSTALL HANDLING ═══════════════

    _bindInstallEvents() {
      // Before Install Prompt (Android & Desktop)
      window.addEventListener("beforeinstallprompt", (event) => {
        // Prevent automatic prompt
        event.preventDefault();

        // Store the prompt
        this.deferredPrompt = event;

        console.log("📲 Install prompt available");

        // Track event
        this._trackEvent("pwa", "install_prompt_available");

        // Show install button if not already installed
        if (!this.isInstalled) {
          this._showInstallUI();
        }
      });

      // App Installed
      window.addEventListener("appinstalled", () => {
        this.isInstalled = true;
        this.deferredPrompt = null;

        console.log("✅ App installed successfully!");

        // Track installation
        this._trackEvent("pwa", "app_installed", {
          platform: this.config.platform.name,
        });

        // Hide install UI
        this._hideInstallUI();

        // Show celebration toast
        this._showToast(
          "🎉 App Terinstall!",
          "Maple's Portfolio siap digunakan!",
          "success",
        );

        // Trigger achievement
        window.dispatchEvent(new CustomEvent("maple:appInstalled"));
      });
    }

    async _checkInstallStatus() {
      // Check if app is running in standalone mode
      if (window.matchMedia("(display-mode: standalone)").matches) {
        this.isInstalled = true;
        console.log("📱 App is running in standalone mode");
        this._hideInstallUI();
        return;
      }

      // Check related apps (Android)
      if ("getInstalledRelatedApps" in navigator) {
        try {
          const relatedApps = await navigator.getInstalledRelatedApps();
          if (relatedApps.length > 0) {
            this.isInstalled = true;
            console.log("📱 App found in related apps");
            this._hideInstallUI();
          }
        } catch (error) {
          console.warn("getInstalledRelatedApps failed:", error.message);
        }
      }
    }

    async install() {
      if (!this.deferredPrompt) {
        // Fallback for iOS
        if (this.config.platform.name === "ios") {
          this._showIOSInstallGuide();
          return;
        }

        // Fallback for browsers without beforeinstallprompt
        this._showManualInstallGuide();
        return;
      }

      try {
        // Show the install prompt
        await this.deferredPrompt.prompt();

        // Wait for user choice
        const choiceResult = await this.deferredPrompt.userChoice;

        if (choiceResult.outcome === "accepted") {
          console.log("🍁 User accepted the install prompt");
          this._trackEvent("pwa", "install_accepted");
        } else {
          console.log("🍂 User dismissed the install prompt");
          this._trackEvent("pwa", "install_dismissed");

          // Store dismissal time
          localStorage.setItem(
            "maple_install_dismissed",
            Date.now().toString(),
          );
        }

        // Clear the prompt
        this.deferredPrompt = null;

        // Hide install UI
        this._hideInstallUI();
      } catch (error) {
        console.error("Install prompt failed:", error.message);
        this._trackEvent("pwa", "install_error", { error: error.message });
      }
    }

    _scheduleInstallPrompt() {
      // Check if recently dismissed
      const dismissed = localStorage.getItem("maple_install_dismissed");
      if (dismissed) {
        const dismissedTime = parseInt(dismissed);
        const daysSinceDismissed =
          (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24);

        if (daysSinceDismissed < 7) {
          console.log("📲 Install prompt dismissed recently, waiting...");
          return;
        }
      }

      // Check visit count
      const visits = this._getVisitCount();
      if (visits < this.config.installPromptMinVisits) {
        console.log(
          `📲 Waiting for more visits (${visits}/${this.config.installPromptMinVisits})`,
        );
        return;
      }

      // Schedule delayed prompt
      setTimeout(() => {
        if (!this.isInstalled && !this.deferredPrompt) {
          this._showInstallToast();
        }
      }, this.config.installPromptDelay);
    }

    _getVisitCount() {
      try {
        const visits = localStorage.getItem("maple_visit_count") || "0";
        return parseInt(visits);
      } catch (e) {
        return 0;
      }
    }

    // ═══════════════ UI METHODS ═══════════════

    _showInstallUI() {
      if (this.installBtn) {
        this.installBtn.style.display = "flex";
        this.installBtn.classList.add("install-btn--show");
        this.installBtn.addEventListener("click", () => this.install(), {
          once: true,
        });
      }
    }

    _hideInstallUI() {
      if (this.installBtn) {
        this.installBtn.classList.remove("install-btn--show");
        this.installBtn.classList.add("install-btn--hide");

        setTimeout(() => {
          this.installBtn.style.display = "none";
        }, 500);
      }
    }

    _showInstallToast() {
      if (this.installToast) {
        this.installToast.classList.add("install-toast--show");

        // Add install button inside toast
        const installAction = this.installToast.querySelector(
          ".install-toast__action",
        );
        if (installAction) {
          installAction.addEventListener(
            "click",
            () => {
              this.install();
              this.installToast.classList.remove("install-toast--show");
            },
            { once: true },
          );
        }

        // Auto-hide after 10 seconds
        setTimeout(() => {
          this.installToast?.classList.remove("install-toast--show");
        }, 10000);
      }
    }

    _showIOSInstallGuide() {
      this._showToast(
        "📲 Cara Install di iOS",
        "Tap ikon Share → 'Add to Home Screen' → 'Add'",
        "info",
        8000,
      );
    }

    _showManualInstallGuide() {
      this._showToast(
        "📲 Cara Install",
        this.config.platform.installGuide,
        "info",
        6000,
      );
    }

    _showToast(title, message, type = "info", duration = 5000) {
      // Create toast element
      const toast = document.createElement("div");
      toast.className = `pwa-toast pwa-toast--${type}`;
      toast.innerHTML = `
      <div class="pwa-toast__icon">${this.config.platform.icon}</div>
      <div class="pwa-toast__content">
        <span class="pwa-toast__title">${title}</span>
        <span class="pwa-toast__message">${message}</span>
      </div>
      <button class="pwa-toast__close" onclick="this.parentElement.remove()">✕</button>
    `;

      document.body.appendChild(toast);

      // Animate in
      requestAnimationFrame(() => {
        toast.classList.add("pwa-toast--visible");
      });

      // Auto remove
      setTimeout(() => {
        toast.classList.remove("pwa-toast--visible");
        setTimeout(() => toast.remove(), 500);
      }, duration);
    }

    // ═══════════════ SERVICE WORKER ═══════════════

    async _registerServiceWorker() {
      if (!("serviceWorker" in navigator)) {
        console.warn("📱 Service Worker not supported");
        return;
      }

      try {
        this.registration = await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
        });

        console.log("📱 Service Worker registered:", this.registration.scope);

        // Listen for updates
        this.registration.addEventListener("updatefound", this._onUpdateFound);

        // Check if there's already a waiting worker
        if (this.registration.waiting) {
          this._onUpdateReady(this.registration.waiting);
        }

        // Listen for messages from service worker
        navigator.serviceWorker.addEventListener("message", (event) => {
          this._handleSWMessage(event.data);
        });

        return this.registration;
      } catch (error) {
        console.error("📱 Service Worker registration failed:", error.message);
        return null;
      }
    }

    _onUpdateFound() {
      const newWorker = this.registration?.installing;
      if (!newWorker) return;

      console.log("📱 New service worker found...");

      newWorker.addEventListener("statechange", () => {
        if (
          newWorker.state === "installed" &&
          navigator.serviceWorker.controller
        ) {
          this._onUpdateReady(newWorker);
        }
      });
    }

    _onUpdateReady(worker) {
      this.waitingWorker = worker;
      this.isUpdateAvailable = true;

      console.log("📱 Update available!");

      // Show update button
      this._showUpdateUI();

      // Track update
      this._trackEvent("pwa", "update_available");
    }

    async updateApp() {
      if (!this.waitingWorker) return;

      console.log("📱 Applying update...");

      // Send skip waiting message
      this.waitingWorker.postMessage({ type: "SKIP_WAITING" });

      // Track update
      this._trackEvent("pwa", "update_applied");

      // Reload page
      window.location.reload();
    }

    _showUpdateUI() {
      if (this.updateBtn) {
        this.updateBtn.style.display = "flex";
        this.updateBtn.classList.add("update-btn--show");
        this.updateBtn.addEventListener("click", () => this.updateApp(), {
          once: true,
        });

        // Also show toast
        this._showToast(
          "🔄 Update Tersedia!",
          "Versi baru Maple's Portfolio siap diinstall",
          "info",
          0, // Don't auto-hide
        );
      }
    }

    _setupUpdateChecker() {
      // Check for updates periodically
      setInterval(() => {
        if (this.registration) {
          this.registration.update().catch((err) => {
            console.warn("Update check failed:", err.message);
          });
        }
      }, this.config.updateCheckInterval);

      // Also check when page becomes visible
      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible" && this.registration) {
          this.registration.update().catch(() => {});
        }
      });
    }

    _handleSWMessage(data) {
      switch (data.type) {
        case "CACHE_UPDATED":
          console.log("📱 Cache updated:", data.urls);
          break;

        case "OFFLINE_READY":
          console.log("📱 App is ready for offline use");
          this._trackEvent("pwa", "offline_ready");
          break;

        case "BACKGROUND_SYNC":
          console.log("📱 Background sync completed");
          break;

        default:
          console.log("📱 SW message:", data);
      }
    }

    // ═══════════════ OFFLINE HANDLING ═══════════════

    _bindConnectionEvents() {
      window.addEventListener("online", () => {
        this.isOnline = true;
        this._onConnectionChange();
      });

      window.addEventListener("offline", () => {
        this.isOnline = false;
        this._onConnectionChange();
      });

      // Initial check
      this._onConnectionChange();
    }

    _onConnectionChange() {
      if (this.isOnline) {
        console.log("📡 Back online!");
        this._hideOfflineIndicator();

        // Trigger sync
        this._syncData();

        // Reload if we were showing offline page
        if (window.location.pathname === this.config.offlinePage) {
          window.location.href = "/";
        }
      } else {
        console.log("📡 Offline mode");
        this._showOfflineIndicator();

        // Track offline event
        this._trackEvent("pwa", "offline_mode");
      }
    }

    _showOfflineIndicator() {
      if (this.offlineIndicator) {
        this.offlineIndicator.classList.add("offline-indicator--visible");
      }

      // Also show toast
      this._showToast(
        "📡 Offline Mode",
        "Kamu sedang offline. Beberapa fitur mungkin terbatas.",
        "warning",
        4000,
      );
    }

    _hideOfflineIndicator() {
      if (this.offlineIndicator) {
        this.offlineIndicator.classList.remove("offline-indicator--visible");
      }
    }

    async _syncData() {
      if (!("serviceWorker" in navigator) || !("SyncManager" in window)) {
        return;
      }

      try {
        const registration =
          this.registration || (await navigator.serviceWorker.ready);

        // Request background sync
        if ("sync" in registration) {
          await registration.sync.register("sync-github-data");
          console.log("📱 Background sync registered");
        }
      } catch (error) {
        console.warn("Background sync failed:", error.message);
      }
    }

    // ═══════════════ PLATFORM OPTIMIZATIONS ═══════════════

    _applyPlatformOptimizations() {
      const platform = this.config.platform;

      // iOS specific
      if (platform.name === "ios") {
        // Add iOS meta tags
        this._addMetaTag("apple-mobile-web-app-capable", "yes");
        this._addMetaTag(
          "apple-mobile-web-app-status-bar-style",
          "black-translucent",
        );
        this._addMetaTag("apple-mobile-web-app-title", "hayaxxdev");

        // Disable iOS zoom
        this._addMetaTag(
          "viewport",
          "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover",
        );

        // Add touch icon
        this._addLinkTag(
          "apple-touch-icon",
          "/public/image/apple-touch-icon.png",
        );
      }

      // Android specific
      if (platform.name === "android") {
        // Add Android meta tags
        this._addMetaTag("theme-color", "#050308");
        this._addMetaTag("mobile-web-app-capable", "yes");
      }

      // Add platform class to body
      document.body.classList.add(`platform--${platform.name}`);
      document.body.classList.add(
        this.isInstalled ? "pwa--installed" : "pwa--browser",
      );
    }

    _addMetaTag(name, content) {
      if (document.querySelector(`meta[name="${name}"]`)) return;

      const meta = document.createElement("meta");
      meta.name = name;
      meta.content = content;
      document.head.appendChild(meta);
    }

    _addLinkTag(rel, href) {
      if (document.querySelector(`link[rel="${rel}"]`)) return;

      const link = document.createElement("link");
      link.rel = rel;
      link.href = href;
      document.head.appendChild(link);
    }

    // ═══════════════ ANALYTICS ═══════════════

    _trackEvent(category, action, data = {}) {
      if (!this.config.analytics?.trackInstall) return;

      // Use Google Analytics if available
      if (window.gtag) {
        window.gtag("event", action, {
          event_category: category,
          event_label: JSON.stringify(data),
          ...data,
        });
      }

      // Console log in development
      if (window.__MAPLE_CONFIG?.env?.isDevelopment) {
        console.log(`📊 [PWA] ${category}/${action}:`, data);
      }
    }

    _trackPWAUsage() {
      // Track display mode
      const displayMode = window.matchMedia("(display-mode: standalone)")
        .matches
        ? "standalone"
        : "browser";

      this._trackEvent("pwa", "display_mode", { mode: displayMode });

      // Track platform
      this._trackEvent("pwa", "platform", {
        platform: this.config.platform.name,
        isInstalled: this.isInstalled,
      });

      // Increment visit count
      try {
        const visits = this._getVisitCount();
        localStorage.setItem("maple_visit_count", (visits + 1).toString());
      } catch (e) {}
    }

    // ═══════════════ PUBLIC API ═══════════════

    getPWAStatus() {
      return {
        isInstalled: this.isInstalled,
        isOnline: this.isOnline,
        isUpdateAvailable: this.isUpdateAvailable,
        platform: this.config.platform,
        registration: this.registration,
        displayMode: window.matchMedia("(display-mode: standalone)").matches
          ? "standalone"
          : "browser",
      };
    }

    async clearCache() {
      if (!this.registration) return;

      try {
        // Send clear cache message to service worker
        const messageChannel = new MessageChannel();

        messageChannel.port1.onmessage = (event) => {
          console.log("📱 Cache cleared:", event.data);
        };

        this.registration.active?.postMessage({ type: "CLEAR_CACHE" }, [
          messageChannel.port2,
        ]);
      } catch (error) {
        console.error("Clear cache failed:", error.message);
      }
    }

    async unregister() {
      if (!this.registration) return;

      try {
        await this.registration.unregister();
        console.log("📱 Service Worker unregistered");

        // Clear caches
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map((name) => caches.delete(name)));

        this.registration = null;
      } catch (error) {
        console.error("Unregister failed:", error.message);
      }
    }

    // ═══════════════ DESTROY ═══════════════

    destroy() {
      window.removeEventListener("online", this._onConnectionChange);
      window.removeEventListener("offline", this._onConnectionChange);

      if (this.registration) {
        this.registration.removeEventListener(
          "updatefound",
          this._onUpdateFound,
        );
      }

      this._hideInstallUI();
      this._hideOfflineIndicator();

      console.log("📱 PWA Handler destroyed");
    }
  }
  // ═══════════════════════════════════════════
  // FINAL INITIALIZATION SECTION (OPTIMIZED)
  // ═══════════════════════════════════════════

  // ═══════════════════════════════════════════
  // GUARD: Prevent double initialization
  // ═══════════════════════════════════════════
  let _appInitialized = false;
  let _appInstance = null;

  // ═══════════════════════════════════════════
  // SVG PLACEHOLDER UTILITIES (CONSOLIDATED)
  // ═══════════════════════════════════════════
  const SVGUtils = {
    /**
     * Adjust hex color brightness
     */
    adjustColor(hex, percent) {
      const num = parseInt(hex.replace("#", ""), 16);
      const clamp = (val) => Math.min(255, Math.max(0, val));
      const r = clamp((num >> 16) + percent);
      const g = clamp(((num >> 8) & 0x00ff) + percent);
      const b = clamp((num & 0x0000ff) + percent);
      return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
    },

    /**
     * Escape XML special characters
     */
    escapeXml(str) {
      const entities = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&apos;",
      };
      return String(str).replace(/[&<>"']/g, (char) => entities[char]);
    },

    /**
     * Encode SVG string to data URI
     */
    svgToDataUri(svgString) {
      const cleaned = svgString.replace(/\s+/g, " ").trim();
      return `data:image/svg+xml,${encodeURIComponent(cleaned)}`;
    },

    /**
     * Generate card art placeholder
     */
    generateCardArtPlaceholder(icon, bgColor, width, height) {
      const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
          <defs>
            <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="${bgColor}"/>
              <stop offset="55%" stop-color="${this.adjustColor(bgColor, -10)}"/>
              <stop offset="100%" stop-color="${this.adjustColor(bgColor, -20)}"/>
            </linearGradient>
          </defs>
          <rect width="${width}" height="${height}" fill="url(#bg)"/>
          <text x="50%" y="52%" text-anchor="middle" font-size="${Math.min(width, height) * 0.35}" opacity="0.6">${icon}</text>
        </svg>
      `;
      return this.svgToDataUri(svg);
    },

    /**
     * Generate profile picture placeholder
     */
    generatePfpPlaceholder(icon, bgColor, width, height, textColor) {
      const color = textColor || "#a78bfa";
      const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
          <rect fill="${bgColor}" width="${width}" height="${height}" rx="${width / 2}"/>
          <text fill="${color}" x="50%" y="55%" text-anchor="middle" font-size="${width * 0.43}">${icon}</text>
        </svg>
      `;
      return this.svgToDataUri(svg);
    },

    /**
     * Generate initial avatar placeholder
     */
    generateInitialAvatar(initial, bgColor, width, height, textColor) {
      const color = textColor || "#c9a84c";
      const fontSize = Math.floor(Math.min(width, height) * 0.4);
      const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
          <rect fill="${bgColor}" width="${width}" height="${height}" rx="${width / 2}"/>
          <text fill="${color}" x="50%" y="50%" text-anchor="middle" dy=".3em" font-size="${fontSize}px" font-family="sans-serif" font-weight="bold">
            ${this.escapeXml(initial)}
          </text>
        </svg>
      `;
      return this.svgToDataUri(svg);
    },
  };

  // ═══════════════════════════════════════════
  // IMAGE FALLBACK HANDLER (CONSOLIDATED)
  // ═══════════════════════════════════════════
  class ImageFallbackHandler {
    constructor() {
      this.handledImages = new WeakSet();
    }

    /**
     * Setup fallback for all image types
     */
    setupAll() {
      this.setupCharacterCardFallbacks();
      this.setupAboutContactFallbacks();
      this.setupGenericImageFallbacks();
    }

    /**
     * Handle image error with appropriate fallback
     */
    _handleImageError(img, fallbackType, options = {}) {
      // Prevent infinite loops
      if (this.handledImages.has(img)) return;
      this.handledImages.add(img);

      const { icon, bg, width, height, initial, textColor } = options;

      let src;
      switch (fallbackType) {
        case "card-art":
          src = SVGUtils.generateCardArtPlaceholder(
            icon || "🛡️",
            bg || "#120a16",
            width || 320,
            height || 448,
          );
          break;

        case "pfp":
          src = SVGUtils.generatePfpPlaceholder(
            icon || "🍁",
            bg || "#120a16",
            width || 58,
            height || 58,
            textColor,
          );
          break;

        case "initial-avatar":
          src = SVGUtils.generateInitialAvatar(
            initial || "NK",
            bg || "#141414",
            width || 160,
            height || 160,
            textColor || "#c9a84c",
          );
          break;

        default:
          src = SVGUtils.generateInitialAvatar("?", "#333", 100, 100);
      }

      img.src = src;
      img.onerror = null;
    }

    /**
     * Setup character card image fallbacks
     */
    setupCharacterCardFallbacks() {
      document
        .querySelectorAll(".char-card img[data-fallback-icon]")
        .forEach((img) => {
          img.addEventListener(
            "error",
            () => {
              const icon = img.dataset.fallbackIcon || "🛡️";
              const bg = img.dataset.fallbackBg || "#120a16";
              const isPfp = img.closest(".card-pfp");

              this._handleImageError(img, isPfp ? "pfp" : "card-art", {
                icon,
                bg,
                width: img.width || 320,
                height: img.height || 448,
              });
            },
            { once: true },
          );
        });
    }

    /**
     * Setup about & contact image fallbacks
     */
    setupAboutContactFallbacks() {
      // About avatar
      const aboutImg = document.querySelector(".about__img");
      if (aboutImg) {
        aboutImg.addEventListener(
          "error",
          () => {
            this._handleImageError(aboutImg, "initial-avatar", {
              initial: aboutImg.dataset.fallbackInitial || "NK",
              bg: aboutImg.dataset.fallbackBg || "#141414",
              width: aboutImg.width || 160,
              height: aboutImg.height || 160,
            });
          },
          { once: true },
        );
      }

      // Contact avatar
      const contactAvatar = document.querySelector(".contact-card__avatar");
      if (contactAvatar) {
        contactAvatar.addEventListener(
          "error",
          () => {
            this._handleImageError(contactAvatar, "initial-avatar", {
              initial: contactAvatar.dataset.fallbackInitial || "NK",
              bg: contactAvatar.dataset.fallbackBg || "#141414",
              width: contactAvatar.width || 56,
              height: contactAvatar.height || 56,
              textColor: contactAvatar.dataset.fallbackColor || "#c9a84c",
            });
          },
          { once: true },
        );
      }
    }

    /**
     * Setup generic image fallbacks
     */
    setupGenericImageFallbacks() {
      document
        .querySelectorAll(
          "img:not([data-fallback-icon]):not(.about__img):not(.contact-card__avatar)",
        )
        .forEach((img) => {
          img.addEventListener(
            "error",
            () => {
              this._handleImageError(img, "initial-avatar", {
                initial: "?",
                bg: "#333",
                width: img.width || 100,
                height: img.height || 100,
              });
            },
            { once: true },
          );
        });
    }
  }

  // ═══════════════════════════════════════════
  // CHARACTER CARD HANDLERS
  // ═══════════════════════════════════════════
  function setupCharacterCards() {
    document.querySelectorAll(".char-card[data-target]").forEach((card) => {
      const target = card.dataset.target;
      if (!target) return;

      // Click handler
      card.addEventListener("click", (e) => {
        if (e.target.closest("a")) return;
        window.location.href = target;
      });

      // Keyboard handler (Enter/Space)
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          window.location.href = target;
        }
      });
    });
  }

  // ═══════════════════════════════════════════
  // SKILL BAR ANIMATION
  // ═══════════════════════════════════════════
  function setupSkillBarAnimation() {
    const skillBars = document.querySelectorAll(".skill-bar__fill[data-width]");
    if (!skillBars.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const bar = entry.target;
            const width = bar.dataset.width || 0;

            // Animate width dengan transition CSS
            requestAnimationFrame(() => {
              bar.style.width = `${width}%`;
              bar.setAttribute("aria-valuenow", width);
            });

            observer.unobserve(bar);
          }
        });
      },
      { threshold: 0.3 },
    );

    skillBars.forEach((bar) => observer.observe(bar));
  }

  // ═══════════════════════════════════════════
  // LAZY LOADING (FIXED)
  // ═══════════════════════════════════════════
  function initLazyLoading() {
    // HANYA pilih elemen IMG, bukan elemen lain
    const lazyImages = document.querySelectorAll(
      'img[loading="lazy"]:not(.vn-avatar-img):not(.vn-avatar-emotion), ' +
        "img[data-src]:not(.vn-avatar-img):not(.vn-avatar-emotion), " +
        'img.card-art[loading="lazy"], ' +
        '.char-card img[loading="lazy"]',
    );

    // Filter hanya IMG elements
    const validImages = Array.from(lazyImages).filter(
      (el) => el.tagName === "IMG",
    );

    if (!validImages.length) {
      console.log("📸 No lazy images found");
      return;
    }

    console.log(`📸 Found ${validImages.length} lazy images`);

    if (!("IntersectionObserver" in window)) {
      // Fallback: load all images immediately
      validImages.forEach((img) => {
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute("data-src");
        }
      });
      return;
    }

    const imageObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;

            // Handle data-src
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute("data-src");
            }

            // Handle srcset
            if (img.dataset.srcset) {
              img.srcset = img.dataset.srcset;
              img.removeAttribute("data-srcset");
            }

            imageObserver.unobserve(img);
          }
        });
      },
      {
        rootMargin: "200px 0px",
        threshold: 0.01,
      },
    );

    validImages.forEach((img) => imageObserver.observe(img));
  }

  // ═══════════════════════════════════════════
  // MAIN INITIALIZATION (SINGLE ENTRY POINT)
  // ═══════════════════════════════════════════
  function initializeApp() {
    console.log("🍁 Maple's Portfolio v4.0 initializing...");

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
    console.log("🍁 Maple's Portfolio v4.0 initialized!");
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
