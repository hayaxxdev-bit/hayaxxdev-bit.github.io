// ═══════════════════════════════════════════
// PORTFOLIO SCRIPT - hayaxxdev-bit
// FITUR: AutoPlay, Gacha, VN Dialogue, BGM/SFX, Konami Code
// ═══════════════════════════════════════════

document.addEventListener("DOMContentLoaded", () => {
  // ═══════════════════════════════════════════
  // INISIALISASI DASAR & DATA GLOBAL
  // ═══════════════════════════════════════════
  document.getElementById("year").textContent = new Date().getFullYear();
  const USERNAME = "hayaxxdev-bit";
  let allRepos = []; // Global storage untuk repositori GitHub

  // ═══════════════════════════════════════════
  // VN DIALOGUES (global - dipanggil di berbagai fungsi)
  // ═══════════════════════════════════════════

  const vnDialogues = {
    home: [
      "Halo! Selamat datang di duniaku. Maaf kalau berantakan, aku terlalu malas merapikannya... Tapi setidaknya semua berfungsi dengan baik! ✨",
      "Oh ya, perkenalkan namaku hayaxxdev. Developer pemalas yang entah kenapa bisa bikin website keren. Mungkin ini hasil dari procrastination produktif? 😅",
      "Di sini kamu bisa lihat-lihat proyekku, main Gacha, atau sekedar dengerin musik Lo-Fi sambil scroll-scroll santai~",
      "Fun fact: Website ini punya fitur Auto-Play lho! Klik tombol Game Pad di pojok kanan bawah kalau kamu males navigasi sendiri. Cocok buat kaum rebahan! 🎮",
    ],
    project: [
      "Ini adalah semua proyek yang berhasil kuselesaikan sebelum rasa malas menyerang. Lumayan kan buat portfolio? 😎",
      "Coba deh fitur Gacha-nya! Ada tombol Summon 1x dan Summon 10x. Siapa tahu dapet proyek SSR legendary~ 🌟",
      "Setiap proyek punya rarity lho: SSR (Legendary), SR (Rare), atau R (Common). Berdasarkan stars dan kualitas deskripsinya!",
      "Pro tip: Klik filter tab untuk lihat proyek berdasarkan kategori. Ada Web, Game, Design, dan Lainnya. Atau biarin aja di 'Semua' kalau kamu males milih~ 😴",
    ],
    about: [
      "Tentang aku? Hmm... Seorang Frontend Developer & Game Designer yang obsessed sama estetika anime/manga. Makanya website ini penuh vibe Jepang gitu~ 🇯🇵",
      "Spesialisasi gue di UI interaktif, desain game, dan kreasi digital. Intinya sih bikin website yang nggak ngebosenin kayak website portfolio pada umumnya! ✨",
      "Tech stack yang sering kupake: HTML5, CSS3, JavaScript, React, Node.js. Kadang main Figma juga buat design. Serba bisa dikit lah~ 🔧",
      "Kalau nggak lagi coding, biasanya aku nonton anime, baca manga, atau tidur. Iya, tidur itu hobi. Jangan judge! Zzz... 😴💤",
    ],
    contact: [
      "Kirimkan pesan cepat, sebelum aku ketiduran lagi! Zzz... Oh, dan aku biasanya membalas dalam 1-2 hari kerja. Atau lebih. Tergantung mood dan kadar kafein~ ☕",
      "Bisa hubungi lewat email, GitHub, atau LinkedIn. Pilih aja yang paling nyaman buat kamu. Tapi please jangan spam ya, nanti aku makin males bukanya... 😅",
      "Aku terbuka untuk kolaborasi kreatif, proyek freelance, atau sekedar ngobrol soal anime & game. Asal jangan ajak ngoding jam 3 pagi aja~ 🌙",
      "Fun fact: Kalau kamu pencet kombinasi tombol legendaris Konami Code (↑↑↓↓←→←→ B A), sesuatu yang keren bakal terjadi! Coba aja sendiri~ 🔥",
    ],
  };

  // ═══════════════════════════════════════════
  // WEB AUDIO API - SFX & BGM
  // ═══════════════════════════════════════════
  let audioContext = null;
  let bgmGainNode = null;
  let bgmSources = []; // Diubah dari bgmOscillators menjadi bgmSources untuk file audio
  let bgmBuffers = []; // Tempat menyimpan file audio yang sudah di-download
  let bgmPlaying = false;
  let isBgmLoaded = false;

  function initAudioContext() {
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      bgmGainNode = audioContext.createGain();
      bgmGainNode.gain.value = 0.5; // Sedikit dinaikkan volumenya untuk file audio
      bgmGainNode.connect(audioContext.destination);
    }
    if (audioContext.state === "suspended") {
      audioContext.resume();
    }
  }

  // Efek suara tetap menggunakan Osilator bawaan browser
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
      osc.connect(gain);
      gain.connect(audioContext.destination);
      osc.start(now);
      osc.stop(now + 0.15);
    } else if (type === "questClear") {
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, i) => {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        osc.type = "triangle";
        osc.frequency.value = freq;
        const startTime = now + i * 0.12;
        gain.gain.setValueAtTime(0.12, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.3);
        osc.connect(gain);
        gain.connect(audioContext.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.35);
      });
    } else if (type === "close") {
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.2);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc.connect(gain);
      gain.connect(audioContext.destination);
      osc.start(now);
      osc.stop(now + 0.25);
    }
  }

  // Fungsi baru untuk memuat file audio ke dalam memori
  async function loadBGMFiles() {
    if (isBgmLoaded) return;

    // Masukkan nama file instrumen .wav milikmu di sini
    const files = ["./public/music/Clarity-phonk.wav"];

    try {
      bgmBuffers = await Promise.all(
        files.map(async (url) => {
          const res = await fetch(url);
          const arrayBuf = await res.arrayBuffer();
          return await audioContext.decodeAudioData(arrayBuf);
        }),
      );
      isBgmLoaded = true;
    } catch (error) {
      console.error(
        "Gagal memuat file audio. Pastikan nama file benar!",
        error,
      );
    }
  }

  // Memutar musik dari file .wav
  async function startBGM() {
    initAudioContext();
    if (!bgmGainNode) return;

    stopBGM();

    // Tunggu file selesai dimuat sebelum memutar
    await loadBGMFiles();

    const now = audioContext.currentTime;

    bgmBuffers.forEach((buffer) => {
      const source = audioContext.createBufferSource();
      source.buffer = buffer;
      source.loop = true; // Membuat lagu berulang (loop) secara otomatis!

      source.connect(bgmGainNode);
      source.start(now + 0.1); // Mulai serentak
      bgmSources.push(source);
    });
  }

  function stopBGM() {
    bgmSources.forEach((source) => {
      try {
        source.stop();
        source.disconnect();
      } catch (e) {
        /* already stopped */
      }
    });
    bgmSources = [];
  }

  // Tombol toggle di-update untuk mendukung fungsi async
  async function toggleBGM() {
    initAudioContext();
    const bgmToggle = document.getElementById("bgmToggle");

    if (bgmPlaying) {
      stopBGM();
      bgmPlaying = false;
      bgmToggle?.classList.remove("bgm-toggle--playing");
      const svg = bgmToggle?.querySelector("svg");
      if (svg) svg.innerHTML = '<path d="M8 5v14l11-7z"/>';
    } else {
      bgmPlaying = true; // Set ke true duluan agar UI responsif
      await startBGM();
      bgmToggle?.classList.add("bgm-toggle--playing");
      const svg = bgmToggle?.querySelector("svg");
      if (svg)
        svg.innerHTML =
          '<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>';
    }
  }

  // ═══════════════════════════════════════════
  // VN DIALOGUE SYSTEM
  // ═══════════════════════════════════════════
  const vnContainer = document.getElementById("vnContainer");
  const vnMessage = document.getElementById("vnMessage");
  const vnNext = document.getElementById("vnNext");
  const vnClose = document.getElementById("vnClose");
  let typewriterTimer = null;
  let currentDialogueIndex = {}; // Track index dialog per halaman

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

  function triggerVNDialogue(route, index = 0) {
    const dialogues = vnDialogues[route];
    if (!dialogues || !vnContainer || !vnMessage) return;

    // Inisialisasi index jika belum ada
    if (!(route in currentDialogueIndex)) {
      currentDialogueIndex[route] = 0;
    }

    // Gunakan index yang diberikan atau current
    const dialogueIndex =
      index !== undefined ? index : currentDialogueIndex[route];
    const dialogue = dialogues[dialogueIndex % dialogues.length];

    vnContainer.classList.add("vn-container--active");
    typewriterEffect(dialogue, vnMessage);
    playSFX("menuSelect");
  }

  function nextVNDialogue() {
    if (!(currentRoute in currentDialogueIndex)) {
      currentDialogueIndex[currentRoute] = 0;
    }

    const dialogues = vnDialogues[currentRoute];
    if (!dialogues) return;

    // Pindah ke dialog berikutnya (loop)
    currentDialogueIndex[currentRoute] =
      (currentDialogueIndex[currentRoute] + 1) % dialogues.length;
    triggerVNDialogue(currentRoute, currentDialogueIndex[currentRoute]);
  }

  function closeVNDialogue() {
    vnContainer.classList.remove("vn-container--active");
    if (typewriterTimer) clearTimeout(typewriterTimer);
    vnMessage.textContent = "";
    playSFX("close");
  }

  // Event Listeners untuk VN
  vnNext?.addEventListener("click", nextVNDialogue);

  vnClose?.addEventListener("click", (e) => {
    e.stopPropagation(); // Hindari trigger event lain
    closeVNDialogue();
  });

  // Klik pada VN container (area kosong) juga untuk next dialog
  vnContainer?.addEventListener("click", (e) => {
    // Jangan trigger jika klik tombol close atau next
    if (e.target === vnClose || e.target === vnNext) return;
    // Klik di area textbox untuk next
    if (e.target.closest(".vn-textbox")) {
      nextVNDialogue();
    }
  });

  // ═══════════════════════════════════════════
  // NAVIGASI & ROUTING
  // ═══════════════════════════════════════════
  const navLinks = document.querySelectorAll("[data-route]");
  const views = document.querySelectorAll(".view");
  let currentRoute = "home";

  function navigateTo(route) {
    currentRoute = route;
    views.forEach((v) => v.classList.remove("view--active"));
    const target = document.getElementById(route);
    if (target) target.classList.add("view--active");

    navLinks.forEach((link) => {
      link.classList.remove("active", "navbar__link--active");
      if (link.dataset.route === route) {
        link.classList.add("active");
      }
    });

    // Tampilkan tombol Gacha hanya di halaman Karya
    const gachaBtns = document.getElementById("gachaButtons");
    if (gachaBtns) {
      gachaBtns.style.display =
        route === "project" || route === "gacha" ? "flex" : "none";
    }

    if (route === "project") fetchGithubProjects();
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.getElementById("navMenu")?.classList.remove("navbar__menu--open");

    // Trigger VN Dialogue berdasarkan halaman
    triggerVNDialogue(route);
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

  // ═══════════════════════════════════════════
  // CAROUSEL
  // ═══════════════════════════════════════════
  const track = document.getElementById("carTrack");
  const prevBtn = document.getElementById("carPrev");
  const nextBtn = document.getElementById("carNext");
  const dotsContainer = document.getElementById("carDots");

  function initCarousel(slides) {
    if (!track || !prevBtn || !nextBtn || !dotsContainer || !slides.length)
      return;

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
      dots.forEach((d, i) =>
        d.classList.toggle("carousel__dot--active", i === index),
      );
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
      if (
        newIndex !== currentIndex &&
        newIndex >= 0 &&
        newIndex < allSlides.length
      ) {
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
      const res = await fetch(
        `https://api.github.com/users/${USERNAME}/repos?sort=updated&per_page=30`,
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const repos = await res.json();

      if (!repos.length) {
        grid.innerHTML =
          '<p style="text-align:center;color:var(--text-secondary);">Belum ada repository publik.</p>';
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
    const name = (
      repo.name +
      " " +
      (repo.description || "") +
      " " +
      (repo.language || "")
    ).toLowerCase();
    const topics = (repo.topics || []).join(" ").toLowerCase();
    const combined = name + " " + topics;

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

  function renderProjectCards(repos, filter) {
    const grid = document.getElementById("projectGrid");
    const empty = document.getElementById("projectEmpty");
    if (!grid) return;

    const filtered =
      filter === "all"
        ? repos
        : repos.filter((r) => categorizeRepo(r) === filter);

    if (!filtered.length) {
      grid.innerHTML = "";
      if (empty) empty.style.display = "block";
      return;
    }
    if (empty) empty.style.display = "none";

    grid.innerHTML = filtered
      .map((repo) => {
        const created = new Date(repo.created_at);
        const updated = new Date(repo.updated_at);
        const dateStr = created.toLocaleDateString("id-ID", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
        const hasPages = repo.has_pages || repo.homepage;
        const pagesUrl =
          repo.homepage || `https://${USERNAME}.github.io/${repo.name}`;
        const category = categorizeRepo(repo);
        const categoryLabel = {
          web: "🌐 Web",
          game: "🎮 Game",
          design: "🎨 Design",
          other: "📦 Lainnya",
        }[category];

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
      })
      .join("");
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

  // Load carousel & stats on home load
  (async function loadHomeData() {
    try {
      const res = await fetch(
        `https://api.github.com/users/${USERNAME}/repos?sort=updated&per_page=30`,
      );
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
  // FITUR 1: LAZY AUTOPILOT MODE
  // ═══════════════════════════════════════════
  const lazyModeBtn = document.getElementById("lazyModeBtn");
  const autoQuestIndicator = document.getElementById("autoQuestIndicator");
  let lazyModeActive = false;
  let lazyModeTimer = null;
  let userInteracted = false;
  let interactionTimeout = null;

  const autoPlayRoutes = ["home", "project", "gacha", "about", "contact"];
  let autoPlayIndex = 0;
  const autoFilterOrder = ["all", "web", "game", "design", "other"];
  let autoFilterIndex = 0;

  function activateLazyMode() {
    lazyModeActive = true;
    lazyModeBtn.classList.add("lazy-mode-btn--active");
    autoQuestIndicator.classList.add("auto-quest-indicator--active");
    userInteracted = false;

    autoPlayIndex = autoPlayRoutes.indexOf(currentRoute);
    if (autoPlayIndex === -1) autoPlayIndex = 0;

    runAutoPlayCycle();

    document.addEventListener("mousemove", onUserInteraction);
    document.addEventListener("touchstart", onUserInteraction);
    document.addEventListener("keydown", onUserInteraction);
  }

  function deactivateLazyMode() {
    lazyModeActive = false;
    lazyModeBtn.classList.remove("lazy-mode-btn--active");
    autoQuestIndicator.classList.remove("auto-quest-indicator--active");

    if (lazyModeTimer) {
      clearTimeout(lazyModeTimer);
      lazyModeTimer = null;
    }

    document.removeEventListener("mousemove", onUserInteraction);
    document.removeEventListener("touchstart", onUserInteraction);
    document.removeEventListener("keydown", onUserInteraction);
  }

  function onUserInteraction() {
    if (!lazyModeActive) return;

    userInteracted = true;

    if (lazyModeTimer) {
      clearTimeout(lazyModeTimer);
      lazyModeTimer = null;
    }
    if (interactionTimeout) clearTimeout(interactionTimeout);

    interactionTimeout = setTimeout(() => {
      userInteracted = false;
      runAutoPlayCycle();
    }, 3000);
  }

  function runAutoPlayCycle() {
    if (!lazyModeActive || userInteracted) return;

    autoPlayIndex = (autoPlayIndex + 1) % autoPlayRoutes.length;
    const nextRoute = autoPlayRoutes[autoPlayIndex];
    navigateTo(nextRoute);

    if (nextRoute === "project") {
      lazyModeTimer = setTimeout(() => {
        runAutoFilter();
      }, 2000);
    } else {
      const delay = 5000 + Math.random() * 2000;
      lazyModeTimer = setTimeout(() => {
        runAutoPlayCycle();
      }, delay);
    }
  }

  function runAutoFilter() {
    if (!lazyModeActive || userInteracted || currentRoute !== "project") return;

    const tabs = document.querySelectorAll("#filterTabs .filter-tab");
    if (!tabs.length) return;

    const filterIndex = autoFilterIndex % autoFilterOrder.length;
    const targetFilter = autoFilterOrder[filterIndex];

    tabs.forEach((tab) => {
      if (tab.dataset.filter === targetFilter) {
        tab.click();
        autoFilterIndex++;
      }
    });

    const grid = document.getElementById("projectGrid");
    if (grid) {
      const scrollAmount = grid.scrollTop + 100;
      grid.scrollTo({ top: scrollAmount, behavior: "smooth" });
    }

    const delay = 5000 + Math.random() * 2000;
    lazyModeTimer = setTimeout(() => {
      runAutoPlayCycle();
    }, delay);
  }

  lazyModeBtn.addEventListener("click", () => {
    if (lazyModeActive) {
      deactivateLazyMode();
    } else {
      activateLazyMode();
    }
    playSFX("menuSelect");
  });

  // ═══════════════════════════════════════════
  // FITUR 2: ANIME GACHA SYSTEM (REBUILT)
  // Data: characters.json + localStorage custom chars
  // ═══════════════════════════════════════════

  const gachaOverlay = document.getElementById("gachaOverlay");
  const gachaCanvas = document.getElementById("gachaCanvas");
  const gachaResult = document.getElementById("gachaResult");
  const gachaClose = document.getElementById("gachaClose");
  const gachaAgain = document.getElementById("gachaAgain");
  const summon1x = document.getElementById("summon1x");
  const summon10x = document.getElementById("summon10x");

  let animeCharacters = []; // merged: JSON + localStorage custom
  let gachaPityCount = 0;
  let gachaTotalPulls = 0;
  let lastSummonCount = 1;

  // ── Rarity config ──────────────────────────
  const RARITY_CONFIG = {
    SSR: {
      color: "#f59e0b",
      glow: "rgba(245,158,11,0.4)",
      bg: "#1a1200",
      stars: "★★★ SSR",
      pity: 90,
    },
    SR: {
      color: "#a78bfa",
      glow: "rgba(167,139,250,0.35)",
      bg: "#120d1f",
      stars: "★★ SR",
    },
    R: {
      color: "#9494a0",
      glow: "rgba(148,148,160,0.2)",
      bg: "#111118",
      stars: "★ R",
    },
  };
  const ELEMENT_ICON = {
    Fire: "🔥",
    Water: "💧",
    Wind: "🌬️",
    Earth: "🌿",
    Light: "✨",
    Dark: "🌑",
    Thunder: "⚡",
  };

  // ── Load characters (JSON + localStorage) ──
  async function loadAnimeCharacters() {
    try {
      const res = await fetch("./characters.json");
      if (!res.ok) throw new Error("characters.json tidak ditemukan");
      const baseChars = await res.json();
      const customRaw = localStorage.getItem("gacha_custom_chars");
      const customChars = customRaw ? JSON.parse(customRaw) : [];
      animeCharacters = [...baseChars, ...customChars];
    } catch (e) {
      console.warn("Gagal load characters.json:", e.message);
      // Fallback: hanya pakai custom dari localStorage
      const customRaw = localStorage.getItem("gacha_custom_chars");
      animeCharacters = customRaw ? JSON.parse(customRaw) : [];
    }
    updateGachaCounter();
    renderGachaPeek();
  }

  // ── Roll logic with pity ──────────────────
  function rollRarity() {
    gachaPityCount++;
    if (gachaPityCount >= 90) {
      gachaPityCount = 0;
      return "SSR";
    }
    const r = Math.random() * 100;
    if (r < 3) return "SSR";
    if (r < 28) return "SR";
    return "R";
  }

  function pickCharacter(rarity) {
    const pool = animeCharacters.filter((c) => c.rarity === rarity);
    if (!pool.length) {
      // fallback — try SR if SSR empty, R if SR empty
      const fallbackPool = animeCharacters;
      return fallbackPool[Math.floor(Math.random() * fallbackPool.length)];
    }
    return pool[Math.floor(Math.random() * pool.length)];
  }

  function performRolls(count) {
    const results = [];
    // Guarantee at least 1 SR+ for 10x
    let hasSrOrAbove = false;
    for (let i = 0; i < count; i++) {
      const rarity = rollRarity();
      if (rarity === "SR" || rarity === "SSR") hasSrOrAbove = true;
      const char = pickCharacter(rarity);
      if (char) results.push({ ...char, rolledRarity: rarity });
    }
    if (count === 10 && !hasSrOrAbove) {
      const idx = Math.floor(Math.random() * count);
      const guaranteedChar = pickCharacter("SR");
      if (guaranteedChar)
        results[idx] = { ...guaranteedChar, rolledRarity: "SR" };
    }
    return results;
  }

  // ── Build Pokemon-style card HTML ──────────
  function buildAnimeCard(char, delay = 0) {
    const cfg =
      RARITY_CONFIG[char.rolledRarity || char.rarity] || RARITY_CONFIG.R;
    const elem = ELEMENT_ICON[char.element] || "✨";
    const stats = char.stats || { atk: 50, def: 50, spd: 50, hp: 50 };
    const initials = char.name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

    // Stat bars
    const statRows = [
      { label: "ATK", val: stats.atk },
      { label: "DEF", val: stats.def },
      { label: "SPD", val: stats.spd },
      { label: "HP", val: stats.hp },
    ]
      .map(
        (s) => `
      <div class="stat-row">
        <span>${s.label}</span>
        <div class="stat-bar"><div class="stat-bar__fill" style="width:0%;background:${cfg.color}" data-val="${s.val}"></div></div>
        <span>${s.val}</span>
      </div>`,
      )
      .join("");

    // Ability tags (max 3)
    const abilities = (char.abilities || [])
      .slice(0, 3)
      .map((a) => `<span class="anime-card__tag">${a}</span>`)
      .join("");

    return `
    <div class="anime-card anime-card--${char.rolledRarity || char.rarity}"
         style="--card-color:${cfg.color};--card-glow:${cfg.glow};--card-bg:${cfg.bg};animation-delay:${delay}s"
         title="${char.description || ""}">
      <div class="anime-card__shine"></div>
      <div class="anime-card__header">
        <span class="anime-card__rarity">${cfg.stars}</span>
        <span class="anime-card__element">${elem} ${char.element || ""}</span>
      </div>
      <div class="anime-card__art">
        <img src="${char.image || ""}"
             alt="${char.name}"
             loading="lazy"
             onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" />
        <div class="anime-card__art-fallback" style="display:none;color:${cfg.color}">${initials}</div>
      </div>
      <div class="anime-card__body">
        <div class="anime-card__name">${char.name}</div>
        <div class="anime-card__series">${char.series || ""}</div>
        <div class="anime-card__divider"></div>
        <div class="anime-card__stats">${statRows}</div>
        <div class="anime-card__tags">${abilities}</div>
        <div class="anime-card__desc">${char.description || ""}</div>
      </div>
    </div>`;
  }

  // ── Canvas particle animation ───────────────
  function runParticleAnim(rarity, callback) {
    const canvas = gachaCanvas;
    if (!canvas) {
      if (callback) callback();
      return;
    }
    const ctx = canvas.getContext("2d");
    canvas.width = canvas.offsetWidth || window.innerWidth;
    canvas.height = canvas.offsetHeight || window.innerHeight;

    const color = RARITY_CONFIG[rarity]?.color || "#9494a0";
    const count = rarity === "SSR" ? 120 : rarity === "SR" ? 80 : 40;
    const particles = [];

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        speedX: Math.cos(angle) * (Math.random() * 8 + 3),
        speedY: Math.sin(angle) * (Math.random() * 8 + 3) - 3,
        size: Math.random() * 4 + 2,
        alpha: 1,
        color:
          rarity === "SSR"
            ? ["#f59e0b", "#ff6b9d", "#a78bfa", "#34d399"][
                Math.floor(Math.random() * 4)
              ]
            : color,
      });
    }

    let frame = 0;
    const maxFrames = rarity === "SSR" ? 100 : 70;

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.speedX * 0.95;
        p.y += p.speedY * 0.95;
        p.speedY += 0.15;
        p.alpha -= 1 / maxFrames;
        if (p.alpha <= 0) return;
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
      frame++;
      if (frame < maxFrames) requestAnimationFrame(animate);
      else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (callback) callback();
      }
    }
    animate();
  }

  // ── Perform gacha & show result ─────────────
  function performGacha(count) {
    if (!animeCharacters.length) {
      alert("Karakter belum dimuat. Pastikan characters.json tersedia!");
      return;
    }

    // Cek apakah ada karakter untuk setiap rarity
    const availableRarities = [
      ...new Set(animeCharacters.map((c) => c.rarity)),
    ];
    if (availableRarities.length === 0) {
      alert("Tidak ada karakter dalam pool. Tambahkan karakter dulu!");
      return;
    }

    lastSummonCount = count;
    gachaTotalPulls += count;
    updateGachaCounter();

    // Tampilkan overlay
    gachaOverlay.classList.add("gacha-overlay--active");
    if (gachaAgain) gachaAgain.style.display = "none";

    // Loading state
    gachaResult.innerHTML = `
    <div class="gacha-loading">
      <div class="gacha-loading__spinner"></div>
      <span>✨ Memanggil karakter${count > 1 ? ` (${count}x)` : ""}...</span>
    </div>`;
    gachaResult.className = "gacha-result";

    // Lakukan roll
    const rolls = performRolls(count);

    // Tentukan rarity tertinggi
    const topRarity = rolls.reduce((top, c) => {
      const rank = { SSR: 3, SR: 2, R: 1 };
      return (rank[c.rolledRarity] || 1) > (rank[top] || 1)
        ? c.rolledRarity
        : top;
    }, "R");

    // Play sound effect
    playSFX("questClear");

    // Delay untuk animasi loading
    setTimeout(() => {
      // Jalankan particle animation
      runParticleAnim(topRarity, () => {
        // Set class untuk multi result
        if (count > 1) {
          gachaResult.classList.add("gacha-result--multi");
        } else {
          gachaResult.classList.remove("gacha-result--multi");
        }

        // Render cards dengan stagger animation
        gachaResult.innerHTML = rolls
          .map((char, i) => buildAnimeCard(char, i * 0.15))
          .join("");

        // Jika SSR didapat, tambahkan efek spesial
        const hasSSR = rolls.some((r) => r.rolledRarity === "SSR");
        if (hasSSR) {
          // Tambahkan kelas spesial untuk efek tambahan
          gachaResult.classList.add("gacha-result--legendary");

          // Tampilkan pesan legendaris
          const legendaryMsg = document.createElement("div");
          legendaryMsg.className = "gacha-legendary-msg";
          legendaryMsg.innerHTML = "🌟 LEGENDARY PULL! 🌟";
          legendaryMsg.style.cssText = `
          text-align: center;
          font-family: var(--font-display, var(--font-sans));
          font-size: 1.5rem;
          font-weight: 900;
          background: linear-gradient(135deg, #f59e0b, #fbbf24, #f59e0b);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: legendaryPulse 1.5s ease-in-out infinite;
          padding: 16px;
          order: -1;
        `;

          // Tambahkan CSS animasi jika belum ada
          if (!document.getElementById("legendary-style")) {
            const style = document.createElement("style");
            style.id = "legendary-style";
            style.textContent = `
            @keyframes legendaryPulse {
              0%, 100% { transform: scale(1); opacity: 1; }
              50% { transform: scale(1.1); opacity: 0.8; }
            }
            .gacha-result--legendary {
              animation: legendaryGlow 2s ease-in-out infinite;
            }
            @keyframes legendaryGlow {
              0%, 100% { box-shadow: 0 0 30px rgba(245,158,11,0.3); }
              50% { box-shadow: 0 0 60px rgba(245,158,11,0.6); }
            }
          `;
            document.head.appendChild(style);
          }

          gachaResult.insertBefore(legendaryMsg, gachaResult.firstChild);

          // Tambahkan sparkle effects di background
          setTimeout(() => {
            const sparkles = document.createElement("div");
            sparkles.className = "gacha-sparkles";
            sparkles.innerHTML = Array.from(
              { length: 20 },
              () =>
                `<span class="sparkle" style="
              left: ${Math.random() * 100}%;
              top: ${Math.random() * 100}%;
              animation-delay: ${Math.random() * 2}s;
              animation-duration: ${1 + Math.random() * 2}s;
            ">✨</span>`,
            ).join("");

            // Style untuk sparkles
            const sparkleStyle = document.createElement("style");
            sparkleStyle.textContent = `
            .gacha-sparkles {
              position: absolute;
              inset: 0;
              pointer-events: none;
              overflow: hidden;
            }
            .sparkle {
              position: absolute;
              animation: sparkleFloat 2s ease-in-out infinite;
              font-size: 1.2rem;
              opacity: 0;
            }
            @keyframes sparkleFloat {
              0% { transform: translateY(0) scale(0); opacity: 0; }
              50% { opacity: 1; }
              100% { transform: translateY(-100px) scale(1); opacity: 0; }
            }
          `;
            document.head.appendChild(sparkleStyle);

            gachaResult.style.position = "relative";
            gachaResult.appendChild(sparkles);

            // Hapus sparkles setelah 3 detik
            setTimeout(() => {
              sparkles.remove();
              sparkleStyle.remove();
            }, 3000);
          }, 500);
        }

        // Animate stat bars dengan delay
        requestAnimationFrame(() => {
          const statBars = gachaResult.querySelectorAll(".stat-bar__fill");
          statBars.forEach((bar, index) => {
            const val = bar.dataset.val;
            setTimeout(
              () => {
                bar.style.width = val + "%";
              },
              100 + index * 50,
            ); // Stagger animation
          });
        });

        // Scroll ke atas untuk melihat hasil
        gachaResult.scrollIntoView({ behavior: "smooth", block: "start" });

        // Tampilkan tombol summon lagi
        if (gachaAgain) {
          gachaAgain.style.display = "flex";
          gachaAgain.focus(); // Focus untuk aksesibilitas
        }

        // Log untuk debugging
        console.log(
          `🎰 Gacha Result: ${count}x pull | Top Rarity: ${topRarity} | Has SSR: ${hasSSR}`,
        );
      });
    }, 600); // Sedikit lebih lama untuk efek loading yang lebih dramatis
  }
  // ── Update counter display ──────────────────
  function updateGachaCounter() {
    const el1 = document.getElementById("totalPullsSpan");
    const el2 = document.getElementById("pityCounterSpan");
    const el3 = document.getElementById("charCountSpan");
    if (el1) el1.textContent = gachaTotalPulls;
    if (el2) el2.textContent = gachaPityCount;
    if (el3) el3.textContent = animeCharacters.length;
  }

  // ── Render 5 random char previews in banner ─
  function renderGachaPeek() {
    const peek = document.getElementById("gachaPeek");
    if (!peek || !animeCharacters.length) return;
    const sample = [...animeCharacters]
      .sort(() => Math.random() - 0.5)
      .slice(0, 5);
    peek.innerHTML = sample
      .map((c, i) => {
        const cfg = RARITY_CONFIG[c.rarity] || RARITY_CONFIG.R;
        const init = c.name
          .split(" ")
          .map((w) => w[0])
          .join("")
          .slice(0, 2)
          .toUpperCase();
        return `
        <div style="
          width:42px; height:58px; border-radius:8px; overflow:hidden;
          border:1px solid ${cfg.color}66; flex-shrink:0;
          transform: rotate(${(i - 2) * 4}deg) translateX(${i * -6}px);
          z-index:${i}; position:relative;
          box-shadow: 0 4px 12px rgba(0,0,0,0.5)">
          <img src="${c.image || ""}" alt="${c.name}"
               style="width:100%;height:100%;object-fit:cover;object-position:top"
               onerror="this.style.display='none';this.parentElement.style.background='${cfg.bg}';this.parentElement.innerHTML+='<div style=\\'display:flex;align-items:center;justify-content:center;height:100%;font-family:monospace;font-weight:900;font-size:0.8rem;color:${cfg.color}\\'>${init}</div>'" />
        </div>`;
      })
      .join("");
  }

  // ── Event listeners (summon + close) ───────
  summon1x?.addEventListener("click", () => performGacha(1));
  summon10x?.addEventListener("click", () => performGacha(10));

  gachaClose?.addEventListener("click", () => {
    gachaOverlay.classList.remove("gacha-overlay--active");
    gachaResult.innerHTML = "";
    playSFX("close");
  });

  gachaAgain?.addEventListener("click", () => {
    performGacha(lastSummonCount);
    playSFX("menuSelect");
  });

  // ── Load characters on startup ─────────────
  loadAnimeCharacters();

  // ══════════════ INVENTORY SYSTEM ══════════════
  let gachaInventory = JSON.parse(
    localStorage.getItem("gachaInventory") || "[]",
  );
  const MAX_INVENTORY = 50;

  function addToInventory(character) {
    const inventoryItem = {
      ...character,
      id: Date.now() + Math.random(),
      obtainedAt: new Date().toISOString(),
    };

    gachaInventory.unshift(inventoryItem);

    // Batasi inventory
    if (gachaInventory.length > MAX_INVENTORY) {
      gachaInventory = gachaInventory.slice(0, MAX_INVENTORY);
    }

    saveInventory();
    updateInventoryUI();
    updateInventoryPreview();
  }

  function saveInventory() {
    localStorage.setItem("gachaInventory", JSON.stringify(gachaInventory));
  }

  function updateInventoryUI() {
    const grid = document.getElementById("inventoryGrid");
    const emptyState = document.getElementById("inventoryEmpty");
    const countBadge = document.getElementById("inventoryCount");

    if (countBadge) {
      countBadge.textContent = gachaInventory.length;
    }

    if (!grid) return;

    if (gachaInventory.length === 0) {
      grid.innerHTML = "";
      if (emptyState) emptyState.style.display = "block";
      return;
    }

    if (emptyState) emptyState.style.display = "none";

    grid.innerHTML = gachaInventory
      .map(
        (char, index) => `
    <div class="gacha-drop-card gacha-drop-card--${char.rarity}" 
         style="animation-delay: ${index * 0.05}s">
      <div class="gacha-card-header">
        <div class="gacha-card-avatar" style="background-image: url('${char.image || ""}')"></div>
        <div class="gacha-card-info">
          <div class="gacha-card-name">${char.name}</div>
          <div class="gacha-card-series">${char.series || "Unknown"}</div>
          <span class="gacha-card-rarity gacha-card-rarity--${char.rarity}">${char.rarity}</span>
        </div>
      </div>
      <div class="gacha-card-stats">
        <div class="stat-row">
          <span class="stat-label">💪</span>
          <div class="stat-bar">
            <div class="stat-bar__fill stat-bar__fill--str" data-val="${char.stats?.str || 50}" style="width: 0%"></div>
          </div>
        </div>
        <div class="stat-row">
          <span class="stat-label">⚡</span>
          <div class="stat-bar">
            <div class="stat-bar__fill stat-bar__fill--agi" data-val="${char.stats?.agi || 50}" style="width: 0%"></div>
          </div>
        </div>
        <div class="stat-row">
          <span class="stat-label">🧠</span>
          <div class="stat-bar">
            <div class="stat-bar__fill stat-bar__fill--int" data-val="${char.stats?.int || 50}" style="width: 0%"></div>
          </div>
        </div>
        <div class="stat-row">
          <span class="stat-label">🍀</span>
          <div class="stat-bar">
            <div class="stat-bar__fill stat-bar__fill--luk" data-val="${char.stats?.luk || 50}" style="width: 0%"></div>
          </div>
        </div>
      </div>
      <div style="font-size: 0.7rem; color: var(--text-secondary); margin-top: 8px;">
        📅 ${new Date(char.obtainedAt).toLocaleDateString()}
      </div>
    </div>
  `,
      )
      .join("");

    // Animate stat bars
    requestAnimationFrame(() => {
      const bars = grid.querySelectorAll(".stat-bar__fill");
      bars.forEach((bar, i) => {
        setTimeout(() => {
          bar.style.width = bar.dataset.val + "%";
        }, i * 30);
      });
    });
  }

  function updateInventoryPreview() {
    const previewScroll = document.getElementById("previewScroll");
    const previewCount = document.getElementById("previewCount");

    if (!previewScroll) return;

    const recentPulls = gachaInventory.slice(0, 20);

    if (previewCount) {
      previewCount.textContent = `${recentPulls.length}/20`;
    }

    previewScroll.innerHTML = recentPulls
      .map(
        (char) => `
    <div class="preview-mini-card preview-mini-card--${char.rarity}">
      <div class="preview-mini-avatar" style="background-image: url('${char.image || ""}')"></div>
      <div class="preview-mini-name">${char.name}</div>
      <div class="preview-mini-rarity" style="color: ${
        char.rarity === "SSR"
          ? "#f59e0b"
          : char.rarity === "SR"
            ? "#a78bfa"
            : "#e0e0e0"
      }">${char.rarity}</div>
    </div>
  `,
      )
      .join("");
  }

  function sortInventory(by = "name") {
    if (by === "name") {
      gachaInventory.sort((a, b) => a.name.localeCompare(b.name));
    } else if (by === "rarity") {
      const rarityOrder = { SSR: 3, SR: 2, R: 1 };
      gachaInventory.sort(
        (a, b) => rarityOrder[b.rarity] - rarityOrder[a.rarity],
      );
    }
    updateInventoryUI();
  }

  function exportInventory() {
    const data = JSON.stringify(gachaInventory, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `gacha-inventory-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function clearInventory() {
    if (confirm("Yakin ingin menghapus semua inventory?")) {
      gachaInventory = [];
      saveInventory();
      updateInventoryUI();
      updateInventoryPreview();
    }
  }

  // ══════════════ MODIFIED performGacha ══════════════
  function performGacha(count) {
    if (!animeCharacters.length) {
      alert("Karakter belum dimuat. Pastikan characters.json tersedia!");
      return;
    }

    const availableRarities = [
      ...new Set(animeCharacters.map((c) => c.rarity)),
    ];
    if (availableRarities.length === 0) {
      alert("Tidak ada karakter dalam pool. Tambahkan karakter dulu!");
      return;
    }

    lastSummonCount = count;
    gachaTotalPulls += count;
    updateGachaCounter();

    // Tampilkan overlay
    gachaOverlay.classList.add("gacha-overlay--active");
    if (gachaAgain) gachaAgain.style.display = "none";

    // Loading state
    gachaResult.innerHTML = `
    <div class="gacha-loading">
      <div class="gacha-loading__spinner"></div>
      <span>✨ Memanggil karakter${count > 1 ? ` (${count}x)` : ""}...</span>
    </div>`;
    gachaResult.className = "gacha-result";

    // Lakukan roll
    const rolls = performRolls(count);

    // Tambahkan semua hasil ke inventory
    rolls.forEach((char) => addToInventory(char));

    // Tentukan rarity tertinggi
    const topRarity = rolls.reduce((top, c) => {
      const rank = { SSR: 3, SR: 2, R: 1 };
      return (rank[c.rolledRarity] || 1) > (rank[top] || 1)
        ? c.rolledRarity
        : top;
    }, "R");

    // Play sound effect
    playSFX("questClear");

    // Delay untuk animasi loading
    setTimeout(() => {
      runParticleAnim(topRarity, () => {
        if (count > 1) {
          gachaResult.classList.add("gacha-result--multi");
        } else {
          gachaResult.classList.remove("gacha-result--multi");
        }

        // Render cards dengan stagger animation
        gachaResult.innerHTML = `
          <div class="gacha-result__container">
            ${rolls.map((char, i) => buildAnimeCard(char, i * 0.12)).join("")}
          </div>
        `;

        // Jika SSR didapat, tambahkan efek spesial
        const hasSSR = rolls.some((r) => r.rolledRarity === "SSR");
        if (hasSSR) {
          gachaResult.classList.add("gacha-result--legendary");

          const legendaryMsg = document.createElement("div");
          legendaryMsg.className = "gacha-legendary-msg";
          legendaryMsg.innerHTML = `
            <span class="legendary-text">🌟 LEGENDARY PULL! 🌟</span>
            <div class="legendary-particles">
              ${Array.from(
                { length: 30 },
                () =>
                  `<div class="legendary-particle" style="
                  left: ${Math.random() * 100}%;
                  animation-delay: ${Math.random() * 2}s;
                  animation-duration: ${1.5 + Math.random() * 2}s;
                ">✦</div>`,
              ).join("")}
            </div>
          `;

          if (!document.getElementById("legendary-smooth-style")) {
            const style = document.createElement("style");
            style.id = "legendary-smooth-style";
            style.textContent = `
              @keyframes legendaryPulse {
                0%, 100% { transform: scale(1); opacity: 1; filter: brightness(1); }
                50% { transform: scale(1.08); opacity: 0.9; filter: brightness(1.2); }
              }
              @keyframes legendaryGlow {
                0%, 100% { box-shadow: 0 0 20px rgba(245,158,11,0.3), 0 0 40px rgba(245,158,11,0.2); }
                50% { box-shadow: 0 0 40px rgba(245,158,11,0.6), 0 0 80px rgba(245,158,11,0.4), 0 0 120px rgba(245,158,11,0.2); }
              }
              @keyframes sparkleFloat {
                0% { transform: translateY(0) scale(0) rotate(0deg); opacity: 0; }
                25% { opacity: 1; }
                50% { transform: translateY(-50px) scale(1.2) rotate(180deg); opacity: 1; }
                100% { transform: translateY(-120px) scale(0.5) rotate(360deg); opacity: 0; }
              }
              .gacha-result--legendary {
                animation: legendaryGlow 3s ease-in-out infinite;
              }
              .gacha-legendary-msg {
                text-align: center;
                padding: 20px;
                position: relative;
                overflow: hidden;
              }
              .legendary-text {
                font-family: var(--font-display, var(--font-sans));
                font-size: clamp(1.5rem, 4vw, 2rem);
                font-weight: 900;
                background: linear-gradient(135deg, #f59e0b, #fbbf24, #f59e0b);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                animation: legendaryPulse 1.5s ease-in-out infinite;
                display: inline-block;
              }
              .legendary-particles {
                position: absolute;
                inset: 0;
                pointer-events: none;
              }
              .legendary-particle {
                position: absolute;
                color: #fbbf24;
                font-size: 1.2rem;
                animation: sparkleFloat 2.5s ease-in-out infinite;
              }
            `;
            document.head.appendChild(style);
          }

          const container = gachaResult.querySelector(
            ".gacha-result__container",
          );
          if (container) {
            container.insertBefore(legendaryMsg, container.firstChild);
          }
        }

        // Animate stat bars
        requestAnimationFrame(() => {
          const statBars = gachaResult.querySelectorAll(".stat-bar__fill");
          statBars.forEach((bar, index) => {
            const val = bar.dataset.val;
            setTimeout(
              () => {
                bar.style.transition =
                  "width 0.8s cubic-bezier(0.4, 0, 0.2, 1)";
                bar.style.width = val + "%";
              },
              150 + index * 80,
            );
          });
        });

        // Update inventory preview
        updateInventoryPreview();

        // Smooth scroll
        gachaResult.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });

        // Tampilkan tombol summon lagi
        if (gachaAgain) {
          gachaAgain.style.display = "flex";
          gachaAgain.style.opacity = "0";
          gachaAgain.style.transform = "translateY(20px)";
          gachaAgain.style.transition =
            "opacity 0.4s ease-out, transform 0.4s ease-out";

          requestAnimationFrame(() => {
            gachaAgain.style.opacity = "1";
            gachaAgain.style.transform = "translateY(0)";
          });
        }
      });
    }, 800);
  }

  // ══════════════ EVENT LISTENERS ══════════════
  document.addEventListener("DOMContentLoaded", () => {
    // Initialize inventory
    updateInventoryUI();
    updateInventoryPreview();

    // Inventory section toggle
    const inventoryBtn = document.getElementById("openInventory");
    const inventorySection = document.getElementById("inventorySection");

    if (inventoryBtn && inventorySection) {
      inventoryBtn.addEventListener("click", () => {
        if (inventorySection.style.display === "none") {
          inventorySection.style.display = "block";
          inventorySection.scrollIntoView({ behavior: "smooth" });
          updateInventoryUI();
        } else {
          inventorySection.style.display = "none";
        }
      });
    }

    // Sort buttons
    document
      .getElementById("sortByName")
      ?.addEventListener("click", () => sortInventory("name"));
    document
      .getElementById("sortByRarity")
      ?.addEventListener("click", () => sortInventory("rarity"));
    document
      .getElementById("exportInventory")
      ?.addEventListener("click", exportInventory);
    document
      .getElementById("clearInventory")
      ?.addEventListener("click", clearInventory);

    // Close overlay
    document.getElementById("gachaClose")?.addEventListener("click", () => {
      gachaOverlay.classList.remove("gacha-overlay--active");
    });

    // Summon again
    document.getElementById("gachaAgain")?.addEventListener("click", () => {
      if (lastSummonCount) {
        performGacha(lastSummonCount);
      }
    });
  });

  // ══════════════════════════════════════════
  // FITUR 2b: ADD CHARACTER MODAL
  // ══════════════════════════════════════════
  const addCharModal = document.getElementById("addCharModal");
  const openAddChar = document.getElementById("openAddChar");
  const closeAddChar = document.getElementById("closeAddChar");
  const saveCharBtn = document.getElementById("saveChar");
  const previewCharBtn = document.getElementById("previewChar");
  const addCharMsg = document.getElementById("addCharMsg");
  const addCharPreview = document.getElementById("addCharPreview");

  function openAddCharModal() {
    addCharModal?.classList.add("modal-overlay--active");
    renderSavedCharsList();
    playSFX("menuSelect");
  }
  function closeAddCharModal() {
    addCharModal?.classList.remove("modal-overlay--active");
    addCharMsg && (addCharMsg.style.display = "none");
    addCharPreview && (addCharPreview.innerHTML = "");
    playSFX("close");
  }

  openAddChar?.addEventListener("click", openAddCharModal);
  closeAddChar?.addEventListener("click", closeAddCharModal);
  addCharModal?.addEventListener("click", (e) => {
    if (e.target === addCharModal) closeAddCharModal();
  });

  function getFormValues() {
    return {
      id: Date.now(),
      name: document.getElementById("cf_name")?.value.trim(),
      series: document.getElementById("cf_series")?.value.trim(),
      image: document.getElementById("cf_image")?.value.trim(),
      rarity: document.getElementById("cf_rarity")?.value,
      type: document.getElementById("cf_type")?.value,
      element: document.getElementById("cf_element")?.value,
      description: document.getElementById("cf_desc")?.value.trim(),
      abilities: (document.getElementById("cf_abilities")?.value || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      stats: {
        atk: parseInt(document.getElementById("cf_atk")?.value) || 70,
        def: parseInt(document.getElementById("cf_def")?.value) || 70,
        spd: parseInt(document.getElementById("cf_spd")?.value) || 70,
        hp: parseInt(document.getElementById("cf_hp")?.value) || 70,
      },
    };
  }

  // Preview card in modal
  previewCharBtn?.addEventListener("click", () => {
    const data = getFormValues();
    if (!data.name) {
      showFormMsg("Isi nama karakter dulu!", "error");
      return;
    }
    const previewChar = { ...data, rolledRarity: data.rarity };
    addCharPreview.innerHTML = buildAnimeCard(previewChar, 0);
    // animate stat bars
    setTimeout(() => {
      addCharPreview.querySelectorAll(".stat-bar__fill").forEach((bar) => {
        bar.style.width = bar.dataset.val + "%";
      });
    }, 100);
    playSFX("menuSelect");
  });

  // Save character to localStorage
  saveCharBtn?.addEventListener("click", () => {
    const data = getFormValues();
    if (!data.name) {
      showFormMsg("Nama karakter wajib diisi!", "error");
      return;
    }
    if (!data.image) {
      showFormMsg("URL gambar wajib diisi!", "error");
      return;
    }

    const customRaw = localStorage.getItem("gacha_custom_chars");
    const customList = customRaw ? JSON.parse(customRaw) : [];
    customList.push(data);
    localStorage.setItem("gacha_custom_chars", JSON.stringify(customList));

    // Merge ke animeCharacters
    animeCharacters.push(data);
    updateGachaCounter();
    renderGachaPeek();

    showFormMsg(
      `✅ ${data.name} berhasil ditambahkan ke pool gacha!`,
      "success",
    );
    clearForm();
    renderSavedCharsList();
    playSFX("questClear");
  });

  function showFormMsg(text, type) {
    if (!addCharMsg) return;
    addCharMsg.textContent = text;
    addCharMsg.className = `form-msg form-msg--${type}`;
    addCharMsg.style.display = "block";
    setTimeout(() => {
      addCharMsg.style.display = "none";
    }, 4000);
  }

  function clearForm() {
    ["cf_name", "cf_series", "cf_image", "cf_desc", "cf_abilities"].forEach(
      (id) => {
        const el = document.getElementById(id);
        if (el) el.value = "";
      },
    );
    ["cf_atk", "cf_def", "cf_spd", "cf_hp"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.value = "70";
    });
    addCharPreview && (addCharPreview.innerHTML = "");
  }

  function renderSavedCharsList() {
    const grid = document.getElementById("savedCharsGrid");
    const countEl = document.getElementById("savedCount");
    if (!grid) return;

    const customRaw = localStorage.getItem("gacha_custom_chars");
    const customList = customRaw ? JSON.parse(customRaw) : [];

    if (countEl) countEl.textContent = `${customList.length} karakter`;

    if (!customList.length) {
      grid.innerHTML = `<p style="color:var(--text-secondary);font-size:0.78rem;padding:8px 0;">Belum ada karakter custom. Tambahkan yang pertama! ✨</p>`;
      return;
    }

    grid.innerHTML = customList
      .map((c, idx) => {
        const cfg = RARITY_CONFIG[c.rarity] || RARITY_CONFIG.R;
        const init = c.name
          .split(" ")
          .map((w) => w[0])
          .join("")
          .slice(0, 2)
          .toUpperCase();
        return `
        <div class="saved-char-item">
          <img class="saved-char-item__img"
               src="${c.image || ""}" alt="${c.name}"
               onerror="this.style.display='none'" />
          <div class="saved-char-item__info">
            <div class="saved-char-item__name">${c.name}</div>
            <div class="saved-char-item__rarity" style="color:${cfg.color}">${cfg.stars}</div>
          </div>
          <button class="saved-char-item__del" data-idx="${idx}" title="Hapus">✕</button>
        </div>`;
      })
      .join("");

    grid.querySelectorAll(".saved-char-item__del").forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = parseInt(btn.dataset.idx);
        const list = JSON.parse(
          localStorage.getItem("gacha_custom_chars") || "[]",
        );
        const removed = list.splice(idx, 1)[0];
        localStorage.setItem("gacha_custom_chars", JSON.stringify(list));
        animeCharacters = animeCharacters.filter((c) => c.id !== removed?.id);
        updateGachaCounter();
        renderSavedCharsList();
        renderGachaPeek();
        playSFX("menuSelect");
      });
    });
  }

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
  // BGM PLAYER EVENT
  // ═══════════════════════════════════════════
  document.getElementById("bgmToggle")?.addEventListener("click", toggleBGM);

  // ═══════════════════════════════════════════
  // FITUR 5: KONAMI CODE EASTER EGG  // ═══════════════════════════════════════════
  const konamiCode = [
    "ArrowUp",
    "ArrowUp",
    "ArrowDown",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "ArrowLeft",
    "ArrowRight",
    "b",
    "a",
  ];
  let konamiIndex = 0;
  let secretActive = false;

  const secretOverlay = document.getElementById("secretOverlay");
  const secretProject = document.getElementById("secretProject");
  const secretClose = document.getElementById("secretClose");

  document.addEventListener("keydown", (e) => {
    const expectedKey = konamiCode[konamiIndex];
    const pressedKey = e.key.length === 1 ? e.key.toLowerCase() : e.key;

    if (pressedKey === expectedKey.toLowerCase()) {
      konamiIndex++;

      if (konamiIndex === konamiCode.length) {
        activateSecretMode();
        konamiIndex = 0;
      }
    } else {
      konamiIndex = 0;
    }
  });

  function activateSecretMode() {
    if (secretActive) return;
    secretActive = true;

    document.body.classList.add("screen-shake");
    setTimeout(() => {
      document.body.classList.remove("screen-shake");
    }, 500);

    document.documentElement.style.setProperty("--accent", "#f59e0b");
    document.documentElement.style.setProperty(
      "--accent-glow",
      "rgba(245,158,11,0.4)",
    );

    secretOverlay.classList.add("secret-overlay--active");

    if (allRepos.length > 0) {
      const secretRepo = allRepos.sort(
        (a, b) => b.stargazers_count - a.stargazers_count,
      )[0];
      secretProject.innerHTML = `
        <div class="gacha-drop-card gacha-drop-card--SSR">
          <div style="font-family:var(--font-mono);font-size:0.75rem;color:#f59e0b;margin-bottom:4px;">🔥 SECRET PROJECT 🔥</div>
          <h4 style="font-family:var(--font-mono);margin-bottom:4px;">${secretRepo.name}</h4>
          <p style="font-size:0.8rem;color:var(--text-secondary);margin-bottom:8px;">${secretRepo.description || "Proyek legendaris yang tersembunyi..."}</p>
          <div style="display:flex;gap:6px;flex-wrap:wrap;">
            ${secretRepo.language ? `<span class="project-card__tag">${secretRepo.language}</span>` : ""}
            <span class="project-card__tag">⭐ ${secretRepo.stargazers_count}</span>
            <a href="${secretRepo.html_url}" target="_blank" style="font-size:0.7rem;color:#f59e0b;text-decoration:none;">🔗 Buka Repo</a>
          </div>
        </div>
      `;
    } else {
      secretProject.innerHTML =
        '<p style="color:var(--text-secondary);">Proyek rahasia belum terungkap... Muat data GitHub dulu!</p>';
    }

    playSFX("questClear");

    if (!bgmPlaying) toggleBGM();
  }

  function deactivateSecretMode() {
    secretActive = false;

    document.documentElement.style.setProperty("--accent", "#ff6b9d");
    document.documentElement.style.setProperty(
      "--accent-glow",
      "rgba(255,107,157,0.25)",
    );

    secretOverlay.classList.remove("secret-overlay--active");
    secretProject.innerHTML = "";

    playSFX("menuSelect");
  }

  secretClose?.addEventListener("click", deactivateSecretMode);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && secretActive) {
      deactivateSecretMode();
    }
  });

  // ═══════════════════════════════════════════
  // INISIALISASI AKHIR
  // ═══════════════════════════════════════════
  // Default view
  navigateTo("home");

  // Tampilkan VN dialogue saat pertama load
  setTimeout(() => {
    triggerVNDialogue("home");
  }, 800);

  console.log("🎮 hayaxxdev Portofolio Loaded!");
  console.log(
    "✨ Fitur tersedia: Lazy Mode, Gacha System, VN Dialogue, BGM/SFX, Konami Code",
  );
  console.log("🔑 Coba tekan: ↑↑↓↓←→←→ B A");
});
