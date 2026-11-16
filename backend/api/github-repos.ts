/**
 * Vercel Serverless Function: GET /api/github-repos?repos=owner/a,owner/b
 *
 * - Hanya repo milik ALLOWED_OWNER yang diizinkan (agar bukan proxy terbuka).
 * - GITHUB_TOKEN (opsional) di Environment Variables Vercel menaikkan batas
 *   dari 60 ke 5000 request/jam. Cukup token read-only untuk repo publik.
 * - Respons di-cache di edge 1 jam (s-maxage) + stale-while-revalidate 1 hari.
 */

const ALLOWED_OWNER = 'hayaxxdev-bit';
const REPO_PATTERN = /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/;
const MAX_REPOS = 20;
const GITHUB_TIMEOUT_MS = 5000;

interface ApiRequest {
  query: Record<string, string | string[] | undefined>;
}

interface ApiResponse {
  status(code: number): ApiResponse;
  setHeader(name: string, value: string): void;
  json(body: unknown): void;
}

interface GitHubRepoPayload {
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  pushed_at: string;
}

interface RepoStats {
  stars: number;
  forks: number;
  language: string | null;
  pushedAt: string;
}

async function fetchRepo(repo: string, token: string | undefined): Promise<RepoStats | null> {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'hayaxxdev-portfolio',
    'X-GitHub-Api-Version': '2022-11-28',
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  try {
    const response = await fetch(`https://api.github.com/repos/${repo}`, {
      headers,
      signal: AbortSignal.timeout(GITHUB_TIMEOUT_MS),
    });
    if (!response.ok) return null;

    const data = (await response.json()) as GitHubRepoPayload;
    return {
      stars: data.stargazers_count,
      forks: data.forks_count,
      language: data.language,
      pushedAt: data.pushed_at,
    };
  } catch {
    return null;
  }
}

export default async function handler(req: ApiRequest, res: ApiResponse): Promise<void> {
  const raw = req.query.repos;
  const joined = Array.isArray(raw) ? raw.join(',') : (raw ?? '');

  const repos = [...new Set(joined.split(',').map((item) => item.trim()).filter(Boolean))];

  if (repos.length === 0 || repos.length > MAX_REPOS) {
    res.status(400).json({ error: `Berikan 1-${MAX_REPOS} repo, contoh: ?repos=owner/nama` });
    return;
  }

  const allValid = repos.every(
    (repo) =>
      REPO_PATTERN.test(repo) && repo.split('/')[0].toLowerCase() === ALLOWED_OWNER.toLowerCase(),
  );
  if (!allValid) {
    res.status(400).json({ error: 'Format repo tidak valid atau owner tidak diizinkan.' });
    return;
  }

  const token = process.env.GITHUB_TOKEN;
  const results = await Promise.all(repos.map((repo) => fetchRepo(repo, token)));

  const body: Record<string, RepoStats> = {};
  repos.forEach((repo, index) => {
    const stats = results[index];
    if (stats) body[repo] = stats;
  });

  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
  res.status(200).json(body);
}