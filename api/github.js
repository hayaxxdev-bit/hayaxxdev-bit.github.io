// api/github.js

const GITHUB_API = "https://api.github.com";

export default async function handler(req, res) {
  const allowedOrigins = [
    "https://hayaxxdev-bit.github.io",
    "https://hayaxxdev-bit.my.id",
    "http://localhost:5500",
    "http://localhost:3000",
  ];

  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed",
    });
  }

  const username = req.query.username || "hayaxxdev-bit";
  const action = req.query.action || "repos";
  const repo = req.query.repo;

  try {
    let githubURL;
    let headers = {
      Accept: "application/vnd.github+json",
      "User-Agent": "hayaxxdev-portfolio",
    };

    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    switch (action) {
      case "repos":
        githubURL =
          `${GITHUB_API}/users/${username}/repos` +
          "?sort=updated&per_page=100";
        break;

      case "user":
        githubURL =
          `${GITHUB_API}/users/${username}`;
        break;

      case "readme":
        if (!repo) {
          return res.status(400).json({
            success: false,
            error: "repo parameter required",
          });
        }

        githubURL =
          `${GITHUB_API}/repos/${username}/${repo}/readme`;

        headers.Accept =
          "application/vnd.github.raw";
        break;

      case "commits":
        githubURL =
          `${GITHUB_API}/users/${username}/events/public`;
        break;

      default:
        return res.status(400).json({
          success: false,
          error: "Unknown action",
        });
    }

    const response = await fetch(githubURL, {
      headers,
    });

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        error: await response.text(),
      });
    }

    if (action === "readme") {
      const text = await response.text();

      return res.status(200).send(text);
    }

    const data = await response.json();

    if (action === "repos") {
      return res.status(200).json({
        success: true,
        repos: data.map((repo) => ({
          id: repo.id,
          name: repo.name,
          description: repo.description,
          language: repo.language,
          homepage: repo.homepage,
          html_url: repo.html_url,
          stargazers_count: repo.stargazers_count,
          forks_count: repo.forks_count,
          has_pages: repo.has_pages,
          topics: repo.topics,
          created_at: repo.created_at,
          updated_at: repo.updated_at,
          fork: repo.fork,
          size: repo.size,
        })),
      });
    }

    if (action === "user") {
      return res.status(200).json({
        success: true,
        user: data,
      });
    }

    if (action === "commits") {
      const total = data
        .filter((e) => e.type === "PushEvent")
        .reduce(
          (sum, e) =>
            sum + (e.payload?.commits?.length || 0),
          0
        );

      return res.status(200).json({
        success: true,
        total_commits: total,
        events: data,
      });
    }
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
}