export default {
  async fetch(request, env, ctx) {
    // 1. Tangani preflight request CORS (OPTIONS) yang biasa dikirim browser
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*", // Bisa diganti dengan domain web statismu agar lebih aman
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
          "Access-Control-Max-Age": "86400",
        },
      });
    }

    // 2. Ambil path dari URL request (misal: /repos/hayaxx/repo-name)
    const url = new URL(request.url);
    const targetPath = url.pathname; 

    // Mencegah request kosong ke root proxy
    if (targetPath === "/" || targetPath === "") {
      return new Response(JSON.stringify({ message: "GitHub Proxy Online" }), {
        status: 200,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }

    // 3. Susun URL tujuan ke GitHub API resmi
    const githubApiUrl = `https://api.github.com${targetPath}${url.search}`;

    try {
      // 4. Salin header asli dan sisipkan GITHUB_TOKEN dari Environment Variable Cloudflare
      const headers = new Headers(request.headers);
      headers.set("User-Agent", "Cloudflare-Worker-GitHub-Proxy");
      
      if (env.GITHUB_TOKEN) {
        headers.set("Authorization", `Bearer ${env.GITHUB_TOKEN}`);
      }

      // 5. Tembak ke GitHub API
      const githubResponse = await fetch(githubApiUrl, {
        method: request.method,
        headers: headers,
        body: request.method !== "GET" && request.method !== "HEAD" ? request.body : undefined,
      });

      // 6. Kembalikan data dari GitHub ke Frontend + tambahkan header CORS
      const responseHeaders = new Headers(githubResponse.headers);
      responseHeaders.set("Access-Control-Allow-Origin", "*");
      responseHeaders.set("Access-Control-Expose-Headers", "Link, X-RateLimit-Limit, X-RateLimit-Remaining");

      return new Response(githubResponse.body, {
        status: githubResponse.status,
        statusText: githubResponse.statusText,
        headers: responseHeaders,
      });

    } catch (error) {
      return new Response(JSON.stringify({ error: "Proxy Error", details: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }
  },
};