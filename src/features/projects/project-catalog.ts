/**
 * Bagian "Karya": render kartu dari data manual, filter tipe/fandom,
 * lalu lengkapi statistik GitHub secara asinkron.
 * Hanya logika. Tampilan ada di src/styles/pages/pages.css dan states.css.
 *
 * State UI (markup ada di index.html):
 *  - loading : skeleton di #project-grid, diganti saat render selesai
 *  - empty   : #project-empty (filter tidak menghasilkan karya)
 *  - error   : #project-error (render gagal), dengan tombol coba lagi
 *
 * Setelah render, event `catalog:rendered` dikirim supaya interactions.ts
 * bisa memasang tilt pada kartu yang baru dibuat.
 */

import { FANDOM_LABELS, PROJECTS, TYPE_LABELS } from '../../data/projects';
import { fetchRepoStats } from '../../services/github-stats';
import type {
  FandomId,
  LangCode,
  LocalizedText,
  Project,
  ProjectType,
  RepoStats,
} from '../../types/project';

type FilterValue<T> = T | 'all';

interface FilterState {
  type: FilterValue<ProjectType>;
  fandom: FilterValue<FandomId>;
}

interface UiStrings {
  all: string;
  typeLabel: string;
  fandomLabel: string;
  featured: string;
  demo: string;
  code: string;
  updated: string;
  emptyTitle: string;
  emptyText: string;
  resetFilters: string;
  errorTitle: string;
  errorText: string;
  retry: string;
  count: (shown: number, total: number) => string;
}

interface FilterGroup {
  element: HTMLElement;
  reset: () => void;
}

interface CatalogElements {
  grid: HTMLElement;
  filtersRoot: HTMLElement | null;
  countText: HTMLElement | null;
  emptyState: HTMLElement | null;
  errorState: HTMLElement | null;
  resetButton: HTMLElement | null;
  retryButton: HTMLElement | null;
}

const BASE_URL = import.meta.env.BASE_URL;
const SUPPORTED_LANGS: readonly LangCode[] = ['id', 'en', 'ja', 'ko'];
const CATALOG_RENDERED_EVENT = 'catalog:rendered';

const STRINGS: Record<'id' | 'en', UiStrings> = {
  id: {
    all: 'Semua',
    typeLabel: 'Tipe',
    fandomLabel: 'Fandom',
    featured: 'Unggulan',
    demo: 'Buka',
    code: 'Kode',
    updated: 'Update',
    emptyTitle: 'Belum ada karya di kategori ini',
    emptyText: 'Coba pilih filter lain, atau tampilkan semua karya.',
    resetFilters: 'Tampilkan semua karya',
    errorTitle: 'Karya belum bisa ditampilkan',
    errorText: 'Terjadi masalah saat menyiapkan daftar karya. Coba muat ulang.',
    retry: 'Muat ulang karya',
    count: (shown, total) => `Menampilkan ${shown} dari ${total} karya`,
  },
  en: {
    all: 'All',
    typeLabel: 'Type',
    fandomLabel: 'Fandom',
    featured: 'Featured',
    demo: 'Open',
    code: 'Code',
    updated: 'Updated',
    emptyTitle: 'No projects in this category yet',
    emptyText: 'Try a different filter, or show all projects.',
    resetFilters: 'Show all projects',
    errorTitle: "Projects couldn't be shown",
    errorText: 'Something went wrong while preparing the list. Please try again.',
    retry: 'Reload projects',
    count: (shown, total) => `Showing ${shown} of ${total} projects`,
  },
};

const RELATIVE_UNITS: ReadonlyArray<readonly [Intl.RelativeTimeFormatUnit, number]> = [
  ['year', 31_557_600_000],
  ['month', 2_629_800_000],
  ['week', 604_800_000],
  ['day', 86_400_000],
  ['hour', 3_600_000],
  ['minute', 60_000],
];

/* ---------- Helper umum ---------- */

function getLang(): LangCode {
  const code = document.documentElement.lang.slice(0, 2).toLowerCase();
  return SUPPORTED_LANGS.find((lang) => lang === code) ?? 'id';
}

