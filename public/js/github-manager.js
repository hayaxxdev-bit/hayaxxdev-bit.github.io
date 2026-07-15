// js/github-manager.js
class GitHubManager {
  constructor(username) {
    this.username = username;
    this.repos = [];
    this.cacheKey = `github_repos_${username}`;
    this.totalCommits = 0;
  }

  async fetchAllData() {
    try {
      // Cek cache dulu
      const cached = this._getFromCache();
      if (cached) {
        this.repos = cached.repos;
        this.totalCommits = cached.totalCommits;
        return cached;
      }

      // Fetch repos
      const repos = await this._fetchRepos();
      
      // Sort: featured dulu, lalu by stars
      repos.sort((a, b) => {
        const aFeatured = this._isFeatured(a) ? 1 : 0;
        const bFeatured = this._isFeatured(b) ? 1 : 0;
        if (bFeatured !== aFeatured) return bFeatured - aFeatured;
        return b.stargazers_count - a.stargazers_count;
      });

      // Fetch total commits
      let totalCommits = 0;
      try {
        const events = await this._fetchEvents();
        totalCommits = events
          .filter(e => e.type === 'PushEvent')
          .reduce((sum, e) => sum + (e.payload?.commits?.length || 0), 0);
      } catch (e) {
        console.warn('Failed to fetch commits count');
      }

      this.repos = repos;
      this.totalCommits = totalCommits;

      // Simpan ke cache
      this._saveToCache({ repos, totalCommits });

      return { repos, totalCommits };
    } catch (error) {
      console.error('GitHub fetch error:', error);
      throw error;
    }
  }

  async _fetchRepos() {
    const response = await fetch(
      `${CONFIG.GITHUB_API_URL}/users/${this.username}/repos?per_page=${CONFIG.PER_PAGE}&sort=updated&type=owner`
    );
    
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const repos = await response.json();
    
    // Fetch README untuk setiap repo
    const reposWithReadme = await Promise.all(
      repos.map(async (repo) => {
        try {
          const readme = await this._fetchReadme(repo.name);
          return { ...repo, readme, has_pages: repo.has_pages || !!repo.homepage };
        } catch {
          return { ...repo, readme: null, has_pages: repo.has_pages || !!repo.homepage };
        }
      })
    );

    return reposWithReadme;
  }

  async _fetchReadme(repoName) {
    try {
      const response = await fetch(
        `${CONFIG.GITHUB_API_URL}/repos/${this.username}/${repoName}/readme`,
        { headers: { Accept: 'application/vnd.github.v3.raw' } }
      );
      
      if (!response.ok) return null;
      
      return await response.text();
    } catch {
      return null;
    }
  }

  async _fetchEvents() {
    const response = await fetch(
      `${CONFIG.GITHUB_API_URL}/users/${this.username}/events/public?per_page=100`
    );
    
    if (!response.ok) return [];
    
    return await response.json();
  }

  _isFeatured(repo) {
    const featuredKeywords = ['nexovra', 'portfolio', 'game', 'bot', 'app', 'web', 'tool'];
    const name = repo.name.toLowerCase();
    const desc = (repo.description || '').toLowerCase();
    
    return featuredKeywords.some(keyword => 
      name.includes(keyword) || desc.includes(keyword)
    );
  }

  getFeaturedRepos(count = CONFIG.FEATURED_COUNT) {
    return this.repos.slice(0, count);
  }

  getFilteredRepos(filter) {
    if (filter === 'all') return this.repos;
    return this.repos.filter(repo => this.categorizeRepo(repo) === filter);
  }

  categorizeRepo(repo) {
    const text = `${repo.name} ${repo.description || ''} ${repo.topics?.join(' ') || ''}`.toLowerCase();
    
    for (const [category, keywords] of Object.entries(CONFIG.REPO_CATEGORIES)) {
      if (category === 'other') continue;
      if (keywords.some(keyword => text.includes(keyword))) {
        return category;
      }
    }
    
    return 'other';
  }

  _getFromCache() {
    try {
      const cached = localStorage.getItem(this.cacheKey);
      if (!cached) return null;
      
      const data = JSON.parse(cached);
      if (Date.now() - data.timestamp > CONFIG.CACHE_DURATION) {
        localStorage.removeItem(this.cacheKey);
        return null;
      }
      
      return data.data;
    } catch {
      return null;
    }
  }

  _saveToCache(data) {
    try {
      localStorage.setItem(this.cacheKey, JSON.stringify({
        timestamp: Date.now(),
        data
      }));
    } catch (e) {
      console.warn('Cache save failed');
    }
  }
}