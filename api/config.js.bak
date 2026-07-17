// public/js/config.js
const CONFIG = {
  // Environment detection
  isProduction: window.location.hostname === 'hayaxxdev-bit.my.id',
  isVercel: window.location.hostname.includes('vercel.app'),
  isLocal: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1',
  
  // API Endpoints
  api: {
    // Vercel API (production)
    health: 'https://hayaxxdev-bit-github-io.vercel.app/api/health',
    github: 'https://hayaxxdev-bit-github-io.vercel.app/api/github',
    
    // GitHub API langsung (fallback)
    githubDirect: 'https://api.github.com',
  },
  
  // Maintenance config
  maintenance: {
    checkInterval: 30000,
    maxFailures: 2,
    page: '/maintenance.html'
  }
};

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
}