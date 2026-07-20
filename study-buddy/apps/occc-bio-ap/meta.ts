/**
 * Class app metadata — imported by the Study Buddy hub catalog.
 * Copy this file pattern when adding a new class app under apps/.
 */
export const classAppMeta = {
  id: 'occc-bio-ap',
  slug: 'occc-bio-ap',
  title: 'Anatomy Hub',
  shortTitle: 'A&P I',
  courseCodes: ['BIO 1314', 'BIO 1414', 'A&P I'],
  school: 'Oklahoma City Community College',
  subject: 'Personal Anatomy & Physiology I',
  description:
    'Syllabus-aligned A&P I path for nursing prep: 16 units, sharper diagrams, flashcards, quizzes, and atlas. Goal — strong foundation toward nursing school / CRNA.',
  status: 'live' as const,
  /** Hub route mount point */
  path: '/classes/occc-bio-ap',
  color: 'sky',
  version: '1.3.0',
  tags: ['anatomy', 'physiology', 'OCCC', 'nursing', 'lab'],
};

export type ClassAppMeta = typeof classAppMeta;
