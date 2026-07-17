// ════════════════════════════════════════════════════════════════
// API CONFIG - VERCEL SERVERLESS FUNCTION (FIXED)
// Path: /api/config.js
// ════════════════════════════════════════════════════════════════

// ── CORS Configuration ──
const ALLOWED_ORIGINS = [
  "https://hayaxxdev-bit.my.id",
  "https://hayaxxdev-bit.github.io",
  "https://hayaxxdev-bit-github-io.vercel.app",
  "http://localhost:5500",
  "http://localhost:3000",
  "http://127.0.0.1:5500",
  "http://127.0.0.1:3000",
  "null", // Untuk file:// protocol
];

// ── Response Helper with CORS ──
function createResponse(data, status = 200, extraHeaders = {}) {
  const origin = getRequestOrigin();
  
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0],
      "Access-Control-Allow-Methods": "GET, OPTIONS, POST",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, Accept",
      "Access-Control-Max-Age": "86400",
      "Access-Control-Allow-Credentials": "true",
      "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
      "Vary": "Origin",
      "X-Content-Type-Options": "nosniff",
      ...extraHeaders,
    },
  });
}

function getRequestOrigin() {
  // This will be set by the request context
  return globalThis._currentOrigin || "*";
}

// ── CORS Preflight Handler ──
function handleCORS(request) {
  const origin = request.headers.get("origin") || "";
  globalThis._currentOrigin = origin;
  
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0],
        "Access-Control-Allow-Methods": "GET, OPTIONS, POST",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, Accept",
        "Access-Control-Max-Age": "86400",
        "Access-Control-Allow-Credentials": "true",
        "Vary": "Origin",
      },
    });
  }
  return null;
}

// ── Main Handler ──
export default async function handler(request) {
  // Set origin untuk digunakan di response
  const origin = request.headers.get("origin") || "";
  globalThis._currentOrigin = origin;
  
  // Handle CORS preflight
  if (request.method === "OPTIONS") {
    return handleCORS(request);
  }
  
  // Parse URL
  const url = new URL(request.url);
  const path = url.pathname.replace(/\/+$/, "");
  const params = url.searchParams;
  
  // ── Health Check ──
  if (path === "/api/health" || path === "/api/ping") {
    return createResponse({
      success: true,
      status: "healthy",
      timestamp: new Date().toISOString(),
      version: "2.5.0",
      cors: true,
    });
  }
  
  // ── GitHub Proxy ──
  if (path === "/api/github") {
    const action = params.get("action");
    const username = params.get("username") || "hayaxxdev-bit";
    const repo = params.get("repo");
    
    if (!action) {
      return createResponse({ success: false, error: "Missing 'action' parameter" }, 400);
    }
    
    try {
      switch (action) {
        case "user":
        case "profile": {
          const response = await fetch(`https://api.github.com/users/${username}`, {
            headers: {
              "Accept": "application/vnd.github.v3+json",
              "User-Agent": "hayaxxdev-portfolio/2.5.0",
            },
          });
          
          if (!response.ok) {
            return createResponse({ success: false, error: `GitHub API: ${response.status}` }, response.status);
          }
          
          const data = await response.json();
          return createResponse({
            success: true,
            user: {
              login: data.login,
              name: data.name,
              avatar_url: data.avatar_url,
              bio: data.bio,
              public_repos: data.public_repos,
              followers: data.followers,
              following: data.following,
              created_at: data.created_at,
              updated_at: data.updated_at,
              html_url: data.html_url,
            },
          });
        }
        
        case "repos":
        case "repositories": {
          const allRepos = [];
          let page = 1;
          let hasMore = true;
          
          while (hasMore && page <= 3) { // Batasi max 3 halaman
            const response = await fetch(
              `https://api.github.com/users/${username}/repos?per_page=100&page=${page}&sort=updated`,
              {
                headers: {
                  "Accept": "application/vnd.github.v3+json",
                  "User-Agent": "hayaxxdev-portfolio/2.5.0",
                },
              }
            );
            
            if (!response.ok) break;
            
            const repos = await response.json();
            if (repos.length === 0) {
              hasMore = false;
            } else {
              allRepos.push(...repos);
              page++;
              hasMore = repos.length === 100;
            }
          }
          
          const normalized = allRepos.map(repo => ({
            id: repo.id,
            name: repo.name,
            full_name: repo.full_name,
            description: repo.description,
            language: repo.language,
            stargazers_count: repo.stargazers_count,
            forks_count: repo.forks_count,
            html_url: repo.html_url,
            homepage: repo.homepage,
            fork: repo.fork,
            has_pages: repo.has_pages,
            created_at: repo.created_at,
            updated_at: repo.updated_at,
            topics: repo.topics || [],
          }));
          
          return createResponse({
            success: true,
            repos: normalized,
            count: normalized.length,
          });
        }
        
        case "readme": {
          if (!repo) {
            return createResponse({ success: false, error: "Missing 'repo' parameter" }, 400);
          }
          
          // Coba ambil README dari GitHub API
          const readmeResponse = await fetch(
            `https://api.github.com/repos/${username}/${repo}/readme`,
            {
              headers: {
                "Accept": "application/vnd.github.v3.raw",
                "User-Agent": "hayaxxdev-portfolio/2.5.0",
              },
            }
          );
          
          if (readmeResponse.ok) {
            const readme = await readmeResponse.text();
            return createResponse({ success: true, readme });
          }
          
          // Fallback: coba raw.githubusercontent.com
          const branches = ["main", "master"];
          for (const branch of branches) {
            const rawResponse = await fetch(
              `https://raw.githubusercontent.com/${username}/${repo}/${branch}/README.md`
            );
            if (rawResponse.ok) {
              const readme = await rawResponse.text();
              return createResponse({ success: true, readme });
            }
          }
          
          return createResponse({ success: false, error: "README not found" }, 404);
        }
        
        case "commits": {
          // Estimasi dari events
          const eventsResponse = await fetch(
            `https://api.github.com/users/${username}/events/public?per_page=100`,
            {
              headers: {
                "Accept": "application/vnd.github.v3+json",
                "User-Agent": "hayaxxdev-portfolio/2.5.0",
              },
            }
          );
          
          let totalCommits = 0;
          if (eventsResponse.ok) {
            const events = await eventsResponse.json();
            const pushEvents = events.filter(e => e.type === "PushEvent");
            totalCommits = pushEvents.reduce((sum, e) => sum + (e.payload?.commits?.length || 0), 0);
          }
          
          return createResponse({ success: true, total_commits: totalCommits });
        }
        
        default:
          return createResponse({ success: false, error: `Unknown action: ${action}` }, 400);
      }
    } catch (error) {
      return createResponse({ success: false, error: error.message }, 500);
    }
  }
  
  return createResponse({ success: false, error: "Not Found" }, 404);
}