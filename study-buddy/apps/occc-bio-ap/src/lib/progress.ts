import type { SystemId, UserProgress, QuizAttempt } from '../types';
import { bodySystems } from '../data/systems';
import { builtInFlashcards } from '../data/flashcards';
import { isDue } from './srs';

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Record a study activity and update streak (once per calendar day). */
export function recordStudyDay(progress: UserProgress): UserProgress {
  const today = todayISO();
  const { streak } = progress;
  if (streak.lastStudyDate === today) return progress;

  let current = 1;
  if (streak.lastStudyDate) {
    const last = new Date(streak.lastStudyDate + 'T12:00:00');
    const now = new Date(today + 'T12:00:00');
    const diffDays = Math.round((now.getTime() - last.getTime()) / 86400000);
    current = diffDays === 1 ? streak.current + 1 : 1;
  }

  return {
    ...progress,
    streak: {
      current,
      longest: Math.max(streak.longest, current),
      lastStudyDate: today,
    },
  };
}

export function markSystemStudied(progress: UserProgress, systemId: SystemId): UserProgress {
  const existing = progress.systems[systemId] ?? {
    systemId,
    studied: false,
    quizScores: [],
    structuresViewed: [],
    flashcardsMastered: 0,
  };
  return recordStudyDay({
    ...progress,
    systems: {
      ...progress.systems,
      [systemId]: { ...existing, studied: true },
    },
  });
}

export function markStructureViewed(
  progress: UserProgress,
  systemId: SystemId,
  structureId: string
): UserProgress {
  const existing = progress.systems[systemId] ?? {
    systemId,
    studied: false,
    quizScores: [],
    structuresViewed: [],
    flashcardsMastered: 0,
  };
  if (existing.structuresViewed.includes(structureId)) {
    return recordStudyDay(progress);
  }
  return recordStudyDay({
    ...progress,
    systems: {
      ...progress.systems,
      [systemId]: {
        ...existing,
        studied: true,
        structuresViewed: [...existing.structuresViewed, structureId],
      },
    },
  });
}

export function addQuizAttempt(progress: UserProgress, attempt: QuizAttempt): UserProgress {
  const systemId = attempt.systemId === 'mixed' ? null : attempt.systemId;
  let next = recordStudyDay({
    ...progress,
    quizHistory: [attempt, ...progress.quizHistory].slice(0, 50),
  });
  if (systemId) {
    const existing = next.systems[systemId] ?? {
      systemId,
      studied: false,
      quizScores: [],
      structuresViewed: [],
      flashcardsMastered: 0,
    };
    next = {
      ...next,
      systems: {
        ...next.systems,
        [systemId]: {
          ...existing,
          studied: true,
          quizScores: [...existing.quizScores, attempt.percentage].slice(-20),
        },
      },
    };
  }
  return next;
}

/** Overall progress 0–100 based on systems studied, structures viewed, cards reviewed, quizzes taken. */
export function computeOverallProgress(progress: UserProgress): number {
  const systemWeight = 0.35;
  const structureWeight = 0.25;
  const cardWeight = 0.25;
  const quizWeight = 0.15;

  const systemsStudied = bodySystems.filter((s) => progress.systems[s.id]?.studied).length;
  const systemScore = systemsStudied / bodySystems.length;

  const totalKeyStructures = bodySystems.reduce((n, s) => n + s.keyStructures.length, 0);
  const viewed = bodySystems.reduce(
    (n, s) => n + (progress.systems[s.id]?.structuresViewed.length ?? 0),
    0
  );
  const structureScore = totalKeyStructures ? Math.min(1, viewed / totalKeyStructures) : 0;

  const allCards = [...builtInFlashcards, ...progress.customCards];
  const reviewed = allCards.filter((c) => progress.cardProgress[c.id]?.repetitions).length;
  const cardScore = allCards.length ? reviewed / allCards.length : 0;

  const quizScore = progress.quizHistory.length > 0 ? Math.min(1, progress.quizHistory.length / 10) : 0;

  return Math.round(
    (systemScore * systemWeight +
      structureScore * structureWeight +
      cardScore * cardWeight +
      quizScore * quizWeight) *
      100
  );
}

export interface WeakArea {
  systemId: SystemId;
  name: string;
  reason: string;
  score: number; // lower = weaker
}

export function getWeakAreas(progress: UserProgress): WeakArea[] {
  const areas: WeakArea[] = [];

  for (const sys of bodySystems) {
    const sp = progress.systems[sys.id];
    const quizAvg =
      sp?.quizScores && sp.quizScores.length
        ? sp.quizScores.reduce((a, b) => a + b, 0) / sp.quizScores.length
        : null;

    if (!sp?.studied) {
      areas.push({ systemId: sys.id, name: sys.name, reason: 'Not started yet', score: 0 });
    } else if (quizAvg !== null && quizAvg < 70) {
      areas.push({
        systemId: sys.id,
        name: sys.name,
        reason: `Quiz average ${Math.round(quizAvg)}%`,
        score: quizAvg,
      });
    } else if ((sp.structuresViewed.length / Math.max(1, sys.keyStructures.length)) < 0.3) {
      areas.push({
        systemId: sys.id,
        name: sys.name,
        reason: 'Few structures reviewed',
        score: 40,
      });
    }
  }

  return areas.sort((a, b) => a.score - b.score).slice(0, 5);
}

export function getDueCardCount(progress: UserProgress): number {
  const all = [...builtInFlashcards, ...progress.customCards];
  return all.filter((c) => isDue(progress.cardProgress[c.id])).length;
}
