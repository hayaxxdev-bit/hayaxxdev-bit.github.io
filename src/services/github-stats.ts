/**
 * Mengambil statistik repo lewat endpoint serverless sendiri (/api/github-repos),
 * BUKAN langsung ke api.github.com. Alasannya: token tetap di server,
 * tidak kena batas 60 request/jam per IP, dan hasilnya di-cache di edge.
 *
 * Jika gagal (offline, endpoint tidak ada, timeout), mengembalikan {} —
 * kartu karya tetap tampil lengkap dari data manual.
 */

import type { RepoStats } from '../types/project';

const ENDPOINT = '/api/github-repos';
const CACHE_KEY = 'gh-stats-v1';
const CACHE_TTL_MS = 10 * 60 * 1000;
const TIMEOUT_MS = 6000;

type StatsMap = Record<string, RepoStats>;

interface CacheEntry {
  key: string;
  savedAt: number;
  data: StatsMap;
}

function isRepoStats(value: unknown): value is RepoStats {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.stars === 'number' &&
    typeof v.forks === 'number' &&
    (typeof v.language === 'string' || v.language === null) &&
    typeof v.pushedAt === 'string'
  );
}

function sanitize(raw: unknown): StatsMap {
  const result: StatsMap = {};
  if (typeof raw !== 'object' || raw === null) return result;
  for (const [repo, stats] of Object.entries(raw)) {
    if (isRepoStats(stats)) result[repo] = stats;
  }
  return result;
}

function readCache(key: string): StatsMap | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const entry = JSON.parse(raw) as CacheEntry;
    if (entry.key !== key || Date.now() - entry.savedAt > CACHE_TTL_MS) return null;
    return sanitize(entry.data);
  } catch {
    return null;
  }
}

function writeCache(key: string, data: StatsMap): void {
  try {
    const entry: CacheEntry = { key, savedAt: Date.now(), data };
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(entry));
  } catch {
    /* storage penuh / dimatikan: abaikan */
  }
}

export async function fetchRepoStats(repos: readonly string[]): Promise<StatsMap> {
  const unique = [...new Set(repos)].sort();
  if (unique.length === 0) return {};

  const key = unique.join(',');
  const cached = readCache(key);
  if (cached) return cached;

  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(`${ENDPOINT}?repos=${encodeURIComponent(key)}`, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    if (!response.ok) return {};

    const data = sanitize(await response.json());
    writeCache(key, data);
    return data;
  } catch {
    return {};
  } finally {
    window.clearTimeout(timer);
  }
}