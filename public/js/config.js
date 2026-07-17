// public/js/config.js
// ═══════════════════════════════════════════
// CONFIG — Extends window.__CONFIG
// ═══════════════════════════════════════════

// Ambil dari global config (didefinisikan di <head>)
var GLOBAL = window.__CONFIG || {};

const CONFIG = {
  // ══════ DARI window.__CONFIG ══════
  GITHUB_USERNAME: GLOBAL.github?.username || 'hayaxxdev-bit',
  GITHUB_API_URL: GLOBAL.api?.github || 'https://api.github.com',
  GITHUB_RAW_URL: GLOBAL.api?.rawGithub || 'https://raw.githubusercontent.com',
  VERCEL_API_URL: GLOBAL.api?.vercel || 'https://hayaxxdev-bit-github-io.vercel.app',
  HEALTH_API_URL: GLOBAL.api?.health || 'https://hayaxxdev-bit-github-io.vercel.app/api/health',
  GITHUB_PROXY_URL: GLOBAL.api?.githubProxy || 'https://hayaxxdev-bit-github-io.vercel.app/api/github',
  
  // ══════ ENVIRONMENT ══════
  IS_PRODUCTION: GLOBAL.isProduction || false,
  IS_LOCAL: GLOBAL.isLocal || false,
  IS_VERCEL: GLOBAL.isVercel || false,
  DOMAIN: GLOBAL.domain || 'hayaxxdev-bit.my.id',
  BASE_URL: GLOBAL.baseUrl || 'https://hayaxxdev-bit.my.id',
  
  // ══════ SOCIAL ══════
  SOCIAL: GLOBAL.social || {
    github: 'https://github.com/hayaxxdev-bit',
    linkedin: 'https://linkedin.com/in/hayaxxdev',
    twitter: 'https://twitter.com/hayaxxdev',
    instagram: 'https://instagram.com/hayaxxdev',
    email: 'mailto:hayaxxdev@gmail.com',
  },
  
  // ══════ APP SETTINGS ══════
  AUTOPLAY_DELAY: 5000,
  CACHE_DURATION: 3600000, // 1 jam
  FEATURED_COUNT: 6,
  PER_PAGE: 30,
  
  // ══════ MAINTENANCE ══════
  MAINTENANCE: GLOBAL.maintenance || {
    checkInterval: 60000,
    maxFailures: 3,
    page: '/maintenance.html',
    gracePeriod: 10000,
  },
  
  // ══════ TYPING ══════
  TYPING_SPEED_MIN: 25,
  TYPING_SPEED_MAX: 45,
  
  // ══════ AUDIO ══════
  BGM_VOLUME: 0.5,
  SFX_VOLUME: 0.15,
  
  // ══════ GUIDE ══════
  GUIDE_DELAY: 5000,
  
  // ══════ LOADER ══════
  LOADER_TIMEOUT: 5000,
  STATS_ANIMATION_DURATION: 1500,
  
  // ══════ RETRY ══════
  RETRY_MAX: 3,
  RETRY_DELAY: 1000,
  RATE_LIMIT_THRESHOLD: 10,
  
  // ══════ REPO CATEGORIES ══════
  REPO_CATEGORIES: {
    web: ['website', 'web', 'frontend', 'backend', 'fullstack', 'api', 'app', 'react', 'vue', 'next', 'nuxt', 'portfolio', 'svelte', 'angular'],
    game: ['game', 'unity', 'godot', 'unreal', 'phaser', 'pixi', 'rpg', 'puzzle', 'platformer', 'visual-novel', 'renpy'],
    design: ['design', 'ui', 'ux', 'figma', 'illustration', '3d', 'blender', 'pixel', 'art', 'animation', 'motion'],
    tool: ['tool', 'cli', 'script', 'automation', 'bot', 'extension', 'plugin'],
    other: []
  },
  
  // ══════ VERSION ══════
  VERSION: GLOBAL.version || '2.4.1',
  BUILD_DATE: GLOBAL.buildDate || '2025-01-15',
};

// ══════ EXPORT ══════
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
}