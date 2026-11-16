/**
 * Sumber data UTAMA untuk bagian "Karya" (ditulis manual).
 * GitHub hanya melengkapi angka (stars, forks, bahasa, update terakhir)
 * untuk proyek yang punya field `repo`.
 *
 * Cara menambah karya: tambahkan satu objek ke PROJECTS.
 * Foto: public/assets/image/projects/<nama-file> (rekomendasi 1200x675 WebP).
 */

import type { FandomId, Project, ProjectType } from '../types/project';

export const TYPE_LABELS: Record<ProjectType, string> = {
  app: 'App',
  game: 'Game',
  library: 'Library',
  web: 'Web',
  tool: 'Tool',
};

export const FANDOM_LABELS: Record<FandomId, string> = {
  bofuri: 'Bofuri',
};

export const PROJECTS: readonly Project[] = [
  {
    id: 'maple-vault',
    title: "Maple's Vault",
    type: 'web',
    fandom: 'bofuri',
    featured: true,
    description: {
      id: 'Arsip karakter dan proyek fan dalam satu koleksi interaktif.',
      en: 'A character and fan-project archive in one interactive collection.',
    },
    image: 'maple-vault.webp',
    demoUrl: 'html/maple/index.html',
    // repo: 'hayaxxdev-bit/NAMA-REPO',  ← isi nama repo asli agar statistik GitHub muncul
  },
  {
    id: 'maple-odyssey',
    title: "Maple's Odyssey",
    type: 'game',
    fandom: 'bofuri',
    description: {
      id: 'Petualangan web bertema Bofuri dengan sistem karakter dan skill.',
      en: 'A Bofuri-themed web adventure with a character and skill system.',
    },
    image: 'maple-odyssey.webp',
    demoUrl: 'html/maple/index.html',
  },
  {
    id: 'syrup-adventure',
    title: "Syrup's Adventure",
    type: 'game',
    fandom: 'bofuri',
    description: {
      id: 'Mini-game ringan yang berjalan mulus di desktop dan mobile.',
      en: 'A lightweight mini-game that runs smoothly on desktop and mobile.',
    },
    image: 'syrup-adventure.webp',
    demoUrl: 'html/maple/index.html',
  },
  {
    id: 'nexovra',
    title: 'Nexovra',
    type: 'app',
    description: {
      id: 'Dashboard keuangan pribadi dengan desain glassmorphism.',
      en: 'A personal finance dashboard with a glassmorphism design.',
    },
    image: 'nexovra.webp',
    // repo: 'hayaxxdev-bit/NAMA-REPO',
  },
  {
    id: 'fileshare-hub',
    title: 'FileShare Hub',
    type: 'app',
    description: {
      id: 'Aplikasi berbagi file berbasis React dengan backend serverless.',
      en: 'A React file-sharing app with a serverless backend.',
    },
    image: 'fileshare-hub.webp',
    // repo: 'hayaxxdev-bit/NAMA-REPO',
  },
  {
    id: 'wa-multidevice',
    title: 'WA Multi-Device',
    type: 'library',
    description: {
      id: 'Wrapper WhatsApp Web Multi-Device untuk integrasi game.',
      en: 'A WhatsApp Web Multi-Device wrapper for game integration.',
    },
    image: 'wa-multidevice.webp',
    // repo: 'hayaxxdev-bit/NAMA-REPO',
  },
];