function getStrings(lang: LangCode): UiStrings {
  return lang === 'id' ? STRINGS.id : STRINGS.en;
}

function pickText(text: LocalizedText, lang: LangCode): string {
  return text[lang] ?? text.en ?? text.id;
}

function isExternalUrl(url: string): boolean {
  return /^https?:\/\//i.test(url);
}

function resolveUrl(url: string): string {
  return isExternalUrl(url) ? url : `${BASE_URL}${url.replace(/^\//, '')}`;
}

function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string,
  text?: string,
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function formatRelative(iso: string, lang: LangCode): string {
  const target = new Date(iso).getTime();
  if (Number.isNaN(target)) return '';

  const diff = target - Date.now();
  const formatter = new Intl.RelativeTimeFormat(lang, { numeric: 'auto' });

  for (const [unit, ms] of RELATIVE_UNITS) {
    if (Math.abs(diff) >= ms) return formatter.format(Math.round(diff / ms), unit);
  }
  return formatter.format(0, 'minute');
}

/* ---------- Kartu ---------- */

function buildLink(label: string, href: string, primary: boolean): HTMLAnchorElement {
  const link = el('a', `project-card__btn${primary ? ' project-card__btn--primary' : ''}`, label);
  link.href = href;

  if (isExternalUrl(href)) {
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
  } else {
    link.setAttribute('data-warp', '');
  }
  return link;
}

function buildCard(
  project: Project,
  index: number,
  lang: LangCode,
  ui: UiStrings,
): { card: HTMLElement; stats: HTMLUListElement } {
  const card = el('article', 'card project-card is-visible');
  card.setAttribute('data-tilt', '');
  card.dataset.type = project.type;
  if (project.fandom) card.dataset.fandom = project.fandom;
  card.style.setProperty('--i', String(index));

  /* Media (foto + art cadangan di CSS) */
  const media = el('figure', 'project-card__media');
  media.setAttribute('aria-hidden', 'true');

  if (project.image) {
    const img = el('img', 'project-card__img');
    img.src = `${BASE_URL}assets/image/projects/${project.image}`;
    img.alt = '';
    img.loading = 'lazy';
    img.decoding = 'async';
    img.addEventListener('error', () => img.remove(), { once: true });
    media.appendChild(img);
  }

  if (project.featured) {
    media.appendChild(el('span', 'project-card__badge', ui.featured));
  }

  /* Badan */
  const body = el('div', 'project-card__body');

  const tags = el('div', 'project-card__tags');
  tags.appendChild(el('span', 'card__tag', TYPE_LABELS[project.type]));
  if (project.fandom) {
    tags.appendChild(el('span', 'project-card__fandom', FANDOM_LABELS[project.fandom]));
  }

  const title = el('h3', 'card__title', project.title);
  const text = el('p', 'card__text', pickText(project.description, lang));

  const stats = el('ul', 'project-card__stats');
  stats.hidden = true;

  const links = el('div', 'project-card__links');
  if (project.demoUrl) {
    links.appendChild(buildLink(ui.demo, resolveUrl(project.demoUrl), true));
  }
  if (project.repo) {
    links.appendChild(buildLink(ui.code, `https://github.com/${project.repo}`, !project.demoUrl));
  }

  body.append(tags, title, text, stats);
  if (links.childElementCount > 0) body.appendChild(links);

  card.append(media, body);
  return { card, stats };
}

function fillStats(
  list: HTMLUListElement,
  stats: RepoStats,
  lang: LangCode,
  ui: UiStrings,
): void {
  list.replaceChildren();

  const addItem = (text: string, label?: string, className?: string): void => {
    const item = el('li', className, text);
    if (label) item.setAttribute('aria-label', label);
    list.appendChild(item);
  };

  if (stats.stars > 0) addItem(`★ ${stats.stars}`, `${stats.stars} stars`);
  if (stats.forks > 0) addItem(`⑂ ${stats.forks}`, `${stats.forks} forks`);
  if (stats.language) addItem(stats.language, undefined, 'project-card__lang');

  const relative = formatRelative(stats.pushedAt, lang);
  if (relative) addItem(`${ui.updated} ${relative}`);

  list.hidden = list.childElementCount === 0;
}

