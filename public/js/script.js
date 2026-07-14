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
    AUTOPLAY_DELAY: 4500,
    MAX_REPOS: 30,
    FEATURED_COUNT: 6,
    LOADER_TIMEOUT: 5000,
    STATS_ANIMATION_DURATION: 1500,
  };

  // ═══════════════════════════════════════════
  // LANGUAGE COLORS & UTILITY FUNCTIONS
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
    if (diffSec < 31536000) return `${Math.floor(diffSec / 2592000)} bulan lalu`;
    return `${Math.floor(diffSec / 31536000)} tahun lalu`;
  };

  const ICONS = {
    star: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25z"/></svg>',
    fork: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0zM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0z"/></svg>',
    clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
    repo: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>',
    demo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>',
  };

  // ═══════════════════════════════════════════
  // 2. AUDIO MANAGER (Singleton)
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
        { name: "🎵 Lo-Fi Anime Beats", url: "./public/music/Clarity-phonk.wav" },
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
        questClear: this._createMelodySFX([523.25, 659.25, 783.99, 1046.5], 0.1, 0.25),
        close: this._createSFX("sine", [600, 150], 0.06, 0.2, true),
        dialogue: this._createSFX("sine", [440, 660], 0.04, 0.12, true),
        guideStart: this._createMelodySFX([523.25, 659.25, 783.99], 0.06, 0.15),
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
          osc.frequency.exponentialRampToValueAtTime(frequencies[1], now + duration);
        } else {
          frequencies.forEach((freq, i) => {
            osc.frequency.setValueAtTime(freq, now + i * (duration / frequencies.length));
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
          // Already stopped
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
      this.currentTrackIndex = (this.currentTrackIndex + 1) % this.playlist.length;
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
      this.sfxMap[type]?.();
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
          // Context already closed
        }
        this.context = null;
      }
      this.isInitialized = false;
    }
  }

  // ═══════════════════════════════════════════
  // 3. VN DIALOGUE SYSTEM
  // ═══════════════════════════════════════════
 // ═══════════════════════════════════════════
