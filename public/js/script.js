// ═══════════════════════════════════════════
// PORTFOLIO SCRIPT - hayaxxdev-bit
// ENTERPRISE VERSION - TEMA MAPLE BOFURI
// ═══════════════════════════════════════════

(function() {
  'use strict';

  // ═══════════════════════════════════════════
  // CONFIGURATION
  // ═══════════════════════════════════════════
  const CONFIG = {
    USERNAME: 'hayaxxdev-bit',
    BGM_VOLUME: 0.5,
    SFX_VOLUME: 0.15,
    TYPING_SPEED_MIN: 25,
    TYPING_SPEED_MAX: 45,
    GUIDE_DELAY: 5000,
    AUTO_LOAD_DELAY: 800
  };

  // ═══════════════════════════════════════════
  // AUDIO MANAGER (Singleton)
  // ═══════════════════════════════════════════
  class AudioManager {
    constructor() {
      if (AudioManager.instance) {
        return AudioManager.instance;
      }
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
        { name: '🎵 Lo-Fi Anime Beats', url: './public/music/Clarity-phonk.wav' },
        { name: '🎵 Maple\'s Defense', url: './public/music/maple-theme.mp3' },
        { name: '🎵 Adventure Time', url: './public/music/adventure.mp3' }
      ];

      this.uiElements = {
        toggle: document.getElementById('bgmToggle'),
        next: document.getElementById('bgmNext'),
        label: document.getElementById('bgmLabel'),
        volumeFill: document.querySelector('.bgm-volume-fill')
      };

      this.bindEvents();
    }

    bindEvents() {
      this.uiElements.toggle?.addEventListener('click', () => this.toggle());
      this.uiElements.next?.addEventListener('click', () => {
        this.playSFX('menuSelect');
        this.next();
      });
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
        console.warn('Audio initialization failed:', error);
      }

      return this;
    }

    ensureContext() {
      if (!this.isInitialized) this.init();
      if (this.context?.state === 'suspended') {
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
        console.warn('Failed to load track:', error.message);
        this.isPlaying = false;
        this.updateUI();
      }
    }

    stopTrack() {
      if (this.currentSource) {
        try {
          this.currentSource.stop();
          this.currentSource.disconnect();
        } catch (e) { /* ignore */ }
        this.currentSource = null;
      }
      this.isPlaying = false;
      this.updateUI();
    }

    toggle() {
      if (!this.ensureContext()) return;

      if (this.isPlaying) {
        this.stopTrack();
        this.playSFX('close');
      } else {
        this.playTrack(this.currentTrackIndex);
        this.playSFX('menuSelect');
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

    // ─── SFX System ───
    playSFX(type) {
      if (!this.ensureContext()) return;
      const now = this.context.currentTime;

      const sfxMap = {
        menuSelect: () => {
          const osc = this.context.createOscillator();
          const gain = this.context.createGain();
          osc.type = 'square';
          osc.frequency.setValueAtTime(880, now);
          osc.frequency.setValueAtTime(1174.66, now + 0.06);
          gain.gain.setValueAtTime(0.08, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
          osc.connect(gain);
          gain.connect(this.sfxGain);
          osc.start(now);
          osc.stop(now + 0.12);
        },

        questClear: () => {
          const notes = [523.25, 659.25, 783.99, 1046.5];
          notes.forEach((freq, i) => {
            const osc = this.context.createOscillator();
            const gain = this.context.createGain();
            osc.type = 'triangle';
            osc.frequency.value = freq;
            const start = now + i * 0.1;
            gain.gain.setValueAtTime(0.1, start);
            gain.gain.exponentialRampToValueAtTime(0.001, start + 0.25);
            osc.connect(gain);
            gain.connect(this.sfxGain);
            osc.start(start);
            osc.stop(start + 0.28);
          });
        },

        close: () => {
          const osc = this.context.createOscillator();
          const gain = this.context.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(600, now);
          osc.frequency.exponentialRampToValueAtTime(150, now + 0.2);
          gain.gain.setValueAtTime(0.06, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
          osc.connect(gain);
          gain.connect(this.sfxGain);
          osc.start(now);
          osc.stop(now + 0.22);
        },

        dialogue: () => {
          const osc = this.context.createOscillator();
          const gain = this.context.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(440, now);
          osc.frequency.exponentialRampToValueAtTime(660, now + 0.08);
          gain.gain.setValueAtTime(0.04, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
          osc.connect(gain);
          gain.connect(this.sfxGain);
          osc.start(now);
          osc.stop(now + 0.12);
        },

        guideStart: () => {
          const notes = [523.25, 659.25, 783.99];
          notes.forEach((freq, i) => {
            const osc = this.context.createOscillator();
            const gain = this.context.createGain();
            osc.type = 'sine';
            osc.frequency.value = freq;
            const start = now + i * 0.08;
            gain.gain.setValueAtTime(0.06, start);
            gain.gain.exponentialRampToValueAtTime(0.001, start + 0.15);
            osc.connect(gain);
            gain.connect(this.sfxGain);
            osc.start(start);
            osc.stop(start + 0.18);
          });
        },

        konami: () => {
          const notes = [523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5];
          notes.forEach((freq, i) => {
            const osc = this.context.createOscillator();
            const gain = this.context.createGain();
            osc.type = 'sine';
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
      };

      const sfx = sfxMap[type];
      if (sfx) sfx();
    }

    // ─── UI Update ───
    updateUI() {
      const toggle = this.uiElements.toggle;
      const label = this.uiElements.label;

      if (toggle) {
        toggle.classList.toggle('bgm-toggle--playing', this.isPlaying);
        const svg = toggle.querySelector('svg');
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

    // ─── Cleanup ───
    destroy() {
      this.stopTrack();
      if (this.context) {
        try { this.context.close(); } catch (e) { /* ignore */ }
        this.context = null;
      }
      this.isInitialized = false;
    }
  }

  // ═══════════════════════════════════════════
  // VN DIALOGUE SYSTEM
  // ═══════════════════════════════════════════
  class VNDialogueSystem {
    constructor() {
      this.container = document.getElementById('vnContainer');
      this.messageEl = document.getElementById('vnMessage');
      this.nextBtn = document.getElementById('vnNext');
      this.closeBtn = document.getElementById('vnClose');
      this.nameEl = document.querySelector('.vn-name');
      this.avatarImg = document.querySelector('.vn-avatar-img');

      this.audioManager = null;
      this.currentRoute = 'home';
      this.isTyping = false;
      this.typeTimer = null;
      this.dialogueIndex = 0;
      this.isOpen = false;

      this.dialogues = {
        home: [
          { speaker: '🍁 Maple', text: 'Ehehe.. Halo! Namaku Kaede, di game panggil aku Maple ya! Selamat datang di guild-ku~ ✨' },
          { speaker: '🍁 Maple', text: 'Wah, kamu datang berkunjung? Jangan khawatir, selama ada aku, tidak ada serangan yang bisa menembus tempat ini! 🛡️' },
          { speaker: '🍁 Maple', text: 'Eh? Tempatnya berantakan? U-uhm, aku ketiduran saat nge-farm material tadi... Maaf ya.. 💦' },
          { speaker: '🐢 Syrup', text: '... (Syrup mendengkur pelan di sudut ruangan)' },
          { speaker: '🍁 Maple', text: 'Syrup, ayo sapa tamu kita! ...Eh, Syrup lagi tidur ya? Ya sudah deh. 🐢' },
          { speaker: '🍁 Maple', text: 'Siapapun yang berani mengacau di sini, akan ku-Devour! Nyam nyam! 💢' },
          { speaker: '🍁 Maple', text: 'Katanya di sini banyak monster enak... Eh, kamu bukan monster kan? Hehe, bercanda! 😋' }
        ],
        maple: [
          { speaker: '📖 Guild Master', text: 'Ah, kamu penasaran dengan Maple? Iya, itu dia, gadis polos yang jadi monster tak terkalahkan!' },
          { speaker: '📖 Guild Master', text: 'Bayangin, semua stat point-nya dimasukin ke VIT. FULL DEFENSE! 🛡️' },
          { speaker: '📖 Guild Master', text: 'Gara-gara build aneh itu, dia bisa dapetin skill kayak Absolute Defense, Machine God, bahkan jadi boss raid sendiri.' },
          { speaker: '📖 Guild Master', text: 'Developer gamenya sampe pusing ngadepin dia! 😂' },
          { speaker: '📖 Guild Master', text: 'Yang paling kocak sih skill "Atrocity". Maple berubah jadi monster raksasa serem...' },
          { speaker: '📖 Guild Master', text: '...tapi suaranya tetep imut kaya anak kecil. Musuh-musuhnya trauma semua! 👹' },
          { speaker: '🍁 Maple', text: 'Maple juga punya pet kura-kura bernama Syrup yang bisa terbang! Imut banget kan? 🐢✨' }
        ],
        project: [
          { speaker: '🎮 Maple', text: 'Ini adalah semua loot dan quest yang berhasil kuselesaikan! Lumayan kan buat pamer ke Sally? 😎' },
          { speaker: '🎮 Maple', text: 'Setiap proyek punya rarity lho: SSR (Legendary), SR (Rare), atau R (Common).' },
          { speaker: '🎮 Maple', text: 'Pasti defense-nya tinggi-tinggi! 🛡️' },
          { speaker: '🎮 Maple', text: 'Pro tip: Klik filter tab untuk sortir item-item ini.' },
          { speaker: '🍁 Maple', text: 'Aku sih milih yang paling enak dimakan! 🤤' },
          { speaker: '🎮 Maple', text: 'Wah, banyak banget! Aku jadi bingung mau pakai skill yang mana...' },
          { speaker: '⚡ Maple', text: 'Machine God aja kali ya? 💥' }
        ],
        about: [
          { speaker: '🛡️ Maple', text: 'Tentang aku? Hmm... Aku cuma player biasa yang masukin semua status point ke VIT!' },
          { speaker: '🛡️ Maple', text: 'Defense is the best! 🛡️✨' },
          { speaker: '🛡️ Maple', text: 'Spesialisasi aku itu jadi tameng berjalan! Semua serangan pasti ku-block dengan Absolute Defense!' },
          { speaker: '🍖 Maple', text: 'Kadang aku dibilang aneh karena suka makan monster... Padahal rasanya enak loh! Mau coba? 🍖' },
          { speaker: '💕 Maple', text: 'Kalau nggak lagi main game, aku biasa main sama Sally. Temanku yang paling hebat! 💕' }
        ],
        contact: [
          { speaker: '📨 Maple', text: 'Kirimkan pesan cepat, sebelum aku dipanggil party buat raid boss! 💌' },
          { speaker: '🛡️ Maple', text: 'Bisa hubungi lewat email atau GitHub. Tenang aja, semua pesanmu aman di bawah perlindungan Aegis-ku!' },
          { speaker: '🐌 Maple', text: 'Aku terbuka untuk kolaborasi party, asal jangan ajak lawan boss yang geraknya cepet ya... Aku kan jalannya lambat 🐌' },
          { speaker: '🔥 Maple', text: 'Fun fact: Kalau kamu pencet kombinasi tombol legendaris Konami Code, aku bakal keluarin skill rahasia! 🔥' }
        ]
      };

      this.bindEvents();
    }

    bindEvents() {
      this.nextBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        this.next();
      });

      this.closeBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        this.close();
      });

      this.container?.addEventListener('click', (e) => {
        if (e.target === this.container || e.target.closest('.vn-textbox')) {
          this.next();
        }
      });

      // Keyboard Support
      document.addEventListener('keydown', (e) => {
        if (!this.isOpen) return;
        
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.next();
        }
        if (e.key === 'Escape') {
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
      
      this.container?.classList.add('vn-container--active');
      this.audioManager?.playSFX('dialogue');

      if (customText) {
        this.typeText({ speaker: '🍁 Maple', text: customText });
      } else {
        const dialogues = this.dialogues[route];
        if (!dialogues?.length) {
          this.typeText({ speaker: '🍁 Maple', text: 'Hmm? Ada apa ya? 🤔' });
          return;
        }
        const randomIndex = Math.floor(Math.random() * dialogues.length);
        this.typeText(dialogues[randomIndex]);
      }
    }

    typeText(dialogue) {
      if (this.typeTimer) {
        clearTimeout(this.typeTimer);
        this.typeTimer = null;
      }

      this.isTyping = true;
      
      if (this.nameEl) {
        this.nameEl.innerHTML = dialogue.speaker + ' <span class="vn-badge">Guild Member</span>';
      }

      if (!this.messageEl) return;

      this.messageEl.textContent = '';
      const text = dialogue.text;
      let charIndex = 0;
      const speed = CONFIG.TYPING_SPEED_MIN + Math.random() * (CONFIG.TYPING_SPEED_MAX - CONFIG.TYPING_SPEED_MIN);

      const type = () => {
        if (charIndex < text.length) {
          this.messageEl.textContent += text.charAt(charIndex);
          charIndex++;
          this.typeTimer = setTimeout(type, speed);
        } else {
          this.isTyping = false;
          // Add cursor blink end
          this.messageEl.innerHTML = this.messageEl.textContent + '<span class="typing-cursor"></span>';
          setTimeout(() => {
            if (this.messageEl) {
              this.messageEl.innerHTML = this.messageEl.textContent.replace('<span class="typing-cursor"></span>', '');
            }
          }, 800);
        }
      };

      type();
    }

    next() {
      if (this.isTyping) {
        // Skip typing - complete immediately
        if (this.typeTimer) {
          clearTimeout(this.typeTimer);
          this.typeTimer = null;
        }
        this.isTyping = false;
        if (this.messageEl) {
          const fullText = this.messageEl.textContent;
          this.messageEl.innerHTML = fullText;
          this.audioManager?.playSFX('menuSelect');
        }
        return;
      }

      // Show next dialogue
      const dialogues = this.dialogues[this.currentRoute];
      if (!dialogues?.length) {
        this.close();
        return;
      }

      const currentText = this.messageEl?.textContent || '';
      const currentIndex = dialogues.findIndex(d => d.text === currentText);
      const nextIndex = (currentIndex + 1) % dialogues.length;
      
      this.audioManager?.playSFX('dialogue');
      this.typeText(dialogues[nextIndex]);
    }

    close() {
      if (this.typeTimer) {
        clearTimeout(this.typeTimer);
        this.typeTimer = null;
      }
      this.isTyping = false;
      this.isOpen = false;
      this.container?.classList.remove('vn-container--active');
      this.audioManager?.playSFX('close');
    }

    isActive() {
      return this.isOpen;
    }
  }

  // ═══════════════════════════════════════════
  // GUIDE SYSTEM
  // ═══════════════════════════════════════════
  class GuideSystem {
    constructor() {
      this.button = document.getElementById('guideModeBtn');
      this.indicator = document.getElementById('guideIndicator');
      this.vnSystem = null;
      this.audioManager = null;
      this.isActive = false;
      this.currentStep = 0;
      this.isRunning = false;

      this.steps = [
        { route: 'home', message: 'Ehehe, ayo aku pandu keliling guild-ku! Kita mulai dari sini, ini halaman utamaku. Ada banyak info keren loh! ✨' },
        { route: 'maple', message: 'Sekarang kita ke Maple\'s Vault! Di sini aku tunjukin semua skill dan equipment legendari-ku! 🛡️' },
        { route: 'project', message: 'Nah, sekarang kita ke gudang loot! Ini semua hasil karyaku selama main game... eh, maksudku ngoding! 😎' },
        { route: 'about', message: 'Sekarang ke halaman tentang aku! Di sini kamu bisa lihat skill dan tech stack yang kupakai. 📋' },
        { route: 'contact', message: 'Akhirnya kita sampai di halaman kontak! Kalau kamu mau party bareng atau kirim quest, bisa lewat sini ya! 💌' },
        { route: 'home', message: 'Nah, tur guild-ku udah selesai! Sekarang kita balik ke beranda lagi. Dadah~ 👋🍁' }
      ];

      this.bindEvents();
    }

    bindEvents() {
      this.button?.addEventListener('click', () => this.toggle());
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

      this.button?.classList.add('guide-mode-btn--active');
      this.indicator?.classList.add('guide-indicator--active');
      this.audioManager?.playSFX('guideStart');

      try {
        for (let i = 0; i < this.steps.length; i++) {
          if (!this.isActive) break;
          this.currentStep = i;
          const step = this.steps[i];

          // Update indicator
          this.updateIndicator(i);

          // Navigate
          window.navigateTo(step.route, true);

          // Show dialogue
          this.vnSystem?.open(step.route, step.message);

          // Wait for delay
          await this.sleep(CONFIG.GUIDE_DELAY);

          // Close dialogue for next step
          this.vnSystem?.close();
          await this.sleep(300);
        }
      } catch (e) {
        console.log('Guide interrupted:', e);
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
      this.button?.classList.remove('guide-mode-btn--active');
      this.indicator?.classList.remove('guide-indicator--active');
      this.vnSystem?.close();
      this.audioManager?.playSFX('close');
    }

    updateIndicator(step) {
      const indicator = this.indicator;
      if (!indicator) return;

      // Update progress dots
      let dotsHTML = '';
      const totalDots = this.steps.length;
      for (let i = 0; i < totalDots; i++) {
        let cls = 'dot';
        if (i < step) cls += ' completed';
        if (i === step) cls += ' active';
        dotsHTML += `<span class="${cls}"></span>`;
      }

      const progressEl = indicator.querySelector('.guide-progress');
      if (progressEl) {
        progressEl.innerHTML = dotsHTML;
      }
    }

    sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
  }

  // ═══════════════════════════════════════════
  // REPOSITORY MANAGER
  // ═══════════════════════════════════════════
  class RepositoryManager {
    constructor() {
      this.username = CONFIG.USERNAME;
      this.repositories = [];
      this.isLoaded = false;
      this.filter = 'all';
    }

    async fetchRepos() {
      try {
        const response = await fetch(
          `https://api.github.com/users/${this.username}/repos?sort=updated&per_page=30`
        );
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        this.repositories = await response.json();
        this.isLoaded = true;
        return this.repositories;
      } catch (error) {
        console.error('GitHub fetch failed:', error);
        throw error;
      }
    }

    categorizeRepo(repo) {
      const combined = [
        repo.name,
        repo.description || '',
        repo.language || '',
        ...(repo.topics || [])
      ].join(' ').toLowerCase();

      if (combined.includes('game') || combined.includes('unity') || combined.includes('godot')) return 'game';
      if (combined.includes('design') || combined.includes('figma') || combined.includes('ui') || combined.includes('art')) return 'design';
      if (repo.language && ['html', 'css', 'javascript', 'typescript', 'jsx', 'tsx', 'vue', 'react'].includes(repo.language.toLowerCase())) return 'web';
      if (repo.homepage || repo.has_pages) return 'web';
      return 'other';
    }

    getFilteredRepos(filter) {
      if (filter === 'all') return this.repositories;
      return this.repositories.filter(r => this.categorizeRepo(r) === filter);
    }

    getTotalStars() {
      return this.repositories.reduce((sum, r) => sum + r.stargazers_count, 0);
    }
  }

  // ═══════════════════════════════════════════
  // UI RENDERER
  // ═══════════════════════════════════════════
  class UIRenderer {
    constructor() {
      this.repoManager = null;
      this.carouselTrack = document.getElementById('carTrack');
      this.carouselDots = document.getElementById('carDots');
      this.projectGrid = document.getElementById('projectGrid');
      this.projectLoader = document.getElementById('projectLoader');
      this.projectEmpty = document.getElementById('projectEmpty');
      this.filterTabs = document.querySelectorAll('#filterTabs .filter-tab');
      this.repoCount = document.getElementById('repoCount');
      this.starCount = document.getElementById('starCount');
    }

    setRepoManager(manager) {
      this.repoManager = manager;
    }

    renderCarousel(repos) {
      if (!this.carouselTrack || !this.carouselDots) return;

      const slides = repos.slice(0, 6);
      this.carouselTrack.innerHTML = '';
      this.carouselDots.innerHTML = '';

      slides.forEach((repo, i) => {
        const slide = document.createElement('div');
        slide.className = 'carousel__slide';
        slide.innerHTML = `
          <h4 class="slide__title">${repo.name}</h4>
          <p class="slide__desc">${repo.description || 'Tidak ada deskripsi.'}</p>
          <div class="slide__tags">
            ${repo.language ? `<span class="slide__tag">${repo.language}</span>` : ''}
            <span class="slide__tag">⭐ ${repo.stargazers_count}</span>
            <span class="slide__tag">🔄 ${new Date(repo.updated_at).toLocaleDateString('id-ID')}</span>
          </div>
        `;
        this.carouselTrack.appendChild(slide);

        const dot = document.createElement('div');
        dot.className = 'carousel__dot';
        if (i === 0) dot.classList.add('carousel__dot--active');
        dot.addEventListener('click', () => this.goToCarouselSlide(i));
        this.carouselDots.appendChild(dot);
      });

      this.setupCarouselNavigation(slides.length);
    }

    setupCarouselNavigation(totalSlides) {
      const prevBtn = document.getElementById('carPrev');
      const nextBtn = document.getElementById('carNext');
      let currentIndex = 0;
      const slides = this.carouselTrack.querySelectorAll('.carousel__slide');
      const dots = this.carouselDots.querySelectorAll('.carousel__dot');

      const updateDots = (index) => {
        dots.forEach((d, i) => d.classList.toggle('carousel__dot--active', i === index));
      };

      const goToSlide = (index) => {
        if (!slides.length) return;
        const slideWidth = slides[0].offsetWidth + 16;
        this.carouselTrack.scrollTo({ left: index * slideWidth, behavior: 'smooth' });
        currentIndex = index;
        updateDots(index);
      };

      prevBtn?.addEventListener('click', () => {
        currentIndex = Math.max(currentIndex - 1, 0);
        goToSlide(currentIndex);
      });

      nextBtn?.addEventListener('click', () => {
        currentIndex = Math.min(currentIndex + 1, totalSlides - 1);
        goToSlide(currentIndex);
      });

      this.carouselTrack.addEventListener('scroll', () => {
        if (!slides.length) return;
        const slideWidth = slides[0].offsetWidth + 16;
        const newIndex = Math.round(this.carouselTrack.scrollLeft / slideWidth);
        if (newIndex !== currentIndex && newIndex >= 0 && newIndex < totalSlides) {
          currentIndex = newIndex;
          updateDots(currentIndex);
        }
      });

      // Make goToSlide accessible
      this.goToCarouselSlide = goToSlide;
    }

    renderProjects(filter = 'all') {
      if (!this.projectGrid || !this.repoManager) return;

      const repos = this.repoManager.getFilteredRepos(filter);
      
      if (!repos.length) {
        this.projectGrid.innerHTML = '';
        if (this.projectEmpty) this.projectEmpty.style.display = 'block';
        return;
      }
      if (this.projectEmpty) this.projectEmpty.style.display = 'none';

      this.projectGrid.innerHTML = repos.map(repo => {
        const created = new Date(repo.created_at);
        const updated = new Date(repo.updated_at);
        const dateStr = created.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
        const hasPages = repo.has_pages || repo.homepage;
        const pagesUrl = repo.homepage || `https://${this.repoManager.username}.github.io/${repo.name}`;
        const category = this.repoManager.categorizeRepo(repo);
        const categoryLabel = {
          web: '🌐 Web',
          game: '🎮 Game',
          design: '🎨 Design',
          other: '📦 Lainnya'
        }[category] || '📦 Lainnya';

        return `
          <article class="project-card">
            <h3 class="project-card__title">${repo.name}</h3>
            <p class="project-card__desc">${repo.description || 'Tidak ada deskripsi.'}</p>
            <span class="project-card__date">📅 Dibuat: ${dateStr} | Diperbarui: ${updated.toLocaleDateString('id-ID')}</span>
            <div class="project-card__meta">
              ${repo.language ? `<span class="project-card__tag">${repo.language}</span>` : ''}
              <span class="project-card__tag">⭐ ${repo.stargazers_count}</span>
              <span class="project-card__tag">${categoryLabel}</span>
            </div>
            <div class="project-card__actions">
              <a href="${repo.html_url}" target="_blank" rel="noopener" class="project-card__link">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                Repo
              </a>
              ${hasPages ? `
                <a href="${pagesUrl}" target="_blank" rel="noopener" class="project-card__view">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                  View Page
                </a>` : ''}
            </div>
          </article>
        `;
      }).join('');
    }

    setupFilterTabs() {
      this.filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
          this.filterTabs.forEach(t => t.classList.remove('filter-tab--active'));
          tab.classList.add('filter-tab--active');
          const filter = tab.dataset.filter;
          this.renderProjects(filter);
          window.playSFX?.('menuSelect');
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
        this.projectLoader.style.display = show ? 'flex' : 'none';
      }
    }
  }

  // ═══════════════════════════════════════════
  // NAVIGATION SYSTEM
  // ═══════════════════════════════════════════
  class NavigationSystem {
    constructor() {
      this.views = document.querySelectorAll('.view');
      this.navLinks = document.querySelectorAll('[data-route]');
      this.menuToggle = document.getElementById('menuToggle');
      this.navMenu = document.getElementById('navMenu');
      this.currentRoute = 'home';
      this.vnSystem = null;
      this.audioManager = null;
      this.repoManager = null;
      this.uiRenderer = null;

      this.bindEvents();
      this.handleRouteParam();
    }

    bindEvents() {
      // Navigation clicks
      this.navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          const route = link.dataset.route;
          this.navigate(route);
        });
      });

      // Menu toggle
      this.menuToggle?.addEventListener('click', () => {
        this.navMenu?.classList.toggle('navbar__menu--open');
      });

      // Close menu on outside click
      document.addEventListener('click', (e) => {
        if (this.navMenu?.classList.contains('navbar__menu--open')) {
          if (!e.target.closest('.navbar')) {
            this.navMenu.classList.remove('navbar__menu--open');
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
      const route = params.get('route');
      if (route) {
        setTimeout(() => this.navigate(route, true), 100);
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }

    navigate(route, skipDialogue = false) {
      // Update views
      this.views.forEach(v => v.classList.remove('view--active'));
      const target = document.getElementById(route);
      if (target) target.classList.add('view--active');

      // Update nav links
      this.navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.dataset.route === route) link.classList.add('active');
      });

      this.currentRoute = route;

      // Close mobile menu
      this.navMenu?.classList.remove('navbar__menu--open');

      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Load projects if needed
      if (route === 'project') {
        this.loadProjects();
      }

      // Trigger VN dialogue
      if (!skipDialogue && this.vnSystem && !this.vnSystem.isActive()) {
        setTimeout(() => this.vnSystem.open(route), 500);
      }
    }

    async loadProjects() {
      if (!this.repoManager || !this.uiRenderer) return;
      if (this.repoManager.isLoaded) {
        this.uiRenderer.renderProjects('all');
        return;
      }

      this.uiRenderer.showLoader(true);
      try {
        await this.repoManager.fetchRepos();
        this.uiRenderer.renderCarousel(this.repoManager.repositories);
        this.uiRenderer.renderProjects('all');
        this.uiRenderer.setupFilterTabs();
        this.uiRenderer.updateStats(this.repoManager.repositories);
        window.playSFX?.('questClear');
      } catch (error) {
        console.error('Failed to load projects:', error);
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
  // KONAMI CODE EASTER EGG
  // ═══════════════════════════════════════════
  class KonamiCode {
    constructor() {
      this.code = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
      this.index = 0;
      this.audioManager = null;
      this.repoManager = null;
      this.overlay = document.getElementById('secretOverlay');
      this.closeBtn = document.getElementById('secretClose');
      this.projectEl = document.getElementById('secretProject');

      this.bindEvents();
    }

    setAudioManager(audioManager) {
      this.audioManager = audioManager;
    }

    setRepoManager(repoManager) {
      this.repoManager = repoManager;
    }

    bindEvents() {
      document.addEventListener('keydown', (e) => {
        if (e.code === this.code[this.index]) {
          this.index++;
          if (this.index === this.code.length) {
            this.activate();
            this.index = 0;
          }
        } else {
          this.index = 0;
        }
      });

      this.closeBtn?.addEventListener('click', () => {
        this.deactivate();
      });

      this.overlay?.addEventListener('click', (e) => {
        if (e.target === this.overlay) {
          this.deactivate();
        }
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.overlay?.classList.contains('secret-overlay--active')) {
          this.deactivate();
        }
      });
    }

    activate() {
      if (!this.overlay) return;

      // Show random repo
      if (this.repoManager?.repositories?.length) {
        const repos = this.repoManager.repositories;
        const randomRepo = repos[Math.floor(Math.random() * repos.length)];
        if (this.projectEl) {
          this.projectEl.innerHTML = `
            <div style="background:var(--bg-card);padding:20px;border-radius:var(--radius);border:1px solid var(--accent-gold);">
              <h3 style="color:var(--accent-gold);">🌟 ${randomRepo.name}</h3>
              <p style="color:var(--text-secondary);">${randomRepo.description || 'Project rahasia!'}</p>
              <p style="color:var(--accent);">⭐ ${randomRepo.stargazers_count} stars</p>
              <a href="${randomRepo.html_url}" target="_blank" style="color:var(--accent-gold);text-decoration:none;border:1px solid var(--accent-gold);padding:4px 12px;border-radius:4px;display:inline-block;margin-top:8px;">Lihat Repo →</a>
            </div>
          `;
        }
      }

      this.overlay.classList.add('secret-overlay--active');
      document.body.classList.add('screen-shake');
      this.audioManager?.playSFX('konami');
      
      setTimeout(() => {
        document.body.classList.remove('screen-shake');
      }, 500);
    }

    deactivate() {
      this.overlay?.classList.remove('secret-overlay--active');
      this.audioManager?.playSFX('close');
    }
  }

  // ═══════════════════════════════════════════
  // INITIALIZATION
  // ═══════════════════════════════════════════
  document.addEventListener('DOMContentLoaded', () => {
    // Set year
    document.getElementById('year').textContent = new Date().getFullYear();

    // Initialize Audio Manager
    const audioManager = new AudioManager();

    // Initialize VN Dialogue System
    const vnSystem = new VNDialogueSystem();
    vnSystem.setAudioManager(audioManager);

    // Initialize Guide System
    const guideSystem = new GuideSystem();
    guideSystem.setVNDialogue(vnSystem);
    guideSystem.setAudioManager(audioManager);

    // Initialize Repository Manager
    const repoManager = new RepositoryManager();

    // Initialize UI Renderer
    const uiRenderer = new UIRenderer();
    uiRenderer.setRepoManager(repoManager);

    // Initialize Navigation System
    const navigation = new NavigationSystem();
    navigation.setVNDialogue(vnSystem);
    navigation.setAudioManager(audioManager);
    navigation.setRepoManager(repoManager);
    navigation.setUIRenderer(uiRenderer);

    // Initialize Konami Code
    const konami = new KonamiCode();
    konami.setAudioManager(audioManager);
    konami.setRepoManager(repoManager);

    // ─── Expose to Global ───
    window.audioManager = audioManager;
    window.vnSystem = vnSystem;
    window.guideSystem = guideSystem;
    window.repoManager = repoManager;
    window.uiRenderer = uiRenderer;
    window.navigation = navigation;
    window.konami = konami;

    // ─── Global Functions (for inline usage) ───
    window.playSFX = (type) => audioManager.playSFX(type);
    window.triggerVNDialogue = (route, customText) => vnSystem.open(route, customText);
    window.closeVNDialogue = () => vnSystem.close();
    window.nextVNDialogue = () => vnSystem.next();
    window.navigateTo = (route, skipDialogue) => navigation.navigate(route, skipDialogue);
    window.startGuide = () => guideSystem.start();
    window.stopGuide = () => guideSystem.stop();
    window.loadProjects = () => navigation.loadProjects();

    // ─── Auto-load initial data ───
    setTimeout(async () => {
      try {
        await repoManager.fetchRepos();
        uiRenderer.renderCarousel(repoManager.repositories);
        uiRenderer.updateStats(repoManager.repositories);
        
        // If project view is active, render projects
        if (navigation.getCurrentRoute() === 'project') {
          uiRenderer.renderProjects('all');
          uiRenderer.setupFilterTabs();
        }
      } catch (error) {
        console.log('Initial data load:', error.message);
      }
    }, CONFIG.AUTO_LOAD_DELAY);

    // ─── Navbar hover SFX ───
    document.querySelectorAll('.nav-link:not(.nav-link--cta)').forEach(link => {
      link.addEventListener('mouseenter', () => {
        if (!link.classList.contains('active')) {
          audioManager.playSFX('menuSelect');
        }
      });
    });

    // ─── BGM Volume Control ───
    const bgmPlayer = document.querySelector('.bgm-player');
    if (bgmPlayer) {
      // Add wheel event for volume
      bgmPlayer.addEventListener('wheel', (e) => {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.05 : 0.05;
        const newVolume = Math.max(0, Math.min(1, audioManager.volume + delta));
        audioManager.setVolume(newVolume);
      });

      // Double click to reset volume
      bgmPlayer.addEventListener('dblclick', () => {
        audioManager.setVolume(0.5);
      });
    }

    console.log('🍁 Maple\'s Portfolio initialized!');
    console.log('🛡️ System ready. Konami Code: ↑↑↓↓←→←→BA');
  });

})();