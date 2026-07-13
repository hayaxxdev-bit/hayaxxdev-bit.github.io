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
// ═══════════════════════════════════════════
// NEW: Language colors & time helpers (letakkan sebelum class RepositoryManager)
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

function getLanguageColor(lang) {
  return LANGUAGE_COLORS[lang] || "#8b949e";
}

// Format relatif waktu ala "3 hari lalu"
function timeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffSec = Math.floor((now - date) / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffMonth = Math.floor(diffDay / 30);
  const diffYear = Math.floor(diffDay / 365);

  if (diffSec < 60) return "Baru saja";
  if (diffMin < 60) return `${diffMin} menit lalu`;
  if (diffHour < 24) return `${diffHour} jam lalu`;
  if (diffDay < 30) return `${diffDay} hari lalu`;
  if (diffMonth < 12) return `${diffMonth} bulan lalu`;
  return `${diffYear} tahun lalu`;
}

// Ikon SVG kecil dipakai berulang di slide/card
const ICONS = {
  star: `<svg viewBox="0 0 16 16" fill="currentColor"><path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25z"/></svg>`,
  fork: `<svg viewBox="0 0 16 16" fill="currentColor"><path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0zM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0z"/></svg>`,
  clock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  repo: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>`,
  demo: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>`,
};

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
      lastActiveEl.textContent = timeAgo(userData.updated_at);
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

  // NEW: warna resmi bahasa pemrograman (dipakai UIRenderer untuk dot penanda)
  getLanguageColor(lang) {
    return getLanguageColor(lang);
  }

  // NEW: 6 repo teratas untuk carousel, diurutkan pakai kombinasi stars + terbaru
  getFeaturedRepos(count = 6) {
    return [...this.repositories]
      .sort((a, b) => {
        const scoreA = a.stargazers_count * 2 + (a.forks_count || 0);
        const scoreB = b.stargazers_count * 2 + (b.forks_count || 0);
        if (scoreB !== scoreA) return scoreB - scoreA;
        return new Date(b.updated_at) - new Date(a.updated_at);
      })
      .slice(0, count);
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

    // NEW: autoplay & swipe state
    this.autoplayTimer = null;
    this.autoplayDelay = CONFIG.AUTOPLAY_DELAY || 4500;
    this.isHovering = false;
    this.totalCarouselSlides = 0;
  }

  // ─── Private Methods ───

  // UPDATED: slide sekarang menampilkan header+ikon, rank, bahasa+warna,
  // stars, forks, last-updated relatif, dan tombol aksi (Repo / Live Demo)
  _createSlideHTML(repo, index = 0) {
    const initial = repo.name.charAt(0);
    const hasPages = repo.has_pages || repo.homepage;
    const pagesUrl =
      repo.homepage || `https://${this.repoManager.username}.github.io/${repo.name}`;

    const langBadge = repo.language
      ? `<span class="slide__tag slide__tag--language">
           <span class="slide__lang-dot" style="background:${getLanguageColor(repo.language)}"></span>${repo.language}
         </span>`
      : "";

    const demoLink = hasPages
      ? `<a class="slide__link slide__link--demo" href="${pagesUrl}" target="_blank" rel="noopener">${ICONS.demo} Demo</a>`
      : "";

    return `
      <span class="slide__rank">#${String(index + 1).padStart(2, "0")}</span>
      <div class="slide__header">
        <div class="slide__icon" aria-hidden="true">${initial}</div>
        <h4 class="slide__title"><a href="${repo.html_url}" target="_blank" rel="noopener">${repo.name}</a></h4>
      </div>
      <p class="slide__desc">${repo.description || "Tidak ada deskripsi."}</p>
      <div class="slide__stats">
        ${langBadge}
        <span class="slide__stat slide__stat--stars">${ICONS.star} ${repo.stargazers_count}</span>
        <span class="slide__stat slide__stat--forks">${ICONS.fork} ${repo.forks_count}</span>
        <span class="slide__stat slide__stat--updated">${ICONS.clock} ${timeAgo(repo.updated_at)}</span>
      </div>
      <div class="slide__actions">
        <a class="slide__link slide__link--repo" href="${repo.html_url}" target="_blank" rel="noopener">${ICONS.repo} Repo</a>
        ${demoLink}
      </div>
    `;
  }

  // NEW: satu slide skeleton (dipakai saat data masih fetching)
  _createSkeletonSlideHTML() {
    return `
      <div class="skeleton skeleton--icon"></div>
      <div class="skeleton skeleton--title"></div>
      <div class="skeleton skeleton--text"></div>
      <div class="skeleton skeleton--text short"></div>
      <div class="skeleton skeleton--tags"></div>
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
        <span class="project-card__date">📅 Dibuat: ${dateStr} | Diperbarui: ${timeAgo(repo.updated_at)}</span>
        <div class="project-card__meta">
          ${repo.language ? `<span class="project-card__tag">${repo.language}</span>` : ""}
          <span class="project-card__tag">⭐ ${repo.stargazers_count}</span>
          <span class="project-card__tag">🍴 ${repo.forks_count}</span>
          <span class="project-card__tag">${categoryLabel}</span>
        </div>
        <div class="project-card__actions">
          <a href="${repo.html_url}" target="_blank" rel="noopener" class="project-card__link">
            ${ICONS.repo}
            Repo
          </a>
          ${
            hasPages
              ? `
            <a href="${pagesUrl}" target="_blank" rel="noopener" class="project-card__view">
              ${ICONS.demo}
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

  // NEW: tampilkan skeleton sebelum data GitHub selesai di-fetch
  renderSkeleton(count = 3) {
    if (!this.carouselTrack) return;
    this.stopAutoplay();
    this.carouselTrack.innerHTML = "";
    if (this.carouselDots) this.carouselDots.innerHTML = "";

    for (let i = 0; i < count; i++) {
      const slide = document.createElement("div");
      slide.className = "carousel__slide carousel__slide--skeleton";
      slide.innerHTML = this._createSkeletonSlideHTML();
      this.carouselTrack.appendChild(slide);
    }
  }

  // NEW: tampilkan state error dengan tombol retry
  renderError(message = "Gagal memuat data dari GitHub.", onRetry = null) {
    if (!this.carouselTrack) return;
    this.stopAutoplay();
    this.carouselTrack.innerHTML = `
      <div class="car-error">
        <span class="car-error__icon" aria-hidden="true">⚠️</span>
        <p class="car-error__msg">${message}</p>
        <button class="car-error__retry" id="carRetryBtn" type="button">Coba Lagi</button>
      </div>
    `;
    if (this.carouselDots) this.carouselDots.innerHTML = "";

    const retryBtn = document.getElementById("carRetryBtn");
    if (retryBtn && typeof onRetry === "function") {
      retryBtn.addEventListener("click", onRetry);
    }
  }

  renderCarousel(repos) {
    if (!this.carouselTrack || !this.carouselDots) return;

    this.stopAutoplay();

    const slides = this.repoManager.getFeaturedRepos(6);
    this.totalCarouselSlides = slides.length;
    this.carouselTrack.innerHTML = "";
    this.carouselDots.innerHTML = "";

    if (!slides.length) {
      this.renderError("Belum ada repository untuk ditampilkan.");
      return;
    }

    slides.forEach((repo, i) => {
      const slide = document.createElement("div");
      slide.className = "carousel__slide";
      slide.setAttribute("role", "listitem");
      slide.setAttribute("tabindex", "0");
      slide.innerHTML = this._createSlideHTML(repo, i);
      this.carouselTrack.appendChild(slide);

      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "carousel__dot";
      dot.setAttribute("role", "tab");
      dot.setAttribute("aria-label", `Ke slide ${i + 1}`);
      if (i === 0) dot.classList.add("carousel__dot--active");
      dot.addEventListener("click", () => {
        this.goToCarouselSlide(i);
        this._restartAutoplay();
      });
      this.carouselDots.appendChild(dot);
    });

    const totalSlideNumEl = document.getElementById("totalSlideNum");
    if (totalSlideNumEl) totalSlideNumEl.textContent = slides.length;

    this._setupCarouselNavigation(slides.length);
    this.setupSwipeSupport();
    this.setupAutoplayPause();
    this.startAutoplay();
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

    const updateCounter = (index) => {
      const cur = document.getElementById("currentSlideNum");
      if (cur) cur.textContent = index + 1;
    };

    const updateProgress = (index) => {
      const fill = document.getElementById("carProgressFill");
      if (fill) fill.style.width = `${((index + 1) / totalSlides) * 100}%`;
    };

    const updateNavButtons = (index) => {
      if (prevBtn) prevBtn.disabled = index === 0;
      if (nextBtn) nextBtn.disabled = index === totalSlides - 1;
    };

    const goToSlide = (index) => {
      if (!slides.length) return;
      index = Math.max(0, Math.min(index, totalSlides - 1));
      const slideWidth = slides[0].offsetWidth + 18;
      this.carouselTrack.scrollTo({
        left: index * slideWidth,
        behavior: "smooth",
      });
      this.currentCarouselIndex = index;
      updateDots(index);
      updateCounter(index);
      updateProgress(index);
      updateNavButtons(index);
    };

    prevBtn?.addEventListener("click", () => {
      goToSlide(Math.max(this.currentCarouselIndex - 1, 0));
      this._restartAutoplay();
    });

    nextBtn?.addEventListener("click", () => {
      goToSlide(Math.min(this.currentCarouselIndex + 1, totalSlides - 1));
      this._restartAutoplay();
    });

    this.carouselTrack.addEventListener("scroll", () => {
      if (!slides.length) return;
      const slideWidth = slides[0].offsetWidth + 18;
      const newIndex = Math.round(this.carouselTrack.scrollLeft / slideWidth);
      if (
        newIndex !== this.currentCarouselIndex &&
        newIndex >= 0 &&
        newIndex < totalSlides
      ) {
        this.currentCarouselIndex = newIndex;
        updateDots(this.currentCarouselIndex);
        updateCounter(this.currentCarouselIndex);
        updateProgress(this.currentCarouselIndex);
        updateNavButtons(this.currentCarouselIndex);
      }
    });

    // init state
    updateCounter(0);
    updateProgress(0);
    updateNavButtons(0);

    this.goToCarouselSlide = goToSlide;
  }

  // NEW: autoplay ─────────────────────────────
  startAutoplay() {
    this.stopAutoplay();
    if (this.totalCarouselSlides <= 1) return;

    this.autoplayTimer = setInterval(() => {
      if (this.isHovering) return;
      const next = (this.currentCarouselIndex + 1) % this.totalCarouselSlides;
      this.goToCarouselSlide(next);
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
    if (!carousel || carousel.dataset.autoplayBound) return;
    carousel.dataset.autoplayBound = "true";

    carousel.addEventListener("mouseenter", () => {
      this.isHovering = true;
    });
    carousel.addEventListener("mouseleave", () => {
      this.isHovering = false;
    });
    carousel.addEventListener("focusin", () => {
      this.isHovering = true;
    });
    carousel.addEventListener("focusout", () => {
      this.isHovering = false;
    });
  }

  // NEW: swipe support untuk mobile ───────────
  setupSwipeSupport() {
    const track = this.carouselTrack;
    if (!track || track.dataset.swipeBound) return;
    track.dataset.swipeBound = "true";

    let startX = 0;
    let startY = 0;
    let isSwiping = false;

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

        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;
        const diffX = startX - endX;
        const diffY = startY - endY;

        if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
          if (diffX > 0) {
            this.goToCarouselSlide(
              Math.min(this.currentCarouselIndex + 1, this.totalCarouselSlides - 1),
            );
          } else {
            this.goToCarouselSlide(Math.max(this.currentCarouselIndex - 1, 0));
          }
          this._restartAutoplay();
        }
      },
      { passive: true },
    );
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
// NEW: Contoh alur inisialisasi lengkap (skeleton -> fetch -> render/error)
// Sesuaikan dengan orkestrasi app Anda yang sudah ada; ini hanya referensi.
// ═══════════════════════════════════════════
async function initFeaturedCarousel(repoManager, uiRenderer) {
  uiRenderer.setRepoManager(repoManager);
  uiRenderer.renderSkeleton(3);

  try {
    const repos = await repoManager.fetchRepos();
    uiRenderer.renderCarousel(repos);
    uiRenderer.renderProjects("all");
    uiRenderer.updateStats(repos);
  } catch (error) {
    uiRenderer.renderError(
      "Gagal memuat data dari GitHub. Periksa koneksi Anda.",
      () => initFeaturedCarousel(repoManager, uiRenderer),
    );
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

  // ════════════════════════════════════════════════════════════════
  // PAGE LOADER - MAPLE SHIELD STYLE
  // ════════════════════════════════════════════════════════════════
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

      // Simulate loading progress
      this.simulateProgress();

      // Listen for page load
      window.addEventListener("load", () => {
        this.complete();
      });

      // Fallback: hide after 5 seconds max
      setTimeout(() => {
        if (!this.isComplete) {
          console.warn("⚠️ Loader timeout - force hiding");
          this.complete();
        }
      }, 5000);
    }

    simulateProgress() {
      const steps = [
        { progress: 15, delay: 200 },
        { progress: 35, delay: 400 },
        { progress: 55, delay: 600 },
        { progress: 75, delay: 800 },
        { progress: 90, delay: 1000 },
      ];

      steps.forEach((step, index) => {
        setTimeout(() => {
          this.setProgress(step.progress);
        }, step.delay);
      });
    }

    setProgress(value) {
      this.progress = Math.min(value, 90); // Max 90% until actually loaded
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

      // Set to 100%
      this.setProgress(100);

      // Small delay for the 100% to show
      setTimeout(() => {
        this.loader?.classList.add("hidden");

        // Remove from DOM after transition
        setTimeout(() => {
          this.loader?.remove();
          console.log("🍁 Page loaded successfully!");
        }, 600);
      }, 400);
    }
  }

  // Initialize loader
  document.addEventListener("DOMContentLoaded", () => {
    const pageLoader = new PageLoader();
    pageLoader.init();
  });

  // ═══════════════════════════════════════════
  // SYRUP PET - NO HORIZONTAL SCROLL
  // ═══════════════════════════════════════════

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

    // Wire up dependencies
    vnSystem.setAudioManager(audioManager);
    guideSystem.setVNDialogue(vnSystem);
    guideSystem.setAudioManager(audioManager);
    uiRenderer.setRepoManager(repoManager);
    navigation.setVNDialogue(vnSystem);
    navigation.setAudioManager(audioManager);
    navigation.setRepoManager(repoManager);
    navigation.setUIRenderer(uiRenderer);

    // Expose to global
    Object.assign(window, {
      audioManager,
      vnSystem,
      guideSystem,
      repoManager,
      uiRenderer,
      navigation,
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

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  console.log("PWA installation prompt available");

  // Show install button
  const installBtn = document.getElementById("installApp");
  if (installBtn) {
    installBtn.style.display = "block";
    installBtn.addEventListener("click", () => {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted the install prompt");
        } else {
          console.log("User dismissed the install prompt");
        }
        deferredPrompt = null;
      });
    });
  }
});

window.addEventListener("appinstalled", () => {
  console.log("PWA installed successfully");
  // Track installation
  if (window.gtag) {
    gtag("event", "pwa_installed");
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
