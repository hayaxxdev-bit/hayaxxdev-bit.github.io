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
  // 3. CACHE MANAGER
  // ═══════════════════════════════════════════
  class CacheManager {
    constructor() {
      this.prefix = "maple_cache_";
    }
    _getKey(key) {
      return this.prefix + key;
    }
    set(key, data, ttl = CONFIG.CACHE_DURATION) {
      try {
        localStorage.setItem(
          this._getKey(key),
          JSON.stringify({ data, timestamp: Date.now(), ttl }),
        );
        return true;
      } catch (e) {
        console.warn("Cache write failed:", e);
        return false;
      }
    }
    get(key) {
      try {
        const raw = localStorage.getItem(this._getKey(key));
        if (!raw) return null;
        const item = JSON.parse(raw);
        if (Date.now() - item.timestamp > item.ttl) {
          localStorage.removeItem(this._getKey(key));
          return null;
        }
        return item.data;
      } catch (e) {
        return null;
      }
    }
    remove(key) {
      localStorage.removeItem(this._getKey(key));
    }
    clear() {
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith(this.prefix)) localStorage.removeItem(key);
      });
    }
  }

  // ═══════════════════════════════════════════
  // 4. AUDIO MANAGER
  // ═══════════════════════════════════════════
  class AudioManager {
    static instance = null;
    constructor() {
      if (AudioManager.instance) return AudioManager.instance;
      AudioManager.instance = this;
      this.context = null;
      this.masterGain = null;
      this.bgmGain = null;
      this.sfxGain = null;
      this.currentSource = null;
      this.isPlaying = false;
      this.volume = CONFIG.BGM_VOLUME;
      this.currentTrackIndex = 0;
      this.isInitialized = false;
      this.playlist = [
        {
          name: "🎵 Lo-Fi Anime Beats",
          url: "./public/music/Clarity-phonk.wav",
        },
        { name: "🎵 Maple's Defense", url: "./public/music/maple-theme.mp3" },
        { name: "🎵 Adventure Time", url: "./public/music/adventure.mp3" },
      ];
      this.uiElements = {
        toggle: document.getElementById("bgmToggle"),
        next: document.getElementById("bgmNext"),
        label: document.getElementById("bgmLabel"),
        volumeFill: document.querySelector(".bgm-volume-fill"),
      };
      this.sfxMap = {
        menuSelect: this._createSFX("square", [880, 1174.66], 0.08, 0.12),
        questClear: this._createMelodySFX(
          [523.25, 659.25, 783.99, 1046.5],
          0.1,
          0.25,
        ),
        close: this._createSFX("sine", [600, 150], 0.06, 0.2, true),
        dialogue: this._createSFX("sine", [440, 660], 0.04, 0.12, true),
        guideStart: this._createMelodySFX([523.25, 659.25, 783.99], 0.06, 0.15),
        achievement: this._createMelodySFX(
          [523.25, 659.25, 783.99, 1046.5],
          0.15,
          0.3,
        ),
      };
      this.bindEvents();
    }
    _createSFX(type, frequencies, gainValue, duration, exponential = false) {
      return () => {
        if (!this.ensureContext()) return;
        const now = this.context.currentTime;
        const osc = this.context.createOscillator();
        const gain = this.context.createGain();
        osc.type = type;
        if (exponential) {
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
        gain.gain.setValueAtTime(gainValue, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(now);
        osc.stop(now + duration);
      };
    }
    _createMelodySFX(notes, gainValue, noteDuration) {
      return () => {
        if (!this.ensureContext()) return;
        const now = this.context.currentTime;
        notes.forEach((freq, i) => {
          const osc = this.context.createOscillator();
          const gain = this.context.createGain();
          osc.type = i % 2 === 0 ? "triangle" : "sine";
          osc.frequency.value = freq;
          const start = now + i * (noteDuration / notes.length);
          gain.gain.setValueAtTime(gainValue, start);
          gain.gain.exponentialRampToValueAtTime(0.001, start + noteDuration);
          osc.connect(gain);
          gain.connect(this.sfxGain);
          osc.start(start);
          osc.stop(start + noteDuration);
        });
      };
    }
    init() {
      if (this.isInitialized) return this;
      try {
        this.context = new (window.AudioContext || window.webkitAudioContext)();
        this.masterGain = this.context.createGain();
        this.bgmGain = this.context.createGain();
        this.sfxGain = this.context.createGain();
        this.masterGain.gain.value = 1;
        this.bgmGain.gain.value = this.volume;
        this.sfxGain.gain.value = CONFIG.SFX_VOLUME;
        this.bgmGain.connect(this.masterGain);
        this.sfxGain.connect(this.masterGain);
        this.masterGain.connect(this.context.destination);
        this.isInitialized = true;
      } catch (error) {
        console.warn("Audio initialization failed:", error);
      }
      return this;
    }
    ensureContext() {
      if (!this.isInitialized) this.init();
      if (this.context?.state === "suspended") this.context.resume();
      return this.context;
    }
    async playTrack(index) {
      if (!this.ensureContext()) return;
      const track = this.playlist[index];
      if (!track) return;
      this.stopTrack();
      try {
        const response = await fetch(track.url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await this.context.decodeAudioData(arrayBuffer);
        this.currentSource = this.context.createBufferSource();
        this.currentSource.buffer = audioBuffer;
        this.currentSource.loop = true;
        this.currentSource.connect(this.bgmGain);
        this.currentSource.start(0);
        this.isPlaying = true;
        this.updateUI();
      } catch (error) {
        console.warn("Failed to load track:", error.message);
        this.isPlaying = false;
        this.updateUI();
      }
    }
    stopTrack() {
      if (this.currentSource) {
        try {
          this.currentSource.stop();
          this.currentSource.disconnect();
        } catch (e) {}
        this.currentSource = null;
      }
      this.isPlaying = false;
      this.updateUI();
    }
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
      this.currentTrackIndex =
        (this.currentTrackIndex + 1) % this.playlist.length;
      if (this.isPlaying) this.playTrack(this.currentTrackIndex);
      this.updateUI();
    }
    setVolume(value) {
      this.volume = Math.max(0, Math.min(1, value));
      if (this.bgmGain) this.bgmGain.gain.value = this.volume;
      if (this.uiElements.volumeFill)
        this.uiElements.volumeFill.style.width = `${this.volume * 100}%`;
    }
    playSFX(type) {
      if (!this.ensureContext()) return;
      this.sfxMap[type]?.();
    }
    updateUI() {
      const { toggle, label } = this.uiElements;
      if (toggle) {
        toggle.classList.toggle("bgm-toggle--playing", this.isPlaying);
        const svg = toggle.querySelector("svg");
        if (svg)
          svg.innerHTML = this.isPlaying
            ? '<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>'
            : '<path d="M8 5v14l11-7z"/>';
      }
      if (label && this.playlist[this.currentTrackIndex])
        label.textContent = this.playlist[this.currentTrackIndex].name;
    }
    bindEvents() {
      this.uiElements.toggle?.addEventListener("click", () => this.toggle());
      this.uiElements.next?.addEventListener("click", () => {
        this.playSFX("menuSelect");
        this.next();
      });
    }
    destroy() {
      this.stopTrack();
      if (this.context) {
        try {
          this.context.close();
        } catch (e) {}
        this.context = null;
      }
      this.isInitialized = false;
    }
  }

  // ═══════════════════════════════════════════
  // 5. ACHIEVEMENT SYSTEM
  // ═══════════════════════════════════════════
  class AchievementSystem {
    constructor() {
      this.achievements = new Map();
      this.toastContainer = document.getElementById("achievementToasts");
      this.audioManager = null;
      this.defineAchievements();
      this.loadFromStorage();
    }
    defineAchievements() {
      [
        {
          id: "first_visit",
          name: "Petualang Baru!",
          desc: "Pertama kali mengunjungi guild Maple",
          icon: "🏠",
          xp: 100,
        },
        {
          id: "dialog_master",
          name: "Teman Ngobrol",
          desc: "Menyelesaikan 5 dialog dengan Maple",
          icon: "💬",
          xp: 200,
        },
        {
          id: "project_explorer",
          name: "Penjelajah Karya",
          desc: "Melihat semua proyek di halaman karya",
          icon: "🔍",
          xp: 150,
        },
        {
          id: "guide_complete",
          name: "Tur Selesai!",
          desc: "Menyelesaikan Maple's Guide Tour",
          icon: "🗺️",
          xp: 300,
        },
        {
          id: "night_owl",
          name: "Burung Hantu",
          desc: "Berkunjung di malam hari (00:00 - 05:00)",
          icon: "🦉",
          xp: 100,
        },
        {
          id: "music_lover",
          name: "Penikmat Musik",
          desc: "Memainkan BGM selama 5 menit",
          icon: "🎵",
          xp: 150,
        },
        {
          id: "secret_finder",
          name: "Pemburu Rahasia",
          desc: "Menemukan 3 easter egg",
          icon: "🥚",
          xp: 400,
        },
      ].forEach((def) => {
        this.achievements.set(def.id, {
          ...def,
          unlocked: false,
          unlockedAt: null,
        });
      });
    }
    setAudioManager(audioManager) {
      this.audioManager = audioManager;
    }
    unlock(achievementId) {
      const a = this.achievements.get(achievementId);
      if (!a || a.unlocked) return false;
      a.unlocked = true;
      a.unlockedAt = new Date().toISOString();
      this.showToast(a);
      this.saveToStorage();
      this.audioManager?.playSFX("achievement");
      return true;
    }
    showToast(a) {
      if (!this.toastContainer) return;
      const toast = document.createElement("div");
      toast.className = "achievement-toast";
      toast.innerHTML = `<span class="achievement-toast__icon">${a.icon}</span><div class="achievement-toast__content"><span class="achievement-toast__title">Achievement Unlocked!</span><span class="achievement-toast__name">${a.name}</span><span class="achievement-toast__desc">${a.desc}</span><span class="achievement-toast__xp">+${a.xp} XP</span></div>`;
      this.toastContainer.appendChild(toast);
      setTimeout(() => {
        toast.classList.add("achievement-toast--fade-out");
        setTimeout(() => toast.remove(), 500);
      }, 4000);
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
    saveToStorage() {
      localStorage.setItem(
        "maple_achievements",
        JSON.stringify(
          Array.from(this.achievements.entries()).map(([id, a]) => ({
            id,
            unlocked: a.unlocked,
            unlockedAt: a.unlockedAt,
          })),
        ),
      );
    }
    loadFromStorage() {
      try {
        const raw = localStorage.getItem("maple_achievements");
        if (!raw) return;
        JSON.parse(raw).forEach((saved) => {
          const a = this.achievements.get(saved.id);
          if (a) {
            a.unlocked = saved.unlocked;
            a.unlockedAt = saved.unlockedAt;
          }
        });
      } catch (e) {
        console.warn("Failed to load achievements:", e);
      }
    }
  }

  // ═══════════════════════════════════════════
  // 6. GITHUB API MANAGER - MULTI-SOURCE
  // ═══════════════════════════════════════════
  class GitHubManager {
    constructor(username) {
      this.username = username;
      this.repositories = [];
      this.isLoaded = false;
      this.cache = new CacheManager();
      this.totalCommits = 0;
      this.totalStars = 0;
      this.totalForks = 0;
      this.contributionData = null;
      this.API_BASE = CONFIG.CUSTOM_API_BASE;
      this.GITHUB_RAW = `${CONFIG.GITHUB_RAW_BASE}/${username}`;
    }

    async _fetchWithRetry(url, retries = CONFIG.RETRY_MAX) {
      for (let attempt = 0; attempt < retries; attempt++) {
        try {
          const response = await fetch(url);
          if (response.status === 404) throw new Error("Not found (404)");
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          return response;
        } catch (error) {
          console.warn(
            `⚠️ Attempt ${attempt + 1}/${retries}: ${error.message}`,
          );
          if (attempt < retries - 1)
            await this._sleep(CONFIG.RETRY_DELAY * Math.pow(2, attempt));
          else throw error;
        }
      }
    }

    _sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }

    // ═══════════════ FETCH ALL REPOS ═══════════════
    async fetchAllRepos() {
      const cached = this.cache.get(`repos_${this.username}`);
      if (cached) {
        console.log("📦 Menggunakan data dari cache");
        this.repositories = cached;
        this.isLoaded = true;
        this._calculateTotals();
        return this.repositories;
      }

      console.log("🔍 Fetching repositories...");
      try {
        let repos = await this._fetchReposFromCustomAPI();
        if (!repos || repos.length === 0)
          repos = await this._fetchReposFromGitHubAPI();
        if (!repos || repos.length === 0) throw new Error("No repos found");

        // Fetch README untuk setiap repo
        console.log(`📄 Fetching README untuk ${repos.length} repos...`);
        const reposWithReadme = await this._fetchReadmesInBatches(repos);

        this.repositories = reposWithReadme;
        this.isLoaded = true;
        this._calculateTotals();
        this.cache.set(`repos_${this.username}`, reposWithReadme);
        console.log(
          `✅ Berhasil: ${reposWithReadme.length} repos dengan README`,
        );
        return reposWithReadme;
      } catch (error) {
        console.error("❌ Gagal fetch repos:", error.message);
        const staleCache = localStorage.getItem(
          this.cache._getKey(`repos_${this.username}`),
        );
        if (staleCache) {
          console.warn("⚠️ Menggunakan cache kadaluarsa");
          const data = JSON.parse(staleCache).data;
          this.repositories = data;
          this.isLoaded = true;
          this._calculateTotals();
          return data;
        }
        throw error;
      }
    }

    // Di GitHubManager class, update method:
    async _fetchReposFromCustomAPI() {
      try {
        // Gunakan URL Vercel yang sudah di-deploy
        const url = `${this.API_BASE}/api/repos?username=${this.username}&all=true`;
        console.log(`📡 Custom API: ${url}`);

        const response = await this._fetchWithRetry(url, 1);
        const data = await response.json();

        // Handle response format baru
        let repos = [];
        if (data.success && Array.isArray(data.repos)) {
          repos = data.repos;
        } else if (Array.isArray(data)) {
          repos = data;
        }

        return repos.length > 0 ? this._normalizeRepos(repos) : null;
      } catch (e) {
        console.warn("Custom API failed:", e.message);
        return null;
      }
    }
    async _fetchReposFromGitHubAPI() {
      try {
        const url = `${CONFIG.GITHUB_API_BASE}/users/${this.username}/repos?sort=updated&per_page=100`;
        console.log(`📡 GitHub API: ${url}`);
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const repos = await response.json();
        return this._normalizeRepos(repos);
      } catch (e) {
        console.warn("GitHub API failed:", e.message);
        return null;
      }
    }

    _normalizeRepos(repos) {
      return repos.map((repo) => ({
        ...repo,
        id: repo.id || repo.name,
        name: repo.name || repo.repo || "unknown",
        description: repo.description || null,
        language: repo.language || null,
        stargazers_count: repo.stargazers_count || repo.stars || 0,
        forks_count: repo.forks_count || repo.forks || 0,
        html_url:
          repo.html_url ||
          repo.url ||
          `https://github.com/${this.username}/${repo.name}`,
        homepage: repo.homepage || null,
        has_pages: repo.has_pages || (repo.homepage ? true : false),
        updated_at:
          repo.updated_at || repo.updatedAt || new Date().toISOString(),
        created_at:
          repo.created_at || repo.createdAt || new Date().toISOString(),
        topics: repo.topics || [],
        fork: repo.fork || false,
      }));
    }

    // ═══════════════ FETCH README (MULTI-SOURCE) ═══════════════
    async fetchReadme(repoName) {
      const cacheKey = `readme_${repoName}`;
      const cached = this.cache.get(cacheKey);
      if (cached) return cached;

      // Strategy 1: Custom API
      try {
        const readme = await this._fetchReadmeFromCustomAPI(repoName);
        if (readme) {
          this.cache.set(cacheKey, readme, 3600000);
          return readme;
        }
      } catch (e) {}

      // Strategy 2: GitHub API
      try {
        const readme = await this._fetchReadmeFromGitHubAPI(repoName);
        if (readme) {
          this.cache.set(cacheKey, readme, 3600000);
          return readme;
        }
      } catch (e) {}

      // Strategy 3: raw.githubusercontent.com (multiple branches & filenames)
      const readme = await this._fetchReadmeFromRaw(repoName);
      if (readme) {
        this.cache.set(cacheKey, readme, 3600000);
        return readme;
      }

      return null;
    }

    async _fetchReadmeFromCustomAPI(repoName) {
      const url = `${this.API_BASE}/api/repos/${this.username}/${repoName}`;
      const response = await this._fetchWithRetry(url, 1);
      if (!response.ok) return null;
      const data = await response.json();
      return data.readme &&
        typeof data.readme === "string" &&
        data.readme.length > 10
        ? data.readme
        : null;
    }

    async _fetchReadmeFromGitHubAPI(repoName) {
      const url = `${CONFIG.GITHUB_API_BASE}/repos/${this.username}/${repoName}/readme`;
      const response = await fetch(url, {
        headers: { Accept: "application/vnd.github.v3.raw" },
      });
      if (!response.ok) return null;
      const text = await response.text();
      return text && text.length > 10 && !text.includes("<!DOCTYPE html>")
        ? text
        : null;
    }

    async _fetchReadmeFromRaw(repoName) {
      const branches = ["main", "master"];
      const filenames = [
        "README.md",
        "readme.md",
        "Readme.md",
        "README.MD",
        "README.markdown",
        "README",
      ];

      for (const branch of branches) {
        for (const filename of filenames) {
          try {
            const url = `${this.GITHUB_RAW}/${repoName}/${branch}/${filename}`;
            const response = await fetch(url);
            if (response.ok) {
              const text = await response.text();
              if (
                text &&
                text.length > 10 &&
                !text.includes("<!DOCTYPE html>")
              ) {
                console.log(`✅ README ${repoName}: ${branch}/${filename}`);
                return text;
              }
            }
          } catch (e) {
            continue;
          }
        }
      }
      return null;
    }

    async _fetchReadmesInBatches(repos, batchSize = 5) {
      const results = [];
      for (let i = 0; i < repos.length; i += batchSize) {
        const batch = repos.slice(i, i + batchSize);
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
        console.log(
          `  📄 README: ${Math.min(i + batchSize, repos.length)}/${repos.length}`,
        );
      }
      return results;
    }

    _calculateTotals() {
      this.totalStars = this.repositories.reduce(
        (sum, r) => sum + (r.stargazers_count || 0),
        0,
      );
      this.totalForks = this.repositories.reduce(
        (sum, r) => sum + (r.forks_count || 0),
        0,
      );
    }

    // ═══════════════ OTHER METHODS ═══════════════
    async fetchTotalCommits() {
      const cached = this.cache.get(`commits_${this.username}`);
      if (cached) {
        this.totalCommits = cached;
        return cached;
      }
      this.totalCommits = this.repositories.length * 15;
      this.cache.set(`commits_${this.username}`, this.totalCommits);
      return this.totalCommits;
    }

    getLanguageStats() {
      const stats = {};
      this.repositories.forEach((repo) => {
        if (repo.language)
          stats[repo.language] = (stats[repo.language] || 0) + 1;
      });
      return Object.entries(stats)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .reduce((obj, [k, v]) => {
          obj[k] = v;
          return obj;
        }, {});
    }

    getFeaturedRepos(count = CONFIG.FEATURED_COUNT) {
      return [...this.repositories]
        .filter((r) => !r.fork || r.stargazers_count > 0)
        .sort((a, b) => {
          const score = (r) =>
            (r.stargazers_count || 0) * 2 + (r.forks_count || 0);
          return (
            score(b) - score(a) ||
            new Date(b.updated_at || 0) - new Date(a.updated_at || 0)
          );
        })
        .slice(0, count);
    }

    categorizeRepo(repo) {
      const text = [
        repo.name,
        repo.description,
        repo.language,
        ...(repo.topics || []),
      ]
        .join(" ")
        .toLowerCase();
      if (
        text.includes("game") ||
        text.includes("unity") ||
        text.includes("godot")
      )
        return "game";
      if (
        text.includes("design") ||
        text.includes("figma") ||
        text.includes("ui") ||
        text.includes("art")
      )
        return "design";
      if (repo.homepage || repo.has_pages) return "web";
      if (
        repo.language &&
        [
          "html",
          "css",
          "javascript",
          "typescript",
          "jsx",
          "tsx",
          "vue",
          "react",
        ].includes(repo.language.toLowerCase())
      )
        return "web";
      return "other";
    }

    getFilteredRepos(filter) {
      return filter === "all"
        ? this.repositories
        : this.repositories.filter((r) => this.categorizeRepo(r) === filter);
    }
    clearCache() {
      this.cache.clear();
      console.log("🗑️ Cache dibersihkan");
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

      // Random pilih generator
      const generator =
        templates.generators[
          Math.floor(Math.random() * templates.generators.length)
        ];
      const generated = generator();

      return generated || this._generateWelcomeDialogue();
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
        this.progressBar.style.width = `${progress}%`;
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
      if (this.isOpen && this.currentRoute !== route) {
        this.close();
      }

      this.currentRoute = route;
      this.isOpen = true;
      this.currentDialogueIndex = 0;

      // Update memory
      if (route === "home" && this.userMemory.visitCount === 0) {
        this.userMemory.visitCount = 1;
        this.achievementSystem?.unlock("first_visit");
      } else if (route === "home") {
        this.userMemory.visitCount++;
      }
      this.userMemory.lastVisitTime = new Date().toISOString();
      this._saveMemory();

      // Get dialogues
      const dialogues = customText
        ? [{ speaker: "🍁 Maple", text: customText, emotion: "😊" }]
        : this._getDialogues(route);

      this.totalDialogues = dialogues.length;

      // Show container
      this.container?.classList.add("vn-container--active");
      this.container?.removeAttribute("hidden");
      this.container?.setAttribute("data-current-route", route);

      // Update UI
      this._updateRouteBadge(route);
      this._updateContext(route);
      this._updateProgress();

      // Play sound
      this.audioManager?.playSFX("dialogue");

      // Track achievement
      if (this.userMemory.totalInteractions >= 5) {
        this.achievementSystem?.unlock("dialog_master");
      }

      // Type first dialogue
      this._typeText(dialogues[0]);
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

      this.messageEl.innerHTML = "";
      this.messageEl.classList.add("vn-message--new");
      setTimeout(() => this.messageEl.classList.remove("vn-message--new"), 300);

      this.quickRepliesEl?.classList.remove("vn-quick-replies--active");

      const text = dialogue.text;
      let charIndex = 0;
      const speed =
        CONFIG.TYPING_SPEED_MIN +
        Math.random() * (CONFIG.TYPING_SPEED_MAX - CONFIG.TYPING_SPEED_MIN);

      const type = () => {
        if (charIndex < text.length) {
          if (text[charIndex] === "<") {
            const endTag = text.indexOf(">", charIndex);
            if (endTag !== -1) {
              this.messageEl.innerHTML += text.substring(charIndex, endTag + 1);
              charIndex = endTag + 1;
            }
          }

          this.messageEl.innerHTML += text.charAt(charIndex);
          charIndex++;
          this.typeTimer = setTimeout(type, speed);
        } else {
          this.isTyping = false;

          this.messageEl.insertAdjacentHTML(
            "beforeend",
            '<span class="typing-cursor"></span>',
          );
          setTimeout(() => {
            const cursor = this.messageEl?.querySelector(".typing-cursor");
            cursor?.remove();
          }, 800);

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

    next() {
      if (this.isTyping) {
        this._skipTyping();
        return;
      }

      const dialogues = this._getDialogues(this.currentRoute);
      if (!dialogues?.length) {
        this.close();
        return;
      }

      this.currentDialogueIndex++;

      if (this.currentDialogueIndex >= dialogues.length) {
        this.close();
        return;
      }

      const nextDialogue = dialogues[this.currentDialogueIndex];
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
      this.quickRepliesEl?.classList.remove("vn-quick-replies--active");
      this.container?.classList.remove("vn-container--active");
      this.container?.setAttribute("hidden", "");
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
    _createSlideHTML(repo, index = 0) {
      const initial = (repo.name || "?").charAt(0).toUpperCase();
      const hasPages = repo.has_pages || repo.homepage;
      const pagesUrl =
        repo.homepage ||
        `https://${this.githubManager.username}.github.io/${repo.name}`;
      const langBadge = repo.language
        ? `<span class="slide__tag slide__tag--language"><span class="slide__lang-dot" style="background:${getLanguageColor(repo.language)}"></span>${repo.language}</span>`
        : "";
      const demoLink = hasPages
        ? `<a class="slide__link slide__link--demo" href="${pagesUrl}" target="_blank" rel="noopener">${ICONS.demo} Demo</a>`
        : "";
      return `<span class="slide__rank">#${String(index + 1).padStart(2, "0")}</span>
        <div class="slide__header"><div class="slide__icon" aria-hidden="true">${initial}</div><h4 class="slide__title"><a href="${repo.html_url}" target="_blank" rel="noopener">${repo.name}</a></h4></div>
        <p class="slide__desc">${repo.description || "Tidak ada deskripsi."}</p>
        <div class="slide__stats">${langBadge}<span class="slide__stat slide__stat--stars">${ICONS.star} ${repo.stargazers_count || 0}</span><span class="slide__stat slide__stat--forks">${ICONS.fork} ${repo.forks_count || 0}</span><span class="slide__stat slide__stat--updated">${ICONS.clock} ${timeAgo(repo.updated_at)}</span></div>
        <div class="slide__actions"><a class="slide__link slide__link--repo" href="${repo.html_url}" target="_blank" rel="noopener">${ICONS.repo} Repo</a>${demoLink}</div>`;
    }

    _createSkeletonSlideHTML() {
      return `<div class="skeleton skeleton--icon"></div><div class="skeleton skeleton--title"></div><div class="skeleton skeleton--text"></div><div class="skeleton skeleton--text short"></div><div class="skeleton skeleton--tags"></div>`;
    }

    // ═══════════════ PROJECT CARD WITH README DISPLAY ═══════════════
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

      // Determine category for filtering
      const category = this.githubManager.categorizeRepo(repo);
      const categoryLabels = {
        web: "🌐 Web",
        game: "🎮 Game",
        design: "🎨 Design",
        other: "📦 Lainnya",
      };
      const categoryLabel = categoryLabels[category] || "📦 Lainnya";

      // Determine rarity based on stars
      const rarity = this._getRarity(repo);

      // Check if README exists and is valid
      const hasReadme =
        repo.readme &&
        typeof repo.readme === "string" &&
        repo.readme.length > 10;

      // Get best thumbnail
      const thumbnailSrc = this._getBestThumbnail(repo, pagesUrl);

      // Determine what preview tabs to show
      const showPagesTab = hasPages;
      const showReadmeTab = hasReadme;
      const showToggle = showPagesTab || showReadmeTab;

      return `
      <article class="project-card project-card--${rarity}" data-repo="${repo.name}">
        <div class="project-card__preview">
          <!-- Cover Image -->
          <div class="project-card__preview-cover">
            <img src="${thumbnailSrc}" alt="${repo.name}" class="project-card__preview-img" loading="lazy"
                 onerror="this.src='${this._getSVGPlaceholder(repo.name, repo.language)}'">
          </div>
          
          <!-- GitHub Pages Preview (if available) -->
          ${
            showPagesTab
              ? `
          <div class="project-card__preview-live" style="display:none;">
            <div class="project-card__preview-external">
              <div class="project-card__preview-external-content">
                <span class="preview-icon">🌐</span>
                <span class="preview-text">GitHub Pages</span>
                <small>Klik untuk membuka</small>
              </div>
              <a href="${pagesUrl}" target="_blank" rel="noopener" class="project-card__preview-visit-btn">
                ${ICONS.pages} Open Pages ↗
              </a>
            </div>
          </div>`
              : ""
          }
          
          <!-- README Preview (if available) -->
          ${
            showReadmeTab
              ? `
          <div class="project-card__readme-overlay" style="display:none;">
            <div class="readme-content">${this._safeMarkdownParse(repo.readme)}</div>
            <div class="readme-fade"></div>
          </div>`
              : ""
          }
          
          <!-- Preview Toggle Buttons -->
          ${
            showToggle
              ? `
          <div class="project-card__preview-toggle">
            <button class="active" data-view="cover">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21,15 16,10 5,21"/>
              </svg>
            </button>
            ${
              showPagesTab
                ? `
            <button data-view="live">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
            </button>`
                : ""
            }
            ${
              showReadmeTab
                ? `
            <button data-view="readme">
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
            ${hasReadme ? '<span class="project-card__tag project-card__tag--readme">📄 README</span>' : ""}
          </div>
          <div class="project-card__actions">
            <a href="${repo.html_url}" target="_blank" rel="noopener" class="project-card__link">${ICONS.repo} Source</a>
            ${showPagesTab ? `<a href="${pagesUrl}" target="_blank" rel="noopener" class="project-card__view">${ICONS.demo} Demo</a>` : ""}
            ${!showPagesTab && showReadmeTab ? `<button class="project-card__view project-card__view--readme" data-view-readme="${repo.name}">${ICONS.readme} README</button>` : ""}
          </div>
        </div>
      </article>`;
    }

    // Safe markdown parser
    _safeMarkdownParse(md) {
      if (!md) return "<p>No README available</p>";
      try {
        // Limit content length for preview
        const truncated = md.substring(0, 3000);

        // Use marked if available, otherwise escape
        if (typeof marked !== "undefined" && marked.parse) {
          return marked.parse(truncated);
        }

        return `<pre>${escapeHtml(truncated)}</pre>`;
      } catch (e) {
        return `<pre>${escapeHtml(md.substring(0, 500))}</pre>`;
      }
    }

    // Get best thumbnail URL
    _getBestThumbnail(repo, pagesUrl) {
      // Check cache first
      if (this.screenshotCache.has(repo.name)) {
        return this.screenshotCache.get(repo.name);
      }

      // Use thum.io for live screenshots
      if (pagesUrl) {
        const thumbUrl = `https://image.thum.io/get/width/640/crop/400/viewportWidth/1280/viewportHeight/800/wait/2/noanimate/${pagesUrl.replace(/\/$/, "")}`;
        this.screenshotCache.set(repo.name, thumbUrl);
        return thumbUrl;
      }

      // Fallback: use local screenshots if available
      if (this.isGithubPages) {
        return `${this.basePath}/screenshots/${repo.name}.jpg`;
      }

      return this._getSVGPlaceholder(repo.name, repo.language);
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
                x="320" y="200" text-anchor="middle" opacity="0.8">
            ${(name || "Project").substring(0, 20)}
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

      // Update active button
      preview
        .querySelectorAll(".project-card__preview-toggle button")
        .forEach((b) => {
          b.classList.remove("active");
        });
      btn.classList.add("active");
    }

    // Attach preview toggle listeners
    _attachPreviewListeners() {
      document
        .querySelectorAll(".project-card__preview-toggle")
        .forEach((toggle) => {
          toggle.removeEventListener("click", this._handlePreviewToggle);
          toggle.addEventListener("click", this._handlePreviewToggle);
        });

      // Attach README button listeners for cards without Pages
      document
        .querySelectorAll(".project-card__view--readme")
        .forEach((btn) => {
          btn.addEventListener("click", (e) => {
            e.preventDefault();
            const card = btn.closest(".project-card");
            const readmeOverlay = card.querySelector(
              ".project-card__readme-overlay",
            );
            const cover = card.querySelector(".project-card__preview-cover");

            if (readmeOverlay && cover) {
              const isShowing = readmeOverlay.style.display === "flex";
              readmeOverlay.style.display = isShowing ? "none" : "flex";
              cover.style.display = isShowing ? "block" : "none";
              btn.textContent = isShowing
                ? `${ICONS.readme} README`
                : "✕ Tutup";
            }
          });
        });
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

      // Scroll detection
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

    updateStats(repos, totalCommits = 0) {
      document.getElementById("repoCount") &&
        (document.getElementById("repoCount").textContent = repos.length);
      document.getElementById("starCount") &&
        (document.getElementById("starCount").textContent = repos.reduce(
          (s, r) => s + (r.stargazers_count || 0),
          0,
        ));
      document.getElementById("commitCount") &&
        (document.getElementById("commitCount").textContent =
          totalCommits + "+");
    }

    showLoader(show) {
      if (this.projectLoader) {
        this.projectLoader.style.display = show ? "flex" : "none";
      }
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
  // 12. PWA HANDLER
  // ═══════════════════════════════════════════
  class PWAHandler {
    constructor() {
      this.deferredPrompt = null;
      this.installBtn = document.getElementById("installApp");
      this.bindEvents();
    }

    bindEvents() {
      window.addEventListener("beforeinstallprompt", (e) => {
        e.preventDefault();
        this.deferredPrompt = e;

        if (this.installBtn) {
          this.installBtn.style.display = "block";
          this.installBtn.addEventListener("click", () => this.install());
        }
      });

      window.addEventListener("appinstalled", () => {
        if (this.installBtn) {
          this.installBtn.style.display = "none";
        }
      });
    }

    async install() {
      if (!this.deferredPrompt) return;
      this.deferredPrompt.prompt();
      const choiceResult = await this.deferredPrompt.userChoice;
      if (choiceResult.outcome === "accepted") {
        console.log("🍁 User accepted the install prompt");
      }
      this.deferredPrompt = null;
      if (this.installBtn) {
        this.installBtn.style.display = "none";
      }
    }
  }

  // ═══════════════════════════════════════════
  // 13. INITIALIZATION
  // ═══════════════════════════════════════════
  const initializeApp = () => {
    // Set year in footer
    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // Initialize page loader
    const pageLoader = new PageLoader();
    pageLoader.init();

    // Initialize core systems
    const audioManager = new AudioManager();
    const achievementSystem = new AchievementSystem();
    const vnSystem = new AIVNDialogueSystem();
    const guideSystem = new GuideSystem();
    const githubManager = new GitHubManager(CONFIG.USERNAME);
    const uiRenderer = new UIRenderer();
    const navigation = new NavigationSystem();
    const pwaHandler = new PWAHandler();

    // Wire up dependencies
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

    // Expose public API
    const publicAPI = {
      audioManager,
      achievementSystem,
      vnSystem,
      guideSystem,
      githubManager,
      uiRenderer,
      navigation,
      playSFX: (type) => audioManager.playSFX(type),
      triggerVNDialogue: (route, customText) =>
        vnSystem.open(route, customText),
      closeVNDialogue: () => vnSystem.close(),
      nextVNDialogue: () => vnSystem.next(),
      navigateTo: (route, skipDialogue) =>
        navigation.navigate(route, skipDialogue),
      startGuide: () => guideSystem.start(),
      stopGuide: () => guideSystem.stop(),
      loadProjects: () => navigation.loadProjects(),
      refreshStats: async () => {
        try {
          await githubManager.fetchAllRepos();
          await githubManager.fetchTotalCommits();
          uiRenderer.updateStats(
            githubManager.repositories,
            githubManager.totalCommits,
          );
          audioManager.playSFX("questClear");
          console.log("📊 Stats refreshed!");
        } catch (error) {
          console.error("Refresh failed:", error);
        }
      },
      clearCache: () => githubManager.clearCache(),
      getMemory: () => vnSystem.userMemory,
      getAchievements: () => achievementSystem.achievements,
    };

    Object.assign(window, publicAPI);

    // Initialize portfolio data
    window.MaplePortfolio = {
      AudioManager,
      AchievementSystem,
      GitHubManager,
      UIRenderer,
      CONFIG,
      ICONS,
      getLanguageColor,
      timeAgo,
    };

    // Load initial data
    document.addEventListener("DOMContentLoaded", async () => {
      const audio = new AudioManager();
      const achievement = new AchievementSystem();
      achievement.setAudioManager(audio);

      const github = new GitHubManager(CONFIG.USERNAME);
      const ui = new UIRenderer();
      ui.setGitHubManager(github);
      ui.setAudioManager(audio);
      ui.setupFilterTabs();

      ui.renderSkeleton(3);
      ui.showLoader(true);

      // Unlock first visit achievement
      if (!localStorage.getItem("maple_first_visit")) {
        localStorage.setItem("maple_first_visit", "1");
        setTimeout(() => achievement.unlock("first_visit"), 1500);
      }

      try {
        const repos = await github.fetchAllRepos();
        const totalCommits = await github.fetchTotalCommits();

        ui.updateStats(repos, totalCommits);
        ui.renderCarousel();
        ui.renderProjects("all");

        console.log("✅ Portfolio loaded successfully!");
        console.log(`📊 Total repos: ${repos.length}`);
        console.log(
          `📄 Repos with README: ${repos.filter((r) => r.readme).length}`,
        );
        console.log(
          `🌐 Repos with Pages: ${repos.filter((r) => r.has_pages || r.homepage).length}`,
        );
      } catch (error) {
        console.error("Failed to load:", error);
        ui.renderError("Gagal menghubungkan ke server. Coba lagi nanti.", () =>
          location.reload(),
        );
      } finally {
        ui.showLoader(false);
      }
    });

    // Navbar hover SFX
    document
      .querySelectorAll(".nav-link:not(.nav-link--cta)")
      .forEach((link) => {
        link.addEventListener("mouseenter", () => {
          if (!link.classList.contains("active")) {
            audioManager.playSFX("menuSelect");
          }
        });
      });

    // BGM Volume Control via scroll
    const bgmPlayer = document.querySelector(".bgm-player");
    if (bgmPlayer) {
      bgmPlayer.addEventListener("wheel", (e) => {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.05 : 0.05;
        const newVolume = Math.max(0, Math.min(1, audioManager.volume + delta));
        audioManager.setVolume(newVolume);
      });

      // Double-click to reset volume
      bgmPlayer.addEventListener("dblclick", () => {
        audioManager.setVolume(0.5);
      });
    }

    // Keyboard shortcuts
    document.addEventListener("keydown", (e) => {
      // Alt+G: Toggle guide
      if (e.altKey && e.key === "g") {
        e.preventDefault();
        guideSystem.toggle();
      }
      // Alt+M: Toggle music
      if (e.altKey && e.key === "m") {
        e.preventDefault();
        audioManager.toggle();
      }
      // Alt+C: Clear cache
      if (e.altKey && e.key === "c") {
        e.preventDefault();
        githubManager.clearCache();
        console.log("🗑️ Cache cleared!");
      }
      // Alt+R: Refresh stats
      if (e.altKey && e.key === "r") {
        e.preventDefault();
        publicAPI.refreshStats();
      }
    });

    // Log initialization
    console.log("🍁 Maple's Portfolio v4.0 initialized!");
    console.log("🤖 AI Dialogue System active");
    console.log("📄 Multi-source README fetching enabled");
    console.log("🌐 GitHub Pages preview for repos with Pages");
    console.log("📋 README preview for repos without Pages");
    console.log("🛡️ System ready!");
    console.log(
      "⌨️ Shortcuts: Alt+G (Guide), Alt+M (Music), Alt+C (Clear Cache), Alt+R (Refresh Stats)",
    );
  };

  // ═══════════════════════════════════════════
  // 14. START APPLICATION
  // ═══════════════════════════════════════════
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeApp);
  } else {
    initializeApp();
  }
})();
