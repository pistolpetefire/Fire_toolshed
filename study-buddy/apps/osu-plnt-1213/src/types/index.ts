/** Shared domain types for OSU PLNT 1213 Agronomy Hub */

/** Course chapters map 1:1 onto units. */
export type UnitId =
  | 'unit-1'
  | 'unit-2'
  | 'unit-3'
  | 'unit-4'
  | 'unit-5'
  | 'unit-6'
  | 'unit-7'
  | 'unit-8'
  | 'unit-9'
  | 'unit-10'
  | 'unit-11'
  | 'unit-12'
  | 'unit-13'
  | 'unit-14'
  | 'unit-15'
  | 'unit-16';

export const UNIT_IDS: UnitId[] = [
  'unit-1',
  'unit-2',
  'unit-3',
  'unit-4',
  'unit-5',
  'unit-6',
  'unit-7',
  'unit-8',
  'unit-9',
  'unit-10',
  'unit-11',
  'unit-12',
  'unit-13',
  'unit-14',
  'unit-15',
  'unit-16',
];

export function isUnitId(v: string | null | undefined): v is UnitId {
  return !!v && (UNIT_IDS as readonly string[]).includes(v);
}

export type ExamBlockId = 1 | 2 | 3 | 4;

export type SRSRating = 'hard' | 'good' | 'easy';

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  unitId: UnitId;
  tags: string[];
  custom?: boolean;
}

export interface CardProgress {
  cardId: string;
  easeFactor: number;
  interval: number;
  repetitions: number;
  nextReview: string;
  lastRating?: SRSRating;
  lastReviewed?: string;
}

export type QuizType = 'multiple-choice' | 'matching' | 'exam-prep';

export interface MCQuestion {
  id: string;
  type: 'multiple-choice';
  unitId: UnitId;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  objective?: number;
  kind?: 'concept' | 'vocab' | 'application';
}

export interface MatchingPair {
  left: string;
  right: string;
}

export interface MatchingQuestion {
  id: string;
  type: 'matching';
  unitId: UnitId;
  prompt: string;
  pairs: MatchingPair[];
  explanation: string;
}

export type QuizQuestion = MCQuestion | MatchingQuestion;

export interface QuizMistake {
  questionId: string;
  prompt: string;
  userAnswer: string;
  correctAnswer: string;
  explanation: string;
  objective?: number;
}

export interface QuizAttempt {
  id: string;
  quizType: QuizType;
  unitId?: UnitId;
  examBlock?: ExamBlockId;
  score: number;
  total: number;
  percentage: number;
  date: string;
  mistakes: QuizMistake[];
}

export interface UnitProgress {
  unitId: UnitId;
  lessonViewed: boolean;
  practiceCorrect: number;
  practiceAnswered: number;
  quizScores: number[];
  reviewOpened: boolean;
  lastMistakes: QuizMistake[];
}

export interface StudyStreak {
  current: number;
  longest: number;
  lastStudyDate: string | null;
}

export interface UserProgress {
  streak: StudyStreak;
  units: Partial<Record<UnitId, UnitProgress>>;
  cardProgress: Record<string, CardProgress>;
  customCards: Flashcard[];
  quizHistory: QuizAttempt[];
  theme: 'light' | 'dark' | 'system';
  displayName: string;
  studyPlanChecks: Record<string, boolean>;
}

export const DEFAULT_PROGRESS: UserProgress = {
  streak: { current: 0, longest: 0, lastStudyDate: null },
  units: {},
  cardProgress: {},
  customCards: [],
  quizHistory: [],
  theme: 'system',
  displayName: 'Student',
  studyPlanChecks: {},
};