// INTERACTIVE VN DIALOGUE SYSTEM
// ═══════════════════════════════════════════
class VNDialogueSystem {
  constructor() {
    // Cache DOM elements
    this.container = document.getElementById("vnContainer");
    this.messageEl = document.getElementById("vnMessage");
    this.nextBtn = document.getElementById("vnNext");
    this.closeBtn = document.getElementById("vnClose");
    this.skipBtn = document.getElementById("vnSkip");
    this.repeatBtn = document.getElementById("vnRepeat");
    this.nameEl = document.querySelector(".vn-name");
    this.speakerEl = document.querySelector(".vn-speaker");
    this.badgeEl = document.querySelector(".vn-badge");
    this.routeBadgeEl = document.querySelector("[data-route-indicator]");
    this.avatarImg = document.querySelector(".vn-avatar-img");
    this.avatarEmotion = document.querySelector(".vn-avatar-emotion");
    this.quickRepliesEl = document.getElementById("vnQuickReplies");
    this.progressBar = document.getElementById("vnProgressBar");
    this.contextText = document.querySelector(".vn-context-text");

    // State
    this.audioManager = null;
    this.currentRoute = "home";
    this.isTyping = false;
    this.typeTimer = null;
    this.isOpen = false;
    this.currentFullText = "";
    this.dialogueHistory = [];
    this.currentDialogueIndex = 0;
    this.totalDialogues = 0;

    // Route-specific configurations
    this.routeConfig = {
      home: {
        icon: "🏠",
        color: "#d4af37",
        badge: "Beranda",
        emotion: "😊"
      },
      maple: {
        icon: "🛡️",
        color: "#7c3aed",
        badge: "Vault",
        emotion: "✨"
      },
      project: {
        icon: "🎮",
        color: "#10b981",
        badge: "Karya",
        emotion: "🎯"
      },
      about: {
        icon: "📋",
        color: "#3b82f6",
        badge: "Tentang",
        emotion: "💡"
      },
      contact: {
        icon: "💌",
        color: "#ef4444",
        badge: "Kontak",
        emotion: "📨"
      }
    };

    // Interactive dialogue trees with choices
    this.dialogues = new Map([
      ["home", [
        { 
          speaker: "🍁 Maple", 
          text: "Ehehe.. Halo! Namaku Kaede, di game panggil aku Maple ya! Selamat datang di guild-ku~ ✨",
          emotion: "😊",
          quickReplies: [
            { text: "Hai Maple! Senang bertemu denganmu!", action: "greet" },
            { text: "Wah, guild-nya keren!", action: "compliment" }
          ]
        },
        { 
          speaker: "🍁 Maple", 
          text: "Wah, kamu datang berkunjung? Jangan khawatir, selama ada aku, tidak ada serangan yang bisa menembus tempat ini! 🛡️",
          emotion: "💪",
          condition: "greet"
        },
        { 
          speaker: "🍁 Maple", 
          text: "Hehe, terima kasih! Aku bangun sendiri lho dengan skill Absolute Defense! 🛡️✨",
          emotion: "😊",
          condition: "compliment"
        },
        { 
          speaker: "🍁 Maple", 
          text: "Eh? Tempatnya berantakan? U-uhm, aku ketiduran saat nge-farm material tadi... Maaf ya.. 💦",
          emotion: "😅"
        },
        { 
          speaker: "🐢 Syrup", 
          text: "... (Syrup mendengkur pelan di sudut ruangan)",
          emotion: "😴"
        },
        { 
          speaker: "🍁 Maple", 
          text: "Syrup, ayo sapa tamu kita! ...Eh, Syrup lagi tidur ya? Ya sudah deh. 🐢",
          emotion: "😊",
          quickReplies: [
            { text: "Biarkan dia tidur, lucu banget!", action: "cute" },
            { text: "Boleh aku lihat skill-mu?", action: "skill" }
          ]
        },
        { 
          speaker: "🍁 Maple", 
          text: "Siapapun yang berani mengacau di sini, akan ku-Devour! Nyam nyam! 💢",
          emotion: "😤",
          condition: "skill"
        },
        { 
          speaker: "🍁 Maple", 
          text: "Katanya di sini banyak monster enak... Eh, kamu bukan monster kan? Hehe, bercanda! 😋",
          emotion: "😋",
          quickReplies: [
            { text: "Jelajahi guild", action: "explore" },
            { text: "Ceritakan tentang petualanganmu", action: "story" }
          ]
        },
      ]],
      ["maple", [
        { 
          speaker: "📖 Guild Master", 
          text: "Ah, kamu penasaran dengan Maple? Iya, itu dia, gadis polos yang jadi monster tak terkalahkan!",
          emotion: "📖",
          quickReplies: [
            { text: "Ceritakan lebih lanjut!", action: "tell" },
            { text: "Bagaimana dia bisa sekuat itu?", action: "how" }
          ]
        },
        { 
          speaker: "📖 Guild Master", 
          text: "Bayangin, semua stat point-nya dimasukin ke VIT. FULL DEFENSE! 🛡️",
          emotion: "😱",
          condition: "how"
        },
        { 
          speaker: "📖 Guild Master", 
          text: "Gara-gara build aneh itu, dia bisa dapetin skill kayak <span class='highlight'>Absolute Defense</span>, <span class='highlight'>Machine God</span>, bahkan jadi boss raid sendiri.",
          emotion: "✨"
        },
        { 
          speaker: "📖 Guild Master", 
          text: "Developer gamenya sampe pusing ngadepin dia! 😂",
          emotion: "😂"
        },
        { 
          speaker: "📖 Guild Master", 
          text: 'Yang paling kocak sih skill <span class="highlight">"Atrocity"</span>. Maple berubah jadi monster raksasa serem...',
          emotion: "👹",
          quickReplies: [
            { text: "WOW! Keren banget!", action: "amazed" },
            { text: "Kasian developernya 😂", action: "laugh" }
          ]
        },
        { 
          speaker: "📖 Guild Master", 
          text: "...tapi suaranya tetep imut kaya anak kecil. Musuh-musuhnya trauma semua! 👹",
          emotion: "😈"
        },
        { 
          speaker: "🍁 Maple", 
          text: "Maple juga punya pet kura-kura bernama <span class='highlight'>Syrup</span> yang bisa terbang! Imut banget kan? 🐢✨",
          emotion: "🐢",
          quickReplies: [
            { text: "Aku ingin punya pet juga!", action: "want" },
            { text: "Lihat skill lainnya", action: "skills" }
          ]
        },
      ]],
      ["project", [
        { 
          speaker: "🎮 Maple", 
          text: "Ini adalah semua loot dan quest yang berhasil kuselesaikan! Lumayan kan buat pamer ke Sally? 😎",
          emotion: "😎",
          quickReplies: [
            { text: "Keren! Filter berdasarkan kategori?", action: "filter" },
            { text: "Tunjukkan yang terbaik!", action: "best" }
          ]
        },
        { 
          speaker: "🎮 Maple", 
          text: "Setiap proyek punya rarity lho: <span class='highlight'>SSR</span> (Legendary), <span class='highlight'>SR</span> (Rare), atau <span class='highlight'>R</span> (Common).",
          emotion: "⭐"
        },
        { 
          speaker: "🎮 Maple", 
          text: "Pasti defense-nya tinggi-tinggi! 🛡️",
          emotion: "🛡️"
        },
        { 
          speaker: "🎮 Maple", 
          text: "<span class='action-hint'>Pro tip:</span> Klik filter tab untuk sortir item-item ini.",
          emotion: "💡",
          quickReplies: [
            { text: "Oke, aku coba!", action: "try" },
            { text: "Ada berapa total proyek?", action: "count" }
          ]
        },
        { 
          speaker: "🍁 Maple", 
          text: "Aku sih milih yang paling enak dimakan! 🤤",
          emotion: "🤤"
        },
        { 
          speaker: "🎮 Maple", 
          text: "Wah, banyak banget! Aku jadi bingung mau pakai skill yang mana...",
          emotion: "😵",
          quickReplies: [
            { text: "Gunakan filter!", action: "filter" },
            { text: "Acak aja!", action: "random" }
          ]
        },
        { 
          speaker: "⚡ Maple", 
          text: "Machine God aja kali ya? 💥",
          emotion: "⚡"
        },
      ]],
      ["about", [
        { 
          speaker: "🛡️ Maple", 
          text: "Tentang aku? Hmm... Aku cuma player biasa yang masukin semua status point ke VIT!",
          emotion: "🤔",
          quickReplies: [
            { text: "Kenapa VIT semua?", action: "why" },
            { text: "Skill apa yang kamu punya?", action: "skills" }
          ]
        },
        { 
          speaker: "🛡️ Maple", 
          text: "<span class='highlight'>Defense is the best!</span> 🛡️✨",
          emotion: "✨"
        },
        { 
          speaker: "🛡️ Maple", 
          text: "Spesialisasi aku itu jadi tameng berjalan! Semua serangan pasti ku-block dengan <span class='highlight'>Absolute Defense</span>!",
          emotion: "🛡️"
        },
        { 
          speaker: "🍖 Maple", 
          text: "Kadang aku dibilang aneh karena suka makan monster... Padahal rasanya enak loh! Mau coba? 🍖",
          emotion: "🍖",
          quickReplies: [
            { text: "Mau! (Agak takut)", action: "yes" },
            { text: "Nggak deh, aku vegetarian", action: "no" }
          ]
        },
        { 
          speaker: "💕 Maple", 
          text: "Kalau nggak lagi main game, aku biasa main sama <span class='highlight'>Sally</span>. Temanku yang paling hebat! 💕",
          emotion: "💕",
          quickReplies: [
            { text: "Ceritakan tentang Sally!", action: "sally" },
            { text: "Kalian teman terbaik ya!", action: "friends" }
          ]
        },
      ]],
      ["contact", [
        { 
          speaker: "📨 Maple", 
          text: "Kirimkan pesan cepat, sebelum aku dipanggil party buat raid boss! 💌",
          emotion: "📨",
          quickReplies: [
            { text: "Aku mau kirim pesan!", action: "send" },
            { text: "Boleh minta kontak GitHub?", action: "github" }
          ]
        },
        { 
          speaker: "🛡️ Maple", 
          text: "Bisa hubungi lewat email atau GitHub. Tenang aja, semua pesanmu aman di bawah perlindungan <span class='highlight'>Aegis-ku</span>!",
          emotion: "🛡️"
        },
        { 
          speaker: "🐌 Maple", 
          text: "Aku terbuka untuk kolaborasi party, asal jangan ajak lawan boss yang geraknya cepet ya... Aku kan jalannya lambat 🐌",
          emotion: "🐌"
        },
        { 
          speaker: "🔥 Maple", 
          text: "<span class='highlight'>Fun fact:</span> Kalau kamu pencet kombinasi tombol legendaris <span class='highlight'>Konami Code</span>, aku bakal keluarin skill rahasia! 🔥",
          emotion: "🔥",
          quickReplies: [
            { text: "Konami Code? Apa itu?", action: "konami" },
            { text: "Aku penasaran skill rahasianya!", action: "secret" }
          ]
        },
      ]],
    ]);

    // Emotion to emoji mapping
    this.emotions = {
      "😊": "😊",
      "😅": "😅",
      "😴": "😴",
      "💪": "💪",
      "😤": "😤",
      "😋": "😋",
      "📖": "📖",
      "😱": "😱",
      "✨": "✨",
      "😂": "😂",
      "👹": "👹",
      "😈": "😈",
      "🐢": "🐢",
      "😎": "😎",
      "⭐": "⭐",
      "🛡️": "🛡️",
      "💡": "💡",
      "🤤": "🤤",
      "😵": "😵",
      "⚡": "⚡",
      "🤔": "🤔",
      "🍖": "🍖",
      "💕": "💕",
      "📨": "📨",
      "🐌": "🐌",
      "🔥": "🔥",
    };

    this._boundHandleKeydown = this._handleKeydown.bind(this);
    this._boundHandleQuickReply = this._handleQuickReply.bind(this);
    this.bindEvents();
  }

