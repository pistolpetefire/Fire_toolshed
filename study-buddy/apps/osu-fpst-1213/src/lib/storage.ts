import type { UserProgress } from '../types';
import { DEFAULT_PROGRESS } from '../types';

const STORAGE_KEY = 'study-buddy:osu-fpst-1213:progress-v1';

export function normalizeProgress(parsed: Partial<UserProgress>): UserProgress {
  return {
    ...structuredClone(DEFAULT_PROGRESS),
    ...parsed,
    streak: { ...DEFAULT_PROGRESS.streak, ...parsed.streak },
    units: { ...(parsed.units ?? {}) },
    cardProgress: { ...(parsed.cardProgress ?? {}) },
    customCards: Array.isArray(parsed.customCards) ? parsed.customCards : [],
    quizHistory: Array.isArray(parsed.quizHistory) ? parsed.quizHistory : [],
    studyPlanChecks:
      parsed.studyPlanChecks && typeof parsed.studyPlanChecks === 'object' ? parsed.studyPlanChecks : {},
    theme:
      parsed.theme === 'light' || parsed.theme === 'dark' || parsed.theme === 'system'
        ? parsed.theme
        : 'system',
    displayName:
      typeof parsed.displayName === 'string' && parsed.displayName.trim()
        ? parsed.displayName.trim()
        : 'Student',
  };
}

export function loadProgress(): UserProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
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

export function parseProgressImport(raw: string): ImportResult {
  try {
    const data = JSON.parse(raw) as unknown;
    if (!data || typeof data !== 'object') {
      return { ok: false, error: 'Backup must be a JSON object.' };
    }
    const obj = data as Record<string, unknown>;
    const candidate = (obj.progress && typeof obj.progress === 'object'
      ? obj.progress
      : obj) as Partial<UserProgress>;

    const looksValid =
      'streak' in candidate ||
      'cardProgress' in candidate ||
      'quizHistory' in candidate ||
      'customCards' in candidate ||
      'displayName' in candidate ||
      'units' in candidate;

    if (!looksValid) {
      return {
        ok: false,
        error: 'File does not look like a FPST 1213 Fire Protection Hub backup.',
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
      app: 'study-buddy/osu-fpst-1213',
      version: 1,
      exportedAt: new Date().toISOString(),
      progress,
    },
    null,
    2
  );
}

export type ImportMode = 'replace' | 'merge';

export function mergeProgress(local: UserProgress, incoming: UserProgress): UserProgress {
  const cardProgress: UserProgress['cardProgress'] = { ...local.cardProgress };
  for (const [id, remote] of Object.entries(incoming.cardProgress)) {
    const cur = cardProgress[id];
    if (!cur) {
      cardProgress[id] = remote;
      continue;
    }
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

  const units: UserProgress['units'] = { ...local.units };
  for (const [uid, remote] of Object.entries(incoming.units ?? {})) {
    if (!remote) continue;
    const key = uid as keyof typeof units;
    const cur = units[key];
    if (!cur) {
      units[key] = remote;
      continue;
    }
    units[key] = {
      ...cur,
      lessonViewed: cur.lessonViewed || remote.lessonViewed,
      reviewOpened: cur.reviewOpened || remote.reviewOpened,
      practiceAnswered: Math.max(cur.practiceAnswered, remote.practiceAnswered),
      practiceCorrect: Math.max(cur.practiceCorrect, remote.practiceCorrect),
      quizScores: [...cur.quizScores, ...remote.quizScores].slice(-20),
      lastMistakes: remote.lastMistakes?.length ? remote.lastMistakes : cur.lastMistakes,
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
    units,
    cardProgress,
    customCards: [...customById.values()],
    quizHistory,
    theme: incoming.theme || local.theme,
    displayName:
      incoming.displayName && incoming.displayName !== 'Student'
        ? incoming.displayName
        : local.displayName,
    studyPlanChecks: { ...local.studyPlanChecks, ...incoming.studyPlanChecks },
  };
}
