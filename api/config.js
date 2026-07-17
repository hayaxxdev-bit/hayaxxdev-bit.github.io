// ═══════════════════════════════════════════
// API CONFIG - FIXED CORS
// ═══════════════════════════════════════════

// Daftar origin yang DIIZINKAN
const ALLOWED_ORIGINS = [
  "https://hayaxxdev-bit.my.id",
  "https://hayaxxdev-bit.github.io",
  "https://hayaxxdev-bit-github-io.vercel.app",
  "http://localhost:5500",
  "http://localhost:3000",
  "http://127.0.0.1:5500",
  "http://127.0.0.1:3000",
];

export default async function handler(request) {
  const origin = request.headers.get("origin") || "";
  
  // ⚠️ Tentukan apakah origin diizinkan
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin) 
    ? origin 
    : ALLOWED_ORIGINS[0]; // Fallback ke production origin
  
  // ⚠️ CORS Headers untuk SEMUA response
  const corsHeaders = {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, Accept",
    "Access-Control-Max-Age": "86400",
    "Access-Control-Allow-Credentials": "true",
    "Vary": "Origin",
  };
  
  // Handle CORS preflight
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }
  
  const url = new URL(request.url);
  const path = url.pathname.replace(/\/+$/, "");
  const params = url.searchParams;
  
  // Health check
  if (path === "/api/health" || path === "/api/ping") {
    return new Response(JSON.stringify({
      success: true,
      status: "healthy",
      version: "2.5.0",
      allowedOrigin,
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
  
  // GitHub proxy
  if (path === "/api/github") {
    const action = params.get("action");
    const username = params.get("username") || "hayaxxdev-bit";
    const repo = params.get("repo");
    
    if (!action) {
      return new Response(JSON.stringify({ success: false, error: "Missing action" }), 
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    
    try {
      switch (action) {
        case "repos":
        case "repositories": {
          const allRepos = [];
          let page = 1;
          let hasMore = true;
          
          while (hasMore && page <= 3) {
            const response = await fetch(
              `https://api.github.com/users/${username}/repos?per_page=100&page=${page}&sort=updated`
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
            size: repo.size || 0,
          }));
          
          return new Response(JSON.stringify({
            success: true,
            repos: normalized,
            count: normalized.length,
          }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
        }
        
        case "user":
        case "profile": {
          const response = await fetch(`https://api.github.com/users/${username}`);
          const user = await response.json();
          
          return new Response(JSON.stringify({
            success: true,
            user: {
              login: user.login,
              name: user.name,
              avatar_url: user.avatar_url,
              bio: user.bio,
              public_repos: user.public_repos,
              created_at: user.created_at,
              updated_at: user.updated_at,
              html_url: user.html_url,
            },
          }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
        }
        
        case "readme": {
          if (!repo) {
            return new Response(JSON.stringify({ success: false, error: "Missing repo" }), 
              { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
          }
          
          // Coba GitHub API dulu
          const apiResponse = await fetch(
            `https://api.github.com/repos/${username}/${repo}/readme`,
            { headers: { Accept: "application/vnd.github.v3.raw" } }
          );
          
          if (apiResponse.ok) {
            const readme = await apiResponse.text();
            return new Response(JSON.stringify({ success: true, readme }), 
              { headers: { ...corsHeaders, "Content-Type": "application/json" } });
          }
          
          // Fallback: coba raw (hanya main/master)
          for (const branch of ["main", "master"]) {
            const rawResponse = await fetch(
              `https://raw.githubusercontent.com/${username}/${repo}/${branch}/README.md`
            );
            if (rawResponse.ok) {
              const readme = await rawResponse.text();
              return new Response(JSON.stringify({ success: true, readme }), 
                { headers: { ...corsHeaders, "Content-Type": "application/json" } });
            }
          }
          
          return new Response(JSON.stringify({ success: false, error: "README not found" }), 
            { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        }
        
        case "commits": {
          const response = await fetch(
            `https://api.github.com/users/${username}/events/public?per_page=100`
          );
          
          let totalCommits = 0;
          if (response.ok) {
            const events = await response.json();
            const pushEvents = events.filter(e => e.type === "PushEvent");
            totalCommits = pushEvents.reduce((sum, e) => sum + (e.payload?.commits?.length || 0), 0);
          }
          
          return new Response(JSON.stringify({ success: true, total_commits: totalCommits }), 
            { headers: { ...corsHeaders, "Content-Type": "application/json" } });
        }
        
        default:
          return new Response(JSON.stringify({ success: false, error: `Unknown action: ${action}` }), 
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
    } catch (error) {
      return new Response(JSON.stringify({ success: false, error: error.message }), 
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
  }
  
  // 404
  return new Response(JSON.stringify({ success: false, error: "Not Found" }), 
    { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } });
}