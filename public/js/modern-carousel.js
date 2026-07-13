/**
 * Modern Carousel Component
 * Features: Auto-play, swipe, responsive, glassmorphism design
 */
class ModernCarousel {
  constructor(options) {
    this.container = document.querySelector(options.container);
    this.track = this.container.querySelector('.carousel__track');
    this.slides = [];
    this.options = {
      autoplay: options.autoplay || true,
      autoplaySpeed: options.autoplaySpeed || 5000,
      pauseOnHover: options.pauseOnHover || true,
      showDots: options.showDots || true,
      showArrows: options.showArrows || true,
      showProgress: options.showProgress || true,
      swipeThreshold: options.swipeThreshold || 50,
      ...options
    };

    this.currentIndex = 0;
    this.autoplayTimer = null;
    this.isPaused = false;
    this.touchStartX = 0;
    this.touchEndX = 0;

    this.init();
  }

  init() {
    this.createDOM();
    this.setupEventListeners();
    
    if (this.options.autoplay) {
      this.startAutoplay();
    }
  }

  createDOM() {
    // Create dots container
    if (this.options.showDots) {
      this.dotsContainer = this.container.querySelector('.carousel__dots') || 
                          this.createDotsContainer();
    }

    // Create progress bar
    if (this.options.showProgress) {
      this.progressBar = this.container.querySelector('.carousel__progress') ||
                        this.createProgressBar();
    }

    // Create navigation arrows
    if (this.options.showArrows) {
      this.prevBtn = this.container.querySelector('.carousel__prev') ||
                     this.createNavButton('prev');
      this.nextBtn = this.container.querySelector('.carousel__next') ||
                     this.createNavButton('next');
    }

    // Create slide counter
    this.counter = this.container.querySelector('.carousel__counter') ||
                   this.createCounter();
  }

  loadSlides(data) {
    this.track.innerHTML = '';
    this.slides = data.map((item, index) => this.createSlide(item, index));
    this.slides.forEach(slide => this.track.appendChild(slide));
    
    this.updateDots();
    this.updateCounter();
    this.goToSlide(0);
  }

  createSlide(item, index) {
    const slide = document.createElement('div');
    slide.className = 'carousel__slide';
    slide.setAttribute('role', 'group');
    slide.setAttribute('aria-roledescription', 'slide');
    slide.setAttribute('aria-label', `Slide ${index + 1}: ${item.name}`);
    
    slide.innerHTML = `
      <div class="slide__glass-card">
        <div class="slide__header">
          <div class="slide__language-badge" style="background: ${item.languageColor}20; color: ${item.languageColor}">
            <span class="language-dot" style="background: ${item.languageColor}"></span>
            ${item.language}
          </div>
          <div class="slide__stats">
            <span class="stat-item">
              <svg class="stat-icon" viewBox="0 0 16 16" width="16" height="16">
                <path fill="currentColor" d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z"/>
              </svg>
              ${item.stars}
            </span>
            <span class="stat-item">
              <svg class="stat-icon" viewBox="0 0 16 16" width="16" height="16">
                <path fill="currentColor" d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z"/>
              </svg>
              ${item.forks}
            </span>
          </div>
        </div>
        
        <h3 class="slide__title">${item.name}</h3>
        <p class="slide__description">${this.truncateText(item.description, 120)}</p>
        
        <div class="slide__meta">
          <div class="meta-item">
            <svg class="meta-icon" viewBox="0 0 16 16" width="14" height="14">
              <path fill="currentColor" d="M8 0a8 8 0 110 16A8 8 0 018 0zM1.5 8a6.5 6.5 0 1013 0 6.5 6.5 0 00-13 0zm7-3.25v2.992l2.028.812a.75.75 0 01-.557 1.392l-2.5-1A.75.75 0 017.25 8v-3.25a.75.75 0 011.5 0z"/>
            </svg>
            ${item.lastUpdateRelative}
          </div>
          
          ${item.topics.slice(0, 3).map(topic => `
            <span class="topic-badge">${topic}</span>
          `).join('')}
        </div>
        
        <div class="slide__actions">
          <a href="${item.url}" target="_blank" rel="noopener" class="action-btn action-btn--primary">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            Repository
          </a>
          ${item.homepage ? `
            <a href="${item.homepage}" target="_blank" rel="noopener" class="action-btn action-btn--secondary">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
                <polyline points="15 3 21 3 21 9"/>
                <line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
              Live Demo
            </a>
          ` : ''}
        </div>
      </div>
    `;
    
    return slide;
  }

