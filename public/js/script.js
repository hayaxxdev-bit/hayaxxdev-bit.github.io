// public/js/script.js
async function fetchGitHubData() {
  const cacheKey = 'github_data';
  const cached = localStorage.getItem(cacheKey);
  
  if (cached) {
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp < CONFIG.CACHE_DURATION) {
      return data;
    }
  }

  try {
    const url = `${CONFIG.CUSTOM_API_BASE}?username=${CONFIG.GITHUB_USERNAME}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    
    // Cache data
    localStorage.setItem(cacheKey, JSON.stringify({
      data,
      timestamp: Date.now()
    }));
    
    return data;
  } catch (error) {
    console.error('Failed to fetch GitHub data:', error);
    // Fallback ke cached data jika ada
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      return JSON.parse(cached).data;
    }
    return [];
  }
}