  // ─── Private Methods ───
  _getDialogues(route) {
    return this.dialogues.get(route) || this.dialogues.get("home");
  }

  _getRouteConfig(route) {
    return this.routeConfig[route] || this.routeConfig.home;
  }

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
      const emoji = this.emotions[emotion] || emotion || "😊";
      this.avatarEmotion.textContent = emoji;
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

    replies.forEach((reply) => {
      const button = document.createElement("button");
      button.className = "vn-quick-reply";
      button.textContent = reply.text;
      button.dataset.action = reply.action;
      button.addEventListener("click", () => this._handleQuickReply(reply));
      this.quickRepliesEl.appendChild(button);
    });

    this.quickRepliesEl.classList.add("vn-quick-replies--active");
  }

  _handleQuickReply(reply) {
    console.log(`🎮 Quick reply selected: ${reply.action}`);
    
    // Play SFX
    this.audioManager?.playSFX("menuSelect");
    
    // Hide quick replies
    this.quickRepliesEl?.classList.remove("vn-quick-replies--active");
    
    // Handle special actions
    switch (reply.action) {
      case "explore":
        this.close();
        window.navigateTo?.("maple", true);
        break;
      case "skill":
      case "skills":
        this.close();
        window.navigateTo?.("about", true);
        break;
      case "filter":
        this.close();
        // Trigger filter tabs if on project page
        document.querySelector('.filter-tab')?.click();
        break;
      case "send":
        this.close();
        // Focus on contact form
        document.querySelector('#contactForm input')?.focus();
        break;
      case "github":
        window.open(`https://github.com/${CONFIG.USERNAME}`, '_blank');
        break;
      case "konami":
        this.close();
        // Trigger Konami code hint
        console.log("🍁 Hint: ↑↑↓↓←→←→BA");
        break;
      default:
        // Continue to next dialogue
        this.next();
        break;
    }
  }

  _updateProgress() {
    if (this.progressBar && this.totalDialogues > 0) {
      const progress = ((this.currentDialogueIndex + 1) / this.totalDialogues) * 100;
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
      const config = this._getRouteConfig(route);
      const messages = {
        home: "Gunakan tombol quick reply untuk berinteraksi!",
        maple: "Pelajari tentang kekuatan Maple!",
        project: "Jelajahi karya-karya keren!",
        about: "Kenali Maple lebih dekat!",
        contact: "Hubungi Maple untuk kolaborasi!"
      };
      this.contextText.textContent = messages[route] || "Tekan Space/Enter untuk lanjut";
    }
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

    this.skipBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      this.skipAll();
    });

    this.repeatBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      this.repeat();
    });

    // Delegated click on container
    this.container?.addEventListener("click", (e) => {
      if (e.target === this.container || e.target.closest(".vn-textbox")) {
        // Don't advance if clicking on quick replies
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

  open(route, customText = null) {
    // Close if already open on different route
    if (this.isOpen && this.currentRoute !== route) {
      this.close();
    }

    this.currentRoute = route;
    this.isOpen = true;
    this.dialogueHistory = [];
    this.currentDialogueIndex = 0;

    // Get dialogues for route
    const dialogues = this._getDialogues(route);
    this.totalDialogues = dialogues.length;

    // Show container
    this.container?.classList.add("vn-container--active");
    this.container?.removeAttribute("hidden");
    this.container?.setAttribute("data-current-route", route);

    // Update UI elements
    this._updateRouteBadge(route);
    this._updateContext(route);
    this._updateProgress();

    // Play sound
    this.audioManager?.playSFX("dialogue");

    // Start with first dialogue or custom text
    if (customText) {
      this._typeText({ 
        speaker: "🍁 Maple", 
        text: customText, 
        emotion: "😊" 
      });
    } else {
      const firstDialogue = dialogues[0];
      this._typeText(firstDialogue);
    }
  }

  _typeText(dialogue) {
    this.stopTyping();
    this.isTyping = true;
    this.currentFullText = dialogue.text;

    // Show emotion
    if (dialogue.emotion) {
      this._showEmotion(dialogue.emotion);
    }

    // Update speaker name
    if (this.speakerEl) {
      this.speakerEl.textContent = dialogue.speaker;
    }

    if (!this.messageEl) return;

    // Clear and add entrance animation
    this.messageEl.innerHTML = "";
    this.messageEl.classList.add("vn-message--new");
    setTimeout(() => this.messageEl.classList.remove("vn-message--new"), 300);

    // Hide quick replies while typing
    this.quickRepliesEl?.classList.remove("vn-quick-replies--active");

    const text = dialogue.text;
    let charIndex = 0;
    const speed = CONFIG.TYPING_SPEED_MIN + 
      Math.random() * (CONFIG.TYPING_SPEED_MAX - CONFIG.TYPING_SPEED_MIN);

    const type = () => {
      if (charIndex < text.length) {
        // Handle HTML tags
        if (text[charIndex] === '<') {
          const endTag = text.indexOf('>', charIndex);
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
        
        // Add temporary cursor
        this.messageEl.insertAdjacentHTML('beforeend', '<span class="typing-cursor"></span>');
        setTimeout(() => {
          const cursor = this.messageEl?.querySelector('.typing-cursor');
          cursor?.remove();
        }, 800);

        // Show quick replies if available
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

// Export for use in main script
window.VNDialogueSystem = VNDialogueSystem;

  // ═══════════════════════════════════════════
  // 4. GUIDE SYSTEM
  // ═══════════════════════════════════════════
  class GuideSystem {
    constructor() {
      this.button = document.getElementById("guideModeBtn");
      this.indicator = document.getElementById("guideIndicator");
      this.dots = this.indicator?.querySelectorAll(".dot");
      this.vnSystem = null;
      this.audioManager = null;
      this.isActive = false;
      this.currentStep = 0;
      this.isRunning = false;

      this.steps = [
        { route: "home", message: "Ehehe, ayo aku pandu keliling guild-ku! Kita mulai dari sini, ini halaman utamaku. Ada banyak info keren loh! ✨" },
        { route: "maple", message: "Sekarang kita ke Maple's Vault! Di sini aku tunjukin semua skill dan equipment legendari-ku! 🛡️" },
        { route: "project", message: "Nah, sekarang kita ke gudang loot! Ini semua hasil karyaku selama main game... eh, maksudku ngoding! 😎" },
        { route: "about", message: "Sekarang ke halaman tentang aku! Di sini kamu bisa lihat skill dan tech stack yang kupakai. 📋" },
        { route: "contact", message: "Akhirnya kita sampai di halaman kontak! Kalau kamu mau party bareng atau kirim quest, bisa lewat sini ya! 💌" },
        { route: "home", message: "Nah, tur guild-ku udah selesai! Sekarang kita balik ke beranda lagi. Dadah~ 👋🍁" },
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
  // 5. REPOSITORY MANAGER
  // ═══════════════════════════════════════════
  class RepositoryManager {
    constructor() {
      this.username = CONFIG.USERNAME;
      this.repositories = [];
      this.isLoaded = false;
    }

    async fetchRepos() {
      if (this.isLoaded && this.repositories.length) {
        return this.repositories;
      }

      try {
        const response = await fetch(
          `https://api.github.com/users/${this.username}/repos?sort=updated&per_page=${CONFIG.MAX_REPOS}`
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
          `https://api.github.com/users/${this.username}`
        );
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return await response.json();
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

        for (const repo of repos.slice(0, 5)) { // Limit to top 5 repos for performance
          try {
            const response = await fetch(
              `https://api.github.com/repos/${this.username}/${repo.name}/commits?per_page=1`
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

    async updateStats() {
      try {
        const userData = await this.fetchUserStats();
        const totalCommits = await this.fetchCommitStats();

        const statsData = {
          repoCount: {
            element: document.getElementById("repoCount"),
            value: this.repositories.length,
            suffix: "",
          },
          starCount: {
            element: document.getElementById("starCount"),
            value: this.getTotalStars(),
            suffix: "",
          },
          projectCount: {
            element: document.getElementById("projectCount"),
            value: this.repositories.length,
            suffix: "+",
          },
          commitCount: {
            element: document.getElementById("commitCount"),
            value: totalCommits,
            suffix: "+",
          },
        };

        Object.values(statsData).forEach(({ element, value, suffix }) => {
          if (element) {
            this.animateCounter(element, value, suffix);
          }
        });

        if (userData) {
          this.updateStaticStats(userData);
        }
      } catch (error) {
        console.error("Failed to update stats:", error);
        this.setFallbackStats();
      }
    }

    animateCounter(element, target, suffix = "") {
      if (!element) return;

      const duration = CONFIG.STATS_ANIMATION_DURATION;
      const startTime = performance.now();

      element.classList.remove("count-up");
      element.textContent = "0" + suffix;

      const updateCounter = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
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

    updateStaticStats(userData) {
      const createdDate = new Date(userData.created_at);
      const activeSinceEl = document.getElementById("activeSince");
      if (activeSinceEl) {
        activeSinceEl.textContent = createdDate.getFullYear();
        activeSinceEl.classList.add("count-up");
      }

      const lastActiveEl = document.getElementById("lastActive");
      if (lastActiveEl && userData.updated_at) {
        lastActiveEl.textContent = timeAgo(userData.updated_at);
        lastActiveEl.classList.add("count-up");
      }
    }

    setFallbackStats() {
      const fallbackData = {
        repoCount: "0",
        starCount: "0",
        projectCount: "0+",
        commitCount: "0+",
        activeSince: "2022",
        lastActive: "Recently",
      };

      Object.entries(fallbackData).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) {
          element.textContent = value;
          element.classList.add("count-up");
        }
      });
    }

    async updateStatsWithQueue() {
      const statsQueue = [
        { id: "repoCount", value: this.repositories.length, suffix: "" },
        { id: "starCount", value: this.getTotalStars(), suffix: "" },
        { id: "projectCount", value: this.repositories.length, suffix: "+" },
      ];

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

      for (const stat of statsQueue) {
        const element = document.getElementById(stat.id);
        if (element) {
          this.animateCounter(element, stat.value, stat.suffix);
          await new Promise((resolve) => setTimeout(resolve, 200));
        }
      }

      const userData = await this.fetchUserStats();
      if (userData) {
        this.updateStaticStats(userData);
      }
    }

    categorizeRepo(repo) {
      const combined = [
        repo.name,
        repo.description || "",
        repo.language || "",
        ...(repo.topics || []),
      ]
        .join(" ")
        .toLowerCase();

      if (combined.includes("game") || combined.includes("unity") || combined.includes("godot"))
        return "game";
      if (combined.includes("design") || combined.includes("figma") || combined.includes("ui") || combined.includes("art"))
        return "design";
      if (repo.language && ["html", "css", "javascript", "typescript", "jsx", "tsx", "vue", "react"].includes(repo.language.toLowerCase()))
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

    getFeaturedRepos(count = CONFIG.FEATURED_COUNT) {
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
      this.currentCarouselIndex = 0;
      this.autoplayTimer = null;
      this.autoplayDelay = CONFIG.AUTOPLAY_DELAY;
      this.isHovering = false;
      this.totalCarouselSlides = 0;
    }

    _createSlideHTML(repo, index = 0) {
      const initial = repo.name.charAt(0);
      const hasPages = repo.has_pages || repo.homepage;
      const pagesUrl = repo.homepage || `https://${this.repoManager.username}.github.io/${repo.name}`;

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
      const dateStr = created.toLocaleDateString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      const hasPages = repo.has_pages || repo.homepage;
      const pagesUrl = repo.homepage || `https://${this.repoManager.username}.github.io/${repo.name}`;
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
              ${ICONS.repo} Repo
            </a>
            ${hasPages ? `
            <a href="${pagesUrl}" target="_blank" rel="noopener" class="project-card__view">
              ${ICONS.demo} View Page
            </a>` : ""}
          </div>
        </article>
      `;
    }

    setRepoManager(manager) {
      this.repoManager = manager;
    }

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

      const updateUI = (index) => {
        dots.forEach((d, i) => d.classList.toggle("carousel__dot--active", i === index));
        
        const cur = document.getElementById("currentSlideNum");
        if (cur) cur.textContent = index + 1;
        
        const fill = document.getElementById("carProgressFill");
        if (fill) fill.style.width = `${((index + 1) / totalSlides) * 100}%`;
        
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
        updateUI(index);
      };

      prevBtn?.addEventListener("click", () => {
        goToSlide(Math.max(this.currentCarouselIndex - 1, 0));
        this._restartAutoplay();
      });

      nextBtn?.addEventListener("click", () => {
        goToSlide(Math.min(this.currentCarouselIndex + 1, totalSlides - 1));
        this._restartAutoplay();
      });

      // Scroll event listener with debounce
      let scrollTimeout;
      this.carouselTrack.addEventListener("scroll", () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          if (!slides.length) return;
          const slideWidth = slides[0].offsetWidth + 18;
          const newIndex = Math.round(this.carouselTrack.scrollLeft / slideWidth);
          if (newIndex !== this.currentCarouselIndex && newIndex >= 0 && newIndex < totalSlides) {
            this.currentCarouselIndex = newIndex;
            updateUI(this.currentCarouselIndex);
          }
        }, 50);
      });

      updateUI(0);
      this.goToCarouselSlide = goToSlide;
    }

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

      carousel.addEventListener("mouseenter", () => { this.isHovering = true; });
      carousel.addEventListener("mouseleave", () => { this.isHovering = false; });
      carousel.addEventListener("focusin", () => { this.isHovering = true; });
      carousel.addEventListener("focusout", () => { this.isHovering = false; });
    }

    setupSwipeSupport() {
      const track = this.carouselTrack;
      if (!track || track.dataset.swipeBound) return;
      track.dataset.swipeBound = "true";

      let startX = 0;
      let startY = 0;
      let isSwiping = false;

      track.addEventListener("touchstart", (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        isSwiping = true;
        this.isHovering = true;
      }, { passive: true });

      track.addEventListener("touchend", (e) => {
        if (!isSwiping) return;
        isSwiping = false;
        this.isHovering = false;

        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;
        const diffX = startX - endX;
        const diffY = startY - endY;

        if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
          if (diffX > 0) {
            this.goToCarouselSlide(Math.min(this.currentCarouselIndex + 1, this.totalCarouselSlides - 1));
          } else {
            this.goToCarouselSlide(Math.max(this.currentCarouselIndex - 1, 0));
          }
          this._restartAutoplay();
        }
      }, { passive: true });
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

      // Use DocumentFragment for better performance
      const fragment = document.createDocumentFragment();
      repos.forEach((repo) => {
        const temp = document.createElement("div");
        temp.innerHTML = this._createProjectCardHTML(repo);
        fragment.appendChild(temp.firstElementChild);
      });
      
      this.projectGrid.innerHTML = "";
      this.projectGrid.appendChild(fragment);
    }

    setupFilterTabs() {
      this.filterTabs.forEach((tab) => {
        tab.addEventListener("click", () => {
          this.filterTabs.forEach((t) => t.classList.remove("filter-tab--active"));
          tab.classList.add("filter-tab--active");
          const filter = tab.dataset.filter;
          this.renderProjects(filter);
          window.playSFX?.("menuSelect");
        });
      });
    }

    updateStats(repos) {
      const repoCount = document.getElementById("repoCount");
      const starCount = document.getElementById("starCount");
      
      if (repoCount) repoCount.textContent = repos.length;
      if (starCount) {
        const total = repos.reduce((sum, r) => sum + r.stargazers_count, 0);
        starCount.textContent = total;
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

    _setActiveView(route) {
      this.views.forEach((v) => v.classList.remove("view--active"));
      const target = document.getElementById(route);
      if (target) {
        target.classList.add("view--active");
        // Trigger entrance animations if needed
        target.querySelectorAll("[data-animate]").forEach((el) => {
          el.classList.add("animated");
        });
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
          this.navMenu?.classList.contains("navbar__menu--open")
        );
      });

      // Close menu on outside click
      document.addEventListener("click", (e) => {
        if (this.navMenu?.classList.contains("navbar__menu--open")) {
          if (!e.target.closest(".navbar")) {
            this.navMenu.classList.remove("navbar__menu--open");
            this.menuToggle?.setAttribute("aria-expanded", "false");
          }
        }
      });

      // Close menu on escape key
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && this.navMenu?.classList.contains("navbar__menu--open")) {
          this.navMenu.classList.remove("navbar__menu--open");
          this.menuToggle?.setAttribute("aria-expanded", "false");
          this.menuToggle?.focus();
        }
      });
    }

    setVNDialogue(vnSystem) { this.vnSystem = vnSystem; }
    setAudioManager(audioManager) { this.audioManager = audioManager; }
    setRepoManager(repoManager) { this.repoManager = repoManager; }
    setUIRenderer(uiRenderer) { this.uiRenderer = uiRenderer; }

    handleRouteParam() {
      const params = new URLSearchParams(window.location.search);
      const route = params.get("route");
      if (route) {
        setTimeout(() => this.navigate(route, true), 100);
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }

    navigate(route, skipDialogue = false) {
      if (!route || route === this.currentRoute) return;
      
      this._setActiveView(route);
      this._setActiveNav(route);
      this.currentRoute = route;

      this.navMenu?.classList.remove("navbar__menu--open");
      this.menuToggle?.setAttribute("aria-expanded", "false");
      
      window.scrollTo({ top: 0, behavior: "smooth" });

      if (route === "project") {
        this.loadProjects();
      }

      if (!skipDialogue && this.vnSystem && !this.vnSystem.isActive()) {
        setTimeout(() => this.vnSystem.open(route), 500);
      }

      // Update URL for sharing
      const url = new URL(window.location);
      url.searchParams.set("route", route);
      window.history.pushState({ route }, "", url);
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
          this.uiRenderer.projectGrid.innerHTML = 
            `<p style="color:var(--accent);text-align:center;">Gagal memuat: ${error.message}</p>`;
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
  // 8. PAGE LOADER
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

      // Fallback timeout
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
  // 9. PWA INSTALL HANDLER
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
        console.log("🍁 PWA installation prompt available");

        if (this.installBtn) {
          this.installBtn.style.display = "block";
          this.installBtn.addEventListener("click", () => this.install());
        }
      });

      window.addEventListener("appinstalled", () => {
        console.log("🍁 PWA installed successfully");
        if (this.installBtn) {
          this.installBtn.style.display = "none";
        }
        if (window.gtag) {
          gtag("event", "pwa_installed");
        }
      });
    }

    async install() {
      if (!this.deferredPrompt) return;

      this.deferredPrompt.prompt();
      const choiceResult = await this.deferredPrompt.userChoice;
      
      if (choiceResult.outcome === "accepted") {
        console.log("🍁 User accepted the install prompt");
      } else {
        console.log("🍁 User dismissed the install prompt");
      }
      
      this.deferredPrompt = null;
      if (this.installBtn) {
        this.installBtn.style.display = "none";
      }
    }
  }

  // ═══════════════════════════════════════════
  // 10. KONAMI CODE EASTER EGG
  // ═══════════════════════════════════════════
  class KonamiCode {
    constructor(callback) {
      this.code = [
        "ArrowUp", "ArrowUp",
        "ArrowDown", "ArrowDown",
        "ArrowLeft", "ArrowRight",
        "ArrowLeft", "ArrowRight",
        "b", "a"
      ];
      this.index = 0;
      this.callback = callback;
      this.boundHandler = this.handler.bind(this);
      document.addEventListener("keydown", this.boundHandler);
    }

    handler(e) {
      if (e.key === this.code[this.index]) {
        this.index++;
        if (this.index === this.code.length) {
          this.callback();
          this.index = 0;
        }
      } else {
        this.index = 0;
      }
    }

    destroy() {
      document.removeEventListener("keydown", this.boundHandler);
    }
  }

  // ═══════════════════════════════════════════
  // 11. INITIALIZATION
  // ═══════════════════════════════════════════
  const initializeApp = () => {
    // Set year
    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // Initialize page loader
    const pageLoader = new PageLoader();
    pageLoader.init();

    // Initialize core systems
    const audioManager = new AudioManager();
    const vnSystem = new VNDialogueSystem();
    const guideSystem = new GuideSystem();
    const repoManager = new RepositoryManager();
    const uiRenderer = new UIRenderer();
    const navigation = new NavigationSystem();
    const pwaHandler = new PWAHandler();

    // Wire up dependencies
    vnSystem.setAudioManager(audioManager);
    guideSystem.setVNDialogue(vnSystem);
    guideSystem.setAudioManager(audioManager);
    uiRenderer.setRepoManager(repoManager);
    navigation.setVNDialogue(vnSystem);
    navigation.setAudioManager(audioManager);
    navigation.setRepoManager(repoManager);
    navigation.setUIRenderer(uiRenderer);

    // Expose public API to window
    const publicAPI = {
      audioManager,
      vnSystem,
      guideSystem,
      repoManager,
      uiRenderer,
      navigation,
      playSFX: (type) => audioManager.playSFX(type),
      triggerVNDialogue: (route, customText) => vnSystem.open(route, customText),
      closeVNDialogue: () => vnSystem.close(),
      nextVNDialogue: () => vnSystem.next(),
      navigateTo: (route, skipDialogue) => navigation.navigate(route, skipDialogue),
      startGuide: () => guideSystem.start(),
      stopGuide: () => guideSystem.stop(),
      loadProjects: () => navigation.loadProjects(),
      refreshStats: async () => {
        try {
          await repoManager.fetchRepos();
          await repoManager.updateStatsWithQueue();
          audioManager.playSFX("questClear");
        } catch (error) {
          console.error("Refresh failed:", error);
        }
      },
    };

    Object.assign(window, publicAPI);

    // Initialize Konami Code
    new KonamiCode(() => {
      audioManager.playSFX("questClear");
      vnSystem.open("home", "🔥 KONAMI CODE ACTIVATED! Skill rahasia Maple: ATROCITY MODE! Semua defense jadi maksimal! 🛡️✨");
      console.log("🍁 Konami Code activated!");
    });

    // Load initial data
    setTimeout(async () => {
      try {
        // Render skeleton first
        uiRenderer.renderSkeleton(3);
        
        // Fetch data
        await repoManager.fetchRepos();
        
        // Render UI
        uiRenderer.renderCarousel(repoManager.repositories);
        uiRenderer.updateStats(repoManager.repositories);
        
        // Animate stats
        await repoManager.updateStatsWithQueue();
        
        // Load projects if needed
        if (navigation.getCurrentRoute() === "project") {
          uiRenderer.renderProjects("all");
          uiRenderer.setupFilterTabs();
        }
        
        // Play success sound
        audioManager.playSFX("questClear");
      } catch (error) {
        console.log("Initial data load:", error.message);
        // Show error state in carousel
        uiRenderer.renderError("Gagal memuat data dari GitHub.", () => {
          location.reload();
        });
        // Set fallback stats
        repoManager.setFallbackStats();
      }
    }, CONFIG.AUTO_LOAD_DELAY);

    // Navbar hover SFX
    document.querySelectorAll(".nav-link:not(.nav-link--cta)").forEach((link) => {
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

    // Keyboard shortcuts
    document.addEventListener("keydown", (e) => {
      // Alt+G for guide
      if (e.altKey && e.key === "g") {
        e.preventDefault();
        guideSystem.toggle();
      }
      // Alt+M for music toggle
      if (e.altKey && e.key === "m") {
        e.preventDefault();
        audioManager.toggle();
      }
    });

    console.log("🍁 Maple's Portfolio initialized!");
    console.log("🛡️ System ready. Try Konami Code: ↑↑↓↓←→←→BA");
    console.log("⌨️ Keyboard shortcuts: Alt+G (Guide), Alt+M (Music)");
  };

  // Start the application when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeApp);
  } else {
    initializeApp();
  }

})();