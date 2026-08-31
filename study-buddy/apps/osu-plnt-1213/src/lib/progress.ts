import type { ExamBlockId, UnitId, UserProgress, QuizAttempt, UnitProgress, QuizMistake } from '../types';
import { builtInFlashcards } from '../data/flashcards';
import { courseUnits } from '../data/courseUnits';
import { isDue } from './srs';
import { p } from '../basePath';

export function emptyUnitProgress(unitId: UnitId): UnitProgress {
  return {
    unitId,
    lessonViewed: false,
    practiceCorrect: 0,
    practiceAnswered: 0,
    quizScores: [],
    reviewOpened: false,
    lastMistakes: [],
  };
}

export function getUnitProgress(progress: UserProgress, unitId: UnitId): UnitProgress {
  return progress.units[unitId] ?? emptyUnitProgress(unitId);
}

export function markLessonViewed(progress: UserProgress, unitId: UnitId): UserProgress {
  const existing = getUnitProgress(progress, unitId);
  if (existing.lessonViewed) return recordStudyDay(progress);
  return recordStudyDay({
    ...progress,
    units: { ...progress.units, [unitId]: { ...existing, lessonViewed: true } },
  });
}

export function recordPracticeAnswer(
  progress: UserProgress,
  unitId: UnitId,
  correct: boolean
): UserProgress {
  const existing = getUnitProgress(progress, unitId);
  return recordStudyDay({
    ...progress,
    units: {
      ...progress.units,
      [unitId]: {
        ...existing,
        practiceAnswered: existing.practiceAnswered + 1,
        practiceCorrect: existing.practiceCorrect + (correct ? 1 : 0),
      },
    },
  });
}

export function markReviewOpened(progress: UserProgress, unitId: UnitId): UserProgress {
  const existing = getUnitProgress(progress, unitId);
  if (existing.reviewOpened) return recordStudyDay(progress);
  return recordStudyDay({
    ...progress,
    units: { ...progress.units, [unitId]: { ...existing, reviewOpened: true } },
  });
}

export function addUnitQuizResult(
  progress: UserProgress,
  unitId: UnitId,
  percentage: number,
  mistakes: QuizMistake[]
): UserProgress {
  const existing = getUnitProgress(progress, unitId);
  return {
    ...progress,
    units: {
      ...progress.units,
      [unitId]: {
        ...existing,
        quizScores: [...existing.quizScores, percentage].slice(-20),
        lastMistakes: mistakes,
      },
    },
  };
}

export function unitMastery(up: UnitProgress | undefined): number {
  if (!up) return 0;
  const lesson = up.lessonViewed ? 0.25 : 0;
  const practice = up.practiceAnswered > 0 ? 0.25 : 0;
  const best = up.quizScores.length ? Math.max(...up.quizScores) : 0;
  const quiz = best >= 70 ? 0.35 : best > 0 ? 0.35 * (best / 70) : 0;
  const review = up.reviewOpened ? 0.15 : 0;
  return Math.round((lesson + practice + quiz + review) * 100);
}

export function isUnitComplete(up: UnitProgress | undefined): boolean {
  if (!up) return false;
  const best = up.quizScores.length ? Math.max(...up.quizScores) : 0;
  return up.lessonViewed && best >= 70;
}

export function getRecommendedUnitId(progress: UserProgress): UnitId {
  const next = courseUnits.find((u) => u.ready && !isUnitComplete(progress.units[u.id]));
  return next?.id ?? 'unit-1';
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

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

export function addQuizAttempt(progress: UserProgress, attempt: QuizAttempt): UserProgress {
  let next = recordStudyDay({
    ...progress,
    quizHistory: [attempt, ...progress.quizHistory].slice(0, 50),
  });
  if (attempt.unitId) {
    next = addUnitQuizResult(next, attempt.unitId, attempt.percentage, attempt.mistakes);
  }
  return next;
}

export function computeOverallProgress(progress: UserProgress): number {
  const ready = courseUnits.filter((u) => u.ready);
  if (!ready.length) return 0;
  const unitScore = ready.reduce((n, u) => n + unitMastery(progress.units[u.id]), 0) / (ready.length * 100);

  const exam1Cards = builtInFlashcards.filter((c) => {
    const unit = courseUnits.find((u) => u.id === c.unitId);
    return unit?.examBlock === 1;
  });
  const allCards = [...exam1Cards, ...progress.customCards];
  const reviewed = allCards.filter((c) => progress.cardProgress[c.id]?.repetitions).length;
  const cardScore = allCards.length ? reviewed / allCards.length : 0;
  const quizScore = progress.quizHistory.length > 0 ? Math.min(1, progress.quizHistory.length / 8) : 0;

  return Math.round((unitScore * 0.6 + cardScore * 0.25 + quizScore * 0.15) * 100);
}

export interface WeakArea {
  unitId?: UnitId;
  href: string;
  name: string;
  reason: string;
  score: number;
}

export function getWeakAreas(progress: UserProgress): WeakArea[] {
  const areas: WeakArea[] = [];
  let flaggedUnstarted = false;
  for (const unit of courseUnits.filter((u) => u.ready)) {
    const up = progress.units[unit.id];
    const best = up?.quizScores.length ? Math.max(...up.quizScores) : null;
    if (!up?.lessonViewed) {
      if (!flaggedUnstarted) {
        areas.push({
          unitId: unit.id,
          href: p(`/units/${unit.id}`),
          name: `Ch ${unit.number}: ${unit.shortTitle}`,
          reason: 'Next chapter — tutorial not opened yet',
          score: 0,
        });
        flaggedUnstarted = true;
      }
    } else if (best !== null && best < 70) {
      areas.push({
        unitId: unit.id,
        href: p(`/units/${unit.id}?mode=review`),
        name: `Ch ${unit.number}: ${unit.shortTitle}`,
        reason: `Best chapter quiz ${Math.round(best)}%`,
        score: best,
      });
    } else if (up.lastMistakes.length > 0 && (best ?? 100) < 90) {
      areas.push({
        unitId: unit.id,
        href: p(`/units/${unit.id}?mode=review`),
        name: `Ch ${unit.number}: ${unit.shortTitle}`,
        reason: `${up.lastMistakes.length} missed item${up.lastMistakes.length === 1 ? '' : 's'} to review`,
        score: best ?? 50,
      });
    }
  }
  return areas.sort((a, b) => a.score - b.score).slice(0, 5);
}

export function getDueCardCount(progress: UserProgress): number {
  const all = [...builtInFlashcards, ...progress.customCards];
  return all.filter((c) => isDue(progress.cardProgress[c.id])).length;
}

export function examBlockProgress(progress: UserProgress, block: ExamBlockId): number {
  const units = courseUnits.filter((u) => u.examBlock === block && u.ready);
  if (!units.length) return 0;
  return Math.round(units.reduce((n, u) => n + unitMastery(progress.units[u.id]), 0) / units.length);
}
