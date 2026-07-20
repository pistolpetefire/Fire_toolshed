import type { UserProgress } from '../types';
import { DEFAULT_PROGRESS } from '../types';

/** Namespaced per class app so Study Buddy apps never clash */
const STORAGE_KEY = 'study-buddy:occc-bio-ap:progress-v1';
/** Older keys (migrated once on load) */
const LEGACY_STORAGE_KEYS = [
  'study-budd:occc-bio-ap:progress-v1',
  'occc-anatomy-hub-progress-v1',
];

export function normalizeProgress(parsed: Partial<UserProgress>): UserProgress {
  return {
    ...structuredClone(DEFAULT_PROGRESS),
    ...parsed,
    streak: { ...DEFAULT_PROGRESS.streak, ...parsed.streak },
    systems: { ...(parsed.systems ?? {}) },
    cardProgress: { ...(parsed.cardProgress ?? {}) },
    customCards: Array.isArray(parsed.customCards) ? parsed.customCards : [],
    quizHistory: Array.isArray(parsed.quizHistory) ? parsed.quizHistory : [],
    theme: parsed.theme === 'light' || parsed.theme === 'dark' || parsed.theme === 'system' ? parsed.theme : 'system',
    displayName: typeof parsed.displayName === 'string' && parsed.displayName.trim()
      ? parsed.displayName.trim()
      : 'Student',
  };
}

export function loadProgress(): UserProgress {
  try {
    let raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      for (const key of LEGACY_STORAGE_KEYS) {
        const legacy = localStorage.getItem(key);
        if (legacy) {
          localStorage.setItem(STORAGE_KEY, legacy);
          raw = legacy;
          break;
        }
      }
    }
    if (!raw) return structuredClone(DEFAULT_PROGRESS);
    const parsed = JSON.parse(raw) as Partial<UserProgress>;
    return normalizeProgress(parsed);
  } catch {
    return structuredClone(DEFAULT_PROGRESS);
  }
}

export function saveProgress(progress: UserProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (e) {
    console.error('Failed to save progress', e);
  }
}

export function clearProgress(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export type ImportResult =
  | { ok: true; progress: UserProgress }
  | { ok: false; error: string };

/**
 * Validate and parse a JSON backup exported from Settings.
 * Accepts either a raw UserProgress object or `{ progress: UserProgress }`.
 */
export function parseProgressImport(raw: string): ImportResult {
  try {
    const data = JSON.parse(raw) as unknown;
    if (!data || typeof data !== 'object') {
      return { ok: false, error: 'Backup must be a JSON object.' };
    }
    const obj = data as Record<string, unknown>;
    // Support wrapped export format
    const candidate = (obj.progress && typeof obj.progress === 'object'
      ? obj.progress
      : obj) as Partial<UserProgress>;

    // Sanity: at least one known field
    const looksValid =
      'streak' in candidate ||
      'cardProgress' in candidate ||
      'quizHistory' in candidate ||
      'customCards' in candidate ||
      'displayName' in candidate ||
      'systems' in candidate;

    if (!looksValid) {
      return {
        ok: false,
        error: 'File does not look like an OCCC Anatomy Hub backup (missing progress fields).',
      };
    }

    return { ok: true, progress: normalizeProgress(candidate) };
  } catch {
    return { ok: false, error: 'Invalid JSON — could not parse the file.' };
  }
}

export function exportProgressPayload(progress: UserProgress): string {
  return JSON.stringify(
    {
      app: 'study-buddy/occc-bio-ap',
      version: 1,
      exportedAt: new Date().toISOString(),
      progress,
    },
    null,
    2
  );
}

export type ImportMode = 'replace' | 'merge';

/**
 * Merge imported progress into existing local progress.
 * - Card progress: keeps the higher-repetition / later nextReview state
 * - Custom cards: union by id
 * - Quiz history: union by id, newest first, capped at 50
 * - Systems: merge viewed structures and scores
 * - Streak: keeps the longer current/longest
 * - Theme / name: prefers imported values when present
 */
export function mergeProgress(local: UserProgress, incoming: UserProgress): UserProgress {
  const cardProgress: UserProgress['cardProgress'] = { ...local.cardProgress };
  for (const [id, remote] of Object.entries(incoming.cardProgress)) {
    const cur = cardProgress[id];
    if (!cur) {
      cardProgress[id] = remote;
      continue;
    }
    // Prefer the more advanced review state
    const remoteScore = remote.repetitions * 1000 + (remote.easeFactor || 0);
    const localScore = cur.repetitions * 1000 + (cur.easeFactor || 0);
    cardProgress[id] = remoteScore >= localScore ? remote : cur;
  }

  const customById = new Map<string, (typeof local.customCards)[0]>();
  for (const c of local.customCards) customById.set(c.id, c);
  for (const c of incoming.customCards) customById.set(c.id, c);

  const quizById = new Map<string, (typeof local.quizHistory)[0]>();
  for (const q of [...incoming.quizHistory, ...local.quizHistory]) {
    if (!quizById.has(q.id)) quizById.set(q.id, q);
  }
  const quizHistory = [...quizById.values()]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 50);

  const systems: UserProgress['systems'] = { ...local.systems };
  for (const [sid, remote] of Object.entries(incoming.systems)) {
    if (!remote) continue;
    const key = sid as keyof typeof systems;
    const cur = systems[key];
    if (!cur) {
      systems[key] = remote;
      continue;
    }
    systems[key] = {
      ...cur,
      studied: cur.studied || remote.studied,
      quizScores: [...cur.quizScores, ...remote.quizScores].slice(-20),
      structuresViewed: [...new Set([...cur.structuresViewed, ...remote.structuresViewed])],
      flashcardsMastered: Math.max(cur.flashcardsMastered, remote.flashcardsMastered),
    };
  }

  return {
    streak: {
      current: Math.max(local.streak.current, incoming.streak.current),
      longest: Math.max(local.streak.longest, incoming.streak.longest),
      lastStudyDate:
        (local.streak.lastStudyDate || '') >= (incoming.streak.lastStudyDate || '')
          ? local.streak.lastStudyDate
          : incoming.streak.lastStudyDate,
    },
    systems,
    cardProgress,
    customCards: [...customById.values()],
    quizHistory,
    theme: incoming.theme || local.theme,
    displayName:
      incoming.displayName && incoming.displayName !== 'Student'
        ? incoming.displayName
        : local.displayName,
  };
}
