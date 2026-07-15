// api/repos.js
// Backend API untuk mengambil data GitHub dengan autentikasi
// Menggunakan Vercel Serverless Functions

export default async function handler(req, res) {
  // Set CORS headers - Izinkan akses dari domain GitHub Pages
  const allowedOrigins = [
    'https://hayaxxdev-bit.github.io',
    'https://hayaxxdev-bit.my.id',
    'http://localhost:3000',
    'http://localhost:5500'
  ];
  
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Hanya izinkan GET request
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Cache headers
  res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=300');

  try {
    const { username, all } = req.query;
    const githubUsername = username || 'hayaxxdev-bit';
    
    console.log(`Fetching repos for: ${githubUsername}`);
    
    // Fetch repos dari GitHub API
    const url = `https://api.github.com/users/${githubUsername}/repos?sort=updated&per_page=100`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `token ${process.env.GITHUB_TOKEN}`,
        'User-Agent': 'hayaxxdev-portfolio',
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (!response.ok) {
      console.error(`GitHub API error: ${response.status}`);
      throw new Error(`GitHub API returned ${response.status}`);
    }

    const repos = await response.json();
    
    // Transform data
    const transformedRepos = repos.map(repo => ({
      id: repo.id,
      name: repo.name,
      description: repo.description,
      language: repo.language,
      stargazers_count: repo.stargazers_count,
      forks_count: repo.forks_count,
      html_url: repo.html_url,
      homepage: repo.homepage,
      has_pages: repo.has_pages,
      updated_at: repo.updated_at,
      created_at: repo.created_at,
      topics: repo.topics || [],
      fork: repo.fork,
      size: repo.size
    }));

    return res.status(200).json({
      success: true,
      username: githubUsername,
      total: transformedRepos.length,
      repos: transformedRepos
    });

  } catch (error) {
    console.error('Error fetching repos:', error);
    return res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
}