  setupEventListeners() {
    // Navigation buttons
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => this.previousSlide());
    }
    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => this.nextSlide());
    }

    // Keyboard navigation
    this.container.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') this.previousSlide();
      if (e.key === 'ArrowRight') this.nextSlide();
    });

    // Pause on hover
    if (this.options.pauseOnHover) {
      this.container.addEventListener('mouseenter', () => this.pauseAutoplay());
      this.container.addEventListener('mouseleave', () => this.resumeAutoplay());
    }

    // Touch events for swipe
    this.track.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
    this.track.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: true });

    // Visibility change - pause when tab is not visible
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pauseAutoplay();
      } else {
        this.resumeAutoplay();
      }
    });
  }

  handleTouchStart(e) {
    this.touchStartX = e.touches[0].clientX;
  }

  handleTouchEnd(e) {
    this.touchEndX = e.changedTouches[0].clientX;
    this.handleSwipe();
  }

  handleSwipe() {
    const diff = this.touchStartX - this.touchEndX;
    if (Math.abs(diff) > this.options.swipeThreshold) {
      if (diff > 0) {
        this.nextSlide();
      } else {
        this.previousSlide();
      }
    }
  }

  goToSlide(index) {
    if (index < 0 || index >= this.slides.length) return;
    
    this.currentIndex = index;
    const slideWidth = this.slides[0].offsetWidth;
    const gap = 24; // Same as CSS gap
    const offset = index * (slideWidth + gap);
    
    this.track.style.transform = `translateX(-${offset}px)`;
    
    this.updateDots();
    this.updateCounter();
    this.resetAutoplay();
    
    // Accessibility
    this.slides.forEach((slide, i) => {
      slide.setAttribute('aria-hidden', i !== index);
    });
  }

  nextSlide() {
    const nextIndex = (this.currentIndex + 1) % this.slides.length;
    this.goToSlide(nextIndex);
  }

  previousSlide() {
    const prevIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
    this.goToSlide(prevIndex);
  }

  startAutoplay() {
    if (this.options.autoplay && !this.isPaused) {
      this.autoplayTimer = setInterval(() => {
        this.nextSlide();
      }, this.options.autoplaySpeed);
    }
  }

  pauseAutoplay() {
    this.isPaused = true;
    if (this.autoplayTimer) {
      clearInterval(this.autoplayTimer);
    }
  }

  resumeAutoplay() {
    this.isPaused = false;
    this.startAutoplay();
  }

  resetAutoplay() {
    if (this.autoplayTimer) {
      clearInterval(this.autoplayTimer);
    }
    this.startAutoplay();
  }

  updateDots() {
    if (!this.dotsContainer) return;
    
    this.dotsContainer.innerHTML = '';
    this.slides.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.className = `carousel__dot ${index === this.currentIndex ? 'active' : ''}`;
      dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
      dot.addEventListener('click', () => this.goToSlide(index));
      this.dotsContainer.appendChild(dot);
    });
  }

  updateCounter() {
    if (this.counter) {
      this.counter.textContent = `${this.currentIndex + 1} / ${this.slides.length}`;
    }
  }

  truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }

  // Helper methods to create DOM elements
  createDotsContainer() {
    const dots = document.createElement('div');
    dots.className = 'carousel__dots';
    this.container.appendChild(dots);
    return dots;
  }

  createProgressBar() {
    const progress = document.createElement('div');
    progress.className = 'carousel__progress';
    const fill = document.createElement('div');
    fill.className = 'carousel__progress-fill';
    progress.appendChild(fill);
    this.container.appendChild(progress);
    return progress;
  }

  createNavButton(direction) {
    const btn = document.createElement('button');
    btn.className = `carousel__${direction}`;
    btn.setAttribute('aria-label', `${direction === 'prev' ? 'Previous' : 'Next'} slide`);
    btn.innerHTML = direction === 'prev' ? '←' : '→';
    this.container.appendChild(btn);
    return btn;
  }

  createCounter() {
    const counter = document.createElement('div');
    counter.className = 'carousel__counter';
    this.container.appendChild(counter);
    return counter;
  }
}

export default ModernCarousel;