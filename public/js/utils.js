// js/utils.js
function timeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  
  const intervals = [
    { label: 'tahun', seconds: 31536000 },
    { label: 'bulan', seconds: 2592000 },
    { label: 'minggu', seconds: 604800 },
    { label: 'hari', seconds: 86400 },
    { label: 'jam', seconds: 3600 },
    { label: 'menit', seconds: 60 }
  ];
  
  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label} lalu`;
    }
  }
  
  return 'baru saja';
}

function getLanguageColor(language) {
  const colors = {
    JavaScript: '#f7df1e',
    TypeScript: '#3178c6',
    Python: '#3776ab',
    HTML: '#e34f26',
    CSS: '#563d7c',
    PHP: '#777bb4',
    Ruby: '#cc342d',
    Go: '#00add8',
    Rust: '#dea584',
    Java: '#b07219',
    'C++': '#f34b7d',
    C: '#555555',
    'C#': '#178600',
    Swift: '#ffac45',
    Kotlin: '#A97BFF',
    Dart: '#00B4AB',
  };
  return colors[language] || '#8b8b8b';
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}