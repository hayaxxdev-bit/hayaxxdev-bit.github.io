/**
 * GitHub API Service - Enhanced with caching & error handling
 * @module githubService
 */
class GitHubService {
  constructor(username) {
    this.username = username;
    this.baseURL = 'https://api.github.com';
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes cache
  }

  /**
   * Fetch repositories with enhanced metadata
   * @param {Object} options - Fetch options
   * @returns {Promise<Array>} Enhanced repository data
   */
  async fetchRepositories(options = {}) {
    const { 
      sort = 'updated', 
      perPage = 30, 
      forceRefresh = false 
    } = options;

    // Check cache
    const cacheKey = `repos_${sort}_${perPage}`;
    if (!forceRefresh && this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data;
      }
    }

    try {
      const response = await fetch(
        `${this.baseURL}/users/${this.username}/repos?sort=${sort}&per_page=${perPage}&type=owner`,
        {
          headers: {
            'Accept': 'application/vnd.github.v3+json',
            // Add token if available
            ...(this.token && { 'Authorization': `token ${this.token}` })
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const repos = await response.json();
      
      // Enhance repos with additional metadata
      const enhancedRepos = await this.enhanceRepositoryData(repos);
      
      // Cache the result
      this.cache.set(cacheKey, {
        data: enhancedRepos,
        timestamp: Date.now()
      });

      return enhancedRepos;
    } catch (error) {
      console.error('GitHub API Error:', error);
      throw error;
    }
  }

  /**
   * Enhance repository data with additional metadata
   * @param {Array} repos - Raw repository data
   * @returns {Promise<Array>} Enhanced repository data
   */
  async enhanceRepositoryData(repos) {
    const languageColors = {
      JavaScript: '#f7df1e',
      TypeScript: '#3178c6',
      Python: '#3776ab',
      HTML: '#e34f26',
      CSS: '#1572b6',
      Java: '#b07219',
      PHP: '#4f5d95',
      Ruby: '#cc342d',
      Go: '#00add8',
      Rust: '#dea584',
      Swift: '#f05138',
      Kotlin: '#a97bff',
      Dart: '#00b4ab',
      'C++': '#f34b7d',
      'C#': '#178600',
      Vue: '#42b883',
      React: '#61dafb',
    };

    return repos.map(repo => ({
      // Basic info
      id: repo.id,
      name: repo.name,
      fullName: repo.full_name,
      description: repo.description || 'No description available',
      url: repo.html_url,
      
      // Metadata
      language: repo.language || 'N/A',
      languageColor: languageColors[repo.language] || '#858585',
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      watchers: repo.watchers_count,
      topics: repo.topics || [],
      
      // Dates
      createdAt: repo.created_at,
      updatedAt: repo.updated_at,
      pushedAt: repo.pushed_at,
      lastUpdateRelative: this.getRelativeTime(repo.updated_at),
      
      // Deployment
      hasPages: repo.has_pages,
      homepage: repo.homepage || (repo.has_pages ? 
        `https://${this.username}.github.io/${repo.name}` : null),
      
      // Stats
      isFork: repo.fork,
      isArchived: repo.archived,
      openIssues: repo.open_issues_count,
      defaultBranch: repo.default_branch,
      
      // License
      license: repo.license ? repo.license.spdx_id : null,
    }));
  }

  /**
   * Get relative time string
   * @param {string} dateString - ISO date string
   * @returns {string} Relative time (e.g., "3 days ago")
   */
  getRelativeTime(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffWeeks = Math.floor(diffDays / 7);
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffDays / 365);

    if (diffSeconds < 60) return 'just now';
    if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    if (diffWeeks < 4) return `${diffWeeks} week${diffWeeks > 1 ? 's' : ''} ago`;
    if (diffMonths < 12) return `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`;
    return `${diffYears} year${diffYears > 1 ? 's' : ''} ago`;
  }

  /**
   * Fetch user profile statistics
   * @returns {Promise<Object>} User statistics
   */
  async fetchUserStats() {
    try {
      const response = await fetch(`${this.baseURL}/users/${this.username}`);
      if (!response.ok) throw new Error('Failed to fetch user stats');
      
      const data = await response.json();
      return {
        followers: data.followers,
        following: data.following,
        publicRepos: data.public_repos,
        publicGists: data.public_gists,
        createdAt: data.created_at,
        bio: data.bio,
        company: data.company,
        location: data.location,
        blog: data.blog,
        avatarUrl: data.avatar_url,
      };
    } catch (error) {
      console.error('Failed to fetch user stats:', error);
      return null;
    }
  }

  /**
   * Clear all cached data
   */
  clearCache() {
    this.cache.clear();
  }
}

// Export for use in other modules
export default GitHubService;