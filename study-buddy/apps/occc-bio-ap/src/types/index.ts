/** Shared domain types for OCCC Anatomy Hub */

export type SystemId =
  | 'skeletal'
  | 'muscular'
  | 'nervous'
  | 'cardiovascular'
  | 'respiratory'
  | 'digestive'
  | 'endocrine'
  | 'urinary'
  | 'integumentary'
  | 'lymphatic'
  | 'reproductive';

/** Topics for flashcards — body systems plus early A&P I units without a system page */
export type FlashcardTopicId =
  | SystemId
  | 'foundations'
  | 'chemistry'
  | 'cells'
  | 'tissues'
  | 'blood';

export interface BodySystem {
  id: SystemId;
  name: string;
  shortName: string;
  description: string;
  overview: string;
  courseRelevance: string; // BIO 1314 / BIO 1414 notes
  color: string;
  icon: string;
  keyStructures: string[]; // structure ids
  studyTips: string[];
}

export interface Structure {
  id: string;
  name: string;
  systemId: SystemId;
  category: string;
  function: string;
  relations: string[];
  clinicalNote?: string;
  aliases?: string[];
  /** Optional SVG path id for interactive diagrams */
  diagramId?: string;
}

export type SRSRating = 'hard' | 'good' | 'easy';

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  /** Body system or foundation unit topic */
  systemId: FlashcardTopicId;
  tags: string[];
  /** true when created by the user */
  custom?: boolean;
}

/** Spaced-repetition state per card (SM-2 inspired, simplified) */
export interface CardProgress {
  cardId: string;
  easeFactor: number;
  interval: number; // days
  repetitions: number;
  nextReview: string; // ISO date
  lastRating?: SRSRating;
  lastReviewed?: string;
}

export type QuizType = 'multiple-choice' | 'diagram-labeling' | 'matching';

export interface MCQuestion {
  id: string;
  type: 'multiple-choice';
  systemId: SystemId;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

/**
 * Diagram labeling interaction modes:
 * - select-name: highlight structure on diagram; pick correct name from options
 * - click-region: show structure name; student clicks the matching region on the diagram
 */
export type LabelingMode = 'select-name' | 'click-region';

export interface LabelingQuestion {
  id: string;
  type: 'diagram-labeling';
  systemId: SystemId;
  prompt: string;
  /** structure / diagram region id */
  structureId: string;
  structureName: string;
  distractors: string[];
  explanation: string;
  /** Defaults to select-name when omitted */
  interactionMode?: LabelingMode;
}

export interface MatchingPair {
  left: string;
  right: string;
}

export interface MatchingQuestion {
  id: string;
  type: 'matching';
  systemId: SystemId;
  prompt: string;
  pairs: MatchingPair[];
  explanation: string;
}

export type QuizQuestion = MCQuestion | LabelingQuestion | MatchingQuestion;

export interface QuizAttempt {
  id: string;
  quizType: QuizType;
  systemId: SystemId | 'mixed';
  score: number;
  total: number;
  percentage: number;
  date: string;
  mistakes: {
    questionId: string;
    prompt: string;
    userAnswer: string;
    correctAnswer: string;
    explanation: string;
  }[];
}

export interface StudyStreak {
  current: number;
  longest: number;
  lastStudyDate: string | null; // YYYY-MM-DD
}

export interface SystemProgress {
  systemId: SystemId;
  studied: boolean;
  quizScores: number[];
  structuresViewed: string[];
  flashcardsMastered: number;
}

export interface UserProgress {
  streak: StudyStreak;
  systems: Partial<Record<SystemId, SystemProgress>>;
  cardProgress: Record<string, CardProgress>;
  customCards: Flashcard[];
  quizHistory: QuizAttempt[];
  theme: 'light' | 'dark' | 'system';
  displayName: string;
}

export const DEFAULT_PROGRESS: UserProgress = {
  streak: { current: 0, longest: 0, lastStudyDate: null },
  systems: {},
  cardProgress: {},
  customCards: [],
  quizHistory: [],
  theme: 'system',
  displayName: 'Student',
};
