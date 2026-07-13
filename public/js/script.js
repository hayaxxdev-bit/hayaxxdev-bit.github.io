// ═══════════════════════════════════════════
// PORTFOLIO SCRIPT - hayaxxdev-bit
// ENTERPRISE VERSION - TEMA MAPLE BOFURI
// ═══════════════════════════════════════════

(function () {
  "use strict";

  // ═══════════════════════════════════════════
  // 1. CONFIGURATION
  // ═══════════════════════════════════════════
  const CONFIG = {
    USERNAME: "hayaxxdev-bit",
    BGM_VOLUME: 0.5,
    SFX_VOLUME: 0.15,
    TYPING_SPEED_MIN: 25,
    TYPING_SPEED_MAX: 45,
    GUIDE_DELAY: 5000,
    AUTO_LOAD_DELAY: 800,
  };

  // ═══════════════════════════════════════════
  // 2. AUDIO MANAGER
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

      this.sfxMap = this._createSFXMap();
      this.bindEvents();
    }

    // ─── Private Methods ───
    _createSFXMap() {
      return {
        menuSelect: this._sfxMenuSelect.bind(this),
        questClear: this._sfxQuestClear.bind(this),
        close: this._sfxClose.bind(this),
        dialogue: this._sfxDialogue.bind(this),
        guideStart: this._sfxGuideStart.bind(this),
        konami: this._sfxKonami.bind(this),
      };
    }

    _sfxMenuSelect() {
      const now = this.context.currentTime;
      const osc = this.context.createOscillator();
      const gain = this.context.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.setValueAtTime(1174.66, now + 0.06);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(now);
      osc.stop(now + 0.12);
    }

    _sfxQuestClear() {
      const now = this.context.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, i) => {
        const osc = this.context.createOscillator();
        const gain = this.context.createGain();
        osc.type = "triangle";
        osc.frequency.value = freq;
        const start = now + i * 0.1;
        gain.gain.setValueAtTime(0.1, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.25);
        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(start);
        osc.stop(start + 0.28);
      });
    }

    _sfxClose() {
      const now = this.context.currentTime;
      const osc = this.context.createOscillator();
      const gain = this.context.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(150, now + 0.2);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(now);
      osc.stop(now + 0.22);
    }

    _sfxDialogue() {
      const now = this.context.currentTime;
      const osc = this.context.createOscillator();
      const gain = this.context.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(660, now + 0.08);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(now);
      osc.stop(now + 0.12);
    }

    _sfxGuideStart() {
      const now = this.context.currentTime;
      const notes = [523.25, 659.25, 783.99];
      notes.forEach((freq, i) => {
        const osc = this.context.createOscillator();
        const gain = this.context.createGain();
        osc.type = "sine";
        osc.frequency.value = freq;
        const start = now + i * 0.08;
        gain.gain.setValueAtTime(0.06, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.15);
        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(start);
        osc.stop(start + 0.18);
      });
    }

    _sfxKonami() {
      const now = this.context.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5];
      notes.forEach((freq, i) => {
        const osc = this.context.createOscillator();
        const gain = this.context.createGain();
        osc.type = "sine";
        osc.frequency.value = freq;
        const start = now + i * 0.08;
        gain.gain.setValueAtTime(0.08, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.2);
        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(start);
        osc.stop(start + 0.22);
      });
    }

    // ─── Public Methods ───
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
      if (this.context?.state === "suspended") {
        this.context.resume();
      }
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
        } catch (e) {
          /* ignore */
        }
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
      if (this.isPlaying) {
        this.playTrack(this.currentTrackIndex);
      }
      this.updateUI();
    }

    setVolume(value) {
      this.volume = Math.max(0, Math.min(1, value));
      if (this.bgmGain) {
        this.bgmGain.gain.value = this.volume;
      }
      if (this.uiElements.volumeFill) {
        this.uiElements.volumeFill.style.width = `${this.volume * 100}%`;
      }
    }

    playSFX(type) {
      if (!this.ensureContext()) return;
      const sfx = this.sfxMap[type];
      if (sfx) sfx();
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

      if (label) {
        label.textContent = this.playlist[this.currentTrackIndex].name;
      }
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
        } catch (e) {
          /* ignore */
        }
        this.context = null;
      }
      this.isInitialized = false;
    }
  }

  // ═══════════════════════════════════════════
  // 3. VN DIALOGUE SYSTEM
  // ═══════════════════════════════════════════
  class VNDialogueSystem {
    constructor() {
      this.container = document.getElementById("vnContainer");
      this.messageEl = document.getElementById("vnMessage");
      this.nextBtn = document.getElementById("vnNext");
      this.closeBtn = document.getElementById("vnClose");
      this.nameEl = document.querySelector(".vn-name");
      this.avatarImg = document.querySelector(".vn-avatar-img");

      this.audioManager = null;
      this.currentRoute = "home";
      this.isTyping = false;
      this.typeTimer = null;
      this.dialogueIndex = 0;
      this.isOpen = false;

      this.dialogues = {
        home: [
          {
            speaker: "🍁 Maple",
            text: "Ehehe.. Halo! Namaku Kaede, di game panggil aku Maple ya! Selamat datang di guild-ku~ ✨",
          },
          {
            speaker: "🍁 Maple",
            text: "Wah, kamu datang berkunjung? Jangan khawatir, selama ada aku, tidak ada serangan yang bisa menembus tempat ini! 🛡️",
          },
          {
            speaker: "🍁 Maple",
            text: "Eh? Tempatnya berantakan? U-uhm, aku ketiduran saat nge-farm material tadi... Maaf ya.. 💦",
          },
          {
            speaker: "🐢 Syrup",
            text: "... (Syrup mendengkur pelan di sudut ruangan)",
          },
          {
            speaker: "🍁 Maple",
            text: "Syrup, ayo sapa tamu kita! ...Eh, Syrup lagi tidur ya? Ya sudah deh. 🐢",
          },
          {
            speaker: "🍁 Maple",
            text: "Siapapun yang berani mengacau di sini, akan ku-Devour! Nyam nyam! 💢",
          },
          {
            speaker: "🍁 Maple",
            text: "Katanya di sini banyak monster enak... Eh, kamu bukan monster kan? Hehe, bercanda! 😋",
          },
        ],
        maple: [
          {
            speaker: "📖 Guild Master",
            text: "Ah, kamu penasaran dengan Maple? Iya, itu dia, gadis polos yang jadi monster tak terkalahkan!",
          },
          {
            speaker: "📖 Guild Master",
            text: "Bayangin, semua stat point-nya dimasukin ke VIT. FULL DEFENSE! 🛡️",
          },
          {
            speaker: "📖 Guild Master",
            text: "Gara-gara build aneh itu, dia bisa dapetin skill kayak Absolute Defense, Machine God, bahkan jadi boss raid sendiri.",
          },
          {
            speaker: "📖 Guild Master",
            text: "Developer gamenya sampe pusing ngadepin dia! 😂",
          },
          {
            speaker: "📖 Guild Master",
            text: 'Yang paling kocak sih skill "Atrocity". Maple berubah jadi monster raksasa serem...',
          },
          {
            speaker: "📖 Guild Master",
            text: "...tapi suaranya tetep imut kaya anak kecil. Musuh-musuhnya trauma semua! 👹",
          },
          {
            speaker: "🍁 Maple",
            text: "Maple juga punya pet kura-kura bernama Syrup yang bisa terbang! Imut banget kan? 🐢✨",
          },
        ],
        project: [
          {
            speaker: "🎮 Maple",
            text: "Ini adalah semua loot dan quest yang berhasil kuselesaikan! Lumayan kan buat pamer ke Sally? 😎",
          },
          {
            speaker: "🎮 Maple",
            text: "Setiap proyek punya rarity lho: SSR (Legendary), SR (Rare), atau R (Common).",
          },
          { speaker: "🎮 Maple", text: "Pasti defense-nya tinggi-tinggi! 🛡️" },
          {
            speaker: "🎮 Maple",
            text: "Pro tip: Klik filter tab untuk sortir item-item ini.",
          },
          {
            speaker: "🍁 Maple",
            text: "Aku sih milih yang paling enak dimakan! 🤤",
          },
          {
            speaker: "🎮 Maple",
            text: "Wah, banyak banget! Aku jadi bingung mau pakai skill yang mana...",
          },
          { speaker: "⚡ Maple", text: "Machine God aja kali ya? 💥" },
        ],
        about: [
          {
            speaker: "🛡️ Maple",
            text: "Tentang aku? Hmm... Aku cuma player biasa yang masukin semua status point ke VIT!",
          },
          { speaker: "🛡️ Maple", text: "Defense is the best! 🛡️✨" },
          {
            speaker: "🛡️ Maple",
            text: "Spesialisasi aku itu jadi tameng berjalan! Semua serangan pasti ku-block dengan Absolute Defense!",
          },
          {
            speaker: "🍖 Maple",
            text: "Kadang aku dibilang aneh karena suka makan monster... Padahal rasanya enak loh! Mau coba? 🍖",
          },
          {
            speaker: "💕 Maple",
            text: "Kalau nggak lagi main game, aku biasa main sama Sally. Temanku yang paling hebat! 💕",
          },
        ],
        contact: [
          {
            speaker: "📨 Maple",
            text: "Kirimkan pesan cepat, sebelum aku dipanggil party buat raid boss! 💌",
          },
          {
            speaker: "🛡️ Maple",
            text: "Bisa hubungi lewat email atau GitHub. Tenang aja, semua pesanmu aman di bawah perlindungan Aegis-ku!",
          },
          {
            speaker: "🐌 Maple",
            text: "Aku terbuka untuk kolaborasi party, asal jangan ajak lawan boss yang geraknya cepet ya... Aku kan jalannya lambat 🐌",
          },
          {
            speaker: "🔥 Maple",
            text: "Fun fact: Kalau kamu pencet kombinasi tombol legendaris Konami Code, aku bakal keluarin skill rahasia! 🔥",
          },
        ],
      };

      this.bindEvents();
    }

    // ─── Private Methods ───
    _getDialogues(route) {
      return this.dialogues[route] || this.dialogues.home;
    }

    _getRandomDialogue(route) {
      const dialogues = this._getDialogues(route);
      return dialogues[Math.floor(Math.random() * dialogues.length)];
    }

    // ─── Public Methods ───
    bindEvents() {
      this.nextBtn?.addEventListener("click", (e) => {
        e.stopPropagation();
        this.next();
      });

      this.closeBtn?.addEventListener("click", (e) => {
        e.stopPropagation();
        this.close();
      });

      this.container?.addEventListener("click", (e) => {
        if (e.target === this.container || e.target.closest(".vn-textbox")) {
          this.next();
        }
      });

      document.addEventListener("keydown", (e) => {
        if (!this.isOpen) return;

        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          this.next();
        }
        if (e.key === "Escape") {
          this.close();
        }
      });
    }

    setAudioManager(audioManager) {
      this.audioManager = audioManager;
    }

    open(route, customText = null) {
      this.currentRoute = route;
      this.isOpen = true;
      this.dialogueIndex = 0;

      this.container?.classList.add("vn-container--active");
      this.audioManager?.playSFX("dialogue");

      const dialogue = customText
        ? { speaker: "🍁 Maple", text: customText }
        : this._getRandomDialogue(route);

      this.typeText(dialogue);
    }

    typeText(dialogue) {
      if (this.typeTimer) {
        clearTimeout(this.typeTimer);
        this.typeTimer = null;
      }

      this.isTyping = true;

      if (this.nameEl) {
        this.nameEl.innerHTML = `${dialogue.speaker} <span class="vn-badge">Guild Member</span>`;
      }

      if (!this.messageEl) return;

      this.messageEl.textContent = "";
      const text = dialogue.text;
      let charIndex = 0;
      const speed =
        CONFIG.TYPING_SPEED_MIN +
        Math.random() * (CONFIG.TYPING_SPEED_MAX - CONFIG.TYPING_SPEED_MIN);

      const type = () => {
        if (charIndex < text.length) {
          this.messageEl.textContent += text.charAt(charIndex);
          charIndex++;
          this.typeTimer = setTimeout(type, speed);
        } else {
          this.isTyping = false;
          this.messageEl.innerHTML = `${this.messageEl.textContent}<span class="typing-cursor"></span>`;
          setTimeout(() => {
            if (this.messageEl) {
              this.messageEl.innerHTML = this.messageEl.textContent.replace(
                '<span class="typing-cursor"></span>',
                "",
              );
            }
          }, 800);
        }
      };

      type();
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

      const currentText = this.messageEl?.textContent || "";
      const currentIndex = dialogues.findIndex((d) => d.text === currentText);
      const nextIndex = (currentIndex + 1) % dialogues.length;

      this.audioManager?.playSFX("dialogue");
      this.typeText(dialogues[nextIndex]);
    }

    _skipTyping() {
      if (this.typeTimer) {
        clearTimeout(this.typeTimer);
        this.typeTimer = null;
      }
      this.isTyping = false;
      if (this.messageEl) {
        const fullText = this.messageEl.textContent;
        this.messageEl.innerHTML = fullText;
        this.audioManager?.playSFX("menuSelect");
      }
    }

    close() {
      if (this.typeTimer) {
        clearTimeout(this.typeTimer);
        this.typeTimer = null;
      }
      this.isTyping = false;
      this.isOpen = false;
      this.container?.classList.remove("vn-container--active");
      this.audioManager?.playSFX("close");
    }

    isActive() {
      return this.isOpen;
    }
  }

  // ═══════════════════════════════════════════
  // 4. GUIDE SYSTEM
  // ═══════════════════════════════════════════
  class GuideSystem {
    constructor() {
      this.button = document.getElementById("guideModeBtn");
      this.indicator = document.getElementById("guideIndicator");
      this.vnSystem = null;
      this.audioManager = null;
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

      this.bindEvents();
    }

    // ─── Private Methods ───
    _sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }

    _updateIndicator(step) {
      if (!this.indicator) return;

      let dotsHTML = "";
      const totalDots = this.steps.length;
      for (let i = 0; i < totalDots; i++) {
        let cls = "dot";
        if (i < step) cls += " completed";
        if (i === step) cls += " active";
        dotsHTML += `<span class="${cls}"></span>`;
      }

      const progressEl = this.indicator.querySelector(".guide-progress");
      if (progressEl) {
        progressEl.innerHTML = dotsHTML;
      }
    }

    // ─── Public Methods ───
    bindEvents() {
      this.button?.addEventListener("click", () => this.toggle());
    }

    setVNDialogue(vnSystem) {
      this.vnSystem = vnSystem;
    }

    setAudioManager(audioManager) {
      this.audioManager = audioManager;
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

      this.button?.classList.add("guide-mode-btn--active");
      this.indicator?.classList.add("guide-indicator--active");
      this.audioManager?.playSFX("guideStart");

      try {
        for (let i = 0; i < this.steps.length; i++) {
          if (!this.isActive) break;
          this.currentStep = i;
          const step = this.steps[i];

          this._updateIndicator(i);
          window.navigateTo(step.route, true);
          this.vnSystem?.open(step.route, step.message);

          await this._sleep(CONFIG.GUIDE_DELAY);

          this.vnSystem?.close();
          await this._sleep(300);
        }
      } catch (e) {
        console.log("Guide interrupted:", e);
      } finally {
        this.isRunning = false;
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
      this.button?.classList.remove("guide-mode-btn--active");
      this.indicator?.classList.remove("guide-indicator--active");
      this.vnSystem?.close();
      this.audioManager?.playSFX("close");
    }
  }

  // ═══════════════════════════════════════════
  // 5. REPOSITORY MANAGER
  // ═══════════════════════════════════════════
  class RepositoryManager {
    constructor() {
      this.username = CONFIG.USERNAME;
      this.repositories = [];
      this.isLoaded = false;
      this.filter = "all";
      this.cache = {};
    }

    // ─── Fetch Methods ───

    async fetchRepos() {
      try {
        const response = await fetch(
          `https://api.github.com/users/${this.username}/repos?sort=updated&per_page=30`,
        );
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        this.repositories = await response.json();
        this.isLoaded = true;
        return this.repositories;
      } catch (error) {
        console.error("GitHub fetch failed:", error);
        throw error;
      }
    }

    async fetchUserStats() {
      try {
        const response = await fetch(
          `https://api.github.com/users/${this.username}`,
        );
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        return data;
      } catch (error) {
        console.error("Failed to fetch user stats:", error);
        return null;
      }
    }

    async fetchCommitStats() {
      try {
        let totalCommits = 0;
        const repos = this.repositories.length
          ? this.repositories
          : await this.fetchRepos();

        for (const repo of repos) {
          try {
            const response = await fetch(
              `https://api.github.com/repos/${this.username}/${repo.name}/commits?per_page=1`,
            );
            if (response.ok) {
              const linkHeader = response.headers.get("link");
              if (linkHeader) {
                const match = linkHeader.match(/&page=(\d+)>; rel="last"/);
                if (match) {
                  totalCommits += parseInt(match[1]);
                }
              }
            }
          } catch (e) {
            continue;
          }
        }

        return totalCommits;
      } catch (error) {
        console.error("Failed to fetch commit stats:", error);
        return 0;
      }
    }

    // ─── Stats Update with Animation ───

    async updateStats() {
      try {
        // Get all data
        const userData = await this.fetchUserStats();
        const totalCommits = await this.fetchCommitStats();

        // Prepare stats data
        const statsData = {
          repoCount: {
            value: this.repositories.length,
            suffix: "",
            label: "Repository",
          },
          starCount: {
            value: this.getTotalStars(),
            suffix: "",
            label: "Total Stars",
          },
          projectCount: {
            value: this.repositories.length,
            suffix: "+",
            label: "Total Proyek",
          },
          commitCount: {
            value: totalCommits,
            suffix: "+",
            label: "Total Commit",
          },
        };

        // Update each stat with animation
        Object.entries(statsData).forEach(([id, data]) => {
          const element = document.getElementById(id);
          if (element) {
            this.animateCounter(element, data.value, data.suffix);
          }
        });

        // Update non-animated stats
        if (userData) {
          this.updateStaticStats(userData);
        }
      } catch (error) {
        console.error("Failed to update stats:", error);
        this.setFallbackStats();
      }
    }

    // ─── Counter Animation ───

    animateCounter(element, target, suffix = "") {
      if (!element) return;

      const duration = 1500;
      const startTime = performance.now();
      const startValue = 0;

      // Clear previous animation
      element.classList.remove("count-up");
      element.textContent = "0" + suffix;

      const updateCounter = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function (easeOutCubic)
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(eased * target);

        element.textContent = current + suffix;

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          element.textContent = target + suffix;
          element.classList.add("count-up");
        }
      };

      requestAnimationFrame(updateCounter);
    }

    // ─── Static Stats Update ───

    updateStaticStats(userData) {
      // Update aktif sejak
      const createdDate = new Date(userData.created_at);
      const activeSinceEl = document.getElementById("activeSince");
      if (activeSinceEl) {
        activeSinceEl.textContent = createdDate.getFullYear();
        activeSinceEl.classList.add("count-up");
      }

      // Update last active
      const lastActiveEl = document.getElementById("lastActive");
      if (lastActiveEl && userData.updated_at) {
        const lastUpdate = new Date(userData.updated_at);
        const now = new Date();
        const diffDays = Math.floor((now - lastUpdate) / (1000 * 60 * 60 * 24));

        let text;
        if (diffDays === 0) {
          text = "Today";
        } else if (diffDays === 1) {
          text = "Yesterday";
        } else if (diffDays < 7) {
          text = `${diffDays}d ago`;
        } else if (diffDays < 30) {
          text = `${Math.floor(diffDays / 7)}w ago`;
        } else if (diffDays < 365) {
          text = `${Math.floor(diffDays / 30)}mo ago`;
        } else {
          text = `${Math.floor(diffDays / 365)}y ago`;
        }

        lastActiveEl.textContent = text;
        lastActiveEl.classList.add("count-up");
      }
    }

    // ─── Fallback Stats ───

    setFallbackStats() {
      const fallbackData = {
        repoCount: { value: 0, suffix: "" },
        starCount: { value: 0, suffix: "" },
        projectCount: { value: 0, suffix: "+" },
        commitCount: { value: 0, suffix: "+" },
        activeSince: "2022",
        lastActive: "Recently",
      };

      Object.entries(fallbackData).forEach(([id, data]) => {
        const element = document.getElementById(id);
        if (element) {
          if (typeof data === "object") {
            element.textContent = data.value + data.suffix;
          } else {
            element.textContent = data;
          }
          element.classList.add("count-up");
        }
      });
    }

    // ─── Enhanced Update with Queue ───

    async updateStatsWithQueue() {
      const statsQueue = [
        { id: "repoCount", value: this.repositories.length, suffix: "" },
        { id: "starCount", value: this.getTotalStars(), suffix: "" },
        { id: "projectCount", value: this.repositories.length, suffix: "+" },
      ];

      // Update commit stats with delay
      const commitCountEl = document.getElementById("commitCount");
      if (commitCountEl) {
        commitCountEl.textContent = "0+";
        const totalCommits = await this.fetchCommitStats();
        statsQueue.push({
          id: "commitCount",
          value: totalCommits,
          suffix: "+",
        });
      }

      // Animate stats sequentially
      for (let i = 0; i < statsQueue.length; i++) {
        const stat = statsQueue[i];
        const element = document.getElementById(stat.id);
        if (element) {
          this.animateCounter(element, stat.value, stat.suffix);
          // Delay between animations for visual effect
          await new Promise((resolve) => setTimeout(resolve, 200));
        }
      }

      // Update static stats
      const userData = await this.fetchUserStats();
      if (userData) {
        this.updateStaticStats(userData);
      }
    }

    // ─── Categorization ───

    categorizeRepo(repo) {
      const combined = [
        repo.name,
        repo.description || "",
        repo.language || "",
        ...(repo.topics || []),
      ]
        .join(" ")
        .toLowerCase();

      if (
        combined.includes("game") ||
        combined.includes("unity") ||
        combined.includes("godot")
      )
        return "game";
      if (
        combined.includes("design") ||
        combined.includes("figma") ||
        combined.includes("ui") ||
        combined.includes("art")
      )
        return "design";
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
      if (repo.homepage || repo.has_pages) return "web";
      return "other";
    }

    getFilteredRepos(filter) {
      if (filter === "all") return this.repositories;
      return this.repositories.filter((r) => this.categorizeRepo(r) === filter);
    }

    getTotalStars() {
      return this.repositories.reduce((sum, r) => sum + r.stargazers_count, 0);
    }

    getLanguageStats() {
      const stats = {};
      this.repositories.forEach((repo) => {
        if (repo.language) {
          stats[repo.language] = (stats[repo.language] || 0) + 1;
        }
      });
      return stats;
    }
  }
  // ═══════════════════════════════════════════
  // 6. UI RENDERER
  // ═══════════════════════════════════════════
  class UIRenderer {
    constructor() {
      this.repoManager = null;
      this.carouselTrack = document.getElementById("carTrack");
      this.carouselDots = document.getElementById("carDots");
      this.projectGrid = document.getElementById("projectGrid");
      this.projectLoader = document.getElementById("projectLoader");
      this.projectEmpty = document.getElementById("projectEmpty");
      this.filterTabs = document.querySelectorAll("#filterTabs .filter-tab");
      this.repoCount = document.getElementById("repoCount");
      this.starCount = document.getElementById("starCount");
      this.currentCarouselIndex = 0;
    }

    // ─── Private Methods ───
    _createSlideHTML(repo) {
      return `
        <h4 class="slide__title">${repo.name}</h4>
        <p class="slide__desc">${repo.description || "Tidak ada deskripsi."}</p>
        <div class="slide__tags">
          ${repo.language ? `<span class="slide__tag">${repo.language}</span>` : ""}
          <span class="slide__tag">⭐ ${repo.stargazers_count}</span>
          <span class="slide__tag">🔄 ${new Date(repo.updated_at).toLocaleDateString("id-ID")}</span>
        </div>
      `;
    }

    _createProjectCardHTML(repo) {
      const created = new Date(repo.created_at);
      const updated = new Date(repo.updated_at);
      const dateStr = created.toLocaleDateString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      const hasPages = repo.has_pages || repo.homepage;
      const pagesUrl =
        repo.homepage ||
        `https://${this.repoManager.username}.github.io/${repo.name}`;
      const category = this.repoManager.categorizeRepo(repo);

      const categoryLabels = {
        web: "🌐 Web",
        game: "🎮 Game",
        design: "🎨 Design",
        other: "📦 Lainnya",
      };
      const categoryLabel = categoryLabels[category] || "📦 Lainnya";

      return `
        <article class="project-card">
          <h3 class="project-card__title">${repo.name}</h3>
          <p class="project-card__desc">${repo.description || "Tidak ada deskripsi."}</p>
          <span class="project-card__date">📅 Dibuat: ${dateStr} | Diperbarui: ${updated.toLocaleDateString("id-ID")}</span>
          <div class="project-card__meta">
            ${repo.language ? `<span class="project-card__tag">${repo.language}</span>` : ""}
            <span class="project-card__tag">⭐ ${repo.stargazers_count}</span>
            <span class="project-card__tag">${categoryLabel}</span>
          </div>
          <div class="project-card__actions">
            <a href="${repo.html_url}" target="_blank" rel="noopener" class="project-card__link">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
              Repo
            </a>
            ${
              hasPages
                ? `
              <a href="${pagesUrl}" target="_blank" rel="noopener" class="project-card__view">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                View Page
              </a>`
                : ""
            }
          </div>
        </article>
      `;
    }

    // ─── Public Methods ───
    setRepoManager(manager) {
      this.repoManager = manager;
    }

    renderCarousel(repos) {
      if (!this.carouselTrack || !this.carouselDots) return;

      const slides = repos.slice(0, 6);
      this.carouselTrack.innerHTML = "";
      this.carouselDots.innerHTML = "";

      slides.forEach((repo, i) => {
        const slide = document.createElement("div");
        slide.className = "carousel__slide";
        slide.innerHTML = this._createSlideHTML(repo);
        this.carouselTrack.appendChild(slide);

        const dot = document.createElement("div");
        dot.className = "carousel__dot";
        if (i === 0) dot.classList.add("carousel__dot--active");
        dot.addEventListener("click", () => this.goToCarouselSlide(i));
        this.carouselDots.appendChild(dot);
      });

      this._setupCarouselNavigation(slides.length);
    }

    _setupCarouselNavigation(totalSlides) {
      const prevBtn = document.getElementById("carPrev");
      const nextBtn = document.getElementById("carNext");
      const slides = this.carouselTrack.querySelectorAll(".carousel__slide");
      const dots = this.carouselDots.querySelectorAll(".carousel__dot");

      const updateDots = (index) => {
        dots.forEach((d, i) =>
          d.classList.toggle("carousel__dot--active", i === index),
        );
      };

      const goToSlide = (index) => {
        if (!slides.length) return;
        const slideWidth = slides[0].offsetWidth + 16;
        this.carouselTrack.scrollTo({
          left: index * slideWidth,
          behavior: "smooth",
        });
        this.currentCarouselIndex = index;
        updateDots(index);
      };

      prevBtn?.addEventListener("click", () => {
        const newIndex = Math.max(this.currentCarouselIndex - 1, 0);
        goToSlide(newIndex);
      });

      nextBtn?.addEventListener("click", () => {
        const newIndex = Math.min(
          this.currentCarouselIndex + 1,
          totalSlides - 1,
        );
        goToSlide(newIndex);
      });

      this.carouselTrack.addEventListener("scroll", () => {
        if (!slides.length) return;
        const slideWidth = slides[0].offsetWidth + 16;
        const newIndex = Math.round(this.carouselTrack.scrollLeft / slideWidth);
        if (
          newIndex !== this.currentCarouselIndex &&
          newIndex >= 0 &&
          newIndex < totalSlides
        ) {
          this.currentCarouselIndex = newIndex;
          updateDots(this.currentCarouselIndex);
        }
      });

      this.goToCarouselSlide = goToSlide;
    }

    renderProjects(filter = "all") {
      if (!this.projectGrid || !this.repoManager) return;

      const repos = this.repoManager.getFilteredRepos(filter);

      if (!repos.length) {
        this.projectGrid.innerHTML = "";
        if (this.projectEmpty) this.projectEmpty.style.display = "block";
        return;
      }
      if (this.projectEmpty) this.projectEmpty.style.display = "none";

      this.projectGrid.innerHTML = repos
        .map((repo) => this._createProjectCardHTML(repo))
        .join("");
    }

    setupFilterTabs() {
      this.filterTabs.forEach((tab) => {
        tab.addEventListener("click", () => {
          this.filterTabs.forEach((t) =>
            t.classList.remove("filter-tab--active"),
          );
          tab.classList.add("filter-tab--active");
          const filter = tab.dataset.filter;
          this.renderProjects(filter);
          window.playSFX?.("menuSelect");
        });
      });
    }

    updateStats(repos) {
      if (this.repoCount) this.repoCount.textContent = repos.length;
      if (this.starCount) {
        const total = repos.reduce((sum, r) => sum + r.stargazers_count, 0);
        this.starCount.textContent = total;
      }
    }

    showLoader(show) {
      if (this.projectLoader) {
        this.projectLoader.style.display = show ? "flex" : "none";
      }
    }
  }

  // ═══════════════════════════════════════════
  // 7. NAVIGATION SYSTEM
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
      this.repoManager = null;
      this.uiRenderer = null;

      this.bindEvents();
      this.handleRouteParam();
    }

    // ─── Private Methods ───
    _setActiveView(route) {
      this.views.forEach((v) => v.classList.remove("view--active"));
      const target = document.getElementById(route);
      if (target) target.classList.add("view--active");
    }

    _setActiveNav(route) {
      this.navLinks.forEach((link) => {
        link.classList.remove("active");
        if (link.dataset.route === route) link.classList.add("active");
      });
    }

    // ─── Public Methods ───
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
      });

      document.addEventListener("click", (e) => {
        if (this.navMenu?.classList.contains("navbar__menu--open")) {
          if (!e.target.closest(".navbar")) {
            this.navMenu.classList.remove("navbar__menu--open");
          }
        }
      });
    }

    setVNDialogue(vnSystem) {
      this.vnSystem = vnSystem;
    }

    setAudioManager(audioManager) {
      this.audioManager = audioManager;
    }

    setRepoManager(repoManager) {
      this.repoManager = repoManager;
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
      this._setActiveView(route);
      this._setActiveNav(route);
      this.currentRoute = route;

      this.navMenu?.classList.remove("navbar__menu--open");
      window.scrollTo({ top: 0, behavior: "smooth" });

      if (route === "project") {
        this.loadProjects();
      }

      if (!skipDialogue && this.vnSystem && !this.vnSystem.isActive()) {
        setTimeout(() => this.vnSystem.open(route), 500);
      }
    }

    async loadProjects() {
      if (!this.repoManager || !this.uiRenderer) return;
      if (this.repoManager.isLoaded) {
        this.uiRenderer.renderProjects("all");
        return;
      }

      this.uiRenderer.showLoader(true);
      try {
        await this.repoManager.fetchRepos();
        this.uiRenderer.renderCarousel(this.repoManager.repositories);
        this.uiRenderer.renderProjects("all");
        this.uiRenderer.setupFilterTabs();
        this.uiRenderer.updateStats(this.repoManager.repositories);
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
  // 8. KONAMI CODE EASTER EGG
  // ═══════════════════════════════════════════
  class KonamiCode {
    constructor() {
      this.code = [
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
      this.index = 0;
      this.audioManager = null;
      this.repoManager = null;
      this.overlay = document.getElementById("secretOverlay");
      this.closeBtn = document.getElementById("secretClose");
      this.projectEl = document.getElementById("secretProject");

      this.bindEvents();
    }

    // ─── Private Methods ───
    _resetCode() {
      this.index = 0;
    }

    _getRandomRepo() {
      if (!this.repoManager?.repositories?.length) return null;
      const repos = this.repoManager.repositories;
      return repos[Math.floor(Math.random() * repos.length)];
    }

    _renderSecretProject(repo) {
      if (!this.projectEl || !repo) return;
      this.projectEl.innerHTML = `
        <div style="background:var(--bg-card);padding:20px;border-radius:var(--radius);border:1px solid var(--accent-gold);">
          <h3 style="color:var(--accent-gold);">🌟 ${repo.name}</h3>
          <p style="color:var(--text-secondary);">${repo.description || "Project rahasia!"}</p>
          <p style="color:var(--accent);">⭐ ${repo.stargazers_count} stars</p>
          <a href="${repo.html_url}" target="_blank" style="color:var(--accent-gold);text-decoration:none;border:1px solid var(--accent-gold);padding:4px 12px;border-radius:4px;display:inline-block;margin-top:8px;">Lihat Repo →</a>
        </div>
      `;
    }

    // ─── Public Methods ───
    setAudioManager(audioManager) {
      this.audioManager = audioManager;
    }

    setRepoManager(repoManager) {
      this.repoManager = repoManager;
    }

    bindEvents() {
      document.addEventListener("keydown", (e) => {
        if (e.code === this.code[this.index]) {
          this.index++;
          if (this.index === this.code.length) {
            this.activate();
            this._resetCode();
          }
        } else {
          this._resetCode();
        }
      });

      this.closeBtn?.addEventListener("click", () => this.deactivate());
      this.overlay?.addEventListener("click", (e) => {
        if (e.target === this.overlay) this.deactivate();
      });

      document.addEventListener("keydown", (e) => {
        if (
          e.key === "Escape" &&
          this.overlay?.classList.contains("secret-overlay--active")
        ) {
          this.deactivate();
        }
      });
    }

    activate() {
      if (!this.overlay) return;

      const repo = this._getRandomRepo();
      if (repo) this._renderSecretProject(repo);

      this.overlay.classList.add("secret-overlay--active");
      document.body.classList.add("screen-shake");
      this.audioManager?.playSFX("konami");

      setTimeout(() => {
        document.body.classList.remove("screen-shake");
      }, 500);
    }

    deactivate() {
      this.overlay?.classList.remove("secret-overlay--active");
      this.audioManager?.playSFX("close");
    }
  }

  // ═══════════════════════════════════════════
  // SYRUP PET - NO HORIZONTAL SCROLL
  // ═══════════════════════════════════════════

  class SyrupPet {
    constructor() {
      this.element = document.getElementById("syrupPet");
      this.img = document.getElementById("syrupGif");
      this.isSleeping = false;
      this.isVisible = true;
      this.clickCount = 0;
      this.audioManager = window.audioManager;
      this.screenWidth = window.innerWidth;

      if (!this.element || !this.img) {
        console.error("❌ Syrup element not found!");
        return;
      }

      // Cegah scroll horizontal
      this.preventHorizontalScroll();

      this.init();
      this.handleResize();
    }

    // ─── Cegah Scroll Horizontal ───
    preventHorizontalScroll() {
      // Pastikan body tidak overflow
      document.body.style.overflowX = "hidden";
      document.body.style.maxWidth = "100%";

      // Cegah scroll dengan touch
      document.addEventListener(
        "touchmove",
        (e) => {
          if (e.target.closest(".syrup-pet")) {
            return;
          }

          const scrollable = e.target.closest(".scrollable");
          if (!scrollable) {
            // Cegah scroll horizontal
            const touch = e.touches[0];
            const deltaX = touch.clientX - (this._lastTouchX || touch.clientX);
            this._lastTouchX = touch.clientX;

            if (
              Math.abs(deltaX) >
              Math.abs(
                e.touches[0].clientY -
                  (this._lastTouchY || e.touches[0].clientY),
              )
            ) {
              e.preventDefault();
            }
          }
        },
        { passive: false },
      );
    }

    init() {
      console.log("🐢 Syrup GIF loaded!");

      // Event listeners
      this.element.addEventListener("click", (e) => this.onClick(e));
      this.element.addEventListener("dblclick", () => this.doSpin());
      this.element.addEventListener("mouseenter", () => this.onHover());

      // Keyboard shortcuts
      document.addEventListener("keydown", (e) => {
        if (e.key === "s" || e.key === "S") this.toggleSleep();
        if (e.key === "h" || e.key === "H") this.toggleVisibility();
        if (e.key === "r" || e.key === "R") this.reloadGif();
      });

      // Window resize
      window.addEventListener("resize", () => this.handleResize());

      console.log("🐢 Syrup Pet Ready!");
      console.log("🎮 Controls: S - Sleep, H - Hide/Show, R - Reload GIF");
      console.log(`📱 Screen: ${this.screenWidth}px`);
    }

    // ─── Handle Resize ───
    handleResize() {
      this.screenWidth = window.innerWidth;

      // Posisi aman di dalam layar
      let size = 100;
      let bottom = 100;
      let right = 30;

      if (this.screenWidth >= 1200) {
        size = 120;
        bottom = 120;
        right = 40;
      } else if (this.screenWidth >= 992) {
        size = 100;
        bottom = 100;
        right = 35;
      } else if (this.screenWidth >= 768) {
        size = 80;
        bottom = 80;
        right = 30;
      } else if (this.screenWidth >= 576) {
        size = 65;
        bottom = 70;
        right = 25;
      } else if (this.screenWidth >= 480) {
        size = 55;
        bottom = 60;
        right = 20;
      } else if (this.screenWidth >= 360) {
        size = 45;
        bottom = 50;
        right = 15;
      } else {
        size = 38;
        bottom = 40;
        right = 10;
      }

      // Update ukuran - pastikan tidak overflow
      this.img.style.width = Math.min(size, this.screenWidth * 0.15) + "px";
      this.img.style.height = Math.min(size, this.screenWidth * 0.15) + "px";
      this.element.style.bottom =
        Math.min(bottom, window.innerHeight * 0.15) + "px";
      this.element.style.right =
        Math.min(right, this.screenWidth * 0.05) + "px";

      // Update atribut
      const finalSize = Math.min(size, this.screenWidth * 0.15);
      this.img.setAttribute("width", finalSize);
      this.img.setAttribute("height", finalSize);
    }

    // ─── Sleep Toggle ───
    toggleSleep() {
      this.isSleeping = !this.isSleeping;

      if (this.isSleeping) {
        this.element.classList.add("sleeping");
        this.img.style.animationPlayState = "paused";
        this.showMessage("😴 Zzz...");
        this.playSound("sleep");
      } else {
        this.element.classList.remove("sleeping");
        this.img.style.animationPlayState = "running";
        this.showMessage("😊 Syrup bangun!");
        this.playSound("click");
      }
    }

    // ─── Visibility Toggle ───
    toggleVisibility() {
      this.isVisible = !this.isVisible;
      this.element.style.display = this.isVisible ? "block" : "none";
      this.showMessage(
        this.isVisible ? "👋 Syrup kembali!" : "👻 Syrup menghilang!",
      );
    }

    // ─── Reload GIF ───
    reloadGif() {
      const src = this.img.src;
      this.img.src = "";
      setTimeout(() => {
        this.img.src = src;
        this.showMessage("🔄 GIF di-reload!");
      }, 100);
    }

    // ─── Click Event ───
    onClick(e) {
      this.clickCount++;

      if (this.clickCount === 3) {
        this.doHappyDance();
        this.clickCount = 0;
        return;
      }

      const count = this.screenWidth < 480 ? 6 : 10;
      for (let i = 0; i < count; i++) {
        setTimeout(() => this.createHeart(e), i * 80);
      }

      const messages = [
        "❤️ Syrup sayang kamu!",
        "💕 Kamu teman baik!",
        "✨ Syrup senang!",
        "🐢 *Syrup melambai*",
        "💜 Love you!",
        "🌟 Kamu hebat!",
      ];
      this.showMessage(messages[Math.floor(Math.random() * messages.length)]);
      this.playSound("click");
    }

    // ─── Hover Event ───
    onHover() {
      if (!this.isSleeping) {
        this.showMessage("🐢 Hai!");
      }
    }

    // ─── Spin Animation ───
    doSpin() {
      this.img.style.transition = "transform 1s ease";
      this.img.style.transform = "rotate(720deg) scale(1.5)";
      this.playSound("spin");
      this.showMessage("🌀 Syrup berputar!");

      setTimeout(() => {
        this.img.style.transform = "rotate(0deg) scale(1)";
      }, 1000);
    }

    // ─── Happy Dance ───
    doHappyDance() {
      this.img.style.animation = "none";
      this.img.style.animation = "syrupHappy 0.5s ease-in-out infinite";
      this.playSound("happy");
      this.showMessage("🎉 Syrup senang!");

      this.createConfetti();

      setTimeout(() => {
        this.img.style.animation = "";
        this.img.style.animation = "syrupFloat 4s ease-in-out infinite";
      }, 3000);
    }

    // ─── Heart Particles ───
    createHeart(e) {
      const rect = this.element.getBoundingClientRect();
      const heart = document.createElement("div");
      const emojis = [
        "❤️",
        "💜",
        "💛",
        "💚",
        "💙",
        "🧡",
        "💕",
        "💗",
        "💖",
        "💝",
      ];
      heart.textContent = emojis[Math.floor(Math.random() * emojis.length)];

      const x = e ? e.clientX : rect.left + rect.width / 2;
      const y = e ? e.clientY : rect.top + rect.height / 2;
      const angle = Math.random() * Math.PI * 2;
      const distance = 50 + Math.random() * 100;
      const tx = Math.cos(angle) * distance;
      const ty = -Math.sin(angle) * distance - 80;

      const size =
        this.screenWidth < 480 ? "1rem" : `${1.2 + Math.random() * 0.8}rem`;

      heart.style.cssText = `
      position: fixed;
      left: ${Math.min(x, window.innerWidth - 20)}px;
      top: ${Math.min(y, window.innerHeight - 20)}px;
      font-size: ${size};
      pointer-events: none;
      z-index: 99999;
      animation: heartBurst ${1.2 + Math.random() * 0.5}s ease-out forwards;
      --tx: ${tx}px;
      --ty: ${ty}px;
      user-select: none;
    `;
      document.body.appendChild(heart);
      setTimeout(() => heart.remove(), 1800);
    }

    // ─── Confetti ───
    createConfetti() {
      const colors = [
        "#ff6b6b",
        "#feca57",
        "#48dbfb",
        "#ff9ff3",
        "#54a0ff",
        "#7c3aed",
      ];
      const rect = this.element.getBoundingClientRect();
      const count = this.screenWidth < 480 ? 20 : 40;

      for (let i = 0; i < count; i++) {
        const confetti = document.createElement("div");
        const tx =
          (Math.random() - 0.5) * Math.min(500, window.innerWidth * 0.6);
        const ty = -200 - Math.random() * 400;

        confetti.style.cssText = `
        position: fixed;
        left: ${rect.left + rect.width / 2}px;
        top: ${rect.top + rect.height / 2}px;
        width: ${4 + Math.random() * 6}px;
        height: ${4 + Math.random() * 6}px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        pointer-events: none;
        z-index: 99999;
        border-radius: ${Math.random() > 0.5 ? "50%" : "2px"};
        animation: confettiFall ${2 + Math.random() * 2}s ease-out forwards;
        --tx: ${tx}px;
        --ty: ${ty}px;
        transform: rotate(${Math.random() * 360}deg);
      `;
        document.body.appendChild(confetti);
        setTimeout(() => confetti.remove(), 4000);
      }
    }

    // ─── Show Message ───
    showMessage(text) {
      const rect = this.element.getBoundingClientRect();
      const msg = document.createElement("div");
      msg.textContent = text;

      const fontSize = this.screenWidth < 480 ? "0.75rem" : "0.9rem";
      const padding = this.screenWidth < 480 ? "6px 14px" : "8px 20px";

      // Posisi aman di dalam layar
      const left = Math.max(
        10,
        Math.min(rect.left + rect.width / 2, window.innerWidth - 20),
      );
      const top = Math.max(10, rect.top - 50);

      msg.style.cssText = `
      position: fixed;
      top: ${top}px;
      left: ${left}px;
      font-family: 'Courier New', monospace;
      font-size: ${fontSize};
      font-weight: 600;
      color: #fff;
      background: rgba(124, 58, 237, 0.9);
      padding: ${padding};
      border-radius: 20px;
      border: 1px solid rgba(255, 255, 255, 0.2);
      pointer-events: none;
      z-index: 99999;
      animation: messagePop 2s ease-out forwards;
      white-space: nowrap;
      max-width: ${window.innerWidth * 0.8}px;
      box-shadow: 0 4px 30px rgba(124, 58, 237, 0.3);
      transform: translateX(-50%);
      backdrop-filter: blur(10px);
      user-select: none;
      overflow: hidden;
      text-overflow: ellipsis;
    `;
      document.body.appendChild(msg);
      setTimeout(() => msg.remove(), 2000);
    }

    // ─── Play Sound ───
    playSound(type) {
      if (this.audioManager) {
        const sounds = {
          click: "menuSelect",
          happy: "guideStart",
          sleep: "close",
          eat: "dialogue",
          spin: "konami",
        };
        this.audioManager.playSFX(sounds[type] || "menuSelect");
      }
    }
  }

  // ─── CSS Animations ───
  const styleSheet = document.createElement("style");
  styleSheet.textContent = `
  @keyframes heartBurst {
    0% {
      opacity: 1;
      transform: translate(0, 0) scale(1) rotate(0deg);
    }
    100% {
      opacity: 0;
      transform: translate(var(--tx), var(--ty)) scale(0) rotate(360deg);
    }
  }

  @keyframes messagePop {
    0% {
      opacity: 0;
      transform: translateX(-50%) translateY(10px) scale(0.8);
    }
    15% {
      opacity: 1;
      transform: translateX(-50%) translateY(0) scale(1.05);
    }
    25% {
      transform: translateX(-50%) translateY(0) scale(1);
    }
    80% {
      opacity: 1;
      transform: translateX(-50%) translateY(0) scale(1);
    }
    100% {
      opacity: 0;
      transform: translateX(-50%) translateY(-20px) scale(0.9);
    }
  }

  @keyframes confettiFall {
    0% {
      opacity: 1;
      transform: translate(0, 0) rotate(0deg) scale(1);
    }
    100% {
      opacity: 0;
      transform: translate(var(--tx), var(--ty)) rotate(720deg) scale(0);
    }
  }
`;
  document.head.appendChild(styleSheet);

  // ─── Initialize ───
  document.addEventListener("DOMContentLoaded", () => {
    const syrup = new SyrupPet();
    window.syrupPet = syrup;
  });
  // ═══════════════════════════════════════════
  // 9. INITIALIZATION
  // ═══════════════════════════════════════════
  document.addEventListener("DOMContentLoaded", () => {
    // Set year
    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // Initialize all systems
    const audioManager = new AudioManager();
    const vnSystem = new VNDialogueSystem();
    const guideSystem = new GuideSystem();
    const repoManager = new RepositoryManager();
    const uiRenderer = new UIRenderer();
    const navigation = new NavigationSystem();
    const konami = new KonamiCode();

    // Wire up dependencies
    vnSystem.setAudioManager(audioManager);
    guideSystem.setVNDialogue(vnSystem);
    guideSystem.setAudioManager(audioManager);
    uiRenderer.setRepoManager(repoManager);
    navigation.setVNDialogue(vnSystem);
    navigation.setAudioManager(audioManager);
    navigation.setRepoManager(repoManager);
    navigation.setUIRenderer(uiRenderer);
    konami.setAudioManager(audioManager);
    konami.setRepoManager(repoManager);

    // Expose to global
    Object.assign(window, {
      audioManager,
      vnSystem,
      guideSystem,
      repoManager,
      uiRenderer,
      navigation,
      konami,
      // Global functions
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
    });

    // Di dalam DOMContentLoaded, setelah repoManager.fetchRepos()
    setTimeout(async () => {
      try {
        await repoManager.fetchRepos();
        uiRenderer.renderCarousel(repoManager.repositories);
        uiRenderer.updateStats(repoManager.repositories);

        // Tambahkan update untuk statistik tambahan
        await repoManager.updateStats();

        if (navigation.getCurrentRoute() === "project") {
          uiRenderer.renderProjects("all");
          uiRenderer.setupFilterTabs();
        }
      } catch (error) {
        console.log("Initial data load:", error.message);
      }
    }, CONFIG.AUTO_LOAD_DELAY);

    // Auto-load initial data
    setTimeout(async () => {
      try {
        // Fetch repositories first
        await repoManager.fetchRepos();

        // Render UI components
        uiRenderer.renderCarousel(repoManager.repositories);
        uiRenderer.updateStats(repoManager.repositories);

        // Update stats with animation
        await repoManager.updateStatsWithQueue();

        // Load projects if on project page
        if (navigation.getCurrentRoute() === "project") {
          uiRenderer.renderProjects("all");
          uiRenderer.setupFilterTabs();
        }

        // Play quest clear sound
        audioManager.playSFX("questClear");
      } catch (error) {
        console.log("Initial data load:", error.message);
        // Set fallback stats on error
        repoManager.setFallbackStats();
      }
    }, CONFIG.AUTO_LOAD_DELAY);

    // ─── Navbar Hover SFX ───
    document
      .querySelectorAll(".nav-link:not(.nav-link--cta)")
      .forEach((link) => {
        link.addEventListener("mouseenter", () => {
          if (!link.classList.contains("active")) {
            audioManager.playSFX("menuSelect");
          }
        });
      });

    // BGM Volume Control
    const bgmPlayer = document.querySelector(".bgm-player");
    if (bgmPlayer) {
      bgmPlayer.addEventListener("wheel", (e) => {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.05 : 0.05;
        const newVolume = Math.max(0, Math.min(1, audioManager.volume + delta));
        audioManager.setVolume(newVolume);
      });

      bgmPlayer.addEventListener("dblclick", () => {
        audioManager.setVolume(0.5);
      });
    }

    console.log("🍁 Maple's Portfolio initialized!");
    console.log("🛡️ System ready. Konami Code: ↑↑↓↓←→←→BA");
  });
})();
// PWA Install Prompt
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  console.log('PWA installation prompt available');
  
  // Show install button
  const installBtn = document.getElementById('installApp');
  if (installBtn) {
    installBtn.style.display = 'block';
    installBtn.addEventListener('click', () => {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        } else {
          console.log('User dismissed the install prompt');
        }
        deferredPrompt = null;
      });
    });
  }
});

window.addEventListener('appinstalled', () => {
  console.log('PWA installed successfully');
  // Track installation
  if (window.gtag) {
    gtag('event', 'pwa_installed');
  }
});

window.refreshStats = async () => {
  try {
    await repoManager.fetchRepos();
    await repoManager.updateStatsWithQueue();
    audioManager.playSFX("questClear");
  } catch (error) {
    console.error("Refresh failed:", error);
  }
};
