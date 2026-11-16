/**
 * Tipe data untuk bagian "Karya".
 * Jika src/types/project.ts lamamu berisi tipe lain, gabungkan saja.
 */

export type LangCode = 'id' | 'en' | 'ja' | 'ko';

/** Teks multibahasa: `id` wajib, bahasa lain opsional (fallback: en lalu id). */
export type LocalizedText = { id: string } & Partial<Record<Exclude<LangCode, 'id'>, string>>;

export type ProjectType = 'app' | 'game' | 'library' | 'web' | 'tool';

/** Tambahkan fandom baru di sini lalu di FANDOM_LABELS (src/data/projects.ts). */
export type FandomId = 'bofuri';

/** Format "owner/nama-repo". */
export type RepoSlug = `${string}/${string}`;

export interface Project {
  id: string;
  title: string;
  description: LocalizedText;
  type: ProjectType;
  /** Kosongkan untuk proyek tanpa fandom. */
  fandom?: FandomId;
  /** Nama file di public/assets/image/projects/ (mis. 'nexovra.webp'). */
  image?: string;
  /** Isi agar statistik GitHub (stars, forks, bahasa, update) muncul. */
  repo?: RepoSlug;
  /** URL penuh (https://...) atau path relatif dari root situs. */
  demoUrl?: string;
  featured?: boolean;
}

/** Data hasil pengayaan dari GitHub. */
export interface RepoStats {
  stars: number;
  forks: number;
  language: string | null;
  /** ISO 8601 */
  pushedAt: string;
}