/** Statistik GitHub hanya pelengkap: gagal = diam, kartu tetap tampil. */
function loadRepoStats(
  statsLists: ReadonlyMap<string, HTMLUListElement>,
  lang: LangCode,
  ui: UiStrings,
): void {
  const repos = [...statsLists.keys()];
  if (repos.length === 0) return;

  fetchRepoStats(repos)
    .then((data) => {
      for (const [repo, list] of statsLists) {
        const stats = data[repo];
        if (stats) fillStats(list, stats, lang, ui);
      }
    })
    .catch(() => {
      // Sengaja diabaikan.
    });
}

/* ---------- Filter ---------- */

function buildFilterGroup<T extends string>(
  label: string,
  allLabel: string,
  options: ReadonlyArray<{ value: T; label: string }>,
  onSelect: (value: FilterValue<T>) => void,
): FilterGroup {
  const group = el('div', 'projects__filter-group');
  group.setAttribute('role', 'group');
  group.setAttribute('aria-label', label);
  group.appendChild(el('span', 'projects__filter-label', label));

  const buttons: HTMLButtonElement[] = [];
  const entries: ReadonlyArray<{ value: FilterValue<T>; label: string }> = [
    { value: 'all', label: allLabel },
    ...options,
  ];

  for (const entry of entries) {
    const button = el('button', 'filter-chip', entry.label);
    button.type = 'button';
    button.setAttribute('aria-pressed', String(entry.value === 'all'));

    button.addEventListener('click', () => {
      for (const other of buttons) other.setAttribute('aria-pressed', String(other === button));
      onSelect(entry.value);
    });

    buttons.push(button);
    group.appendChild(button);
  }

  /** Mengembalikan tampilan ke "Semua" tanpa memanggil onSelect. */
  const reset = (): void => {
    buttons.forEach((button, position) => {
      button.setAttribute('aria-pressed', String(position === 0));
    });
  };

  return { element: group, reset };
}

function uniqueInOrder<T>(values: readonly T[]): T[] {
  return [...new Set(values)];
}

function buildFilters(
  root: HTMLElement,
  state: FilterState,
  ui: UiStrings,
  onChange: () => void,
): FilterGroup[] {
  const groups: FilterGroup[] = [];
  const types = uniqueInOrder(PROJECTS.map((project) => project.type));
  const fandoms = uniqueInOrder(
    PROJECTS.flatMap((project) => (project.fandom ? [project.fandom] : [])),
  );

  root.replaceChildren();

  if (types.length > 1) {
    groups.push(
      buildFilterGroup(
        ui.typeLabel,
        ui.all,
        types.map((value) => ({ value, label: TYPE_LABELS[value] })),
        (value) => {
          state.type = value;
          onChange();
        },
      ),
    );
  }

  if (fandoms.length > 0) {
    groups.push(
      buildFilterGroup(
        ui.fandomLabel,
        ui.all,
        fandoms.map((value) => ({ value, label: FANDOM_LABELS[value] })),
        (value) => {
          state.fandom = value;
          onChange();
        },
      ),
    );
  }

  root.append(...groups.map((group) => group.element));
  return groups;
}

/* ---------- Render ---------- */

