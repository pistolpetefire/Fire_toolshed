import type { CardProgress, SRSRating } from '../types';

/** Simplified SM-2 style spaced repetition */

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function addDays(isoDate: string, days: number): string {
  const d = new Date(isoDate + 'T12:00:00');
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export function createDefaultCardProgress(cardId: string): CardProgress {
  return {
    cardId,
    easeFactor: 2.5,
    interval: 0,
    repetitions: 0,
    nextReview: todayISO(),
  };
}

export function isDue(progress: CardProgress | undefined, now = todayISO()): boolean {
  if (!progress) return true; // never studied → due
  return progress.nextReview <= now;
}

/**
 * Apply Hard / Good / Easy rating and return updated progress.
 * Hard: short interval, slight ease decrease
 * Good: standard SM-2 step
 * Easy: longer interval, ease increase
 */
export function reviewCard(
  prev: CardProgress | undefined,
  cardId: string,
  rating: SRSRating
): CardProgress {
  const base = prev ?? createDefaultCardProgress(cardId);
  let { easeFactor, interval, repetitions } = base;
  const now = todayISO();

  if (rating === 'hard') {
    easeFactor = Math.max(1.3, easeFactor - 0.15);
    repetitions = Math.max(0, repetitions - 1);
    interval = repetitions === 0 ? 0 : Math.max(1, Math.round(interval * 0.5));
    // Hard: due again same day or tomorrow
    if (interval === 0) {
      return {
        ...base,
        easeFactor,
        interval: 0,
        repetitions: 0,
        nextReview: now,
        lastRating: rating,
        lastReviewed: now,
      };
    }
  } else if (rating === 'good') {
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 3;
    } else {
      interval = Math.max(1, Math.round(interval * easeFactor));
    }
    repetitions += 1;
  } else if (rating === 'easy') {
    easeFactor = Math.min(3.0, easeFactor + 0.15);
    if (repetitions === 0) {
      interval = 2;
    } else if (repetitions === 1) {
      interval = 5;
    } else {
      interval = Math.max(2, Math.round(interval * easeFactor * 1.3));
    }
    repetitions += 1;
  }

  return {
    cardId,
    easeFactor,
    interval,
    repetitions,
    nextReview: addDays(now, interval),
    lastRating: rating,
    lastReviewed: now,
  };
}

export function countDue(
  cardIds: string[],
  progressMap: Record<string, CardProgress>
): number {
  return cardIds.filter((id) => isDue(progressMap[id])).length;
}
