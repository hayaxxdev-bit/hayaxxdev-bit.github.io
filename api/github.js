// api/github.js
const TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_API = 'https://api.github.com';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  
  // Health check
  if (req.query.action === 'health') {
    return res.status(200).json({ 
      status: 'ok', 
      token: TOKEN ? 'present' : 'missing' 
    });
  }

  const { username } = req.query;
  
  if (!username) {
    return res.status(400).json({ error: 'Username required' });
  }

  try {
    // Fetch repos dengan pagination (3 halaman)
    const repos = await fetchRepos(username);
    
    // Ambil README untuk setiap repo
    const reposWithReadme = await Promise.all(
      repos.map(async (repo) => {
        const readme = await fetchReadme(username, repo.name);
        return { ...repo, readme };
      })
    );

    return res.status(200).json(reposWithReadme);
  } catch (error) {
    console.error('GitHub API Error:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch repos',
      details: error.message 
    });
  }
}

async function fetchRepos(username) {
  const headers = TOKEN ? { Authorization: `token ${TOKEN}` } : {};
  const allRepos = [];
  
  // Fetch 3 pages (30 repos total)
  for (let page = 1; page <= 3; page++) {
    const url = `${GITHUB_API}/users/${username}/repos?per_page=10&page=${page}&sort=updated`;
    const response = await fetch(url, { headers });
    
    if (!response.ok) continue;
    
    const data = await response.json();
    allRepos.push(...data);
    
    if (data.length < 10) break; // Last page
  }
  
  return allRepos;
}

async function fetchReadme(username, repo) {
  const headers = TOKEN ? { Authorization: `token ${TOKEN}` } : {};
  
  try {
    // Coba dari GitHub API dulu
    const url = `${GITHUB_API}/repos/${username}/${repo}/readme`;
    const response = await fetch(url, { headers });
    
    if (!response.ok) {
      // Fallback ke raw.githubusercontent.com
      const rawUrl = `https://raw.githubusercontent.com/${username}/${repo}/main/README.md`;
      const rawResponse = await fetch(rawUrl);
      
      if (!rawResponse.ok) {
        // Coba branch master
        const masterUrl = `https://raw.githubusercontent.com/${username}/${repo}/master/README.md`;
        const masterResponse = await fetch(masterUrl);
        if (!masterResponse.ok) return null;
        return await masterResponse.text();
      }
      
      return await rawResponse.text();
    }
    
    const data = await response.json();
    // Decode base64 content
    return Buffer.from(data.content, 'base64').toString('utf-8');
  } catch (error) {
    console.log(`README fallback failed for ${repo}:`, error.message);
    return null;
  }
}