/** Merender kartu + filter. Mengembalikan fungsi untuk mereset semua filter. */
function renderCatalog(
  elements: CatalogElements,
  lang: LangCode,
  ui: UiStrings,
): () => void {
  /* Render semua kartu sekali (filter hanya toggle atribut hidden) */
  const entries: Array<{ project: Project; card: HTMLElement }> = [];
  const statsLists = new Map<string, HTMLUListElement>();
  const fragment = document.createDocumentFragment();

  PROJECTS.forEach((project, index) => {
    const { card, stats } = buildCard(project, index, lang, ui);
    entries.push({ project, card });
    if (project.repo) statsLists.set(project.repo, stats);
    fragment.appendChild(card);
  });

  // Mengganti isi grid sekaligus menghapus skeleton.
  elements.grid.replaceChildren(fragment);

  const state: FilterState = { type: 'all', fandom: 'all' };

  const applyFilter = (): void => {
    let shown = 0;
    for (const { project, card } of entries) {
      const matchType = state.type === 'all' || project.type === state.type;
      const matchFandom = state.fandom === 'all' || project.fandom === state.fandom;
      const visible = matchType && matchFandom;
      card.hidden = !visible;
      if (visible) shown += 1;
    }
    if (elements.countText) elements.countText.textContent = ui.count(shown, entries.length);
    if (elements.emptyState) elements.emptyState.hidden = shown > 0;
  };

  const filterGroups = elements.filtersRoot
    ? buildFilters(elements.filtersRoot, state, ui, applyFilter)
    : [];

  applyFilter();
  loadRepoStats(statsLists, lang, ui);
  document.dispatchEvent(new CustomEvent(CATALOG_RENDERED_EVENT));

  return (): void => {
    state.type = 'all';
    state.fandom = 'all';
    filterGroups.forEach((group) => group.reset());
    applyFilter();
  };
}

/* ---------- Teks state UI ---------- */

function setStateCopy(block: HTMLElement | null, title: string, text: string): void {
  if (!block) return;

  const titleNode = block.querySelector<HTMLElement>('.projects__state-title');
  const textNode = block.querySelector<HTMLElement>('.projects__state-text');

  if (titleNode) titleNode.textContent = title;
  if (textNode) textNode.textContent = text;
}

function queryElements(): CatalogElements | null {
  const grid = document.querySelector<HTMLElement>('#project-grid');
  if (!grid) return null;

  return {
    grid,
    filtersRoot: document.querySelector<HTMLElement>('#project-filters'),
    countText: document.querySelector<HTMLElement>('#project-count'),
    emptyState: document.querySelector<HTMLElement>('#project-empty'),
    errorState: document.querySelector<HTMLElement>('#project-error'),
    resetButton: document.querySelector<HTMLElement>('#project-reset'),
    retryButton: document.querySelector<HTMLElement>('#project-retry'),
  };
}

/** Fokus tidak boleh hilang saat tombol yang sedang fokus ikut tersembunyi. */
function focusFirstFilter(root: HTMLElement | null): void {
  root?.querySelector<HTMLButtonElement>('.filter-chip')?.focus();
}

/* ---------- Entry point ---------- */

export function initProjects(): void {
  const elements = queryElements();
  if (!elements) return;

  const lang = getLang();
  const ui = getStrings(lang);

  setStateCopy(elements.emptyState, ui.emptyTitle, ui.emptyText);
  setStateCopy(elements.errorState, ui.errorTitle, ui.errorText);
  if (elements.resetButton) elements.resetButton.textContent = ui.resetFilters;
  if (elements.retryButton) elements.retryButton.textContent = ui.retry;

  let resetFilters: () => void = (): void => undefined;

  const showError = (): void => {
    elements.grid.replaceChildren();
    if (elements.filtersRoot) elements.filtersRoot.replaceChildren();
    if (elements.countText) elements.countText.textContent = '';
    if (elements.emptyState) elements.emptyState.hidden = true;
    if (elements.errorState) elements.errorState.hidden = false;
  };

  const render = (): void => {
    try {
      resetFilters = renderCatalog(elements, lang, ui);
      if (elements.errorState) elements.errorState.hidden = true;
    } catch (error: unknown) {
      console.error('[projects] gagal merender karya:', error);
      showError();
    } finally {
      elements.grid.setAttribute('aria-busy', 'false');
    }
  };

  elements.resetButton?.addEventListener('click', () => {
    resetFilters();
    focusFirstFilter(elements.filtersRoot);
  });

  elements.retryButton?.addEventListener('click', () => {
    render();
    focusFirstFilter(elements.filtersRoot);
  });

  render();
}