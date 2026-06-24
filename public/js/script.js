// ═══════════════════════════════════════════
// PORTFOLIO SCRIPT - hayaxxdev-bit
// TEMA MAPLE - BOFURI
// FITUR: Maple's Guide Tour, VN Dialogue, BGM/SFX, Konami Code
// ═══════════════════════════════════════════

document.addEventListener("DOMContentLoaded", () => {
  // ═══════════════════════════════════════════
  // INISIALISASI DASAR
  // ═══════════════════════════════════════════
  document.getElementById("year").textContent = new Date().getFullYear();
  const USERNAME = "hayaxxdev-bit";
  let allRepos = [];

  // ═══════════════════════════════════════════
  // VN DIALOGUES (TEMA MAPLE - BOFURI)
  // ═══════════════════════════════════════════
  const vnDialogues = {
    home: [
      "Ehehe.. Halo! Namaku Kaede, di game panggil aku Maple ya! Selamat datang di guild-ku~ ✨",
      "Wah, kamu datang berkunjung? Jangan khawatir, selama ada aku, tidak ada serangan yang bisa menembus tempat ini! 🛡️",
      "Eh? Tempatnya berantakan? U-uhm, aku ketiduran saat nge-farm material tadi... Maaf ya.. 💦",
      "Syrup, ayo sapa tamu kita! ...Eh, Syrup lagi tidur ya? Ya sudah deh. 🐢",
      "Siapapun yang berani mengacau di sini, akan ku-Devour! Nyam nyam! 💢",
      "Katanya di sini banyak monster enak... Eh, kamu bukan monster kan? Hehe, bercanda! 😋"
    ],
    maple: [
      "Ah, kamu penasaran dengan Maple? Iya, itu dia, gadis polos yang jadi monster tak terkalahkan! Bayangin, semua stat point-nya dimasukin ke VIT. FULL DEFENSE! 🛡️",
      "Gara-gara build aneh itu, dia bisa dapetin skill kayak Absolute Defense, Machine God, bahkan jadi boss raid sendiri. Developer gamenya sampe pusing ngadepin dia! 😂",
      "Yang paling kocak sih skill 'Atrocity'. Maple berubah jadi monster raksasa serem... tapi suaranya tetep imut kaya anak kecil. Musuh-musuhnya trauma semua! 👹",
      "Maple juga punya pet kura-kura bernama Syrup yang bisa terbang! Imut banget kan? Kadang aku naik di atasnya buat jalan-jalan~ 🐢✨"
    ],
    project: [
      "Ini adalah semua loot dan quest yang berhasil kuselesaikan! Lumayan kan buat pamer ke Sally? 😎",
      "Setiap proyek punya rarity lho: SSR (Legendary), SR (Rare), atau R (Common). Pasti defense-nya tinggi-tinggi!",
      "Pro tip: Klik filter tab untuk sortir item-item ini. Aku sih milih yang paling enak dimakan! 🤤",
      "Wah, banyak banget! Aku jadi bingung mau pakai skill yang mana... Machine God aja kali ya? 💥"
    ],
    about: [
      "Tentang aku? Hmm... Aku cuma player biasa yang masukin semua status point ke VIT! Defense is the best! 🛡️✨",
      "Spesialisasi aku itu jadi tameng berjalan! Semua serangan pasti ku-block dengan Absolute Defense!",
      "Kadang aku dibilang aneh karena suka makan monster... Padahal rasanya enak loh! Mau coba? 🍖",
      "Kalau nggak lagi main game, aku biasa main sama Sally. Temanku yang paling hebat! 💕"
    ],
    contact: [
      "Kirimkan pesan cepat, sebelum aku dipanggil party buat raid boss! 💌",
      "Bisa hubungi lewat email atau GitHub. Tenang aja, semua pesanmu aman di bawah perlindungan Aegis-ku! 🛡️",
      "Aku terbuka untuk kolaborasi party, asal jangan ajak lawan boss yang geraknya cepet ya... Aku kan jalannya lambat 🐌",
      "Fun fact: Kalau kamu pencet kombinasi tombol legendaris Konami Code, aku bakal keluarin skill rahasia! 🔥"
    ]
  };

  // ═══════════════════════════════════════════
  // WEB AUDIO API - SFX & BGM (MULTI-TRACK)
  // ═══════════════════════════════════════════
  let audioContext = null;
  let bgmGainNode = null;
  let bgmSource = null;
  let bgmPlaying = false;

  const playlist = [
    { name: "🎵 Lo-Fi Anime Beats", url: "./public/music/Clarity-phonk.wav" },
    { name: "🎵 Maple's Defense", url: "./public/music/maple-theme.mp3" },
    { name: "🎵 Adventure Time", url: "./public/music/adventure.mp3" }
  ];
  let currentPlaylistIndex = 0;

  function initAudioContext() {
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      bgmGainNode = audioContext.createGain();
      bgmGainNode.gain.value = 0.5;
      bgmGainNode.connect(audioContext.destination);
    }
    if (audioContext.state === "suspended") audioContext.resume();
  }

  function playSFX(type) {
    initAudioContext();
    if (!audioContext) return;
    const now = audioContext.currentTime;

    if (type === "menuSelect") {
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.setValueAtTime(1174.66, now + 0.06);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      osc.connect(gain); gain.connect(audioContext.destination);
      osc.start(now); osc.stop(now + 0.15);
    } else if (type === "questClear") {
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, i) => {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        osc.type = "triangle"; osc.frequency.value = freq;
        const startTime = now + i * 0.12;
        gain.gain.setValueAtTime(0.12, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.3);
        osc.connect(gain); gain.connect(audioContext.destination);
        osc.start(startTime); osc.stop(startTime + 0.35);
      });
    } else if (type === "close") {
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.2);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc.connect(gain); gain.connect(audioContext.destination);
      osc.start(now); osc.stop(now + 0.25);
    }
  }

  async function loadAndPlayTrack() {
    initAudioContext();
    if (bgmSource) { try { bgmSource.stop(); bgmSource.disconnect(); } catch (e) {} }
    const url = playlist[currentPlaylistIndex].url;
    try {
      const res = await fetch(url);
      const arrayBuf = await res.arrayBuffer();
      const buffer = await audioContext.decodeAudioData(arrayBuf);
      bgmSource = audioContext.createBufferSource();
      bgmSource.buffer = buffer;
      bgmSource.loop = true;
      bgmSource.connect(bgmGainNode);
      bgmSource.start(0);
    } catch (error) {
      console.error("Gagal memuat musik:", error);
    }
  }

  async function toggleBGM() {
    initAudioContext();
    const bgmToggle = document.getElementById("bgmToggle");
    if (bgmPlaying) {
      if (bgmSource) { try { bgmSource.stop(); bgmSource.disconnect(); } catch (e) {} bgmSource = null; }
      bgmPlaying = false;
      bgmToggle?.classList.remove("bgm-toggle--playing");
      const svg = bgmToggle?.querySelector("svg");
      if (svg) svg.innerHTML = '<path d="M8 5v14l11-7z"/>';
    } else {
      bgmPlaying = true;
      bgmToggle?.classList.add("bgm-toggle--playing");
      const svg = bgmToggle?.querySelector("svg");
      if (svg) svg.innerHTML = '<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>';
      await loadAndPlayTrack();
    }
  }

  async function nextBGM() {
    currentPlaylistIndex = (currentPlaylistIndex + 1) % playlist.length;
    const bgmLabel = document.getElementById("bgmLabel");
    if (bgmLabel) bgmLabel.textContent = playlist[currentPlaylistIndex].name;
    if (bgmPlaying) await loadAndPlayTrack();
  }

  // ═══════════════════════════════════════════
  // VN DIALOGUE SYSTEM (RANDOMIZER - TANPA SUARA)
  // ═══════════════════════════════════════════
  const vnContainer = document.getElementById("vnContainer");
  const vnMessage = document.getElementById("vnMessage");
  const vnNext = document.getElementById("vnNext");
  const vnClose = document.getElementById("vnClose");
  let typewriterTimer = null;

  function typewriterEffect(text, element, speed = 30) {
    if (typewriterTimer) clearTimeout(typewriterTimer);
    element.textContent = "";
    let i = 0;
    function type() {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        typewriterTimer = setTimeout(type, speed);
      }
    }
    type();
  }

  function triggerVNDialogue(route, customText = null) {
    if (!vnContainer || !vnMessage) return;
    let textToType = customText;
    if (!textToType) {
      const dialogues = vnDialogues[route];
      if (!dialogues) return;
      const randomIndex = Math.floor(Math.random() * dialogues.length);
      textToType = dialogues[randomIndex];
    }
    vnContainer.classList.add("vn-container--active");
    typewriterEffect(textToType, vnMessage);
  }

  function nextVNDialogue() {
    triggerVNDialogue(currentRoute);
  }

  function closeVNDialogue() {
    vnContainer.classList.remove("vn-container--active");
    if (typewriterTimer) clearTimeout(typewriterTimer);
    vnMessage.textContent = "";
    playSFX("close");
  }

  vnNext?.addEventListener("click", nextVNDialogue);
  vnClose?.addEventListener("click", (e) => {
    e.stopPropagation();
    closeVNDialogue();
  });
  vnContainer?.addEventListener("click", (e) => {
    if (e.target === vnClose || e.target === vnNext) return;
    if (e.target.closest(".vn-textbox")) nextVNDialogue();
  });

  // ═══════════════════════════════════════════
  // MAPLE'S GUIDE TOUR (FULL TOUR - BERANDA → VAULT → KARYA → TENTANG → KONTAK → BERANDA)
  // ═══════════════════════════════════════════
  const guideModeBtn = document.getElementById("guideModeBtn");
  const guideIndicator = document.getElementById("guideIndicator");
  let guideActive = false;

  async function startGuide() {
    if (guideActive) return;
    guideActive = true;
    guideModeBtn?.classList.add("guide-mode-btn--active");
    guideIndicator?.classList.add("guide-indicator--active");

    try {
      // TAHAP 1: BERANDA
      navigateTo("home", true);
      triggerVNDialogue("home", "Ehehe, ayo aku pandu keliling guild-ku! Kita mulai dari sini, ini halaman utamaku. Ada banyak info keren loh! ✨");
      await sleep(6000);
      if (!guideActive) return;

      // TAHAP 2: MAPLE'S VAULT
      triggerVNDialogue("maple", "Sekarang kita ke Maple's Vault! Di sini aku tunjukin semua skill dan equipment legendari-ku. Ada Black Rose Armor, Machine God, dan lainnya! 🛡️");
      navigateTo("maple", true);
      await sleep(5000);
      if (!guideActive) return;
      const mapleGrid = document.querySelector(".maple-grid");
      if (mapleGrid) mapleGrid.scrollIntoView({ behavior: "smooth", block: "center" });
      await sleep(4000);
      if (!guideActive) return;
      triggerVNDialogue("maple", "Lihat kan? Semua skillku keren-keren! Tapi favoritku sih Absolute Defense. Nggak ada yang bisa nembus pertahananku! 💪");
      await sleep(5000);
      if (!guideActive) return;

      // TAHAP 3: KARYA
      triggerVNDialogue("project", "Nah, sekarang kita ke gudang loot! Ini semua hasil karyaku selama main game... eh, maksudku ngoding! 😎");
      navigateTo("project", true);
      await sleep(3000);
      if (!guideActive) return;
      const projectGrid = document.getElementById("projectGrid");
      if (projectGrid) projectGrid.scrollIntoView({ behavior: "smooth", block: "start" });
      await sleep(3000);
      if (!guideActive) return;
      triggerVNDialogue("project", "Kita bisa sortir pakai filter ini. Coba kita lihat yang kategori Web dulu ya! 🕸️");
      document.querySelector('[data-filter="web"]')?.click();
      await sleep(3000);
      if (!guideActive) return;
      triggerVNDialogue("project", "Wah, lumayan banyak! Sekarang kita lihat semuanya lagi~");
      document.querySelector('[data-filter="all"]')?.click();
      await sleep(3000);
      if (!guideActive) return;

      // TAHAP 4: TENTANG
      triggerVNDialogue("about", "Sekarang ke halaman tentang aku! Di sini kamu bisa lihat skill dan tech stack yang kupakai. Mirip status player di game! 📋");
      navigateTo("about", true);
      await sleep(4000);
      if (!guideActive) return;
      const skillsGrid = document.querySelector(".skills-grid");
      if (skillsGrid) skillsGrid.scrollIntoView({ behavior: "smooth", block: "center" });
      await sleep(4000);
      if (!guideActive) return;
      triggerVNDialogue("about", "HTML5, CSS3, JavaScript... Itu semua senjata utamaku! Kayak pedang dan tameng di game. Bedanya ini buat bikin website keren! ⚔️");
      await sleep(5000);
      if (!guideActive) return;

      // TAHAP 5: KONTAK
      triggerVNDialogue("contact", "Akhirnya kita sampai di halaman kontak! Kalau kamu mau party bareng atau kirim quest, bisa lewat sini ya! 💌");
      navigateTo("contact", true);
      await sleep(4000);
      if (!guideActive) return;
      triggerVNDialogue("contact", "Ada email, GitHub, sama LinkedIn. Pilih aja yang paling nyaman. Jangan lupa kirim pesan ya, aku tunggu! ✉️");
      await sleep(5000);
      if (!guideActive) return;

      // TAHAP 6: KEMBALI KE BERANDA
      triggerVNDialogue("home", "Nah, tur guild-ku udah selesai! Sekarang kita balik ke beranda lagi. Gimana? Seru kan keliling bareng aku? 😆");
      navigateTo("home", true);
      await sleep(5000);
      if (!guideActive) return;
      triggerVNDialogue("home", "Itu dia semua yang ada di website ini! Kalau butuh bantuan lagi, tinggal pencet tombol panduan ya. Selamat menjelajah, dan hati-hati sama monster di luar sana! Dadah~ 👋🍁");
      await sleep(6000);

    } catch (e) {
      console.log("Guide interrupted.");
    } finally {
      setTimeout(() => stopGuide(), 5000);
    }
  }

  function stopGuide() {
    guideActive = false;
    guideModeBtn?.classList.remove("guide-mode-btn--active");
    guideIndicator?.classList.remove("guide-indicator--active");
    closeVNDialogue();
  }

  guideModeBtn?.addEventListener("click", () => {
    playSFX("menuSelect");
    if (guideActive) stopGuide();
    else startGuide();
  });

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // ═══════════════════════════════════════════
  // NAVIGASI & ROUTING
  // ═══════════════════════════════════════════
  const navLinks = document.querySelectorAll("[data-route]");
  const views = document.querySelectorAll(".view");
  let currentRoute = "home";

  function navigateTo(route, skipDialogue = false) {
    currentRoute = route;
    views.forEach((v) => v.classList.remove("view--active"));
    const target = document.getElementById(route);
    if (target) target.classList.add("view--active");

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.dataset.route === route) link.classList.add("active");
    });

    if (route === "project") fetchGithubProjects();
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.getElementById("navMenu")?.classList.remove("navbar__menu--open");

    if (!skipDialogue) triggerVNDialogue(route);
  }

  document.addEventListener("click", (e) => {
    const trigger = e.target.closest("[data-route]");
    if (trigger) {
      e.preventDefault();
      navigateTo(trigger.dataset.route);
    }
  });

  document.getElementById("menuToggle")?.addEventListener("click", () => {
    document.getElementById("navMenu")?.classList.toggle("navbar__menu--open");
  });
