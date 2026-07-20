/**
 * Class app metadata — imported by the Study Buddy hub catalog.
 * Copy this file pattern when adding a new class app under apps/.
 */
export const classAppMeta = {
  id: 'occc-bio-ap',
  slug: 'occc-bio-ap',
  title: 'Anatomy Hub',
  shortTitle: 'A&P',
  courseCodes: ['BIO 1314', 'BIO 1414'],
  school: 'Oklahoma City Community College',
  subject: 'Human Anatomy & Physiology',
  description:
    'Interactive diagrams, spaced-repetition flashcards, quizzes, and a searchable atlas for college A&P.',
  status: 'live' as const,
  /** Hub route mount point */
  path: '/classes/occc-bio-ap',
  color: 'sky',
  version: '1.2.0',
  tags: ['anatomy', 'physiology', 'OCCC', 'lab'],
};

export type ClassAppMeta = typeof classAppMeta;
