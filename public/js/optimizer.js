// Virtual scrolling untuk project grid
class ProjectGridOptimizer {
  constructor() {
    this.observer = null;
    this.init();
  }
  
  init() {
    // Gunakan Intersection Observer untuk lazy render
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.renderProjects(entry.target);
          }
        });
      },
      { rootMargin: '200px' }
    );
  }
  
  renderProjects(container) {
    // Render projects dalam batch 6 item
    const batchSize = 6;
    const allProjects = window.projectData || [];
    
    for (let i = 0; i < Math.min(batchSize, allProjects.length); i++) {
      const card = this.createProjectCard(allProjects[i]);
      container.appendChild(card);
    }
    
    this.observer.unobserve(container);
  }
  
  createProjectCard(project) {
    // Gunakan DocumentFragment untuk performa
    const template = document.getElementById('project-card-template');
    const clone = template.content.cloneNode(true);
    
    // Update content
    clone.querySelector('.project-title').textContent = project.name;
    clone.querySelector('.project-desc').textContent = project.description;
    
    return clone;
  }
}

// Defer non-critical renders
function deferRender(fn) {
  if (typeof requestIdleCallback === 'function') {
    requestIdleCallback(fn, { timeout: 2000 });
  } else {
    setTimeout(fn, 1);
  }
}

// Optimize animations
function optimizeAnimations() {
  const animatedElements = document.querySelectorAll('.animate');
  
  animatedElements.forEach(el => {
    // Gunakan will-change hanya saat dibutuhkan
    el.addEventListener('mouseenter', () => {
      el.style.willChange = 'transform';
    });
    
    el.addEventListener('mouseleave', () => {
      el.style.willChange = 'auto';
    });
    
    // Hapus animasi saat tidak visible
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) {
          el.style.animationPlayState = 'paused';
        } else {
          el.style.animationPlayState = 'running';
        }
      });
    });
    
    observer.observe(el);
  });
}