window.addEventListener("DOMContentLoaded", () => {
  // Ambil parameter '?route=...' dari URL browser
  const urlParams = new URLSearchParams(window.location.search);
  const routeParam = urlParams.get("route");

  if (routeParam) {
    // Jika ada parameter route, arahkan ke rute tersebut
    navigateTo(routeParam, true); // Saya set true agar dialog VN bisa dilewati saat kembali
    
    // (Opsional) Membersihkan URL bar agar terlihat rapi tanpa '?'
    window.history.replaceState({}, document.title, window.location.pathname);
  } else {
    // Jika tidak ada parameter, muat halaman home secara default
    navigateTo("home");
  }
});
  // ═══════════════════════════════════════════
  // CAROUSEL
  // ═══════════════════════════════════════════
  const track = document.getElementById("carTrack");
  const prevBtn = document.getElementById("carPrev");
  const nextBtn = document.getElementById("carNext");
  const dotsContainer = document.getElementById("carDots");

  function initCarousel(slides) {
    if (!track || !prevBtn || !nextBtn || !dotsContainer || !slides.length) return;
    track.innerHTML = "";
    dotsContainer.innerHTML = "";
    let currentIndex = 0;

    slides.forEach((repo, i) => {
      const slide = document.createElement("div");
      slide.className = "carousel__slide";
      slide.innerHTML = `
        <h4 class="slide__title">${repo.name}</h4>
        <p class="slide__desc">${repo.description || "Tidak ada deskripsi."}</p>
        <div class="slide__tags">
          ${repo.language ? `<span class="slide__tag">${repo.language}</span>` : ""}
          <span class="slide__tag">⭐ ${repo.stargazers_count}</span>
          <span class="slide__tag">🔄 ${new Date(repo.updated_at).toLocaleDateString("id-ID")}</span>
        </div>
      `;
      track.appendChild(slide);
      const dot = document.createElement("div");
      dot.className = "carousel__dot";
      if (i === 0) dot.classList.add("carousel__dot--active");
      dot.addEventListener("click", () => goToSlide(i));
      dotsContainer.appendChild(dot);
    });

    const allSlides = track.querySelectorAll(".carousel__slide");
    const dots = dotsContainer.querySelectorAll(".carousel__dot");

    function updateDots(index) {
      dots.forEach((d, i) => d.classList.toggle("carousel__dot--active", i === index));
    }

    function goToSlide(index) {
      if (!allSlides.length) return;
      const slideWidth = allSlides[0].offsetWidth + 16;
      track.scrollTo({ left: index * slideWidth, behavior: "smooth" });
      currentIndex = index;
      updateDots(index);
    }

    nextBtn.addEventListener("click", () => {
      currentIndex = Math.min(currentIndex + 1, allSlides.length - 1);
      goToSlide(currentIndex);
    });
    prevBtn.addEventListener("click", () => {
      currentIndex = Math.max(currentIndex - 1, 0);
      goToSlide(currentIndex);
    });
    track.addEventListener("scroll", () => {
      if (!allSlides.length) return;
      const slideWidth = allSlides[0].offsetWidth + 16;
      const newIndex = Math.round(track.scrollLeft / slideWidth);
      if (newIndex !== currentIndex && newIndex >= 0 && newIndex < allSlides.length) {
        currentIndex = newIndex;
        updateDots(currentIndex);
      }
    });
  }

  // ═══════════════════════════════════════════
  // GITHUB API & PROYEK
  // ═══════════════════════════════════════════
  async function fetchGithubProjects() {
    const grid = document.getElementById("projectGrid");
    const loader = document.getElementById("projectLoader");
    if (!grid || grid.dataset.loaded === "true") return;
    loader.style.display = "flex";
    grid.innerHTML = "";

    try {
      const res = await fetch(`https://api.github.com/users/${USERNAME}/repos?sort=updated&per_page=30`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const repos = await res.json();
      if (!repos.length) {
        grid.innerHTML = '<p style="text-align:center;color:var(--text-secondary);">Belum ada repository publik.</p>';
        return;
      }
      allRepos = repos;
      grid._allRepos = repos;
      renderProjectCards(repos, "all");
      initCarousel(repos.slice(0, 6));
      const totalStars = repos.reduce((sum, r) => sum + r.stargazers_count, 0);
      const repoCountEl = document.getElementById("repoCount");
      const starCountEl = document.getElementById("starCount");
      if (repoCountEl) repoCountEl.textContent = repos.length;
      if (starCountEl) starCountEl.textContent = totalStars;
      grid.dataset.loaded = "true";
      setupFilterTabs(repos);
      playSFX("questClear");
    } catch (err) {
      grid.innerHTML = `<p style="color:var(--accent);text-align:center;">Gagal memuat: ${err.message}</p>`;
    } finally {
      loader.style.display = "none";
    }
  }

  function categorizeRepo(repo) {
    const name = (repo.name + " " + (repo.description || "") + " " + (repo.language || "")).toLowerCase();
    const topics = (repo.topics || []).join(" ").toLowerCase();
    const combined = name + " " + topics;
    if (combined.includes("game") || combined.includes("unity") || combined.includes("godot")) return "game";
    if (combined.includes("design") || combined.includes("figma") || combined.includes("ui") || combined.includes("art")) return "design";
    if (repo.language && ["html", "css", "javascript", "typescript", "jsx", "tsx", "vue", "react"].includes(repo.language.toLowerCase())) return "web";
    if (repo.homepage || repo.has_pages) return "web";
    return "other";
  }

  function renderProjectCards(repos, filter) {
    const grid = document.getElementById("projectGrid");
    const empty = document.getElementById("projectEmpty");
    if (!grid) return;
    const filtered = filter === "all" ? repos : repos.filter((r) => categorizeRepo(r) === filter);
    if (!filtered.length) {
      grid.innerHTML = "";
      if (empty) empty.style.display = "block";
      return;
    }
    if (empty) empty.style.display = "none";

    grid.innerHTML = filtered.map((repo) => {
      const created = new Date(repo.created_at);
      const updated = new Date(repo.updated_at);
      const dateStr = created.toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" });
      const hasPages = repo.has_pages || repo.homepage;
      const pagesUrl = repo.homepage || `https://${USERNAME}.github.io/${repo.name}`;
      const category = categorizeRepo(repo);
      const categoryLabel = { web: "🌐 Web", game: "🎮 Game", design: "🎨 Design", other: "📦 Lainnya" }[category];

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
            ${hasPages ? `
              <a href="${pagesUrl}" target="_blank" rel="noopener" class="project-card__view">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                View Page
              </a>` : ""}
          </div>
        </article>
      `;
    }).join("");
  }

  function setupFilterTabs(repos) {
    const tabs = document.querySelectorAll("#filterTabs .filter-tab");
    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        tabs.forEach((t) => t.classList.remove("filter-tab--active"));
        tab.classList.add("filter-tab--active");
        renderProjectCards(repos, tab.dataset.filter);
        playSFX("menuSelect");
      });
    });
  }

  (async function loadHomeData() {
    try {
      const res = await fetch(`https://api.github.com/users/${USERNAME}/repos?sort=updated&per_page=30`);
      if (!res.ok) return;
      const repos = await res.json();
      allRepos = repos;
      initCarousel(repos.slice(0, 6));
      const totalStars = repos.reduce((sum, r) => sum + r.stargazers_count, 0);
      const repoCountEl = document.getElementById("repoCount");
      const starCountEl = document.getElementById("starCount");
      if (repoCountEl) repoCountEl.textContent = repos.length;
      if (starCountEl) starCountEl.textContent = totalStars;
    } catch (e) {
      console.log("GitHub fetch awal:", e.message);
    }
  })();

  // ═══════════════════════════════════════════
  // SFX NAVBAR HOVER
  // ═══════════════════════════════════════════
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("mouseenter", () => {
      if (!link.classList.contains("active")) {
        playSFX("menuSelect");
        link.classList.add("sfx-hover");
      }
    });
    link.addEventListener("mouseleave", () => {
      link.classList.remove("sfx-hover");
    });
  });

  // ═══════════════════════════════════════════
  // BGM PLAYER EVENTS
  // ═══════════════════════════════════════════
  document.getElementById("bgmToggle")?.addEventListener("click", toggleBGM);
  document.getElementById("bgmNext")?.addEventListener("click", () => {
    playSFX("menuSelect");
    nextBGM();
  });

  // ═══════════════════════════════════════════
  // KONAMI CODE EASTER EGG
  // ═══════════════════════════════════════════
  const konamiCode = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "KeyB", "KeyA"];
  let konamiIndex = 0;

  document.addEventListener("keydown", (e) => {
    if (e.code === konamiCode[konamiIndex]) {
      konamiIndex++;
      if (konamiIndex === konamiCode.length) {
        activateEasterEgg();
        konamiIndex = 0;
      }
    } else {
      konamiIndex = 0;
    }
  });

  function activateEasterEgg() {
    const overlay = document.getElementById("secretOverlay");
    const projectEl = document.getElementById("secretProject");
    if (!overlay) return;

    if (allRepos.length > 0) {
      const randomRepo = allRepos[Math.floor(Math.random() * allRepos.length)];
      projectEl.innerHTML = `
        <div style="background:var(--bg-card);padding:20px;border-radius:var(--radius);border:1px solid var(--accent-gold);">
          <h3 style="color:var(--accent-gold);">🌟 ${randomRepo.name}</h3>
          <p style="color:var(--text-secondary);">${randomRepo.description || "Project rahasia!"}</p>
          <p style="color:var(--accent);">⭐ ${randomRepo.stargazers_count} stars</p>
        </div>
      `;
    }
    overlay.classList.add("secret-overlay--active");
    document.body.classList.add("screen-shake");
    playSFX("questClear");
    setTimeout(() => document.body.classList.remove("screen-shake"), 500);
  }

  document.getElementById("secretClose")?.addEventListener("click", () => {
    document.getElementById("secretOverlay")?.classList.remove("secret-overlay--active");
    playSFX("close");
  });

  // ═══════════════════════════════════════════
  // INISIALISASI AKHIR
  // ═══════════════════════════════════════════
  navigateTo("home");
  setTimeout(() => triggerVNDialogue("home"), 800);
});